import { withPayment } from 'https://esm.sh/mppx';

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

        // Bayar 402 otomatis pakai saldo $0.96
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

export default AI_API;
