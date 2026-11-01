export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const path = url.pathname.toLowerCase();

    // TEST HP
    if (req.method === "GET" && (path === "/api/ai" || path === "/api/t2i")) {
      return new Response(JSON.stringify({
        ok: true,
        TEXT: "pakai GROQ_API_KEY",
        IMAGE: "pakai API_T2I",
        has_GROQ: !!env.GROQ_API_KEY,
        has_T2I: !!env.API_T2I
      }), { headers: cors });
    }

    // TEXT TO TEXT - /api/ai
    if (path === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      prompt = (prompt||"").trim();
      let GROQ_KEY = (env.GROQ_API_KEY || "").trim();
      if(!GROQ_KEY) return new Response(JSON.stringify({reply:"GROQ_API_KEY belum set"}),{headers:cors});
      for (let model of ["openai/gpt-oss-120b","openai/gpt-oss-20b","llama-3.3-70b-versatile"]) {
        try {
          let r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
            body:JSON.stringify({model,messages:[{role:"system",content:"KAMU: Rumah Gadang AI Padang, ramah Minang, singkat."},{role:"user",content:prompt}],temperature:0.7,max_tokens:400})
          });
          let d = await r.json();
          if(d.choices?.[0]?.message?.content){
            return new Response(JSON.stringify({reply:d.choices[0].message.content,model}),{headers:cors});
          }
        } catch {}
      }
      return new Response(JSON.stringify({reply:"Groq error"}),{headers:cors});
    }

    // TEXT TO IMAGE - /api/t2i - PAKAI API_T2I
    if ((path === "/api/t2i" || path === "/api/gambar") && req.method === "POST") {
      let { prompt, model } = await req.json().catch(()=>({}));
      model = model || "krea/krea-2-medium-turbo";
      prompt = (prompt||"").trim();
      let T2I_KEY = (env.API_T2I || "").trim();
      if(!T2I_KEY) return new Response(JSON.stringify({error:"API_T2I belum set"}),{headers:cors,status:500});
      if(!prompt) return new Response(JSON.stringify({error:"Prompt kosong"}),{headers:cors,status:400});

      let r = await fetch("https://api.glianalabs.com/v1/infer",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+T2I_KEY},
        body:JSON.stringify({model,prompt})
      });
      let d = await r.json().catch(async()=>({text:await r.text()}));

      if(r.status===402){
        return new Response(JSON.stringify({ok:false,need_payment:true,raw:d}),{headers:cors,status:402});
      }

      let imageUrl = d.image_url || d.url || d.output || d.image || d.data?.[0]?.url || null;
      return new Response(JSON.stringify({ok:true,prompt,model,image:imageUrl,raw:d}),{headers:cors});
    }
    return null;
  }
};
export default AI_API;
