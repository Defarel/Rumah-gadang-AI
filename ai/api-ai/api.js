export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization","Content-Type":"application/json"};
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    
    if(url.pathname==="/api/ai" && req.method==="POST"){
      try{
        let body=await req.json();
        let prompt=(body.prompt||"").trim();
        if(!prompt) return new Response(JSON.stringify({reply:"Tanyo dulu Bos!"}),{headers:cors});

        let GROQ_KEY = env.GROQ_API_KEY || env.GROQ_KEY || "";
        if(!GROQ_KEY){
          return new Response(JSON.stringify({reply:"GROQ_API_KEY belum di set di Cloudflare Bos! Cek di dashboard > Settings > Variables"}),{headers:cors});
        }

        // MODEL YANG MASIH AKTIF DI GROQ SEKARANG - SESUAI FOTO 3 UDA BOS
        const MODELS = [
          "openai/gpt-oss-120b",
          "openai/gpt-oss-20b",
          "qwen/qwen3-32b",
          "llama-3.3-70b-versatile"
        ];

        let lastError = "";
        for(let model of MODELS){
          try{
            let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{
              method:"POST",
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+GROQ_KEY
              },
              body:JSON.stringify({
                model:model,
                messages:[
                  {role:"system",content:"KAMU: Rumah Gadang AI, asisten Minang ramah, jawab singkat padat pakai logat Minang. Kalau ditanya ibukota jawab benar."},
                  {role:"user",content:prompt}
                ],
                temperature:0.7,
                max_tokens:500
              })
            });
            let d=await r.json();
            if(d.error){
              console.log("Groq error model "+model+" => "+JSON.stringify(d.error));
              lastError = d.error.message || JSON.stringify(d.error);
              continue;
            }
            let reply = d.choices?.[0]?.message?.content || "";
            if(reply){
              return new Response(JSON.stringify({reply:reply, model:model}),{headers:cors});
            }
          }catch(e){
            console.log("Fetch error "+model+" "+e.message);
            lastError = e.message;
            continue;
          }
        }

        // Kalau semua model gagal
        return new Response(JSON.stringify({reply:"Error AI Bos, semua model Groq gagal. Detail: "+lastError+" Cek GROQ_API_KEY valid gak Bos!"}),{headers:cors});

      }catch(err){
        return new Response(JSON.stringify({reply:"Error server: "+err.message}),{headers:cors,status:500});
      }
    }
    return null;
  }
};
export const handle = AI_API.handle;
export default AI_API;
