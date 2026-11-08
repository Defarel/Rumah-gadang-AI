// file: ./ai/api-ai/api.js
// RUMAH GADANG AI - TANPA KREA, BOS. TEXT GROQ + MANUAL AJA

export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };
    
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const p = url.pathname.toLowerCase();

    // --- GET STATUS ---
    if (req.method === "GET" && p === "/api/ai") {
      return new Response(JSON.stringify({
        ok: true,
        service: "Rumah Gadang AI",
        TEXT: "GROQ_API_KEY: " + !!env.GROQ_API_KEY,
        IMAGE: "MANUAL by Admin - Krea Dihapus",
        endpoints: ["/api/ai (POST prompt)"]
      }), { headers: cors });
    }

    // --- API AI TEXT (Groq) - INI DOANG YANG DIPAKE, BOS ---
    if (p === "/api/ai" && req.method === "POST") {
      try {
        let { prompt, system } = await req.json().catch(() => ({}));
        prompt = (prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, reply: "Prompt kosong" }), { headers: cors, status: 400 });

        const GROQ_KEY = (env.GROQ_API_KEY || "").trim();
        if (!GROQ_KEY) return new Response(JSON.stringify({ ok: false, reply: "GROQ_API_KEY belum di-set di Cloudflare" }), { headers: cors, status: 500 });

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
              return new Response(JSON.stringify({ ok: true, reply: d.choices[0].message.content, model }), { headers: cors });
            }
          } catch (e) { continue; }
        }
        return new Response(JSON.stringify({ ok: false, reply: "Groq gagal semua model" }), { headers: cors, status: 500 });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reply: e.message }), { headers: cors, status: 500 });
      }
    }

    // --- /api/t2i UDAH GUE HAPUS, BOS. BIAR GAK ERROR LAGI ---
    if (p === "/api/t2i") {
      return new Response(JSON.stringify({ ok: false, error: "Fitur gambar AI (Krea) udah dihapus Bos. Gambar sekarang manual by Admin." }), { headers: cors });
    }

    return null;
  }
};

export const TULIS_API = AI_API;
export const FOTO_API = AI_API;
export const VIDEO_API = AI_API;
export const AKUN_API = AI_API;
export default AI_API;
