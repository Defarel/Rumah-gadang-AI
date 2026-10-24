const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

export const AKUN_API = {
  async handle(req, env, url, corsHeaders) {
    const h = { "Content-Type": "application/json", ...corsHeaders, "Cache-Control":"no-store" };
    const path = url.pathname.toLowerCase();
    const method = req.method;

    try {
      // INIT TABLE - INI YANG BIKIN CACA GAK MASUK KEMARIN BOS, TABLE BELUM ADA
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS follows (follower_email TEXT, following_email TEXT, created_at INTEGER, PRIMARY KEY(follower_email, following_email))`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS d1consule_photos_v2 (email TEXT, idx INTEGER, photo TEXT, updated_at INTEGER, PRIMARY KEY(email, idx))`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)`).run();
      // tabel lama biar gak error kalau masih kepanggil
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS photos (email TEXT, url TEXT, time INTEGER)`).run();

      // 1. REGISTER / LOGIN - FIX CACA
      if (path === "/api/akun/register" && method === "POST") {
        const body = await req.json();
        let email = (body.email || "").toLowerCase().trim();
        let name = (body.name || email.split('@')[0]).trim();
        let picture = body.picture || LOGO_DEFAULT;
        if (picture.startsWith("data:") && picture.length > 150000) picture = LOGO_DEFAULT; // anti D1 penuh
        if (!email.includes('@')) email += "@rumahgadang-ai.my.id";
        
        await env.DB.prepare(
          `INSERT INTO users (email, name, picture, time) VALUES (?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture, time=excluded.time`
        ).bind(email, name, picture, Date.now()).run();
        await env.DB.prepare(
          `INSERT INTO rg_users (email, name, picture, time) VALUES (?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture, time=excluded.time`
        ).bind(email, name, picture, Date.now()).run();
        
        return new Response(JSON.stringify({ ok: true, email, name, picture }), { headers: h });
      }

      if (path === "/api/akun/login" && method === "POST") {
        const body = await req.json();
        let email = (body.email || "").toLowerCase().trim();
        if (!email.includes('@')) email += "@rumahgadang-ai.my.id";
        let u = await env.DB.prepare(`SELECT email,name,picture FROM users WHERE email=?`).bind(email).first();
        if(!u) u = await env.DB.prepare(`SELECT email,name,picture FROM rg_users WHERE email=?`).bind(email).first();
        if(!u){
          // kalau belum ada, buat otomatis biar caca langsung masuk
          let name = body.name || email.split('@')[0];
          let pic = LOGO_DEFAULT;
          await env.DB.prepare(`INSERT INTO users (email,name,picture,time) VALUES (?,?,?,?) ON CONFLICT(email) DO NOTHING`).bind(email,name,pic,Date.now()).run();
          return new Response(JSON.stringify({ ok: true, email, name, picture: pic }), { headers: h });
        }
        return new Response(JSON.stringify({ ok: true, email: u.email, name: u.name, picture: u.picture }), { headers: h });
      }

      // 2. LIST SEMUA AKUN - FIX GABUNG 2 TABLE BIAR CACA KELIATAN
      if (path === "/api/akun/list" && method === "GET") {
        const r1 = await env.DB.prepare("SELECT email, name, picture FROM users ORDER BY time DESC LIMIT 100").all().catch(()=>({results:[]}));
        const r2 = await env.DB.prepare("SELECT email, name, picture FROM rg_users ORDER BY time DESC LIMIT 100").all().catch(()=>({results:[]}));
        let map={};
        [...r1.results,...r2.results].forEach(x=>{ if(x?.email) map[x.email.toLowerCase()] = x; });
        return new Response(JSON.stringify(Object.values(map)), { headers: h });
      }

      // 3. PROFILE
      if (path === "/api/akun/profile" && method === "GET") {
        const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
        let user = await env.DB.prepare("SELECT email, name, picture FROM users WHERE LOWER(email)=?").bind(targetEmail).first();
        if(!user) user = await env.DB.prepare("SELECT email, name, picture FROM rg_users WHERE LOWER(email)=?").bind(targetEmail).first();
        let postCount = 0;
        try{ const p = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE LOWER(email)=? OR LOWER(user_email)=?").bind(targetEmail,targetEmail).first(); postCount=p?.c||0; }catch{}
        let isFollowing=false;
        try{ if(myEmail){ const c=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_email=? AND following_email=?").bind(myEmail,targetEmail).first(); isFollowing=!!c; } }catch{}
        return new Response(JSON.stringify({
          email: targetEmail, name: user?.name || targetEmail.split('@')[0],
          picture: user?.picture || LOGO_DEFAULT, posts: postCount, followers: 0, following: 0, isFollowing
        }), { headers: h });
      }

      // 4. UPDATE - INI KUNCI GANTI FOTO PROFIL
      if (path === "/api/akun/update" && method === "POST") {
        const { email, name, picture } = await req.json();
        const cleanEmail = (email || "").toLowerCase().trim();
        let pic = picture || LOGO_DEFAULT;
        if(pic.startsWith("data:") && pic.length>150000) pic = LOGO_DEFAULT;
        await env.DB.prepare("UPDATE users SET name=COALESCE(?,name), picture=COALESCE(?,picture) WHERE LOWER(email)=?").bind(name||null, pic||null, cleanEmail).run();
        await env.DB.prepare("UPDATE rg_users SET name=COALESCE(?,name), picture=COALESCE(?,picture) WHERE LOWER(email)=?").bind(name||null, pic||null, cleanEmail).run();
        try{ await env.DB.prepare("UPDATE tulis SET name=?, picture=? WHERE LOWER(email)=? OR LOWER(user_email)=?").bind(name, pic, cleanEmail, cleanEmail).run(); }catch{}
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

      // 6 & 7. FOLLOWERS / FOLLOWING
      if (path === "/api/followers" || path === "/api/following") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        let sql = path.includes("followers") 
          ? `SELECT u.email, u.name, u.picture FROM follows f JOIN users u ON f.follower_email=u.email WHERE f.following_email=?`
          : `SELECT u.email, u.name, u.picture FROM follows f JOIN users u ON f.following_email=u.email WHERE f.follower_email=?`;
        const result = await env.DB.prepare(sql).bind(email).all().catch(()=>({results:[]}));
        return new Response(JSON.stringify(result.results||[]), { headers: h });
      }

      // 8. FOTO V2 ANTI SQLITE ERROR
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

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
    return null;
  }
};

export default AKUN_API;
