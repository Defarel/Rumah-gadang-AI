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

  // === SITEMAP ===
  if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
  const host = url.hostname;
  const origin = `https://${host}`;
  const date = new Date().toISOString().split('T')[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/foto</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/video</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/kantor</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/ai</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/akun</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${origin}/tulis</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
</urlset>`;
  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  }
  if (url.pathname === '/robots.txt') {
  const origin = `https://${url.hostname}`;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
  }

  // === CREATE TABEL, BIAR GA ERROR  ===
  try{
   if(env.DB){
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER, tulisImg TEXT, url TEXT, likes INTEGER DEFAULT 0)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS follows (follower_id TEXT NOT NULL, following_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (follower_id, following_id))").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS fotos (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, caption TEXT, user_email TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS foto_likes (foto_id INTEGER, user_email TEXT, PRIMARY KEY (foto_id, user_email))").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY, username TEXT, name TEXT, bio TEXT, picture TEXT)").run();
   }
  }catch(e){}

  function isAdmin(email){
    if(!email) return false;
    try{ return (ADMIN_EMAILS||[]).map(x=>x.toLowerCase().trim()).includes(email.toLowerCase().trim()); }catch(e){ return false; }
  }
  const adminEmail = req.headers.get("X-Admin-Email") || url.searchParams.get("admin") || "";
  const isAdminUser = isAdmin(adminEmail);

// --- API REGISTER & CARI TEMAN BARU ---
if (url.pathname === "/api/register-user" && req.method === "POST") {
  const { email, name } = await req.json();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
  await env.DB.prepare(`INSERT OR IGNORE INTO users (email, name) VALUES (?, ?)`).bind(email.toLowerCase(), name || email.split('@')[0]).run();
  return new Response(JSON.stringify({ok:true}), {headers:{"Content-Type":"application/json"}});
}
if (url.pathname === "/api/users") {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
  const { results } = await env.DB.prepare(`SELECT * FROM users ORDER BY created_at DESC LIMIT 50`).all();
  return new Response(JSON.stringify(results), {headers:{"Content-Type":"application/json"}});
}
if (url.pathname.startsWith("/api/search-users/")) {
  const q = decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
  const { results } = await env.DB.prepare(`SELECT * FROM users WHERE lower(email) LIKE ? OR lower(name) LIKE ? LIMIT 20`).bind(`%${q}%`, `%${q}%`).all();
  return new Response(JSON.stringify(results), {headers:{"Content-Type":"application/json"}});
}
  // === API FOLLOW - KAYAK IG AKUN A FOLLOW B, B FOLLOW A ===
  if(url.pathname==="/api/follow" && req.method==="POST"){
    try{
      let j=await req.json();
      if(j.follower_id === j.following_id) return new Response(JSON.stringify({error:"Ga bisa follow diri sendiri bos!"}),{status:400, headers:cors});
      await env.DB.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").bind(j.follower_id, j.following_id).run();
      return new Response(JSON.stringify({ok:true, message:"Follow berhasil bos!"}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500, headers:cors}); }
  }
  if(url.pathname==="/api/unfollow" && req.method==="POST"){
    try{
      let j=await req.json();
      await env.DB.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").bind(j.follower_id, j.following_id).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500, headers:cors}); }
  }
  if(url.pathname.startsWith("/api/check-follow/")){
    try{
      const parts = url.pathname.split('/');
      const follower_id = parts[parts.length-2];
      const following_id = parts[parts.length-1];
      let isFollowing = await env.DB.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?").bind(follower_id, following_id).first();
      let isFollowBack = await env.DB.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?").bind(following_id, follower_id).first();
      return new Response(JSON.stringify({following: !!isFollowing, followback: !!isFollowBack, mutual: !!isFollowing && !!isFollowBack}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({following:false}),{headers:cors}); }
  }
  if(url.pathname.startsWith("/api/follow-stats/")){
    try{
      const userId = url.pathname.split('/').pop();
      let followers = await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE following_id = ?").bind(userId).first();
      let following = await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE follower_id = ?").bind(userId).first();
      return new Response(JSON.stringify({followers: followers?.total||0, following: following?.total||0}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({followers:0,following:0}),{headers:cors}); }
  }
  if(url.pathname.startsWith("/api/followers/")){
    try{
      const userId = url.pathname.split('/').pop();
      let r = await env.DB.prepare("SELECT follower_id FROM follows WHERE following_id = ? ORDER BY created_at DESC").bind(userId).all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname.startsWith("/api/following/")){
    try{
      const userId = url.pathname.split('/').pop();
      let r = await env.DB.prepare("SELECT following_id FROM follows WHERE follower_id = ? ORDER BY created_at DESC").bind(userId).all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }

  // === API FOTO ===
  if(url.pathname==="/api/fotos" && req.method==="GET"){
    try{
      let r=await env.DB.prepare("SELECT * FROM fotos ORDER BY time DESC LIMIT 100").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if(url.pathname==="/api/fotos" && req.method==="POST"){
    try{
      let j=await req.json();
      await env.DB.prepare("INSERT INTO fotos (url, caption, user_email, time) VALUES (?,?,?,?)").bind(j.url||"", j.caption||"", j.user_email||"", Date.now()).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); }
  }

  // === API TULIS ===
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

  // === API VIDEO/LAIN ===
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

  // === ROUTING ===
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
