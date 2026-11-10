import {Tower,FLOORS,COLS,roomX,roomY} from "./world.js";
import {STORIES,AMBIENT_EVENTS,FIRST_LINES} from "./stories.js";

// PANE's core loop: position -> clean -> witness -> choose -> record -> move.
// The people do not wait for narrative beats: their utility-based daily lives continue.
const $=id=>document.getElementById(id);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const load=()=>{try{return JSON.parse(localStorage.getItem("pane-save-v1")||"{}")}catch{return{}}};
const initial=load();
const progress=initial.progress||{};
const seen=new Set(initial.seen||[]);
let discovered=0,night=true,started=false,focused=null,cleaning=false,lastUV=null,hovered=null;
let lastMove=0,lastFrame=performance.now(),gameClock=23*60+47,ambientAt=0,ambientTimer=0,toastTimer=0,saveTimer=0,audio=null;
const stage=$("stage");
const tower=new Tower(stage,()=>{});
const save=()=>{try{localStorage.setItem("pane-save-v1",JSON.stringify({progress,seen:[...seen],clean:Object.fromEntries(tower.rooms.filter(r=>r.clean>.015).map(r=>[r.key,r.clean]))}))}catch{}};
for(const [key,value] of Object.entries(initial.clean||{})){
  const r=tower.roomMap.get(key);if(!r)continue;
  // Reconstruct clear glass with a repeatable diagonal squeegee pattern after reloading.
  const steps=Math.ceil(clamp(Number(value))*13);
  const ctx=r.grimeCtx;ctx.save();ctx.globalCompositeOperation="destination-out";ctx.lineWidth=60;ctx.lineCap="round";ctx.strokeStyle="#000";
  for(let i=0;i<steps;i++){let x=(i+.5)/13*r.grimeCanvas.width;ctx.beginPath();ctx.moveTo(x,-20);ctx.lineTo(x+18,r.grimeCanvas.height+20);ctx.stroke()}
  ctx.restore();r.clean=clamp(Number(value));r.grimeTexture.needsUpdate=true;
}
function toast(message,ms=3500){$("toast").textContent=message;$("toast").classList.remove("hidden");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.add("hidden"),ms)}
function say(message){$("ambient-text").textContent=message}
function cases(){return Object.keys(progress).filter(id=>Object.keys(progress[id].observed||{}).length).length}
function clues(){return Object.values(progress).reduce((n,p)=>n+(p.clues?.length||0),0)}
function cleans(){return tower.rooms.filter(r=>r.clean>=.53).length}
function updateCounters(){
  const n=cases();$("journal-count").textContent=n;$("cases-counter").textContent=n+" CASE"+(n===1?"":"S")+" DISCOVERED";
  $("journal-cases").textContent=n;$("journal-clues").textContent=clues();$("journal-windows").textContent=cleans();
}
function updatePosition(){
  $("floor-number").textContent=tower.floor;
  if(!focused)say(FIRST_LINES[(tower.floor*5+tower.col)%FIRST_LINES.length]);
}
function getState(story){
 if(!progress[story.id])progress[story.id]={beat:0,observed:{},clues:[],finished:false,awaiting:false,currentText:"",choices:[]};
 return progress[story.id];
}
function setFocus(room){
 focused=room;tower.focus(room);
 $("focus-card").classList.remove("hidden");
 $("room-number").textContent="UNIT "+room.number+" / FLOOR "+room.floor;
 $("room-title").textContent=room.title;
 $("room-description").textContent=room.description;
 $("story-content").classList.add("hidden");
 $("story-choices").replaceChildren();
 $("observe-btn").textContent="LOOK CLOSER ↗";
 $("observe-btn").disabled=room.clean<.23;
 const st=room.story?progress[room.story.id]:null;
 if(st?.currentText){
   const lastBeat=st.awaiting?Math.max(0,st.beat-1):Math.min(st.beat,room.story.beats.length-1);
   tower.stageBeat(room,lastBeat);
   $("story-content").classList.remove("hidden");$("story-genre").textContent=room.story.genre;$("story-line").textContent=st.currentText;
   if(st.awaiting){$("observe-btn").disabled=!!st.finished;$("observe-btn").textContent=st.finished?"THREAD COMPLETE":"FOLLOW THE THREAD ↗"}
   else if(st.finished){$("observe-btn").disabled=true;$("observe-btn").textContent="THREAD COMPLETE"}}
 updateRoomDetails();
 say("Unit "+room.number+". "+(room.story?"You sense the beginning of a story.":"An ordinary life, glimpsed from outside."));
}
function closeFocus(){if(!focused)return;focused=null;tower.defocus();$("focus-card").classList.add("hidden");say(FIRST_LINES[(tower.floor*5+tower.col)%FIRST_LINES.length]);updatePosition()}
function navigate(df,dc){
 if(Date.now()-lastMove<120)return;lastMove=Date.now();
 if(focused)closeFocus();
 let newFloor=tower.floor+df,newCol=tower.col+dc;
 if(newCol<0){newCol=COLS-1;newFloor--}if(newCol>=COLS){newCol=0;newFloor++}
 newFloor=clamp(newFloor,1,FLOORS);
 tower.move(newFloor,newCol);updatePosition();
}
function updateRoomDetails(){
 if(!focused)return;
 const people=focused.actors;
 $("room-mood").textContent=people.map(p=>p.getEmotion()).join(" / ");
 $("room-cleanliness").textContent="GLASS "+Math.round(focused.clean*100)+"% CLEAR";
 $("clean-progress").style.width=(focused.clean*100)+"%";
 const level=focused.clean;
 $("focus-instruction").textContent=level<.23?"Drag over the glass to reveal what is hidden.":level<.55?"A clearer view. You can look closer, or keep working.":"The pane is clear. You can almost feel the room.";
 const st=focused.story?progress[focused.story.id]:null;
 if(!st||!st.finished)$("observe-btn").disabled=level<.23;
}
function noteCurrent(room,beat){
 const st=getState(room.story);
 if(!st.observed[st.beat]){st.observed[st.beat]=true;if(!st.clues.includes(beat.clue))st.clues.push(beat.clue);
  toast("CASEBOOK UPDATED — "+room.story.title);updateCounters();save();}
}
function showBeat(){
 if(!focused)return;
 const r=focused;
 if(r.clean<.23){toast("Clean the glass first. Some things only appear when you can see clearly.");return}
 if(!r.story){
   const agent=r.actors[Math.floor(Math.random()*r.actors.length)];
   if(Math.random()<.32)agent.react(["window","wave","wonder","fear","phone"][Math.floor(Math.random()*5)],{curiosity:.05});
   $("story-content").classList.remove("hidden");$("story-genre").textContent="A LIFE IN PASSING";
   $("story-line").textContent=AMBIENT_EVENTS[Math.floor(Math.random()*AMBIENT_EVENTS.length)];
   $("story-choices").replaceChildren();$("observe-btn").disabled=false;
   say("Perhaps every ordinary moment is extraordinary to someone.");return;
 }
 const st=getState(r.story);
 if(st.finished){$("story-genre").textContent=r.story.genre;$("story-content").classList.remove("hidden");$("story-line").textContent=st.currentText||"This thread has ended, though the resident's life continues.";$("story-choices").replaceChildren();$("observe-btn").disabled=true;return}
 st.awaiting=false;
 const beat=r.story.beats[Math.min(st.beat,r.story.beats.length-1)];
 noteCurrent(r,beat);
 tower.stageBeat(r,st.beat);
 st.currentText=beat.text;
 $("story-content").classList.remove("hidden");
 $("story-genre").textContent=r.story.genre+" / FRAGMENT "+(st.beat+1).toString().padStart(2,"0");
 $("story-line").textContent=beat.text;
 const target=$("story-choices");target.replaceChildren();
 for(const [index,choice] of beat.choices.entries()){
   const b=document.createElement("button");b.className="story-choice";b.textContent=String(index+1).padStart(2,"0")+" / "+choice.label;
   b.addEventListener("click",()=>chooseBeat(r,index));target.appendChild(b);
 }
 $("observe-btn").disabled=true;$("observe-btn").textContent="CHOOSE WHAT TO DO";
 say("Something changes behind the glass. There is never enough time to know why.");
 save();updateCounters();
}
function chooseBeat(room,choiceIndex){
 if(!focused||room!==focused||!room.story)return;
 const st=getState(room.story);if(st.awaiting||st.finished)return;
 const beat=room.story.beats[Math.min(st.beat,room.story.beats.length-1)],choice=beat.choices[choiceIndex];if(!choice)return;
 st.choices.push({beat:st.beat,label:choice.label});
 st.currentText=choice.reply;st.awaiting=true;
 for(const [i,p] of room.actors.entries()){
   const gesture=i===0?choice.gesture:(["embrace","kiss","tender","dance"].includes(choice.gesture)?"tender":choice.gesture==="panic"?"fear":"window");
   p.react(gesture,choice.shift||{});
 }
 if(st.beat>=room.story.beats.length-1){st.finished=true;st.awaiting=false}
 else st.beat++;
 $("story-line").textContent=choice.reply;
 $("story-choices").replaceChildren();
 $("observe-btn").disabled=!!st.finished;
 $("observe-btn").textContent=st.finished?"THREAD COMPLETE":"FOLLOW THE THREAD ↗";
 say(choice.reply);toast(st.finished?"STORY THREAD COMPLETE":"THE MOMENT HAS CHANGED",2400);
 save();updateCounters();
}
function journal(){
 const j=$("journal"),entries=$("journal-entries");
 entries.replaceChildren();updateCounters();
 const active=STORIES.filter(s=>progress[s.id]&&Object.keys(progress[s.id].observed||{}).length);
 if(!active.length){const p=document.createElement("p");p.className="journal-intro";p.textContent="No observations yet. Approach a window, clean the rain from the glass, and look closer.";entries.appendChild(p)}
 for(const s of active){
   const st=progress[s.id];
   const el=document.createElement("div");el.className="journal-entry";
   const head=document.createElement("div");head.className="entry-head";const title=document.createElement("strong");title.textContent=s.title;
   const loc=document.createElement("span");loc.textContent="UNIT "+String(s.floor).padStart(2,"0")+String(s.col+1).padStart(2,"0");head.append(title,loc);
   el.appendChild(head);
   const genre=document.createElement("small");genre.textContent=s.genre+" · "+(st.finished?"THREAD CLOSED":"OPEN THREAD");el.appendChild(genre);
   for(const clue of st.clues){const p=document.createElement("p");p.textContent="◇ "+clue;el.appendChild(p)}
   const btn=document.createElement("button");btn.className="story-choice";btn.style.marginTop="10px";btn.textContent="RETURN TO THIS WINDOW ↗";
   btn.addEventListener("click",()=>{j.classList.add("hidden");setFocus(tower.getRoom(s.floor,s.col))});el.appendChild(btn);
   entries.appendChild(el);
 }
 j.classList.remove("hidden");
}
function toggleTime(){
 night=!night;tower.setNight(night);gameClock=night?23*60+47:11*60+38;
 $("clock-btn").title=night?"Switch to daytime":"Switch to nighttime";
 $("clock-icon").textContent=night?"◑":"☼";
 $("weather-label").textContent=night?"RAIN ON THE GLASS":"CLOUDS OVER THE CITY";
 say(night?"The lamps come on. The building acquires a different face.":"Daylight makes ordinary rooms look less mysterious. Almost.");
 toast(night?"NIGHT SHIFT — THE ROOMS ARE AWAKE":"DAY SHIFT — NEW LIGHT, DIFFERENT LIVES",3000);
}
function updateClock(dt){
 gameClock+=(dt*.12);
 const t=Math.floor(gameClock)%1440,h=Math.floor(t/60),m=t%60;
 $("time-label").textContent=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+" · "+(night?"NIGHT":"DAY");
}
function createAudio(){
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
 const ctx=new AC(),length=ctx.sampleRate*3,buffer=ctx.createBuffer(1,length,ctx.sampleRate);
 const data=buffer.getChannelData(0);let last=0;
 for(let i=0;i<length;i++){let white=Math.random()*2-1;last=(last+.027*white)/1.027;data[i]=last*4}
 const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
 const filter=ctx.createBiquadFilter();filter.type="lowpass";filter.frequency.value=900;
 const rain=ctx.createGain();rain.gain.value=.05;source.connect(filter).connect(rain).connect(ctx.destination);source.start();
 const hum=ctx.createOscillator();hum.type="sine";hum.frequency.value=52;
 const volume=ctx.createGain();volume.gain.value=.012;hum.connect(volume).connect(ctx.destination);hum.start();
 return {ctx,source,hum};
}
function toggleSound(){
 if(audio){audio.ctx.close();audio=null;$("sound-btn").classList.remove("active");toast("AMBIENCE OFF");return}
 try{audio=createAudio();if(audio){audio.ctx.resume();$("sound-btn").classList.add("active");toast("RAIN AMBIENCE ON")}}catch{toast("Audio is unavailable in this browser")}
}
let down=null;
function onPointerDown(e){
 if(!started||!$("journal").classList.contains("hidden"))return;
 const hit=tower.pointerRoom(e.clientX,e.clientY);if(!hit)return;
 if(!focused||focused!==hit.room){setFocus(hit.room);return}
 cleaning=true;lastUV=hit.uv;
 tower.wipe(hit.room,hit.uv);updateRoomDetails();
 down={x:e.clientX,y:e.clientY};
 stage.setPointerCapture?.(e.pointerId);
}
function onPointerMove(e){
 if(!started)return;
 if(cleaning&&focused){
   const hit=tower.pointerRoom(e.clientX,e.clientY);
   if(hit&&hit.room===focused){tower.wipe(focused,hit.uv,lastUV);lastUV=hit.uv;updateRoomDetails();
     if(focused.clean>=.23&&!seen.has(focused.key)){
       seen.add(focused.key);toast("THE ROOM COMES INTO FOCUS — LOOK CLOSER",3400);save();
       say("The pane begins to clear. A whole life appears behind it.");
     }}
   return;
 }
 const hit=tower.pointerRoom(e.clientX,e.clientY);
 if(hit&&!focused){hovered=hit.room;const tag=$("hover-tag");
   tag.textContent="UNIT "+hit.room.number+" / "+hit.room.title.toUpperCase();
   tag.style.left=e.clientX+"px";tag.style.top=e.clientY+"px";tag.classList.remove("hidden");
   stage.style.cursor="pointer";
 }else if(hit&&focused&&focused===hit.room){stage.style.cursor="crosshair";$("hover-tag").classList.add("hidden")}
 else{stage.style.cursor="default";hovered=null;$("hover-tag").classList.add("hidden")}
}
function onPointerUp(e){if(cleaning){cleaning=false;lastUV=null;down=null;save();try{stage.releasePointerCapture(e.pointerId)}catch{}}}
stage.addEventListener("pointerdown",onPointerDown);
stage.addEventListener("pointermove",onPointerMove);
stage.addEventListener("pointerup",onPointerUp);
stage.addEventListener("pointercancel",onPointerUp);
stage.addEventListener("pointerleave",()=>{$("hover-tag").classList.add("hidden");if(!cleaning)hovered=null});
stage.addEventListener("wheel",e=>{if(!started)return;e.preventDefault();if(Date.now()-lastMove>220)navigate(e.deltaY<0?1:-1,0)},{passive:false});
document.addEventListener("keydown",e=>{
 if(!started||!$("intro").classList.contains("hidden"))return;
 if(!$("journal").classList.contains("hidden")){if(e.key==="Escape")$("journal").classList.add("hidden");return}
 if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","Escape"," ","j","n"].includes(e.key))e.preventDefault();
 switch(e.key){case"ArrowUp":case"w":navigate(1,0);break;case"ArrowDown":case"s":navigate(-1,0);break;
 case"ArrowLeft":case"a":navigate(0,-1);break;case"ArrowRight":case"d":navigate(0,1);break;
 case"Escape":closeFocus();break;case" ":case"Enter":if(focused)showBeat();break;
 case"j":journal();break;case"n":toggleTime();break;}
});
$("begin-btn").addEventListener("click",()=>{started=true;$("intro").classList.add("hidden");toast("YOUR SHIFT BEGINS. SELECT A WINDOW, THEN DRAG TO CLEAN IT.",4700);
 say("The glass is cold. The city is awake. Somewhere inside, a story is already unfolding.");updatePosition()});
