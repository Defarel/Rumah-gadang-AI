// ai/api-ai/api.js - Rumah Gadang AI
// T2T = GROQ_API_KEY, T2I = API_T2I

export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const path = url.pathname.toLowerCase();

    // TEST DARI HP
    if (req.method === "GET" && (path === "/api/ai" || path === "/api/t2i")) {
      return new Response(JSON.stringify({
        ok: true,
        TEXT: "POST /api/ai {prompt} pakai GROQ_API_KEY",
        IMAGE: "POST /api/t2i {prompt} pakai API_T2I",
        has_GROQ: !!env.GROQ_API_KEY,
        has_T2I: !!env.API_T2I
      }), { headers: cors });
    }

    // === TEXT TO TEXT - GROQ - /api/ai ===
    if (path === "/api/ai" && req.method === "POST") {
      try {
        let body = await req.json();
        let prompt = (body.prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ error: "Prompt kosong Bos" }), { headers: cors });

        let GROQ_KEY = (env.GROQ_API_KEY || env.GROQ_KEY || "").trim();
        if (!GROQ_KEY) {
          return new Response(JSON.stringify({ reply: "GROQ_API_KEY belum di-set Bos! Buka Cloudflare Dashboard > Settings > Variables > GROQ_API_KEY" }), { headers: cors, status: 500 });
        }

        const MODELS = [
          "openai/gpt-oss-120b",
          "openai/gpt-oss-20b",
          "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant"
        ];

        for (let model of MODELS) {
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
            if (d.error) continue;
            let content = d.choices?.[0]?.message?.content;
            if (content) return new Response(JSON.stringify({ reply: content, model }), { headers: cors });
          } catch { continue; }
        }
        return new Response(JSON.stringify({ reply: "Semua model Groq gagal Bos" }), { headers: cors, status: 500 });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { headers: cors, status: 500 });
      }
    }

    // === TEXT TO IMAGE - API_T2I - /api/t2i ===
    if ((path === "/api/t2i" || path === "/api/image" || path === "/api/gambar") && req.method === "POST") {
      try {
        let body = await req.json();
        let prompt = (body.prompt || "").trim();
        let model = body.model || "krea/krea-2-medium-turbo";
        if (!prompt) return new Response(JSON.stringify({ error: "Prompt gambar kosong" }), { headers: cors, status: 400 });

        let T2I_KEY = (env.API_T2I || "").trim();
        if (!T2I_KEY) {
          return new Response(JSON.stringify({ reply: "API_T2I belum di-set Bos! Set di Cloudflare Dashboard > Rahasia > API_T2I" }), { headers: cors, status: 500 });
        }

        let r = await fetch("https://api.glianalabs.com/v1/infer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + T2I_KEY
          },
          body: JSON.stringify({ model, prompt })
        });

        if (r.status === 402) {
          let pay = await r.text();
          return new Response(JSON.stringify({
            ok: false,
            need_payment: true,
            raw: pay.slice(0,500),
            info: "Glia minta bayar mppx. Jalankan: npx mppx account create, lalu npx mppx https://api.glianalabs.com/v1/infer"
          }), { headers: cors, status: 402 });
        }

        let d = await r.json();
        let imageUrl = d.image_url || d.url || d.output || d.image || d.data?.[0]?.url;

        return new Response(JSON.stringify({
          ok: true,
          prompt,
          model,
          image: imageUrl || null,
          raw: d
        }), { headers: cors });

      } catch (e) {
        return new Response(JSON.stringify({ error: "T2I error: " + e.message }), { headers: cors, status: 500 });
      }
    }

    return null;
  }
};

export default AI_API;
