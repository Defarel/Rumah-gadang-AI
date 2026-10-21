export const AKUN_API = {
  async handle(req, env, url, corsHeaders) {
    const h = { "Content-Type": "application/json", ...corsHeaders };
    const path = url.pathname;
    const method = req.method;

    try {
      // 1. REGISTER / LOGIN
      if (path === "/api/akun/register" && method === "POST") {
        const body = await req.json();
        const email = (body.email || "").toLowerCase().trim();
        const name = (body.name || email.split('@')[0]).trim();
        const picture = body.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
        
        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({ ok: false, error: "Email tidak valid" }), { headers: h, status: 400 });
        }

        await env.DB.prepare(
          `INSERT INTO users (email, name, picture, time) VALUES (?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=COALESCE(excluded.picture, users.picture), time=excluded.time`
        ).bind(email, name, picture, Date.now()).run();

        return new Response(JSON.stringify({ ok: true, email: email }), { headers: h });
      }

      // 2. LIST SEMUA AKUN
      if (path === "/api/akun/list" && method === "GET") {
        const result = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email LIKE '%@%' ORDER BY time DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }

      // 3. PROFILE DATA (Hitung Post, Followers, Following, & Status Follow)
      if (path === "/api/akun/profile" && method === "GET") {
        const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();

        if (!targetEmail) {
          return new Response(JSON.stringify({ ok: false, error: "Email kosong" }), { headers: h, status: 400 });
        }

        // Ambil data user target
        const user = await env.DB.prepare(
          "SELECT email, name, picture FROM users WHERE email = ?"
        ).bind(targetEmail).first();

        // Hitung total post
        let postCount = 0;
        try {
          const p = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM tulis WHERE LOWER(email) = ? OR LOWER(user_email) = ?"
          ).bind(targetEmail, targetEmail).first();
          postCount = p?.c || 0;
        } catch (e) {
          postCount = 0;
        }

        // Hitung Followers, Following, dan Cek Apakah Saya Follow Dia
        let followersCount = 0;
        let followingCount = 0;
        let isFollowing = false;

        try {
          // Total Pengikut (Followers)
          const f1 = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM follows WHERE following_email = ?"
          ).bind(targetEmail).first();
          followersCount = f1?.c || 0;

          // Total Mengikuti (Following)
          const f2 = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM follows WHERE follower_email = ?"
          ).bind(targetEmail).first();
          followingCount = f2?.c || 0;

          // Status Follow
          if (myEmail) {
            const check = await env.DB.prepare(
              "SELECT 1 as x FROM follows WHERE follower_email = ? AND following_email = ?"
            ).bind(myEmail, targetEmail).first();
            isFollowing = !!check;
          }
        } catch (e) {
          // Jika tabel follows belum dibuat
        }

        return new Response(JSON.stringify({
          email: targetEmail,
          name: user?.name || targetEmail.split('@')[0],
          picture: user?.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png",
          posts: postCount,
          followers: followersCount, // @+ = 1
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

      // 5. FITUR FOLLOW / UNFOLLOW (TOGGLE)
      if (path === "/api/follow" && method === "POST") {
        const body = await req.json();
        const follower = (body.follower || "").toLowerCase().trim();
        const following = (body.following || "").toLowerCase().trim();

        if (!follower || !following) {
          return new Response(JSON.stringify({ ok: false, error: "Email pengirim atau target kosong" }), { headers: h, status: 400 });
        }
        if (follower === following) {
          return new Response(JSON.stringify({ ok: false, error: "Tidak bisa follow akun sendiri" }), { headers: h, status: 400 });
        }

        // Cek apakah sudah follow
        const existing = await env.DB.prepare(
          "SELECT follower_email FROM follows WHERE follower_email = ? AND following_email = ?"
        ).bind(follower, following).first();

        if (existing) {
          // UNFOLLOW (@- = 1)
          await env.DB.prepare(
            "DELETE FROM follows WHERE follower_email = ? AND following_email = ?"
          ).bind(follower, following).run();

          return new Response(JSON.stringify({ 
            ok: true, 
            status: "unfollowed", 
            isFollowing: false, 
            message: "Unfollowed berhasil (@- = 1)" 
          }), { headers: h });
        } else {
          // FOLLOW (@+ = 1)
          await env.DB.prepare(
            "INSERT INTO follows (follower_email, following_email, created_at) VALUES (?,?,?)"
          ).bind(follower, following, Date.now()).run();

          return new Response(JSON.stringify({ 
            ok: true, 
            status: "followed", 
            isFollowing: true, 
            message: "Followed berhasil (@+ = 1)" 
          }), { headers: h });
        }
      }

      // 6. DAFTAR PENGIKUT (FOLLOWERS) DENGAN DETAIL PROFILE
      if (path === "/api/followers" && method === "GET") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        const result = await env.DB.prepare(
          `SELECT u.email, u.name, u.picture 
           FROM follows f 
           JOIN users u ON f.follower_email = u.email 
           WHERE f.following_email = ?`
        ).bind(email).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }

      // 7. DAFTAR MENGIKUTI (FOLLOWING) DENGAN DETAIL PROFILE
      if (path === "/api/following" && method === "GET") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        const result = await env.DB.prepare(
          `SELECT u.email, u.name, u.picture 
           FROM follows f 
           JOIN users u ON f.following_email = u.email 
           WHERE f.follower_email = ?`
        ).bind(email).all();
        return new Response(JSON.stringify(result.results || []), { headers: h });
      }
      // 8. SAVE FOTO
if(path === "/api/akun/photos"){
  if(method === "POST"){
    try{
      const {email, photos} = await req.json();
      const clean = (email||"").toLowerCase().trim();
      if(photos.length > 12) return new Response(JSON.stringify({ok:false,error:"max 12"}),{headers:h,status:400});
      await env.DB.prepare("DELETE FROM d1consule_photos_v2 WHERE email=?").bind(clean).run();
      for(let i=0;i<photos.length;i++){
        await env.DB.prepare("INSERT INTO d1consule_photos_v2 (email, idx, photo, updated_at) VALUES (?,?,?,?)").bind(clean, i, photos[i], Date.now()).run();
      }
      return new Response(JSON.stringify({ok:true,count:photos.length}),{headers:h});
    }catch(e){ return new Response(JSON.stringify({ok:false,error:e.message}),{headers:h,status:500}); }
  }
  if(method === "GET"){
    const email = (url.searchParams.get("email")||"").toLowerCase().trim();
    const res = await env.DB.prepare("SELECT photo FROM d1consule_photos_v2 WHERE email=? ORDER BY idx ASC").bind(email).all();
    return new Response(JSON.stringify((res.results||[]).map(r=>r.photo)),{headers:h});
  }


    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
  }
    return null;
  }
};
