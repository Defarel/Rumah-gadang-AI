import { GLOBAL_VIDEOS, getId } from '../../config.js';

export const VIDEO_API = {
  async handle(req, env, url, cors){
    // BOS! INI API UTAMA BOS!
    if(url.pathname==="/api/videos" || url.pathname==="/api/video" || url.pathname==="/api/videos/list"){
      let local=[], blocked=[];
      try{
        if(env.DB){
          let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all();
          local=r.results?.map(x=>x.id).filter(Boolean)||[];
          let b=await env.DB.prepare("SELECT id FROM blocked_videos").all();
          blocked=b.results?.map(x=>x.id)||[];
        }
      }catch(e){}

      // BOS! INI KUNCI BOS! JANGAN FILTER GLOBAL_VIDEOS PAKAI BLOCKED BOS! BIAR SELALU MUNCUL BOS!
      // LOCAL DOANG YANG DI FILTER BLOCKED BOS!
      local = local.filter(id=>!blocked.includes(id));
      
      // GABUNG BOS! LOCAL DULU BOS, BARU GLOBAL BOS!
      let all = [...new Set([...local, ...GLOBAL_VIDEOS])];
      
      // BOS! JIKA SEMUA KOSONG, PAKSA KELUAR 5 VIDEO BENAR BOS!
      if(all.length===0){
        all = GLOBAL_VIDEOS;
      }

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
      }catch(e){ return new Response(JSON.stringify({ok:false,msg:e.message}),{headers:cors}); }
    }
    return null;
  }
}
