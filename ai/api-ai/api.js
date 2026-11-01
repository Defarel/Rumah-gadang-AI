export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    // === TAMBAHAN BIAR BISA TEST DARI HP ===
    if (url.pathname === "/api/ai" && req.method === "GET") {
      return new Response(JSON.stringify({
        ok: true,
        aktif: true,
        hasKey: !!(env.API_T2I || env.GROQ_API_KEY),
        model_utama: "openai/gpt-oss-120b - sesuai screenshot Groq kamu $0,00",
        test: "POST {prompt:'halo sanak'}"
      }), { headers: cors });
    }
    
    if (url.pathname === "/api/ai" && req.method === "POST") {
      try {
        let body = await req.json();
        let prompt = (body.prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ error: "Prompt kosong Bos" }), { headers: cors, status:400 });
        
        let API_KEY = (env.API_T2I || env.GROQ_API_KEY || env.GROQ_KEY || "").toString().trim();
        if (!API_KEY) {
          return new Response(JSON.stringify({ 
            reply: "Bos API_T2I belum di-set! Lihat screenshot kamu udah ada API_T2I di Rahasia, tinggal Redeploy Bos!" 
          }), { headers: cors, status:500 });
        }

        // MODEL LIST FINAL - sesuai screenshot kamu yang udah kepake
        const MODELS = [
          "openai/gpt-oss-120b", // INI YANG DI SCREENSHOT KAMU JALAN
          "openai/gpt-oss-20b", 
          "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant",
          "qwen/qwen3-32b",
          "gemma2-9b-it"
        ];

        for (let model of MODELS) {
          try {
            let r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
              },
              body: JSON.stringify({
                model: model,
                messages: [
                  { role: "system", content: "KAMU: Rumah Gadang AI, dibuat Tim Rumah Gadang AI Padang. Gaya: Santai, ramah Minang, singkat padat max 50 kata, jawab langsung inti, jangan tabel, sopan." },
                  { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 300
              })
            });
            let d = await r.json();
            if (d.error) {
              console.log("Groq error " + model + ":", d.error.message);
              continue;
            }
            let content = d.choices?.[0]?.message?.content;
            if (content) {
              return new Response(JSON.stringify({ reply: content, model: model }), { 
                headers: { ...cors, "Content-Type": "application/json" } 
              });
            }
          } catch (e) { 
            console.log("fetch fail " + model, e); 
            continue; 
          }
        }
        return new Response(JSON.stringify({ reply: "Error AI Bos semua model gagal, cek API_T2I di console.groq.com masih valid gak!" }), { headers: cors, status:500 });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Server error Bos: " + e.message }), { headers: cors, status:500 });
      }
    }
    return null;
  }
};

export default AI_API;
export const GROQ_API = AI_API;
