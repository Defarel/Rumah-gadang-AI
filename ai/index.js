// GAMBAR + MUSIK BOS ANTI GAGAL BOS - 2 SUMBER BOS
const AI_LOGO = "https://i.ibb.co/1Y4WwJ9M/rumah-gadang-ai.jpg";
const AI_LOGO_BACKUP = "https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangAI1.jpg";
const AI_MUSIK = "https://files.catbox.moe/inn4zw.m4a";
const AI_MUSIK_BACKUP = "https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangV1.m4a";

export const AI_HTML = `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RUMAH GADANG AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui;background:#000;color:#fff;height:100dvh;overflow:hidden}
/* BACKGROUND FULL 9:16 BOS - PAKAI IBB DULU BOS BIAR LANGSUNG MUNCUL BOS */
.bg{position:fixed;inset:0;background-color:#111;background-image:url('https://i.ibb.co/1Y4WwJ9M/rumah-gadang-ai.jpg');background-position:center;background-size:cover;background-repeat:no-repeat;z-index:-2}
.overlay{position:fixed;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.85));z-index:-1}
#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:rgba(0,0,0,0.6);border-bottom:2px solid #00ff88;z-index:10;backdrop-filter:blur(6px)}
#header img{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;box-shadow:0 0 12px #00ff88;object-fit:cover;background:#111}
#chat{position:absolute;top:56px;bottom:132px;left:0;right:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.bubble{max-width:85%;padding:12px 14px;border-radius:18px;font-size:14px;line-height:1.5}
.user{align-self:flex-end;background:#00ff88;color:#000;font-weight:800;border-bottom-right-radius:4px}
.ai{align-self:flex-start;background:rgba(0,0,0,0.85);border:1px solid #00ff8844;border-bottom-left-radius:4px}
#inputBar{position:fixed;bottom:62px;left:0;right:0;padding:10px;background:rgba(0,0,0,0.92);border-top:1px solid #222;display:flex;gap:8px;z-index:20}
#inp{flex:1;background:#151515;color:#fff;border:1.5px solid #00ff88;border-radius:24px;height:48px;padding:0 16px;outline:none}
#send{background:#00ff88;color:#000;font-weight:900;border:0;height:48px;padding:0 24px;border-radius:24px;cursor:pointer;box-shadow:0 0 15px #00ff88}
#musicBar{position:fixed;top:62px;right:8px;z-index:30;display:flex;gap:6px}
.miniBtn{background:#000;border:1.5px solid #00ff88;color:#00ff88;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:900;cursor:pointer;box-shadow:0 0 10px #00ff8855}
.miniBtn.on{background:#00ff88;color:#000;box-shadow:0 0 15px #00ff88}
.bot{position:fixed;bottom:0;left:0;right:0;height:62px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:40}
.bot a{flex:1;text-align:center;padding:6px 0;color:#666;text-decoration:none;font-size:18px}
.bot a span{font-size:10px;display:block}
.bot a.on{color:#00ff88}
</style></head><body>
<div class="bg" id="bgDiv"></div><div class="overlay"></div>
<div id="header"><img id="logoHead" src="https://i.ibb.co/1Y4WwJ9M/rumah-gadang-ai.jpg" onerror="this.src='https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangAI1.jpg'"><b>RUMAH GADANG AI</b></div>
<div id="musicBar"><button id="mBtn" class="miniBtn" onclick="toggleMusic()">🔊 Musik</button><button class="miniBtn" onclick="location.href='/'">🏠</button></div>

<audio id="aud" loop preload="auto" playsinline autoplay>
  <source src="https://files.catbox.moe/inn4zw.m4a" type="audio/mpeg">
  <source src="https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangV1.m4a" type="audio/mp4">
</audio>

<div id="chat"><div class="bubble ai">Halo Dunsanak! 👋 Gambar Full 9:16 Bos udah muncul? Tap Musik Bos di kanan atas Bos!</div></div>
<div id="inputBar"><input id="inp" placeholder="Tanya Rumah Gadang AI..."><button id="send">KIRIM</button></div>
<div class="bot"><a href="/">🏠<br><span>Home</span></a><a href="/foto">🖼️<br><span>Foto</span></a><a href="/video">🎬<br><span>Video</span></a><a href="/kantor">🏢<br><span>Kantor</span></a><a href="/ai" class="on">🤖<br><span>AI</span></a><a href="/akun">👤<br><span>Akun</span></a></div>
<script>
const chat=document.getElementById('chat'),inp=document.getElementById('inp'),send=document.getElementById('send'),aud=document.getElementById('aud'),mBtn=document.getElementById('mBtn');
const bgDiv=document.getElementById('bgDiv');
aud.volume=0.85; let isOn=false;
// FALLBACK GAMBAR BOS - KALO IBB GAGAL PAKAI GITHUB BOS
let imgTest=new Image();
imgTest.onerror=()=>{ bgDiv.style.backgroundImage="url('https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangAI1.jpg')"; document.getElementById('logoHead').src="https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangAI1.jpg"; };
imgTest.src="https://i.ibb.co/1Y4WwJ9M/rumah-gadang-ai.jpg";

function bubble(t,x){let d=document.createElement('div');d.className='bubble '+t;d.innerText=x;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;}
async function tryPlay(){try{await aud.play();isOn=true;mBtn.innerText='🔊 ON';mBtn.classList.add('on');}catch(e){console.log('need tap',e);}}
function toggleMusic(){if(isOn){aud.pause();isOn=false;mBtn.innerText='🔇 OFF';mBtn.classList.remove('on');}else{tryPlay();}}
// AUTO ULANG BOS - SETIAP TAP DIMANA AJA COBA PLAY BOS
window.addEventListener('load',()=>{ setTimeout(tryPlay,500); });
document.addEventListener('click',()=>{ if(!isOn) tryPlay(); });
document.addEventListener('touchstart',()=>{ if(!isOn) tryPlay(); },{passive:true});

async function kirim(){let p=inp.value.trim();if(!p)return;bubble('user',p);inp.value='';tryPlay();let ld=document.createElement('div');ld.className='bubble ai';ld.innerText='Mikir Bos...';chat.appendChild(ld);chat.scrollTop=chat.scrollHeight;try{let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});let j=await r.json();ld.remove();bubble('ai',j.reply||j.error||'Error');}catch(e){ld.remove();bubble('ai','Error: '+e.message);}}
send.onclick=kirim; inp.onkeydown=e=>{if(e.key==='Enter')kirim();};
<\/script></body></html>`;
