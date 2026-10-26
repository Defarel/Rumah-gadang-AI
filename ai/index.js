export const AI_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - AI Assistant</title>
<link rel="canonical" href="https://rumahgadang-ai.my.id/ai">
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;height:100vh;position:relative;overflow:hidden;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6);display:flex;flex-direction:column}

/* Layer Latar Belakang Gambar */
.bg-container{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}
.bg-container img{width:100%;height:100%;object-fit:cover;display:block}
.overlay-dark{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:2}

/* Header & Tombol Atas */
.top-bar{position:absolute;top:0;left:0;width:100%;padding:16px;display:flex;justify-content:space-between;align-items:center;z-index:10}
.app-title{font-size:18px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
.floating-btn{background:rgba(0,0,0,0.75);color:#fff;border:1px solid #00ff88;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;backdrop-filter:blur(4px);box-shadow:0 0 8px rgba(0,255,136,0.4)}

/* Area Chat (Pesan Terkirim & Balasan AI) */
.chat-container{position:relative;z-index:5;flex:1;overflow-y:auto;padding:70px 16px 150px 16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.chat-bubble{max-width:85%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.4;word-wrap:break-word;backdrop-filter:blur(6px)}
.chat-bubble.user{align-self:flex-end;background:rgba(0,255,136,0.85);color:#000;font-weight:600;border-bottom-right-radius:4px;box-shadow:0 0 10px rgba(0,255,136,0.4)}
.chat-bubble.ai{align-self:flex-start;background:rgba(20,20,20,0.85);color:#fff;border:1px solid #00ff88;border-bottom-left-radius:4px;box-shadow:0 0 10px rgba(0,0,0,0.6)}

/* Area Input Bawah - DINAIKAN */
.bottom-chat-bar{position:absolute;bottom:125px;left:0;width:100%;padding:12px 16px;display:flex;gap:10px;z-index:10;background:linear-gradient(to top, rgba(0,0,0,0.95), transparent)}
.chat-input{flex:1;background:rgba(20,20,20,0.85);border:1px solid #333;border-radius:16px;padding:14px 16px;color:#fff;font-size:14px;outline:none;backdrop-filter:blur(6px)}
.chat-input:focus{border-color:#00ff88}
.chat-input::placeholder{color:#aaa}
.btn-kirim{background:#00ff88;color:#000;border:none;padding:0 20px;border-radius:16px;font-weight:900;font-size:14px;cursor:pointer;box-shadow:0 0 10px rgba(0,255,136,0.6);display:grid;place-items:center;transition:0.2s}
.btn-kirim:disabled{background:#555;color:#888;cursor:not-allowed;box-shadow:none}

/* Navigasi Bawah */
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#fff}
</style>
</head>
<body>
<div id="app">
  <!-- Audio Auto Play -->
  <audio id="bgMusic" src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/19966ec207201871dcc41fb70cbe82365d42d07d/ai/RumahGadangV1.m4a" autoplay loop></audio>

  <!-- Layer Latar Belakang Gambar -->
  <div class="bg-container">
    <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/b1cf285a7cc7b1fb782a1de136685f108adec877/ai/RumahGadangAI1.jpg" alt="Rumah Gadang AI Background">
    <div class="overlay-dark"></div>
  </div>

  <!-- Header -->
  <div class="top-bar">
    <div class="app-title">Rumah Gadang AI</div>
    <button class="floating-btn" id="musicBtn" onclick="toggleMusic()">🔊 RG Musik</button>
  </div>

  <!-- Area Chat Log -->
  <div class="chat-container" id="chatBox"></div>

  <!-- Input Pesan -->
  <div class="bottom-chat-bar">
    <input type="text" id="userInput" class="chat-input" placeholder="Tanya Rumah Gadang AI..." onkeypress="handleKeyPress(event)">
    <button class="btn-kirim" id="sendBtn" onclick="handleSend()">KIRIM &rarr;</button>
  </div>
</div>

<!-- Navigasi Bawah -->
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

document.addEventListener('DOMContentLoaded', () => {
  audio.play().catch(() => {
    const playOnInteraction = () => {
      audio.play();
      document.removeEventListener('click', playOnInteraction);
    };
    document.addEventListener('click', playOnInteraction);
  });
});

function toggleMusic(){
  if(audio.paused){
    audio.play();
    musicBtn.innerHTML = "🔊 RG Musik";
  } else {
    audio.pause();
    musicBtn.innerHTML = "📁 RG Musik";
  }
}

function handleKeyPress(e){
  if(e.key === 'Enter') handleSend();
}

async function handleSend(){
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatBox = document.getElementById('chatBox');
  const prompt = inputEl.value.trim();

  if(!prompt) return;

  appendMessage(prompt, 'user');
  inputEl.value = '';
  sendBtn.disabled = true;

  const loadingDiv = appendMessage('Saratonyo mandengarkan...', 'ai');

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });
    const data = await res.json();

    if(data.reply){
      loadingDiv.textContent = data.reply;
    } else if(data.error){
      loadingDiv.textContent = "Maaf Bos: " + data.error;
    } else {
      loadingDiv.textContent = "Respon tidak diketahui Bos.";
    }
  } catch(e) {
    loadingDiv.textContent = "Gagal terhubung ke AI Bos: " + e.message;
  } finally {
    sendBtn.disabled = false;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
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
