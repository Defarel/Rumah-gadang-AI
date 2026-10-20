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
import * as SITEMAP_M from './api-sitemap/index.js';

// FLEKSIBEL BOS, MAU EXPORT APA AJA KETEMU BOS, GAK ERROR HOME_HTML LAGI BOS!
function getHtml(mod){
  return mod.default || mod.HOME_HTML || mod.HOME || mod.FOTO_HTML || mod.FOTO || mod.VIDEO_HTML || mod.VIDEO || mod.AI_HTML || mod.AI || mod.KANTOR_HTML || mod.KANTOR || mod.AKUN_HTML || mod.AKUN || Object.values(mod)[0];
}
function getApi(mod){
  const m = mod.FOTO_API || mod.VIDEO_API || mod.AKUN_API || mod.AI_API || mod.TULIS_API || mod.SITEMAP_API || mod.default || mod;
  if(m && m.handle) return m.handle.bind(m);
  if(typeof m === 'function') return m;
  if(mod.handle) return mod.handle.bind(mod);
  return Object.values(mod).find(v=>typeof v==='function') || null;
}

const HOME_HTML = getHtml(HOME_M);
const FOTO_HTML = getHtml(FOTO_M);
const VIDEO_HTML = getHtml(VIDEO_M);
const KANTOR_HTML = getHtml(KANTOR_M);
const AI_HTML = getHtml(AI_M);
const AKUN_HTML = getHtml(AKUN_M);

const TULIS_API = getApi(TULIS_M);
const FOTO_API = getApi(FOTO_API_M);
const VIDEO_API = getApi(VIDEO_API_M);
const AKUN_API = getApi(AKUN_API_M);
const AI_API = getApi(AI_API_M);
const SITEMAP_API = getApi(SITEMAP_M);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    // BOS: JANGAN CREATE TABLE DI SINI BOS, BERAT BOS! PINDAH KE D1 CONSOLE SEKALI AJA BOS!
    // Hapus semua env.DB.prepare CREATE TABLE di sini Bos!

    // SITEMAP
    if(SITEMAP_API){ try{ let r=await SITEMAP_API(req,env,url); if(r) return r; }catch{} }

    // NORMALISASI /f /v /a BOS
    if(path==="/f"||path==="/f/") path="/foto";
    if(path==="/v"||path==="/v/") path="/video";
    if(path==="/a"||path==="/a/") path="/ai";

    if(path.startsWith('/api/')){
      try{
        if(path.startsWith('/api/tulis') && TULIS_API){ let r=await TULIS_API(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/foto') || path.startsWith('/api/images') || path.startsWith('/api/ig-curated') || path.startsWith('/api/ig-preview') || path.startsWith('/api/delete')) && FOTO_API){ let r=await FOTO_API(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/video') && VIDEO_API){ let r=await VIDEO_API(req,env,url,cors); if(r) return r; }
        if((path.startsWith('/api/akun') || path.startsWith('/api/follow') || path.startsWith('/api/followers') || path.startsWith('/api/following')) && AKUN_API){ let r=await AKUN_API(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/ai') && AI_API){ let r=await AI_API(req,env,url,cors); if(r) return r; }
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message+" at "+path}),{headers:cors,status:500});
      }
      return new Response(JSON.stringify({ok:false,error:"No handler "+path}),{headers:cors,status:404});
    }

    const RESERVED = ["home","foto","video","ai","kantor","akun","api","sitemap","robots","icon.png","favicon.ico"];
    if(path==="/"||path.startsWith("/home")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});

    let seg = path.replace(/^\/+/, "").split("/")[0];
    if(seg && !RESERVED.includes(seg) && !seg.includes(".") && seg.length>=2 && seg.length<=30){
      return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    }

    return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  }
}
