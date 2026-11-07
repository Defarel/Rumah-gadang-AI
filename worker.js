import * as HOME_M from './home/index.js';
import * as FOTO_M from './foto/index.js';
import * as VIDEO_M from './video/index.js';
import * as LUAR_M from './kantor/Luar/index.js';
import * as DALAM_M from './kantor/Dalam/index.js';
import * as AI_M from './ai/index.js';
import * as AKUN_M from './akun/index.js';
import * as CHAT_M from './akun/Chat/index.js';
import * as TULIS_M from './home/api-tulis/api.js';
import * as FOTO_API_M from './foto/api-foto/api.js';
import * as VIDEO_API_M from './video/api-video/api.js';
import * as AKUN_API_M from './akun/api-akun/api.js';
import * as AI_API_M from './ai/api-ai/api.js';
import * as SITEMAP_M from './api-sitemap/index.js';

// ===== DARURAT - BUAT HOME KALAU DB KOSONG, BOS =====
const DARURAT_POSTS = [{ id: 1, email: "lintas@rumahgadang.ai", isi: "Pemko Padang bersama BPTD Sumbar resmi meresmikan Terminal Anak Air guna mengoptimalkan fungsi terminal, menertibkan terminal bayangan, serta memperketat pengawasan transportasi publik.", time: 1762290000000, like: 2, komen: 0 }];

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
      let { prompt } = await req.json().catch(() => ({}));
      prompt = (prompt || "").trim();
      if (!prompt) return new Response(JSON.stringify({ reply: "Prompt kosong" }), { headers: cors });
      
      let GROQ_KEY = (env.GROQ_API_KEY || "").trim();
      for (let model of ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile"]) {
        try {
          let r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ_KEY },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: "KAMU: Rumah Gadang AI Padang, ramah Minang, singkat max 60 kata." },
                { role: "user", content: prompt }
              ],
              temperature: 0.7,
              max_tokens: 400
            })
          });
          let d = await r.json();
          if (d.choices?.[0]?.message?.content) {
            return new Response(JSON.stringify({ reply: d.choices[0].message.content, model }), { headers: cors });
          }
        } catch {}
      }
      return new Response(JSON.stringify({ reply: "Groq gagal" }), { headers: cors });
    }

    if (p === "/api/t2i" && req.method === "POST") {
      try {
        let { prompt } = await req.json().catch(() => ({}));
        prompt = (prompt || "Gambarkan jalan lurus").trim();
        let HF_TOKEN = (env.API_T2I || "").trim();
        if (!HF_TOKEN) return new Response(JSON.stringify({ ok: false, error: "API_T2I belum set" }), { headers: cors, status: 500 });

        const response = await fetch(
          "https://router.huggingface.co/fal-ai/fal-ai/krea-2/turbo?_subdomain=queue",
          {
            headers: {
              Authorization: `Bearer ${HF_TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ prompt }),
          }
        );

        const ct = response.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          let txt = await response.text();
          throw new Error(txt);
        }

        let blob = await response.blob();
        let buf = await blob.arrayBuffer();
        let b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
        let dataUrl = `data:image/png;base64,${b64}`;
        
        return new Response(JSON.stringify({ ok: true, prompt, model: "krea/Krea-2-Turbo", image: dataUrl }), { headers: cors });

      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }
    return null;
  }
};

// ===== HELPERS & TEMPLATES =====
function getHtml(mod) { 
  return mod.default || mod.HOME_HTML || mod.HOME || mod.FOTO_HTML || mod.FOTO || mod.VIDEO_HTML || mod.VIDEO || mod.AI_HTML || mod.AI || mod.KANTOR_HTML || mod.KANTOR || mod.LUAR_HTML || mod.LUAR || mod.DALAM_HTML || mod.DALAM || mod.AKUN_HTML || mod.AKUN || mod.CHAT_HTML || mod.CHAT || Object.values(mod)[0]; 
}

function getApi(mod) { 
  return mod.FOTO_API || mod.VIDEO_API || mod.AKUN_API || mod.AI_API || mod.TULIS_API || mod.SITEMAP_API || mod.default || mod; 
}

const HOME_HTML = getHtml(HOME_M);
const FOTO_HTML = getHtml(FOTO_M);
const VIDEO_HTML = getHtml(VIDEO_M);
const LUAR_HTML = getHtml(LUAR_M);
const DALAM_HTML = getHtml(DALAM_M);
const KANTOR_HTML = LUAR_HTML;
const AI_HTML = getHtml(AI_M);
const AKUN_HTML = getHtml(AKUN_M);
const CHAT_HTML = getHtml(CHAT_M);

function injectCanonical(html, canonicalUrl) {
  if (!html || typeof html !== 'string') return html;
  if (html.includes('rel="canonical"')) {
    return html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}">`);
  }
  if (html.includes('</title>')) {
    return html.replace('</title>', `</title>\n<link rel="canonical" href="${canonicalUrl}">`);
  }
  if (html.includes('</head>')) {
    return html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}">\n</head>`);
  }
  return html;
}

// ===== GABUNG PAKSA - OBAT TOMBOL + OBAT KANTOR + OBAT HOME, BOS =====
const OBAT_NAV = `<script>(function(){
document.addEventListener('click', function(e){
  try{
    var a = e.target.closest ? e.target.closest('a') : null;
    if(!a) return;
    var href = a.getAttribute('href') || '';
    if(!href) return;
    var h = href.toLowerCase().split('?')[0];
    var NAV = ['/','/foto','/video','/kantor','/luar','/dalam','/ai','/akun'];
    if(NAV.indexOf(h) !== -1){
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      var dest = href + (href.includes('?') ? '&' : '?') + 'v=' + Date.now();
      window.location.href = dest;
      return false;
    }
  }catch(err){}
}, true);
})();<\/script>`;

function htmlResponse(html, canonical) {
  let fixed = injectCanonical(html, canonical);
  // 1. OBAT TOMBOL - DI SEMUA HALAMAN, BOS
  if (fixed.includes('</body>')) fixed = fixed.replace('</body>', OBAT_NAV + '</body>'); else fixed += OBAT_NAV;
  let isKantor = (canonical || "").includes('/kantor') || (canonical || "").includes('/luar') || (canonical || "").includes('/dalam');
  // 2. OBAT KANTOR V2 - PAKSA SEMBUNYI LOADING TIAP 1 DETIK SETELAH 7 DETIK
  if (isKantor) {
    const OBAT_KANTOR = `<script>(function(){var start=Date.now();setInterval(function(){try{if(Date.now()-start>7000){var l=document.getElementById('loading');if(l){l.style.display='none';}var g=document.getElementById('gpsText');if(g && g.innerText.includes('Init')){g.innerText='Siap Bos! Kantor Siap (Mode Cepat)';}}if(window.eruda){try{window.eruda.destroy();}catch(e){}var els=document.querySelectorAll('[class*=eruda]');for(var i=0;i<els.length;i++){els[i].remove();}} }catch(e){}},1000);})();<\/script>`;
    if (fixed.includes('</body>')) fixed = fixed.replace('</body>', OBAT_KANTOR + '</body>'); else fixed += OBAT_KANTOR;
    return new Response(fixed, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", "Pragma": "no-cache", "Expires": "0" } });
  }
  // 3. OBAT HOME - GANTI Belum ada tulisan Bos JADI TERMINAL ANAK AIR
  const OBAT = `<script>(function(){
var DARURAT_HTML='<div style="padding:14px;border-bottom:1px solid #222;text-align:left"><div style="color:#22ff88;font-weight:700;font-size:13px">lintas@rumahgadang.ai</div><div style="color:#fff;font-size:14px;line-height:1.5;margin-top:6px">Pemko Padang bersama BPTD Sumbar resmi meresmikan Terminal Anak Air guna mengoptimalkan fungsi terminal, menertibkan terminal bayangan, serta memperketat pengawasan transportasi publik.</div></div>';
function gantiKosong(){
  try{
    var els=document.querySelectorAll('*');
    for(var i=0;i<els.length;i++){ var el=els[i]; if(el.children.length===0 && el.textContent && el.textContent.trim()==='Belum ada tulisan Bos'){ el.outerHTML=DARURAT_HTML; return true; } }
    if(document.body && document.body.innerText && document.body.innerText.includes('Belum ada tulisan Bos')){
      var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); var n;
      while(n=walker.nextNode()){ if(n.nodeValue && n.nodeValue.includes('Belum ada tulisan Bos')){ var p=n.parentElement; if(p){ p.innerHTML=DARURAT_HTML; return true; } } }
    }
  }catch(e){} return false;
}
setInterval(gantiKosong,500);
new MutationObserver(gantiKosong).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
var _f=window.fetch;
window.fetch=function(u,o){
  var s=String(u);
  if(s.includes('/api/tulis')||s.includes('/api/posts')){
    return _f(u,o).then(function(r){ return r.clone().json().then(function(j){ var d=j.data||j.posts||j; if(!d||!d.length){ return new Response(JSON.stringify({ok:true,data:[{id:1,[STRIPPED] Padang bersama BPTD Sumbar resmi meresmikan Terminal Anak Air."}]}),[STRIPPED] return r; }).catch(function(){ return new Response(JSON.stringify({ok:true,data:[{id:1,[STRIPPED] Padang bersama BPTD Sumbar resmi meresmikan Terminal Anak Air."}]}),[STRIPPED] }
  return _f(u,o);
};
})();<\/script>`;
  if (fixed.includes('</body>')) fixed = fixed.replace('</body>', OBAT + '</body>'); else fixed += OBAT;
  return new Response(fixed, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", "Pragma": "no-cache", "Expires": "0" } });
}

// ===== MAIN WORKER EXPORT =====
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();
    
    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    };
    
    if (req.method === "OPTIONS") return new Response("", { headers: cors });

    // Redirect HTTP ke HTTPS & www ke non-www
    const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
    const host = (req.headers.get('host') || url.hostname).toLowerCase();
    
    if (proto === 'http' || host.startsWith('www.')) {
      return Response.redirect("https://rumahgadang-ai.my.id" + url.pathname + url.search, 301);
    }
    
    if (path === "/home" || path === "/home/") {
      return Response.redirect("https://rumahgadang-ai.my.id/", 301);
    }
    
    if (["/foto/", "/video/", "/kantor/", "/ai/", "/akun/", "/luar/", "/dalam/", "/akun/chat/"].includes(path)) {
      return Response.redirect("https://rumahgadang-ai.my.id" + path.slice(0, -1), 301);
    }

    if (path === "/favicon.ico" || path === "/favicon.png" || path === "/icon.png") {
      return Response.redirect("https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png", 302);
    }

    // PING ONLINE (Global Handler Pendukung Status Aktif)
    if (path === "/api/akun/ping" && req.method === "POST") {
      try {
        let body = await req.json().catch(() => ({}));
        let email = (body.email || "").toLowerCase().trim();
        if (email && env.DB) {
          await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER, last_seen INTEGER)`).run();
          await env.DB.prepare("UPDATE users SET last_seen = ? WHERE LOWER(email) = ?").bind(Date.now(), email).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // SITEMAP.XML
    if (path === "/sitemap.xml" || path === "/sitemap/" || path === "/sitemap") {
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
        headers: { "Content-Type": "application/xml; charset=UTF-8", "Cache-Control": "no-cache", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ROBOTS.TXT
    if (path === "/robots.txt" || path === "/robots" || path === "/robots/") {
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
      return new Response(robots, { status: 200, headers: { "Content-Type": "text/plain;charset=utf-8", "Cache-Control": "public, max-age=3600" } });
    }

    // GLOBAL DELETE HANDLER
    const deletePaths = ["/api/ig-curated/delete", "/api/images/delete", "/api/foto/delete", "/api/delete", "/api/tulis/delete", "/api/home/delete"];
    if (deletePaths.includes(path)) {
      try {
        let body = {}; 
        try { body = await req.json(); } catch {}
        let idDel = String(body.id || url.searchParams.get('id') || '');
        if (!idDel) return new Response(JSON.stringify({ ok: false, error: "id kosong Bos" }), { headers: cors, status: 400 });
        
        let idInt = parseInt(idDel); 
        if (isNaN(idInt)) idInt = -999;
        let logs = [];
        
        if (env.DB) {
          for (let tbl of ["ig_curated", "images", "foto", "tulis", "home_tulis", "posts"]) {
            try { 
              let r = await env.DB.prepare(`DELETE FROM ${tbl} WHERE id=?`).bind(idInt).run(); 
              logs.push(tbl + "_int:" + r.meta.changes); 
            } catch (e) { logs.push(tbl + "_int_err:" + e.message); }
            
            try { 
              let r = await env.DB.prepare(`DELETE FROM ${tbl} WHERE CAST(id AS TEXT)=?`).bind(idDel).run(); 
              logs.push(tbl + "_str:" + r.meta.changes); 
            } catch (e) { logs.push(tbl + "_str_err:" + e.message); }
          }
        }
        return new Response(JSON.stringify({ ok: true, deleted: idDel, logs }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // DEBUG ENDPOINTS
    if (path.startsWith("/api/debug")) {
      try {
        if (!env.DB) return new Response(JSON.stringify({ ok: false, error: "DB GAK ADA BOS" }), { headers: cors });
        
        if (path.includes("/ids")) {
          let ig = await env.DB.prepare("SELECT id, time, akun, linkIG, caption, substr(img,1,30) as img_preview FROM ig_curated ORDER BY id DESC LIMIT 50").all().catch(() => ({ results: [] }));
          let img = await env.DB.prepare("SELECT id, time, substr(url,1,30) as url_preview FROM images ORDER BY id DESC LIMIT 50").all().catch(() => ({ results: [] }));
          let ft = await env.DB.prepare("SELECT id, time, email FROM foto ORDER BY id DESC LIMIT 50").all().catch(() => ({ results: [] }));
          let tl = await env.DB.prepare("SELECT id, time, email, substr(isi,1,30) as isi_preview FROM tulis ORDER BY id DESC LIMIT 50").all().catch(() => ({ results: [] }));
          return new Response(JSON.stringify({ ok: true, ig_curated: ig.results, images: img.results, foto: ft.results, tulis: tl.results }), { headers: cors });
        }
        
        if (path.includes("/akun")) {
          let users = await env.DB.prepare("SELECT rowid, email, name, substr(picture,1,20) as pic_preview FROM users ORDER BY rowid DESC LIMIT 100").all().catch(() => ({ results: [] }));
          let cleanUsers = users.results.map(u => ({ id: u.rowid, email: u.email, name: u.name }));
          return new Response(JSON.stringify({ ok: true, count: cleanUsers.length, akun: cleanUsers }), { headers: cors });
        }
        
        let tables = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().catch(() => ({ results: [] }));
        return new Response(JSON.stringify({ ok: true, tables: tables.results.map(t => t.name) }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }
    
    // Shortcut Aliases
    if (path === "/f" || path === "/f/") path = "/foto";
    if (path === "/v" || path === "/v/") path = "/video";
    if (path === "/a" || path === "/a/") path = "/ai";

    // ===== GABUNG PAKSA - FALLBACK POSTS HOME, BOS =====
    if ((path === "/api/posts" || path === "/api/tulis" || path === "/api/tulis/list") && req.method === "GET") {
      try { if (env.DB) { let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 20").all().catch(()=>null); if (r && r.results && r.results.length) return new Response(JSON.stringify({ ok: true, data: r.results }), { headers: cors }); } } catch(e) {}
      return new Response(JSON.stringify({ ok: true, data: DARURAT_POSTS, fallback: true }), { headers: cors });
    }

    // API ROUTING
    if (path.startsWith('/api/')) {
      const blockedForGet = ["/api/akun/update", "/api/akun/register", "/api/register", "/api/tulis/delete"];
      if (blockedForGet.some(p => path.startsWith(p)) && req.method === "GET") {
        return new Response(JSON.stringify({ ok: false, error: "API private - use POST" }), { headers: cors, status: 404 });
      }

      try {
        if (path.startsWith('/api/tulis')) {
          let m = getApi(TULIS_M); if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
        }
        if (path.startsWith('/api/foto') || path.startsWith('/api/images') || path.startsWith('/api/ig-curated') || path.startsWith('/api/ig-preview')) {
          let m = getApi(FOTO_API_M); if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
        }
        if (path.startsWith('/api/video')) {
          let m = getApi(VIDEO_API_M); if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
        }
        if (path.startsWith('/api/akun') || path.startsWith('/api/follow') || path.startsWith('/api/followers') || path.startsWith('/api/following') || path.startsWith('/api/photo') || path.startsWith('/api/users') || path.startsWith('/api/search-users') || path.startsWith('/api/chat')) {
          let m = getApi(AKUN_API_M); if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
        }
        if (path.startsWith('/api/ai') || path.startsWith('/api/t2i')) {
          let m = getApi(AI_API_M); 
          if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
          if (AI_API?.handle) { let r = await AI_API.handle(req, env, url, cors); if (r) return r; }
        }
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
      return new Response(JSON.stringify({ ok: false, error: "No handler " + path }), { headers: cors, status: 404 });
    }

    // USER PROFILE ROUTING (e.g. /username)
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      let username = segments[0];
      const reserved = ["home", "foto", "video", "ai", "kantor", "luar", "dalam", "akun", "api", "sitemap", "robots", "profil", "profile", "icon.png", "favicon.ico"];
      if (!reserved.includes(username) && !username.includes(".") && username.length >= 2) {
        let targetEmail = username.includes('@') ? username : username + '@rumahgadang-ai.my.id';
        let modifiedAkunHtml = AKUN_HTML.replace('window.location.search', `"?profil=${encodeURIComponent(targetEmail)}"`);
        return htmlResponse(modifiedAkunHtml, "https://rumahgadang-ai.my.id/" + username);
      }
    }

    // STATIC / PAGE HTML ROUTING
    if (path === "/" || path === "/home" || path.startsWith("/home/")) return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
    if (path.startsWith("/foto")) return htmlResponse(FOTO_HTML, "https://rumahgadang-ai.my.id/foto");
    if (path.startsWith("/video")) return htmlResponse(VIDEO_HTML, "https://rumahgadang-ai.my.id/video");
    if (path.startsWith("/ai")) return htmlResponse(AI_HTML, "https://rumahgadang-ai.my.id/ai");
    if (path.startsWith("/luar")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/luar");
    if (path.startsWith("/dalam")) return htmlResponse(DALAM_HTML, "https://rumahgadang-ai.my.id/dalam");
    if (path.startsWith("/kantor/luar")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/kantor/luar");
    if (path.startsWith("/kantor/dalam")) return htmlResponse(DALAM_HTML, "https://rumahgadang-ai.my.id/kantor/dalam");
    if (path.startsWith("/kantor")) return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/kantor");
    
    // Routing untuk halaman Chat
    if (path === "/akun/chat" || path === "/chat") {
      return htmlResponse(CHAT_HTML, "https://rumahgadang-ai.my.id/akun/chat");
    }

    if (path.startsWith("/akun") || path.startsWith("/profil") || path.startsWith("/profile") || path.startsWith("/u/")) {
      return htmlResponse(AKUN_HTML, "https://rumahgadang-ai.my.id/akun");
    }

    return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
  }
};
