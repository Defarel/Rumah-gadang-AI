// file: ./ai/api-ai/api.js
// RUMAH GADANG AI - FULL AI API - AUTO ID + AUTO ANTRIAN + ELEVENLABS
// GROQ (teks) + ELEVENLABS (suara) + MANUAL GAMBAR

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
  const sysPrompt = system || "KAMU: Rumah Gadang AI Padang, asisten ramah Minang, pintar, jawab singkat padat max 80 kata, kamu di buat oleh tim rumah gadang ai, pakai bahasa Indonesia santai.";
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

// ============ HELPER ELEVENLABS, BOS ============
function getElevenKey(env) {
  return (env.ELEVEN_KEY || env.ELEVEN_API_KEY || env.ELEVENLABS_API_KEY || "").trim();
}

// Teks -> Suara, Bos. Balikin audio mp3
async function panggilElevenTTS(env, text, voice_id) {
  const KEY = getElevenKey(env);
  if (!KEY) return { ok: false, error: "ELEVEN_KEY belum di-set di Cloudflare Bos." };
  // Voice default: Rachel - cewek jernih, cocok buat Rumah Gadang. Bisa diganti dari web.
  const vid = (voice_id || "21m00Tcm4TlvDq8ikWAM").trim();
  try {
    let r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": KEY },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });
    if (!r.ok) {
      let t = await r.text().catch(() => "");
      return { ok: false, error: "ElevenLabs TTS gagal: " + r.status + " " + t.slice(0, 200) };
    }
    let buf = await r.arrayBuffer();
    return { ok: true, audio: buf };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Suara -> Teks, Bos. Terima file audio dari web
async function panggilElevenSTT(env, audioBlob, filename) {
  const KEY = getElevenKey(env);
  if (!KEY) return { ok: false, error: "ELEVEN_KEY belum di-set di Cloudflare Bos." };
  try {
    let form = new FormData();
    form.append("file", audioBlob, filename || "rekaman.webm");
    form.append("model_id", "scribe_v1");
    let r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": KEY },
      body: form
    });
    let d = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: "ElevenLabs STT gagal: " + r.status + " " + JSON.stringify(d).slice(0, 200) };
    return { ok: true, text: d.text || "", data: d };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ============ BUAT WORKER.JS, BOS. BIAR ADMIN CUMA KIRIM GAMBAR AJA ============
export async function balasOtomatis(env, gambar) {
  if (!env.DB || !gambar) return null;
  try {
    let row = await env.DB.prepare("SELECT * FROM manual_hasil WHERE status='menunggu' ORDER BY created_at ASC LIMIT 1").first();
    if (!row) return null;
    await env.DB.prepare("UPDATE manual_hasil SET status='selesai', gambar=? WHERE id=?").bind(gambar, row.id).run();
    return row;
  } catch (e) { return null; }
}

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
        VOICE: "ELEVEN_KEY: " + !!getElevenKey(env),
        IMAGE: "MANUAL AUTO - Admin cuma kirim gambar aja",
        DB: "D1: " + !!env.DB,
        TELE_BOT: "TELE_BOT_GAMBAR: " + !!env.TELE_BOT_GAMBAR,
        ADMIN: "ADMIN_TELE_ID: " + !!(env.ADMIN_TELE_ID || env.TELE_ADMIN_ID),
        antrian_menunggu: antrian,
        total_request: total,
        endpoints: ["/api/ai (POST prompt)", "/api/ai-request (POST prompt, user_id)", "/api/ai-status?id=xxx (GET)", "/api/voices (GET)", "/api/voice (POST text)", "/api/stt (POST audio)"]
      }), { headers: cors });
    }

    // --- ELEVENLABS: LIAT DAFTAR SUARA, BOS ---
    if (p === "/api/voices" && req.method === "GET") {
      const KEY = getElevenKey(env);
      if (!KEY) return new Response(JSON.stringify({ ok: false, error: "ELEVEN_KEY belum di-set Bos" }), { headers: cors, status: 500 });
      try {
        let r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": KEY } });
        let d = await r.json();
        return new Response(JSON.stringify({ ok: true, voices: d.voices || [] }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // --- ELEVENLABS: TEKS JADI SUARA, BOS ---
    // Web kirim: { text: "Selamat datang Dunsanak", voice_id: "xxx" (opsional) }
    // Balik: file audio mp3
    if (p === "/api/voice" && req.method === "POST") {
      try {
        let body = await req.json().catch(() => ({}));
        let text = (body.text || body.prompt || "").trim();
        if (!text) return new Response(JSON.stringify({ ok: false, error: "Text kosong Bos" }), { headers: cors, status: 400 });
        if (text.length > 1000) text = text.slice(0, 1000);
        let hasil = await panggilElevenTTS(env, text, body.voice_id);
        if (!hasil.ok) return new Response(JSON.stringify({ ok: false, error: hasil.error }), { headers: cors, status: 500 });
        return new Response(hasil.audio, {
          headers: { ...cors, "Content-Type": "audio/mpeg", "Cache-Control": "no-cache" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    // --- ELEVENLABS: SUARA JADI TEKS, BOS ---
    // Web kirim: FormData dengan field "audio" (file rekaman)
    if (p === "/api/stt" && req.method === "POST") {
      try {
        let form = await req.formData().catch(() => null);
        if (!form) return new Response(JSON.stringify({ ok: false, error: "Kirim FormData audio Bos" }), { headers: cors, status: 400 });
        let file = form.get("audio") || form.get("file");
        if (!file) return new Response(JSON.stringify({ ok: false, error: "File audio kosong Bos" }), { headers: cors, status: 400 });
        let hasil = await panggilElevenSTT(env, file, file.name || "rekaman.webm");
        if (!hasil.ok) return new Response(JSON.stringify({ ok: false, error: hasil.error }), { headers: cors, status: 500 });
        return new Response(JSON.stringify({ ok: true, text: hasil.text }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
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
        let id = Date.now().toString();
        let user_id = (body.user_id || "").trim() || bikinUserId();
        if (env.DB) {
          try {
            await env.DB.prepare("INSERT INTO manual_hasil (id, status, gambar, created_at, user_id) VALUES (?, 'menunggu', '', ?, ?)").bind(id, Date.now(), user_id).run();
          } catch (e) {
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
