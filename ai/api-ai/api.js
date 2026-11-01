// FIX: pakai esm.sh biar gak perlu npm install di HP
import { withPayment } from 'https://esm.sh/mppx';

export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const path = url.pathname.toLowerCase();

    if (path === "/api/t2i" && req.method === "POST") {
      try {
        let { prompt, model } = await req.json().catch(()=>({}));
        model = model || "krea/krea-2-medium-turbo";
        prompt = (prompt||"").trim();
        if(!prompt) return new Response(JSON.stringify({error:"prompt kosong"}),{status:400,headers:cors});

        let walletKey = (env.API_T2I || "").trim(); // ini gk_iU2v... kamu
        if(!walletKey) return new Response(JSON.stringify({error:"API_T2I belum set"}),{status:500,headers:cors});

        // Ini yang bayar 402 otomatis
        const fetchWithPayment = withPayment(fetch, {
          privateKey: walletKey,
        });

        let r = await fetchWithPayment("https://api.glianalabs.com/v1/infer",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model,prompt})
        });

        // Sekarang harusnya 200 + gambar, bukan 402 lagi
        let ct = r.headers.get("content-type")||"";
        if(ct.startsWith("image/")){
          return new Response(r.body, {
            status: 200,
            headers: {"Content-Type": ct, "Access-Control-Allow-Origin":"*", "Cache-Control":"public, max-age=86400"}
          });
        }

        let text = await r.text();
        return new Response(text, {status:r.status,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});

      } catch(e){
        return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors});
      }
    }

    if (path === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      let GROQ_KEY = (env.GROQ_API_KEY||"").trim();
      for(let m of ["openai/gpt-oss-120b","llama-3.3-70b-versatile"]){
        try{
          let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},body:JSON.stringify({model:m,messages:[{role:"system",content:"KAMU: Rumah Gadang AI"},{role:"user",content:prompt}],max_tokens:400})});
          let d=await r.json(); if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
        }catch{}
      }
      return new Response(JSON.stringify({reply:"Groq error"}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    return null;
  }
};
export default AI_API;
