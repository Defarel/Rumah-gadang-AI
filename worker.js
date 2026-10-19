import { LOGO, GLOBAL_VIDEOS, ADMIN_EMAILS } from './config.js';
import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';
import { FOTO_HTML } from './foto/index.js';
import { VIDEO_HTML } from './video/index.js';
import { KANTOR_HTML } from './kantor/index.js';
import { AKUN_HTML } from './akun/index.js';
import { AI_API } from './ai/api-ai/api.js';
import { AKUN_API } from './akun/api-akun/api.js';
import { FOTO_API } from './foto/api-foto/api.js';
import { TULIS_API } from './home/api-tulis/api.js';
import { VIDEO_API } from './video/api-video/api.js';
import { SITEMAP_API } from './api-sitemap/index.js';

import { LOGO, GLOBAL_VIDEOS, isAdmin, getId, ADMIN_EMAILS } from './config.js';
export default {
async fetch(req, env) {
const url = new URL(req.url);
const cors = {"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
if(req.method==="OPTIONS") return new Response("",{headers:cors});
const GROQ = env.GROQ_API_KEY || env.GROQ || "";

// === DB INIT ===
try{
 if(env.DB){
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, time INTEGER)").run();
 }
}catch(e){}

// === API ===
if(url.pathname==="/api/tulis"){
 try{
  if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
  let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all();
  return new Response(JSON.stringify(r.results||[]),{headers:cors});
 }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
}
if(url.pathname==="/api/tulis/add" && req.method==="POST"){
 try{ let j=await req.json(); if(env.DB) await env.DB.prepare("INSERT INTO tulis (id,text,user_email,name,picture,tulisImg,likes,time) VALUES (?,?,?,?,?,?,?,?)").bind(Date.now(),j.text,j.email,j.name,j.picture,j.tulisImg||"",0,Date.now()).run(); }catch(e){}
 return new Response(JSON.stringify({ok:true}),{headers:cors});
}
if(url.pathname==="/api/videos"){
 let local=[]; let blocked=[];
 try{
  if(env.DB){
   let a=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=a.results?.map(x=>x.id)||[];
   let b=await env.DB.prepare("SELECT id FROM blocked_videos").all(); blocked=b.results?.map(x=>x.id)||[];
  }
 }catch(e){}
 let all=[...new Set([...local,...GLOBAL_VIDEOS])].filter(id=>!blocked.includes(id));
 return new Response(JSON.stringify(all),{headers:cors});
}
if(url.pathname==="/api/images"){
 try{
  if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
  let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
  return new Response(JSON.stringify(r.results||[]),{headers:cors});
 }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
}
if(url.pathname==="/api/ig-curated"){
 try{
  if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
  let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();
  return new Response(JSON.stringify(r.results||[]),{headers:cors});
 }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
}
if(url.pathname==="/api/ai" && req.method==="POST"){
 try{
  let j=await req.json();
  if(!GROQ) return new Response(JSON.stringify({reply:"Kunci GROQ belum dipasang Bos, cek di Cloudflare > Variables Bos!"}),{headers:cors});
  let res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
   method:"POST",
   headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},
   body:JSON.stringify({model:"llama-3.1-8b-instant",messages:[{role:"system",content:"Kamu Rumah Gadang AI Bos, jawab pendek max 2 kalimat pakai kata Bos!"},{role:"user",content:j.prompt}],max_tokens:200})
  });
  let d=await res.json();
  if(d.error) return new Response(JSON.stringify({reply:"Error GROQ Bos: "+d.error.message}),{headers:cors});
  return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:cors});
 }catch(e){ return new Response(JSON.stringify({reply:"Error koneksi AI Bos: "+e.message}),{headers:cors}); }
}

// === HTML ===
let tab="home"; if(url.pathname.includes("foto")) tab="foto"; if(url.pathname.includes("video")) tab="video"; if(url.pathname.includes("ai")) tab="ai"; if(url.pathname.includes("kantor")) tab="kantor"; if(url.pathname.includes("akun")) tab="akun";

