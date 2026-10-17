import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Biar foto .jpg dan musik .m4a bisa kebaca
    if (path.match(/\.(jpg|jpeg|png|webp|m4a|mp3|mp4|css|js|ico|svg)$/i)) {
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }
    }

    // API AI - Kunci aman di env, bukan di kode Bos
    if (path === '/api/ai') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', {status:405});
      try {
        const { prompt } = await request.json();
        const GROQ_KEY = env.GROQ_API_KEY; // AMAN BOS, TIDAK HARDCODE
        if (!GROQ_KEY) return new Response(JSON.stringify({reply:"GROQ_API_KEY belum di-set di Cloudflare Bos"}), {headers:{'Content-Type':'application/json'}});
        
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {role:"system", content:"Kamu adalah Rumah Gadang AI, asisten adat Minang yang ramah, pakai bahasa Indonesia campur Minang."},
              {role:"user", content: prompt}
            ]
          })
        });
        const j = await r.json();
        const reply = j.choices?.[0]?.message?.content || "Maaf Bos, AI lagi istirahat";
        return new Response(JSON.stringify({reply}), {headers:{'Content-Type':'application/json'}});
      } catch(e){
        return new Response(JSON.stringify({reply:"Error koneksi Bos: "+e.message}), {headers:{'Content-Type':'application/json'}});
      }
    }

    // Halaman AI
    if (path === '/ai' || path.startsWith('/ai/') && !path.includes('.')) {
     
