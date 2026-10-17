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

  if (url.pathname === '/sitemap.xml') {
    const origin = `https://${url.hostname}`;
    const date = new Date().toISOString().split('T')[0];
    return new Response(`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`, { headers: { 'Content-Type': 'application/xml' } });
  }
  if (url.pathname === '/robots.txt') {
    return new Response(`User-agent: *\nAllow: /\nSitemap: https://${url.hostname}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
  }

  try{
   if(env.DB){
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER, tulisImg TEXT, url TEXT, likes INTEGER DEFAULT 0)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS fotos (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, caption TEXT, user_email TEXT, time INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS follows (follower_id TEXT NOT NULL, following_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (follower_id, following_id))").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, username TEXT, name TEXT, created_at INTEGER)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY, username TEXT, name TEXT)").run();
   }
  }catch(e){}

  // === API REGISTER - AUTO SIMPAN KAYAK FOTO ===
  if (url.pathname === "/api/register-user" && req.method === "POST") {
    try{
      const { email, name } = await req.json();
      let e = email.toLowerCase().trim();
      let username = e.split('@')[0].replace(/[^a-z0-9]/g,'').toLowerCase();
      let n = name || username;
      await env.DB.prepare("INSERT OR REPLACE INTO users (email, username, name, created_at) VALUES (?, ?, ?, ?)").bind(e, username, n, Date.now()).run();
      return new Response(JSON.stringify({ok:true, username}),{headers:cors});
    }catch(err){ return new Response(JSON.stringify({error:err.message}),{headers:cors,status:500}); }
  }
  if (url.pathname === "/api/users") {
    try{ let r=await env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC LIMIT 50").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch{ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if (url.pathname.startsWith("/api/search-users/")) {
    try{ let q=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase(); let r=await env.DB.prepare("SELECT * FROM users WHERE lower(email) LIKE ? OR lower(username) LIKE ? OR lower(name) LIKE ? LIMIT 20").bind(`%${q}%`,`%${q}%`,`%${q}%`).all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch{ return new Response(JSON.stringify([]),{headers:cors}); }
  }
  if (url.pathname.startsWith("/api/user/")) {
    try{ let uname=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase(); let u=await env.DB.prepare("SELECT * FROM users WHERE lower(username)=? LIMIT 1").bind(uname).first(); return new Response(JSON.stringify(u||{}),{headers:cors}); }catch{ return new Response(JSON.stringify({}),{headers:cors}); }
  }
  if(url.pathname==="/api/follow" && req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").bind(j.follower_id.toLowerCase(), j.following_id.toLowerCase()).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); } }
  if(url.pathname==="/api/unfollow" && req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").bind(j.follower_id.toLowerCase(), j.following_id.toLowerCase()).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); } }
  if(url.pathname.startsWith("/api/check-follow/")){ try{ const p=url.pathname.split('/'); const a=decodeURIComponent(p[p.length-2]).toLowerCase(); const b=decodeURIComponent(p[p.length-1]).toLowerCase(); let isF=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_id=? AND following_id=?").bind(a,b).first(); let isBack=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_id=? AND following_id=?").bind(b,a).first(); return new Response(JSON.stringify({following:!!isF, followback:!!isBack, mutual:!!isF&&!!isBack}),{headers:cors}); }catch{ return new Response(JSON.stringify({following:false}),{headers:cors}); } }
  if(url.pathname.startsWith("/api/follow-stats/")){ try{ const uid=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase(); let followers=await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE following_id=?").bind(uid).first(); let following=await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE follower_id=?").bind(uid).first(); return new Response(JSON.stringify({followers:followers?.total||0,following:following?.total||0}),{headers:cors}); }catch{ return new Response(JSON.stringify({followers:0,following:0}),{headers:cors}); } }
  if(url.pathname==="/api/fotos" && req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM fotos ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch{ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/fotos" && req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("INSERT INTO fotos (url, caption, user_email, time) VALUES (?,?,?,?)").bind(j.url||"",j.caption||"",j.user_email||"",Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); } }
  if(url.pathname==="/api/tulis" && req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch{ return new Response(JSON.stringify([]),{headers:cors}); } }
  if(url.pathname==="/api/tulis" && req.method==="POST"){ try{ let j=await req.json(); let foto=j.tulisImg||j.url||""; await env.DB.prepare("INSERT INTO tulis (text,user_email,name,picture,time,tulisImg,url) VALUES (?,?,?,?,?,?,?)").bind(j.text||"",j.user_email||"",j.name||"",j.picture||"",Date.now(),foto,foto).run(); return new Response(JSON.stringify({ok:true}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors}); } }
  if(url.pathname==="/api/videos"){ let local=[]; try{ let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=r.results?.map(x=>x.id)||[]; }catch{} let all=[...new Set([...local,...(GLOBAL_VIDEOS||[])])]; return new Response(JSON.stringify(all),{headers:cors}); }
  if(url.pathname==="/api/ai"&&req.method==="POST"){ try{ let j=await req.json(); let GROQ=env.GROQ_API_KEY; let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:"Kamu Rumah Gadang AI"},{role:"user",content:j.prompt}],temperature:0.7})}); let d=await r.json(); return new Response(JSON.stringify({reply:d.choices?.[0]?.message?.content||"Error"}),{headers:cors}); }catch{ return new Response(JSON.stringify({reply:"Error"}),{headers:cors}); } }

  // === ROUTING FINAL - INI YANG BIKIN /akun JADI /naura ===
  let path = url.pathname;
  // Halaman statis yang asli
  if(path==="/"||path.startsWith("/home")||path.startsWith("/tulis")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html"}});
  if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html"}});
  if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html"}});
  if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html"}});
  if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html"}});
  if(path.startsWith("/akun")||path==="/a") return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html"}});
  
  // JIKA BUKAN HALAMAN STATIS, ANGGAP USERNAME - KAYAK IG
  // Jadi rumahgadang-ai.my.id/naura, /admin, /amanda langsung jadi profil, URL tetep /naura
  if(path.length > 1 && !path.startsWith("/api") && !path.includes(".") && !path.startsWith("/sitemap") && !path.startsWith("/robots")){
    return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html"}});
  }

  return new Response(HOME_HTML,{headers:{"Content-Type":"text/html"}});
}
};
