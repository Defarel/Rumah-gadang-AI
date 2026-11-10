// file: worker.js - RUMAH GADANG AI - FULL AUTO
// ADMIN CUMA KIRIM GAMBAR AJA BOS. API YANG BIKIN ID + ANTRIAN

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

// ===== AI API FINAL - GROQ + MANUAL AUTO VIA DB, T2I UDAH DIHAPUS, BOS =====
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

    if (req.method === "GET" && p === "/api/ai") {
      let antrian = 0;
      if (env.DB) { try { let r = await env.DB.prepare("SELECT COUNT(*) as c FROM manual_hasil WHERE status='menunggu'").first(); antrian = r?.c || 0; } catch {} }
      return new Response(JSON.stringify({
        ok: true,
        TEXT: "GROQ: " + !!env.GROQ_API_KEY,
        IMAGE: "MANUAL AUTO - Admin cuma kirim gambar",
        DB: !!env.DB,
        antrian_menunggu: antrian
      }), { headers: cors });
    }

    if (p === "/api/t2i") {
      return new Response(JSON.stringify({ ok: false, error: "T2I udah dihapus Bos. Gambar sekarang manual by Admin via Telegram." }), { headers: cors, status: 410 });
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
    return null;
  }
};

// ===== HELPER DB - GANTI HASIL_MANUAL, BOS. BIAR WEB + TELEGRAM NYAMBUNG =====
async function ambilAntrianPalingAtas(env) {
  if (!env.DB) return null;
  try { return await env.DB.prepare("SELECT * FROM manual_hasil WHERE status='menunggu' ORDER BY created_at ASC LIMIT 1").first(); }
  catch (e) { return null; }
}
async function selesaikanAntrian(env, id, gambar) {
  if (!env.DB) return false;
  try { await env.DB.prepare("UPDATE manual_hasil SET status='selesai', gambar=? WHERE id=?").bind(gambar || '', String(id)).run(); return true; }
  catch (e) { return false; }
}

