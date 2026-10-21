const AI_LOGO = "https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@main/ai/RumahGadangAI1.jpg";
const AI_MUSIK = "https://files.catbox.moe/inn4zw.m4a";

export const AI_HTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RUMAH GADANG AI</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;height:100dvh;overflow:hidden}.bg{position:fixed;inset:0;background:url('${AI_LOGO}') center/cover no-repeat;z-index:-2}.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:-1}#header{position:fixed;top:0;left:0;right:0;height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;background:#000;border-bottom:2px solid #00ff88;z-index:10}#chat{position:absolute;top:56px;bottom:132px;left:0;right:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}.bubble{max-width:85%;padding:12px;border-radius:18px;font-size:14px}.user{align-self:flex-end;background:#00ff88;color:#000;font-weight:800}.ai{align-self:flex-start;background:#111;border:1px solid #00ff88}#inputBar{position:fixed;bottom:62px;left:0;right:0;padding:10px;background:#000;display:flex;gap:8px;z-index:20}#inp{flex:1;background:#111;color:#fff;border:1.5px solid #00ff88;border-radius:24px;height:48px;padding:0 16px}#send{background:#00ff88;color:#000;font-weight:900;border:0;height:48px;padding:0 22px;border-radius:24px}.bot{position:fixed;bottom:0;left:0;right:0;height:62px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:40}.bot a{flex:1;text-align:center;padding:6px 0;color:#666;text-decoration:none}.bot a.on{color:#00ff88}#playBtn{position:fixed;top:60px;right:10px;z-index:30;background:#00ff88;color:#000;border:0;padding:12px 20px;border-radius:25px;font-weight:900;box-shadow:0 0 20px #00ff88;cursor:pointer}</style></head><body>
<div class="bg"></div><div class="overlay"></div>
<div id="header"><img src="${AI_LOGO}" style="width:34px;height:34px;border-radius:50%;border:2px solid #00ff88"><b>RUMAH GADANG AI</b></div>
<button id="playBtn" onclick="playMusic()">▶️ PLAY MUSIK</button>
<audio id="aud" loop><source src="${AI_MUSIK}" type="audio/mp4"></audio>
<div id="chat"><div class="bubble ai">Halo Bos! Tap PLAY MUSIK Bos di kanan atas Bos! Link Catbox lu aman Bos!</div></div>
<div id="inputBar"><input id="inp" placeholder="Tanya AI..."><button id="send">KIRIM</button></div>
<div class="bot"><a href="/">🏠</a><a href="/foto">🖼️</a><a href="/video">🎬</a><a href="/kantor">🏢</a><a href="/ai" class="on">🤖</a><a href="/akun">👤</a></div>
<script>
const aud=document.getElementById('aud'),btn=document.getElementById('playBtn');
let on=false;
async function playMusic(){
  try{
    if(on){ aud.pause(); on=false; btn.innerText='▶️ PLAY MUSIK'; }
    else{ aud.volume=1; await aud.play(); on=true; btn.innerText='⏸️ PAUSE'; }
  }catch(e){ alert('Error Bos: '+e.message+' - Coba tap lagi Bos!'); }
}
document.getElementById('send').onclick=async()=>{
  let p=document.getElementById('inp').value; if(!p)return;
  let c=document.getElementById('chat'); c.innerHTML+='<div class=bubble user>'+p+'</div>';
  let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
  let j=await r.json(); c.innerHTML+='<div class=bubble ai>'+(j.reply||j.error)+'</div>'; c.scrollTop=c.scrollHeight;
};
<\/script></body></html>`;
