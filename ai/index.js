export const AI_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>RUMAH GADANG AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#000;color:#fff;height:100dvh;overflow:hidden}
/* GAMBAR 9:16 FULL BOS */
.bg{position:fixed;inset:0;background:url('https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg') center top / cover no-repeat;z-index:-3}
.bg::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,0.15)}
.overlay{position:fixed;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%);z-index:-2}
#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:rgba(0,0,0,0.7);border-bottom:1px solid #00ff8822;z-index:10;backdrop-filter:blur(10px)}
#header img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;box-shadow:0 0 10px #00ff88}
#chat{position:absolute;top:54px;bottom:130px;left:0;right:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:85%;padding:12px 15px;border-radius:18px;font-size:14px;line-height:1.5;word-break:break-word}
.user{align-self:flex-end;background:#00ff88;color:#000;font-weight:700;border-bottom-right-radius:6px;box-shadow:0 0 15px rgba(0,255,136,.3)}
.ai{align-self:flex-start;background:rgba(20,20,20,0.9);border:1px solid #333;border-bottom-left-radius:6px;backdrop-filter:blur(10px)}
#inputBar{position:fixed;bottom:62px;left:0;right:0;padding:10px 12px;background:rgba(0,0,0,0.9);border-top:1px solid #222;display:flex;gap:8px;z-index:20}
#inp{flex:1;background:#111;color:#fff;border:1.5px solid #00ff88;border-radius:24px;height:46px;padding:0 16px;outline:none;font-size:15px}
#send{background:#00ff88;color:#000;font-weight:900;border:none;height:46px;padding:0 22px;border-radius:24px;cursor:pointer;box-shadow:0 0 15px #00ff88}
#musicBar{position:fixed;top:64px;right:8px;z-index:30;display:flex;gap:6px;flex-direction:column;align-items:flex-end}
.miniBtn{background:rgba(0,0,0,0.85);border:1.5px solid #00ff88;color:#00ff88;padding:8px 14px;border-radius:22px;font-size:12px;cursor:pointer;font-weight:900;box-shadow:0 0 10px rgba(0,255,136,.3)}
.miniBtn.on{background:#00ff88;color:#000;box-shadow:0 0 20px #00ff88}
#bigMusicTap{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,0.85);display:grid;place-items:center;cursor:pointer}
#bigMusicTap.hidden{display:none}
.bot{position:fixed;bottom:0;left:0;right:0;height:62px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:40}
.bot a{flex:1;text-align:center;padding:6px 0;color:#666;text-decoration:none;font-size:18px}
.bot a span{font-size:10px;display:block}
.bot a.on{color:#00ff88;text-shadow:0 0 8px #00ff88}
</style>
</head>
<body>
<div class="bg"></div><div class="overlay"></div>

<div id="bigMusicTap" onclick="startMusic()">
  <div style="text-align:center;background:#111;border:2px solid #00ff88;padding:28px 22px;border-radius:24px;box-shadow:0 0 30px #00ff88">
    <div style="font-size:50px">🎵</div>
    <div style="font-size:18px;font-weight:900;margin:10px 0;color:#00ff88">TAP UNTUK HIDUPIN MUSIK + AI</div>
    <div style="font-size:12px;color:#888">Rumah Gadang AI 9:16 Full</div>
    <div style="margin-top:14px;background:#00ff88;color:#000;padding:12px 22px;border-radius:20px;font-weight:900;display:inline-block">TAP DISINI BOS!</div>
  </div>
</div>

<div id="header"><img src="https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg"><b>RUMAH GADANG AI</b><span style="font-size:10px;color:#00ff88;margin-left:auto">9:16 FULL 1:1</span></div>

<div id="musicBar">
  <button id="musicBtn" class="miniBtn" onclick="toggleMusic()">🔇 Musik OFF</button>
  <button class="miniBtn" onclick="location.href='/'">🏠 Home</button>
</div>

<audio id="bgMusic" loop preload="auto" playsinline crossorigin="anonymous">
  <source src="https://files.catbox.moe/inn4zw.m4a" type="audio/mp4">
  <source src="https://files.catbox.moe/inn4zw.m4a" type="audio/x-m4a">
</audio>

<div id="chat"><div class="bubble ai">Halo Dunsanak! 👋 Tap layar Bos biar musik hidup! Tanya apa aja Bos, AI udah fix!</div></div>

<div id="inputBar"><input id="inp" placeholder="Tanya ke Rumah Gadang AI..."><button id="send">KIRIM</button></div>

<div class="bot">
<a href="/">🏠<br><span>Home</span></a>
<a href="/foto">🖼️<br><span>Foto</span></a>
<a href="/video">🎬<br><span>Video</span></a>
<a href="/kantor">🏢<br><span>Kantor</span></a>
<a href="/ai" class="on">🤖<br><span>AI</span></a>
<a href="/akun">👤<br><span>Akun</span></a>
</div>

<script>
const chat=document.getElementById('chat');
const inp=document.getElementById('inp');
const sendBtn=document.getElementById('send');
const music=document.getElementById('bgMusic');
const musicBtn=document.getElementById('musicBtn');
const bigTap=document.getElementById('bigMusicTap');
music.volume=0.8;
let playing=false;

function addBubble(t,txt){const d=document.createElement('div');d.className='bubble '+t;d.innerText=txt;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;}

function setOn(){playing=true;musicBtn.innerText='🔊 Musik ON';musicBtn.classList.add('on');}
function setOff(){playing=false;musicBtn.innerText='🔇 Musik OFF';musicBtn.classList.remove('on');}

async function startMusic(){
  try{
    await music.play();
    setOn();
    bigTap.classList.add('hidden');
  }catch(e){
    // coba lagi tanpa await Bos
    music.play().then(()=>{setOn();bigTap.classList.add('hidden');}).catch(()=>{addBubble('ai','Bos tap lagi tombol musik di kanan atas Bos, Chrome blok Bos!');});
  }
}
async function toggleMusic(){
  if(playing){music.pause();setOff();}
  else{await startMusic();}
}

// AI CHAT
async function kirim(){
  const p=inp.value.trim();if(!p)return;
  addBubble('user',p);inp.value='';
  if(!playing) music.play().catch(()=>{});
  const ld=document.createElement('div');ld.className='bubble ai';ld.innerText='Rumah Gadang AI mikir...';chat.appendChild(ld);chat.scrollTop=chat.scrollHeight;
  try{
    const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
    const j=await r.json();
    ld.remove();
    if(j.reply){addBubble('ai',j.reply);}
    else{addBubble('ai','Error: '+(j.error||'AI Bos'));}
  }catch(e){ld.remove();addBubble('ai','Error konek: '+e.message);}
}
sendBtn.onclick=kirim;
inp.onkeydown=e=>{if(e.key==='Enter')kirim();};
</script>
</body>
</html>`;
