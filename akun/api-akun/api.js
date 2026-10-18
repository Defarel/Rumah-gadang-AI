// KUNCI 5: AKUN BOS - REGISTER + FOLLOW + PROFILE
export const AKUN_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/register-user" && req.method==="POST"){
      let {email,name,picture}=await req.json();
      let username=email.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g,'');
      await env.DB.prepare(`INSERT OR REPLACE INTO users (email, username, name, created_at, picture) VALUES (?, ?, ?, ?, ?)`).bind(email.toLowerCase(), username, name||username, Date.now(), picture||"").run();
      await env.DB.prepare(`INSERT OR REPLACE INTO profiles (email, username, name, picture) VALUES (?, ?, ?, ?)`).bind(email.toLowerCase(), username, name||username, picture||"").run();
      return new Response(JSON.stringify({ok:true, username}), {headers:cors});
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
    // ... users, search-users, profile, check-follow
    return null;
  }
}
