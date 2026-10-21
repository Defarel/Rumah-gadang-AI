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

function getHtml(mod){ return mod.default || mod.HOME_HTML || mod.HOME || mod.FOTO_HTML || mod.FOTO || mod.VIDEO_HTML || mod.VIDEO || mod.AI_HTML || mod.AI || mod.KANTOR_HTML || mod.KANTOR || mod.AKUN_HTML || mod.AKUN || Object.values(mod)[0]; }
function getApi(mod){ return mod.FOTO_API || mod.VIDEO_API || mod.AKUN_API || mod.AI_API || mod.TULIS_API || mod.SITEMAP_API || mod.default || mod; }

const HOME_HTML = getHtml(HOME_M);
const FOTO_HTML = getHtml(FOTO_M);
const VIDEO_HTML = getHtml(VIDEO_M);
const KANTOR_HTML = getHtml(KANTOR_M);
const AI_HTML = getHtml(AI_M);
const AKUN_HTML = getHtml(AKUN_M);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS,DELETE','Access-Control-Allow-Headers':'Content-Type'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    if(path === "/sitemap.xml" || path === "/sitemap/" || path === "/sitemap"){
      try{
        let m=getApi(SITEMAP_M);
        if(m?.handle){ let r=await m.handle(req,env,url); if(r) return r; }
        if(typeof m === 'string' && m.includes('<urlset')) return new Response(m,{headers:{"Content-Type":"application/xml;charset=utf-8"}});
      }catch(e){}
      const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://rumahgadang-ai.my.id/</loc><priority>1.0</priority></url><url><loc>https://rumahgadang-ai.my.id/foto</loc><priority>0.8</priority></url><url><loc>https://rumahgadang-ai.my.id/video</loc><priority>0.8</priority></url><url><loc>https://rumahgadang-ai.my.id/ai</loc><priority>0.9</priority></url><url><loc>https://rumahgadang-ai.my.id/kantor</loc><priority>0.7</priority></url><url><loc>https://rumahgadang-ai.my.id/akun</loc><priority>0.5</priority></url></urlset>`;
      return new Response(xml,{headers:{"Content-Type":"application/xml;charset=utf-8"}});
    }
    if(path === "/robots.txt" || path === "/robots" || path === "/robots/"){
      return new Response(`User-agent: *\nAllow: /\nSitemap: https://rumahgadang-ai.my.id/sitemap.xml`,{headers:{"Content-Type":"text/plain;charset=utf-8"}});
    }

    if(path==="/api/ig-curated/delete" || path==="/api/images/delete" || path==="/api/foto/delete" || path==="/api/delete" || path==="/api/tulis/delete"){
      try{
        let body={}; try{ body=await req.json(); }catch{}
        let idDel = String(body.id||url.searchParams.get('id')||'');
        if(!idDel) return new Response(JSON.stringify({ok:false,error:"id kosong Bos"}),{headers:cors,status:400});
        for(let kvName of Object.keys(env)){
          let kv = env[kvName];
          if(!kv || typeof kv.get !== 'function') continue;
          try{
            for(let key of ['curated','images','list','IG_CURATED','FOTO','HOME_TULIS','tulis']){
              let raw = await kv.get(key).catch(()=>null);
              if(!raw) continue;
              let arr = JSON.parse(raw);
              if(Array.isArray(arr)){
                let filtered = arr.filter(x=> String(x.id||x._id||'') !== idDel);
                if(filtered.length !== arr.length){ await kv.put(key, JSON.stringify(filtered)); }
              }
            }
            await kv.delete(idDel).catch(()=>{});
          }catch{}
        }
        return new Response(JSON.stringify({ok:true,deleted:idDel}),{headers:cors});
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
    }

    if(path==="/f"||path==="/f/") path="/foto";
    if(path==="/v"||path==="/v/") path="/video";
    if(path==="/a"||path==="/a/") path="/ai";

    if(path.startsWith('/api/')){
      try{
        if(path.startsWith('/api/tulis')){
          let m=getApi(TULIS_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/foto') || path.startsWith('/api/images') || path.startsWith('/api/ig-curated') || path.startsWith('/api/ig-preview') || path.startsWith('/api/delete')){
          let m=getApi(FOTO_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/video')){
          let m=getApi(VIDEO_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/akun') || path.startsWith('/api/follow')){
          let m=getApi(AKUN_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/ai')){
          let m=getApi(AI_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/sitemap')||path.startsWith('/sitemap')){
          let m=getApi(SITEMAP_M); if(m?.handle){ let r=await m.handle(req,env,url); if(r) return r; }
        }
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
      return new Response(JSON.stringify({ok:false,error:"No handler "+path}),{headers:cors,status:404});
    }

    if(path==="/"||path==="/home"||path.startsWith("/home/")) return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/foto")) return new Response(FOTO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/video")) return new Response(VIDEO_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/ai")) return new Response(AI_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/kantor")) return new Response(KANTOR_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    if(path.startsWith("/akun")) return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    
    let seg=path.replace(/^\/+/,"").split("/")[0];
    if(seg && !["home","foto","video","ai","kantor","akun","api","sitemap","robots","icon.png","favicon.ico"].includes(seg) && !seg.includes(".") && seg.length>=2){
      return new Response(AKUN_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    }
    return new Response(HOME_HTML,{headers:{"Content-Type":"text/html;charset=utf-8"}});
  }
  }
