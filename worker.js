export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization"
    };
    if (req.method === "OPTIONS") return new Response("", { headers: cors });

    // --- INIT DB BOS BIAR FOTO GAK HILANG BOS ---
    try {
      if (env.DB) {
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, nama TEXT, pesan TEXT, waktu TEXT)`).run();
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS foto (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, caption TEXT, waktu TEXT)`).run();
      }
    } catch (e) {}

    // --- API TULIS BOS ---
    if (url.pathname === "/api/tulis") {
      if (req.method === "GET") {
        try {
          const { results } = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 50").all();
          return new Response(JSON.stringify(results || []), { headers: { ...cors, "Content-Type": "application/json" } });
        } catch (e) { return new Response(JSON.stringify([]), { headers: { ...cors, "Content-Type": "application/json" } }); }
      }
      if (req.method === "POST") {
        const b = await req.json();
        await env.DB.prepare("INSERT INTO tulis (nama,pesan,waktu) VALUES (?,?,?)").bind(b.nama || "Anonim", b.pesan, new Date().toISOString()).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    // --- API FOTO BOS ---
    if (url.pathname === "/api/foto") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM foto ORDER BY id DESC LIMIT 100").all();
        if (!results || results.length === 0) {
           // KASIH DATA DUMMY BOS BIAR GAK KOSONG BOS
           return new Response(JSON.stringify([
             { url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500", caption: "Rumah Gadang Minang - CFD Padang" },
             { url: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=500", caption: "Kantor Adat Padang" }
           ]), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify(results), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify([]), { headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    // --- API AI BOS FIX 2026 BOS ---
    if (url.pathname === "/api/ai" && req.method === "POST") {
      try {
        const GROQ = env.GROQ_API_KEY || env.GROQ;
        if (!GROQ) return new Response(JSON.stringify({ reply: "GROQ_API_KEY belum dipasang Bos di Variables Bos!" }), { headers: { ...cors, "Content-Type": "application/json" } });
        
        const { prompt } = await req.json();
        const MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"]; // MODEL BARU 2026 BOS YANG MASIH HIDUP BOS
        
        for (let model of MODELS) {
          try {
            let r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Authorization": "Bearer " + GROQ, "Content-Type": "application/json" },
              body: JSON.stringify({
                model: model,
                messages: [
                  { role: "system", content: "KAMU: Rumah Gadang AI, asisten adat Minang dari Padang, ramah, pakai bahasa Minang campur Indonesia, singkat, lucu, jawab tentang Rumah Gadang." },
                  { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 600
              })
            });
            let d = await r.json();
            if (d.choices?.[0]?.message?.content) {
              return new Response(JSON.stringify({ reply: d.choices[0].message.content }), { headers: { ...cors, "Content-Type": "application/json" } });
            }
            if (d.error) { console.log(d.error); continue; }
          } catch (e) { continue; }
        }
        return new Response(JSON.stringify({ reply: "Error GROQ Bos semua model gagal Bos, cek key Bos!" }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ reply: "Error: " + e.message }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    // --- HTML BOS TAMPILAN HIJAU KAYAK FOTO 4 BOS ---
    const BG_IMG = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangAI1.jpg";
    const AUDIO_URL = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangV1.m4a";

    const HOME_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <script src="https://cdn.tailwindcss.com"></script><style>body{background:#0a0a0a;color:#fff}.card{border:1px solid #22c55e22;background:#111;border-radius:16px}</
