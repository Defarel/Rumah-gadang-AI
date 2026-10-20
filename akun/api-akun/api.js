export const AKUN_API = {
  async handle(req, env, url, corsHeaders) {
    const h = { "Content-Type": "application/json", ...corsHeaders };
    const path = url.pathname;
    const method = req.method;

    try {
      // 1. REGISTER / LOGIN - BUAT AKUN @rumahgadang-ai.my.id
      if (path === "/api/akun/register" && method === "POST") {
        const body = await req.json();
        const email = (body.email || "").toLowerCase().trim();
        const name = (body.name || email.split('@')[0]).trim();
        const picture = body.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
        
        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({ ok: false, error: "email invalid" }), { headers: h, status: 400 });
        }

        await env.DB.prepare(
          `INSERT INTO users (email, name, picture, time) VALUES (?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=COALESCE(excluded.picture, users.picture), time=excluded.time`
        ).bind(email, name, picture, Date.now()).run();

        return new Response(JSON.stringify({ ok: true, email: email }), { headers: h });
      }

      // 2. LIST SEMUA AKUN - BUAT TAB TEMAN BOS
      if (path === "/api/akun/list" && method === "GET") {
        const result = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email LIKE '%@%' ORDER BY time DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }

      // 3. PROFILE - INI YANG BIKIN 0 0 0 DI VIDEO LU BOS! FIX @+ = 1 BOS
      if (path === "/api/akun/profile" && method === "GET") {
        const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();

        if (!targetEmail) {
          return new Response(JSON.stringify({ ok: false, error: "email kosong" }), { headers: h, status: 400 });
        }

        // Ambil data user
        const user = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email = ?"
        ).bind(targetEmail).first();

        // FIX TULISAN = 0 BOS! HITUNG DARI 2 KOLOM BOS!
        let postCount = 0;
        try {
          const p = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM tulis WHERE LOWER(email) = ? OR LOWER(user_email) = ?"
          ).bind(targetEmail, targetEmail).first();
          postCount = p?.c || 0;
          
          // Fallback kalau kolom beda
          if (postCount === 0) {
            try {
              const p2 = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE email = ? OR user_email = ?").bind(targetEmail, targetEmail).first();
              postCount = p2?.c || 0;
            } catch {}
          }
        } catch (e) {
          postCount = 0;
        }

        // FIX @+ = 1 BOS! INI PENGIKUT & MENGIKUTI BOS!
        let followersCount = 0;
        let followingCount = 0;
        let isFollowing = false;

        try {
          // Pengikut = berapa orang yang follow dia -> @+ = 1 tiap ada yang follow Bos!
          const f1 = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM follows WHERE following_email = ?"
          ).bind(targetEmail).first();
          followersCount = f1?.c || 0;

          // Mengikuti = berapa orang yang dia follow
          const f2 = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM follows WHERE follower_email = ?"
          ).bind(targetEmail).first();
          followingCount = f2?.c || 0;

          // Apakah gue follow dia?
          if (myEmail) {
            const check = await env.DB.prepare(
              "SELECT 1 as x FROM follows WHERE follower_email = ? AND following_email = ?"
            ).bind(myEmail, targetEmail).first();
            isFollowing = !!check;
          }
        } catch (e) {
          // Kalau tabel follows belum ada, biarin 0 dulu Bos
        }

        return new Response(JSON.stringify({
          email: targetEmail,
          name: user?.name || targetEmail.split('@')[0],
          picture: user?.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png",
          posts: postCount,
          followers: followersCount,  // Ini @+ = 1 Bos!
          following: followingCount,
          isFollowing: isFollowing
        }), { headers: h });
      }

      // 4. UPDATE PROFILE
      if (path === "/api/akun/update" && method === "POST") {
        const { email, name, picture } = await req.json();
        const cleanEmail = (email || "").toLowerCase().trim();
        await env.DB.prepare(
          "UPDATE users SET name = COALESCE(?, name), picture = COALESCE(?, picture) WHERE email = ?"
        ).bind(name || null, picture || null, cleanEmail).run();
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 5. FOLLOW / UNFOLLOW - INI @+ = 1 NYA BOS!
      if (path === "/api/follow" && method === "POST") {
        const body = await req.json();
        const follower = (body.follower || "").toLowerCase().trim();
        const following = (body.following || "").toLowerCase().trim();

        if (!follower || !following) {
          return new Response(JSON.stringify({ ok: false, error: "email kosong" }), { headers: h, status: 400 });
        }
        if (follower === following) {
          return new Response(JSON.stringify({ ok: false, error: "gak bisa follow diri sendiri Bos" }), { headers: h, status: 400 });
        }

        const existing = await env.DB.prepare(
          "SELECT follower_email FROM follows WHERE follower_email = ? AND following_email = ?"
        ).bind(follower, following).first();

        if (existing) {
          // UNFOLLOW = -1 Bos!
          await env.DB.prepare(
            "DELETE FROM follows WHERE follower_email = ? AND following_email = ?"
          ).bind(follower, following).run();
          return new Response(JSON.stringify({ ok: true, status: "unfollowed", message: "unfollowed @- = 1" }), { headers: h });
        } else {
          // FOLLOW = @+ = 1 Bos! INI YANG LU MAU BOS!
          try {
            await env.DB.prepare(
              "INSERT INTO follows (follower_email, following_email, created_at) VALUES (?,?,?)"
            ).bind(follower, following, Date.now()).run();
          } catch (e) {
            // Fallback kalau kolom masih time
            try {
              await env.DB.prepare(
                "INSERT INTO follows (follower_email, following_email, time) VALUES (?,?,?)"
              ).bind(follower, following, Date.now()).run();
            } catch (e2) {
              await env.DB.prepare(
                "INSERT INTO follows (follower_email, following_email) VALUES (?,?)"
              ).bind(follower, following).run();
            }
          }
          return new Response(JSON.stringify({ ok: true, status: "followed", message: "followed @+ = 1" }), { headers: h });
        }
      }

      // 6. LIST FOLLOWERS & FOLLOWING - BUAT DETAIL BOS
      if (path === "/api/followers" && method === "GET") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        const result = await env.DB.prepare(
          "SELECT follower_email FROM follows WHERE following_email = ?"
        ).bind(email).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }

      if (path === "/api/following" && method === "GET") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        const result = await env.DB.prepare(
          "SELECT following_email FROM follows WHERE follower_email = ?"
        ).bind(email).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }

    return null;
  }
};
