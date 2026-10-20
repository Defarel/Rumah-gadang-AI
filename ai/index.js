export const AI_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RUMAH GADANG AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;color:#fff;background:#000;height:100vh;overflow:hidden}
.bg{position:fixed;inset:0;background:url('https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangAI1.jpg') center/cover no-repeat;filter:brightness(0.55);z-index:-2}
.overlay{position:fixed;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85));z-index:-1}
#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:rgba(0,0,0,0.7);border-bottom:1px solid #222;z-index:10}
#header img{width:32px;height:32px;border-radius:50%;object-fit:cover}
#header b{font-size:14px}
#chat{position:absolute;top:54px;bottom:132px;left:0;right:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:82%;padding:11px 14px;border-radius:16px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}
.user{align-self:flex-end;background:#22c55e;color:#000;font-weight:600;border-bottom-right-radius:4px}
.ai{align-self:flex-start;background:rgba(40,40,40,0.9);border:1px solid #333;border-bottom-left-radius:4px}
#inputBar{position:fixed;bottom:62px;left:0;right:0;padding:10px 12px;background:rgba(0,0,0,0.9);border-top:1px solid #222;display:flex;flex-direction:column;gap:8px;z-index:20}
#row{display:flex;gap:8px}
#inp{flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:24px;height:46px;padding:0 16px;outline:none;font-size:15px}
#send{background:#22c55e;color:#000;font-weight:900;border:none;height:46px;padding:0 20px;border-radius:24px;cursor:pointer;min-width:80px}
#musicBar{position:fixed;top:60px;right:10px;z-index:30;display:flex;gap:6px}
.miniBtn{background:rgba(0,0,0,0.8);border:1px solid #22c55e;color:#22c55e;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:700}
.miniBtn.on{background:#22c55e;color:#000}
.bot{position:fixed;bottom:0;left:0;right:0;height:62px;background:#000;border-top:1px solid #333;display:flex;z-index:40}
.bot a{flex:1;text-align:center;padding:6px 0;color:#888;text-decoration:none;font-size:18px;line-height:1.1}
.bot a span{font-size:10px;display:block;color:#888}
.bot a.on{color:#fff}
.bot a.on span{color:#fff}
</style>
</head>
<body>
<div class="bg"></div>
<div class="overlay"></div>

<div id="header">
  <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangAI1.jpg" onerror="this.src='https://i.ibb.co/r2gL8YJB/1791014451654.jpg'">
  <b>RUMAH GADANG AI</b>
</div>

<div id="musicBar">
  <button id="musicBtn" class="miniBtn">🔇 Musik OFF</button>
  <button class="miniBtn" onclick="location.href='/'">🏠 Home</button>
</div>

<audio id="bgMusic" loop preload="auto" crossorigin="anonymous">
  <source src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangV1.m4a" type="audio/mp4">
</audio>

<div id="chat">
  <div class="bubble ai">Halo Dunsanak! 👋 Saya Rumah Gadang AI. Tanya pakai bahasa indonesia dulu ya, masih dalam tahap pengembangan ke bahasa minang</div>
</div>

<div id="inputBar">
  <div id="row">
    <input id="inp" placeholder="Tanya ke rumah gadang AI...">
    <button id="send">KIRIM</button>
  </div>
</div>

<div class="bot">
<a href="/">🏠<br><span>Home</span></a>
<a href="/foto">🖼️<br><span>Foto</span></a>
<a href="/video">🎬<br><span>Video</span></a>
<a href="/kantor">🏢<br><span>Kantor</span></a>
<a href="/ai" class="on">🤖<br><span>AI</span></a>
<a href="/akun">👤<br><span>Akun</span></a>
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

musicBtn.onclick = (e) => {
  e.stopPropagation();
  if(music.paused){
    music.play().then(()=>{ 
      musicBtn.innerText='🔊 Musik ON'; 
      musicBtn.classList.add('on'); 
    }).catch((err)=>{ 
      addBubble('ai','Klik lagi Bos, browser masih blokir audio: ' + err.message); 
    });
  } else {
    music.pause(); 
    musicBtn.innerText='🔇 Musik OFF'; 
    musicBtn.classList.remove('on');
  }
};

async function kirim(){
  const prompt = inp.value.trim();
  if(!prompt) return;
  addBubble('user', prompt);
  inp.value = '';
  const loading = document.createElement('div');
  loading.className = 'bubble ai';
  loading.innerText = 'Rumah Gadang AI mikir dulu...';
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;
  try{
    const r = await fetch('/api/ai',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({prompt})
    });
    const j = await r.json();
    loading.remove();
    addBubble('ai', j.reply || 'Maaf dunsanak, AI error');
  }catch(e){
    loading.remove();
    addBubble('ai','Error koneksi: ' + e.message);
  }
}

sendBtn.onclick = kirim;
inp.onkeydown = e => { if(e.key==='Enter') kirim(); };
<\/script>
</body>
</html>`;
