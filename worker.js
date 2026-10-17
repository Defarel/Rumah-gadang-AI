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

  // === SITEMAP FULL BOS ===
  if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.rumahgadang-ai.my.id/</loc></url><url><loc>https://www.rumahgadang-ai.my.id/foto</loc></url><url><loc>https://www.rumahgadang-ai.my.id/video</loc></url><url><loc>https://www.rumahgadang-ai.my.id/tulis</loc></url><url><loc>https://www.rumahgadang-ai.my.id/ai</loc></url></urlset>`;
    return new Response(xml, { headers: {'Content-Type':'application/xml'} });
  }
  if (url.pathname === '/robots.txt') {
    return new Response(`User-agent: *\nAllow: /\nSitemap: https://www.rumahgadang-ai.my.id/sitemap.xml`, { headers: { 'Content-Type':'text/plain' } });
  }

  // === CREATE + MIGRASI TABEL BOS BIAR FOTO BISA MASUK BOS ===
  try{
   if(env.DB){
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, time INTEGER)").run();
    try{ await env.DB.prepare("ALTER TABLE tulis ADD COLUMN tulisImg TEXT").run(); }catch(e){}
    try{ await env.DB.prepare("ALTER TABLE tulis ADD COLUMN url TEXT").run(); }catch(e){}
    try{ await env.DB.prepare("ALTER TABLE tulis ADD COLUMN likes INTEGER DEFAULT 0").run(); }catch(e){}
   }
  }catch(e){}

  function isAdmin(email){
    if(!email) return false;
    try{ return (ADMIN_EMAILS||[]).map(x=>x.toLowerCase().trim()).includes(email.toLowerCase().trim()); }catch(e){ return false; }
  }
  const adminEmail = req.headers.get("X-Admin-Email") || url.searchParams.get("admin") || "";
  const isAdminUser = isAdmin(adminEmail);

  // === API TULIS BOS ===
  if(url.pathname==="/api/tulis" && req.method==="GET"){
    try{
      let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 100").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname==="/api/tulis" && req.method==="POST"){
    try{
      let j=await req.json();
      let foto = j.tulisImg || j.url || "";
      await env.DB.prepare("INSERT INTO tulis (text,user_email,name,picture,time,tulisImg,url) VALUES (?,?,?,?,?,?,?)").bind(j.text||"",j.user_email||"",j.name||"",j.picture||"",Date.now(),foto,foto).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); }
  }
  if(url.pathname==="/api/tulis/delete"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin Bos! login admin dulu Bos!"}),{status:403,headers:cors});
    try{ let j=await req.json(); await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run(); }catch(e){}
    return new Response(JSON.stringify({ok:true}),{headers:cors});
  }

  // === API LAIN BOS ===
  if(url.pathname==="/api/videos"){
    let local=[]; try{ let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=r.results?.map(x=>x.id)||[]; }catch(e){}
    let all=[...new Set([...local,...(GLOBAL_VIDEOS||[])])];
    return new Response(JSON.stringify(all),{headers:cors});
  }
  if(url.pathname==="/api/images"){
    try{ let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname==="/api/ig-curated"){
    try{ let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname==="/api/ai"&&req.method==="POST"){
    try{
      let j=await req.json(); let GROQ=env.GROQ_API_KEY;
      const MODELS = ["openai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"];
      for(let model of MODELS){
        try{
          let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},body:JSON.stringify({model:model,messages:[{role:"system",content:"KAMU ADALAH: Rumah Gadang AI. DIBUAT OLEH: Tim Rumah Gadang AI di Padang. Jika ditanya siapa pembuatmu jawab 'Saya dibuat oleh Tim Rumah Gadang AI Bos!' Jangan bilang OpenAI. Selalu pakai kata Bos."},{role:"user",content:j.prompt}],temperature:0.7,max_tokens:500})});
          let d=await r.json(); if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:cors});
        }catch(e){ continue; }
      }
      return new Response(JSON.stringify({reply:"Error AI Bos"}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({reply:"Error Bos"}),{headers:cors}); }
  }

  // === FIX ROUTING BOS - JANGAN PAKAI /a LAGI BOS! ===
  let path = url.pathname;
  if(path==="/"||path.startsWith("/home")||path.startsWith("/tulis")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/akun")||path==="/a") return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});

  return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
};
