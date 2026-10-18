import { GLOBAL_VIDEOS, getId } from '../../config.js';

export const VIDEO_API = {
  async handle(req, env, url, cors){
    try{
      if(env.DB){
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
      }
    }catch(e){}

    if(url.pathname==="/api/videos" || url.pathname==="/api/video"){
      let local=[], blocked=[];
      try{
        if(env.DB){
          // AMBIL SEMUA VIDEO DARI D1 BOS! YANG 25 VIDEO BOS!
          let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();
          local=r.results?.map(x=>x.id).filter(Boolean)||[];
          let b=await env.DB.prepare("SELECT id FROM blocked_videos").all();
          blocked=b.results?.map(x=>x.id)||[];
        }
      }catch(e){}
      
      local = local.filter(id=>!blocked.includes(id) && getId(id));
      // GABUNG SAMA GLOBAL BOS, TAPI GLOBALNYA UDAH KOSONG BOS, JADI CUMA 25 VIDEO BOS AJA BOS!
      let all = [...new Set([...local, ...GLOBAL_VIDEOS])];
      
      return new Response(JSON.stringify(all),{headers:cors});
    }

    if(url.pathname==="/api/videos/add" && req.method==="POST"){
      try{
        let j=await req.json();
        let id=getId(j.ytUrl);
        if(!id) return new Response(JSON.stringify({ok:false,msg:"Link salah Bos"}),{headers:cors});
        if(env.DB){
          await env.DB.prepare("INSERT OR IGNORE INTO local_videos (id,created_at) VALUES (?,?)").bind(id,Date.now()).run();
          await env.DB.prepare("DELETE FROM blocked_videos WHERE id=?").bind(id).run();
        }
        return new Response(JSON.stringify({ok:true,id}),{headers:cors});
      }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:cors}); }
    }
    
    // BOS! BUAT LIHAT 25 VIDEO BOS APA AJA BOS!
    if(url.pathname==="/api/videos/debug"){
      try{
        let r=await env.DB.prepare("SELECT * FROM local_videos ORDER BY created_at DESC").all();
        return new Response(JSON.stringify({count:r.results?.length||0, videos:r.results||[]}),{headers:cors});
      }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:cors}); }
    }

    return null;
  }
}
