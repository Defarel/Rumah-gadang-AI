export const AI_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/ai"&&req.method==="POST"){
      let GROQ=env.GROQ_API_KEY; // KUNCI NYA DI SINI DOANG BOS, GAK NYAMPUR!
      const MODELS = ["openai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"];
      let j=await req.json();
      for(let model of MODELS){
        try{
          let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ},body:JSON.stringify({model:model,messages:[{role:"system",content:"KAMU ADALAH: Rumah Gadang AI. DIBUAT OLEH: Tim Rumah Gadang AI di Padang."},{role:"user",content:j.prompt}],temperature:0.7,max_tokens:500})});
          let d=await r.json(); if(d.choices?.[0]?.message?.content) return new Response(JSON.stringify({reply:d.choices[0].message.content}),{headers:cors});
        }catch(e){ continue; }
      }
      return new Response(JSON.stringify({reply:"Error AI Bos"}),{headers:cors});
    }
    return null;
  }
}
