export const AKUN_API = {
  async handle(req, env, url, cors) {
    const h = { "Content-Type": "application/json", ...cors };
    const path = url.pathname;

    try {
      // 1. REGISTER
      if (path === "/api/akun/register" && req.method === "POST") {
        let { email, name, picture, password } = await req.json();
        let cleanEmail = (email || "").toLowerCase().trim();
        let cleanName = name || "Dunsanak";
        let cleanPic = picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
        if (!cleanEmail) return new Response(JSON.stringify({ ok: false, error: "Email wajib!" }), { headers: h, status: 400 });

        await env.DB.prepare(`
          INSERT INTO users (email, name, picture, password, time) 
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            name = excluded.name,
            picture = COALESCE(NULLIF(excluded.picture, ''), users.picture)
        `).bind(cleanEmail, cleanName, cleanPic, password || "", Date.now()).run();

        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 2. LOGIN
      if (path === "/api/akun/login" && req.method === "POST") {
        let { email, password } = await req.json();
        let cleanEmail = (email || "").toLowerCase().trim();
        let user = await env.DB.prepare("SELECT email, name, picture FROM users WHERE email = ?").bind(cleanEmail).first();
        if (!user) {
          let defaultName = cleanEmail.split('@')[0] || "Dunsanak";
          let defaultPic = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
          await env.DB.prepare("INSERT INTO users (email, name, picture, password, time) VALUES (?, ?, ?, ?, ?)").bind(cleanEmail, defaultName, defaultPic, password || "", Date.now()).run();
          return new Response(JSON.stringify({ ok: true, user: { email: cleanEmail, name: defaultName, picture: defaultPic } }), { headers: h });
        }
        return new Response(JSON.stringify({ ok: true, user }), { headers: h });
      }

      // 3. LIST TEMAN @rumahgadang-ai.my.id
      if (path === "/api/akun/list" && req.method === "GET") {
        let r = await env.DB.prepare("SELECT email, name, picture FROM users WHERE email LIKE '%@rumahgadang-ai.my.id' ORDER BY time DESC LIMIT 100").all();
        return new Response(JSON.stringify(r.results || []), { headers: h });
      }

      // 4. PROFILE + REAL FOLLOWER COUNT DARI D1
      if (path === "/api/akun/profile" && req.method === "GET") {
        let targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        let myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
        if (!targetEmail) return new Response(JSON.stringify({ ok: false, error: "Email target tidak ada" }), { headers: h, status: 400 });

        let user = await env.DB.prepare("SELECT email, name, picture FROM users WHERE email = ?").bind(targetEmail).first();

        let postCount = 0;
        try {
          let p = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE LOWER(email) = ?").bind(targetEmail).first();
          postCount = p?.c || 0;
        } catch (e) {}

        // INI YANG REAL BOS, DARI TABEL follows YANG BARU
        let followersCount = 0;
        let followingCount = 0;
        let isFollowing = false;
        try {
          let f1 = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email = ?").bind(targetEmail).first();
          followersCount = f1?.c || 0;

          let f2 = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_email = ?").bind(targetEmail).first();
          followingCount = f2?.c || 0;

          if (myEmail) {
            let isF = await env.DB.prepare("SELECT follower_email FROM follows WHERE follower_email = ? AND following_email = ?").bind(myEmail, targetEmail).first();
            isFollowing = !!isF;
          }
        } catch (e) {
          console.log("follow error", e.message);
        }

        return new Response(JSON.stringify({
          email: targetEmail,
          name: user?.name || targetEmail.split('@')[0] || "Dunsanak",
          picture: user?.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png",
          posts: postCount,
          followers: followersCount,
          following: followingCount,
          isFollowing: isFollowing
        }), { headers: h });
      }

      // 5. UPDATE PROFIL
      if (path === "/api/akun/update" && req.method === "POST") {
        let { email, name, picture } = await req.json();
        let cleanEmail = (email || "").toLowerCase().trim();
        if (!cleanEmail) return new Response(JSON.stringify({ ok: false, error: "Email tidak valid" }), { headers: h, status: 400 });
        await env.DB.prepare("UPDATE users SET name = COALESCE(?, name), picture = COALESCE(?, picture) WHERE email = ?").bind(name || null, picture || null, cleanEmail).run();
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 6. FOLLOW / UNFOLLOW REAL BOS - PAKAI created_at BUKAN time, GAK ADA id
      if (path === "/api/follow" && req.method === "POST") {
        let { follower, following } = await req.json();
        let cleanFollower = (follower || "").toLowerCase().trim();
        let cleanFollowing = (following || "").toLowerCase().trim();

        if (!cleanFollower || !cleanFollowing || cleanFollower === cleanFollowing) {
          return new Response(JSON.stringify({ ok: false, error: "Follow tidak valid" }), { headers: h, status: 400 });
        }

        let existing = await env.DB.prepare("SELECT follower_email FROM follows WHERE follower_email = ? AND following_email = ?").bind(cleanFollower, cleanFollowing).first();

        if (existing) {
          await env.DB.prepare("DELETE FROM follows WHERE follower_email = ? AND following_email = ?").bind(cleanFollower, cleanFollowing).run();
          let f1 = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email = ?").bind(cleanFollowing).first();
          return new Response(JSON.stringify({ ok: true, status: "unfollowed", followers: f1?.c || 0 }), { headers: h });
        } else {
          await env.DB.prepare("INSERT INTO follows (follower_email, following_email, created_at) VALUES (?, ?, ?)").bind(cleanFollower, cleanFollowing, Date.now()).run();
          let f1 = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email = ?").bind(cleanFollowing).first();
          return new Response(JSON.stringify({ ok: true, status: "followed", followers: f1?.c || 0 }), { headers: h });
        }
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
    return null;
  }
};
