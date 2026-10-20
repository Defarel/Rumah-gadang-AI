import { SITEMAP_API } from './api/sitemap.js';
import { TULIS_API } from './api/tulis.js';
import { FOTO_API } from './api/foto.js';
import { VIDEO_API } from './api/video.js';
import { AI_API } from './api/ai.js';
import { AKUN_API } from './api/akun.js';

import { HOME_HTML } from './html/home.js';
import { FOTO_HTML } from './html/foto.js';
import { VIDEO_HTML } from './html/video.js';
import { AI_HTML } from './html/ai.js';
import { KANTOR_HTML } from './html/kantor.js';
import { AKUN_HTML } from './html/akun.js';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = { 
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type' 
    };
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    try{
      if(env.DB){
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_follows (follower TEXT, following TEXT, PRIMARY KEY (follower, following))").run();
      }
    }catch(e){}

    try {
      let r;
      if (typeof SITEMAP_API !== 'undefined') {
        r = await SITEMAP_API.handle(req,env,url);
        if(r) return r;
      }
      if(path.startsWith('/api/')){
        if (typeof TULIS_API !== 'undefined') {
          r = await TULIS_API.handle(req,env,url,cors);
          if(r) return r;
        }
        if (typeof FOTO_API !== 'undefined') {
          r = await FOTO_API.handle(req,env,url,cors);
          if(r) return r;
        }
        if (typeof VIDEO_API !== 'undefined') {
          r = await VIDEO_API.handle(req,env,url,cors);
          if(r) return r;
        }
        if (typeof AI_API !== 'undefined') {
          r = await AI_API.handle(req,env,url,cors);
          if(r) return r;
        }
        if (typeof AKUN_API !== 'undefined') {
          r = await AKUN_API.handle(req,env,url,cors);
          if(r) return r;
        }
        return new Response(JSON.stringify({ok:true, msg:"API Ready Bos"}), {headers: cors});
      }
      
      if(path==="/"||path.startsWith("/home")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
      if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
      if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
      if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
      if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
      if(path.startsWith("/akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
      return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    } catch (err) {
      return new Response(JSON.stringify({ok:false, error: err.message, stack: err.stack}), {status:500, headers: cors});
    }
  }
}
