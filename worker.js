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

// ===== AI API FINAL - GROQ + HF KREA 2 (FAL-AI QUEUE) =====
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
        TEXT: "GROQ: " + !!env.GROQ_API_KEY,
        IMAGE: "HF KREA 2 (fal-ai queue): " + !!env.API_T2I
      }), { headers: cors });
    }

    if (p === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      prompt = (prompt||"").trim();
      if(!prompt) return new Response(JSON.stringify({reply:"Prompt kosong"}),{headers:cors});
      let GROQ_KEY = (env.GROQ_API_KEY || "").trim();
      for (let model of ["openai/gpt-oss-120b","openai/gpt-oss-20b","llama-3.3-70b-versatile"]) {
        try {
          let r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
            body:JSON.stringify({model,messages:[{role:"system",content:"KAMU: Rumah Gadang AI Padang, ramah Minang, singkat max 60 kata."},{role:"user",content:prompt}],temperature:0.7,max_tokens:400})
          });
          let d = await r.json();
          if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content,model}),{headers:cors});
        } catch {}
      }
      return new Response(JSON.stringify({reply:"Groq gagal"}),{headers:cors});
    }

    if ((p === "/api/t2i") && req.method === "POST") {
      try {
        let { prompt } = await req.json().catch(()=>({}));
        prompt = (prompt||"Gambarkan jalan lurus").trim();
        let HF_TOKEN = (env.API_T2I || "").trim();
        if(!HF_TOKEN) return new Response(JSON.stringify({ok:false,error:"API_T2I belum set"}),{headers:cors,status:500});

        async function query(data) {
          const response = await fetch(
            "https://router.huggingface.co/fal-ai/fal-ai/krea-2/turbo?_subdomain=queue",
            {
              headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(data),
            }
          );
          const ct = response.headers.get("content-type")||"";
          if(ct.includes("application/json")){
            let txt = await response.text();
            throw new Error(txt);
          }
          const result = await response.blob();
          return result;
        }

        let blob = await query({ prompt: prompt });
        let buf = await blob.arrayBuffer();
        let b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
        let dataUrl = `data:image/png;base64,${b64}`;
        
        return new Response(JSON.stringify({ok:true,prompt,model:"krea/Krea-2-Turbo",image:dataUrl}),{headers:cors});

      } catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
    }
    return null;
  }
};

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
  if(html.includes('rel="canonical"')) return html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}">`);
  if(html.includes('</title>')) return html.replace('</title>', `</title>\n<link rel="canonical" href="${canonicalUrl}">`);
  if(html.includes('</head>')) return html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}">\n</head>`);
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
    if(proto === 'http') return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    if(host.startsWith('www.')) return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search, 301);
    if(path === "/home" || path === "/home/") return Response.redirect("https://rumahgadang-ai.my.id/", 301);
    if(["/foto/","/video/","/kantor/","/ai/","/akun/","/luar/","/dalam/"].includes(path)) return Response.redirect("https://rumahgadang-ai.my.id"+path.slice(0,-1), 301);
    if(path === "/sitemap.xml" || path === "/sitemap/" || path === "/sitemap"){
      const now = new Date().toISOString().split('T')[0];
      const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://rumahgadang-ai.my.id/</loc><lastmod>${now}</lastmod></url><url><loc>https://rumahgadang-ai.my.id/foto</loc><lastmod>${now}</lastmod></url><url><loc>https://rumahgadang-ai.my.id/video</loc><lastmod>${now}</lastmod></url><url><loc>https://rumahgadang-ai.my.id/ai</loc><lastmod>${now}</lastmod></url></urlset>`;
      return new Response(xml.trim(), { status: 200, headers: { "Content-Type": "application/xml; charset=UTF-8" } });
    }
    if(path === "/robots.txt"){
      const robots = `User-agent: *\nAllow: /\nSitemap: https://rumahgadang-ai.my.id/sitemap.xml`;
      return new Response(robots, {status:200, headers:{"Content-Type":"text/plain;charset=utf-8"}});
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
      try{
        if(path.startsWith('/api/ai') || path.startsWith('/api/t2i')){
          let r = await AI_API.handle(req,env,url,cors);
          if(r) return r;
          let m=getApi(AI_API_M); if(m?.handle){ let r2=await m.handle(req,env,url,cors); if(r2) return r2; }
        }
        if(path.startsWith('/api/tulis')){ let m=getApi(TULIS_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; } }
        if(path.startsWith('/api/foto') || path.startsWith('/api/images') || path.startsWith('/api/ig-curated')){ let m=getApi(FOTO_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; } }
        if(path.startsWith('/api/video')){ let m=getApi(VIDEO_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; } }
        if(path.startsWith('/api/akun') || path.startsWith('/api/follow') || path.startsWith('/api/users')){ let m=getApi(AKUN_API_M); if(m?.handle){ let r=await m.handle(req,env,url,cors); if(r) return r; } }
      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
      }
      return new Response(JSON.stringify({ok:false,error:"No handler "+path}),{headers:cors,status:404});
    }
    if(path==="/"||path.startsWith("/home/")) return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
    if(path.startsWith("/foto")) return htmlResponse(FOTO_HTML, "https://rumahgadang-ai.my.id/foto");
    if(path.startsWith("/video")) return htmlResponse(VIDEO_HTML, "https://rumahgadang-ai.my.id/video");
    if(path.startsWith("/ai")) return htmlResponse(AI_HTML, "https://rumahgadang-ai.my.id/ai");
    if(path.startsWith("/luar")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/luar");
    if(path.startsWith("/dalam")) return htmlResponse(DALAM_HTML, "https://rumahgadang-ai.my.id/dalam");
    if(path.startsWith("/akun")) return htmlResponse(AKUN_HTML, "https://rumahgadang-ai.my.id/akun");
    return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
  }
};
