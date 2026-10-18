import { GLOBAL_VIDEOS, getId } from '../../config.js';

export const VIDEO_API = {
  async handle(req, env, url, cors){
    if(url.pathname==="/api/videos" || url.pathname==="/api/video"){
      let local=[], blocked=[];
      try{
        let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();
        local=r.results?.map(x=>x.id)||[];
        let b=await env.DB.prepare("SELECT id FROM blocked_videos").all();
        blocked=b.results?.map(x=>x.id)||[];
      }catch(e){}
      let all=[...new Set([...local,...GLOBAL_VIDEOS])].filter(id=>!blocked.includes(id) && getId(id));
      return new Response(JSON.stringify(all),{headers:cors});
    }
    if(url.pathname==="/api/videos/add" && req.method==="POST"){
      try{
        let j=await req.json();
        let id=getId(j.ytUrl);
        if(!id) return new Response(JSON.stringify({ok:false,msg:"Link salah Bos"}),{headers:cors});
        await env.DB.prepare("INSERT OR IGNORE INTO local_videos (id,created_at) VALUES (?,?)").bind(id,Date.now()).run();
        await env.DB.prepare("DELETE FROM blocked_videos WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok:true,id}),{headers:cors});
      }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:cors}); }
    }
    return null;
  }
}
