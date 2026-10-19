
export const AKUN_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/register-user" && req.method==="POST"){
      let {email,name,picture}=await req.json();
      let username=email.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g,'');
      await env.DB.prepare(`INSERT OR REPLACE INTO users (email, username, name, created_at, picture) VALUES (?, ?, ?, ?, ?)`).bind(email.toLowerCase(), username, name||username, Date.now(), picture||"").run();
      await env.DB.prepare(`INSERT OR REPLACE INTO profiles (email, username, name, picture) VALUES (?, ?, ?, ?)`).bind(email.toLowerCase(), username, name||username, picture||"").run();
      return new Response(JSON.stringify({ok:true, username}), {headers:cors});
    }

    if(url.pathname==="/api/profile" && req.method==="POST"){
      let j=await req.json();
      let email=j.email.toLowerCase();
      let old=null;
      try{ old=await env.DB.prepare("SELECT * FROM profiles WHERE email=?").bind(email).first(); }catch{}
      let name=j.name||old?.name||email.split('@')[0];
      let bio=j.bio!==undefined?j.bio:(old?.bio||"");
      let pic=j.picture!==undefined?j.picture:(old?.picture||"");
      let username=email.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g,'');
      await env.DB.prepare(`INSERT OR REPLACE INTO profiles (email, username, name, picture, bio) VALUES (?,?,?,?,?)`).bind(email, username, name, pic, bio).run();
      await env.DB.prepare(`INSERT OR REPLACE INTO users (email, username, name, picture) VALUES (?,?,?,?)`).bind(email, username, name, pic).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }
    if(url.pathname.startsWith("/api/profile/")){
      let email=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      let p=await env.DB.prepare("SELECT * FROM profiles WHERE email=?").bind(email).first();
      return new Response(JSON.stringify(p||{}),{headers:cors});
    }

    if(url.pathname==="/api/follow" && req.method==="POST"){
      let j=await req.json();
      await env.DB.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").bind(j.follower_id.toLowerCase(), j.following_id.toLowerCase()).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }
    if(url.pathname==="/api/unfollow" && req.method==="POST"){
      let j=await req.json();
      await env.DB.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").bind(j.follower_id.toLowerCase(), j.following_id.toLowerCase()).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }
    if(url.pathname.startsWith("/api/follow-stats/")){
      let userId=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      let followers=await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE following_id = ?").bind(userId).first();
      let following=await env.DB.prepare("SELECT COUNT(*) as total FROM follows WHERE follower_id = ?").bind(userId).first();
      return new Response(JSON.stringify({followers: followers?.total||0, following: following?.total||0}),{headers:cors});
    }
    if(url.pathname==="/api/users"){
      let r=await env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC LIMIT 50").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }
    if(url.pathname.startsWith("/api/search-users/")){
      let q=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      let r=await env.DB.prepare("SELECT * FROM users WHERE username LIKE ? OR name LIKE ? OR email LIKE ? LIMIT 20").bind(`%${q}%`,`%${q}%`,`%${q}%`).all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }
    if(url.pathname.startsWith("/api/check-follow/")){
      let parts=url.pathname.split('/');
      let a=decodeURIComponent(parts[3]||"").toLowerCase();
      let b=decodeURIComponent(parts[4]||"").toLowerCase();
      let f=await env.DB.prepare("SELECT * FROM follows WHERE follower_id=? AND following_id=?").bind(a,b).first();
      let m=await env.DB.prepare("SELECT * FROM follows WHERE follower_id=? AND following_id=?").bind(b,a).first();
      return new Response(JSON.stringify({following:!!f, mutual:!!f&&!!m}),{headers:cors});
    }
    if(url.pathname.startsWith("/api/user/")){
      let uname=decodeURIComponent(url.pathname.split('/').pop()).toLowerCase();
      let u=await env.DB.prepare("SELECT * FROM users WHERE username=?").bind(uname).first();
      if(!u) u=await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(uname).first();
      return new Response(JSON.stringify(u||{}),{headers:cors});
    }
    return null;
  }
}
