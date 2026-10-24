// KUNCI 1: TULIS API - FULL FITUR AUTO-AVATAR & AUTO-EMAIL
export const TULIS_API = {
  async handle(req, env, url, cors) {
    const h = { "Content-Type": "application/json", ...cors };
    try {
      if (env.DB) {
        // 1. BUAT TABEL DENGAN STRUKTUR DASAR JIKA BELUM ADA
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

        // 2. AMAN DARI ERROR: TAMBAH SELURUH KOLOM TAMBAHAN TANPA MENGHAPUS DATA LAMA
        let newCols = [
          "email TEXT",
          "user_email TEXT",
          "judul TEXT",
          "isi TEXT",
          "img TEXT",
          "image TEXT",
          "url TEXT",
          "created_at INTEGER",
          "name TEXT",
          "nama TEXT",
          "picture TEXT",
          "avatar TEXT",
          "tulisImg TEXT",
          "text TEXT",
          "time INTEGER",
          "likes INTEGER DEFAULT 0"
        ];
        for (let c of newCols) {
          try { await env.DB.prepare(`ALTER TABLE tulis ADD COLUMN ${c}`).run(); } catch (e) {}
        }
      }

      // -------------------------------------------------------------
      // 1. GET /api/tulis (AMBIL FEED POSTINGAN)
      // -------------------------------------------------------------
      if (url.pathname === "/api/tulis" && req.method === "GET") {
        let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 100").all();
        return new Response(JSON.stringify(r.results || []), { headers: h });
      }

      // -------------------------------------------------------------
      // 2. POST /api/tulis & /api/tulis/add (KIRIM POSTINGAN)
      // -------------------------------------------------------------
      if ((url.pathname === "/api/tulis" || url.pathname === "/api/tulis/add") && req.method === "POST") {
        let j = await req.json().catch(() => ({}));
        let list = Array.isArray(j) ? j : [j];

        for (let x of list) {
          // Normalisasi Email & Domain
          let raw = (x.email || x.user_email || "").trim();
          let email = "";
          if (!raw) { 
            email = "anon@rumahgadang-ai.my.id"; 
          } else if (raw.includes("@")) { 
            email = raw.toLowerCase(); 
          } else { 
            email = raw.toLowerCase() + "@rumahgadang-ai.my.id"; 
          }

          let name = x.name || x.nama || email.split('@')[0] || "Dunsanak";
          let text = x.text || x.isi || x.judul || "";
          let img = x.tulisImg || x.img || x.image || x.url || "";
          let pic = x.picture || x.avatar || "";
          let now = Date.now();

          if (!text && !img) continue;

          // CARI FOTO PROFIL TERBARU DARI DB JIKA TIDAK ADA DI PAYLOAD (ATAU MASIH DEFAULT ICON)
          if (!pic || pic === "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png") {
            try {
              // Cek tabel users dulu
              let u1 = await env.DB.prepare("SELECT picture FROM users WHERE LOWER(email)=?").bind(email).first();
              if (u1 && u1.picture) {
                pic = u1.picture;
              } else {
                // Jika tidak ada, cek tabel rg_users
                let u2 = await env.DB.prepare("SELECT picture FROM rg_users WHERE LOWER(email)=?").bind(email).first();
                if (u2 && u2.picture) pic = u2.picture;
              }
            } catch (e) {}
          }

          // Fallback terakhir jika memang belum pasang foto profil
          if (!pic) pic = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

          // Simpan ke database mengisi seluruh kemungkinan nama kolom
          await env.DB.prepare(`
            INSERT INTO tulis (
              judul, isi, text, 
              email, user_email, 
              name, nama, 
              picture, avatar, 
              tulisImg, img, image, url, 
              time, created_at, likes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
          `).bind(
            text.slice(0, 50), text, text,
            email, email,
            name, name,
            pic, pic,
            img, img, img, img,
            now, now
          ).run();
        }

        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // -------------------------------------------------------------
      // 3. POST /api/tulis/delete (HAPUS POSTINGAN)
      // -------------------------------------------------------------
      if (url.pathname === "/api/tulis/delete" && req.method === "POST") {
        let j = await req.json().catch(() => ({}));
        if (j.id) { 
          await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run(); 
        }
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
