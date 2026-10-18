import { GLOBAL_VIDEOS } from '../../config.js';

function getId(ytUrl){
  if(!ytUrl) return null;
  let id = ytUrl.trim();
  if(id.includes("youtu.be/")) id = id.split("youtu.be/")[1].split("?")[0].split("&")[0];
  else if(id.includes("watch?v=")) id = id.split("watch?v=")[1].split("&")[0].split("?")[0];
  if(id.includes("?si=")) id = id.split("?si=")[0]; // FIX ERROR ID PEMUTARAN BOS!
  return id.substring(0,11);
}

export const VIDEO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname;
    if (path === "/api/videos" || path === "/api/video") {
      let local = [], blocked = [];
      try {
        if(env.DB){
          const r = await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();
          local = r.results?.map(x=>x.id)||[];
          const b = await env.DB.prepare("SELECT id FROM blocked_videos").all();
          blocked = b.results?.map(x=>x.id)||[];
        }
      } catch {}
      let all = [...new Set([...local, ...GLOBAL_VIDEOS])];
      all = all.filter(id => !blocked.includes(id));
      return new Response(JSON.stringify(all), { headers: cors });
    }
    if (path === "/api/videos/add" && req.method === "POST") {
      try {
        const b = await req.json();
        const id = getId(b.ytUrl);
        if(!id) return new Response(JSON.stringify({ ok:false, msg:"Link salah Bos" }), { headers: cors });
        if(env.DB) await env.DB.prepare("INSERT OR IGNORE INTO local_videos (id,created_at) VALUES (?,?)").bind(id, Date.now()).run();
        return new Response(JSON.stringify({ ok:true, id }), { headers: cors });
      } catch { return new Response(JSON.stringify({ ok:false }), { headers: cors }); }
    }
    return null;
  }
}
