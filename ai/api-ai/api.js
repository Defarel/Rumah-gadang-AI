export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const path = url.pathname.toLowerCase();

    if (path === "/api/ai" && req.method === "POST") {
      let { prompt } = await req.json().catch(()=>({}));
      let GROQ_KEY = (env.GROQ_API_KEY||"").trim();
      for(let m of ["openai/gpt-oss-120b","llama-3.3-70b-versatile"]){
        try{
          let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},body:JSON.stringify({model:m,messages:[{role:"system",content:"KAMU: Rumah Gadang AI"},{role:"user",content:prompt}],max_tokens:400})});
          let d=await r.json(); if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content,model:m}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
        }catch{}
      }
      return new Response(JSON.stringify({reply:"Groq error"}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }

    if (path === "/api/t2i" && req.method === "POST") {
      let { prompt, model } = await req.json().catch(()=>({}));
      model = model || "krea/krea-2-medium-turbo";
      prompt = (prompt||"").trim();
      let T2I_KEY = (env.API_T2I||"").trim();
      if(!T2I_KEY) return new Response(JSON.stringify({ok:false,error:"API_T2I belum set"}),{status:500,headers:cors});
      
      let r = await fetch("https://api.glianalabs.com/v1/infer",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+T2I_KEY},
        body:JSON.stringify({model,prompt})
      });

      // Jika Glia langsung kasih gambar binary, teruskan langsung sebagai gambar
      let ct = r.headers.get("content-type")||"";
      if(ct.startsWith("image/")){
        return new Response(r.body, {
          status: 200,
          headers: {
            "Content-Type": ct,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=86400"
          }
        });
      }

      // Jika JSON, ambil URL/Base64 nya dan redirect
      let d = await r.json().catch(async()=>({raw:await r.text()}));
      let img = d.image_url || d.url || d.image || d.output || d.images?.[0] || null;
      if(d.b64_json) img = `data:image/png;base64,${d.b64_json}`;
      
      if(img){
        if(img.startsWith("http")){
          let imgRes = await fetch(img);
          return new Response(imgRes.body, {
            headers: {"Content-Type": imgRes.headers.get("content-type")||"image/png","Access-Control-Allow-Origin":"*"}
          });
        }
        return new Response(JSON.stringify({ok:true,image:img}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
      }

      return new Response(JSON.stringify({ok:false,raw:d}),{status:500,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    return null;
  }
};
export default AI_API;
