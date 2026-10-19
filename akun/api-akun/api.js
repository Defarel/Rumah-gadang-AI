export const AKUN_API = {
  async handle(req, env, url, cors) {
    const h = { "Content-Type": "application/json", ...cors };
    const path = url.pathname;

    try {
      // -------------------------------------------------------------
      // 1. REGISTER / SIMPAN AKUN BARU
      // -------------------------------------------------------------
      if (path === "/api/akun/register" && req.method === "POST") {
        let { email, name, picture, password } = await req.json();
        
        let cleanEmail = (email || "").toLowerCase().trim();
        let cleanName = name || "Dunsanak";
        let cleanPic = picture || "https://i.ibb.co/r2gL8YJB/1791014451654.jpg";

        if (!cleanEmail) {
          return new Response(JSON.stringify({ ok: false, error: "Email wajib diisi!" }), { headers: h, status: 400 });
        }

        // Simpan atau update jika email sudah ada (UPSERT)
        await env.DB.prepare(`
          INSERT INTO users (email, name, picture, password, time) 
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            name = excluded.name,
            picture = COALESCE(NULLIF(excluded.picture, ''), users.picture)
        `).bind(cleanEmail, cleanName, cleanPic, password || "", Date.now()).run();

        return new Response(JSON.stringify({ ok: true, message: "Berhasil daftar" }), { headers: h });
      }

      // -------------------------------------------------------------
      // 2. LOGIN USER
      // -------------------------------------------------------------
      if (path === "/api/akun/login" && req.method === "POST") {
        let { email, password } = await req.json();
        let cleanEmail = (email || "").toLowerCase().trim();

        let user = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email = ?"
        ).bind(cleanEmail).first();

        if (!user) {
          // Jika belum ada di DB, buatkan otomatis (Auto-register sederhana)
          let defaultName = cleanEmail.split('@')[0] || "Dunsanak";
          let defaultPic = "https://i.ibb.co/r2gL8YJB/1791014451654.jpg";

          await env.DB.prepare(
            "INSERT INTO users (email, name, picture, password, time) VALUES (?, ?, ?, ?, ?)"
          ).bind(cleanEmail, defaultName, defaultPic, password || "", Date.now()).run();

          return new Response(JSON.stringify({ 
            ok: true, 
            user: { email: cleanEmail, name: defaultName, picture: defaultPic } 
          }), { headers: h });
        }

        return new Response(JSON.stringify({ ok: true, user }), { headers: h });
      }

      // -------------------------------------------------------------
      // 3. DAFTAR SELURUH PENGGUNA (UNTUK TAB TEMAN)
      // -------------------------------------------------------------
      if (path === "/api/akun/list" && req.method === "GET") {
        let r = await env.DB.prepare(
          "SELECT email, name, picture FROM users ORDER BY time DESC LIMIT 100"
        ).all();

        return new Response(JSON.stringify(r.results || []), { headers: h });
      }

      // -------------------------------------------------------------
      // 4. AMBIL DETAIL PROFIL & STATISTIK (POST, FOLLOWER, FOLLOWING)
      // -------------------------------------------------------------
      if (path === "/api/akun/profile" && req.method === "GET") {
        let targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        let myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();

        if (!targetEmail) {
          return new Response(JSON.stringify({ ok: false, error: "Email target tidak ada" }), { headers: h, status: 400 });
        }

        // Ambil Data Pengguna
        let user = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email = ?"
        ).bind(targetEmail).first();

        // Hitung Jumlah Postingan dari tabel 'tulis'
        let postCount = 0;
        try {
          let p = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM tulis WHERE LOWER(email) = ?"
          ).bind(targetEmail).first();
          postCount = p?.c || 0;
        } catch (e) {}

        // Hitung Jumlah Follower & Following
        let followersCount = 0;
        let followingCount = 0;
        let isFollowing = false;

        try {
          let f1 = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM follows WHERE LOWER(following_email) = ?"
          ).bind(targetEmail).first();
          followersCount = f1?.c || 0;

          let f2 = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM follows WHERE LOWER(follower_email) = ?"
          ).bind(targetEmail).first();
          followingCount = f2?.c || 0;

          if (myEmail) {
            let isF = await env.DB.prepare(
              "SELECT id FROM follows WHERE LOWER(follower_email) = ? AND LOWER(following_email) = ?"
            ).bind(myEmail, targetEmail).first();
            isFollowing = !!isF;
          }
        } catch (e) {}

        return new Response(JSON.stringify({
          email: targetEmail,
          name: user?.name || targetEmail.split('@')[0] || "Dunsanak",
          picture: user?.picture || "https://i.ibb.co/r2gL8YJB/1791014451654.jpg",
          posts: postCount,
          followers: followersCount,
          following: followingCount,
          isFollowing: isFollowing
        }), { headers: h });
      }

      // -------------------------------------------------------------
      // 5. API FOLLOW / UNFOLLOW
      // -------------------------------------------------------------
      if (path === "/api/follow" && req.method === "POST") {
        let { follower, following } = await req.json();
        let cleanFollower = (follower || "").toLowerCase().trim();
        let cleanFollowing = (following || "").toLowerCase().trim();

        if (!cleanFollower || !cleanFollowing || cleanFollower === cleanFollowing) {
          return new Response(JSON.stringify({ ok: false, error: "Follow tidak valid" }), { headers: h, status: 400 });
        }

        // Cek apakah sudah follow
        let existing = await env.DB.prepare(
          "SELECT id FROM follows WHERE LOWER(follower_email) = ? AND LOWER(following_email) = ?"
        ).bind(cleanFollower, cleanFollowing).first();

        if (existing) {
          // Unfollow
          await env.DB.prepare(
            "DELETE FROM follows WHERE LOWER(follower_email) = ? AND LOWER(following_email) = ?"
          ).bind(cleanFollower, cleanFollowing).run();
          return new Response(JSON.stringify({ ok: true, status: "unfollowed" }), { headers: h });
        } else {
          // Follow
          await env.DB.prepare(
            "INSERT INTO follows (follower_email, following_email, time) VALUES (?, ?, ?)"
          ).bind(cleanFollower, cleanFollowing, Date.now()).run();
          return new Response(JSON.stringify({ ok: true, status: "followed" }), { headers: h });
        }
      
      // --- 6. API UPDATE PROFIL ---
if (path === "/api/akun/update" && req.method === "POST") {
  let { email, name, picture } = await req.json();
  let cleanEmail = (email || "").toLowerCase().trim();

  if (!cleanEmail) {
    return new Response(JSON.stringify({ ok: false, error: "Email tidak valid" }), { headers: h, status: 400 });
  }
}
  // Update tabel users di database D1
  await env.DB.prepare(
    "UPDATE users SET name = COALESCE(?, name), picture = COALESCE(?, picture) WHERE LOWER(email) = ?"
  ).bind(name || null, picture || null, cleanEmail).run();

  return new Response(JSON.stringify({ ok: true }), { headers: h });
}

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }

    return null; // Abaikan jika rute tidak cocok
  }
};
