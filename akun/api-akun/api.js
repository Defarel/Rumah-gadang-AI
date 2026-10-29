const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

export const AKUN_API = {
  async handle(req, env, url, corsHeaders) {
    const h = { "Content-Type": "application/json", ...corsHeaders, "Cache-Control":"no-store" };
    const path = url.pathname.toLowerCase();
    const method = req.method;

    try {
      // INIT TABLES
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS follows (follower_email TEXT, following_email TEXT, created_at INTEGER, PRIMARY KEY(follower_email, following_email))`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS d1consule_photos_v2 (email TEXT, idx INTEGER, photo TEXT, updated_at INTEGER, PRIMARY KEY(email, idx))`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)`).run();
      
      // TABEL LIKE & KOMENTAR PERMANEN
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS photo_likes (photo_key TEXT, user_email TEXT, PRIMARY KEY(photo_key, user_email))`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS photo_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, photo_key TEXT, user_email TEXT, user_name TEXT, comment TEXT, time INTEGER)`).run();

      // 1. REGISTER / LOGIN
      if (path === "/api/akun/register" && method === "POST") {
        const body = await req.json();
        let email = (body.email || "").toLowerCase().trim();
        let name = (body.name || email.split('@')[0]).trim();
        let picture = body.picture || LOGO_DEFAULT;
        if (picture.startsWith("data:") && picture.length > 150000) picture = LOGO_DEFAULT;
        if (!email.includes('@')) email += "@rumahgadang-ai.my.id";
        
        await env.DB.prepare(
          `INSERT INTO users (email, name, picture, time) VALUES (?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture, time=excluded.time`
        ).bind(email, name, picture, Date.now()).run();
        
        return new Response(JSON.stringify({ ok: true, email, name, picture }), { headers: h });
      }

      if (path === "/api/akun/login" && method === "POST") {
        const body = await req.json();
        let email = (body.email || "").toLowerCase().trim();
        if (!email.includes('@')) email += "@rumahgadang-ai.my.id";
        let u = await env.DB.prepare(`SELECT email,name,picture FROM users WHERE email=?`).bind(email).first();
        if(!u){
          let name = body.name || email.split('@')[0];
          let pic = LOGO_DEFAULT;
          await env.DB.prepare(`INSERT INTO users (email,name,picture,time) VALUES (?,?,?,?) ON CONFLICT(email) DO NOTHING`).bind(email,name,pic,Date.now()).run();
          return new Response(JSON.stringify({ ok: true, email, name, picture: pic }), { headers: h });
        }
        return new Response(JSON.stringify({ ok: true, email: u.email, name: u.name, picture: u.picture }), { headers: h });
      }

      // 2. LIST SEMUA AKUN
      if (path === "/api/akun/list" && method === "GET") {
        const r1 = await env.DB.prepare("SELECT email, name, picture FROM users ORDER BY time DESC LIMIT 100").all().catch(()=>({results:[]}));
        return new Response(JSON.stringify(r1.results), { headers: h });
      }

      // 3. PROFILE
      if (path === "/api/akun/profile" && method === "GET") {
        const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
        let user = await env.DB.prepare("SELECT email, name, picture FROM users WHERE LOWER(email)=?").bind(targetEmail).first();
        
        let postCount = 0;
        try{ const p = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE LOWER(email)=? OR LOWER(user_email)=?").bind(targetEmail,targetEmail).first(); postCount=p?.c||0; }catch{}
        
        let followerCount = 0;
        try{ const f = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email=?").bind(targetEmail).first(); followerCount = f?.c || 0; }catch{}

        let followingCount = 0;
        try{ const fg = await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_email=?").bind(targetEmail).first(); followingCount = fg?.c || 0; }catch{}

        let isFollowing=false;
        try{ if(myEmail){ const c=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_email=? AND following_email=?").bind(myEmail,targetEmail).first(); isFollowing=!!c; } }catch{}
        
        return new Response(JSON.stringify({
          email: targetEmail, 
          name: user?.name || targetEmail.split('@')[0],
          picture: user?.picture || LOGO_DEFAULT, 
          posts: postCount, 
          followers: followerCount, 
          following: followingCount, 
          isFollowing
        }), { headers: h });
      }

      // 4. UPDATE PROFIL
      if (path === "/api/akun/update" && method === "POST") {
        const { email, name, picture } = await req.json();
        const cleanEmail = (email || "").toLowerCase().trim();
        let pic = picture || LOGO_DEFAULT;
        if(pic.startsWith("data:") && pic.length>150000) pic = LOGO_DEFAULT;
        await env.DB.prepare("UPDATE users SET name=COALESCE(?,name), picture=COALESCE(?,picture) WHERE LOWER(email)=?").bind(name||null, pic||null, cleanEmail).run();
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 5. FOLLOW
      if (path === "/api/follow" && method === "POST") {
        const body = await req.json();
        const follower = (body.follower || "").toLowerCase().trim();
        const following = (body.following || "").toLowerCase().trim();
        if (follower === following) return new Response(JSON.stringify({ ok: false }), { headers: h });
        const existing = await env.DB.prepare("SELECT follower_email FROM follows WHERE follower_email=? AND following_email=?").bind(follower, following).first();
        if (existing) {
          await env.DB.prepare("DELETE FROM follows WHERE follower_email=? AND following_email=?").bind(follower, following).run();
          return new Response(JSON.stringify({ ok: true, status: "unfollowed" }), { headers: h });
        } else {
          await env.DB.prepare("INSERT INTO follows (follower_email, following_email, created_at) VALUES (?,?,?)").bind(follower, following, Date.now()).run();
          return new Response(JSON.stringify({ ok: true, status: "followed" }), { headers: h });
        }
      }

      // 6. FOLLOWERS & FOLLOWING
      if (path === "/api/followers" || path === "/api/following") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        let sql = path.includes("followers") 
          ? `SELECT u.email, u.name, u.picture FROM follows f JOIN users u ON f.follower_email=u.email WHERE f.following_email=?`
          : `SELECT u.email, u.name, u.picture FROM follows f JOIN users u ON f.following_email=u.email WHERE f.follower_email=?`;
        const result = await env.DB.prepare(sql).bind(email).all().catch(()=>({results:[]}));
        return new Response(JSON.stringify(result.results||[]), { headers: h });
      }

      // 7. FOTO V2
      if (path === "/api/akun/photos") {
        if (method === "POST") {
          const { email, photos } = await req.json();
          const clean = (email || "").toLowerCase().trim();
          if (!photos || !Array.isArray(photos)) return new Response(JSON.stringify({ ok: false }), { headers: h, status:400 });
          await env.DB.prepare("DELETE FROM d1consule_photos_v2 WHERE email=?").bind(clean).run();
          for (let i=0;i<Math.min(photos.length,12);i++) {
            await env.DB.prepare("INSERT INTO d1consule_photos_v2 (email, idx, photo, updated_at) VALUES (?,?,?,?)").bind(clean, i, photos[i], Date.now()).run();
          }
          return new Response(JSON.stringify({ ok: true, count: photos.length }), { headers: h });
        }
        if (method === "GET") {
          const email = (url.searchParams.get("email") || "").toLowerCase().trim();
          const res = await env.DB.prepare("SELECT photo FROM d1consule_photos_v2 WHERE email=? ORDER BY idx ASC").bind(email).all().catch(()=>({results:[]}));
          return new Response(JSON.stringify((res.results||[]).map(r=>r.photo)), { headers: h });
        }
      }

      // 8. API LIKE PERMANEN
      if (path === "/api/photo/like") {
        let photo_key = url.searchParams.get("photo_key");
        let user_email = (url.searchParams.get("user_email") || "").toLowerCase().trim();

        if (method === "POST") {
          const body = await req.json().catch(()=>({}));
          photo_key = body.photo_key || photo_key;
          user_email = (body.user_email || user_email).toLowerCase().trim();
          
          if (!photo_key || !user_email) return new Response(JSON.stringify({ ok: false, error: "Missing data" }), { headers: h, status: 400 });
          
          const existing = await env.DB.prepare("SELECT 1 FROM photo_likes WHERE photo_key=? AND user_email=?").bind(photo_key, user_email).first();
          if (existing) {
            await env.DB.prepare("DELETE FROM photo_likes WHERE photo_key=? AND user_email=?").bind(photo_key, user_email).run();
          } else {
            await env.DB.prepare("INSERT OR IGNORE INTO photo_likes (photo_key, user_email) VALUES (?,?)").bind(photo_key, user_email).run();
          }
        }
        
        if (!photo_key) return new Response(JSON.stringify({ ok: false, error: "Missing photo_key" }), { headers: h, status: 400 });

        const countRes = await env.DB.prepare("SELECT COUNT(*) as c FROM photo_likes WHERE photo_key=?").bind(photo_key).first();
        let likedRes = null;
        if (user_email) {
          likedRes = await env.DB.prepare("SELECT 1 FROM photo_likes WHERE photo_key=? AND user_email=?").bind(photo_key, user_email).first();
        }
        
        return new Response(JSON.stringify({ ok: true, likes: countRes?.c || 0, likedByMe: !!likedRes }), { headers: h });
      }

      // ✅ 9. API KOMENTAR PERMANEN & DELETE KOMENTAR
      if (path === "/api/photo/comment") {
        if (method === "POST") {
          const { photo_key, user_email, user_name, comment } = await req.json().catch(()=>({}));
          if (!photo_key || !comment) return new Response(JSON.stringify({ ok: false, error: "Missing data" }), { headers: h, status: 400 });
          await env.DB.prepare("INSERT INTO photo_comments (photo_key, user_email, user_name, comment, time) VALUES (?,?,?,?,?)")
            .bind(photo_key, (user_email || "").toLowerCase().trim(), user_name || "Dunsanak", comment.trim(), Date.now()).run();
          return new Response(JSON.stringify({ ok: true }), { headers: h });
        }
        if (method === "DELETE") {
          const { comment_id, user_email } = await req.json().catch(()=>({}));
          if (!comment_id || !user_email) return new Response(JSON.stringify({ ok: false, error: "Missing data" }), { headers: h, status: 400 });
          await env.DB.prepare("DELETE FROM photo_comments WHERE id=? AND LOWER(user_email)=?").bind(comment_id, user_email.toLowerCase().trim()).run();
          return new Response(JSON.stringify({ ok: true }), { headers: h });
        }
        
        const photo_key = url.searchParams.get("photo_key");
        const comments = await env.DB.prepare("SELECT id, user_email, user_name as user, comment as text, time FROM photo_comments WHERE photo_key=? ORDER BY id ASC").bind(photo_key).all().catch(()=>({results:[]}));
        return new Response(JSON.stringify(comments.results || []), { headers: h });
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
    return null;
  }
};

export default AKUN_API;
