export const AI_API = {
  async handle(req, env, url, corsHeaders) {
    const cors = corsHeaders || {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    
    if(url.pathname==="/api/ai" && req.method==="POST"){
      try{
        let body=await req.json();
        let prompt=(body.prompt||"").trim();
        if(!prompt) return new Response(JSON.stringify({error:"Prompt kosong Bos"}),{headers:cors});
        
        let GROQ_KEY = env.GROQ_API_KEY || env.GROQ_KEY || "";
        if(!GROQ_KEY){
          return new Response(JSON.stringify({reply:"Bos GROQ_API_KEY belum di set di Cloudflare Dashboard Bos! Buka Workers & Pages > Settings > Variables Bos isi GROQ_API_KEY Bos!"}),{headers:cors});
        }

        // MODEL YANG BENER BOS ADA DI GROQ BOS
        const MODELS = [penai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"];

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
                  {role:"system",content:"KAMU: Rumah Gadang AI, dibuat Tim Rumah Gadang AI Padang. Gaya: Santai, ramah Minang, singkat padat max 50 kata, jawab langsung inti, jangan tabel, jangan basa-basi panjang."},
                  {role:"user",content:prompt}
                ],
                temperature:0.7,
                max_tokens:200
              })
            });
            let d=await r.json();
            if(d.error){
              console.log("Groq error model "+model+":",d.error.message);
              continue;
            }
            let content=d.choices?.[0]?.message?.content;
            if(content){
              return new Response(JSON.stringify({reply:content}),{headers:{...cors,"Content-Type":"application/json"}});
            }
          }catch(e){ console.log("fetch fail "+model,e); continue; }
        }
        return new Response(JSON.stringify({reply:"Error AI Bos semua model Groq gagal Bos, cek GROQ_API_KEY Bos valid gak Bos!"}),{headers:cors});
      }catch(e){
        return new Response(JSON.stringify({error:"Server error Bos: "+e.message}),{headers:cors});
      }
    }
    return null;
  }
}
