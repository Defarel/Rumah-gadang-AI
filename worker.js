import { LOGO, GLOBAL_VIDEOS, isAdmin, getId, ADMIN_EMAILS } from './config.js';

export default{
async fetch(req,env){
const url=new URL(req.url);
const GOOGLE_ID = env.GOOGLE_ID;
const GOOGLE_SECRET = env.GOOGLE_SECRET;
const GROQ = env.GROQ_API_KEY;

if(url.protocol==="http:"){ url.protocol="https:"; return Response.redirect(url.toString(),301); }
if(url.pathname==="/home"||url.pathname==="/home/"){ return Response.redirect("https://www.rumahgadang-ai.my.id/",301); }
if(url.pathname==="/index.html"){ return Response.redirect("https://www.rumahgadang-ai.my.id/",301); }
const cors={"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","X-Robots-Tag":"noindex, nofollow"};
if(req.method==="OPTIONS") return new Response("",{headers:cors});
if(url.pathname==="/robots.txt"){ return new Response("User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://www.rumahgadang-ai.my.id/sitemap.xml\n",{headers:{"Content-Type":"text/plain; charset=utf-8"}}); }
if(url.pathname==="/sitemap.xml"){ let last=new Date().toISOString().split('T')[0]; let pages=["/","/foto","/video","/ai","/akun","/kantor"]; let xml=pages.map(p=>` <url><loc>https://www.rumahgadang-ai.my.id${p}</loc><lastmod>${last}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`).join("\n"); let body=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`; return new Response(body,{headers:{"Content-Type":"text/xml; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}}); }
try{
if(env.DB){
await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis_likes (tulis_id INTEGER, user_email TEXT, PRIMARY KEY(tulis_id, user_email))").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, item_id TEXT, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)").run();
await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, video TEXT, time INTEGER)").run();
try{ await env.DB.prepare("ALTER TABLE ig_curated ADD COLUMN video TEXT").run(); }catch(e){}
}
}catch(e){}
if(url.pathname==="/api/ig-preview"){ let igUrl=url.searchParams.get("url")||""; try{ let resp=await fetch(igUrl,{headers:{"User-Agent":"Mozilla/5.0 (iPhone) AppleWebKit"}}); let html=await resp.text(); let thumb=html.match(/property="og:image"\s+content="([^"]+)"/)?.[1]||""; let username=html.match(/"username":"([^"]+)"/)?.[1]||igUrl.split("/")[3]||"minang"; thumb=thumb.replace(/&amp;/g,"&"); return new Response(JSON.stringify({thumbnail:thumb,username,caption:"Dari @"+username}),{headers:cors}); }catch(e){ return new Response(JSON.stringify({error:"gagal"}),{headers:cors,status:500}); } }
if(url.pathname==="/api/ig-curated"){ try{ let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:cors}); }catch(e){ return new Response(JSON.stringify([]),{headers:cors}); } }
if(url.pathname==="/api/ig-curated/add" && req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,video,time) VALUES (?,?,?,?,?,?)").bind(j.akun||"minang
