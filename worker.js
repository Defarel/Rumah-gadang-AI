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
  const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];
function isAdmin(e){
  if(!e) return false;
  return ADMIN_EMAILS.includes(e.toLowerCase().trim());
}
      // === SITEMAP & ROBOTS BOS - PASTE DI SINI BOS ===
    if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.rumahgadang-ai.my.id/</loc><lastmod>2026-10-17</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/foto</loc><lastmod>2026-10-17</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/video</loc><lastmod>2026-10-17</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/ai</loc><lastmod>2026-10-17</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/kantor</loc><lastmod>2026-10-17</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.rumahgadang-ai.my.id/akun</loc><lastmod>2026-10-17</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
</urlset>`;
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (url.pathname === '/robots.txt') {
      return new Response(`User-agent: *
Allow: /

Sitemap: https://www.rumahgadang-ai.my.id/sitemap.xml`, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    // === AKHIR SITEMAP BOS ===
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

  const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,X-Admin-Email'};

  if(req.method==="OPTIONS") return new Response("",{headers:cors});

  // === ADMIN CHECK BOS - SETELAH NO 11 BOS ===
  function isAdmin(email){
    if(!email) return false;
    try{ return ADMIN_EMAILS.includes(email.toLowerCase().trim()); }catch(e){ return false; }
  }
  const adminEmail = req.headers.get("X-Admin-Email") || new URL(req.url).searchParams.get("admin") || "";
  const isAdminUser = isAdmin(adminEmail);

  // === API TULIS BOS ===
  if(url.pathname==="/api/tulis"){ 
    try{ 
      if(!env.DB) return new Response(JSON.stringify([]),{headers:cors}); 
      let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all(); 
      return new Response(JSON.stringify(r.results||[]),{headers:cors}); 
    }catch(e){ 
      return new Response(JSON.stringify([]),{headers:cors}); 
    } 
  }

  // HAPUS TULIS CUMA ADMIN BOS!
  if(url.pathname==="/api/tulis/delete"&&req.method==="POST"){ 
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin@rumahgadang-ai.my.id Bos!"}),{status:403,headers:cors});
    try{ 
      let j=await req.json(); 
      if(env.DB) await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run(); 
    }catch(e){} 
    return new Response(JSON.stringify({ok:true}),{headers:cors}); 
  }

  // === API VIDEOS BOS ===
  if(url.pathname==="/api/videos"){ 
    let local=[]; 
    try{ 
      if(env.DB){ 
        let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); 
        local=r.results?.map(x=>x.id)||[]; 
      } 
    }catch(e){} 
    let all=[...new Set([...local,...GLOBAL_VIDEOS])]; 
    return new Response(JSON.stringify(all),{headers:cors}); 
  }

  // HAPUS VIDEO CUMA ADMIN BOS!
  if(url.pathname==="/api/videos/delete"&&req.method==="POST"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin Bos!"}),{status:403,headers:cors});
    try{
      let j=await req.json();
      if(env.DB) await env.DB.prepare("DELETE FROM local_videos WHERE id=?").bind(j.id).run();
    }catch(e){}
    return new Response(JSON.stringify({ok:true}),{headers:cors});
  }

  // === API IMAGES BOS ===
  if(url.pathname==="/api/images"){ 
    try{ 
      if(!env.DB) return new Response(JSON.stringify([]),{headers:cors}); 
      let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all(); 
      return new Response(JSON.stringify(r.results||[]),{headers:cors}); 
    }catch(e){ 
      return new Response(JSON.stringify([]),{headers:cors}); 
    } 
  }

  // HAPUS FOTO CUMA ADMIN BOS!
  if(url.pathname==="/api/images/delete"&&req.method==="POST"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin Bos!"}),{status:403,headers:cors});
    try{
      let j=await req.json();
      if(env.DB) await env.DB.prepare("DELETE FROM images WHERE id=?").bind(j.id).run();
    }catch(e){}
    return new Response(JSON.stringify({ok:true}),{headers:cors});
  }

  if(url.pathname==="/api/ig-curated"){ 
    try{ 
      if(!env.DB) return new Response(JSON.stringify([]),{headers:cors}); 
      let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); 
      return new Response(JSON.stringify(r.results||[]),{headers:cors}); 
    }catch(e){ 
      return new Response(JSON.stringify([]),{headers:cors}); 
    } 
  }

  // === API AI BOS PAKAI 3 MODEL BOS - GPT 120b, 20b, QWEN BOS ===
  if(url.pathname==="/api/ai"&&req.method==="POST"){ 
    try{ 
      let j=await req.json(); 
      let GROQ=env.GROQ_API_KEY;
      
      // URUTAN BOS: 120b dulu Bos paling pintar Bos, kalau error turun ke 20b Bos, terakhir qwen Bos!
      const MODELS = ["openai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"];
      let lastError = "";

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
        }catch(e){
          lastError = e.message;
          continue; // COBA MODEL BERIKUTNYA BOS!
        }
      }
      // KALAU 3 MODEL GAGAL SEMUA BOS
      return new Response(JSON.stringify({reply:"Error 3 model gagal Bos: "+lastError}),{headers:cors});
      
    }catch(e){ 
      return new Response(JSON.stringify({reply:"Error AI Bos: "+e.message}),{headers:cors}); 
    } 
  }

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
