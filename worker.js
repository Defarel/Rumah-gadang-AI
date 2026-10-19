import { LOGO, GLOBAL_VIDEOS, ADMIN_EMAILS } from './config.js';
import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';
import { FOTO_HTML } from './foto/index.js';
import { VIDEO_HTML } from './video/index.js';
import { KANTOR_HTML } from './kantor/index.js';
import { AKUN_HTML } from './akun/index.js';
import { AI_API } from './ai/api-ai/api.js';
import { AKUN_API } from './akun/api-akun/api.js';
import { FOTO_API } from './foto/api-foto/api.js';
import { TULIS_API } from './home/api-tulis/api.js';
import { VIDEO_API } from './video/api-video/api.js';
import { SITEMAP_API } from './api-sitemap/index.js';

const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
const ADMIN_LIST = ["admin@rumahgadang-ai.my.id", "naura@rumahgadang-ai.my.id", "defarel@gmail.com"];
const GROQ_FALLBACK = "";

function getId(u){
  try{
    if(!u) return "";
    let m = u.match(/(?:v=|\.be\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : (u.length === 11 ? u : "");
  }catch(e){ return ""; }
}

function isAdmin(email){
  if(!email) return false;
  return ADMIN_LIST.includes(email.toLowerCase().trim());
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const GOOGLE_ID = env.GOOGLE_ID || "";
    const GOOGLE_SECRET = env.GOOGLE_SECRET || "";
    const GROQ = env.GROQ_API_KEY || GROQ_FALLBACK;

    // Paksa HTTPS
    if(url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    if(url.pathname === "/home" || url.pathname === "/home/") {
      return Response.redirect("https://www.rumahgadang-ai.my.id/", 301);
    }
    if(url.pathname === "/index.html") {
      return Response.redirect("https://www.rumahgadang-ai.my.id/", 301);
    }

    const cors = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "X-Robots-Tag": "noindex, nofollow"
    };

    if(req.method === "OPTIONS") return new Response("", { headers: cors });

    // Sitemap & Robots
    if(url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://www.rumahgadang-ai.my.id/sitemap.xml\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    if(url.pathname === "/sitemap.xml") {
      let last = new Date().toISOString().split('T')[0];
      let pages = ["/", "/foto", "/video", "/ai", "/akun", "/kantor"];
      let xml = pages.map(p => ` <url><loc>https://www.rumahgadang-ai.my.id${p}</loc><lastmod>${last}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`).join("\n");
      let body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`;
      return new Response(body, { headers: { "Content-Type": "text/xml; charset=utf-8", "Cache-Control": "no-cache, no-store, must-revalidate" } });
    }

    // Inisialisasi Database D1
    try {
      if(env.DB) {
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, picture TEXT, text TEXT, tulisImg TEXT, likes INTEGER DEFAULT 0, time TEXT)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis_likes (tulis_id INTEGER, user_email TEXT, PRIMARY KEY(tulis_id, user_email))").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, item_id TEXT, text TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS ig_curated (id INTEGER PRIMARY KEY AUTOINCREMENT, akun TEXT, img TEXT, linkIG TEXT, caption TEXT, video TEXT, time INTEGER)").run();
        try { await env.DB.prepare("ALTER TABLE ig_curated ADD COLUMN video TEXT").run(); } catch(e){}
      }
    } catch(e){}

    // --- API ENDPOINTS ---

    if(url.pathname === "/api/ig-preview") {
      let igUrl = url.searchParams.get("url") || "";
      try {
        let resp = await fetch(igUrl, { headers: { "User-Agent": "Mozilla/5.0 (iPhone) AppleWebKit" } });
        let html = await resp.text();
        let thumb = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1] || "";
        let username = html.match(/"username":"([^"]+)"/)?.[1] || igUrl.split("/")[3] || "minang";
        thumb = thumb.replace(/&amp;/g, "&");
        return new Response(JSON.stringify({ thumbnail: thumb, username, caption: "Dari @" + username }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ error: "gagal" }), { headers: cors, status: 500 });
      }
    }

    if(url.pathname === "/api/ig-curated") {
      try {
        let r = await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify([]), { headers: cors });
      }
    }

    if(url.pathname === "/api/ig-curated/add" && req.method === "POST") {
      try {
        let j = await req.json();
        await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,video,time) VALUES (?,?,?,?,?,?)").bind(j.akun || "minang", j.img, j.linkIG, j.caption || "", j.video || "", Date.now()).run();
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    if(url.pathname === "/api/videos") {
      let local = []; let blocked = [];
      try {
        if(env.DB) {
          let r = await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();
          local = r.results?.map(x => x.id) || [];
          let b = await env.DB.prepare("SELECT id FROM blocked_videos").all();
          blocked = b.results?.map(x => x.id) || [];
        }
      } catch(e){}
      let defaultVids = ["Vv7fkh6uYkY", "QcIy9NiG8r0"];
      let all = [...new Set([...local, ...defaultVids])];
      all = all.filter(id => !blocked.includes(id));
      return new Response(JSON.stringify(all), { headers: cors });
    }

    if(url.pathname === "/api/videos/add" && req.method === "POST") {
      try {
        let b = await req.json();
        let id = getId(b.ytUrl);
        if(!id) return new Response(JSON.stringify({ ok: false, msg: "Link salah Bos" }), { headers: cors });
        if(env.DB) await env.DB.prepare("INSERT OR IGNORE INTO local_videos (id,created_at) VALUES (?,?)").bind(id, Date.now()).run();
        return new Response(JSON.stringify({ ok: true, id: id }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    // Endpoint Tulis (Database D1)
    if(url.pathname === "/api/tulis") {
      try {
        let r = await env.DB.prepare("SELECT * FROM posts ORDER BY id DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify([]), { headers: cors });
      }
    }

    if(url.pathname === "/api/tulis" && req.method === "POST") {
      try {
        let j = await req.json();
        if(!j.text && !j.tulisImg) {
          return new Response(JSON.stringify({ error: "Konten atau gambar kosong!" }), { status: 400, headers: cors });
        }
        let time = new Date().toISOString();
        let stmt = await env.DB.prepare("INSERT INTO posts (email, name, picture, text, tulisImg, likes, time) VALUES (?,?,?,?,?,0,?)").bind(
          j.email || "anon@rg.id",
          j.name || "Dunsanak",
          j.picture || LOGO_DEFAULT,
          j.text || "",
          j.tulisImg || "",
          time
        ).run();
        return new Response(JSON.stringify({ ok: true, success: true, id: stmt.meta.last_row_id }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    if(url.pathname === "/api/tulis/delete" && req.method === "POST") {
      try {
        let { id, email } = await req.json();
        let post = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
        if(!post) return new Response(JSON.stringify({ error: "Post tidak ditemukan" }), { status: 404, headers: cors });
        
        let isOwner = email && email.toLowerCase().trim() === (post.email || "").toLowerCase().trim();
        if(!isOwner && !isAdmin(email)) {
          return new Response(JSON.stringify({ error: "Akses ditolak" }), { status: 403, headers: cors });
        }
        await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ ok: true, success: true }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    if(url.pathname === "/api/images") {
      try {
        let r = await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify([]), { headers: cors });
      }
    }

    if(url.pathname === "/api/images/add" && req.method === "POST") {
      try {
        let j = await req.json();
        await env.DB.prepare("INSERT INTO images (url,likes,time) VALUES (?,?,?)").bind(j.url, 0, Date.now()).run();
      } catch(e){}
      return new Response(JSON.stringify({ ok: true }), { headers: cors });
    }

    if(url.pathname === "/api/ai" && req.method === "POST") {
      try {
        let j = await req.json();
        let r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [
              { role: "system", content: "Kamu Rumah Gadang AI Bos, buatan Tim Rumah Gadang AI Padang Bos! WAJIB jawab PENDEK Bos, maksimal 2 kalimat Bos, pakai kata Bos!" },
              { role: "user", content: j.prompt }
            ],
            max_tokens: 120,
            temperature: 0.7
          })
        });
        let d = await r.json();
        return new Response(JSON.stringify({ reply: d.choices[0].message.content }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ reply: "Error Bos" }), { headers: cors });
      }
    }

    if(url.pathname === "/api/delete" && req.method === "POST") {
      try {
        let { type, id, email } = await req.json();
        if(!isAdmin(email)) return new Response(JSON.stringify({ ok: false, msg: "Cuma admin Bos" }), { headers: cors });
        if(type === "tulis") await env.DB.prepare("DELETE FROM posts WHERE id=?").bind(id).run();
        if(type === "foto") await env.DB.prepare("DELETE FROM images WHERE id=?").bind(id).run();
        if(type === "ig") await env.DB.prepare("DELETE FROM ig_curated WHERE id=?").bind(id).run();
        if(type === "video") {
          await env.DB.prepare("DELETE FROM local_videos WHERE id=?").bind(id).run();
          await env.DB.prepare("INSERT OR IGNORE INTO blocked_videos (id) VALUES (?)").bind(id).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    if(url.pathname === "/api/profile/update" && req.method === "POST") {
      try {
        let { email, name, picture } = await req.json();
        email = email.toLowerCase().trim();
        if(env.DB) {
          let cek = await env.DB.prepare("SELECT * FROM rg_users WHERE email=?").bind(email).first();
          if(cek) {
            await env.DB.prepare("UPDATE rg_users SET name=?, picture=? WHERE email=?").bind(name, picture, email).run();
          } else {
            await env.DB.prepare("INSERT OR IGNORE INTO rg_users (email,name,picture,time) VALUES (?,?,?,?)").bind(email, name, picture, Date.now()).run();
          }
          await env.DB.prepare("UPDATE posts SET name=?, picture=? WHERE email=?").bind(name, picture, email).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    if(url.pathname === "/api/auth/register" && req.method === "POST") {
      try {
        let { user, pass, name } = await req.json();
        let email = user.includes("@") ? user : user + "@rumahgadang-ai.my.id";
        email = email.toLowerCase().trim();
        let cek = await env.DB.prepare("SELECT * FROM rg_users WHERE email=?").bind(email).first();
        if(cek) return new Response(JSON.stringify({ ok: false, msg: "Sudah ada Bos" }), { headers: cors });
        let hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass)).then(b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""));
        await env.DB.prepare("INSERT INTO rg_users (email,pass,name,time) VALUES (?,?,?,?)").bind(email, hash, name || user, Date.now()).run();
        return new Response(JSON.stringify({ ok: true, email: email, name: name || user, picture: LOGO_DEFAULT }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    if(url.pathname === "/api/auth/login" && req.method === "POST") {
      try {
        let { user, pass } = await req.json();
        let email = user.includes("@") ? user : user + "@rumahgadang-ai.my.id";
        email = email.toLowerCase().trim();
        let hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass)).then(b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""));
        let u = await env.DB.prepare("SELECT * FROM rg_users WHERE email=? AND pass=?").bind(email, hash).first();
        if(!u) return new Response(JSON.stringify({ ok: false, msg: "Salah Bos" }), { headers: cors });
        return new Response(JSON.stringify({ ok: true, email: u.email, name: u.name, picture: u.picture || LOGO_DEFAULT }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    if(url.pathname === "/api/like" && req.method === "POST") {
      try {
        let { type, item_id, email } = await req.json();
        if(type === "tulis") {
          let cek = await env.DB.prepare("SELECT * FROM tulis_likes WHERE tulis_id=? AND user_email=?").bind(item_id, email).first();
          if(cek) {
            await env.DB.prepare("DELETE FROM tulis_likes WHERE tulis_id=? AND user_email=?").bind(item_id, email).run();
            await env.DB.prepare("UPDATE posts SET likes=likes-1 WHERE id=?").bind(item_id).run();
            return new Response(JSON.stringify({ ok: true, liked: false }), { headers: cors });
          } else {
            await env.DB.prepare("INSERT INTO tulis_likes (tulis_id,user_email) VALUES (?,?)").bind(item_id, email).run();
            await env.DB.prepare("UPDATE posts SET likes=likes+1 WHERE id=?").bind(item_id).run();
            return new Response(JSON.stringify({ ok: true, liked: true }), { headers: cors });
          }
        }
      } catch(e){}
      return new Response(JSON.stringify({ ok: false }), { headers: cors });
    }

    if(url.pathname === "/api/comments") {
      try {
        let type = url.searchParams.get("type");
        let item_id = url.searchParams.get("id");
        let r = await env.DB.prepare("SELECT * FROM comments WHERE type=? AND item_id=? ORDER BY time DESC LIMIT 50").bind(type, item_id).all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify([]), { headers: cors });
      }
    }

    if(url.pathname === "/api/comments/add" && req.method === "POST") {
      try {
        let j = await req.json();
        await env.DB.prepare("INSERT INTO comments (type,item_id,text,user_email,name,picture,time) VALUES (?,?,?,?,?,?,?)").bind(j.type, j.item_id, j.text, j.email, j.name, j.picture, Date.now()).run();
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { headers: cors });
      }
    }

    if(url.pathname === "/api/auth/google") {
      let redirect = "https://www.rumahgadang-ai.my.id/api/auth/callback";
      return Response.redirect("https://accounts.google.com/o/oauth2/v2/auth?client_id=" + GOOGLE_ID + "&redirect_uri=" + redirect + "&response_type=code&scope=email profile&access_type=offline&prompt=consent", 302);
    }

    if(url.pathname === "/api/auth/callback") {
      try {
        let code = url.searchParams.get("code");
        let redirect = "https://www.rumahgadang-ai.my.id/api/auth/callback";
        let tokenRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "code=" + code + "&client_id=" + GOOGLE_ID + "&client_secret=" + GOOGLE_SECRET + "&redirect_uri=" + redirect + "&grant_type=authorization_code" });
        let token = await tokenRes.json();
        let userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: "Bearer " + token.access_token } });
        let user = await userRes.json();
        return new Response(`<!DOCTYPE html><script>localStorage.setItem('rg_user',JSON.stringify(${JSON.stringify(user)}));localStorage.setItem('rg_email','${user.email}');localStorage.setItem('rg_name','${(user.name || "").replace(/'/g, "")}');localStorage.setItem('rg_avatar','${user.picture || ""}');location.href='/akun';</script>`, { headers: { "Content-Type": "text/html" } });
      } catch(e) {
        return new Response("Gagal Bos: " + e.message, { headers: { "Content-Type": "text/html" } });
      }
    }

    // Serve static assets
    if(url.pathname.startsWith("/ai/") && url.pathname.match(/\.(jpg|jpeg|png|m4a|mp3|webp)$/i)) {
      if(env.ASSETS) return env.ASSETS.fetch(req);
    }

    // --- RENDER HALAMAN HTML (Gaya Cyberpunk Neon Hijau) ---
    let tab = "home";
    if(url.pathname.includes("foto")) tab = "foto";
    if(url.pathname.includes("video")) tab = "video";
    if(url.pathname.includes("ai")) tab = "ai";
    if(url.pathname.includes("akun")) tab = "akun";
    if(url.pathname.includes("kantor")) tab = "kantor";

    let titles = { home: "Rumah Gadang AI - Komunitas Minangkabau", foto: "RG Foto - Koleksi Rumah Gadang", video: "RG Video Pendek - Adat Minang", ai: "Rumah Gadang AI - Tanya Adat", akun: "Akun - Rumah Gadang AI", kantor: "Kantor - Rumah Gadang AI" };
    let descs = { home: "Komunitas digital Rumah Gadang Minangkabau, berbagi cerita foto video dan AI", foto: "Koleksi foto Rumah Gadang indah dari Instagram dan user", video: "Video pendek adat Minangkabau Rumah Gadang", ai: "Tanya jawab AI tentang Rumah Gadang dan adat Minangkabau", akun: "Login akun Rumah Gadang AI", kantor: "Kantor Adat Rumah Gadang" };

    let canonPath = url.pathname; if(canonPath === "/home") canonPath = "/";
    let canonUrl = "https://www.rumahgadang-ai.my.id" + (canonPath === "/" ? "/" : canonPath);
    let titleNow = titles[tab] || titles.home;
    let descNow = descs[tab] || descs.home;

    let html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titleNow}</title><meta name="description" content="${descNow}"><link rel="canonical" href="${canonUrl}"><meta property="og:title" content="${titleNow}"><meta property="og:description" content="${descNow}"><meta property="og:url" content="${canonUrl}"><meta property="og:type" content="website">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;justify-content:center}
