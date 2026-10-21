export const AI_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RUMAH GADANG AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;color:#fff;background:#000;height:100vh;overflow:hidden}
.bg{position:fixed;inset:0;background:url('https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg') center/cover no-repeat;filter:brightness(0.55);z-index:-2}
.overlay{position:fixed;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.88));z-index:-1}
#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:rgba(0,0,0,0.75);border-bottom:1px solid #222;z-index:10}
#header img{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1px solid #00ff88}
#chat{position:absolute;top:54px;bottom:132px;left:0;right:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:84%;padding:11px 14px;border-radius:16px;font-size:14px;line-height:1.5;white-space:pre-wrap}
.user{align-self:flex-end;background:#22c55e;color:#000;font-weight:600;border-bottom-right-radius:4px}
.ai{align-self:flex-start;background:rgba(30,30,30,0.92);border:1px solid #333;border-bottom-left-radius:4px}
#inputBar{position:fixed;bottom:62px;left:0;right:0;padding:10px 12px;background:rgba(0,0,0,0.95);border-top:1px solid #222;display:flex;gap:8px;z-index:20}
#inp{flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:24px;height:46px;padding:0 16px;outline:none;font-size:15px}
#send{background:#22c55e;color:#000;font-weight:900;border:none;height:46px;padding:0 20px;border-radius:24px;cursor:pointer;min-width:80px}
#musicBar{position:fixed;top:60px;right:10px;z-index:30;display:flex;gap:6px}
.miniBtn{background:rgba(0,0,0,0.8);border:1px solid #22c55e;color:#22c55e;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:700}
.miniBtn.on{background:#22c55e;color:#000;box-shadow:0 0 8px #22c55e}
.bot{position:fixed;bottom:0;left:0;right:0;height:62px;background:#000;border-top:1px solid #333;display:flex;z-index:40}
.bot a{flex:1;text-align:center;padding:6px 0;color:#888;text-decoration:none;font-size:18px}
.bot a span{font-size:10px;display:block}
.bot a.on{color:#fff}
</style>
</head>
<body>
<div class="bg"></div><div class="overlay"></div>
<div id="header"><img src="https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg"><b>RUMAH GADANG AI</b></div>
<div id="musicBar"><button id="musicBtn" class="miniBtn">🎵 Tap buat musik Bos</button><button class="miniBtn" onclick="location.href='/'">🏠 Home</button></div>

<audio id="bgMusic" loop preload="auto" playsinline><source src="https://files.catbox.moe/inn4zw.m4a" type="audio/mp4"></audio>

<div id="chat"><div class="bubble ai">Halo Dunsanak! 👋 Saya Rumah Gadang AI. Tap layar Bos biar musik Rumah Gadang hidup!</div></div>
<div id="inputBar"><div style="display:flex;gap:8px;width:100%"><input id="inp" placeholder="Tanya ke rumah gadang AI..."><button id="send">KIRIM</button></div></div>
<div class="bot"><a href="/">🏠<br><span>Home</span></a><a href="/foto">🖼️<br><span>Foto</span></a><a href="/video">🎬<br><span>Video</span></a><a href="/kantor">🏢<br><span>Kantor</span></a><a href="/ai" class="on">🤖<br><span>AI</span></a><a href="/akun">👤<br><span>Akun</span></a></div>
<script>
const chat = document.getElementById('chat');
const inp = document.getElementById('inp');
const sendBtn = document.getElementById('send');
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
music.volume = 0.7;
let isMusicPlaying = false;

function addBubble(t, txt){ const d=document.createElement('div'); d.className='bubble '+t; d.innerText=txt; chat.appendChild(d); chat.scrollTop=chat.scrollHeight; }
function setMusicOn(){ isMusicPlaying=true; musicBtn.innerText='🔊 Musik ON'; musicBtn.classList.add('on'); }
function setMusicOff(){ isMusicPlaying=false; musicBtn.innerText='🔇 Musik OFF'; musicBtn.classList.remove('on'); }

async function tryPlay(){
  try{
    music.muted=false;
    await music.play();
    setMusicOn();
    return true;
  }catch(e){ 
    console.log('blok autoplay Bos',e);
    musicBtn.innerText='🎵 Tap layar buat hidupin musik';
    return false;
  }
}

// 1. Listener pertama Bos - Chrome wajib interaksi Bos
let firstDone=false;
async function firstTouch(){
  if(firstDone) return;
  firstDone=true;
  await tryPlay();
  document.removeEventListener('click', firstTouch);
  document.removeEventListener('touchstart', firstTouch);
  document.removeEventListener('keydown', firstTouch);
}
document.addEventListener('click', firstTouch);
document.addEventListener('touchstart', firstTouch, {passive:true});
document.addEventListener('keydown', firstTouch);

// 2. Tombol manual ON/OFF Bos
musicBtn.onclick = async (e)=>{
  e.stopPropagation();
  if(isMusicPlaying){ music.pause(); setMusicOff(); }
  else { await tryPlay(); firstDone=true; }
};

async function kirim(){
  const p=inp.value.trim(); if(!p) return;
  addBubble('user',p); inp.value='';
  // nyalain musik pas kirim Bos biar pasti hidup Bos
  if(!isMusicPlaying) tryPlay();
  const ld=document.createElement('div'); ld.className='bubble ai'; ld.innerText='Rumah Gadang AI mikir dulu...'; chat.appendChild(ld); chat.scrollTop=chat.scrollHeight;
  try{
    const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
    const j=await r.json(); ld.remove(); addBubble('ai', j.reply || 'Maaf error Bos');
  }catch(e){ ld.remove(); addBubble('ai','Error: '+e.message); }
}
sendBtn.onclick=kirim;
inp.onkeydown=e=>{ if(e.key==='Enter') kirim(); };
</script>
</body>
</html>`;

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
