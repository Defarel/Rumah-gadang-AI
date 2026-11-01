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
        
        // Mengambil kunci dari variabel rahasia API_T2I di Cloudflare Dashboard Anda
        let API_KEY = env.API_T2I || "";
        if (!API_KEY) {
          return new Response(JSON.stringify({ 
            reply: "Bos API_T2I belum di-set di Cloudflare Dashboard Bos! Buka Workers & Pages > Settings > Variables lalu isi API_T2I Bos!" 
          }), { headers: cors });
        }

        // Melakukan request ke API Text-to-Image (Contoh: Glia Labs / Krea)
        let r = await fetch("https://api.glianalabs.com/v1/infer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY // Sesuaikan header auth jika menggunakan format token/bearer lain
          },
          body: JSON.stringify({
            model: body.model || "krea/krea-2-medium-turbo",
            prompt: prompt
          })
        });

        let d = await r.json();
        
        // Tangani jika ada tantangan pembayaran 402 atau error dari API T2I
        if (r.status === 402) {
          return new Response(JSON.stringify({ reply: "Tantangan pembayaran (402) terdeteksi. Harap lakukan pembayaran atau isi saldo API T2I Bos." }), { headers: cors });
        }

        if (d.error) {
          return new Response(JSON.stringify({ reply: "Error T2I Bos: " + (d.error.message || JSON.stringify(d.error)) }), { headers: cors });
        }

        // Sesuaikan struktur respons gambar tergantung dari JSON yang dikembalikan oleh API T2I
        // Biasanya berupa URL gambar atau base64
        let imageUrl = d.image_url || d.output || d.url || d.choices?.[0]?.url;
        
        if (imageUrl) {
          // Kirim kembali dalam format Markdown atau HTML gambar agar langsung tampil di UI
          return new Response(JSON.stringify({ reply: `![${prompt}](${imageUrl})` }), { 
            headers: { ...cors, "Content-Type": "application/json" } 
          });
        }

        return new Response(JSON.stringify({ reply: "Gagal membuat gambar, respons API tidak valid Bos." }), { headers: cors });

      } catch (e) {
        return new Response(JSON.stringify({ error: "Server error Bos: " + e.message }), { headers: cors });
      }
    }
    return null;
  }
};
