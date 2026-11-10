import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// The people in PANE are animated canvas cut-outs inhabiting 3D rooms.
// Routines are selected by utility, interrupted by story stimuli, and expressed physically:
// walking, glancing, breathing, blinking, gesture, tension and interactions with room anchors.
const OUTFITS = {
  cream:["#a99d88","#e0d4bc","#5e584d"],navy:["#303f50","#617487","#1c2834"],
  red:["#8a333c","#c76770","#50272d"],black:["#292b35","#51515b","#181c24"],
  gray:["#575e66","#80858c","#333b44"],olive:["#5b6351","#8b8f70","#343e35"],
  teal:["#42636b","#70969a","#304c52"],beige:["#827666","#c2b49b","#554b44"],
  blue:["#476278","#7696a8","#2b3b50"],green:["#3c5c4c","#77907a","#273c33"],
  brown:["#6c5044","#a07a65","#3d302d"],maroon:["#603f4b","#997280","#352a35"]
};
const SKINS = ["#e4b99c","#cf9c7d","#b87c5f","#92634f","#604538"];
const HAIR = {silver:"#aaa6a6",short:"#2b2b32",bob:"#292b30",dark:"#24252b",messy:"#4c3a32",ponytail:"#362b2c",bun:"#40352f",curly:"#3c2a29",bald:"#8b6d59"};
const ACTIONS = [
  {id:"rest",anchor:"bed",time:12,weight:a=>.12+a.needs.fatigue*1.7},
  {id:"eat",anchor:"table",time:7,weight:a=>.12+(1-a.needs.hunger)*1.7},
  {id:"work",anchor:"desk",time:13,weight:a=>.25+a.needs.curiosity*.7+a.needs.stress*.5},
  {id:"read",anchor:"chair",time:12,weight:a=>.15+a.needs.curiosity*.8},
  {id:"window",anchor:"window",time:5,weight:a=>.1+a.needs.fear*.55+a.needs.curiosity*.45},
  {id:"phone",anchor:"chair",time:9,weight:a=>.14+(1-a.needs.connection)*1.15},
  {id:"pace",anchor:"wander",time:6,weight:a=>.15+a.needs.stress*1.1+a.needs.fear*.4},
  {id:"tidy",anchor:"shelf",time:9,weight:a=>.22+a.needs.stress*.6},
  {id:"dance",anchor:"center",time:10,weight:a=>(a.motive==="intimacy"||a.motive==="belonging"?.35:.015)+a.needs.desire*.5},
  {id:"think",anchor:"center",time:8,weight:a=>.19+a.needs.curiosity*.4}
];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
function h32(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967295}
function pickWeighted(items){let sum=items.reduce((t,i)=>t+Math.max(.001,i.score),0),r=Math.random()*sum;for(const i of items){r-=Math.max(.001,i.score);if(r<=0)return i.item}return items[items.length-1].item}
function roundedLine(ctx,color,width,points){ctx.beginPath();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=width;ctx.strokeStyle=color;points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
function ellipse(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function polygon(ctx,pts,color,stroke){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function drawPerson(a,t){
  const ctx=a.ctx,c=a.canvas;ctx.clearRect(0,0,c.width,c.height);
  const colors=OUTFITS[a.spec.clothes]||OUTFITS.gray,skin=SKINS[a.spec.skin??1],hair=HAIR[a.spec.hair]||HAIR.short;
  const walking=a.isWalking,activity=a.current?.id||"think",fear=a.needs.fear,stress=a.needs.stress;
  const anxious=clamp(fear*.8+stress*.25),sad=clamp((1-a.needs.connection)*.7+a.needs.fatigue*.3);
  const smile=clamp(a.needs.connection*.55 + a.needs.safety*.2-a.needs.fear*.35);
  const isElder=a.spec.look==="elder",isTall=a.spec.look==="tall",isBroad=a.spec.look==="broad";
  const stride=walking?Math.sin(t*8.2+a.phase)*19:Math.sin(t*1.3+a.phase)*2;
  const breath=Math.sin(t*(1.8+stress*.8)+a.phase)*2.3;
  const sway=Math.sin(t*.8+a.phase)*3+(anxious*Math.sin(t*5+a.phase)*.85);
  const lean=(activity==="window"?-.025:activity==="rest"?.075:0)+(a.gesture==="fear"?.07:0)+(sad*.027);
  const wave=["wave","window","point","protect"].includes(a.gesture);
  const embrace=["embrace","kiss","tender"].includes(a.gesture);
  const dance=activity==="dance"||a.gesture==="dance";
  const work=["work","tidy","tea","eat"].includes(activity)||["work","tea","eat"].includes(a.gesture);
  const phone=activity==="phone";
  const bend=a.gesture==="sleep"||activity==="rest";
  const fidget=Math.sin(t*(3+stress*3)+a.phase);
  // Character's drop shadow is painted into the sprite so movement stays lightweight.
  ctx.save();ctx.translate(120,329);ctx.scale(isTall?1.08:isBroad?1.13:1,isElder?.94:1);
  ctx.translate(sway,walking?-Math.abs(Math.sin(t*8+a.phase))*3:breath*.28);
  ctx.rotate(lean+Math.sin(t*.72+a.phase)*.007);
  // Lower-body walking and weight shift.
  const trouser=colors[2];
  roundedLine(ctx,"#181d24",17,[[-16,-119],[-17+stride*.52,-61],[-17+stride,-11]]);
  roundedLine(ctx,"#181d24",17,[[16,-119],[18-stride*.52,-61],[18-stride,-11]]);
  roundedLine(ctx,trouser,12,[[-16,-119],[-17+stride*.52,-61],[-17+stride,-11]]);
  roundedLine(ctx,trouser,12,[[16,-119],[18-stride*.52,-61],[18-stride,-11]]);
  ellipse(ctx,-17+stride,-7,17,7,"#16171d");ellipse(ctx,18-stride,-7,17,7,"#16171d");
  roundedLine(ctx,"rgba(224,204,174,.13)",1.6,[[-25+stride,-9],[-11+stride,-9]]);
  // Neck and body silhouette.
  polygon(ctx,[[-12,-226],[12,-226],[11,-202],[-10,-202]],skin);
  const shoulders=isBroad?43:34;
  polygon(ctx,[[-shoulders,-199-breath],[-44,-169],[-30,-124],[-23,-114],[23,-114],[29,-124],[44,-169],[shoulders,-199-breath],[10,-213],[-10,-213]],colors[0],"rgba(12,18,25,.9)");
  polygon(ctx,[[-8,-206],[7,-206],[4,-166],[-2,-157]],colors[1]);
  roundedLine(ctx,"rgba(234,217,191,.16)",1,[[-20,-190],[-21,-125]]);
  // Waist belt and seams.
  roundedLine(ctx,"rgba(16,20,27,.65)",5,[[-24,-121],[24,-121]]);
  ellipse(ctx,0,-121,3,2.5,"#bfae8d");
  // Hands and articulated arms follow intentions rather than idle-only loops.
  let lx=-48,ly=-116,rx=48,ry=-116;
  if(wave){rx=53+Math.sin(t*6)*5;ry=-245+Math.sin(t*4)*5}
  if(embrace){lx=-8;ly=-157;rx=8;ry=-158}
  if(dance){lx=-76+Math.sin(t*3)*12;ly=-236+Math.cos(t*2)*12;rx=75+Math.cos(t*3)*10;ry=-214}
  if(work){rx=19+Math.sin(t*3)*9;ry=-157+Math.sin(t*2)*4}
  if(phone){rx=19;ry=-245;lx=-40;ly=-139}
  if(activity==="read"){lx=-8;ly=-165;rx=18;ry=-164}
  if(a.gesture==="panic"||a.gesture==="fear"){rx=18;ry=-232;lx=-32;ly=-175}
  if(a.gesture==="argue"){rx=67+Math.sin(t*5)*8;ry=-186;lx=-23;ly=-143}
  if(a.gesture==="recoil"){rx=42;ry=-215;lx=-46;ly=-213}
  if(bend){lx=-44;ly=-95;rx=44;ry=-96}
  const elbowL=[lerp(-shoulders,lx,.45)-7,lerp(-194,ly,.48)],elbowR=[lerp(shoulders,rx,.45)+7,lerp(-194,ry,.48)];
  roundedLine(ctx,"rgba(8,11,15,.9)",21,[[-shoulders,-194],elbowL,[lx,ly]]);
  roundedLine(ctx,"rgba(8,11,15,.9)",21,[[shoulders,-194],elbowR,[rx,ry]]);
  roundedLine(ctx,colors[0],17,[[-shoulders,-194],elbowL,[lx,ly]]);
  roundedLine(ctx,colors[0],17,[[shoulders,-194],elbowR,[rx,ry]]);
  ellipse(ctx,lx,ly,7,9,skin);ellipse(ctx,rx,ry,7,9,skin);
  if(wave){roundedLine(ctx,skin,2,[[rx,ry],[rx+4,ry-12]]);roundedLine(ctx,skin,2,[[rx+3,ry],[rx+10,ry-10]])}
  // Face: genuine emotional range from eyelids, brow tension, attention and mouth curvature.
  const neckY=-244,headTilt=(a.gesture==="wonder"?-.13:a.gesture==="fear"?.08:0)+Math.sin(t*.66+a.phase)*.025;
  ctx.save();ctx.translate(0,neckY);ctx.rotate(headTilt);
  // Hair behind head, including ponytail / bun.
  if(a.spec.hair==="ponytail")ellipse(ctx,30,4,15,35,hair);
  if(a.spec.hair==="bun")ellipse(ctx,23,-27,14,15,hair);
  if(a.spec.hair==="curly")for(let i=0;i<9;i++){const angle=Math.PI*1.12+i/8*Math.PI*.82;ellipse(ctx,Math.cos(angle)*30,Math.sin(angle)*30-1,14,15,hair)}
  if(isElder)ellipse(ctx,0,-5,32,43,"#8c8580");
  ellipse(ctx,0,0,28,38,skin);
  ellipse(ctx,-28,3,5.5,9,skin);ellipse(ctx,28,3,5.5,9,skin);
  // Lighting/character volume.
  ctx.fillStyle="rgba(252,223,195,.18)";ctx.beginPath();ctx.ellipse(-9,-13,10,19,-.3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(63,34,29,.12)";ctx.beginPath();ctx.ellipse(15,15,9,15,.2,0,Math.PI*2);ctx.fill();
  if(a.spec.hair!=="bald"){
    ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-29,-1);ctx.quadraticCurveTo(-43,-49,4,-42);ctx.quadraticCurveTo(37,-45,29,-5);
    ctx.quadraticCurveTo(24,-21,12,-21);ctx.quadraticCurveTo(-9,-12,-17,-23);ctx.quadraticCurveTo(-19,-10,-29,-1);ctx.fill();
    if(a.spec.hair==="bob"){polygon(ctx,[[-31,-29],[-35,31],[-23,31],[-19,-4]],hair);polygon(ctx,[[28,-28],[34,27],[23,29],[22,-8]],hair)}
    if(a.spec.hair==="messy")for(let i=0;i<4;i++)roundedLine(ctx,hair,6,[[-19+i*11,-32],[-23+i*10,-45-(i%2)*8]]);
  }
  // Nose, cheek color and tiredness.
  ellipse(ctx,-16,9,7,4,"rgba(166,83,69,.12)");ellipse(ctx,17,9,7,4,"rgba(166,83,69,.10)");
  roundedLine(ctx,"rgba(85,49,44,.35)",1.5,[[2,-2],[0,11],[5,11]]);
  const eyesY=-6+(sad?2:0),blink=clamp(a.blink);
  const widthEye=7.3;
  const leftLook=a.attentionX*1.6;
  for(const sx of [-12,12]){
    const browY=eyesY-11-(anxious*3)+(sx>0?fear*2:-fear*2);
    roundedLine(ctx,HAIR[a.spec.hair]||"#3c302c",2.7,[[sx-7,browY+anxious],[sx+6,browY-(fear*2)]]);
    ctx.fillStyle="#eee3d7";ctx.beginPath();ctx.ellipse(sx,eyesY,widthEye,Math.max(.4,3.8*(1-blink)),0,0,Math.PI*2);ctx.fill();
    if(blink<.8){ellipse(ctx,sx+leftLook,eyesY,2.3,2.5*(1-blink),"#292d30");ellipse(ctx,sx+leftLook-.5,eyesY-.8,.8,.8,"#e8ddd0")}
    if(a.needs.fatigue>.72)roundedLine(ctx,"rgba(101,63,66,.35)",1.5,[[sx-7,eyesY+7],[sx+4,eyesY+8]]);
  }
  const moodSmile=smile-(a.gesture==="laugh"?-.45:0)-(sad*.3)-(fear*.3);
  ctx.beginPath();ctx.strokeStyle="#683d38";ctx.lineWidth=2;ctx.moveTo(-6,21);ctx.quadraticCurveTo(0,21+moodSmile*11,7,21);ctx.stroke();
  if(a.gesture==="panic")ellipse(ctx,0,23,4,5,"#493035");
  if(isElder){roundedLine(ctx,"rgba(89,59,56,.3)",1.5,[[-25,13],[-18,18]]);roundedLine(ctx,"rgba(89,59,56,.3)",1.5,[[25,13],[18,18]])}
  ctx.restore();
  if(activity==="phone"){polygon(ctx,[[16,-251],[23,-253],[24,-225],[17,-224]],"#101923");ellipse(ctx,20,-231,1.5,2,"#8ce0d1")}
  if(activity==="read"){polygon(ctx,[[-10,-177],[12,-176],[25,-154],[0,-153]],"#e3c8a0");roundedLine(ctx,"#7d665a",1,[[1,-173],[3,-156]])}
  if(activity==="eat"||a.gesture==="tea"){ellipse(ctx,rx,ry-5,11,7,"#d7c0a1");roundedLine(ctx,"#d7c0a1",3,[[rx+9,ry-6],[rx+15,ry-2],[rx+9,ry+2]])}
  if(dance){for(let i=0;i<3;i++)ellipse(ctx,50+Math.sin(t*1.9+i)*7,-280+i*22,1.4,1.4,"rgba(233,202,157,.45)")}
  // Working body has secondary motion, not only a billboard translation.
  if(a.gesture==="laugh")ellipse(ctx,0,-208,3+Math.abs(fidget)*2,3,"rgba(226,193,161,.55)");
  ctx.restore();
}
export class Person {
  constructor(spec,room,index){
    this.spec=spec;this.room=room;this.index=index;
    this.name=spec.name||"Resident";this.age=spec.age||35;this.motive=spec.motive||"survival";
    this.needs={hunger:.65,fatigue:.3,connection:.55,safety:.55,stress:.25,fear:.08,desire:.3,curiosity:.5,...spec.needs};
    this.x=index===0?-.85:1.15;this.targetX=this.x;this.velocity=0;
    this.phase=h32(this.name)*Math.PI*2;this.current=null;this.actionEnd=0;this.time=0;this.drawClock=0;
    this.gesture=null;this.gestureUntil=0;this.blink=0;this.nextBlink=2+Math.random()*4;
    this.attentionX=0;this.isWalking=false;
    this.canvas=document.createElement("canvas");this.canvas.width=240;this.canvas.height=360;this.ctx=this.canvas.getContext("2d",{alpha:true});
    this.texture=new THREE.CanvasTexture(this.canvas);this.texture.colorSpace=THREE.SRGBColorSpace;this.texture.magFilter=THREE.LinearFilter;this.texture.minFilter=THREE.LinearFilter;
    this.material=new THREE.MeshBasicMaterial({map:this.texture,transparent:true,side:THREE.DoubleSide,depthWrite:false,alphaTest:.045,toneMapped:false});
    this.sprite=new THREE.Mesh(new THREE.PlaneGeometry(1.62,2.55),this.material);
    this.sprite.position.set(this.x,-.47,-.68-index*.16);this.sprite.renderOrder=3;
    this.room.group.add(this.sprite);
    this.plan(true);drawPerson(this,0);this.texture.needsUpdate=true;
  }
  plan(force=false){
    if(!force&&this.time<this.actionEnd)return;
    const eligible=ACTIONS.map(item=>({item,score:item.weight(this)*(this.room.anchors[item.anchor]?1:.68)*(.65+Math.random()*.75)}));
    const selected=pickWeighted(eligible);
    this.current=selected;
    this.actionEnd=this.time+selected.time*(.7+Math.random()*.7);
    const anchor=this.room.anchors[selected.anchor]??(Math.random()*3.1-1.55);
    this.targetX=clamp(anchor+(Math.random()-.5)*.47,-1.92,1.92);
    if(selected.id==="pace")this.targetX=(Math.random()>.5?1:-1)*1.7;
  }
  react(gesture,shift={}){
    this.gesture=gesture;this.gestureUntil=this.time+(gesture==="kiss"||gesture==="embrace"?9:5.5);
    for(const [k,v] of Object.entries(shift))if(k in this.needs)this.needs[k]=clamp(this.needs[k]+v);
    const targets={window:1.4,panic:-1.55,hide:-1.7,dance:0,embrace:0,kiss:0,tender:0,tea:-1.05,
      work:-1.25,rest:-1.5,sleep:-1.4,eat:-1,wave:1.15,point:1.3,freeze:this.x,
      wonder:1.3,relief:0,protect:-1.35,fear:-1.5,laugh:0,remember:-.6,dream:-.6};
    if(gesture in targets){
      this.targetX=targets[gesture];
      if(this.room.actors.length>1&&["embrace","kiss","tender","dance"].includes(gesture))
        this.targetX+=(this.index===0?-.31:.31);
    }
    if(gesture==="argue")this.targetX=(this.index===0?-.75:.75);
    if(gesture==="recoil")this.targetX=(this.index===0?-1.1:1.1);
    if(["dance","sleep","work","eat","rest"].includes(gesture))this.current=ACTIONS.find(a=>a.id===(gesture==="sleep"?"rest":gesture))||this.current;
    this.actionEnd=this.gestureUntil;
  }
  update(dt,worldTime,night,near){
    this.time+=dt;
    const N=this.needs;
    N.hunger=clamp(N.hunger-dt*.0008);
    N.fatigue=clamp(N.fatigue+dt*(night?.00105:.00055));
    N.connection=clamp(N.connection-dt*.00043);
    N.stress=clamp(N.stress+dt*(N.fear>.5?.0009:-.0003));
    N.fear=clamp(N.fear-dt*.0007);
    if(this.current){
      if(this.current.id==="eat")N.hunger=clamp(N.hunger+dt*.012);
      if(this.current.id==="rest")N.fatigue=clamp(N.fatigue-dt*.010);
      if(this.current.id==="phone")N.connection=clamp(N.connection+dt*.007);
      if(this.current.id==="dance")N.connection=clamp(N.connection+dt*.004);
      if(this.current.id==="read")N.stress=clamp(N.stress-dt*.004);
      if(this.current.id==="window")N.curiosity=clamp(N.curiosity+dt*.002);
    }
    if(this.gesture&&this.time>this.gestureUntil)this.gesture=null;
    if(!this.gesture&&this.time>this.actionEnd)this.plan();
    // Small, non-scripted changes of mind and spontaneous window glances.
    if(!this.gesture&&Math.random()<dt*.004){this.targetX=Math.random()*3.7-1.85;this.attentionX=Math.random()*1.8-1}
    const speed=(.28+N.stress*.35+N.fear*.3)*(this.gesture==="panic"?2:1);
    let diff=this.targetX-this.x;this.isWalking=Math.abs(diff)>.055;
    this.x+=Math.sign(diff)*Math.min(Math.abs(diff),speed*dt);
    this.sprite.position.x=this.x;
    this.sprite.position.y=-.48+(this.isWalking?Math.abs(Math.sin(this.time*9+this.phase))*.022:Math.sin(this.time*1.7+this.phase)*.014);
    this.sprite.rotation.z=(this.isWalking?.011*Math.sign(diff):.005)*Math.sin(this.time*2);
    // Look toward the activity and occasionally to the player; avoid robotic constant eye contact.
    const eyetarget=this.current?.id==="window"||this.gesture==="window"||this.gesture==="wave"?0:Math.sin(this.time*.6+this.phase)*.8;
    this.attentionX=lerp(this.attentionX,eyetarget,dt*1.7);
    if(this.time>this.nextBlink){this.nextBlink=this.time+2.0+Math.random()*5.5;this.blink=1}
    this.blink=Math.max(0,this.blink-dt*8);
    this.drawClock+=dt;
    const interval=near?.085:.29;
    if(this.drawClock>interval){this.drawClock=0;drawPerson(this,this.time);this.texture.needsUpdate=true}
  }
  getEmotion(){
    if(this.gesture==="kiss"||this.gesture==="embrace"||this.gesture==="tender")return"CLOSE TO SOMEONE";
    if(this.gesture==="argue")return"UPSET";
    if(this.needs.fear>.6)return"AFRAID";
    if(this.needs.fatigue>.82)return"EXHAUSTED";
    if(this.needs.stress>.65)return"ON EDGE";
    if(this.needs.connection<.25)return"LONELY";
    if(this.needs.desire>.7&&this.needs.connection>.5)return"LONGING";
    if(this.needs.curiosity>.8)return"ABSORBED";
    return this.current?.id==="dance"?"AT EASE":this.current?.id==="window"?"WATCHING":"GOING ABOUT THEIR LIFE";
  }
  dispose(){this.sprite.geometry.dispose();this.material.dispose();this.texture.dispose()}
}

const EXTRA_NAMES=["Mara","Theo","Bea","Anton","Cleo","Dina","Otis","Sal","Milo","Eve","Nina","Jon","June","Ari","Frank","Sasha","Ren","Lara","Olive","Rae","Luca","Sylvie","Leo","Max"];
export function generateResidents(floor,col){
 const seed=floor*31+col*101;
 const qty=(seed%6===0)?2:1;
 return Array.from({length:qty},(_,i)=>{
   const n=seed+i*17;return{
     name:EXTRA_NAMES[n%EXTRA_NAMES.length],age:23+(n*7)%55,
     look:["soft","sharp","tired","tall","broad","slim","elder"][n%7],
     hair:["bob","short","curly","bun","messy","silver","dark","ponytail"][n%8],
     clothes:Object.keys(OUTFITS)[n%Object.keys(OUTFITS).length],skin:n%5,
     motive:["belonging","survival","control","intimacy","truth","escape"][n%6],
     needs:{connection:.18+h32("connect"+n)*.7,curiosity:.2+h32("curious"+n)*.75,fatigue:.12+h32("tire"+n)*.6}
   };
 });
}
