// World coordinates are CSS pixels. The camera faces -Z at zero degrees.
// The walk turns east through the black gallery, then north through the iris.
export const stations=[0,1,2,3,4,4,4,5,6,6,7,8,9];
export const chapterStation=id=>stations.indexOf(id);
const clamp=n=>Math.min(1,Math.max(0,n));
const blend=(a,b,t)=>a+(b-a)*t;
function put(el,w,h,x,y,z,yaw=0,pitch=0,roll=0){
 el.style.width=w+'px';el.style.height=h+'px';
 el.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px) rotateY('+yaw+'deg) rotateX('+pitch+'deg) rotateZ('+roll+'deg) translate(-50%,-50%)';
}
const pose=(x,z,yaw,y=0,pitch=0)=>[x,z,yaw,y,pitch];
export function layoutHall(stage,boards,architecture){
 const W=stage.clientWidth,H=stage.clientHeight,L=Math.max(.76*W,.76*H);
 const D=L*1.13,S=W*1.07,F=H*.54,C=-H*.62,height=F-C,mid=(F+C)/2;
 const set=document.createDocumentFragment();
 function face(cls,w,h,x,y,z,ry=0,rx=0,rz=0){
  const f=document.createElement('div');f.className='surface '+cls;
  put(f,w,h,x,y,z,ry,rx,rz);set.append(f);return f;
 }
 function walls(material,x0,x1,z0,z1,{north=true,south=true,west=true,east=true}={}){
  const w=x1-x0,d=z1-z0,x=(x0+x1)/2,z=(z0+z1)/2;
  face(material+' ground',w+2,d+2,x,F,z,0,90);
  face(material+' roof',w+2,d+2,x,C,z,0,-90);
  if(north)face(material+' masonry',w,height,x,mid,z0);
  if(south)face(material+' masonry',w,height,x,mid,z1,180);
  if(west)face(material+' masonry',d,height,x0,mid,z,90);
  if(east)face(material+' masonry',d,height,x1,mid,z,-90);
 }
 function transverse(x,z,w,yaw,type,depth=0){
  // Every opening has an empty centre. Only the jambs and soffit are painted.
  for(const offset of depth?[0,depth]:[0]){
   const a=yaw*Math.PI/180;
   face('opening '+type,w,height+1,x+Math.sin(a)*offset,mid,z+Math.cos(a)*offset,yaw);
  }
 }
 function board(id,w,h,x,y,z,yaw=0){
  put(boards[id],w,h,x,y,z,yaw);
 }
 // Copper vestibule and the L-shaped pair of landscape murals.
 const goldZ=-2.15*S,back=goldZ-D;
 walls('copper',-D,D,back,.6*S,{east:false});
 const openEnd=goldZ+D;
 face('copper masonry',.6*S-openEnd,height,D,mid,(.6*S+openEnd)/2,-90);
 transverse(0,-1.58*S,D*2,0,'goldDoor',-18);
 board(0,W*.97,H*.98,-D+8,0,0,90);
 board(1,W*.95,H*.89,-D+8,-H*.015,-S,90);
 board(2,Math.min(1.2*W,2.28*D),H*.84,-D+12,-H*.035,goldZ,90);
 board(3,Math.min(1.85*D,1.13*W),H*.98,0,-H*.045,back+12);
 // Black-box print gallery, running east from the gold room.
 const extra=W*(W<660?2.65:1.42),printW=W*.94+extra,firstX=D+W*.66;
 const exitX=firstX+extra+D*1.4,endX=exitX+D;
 const north=goldZ-D,south=goldZ+D,vestHalf=Math.min(.86*D,.8*W);
 walls('noir',D,endX,north,south,{west:false,north:false});
 const n1=exitX-vestHalf,n2=exitX+vestHalf;
 face('noir masonry',n1-D,height,(D+n1)/2,mid,north);
 face('noir masonry',endX-n2,height,(n2+endX)/2,mid,north);
 transverse(D,goldZ,D*2,90,'blackDoor',18);
 board(4,printW,H*.84,firstX+extra/2,-H*.035,north+12);
 board(5,Math.min(1.86*D,1.14*W),H*.93,endX-12,-H*.03,goldZ,-90);
 // A warm plaster lobby connects to a passage of progressively rotated openings.
 const lobbyEnd=north-D*1.48,tunnelEnd=lobbyEnd-2.6*D;
 walls('rose',n1,n2,lobbyEnd,north,{north:false,south:false});
 transverse(exitX,north,vestHalf*2,0,'roseDoor',-10);
 board(6,Math.min(W*.87,D*1.21,W*.97*(vestHalf+.05*D-12)/L),Math.min(H*.6,H*.82*(vestHalf+.05*D-12)/L),n1+12,-H*.015,north-.77*D,90);
 walls('rose',n1,n2,tunnelEnd,lobbyEnd,{north:false,south:false});
 const portalCount=16;
 for(let j=0;j<portalCount;j++){
  const t=j/(portalCount-1),z=blend(lobbyEnd,tunnelEnd,t);
  const rim=face('iris',2*vestHalf,height+2,exitX,mid,z);
  const vertices=Array.from({length:8},(_,k)=>{
   const a=(k/8+t*.19)*Math.PI*2;
   return [50+34*Math.cos(a),50+43*Math.sin(a)];
  });
  const outer=vertices.map(([x,y])=>[50+(x-50)*4,50+(y-50)*4]);
  const poly=vertices.map((p,k)=>{
   const n=(k+1)%8,light=Math.round(43+9*Math.cos(k*.8+t*2));
   return '<polygon points="'+[p,vertices[n],outer[n],outer[k]].map(v=>v.join(',')).join(' ')+'" fill="hsl(339 19% '+light+'%)" stroke="#836871" stroke-width=".18"/>';
  }).join('');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">'+poly+'<polygon points="'+vertices.map(v=>v.join(',')).join(' ')+'" fill="none" stroke="#c8a7a4" stroke-width=".49"/></svg>';
  rim.style.backgroundImage='url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
 }
 face('runner',vestHalf*.71,north-tunnelEnd,exitX,F-3,(north+tunnelEnd)/2,0,90);
 // Luminous final pavilion. The previous room remains visible through its door.
 const iceZ=tunnelEnd-1.32*D,lastZ=iceZ-1.72*D,iceL=exitX-1.36*D,iceR=exitX+1.36*D;
 walls('ice',iceL,iceR,lastZ,tunnelEnd,{south:false});
 face('ice masonry',n1-iceL,height,(iceL+n1)/2,mid,tunnelEnd,180);
 face('ice masonry',iceR-n2,height,(n2+iceR)/2,mid,tunnelEnd,180);
 board(7,Math.min(1.95*D,1.15*W),H*.92,iceL+12,-H*.04,iceZ,90);
 board(8,W*.94,H*.88,iceR-12,0,iceZ-.43*D,-90);
 board(9,W*.96,H*.82,exitX,0,lastZ+12);
 for(const sign of [-1,1]){
  const sx=exitX+sign*D*.89;
  const f=face('lightFin',D*.20,H*.78,sx,0,lastZ+D*.15,sign*24);
  const ring=document.createElement('i');f.append(ring);
 }
 // Recessed lamp tracks and warm pools of light along the print wall.
 for(let j=0;j<7;j++){
  const x=firstX-extra*.01+((j-1)*printW/7);
  face('wallwash',printW/6,H*.85,x,-H*.1,north+4);
 }
 architecture.replaceChildren(set);
 stage.style.perspective=L+'px';
 // Frame the opening wall face-on with a viewport-relative margin on both sides.
 const openingX=-D+8+L*1.025;
 const poses=[
  pose(openingX,0,90),pose(-.08*L,-S,90),
  pose(.03*L,goldZ+W*.055,84),pose(0,goldZ,0),
  pose(firstX,goldZ,0),pose(firstX+extra*.5,goldZ,0),pose(firstX+extra,goldZ,0),
  pose(exitX,goldZ,-90),pose(exitX+.05*D,north-.74*D,87),
  pose(iceL+D,iceZ+W*.05,86),pose(iceR-D,iceZ-.43*D,-88),pose(exitX,lastZ+D,0)];
 // Each transition is a small camera shot. Intermediate points align the lens
 // with a real doorway before passing its plane.
 const paths=poses.slice(0,-1).map((a,i)=>[a,poses[i+1]]);
 const shot=(i,...between)=>{paths[i]=[poses[i],...between,poses[i+1]];};
 shot(1,pose(-.03*L,-1.3*S,40),pose(0,-1.59*S,4,0,1),pose(0,-1.89*S,21));
 shot(2,pose(.03*L,goldZ+.13*D,54),pose(.05*L,goldZ+.12*D,24));
 shot(3,pose(.4*D,goldZ,-42),pose(.92*D,goldZ,-85),pose(1.14*D,goldZ,-76));
 shot(6,pose(firstX+extra+D*.47,goldZ,-24),pose(exitX-.34*D,goldZ,-57));
 shot(7,pose(exitX,goldZ-.3*D,-46),pose(exitX,north+.12*D,-5),pose(exitX,north-.35*D,30));
 shot(8,pose(exitX,north-1.1*D,43),pose(exitX,lobbyEnd+.08*D,3),pose(exitX,lobbyEnd-.9*D,0,-.02*H),
      pose(exitX,tunnelEnd+.65*D,0,-.02*H),pose(exitX,tunnelEnd-.18*D,7),pose(exitX-.15*D,iceZ+.4*D,48));
 shot(9,pose(exitX-.18*D,iceZ,44),pose(exitX,iceZ-.15*D,0),pose(exitX+.18*D,iceZ-.34*D,-44));
 shot(10,pose(exitX+.2*D,iceZ-.52*D,-48),pose(exitX+.12*D,iceZ-.58*D,-22));
 const irisShot=paths[8];
 paths.splice(8,1,irisShot.slice(0,4),irisShot.slice(3));
 return {lens:L,paths,W,H};
}
// Centripetal-like camera easing with bounded Hermite tangents. Flatten tangents
// at direction changes to avoid clipping the aperture or reversing near a stop.
function tangent(left,right){return left*right<=0?0:2*left*right/(left+right);}
function sample(path,t){
 const n=path.length-1,k=Math.min(n-1,Math.floor(t*n)),u=t*n-k,u2=u*u,u3=u2*u;
 const a=path[k],b=path[k+1],prev=path[Math.max(0,k-1)],next=path[Math.min(n,k+2)];
 return a.map((v,j)=>{const d=b[j]-v,m=tangent(v-prev[j],d),q=tangent(d,next[j]-b[j]);
 return (2*u3-3*u2+1)*v+(u3-2*u2+u)*m+(-2*u3+3*u2)*b[j]+(u3-u2)*q;});
}
export function positionCamera(world,layout,value,reduced){
 const {lens,paths}=layout,v=reduced?Math.round(value):value;
 const i=Math.min(paths.length-1,Math.floor(v)),t=clamp(v-i);
 const [x,z,yaw,y,pitch]=sample(paths[i],t);
 world.style.transform='translateZ('+lens+'px) rotateX('+pitch+'deg) rotateY('+(-yaw)+'deg) translate3d('+(-x)+'px,'+(-y)+'px,'+(-z)+'px)';
}
