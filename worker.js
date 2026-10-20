import * as HOME_M from './home/index.js';
import * as FOTO_M from './foto/index.js';
import * as VIDEO_M from './video/index.js';
import * as KANTOR_M from './kantor/index.js';
import * as AI_M from './ai/index.js';
import * as AKUN_M from './akun/index.js';

import * as TULIS_M from './home/api-tulis/api.js';
import * as FOTO_API_M from './foto/api-foto/api.js';
import * as VIDEO_API_M from './video/api-video/api.js';
import * as AKUN_API_M from './akun/api-akun/api.js';
import * as AI_API_M from './ai/api-ai/api.js';

const HOME = HOME_M.default || HOME_M.HOME_HTML || HOME_M.html || Object.values(HOME_M)[0];
const FOTO = FOTO_M.default || FOTO_M.FOTO_HTML || Object.values(FOTO_M)[0];
const VIDEO = VIDEO_M.default || VIDEO_M.VIDEO_HTML || Object.values(VIDEO_M)[0];
const KANTOR = KANTOR_M.default || KANTOR_M.KANTOR_HTML || Object.values(KANTOR_M)[0];
const AI = AI_M.default || AI_M.AI_HTML || Object.values(AI_M)[0];
const AKUN = AKUN_M.default || AKUN_M.AKUN_HTML || Object.values(AKUN_M)[0];

const TULIS_API = TULIS_M.handle || TULIS_M.default || TULIS_M.TULIS_API || Object.values(TULIS_M)[0];
const FOTO_API = FOTO_API_M.handle || FOTO_API_M.default || Object.values(FOTO_API_M)[0];
const VIDEO_API = VIDEO_API_M.handle || VIDEO_API_M.default || Object.values(VIDEO_API_M)[0];
const AKUN_API = AKUN_API_M.handle || AKUN_API_M.default || Object.values(AKUN_API_M)[0];
const AI_API = AI_API_M.handle || AI_API_M.default || Object.values(AI_API_M)[0];

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});
    try{
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, url TEXT, time INTEGER)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)").run();
    }catch(e){}
    if(path.startsWith('/api/')){
      let r;
      if(TULIS_API){ r = await TULIS_API(req,env,url,cors); if(r) return r; }
      if(FOTO_API){ r = await FOTO_API(req,env,url,cors); if(r) return r; }
      if(VIDEO_API){ r = await VIDEO_API(req,env,url,cors); if(r) return r; }
      if(AKUN_API){ r = await AKUN_API(req,env,url,cors); if(r) return r; }
      if(AI_API){ r = await AI_API(req,env,url,cors); if(r) return r; }
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
