import * as HOME_M from './home/index.js';
import * as FOTO_M from './foto/index.js';
import * as VIDEO_M from './video/index.js';
import * as LUAR_M from './kantor/Luar/index.js';
import * as DALAM_M from './kantor/Dalam/index.js';
import * as AI_M from './ai/index.js';
import * as AKUN_M from './akun/index.js';
import * as TULIS_M from './home/api-tulis/api.js';
import * as FOTO_API_M from './foto/api-foto/api.js';
import * as VIDEO_API_M from './video/api-video/api.js';
import * as AKUN_API_M from './akun/api-akun/api.js';
import * as AI_API_M from './ai/api-ai/api.js';
import * as SITEMAP_M from './api-sitemap/index.js';

function getHtml(mod){ 
  return mod.default || mod.HOME_HTML || mod.HOME || mod.FOTO_HTML || mod.FOTO || mod.VIDEO_HTML || mod.VIDEO || mod.AI_HTML || mod.AI || mod.KANTOR_HTML || mod.KANTOR || mod.LUAR_HTML || mod.LUAR || mod.DALAM_HTML || mod.DALAM || mod.AKUN_HTML || mod.AKUN || Object.values(mod)[0]; 
}
function getApi(mod){ return mod.FOTO_API || mod.VIDEO_API || mod.AKUN_API || mod.AI_API || mod.TULIS_API || mod.SITEMAP_API || mod.default || mod; }

const HOME_HTML = getHtml(HOME_M);
const FOTO_HTML = getHtml(FOTO_M);
const VIDEO_HTML = getHtml(VIDEO_M);
const LUAR_HTML = getHtml(LUAR_M);
const DALAM_HTML = getHtml(DALAM_M);
const KANTOR_HTML = LUAR_HTML;
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

    const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':','');
    const host = (req.headers.get('host') || url.hostname).toLowerCase();
    if(proto === 'http'){
      return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    }
    if(host.startsWith('www.')){
      return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    }
    if(path === "/home" || path === "/home/"){
      return Response.redirect("https://rumahgadang-ai.my.id/", 301);
    }
    if(["/foto/","/video/","/kantor/","/ai/","/akun/","/luar/","/dalam/"].includes(path)){
      return Response.redirect("https://rumahgadang-ai.my.id"+path.slice(0,-1), 301);
    }

    if(path === "/sitemap.xml" || path === "/sitemap/" || path === "/sitemap"){
      const now = new Date().toISOString().split('T')[0];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://rumahgadang-ai.my.id/</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/foto</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/video</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/ai</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/kantor</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/luar</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/dalam</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://rumahgadang-ai.my.id/akun</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
</urlset>`;
      return new Response(xml.trim(), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "no-cache",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if(path === "/robots.txt" || path === "/robots" || path === "/robots/"){
      const robots = `User-agent: *
Allow: /

Disallow: /api/akun/update
Disallow: /api/akun/register
Disallow: /api/register
Disallow: /api/tulis/delete
Disallow: /api/ig-curated/delete
Disallow: /api/debug

Sitemap: https://rumahgadang-ai.my.id/sitemap.xml
Host: https://rumahgadang-ai.my.id`;
      return new Response(robots, {status:200, headers:{"Content-Type":"text/plain;charset=utf-8", "Cache-Control":"public, max-age=3600"}});
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
      const blockedForGet = [
        "/api/akun/update",
        "/api/akun/register",
        "/api/register",
        "/api/tulis/delete"
      ];
      const isBlocked = blockedForGet.some(p => path.startsWith(p));
      if(isBlocked && req.method === "GET"){
        return new Response(JSON.stringify({ok:false,error:"API private - use POST"}),{headers:cors,status:404});
      }
      if(path === "/api/ai" && req.method === "GET"){
        return new Response(JSON.stringify({ok:false,error:"Use POST"}),{headers:cors,status:404});
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
        // ✅ RUTE API AKUN, FOLLOW, FOLLOWERS, FOLLOWING, PHOTO LIKES & COMMENTS
        if(path.startsWith('/api/akun') || path.startsWith('/api/follow') || path.startsWith('/api/followers') || path.startsWith('/api/following') || path.startsWith('/api/photo') || path.startsWith('/api/users') || path.startsWith('/api/search-users')){
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

    // ✅ TANGKAP RUTE NAMA AKUN PROFIL DI ATAS (SEBELUM /akun)
    const segments = path.split("/").filter(Boolean);
    if(segments.length > 0){
      let username = segments[0];
      const reserved = ["home","foto","video","ai","kantor","luar","dalam","akun","api","sitemap","robots","profil","profile","icon.png","favicon.ico"];
      if(!reserved.includes(username) && !username.includes(".") && username.length >= 2){
        let targetEmail = username.includes('@') ? username : username + '@rumahgadang-ai.my.id';
        let modifiedAkunHtml = AKUN_HTML.replace('window.location.search', `"?profil=${encodeURIComponent(targetEmail)}"`);
        return htmlResponse(modifiedAkunHtml, "https://rumahgadang-ai.my.id/" + username);
      }
    }

    if(path==="/"||path==="/home"||path.startsWith("/home/")) return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
    if(path.startsWith("/foto")) return htmlResponse(FOTO_HTML, "https://rumahgadang-ai.my.id/foto");
    if(path.startsWith("/video")) return htmlResponse(VIDEO_HTML, "https://rumahgadang-ai.my.id/video");
    if(path.startsWith("/ai")) return htmlResponse(AI_HTML, "https://rumahgadang-ai.my.id/ai");
    if(path.startsWith("/luar")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/luar");
    if(path.startsWith("/dalam")) return htmlResponse(DALAM_HTML, "https://rumahgadang-ai.my.id/dalam");
    if(path.startsWith("/kantor/luar")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/kantor/luar");
    if(path.startsWith("/kantor/dalam")) return htmlResponse(DALAM_HTML, "https://rumahgadang-ai.my.id/kantor/dalam");
    if(path.startsWith("/kantor")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/kantor");
    if(path.startsWith("/akun") || path.startsWith("/profil") || path.startsWith("/profile") || path.startsWith("/u/")) {
      return htmlResponse(AKUN_HTML, "https://rumahgadang-ai.my.id/akun");
    }

    return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
  }
};
