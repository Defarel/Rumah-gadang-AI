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

function injectCanonical(html, canonicalUrl){
  if(!html || typeof html !== 'string') return html;
  if(html.includes('rel="canonical"')){
    return html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}">`);
  }
  if(html.includes('</title>')){
    return html.replace('</title>', `</title>\n<link rel="canonical" href="${canonicalUrl}">`);
  }
  if(html.includes('</head>')){
    return html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}">\n</head>`);
  }
  return html;
}
function htmlResponse(html, canonical){
  const fixed = injectCanonical(html, canonical);
  return new Response(fixed, {headers:{"Content-Type":"text/html;charset=utf-8", "Cache-Control":"public, max-age=300"}});
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS,DELETE','Access-Control-Allow-Headers':'Content-Type', 'Cache-Control':'no-store', 'X-Robots-Tag':'noindex, nofollow'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    // === FIX WWW + 4XX DARI SS TERAKHIR BOS ===
    const host = (req.headers.get('host') || url.hostname).toLowerCase();
    if(host.startsWith('www.')){
      return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    }

    if(path === "/home" || path === "/home/"){
      return Response.redirect("https://rumahgadang-ai.my.id/", 301);
    }
    if(["/foto/","/video/","/kantor/","/ai/","/akun/"].includes(path)){
      return Response.redirect("https://rumahgadang-ai.my.id"+path.slice(0,-1), 301);
    }

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
      return new Response(`User-agent: *
Allow: /

# Fix 404 + 4xx - Blokir semua API private biar gak ke-crawl
Disallow: /api/
Disallow: /api/akun/
Disallow: /api/akun/update
Disallow: /api/akun/register
Disallow: /api/akun/profile
Disallow: /api/follow
Disallow: /api/follow-stats/
Disallow: /api/register
Disallow: /api/users
Disallow: /api/search-users/
Disallow: /api/tulis/
Disallow: /api/tulis/delete
Disallow: /api/debug
Disallow: /api/ig-curated/
Disallow: /api/images/

Sitemap: https://rumahgadang-ai.my.id/sitemap.xml
Host: https://rumahgadang-ai.my.id`,{headers:{"Content-Type":"text/plain;charset=utf-8"}});
    }

    if(path==="/api/ig-curated/delete" || path==="/api/images/delete" || path==="/api/foto/delete" || path==="/api/delete" || path==="/api/tulis/delete" || path==="/api/home/delete"){
      try{
        let body={}; try{ body=await req.json(); }catch{}
        let idDel = String(body.id||url.searchParams.get('id')||'');
        if(!idDel) return new Response(JSON.stringify({ok:false,error:"id kosong Bos"}),{headers:cors,status:400});
        let idInt = parseInt(idDel); if(isNaN(idInt)) idInt = -999;
        let logs = [];
        if(env.DB){
          for(let tbl of ["ig_curated","images","foto","tulis","home_tulis","posts"]){
            try{ let r=await env.DB.prepare(`DELETE FROM ${tbl} WHERE id=?`).bind(idInt).run(); logs.push(tbl+"_int:"+r.meta.changes); }catch(e){ logs.push(tbl+"_int_err:"+e.message); }
            try{ let r=await env.DB.prepare(`DELETE FROM ${tbl} WHERE CAST(id AS TEXT)=?`).bind(idDel).run(); logs.push(tbl+"_str:"+r.meta.changes); }catch(e){ logs.push(tbl+"_str_err:"+e.message); }
          }
        }
        return new Response(JSON.stringify({ok:true,deleted:idDel, logs:logs}),{headers:cors});
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
    }

    if(path.startsWith("/api/debug")){
      try{
        if(!env.DB) return new Response(JSON.stringify({ok:false, error:"DB GAK ADA BOS"}),{headers:cors});
        if(path.includes("/ids")){
          let ig = await env.DB.prepare("SELECT id, time, akun, linkIG, caption, substr(img,1,30) as img_preview FROM ig_curated ORDER BY id DESC LIMIT 50").all().catch(()=>({results:[]}));
          let img = await env.DB.prepare("SELECT id, time, substr(url,1,30) as url_preview FROM images ORDER BY id DESC LIMIT 50").all().catch(()=>({results:[]}));
          let ft = await env.DB.prepare("SELECT id, time, email FROM foto ORDER BY id DESC LIMIT 50").all().catch(()=>({results:[]}));
          let tl = await env.DB.prepare("SELECT id, time, email, substr(isi,1,30) as isi_preview FROM tulis ORDER BY id DESC LIMIT 50").all().catch(()=>({results:[]}));
          return new Response(JSON.stringify({ok:true, ig_curated: ig.results, images: img.results, foto: ft.results, tulis: tl.results}),{headers:cors});
        }
        if(path.includes("/akun")){
          let users = await env.DB.prepare("SELECT rowid, email, name, substr(picture,1,20) as pic_preview FROM users ORDER BY rowid DESC LIMIT 100").all().catch(()=>({results:[]}));
          let cleanUsers = users.results.map(u=>({id:u.rowid, email:u.email, name:u.name}));
          return new Response(JSON.stringify({ok:true, count: cleanUsers.length, akun: cleanUsers}),{headers:cors});
        }
        let tables = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().catch(()=>({results:[]}));
        return new Response(JSON.stringify({ok:true, tables: tables.results.map(t=>t.name)}),{headers:cors});
      }catch(e){
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:cors,status:500});
      }
    }
    
    if(path==="/f"||path==="/f/") path="/foto";
    if(path==="/v"||path==="/v/") path="/video";
    if(path==="/a"||path==="/a/") path="/ai";

    if(path.startsWith('/api/')){
      // FIX DARI 2 SS UDA: 404 9 halaman + 4xx 2 halaman
      const blockedForGet = [
        "/api/akun/update","/api/follow-stats","/api/follow","/api/register",
        "/api/users","/api/akun/register","/api/search-users",
        "/api/tulis/delete","/api/akun/profile","/api/akun/"
      ];
      const isBlocked = blockedForGet.some(p => path.startsWith(p));
      if(path === "/api/ai" && req.method === "GET"){
        return new Response(JSON.stringify({ok:false,error:"Use POST"}),{headers:cors,status:404});
      }
      if(isBlocked && req.method === "GET"){
        return new Response(JSON.stringify({ok:false,error:"API private"}),{headers:cors,status:404});
      }

      try{
        if(path.startsWith('/api/tulis')){
          let m=getApi(TULIS_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/foto') || path.startsWith('/api/images') || path.startsWith('/api/ig-curated') || path.startsWith('/api/ig-preview')){
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
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
      return new Response(JSON.stringify({ok:false,error:"No handler "+path}),{headers:cors,status:404});
    }

    if(path==="/"||path==="/home"||path.startsWith("/home/")) return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
    if(path.startsWith("/foto")) return htmlResponse(FOTO_HTML, "https://rumahgadang-ai.my.id/foto");
    if(path.startsWith("/video")) return htmlResponse(VIDEO_HTML, "https://rumahgadang-ai.my.id/video");
    if(path.startsWith("/ai")) return htmlResponse(AI_HTML, "https://rumahgadang-ai.my.id/ai");
    if(path.startsWith("/kantor")) return htmlResponse(KANTOR_HTML, "https://rumahgadang-ai.my.id/kantor");
    if(path.startsWith("/akun") || path.startsWith("/profil") || path.startsWith("/profile") || path.startsWith("/u/")) {
      return htmlResponse(AKUN_HTML, "https://rumahgadang-ai.my.id/akun");
    }
    let seg=path.replace(/^\/+/,"").split("/")[0];
    if(seg && !["home","foto","video","ai","kantor","akun","api","sitemap","robots","profil","profile","icon.png","favicon.ico"].includes(seg) && !seg.includes(".") && seg.length>=2){
      return htmlResponse(AKUN_HTML, "https://rumahgadang-ai.my.id/akun");
    }
    return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
  }
                                                                            }
