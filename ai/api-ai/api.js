export const AI_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/ai"&&req.method==="POST"){
      let GROQ=env.GROQ_API_KEY;
      const MODELS = ["openai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"];
      let j=await req.json();
      for(let model of MODELS){
        try{
          let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},body:JSON.stringify(
            {model:model,messages:[
              {role:"system",content:"KAMU: Rumah Gadang AI, dibuat oleh Tim Rumah Gadang AI. ATURAN: Jawab SINGKAT PADAT max 40 kata, langsung inti jawaban, JANGAN pakai tabel, JANGAN penjelasan panjang, JANGAN basa-basi, JANGAN markdown berat."},
              {role:"user",content:j.prompt}
            ],temperature:0.3,max_tokens:120})});
          let d=await r.json(); 
          if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:cors});
        }catch(e){ continue; }
      }
      return new Response(JSON.stringify({reply:"Error AI Bos"}),{headers:cors});
    }
    return null;
  }
}
