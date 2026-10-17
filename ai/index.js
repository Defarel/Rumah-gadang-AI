export const AI_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RUMAH GADANG AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;color:#fff;background:#000;height:100vh;overflow:hidden}
.bg{position:fixed;inset:0;background:url('/ai/RumahGadangAI1.jpg') center/cover no-repeat;filter:brightness(0.55);z-index:-2}
.overlay{position:fixed;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85));z-index:-1}
#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:rgba(0,0,0,0.7);border-bottom:1px solid #222;z-index:10}
#header img{width:32px;height:32px;border-radius:50%}
#header b{font-size:14px}
#chat{position:absolute;top:54px;bottom:148px;left:0;right:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:82%;padding:11px 14px;border-radius:16px;font-size:14px;line-height:1.5;white-space:pre-wrap}
.user{align-self:flex-end;background:#22c55e;color:#000;font-weight:600;border-bottom-right-radius:4px}
.ai{align-self:flex-start;background:rgba(40,40,40,0.9);border:1px solid #333;border-bottom-left-radius:4px}
#inputBar{position:fixed;bottom:60px;left:0;right:0;padding:10px 12px;background:rgba(0,0,0,0.9);border-top:1px solid #222;display:flex;flex-direction:column;gap:8px;z-index:20}
#row{display:flex;gap:8px}
#inp{flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:24px;height:46px;padding:0 16px;outline:none;font-size:15px}
#send{background:#22c55e;color:#000;font-weight:900;border:none;height:46px;padding:0 20px;border-radius:24px;cursor:pointer;min-width:80px}
#musicBar{position:fixed;top:60px;right:10px;z-index:30;display:flex;gap:6px}
.miniBtn{background:rgba(0,0,0,0.8);border:1px solid #22c55e;color:#22c55e;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:700}
.miniBtn.on{background:#22c55e;color:#000}
#bottomNav{position:fixed;bottom:0;left:0;right:0;height:56px;background:#000;border-top:1px solid #222;display:flex;justify-content:space-around;align-items:center;z-index:40}
#bottomNav span{font-size:20px}
</style>
</head>
<body>
<div class="bg"></div>
<div class="overlay"></div>

<div id="header">
  <img src="/ai/RumahGadangAI1.jpg">
  <b>RUMAH GADANG AI</b>
</div>

<div id="musicBar">
  <button id="musicBtn" class="miniBtn">🔊 RG Musik</button>
  <button class="miniBtn" onclick="location.href='/'">🏠 Home</button>
</div>

<audio id="bgMusic" loop preload="auto"><source src="/ai/RumahGadangV1.m4a" type="audio/mp4"></audio>

<div id="chat">
  <div class="bubble ai">Halo Dunsanak Bos! 👋 Saya Rumah Gadang AI. Tanyo seputar adat Minang, Rumah Gadang, atau apo se Bos. Musik adat lah aktif Bos!</div>
</div>

<div id="inputBar">
  <div id="row">
    <input id="inp" placeholder="Tulis sesuatu...">
    <button id="send">KIRIM</button>
  </div>
</div>

<div id="bottomNav">
  <span>🏠</span><span>🖼️</span><span>📊</span><span>🎥</span><span>👤</span>
</div>

<script>
const chat = document.getElementById('chat');
const inp = document.getElementById('inp');
const sendBtn = document.getElementById('send');
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
music.volume = 0.6;

function addBubble(type, text){
  const d = document.createElement('div');
  d.className = 'bubble ' + type;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

musicBtn.onclick = () => {
  if(music.paused){
    music.play().then(()=>{ musicBtn.innerText='🔊 Musik ON'; musicBtn.classList.add('on'); }).catch(()=>{ addBubble('ai','Bos klik sekali lagi buat aktifin musik Bos, browser blokir autoplay Bos!'); });
  } else {
    music.pause(); musicBtn.innerText='🔇 Musik OFF'; musicBtn.classList.remove('on');
  }
};

async function kirim(){
  const prompt = inp.value.trim();
  if(!prompt) return;
  addBubble('user', prompt);
  inp.value = '';
  addBubble('ai','Rumah Gadang AI mikir dulu Bos...');
  try{
    const r = await fetch('/api/ai',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({prompt})
    });
    const j = await r.json();
    chat.lastChild.remove();
    addBubble('ai', j.reply || 'Maaf Bos, AI error');
  }catch(e){
    chat.lastChild.remove();
    addBubble('ai','Error koneksi Bos: ' + e.message);
  }
}

sendBtn.onclick = kirim;
inp.onkeydown = e => { if(e.key==='Enter') kirim(); };

// Auto coba putar musik setelah interaksi pertama
document.body.addEventListener('click',()=>{ if(music.paused && !musicBtn.classList.contains('on')){ music.play().catch(()=>{}); } },{once:true});
</script>
</body>
</html>`;