#app{width:100%;max-width:520px;min-height:100vh;padding-bottom:90px;background:#000;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,0.4)}
.top{position:sticky;top:0;background:#000;z-index:10;padding:12px 16px;border-bottom:1px solid #111;display:flex;justify-content:space-between;align-items:center}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;box-shadow:0 0 8px rgba(0,255,136,0.8)}
.page{display:none}.page.on{display:block}
#p-ai.page.on{display:flex;flex-direction:column;height:calc(100vh - 60px);background:#000}
#p-akun.page.on{display:block}

/* Post Container & Cards */
.create-box{padding:14px;background:#000;border-bottom:2px solid #00ff88;box-shadow:0 0 8px rgba(0,255,136,0.3)}
.input-row{display:flex;gap:8px;align-items:center}
.txt{flex:1;background:#0a0a0a;border:2px solid #00ff88;color:#fff;padding:12px 16px;border-radius:14px;font-size:15px;outline:none;box-shadow:0 0 8px rgba(0,255,136,0.3)}
.txt::placeholder{color:#888}
.btnPlus{width:46px;height:46px;background:#181818;border:1px solid #333;color:#fff;border-radius:12px;font-size:26px;display:grid;place-items:center;cursor:pointer;flex-shrink:0}
.btnKirim{width:100%;margin-top:10px;background:#00ff88;color:#000;border:0;padding:12px;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 12px rgba(0,255,136,0.6)}

.post{padding:14px;display:flex;gap:10px;background:#080808;margin:10px 8px;border-radius:16px;border:2px solid #00ff88;box-shadow:0 0 10px rgba(0,255,136,0.3)}
.post-av{width:42px;height:42px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88;flex-shrink:0}
.post-body{flex:1;min-width:0}
.post-name{font-weight:800;font-size:14px;color:#fff}
.post-time{font-size:11px;color:#888;margin-left:6px}
.post-text{margin-top:6px;font-size:14px;line-height:1.5;color:#eee;white-space:pre-wrap;word-break:break-word}
.post-img{margin-top:10px;border-radius:12px;overflow:hidden;border:1px solid #222}
.post-img img{width:100%;display:block;max-height:360px;object-fit:cover}

.like-bar{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
.btn-like{background:#121212;border:1px solid #2a2a2a;color:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:600}
.del{background:#ff1a1a;color:#fff;border:0;padding:6px 14px;border-radius:20px;font-size:11px;cursor:pointer;font-weight:800;margin-left:auto}

.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}.cell{aspect-ratio:1;background:#111;position:relative;overflow:hidden}.cell img{width:100%;height:100%;object-fit:cover}.cell .del{position:absolute;top:4px;right:4px;background:red;color:#fff;border:0;border-radius:50%;width:24px;height:24px;display:grid;place-items:center;font-size:12px;z-index:5;margin:0}

.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99;box-shadow:0 -4px 12px rgba(0,255,136,0.3)}
.bot a{flex:1;text-align:center;padding:8px 0;color:#777;text-decoration:none;font-size:18px}.bot a.on{color:#fff}.bot a span{display:block;font-size:10px;margin-top:2px}

input{background:#111;border:1px solid #333;color:#fff;border-radius:10px;padding:12px}
#vWrap{height:calc(100vh - 60px);overflow-y:scroll;scroll-snap-type:y mandatory;background:#000}.v-card{position:relative;height:calc(100vh - 60px);scroll-snap-align:start;background:#000;overflow:hidden}.v-card img.thumb{width:100%;height:100%;object-fit:cover}.v-actions{position:absolute;right:12px;bottom:90px;display:flex;flex-direction:column;gap:16px}.v-btn{width:52px;height:52px;border-radius:50%;background:rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.25);display:grid;place-items:center;font-size:24px;cursor:pointer}
.fab{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);width:48px;height:48px;background:#00ff88;color:#000;border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:900;z-index:30;box-shadow:0 0 14px rgba(0,255,136,0.5)}
#aiChat{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:12px;padding-bottom:20px}
.msg{padding:10px 14px;border-radius:14px;max-width:85%;font-size:14px;white-space:pre-wrap}.msg.user{align-self:flex-end;background:#166534}.msg.ai{align-self:flex-start;background:#222;border:1px solid #333}
.bar{display:flex;gap:8px;background:#111;border:1px solid #333;padding:8px;border-radius:28px;margin:8px;position:sticky;bottom:60px}
.bar input{flex:1;background:#0a0a0a;border:1px solid #333;border-radius:20px;padding:12px 14px}
.comment-box{margin-top:8px;background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:8px}.c-item{display:flex;gap:6px;margin-top:6px;font-size:12px}.c-av{width:24px;height:24px;border-radius:50%;object-fit:cover}
.foto-tab{display:inline-block;padding:10px 16px;color:#888;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap}.foto-tab.active{color:#fff;border-bottom:2px solid #00ff88}
</style></head><body>
<div id=app>
<div id="p-home" class="page ${tab==="home"?"on":""}"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="${LOGO_DEFAULT}" class="logo"><b>RUMAH GADANG AI</b></div><button onclick="location.href='/akun'" style="background:#fff;color:#000;border:0;padding:6px 16px;border-radius:20px;font-weight:800;font-size:12px;cursor:pointer">LOGIN</button></div>
<div class="create-box"><div class="input-row"><input id="tulisIn" class="txt" placeholder="Tulis disini..."><button class="btnPlus" onclick="document.getElementById('tulisFile').click()">+</button></div><div id="tulisPreview" style="display:none;margin-top:10px;position:relative"><img id="tulisPreviewImg" style="width:100%;max-height:220px;border-radius:12px;object-fit:cover;border:1px solid #00ff88"><span onclick="clearPrev()" style="position:absolute;top:8px;right:8px;background:#000;color:#fff;padding:4px 10px;border-radius:50%;cursor:pointer;border:1px solid #333">✕</span></div><button class="btnKirim" onclick="addTulis()">KIRIM</button><input id="tulisFile" type="file" accept="image/*" style="display:none"></div><div id="homeFeed" style="padding:4px 0">Memuat postingan...</div></div>

<div id="p-foto" class="page ${tab==="foto"?"on":""}"><div class="top"><b>RG FOTO</b> <span id="adminBadgeFoto" style="display:none;background:red;color:#fff;padding:2px 8px;border-radius:10px;font-size:10px">ADMIN</span></div><div id="foto-tabs" style="display:flex;overflow-x:auto;background:#0a0a0a;border-bottom:1px solid #222;position:sticky;top:56px;z-index:5"></div><div class="grid3" id="fg"></div><div class="grid3" id="fg2" style="margin-top:4px;border-top:1px solid #111"></div><div class="fab" onclick="toggleFotoUpload()">+</div><div id="fotoUploadPanel" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:100;padding:16px;overflow-y:auto"><div style="max-width:480px;margin:60px auto 0 auto;background:#111;border:1px solid #333;border-radius:16px;padding:16px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="color:#00ff88">Upload Foto</b><button onclick="toggleFotoUpload()" style="background:#222;color:#fff;border:1px solid #444;border-radius:50%;width:32px;height:32px;cursor:pointer">X</button></div><div id="adminFotoBox" style="display:none;margin-top:14px;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:12px"><b style="color:#00ff88;font-size:13px">Admin IG</b><input id="igUrlInput" placeholder="https://instagram.com/reel/..." style="width:100%;margin-top:8px"><button onclick="previewIG()" style="width:100%;margin-top:8px;background:#00ff88;color:#000;border:0;padding:10px;border-radius:10px;font-weight:900;cursor:pointer">AMBIL</button><div id="igPreviewBox" style="display:none;margin-top:10px;border:1px solid #333;padding:8px;border-radius:10px"><img id="igPreviewImg" style="width:100%;border-radius:8px;aspect-ratio:1/1;object-fit:cover"><div id="igPreviewAkun" style="color:#00ff88;font-size:12px;margin-top:6px"></div><button onclick="saveIGCurated()" style="width:100%;margin-top:8px;background:#fff;color:#000;border:0;padding:10px;border-radius:10px;font-weight:900;cursor:pointer">+ SIMPAN</button></div></div><div style="margin-top:14px;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:12px"><b style="font-size:12px;color:#aaa">Upload User</b><input id="fFile" type="file" accept="image/*" style="width:100%;margin-top:8px"><button onclick="upFoto()" style="width:100%;margin-top:8px;background:#222;color:#fff;border:1px solid #333;padding:12px;border-radius:10px;font-weight:900;cursor:pointer">UPLOAD</button></div></div></div></div>

<div id="p-video" class="page ${tab==="video"?"on":""}"><div class="top" style="position:fixed;top:0;width:100%;max-width:520px;z-index:20"><b>RG Video Pendek</b> <span id="adminBadgeVideo" style="display:none;background:red;color:#fff;padding:2px 8px;border-radius:10px;font-size:10px">ADMIN</span></div><div id="vWrap" style="margin-top:56px">Loading video Bos...</div><div class="fab" onclick="toggleAdd()">+</div><div id="addBox" style="display:none;position:fixed;bottom:140px;left:16px;right:16px;max-width:480px;margin:0 auto;background:#111;border:1px solid #333;border-radius:14px;padding:12px;z-index:30"><b>Tambah Video</b><div style="display:flex;gap:8px;margin-top:8px"><input id="ytUrl" placeholder="https://youtu.be/..." style="flex:1"><button onclick="addVideo()" style="background:red;color:#fff;border:0;padding:8px 12px;border-radius:10px;cursor:pointer">ADD</button></div><div onclick="toggleAdd()" style="font-size:11px;color:#666;margin-top:6px;cursor:pointer">Tutup</div></div></div>

<div id="p-ai" class="page ${tab==="ai"?"on":""}"><div class="top"><b>RUMAH GADANG AI</b></div><div id="aiChat"><div class="msg ai">Halo Dunsanak Bos! Saya Rumah Gadang AI Bos! Tanyo seputar adat Minang Bos!</div></div><div class="bar"><input id="aiInp" placeholder="Tanya Rumah Gadang AI..."><button id="aiSend" style="background:#00ff88;color:#000;border:0;padding:10px 16px;border-radius:20px;font-weight:900;cursor:pointer">KIRIM</button></div></div>

<div id="p-akun" class="page ${tab==="akun"?"on":""}">
<div class="top"><b>AKUN</b><button onclick="logout()" style="background:#ff1a1a;color:#fff;border:0;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer">LOGOUT</button></div>
<div id="akunLocked" style="padding:20px"><div style="background:#111;border:1px solid #222;border-radius:16px;padding:16px"><b style="color:#00ff88">Login @rumahgadang-ai.my.id</b><input id="rgUser" placeholder="nama@rumahgadang-ai.my.id" style="width:100%;margin-top:10px"><input id="rgPass" type="password" placeholder="password" style="width:100%;margin-top:8px"><input id="rgName" placeholder="Nama lengkap (daftar)" style="width:100%;margin-top:8px"><div style="display:flex;gap:8px;margin-top:12px"><button onclick="rgLogin()" style="flex:1;background:#00ff88;color:#000;border:0;padding:12px;border-radius:10px;font-weight:900;cursor:pointer">LOGIN</button><button onclick="rgRegister()" style="flex:1;background:#222;color:#fff;border:1px solid #333;padding:12px;border-radius:10px;font-weight:900;cursor:pointer">DAFTAR</button></div></div><div style="text-align:center;margin:16px 0;color:#555;font-size:12px">atau</div><button onclick="location.href='/api/auth/google'" style="background:#fff;color:#000;border:0;padding:12px 20px;border-radius:20px;font-weight:900;width:100%;cursor:pointer">LOGIN GOOGLE</button></div>
<div id="akunOpen" style="display:none;padding:20px;text-align:center">
<img id="akunAvatar" src="${LOGO_DEFAULT}" style="width:110px;height:110px;border-radius:50%;border:3px solid #00ff88;object-fit:cover;margin:0 auto;display:block">
<div id="akunName" style="margin-top:12px;font-weight:800;font-size:20px"></div><div id="akunEmail" style="font-size:12px;color:#888;margin-top:2px"></div>
<div id="adminInfo" style="display:none;margin-top:12px;background:#ff1a1a;color:#fff;padding:8px;border-radius:10px;font-size:12px;font-weight:700">MODE ADMIN AKTIF BOS</div>
<div style="margin-top:20px;background:#111;border:1px solid #222;border-radius:16px;padding:16px;text-align:left">
<b style="color:#00ff88;font-size:14px">Edit Profil Bos</b>
<div style="margin-top:10px"><div style="font-size:11px;color:#888;margin-bottom:4px">Nama Baru Bos</div><input id="editName" placeholder="Nama baru Bos" style="width:100%"></div>
<div style="margin-top:10px"><div style="font-size:11px;color:#888;margin-bottom:4px">Foto Profil Baru Bos</div><input id="editPhotoFile" type="file" accept="image/*" style="width:100%"></div>
<div id="editPreviewWrap" style="display:none;margin-top:10px"><img id="editPreview" style="width:100%;max-height:200px;border-radius:12px;object-fit:cover"></div>
<button onclick="saveProfile()" style="width:100%;margin-top:14px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer">SIMPAN PROFIL BOS</button>
</div>
</div>
</div>

<div id="p-kantor" class="page ${tab==="kantor"?"on":""}"><div class="top"><b>KANTOR</b></div><div style="padding:16px"><div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px">Kantor Adat Rumah Gadang AI - Padang, Sumatera Barat Bos</div></div></div>
</div>

<div id="fotoModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.97);z-index:999;flex-direction:column;justify-content:center;align-items:center;padding:16px">
<img id="modalImg" style="max-width:100%;max-height:70vh;border-radius:12px;object-fit:contain;display:none">
<div id="modalVideoWrap" style="max-width:100%;width:380px;height:68vh;display:none;border-radius:12px;overflow:hidden;background:#000"></div>
<div id="modalCap" style="color:#fff;margin-top:10px;font-size:13px;text-align:center"></div>
<div id="modalAkun" style="color:#00ff88;font-size:12px;margin-top:4px"></div>
<div style="display:flex;gap:10px;margin-top:16px"><button onclick="closeFoto()" style="padding:12px 20px;border-radius:24px;border:1px solid #555;background:transparent;color:#fff;cursor:pointer">Tutup</button><button id="modalIGBtn" style="padding:12px 20px;border-radius:24px;border:none;background:#00ff88;color:#000;font-weight:900;cursor:pointer">Lihat di IG ↗</button></div>
</div>

<div class="bot"><a href="/" class="${tab==="home"?"on":""}">🏠<span>Home</span></a><a href="/foto" class="${tab==="foto"?"on":""}">🖼️<span>Foto</span></a><a href="/video" class="${tab==="video"?"on":""}">🎬<span>Video</span></a><a href="/kantor" class="${tab==="kantor"?"on":""}">🏢<span>Kantor</span></a><a href="/ai" class="${tab==="ai"?"on":""}">🤖<span>AI</span></a><a href="/akun" class="${tab==="akun"?"on":""}">👤<span>Akun</span></a></div>

<script>
var LOGO_URL="${LOGO_DEFAULT}"; var pending=''; var editPending=''; var soundOn=false; var curId=null;
var ADMIN_LIST=${JSON.stringify(ADMIN_LIST)};
var currentIGLink=''; var currentFilterFoto='semua'; var igDataAll=[]; var tempIG={};

function getEmail(){ return (localStorage.getItem('rg_email')||'').toLowerCase().trim(); }
function getName(){ return localStorage.getItem('rg_name')||'Dunsanak'; }
function getAvatar(){ return localStorage.getItem('rg_avatar')||LOGO_URL; }
function isAdminCheck(){ return ADMIN_LIST.includes(getEmail()); }

function makeIframe(id){ var mute=soundOn?0:1; return '<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&mute='+mute+'&controls=0&playsinline=1&loop=1&playlist='+id+'&modestbranding=1&rel=0" style="width:100%;height:100%;border:0" allow="autoplay; encrypted-media"></iframe><div class="v-actions"><div class="v-btn" onclick="event.stopPropagation(); likeVideo(\\''+id+'\\',this)">❤️</div><div class="v-btn" onclick="event.stopPropagation(); openComments(\\'video\\',\\''+id+'\\')">💬</div><div class="v-btn" onclick="event.stopPropagation(); sharePost(\\'video '+id+'\\')">↗️</div><div class="v-btn" onclick="event.stopPropagation(); toggleSound(\\''+id+'\\')">'+(soundOn?'🔊':'🔇')+'</div>'+(isAdminCheck()?'<div class="v-btn" style="background:red" onclick="event.stopPropagation(); delItem(\\'video\\',\\''+id+'\\')">🗑️</div>':'')+'</div>';}
function makeThumb(id){ return '<img class="thumb" src="https://img.youtube.com/vi/'+id+'/hqdefault.jpg"><div style="position:absolute;inset:0;display:grid;place-items:center"><div style="width:60px;height:42px;background:red;border-radius:12px;display:grid;place-items:center">▶️</div></div><div class="v-actions"><div class="v-btn">❤️</div><div class="v-btn">💬</div><div class="v-btn">↗️</div><div class="v-btn">🔇</div>'+(isAdminCheck()?'<div class="v-btn" style="background:red">🗑️</div>':'')+'</div>';}
function toggleSound(id){ soundOn=!soundOn; var cur=document.querySelector('.video-inner[data-id="'+id+'"]'); if(cur) cur.innerHTML=makeIframe(id); }
function stopAll(){ document.querySelectorAll('.video-inner').forEach(function(el){ var id=el.dataset.id; if(id && el.innerHTML.includes('iframe')) el.innerHTML=makeThumb(id); });}
function playOnly(el,id){ if(el.innerHTML.includes('iframe')){ toggleSound(id); return; } stopAll(); el.innerHTML=makeIframe(id); curId=id; }

async function loadVideo(){ 
  var r=await fetch('/api/videos'); var v=await r.json(); var w=document.getElementById('vWrap'); 
  w.innerHTML=v.map(function(id){return '<div class="v-card"><div class="video-inner" data-id="'+id+'" style="width:100%;height:100%" onclick="playOnly(this,\\''+id+'\\')">'+makeThumb(id)+'</div></div>';}).join(''); 
  var obs=new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ var inner=en.target.querySelector('.video-inner'); if(inner){ var id=inner.dataset.id; if(curId!==id){ stopAll(); inner.innerHTML=makeIframe(id); curId=id; } } } }); },{root:w,threshold:0.75}); 
  document.querySelectorAll('.v-card').forEach(function(c){obs.observe(c);}); 
  setTimeout(function(){ var first=document.querySelector('.video-inner'); if(first) playOnly(first, first.dataset.id); },600); 
}

function toggleAdd(){ var b=document.getElementById('addBox'); b.style.display=b.style.display==='block'?'none':'block'; }
async function addVideo(){ if(!getEmail()){alert('Login dulu Bos');location.href='/akun';return;} var inp=document.getElementById('ytUrl');var v=inp.value.trim();if(!v)return alert('Link kosong Bos');var res=await fetch('/api/videos/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ytUrl:v})});var j=await res.json();if(j.ok){alert('Berhasil Bos!');inp.value='';toggleAdd();loadVideo();}else{alert('Gagal Bos: '+j.msg);} }
function likeVideo(id,el){ if(!getEmail()){location.href='/akun';return;} el.style.background=el.style.background==='red'?'rgba(0,0,0,0.55)':'red'; }
function toggleFotoUpload(){ var p=document.getElementById('fotoUploadPanel'); p.style.display=p.style.display==='block'?'none':'block'; }

async function loadFoto(){ 
  try{ 
    let r=await fetch('/api/ig-curated'); let data=await r.json(); igDataAll=data||[]; renderFotoTabs(); renderFotoGrid(); 
    let r2=await fetch('/api/images'); let d2=await r2.json(); let g2=document.getElementById('fg2'); 
    if(g2){ g2.innerHTML=d2.map(function(x){ return '<div class="cell"><img src="'+x.url+'"><button class="del" style="display:'+(isAdminCheck()?'grid':'none')+'" onclick="event.stopPropagation();delItem(\\'foto\\','+x.id+')">X</button></div>'; }).join(''); } 
    if(isAdminCheck()){ document.getElementById('adminBadgeFoto').style.display='inline'; document.getElementById('adminFotoBox').style.display='block'; } 
  }catch(e){} 
}

function renderFotoTabs(){ let akuns=['semua',...new Set(igDataAll.map(x=>x.akun))]; let html=akuns.map(a=>{ let label=a==='semua'?'Semua':'@'+a; return '<div class="foto-tab '+(a===currentFilterFoto?'active':'')+'" onclick="filterFoto(\\''+a+'\\')">'+label+'</div>'; }).join(''); document.getElementById('foto-tabs').innerHTML=html; }
function filterFoto(akun){ currentFilterFoto=akun; renderFotoTabs(); renderFotoGrid(); }
function renderFotoGrid(){ let data=igDataAll.filter(x=> currentFilterFoto==='semua' || x.akun===currentFilterFoto); let g=document.getElementById('fg'); if(!g) return; g.innerHTML=data.map(function(x){ let link=x.linkIG||""; let isReel=link.includes("/reel/")||link.includes("/p/"); return '<div class="cell" onclick="openFoto(\\''+x.img.replace(/'/g,'')+'\\',\\''+(x.caption||'').replace(/'/g,'')+'\\',\\'@'+x.akun+'\\',\\''+x.linkIG+'\\',\\''+x.id+'\\')"><img src="'+x.img+'" loading="lazy">'+(isReel?'<div style="position:absolute;inset:0;display:grid;place-items:center"><div style="width:36px;height:36px;background:rgba(0,0,0,0.65);border-radius:50%;display:grid;place-items:center;color:#fff">▶️</div></div>':'')+'<div style="position:absolute;bottom:2px;left:2px;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;padding:2px 4px;border-radius:4px">@'+x.akun+'</div>'+(isAdminCheck()?'<button class="del" onclick="event.stopPropagation();delItem(\\'ig\\','+x.id+')">X</button>':'')+'</div>'; }).join(''); if(!data.length) g.innerHTML='<div style="grid-column:1/-1;padding:20px;text-align:center;color:#666;font-size:12px">Belum ada foto Bos. Klik + untuk tambah Bos.</div>'; }
function openFoto(img,cap,akun,link,id){ document.getElementById('modalCap').innerText=cap; document.getElementById('modalAkun').innerText=akun; currentIGLink=link; let imgEl=document.getElementById('modalImg'); let vidWrap=document.getElementById('modalVideoWrap'); let embedUrl=link.split("?")[0]; if(!embedUrl.endsWith("/")) embedUrl+="/"; embedUrl+="embed"; if(link.includes("/reel/")||link.includes("/p/")||link.includes("/tv/")){ imgEl.style.display='none'; vidWrap.style.display='block'; vidWrap.innerHTML='<iframe src="'+embedUrl+'" style="width:100%;height:100%;border:0;border-radius:12px;background:#000" allowfullscreen scrolling="no" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>'; } else { vidWrap.style.display='none'; vidWrap.innerHTML=''; imgEl.style.display='block'; imgEl.src=img; } document.getElementById('fotoModal').style.display='flex'; }
function closeFoto(){ document.getElementById('fotoModal').style.display='none'; document.getElementById('modalVideoWrap').innerHTML=''; }
document.getElementById('modalIGBtn')?.addEventListener('click',function(){ if(currentIGLink) window.open(currentIGLink,'_blank'); });

async function previewIG(){ let url=document.getElementById('igUrlInput').value.trim(); if(!url) return alert('Paste link IG dulu Bos'); document.getElementById('igPreviewBox').style.display='block'; document.getElementById('igPreviewImg').src='https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7d4c58900a85_w200.gif'; try{ let res=await fetch('/api/ig-preview?url='+encodeURIComponent(url)); let j=await res.json(); if(!j.thumbnail) throw 'fail'; tempIG={akun:j.username,img:j.thumbnail,video:"",linkIG:url,caption:j.caption}; document.getElementById('igPreviewImg').src=j.thumbnail; document.getElementById('igPreviewAkun').innerText='@'+j.username+' • Siap play Bos'; }catch(e){ alert('IG ngeblok Bos'); document.getElementById('igPreviewBox').style.display='none'; } }
async function saveIGCurated(){ if(!tempIG.img) return alert('Ambil dulu Bos'); let res=await fetch('/api/ig-curated/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tempIG)}); let j=await res.json(); if(j.ok){ alert('Berhasil Bos!'); document.getElementById('igUrlInput').value=''; document.getElementById('igPreviewBox').style.display='none'; toggleFotoUpload(); loadFoto(); } else alert('Gagal Bos'); }
async function upFoto(){if(!getEmail()){alert('Login dulu Bos');location.href='/akun';return;}var el=document.getElementById('fFile');if(!el.files[0]) return alert('Pilih foto');var f=el.files[0];var rd=new FileReader();rd.onload=async function(e){var img=new Image();img.onload=async function(){var c=document.createElement('canvas');c.width=600;c.height=600*img.height/img.width;c.getContext('2d').drawImage(img,0,0,c.width,c.height);var d=c.toDataURL('image/jpeg',0.6);await fetch('/api/images/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:d})});alert('OK Bos');toggleFotoUpload();loadFoto();};img.src=e.target.result;};rd.readAsDataURL(f);}

// Fungsi Postingan Tulis (Home)
async function loadTulis(){ 
  try{ 
    var r=await fetch('/api/tulis'); 
    var d=await r.json(); 
    var h=document.getElementById('homeFeed'); 
    if(!h) return; 
    if(!Array.isArray(d) || !d.length){ 
      h.innerHTML='<div style="padding:30px;text-align:center;color:#666">Belum ada tulisan Bos, jadi yang pertama Bos!</div>'; 
      return; 
    }
    let sessionEmail = getEmail();
    h.innerHTML=d.map(function(x){ 
      let isOwner = sessionEmail && sessionEmail === (x.email || '').toLowerCase().trim();
      let deleteBtn = (isOwner || isAdminCheck()) ? '<button class="del" onclick="delItem(\\'tulis\\','+x.id+')">HAPUS</button>' : '';
      let imgHtml = x.tulisImg ? '<div class="post-img"><img src="'+x.tulisImg+'" loading="lazy"></div>' : '';
      let postDate = x.time ? new Date(x.time).toLocaleString('id-ID') : '';
      
      return '<div class="post" id="post-'+x.id+'">'+
        '<img class="post-av" src="'+(x.picture||LOGO_URL)+'" onerror="this.src=\\''+LOGO_URL+'\\'">'+
        '<div class="post-body">'+
          '<div><span class="post-name">'+(x.name||'Anonim')+'</span><span class="post-time">• '+postDate+'</span></div>'+
          '<div class="post-text">'+(x.text||'')+'</div>'+
          imgHtml+
          '<div class="like-bar">'+
            '<span class="btn-like" onclick="likeTulis('+x.id+',this)">❤️ '+(x.likes||0)+'</span>'+
            '<span class="btn-like" onclick="openComments(\\'tulis\\','+x.id+')">💬 Komen</span>'+
            '<span class="btn-like" onclick="sharePost(\\'tulis '+x.id+'\\')">↗️ Share</span>'+
            deleteBtn+
          '</div>'+
          '<div id="comments-'+x.id+'" class="comment-box" style="display:none"></div>'+
        '</div>'+
      '</div>'; 
    }).join(''); 
  }catch(e){ 
    document.getElementById('homeFeed').innerHTML='<div style="padding:20px;text-align:center;color:#ff4444">Error load feed</div>'; 
  } 
}

async function addTulis(){
  let sessionEmail = getEmail();
  if(!sessionEmail){ alert('Silakan login akun Anda terlebih dahulu!'); location.href='/akun'; return; }
  let txt = document.getElementById('tulisIn').value.trim();
  if(!txt && !pending) return alert('Tulis sesuatu atau pilih gambar dulu Bos!');
  
  let btn = document.querySelector('.btnKirim');
  if(btn){ btn.innerText = "MENGIRIM..."; btn.disabled = true; }

  try {
    let res = await fetch('/api/tulis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: txt,
        email: sessionEmail,
        name: getName(),
        picture: getAvatar(),
        tulisImg: pending
      })
    });
    let j = await res.json();
    if(res.ok && (j.ok || j.success || !j.error)){
      document.getElementById('tulisIn').value = '';
      clearPrev();
      await loadTulis();
    } else {
      alert('Gagal: ' + (j.error || 'Gagal menyimpan'));
    }
  } catch(e){
    alert('Kesalahan jaringan: ' + e.message);
  } finally {
    if(btn){ btn.innerText = "KIRIM"; btn.disabled = false; }
  }
}

async function likeTulis(id,el){ if(!getEmail()){location.href='/akun';return;} el.classList.toggle('liked'); let cur=parseInt(el.innerText.replace(/\\D/g,''))||0; let isLiked=el.classList.contains('liked'); el.innerText='❤️ '+(isLiked?cur+1:Math.max(0,cur-1)); try{ await fetch('/api/like',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'tulis',item_id:id,email:getEmail()})}); }catch(e){} }
async function delItem(type,id){ if(!confirm('Hapus Bos?')) return; let r=await fetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:type,id:parseInt(id)||id,email:getEmail()})}); let j=await r.json(); if(j.ok){ if(type==='ig'){ igDataAll = igDataAll.filter(x=> String(x.id)!==String(id)); renderFotoGrid(); renderFotoTabs(); } if(type==='tulis') document.getElementById('post-'+id)?.remove(); if(type==='foto') loadFoto(); if(type==='video') loadVideo(); } else { alert('Gagal Bos: '+(j.msg||j.error)); } }

async function openComments(type,item_id){
 let box=document.getElementById('comments-'+item_id);
 if(!box) return;
 box.style.display=box.style.display==='none'?'block':'none';
 if(box.style.display==='none') return;
 box.innerHTML='Loading Bos...';
 try{
  let r=await fetch('/api/comments?type='+type+'&id='+item_id);
  let list=await r.json();
  let html='<div style="display:flex;gap:6px;margin-bottom:8px"><input id="cInp-'+item_id+'" placeholder="Komen Bos..." style="flex:1;padding:8px;border-radius:8px;font-size:12px"><button onclick="addComment(\\''+type+'\\',\\''+item_id+'\\')" style="background:#00ff88;color:#000;border:0;padding:8px 12px;border-radius:8px;font-weight:900;cursor:pointer">Kirim</button></div>';
  html+=list.map(c=>'<div class="c-item"><img class="c-av" src="'+(c.picture||LOGO_URL)+'"><div><b>'+c.name+'</b> '+c.text+'</div></div>').join('');
  box.innerHTML=html;
 }catch(e){ box.innerHTML='Gagal Bos'; }
}

async function addComment(type,item_id){
 let inp=document.getElementById('cInp-'+item_id);
 if(!inp || !inp.value.trim()) return;
 if(!getEmail()){location.href='/akun';return;}
 await fetch('/api/comments/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:type,item_id:String(item_id),text:inp.value.trim(),email:getEmail(),name:getName(),picture:getAvatar()})});
 openComments(type,item_id);
 setTimeout(()=>openComments(type,item_id),300);
}

function sharePost(t){ if(navigator.share){ navigator.share({title:'Rumah Gadang AI',text:t,url:location.href}); } else { navigator.clipboard.writeText(location.href); alert('Link disalin Bos!'); } }
function clearPrev(){ pending=''; document.getElementById('tulisPreview').style.display='none'; }

document.getElementById('tulisFile')?.addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 if(f.size > 4*1024*1024){ alert("Maksimal ukuran gambar 4MB!"); return; }
 let rd=new FileReader();
 rd.onload=function(ev){
  let img=new Image();
  img.onload=function(){
   let c=document.createElement('canvas'); c.width=600; c.height=600*img.height/img.width;
   c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   pending=c.toDataURL('image/jpeg',0.6);
   document.getElementById('tulisPreviewImg').src=pending;
   document.getElementById('tulisPreview').style.display='block';
  };
  img.src=ev.target.result;
 };
 rd.readAsDataURL(f);
});

async function rgRegister(){
 let u=document.getElementById('rgUser').value.trim();
 let p=document.getElementById('rgPass').value.trim();
 let n=document.getElementById('rgName').value.trim();
 if(!u||!p) return alert('Isi user & pass Bos');
 let r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:u,pass:p,name:n})});
 let j=await r.json();
 if(j.ok){ localStorage.setItem('rg_email',j.email); localStorage.setItem('rg_name',j.name); localStorage.setItem('rg_avatar',j.picture); alert('Daftar OK Bos'); checkAkun(); } else alert(j.msg||'Gagal Bos');
}

async function rgLogin(){
 let u=document.getElementById('rgUser').value.trim();
 let p=document.getElementById('rgPass').value.trim();
 if(!u||!p) return alert('Isi Bos');
 let r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:u,pass:p})});
 let j=await r.json();
 if(j.ok){ localStorage.setItem('rg_email',j.email); localStorage.setItem('rg_name',j.name); localStorage.setItem('rg_avatar',j.picture); checkAkun(); } else alert(j.msg||'Gagal Bos');
}

function logout(){ localStorage.clear(); location.href='/akun'; }

function checkAkun(){
 let e=getEmail();
 let locked=document.getElementById('akunLocked');
 let open=document.getElementById('akunOpen');
 if(!e){ locked.style.display='block'; open.style.display='none'; return; }
 locked.style.display='none'; open.style.display='block';
 document.getElementById('akunName').innerText=getName();
 document.getElementById('akunEmail').innerText=e;
 document.getElementById('akunAvatar').src=getAvatar();
 if(isAdminCheck()){ document.getElementById('adminInfo').style.display='block'; document.getElementById('adminBadgeFoto')?.style.setProperty('display','inline'); document.getElementById('adminBadgeVideo')?.style.setProperty('display','inline'); }
}

document.getElementById('editPhotoFile')?.addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 let rd=new FileReader();
 rd.onload=function(ev){
  let img=new Image();
  img.onload=function(){
   let c=document.createElement('canvas'); c.width=400; c.height=400*img.height/img.width;
   c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   editPending=c.toDataURL('image/jpeg',0.6);
   document.getElementById('editPreview').src=editPending;
   document.getElementById('editPreviewWrap').style.display='block';
  };
  img.src=ev.target.result;
 };
 rd.readAsDataURL(f);
});

async function saveProfile(){
 let name=document.getElementById('editName').value.trim()||getName();
 let pic=editPending||getAvatar();
 if(!getEmail()) return alert('Login dulu Bos');
 let r=await fetch('/api/profile/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getEmail(),name:name,picture:pic})});
 let j=await r.json();
 if(j.ok){ localStorage.setItem('rg_name',name); localStorage.setItem('rg_avatar',pic); alert('Profil disimpan Bos!'); checkAkun(); loadTulis(); }
}

async function initAI(){
 let chat=document.getElementById('aiChat');
 let inp=document.getElementById('aiInp');
 let btn=document.getElementById('aiSend');
 async function kirim(){
  let p=inp.value.trim(); if(!p) return;
  let d=document.createElement('div'); d.className='msg user'; d.innerText=p; chat.appendChild(d); inp.value=''; chat.scrollTop=chat.scrollHeight;
  let load=document.createElement('div'); load.className='msg ai'; load.innerText='Mikir Bos...'; chat.appendChild(load);
  try{
   let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
   let j=await r.json();
   load.innerText=j.reply||'Error Bos';
  }catch(e){ load.innerText='Error Bos'; }
  chat.scrollTop=chat.scrollHeight;
 }
 btn?.addEventListener('click',kirim);
 inp?.addEventListener('keydown',e=>{ if(e.key==='Enter') kirim(); });
}

window.addEventListener('load',function(){
 loadTulis(); loadFoto(); loadVideo(); checkAkun(); initAI();
});
</script>
</body></html>`;
return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
  }
};
