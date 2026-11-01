export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    
    if (url.pathname === "/api/ai" && req.method === "POST") {
      try {
        let body = await req.json();
        let prompt = (body.prompt || "").trim();
        if (!prompt) return new Response(JSON.stringify({ error: "Prompt kosong Bos" }), { headers: cors });
        
        // Membaca kunci dari variabel rahasia API_T2I di Cloudflare
        let API_KEY = env.API_T2I || "";
        if (!API_KEY) {
          return new Response(JSON.stringify({ 
            reply: "Bos API_T2I belum di-set atau kosong di Cloudflare Dashboard Bos!" 
          }), { headers: cors });
        }

        // Request langsung ke endpoint API Text-to-Image (contoh Glia Labs)
        let r = await fetch("https://api.glianalabs.com/v1/infer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
          },
          body: JSON.stringify({
            model: "krea/krea-2-medium-turbo",
            prompt: prompt
          })
        });

        let d = await r.json();

        if (r.status === 402) {
          return new Response(JSON.stringify({ reply: "Tantangan pembayaran (402) terdeteksi. Silakan lakukan pembayaran/isi saldo API T2I Bos." }), { headers: cors });
        }

        if (d.error) {
          return new Response(JSON.stringify({ reply: "Error T2I Bos: " + (d.error.message || JSON.stringify(d.error)) }), { headers: cors });
        }

        // Mengambil URL hasil gambar dari respons API
        let imageUrl = d.image_url || d.output || d.url || d.choices?.[0]?.url;
        
        if (imageUrl) {
          // Format markdown gambar agar langsung tampil di gelembung chat website Anda
          return new Response(JSON.stringify({ reply: `![${prompt}](${imageUrl})` }), { 
            headers: { ...cors, "Content-Type": "application/json" } 
          });
        }

        return new Response(JSON.stringify({ reply: "Gagal memproses gambar, format respons API tidak dikenali Bos." }), { headers: cors });

      } catch (e) {
        return new Response(JSON.stringify({ error: "Server error Bos: " + e.message }), { headers: cors });
      }
    }
    return null;
  }
};
