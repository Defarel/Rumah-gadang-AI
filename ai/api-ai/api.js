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

    if (path === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      prompt = (prompt||"").trim();
      let GROQ_KEY = (env.GROQ_API_KEY || "").trim();
      for (let model of ["openai/gpt-oss-120b","llama-3.3-70b-versatile"]) {
        try {
          let r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
            body:JSON.stringify({model,messages:[{role:"system",content:"KAMU: Rumah Gadang AI Padang"},{role:"user",content:prompt}],temperature:0.7,max_tokens:400})
          });
          let d = await r.json();
          if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content,model}),{headers:cors});
        } catch {}
      }
      return new Response(JSON.stringify({reply:"Groq error"}),{headers:cors});
    }

    if ((path === "/api/t2i" || path === "/api/gambar") && req.method === "POST") {
      try {
        let { prompt, model } = await req.json().catch(()=>({}));
        model = model || "krea/krea-2-medium-turbo";
        let T2I_KEY = (env.API_T2I || "").trim();
        if(!T2I_KEY) return new Response(JSON.stringify({error:"API_T2I belum set"}),{headers:cors});

        let r = await fetch("https://api.glianalabs.com/v1/infer",{
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":"Bearer "+T2I_KEY},
          body:JSON.stringify({model,prompt})
        });

        let contentType = r.headers.get("content-type") || "";

        // KASUS 1: Balik langsung gambar (binary)
        if(contentType.startsWith("image/")){
          let buf = await r.arrayBuffer();
          let base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
          let dataUrl = `data:${contentType};base64,${base64}`;
          return new Response(JSON.stringify({ok:true,prompt,model,image:dataUrl}),{headers:cors});
        }

        // KASUS 2: Balik JSON
        let d = await r.json().catch(async()=>({text:await r.text()}));
        
        // Cari semua kemungkinan field gambar dari Glia
        let imageUrl = d.image_url || d.url || d.output || d.image || d.data?.[0]?.url || d.result?.image_url || null;
        
        // Kalau ada b64_json (format OpenAI)
        if(d.b64_json){
          imageUrl = `data:image/png;base64,${d.b64_json}`;
        }
        if(d.output && typeof d.output === "string" && d.output.startsWith("data:image")){
          imageUrl = d.output;
        }
        // Kalau output base64 tanpa prefix
        if(d.output && typeof d.output === "string" && d.output.length > 500 && !d.output.startsWith("http")){
          imageUrl = `data:image/png;base64,${d.output}`;
        }

        return new Response(JSON.stringify({
          ok:true,
          prompt,
          model,
          image: imageUrl,
          raw: JSON.stringify(d).slice(0,1000) // buat debug
        }),{headers:cors});

      } catch (e) {
        return new Response(JSON.stringify({error:e.message}),{headers:cors,status:500});
      }
    }
    return null;
  }
};
export default AI_API;
