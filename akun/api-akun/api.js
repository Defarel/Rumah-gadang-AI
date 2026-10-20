export const AKUN_API = {
  async handle(req, env, url, corsHeaders) {
    const h = { "Content-Type": "application/json", ...corsHeaders };
    const path = url.pathname;
    const method = req.method;

    try {
      // REGISTER / LOGIN
      if (path === "/api/akun/register" && method === "POST") {
        const { email, name, picture } = await req.json();
        const cleanEmail = (email || "").toLowerCase().trim();
        if (!cleanEmail) return new Response(JSON.stringify({ ok: false, error: "email kosong" }), { headers: h, status: 400 });
        
        const finalName = name || cleanEmail.split('@')[0];
        const finalPic = picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
        
        await env.DB.prepare(
          `INSERT INTO users (email, name, picture, time) VALUES (?,?,?,?) 
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=COALESCE(NULLIF(excluded.picture,''),users.picture), time=excluded.time`
        ).bind(cleanEmail, finalName, finalPic, Date.now()).run();
        
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // LIST SEMUA AKUN @rumahgadang-ai.my.id
      if (path === "/api/akun/list" && method === "GET") {
        const result = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email LIKE '%@rumahgadang-ai.my.id' ORDER BY time DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }

      // PROFILE - INI YANG BIKIN 0 0 0 DI VIDEO LU BOS
      if (path === "/api/akun/profile" && method === "GET") {
        const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
        if (!targetEmail) return new Response(JSON.stringify({ ok: false }), { headers: h, status: 400 });

        const user = await env.DB.prepare("SELECT email, name, picture FROM users WHERE email = ?").bind(targetEmail).first();

        // HITUNG TULISAN - FIX BIAR GAK 0 LAGI BOS, CEK 2 KOLOM
        let postCount = 0;
        try {
          // coba user_email dan email
          const p = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE LOWER(email) = ? OR LOWER(user_email) = ?").bind(targetEmail, targetEmail).first();
          postCount = p?.c || 0;
        } catch (e) {
          try {
            const p2 = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE email = ?").bind(targetEmail).first();
            postCount = p2?.c || 0;
          } catch (e2) {}
        }

        // HITUNG FOLLOWERS / FOLLOWING
        let followersCount = 0, followingCount = 0, isFollowing = false;
        try {
          const f1 = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email = ?").bind(targetEmail).first();
          followersCount = f1?.c || 0;
          const f2 = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_email = ?").bind(targetEmail).first();
          followingCount = f2?.c || 0;
          
          if (myEmail) {
            const check = await env.DB.prepare("SELECT follower_email FROM follows WHERE follower_email = ? AND following_email = ?").bind(myEmail, targetEmail).first();
            isFollowing = !!check;
          }
        } catch (e) {
          // kalau tabel follows belum ada, biarin 0
        }

        return new Response(JSON.stringify({
          email: targetEmail,
          name: user?.name || targetEmail.split('@')[0],
          picture: user?.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png",
          posts: postCount,
          followers: followersCount,
          following: followingCount,
          isFollowing: isFollowing
        }), { headers: h });
      }

      // UPDATE PROFILE
      if (path === "/api/akun/update" && method === "POST") {
        const { email, name, picture } = await req.json();
        const cleanEmail = (email || "").toLowerCase().trim();
        await env.DB.prepare("UPDATE users SET name = COALESCE(?, name), picture = COALESCE(?, picture) WHERE email = ?").bind(name || null, picture || null, cleanEmail).run();
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // FOLLOW / UNFOLLOW - INI YANG BIKIN LOADING TERUS BALIK LAGI DI VIDEO LU BOS
      if (path === "/api/follow" && method === "POST") {
        const { follower, following } = await req.json();
        const cleanFollower = (follower || "").toLowerCase().trim();
        const cleanFollowing = (following || "").toLowerCase().trim();

        if (!cleanFollower || !cleanFollowing) {
          return new Response(JSON.stringify({ ok: false, error: "email kosong" }), { headers: h, status: 400 });
        }
        if (cleanFollower === cleanFollowing) {
          return new Response(JSON.stringify({ ok: false, error: "gak bisa follow diri sendiri" }), { headers: h, status: 400 });
        }

        const existing = await env.DB.prepare("SELECT follower_email FROM follows WHERE follower_email = ? AND following_email = ?").bind(cleanFollower, cleanFollowing).first();

        if (existing) {
          await env.DB.prepare("DELETE FROM follows WHERE follower_email = ? AND following_email = ?").bind(cleanFollower, cleanFollowing).run();
          return new Response(JSON.stringify({ ok: true, status: "unfollowed" }), { headers: h });
        } else {
          // Coba insert pakai created_at dulu, kalau gagal coba pakai time (biar tahan banting)
          try {
            await env.DB.prepare("INSERT INTO follows (follower_email, following_email, created_at) VALUES (?,?,?)").bind(cleanFollower, cleanFollowing, Date.now()).run();
          } catch (e) {
            try {
              await env.DB.prepare("INSERT INTO follows (follower_email, following_email, time) VALUES (?,?,?)").bind(cleanFollower, cleanFollowing, Date.now()).run();
            } catch (e2) {
              // last fallback tanpa timestamp
              await env.DB.prepare("INSERT INTO follows (follower_email, following_email) VALUES (?,?)").bind(cleanFollower, cleanFollowing).run();
            }
          }
          return new Response(JSON.stringify({ ok: true, status: "followed" }), { headers: h });
        }
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }

    return null; // biar worker lain yang handle
  }
};
