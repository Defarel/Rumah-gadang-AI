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

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    try{
      if(env.DB){
        // BOS: TABEL LAMA BOS
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, judul TEXT, isi TEXT, user_email TEXT, email TEXT, name TEXT, nama TEXT, picture TEXT, avatar TEXT, tulisImg TEXT, img TEXT, image TEXT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, video TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
        
        // BOS: TABEL BARU BUAT AKUN BOS - INI YANG BIKIN ERROR KEMARIN BOS!
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, username TEXT, name TEXT, picture TEXT, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY, username TEXT, name TEXT, picture TEXT, bio TEXT)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS follows (follower_id TEXT, following_id TEXT, PRIMARY KEY (follower_id, following_id))").run();
      }
    }catch(e){ console.log("DB Error Bos:", e.message); }

    let r;
    r=await SITEMAP_API.handle(req,env,url); if(r) return r;
    if(path.startsWith('/api/')){
      r=await TULIS_API.handle(req,env,url,cors); if(r) return r;
      r=await FOTO_API.handle(req,env,url,cors); if(r) return r;
      r=await VIDEO_API.handle(req,env,url,cors); if(r) return r;
      r=await AI_API.handle(req,env,url,cors); if(r) return r;
      r=await AKUN_API.handle(req,env,url,cors); if(r) return r;
      return new Response(JSON.stringify([]),{headers:cors});
    }

    // BOS: FIX ROUTING BOS - INI KUNCINYA BOS!
    const RESERVED = ["home","foto","video","ai","kantor","akun","api","sitemap","robots","icon.png","favicon.ico"];
    
    if(path==="/"||path.startsWith("/home")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});

    // BOS: JIKA PATH CUMA /namauser BOS, ARAHKAN KE AKUN_HTML BOS, BUKAN HOME BOS!
    let seg = path.replace(/^\/+/, "").split("/")[0].toLowerCase();
    if(seg && !RESERVED.includes(seg) && !seg.includes(".") && seg.length >= 2 && seg.length <= 30){
      return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    }

    return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  }
}
