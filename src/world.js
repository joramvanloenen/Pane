import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import {findStory, ROOM_NAMES} from "./stories.js";
import {Person,generateResidents} from "./people.js";

export const FLOORS=12,COLS=3,FLOOR_H=4.65,ROOM_W=5.72,SPACING=6.1;
export const roomX=col=>(col-1)*SPACING;
export const roomY=floor=>(floor-1)*FLOOR_H+2.32;
const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const THEMES={
  dining:["#514844","#e7b18a","#3a2d2c"],study:["#34424b","#90adb0","#23303a"],
  romance:["#51343e","#f3a18c","#39252d"],minimal:["#3d4148","#c1ad9e","#272d37"],
  nursery:["#454c53","#b7bdbe","#333943"],kitchen:["#4a504c","#cfad88","#343935"],
  studio:["#4a4b51","#cbbca0","#32333b"],plants:["#344a42","#a4bb95","#2c3833"],
  workshop:["#4b4944","#d1a57a","#302e2e"],boxes:["#4d4945","#c2a78b","#323130"],
  vintage:["#4a3d40","#d9ad88","#2b2729"],detective:["#36404b","#d1ab85","#242d36"],
  home:["#4c474b","#c7aa91","#333238"],sleep:["#3b434c","#b9a8a5","#2b333d"]
};
const PROP_SIZE={desk:[2.15,1.35],dining:[2.15,1.08],table:[1.8,1.13],chair:[.8,1.25],sofa:[2.48,1.25],bed:[2.55,1.15],lamp:[.6,2.5],flowers:[.62,.8],photo:[.9,.8],photos:[1.8,1.12],clock:[.55,.55],books:[1,.9],radio:[1.05,.73],maps:[1.65,1.15],papers:[1.03,.5],mug:[.42,.39],cup:[.42,.39],glass:[.25,.49],shelf:[1.15,1.84],phone:[.44,.42],curtain:[.55,3.35],record:[1.4,1.27],crib:[1.8,1.35],rocker:[1.12,1.46],toy:[.73,.8],plant:[.95,1.5],blanket:[1.2,.74],kettle:[.55,.65],bills:[.82,.42],notes:[1.25,1.03],vase:[.59,.73],journal:[.64,.4],box:[.95,.87],boxes:[1.74,1.56],tools:[.95,.85],camera:[.68,.52]};
const WALL_PROPS=new Set(["photo","photos","clock","maps","notes","curtain"]);
const SMALL_PROPS=new Set(["mug","cup","glass","phone","papers","bills","journal","camera","kettle","flowers","vase","toy","tools","radio","books","box"]);
const rand=(seed,i=0)=>{let x=Math.sin(seed*49.173+i*91.77)*43758.5453;return x-Math.floor(x)};
const mat=(color,opacity=1)=>new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1,side:THREE.DoubleSide});
function quad(w,h,color,x,y,z,group){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat(color));m.position.set(x,y,z);group.add(m);return m}
function box(w,h,d,color,x,y,z,group){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);group.add(m);return m}
function texFromCanvas(canvas){const tx=new THREE.CanvasTexture(canvas);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=2;return tx}
function canvas2d(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return[c,c.getContext("2d")]}
function fillPoly(ctx,points,color){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill()}
function stroke(ctx,pts,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke()}
function rounded(ctx,x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function ellipse(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill()}
function wallpaper(room){
 const [c,ctx]=canvas2d(640,420),seed=room.floor*37+room.col*103;
 const p=THEMES[room.theme]||THEMES.home;
 const grad=ctx.createLinearGradient(0,0,640,420);grad.addColorStop(0,p[0]);grad.addColorStop(.62,p[2]);grad.addColorStop(1,"#171f25");ctx.fillStyle=grad;ctx.fillRect(0,0,640,420);
 // Aging plaster and silhouettes of decades of domestic life.
 for(let i=0;i<850;i++){const x=rand(seed,i)*640,y=rand(seed+13,i)*420;ctx.fillStyle=i%3?"rgba(235,204,164,.035)":"rgba(6,10,13,.08)";ctx.fillRect(x,y,rand(seed+3,i)*5+1,rand(seed+9,i)*2+1)}
 if(seed%3===0){for(let x=0;x<640;x+=35){ctx.fillStyle="rgba(0,0,0,.085)";ctx.fillRect(x,0,2,420)}}
 if(seed%4===0){for(let y=0;y<400;y+=42){ctx.fillStyle="rgba(240,204,162,.045)";ctx.fillRect(0,y,640,2)}}
 ctx.fillStyle="rgba(15,19,24,.55)";ctx.fillRect(0,386,640,34);
 ctx.fillStyle="rgba(210,174,128,.19)";ctx.fillRect(0,379,640,5);
 ctx.fillStyle="rgba(240,208,172,.06)";ctx.fillRect(0,15,640,8);
 // Grime in corners and a soft pool of light from an unseen practical lamp.
 let g=ctx.createRadialGradient(350,215,12,350,215,330);g.addColorStop(0,"rgba(248,180,114,.16)");g.addColorStop(.8,"rgba(248,180,114,0)");ctx.fillStyle=g;ctx.fillRect(0,0,640,420);
 // Room-specific background details.
 if(room.theme==="study"||room.theme==="detective"||room.theme==="minimal"){
  for(let i=0;i<8;i++){const x=145+(i%4)*55,y=64+Math.floor(i/4)*90;ctx.save();ctx.translate(x,y);ctx.rotate((rand(seed,i)-.5)*.16);ctx.fillStyle="#b6a695";ctx.fillRect(-18,-23,36,46);ctx.fillStyle="#53616c";ctx.fillRect(-13,-18,26,30);ctx.fillStyle="#262e35";ctx.fillRect(-7,-9,12,15);ctx.restore()}
  stroke(ctx,[[150,115],[380,83],[280,161],[420,185]],"rgba(176,64,58,.49)",2);
 }
 if(room.theme==="nursery"){for(let i=0;i<28;i++){const x=rand(seed,i)*640,y=rand(seed+2,i)*300;ellipse(ctx,x,y,2,2,"rgba(223,206,177,.3)")}}
 if(room.theme==="romance"){ctx.fillStyle="rgba(124,37,55,.22)";ctx.fillRect(15,0,75,420);ctx.fillRect(552,0,75,420)}
 if(room.theme==="kitchen"){for(let y=180;y<390;y+=41)for(let x=0;x<640;x+=55){ctx.strokeStyle="rgba(192,192,180,.11)";ctx.strokeRect(x,y,55,41)}}
 if(room.theme==="plants"){for(let i=0;i<20;i++){stroke(ctx,[[rand(seed,i)*640,0],[rand(seed+4,i)*640,250]],"rgba(46,86,57,.25)",2)}}
 return texFromCanvas(c);
}
function propCanvas(kind,seed){
 const [c,ctx]=canvas2d(220,260),dark="#141a20",line="#a18b70",wood="#735b4e",warm="#bda17f",light="#d9c19e",metal="#54616a",cloth="#6f5c64";
 // All props are original hand-drawn vector illustrations rendered to translucent canvases.
 const rect=(x,y,w,h,col,rad=0)=>rad?rounded(ctx,x,y,w,h,rad,col):(ctx.fillStyle=col,ctx.fillRect(x,y,w,h));
 const path=(p,col)=>fillPoly(ctx,p,col);
 const circ=(x,y,r,col)=>ellipse(ctx,x,y,r,r,col);
 const rim=(x,y,w,h,col=line,th=3)=>(ctx.strokeStyle=col,ctx.lineWidth=th,ctx.strokeRect(x,y,w,h));
 const noise=()=>{for(let i=0;i<55;i++){let x=rand(seed,i)*220,y=rand(seed+7,i)*260;ctx.fillStyle="rgba(240,200,156,.06)";ctx.fillRect(x,y,2,2)}};
 switch(kind){
  case"desk":case"table":case"dining":
   rect(15,151,190,21,wood,3);rect(13,150,194,4,light);rect(29,173,15,78,dark);rect(175,173,15,78,dark);
   stroke(ctx,[[44,186],[175,186]],"#27262a",6);if(kind==="desk"){rect(33,108,120,42,metal,3);rect(40,114,105,28,"#253942");rect(90,152,11,10,light)}else{ellipse(ctx,112,144,62,11,"#d0b898");rect(108,127,5,16,"#eee0c6");ellipse(ctx,112,124,7,4,"#eedac2")}break;
  case"chair":case"rocker":
   rounded(ctx,56,57,103,127,14,kind==="rocker"?wood:cloth);rect(57,63,101,10,"#a48a74");
   rect(43,168,132,29,wood,8);rect(53,191,14,59,dark);rect(153,191,14,59,dark);
   if(kind==="rocker")stroke(ctx,[[33,251],[180,251]],line,10);break;
  case"sofa":case"bed":
   rounded(ctx,22,113,176,96,14,kind==="bed"?"#777982":cloth);rect(24,178,172,44,kind==="bed"?"#a19a95":"#55444e",9);
   rounded(ctx,4,140,32,90,9,wood);rounded(ctx,184,140,32,90,9,wood);rect(37,216,12,34,dark);rect(171,216,12,34,dark);
   if(kind==="bed"){rounded(ctx,28,116,75,40,15,light);stroke(ctx,[[105,125],[111,207]],"rgba(20,20,20,.21)",2)}
   else stroke(ctx,[[110,120],[110,209]],"rgba(27,22,30,.5)",3);break;
  case"lamp":rect(97,126,8,123,metal);ellipse(ctx,101,248,29,6,dark);path([[55,125],[72,35],[132,35],[150,125]],"#c8a57b");rect(66,125,81,7,dark);
   ellipse(ctx,101,126,36,8,"rgba(248,183,105,.55)");break;
  case"plant":case"flowers":
   for(let i=0;i<13;i++){const bend=Math.sin(i*3.12)*67,yy=38+(i%4)*21;stroke(ctx,[[110,219],[110+bend*.4,130],[110+bend,yy]],"#4f785e",3+(i%3))}
   for(let i=0;i<15;i++){const x=43+(i*37)%132,y=28+(i*31)%144;ellipse(ctx,x,y,10+(i%4)*3,5+(i%3)*4,["#436a51","#668564","#8a9a69","#a2b482"][i%4])}
   if(kind==="flowers")for(let i=0;i<8;i++){const x=65+(i*37)%98,y=30+(i*19)%80;circ(x,y,6,["#d4a07c","#a9656d","#d7c4a1"][i%3])}
   path([[77,194],[144,194],[133,249],[89,249]],kind==="plant"?"#86644b":"#647480");rect(72,191,76,7,light);break;
  case"shelf":rect(38,17,145,232,wood);for(let i=0;i<4;i++){rect(43,45+i*53,135,6,light);for(let j=0;j<8;j++){const x=49+j*15,hh=20+(j*7+i*3)%25;rect(x,44+i*53-hh,11,hh,["#6a5a5a","#a99a78","#5b7376","#837062"][j%4])}}break;
  case"radio":case"record":
   rect(30,95,160,118,wood,8);rect(40,104,140,88,"#2e353b",5);rim(45,110,130,72);
   ellipse(ctx,97,151,35,35,metal);for(let i=0;i<6;i++)stroke(ctx,[[68,122+i*10],[125,122+i*10]],"#29333b",2);
   circ(150,178,9,light);if(kind==="record"){path([[60,96],[85,26],[150,26],[161,96]],"#5c514b");ellipse(ctx,115,79,45,16,"#171d22");circ(115,79,6,light)}break;
  case"crib":rect(30,121,161,94,light,8);for(let i=0;i<9;i++)rect(40+i*17,130,5,75,"#6f7173");rect(25,117,171,10,"#9b9a96");rect(39,210,12,38,wood);rect(169,210,12,38,wood);stroke(ctx,[[109,20],[109,68]],line,4);for(let i=0;i<5;i++){ellipse(ctx,58+i*25,89+(i%2)*11,8,6,["#bba0a4","#879dab","#cfb78e"][i%3]);stroke(ctx,[[109,67],[58+i*25,88]],line,1)}break;
  case"boxes":case"box":
   rect(34,149,103,100,wood);rect(34,149,103,7,light);stroke(ctx,[[87,155],[87,241]],"#b39b78",5);rect(51,179,55,20,"#c1ad90");
   if(kind==="boxes"){rect(93,67,113,105,"#92765d");stroke(ctx,[[147,74],[147,169]],light,5);rect(107,107,53,26,light);rect(10,84,83,64,"#67554a");rim(10,84,83,64,"#8d7762")}break;
  case"curtain":rect(60,12,100,230,"#794752");for(let i=0;i<6;i++){path([[60+i*17,12],[74+i*17,12],[68+i*17,241]],i%2?"rgba(23,10,21,.26)":"rgba(232,158,148,.1)")}rect(54,12,111,8,wood);break;
  case"photo":case"photos":case"maps":case"notes":
   rect(25,24,170,195,kind==="notes"?"#7a625a":wood);rect(36,35,148,173,"#d1bba0");
   if(kind==="photo"){rect(44,43,132,140,"#52616a");ellipse(ctx,112,96,28,32,"#987b6d");path([[53,183],[71,145],[152,145],[171,183]],"#363e47")}
   else for(let i=0;i<9;i++){let x=42+(i%3)*46,y=47+Math.floor(i/3)*53;rect(x,y,38,43,["#8d8577","#65747c","#b5a58d"][i%3]);stroke(ctx,[[x+8,y+30],[x+28,y+12]],"#b9c2ba",2)}
   break;
  case"clock":circ(110,122,90,wood);circ(110,122,76,"#d3c6ac");for(let i=0;i<12;i++){let t=i*TAU/12;stroke(ctx,[[110+Math.sin(t)*62,122-Math.cos(t)*62],[110+Math.sin(t)*70,122-Math.cos(t)*70]],dark,3)}stroke(ctx,[[110,122],[110,69]],dark,4);stroke(ctx,[[110,122],[147,136]],dark,3);circ(110,122,5,dark);break;
  case"books":for(let i=0;i<8;i++){const x=32+i*20;rect(x,60+(i%3)*11,18,188-(i%3)*11,["#a98575","#56727b","#b7a37a","#59566a"][i%4]);stroke(ctx,[[x+2,86],[x+14,86]],light,2)}break;
  case"papers":case"bills":case"journal":
   for(let i=0;i<4;i++){ctx.save();ctx.translate(60+i*24,140+i*8);ctx.rotate((rand(seed,i)-.5)*.42);rect(-29,-50,63,83,kind==="journal"?"#7e5946":"#c9b89a");for(let j=0;j<6;j++)stroke(ctx,[[-20,-30+j*8],[20,-30+j*8]],"#7c827e",2);ctx.restore()}break;
  case"mug":case"cup":case"glass":case"vase":
   if(kind==="glass"){path([[85,75],[138,75],[127,196],[97,196]],"#bdc6c0");stroke(ctx,[[95,124],[128,124]],"#994d54",17)}
   else {path([[76,103],[151,103],[139,207],[89,207]],kind==="vase"?"#6b7580":"#c9b29d");stroke(ctx,[[145,128],[166,131],[160,173],[145,176]],light,9)}
   break;
  case"phone":rect(76,34,78,186,dark,12);rect(86,48,58,144,"#607c7e",5);circ(115,210,6,light);break;
  case"kettle":ellipse(ctx,109,157,69,70,metal);rounded(ctx,47,80,120,23,8,metal);stroke(ctx,[[71,100],[53,64],[137,64],[155,99]],light,11);path([[159,140],[195,117],[179,155]],metal);break;
  case"toy":ellipse(ctx,100,153,60,67,"#a79780");ellipse(ctx,75,94,23,29,"#a79780");ellipse(ctx,142,94,23,29,"#a79780");ellipse(ctx,105,124,46,44,"#bda98a");circ(87,118,5,dark);circ(126,118,5,dark);ellipse(ctx,105,148,10,7,dark);break;
  case"blanket":path([[34,130],[167,130],[200,203],[28,228]],"#888d8b");for(let i=0;i<5;i++)stroke(ctx,[[45+i*28,145],[42+i*28,204]],"rgba(235,215,188,.25)",3);break;
  case"tools":rect(37,135,143,70,metal);rect(55,205,10,41,dark);rect(155,205,10,41,dark);for(let i=0;i<5;i++)stroke(ctx,[[66+i*22,139],[72+i*22,80],[83+i*22,79]],light,5);break;
  case"camera":rect(34,92,151,105,dark,7);rect(71,66,69,39,wood,4);circ(109,144,39,metal);circ(109,144,23,"#24373e");circ(109,144,7,"#628b99");break;
  default:rect(55,110,110,125,wood,5);rim(63,118,94,109);
 }
 noise();return texFromCanvas(c);
}
function grime(seed){
 const [c,ctx]=canvas2d(520,360);
 const g=ctx.createLinearGradient(0,0,520,360);g.addColorStop(0,"rgba(18,27,32,.37)");g.addColorStop(.5,"rgba(25,31,34,.13)");g.addColorStop(1,"rgba(7,14,19,.49)");
 ctx.fillStyle=g;ctx.fillRect(0,0,520,360);
 for(let i=0;i<290;i++){const x=rand(seed,i)*520,y=rand(seed+3,i)*360,r=1+rand(seed+5,i)*20;ellipse(ctx,x,y,r,r*.44,i%3?"rgba(198,190,165,.055)":"rgba(8,18,21,.15)")}
 for(let i=0;i<31;i++){const x=rand(seed+8,i)*520,y=rand(seed+11,i)*170;stroke(ctx,[[x,y],[x+(rand(seed+12,i)-.5)*6,y+30+rand(seed+2,i)*170]],"rgba(194,209,207,.15)",.6+rand(seed+19,i)*2)}
 return[c,ctx];
}
function makeGlow(color){
 const [c,ctx]=canvas2d(128,128);const g=ctx.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,"rgba(255,225,175,.5)");g.addColorStop(.33,"rgba(255,196,128,.19)");g.addColorStop(1,"rgba(255,190,130,0)");ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return texFromCanvas(c)
}
function renderTextSprite(text,fontSize=34,color="#d7c5a5"){
 const [c,ctx]=canvas2d(512,96);ctx.font=fontSize+"px Georgia";ctx.fillStyle=color;ctx.textAlign="center";ctx.fillText(text,256,61);return texFromCanvas(c)
}
export class Tower {
 constructor(mount,onPick){
   this.mount=mount;this.onPick=onPick;this.rooms=[];this.roomMap=new Map();this.hitMeshes=[];
   this.scene=new THREE.Scene();this.scene.background=new THREE.Color("#07111a");
   this.camera=new THREE.OrthographicCamera(-9,9,9,-9,.1,200);
   this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
   this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
   this.renderer.outputColorSpace=THREE.SRGBColorSpace;
   mount.appendChild(this.renderer.domElement);
   this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
   this.night=true;this.floor=10;this.col=1;this.cameraX=0;this.cameraY=roomY(10);this.targetCameraX=0;this.targetCameraY=this.cameraY;
   this.viewHeight=16.1;this.targetViewHeight=16.1;this.platformX=0;this.platformY=roomY(10);this.platformTargetX=0;this.platformTargetY=this.platformY;this.focused=null;
   this.time=0;this.screenW=1;this.screenH=1;this._textures=[];
   this.buildEnvironment();
   for(let floor=1;floor<=FLOORS;floor++)for(let col=0;col<COLS;col++){let r=this.makeRoom(floor,col);this.rooms.push(r);this.roomMap.set(r.key,r)}
   this.makeGondola();this.makeRain();this.setNight(true);this.resize();
   window.addEventListener("resize",()=>this.resize());
 }
 buildEnvironment(){
   const base=box(20.2,61.0,1.1,"#121c24",0,29,-4.85,this.scene);
   for(let y=0;y<13;y++){box(20.5,.25,1.55,"#243039",0,y*FLOOR_H-.01,-3.89,this.scene);box(20.5,.045,1.7,"#42505b",0,y*FLOOR_H+.09,-3.82,this.scene)}
   for(let x of [-9.52,-3.05,3.05,9.52]){box(.34,61,1.35,"#1b2730",x,29,-3.97,this.scene);box(.045,61,1.4,"#3b4650",x-.18,29,-3.8,this.scene)}
   for(let i=0;i<220;i++){const x=rand(27,i)*19.8-9.9,y=rand(56,i)*59;
    const w=rand(33,i)*.6+.1;quad(w,.07,i%3?"#202c34":"#293540",x,y,-4.14,this.scene)}
   // Rooftop piping and an ominous antenna.
   box(20.2,.48,1.7,"#26343e",0,58.1,-3.8,this.scene);box(2.1,.17,1.9,"#4e5556",-6.6,58.4,-3.9,this.scene);
   box(.09,5,.09,"#4d5c66",6.8,60,-5.4,this.scene);
   for(let i=0;i<4;i++)box(1.1,.045,.07,"#637681",6.8,58.5+i*.9,-5.4,this.scene);
   // Skyline silhouettes are separate planes at several Z depths.
   const sky=quad(250,160,"#0c1824",0,29,-70,this.scene);sky.material.color.set("#0b1420");
   for(let i=0;i<52;i++){const x=(i-26)*3.5+rand(10,i)*1.7,h=5+rand(11,i)*39;
    quad(2.8+rand(15,i)*2.2,h,i%3===0?"#111e27":"#101a23",x,h/2-8,-37+rand(9,i)*7,this.scene);
    for(let j=0;j<12;j++)if(rand(i+3,j)>.74){quad(.18,.31,"#4f4b46",x-1+rand(i+6,j)*2.3,j*1.75-6,-31.5,this.scene)}
   }
   // Pale moon behind the architecture.
   const moon=quad(4.4,4.4,"#c6c6b3",16.5,49,-53,this.scene);
   moon.material.map=(()=>{const[c,ctx]=canvas2d(128,128);const g=ctx.createRadialGradient(64,64,4,64,64,64);g.addColorStop(0,"rgba(221,230,213,.9)");g.addColorStop(.58,"rgba(180,196,194,.7)");g.addColorStop(.68,"rgba(153,182,185,.15)");g.addColorStop(1,"rgba(153,182,185,0)");ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return texFromCanvas(c)})();
   moon.material.transparent=true;moon.material.depthWrite=false;
   for(let i=0;i<45;i++)if(i%5===0){const x=rand(11,i)*45-22,y=rand(20,i)*63;quad(.024,.024,"#a2aeb1",x,y,-41,this.scene)}
 }
 makeRoom(floor,col){
   const story=findStory(floor,col),seed=floor*69+col*193;
   const theme=story?.theme||["home","sleep","kitchen","studio","vintage","plants","study","dining"][(floor*3+col)%8];
   const room={floor,col,key:floor+"-"+col,number:String(floor).padStart(2,"0")+String(col+1).padStart(2,"0"),story,
     title:story?.title||ROOM_NAMES[(floor*3+col)%ROOM_NAMES.length],
     description:story?.description||"An ordinary apartment. Ordinary, at least, from this side of the glass.",
     theme,clean:0,strokes:0,props:[],socialTimer:7+rand(seed,21)*13,anchors:{center:0,wander:0,window:1.55,bed:-1.6,table:-1,desk:-1.3,chair:1.25,shelf:1.55},group:new THREE.Group(),actors:[]};
   room.group.position.set(roomX(col),roomY(floor),0);this.scene.add(room.group);
   const palette=THEMES[theme]||THEMES.home;
   const back=quad(5.65,3.64,"#ffffff",0,0,-3.42,room.group);back.material.map=wallpaper(room);back.material.color.set("#faf0e2");room.back=back;
   box(.045,3.68,3.55,"#4a4645",-2.78,0,-1.67,room.group);box(.045,3.68,3.55,"#292f33",2.78,0,-1.67,room.group);
   box(5.65,.16,3.62,"#3a3436",0,-1.84,-1.65,room.group);
   const floorMesh=new THREE.Mesh(new THREE.PlaneGeometry(5.65,3.55),mat("#3a302f"));floorMesh.rotation.x=-Math.PI/2;floorMesh.position.set(0,-1.75,-1.67);room.group.add(floorMesh);
   for(let i=0;i<9;i++){box(5.6,.007,.014,"#64524c",0,-1.747,-3.2+i*.4,room.group)}
   box(5.65,.12,3.6,"#252a2e",0,1.88,-1.6,room.group);
   // Room props: material depth positions create genuine parallax through the windows.
   const baseProps=story?.props||(["sofa","chair","lamp","plant","books","photo","mug"].slice(0,5+(seed%3)));
   let furniture=0,small=0,wall=0;
   for(let i=0;i<baseProps.length;i++){
     const kind=baseProps[i];const [w,h]=PROP_SIZE[kind]||[1,1];const art=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:propCanvas(kind,seed+i*9),transparent:true,alphaTest:.07,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
     let x,y,z;
     if(WALL_PROPS.has(kind)){
       x=[-1.36,.85,1.62,-.65][wall%4];y=.4+(wall%2)*.45;z=-3.17+wall*.003;wall++;
       if(kind==="curtain"){x=(wall%2?2.32:-2.32);y=0;z=-.03}
     }else if(SMALL_PROPS.has(kind)){
       x=[-1.45,-.45,1.4,.75][small%4]+(rand(seed,i)-.5)*.3;
       y=[-.48,-.85,-.73,-.41][small%4];z=-1.58+(small%2)*.18;small++;
     }else{
       x=[-1.25,1.32,-.2][furniture%3];y=-1.69+h/2;z=-2.45+furniture*.28;furniture++;
       if(kind==="lamp"){x=2.0;y=-1.68+h/2;z=-2.52}
       if(kind==="shelf"){x=2.05;z=-3.0}
       if(kind==="bed"||kind==="crib"){x=-1.45;z=-2.6}
       if(kind==="desk"||kind==="table"||kind==="dining")room.anchors.table=x,room.anchors.desk=x;
       if(kind==="chair"||kind==="sofa")room.anchors.chair=x;
       if(kind==="bed"||kind==="rocker")room.anchors.bed=x;
       if(kind==="shelf")room.anchors.shelf=x;
     }
     art.position.set(x,y,z);art.renderOrder=z>-1?4:1;room.group.add(art);
     room.props.push({kind,mesh:art,x,y,z,seed:seed+i*9});
   }
   // Golden practical light. The 3D walls and illustrated props share a common value structure.
   const glow=new THREE.Mesh(new THREE.PlaneGeometry(4.8,3.5),new THREE.MeshBasicMaterial({map:makeGlow(palette[1]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.44,toneMapped:false}));
   glow.position.set(1.4,.3,-3.1);glow.renderOrder=2;room.group.add(glow);room.glow=glow;
   const cast=story?.cast||generateResidents(floor,col);
   cast.forEach((spec,i)=>{room.actors.push(new Person(spec,room,i))});
   // Exterior masonry, beveled frames and imperfect pane.
   const frame="#20282e",trim="#627078";
   const makeBar=(w,h,x,y,z,color=frame)=>box(w,h,.23,color,x,y,z,room.group);
   makeBar(5.92,.18,0,1.91,2.03);makeBar(5.92,.22,0,-1.91,2.03);
   makeBar(.18,3.9,-2.89,0,2.03);makeBar(.18,3.9,2.89,0,2.03);
   makeBar(.075,3.73,0,0,2.09,"#3c474d");makeBar(5.67,.052,0,.12,2.09,"#424d54");
   makeBar(5.86,.025,0,-1.99,2.18,trim);
   makeBar(.036,3.71,-2.99,0,2.18,trim);
   const gc=grime(seed),gt=texFromCanvas(gc[0]);
   const glass=new THREE.Mesh(new THREE.PlaneGeometry(5.65,3.65),new THREE.MeshBasicMaterial({map:gt,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
   glass.position.z=2.25;glass.renderOrder=7;room.group.add(glass);room.grimeCanvas=gc[0];room.grimeCtx=gc[1];room.grimeTexture=gt;
   // Tiny believable window reflections, not an opaque UI overlay.
   let reflection=quad(.025,3.56,"#c1ccc5",2.32,0,2.27,room.group);reflection.material.transparent=true;reflection.material.opacity=.08;
   const hit=new THREE.Mesh(new THREE.PlaneGeometry(5.62,3.64),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
   hit.position.z=2.52;hit.userData.room=room;room.group.add(hit);room.hit=hit;this.hitMeshes.push(hit);
   return room;
 }
 makeGondola(){
   this.gondola=new THREE.Group();this.scene.add(this.gondola);
   box(3.27,.16,1.03,"#46535c",0,-1.64,4.35,this.gondola);
   box(3.3,.07,1.1,"#c4a37c",0,-1.55,4.35,this.gondola);
   for(let x of [-1.61,1.61]){box(.06,1.25,.05,"#819096",x,-1.01,4.72,this.gondola)}
   box(3.26,.055,.05,"#65747c",0,-.39,4.73,this.gondola);
   for(let x of [-.75,0,.75])box(.027,.92,.025,"#596973",x,-1.03,4.73,this.gondola);
   box(3.35,.04,.07,"#69747b",0,-1.29,4.77,this.gondola);
   // Window-cleaner is a stylized hand-drawn figure, clearly separated from the residents.
   const[c,ctx]=canvas2d(160,220);ctx.translate(80,205);
   ellipse(ctx,4,-11,47,9,"rgba(1,3,6,.2)");
   stroke(ctx,[[-14,-79],[-18,-31],[-27,-4]],"#1a242b",17);stroke(ctx,[[14,-79],[18,-31],[25,-4]],"#1a242b",17);
   fillPoly(ctx,[[-36,-143],[-19,-160],[18,-160],[36,-140],[29,-74],[-24,-74]],"#d2ad78");
   stroke(ctx,[[-33,-134],[-46,-96],[-36,-82]],"#c9a77d",17);stroke(ctx,[[31,-135],[51,-100],[58,-85]],"#b89a71",16);
   rect(ctx,-12,-169,25,28,"#8e6955");ellipse(ctx,0,-185,25,29,"#a0785c");fillPoly(ctx,[[-29,-194],[-20,-221],[25,-218],[30,-194]],"#252b31");
   stroke(ctx,[[49,-92],[81,-114]],"#b8c4c9",5);stroke(ctx,[[65,-106],[93,-106]],"#a0bdc6",13);
   const tex=texFromCanvas(c);const worker=new THREE.Mesh(new THREE.PlaneGeometry(1.44,2.02),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide}));worker.position.set(-.78,-.64,4.46);worker.renderOrder=10;this.gondola.add(worker);this.worker=worker;
   this.ropeGeom=new THREE.BufferGeometry();this.ropeGeom.setAttribute("position",new THREE.BufferAttribute(new Float32Array(12),3));
   const rope=new THREE.LineSegments(this.ropeGeom,new THREE.LineBasicMaterial({color:"#6b7880",transparent:true,opacity:.65}));this.scene.add(rope);
 }
 makeRain(){
   const count=370;this.rainData=Array.from({length:count},(_,i)=>({x:rand(i,4)*38-19,y:rand(i,7)*70-6,z:4+rand(i,11)*11,spd:4+rand(i,13)*8,len:.1+rand(i,15)*.48}));
   const pos=new Float32Array(count*6);this.rainGeom=new THREE.BufferGeometry();this.rainGeom.setAttribute("position",new THREE.BufferAttribute(pos,3));
   this.rain=new THREE.LineSegments(this.rainGeom,new THREE.LineBasicMaterial({color:"#7b9aa1",transparent:true,opacity:.26,depthWrite:false}));
   this.rain.frustumCulled=false;this.rain.renderOrder=19;this.scene.add(this.rain);
 }
 resize(){
   this.screenW=this.mount.clientWidth||window.innerWidth;this.screenH=this.mount.clientHeight||window.innerHeight;
   this.renderer.setSize(this.screenW,this.screenH,false);this.syncCamera();
 }
 syncCamera(){
   const aspect=this.screenW/this.screenH;
   this.camera.left=-this.viewHeight*aspect/2;this.camera.right=this.viewHeight*aspect/2;
   this.camera.top=this.viewHeight/2;this.camera.bottom=-this.viewHeight/2;this.camera.updateProjectionMatrix();
 }
 stageBeat(room,beat){
   if(!room.story||room.visualBeat===beat)return;
   room.visualBeat=beat;
   if(room.beatVisual){room.group.remove(room.beatVisual);room.beatVisual.geometry.dispose();room.beatVisual.material.map?.dispose();room.beatVisual.material.dispose();room.beatVisual=null}
   const id=room.story.id;
   const gestures={
     "second-plate":["tea","remember","sleep"],"cipher":["work","panic","hide"],
     "red-dress":["dance","argue","kiss"],"thirteenth":["wonder","freeze","fear"],
     "lullaby":["protect","fear","relief"],"overtime":["sleep","work","relief"],
     "neighbors":["phone","tender","embrace"],"greenhouse":["work","wonder","window"],
     "three-knocks":["fear","panic","window"],"moving":["work","hide","freeze"],
     "waltz":["dance","dance","rest"],"witness":["work","point","window"]
   };
   const sceneGesture=gestures[id]?.[beat]||"think";
   for(const [i,p] of room.actors.entries())p.react(i===1&&["kiss","embrace","tender","dance"].includes(sceneGesture)?sceneGesture:i===1?"window":sceneGesture);
   if(["cipher","thirteenth","three-knocks","lullaby"].includes(id))room.flicker=2.8;
   if(id==="moving"&&beat>=2){
     for(const p of room.props)p.mesh.visible=p.kind==="chair";
     for(const a of room.actors)a.sprite.visible=false;
   }
   // These transient symbols are part of the actual Three.js room, not UI illustrations.
   const [c,ctx]=canvas2d(256,256);
   let x=0,y=-.18,z=-1.1,w=1.6,h=2.35,visible=true;
   ctx.save();ctx.translate(128,128);
   if((id==="second-plate"&&beat===1)||(id==="waltz"&&beat===1)){
     x=1.16;y=-.48;z=-1.55;
     ctx.shadowBlur=19;ctx.shadowColor="#d3dfec";
     ellipse(ctx,0,-58,25,34,"rgba(170,187,197,.30)");
     fillPoly(ctx,[[-27,-39],[30,-39],[65,106],[-66,106]],id==="waltz"?"rgba(82,128,151,.30)":"rgba(145,159,173,.24)");
     ellipse(ctx,0,-57,23,32,"rgba(185,207,215,.23)");
   }else if(id==="lullaby"&&beat===1){
     x=.8;y=.1;z=2.32;w=1.2;h=1.2;
     for(let i=0;i<5;i++){const ox=(i-2)*16;ellipse(ctx,ox,-22-(i%2)*11,8,18,"rgba(219,232,229,.32)")}
     ellipse(ctx,0,35,39,49,"rgba(219,232,229,.25)");
   }else if(id==="thirteenth"){
     x=.7;y=.23;z=-3.02;w=1.55;h=1.65;
     ctx.fillStyle="rgba(173,65,62,.46)";ctx.font="bold 155px Georgia";ctx.textAlign="center";ctx.fillText("13",0,51);
   }else if(id==="red-dress"&&beat>=1){
     x=1.4;y=-.6;z=-1.25;w=1.2;h=2.0;
     fillPoly(ctx,[[-24,-78],[23,-78],[38,-41],[72,110],[-69,110],[-37,-41]],"rgba(158,37,56,.88)");
     stroke(ctx,[[-18,-65],[5,-20],[28,77]],"rgba(235,133,129,.35)",4);
   }else if(id==="greenhouse"&&beat===2){
     x=1.9;y=.1;z=.6;w=1.0;h=1.3;
     for(let i=0;i<9;i++){const t=i*Math.PI*2/9;ellipse(ctx,Math.cos(t)*44,Math.sin(t)*46,31,15,"rgba(89,146,91,.51)")}
     ellipse(ctx,0,0,40,29,"rgba(193,200,116,.68)");ellipse(ctx,0,0,17,25,"rgba(25,59,43,.85)");ellipse(ctx,2,-2,6,10,"rgba(7,21,24,.93)");
   }else if(id==="witness"&&beat>=1){
     x=.5;y=.42;z=-2.96;w=1.8;h=1.1;
     ctx.fillStyle="rgba(194,178,154,.75)";ctx.fillRect(-109,-42,218,110);
     ctx.fillStyle="#7c2f38";ctx.font="bold 51px Georgia";ctx.textAlign="center";ctx.fillText("PANE",0,24);
   }else if(id==="cipher"){
     x=1.55;y=.32;z=-2.9;w=1.05;h=1.05;
     ellipse(ctx,0,0,52,52,"rgba(182,53,52,.18)");ellipse(ctx,0,0,13,13,"rgba(248,73,60,.75)");
   }else if(id==="three-knocks"&&beat===2){
     x=1.26;y=-.35;z=-1.7;w=1.1;h=1.4;
     for(let i=0;i<5;i++){let xx=-68+i*35;ellipse(ctx,xx,-59,8,18,"rgba(210,197,158,.8)");stroke(ctx,[[xx,-42],[xx,50]],"rgba(204,190,161,.76)",5);stroke(ctx,[[xx,22],[xx+14,22]],"rgba(204,190,161,.76)",5)}
   }else visible=false;
   ctx.restore();
   if(visible){
     const texture=texFromCanvas(c);
     const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
     const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);
     mesh.position.set(x,y,z);mesh.renderOrder=9;room.group.add(mesh);room.beatVisual=mesh;
   }
 }
 setNight(v){this.night=!!v;this.scene.background.set(v?"#07111a":"#2c3740");
   for(const r of this.rooms){r.back.material.color.set(v?"#a0a19e":"#d7d6cb");r.glow.material.opacity=v?.5:.21}
   this.rain.material.opacity=v?.25:.16;
 }
 getRoom(floor,col){return this.roomMap.get(clamp(floor,1,12)+"-"+clamp(col,0,2))}
 move(floor,col){
   this.floor=clamp(floor,1,12);this.col=clamp(col,0,2);
   this.platformTargetX=roomX(this.col);this.platformTargetY=roomY(this.floor);
   this.focused=null;this.targetViewHeight=this.screenW<680?20:16.1;
   this.targetCameraX=this.platformTargetX;this.targetCameraY=this.platformTargetY;
 }
 focus(room){
   this.floor=room.floor;this.col=room.col;this.focused=room;
   this.platformTargetX=roomX(room.col);this.platformTargetY=roomY(room.floor);
   const aspect=this.screenW/this.screenH;
   this.targetViewHeight=Math.max(6.7,6.55/aspect);
   this.targetCameraX=roomX(room.col)+(this.screenW>680?1.75:0);
   this.targetCameraY=roomY(room.floor)-(this.screenW<680?.9:0);
 }
 defocus(){this.move(this.floor,this.col)}
 pointerRoom(clientX,clientY){
   const bounds=this.renderer.domElement.getBoundingClientRect();
   this.pointer.set(((clientX-bounds.left)/bounds.width)*2-1,-((clientY-bounds.top)/bounds.height)*2+1);
   this.raycaster.setFromCamera(this.pointer,this.camera);
   const hit=this.raycaster.intersectObjects(this.hitMeshes,false)[0];
   return hit?{room:hit.object.userData.room,uv:hit.uv}:null;
 }
 wipe(room,uv,previous=null){
   if(!room)return;
   const ctx=room.grimeCtx,w=room.grimeCanvas.width,h=room.grimeCanvas.height;
   const p={x:uv.x*w,y:(1-uv.y)*h},q=previous?{x:previous.x*w,y:(1-previous.y)*h}:p;
   ctx.save();ctx.globalCompositeOperation="destination-out";ctx.strokeStyle="#000";ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=57;
   ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(p.x+.1,p.y+.1);ctx.stroke();
   ctx.beginPath();ctx.arc(p.x,p.y,25,0,TAU);ctx.fillStyle="#000";ctx.fill();ctx.restore();
   const dist=Math.hypot(p.x-q.x,p.y-q.y);room.strokes+=dist;
   room.clean=clamp(room.clean+(previous?dist/520*.22:.019),0,1);
   room.grimeTexture.needsUpdate=true;
   return room.clean;
 }
 update(dt,t){
   this.time+=dt;
   const k=1-Math.exp(-dt*3.15);
   this.platformX=lerp(this.platformX,this.platformTargetX,k*1.1);
   this.platformY=lerp(this.platformY,this.platformTargetY,k*.85);
   this.cameraX=lerp(this.cameraX,this.targetCameraX,k);
   this.cameraY=lerp(this.cameraY,this.targetCameraY,k);
   this.viewHeight=lerp(this.viewHeight,this.targetViewHeight,k);
   this.gondola.position.set(this.platformX,this.platformY,0);
   const coords=this.ropeGeom.attributes.position.array,top=60.8;
   for(let i=0;i<2;i++){let x=this.platformX+(i?1.44:-1.44);let o=i*6;coords[o]=x;coords[o+1]=this.platformY-.38;coords[o+2]=4.45;coords[o+3]=x;coords[o+4]=top;coords[o+5]=4.45}
   this.ropeGeom.attributes.position.needsUpdate=true;
   this.worker.rotation.z=Math.sin(this.time*1.6)*.012;
   this.camera.position.set(this.cameraX+2.15,this.cameraY+1.25,34);
   this.camera.lookAt(this.cameraX,this.cameraY,-1);
   this.syncCamera();
   for(const room of this.rooms){const near=Math.abs(roomY(room.floor)-this.cameraY)<this.viewHeight*1.1&&Math.abs(roomX(room.col)-this.cameraX)<18;
     for(const person of room.actors)person.update(dt,t,this.night,near&&room===this.focused);
     if(near){
       // The set dressing breathes and sometimes changes when residents use it.
       for(const item of room.props){
         if(["plant","flowers","curtain"].includes(item.kind)){
           item.mesh.rotation.z=Math.sin(this.time*(.65+rand(item.seed,1)*.5)+item.seed)*.012;
           item.mesh.position.x=item.x+Math.sin(this.time*.8+item.seed)*.015;
         }else if(item.kind==="record")item.mesh.rotation.z=Math.sin(this.time*.25)*.008;
         if(item.kind==="phone"){
           const user=room.actors.find(a=>a.current?.id==="phone"&&Math.abs(a.x-item.x)<.9);
           item.mesh.visible=!user;
         }
       }
       if(room.actors.length>1){
         room.socialTimer-=dt;
         if(room.socialTimer<=0){
           const [a,b]=room.actors;
           if(a.needs.fear>.56||b.needs.fear>.56){
             a.react("protect",{connection:.08,safety:.08});b.react("recoil",{fear:-.05});
           }else if((a.needs.stress+b.needs.stress)>.98&&Math.random()<.42){
             a.react("argue",{stress:.07,connection:-.08});b.react("recoil",{stress:.09,connection:-.07});
           }else if(a.needs.desire+b.needs.desire>1.04||a.needs.connection+b.needs.connection<.92){
             const intimate=Math.random()<.32?"embrace":"tender";
             a.react(intimate,{connection:.13,stress:-.07});b.react(intimate,{connection:.13,stress:-.07});
           }else{
             a.react("laugh",{connection:.07,stress:-.06});b.react("wave",{connection:.05});
           }
           room.socialTimer=11+Math.random()*18;
         }
       }
     }
   }
   const buf=this.rainGeom.attributes.position.array;for(let i=0;i<this.rainData.length;i++){const p=this.rainData[i];p.y-=dt*p.spd;if(p.y<-8)p.y=65;
     let j=i*6;buf[j]=p.x;buf[j+1]=p.y;buf[j+2]=p.z;buf[j+3]=p.x-.045;buf[j+4]=p.y-p.len;buf[j+5]=p.z}
   this.rainGeom.attributes.position.needsUpdate=true;
   this.renderer.render(this.scene,this.camera);
 }
 dispose(){for(const r of this.rooms)for(const p of r.actors)p.dispose();this.renderer.dispose()}
}
// Utility for a canvas drawing above. Kept local to avoid needing a DOM drawing library.
function rect(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
