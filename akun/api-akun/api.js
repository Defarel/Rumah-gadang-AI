export const AKUN_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname;
    const h = { "Content-Type": "application/json", ...cors };

    try {
      // Buat table otomatis
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, user_email TEXT, text TEXT, name TEXT, picture TEXT, time INTEGER)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, pass TEXT, time INTEGER)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS rg_follows (follower TEXT, following TEXT, PRIMARY KEY(follower, following))`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS rg_photos (email TEXT PRIMARY KEY, data TEXT)`).run();

      // REGISTER
      if (path === '/api/akun/register' && req.method === 'POST') {
        const { email, name, password, picture } = await req.json();
        if (!email) return new Response(JSON.stringify({ok:false}), {headers: h});
        const e = email.toLowerCase().trim();
        await env.DB.prepare("INSERT OR REPLACE INTO rg_users (email, pass, name, picture, time) VALUES (?,?,?,?,?)").bind(e, password||'', name||'Dunsanak', picture||'', Date.now()).run();
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

      // UPDATE PROFIL - INI YANG KURANG TADI
      if (path === '/api/akun/update' && req.method === 'POST') {
        const { email, name, picture } = await req.json();
        const e = (email||'').toLowerCase().trim();
        if(!e) return new Response(JSON.stringify({ok:false}), {headers: h});
        // update name & picture
        const existing = await env.DB.prepare("SELECT * FROM rg_users WHERE email=?").bind(e).first();
        if(existing){
          await env.DB.prepare("UPDATE rg_users SET name=?, picture=? WHERE email=?").bind(name||existing.name, picture||existing.picture, e).run();
        } else {
          await env.DB.prepare("INSERT INTO rg_users (email, name, picture, time) VALUES (?,?,?,?)").bind(e, name||'Dunsanak', picture||'', Date.now()).run();
        }
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

      // LIST USER
      if (path === '/api/akun/list' && req.method === 'GET') {
        const { results } = await env.DB.prepare("SELECT email, name, picture FROM rg_users ORDER BY time DESC LIMIT 50").all();
        return new Response(JSON.stringify(results||[]), {headers: h});
      }

      // PROFILE
      if (path === '/api/akun/profile' && req.method === 'GET') {
        const email = (url.searchParams.get('email')||'').toLowerCase().trim();
        const me = (url.searchParams.get('me')||'').toLowerCase().trim();
        const u = await env.DB.prepare("SELECT email, name, picture FROM rg_users WHERE email=?").bind(email).first();
        if (!u) return new Response(JSON.stringify({name:'Dunsanak', posts:0, followers:0, following:0}), {headers: h});

        const postsRow = await env.DB.prepare("SELECT data FROM rg_photos WHERE email=?").bind(email).first();
        const postsCount = postsRow ? JSON.parse(postsRow.data||"[]").length : 0;
        const followers = await env.DB.prepare("SELECT COUNT(*) as c FROM rg_follows WHERE following=?").bind(email).first();
        const following = await env.DB.prepare("SELECT COUNT(*) as c FROM rg_follows WHERE follower=?").bind(email).first();
        let isFollowing = false;
        if (me) {
          const f = await env.DB.prepare("SELECT 1 FROM rg_follows WHERE follower=? AND following=?").bind(me, email).first();
          isFollowing = !!f;
        }
        return new Response(JSON.stringify({
          email: u.email, name: u.name, picture: u.picture,
          posts: postsCount, followers: followers?.c||0, following: following?.c||0, isFollowing
        }), {headers: h});
      }

      // FOTO - GET
      if (path === '/api/akun/photos' && req.method === 'GET') {
        const email = (url.searchParams.get('email')||'').toLowerCase().trim();
        const row = await env.DB.prepare("SELECT data FROM rg_photos WHERE email=?").bind(email).first();
        const data = row ? JSON.parse(row.data||"[]") : [];
        return new Response(JSON.stringify(data), {headers: h});
      }

      // FOTO - POST
      if (path === '/api/akun/photos' && req.method === 'POST') {
        const { email, photos } = await req.json();
        const e = (email||'').toLowerCase().trim();
        if(!e) return new Response(JSON.stringify({ok:false}), {headers: h});
        if((photos||[]).length > 12) return new Response(JSON.stringify({ok:false, error:"max 12"}), {headers: h});
        await env.DB.prepare("INSERT OR REPLACE INTO rg_photos (email, data) VALUES (?,?)").bind(e, JSON.stringify(photos||[])).run();
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

      // FOLLOW
      if (path === '/api/follow' && req.method === 'POST') {
        const { follower, following } = await req.json();
        const f = (follower||'').toLowerCase().trim();
        const t = (following||'').toLowerCase().trim();
        const exists = await env.DB.prepare("SELECT 1 FROM rg_follows WHERE follower=? AND following=?").bind(f,t).first();
        if (exists) await env.DB.prepare("DELETE FROM rg_follows WHERE follower=? AND following=?").bind(f,t).run();
        else await env.DB.prepare("INSERT INTO rg_follows (follower, following) VALUES (?,?)").bind(f,t).run();
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

    } catch (err) {
      return new Response(JSON.stringify({ok:false, error: err.message}), {headers: h, status: 500});
    }
    return null;
  }
}