// ===== TELEGRAM BOT - AUTO, BOS. ADMIN CUMA KIRIM GAMBAR AJA =====
async function handleTelegram(req, env) {
  const token = (env.TELE_BOT_GAMBAR || "").trim();
  const ADMIN_ID = (env.ADMIN_TELE_ID || env.TELE_ADMIN_ID || "").trim();
  if (!token) return new Response("token belum set Bos", { status: 500 });

  const update = await req.json().catch(() => ({}));
  const msg = update.message;
  if (!msg) return new Response("ok");

  const chatId = msg.chat.id;
  const text = (msg.text || msg.caption || "").trim();
  const nama = msg.from?.first_name || "Orang";
  const username = msg.from?.username ? "@" + msg.from.username : "-";
  const api = `https://api.telegram.org/bot${token}`;
  const isAdmin = ADMIN_ID && String(chatId) === String(ADMIN_ID);

  const kirim = async (ke, teks) => {
    await fetch(api + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ke, text: teks })
    });
  };
  const kirimFoto = async (ke, foto, caption) => {
    await fetch(api + "/sendPhoto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ke, photo: foto, caption })
    });
  };

  if (text === "/start") {
    if (isAdmin) {
      await kirim(chatId, "Halo Bos! Bot Admin aktif ✅\n\nCara baru Bos, gampang:\n1. Orang minta di Web /ai\n2. Lu CUMA KIRIM FOTO aja di sini, gak usah ketik apa-apa\n3. Otomatis masuk ke Web Bos!\n\nCek antrian: /antrian");
    } else {
      await kirim(chatId, `Halo ${nama}! 👋\n\nMau gambar? Buka aja:\nhttps://rumahgadang-ai.my.id/ai\n\nKetik di sana "Gambarkan rumah" Bos, nanti admin yang bikinin.`);
    }
    return new Response("ok");
  }

  if (isAdmin && text === "/antrian") {
    let rows = await env.DB.prepare("SELECT * FROM manual_hasil WHERE status='menunggu' ORDER BY created_at ASC LIMIT 10").all().catch(() => ({ results: [] }));
    let list = rows.results || [];
    if (list.length === 0) { await kirim(chatId, "Antrian kosong Bos. Gak ada yang nunggu."); return new Response("ok"); }
    let pesan = `ANTRIAN BOS (${list.length}):\n\n`;
    for (let r of list) pesan += `ID: ${r.id}\nUser: ${r.user_id || '-'}\n---\n`;
    pesan += `\nLu cuma kirim foto aja Bos, nanti otomatis ke yang paling atas.`;
    await kirim(chatId, pesan);
    return new Response("ok");
  }

  // === 1. ADMIN KIRIM FOTO DOANG, BOS. INI YANG LU MAU, BOS ===
  // Gak usah /balas, gak usah ID. Foto doang -> Otomatis ke antrian paling atas
  if (isAdmin && msg.photo) {
    let fileId = msg.photo[msg.photo.length - 1].file_id;
    let fileRes = await fetch(`${api}/getFile?file_id=${fileId}`).then(r => r.json()).catch(() => null);
    if (!fileRes?.result?.file_path) { await kirim(chatId, "Gagal ambil foto Bos, kirim ulang Bos."); return new Response("ok"); }
    let linkFoto = `https://api.telegram.org/file/bot${token}/${fileRes.result.file_path}`;

    // Kalau caption ada /balas ID, pakai ID itu. Kalau gak ada, OTOMATIS Bos
    if (text.startsWith("/balas")) {
      let targetId = text.replace("/balas", "").trim().split(" ")[0];
      if (targetId) {
        await selesaikanAntrian(env, targetId, linkFoto);
        await kirim(chatId, "Beres Bos! Foto udah masuk ke Web ID " + targetId);
        return new Response("ok");
      }
    }
    let row = await ambilAntrianPalingAtas(env);
    if (row) {
      await selesaikanAntrian(env, row.id, linkFoto);
      await kirim(chatId, `Beres Bos! Foto lu otomatis masuk ke Web.\nID: ${row.id}\nUser: ${row.user_id || '-'}\nUdah muncul di Web Bos!`);
    } else {
      await kirim(chatId, "Gak ada antrian Bos. Belum ada yang minta gambar di Web.");
    }
    return new Response("ok");
  }

  // === 2. ADMIN KIRIM LINK DOANG, BOS. JUGA OTOMATIS ===
  if (isAdmin && text.startsWith("http")) {
    let row = await ambilAntrianPalingAtas(env);
    if (row) {
      await selesaikanAntrian(env, row.id, text);
      await kirim(chatId, "Beres Bos! Link lu otomatis masuk ke Web ID " + row.id);
    } else {
      await kirim(chatId, "Gak ada antrian Bos.");
    }
    return new Response("ok");
  }

  // === 3. ADMIN MASIH PAKAI /balas ID + PESAN, BOS. MASIH BISA ===
  if (isAdmin && text.startsWith("/balas ")) {
    let sisa = text.replace("/balas ", "");
    let spasi = sisa.indexOf(" ");
    if (spasi === -1) { await kirim(chatId, "Format salah Bos. Pakai: /balas ID pesan"); return new Response("ok"); }
    let targetId = sisa.slice(0, spasi);
    let pesan = sisa.slice(spasi + 1);
    await selesaikanAntrian(env, targetId, pesan);
    // Kalau ID-nya ID Telegram user (pendek), kirim juga ke user-nya, Bos
    if (targetId.length < 13) {
      if (pesan.startsWith("http")) await kirimFoto(targetId, pesan, "Nih Bos, gambar dari admin Rumah Gadang AI 🙏");
      else await kirim(targetId, "Dari Admin Rumah Gadang AI:\n" + pesan);
    }
    await kirim(chatId, "Udah terkirim ke " + targetId + " Bos.");
    return new Response("ok");
  }

  // === 4. ADMIN NGETIK BIASA, BOS. JANGAN MASUK ANTRIAN ===
  if (isAdmin && text && !text.startsWith("/")) {
    await kirim(chatId, "Siap Bos, dicatat. Kalau mau kirim gambar ke Web, tinggal kirim foto aja Bos, gak usah ketik apa-apa.\n\nCek antrian: /antrian");
    return new Response("ok");
  }

  // === 5. ORANG BIASA DI TELEGRAM, BOS. JANGAN MASUK ANTRIAN WEB ===
  // Dulu ini yang bikin nyasar, Bos. Yang "Dari: Yongky" itu, Bos. Sekarang udah dipisah, Bos.
  if (!isAdmin) {
    if (msg.photo) {
      await kirim(chatId, "Foto lu udah diterima Bos, tapi kalau mau minta gambar, bukanya di Web ya Bos:\nhttps://rumahgadang-ai.my.id/ai");
      return new Response("ok");
    }
    let kataGambar = ['gambar', 'gambarkan', 'buatkan', 'bikin', 'foto', 'lukis', 'desain'];
    let mintaGambar = kataGambar.some(k => text.toLowerCase().includes(k));
    if (mintaGambar) {
      await kirim(chatId, `Siap Bos, minta gambarnya di Web aja ya Bos:\nhttps://rumahgadang-ai.my.id/ai\n\nDi sana ketik aja: ${text}`);
      return new Response("ok");
    }
    if (text && !text.startsWith("/")) {
      let reply = "Halo Bos, mau gambar apa?";
      try {
        let groqRes = await AI_API.handle(new Request("https://rumahgadang-ai.my.id/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: text }) }), env, new URL("https://rumahgadang-ai.my.id/api/ai"), {});
        let groqData = await groqRes.json();
        if (groqData.reply) reply = groqData.reply;
      } catch {}
      await kirim(chatId, reply);
      return new Response("ok");
    }
  }

  return new Response("ok");
}

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
  if (html.includes('</title>')) return html.replace('</title>', `</title>\n<link rel="canonical" href="${canonicalUrl}">`);
  if (html.includes('</head>')) return html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}">\n</head>`);
  return html;
}
function htmlResponse(html, canonical) {
  const fixed = injectCanonical(html, canonical);
  return new Response(fixed, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "public, max-age=300" } });
}

