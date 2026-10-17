export const AI_HTML = `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{color:#fff;font-family:sans-serif;height:100vh;display:flex;flex-direction:column;background:#000}
.bg{position:fixed;top:0;left:0;width:100vw;height:100vh;background:url('./RumahGadangAI.jpg') center/cover no-repeat;z-index:-1}
#top{position:fixed;top:14px;left:18px;z-index:50;text-align:left;pointer-events:none}
#top h1{font-size:19px;font-weight:900;text-shadow:0 2px 10px #000}
#top span{color:#22c55e}
.container{max-width:800px;margin:0 auto;width:100%;padding-top:22px;background:transparent!important}
#chat{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;background:transparent!important;padding:12px;padding-top:60px;padding-bottom:240px;justify-content:flex-start}
.msg{padding:11px 14px;border-radius:14px;max-width:85%;line-height:1.6;font-size:14px;white-space:pre-wrap}
.msg.user{align-self:flex-end;background:#166534;color:#fff}
.msg.ai{align-self:flex-start;background:#2d333b;color:#e6edf3;border:1px solid #444c56}
.msg.ai img{width:100%;max-width:380px;border-radius:12px;margin-top:8px;display:block}
.bar{position:fixed;bottom:95px;left:50%;transform:translateX(-50%);width:92%;max-width:760px;display:flex;gap:8px;background:rgba(0,0,0,0.85);border:1px solid #333;padding:8px;border-radius:14px;z-index:98}
#inp{flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:10px;height:52px;padding:0 16px;outline:none;font-size:16px}
#send{background:#22c55e;color:#000;font-weight:900;border:none;height:52px;padding:0 22px;border-radius:10px;cursor:pointer}
.topBtns{position:fixed;top:10px;right:10px;z-index:999999!important;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:auto!important}
.topBtns button{pointer-events:auto!important;background:rgba(0,0,0,0.8);border:1px solid #22c55e;color:#22c55e;padding:10px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:700;min-width:130px}
#musicBtn{background:#22c55e!important;color:#000!important;border:1px solid #22c55e!important}
</style>
</head>
<body>
<div class="bg"></div>
<div id="top"><h1>Rumah Gadang <span>AI</span></h1></div>
<div class="topBtns">
  <button id="musicBtn">🔊 RG Musik</button>
</div>
<audio id="bgMusic" loop playsinline><source src="./RumahGadangV1.m4a" type="audio/mp4"></audio>
<div class="container"><div id="chat"><div class="msg ai">Halo Dunsanak Bos! Tanya soal Rumah Gadang, adat Minang, musik masih ON Bos!</div></div></div>
<div class="bar"><input id="inp" placeholder="Tanya Rumah Gadang AI..."><button id="send">KIRIM →</button></div>
<script>
let m=document.getElementById('bgMusic'); m.volume=0.5;
document.getElementById('musicBtn').addEventListener('click',()=>{
  if(m.paused){ m.play(); document.getElementById('musicBtn').innerText='🔊 Musik ON'; }
  else{ m.pause(); document.getElementById('musicBtn').innerText='🔇 Musik OFF'; }
});
document.getElementById('send').addEventListener('click',kirim);
document.getElementById('inp').addEventListener('keydown',e=>{ if(e.key==='Enter') kirim(); });
let img=new Image(); img.src='./RumahGadangAI.jpg';
img.onerror=()=>{
  let img2=new Image(); img2.src='./RumahGadangAI1.jpg';
  img2.onload=()=>{ document.querySelector('.bg').style.backgroundImage="url('./RumahGadangAI1.jpg')"; };
  img2.onerror=()=>{ document.querySelector('.bg').style.backgroundImage="url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000')"; };
};
function addMsg(who,text){
  let c=document.getElementById('chat');
  let d=document.createElement('div');
  d.className='msg '+who;
  d.innerText=text;
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}
async function kirim(){
  let inp=document.getElementById('inp');
  let p=inp.value.trim();
  if(!p) return;
  addMsg('user', p);
  inp.value='';
  try{
    let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
    let j=await r.json();
    addMsg('ai', j.reply||'Error Bos');
  }catch(e){ addMsg('ai','Error koneksi Bos'); }
}
<\/script>
</body></html>`;
