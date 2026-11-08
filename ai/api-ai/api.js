// file: ./ai/api-ai/api.js
// RUMAH GADANG AI - FULL AI API - AUTO ID + AUTO ANTRIAN
// LU CUMA KIRIM GAMBAR AJA BOS. API YANG NGATUR SEMUA

// ============ HELPER TELEGRAM, BOS ============
async function kirimTelegram(token, chat_id, text) {
  if (!token || !chat_id) return null;
  try {
    return await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text })
    });
  } catch (e) { return null; }
}

// ============ HELPER GROQ, BOS ============
async function panggilGroq(env, prompt, system) {
  const GROQ_KEY = (env.GROQ_API_KEY || "").trim();
  if (!GROQ_KEY) return { ok: false, reply: "GROQ_API_KEY belum di-set di Cloudflare Bos." };
  const sysPrompt = system || "KAMU: Rumah Gadang AI Padang, asisten ramah Minang, pintar, jawab singkat padat max 80 kata, pakai bahasa Indonesia santai.";
  const models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile"];
  for (let model of models) {
    try {
      let r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      let d = await r.json();
      if (d.choices?.[0]?.message?.content) return { ok: true, reply: d.choices[0].message.content, model };
    } catch (e) { continue; }
  }
  return { ok: false, reply: "Groq gagal semua model Bos." };
}

// ============ BUAT WORKER.JS, BOS. BIAR ADMIN CUMA KIRIM GAMBAR AJA ============

// Admin kirim foto doang -> Otomatis ambil antrian paling lama menunggu, Bos. FIFO
export async function balasOtomatis(env, gambar) {
  if (!env.DB || !gambar) return null;
  try {
    let row = await env.DB.prepare("SELECT * FROM manual_hasil WHERE status='menunggu' ORDER BY created_at ASC LIMIT 1").first();
    if (!row) return null;
    await env.DB.prepare("UPDATE manual_hasil SET status='selesai', gambar=? WHERE id=?").bind(gambar, row.id).run();
    return row;
  } catch (e) { return null; }
}

// Kalau admin masih mau pakai /balas ID, masih bisa Bos. Tapi gak wajib
export async function setHasilManual(env, id, gambar) {
  if (!env.DB || !id) return false;
  try {
    await env.DB.prepare("UPDATE manual_hasil SET status='selesai', gambar=? WHERE id=?").bind(gambar || '', String(id)).run();
    return true;
  } catch (e) { return false; }
}

export async function getHasilManual(env, id) {
  if (!env.DB || !id) return null;
  try {
    return await env.DB.prepare("SELECT * FROM manual_hasil WHERE id=?").bind(String(id)).first();
  } catch (e) { return null; }
}

