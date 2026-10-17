import { LOGO, GLOBAL_VIDEOS, ADMIN_EMAILS } from './config.js';
import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';
import { FOTO_HTML } from './foto/index.js';
import { VIDEO_HTML } from './video/index.js';
import { KANTOR_HTML } from './kantor/index.js';
import { AKUN_HTML } from './akun/index.js';

export default {
async fetch(req, env) {
  const url = new URL(req.url);
  const cors = {"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
  if(req.method==="OPTIONS") return new Response("",{headers:cors});

  try{
   if(env.DB){
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, time INTEGER)").run();
   }
  }catch(e){}

  if(url.pathname==="/api/tulis"){ try{ if(!env.DB) return new Response(JSON.stringify([]),{headers:cors}); let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/tulis/add"&&req.method==="POST"){ try{ let j=await req.json(); if(env.DB) await env.DB.prepare("INSERT INTO tulis (id,text,user_email,name,picture,time) VALUES (?,?,?,?,?,?)").bind(Date.now(),j.text,j.email,j.name,j.picture,Date.now()).run(); }catch(e){} return new Response(JSON.stringify({ok:true}),{headers:cors}); }
  if(url.pathname==="/api/videos"){ let local=[]; try{ if(env.DB){ let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=r.results?.map(x=>x.id)||[]; } }catch(e){} let all=[...new Set([...local,...GLOBAL_VIDEOS])]; return new Response(JSON.stringify(all),{headers:cors}); }
  if(url.pathname==="/api/images"){ try{ if(!env.DB) return new Response(JSON.stringify([]),{headers:cors}); let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/ig-curated"){ try{ if(!env.DB) return new Response(JSON.stringify([]),{headers:cors}); let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/ai"&&req.method==="POST"){ try{ let j=await req.json(); let GROQ=env.GROQ_API_KEY; let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},body:JSON.stringify({model:"llama-3.1-8b-instant",messages:[{role:"system",content:"Kamu Rumah Gadang AI Bos, jawab pendek 2 kalimat pakai kata Bos!"},{role:"user",content:j.prompt}]})}); let d=await r.json(); return new Response(JSON.stringify({reply:d.choices?.[0]?.message?.content||"Error Bos"}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({reply:"Error AI Bos: "+e.message}),{headers:cors}); } }

  let path = url.pathname;
  if(path==="/"||path.startsWith("/home")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  
  return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
};