$("floor-up").addEventListener("click",()=>navigate(1,0));
$("floor-down").addEventListener("click",()=>navigate(-1,0));
$("mobile-up").addEventListener("click",()=>navigate(1,0));
$("mobile-down").addEventListener("click",()=>navigate(-1,0));
$("mobile-left").addEventListener("click",()=>navigate(0,-1));
$("mobile-right").addEventListener("click",()=>navigate(0,1));
$("close-focus").addEventListener("click",closeFocus);
$("leave-btn").addEventListener("click",closeFocus);
$("observe-btn").addEventListener("click",showBeat);
$("clock-btn").addEventListener("click",toggleTime);
$("journal-btn").addEventListener("click",journal);
$("close-journal").addEventListener("click",()=>$("journal").classList.add("hidden"));
$("sound-btn").addEventListener("click",toggleSound);
function runAmbient(dt){
 ambientTimer+=dt;if(ambientTimer<ambientAt)return;
 ambientTimer=0;ambientAt=11+Math.random()*14;
 const nearby=tower.rooms.filter(r=>Math.abs(r.floor-tower.floor)<=1);
 const r=nearby[Math.floor(Math.random()*nearby.length)];
 if(!r)return;
 const p=r.actors[Math.floor(Math.random()*r.actors.length)];
 const events=["window","phone","wonder","laugh","tender","fear","work","dance"];
 const gesture=events[Math.floor(Math.random()*events.length)];
 if(Math.random()<.8)p.react(gesture,gesture==="fear"?{fear:.12}:{connection:.02,curiosity:.04});
 // Cross-room ripples: radio signals, a sudden light, or a startled neighbor are not cutscenes.
 if(Math.random()<.3)r.flicker=1.8+Math.random()*1.9;
 if(!focused){say(AMBIENT_EVENTS[Math.floor(Math.random()*AMBIENT_EVENTS.length)])}
 else if(r===focused&&Math.random()<.5&&(!$("story-content").classList.contains("hidden")===false))say(p.name+" shifts their weight and turns toward the window.");
}
function frame(now){
 const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;
 if(started){runAmbient(dt);updateClock(dt);saveTimer+=dt;if(saveTimer>25){saveTimer=0;save()}}
 if(focused&&Math.floor(now/700)%2===0)updateRoomDetails();
 for(const r of tower.rooms){if(r.flicker>0){r.flicker-=dt;r.glow.material.opacity=(night?.5:.21)*(Math.random()>.16?1:.28);if(r.flicker<=0)r.glow.material.opacity=night?.5:.21}}
 tower.update(dt,gameClock);
 requestAnimationFrame(frame);
}
updateCounters();tower.move(10,2);tower.resize();
requestAnimationFrame(frame);
