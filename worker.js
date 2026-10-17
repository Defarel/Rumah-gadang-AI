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
  const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,X-Admin-Email'};

  if(req.method==="OPTIONS") return new Response("",{headers:cors});

  // === SITEMAP FULL URL BOS ===
  if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.rumahgadang-ai.my.id/</loc><priority>1.0</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/foto</loc><priority>0.9</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/video</loc><priority>0.9</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/tulis</loc><priority>0.8</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/ai</loc><priority>0.9</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/kantor</loc><priority>0.7</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/akun</loc><priority>0.6</priority></url>
</urlset>`;
    return new Response(xml, { headers: {'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=86400'} });
  }

  if (url.pathname === '/robots.txt') {
    return new Response(`User-agent: *\nAllow: /\n\nSitemap: https://www.rumahgadang-ai.my.id/sitemap.xml`, { headers: { 'Content-Type':'text/plain' } });
  }

  // === CREATE TABLE BOS ===
  try{
   if(env.DB){
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, time INTEGER)").run();
   }
  }catch(e){}

  // === ADMIN CHECK - EMAIL BOS ===
  function isAdmin(email){
    if(!email) return false;
    try{
      let list = (ADMIN_EMAILS||[]).map(x=>x.toLowerCase().trim());
      return list.includes(email.toLowerCase().trim());
    }catch(e){ return false; }
  }
  const adminEmail = req.headers.get("X-Admin-Email") || url.searchParams.get("admin") || "";
  const isAdminUser = isAdmin(adminEmail);

  // === API TULIS ===
  if(url.pathname==="/api/tulis"){
    try{
      if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
      let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname==="/api/tulis/delete"&&req.method==="POST"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin@rumahgadang-ai.my.id Bos!"}),{status:403,headers:cors});
    try{ let j=await req.json(); if(env.DB) await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run(); }catch(e){}
    return new Response(JSON.stringify({ok:true}),{headers:cors});
  }

  // === API VIDEOS ===
  if(url.pathname==="/api/videos"){
    let local=[];
    try{ if(env.DB){ let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=r.results?.map(x=>x.id)||[]; } }catch(e){}
    let all=[...new Set([...local,...GLOBAL_VIDEOS])];
    return new Response(JSON.stringify(all),{headers:cors});
  }
  if(url.pathname==="/api/videos/delete"&&req.method==="POST"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin Bos!"}),{status:403,headers:cors});
    try{ let j=await req.json(); if(env.DB) await env.DB.prepare("DELETE FROM local_videos WHERE id=?").bind(j.id).run(); }catch(e){}
    return new Response(JSON.stringify({ok:true}),{headers:cors});
  }

  // === API IMAGES ===
  if(url.pathname==="/api/images"){
    try{
      if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
      let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname==="/api/images/delete"&&req.method==="POST"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin Bos!"}),{status:403,headers:cors});
    try{ let j=await req.json(); if(env.DB) await env.DB.prepare("DELETE FROM images WHERE id=?").bind(j.id).run(); }catch(e){}
    return new Response(JSON.stringify({ok:true}),{headers:cors});
  }

  if(url.pathname==="/api/ig-curated"){
    try{
      if(!env.DB) return new Response(JSON.stringify([]),{headers:cors});
      let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }

  // === API AI - KEY GROQ TETAP 3 MODEL BOS! ===
  if(url.pathname==="/api/ai"&&req.method==="POST"){
    try{
      let j=await req.json();
      let GROQ=env.GROQ_API_KEY;
      const MODELS = ["openai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"];
      let lastError="";
      for(let model of MODELS){
        try{
          let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},
            body:JSON.stringify({
              model:model,
              messages:[
                {role:"system",content:"Kamu Rumah Gadang AI Bos, jawab pendek 2 kalimat pakai kata Bos!"},
                {role:"user",content:j.prompt}
              ],
              temperature:0.7,
              max_tokens:500
            })
          });
          let d=await r.json();
          if(d.choices?.[0]?.message?.content){
            return new Response(JSON.stringify({reply:d.choices[0].message.content, model:model}),{headers:cors});
          }
          lastError = JSON.stringify(d);
        }catch(e){ lastError=e.message; continue; }
      }
      return new Response(JSON.stringify({reply:"Error 3 model gagal Bos: "+lastError}),{headers:cors});
    }catch(e){
      return new Response(JSON.stringify({reply:"Error AI Bos: "+e.message}),{headers:cors});
    }
  }

  // === IF URL - ROUTING BOS ===
  let path = url.pathname;
  if(path==="/"||path.startsWith("/home")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/akun")||path.startsWith("/a")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});

  return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
};
