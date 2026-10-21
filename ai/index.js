export const AI_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RUMAH GADANG AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#000;color:#fff;height:100dvh;overflow:hidden}
.bg{position:fixed;inset:0;background:url('https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangAI1.jpg') center / cover no-repeat;z-index:-2}
.overlay{position:fixed;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75));z-index:-1}
#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:rgba(0,0,0,0.65);border-bottom:2px solid #00ff88;z-index:10;backdrop-filter:blur(8px)}
#header img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;box-shadow:0 0 12px #00ff88}
#chat{position:absolute;top:54px;bottom:130px;left:0;right:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:84%;padding:12px 14px;border-radius:18px;font-size:14px;line-height:1.5}
.user{align-self:flex-end;background:#00ff88;color:#000;font-weight:800}
.ai{align-self:flex-start;background:rgba(15,15,15,0.9);border:1px solid #00ff8833}
#inputBar{position:fixed;bottom:62px;left:0;right:0;padding:10px;background:rgba(0,0,0,0.9);border-top:1px solid #222;display:flex;gap:8px;z-index:20}
#inp{flex:1;background:#111;color:#fff;border:1.5px solid #00ff88;border-radius:24px;height:46px;padding:0 16px;outline:none}
#send{background:#00ff88;color:#000;font-weight:900;border:0;height:46px;padding:0 22px;border-radius:24px;cursor:pointer;box-shadow:0 0 12px #00ff88}
#musicBar{position:fixed;top:62px;right:8px;z-index:30;display:flex;gap:6px}
.miniBtn{background:#000;border:1.5px solid #00ff88;color:#00ff88;padding:7px 13px;border-radius:20px;font-size:12px;font-weight:900;cursor:pointer}
.miniBtn.on{background:#00ff88;color:#000;box-shadow:0 0 15px #00ff88}
.bot{position:fixed;bottom:0;left:0;right:0;height:62px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:40}
.bot a{flex:1;text-align:center;padding:6px 0;color:#666;text-decoration:none;font-size:18px}
.bot a span{font-size:10px;display:block}
.bot a.on{color:#00ff88}
</style>
</head>
<body>
<div class="bg"></div><div class="overlay"></div>
<div id="header"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangAI1.jpg"><b>RUMAH GADANG AI</b></div>
<div id="musicBar"><button id="mBtn" class="miniBtn" onclick="toggle()">🔊 Musik</button><button class="miniBtn" onclick="location.href='/'">🏠</button></div>

<audio id="aud" loop preload="auto" playsinline>
  <source src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/ai/RumahGadangV1.m4a" type="audio/mp4">
  <source src="https://files.catbox.moe/inn4zw.m4a" type="audio/mp4">
</audio>

<div id="chat"><div class="bubble ai">Halo Dunsanak! 👋 Langsung layar depan Bos! Tap mana aja Bos biar musik hidup!</div></div>
<div id="inputBar"><input id="inp" placeholder="Tanya Rumah Gadang AI..."><button id="send">KIRIM</button></div>
<div class="bot"><a href="/">🏠<br><span>Home</span></a><a href="/foto">🖼️<br><span>Foto</span></a><a href="/video">🎬<br><span>Video</span></a><a href="/kantor">🏢<br><span>Kantor</span></a><a href="/ai" class="on">🤖<br><span>AI</span></a><a href="/akun">👤<br><span>Akun</span></a></div>

<script>
const chat=document.getElementById('chat'), inp=document.getElementById('inp'), send=document.getElementById('send'), aud=document.getElementById('aud'), mBtn=document.getElementById('mBtn');
aud.volume=0.8; let on=false;
function bubble(t,x){let d=document.createElement('div');d.className='bubble '+t;d.innerText=x;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;}
function setOn(){on=true;mBtn.innerText='🔊 ON';mBtn.classList.add('on');}
function setOff(){on=false;mBtn.innerText='🔇 OFF';mBtn.classList.remove('on');}
async function tryPlay(){try{await aud.play();setOn();return true;}catch(e){return false;}}
function toggle(){if(on){aud.pause();setOff();}else{tryPlay();}}
// AUTO KE DEPAN BOS - COBA LANGSUNG + TAP DIMANA AJA LANGSUNG HIDUP BOS
window.addEventListener('load',()=>{tryPlay();});
let first=true;
function firstTouch(){if(first){first=false;tryPlay();}}
document.addEventListener('click',firstTouch);
document.addEventListener('touchstart',firstTouch,{passive:true});
document.addEventListener('keydown',firstTouch);

async function kirim(){let p=inp.value.trim();if(!p)return;bubble('user',p);inp.value='';tryPlay();let ld=document.createElement('div');ld.className='bubble ai';ld.innerText='Mikir...';chat.appendChild(ld);chat.scrollTop=chat.scrollHeight;try{let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});let j=await r.json();ld.remove();bubble('ai',j.reply||j.error||'Error Bos');}catch(e){ld.remove();bubble('ai','Error: '+e.message);}}
send.onclick=kirim; inp.onkeydown=e=>{if(e.key==='Enter')kirim();};
</script>
</body>
</html>`;
