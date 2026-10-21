<!DOCTYPE html>
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
#tawkBtn{background:#22c55e!important;color:#000!important}
#tawkchat-container, iframe[title="chat widget"]{bottom:12px!important;right:12px!important;top:auto!important}
</style>
</head>
<body>
<div class="bg"></div>
<div id="top"><h1>Rumah Gadang <span>AI</span></h1></div>
<div class="topBtns">
  <button id="musicBtn">🔊 RG Musik</button>
  <button id="tawkBtn">💬 Tanyo Bundo</button>
</div>
<audio id="bgMusic" loop playsinline><source src="./RumahGandangV1.m4a" type="audio/mp4"></audio>
<div class="container"><div id="chat"><div class="msg ai"></div></div></div>
<div class="bar"><input id="inp" placeholder="Tanya Rumah Gadang AI..."><button id="send">KIRIM →</button></div>
<script>
let m=document.getElementById('bgMusic'); m.volume=0.5;
document.getElementById('musicBtn').addEventListener('click',()=>{ if(m.paused){m.play();document.getElementById('musicBtn').innerText='🔊 ON';}else{m.pause();document.getElementById('musicBtn').innerText='🔇 Play';} });
document.getElementById('tawkBtn').addEventListener('click',()=>{ if(window.Tawk_API && Tawk_API.maximize){ Tawk_API.maximize(); } else { window.open('https://tawk.to/chat/6abeaea3624a113448328e9c/1k3sdkbra','_blank'); } });
document.getElementById('send').addEventListener('click',kirim);
let img=new Image(); img.src='./RumahGadangAI.jpg';
img.onerror=()=>{ let img2=new Image(); img2.src='./RumahGadangAI1.jpg'; img2.onload=()=>{document.querySelector('.bg').style.backgroundImage="url('./RumahGadangAI1.jpg')";}; img2.onerror=()=>{document.querySelector('.bg').style.backgroundImage="url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000')";}; };
const DEFAULT_GROQ_KEY="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";
const MODELS=["openai/gpt-oss-20b","openai/gpt-oss-120b","qwen/qwen3-32b"];
function addMsg(h,t){let c=document.getElementById('chat');let d=document.createElement('div');d.className='msg '+t;d.innerHTML=h;c.appendChild(d);c.scrollTop=c.scrollHeight;return d;}
async function genText(q){ for(let mm of MODELS){ try{ let r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+DEFAULT_GROQ_KEY},body:JSON.stringify({model:mm,messages:[{role:'system',content:'Kamu Rumah Gadang AI'},{role:'user',content:q}]})}); let j=await r.json(); if(j.choices) return j.choices[0].message.content; }catch(e){} } throw new Error('Groq sibuk'); }
function genImage(p){let enc=encodeURIComponent(p+" masterpiece, rumah gadang minang");return `https://image.pollinations.ai/prompt/${enc}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*9999)}`;}
async function kirim(){let i=document.getElementById('inp');let q=i.value.trim();if(!q) return;addMsg(q,'user');i.value='';if(/gambar|gambarkan|lukis/i.test(q)){let c=q.replace(/gambarkan|gambar|lukis|buatkan/gi,'').trim()||'rumah gadang';let u=genImage(c);addMsg(`<b>${c}</b><br><img src="${u}" loading="lazy">`,'ai');return;}let b=addMsg('⏳...','ai');try{let a=await genText(q);b.innerHTML=a}catch(e){b.innerHTML='❌ '+e.message;}}
document.getElementById('inp').addEventListener('keydown',e=>{if(e.key==='Enter') kirim()});
</script>
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6abeaea3624a113448328e9c/1k3sdkbra';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
</body>
</html>
