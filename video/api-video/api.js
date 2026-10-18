// KUNCI 3: VIDEO BOS
import { GLOBAL_VIDEOS } from '../config.js';
export const VIDEO_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/videos"){
      let local=[];
      try{ let r=await env.DB.prepare("SELECT id FROM local_videos ORDER BY created_at DESC").all(); local=r.results?.map(x=>x.id)||[]; }catch(e){}
      let all=[...new Set([...local,...(GLOBAL_VIDEOS||[])])];
      return new Response(JSON.stringify(all),{headers:cors});
    }
    return null;
  }
}
