// KUNCI 1: TULIS API - FULL FITUR AUTO-AVATAR & AUTO-EMAIL (RAPI)
export const TULIS_API = {
  async handle(req, env, url, cors) {
    const h = { "Content-Type": "application/json", ...cors };
    
    try {
      // 0. INIT DB
      if (env.DB) {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS tulis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT, 
            email TEXT, 
            name TEXT, 
            picture TEXT, 
            tulisImg TEXT, 
            time INTEGER, 
            likes INTEGER DEFAULT 0
          )
        `).run();

        const newCols = [
          "user_email TEXT", "judul TEXT", "isi TEXT",
          "img TEXT", "image TEXT", "url TEXT",
          "created_at INTEGER", "nama TEXT", "avatar TEXT"
        ];
        for (const c of newCols) {
          try { await env.DB.prepare(`ALTER TABLE tulis ADD COLUMN ${c}`).run(); } catch {}
        }
      }

      // 1. GET /api/tulis - AMBIL FEED + ENRICH AVATAR TERBARU
      if (url.pathname === "/api/tulis" && req.method === "GET") {
        const r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 100").all();
        const list = r.results || [];

        // Ambil foto profil terbaru dari tabel users / rg_users
        for (const x of list) {
          const email = (x.user_email || x.email || "").toLowerCase().trim();
          if (!email) continue;
          try {
            let u = await env.DB.prepare("SELECT picture FROM users WHERE LOWER(email)=? LIMIT 1").bind(email).first();
            if (!u) u = await env.DB.prepare("SELECT picture FROM rg_users WHERE LOWER(email)=? LIMIT 1").bind(email).first();
            if (u?.picture && u.picture.length > 10) {
              x.picture = u.picture;
              x.avatar = u.picture;
            }
          } catch {}
        }
        return new Response(JSON.stringify(list), { headers: h });
      }

      // 2. POST /api/tulis/add - KIRIM POSTINGAN
      if ((url.pathname === "/api/tulis" || url.pathname === "/api/tulis/add") && req.method === "POST") {
        const j = await req.json().catch(() => ({}));
        const list = Array.isArray(j) ? j : [j];

        for (const x of list) {
          // Normalisasi Email
          let raw = (x.email || x.user_email || "").trim();
          let email = !raw ? "anon@rumahgadang-ai.my.id" 
            : raw.includes("@") ? raw.toLowerCase() 
            : raw.toLowerCase() + "@rumahgadang-ai.my.id";

          const name = x.name || x.nama || email.split('@')[0] || "Dunsanak";
          const text = x.text || x.isi || x.judul || "";
          let img = x.tulisImg || x.img || x.image || x.url || "";
          let pic = x.picture || x.avatar || "";
          const now = Date.now();

          if (!text && !img) continue;

          // Cari foto profil terbaru jika tidak ada di payload
          if (!pic || pic.includes("icon.png")) {
            try {
              let u = await env.DB.prepare("SELECT picture FROM users WHERE LOWER(email)=?").bind(email).first();
              if (!u) u = await env.DB.prepare("SELECT picture FROM rg_users WHERE LOWER(email)=?").bind(email).first();
              if (u?.picture) pic = u.picture;
            } catch {}
          }
          if (!pic) pic = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

          await env.DB.prepare(`
            INSERT INTO tulis (judul, isi, text, email, user_email, name, nama, picture, avatar, tulisImg, img, image, url, time, created_at, likes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
          `).bind(
            text.slice(0, 50), text, text,
            email, email, name, name, pic, pic,
            img, img, img, img, now, now
          ).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 3. POST /api/tulis/delete - HAPUS
      if (url.pathname === "/api/tulis/delete" && req.method === "POST") {
        const j = await req.json().catch(() => ({}));
        if (j.id) await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run();
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
    return null;
  }
};

export const handle = TULIS_API.handle;
export default TULIS_API;
