// file: ./ai/index.js - AI BISA NGOMONG + DENGER, BOS
// Teks -> Suara via /api/voice (ElevenLabs)
// Suara -> Teks via /api/stt (ElevenLabs)
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
.top-bar{position:absolute;top:0;left:0;width:100%;padding:16px;display:flex;justify-content:space-between;align-items:center;z-index:10;gap:8px}
.app-title{font-size:18px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
.floating-btn{background:rgba(0,0,0,0.75);color:#fff;border:1px solid #00ff88;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;backdrop-filter:blur(4px);box-shadow:0 0 8px rgba(0,255,136,0.4)}
.floating-btn.on{background:#00ff88;color:#000}
.floating-btn.rec{background:#ff4444;color:#fff;border-color:#ff4444;animation:blink 1s infinite}
@keyframes blink{50%{opacity:.6}}
.chat-container{position:relative;z-index:5;flex:1;overflow-y:auto;padding:70px 16px 150px 16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.chat-bubble{max-width:85%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.4;word-wrap:break-word;backdrop-filter:blur(6px);white-space:pre-wrap}
.chat-bubble.user{align-self:flex-end;background:rgba(0,255,136,0.85);color:#000;font-weight:600;border-bottom-right-radius:4px;box-shadow:0 0 10px rgba(0,255,136,0.4)}
.chat-bubble.ai{align-self:flex-start;background:rgba(20,20,20,0.85);color:#fff;border:1px solid #00ff88;border-bottom-left-radius:4px;box-shadow:0 0 10px rgba(0,0,0,0.6)}
.chat-bubble.ai.error{border-color:#ff4444;background:rgba(40,10,10,0.9)}
.chat-bubble.ai img{max-width:100%;border-radius:12px;margin-top:8px;display:block;cursor:zoom-in}
.chat-bubble.ai a{color:#00ff88}
.bubble-actions{margin-top:8px;display:flex;gap:8px}
.speak-btn{background:rgba(0,255,136,.15);border:1px solid #00ff88;color:#00ff88;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer}
.speak-btn:disabled{opacity:.5}
.speak-btn.playing{background:#00ff88;color:#000}
.voice-row{position:relative;z-index:5;padding:62px 16px 0;display:flex;gap:8px;align-items:center}
.voice-row select{flex:1;background:rgba(20,20,20,.9);border:1px solid #00ff88;color:#fff;padding:8px 10px;border-radius:12px;font-size:12px;outline:none}
.voice-row label{font-size:11px;opacity:.8;white-space:nowrap}
.bottom-chat-bar{position:absolute;bottom:125px;left:0;width:100%;padding:12px 16px;display:flex;gap:8px;z-index:10;background:linear-gradient(to top, rgba(0,0,0,0.95), transparent)}
.chat-input{flex:1;background:rgba(20,20,20,0.85);border:1px solid #333;border-radius:16px;padding:14px 16px;color:#fff;font-size:14px;outline:none;backdrop-filter:blur(6px)}
.chat-input:focus{border-color:#00ff88}
.chat-input:disabled{opacity:0.6}
.chat-input::placeholder{color:#aaa}
.btn-kirim{background:#00ff88;color:#000;border:none;padding:0 16px;border-radius:16px;font-weight:900;font-size:14px;cursor:pointer;box-shadow:0 0 10px rgba(0,255,136,0.6);display:grid;place-items:center;transition:0.2s}
.btn-kirim:disabled{background:#555;color:#888;cursor:not-allowed;box-shadow:none}
.btn-mic{background:#222;color:#fff;border:1px solid #00ff88;border-radius:16px;padding:0 14px;font-size:18px;cursor:pointer}
.btn-mic.rec{background:#ff4444;border-color:#ff4444;animation:blink 1s infinite}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#fff}
#lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9999;display:none;flex-direction:column}
#lightbox.open{display:flex}
.lb-top{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;gap:10px}
.lb-title{font-size:13px;font-weight:700;opacity:0.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
.lb-actions{display:flex;gap:8px;flex-shrink:0}
.lb-btn{background:#00ff88;color:#000;border:none;padding:9px 14px;border-radius:20px;font-size:13px;font-weight:900;cursor:pointer}
.lb-btn.close{background:#222;color:#fff;border:1px solid #555}
.lb-body{flex:1;display:flex;align-items:center;justify-content:center;padding:8px 12px 16px;overflow:hidden}
.lb-body img{max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;touch-action:pinch-zoom}
.lb-hint{text-align:center;font-size:11px;opacity:0.6;padding:0 0 12px}
</style>
</head>
<body>
<div id="app">
  <audio id="bgMusic" src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/19966ec207201871dcc41fb70cbe82365d42d07d/ai/RumahGadangV1.m4a" loop></audio>
  <audio id="voiceAudio" style="display:none"></audio>
  <div class="bg-container">
    <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/b1cf285a7cc7b1fb782a1de136685f108adec877/ai/RumahGadangAI1.jpg" alt="Rumah Gadang AI Background">
    <div class="overlay-dark"></div>
  </div>
  <div class="top-bar">
    <div class="app-title">Rumah Gadang AI</div>
    <button class="floating-btn" id="autoSpeakBtn" onclick="toggleAutoSpeak()">🔊 Auto Ngomong: OFF</button>
    <button class="floating-btn" id="musicBtn" onclick="toggleMusic()">🔊 RG Musik</button>
  </div>
  <div class="voice-row">
    <label>🎙️ Suara AI:</label>
    <select id="voiceSelect"><option value="21m00Tcm4TlvDq8ikWAM">Loading suara...</option></select>
  </div>
  <div class="chat-container" id="chatBox"></div>
  <div class="bottom-chat-bar">
    <button class="btn-mic" id="micBtn" onclick="toggleMic()" title="Ngomong">🎤</button>
    <input type="text" id="userInput" class="chat-input" placeholder="Tanya, ngomong, atau gambarkan..." onkeypress="handleKeyPress(event)">
    <button class="btn-kirim" id="sendBtn" onclick="handleSend()">KIRIM &rarr;</button>
  </div>
</div>

<div id="lightbox">
  <div class="lb-top">
    <div class="lb-title" id="lbTitle">Gambar dari Admin</div>
    <div class="lb-actions">
      <button class="lb-btn" onclick="downloadGambar()">⬇ Download</button>
      <button class="lb-btn close" onclick="tutupGambar()">✕ Tutup</button>
    </div>
  </div>
  <div class="lb-body" onclick="tutupGambar()">
    <img id="lbImg" src="" alt="Gambar full" onclick="event.stopPropagation()">
  </div>
  <div class="lb-hint">rumah gadang AI</div>
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
const voiceAudio = document.getElementById('voiceAudio');
let sedangKirim = false;
let gambarAktif = '';
let judulAktif = 'Gambar dari Admin';
let lightboxKebuka = false;
let autoSpeak = false;
let mediaRecorder = null;
let rekamanChunks = [];
let sedangRekam = false;
let sedangNgomong = false;

document.addEventListener('DOMContentLoaded', () => {
  audio.play().catch(() => {
    const playOnInteraction = () => { audio.play().catch(()=>{}); document.removeEventListener('click', playOnInteraction); };
    document.addEventListener('click', playOnInteraction);
  });
  loadVoices();
  // Sapaan awal, Bos. Tapi jangan auto-play sebelum user klik, biar gak diblok browser.
  appendMessage('Halo Dunsanak! Selamat datang di Rumah Gadang AI. Pencet 🎤 buat ngomong, atau ketik aja. Pencet 🔊 Auto Ngomong biar AI langsung jawab pakai suara.', 'ai');
});

function toggleMusic(){
  if(audio.paused){ audio.play().catch(()=>{}); musicBtn.innerHTML = "🔊 RG Musik"; }
  else { audio.pause(); musicBtn.innerHTML = "📁 RG Musik"; }
}
function handleKeyPress(e){ if(e.key === 'Enter') handleSend(); }

function toggleAutoSpeak(){
  autoSpeak = !autoSpeak;
  const btn = document.getElementById('autoSpeakBtn');
  btn.textContent = autoSpeak ? '🔊 Auto Ngomong: ON' : '🔊 Auto Ngomong: OFF';
  btn.classList.toggle('on', autoSpeak);
  if(autoSpeak) ngomong('Auto ngomong aktif, Dunsanak. Sekarang AI akan jawab pakai suara.');
}

function getVoiceId(){
  const sel = document.getElementById('voiceSelect');
  return sel ? sel.value : '21m00Tcm4TlvDq8ikWAM';
}

async function loadVoices(){
  const sel = document.getElementById('voiceSelect');
  try{
    const r = await fetch('/api/voices');
    const d = await r.json();
    if(d.ok && d.voices && d.voices.length){
      sel.innerHTML = '';
      d.voices.slice(0,20).forEach(v=>{
        const o = document.createElement('option');
        o.value = v.voice_id;
        o.textContent = (v.name || 'Suara') + (v.labels && v.labels.gender ? ' - ' + v.labels.gender : '');
        sel.appendChild(o);
      });
      // Default: cari Rachel / cewek, Bos.
      const rachel = [...sel.options].find(o=>o.text.toLowerCase().includes('rachel'));
      if(rachel) sel.value = rachel.value;
    } else {
      sel.innerHTML = '<option value="21m00Tcm4TlvDq8ikWAM">Rachel - Cewek (Default)</option><option value="pNInz6obpgDQGcFmaJgB">Adam - Cowok</option><option value="EXAVITQu4vr4xnSDxMaL">Bella - Cewek</option>';
    }
  }catch(e){
    sel.innerHTML = '<option value="21m00Tcm4TlvDq8ikWAM">Rachel - Cewek (Default)</option><option value="pNInz6obpgDQGcFmaJgB">Adam - Cowok</option>';
  }
}

// === AI NGOMONG, BOS ===
async function ngomong(teks, btn){
  if(!teks || sedangNgomong) return;
  // Matikan musik latar biar suara AI jelas, Bos.
  const musikJalan = !audio.paused;
  if(musikJalan) audio.pause();
  try{
    if(btn){ btn.disabled = true; btn.classList.add('playing'); btn.textContent = '⏸️ Lagi Ngomong...'; }
    sedangNgomong = true;
    const res = await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: teks.slice(0,1000), voice_id: getVoiceId() })
    });
    if(!res.ok) throw new Error('Voice gagal Bos');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    voiceAudio.src = url;
    await voiceAudio.play();
    voiceAudio.onended = ()=>{
      sedangNgomong = false;
      if(musikJalan) audio.play().catch(()=>{});
      if(btn){ btn.disabled = false; btn.classList.remove('playing'); btn.textContent = '🔊 Dengarkan'; }
      URL.revokeObjectURL(url);
    };
  }catch(e){
    sedangNgomong = false;
    if(musikJalan) audio.play().catch(()=>{});
    if(btn){ btn.disabled = false; btn.classList.remove('playing'); btn.textContent = '🔊 Dengarkan'; }
    alert('Gagal ngomong Bos: ' + e.message);
  }
}

// === MIC - NGOMONG JADI TEKS, BOS ===
async function toggleMic(){
  const micBtn = document.getElementById('micBtn');
  if(sedangRekam){
    // Stop, Bos.
    try{ mediaRecorder.stop(); }catch(e){}
    sedangRekam = false;
    micBtn.classList.remove('rec');
    micBtn.textContent = '🎤';
    return;
  }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rekamanChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e=>{ if(e.data.size>0) rekamanChunks.push(e.data); };
    mediaRecorder.onstop = async ()=>{
      stream.getTracks().forEach(t=>t.stop());
      const blob = new Blob(rekamanChunks, { type: 'audio/webm' });
      if(blob.size < 1000){ alert('Suaranya kekecilan Bos, coba lagi agak lama.'); return; }
      micBtn.textContent = '⏳';
      try{
        const form = new FormData();
        form.append('audio', blob, 'rekaman.webm');
        const r = await fetch('/api/stt', { method: 'POST', body: form });
        const d = await r.json();
        if(d.ok && d.text){
          document.getElementById('userInput').value = d.text;
          handleSend();
        } else {
          alert('Gagal denger Bos: ' + (d.error || 'coba lagi'));
        }
      }catch(e){ alert('Gagal kirim suara Bos: ' + e.message); }
      micBtn.textContent = '🎤';
    };
    mediaRecorder.start();
    sedangRekam = true;
    micBtn.classList.add('rec');
    micBtn.textContent = '⏹️';
  }catch(e){
    alert('Mic gak bisa dibuka Bos. Izinin mic di browser dulu ya. ' + e.message);
  }
}

// === BUKA FULL + TAMBAH 1 HISTORY PALSU, BOS ===
function bukaGambar(url, judul){
  gambarAktif = url || '';
  judulAktif = judul || 'Gambar dari Admin';
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const title = document.getElementById('lbTitle');
  img.src = gambarAktif;
  title.textContent = judulAktif;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (!lightboxKebuka) {
    lightboxKebuka = true;
    try { history.pushState({ lightbox: true }, '', location.href); } catch(e) {}
  }
}
function tutupGambar(){
  if (!lightboxKebuka) return;
  if (history.state && history.state.lightbox) { history.back(); return; }
  tutupGambarLangsung();
}
function tutupGambarLangsung(){
  lightboxKebuka = false;
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.getElementById('lbImg').src = '';
  document.body.style.overflow = '';
}
window.addEventListener('popstate', () => { if (lightboxKebuka) tutupGambarLangsung(); });

async function downloadGambar(){
  if (!gambarAktif) return;
  try {
    const res = await fetch(gambarAktif);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rumah-gadang-ai-' + Date.now() + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
  } catch(e) { window.open(gambarAktif, '_blank'); }
}
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') tutupGambar(); });

function getUserId(){
  try {
    let uid = localStorage.getItem('rg_user_id');
    if (!uid) {
      uid = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('rg_user_id', uid);
    }
    return uid;
  } catch(e) { return 'user-' + Date.now().toString(36); }
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
      } catch(e) { throw new Error('Server gak bisa dihubungi Bos. Cek internet lu.'); }
      let data = {};
      try { data = await res.json(); } catch(e) { throw new Error('Server ngasih respon aneh Bos. Coba lagi.'); }
      if (!res.ok || !data.ok || !data.id) throw new Error(data.error || 'Gagal kirim ke admin Bos. Coba lagi.');
      loadingDiv.textContent = 'Lagi diproses sistem, tunggu 30 - 40 detik';
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
              const safeUrl = escapeHtml(hasil.gambar);
              const safePrompt = escapeHtml(prompt);
              loadingDiv.innerHTML = '<div>Gambar: ' + safePrompt + '</div><img src="' + safeUrl + '" alt="Gambar dari admin" onclick="bukaGambar(\\'' + safeUrl + '\\', \\'Gambar: ' + safePrompt + '\\')"><div style="font-size:11px;opacity:0.7;margin-top:6px">Klik gambar buat liat full</div>';
              if(autoSpeak) ngomong('Gambarnyo sudah jadi, Dunsanak. Silakan dilihat.');
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
      } catch(e) { throw new Error('Server gak bisa dihubungi Bos. Cek internet lu.'); }
      let data = {};
      try { data = await res.json(); } catch(e) { throw new Error('Server ngasih respon aneh Bos.'); }
      if (data.reply) {
        loadingDiv.textContent = data.reply;
        // Tombol dengarkan, Bos.
        const btn = document.createElement('button');
        btn.className = 'speak-btn';
        btn.textContent = '🔊 Dengarkan';
        btn.onclick = ()=> ngomong(data.reply, btn);
        const wrap = document.createElement('div');
        wrap.className = 'bubble-actions';
        wrap.appendChild(btn);
        loadingDiv.appendChild(wrap);
        if(autoSpeak) ngomong(data.reply);
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
