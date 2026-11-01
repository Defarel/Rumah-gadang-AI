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
.overlay-dark{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2}
.top-bar{position:absolute;top:0;left:0;width:100%;padding:12px;display:flex;justify-content:space-between;align-items:center;z-index:10;flex-wrap:wrap;gap:6px}
.app-title{font-size:16px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
.btn-group{display:flex;gap:6px}
.floating-btn{background:rgba(0,0,0,0.8);color:#fff;border:1px solid #00ff88;padding:6px 10px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px;backdrop-filter:blur(4px)}
.floating-btn.on{background:#00ff88;color:#000}
.chat-container{position:relative;z-index:5;flex:1;overflow-y:auto;padding:70px 12px 160px 12px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.chat-bubble{max-width:85%;padding:10px 14px;border-radius:18px;font-size:13px;line-height:1.4;word-wrap:break-word;backdrop-filter:blur(6px)}
.chat-bubble.user{align-self:flex-end;background:rgba(0,255,136,0.9);color:#000;font-weight:600;border-bottom-right-radius:4px}
.chat-bubble.ai{align-self:flex-start;background:rgba(20,20,20,0.9);color:#fff;border:1px solid #00ff88;border-bottom-left-radius:4px}
.chat-bubble.err{align-self:flex-start;background:rgba(80,0,0,0.9);color:#ffbaba;border:1px solid #ff5555;white-space:pre-wrap}
.bottom-chat-bar{position:absolute;bottom:85px;left:0;width:100%;padding:10px 12px;display:flex;gap:8px;z-index:10;background:linear-gradient(to top, rgba(0,0,0,0.98), transparent)}
.chat-input{flex:1;background:rgba(20,20,20,0.9);border:1px solid #333;border-radius:16px;padding:12px 14px;color:#fff;font-size:13px;outline:none}
.chat-input:focus{border-color:#00ff88}
.btn-icon{background:#222;color:#fff;border:1px solid #00ff88;padding:0 12px;border-radius:16px;font-size:18px;cursor:pointer}
.btn-icon.on{background:#00ff88;color:#000;animation:pulse 1s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(0,255,136,0.7)}70%{box-shadow:0 0 0 10px rgba(0,255,136,0)}100%{box-shadow:0 0 0 0 rgba(0,255,136,0)}}
.btn-kirim{background:#00ff88;color:#000;border:none;padding:0 16px;border-radius:16px;font-weight:900;font-size:13px;cursor:pointer}
.btn-kirim:disabled{background:#555;color:#888}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:8px 0;color:#666;text-decoration:none;font-size:18px}
.bot a.on{color:#fff}
.img-result{max-width:100%;border-radius:12px;margin-top:8px;border:1px solid #00ff88;display:block}
</style>
</head>
<body>
<div id="app">
  <audio id="bgMusic" src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/19966ec207201871dcc41fb70cbe82365d42d07d/ai/RumahGadangV1.m4a" loop></audio>
  <div class="bg-container">
    <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/b1cf285a7cc7b1fb782a1de136685f108adec877/ai/RumahGadangAI1.jpg" alt="BG">
    <div class="overlay-dark"></div>
  </div>
  <div class="top-bar">
    <div class="app-title">Rumah Gadang AI</div>
    <div class="btn-group">
      <button class="floating-btn" id="musicBtn" onclick="toggleMusic()">🔊 Musik</button>
      <button class="floating-btn" id="voiceBtn" onclick="toggleVoice()">🔈 Suara AI: OFF</button>
    </div>
  </div>
  <div class="chat-container" id="chatBox">
    <div class="chat-bubble ai">Halo sanak! 👋 Ambo Rumah Gadang AI.\\n\\n🎤 Klik mic buat ngomong\\n🔊 Aktifkan Suara AI biar ambo basuara\\n🎨 Ketik "Gambarkan monas" buat gambar</div>
  </div>
  <div class="bottom-chat-bar">
    <button class="btn-icon" id="micBtn" onclick="toggleMic()">🎤</button>
    <input type="text" id="userInput" class="chat-input" placeholder="Tanya atau Gambarkan..." onkeypress="if(event.key==='Enter')handleSend()">
    <button class="btn-kirim" id="sendBtn" onclick="handleSend()">KIRIM</button>
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
const voiceBtn = document.getElementById('voiceBtn');
const micBtn = document.getElementById('micBtn');
let voiceEnabled = false;
let recognition = null;
let isListening = false;

// === MUSIK RG ===
function toggleMusic(){
  if(audio.paused){ audio.play().catch(()=>{}); musicBtn.textContent = "🔊 Musik"; musicBtn.classList.add('on'); }
  else { audio.pause(); musicBtn.textContent = "🔇 Musik"; musicBtn.classList.remove('on'); }
}
document.addEventListener('DOMContentLoaded', () => {
  audio.volume = 0.4;
  audio.play().catch(() => {
    const p = () => { audio.play(); document.removeEventListener('click', p); };
    document.addEventListener('click', p);
  });
});

// === SUARA AI (Text to Speech) ===
function toggleVoice(){
  voiceEnabled = !voiceEnabled;
  if(voiceEnabled){
    voiceBtn.textContent = "🔊 Suara AI: ON";
    voiceBtn.classList.add('on');
    speakText("Suara AI aktif sanak!");
  } else {
    voiceBtn.textContent = "🔈 Suara AI: OFF";
    voiceBtn.classList.remove('on');
    speechSynthesis.cancel();
  }
}
function speakText(text){
  if(!voiceEnabled) return;
  speechSynthesis.cancel();
  // Potong text biar gak kepanjangan ngomongnya
  let clean = text.replace(/\\[.*?\\]/g,'').replace(/https?:\\/\\/\\S+/g,'').slice(0,300);
  let u = new SpeechSynthesisUtterance(clean);
  u.lang = 'id-ID';
  u.rate = 1.0;
  u.pitch = 1.0;
  // Cari suara Indonesia kalau ada
  let voices = speechSynthesis.getVoices();
  let idVoice = voices.find(v=>v.lang.includes('id')||v.lang.includes('ID'));
  if(idVoice) u.voice = idVoice;
  speechSynthesis.speak(u);
}

// === MIC (Speech to Text) ===
function toggleMic(){
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    alert('Browser HP kamu belum support mic. Pakai Chrome Android terbaru sanak.');
    return;
  }
  if(isListening){
    recognition.stop();
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('on');
    micBtn.textContent = '🔴';
    document.getElementById('userInput').placeholder = 'Mendengarkan...';
  };
  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('on');
    micBtn.textContent = '🎤';
    document.getElementById('userInput').placeholder = 'Tanya atau Gambarkan...';
  };
  recognition.onresult = (e) => {
    let transcript = e.results[0][0].transcript;
    document.getElementById('userInput').value = transcript;
    handleSend();
  };
  recognition.onerror = (e) => {
    isListening = false;
    micBtn.classList.remove('on');
    micBtn.textContent = '🎤';
  };
  recognition.start();
}

function handleKeyPress(e){ if(e.key === 'Enter') handleSend(); }

async function handleSend(){
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatBox = document.getElementById('chatBox');
  const prompt = inputEl.value.trim();
  if(!prompt) return;

  const isImageRequest = /gambark|buat.*gambar|bikin.*gambar|lukis|desain|foto|monas|rumah gadang|image|picture/i.test(prompt);

  appendMessage(prompt, 'user');
  inputEl.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = "...";
  const loadingDiv = appendMessage(isImageRequest ? 'Ambo gambar dulu sanak... 🎨' : 'Saratonyo mandengarkan...', 'ai');

  try {
    if(isImageRequest){
      const res = await fetch('/api/t2i', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt, model: "krea/krea-2-medium-turbo" })
      });
      const data = await res.json();
      if(data.image){
        loadingDiv.innerHTML = '<div><b>Gambar:</b> '+prompt+'</div><img class="img-result" src="'+data.image+'" onload="document.getElementById(\\'chatBox\\').scrollTop=999999"><div style="margin-top:6px;font-size:10px;opacity:0.6">'+data.model+'</div>';
        speakText('Ini gambar ' + prompt + ' sanak');
      } else {
        loadingDiv.className = 'chat-bubble err';
        loadingDiv.textContent = 'Gagal gambar: ' + JSON.stringify(data).slice(0,800);
      }
    } else {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });
      const data = await res.json();
      if(data.reply){
        loadingDiv.textContent = data.reply;
        speakText(data.reply);
      } else {
        loadingDiv.className = 'chat-bubble err';
        loadingDiv.textContent = JSON.stringify(data).slice(0,800);
      }
    }
  } catch(e) {
    loadingDiv.className = 'chat-bubble err';
    loadingDiv.textContent = "Gagal: " + e.message;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "KIRIM";
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
