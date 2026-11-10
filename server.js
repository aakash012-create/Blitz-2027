import http from 'node:http';
import {readFile,mkdir,appendFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const base=path.dirname(fileURLToPath(import.meta.url));
const root=path.join(base,'public');
const inbox=process.env.FESTIVAL_DATA_DIR||path.join(base,'data');
const args=process.argv.slice(2);
const arg=k=>args.includes(k)?args[args.indexOf(k)+1]:undefined;
const port=Number(arg('--port')||process.env.PORT||3000),host=arg('--host')||'127.0.0.1';
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.txt':'text/plain'};
function json(res,status,body){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));}
async function enquiry(req,res){
 if(req.method!=='POST')return json(res,405,{error:'POST is required.'});
 if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'Origin mismatch.'});
 if(!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{error:'JSON is required.'});
 let size=0;const chunks=[];
 for await(const chunk of req){size+=chunk.length;if(size>16000)return json(res,413,{error:'Message too long.'});chunks.push(chunk);}
 let data;try{data=JSON.parse(Buffer.concat(chunks));}catch{return json(res,400,{error:'Invalid message.'});}
 const field=(key,max)=>typeof data?.[key]==='string'?data[key].trim().slice(0,max):'';
 const name=field('name',80),email=field('email',180),message=field('message',2400);
 if(!name||!/^\S+@\S+\.\S+$/.test(email)||message.length<5)return json(res,400,{error:'Please check the name, email and message.'});
 const entry={date:new Date().toISOString(),kind:data.kind==='Sponsors'?'Sponsor':'Contact',name,email,message};
 await mkdir(inbox,{recursive:true});
 await appendFile(path.join(inbox,'enquiries.jsonl'),JSON.stringify(entry)+'\n',{mode:0o600});
 return json(res,201,{ok:true});
}
http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/api/enquiry')return await enquiry(req,res);
  const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!target.startsWith(root+path.sep)||!['GET','HEAD'].includes(req.method)){res.writeHead(403).end();return;}
  const data=await readFile(target);
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch(err){if(err.code==='ENOENT'||err.code==='EISDIR')res.writeHead(404).end('File unavailable');else json(res,500,{error:'Could not complete the request.'});}
}).listen(port,host,()=>console.log('Blitzschlag 2027 is ready at http://'+host+':'+port));