let html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;min-height:100vh;padding-bottom:70px}
.top{position:sticky;top:0;background:#000;z-index:10;padding:12px;border-bottom:1px solid #222;display:flex;align-items:center;gap:8px}
.logo{width:32px;height:32px;border-radius:50%;border:1.5px solid #00ff88}
.post{padding:12px;border-bottom:1px solid #151515;display:flex;gap:10px}.post-av{width:38px;height:38px;border-radius:50%}.post-body{flex:1}.post-text{margin-top:4px;font-size:14px;white-space:pre-wrap}.post-img{margin-top:8px;border-radius:10px;overflow:hidden}.post-img img{width:100%}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}.cell{aspect-ratio:1;background:#111;position:relative;overflow:hidden;cursor:pointer}.cell img{width:100%;height:100%;object-fit:cover}
#vWrap{height:calc(100vh - 110px);overflow-y:scroll;scroll-snap-type:y mandatory;background:#000}.vCard{height:calc(100vh - 110px);scroll-snap-align:start;position:relative;background:#111;cursor:pointer}.vCard img{width:100%;height:100%;object-fit:cover}.vCard .play{position:absolute;inset:0;display:grid;place-items:center}.vCard .play div{width:70px;height:50px;background:red;border-radius:14px;display:grid;place-items:center;font-size:30px}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex;z-index:99}.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:22px}.bot a.on{color:#fff}
input{background:#111;border:1px solid #333;color:#fff;border-radius:10px;padding:12px;width:100%}
#aiChat{height:calc(100vh - 140px);overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}.msg{padding:10px 14px;border-radius:14px;max-width:85%;font-size:14px;white-space:pre-wrap}.msg.user{align-self:flex-end;background:#166534}.msg.ai{align-self:flex-start;background:#222;border:1px solid #333}.bar{display:flex;gap:8px;padding:10px;background:#111;border-top:1px solid #222;position:fixed;bottom:70px;left:50%;transform:translateX(-50%);width:100%;max-width:520px}
</style></head><body>
<div id=app>
<div class="top"><img src="${LOGO}" class="logo"><b>RUMAH GADANG AI</b></div>

<div id="p-home" style="display:${tab==="home"?"block":"none"}">
<div style="padding:12px;background:#0a0a0a;border-bottom:1px solid #222;display:flex;gap:8px"><input id="tulisIn" placeholder="Tulis sesuatu..."><button onclick="addTulis()" style="background:#00ff88;color:#000;border:0;padding:10px 14px;border-radius:10px;font-weight:900">KIRIM</button></div>
<div id="homeFeed" style="padding:20px;color:#666">Loading feed Bos...</div>
</div>

<div id="p-foto" style="display:${tab==="foto"?"block":"none"}"><div style="padding:8px;color:#888;font-size:12px">RG FOTO (IG Style)</div><div class="grid3" id="fg"></div><div style="margin-top:8px" class="grid3" id="fg2"></div></div>

<div id="p-video" style="display:${tab==="video"?"block":"none"}"><div id="vWrap">Loading video Bos...</div></div>

<div id="p-ai" style="display:${tab==="ai"?"block":"none"}"><div id="aiChat"><div class="msg ai">Halo Dunsanak Bos! Tanyo seputar adat Minang Bos!</div></div><div class="bar"><input id="aiInp" placeholder="Tanya..."><button id="aiSend" style="background:#22c55e;color:#000;border:0;padding:10px 16px;border-radius:20px;font-weight:900">KIRIM</button></div></div>

<div id="p-kantor" style="display:${tab==="kantor"?"block":"none"}"><div style="padding:16px">Kantor Adat Padang Bos</div></div>
<div id="p-akun" style="display:${tab==="akun"?"block":"none"}"><div style="padding:16px;color:#888">Akun Bos - login di /akun Bos</div></div>
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
function getEmail(){return localStorage.getItem('rg_email')||''}
function getName(){return localStorage.getItem('rg_name')||'Anonim'}
function getAvatar(){return localStorage.getItem('rg_avatar')||LOGO_URL}

async function loadTulis(){
 try{
  let r=await fetch('/api/tulis'); let d=await r.json();
  let h=document.getElementById('homeFeed');
  if(!d.length){ h.innerHTML='<div style="text-align:center;padding:30px;color:#555">Belum ada tulisan Bos</div>'; return; }
  h.innerHTML=d.map(x=>'<div class="post"><img class="post-av" src="'+(x.picture||LOGO_URL)+'"><div class="post-body"><b>'+(x.name||'Anonim')+'</b><div class="post-text">'+(x.text||'')+'</div>'+(x.tulisImg?'<div class="post-img"><img src="'+x.tulisImg+'"></div>':'')+'</div></div>').join('');
 }catch(e){ document.getElementById('homeFeed').innerHTML='Error feed Bos: '+e.message; }
}
async function loadFoto(){
 try{
  let r1=await fetch('/api/ig-curated'); let d1=await r1.json();
  let r2=await fetch('/api/images'); let d2=await r2.json();
  let all=[...d1,...d2.map(x=>({img:x.url}))];
  let g=document.getElementById('fg');
  if(!all.length){ g.innerHTML='<div style="grid-column:1/-1;padding:30px;text-align:center;color:#555">Belum ada foto Bos</div>'; return; }
  g.innerHTML=all.map(x=>'<div class="cell"><img src="'+x.img+'" loading="lazy" onerror="this.src=\\''+LOGO_URL+'\\'"></div>').join('');
 }catch(e){}
}
async function loadVideo(){
 try{
  let r=await fetch('/api/videos'); let v=await r.json();
  let w=document.getElementById('vWrap');
  if(!v.length){ w.innerHTML='<div style="padding:20px;color:#555">Belum ada video Bos</div>'; return; }
  w.innerHTML=v.map(id=>'<div class="vCard" data-id="'+id+'" onclick="playVid(this,\\''+id+'\\')"><img src="https://img.youtube.com/vi/'+id+'/hqdefault.jpg"><div class="play"><div>▶️</div></div></div>').join('');
 }catch(e){ document.getElementById('vWrap').innerHTML='Error video Bos'; }
}
function playVid(el,id){
 if(el.innerHTML.includes('iframe')) return;
 el.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&mute=0&controls=1&playsinline=1&loop=1&playlist='+id+'" style="width:100%;height:100%;border:0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
}
async function addTulis(){
 let txt=document.getElementById('tulisIn').value.trim(); if(!txt) return;
 await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,email:getEmail()||'anon@rg.id',name:getName(),picture:getAvatar()})});
 document.getElementById('tulisIn').value=''; loadTulis();
}
async function initAI(){
 let chat=document.getElementById('aiChat'); let inp=document.getElementById('aiInp'); let btn=document.getElementById('aiSend');
 async function kirim(){
  let p=inp.value.trim(); if(!p) return;
  let u=document.createElement('div'); u.className='msg user'; u.innerText=p; chat.appendChild(u); inp.value=''; chat.scrollTop=chat.scrollHeight;
  let load=document.createElement('div'); load.className='msg ai'; load.innerText='Mikir Bos...'; chat.appendChild(load); chat.scrollTop=chat.scrollHeight;
  try{ let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}); let j=await r.json(); load.innerText=j.reply; }catch(e){ load.innerText='Error Bos: '+e.message; }
  chat.scrollTop=chat.scrollHeight;
 }
 btn.addEventListener('click',kirim); inp.addEventListener('keydown',e=>{ if(e.key==='Enter') kirim(); });
}
window.addEventListener('load',()=>{ loadTulis(); loadFoto(); loadVideo(); initAI(); });
<\/script>
</body></html>`;
return new Response(html,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
};
