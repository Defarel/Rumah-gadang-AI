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
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, video TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
      }
    }catch(e){}

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

    if(path==="/"||path.startsWith("/home")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  }
}
