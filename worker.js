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

// FINAL - TANPA BEARER - PAKAI MPPX BAYAR 402 OTOMATIS
export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const p = url.pathname.toLowerCase();

    if (req.method === "GET" && (p === "/api/ai" || p === "/api/t2i" || p === "/api/t")) {
      return new Response(JSON.stringify({
        ok: true,
        TEXT: "GROQ_API_KEY: " + !!env.GROQ_API_KEY,
        IMAGE: "API_T2I: " + !!env.API_T2I + " Saldo $0.96",
        has_GROQ: !!env.GROQ_API_KEY,
        has_T2I: !!env.API_T2I
      }), { headers: cors });
    }

    if (p === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      prompt = (prompt||"").trim();
      if(!prompt) return new Response(JSON.stringify({reply:"Prompt kosong"}),{headers:cors});
      let GROQ_KEY = (env.GROQ_API_KEY || "").trim();
      if(!GROQ_KEY) return new Response(JSON.stringify({reply:"GROQ_API_KEY belum set"}),{headers:cors});
      for (let model of ["openai/gpt-oss-120b","openai/gpt-oss-20b","llama-3.3-70b-versatile"]) {
        try {
          let r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
            body:JSON.stringify({model,messages:[{role:"system",content:"KAMU: Rumah Gadang AI Padang, ramah Minang, singkat max 60 kata."},{role:"user",content:prompt}],temperature:0.7,max_tokens:400})
          });
          let d = await r.json();
          if(d.choices?.[0]?.message?.content){
            return new Response(JSON.stringify({reply:d.choices[0].message.content,model}),{headers:cors});
          }
        } catch {}
      }
      return new Response(JSON.stringify({reply:"Groq gagal"}),{headers:cors});
    }

    if ((p === "/api/t2i") && req.method === "POST") {
      try {
        let { prompt, model } = await req.json().catch(()=>({}));
        model = model || "krea/krea-2-medium-turbo";
        prompt = (prompt||"").trim();
        let T2I_KEY = (env.API_T2I || "").trim();
        if(!T2I_KEY) return new Response(JSON.stringify({ok:false,error:"API_T2I belum set"}),{headers:cors,status:500});
        if(!prompt) return new Response(JSON.stringify({ok:false,error:"Prompt kosong"}),{headers:cors,status:400});

        // INI FIX 402 - BAYAR OTOMATIS PAKAI SALDO $0.96
        const fetchWithPayment = withPayment(fetch, { privateKey: T2I_KEY });

        let r = await fetchWithPayment("https://api.glianalabs.com/v1/infer",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model,prompt})
        });

        let ct = r.headers.get("content-type")||"";
        
        if(ct.startsWith("image/")){
          let buf = await r.arrayBuffer();
          let bytes = new Uint8Array(buf);
          let binary = "";
          for(let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i]);
          let b64 = btoa(binary);
          let dataUrl = `data:${ct};base64,${b64}`;
          return new Response(JSON.stringify({ok:true,prompt,model,image:dataUrl}),{headers:cors});
        }

        let text = await r.text();
        let d; try{ d = JSON.parse(text); } catch{ d = {raw_text:text}; }

        if(r.status===402){
          return new Response(JSON.stringify({ok:false,error:"Saldo habis, topup di dashboard.glianalabs.com",raw:d}),{headers:cors,status:402});
        }

        let img = d.image_url || d.url || d.image || d.output || d.images?.[0] || null;
        if(d.b64_json) img = `data:image/png;base64,${d.b64_json}`;
        if(typeof img === "string" && img.length > 500 && !img.startsWith("http") && !img.startsWith("data:")){
          img = `data:image/png;base64,${img}`;
        }

        if(img){
          return new Response(JSON.stringify({ok:true,prompt,model,image:img}),{headers:cors});
        }

        return new Response(JSON.stringify({ok:false,error:"Glia tidak kasih gambar",raw:d}),{headers:cors,status:500});

      } catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:cors,status:500});
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

function htmlResponse(html, canonical){
  if(html && html.includes('</title>') && !html.includes('rel="canonical"')){
    html = html.replace('</title>', `</title><link rel="canonical" href="${canonical}">`);
  }
  return new Response(html, {headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"public, max-age=300"}});
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let path = url.pathname.toLowerCase();
    const cors = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS,DELETE','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store'};
    if(req.method==="OPTIONS") return new Response("",{headers:cors});

    const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':','');
    const host = (req.headers.get('host') || "").toLowerCase();
    if(proto==='http') return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search,301);
    if(host.startsWith('www.')) return Response.redirect("https://rumahgadang-ai.my.id"+url.pathname+url.search,301);

    if(path.startsWith('/api/')){
      try{
        if(path.startsWith('/api/tulis')){ let m=getApi(TULIS_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/foto')||path.startsWith('/api/images')||path.startsWith('/api/ig-curated')){ let m=getApi(FOTO_API_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/video')){ let m=getApi(VIDEO_API_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/akun')||path.startsWith('/api/users')){ let m=getApi(AKUN_API_M); let r=await m?.handle?.(req,env,url,cors); if(r) return r; }
        if(path.startsWith('/api/ai')||path.startsWith('/api/t2i')){
          let r=await AI_API.handle(req,env,url,cors);
          if(r) return r;
          let m=getApi(AI_API_M); let r2=await m?.handle?.(req,env,url,cors); if(r2) return r2;
        }
      }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:cors,status:500}); }
      return new Response(JSON.stringify({error:"No handler "+path}),{headers:cors,status:404});
    }

    if(path==="/"||path==="/home") return htmlResponse(HOME_HTML,"https://rumahgadang-ai.my.id/");
    if(path.startsWith("/foto")) return htmlResponse(FOTO_HTML,"https://rumahgadang-ai.my.id/foto");
    if(path.startsWith("/video")) return htmlResponse(VIDEO_HTML,"https://rumahgadang-ai.my.id/video");
    if(path.startsWith("/ai")) return htmlResponse(AI_HTML,"https://rumahgadang-ai.my.id/ai");
    if(path.startsWith("/luar")||path.startsWith("/kantor")) return htmlResponse(LUAR_HTML,"https://rumahgadang-ai.my.id/luar");
    if(path.startsWith("/dalam")) return htmlResponse(DALAM_HTML,"https://rumahgadang-ai.my.id/dalam");
    if(path.startsWith("/akun")||path.startsWith("/profil")||path.length>2&&!["foto","video","ai","kantor","luar","dalam","akun","api","sitemap","robots"].includes(path.split("/")[1])) {
      return htmlResponse(AKUN_HTML,"https://rumahgadang-ai.my.id/akun");
    }
    return htmlResponse(HOME_HTML,"https://rumahgadang-ai.my.id/");
  }
};
