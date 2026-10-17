import { LOGO, GOOGLE_ID, GOOGLE_SECRET, GROQ, GLOBAL_VIDEOS, ADMIN_EMAILS, isAdmin, getId } from './config.js';
import { HOME_HTML } from './home/index.js';
import { FOTO_HTML } from './foto/index.js';
import { VIDEO_HTML } from './video/index.js';
import { AI_HTML } from './ai/index.js';
import { AKUN_HTML } from './akun/index.js';
import { KANTOR_HTML } from './kantor/index.js';

export default {
async fetch(req, env){
  const url = new URL(req.url);
  const cors={"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
  if(req.method==="OPTIONS") return new Response("",{headers:cors});
  if(url.pathname==="/robots.txt") return new Response("User-agent: *\nAllow: /\n",{headers:{"Content-Type":"text/plain"}});
  
  // INIT DB
  try{ if(env.DB){ await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run(); await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run(); await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run(); await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run(); await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run(); await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, video TEXT, time INTEGER)").run(); } }catch(e){}

  // --- SEMUA API BOS (copy dari kode gede tadi) ---
  if(url.pathname==="/api/videos"){ let l=[];let b=[];try{let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();l=r.results?.map(x=>x.id)||[];let rb=await env.DB.prepare("SELECT id FROM blocked_videos").all();b=rb.results?.map(x=>x.id)||[];}catch{} let all=[...new Set([...l,...GLOBAL_VIDEOS])].filter(id=>!b.includes(id)); return new Response(JSON.stringify(all),{headers:cors}); }
  if(url.pathname==="/api/tulis"){ try{let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all();return new Response(JSON.stringify(r.results||[]),{headers:cors})}catch{return new Response(JSON.stringify([]),{headers:cors})} }
  if(url.pathname==="/api/tulis/add"&&req.method==="POST"){ try{let j=await req.json();await env.DB.prepare("INSERT INTO tulis (id,text,user_email,name,picture,tulisImg,likes,time) VALUES (?,?,?,?,?,?,?,?)").bind(Date.now(),j.text,j.email,j.name||"Anonim",j.picture||"",j.tulisImg||"",0,Date.now()).run()}catch{} return new Response(JSON.stringify({ok:true}),{headers:cors}); }
  if(url.pathname==="/api/ig-curated"){ try{let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();return new Response(JSON.stringify(r.results||[]),{headers:cors})}catch{return new Response(JSON.stringify([]),{headers:cors})} }
  if(url.pathname==="/api/ai"&&req.method==="POST"){ try{let j=await req.json();let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:"Kamu Rumah Gadang AI Bos, jawab pendek 2 kalimat pakai kata Bos!"},{role:"user",content:j.prompt}],max_tokens:120})});let d=await r.json();return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:cors})}catch{return new Response(JSON.stringify({reply:"Error Bos"}),{headers:cors})} }
  if(url.pathname==="/api/auth/login"&&req.method==="POST"){ try{let {user,pass}=await req.json();let email=user.includes("@")?user:user+"@rumahgadang-ai.my.id";email=email.toLowerCase();let hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pass)).then(b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""));let u=await env.DB.prepare("SELECT * FROM rg_users WHERE email=? AND pass=?").bind(email,hash).first();if(!u)return new Response(JSON.stringify({ok:false}),{headers:cors});return new Response(JSON.stringify({ok:true,email:u.email,name:u.name,picture:u.picture||LOGO}),{headers:cors})}catch{return new Response(JSON.stringify({ok:false}),{headers:cors})} }

  // --- ROUTER MODULAR BOS ---
  if(url.pathname.includes("kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(url.pathname.includes("foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(url.pathname.includes("video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(url.pathname.includes("ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(url.pathname.includes("akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
                                                                }