// ===== MAIN WORKER EXPORT =====
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();

    // WEBHOOK TELEGRAM - HARUS PALING ATAS, SEBELUM REDIRECT
    if (path === "/api/telegram" && req.method === "POST") {
      return handleTelegram(req, env);
    }

    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    };

    if (req.method === "OPTIONS") return new Response("", { headers: cors });

    // ===== WEB /ai MINTA GAMBAR -> API OTOMATIS BIKIN ID + MASUK ANTRIAN DB, BOS =====
    if (path === "/api/ai-request" && req.method === "POST") {
      try {
        let body = await req.json().catch(() => ({}));
        let prompt = (body.prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, error: "Prompt kosong" }), { headers: cors, status: 400 });
        // ID OTOMATIS, BOS. API YANG BIKININ
        let id = Date.now().toString();
        let user_id = (body.user_id || "").trim() || ("user-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6));
        if (env.DB) {
          try {
            await env.DB.prepare("INSERT INTO manual_hasil (id, status, gambar, created_at, user_id) VALUES (?, 'menunggu', '', ?, ?)").bind(id, Date.now(), user_id).run();
          } catch (e) {
            // Tabel lama belum ada user_id, Bos. Pakai cara lama
            await env.DB.prepare("INSERT INTO manual_hasil (id, status, gambar, created_at) VALUES (?, 'menunggu', '', ?)").bind(id, Date.now()).run();
          }
        }
        let token = (env.TELE_BOT_GAMBAR || "").trim();
        let adminId = (env.ADMIN_TELE_ID || env.TELE_ADMIN_ID || "").trim();
        if (token && adminId) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: adminId, text: `ADA REQUEST BARU BOS!\n\nDari: Web /ai\nUser: ${user_id}\nID: ${id}\nMinta: ${prompt}\n\nLu cuma kirim gambar aja Bos, gak usah ketik /balas. Nanti otomatis masuk ke Web.` })
          });
        }
        return new Response(JSON.stringify({ ok: true, id, user_id }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // ===== WEB NANYA "UDAH JADI BELUM?", BOS. CEK DB, BOS =====
    if (path === "/api/ai-status" && req.method === "GET") {
      let id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ status: 'id kosong' }), { headers: cors });
      if (!env.DB) return new Response(JSON.stringify({ status: 'gak ketemu' }), { headers: cors });
      let row = await env.DB.prepare("SELECT * FROM manual_hasil WHERE id=?").bind(id).first().catch(() => null);
      if (!row) return new Response(JSON.stringify({ status: 'gak ketemu' }), { headers: cors });
      return new Response(JSON.stringify({ ok: true, id: row.id, status: row.status, gambar: row.gambar || '', user_id: row.user_id || '' }), { headers: cors });
    }

    // ===== LIHAT ANTRIAN, BOS =====
    if (path === "/api/ai-antrian" && req.method === "GET") {
      if (!env.DB) return new Response(JSON.stringify({ ok: false, error: "DB belum di-set" }), { headers: cors });
      let rows = await env.DB.prepare("SELECT id, user_id, status, created_at FROM manual_hasil WHERE status='menunggu' ORDER BY created_at ASC LIMIT 20").all().catch(() => ({ results: [] }));
      return new Response(JSON.stringify({ ok: true, antrian: rows.results || [] }), { headers: cors });
    }

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
                // === ELEVENLABS SUARA, BOS. HARUS DITAMBAH, SOALNYA GAK DIAWALI /api/ai, BOS ===
        if (path === '/api/voice' || path === '/api/voices' || path === '/api/stt' || path.startsWith('/api/voice')) {
          let m = getApi(AI_API_M);
          if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
        }
        if (path.startsWith('/api/ai')) {
          let m = getApi(AI_API_M);
          if (m?.handle) { let r = await m.handle(req, env, url, cors); if (r) return r; }
          if (AI_API?.handle) { let r = await AI_API.handle(req, env, url, cors); if (r) return r; }
        }
        if (path.startsWith('/api/t2i')) {
          return new Response(JSON.stringify({ ok: false, error: "T2I udah dihapus Bos. Gambar sekarang manual by Admin via Telegram." }), { headers: cors, status: 410 });
        }
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
      return new Response(JSON.stringify({ ok: false, error: "No handler " + path }), { headers: cors, status: 404 });
    }

    // 1. TANGKAP RUTE KANTOR, LUAR, & DALAM PALING UTAMA DI ATAS
    if (path === "/kantor" || path.startsWith("/kantor/") || path === "/luar" || path.startsWith("/luar/")) {
      return htmlResponse(LUAR_HTML, "https://rumahgadang-ai.my.id/kantor");
    }
    if (path === "/dalam" || path.startsWith("/dalam/")) {
      return htmlResponse(DALAM_HTML, "https://rumahgadang-ai.my.id/dalam");
    }

    // 2. USER PROFILE ROUTING (e.g. /username)
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      let username = segments[0];
      const reserved = ["home", "foto", "video", "ai", "kantor", "luar", "dalam", "akun", "api", "sitemap", "robots", "profil", "profile", "icon.png", "favicon.ico", "chat"];
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
    if (path === "/akun/chat" || path === "/chat") {
      return htmlResponse(CHAT_HTML, "https://rumahgadang-ai.my.id/akun/chat");
    }
    if (path.startsWith("/akun") || path.startsWith("/profil") || path.startsWith("/profile") || path.startsWith("/u/")) {
      return htmlResponse(AKUN_HTML, "https://rumahgadang-ai.my.id/akun");
    }

    return htmlResponse(HOME_HTML, "https://rumahgadang-ai.my.id/");
  }
};
