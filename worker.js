import { withPayment } from 'https://esm.sh/mppx';
import * as HOME_M from './home/index.js';
import * as FOTO_M from './foto/index.js';
import * as VIDEO_M from './video/index.js';
import * as LUAR_M from './kantor/Luar/index.js';
import * as DALAM_M from './kantor/Dalam/index.js';
import * as AI_M from './ai/index.js';
import * as AKUN_M from './akun/index.js';
import * as TULIS_M from './home/api-tulis/api.js';
import * as FOTO_API_M from './foto/api-foto/api.js';
import * as VIDEO_API_M from './video/api-video/api.js';
import * as AKUN_API_M from './akun/api-akun/api.js';
import * as AI_API_M from './ai/api-ai/api.js';

export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const path = url.pathname.toLowerCase();

    // --- TEST GET (biar bisa tes dari HP tanpa F12) ---
    if (req.method === "GET" && (path === "/api/ai" || path === "/api/t" || path === "/api/t2i")) {
      return new Response(JSON.stringify({
        ok: true,
        TEXT: `GROQ_API_KEY: ${!!env.GROQ_API_KEY}`,
        IMAGE: `API_T2I: ${!!env.API_T2I} ${env.API_T2I ? "Saldo $0.96" : ""}`,
        has_GROQ: !!env.GROQ_API_KEY,
        has_T2I: !!env.API_T2I
      }), { headers: cors });
    }

    // --- AI TEKS (Groq) ---
    if (path === "/api/ai" && req.method === "POST") {
      try {
        let { prompt } = await req.json().catch(()=>({}));
        prompt = (prompt||"").trim();
        if(!prompt) return new Response(JSON.stringify({reply:"Prompt kosong sanak"}), {headers: cors});

        let GROQ_KEY = (env.GROQ_API_KEY||"").trim();
        if(!GROQ_KEY) return new Response(JSON.stringify({reply:"GROQ_API_KEY belum set di Cloudflare"}), {headers: cors});

        for(let m of ["openai/gpt-oss-120b","openai/gpt-oss-20b","llama-3.3-70b-versatile","llama-3.1-8b-instant"]){
          try{
            let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{
              method:"POST",
              headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
              body:JSON.stringify({
                model:m,
                messages:[
                  {role:"system",content:"Kamu adalah Rumah Gadang AI, asisten Komunitas Minangkabau yang ramah, pintar, jawab pakai bahasa Indonesia santai."},
                  {role:"user",content:prompt}
                ],
                max_tokens:500,
                temperature:0.7
              })
            });
            let d=await r.json();
            if(d.choices?.[0]?.message?.content){
              return new Response(JSON.stringify({reply:d.choices[0].message.content,model:m}),{headers: cors});
            }
          }catch(e){ continue; }
        }
        return new Response(JSON.stringify({reply:"Groq lagi sibuk sanak, coba lagi"}),{headers: cors});
      }catch(e){
        return new Response(JSON.stringify({reply:"Error: "+e.message}),{status:500,headers: cors});
      }
    }

    // --- AI GAMBAR (Glia Labs + mppx) ---
    if (path === "/api/t2i" && req.method === "POST") {
      try{
        let { prompt, model } = await req.json().catch(()=>({}));
        model = model || "krea/krea-2-medium-turbo";
        prompt = (prompt||"").trim();
        if(!prompt) return new Response(JSON.stringify({ok:false,error:"Prompt kosong"}),{status:400,headers:cors});

        let walletKey = (env.API_T2I||"").trim();
        if(!walletKey) return new Response(JSON.stringify({ok:false,error:"API_T2I belum set di Cloudflare Rahasia"}),{status:500,headers:cors});

        // Bayar 402 otomatis pakai mppx
        const fetchWithPayment = withPayment(fetch, { privateKey: walletKey });

        let r = await fetchWithPayment("https://api.glianalabs.com/v1/infer",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model,prompt})
        });

        // Glia langsung kasih gambar binary
        return new Response(r.body, {
          status: r.status,
          headers: {
            "Content-Type": r.headers.get("content-type")||"image/png",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=86400"
          }
        });

      }catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{status:500,headers:cors});
      }
    }

    return null;
  }
};

function getHtml(mod){ return mod.default || mod.HOME_HTML || mod.HOME || mod.FOTO_HTML || mod.FOTO || mod.VIDEO_HTML || mod.VIDEO || mod.AI_HTML || mod.AI || mod.LUAR_HTML || mod.DALAM_HTML || mod.AKUN_HTML || mod.AKUN || Object.values(mod)[0]; }
function getApi(mod){ return mod.FOTO_API || mod.VIDEO_API || mod.AKUN_API || mod.AI_API || mod.TULIS_API || mod.default || mod; }

const HOME_HTML = getHtml(HOME_M); 
const FOTO_HTML = getHtml(FOTO_M); 
const VIDEO_HTML = getHtml(VIDEO_M); 
const LUAR_HTML = getHtml(LUAR_M); 
const DALAM_HTML = getHtml(DALAM_M); 
const AI_HTML = getHtml(AI_M); 
const AKUN_HTML = getHtml(AKUN_M);

function htmlResponse(html, canonical){ return new Response(html, {headers:{"Content-Type":"text/html;charset=utf-8"}}); }

export default {
  async fetch(req, env) {
    const url = new URL(req.url); 
    let path = url.pathname.toLowerCase();
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    
    if(req.method==="OPTIONS") return new Response("",{headers:cors});
    
    if(path.startsWith('/api/')){
      try{
        if(path.startsWith('/api/tulis')){ let m=getApi(TULIS_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/foto')){ let m=getApi(FOTO_API_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/video')){ let m=getApi(VIDEO_API_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/akun')){ let m=getApi(AKUN_API_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/ai')||path.startsWith('/api/t2i')||path.startsWith('/api/t')){ 
          let r = await AI_API.handle(req,env,url,cors); 
          if(r) return r; 
          let m = getApi(AI_API_M); 
          let r2 = await m?.handle?.(req,env,url,cors); 
          if(r2) return r2; 
        }
      }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:cors,status:500}); }
    }

    if(path==="/"||path==="/home") return htmlResponse(HOME_HTML,"https://rumahgadang-ai.my.id/");
    if(path.startsWith("/foto")) return htmlResponse(FOTO_HTML,"https://rumahgadang-ai.my.id/foto");
    if(path.startsWith("/video")) return htmlResponse(VIDEO_HTML,"https://rumahgadang-ai.my.id/video");
    if(path.startsWith("/ai")) return htmlResponse(AI_HTML,"https://rumahgadang-ai.my.id/ai");
    if(path.startsWith("/luar")) return htmlResponse(LUAR_HTML,"https://rumahgadang-ai.my.id/luar");
    if(path.startsWith("/dalam")) return htmlResponse(DALAM_HTML,"https://rumahgadang-ai.my.id/dalam");
    if(path.startsWith("/akun")) return htmlResponse(AKUN_HTML,"https://rumahgadang-ai.my.id/akun");
    
    return htmlResponse(HOME_HTML,"https://rumahgadang-ai.my.id/");
  }
};
