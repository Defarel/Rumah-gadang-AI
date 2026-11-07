// file: ./ai/api-ai/api.js
// RUMAH GADANG AI - FINAL API
// TEXT: Groq | IMAGE: Cloudflare Workers AI Krea-2-Medium-Turbo

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
        IMAGE: "CF KREA-2-MEDIUM-TURBO: " + !!env.AI,
        ACCOUNT_ID: "1514daaae495b0bbba4318972c2e53a7",
        endpoints: ["/api/ai (POST prompt)", "/api/t2i (POST prompt, model, aspect_ratio, resolution)"]
      }), { headers: cors });
    }

    // --- 1. API AI TEXT (Groq) - GAK GUE UBAH ---
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

    // --- 2. API T2I IMAGE (Cloudflare Krea-2-Medium-Turbo) - INI YANG BARU ---
    if (p === "/api/t2i" && req.method === "POST") {
      try {
        let { prompt, model, aspect_ratio, resolution } = await req.json().catch(() => ({}));
        prompt = (prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ ok: false, error: "Prompt kosong" }), { headers: cors, status: 400 });

        // Samain nama model lama lu biar gak error di frontend
        // Kalau frontend kirim "krea/Krea-2-Turbo", kita arahkan ke model CF
        const CF_MODEL = "krea/krea-2-medium-turbo";

        // Cek env.AI udah nyambung belum (dari wrangler.toml [ai] binding = "AI")
        if (!env.AI) {
          return new Response(JSON.stringify({ ok: false, error: "env.AI belum nyambung. Cek wrangler.toml: [ai] binding = 'AI'" }), { headers: cors, status: 500 });
        }

        // PANGGIL CF KREA 2 - PAKE ID 1514daaae495b0bbba4318972c2e53a7 (otomatis dari binding)
        const result = await env.AI.run(CF_MODEL, {
          prompt: prompt,
          aspect_ratio: aspect_ratio || "1:1",
          resolution: resolution || "1K",
        });

        // CF balikin gambar dalam bentuk stream / binary
        // Kita ubah jadi base64 biar frontend lu yang lama langsung bisa pake
        let buf;
        if (result instanceof ReadableStream) {
          buf = await new Response(result).arrayBuffer();
        } else if (result?.image) {
          // Kalau CF balikin JSON { image: "base64..." }
          const binary = Uint8Array.from(atob(result.image), c => c.charCodeAt(0));
          buf = binary.buffer;
        } else if (result instanceof ArrayBuffer) {
          buf = result;
        } else {
          // Fallback terakhir: anggap result udah Uint8Array
          buf = await new Response(result).arrayBuffer();
        }

        const bytes = new Uint8Array(buf);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const b64 = btoa(binary);
        const dataUrl = `data:image/jpeg;base64,${b64}`;

        return new Response(JSON.stringify({
          ok: true,
          prompt,
          model: CF_MODEL,
          image: dataUrl,
          token_terpakai: 2
        }), { headers: cors });

      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message, hint: "Cek di CF Dashboard > Workers AI > Krea-2 udah aktif belum, dan kredit lu masih ada gak" }), { headers: cors, status: 500 });
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
