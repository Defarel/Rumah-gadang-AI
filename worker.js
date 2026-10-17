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

  if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
  const host = url.hostname; const origin = `https://${host}`; const date = new Date().toISOString().split('T')[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/foto</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/video</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/kantor</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/ai</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${origin}/akun</loc><lastmod>${date}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
</urlset>`;
  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  }
  if (url.pathname === '/robots.txt') {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: https://${url.hostname}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
  }

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
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, username TEXT, name TEXT, created_at INTEGER, picture TEXT)").run();
    // patch kolom kalau tabel lama
    try{ await env.DB.prepare("ALTER TABLE users ADD COLUMN picture TEXT").run(); }catch{}
    try{ await env.DB.prepare("ALTER TABLE profiles ADD COLUMN bio TEXT").run(); }catch{}
    try{ await env.DB.prepare("ALTER TABLE profiles ADD COLUMN picture TEXT").run(); }catch{}
   }
  }catch(e){}

  function isAdmin(email){ if(!email) return false; try{ return (ADMIN_EMAILS||[]).map(x=>x.toLowerCase().trim()).includes(email.toLowerCase().trim()); }catch(e){ return false; } }
  const adminEmail = req.headers.get("X-Admin-Email") || url.searchParams.get("admin") || "";
  const isAdminUser = isAdmin(adminEmail);

  // REGISTER & CARI TEMAN
  if (url.pathname === "/api/register-user" && req.method === "POST") {
    try{
      const { email, name, picture } = await req.json();
      if(!email) return new Response(JSON.stringify({error:"email required"}),{headers:cors, status:400});
      let username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g,'');
      let displayName = name || username;
      await env.DB.prepare(`INSERT OR REPLACE INTO users (email, username, name, created_at, picture) VALUES (?, ?, ?, ?, ?)`).bind(email.toLowerCase(), username, displayName, Date.now(), picture||"").run();
      await env.DB.prepare(`INSERT OR REPLACE INTO profiles (email, username, name, picture) VALUES (?, ?, ?, ?)`).bind(email.toLowerCase(), username, displayName, picture||"").run();
      return new Response(JSON.stringify({ok:true, username}), {headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:cors, status:500}); }
  }
  if (url.pathname === "/api/users") {
    try{ const { results } = await env.DB.prepare(`SELECT * FROM users ORDER BY created_at DESC LIMIT 100`).all(); return new Response(JSON.stringify(results||[]), {headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if (url.pathname.startsWith("/api/search-users/")) {
    try{
      const q = decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      const { results } = await env.DB.prepare(`SELECT * FROM users WHERE lower(email) LIKE ? OR lower(username) LIKE ? OR lower(name) LIKE ? LIMIT 30`).bind(`%${q}%`, `%${q}%`, `%${q}%`).all();
      return new Response(JSON.stringify(results||[]),{headers:cors});
    }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if (url.pathname.startsWith("/api/user/")) {
    try{
      const username = decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      const user = await env.DB.prepare(`SELECT * FROM users WHERE lower(username) = ? LIMIT 1`).bind(username).first();
      if(user){ let prof = await env.DB.prepare(`SELECT * FROM profiles WHERE email=?`).bind(user.email).first(); if(prof?.picture) user.picture=prof.picture; if(prof?.bio) user.bio=prof.bio; return new Response(JSON.stringify(user), {headers:cors}); }
      return new Response(JSON.stringify({error:"not found"}),{headers:cors, status:404});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:cors, status:500}); }
  }
  // PROFILE
  if(url.pathname==="/api/profile" && req.method==="POST"){
    try{
      let j=await req.json();
      await env.DB.prepare("INSERT OR REPLACE INTO profiles (email, username, name, bio, picture) VALUES (?, ?, ?, ?, ?)").bind(j.email.toLowerCase(), j.email.split('@')[0], j.name||"", j.bio||"", j.picture||"").run();
      await env.DB.prepare("UPDATE users SET name=?, picture=? WHERE email=?").bind(j.name||"", j.picture||"", j.email.toLowerCase()).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); }
  }
  if(url.pathname.startsWith("/api/profile/")){
    try{
      let em=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      let p=await env.DB.prepare("SELECT * FROM profiles WHERE email=?").bind(em).first();
      return new Response(JSON.stringify(p||{}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({}),{headers:cors}); }
  }
  // ADMIN ATUR FOLLOWER NAIK TURUN
  if(url.pathname==="/api/admin/followers" && req.method==="POST"){
    if(!isAdminUser) return new Response(JSON.stringify({error:"Bukan admin!"}),{status:403,headers:cors});
    try{
      let j=await req.json(); let target=j.target.toLowerCase(); let delta=parseInt(j.delta)||0;
      if(delta>0){ for(let i=0;i<delta;i++){ let fake='admin_add_'+Date.now()+'_'+i+'@fake.my.id'; await env.DB.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").bind(fake,target).run(); }
      } else { let r=await env.DB.prepare("SELECT follower_id FROM follows WHERE following_id=? LIMIT ?").bind(target, Math.abs(delta)).all(); for(let row of (r.results||[])){ await env.DB.prepare("DELETE FROM follows WHERE follower_id=? AND following_id=?").bind(row.follower_id,target).run(); } }
      let cnt=await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE following_id=?").bind(target).first();
      return new Response(JSON.stringify({followers:cnt.total}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); }
  }

  // FOLLOW SYSTEM
  if(url.pathname==="/api/follow" && req.method==="POST"){
    try{
      let j=await req.json();
      if(j.follower_id.toLowerCase() === j.following_id.toLowerCase()) return new Response(JSON.stringify({error:"Ga bisa follow diri sendiri bos!"}),{status:400, headers:cors});
      await env.DB.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").bind(j.follower_id.toLowerCase(), j.following_id.toLowerCase()).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500, headers:cors}); }
  }
  if(url.pathname==="/api/unfollow" && req.method==="POST"){
    try{ let j=await req.json(); await env.DB.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").bind(j.follower_id.toLowerCase(), j.following_id.toLowerCase()).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500, headers:cors}); }
  }
  if(url.pathname.startsWith("/api/check-follow/")){
    try{
      const parts = url.pathname.split('/'); const follower_id = decodeURIComponent(parts[parts.length-2]).toLowerCase(); const following_id = decodeURIComponent(parts[parts.length-1]).toLowerCase();
      let isFollowing = await env.DB.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?").bind(follower_id, following_id).first();
      let isFollowBack = await env.DB.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?").bind(following_id, follower_id).first();
      return new Response(JSON.stringify({following: !!isFollowing, followback: !!isFollowBack, mutual: !!isFollowing && !!isFollowBack}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({following:false}),{headers:cors}); }
  }
  if(url.pathname.startsWith("/api/follow-stats/")){
    try{
      const userId = decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      let followers = await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE following_id = ?").bind(userId).first();
      let following = await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE follower_id = ?").bind(userId).first();
      return new Response(JSON.stringify({followers: followers?.total||0, following: following?.total||0}),{headers:cors});
    }catch(e){ return new Response(JSON.stringify({followers:0,following:0}),{headers:cors}); }
  }

  // FOTO & TULIS
  if(url.pathname==="/api/fotos" && req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM fotos ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/fotos" && req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("INSERT INTO fotos (url, caption, user_email, time) VALUES (?,?,?,?)").bind(j.url||"", j.caption||"", j.user_email||"", Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); } }
  if(url.pathname==="/api/tulis" && req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/tulis" && req.method==="POST"){ try{ let j=await req.json(); let foto = j.tulisImg || j.url || ""; await env.DB.prepare("INSERT INTO tulis (text,user_email,name,picture,time,tulisImg,url) VALUES (?,?,?,?,?,?,?)").bind(j.text||"",j.user_email||"",j.name||"",j.picture||"",Date.now(),foto,foto).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); } }
  if(url.pathname==="/api/tulis/delete"){ if(!isAdminUser) return new Response(JSON.stringify({error:"Cuma admin Bos!"}),{status:403,headers:cors}); try{ let j=await req.json(); await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run(); }catch(e){} return new Response(JSON.stringify({ok:true}),{headers:cors}); }

  if(url.pathname==="/api/videos"){ let local=[]; try{ let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=r.results?.map(x=>x.id)||[]; }catch(e){} let all=[...new Set([...local,...(GLOBAL_VIDEOS||[])])]; return new Response(JSON.stringify(all),{headers:cors}); }
  if(url.pathname==="/api/images"){ try{ let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/ig-curated"){ try{ let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
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

  let path = url.pathname;
  const STATIC_ROUTES = ["/akun", "/foto", "/video", "/ai", "/kantor", "/tulis", "/api", "/sitemap", "/robots", "/favicon", "/a"];
  if(path==="/"||path.startsWith("/home")||path.startsWith("/tulis")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.startsWith("/akun")||path==="/a") return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  if(path.length > 1 && !STATIC_ROUTES.some(r => path.startsWith(r)) && !path.includes(".") && !path.startsWith("/u/")){
    return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  }
  if(path.startsWith("/u/")){ return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}}); }
  return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
}
};