// Bikin ID orang itu otomatis, Bos. Kalau Web gak kirim user_id, API yang bikinin
function bikinUserId() {
  return "user-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

// ============ API UTAMA, BOS ============
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

    // --- GET STATUS ---
    if (req.method === "GET" && p === "/api/ai") {
      let antrian = 0;
      let total = 0;
      if (env.DB) {
        try {
          let r1 = await env.DB.prepare("SELECT COUNT(*) as c FROM manual_hasil WHERE status='menunggu'").first();
          antrian = r1?.c || 0;
          let r2 = await env.DB.prepare("SELECT COUNT(*) as c FROM manual_hasil").first();
          total = r2?.c || 0;
        } catch (e) {}
      }
      return new Response(JSON.stringify({
        ok: true,
        service: "Rumah Gadang AI",
        TEXT: "GROQ_API_KEY: " + !!env.GROQ_API_KEY,
        IMAGE: "MANUAL AUTO - Admin cuma kirim gambar aja",
        DB: "D1: " + !!env.DB,
        TELE_BOT: "TELE_BOT_GAMBAR: " + !!env.TELE_BOT_GAMBAR,
        ADMIN: "ADMIN_TELE_ID: " + !!(env.ADMIN_TELE_ID || env.TELE_ADMIN_ID),
        antrian_menunggu: antrian,
        total_request: total,
        endpoints: ["/api/ai (POST prompt)", "/api/ai-request (POST prompt, user_id)", "/api/ai-status?id=xxx (GET)"]
      }), { headers: cors });
    }

    // --- T2I UDAH DIHAPUS ---
    if (p === "/api/t2i") {
      return new Response(JSON.stringify({ ok: false, error: "T2I udah dihapus Bos. Gambar manual by Admin." }), { headers: cors, status: 410 });
    }

    // --- WEB MINTA GAMBAR -> API OTOMATIS BIKIN ID ORANG ITU + MASUK ANTRIAN, BOS ---
    if (p === "/api/ai-request" && req.method === "POST") {
      try {
        let body = await req.json().catch(() => ({}));
        let prompt = (body.prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, error: "Prompt kosong Bos" }), { headers: cors, status: 400 });

        // ID REQUEST OTOMATIS, BOS. LU GAK USAH BIKIN
        let id = Date.now().toString();
        // ID ORANGNYA OTOMATIS, BOS. Kalau Web kirim user_id pakai itu, kalau gak API yang bikinin
        let user_id = (body.user_id || "").trim() || bikinUserId();

        if (env.DB) {
          try {
            await env.DB.prepare("INSERT INTO manual_hasil (id, status, gambar, created_at, user_id) VALUES (?, 'menunggu', '', ?, ?)").bind(id, Date.now(), user_id).run();
          } catch (e) {
            // Kalau tabel lama belum ada kolom user_id, pakai cara lama, Bos
            await env.DB.prepare("INSERT INTO manual_hasil (id, status, gambar, created_at) VALUES (?, 'menunggu', '', ?)").bind(id, Date.now()).run();
          }
        }

        let token = (env.TELE_BOT_GAMBAR || "").trim();
        let adminId = (env.ADMIN_TELE_ID || env.TELE_ADMIN_ID || "").trim();
        if (token && adminId) {
          await kirimTelegram(token, adminId,
            `ADA REQUEST BARU BOS!\n\nDari: Web /ai\nUser: ${user_id}\nID: ${id}\nMinta: ${prompt}\n\nLu cuma kirim gambar aja Bos, gak usah ketik /balas. Nanti otomatis masuk ke Web.`
          );
        } else {
          return new Response(JSON.stringify({ ok: false, error: "TELE_BOT_GAMBAR / ADMIN_TELE_ID belum di-set Bos" }), { headers: cors, status: 500 });
        }

        return new Response(JSON.stringify({ ok: true, id, user_id, status: 'menunggu' }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // --- WEB NANYA "UDAH JADI BELUM?", BOS ---
    if (p === "/api/ai-status" && req.method === "GET") {
      let id = url.searchParams.get('id') || "";
      if (!id) return new Response(JSON.stringify({ ok: false, status: 'id kosong' }), { headers: cors, status: 400 });
      if (!env.DB) return new Response(JSON.stringify({ ok: false, status: 'DB belum di-set' }), { headers: cors, status: 500 });
      let row = await env.DB.prepare("SELECT * FROM manual_hasil WHERE id=?").bind(id).first();
      if (!row) return new Response(JSON.stringify({ ok: false, status: 'gak ketemu' }), { headers: cors });
      return new Response(JSON.stringify({ ok: true, id: row.id, status: row.status, gambar: row.gambar || '', user_id: row.user_id || '' }), { headers: cors });
    }

    // --- LIHAT ANTRIAN, BOS. BUAT LU CEK DI BROWSER ---
    if (p === "/api/ai-antrian" && req.method === "GET") {
      if (!env.DB) return new Response(JSON.stringify({ ok: false, error: "DB belum di-set" }), { headers: cors });
      let rows = await env.DB.prepare("SELECT id, user_id, status, created_at FROM manual_hasil WHERE status='menunggu' ORDER BY created_at ASC LIMIT 20").all();
      return new Response(JSON.stringify({ ok: true, antrian: rows.results || [] }), { headers: cors });
    }

    // --- GROQ TEXT, BOS ---
    if (p === "/api/ai" && req.method === "POST") {
      try {
        let { prompt, system } = await req.json().catch(() => ({}));
        prompt = (prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, reply: "Prompt kosong Bos" }), { headers: cors, status: 400 });
        let hasil = await panggilGroq(env, prompt, system);
        if (hasil.ok) return new Response(JSON.stringify({ ok: true, reply: hasil.reply, model: hasil.model }), { headers: cors });
        return new Response(JSON.stringify({ ok: false, reply: hasil.reply }), { headers: cors, status: 500 });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reply: e.message }), { headers: cors, status: 500 });
      }
    }

    return null;
  }
};

export const TULIS_API = AI_API;
export const FOTO_API = AI_API;
export const VIDEO_API = AI_API;
export const AKUN_API = AI_API;
export default AI_API;
