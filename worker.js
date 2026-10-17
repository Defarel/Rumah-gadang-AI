import { LOGO, GLOBAL_VIDEOS, isAdmin, getId, ADMIN_EMAILS } from './config.js';

export default{
async fetch(req,env){
const url=new URL(req.url);
const GOOGLE_ID = env.GOOGLE_ID;
const GOOGLE_SECRET = env.GOOGLE_SECRET;
const GROQ = env.GROQ_API_KEY;

if(url.protocol==="http:"){
  url.protocol="https:";
  return Response.redirect(url.toString(),301);
}
if(url.pathname==="/home"||url.pathname==="/home/"){
  return Response.redirect("https://www.rumahgadang-ai.my.id/",301);
}
const cors={
  "Content-Type":"application/json",
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":"Content-Type"
};
if(req.method==="OPTIONS") return new Response("",{headers:cors});
if(url.pathname==="/robots.txt"){
  return new Response("User-agent: *\nAllow: /\n",{headers:{"Content-Type":"text/plain"}});
}
if(url.pathname==="/sitemap.xml"){
  let last=new Date().toISOString().split('T')[0];
  let pages=["/","/foto","/video","/ai","/akun","/kantor"];
  let xml=pages.map(p=>`<url><loc>https://www.rumahgadang-ai.my.id${p}</loc><lastmod>${last}</lastmod></url>`).join("");
  let body=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`;
  return new Response(body,{headers:{"Content-Type":"text/xml"}});
}

// DB - VERSI PENDEK BIAR NGGAK ERROR BOS
try{
 if(env.DB){
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis_likes (tulis_id INTEGER, user_email TEXT, PRIMARY KEY(tulis_id, user_email))").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, item_id TEXT, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, time INTEGER)").run();
 }
}catch(e){}

if(url.pathname==="/api/tulis"){
 try{
  if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
  let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all();
  return new Response(JSON.stringify(r.results||[]),{headers:cors});
 }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
}
if(url.pathname==="/api/tulis/add"&&req.method==="POST"){
 try{
  let j=await req.json();
  if(env.DB) await env.DB.prepare("INSERT INTO tulis (id,text,user_email,name,picture,tulisImg,likes,time) VALUES (?,?,?,?,?,?,?,?)").bind(Date.now(),j.text,j.email,j.name||"Anonim",j.picture||"",j.tulisImg||"",0,Date.now()).run();
 }catch(e){}
 return new Response(JSON.stringify({ok:true}),{headers:cors});
}
if(url.pathname==="/api/videos"){
 let local=[]; let blocked=[];
 try{
  if(env.DB){
   let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();
   local=r.results?.map(x=>x.id)||[];
   let b=await env.DB.prepare("SELECT id FROM blocked_videos").all();
   blocked=b.results?.map(x=>x.id)||[];
  }
 }catch(e){}
 let all=[...new Set([...local,...GLOBAL_VIDEOS])];
 all=all.filter(id=>!blocked.includes(id));
 return new Response(JSON.stringify(all),{headers:cors});
}
if(url.pathname==="/api/videos/add"&&req.method==="POST"){
 try{
  let b=await req.json();
  let id=getId(b.ytUrl);
  if(!id) return new Response(JSON.stringify({ok:false,msg:"Link salah Bos"}),{headers:cors});
  if(env.DB) await env.DB.prepare("INSERT OR IGNORE INTO local_videos (id,created_at) VALUES (?,?)").bind(id,Date.now()).run();
  return new Response(JSON.stringify({ok:true,id:id}),{headers:cors});
 }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:cors}); }
}
if(url.pathname==="/api/images"){
 try{
  if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
  let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
  return new Response(JSON.stringify(r.results||[]),{headers:cors});
 }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
}
if(url.pathname==="/api/images/add"&&req.method==="POST"){
 try{
  let j=await req.json();
  if(env.DB) await env.DB.prepare("INSERT INTO images (url,time) VALUES (?,?)").bind(j.url,Date.now()).run();
 }catch(e){}
 return new Response(JSON.stringify({ok:true}),{headers:cors});
}
if(url.pathname==="/api/ig-curated"){
 try{
  if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
  let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();
  return new Response(JSON.stringify(r.results||[]),{headers:cors});
 }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
}
if(url.pathname==="/api/ig-curated/add"&&req.method==="POST"){
 try{
  let j=await req.json();
  if(env.DB) await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,time) VALUES (?,?,?,?,?)").bind(j.akun||"minang",j.img,j.linkIG,j.caption||"",Date.now()).run();
  return new Response(JSON.stringify({ok:true}),{headers:cors});
 }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:cors}); }
}
if(url.pathname==="/api/ai"&&req.method==="POST"){
 try{
  let j=await req.json();
  let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{
   method:"POST",
   headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},
   body:JSON.stringify({
    model:"openai/gpt-oss-120b",
    messages:[
     {role:"system",content:"Kamu Rumah Gadang AI Bos, buatan Tim Rumah Gadang AI Padang Bos! Jawab pendek maksimal 2 kalimat pakai kata Bos!"},
     {role:"user",content:j.prompt}
    ],
    max_tokens:120
   })
  });
  let d=await r.json();
  return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:cors});
 }catch(e){ return new Response(JSON.stringify({reply:"Error Bos"}),{headers:cors}); }
}
if(url.pathname==="/api/delete"&&req.method==="POST"){
 try{
  let {type,id,email}=await req.json();
  if(!isAdmin(email)) return new Response(JSON.stringify({ok:false}),{headers:cors});
  if(type==="tulis"&&env.DB) await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(id).run();
  if(type==="foto"&&env.DB) await env.DB.prepare("DELETE FROM images WHERE id=?").bind(id).run();
  if(type==="ig"&&env.DB) await env.DB.prepare("DELETE FROM ig_curated WHERE id=?").bind(id).run();
  if(type==="video"&&env.DB){
   await env.DB.prepare("DELETE FROM local_videos WHERE id=?").bind(id).run();
   await env.DB.prepare("INSERT OR IGNORE INTO blocked_videos (id) VALUES (?)").bind(id).run();
  }
  return new Response(JSON.stringify({ok:true}),{headers:cors});
 }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:cors}); }
}
if(url.pathname.startsWith("/api/auth/")){
 if(url.pathname==="/api/auth/google"){
  let redirect="https://www.rumahgadang-ai.my.id/api/auth/callback";
  return Response.redirect("https://accounts.google.com/o/oauth2/v2/auth?client_id="+GOOGLE_ID+"&redirect_uri="+redirect+"&response_type=code&scope=email profile",302);
 }
}
let tab="home";
if(url.pathname.includes("foto")) tab="foto";
if(url.pathname.includes("video")) tab="video";
if(url.pathname.includes("ai")) tab="ai";
if(url.pathname.includes("akun")) tab="akun";
if(url.pathname.includes("kantor")) tab="kantor";

let html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;min-height:100vh;padding-bottom:70px}
.top{position:sticky;top:0;background:#000;padding:12px;border-bottom:1px solid #222;display:flex;gap:10px;align-items:center}
.logo{width:32px;height:32px;border-radius:50%;border:1.5px solid #00ff88}
.post{padding:12px;border-bottom:1px solid #151515;display:flex;gap:10px}
.post-av{width:38px;height:38px;border-radius:50%}
.post-body{flex:1}.post-text{margin-top:6px;font-size:14px;white-space:pre-wrap}
.post-img{margin-top:8px;border-radius:12px;overflow:hidden}.post-img img{width:100%}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}
.cell{aspect-ratio:1;background:#111;overflow:hidden}.cell img{width:100%;height:100%;object-fit:cover}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#fff}
input{background:#111;border:1px solid #333;color:#fff;border-radius:10px;padding:12px;width:100%}
#aiChat{height:70vh;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.msg{padding:10px 14px;border-radius:14px;max-width:85%;font-size:14px;white-space:pre-wrap}
.msg.user{align-self:flex-end;background:#166534}
.msg.ai{align-self:flex-start;background:#222;border:1px solid #333}
.bar{display:flex;gap:8px;padding:10px;background:#111;border-top:1px solid #222}
.bar input{flex:1}
</style></head><body>
<div id=app>
<div id="p-home" class="page" style="display:${tab==="home"?"block":"none"}">
<div class="top"><img src="${LOGO}" class="logo"><b>RUMAH GADANG AI</b></div>
<div style="padding:12px;background:#0a0a0a;border-bottom:1px solid #222">
<div style="display:flex;gap:8px"><input id="tulisIn" placeholder="Tulis sesuatu..."><label for="tulisFile" style="background:#222;border:1px solid #333;padding:8px 12px;border-radius:10px">➕</label><input id="tulisFile" type="file" accept="image/*" style="display:none"></div>
<div id="tulisPreview" style="display:none;margin-top:8px"><img id="tulisPreviewImg" style="width:100%;border-radius:10px"><div onclick="clearPrev()" style="color:red;font-size:12px">Hapus</div></div>
<button onclick="addTulis()" style="width:100%;margin-top:8px;background:#00ff88;color:#000;border:0;padding:12px;border-radius:10px;font-weight:900">KIRIM</button>
</div>
<div id="homeFeed">Loading feed Bos...</div>
</div>
<div id="p-foto" class="page" style="display:${tab==="foto"?"block":"none"}"><div class="top"><b>RG FOTO</b></div><div class="grid3" id="fg"></div></div>
<div id="p-video" class="page" style="display:${tab==="video"?"block":"none"}"><div class="top"><b>RG VIDEO</b></div><div id="vWrap">Loading video Bos...</div></div>
<div id="p-ai" class="page" style="display:${tab==="ai"?"block":"none"}"><div class="top"><b>RUMAH GADANG AI</b></div><div id="aiChat"><div class="msg ai">Halo Dunsanak Bos! Tanyo seputar adat Minang Bos!</div></div><div class="bar"><input id="aiInp" placeholder="Tanya..."><button id="aiSend" style="background:#22c55e;color:#000;border:0;padding:10px 16px;border-radius:20px;font-weight:900">KIRIM</button></div></div>
<div id="p-akun" class="page" style="display:${tab==="akun"?"block":"none"}"><div class="top"><b>AKUN</b></div><div id="akunBox" style="padding:20px">Login dulu Bos</div></div>
<div id="p-kantor" class="page" style="display:${tab==="kantor"?"block":"none"}"><div class="top"><b>KANTOR</b></div><div style="padding:16px">Kantor Adat Padang Bos</div></div>
</div>
<div class="bot">
<a href="/" class="${tab==="home"?"on":""}">🏠</a>
<a href="/foto" class="${tab==="foto"?"on":""}">🖼️</a>
<a href="/video" class="${tab==="video"?"on":""}">🎬</a>
<a href="/kantor" class="${tab==="kantor"?"on":""}">🏢</a>
<a href="/ai" class="${tab==="ai"?"on":""}">🤖</a>
<a href="/akun" class="${tab==="akun"?"on":""}">👤</a>
</div>
<script>
var LOGO_URL="${LOGO}";
var pending="";
function getEmail(){return localStorage.getItem('rg_email')||''}
function getName(){return localStorage.getItem('rg_name')||'Anonim'}
function getAvatar(){return localStorage.getItem('rg_avatar')||LOGO_URL}
async function loadTulis(){
 try{
  var r=await fetch('/api/tulis');
  var d=await r.json();
  var h=document.getElementById('homeFeed');
  if(!d.length){ h.innerHTML='<div style="padding:30px;text-align:center;color:#666">Belum ada tulisan Bos, jadi yang pertama Bos!</div>'; return; }
  h.innerHTML=d.map(x=>'<div class="post"><img class="post-av" src="'+(x.picture||LOGO_URL)+'"><div class="post-body"><b>'+(x.name||'Anonim')+'</b><div class="post-text">'+(x.text||'')+'</div>'+(x.tulisImg?'<div class="post-img"><img src="'+x.tulisImg+'"></div>':'')+'</div></div>').join('');
 }catch(e){
  document.getElementById('homeFeed').innerHTML='<div style="padding:20px;color:#666">Feed kosong Bos, DB belum nyambung Bos. Cek Binding DB Bos!</div>';
 }
}
async function loadFoto(){
 try{
  let r=await fetch('/api/ig-curated');
  let d=await r.json();
  let g=document.getElementById('fg');
  if(!d.length){ g.innerHTML='<div style="grid-column:1/-1;padding:20px;text-align:center;color:#666">Belum ada foto Bos</div>'; return; }
  g.innerHTML=d.map(x=>'<div class="cell"><img src="'+x.img+'"></div>').join('');
 }catch(e){}
}
async function loadVideo(){
 try{
  let r=await fetch('/api/videos');
  let v=await r.json();
  let w=document.getElementById('vWrap');
  if(!v.length){ w.innerHTML='<div style="padding:20px;color:#666">Belum ada video Bos</div>'; return; }
  w.innerHTML=v.map(id=>'<div style="padding:12px;border-bottom:1px solid #222">Video: '+id+'</div>').join('');
 }catch(e){}
}
function clearPrev(){ pending=""; document.getElementById('tulisPreview').style.display="none"; }
async function addTulis(){
 if(!getEmail()){ alert('Login dulu Bos'); location.href='/akun'; return; }
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt&&!pending) return alert('Tulis sesuatu Bos');
 await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,email:getEmail(),name:getName(),picture:getAvatar(),tulisImg:pending})});
 document.getElementById('tulisIn').value=""; clearPrev(); loadTulis();
}
document.getElementById('tulisFile')?.addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 let rd=new FileReader();
 rd.onload=function(ev){
  let img=new Image();
  img.onload=function(){
   let c=document.createElement('canvas'); c.width=600; c.height=600*img.height/img.width;
   c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   pending=c.toDataURL('image/jpeg',0.6);
   document.getElementById('tulisPreviewImg').src=pending;
   document.getElementById('tulisPreview').style.display='block';
  };
  img.src=ev.target.result;
 };
 rd.readAsDataURL(f);
});
async function initAI(){
 let chat=document.getElementById('aiChat');
 let inp=document.getElementById('aiInp');
 let btn=document.getElementById('aiSend');
 async function kirim(){
  let p=inp.value.trim(); if(!p) return;
  let d=document.createElement('div'); d.className='msg user'; d.innerText=p; chat.appendChild(d); inp.value=""; chat.scrollTop=chat.scrollHeight;
  let load=document.createElement('div'); load.className='msg ai'; load.innerText='Mikir Bos...'; chat.appendChild(load);
  try{
   let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
   let j=await r.json();
   load.innerText=j.reply||'Error Bos';
  }catch(e){ load.innerText='Error Bos'; }
  chat.scrollTop=chat.scrollHeight;
 }
 btn?.addEventListener('click',kirim);
 inp?.addEventListener('keydown',e=>{ if(e.key==='Enter') kirim(); });
}
window.addEventListener('load',function(){ loadTulis(); loadFoto(); loadVideo(); initAI(); });
</script>
</body></html>`;
return new Response(html,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
}
