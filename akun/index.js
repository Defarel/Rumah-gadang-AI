export const AKUN_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname;

    // REGISTER / LOGIN
    if (path === '/api/akun/register' && req.method === 'POST') {
      try {
        const { email, name, password, picture } = await req.json();
        if (!email) return new Response(JSON.stringify({ok:false}), {headers:cors});
        const e = email.toLowerCase().trim();
        await env.DB.prepare("INSERT OR REPLACE INTO rg_users (email, pass, name, picture, time) VALUES (?,?,?,?,?)")
          .bind(e, password||'', name||'Dunsanak', picture||'', Date.now()).run();
        return new Response(JSON.stringify({ok:true}), {headers:cors});
      } catch(err) {
        return new Response(JSON.stringify({ok:false, error: err.message}), {headers:cors});
      }
    }

    // LIST SEMUA USER
    if (path === '/api/akun/list' && req.method === 'GET') {
      try {
        const { results } = await env.DB.prepare("SELECT email, name, picture FROM rg_users ORDER BY time DESC LIMIT 50").all();
        return new Response(JSON.stringify(results||[]), {headers:cors});
      } catch(err) {
        return new Response(JSON.stringify([]), {headers:cors});
      }
    }

    // PROFILE
    if (path === '/api/akun/profile' && req.method === 'GET') {
      try {
        const email = (url.searchParams.get('email')||'').toLowerCase().trim();
        const me = (url.searchParams.get('me')||'').toLowerCase().trim();
        const u = await env.DB.prepare("SELECT email, name, picture FROM rg_users WHERE email=?").bind(email).first();
        if (!u) return new Response(JSON.stringify({name:'Dunsanak'}), {headers:cors});

        const posts = await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE user_email=?").bind(email).first();
        const followers = await env.DB.prepare("SELECT COUNT(*) as c FROM rg_follows WHERE following=?").bind(email).first();
        const following = await env.DB.prepare("SELECT COUNT(*) as c FROM rg_follows WHERE follower=?").bind(email).first();
        let isFollowing = false;
        if (me) {
          const f = await env.DB.prepare("SELECT * FROM rg_follows WHERE follower=? AND following=?").bind(me, email).first();
          isFollowing = !!f;
        }

        return new Response(JSON.stringify({
          email: u.email,
          name: u.name,
          picture: u.picture,
          posts: posts?.c||0,
          followers: followers?.c||0,
          following: following?.c||0,
          isFollowing
        }), {headers:cors});
      } catch(err) {
        return new Response(JSON.stringify({name:'Dunsanak', error: err.message}), {headers:cors});
      }
    }

    // FOLLOW TOGGLE
    if (path === '/api/follow' && req.method === 'POST') {
      try {
        const { follower, following } = await req.json();
        const f = follower.toLowerCase().trim();
        const t = following.toLowerCase().trim();
        const exists = await env.DB.prepare("SELECT * FROM rg_follows WHERE follower=? AND following=?").bind(f,t).first();
        if (exists) {
          await env.DB.prepare("DELETE FROM rg_follows WHERE follower=? AND following=?").bind(f,t).run();
        } else {
          await env.DB.prepare("INSERT INTO rg_follows (follower, following) VALUES (?,?)").bind(f,t).run();
        }
        return new Response(JSON.stringify({ok:true}), {headers:cors});
      } catch(err) {
        return new Response(JSON.stringify({ok:false, error: err.message}), {headers:cors});
      }
    }

    return null;
  }
}
