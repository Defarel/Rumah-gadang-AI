import HOME from './home/index.js';
import FOTO from './foto/index.js';
import VIDEO from './video/index.js';
import KANTOR from './kantor/index.js';
import AI from './ai/index.js';
import AKUN from './akun/index.js';

import { handle as TULIS_API } from './home/api-tulis/api.js';
import { handle as FOTO_API } from './foto/api-foto/api.js';
import { handle as VIDEO_API } from './video/api-video/api.js';
import { handle as AKUN_API } from './akun/api-akun/api.js';
import { handle as AI_API } from './ai/api-ai/api.js';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    try{
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, url TEXT, time INTEGER)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
    }catch(e){}

    // IMPORT SEMUA API BOS
    if(path.startsWith('/api/')){
      let r;
      r = await TULIS_API(req, env, url, cors); if(r) return r;
      r = await FOTO_API(req, env, url, cors); if(r) return r;
      r = await VIDEO_API(req, env, url, cors); if(r) return r;
      r = await AKUN_API(req, env, url, cors); if(r) return r;
      r = await AI_API(req, env, url, cors); if(r) return r;
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }

    if(path==="/"||path.startsWith("/home")) return new Response(HOME,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/foto")) return new Response(FOTO,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/video")) return new Response(VIDEO,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/kantor")) return new Response(KANTOR,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/ai")) return new Response(AI,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/akun")) return new Response(AKUN,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    return new Response(HOME,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  }
}
