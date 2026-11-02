// file: ./ai/api-ai/api.js
// RUMAH GADANG AI - FINAL API
// TEXT: Groq | IMAGE: Hugging Face Krea 2

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
    if (req.method === "GET" && (p === "/api/ai" || p === "/api/t2i")) {
      return new Response(JSON.stringify({
        ok: true,
        service: "Rumah Gadang AI",
        TEXT: "GROQ_API_KEY: " + !!env.GROQ_API_KEY,
        IMAGE: "HF KREA 2 (API_T2I): " + !!env.API_T2I,
        endpoints: ["/api/ai (POST prompt)", "/api/t2i (POST prompt, model)"]
      }), { headers: cors });
    }

    // --- 1. API AI TEXT (Groq) ---
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

    // --- 2. API T2I IMAGE (Hugging Face Krea 2) ---
    if (p === "/api/t2i" && req.method === "POST") {
      try {
        let { prompt, model } = await req.json().catch(() => ({}));
        model = (model || "krea/Krea-2-Turbo").trim(); // default turbo
        prompt = (prompt || "").trim();

        const HF_TOKEN = (env.API_T2I || "").trim();
        if (!HF_TOKEN) return new Response(JSON.stringify({ ok: false, error: "API_T2I (HF Token hf_...) belum set" }), { headers: cors, status: 500 });
        if (!prompt) return new Response(JSON.stringify({ ok: false, error: "Prompt kosong" }), { headers: cors, status: 400 });

const HF_URL = `https://router.huggingface.co/fal-ai/${model}`;
        
        let r = await fetch(HF_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt })
        });

        const ct = r.headers.get("content-type") || "";

        // HF biasanya ngasih gambar binary langsung
        if (ct.startsWith("image/") || ct === "application/octet-stream") {
          let buf = await r.arrayBuffer();
          let bytes = new Uint8Array(buf);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          let b64 = btoa(binary);
          let dataUrl = `data:${ct || "image/png"};base64,${b64}`;
          return new Response(JSON.stringify({ ok: true, prompt, model, image: dataUrl }), { headers: cors });
        }

        let text = await r.text();
        let d; try { d = JSON.parse(text); } catch { d = { raw: text }; }

        if (d.error) {
          return new Response(JSON.stringify({
            ok: false,
            error: d.error,
            hint: "Buka huggingface.co/krea/Krea-2-Turbo > klik Agree license, dan pastikan token ada izin 'Inference Providers'",
            raw: d
          }), { headers: cors, status: 500 });
        }

        return new Response(JSON.stringify({ ok: false, error: "HF tidak mengembalikan gambar", raw: d }), { headers: cors, status: 500 });

      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: cors, status: 500 });
      }
    }

    return null; // biar di-handle router utama
  }
};

// biar kompatibel sama getApi() di index.js kamu
export const TULIS_API = AI_API;
export const FOTO_API = AI_API;
export const VIDEO_API = AI_API;
export const AKUN_API = AI_API;
export default AI_API;
