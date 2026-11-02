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

// ===== AI API FINAL - GROQ + HF KREA 2 =====
export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const p = url.pathname.toLowerCase();

    if (req.method === "GET" && (p === "/api/ai" || p === "/api/t2i")) {
      return new Response(JSON.stringify({
        ok: true,
        TEXT: "GROQ_API_KEY: " + !!env.GROQ_API_KEY,
        IMAGE: "HF KREA 2: " + !!env.API_T2I,
        has_GROQ: !!env.GROQ_API_KEY,
        has_T2I: !!env.API_T2I
      }), { headers: cors });
    }

    if (p === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      prompt = (prompt||"").trim();
      if(!prompt) return new Response(JSON.stringify({reply:"Prompt kosong"}),{headers:cors});
      let GROQ_KEY = (env.GROQ_API_KEY || "").trim();
      if(!GROQ_KEY) return new Response(JSON.stringify({reply:"GROQ_API_KEY belum set"}),{headers:cors});
      for (let model of ["openai/gpt-oss-120b","openai/gpt-oss-20b","llama-3.3-70b-versatile"]) {
        try {
          let r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
            body:JSON.stringify({model,messages:[{role:"system",content:"KAMU: Rumah Gadang AI Padang, ramah Minang, singkat max 60 kata."},{role:"user",content:prompt}],temperature:0.7,max_tokens:400})
          });
          let d = await r.json();
          if(d.choices?.[0]?.message?.content){
            return new Response(JSON.stringify({reply:d.choices[0].message.content,model}),{headers:cors});
          }
        } catch {}
      }
      return new Response(JSON.stringify({reply:"Groq gagal"}),{headers:cors});
    }

    if ((p === "/api/t2i") && req.method === "POST") {
      try {
        let { prompt, model } = await req.json().catch(()=>({}));
        model = model || "krea/Krea-2-Turbo";
        prompt = (prompt||"").trim();
        let HF_TOKEN = (env.API_T2I || "").trim();
        if(!HF_TOKEN) return new Response(JSON.stringify({ok:false,error:"API_T2I (HF Token) belum set"}),{headers:cors,status:500});
        if(!prompt) return new Response(JSON.stringify({ok:false,error:"Prompt kosong"}),{headers:cors,status:400});

        const HF_URL = `https://router.huggingface.co/hf-inference/models/${model}`;
        let r = await fetch(HF_URL,{
          method:"POST",
          headers:{ "Authorization":"Bearer "+HF_TOKEN, "Content-Type":"application/json" },
          body:JSON.stringify({ inputs: prompt })
        });

        let ct = r.headers.get("content-type")||"";
        if(ct.startsWith("image/") || ct === "application/octet-stream"){
          let buf = await r.arrayBuffer();
          let bytes = new Uint8Array(buf);
          let binary = "";
          for(let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i]);
          let b64 = btoa(binary);
          let dataUrl = `data:${ct || "image/png"};base64,${b64}`;
          return new Response(JSON.stringify({ok:true,prompt,model,image:dataUrl}),{headers:cors});
        }

        let text = await r.text();
        let d; try{ d = JSON.parse(text); } catch{ d = {raw_text:text}; }
        if(d.error){
          return new Response(JSON.stringify({ok:false,error:d.error, hint:"Accept license di huggingface.co/krea/Krea-2-Turbo dulu", raw:d}),{headers:cors,status:500});
        }
        let img = d.image || d.output || d.images?.[0] || null;
        if(img){
          if(!img.startsWith("data:") && !img.startsWith("http")) img = `data:image/png;base64,${img}`;
          return new Response(JSON.stringify({ok:true,prompt,model,image:img}),{headers:cors});
        }
        return new Response(JSON.stringify({ok:false,error:"HF tidak kasih gambar",raw:d}),{headers:cors,status:500});
      } catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
    }
    return null;
  }
};

// ===== HELPERS =====
function getHtml(mod){ return mod.default || mod.HOME_HTML || mod.HOME || mod.FOTO_HTML || mod.FOTO || mod.VIDEO_HTML || mod.VIDEO || mod.AI_HTML || mod.AI || mod.LUAR_HTML || mod.DALAM_HTML || mod.AKUN_HTML || mod.AKUN || Object.values(mod)[0]; }
function getApi(mod){ return mod.FOTO_API || mod.VIDEO_API || mod.AKUN_API || mod.AI_API || mod.TULIS_API || mod.default || mod; }

const HOME_HTML = getHtml(HOME_M);
const FOTO_HTML = getHtml(FOTO_M);
const VIDEO_HTML = getHtml(VIDEO_M);
const LUAR_HTML = getHtml(LUAR_M);
const DALAM_HTML = getHtml(DALAM_M);
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

// ===== MAIN FETCH =====
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS,DELETE','Access-Control-Allow-Headers':'Content-Type', 'Cache-Control':'no-store', 'X-Robots-Tag':'noindex, nofollow'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':','');
    const host = (req.headers.get('host') || url.hostname).toLowerCase();
    if(proto === 'http') return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    if(host.startsWith('www.')) return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    if(path === "/home" || path === "/home/") return Response.redirect("https://rumahgadang-ai.my.id/", 301);
    if(["/foto/","/video/","/kantor/","/ai/","/akun/","/luar/","/dalam/"].includes(path)){
      return Response.redirect("https://rumahgadang-ai.my.id"+path.slice(0,-1), 301);
    }

    // SITEMAP
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
      return new Response(xml.trim(), { status: 200, headers: { "Content-Type": "application/xml; charset=UTF-8", "Cache-Control":"no-cache", "Access-Control-Allow-Origin":"*" } });
    }

    // ROBOTS
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

    // DELETE HANDLER
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

    // DEBUG
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
      const blockedForGet = [ "/api/akun/update", "/api/akun/register", "/api/register", "/api/tulis/delete" ];
      const isBlocked = blockedForGet.some(p => path.startsWith(p));
      if(isBlocked && req.method === "GET"){
        return new Response(JSON.stringify({ok:false,error:"API private - use POST"}),{headers:cors,status:404});
      }
      if(path === "/api/ai" && req.method === "GET"){
        // biarkan AI_API yang handle GET status
      }
      try{
        // PRIORITAS: AI & T2I pakai HF KREA 2 baru
        if(path.startsWith('/api/ai') || path.startsWith('/api/t2i')){
          let r = await AI_API.handle(req,env,url,cors);
          if(r) return r;
          let m=getApi(AI_API_M); if(m?.handle){ let r2=await m.handle(req,env,url,cors); if(r2) return r2; }
        }
        if(path.startsWith('/api/tulis')){
          let m=getApi(TULIS_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/foto') || path.startsWith('/api/images') || path.startsWith('/api/ig-curated') || path.startsWith('/api/ig-preview')){
          let m=getApi(FOTO_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/video')){
          let m=getApi(VIDEO_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
        if(path.startsWith('/api/akun') || path.startsWith('/api/follow') || path.startsWith('/api/followers') || path.startsWith('/api/following') || path.startsWith('/api/photo') || path.startsWith('/api/users') || path.startsWith('/api/search-users')){
          let m=getApi(AKUN_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; }
        }
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
      return new Response(JSON.stringify({ok:false,error:"No handler "+path}),{headers:cors,status:404});
    }

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
