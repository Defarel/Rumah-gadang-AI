// file: ./ai/index.js - RUMAH GADANG AI - TANPA SAMBUTAN, BOS
export const AI_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - AI Assistant</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;height:100vh;position:relative;overflow:hidden;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6);display:flex;flex-direction:column}
.bg-container{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}
.bg-container img{width:100%;height:100%;object-fit:cover;display:block}
.overlay-dark{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:2}
.top-bar{position:absolute;top:0;left:0;width:100%;padding:16px;display:flex;justify-content:space-between;align-items:center;z-index:10}
.app-title{font-size:18px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
.floating-btn{background:rgba(0,0,0,0.75);color:#fff;border:1px solid #00ff88;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;backdrop-filter:blur(4px);box-shadow:0 0 8px rgba(0,255,136,0.4)}
.chat-container{position:relative;z-index:5;flex:1;overflow-y:auto;padding:70px 16px 150px 16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.chat-bubble{max-width:85%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.4;word-wrap:break-word;backdrop-filter:blur(6px);white-space:pre-wrap}
.chat-bubble.user{align-self:flex-end;background:rgba(0,255,136,0.85);color:#000;font-weight:600;border-bottom-right-radius:4px;box-shadow:0 0 10px rgba(0,255,136,0.4)}
.chat-bubble.ai{align-self:flex-start;background:rgba(20,20,20,0.85);color:#fff;border:1px solid #00ff88;border-bottom-left-radius:4px;box-shadow:0 0 10px rgba(0,0,0,0.6)}
.chat-bubble.ai.error{border-color:#ff4444;background:rgba(40,10,10,0.9)}
.chat-bubble.ai img{max-width:100%;border-radius:12px;margin-top:8px;display:block;cursor:pointer}
.chat-bubble.ai a{color:#00ff88}
.bottom-chat-bar{position:absolute;bottom:125px;left:0;width:100%;padding:12px 16px;display:flex;gap:10px;z-index:10;background:linear-gradient(to top, rgba(0,0,0,0.95), transparent)}
.chat-input{flex:1;background:rgba(20,20,20,0.85);border:1px solid #333;border-radius:16px;padding:14px 16px;color:#fff;font-size:14px;outline:none;backdrop-filter:blur(6px)}
.chat-input:focus{border-color:#00ff88}
.chat-input:disabled{opacity:0.6}
.chat-input::placeholder{color:#aaa}
.btn-kirim{background:#00ff88;color:#000;border:none;padding:0 20px;border-radius:16px;font-weight:900;font-size:14px;cursor:pointer;box-shadow:0 0 10px rgba(0,255,136,0.6);display:grid;place-items:center;transition:0.2s}
.btn-kirim:disabled{background:#555;color:#888;cursor:not-allowed;box-shadow:none}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#fff}
</style>
</head>
<body>
<div id="app">
  <audio id="bgMusic" src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/19966ec207201871dcc41fb70cbe82365d42d07d/ai/RumahGadangV1.m4a" loop></audio>
  <div class="bg-container">
    <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/b1cf285a7cc7b1fb782a1de136685f108adec877/ai/RumahGadangAI1.jpg" alt="Rumah Gadang AI Background">
    <div class="overlay-dark"></div>
  </div>
  <div class="top-bar">
    <div class="app-title">Rumah Gadang AI</div>
    <button class="floating-btn" id="musicBtn" onclick="toggleMusic()">🔊 RG Musik</button>
  </div>
  <div class="chat-container" id="chatBox"></div>
  <div class="bottom-chat-bar">
    <input type="text" id="userInput" class="chat-input" placeholder="Tanya atau gambarkan sesuatu..." onkeypress="handleKeyPress(event)">
    <button class="btn-kirim" id="sendBtn" onclick="handleSend()">KIRIM &rarr;</button>
  </div>
</div>
<div class="bot">
  <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
  <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
  <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
  <a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a>
  <a href="/ai" class="on">🤖<br><span style="font-size:10px">AI</span></a>
  <a href="/akun">👤<br><span style="font-size:10px">Akun</span></a>
</div>
<script>
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let sedangKirim = false;

document.addEventListener('DOMContentLoaded', () => {
  audio.play().catch(() => {
    const playOnInteraction = () => { audio.play().catch(()=>{}); document.removeEventListener('click', playOnInteraction); };
    document.addEventListener('click', playOnInteraction);
  });
});

function toggleMusic(){
  if(audio.paused){ audio.play().catch(()=>{}); musicBtn.innerHTML = "🔊 RG Musik"; }
  else { audio.pause(); musicBtn.innerHTML = "📁 RG Musik"; }
}
function handleKeyPress(e){ if(e.key === 'Enter') handleSend(); }

function getUserId(){
  try {
    let uid = localStorage.getItem('rg_user_id');
    if (!uid) {
      uid = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('rg_user_id', uid);
    }
    return uid;
  } catch(e) {
    return 'user-' + Date.now().toString(36);
  }
}

function setLoading(isLoading){
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  sedangKirim = isLoading;
  sendBtn.disabled = isLoading;
  inputEl.disabled = isLoading;
  if (!isLoading) inputEl.focus();
}

async function handleSend(){
  if (sedangKirim) return;
  const inputEl = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const prompt = inputEl.value.trim();
  if(!prompt) return;

  appendMessage(prompt, 'user');
  inputEl.value = '';
  setLoading(true);
  const loadingDiv = appendMessage('Saratonyo mandengarkan...', 'ai');
  const isImageRequest = /(gambarkan|buatkan gambar|bikin gambar|lukis|foto|image|generate|gambar|desain|buatkan|bikinin)/i.test(prompt);

  try {
    if (isImageRequest) {
      let res;
      try {
        res = await fetch('/api/ai-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt, user_id: getUserId() })
        });
      } catch(e) {
        throw new Error('Server gak bisa dihubungi Bos. Cek internet lu.');
      }
      let data = {};
      try { data = await res.json(); } catch(e) { throw new Error('Server ngasih respon aneh Bos. Coba lagi.'); }
      if (!res.ok || !data.ok || !data.id) {
        throw new Error(data.error || 'Gagal kirim ke admin Bos. Coba lagi.');
      }
      loadingDiv.textContent = 'Lagi diproses sistem, tunggu 30 - 40 detik ya Bos...';
      const id = data.id;

      let sudahDapat = false;
      let gagalBeruntun = 0;
      const cek = setInterval(async () => {
        try {
          const cekRes = await fetch('/api/ai-status?id=' + encodeURIComponent(id));
          if (!cekRes.ok) throw new Error('status gagal');
          const hasil = await cekRes.json();
          gagalBeruntun = 0;
          if (hasil.status === 'selesai') {
            sudahDapat = true;
            clearInterval(cek);
            clearTimeout(timeoutPolling);
            if (hasil.gambar && typeof hasil.gambar === 'string' && hasil.gambar.startsWith('http')) {
              loadingDiv.innerHTML = '<div>Gambar: ' + escapeHtml(prompt) + '</div><a href="' + escapeHtml(hasil.gambar) + '" target="_blank" rel="noopener"><img src="' + escapeHtml(hasil.gambar) + '" alt="Gambar dari admin"></a><div style="font-size:11px;opacity:0.7;margin-top:6px">Klik gambar buat buka full Bos</div>';
            } else if (hasil.gambar) {
              loadingDiv.textContent = hasil.gambar;
            } else {
              loadingDiv.textContent = 'Selesai Bos, tapi gambarnya kosong. Coba kirim lagi ya Bos.';
              loadingDiv.classList.add('error');
            }
            chatBox.scrollTop = chatBox.scrollHeight;
            setLoading(false);
          } else if (hasil.status === 'gak ketemu') {
            clearInterval(cek);
            clearTimeout(timeoutPolling);
            loadingDiv.textContent = 'ID-nya gak ketemu di server Bos. Coba kirim lagi ya Bos.';
            loadingDiv.classList.add('error');
            setLoading(false);
          }
        } catch(e) {
          gagalBeruntun++;
          if (gagalBeruntun >= 3) {
            clearInterval(cek);
            clearTimeout(timeoutPolling);
            loadingDiv.textContent = 'Koneksi putus pas nunggu gambar Bos. Coba kirim lagi ya Bos.';
            loadingDiv.classList.add('error');
            setLoading(false);
          }
        }
      }, 3000);

      const timeoutPolling = setTimeout(() => {
        clearInterval(cek);
        if (!sudahDapat) {
          loadingDiv.textContent = 'Admin belum bales Bos, coba kirim lagi ya Bos. Mungkin admin lagi sibuk.';
          loadingDiv.classList.add('error');
          setLoading(false);
        }
      }, 300000);
      return;
    } else {
      let res;
      try {
        res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt })
        });
      } catch(e) {
        throw new Error('Server gak bisa dihubungi Bos. Cek internet lu.');
      }
      let data = {};
      try { data = await res.json(); } catch(e) { throw new Error('Server ngasih respon aneh Bos.'); }
      if (data.reply) {
        loadingDiv.textContent = data.reply;
      } else {
        throw new Error(data.error || 'Respon tidak diketahui Bos.');
      }
    }
  } catch(e) {
    loadingDiv.textContent = e.message || 'Terjadi kesalahan Bos.';
    loadingDiv.classList.add('error');
  } finally {
    if (!isImageRequest) setLoading(false);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function escapeHtml(s){
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function appendMessage(text, sender){
  const chatBox = document.getElementById('chatBox');
  const msg = document.createElement('div');
  msg.className = 'chat-bubble ' + sender;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
</script>
</body>
</html>`;

export const AI = AI_HTML;
export default AI_HTML;
