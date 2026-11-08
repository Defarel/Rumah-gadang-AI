// file: ./ai/api-ai/api.js
// RUMAH GADANG AI - FULL AI API
// TEXT: Groq | GAMBAR: MANUAL via Telegram | T2I / KREA: UDAH DIHAPUS TOTAL

// Tempat nyimpen hasil manual lu, Bos. Biar Web bisa ngintip
// Key: ID Web (Date.now) | Value: { status: 'menunggu' | 'selesai', gambar: 'link / teks' }
let HASIL_MANUAL = {};

// Buat Worker utama manggil pas admin /balas, Bos
export function setHasilManual(id, gambar) {
  if (!id) return false;
  HASIL_MANUAL[String(id)] = { status: 'selesai', gambar: gambar || '' };
  return true;
}

export function getHasilManual(id) {
  return HASIL_MANUAL[String(id)] || null;
}

export function getSemuaHasilManual() {
  return HASIL_MANUAL;
}

// Kirim pesan ke Telegram, Bos
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

// Panggil Groq, Bos. Coba 3 model, kalau 1 gagal pindah ke model lain
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
      if (d.choices?.[0]?.message?.content) {
        return { ok: true, reply: d.choices[0].message.content, model };
      }
    } catch (e) { continue; }
  }
  return { ok: false, reply: "Groq gagal semua model Bos." };
}

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

    // --- GET STATUS - BUAT CEK DI BROWSER, BOS ---
    if (req.method === "GET" && p === "/api/ai") {
      return new Response(JSON.stringify({
        ok: true,
        service: "Rumah Gadang AI",
        TEXT: "GROQ_API_KEY: " + !!env.GROQ_API_KEY,
        IMAGE: "MANUAL by Admin - via Telegram",
        TELE_BOT: "TELE_BOT_GAMBAR: " + !!env.TELE_BOT_GAMBAR,
        ADMIN: "ADMIN_TELE_ID: " + !!(env.ADMIN_TELE_ID || env.TELE_ADMIN_ID),
        endpoints: ["/api/ai (POST prompt)", "/api/ai-request (POST prompt)", "/api/ai-status?id=xxx (GET)"]
      }), { headers: cors });
    }

    // --- T2I UDAH DIHAPUS, BOS. KASIH PESAN JELAS, JANGAN 404 ---
    if (p === "/api/t2i") {
      return new Response(JSON.stringify({
        ok: false,
        error: "Fitur gambar AI (T2I / Krea) udah dihapus Bos. Gambar sekarang manual by Admin via Telegram."
      }), { headers: cors, status: 410 });
    }

    // --- WEB /ai MINTA GAMBAR -> KIRIM KE TELEGRAM ADMIN, BOS. PENGGANTI T2I ---
    if (p === "/api/ai-request" && req.method === "POST") {
      try {
        let { prompt } = await req.json().catch(() => ({}));
        prompt = (prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, error: "Prompt kosong Bos" }), { headers: cors, status: 400 });

        let id = Date.now().toString();
        HASIL_MANUAL[id] = { status: 'menunggu', gambar: '' };

        let token = (env.TELE_BOT_GAMBAR || "").trim();
        let adminId = (env.ADMIN_TELE_ID || env.TELE_ADMIN_ID || "").trim();

        if (token && adminId) {
          await kirimTelegram(token, adminId,
            `ADA REQUEST BARU BOS!\n\nDari: Web /ai\nID: ${id}\nMinta: ${prompt}\n\nBalas pakai:\n/balas ${id} <link gambar lu>`
          );
        } else {
          return new Response(JSON.stringify({ ok: false, error: "TELE_BOT_GAMBAR / ADMIN_TELE_ID belum di-set Bos" }), { headers: cors, status: 500 });
        }

        return new Response(JSON.stringify({ ok: true, id, status: 'menunggu' }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // --- WEB NANYA "UDAH JADI BELUM?", BOS. DIPANGGIL TIAP 3 DETIK SAMA FRONTEND ---
    if (p === "/api/ai-status" && req.method === "GET") {
      let id = url.searchParams.get('id') || "";
      if (!id) return new Response(JSON.stringify({ ok: false, status: 'id kosong' }), { headers: cors, status: 400 });
      let hasil = HASIL_MANUAL[id] || { status: 'gak ketemu' };
      return new Response(JSON.stringify({ ok: true, id, ...hasil }), { headers: cors });
    }

    // --- API AI TEXT (Groq) - INI DOANG YANG DIPAKE BUAT NANYA, BOS ---
    if (p === "/api/ai" && req.method === "POST") {
      try {
        let { prompt, system } = await req.json().catch(() => ({}));
        prompt = (prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, reply: "Prompt kosong Bos" }), { headers: cors, status: 400 });

        let hasil = await panggilGroq(env, prompt, system);
        if (hasil.ok) {
          return new Response(JSON.stringify({ ok: true, reply: hasil.reply, model: hasil.model }), { headers: cors });
        } else {
          return new Response(JSON.stringify({ ok: false, reply: hasil.reply }), { headers: cors, status: 500 });
        }
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reply: e.message }), { headers: cors, status: 500 });
      }
    }

    return null;
  }
};

// Biar Worker utama lu bisa panggil pakai nama lain, Bos
export const TULIS_API = AI_API;
export const FOTO_API = AI_API;
export const VIDEO_API = AI_API;
export const AKUN_API = AI_API;
export default AI_API;
