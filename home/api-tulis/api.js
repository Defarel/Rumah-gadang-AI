export const TULIS_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
    const path = url.pathname;

    // BOS! BUAT TABEL BOS!
    try {
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulisan (
        id TEXT PRIMARY KEY,
        email TEXT,
        isi TEXT,
        picture TEXT,
        created_at INTEGER
      )`).run();
    } catch(e){}

    // BOS! KIRIM TULISAN BOS - INI YANG BENAR BOS!
    if (path === "/api/tulis" && req.method === "POST") {
      try {
        let body = await req.json();
        let isi = body.isi || body.judul || "";
        let email = (body.email || "sp.fc@rumahgadang-ai.my.id").toLowerCase();
        let picture = body.picture || "";
        
        if (!isi && !picture) {
          return new Response(JSON.stringify({ok:false, error:"Tulisan kosong Bos!"}), {headers:cors});
        }

        let id = Date.now().toString() + Math.random().toString(36).slice(2,6);
        await env.DB.prepare(
          "INSERT INTO tulisan (id, email, isi, picture, created_at) VALUES (?,?,?,?,?)"
        ).bind(id, email, isi, picture, Date.now()).run();

        return new Response(JSON.stringify({ok:true, id}), {headers:cors});
      } catch(e) {
        return new Response(JSON.stringify({ok:false, error:e.message}), {headers:cors, status:500});
      }
    }

    // BOS! AMBIL TULISAN BOS!
    if (path === "/api/tulis" && req.method === "GET" || path === "/api/tulisan") {
      try {
        let r = await env.DB.prepare("SELECT * FROM tulisan ORDER BY created_at DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results || []), {headers:cors});
      } catch(e){
        return new Response(JSON.stringify([]), {headers:cors});
      }
    }

    return null;
  }
}
