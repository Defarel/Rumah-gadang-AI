// file: ./ai/index.js - SEMUA MENU PINDAH KE ROBOT, BOS
// Musik OFF dulu. Robot di bawah kanan. Otomatis: diem -> AI balas.
// Tombol robot = logo_RG_asisten.png, Bos
// OTOMATIS BICARA: default ON, orang tanya -> AI balas langsung pakai suara
export const AI_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - AI Assistant</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/aset/logo_RG_asisten.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;height:100vh;position:relative;overflow:hidden;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6);display:flex;flex-direction:column}
.bg-container{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}
.bg-container img{width:100%;height:100%;object-fit:cover;display:block}
.overlay-dark{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:2}
.top-bar{position:absolute;top:0;left:0;width:100%;padding:16px;display:flex;justify-content:space-between;align-items:center;z-index:10}
.app-title{font-size:18px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
.chat-container{position:relative;z-index:5;flex:1;overflow-y:auto;padding:70px 16px 170px 16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.chat-bubble{max-width:85%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.4;word-wrap:break-word;backdrop-filter:blur(6px);white-space:pre-wrap}
.chat-bubble.user{align-self:flex-end;background:rgba(0,255,136,0.85);color:#000;font-weight:600;border-bottom-right-radius:4px;box-shadow:0 0 10px rgba(0,255,136,0.4)}
.chat-bubble.ai{align-self:flex-start;background:rgba(20,20,20,0.85);color:#fff;border:1px solid #00ff88;border-bottom-left-radius:4px;box-shadow:0 0 10px rgba(0,0,0,0.6)}
.chat-bubble.ai.error{border-color:#ff4444;background:rgba(40,10,10,0.9)}
.chat-bubble.ai img{max-width:100%;border-radius:12px;margin-top:8px;display:block;cursor:zoom-in}
.chat-bubble.ai a{color:#00ff88}
.bubble-actions{margin-top:8px;display:flex;gap:8px}
.speak-btn{background:rgba(0,255,136,.15);border:1px solid #00ff88;color:#00ff88;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer}
.speak-btn.playing{background:#00ff88;color:#000}
.bottom-chat-bar{position:absolute;bottom:125px;left:0;width:100%;padding:12px 16px;display:flex;gap:10px;z-index:10;background:linear-gradient(to top, rgba(0,0,0,0.95), transparent)}
.chat-input{flex:1;background:rgba(20,20,20,0.85);border:1px solid #333;border-radius:16px;padding:14px 16px;color:#fff;font-size:14px;outline:none;backdrop-filter:blur(6px)}
.chat-input:focus{border-color:#00ff88}
.chat-input:disabled{opacity:0.6}
.chat-input::placeholder{color:#aaa}
.btn-kirim{background:#00ff88;color:#000;border:none;padding:0 20px;border-radius:16px;font-weight:900;font-size:14px;cursor:pointer;box-shadow:0 0 10px rgba(0,255,136,0.6);display:grid;place-items:center}
.btn-kirim:disabled{background:#555;color:#888;cursor:not-allowed;box-shadow:none}
/* ROBOT ASISTEN - DI ATAS KIRIM, KANAN BAWAH, BOS - UDAH PAKE LOGO RG ASISTEN, BOS */
#robotBtn{position:absolute;bottom:215px;right:16px;width:68px;height:68px;border-radius:50%;background:#fff;border:3px solid #00ff88;cursor:pointer;z-index:20;box-shadow:0 0 18px rgba(0,255,136,.9);display:grid;place-items:center;overflow:hidden;padding:0}
#robotBtn img{width:100%;height:100%;object-fit:cover;display:block}
#robotBtn.aktif{border-color:#ff4444;animation:blink 1s infinite}
@keyframes blink{50%{opacity:.7}}
#robotDot{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#00ff88;border:2px solid #000;display:none}
#robotDot.on{display:block}
/* PANEL MENU ROBOT */
#robotPanel{position:absolute;bottom:255px;right:16px;left:16px;max-height:calc(100vh - 290px);overflow-y:auto;background:rgba(10,10,10,.97);border:2px solid #00ff88;border-radius:20px;padding:16px;z-index:30;display:none;box-shadow:0 0 20px rgba(0,255,136,.5)}
#robotPanel.open{display:block}
.rp-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.rp-head b{font-size:16px}
.rp-close{background:#222;color:#fff;border:1px solid #555;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer}
.rp-logo{width:76px;height:76px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;display:block;margin:0 auto 10px;background:#fff}
.rp-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #222;gap:10px}
.rp-row:last-child{border-bottom:none}
.rp-row span{font-size:14px;font-weight:700}
.rp-row small{display:block;font-size:11px;opacity:.6;font-weight:400;margin-top:2px}
.rp-toggle{background:#333;color:#fff;border:1px solid #555;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:900;cursor:pointer;min-width:70px}
.rp-toggle.on{background:#00ff88;color:#000;border-color:#00ff88}
.rp-select{flex:1;max-width:190px;background:#222;border:1px solid #00ff88;color:#fff;padding:9px 10px;border-radius:12px;font-size:12px;outline:none}
.rp-mode{display:flex;gap:8px}
.rp-mode button{background:#222;color:#fff;border:1px solid #555;padding:9px 14px;border-radius:20px;font-size:13px;font-weight:900;cursor:pointer}
.rp-mode button.on{background:#00ff88;color:#000;border-color:#00ff88}
/* MODE PILIH PESAN - BULATAN CEKLIS DI KANAN */
#pilihTop{position:absolute;top:0;left:0;width:100%;padding:16px;display:none;grid-template-columns:80px 1fr 80px;align-items:center;z-index:40;background:rgba(0,0,0,.92);border-bottom:1px solid #00ff88}
#pilihTop b{text-align:center;font-size:16px}
#pilihTop button{background:none;border:none;color:#00ff88;font-size:15px;font-weight:900;cursor:pointer;text-align:left}
#pilihBar{position:absolute;bottom:125px;left:0;width:100%;padding:12px 16px;display:none;z-index:40;background:linear-gradient(to top, rgba(0,0,0,0.95), transparent)}
#pilihHapusBtn{width:100%;background:#ff4444;color:#fff;border:none;padding:16px;border-radius:28px;font-size:16px;font-weight:900;cursor:pointer;box-shadow:0 0 12px rgba(255,68,68,.6)}
#pilihHapusBtn:disabled{background:#555;color:#999;box-shadow:none;cursor:not-allowed}
.mode-pilih #pilihTop{display:grid}
.mode-pilih #pilihBar{display:block}
.mode-pilih .bottom-chat-bar,.mode-pilih #robotBtn,.mode-pilih #robotPanel{display:none!important}
.mode-pilih .chat-bubble *{pointer-events:none}
.pilih-row{display:flex;align-items:center;gap:10px;width:100%;cursor:pointer}
.pilih-col{flex:1;min-width:0;display:flex;flex-direction:column}
.pilih-circle{width:28px;height:28px;border-radius:50%;border:2px solid #fff;flex-shrink:0;display:grid;place-items:center;font-size:16px;font-weight:900;color:#000;background:rgba(0,0,0,.4)}
.pilih-row.dipilih .pilih-circle{background:#00ff88;border-color:#00ff88}
.rp-big{width:100%;background:#00ff88;color:#000;border:none;padding:14px;border-radius:16px;font-size:15px;font-weight:900;cursor:pointer;margin-top:12px}
.rp-big.stop{background:#ff4444;color:#fff}
.rp-status{text-align:center;font-size:12px;margin-top:10px;min-height:16px;color:#00ff88}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#00ff88}
.bot a img{width:22px;height:22px;border-radius:50%;object-fit:cover;display:block;margin:0 auto}
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
  <div class="top-bar"><div class="app-title">Rumah Gadang AI</div></div>
  <div class="chat-container" id="chatBox"></div>

  <!-- ROBOT ASISTEN, BOS - UDAH PAKE LOGO RG ASISTEN, BUKAN UNGU LAGI, BOS -->
  <button id="robotBtn" onclick="toggleRobotPanel()"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/aset/logo_RG_asisten.png" alt="RG Asisten"><span id="robotDot"></span></button>

  <!-- MENU DALAM ROBOT, BOS. SEMUA FOLDER PINDAH KE SINI, BOS -->
  <div id="robotPanel">
    <img class="rp-logo" src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/aset/logo_RG_asisten.png" alt="RG Asisten">
    <div class="rp-head"><b>Asisten Rumah Gadang</b><button class="rp-close" onclick="toggleRobotPanel()">✕</button></div>

    <div class="rp-row">
      <span>🎵 RG Musik<small>Lagu OFF dulu. Klik ON baru bunyi.</small></span>
      <button class="rp-toggle" id="musikToggle" onclick="toggleMusikPanel()">OFF</button>
    </div>

    <div class="rp-row">
      <span>🔊 Otomatis Bicara<small>AI langsung jawab pakai suara.</small></span>
      <button class="rp-toggle on" id="autoToggle" onclick="toggleAutoSpeak()">ON</button>
    </div>

    <div class="rp-row">
      <span>🎙️ Nama Suara</span>
      <select class="rp-select" id="voiceSelect"><option value="21m00Tcm4TlvDq8ikWAM">Loading...</option></select>
    </div>

    <div class="rp-row">
      <span>🗣️ Mode Bicara<small>Otomatis: diem 1,5 dtk -> AI balas.<br>Manual: klik bicara / klik berhenti.</small></span>
      <div class="rp-mode">
        <button id="modeOtomatisBtn" class="on" onclick="setMode('otomatis')">Otomatis</button>
        <button id="modeManualBtn" onclick="setMode('manual')">Manual</button>
      </div>
    </div>

    <div class="rp-row">
      <span>🗑️ Hapus Chat<small>Pilih pesan, lalu hapus.</small></span>
      <button class="rp-toggle" onclick="mulaiPilih()">Pilih</button>
    </div>

    <button class="rp-big" id="bicaraBigBtn" onclick="klikBicaraUtama()">🎤 Klik Bicara</button>
    <div class="rp-status" id="rpStatus">Robot siap. Otomatis Bicara ON. Pilih mode, lalu Klik Bicara.</div>
  </div>

  <div id="pilihTop"><button onclick="keluarPilih()">Batal</button><b>Pilih Pesan</b><span></span></div>
  <div id="pilihBar"><button id="pilihHapusBtn" onclick="hapusTerpilih()" disabled>Hapus</button></div>

  <div class="bottom-chat-bar">
    <input type="text" id="userInput" class="chat-input" placeholder="Tanya atau gambarkan sesuatu..." onkeypress="handleKeyPress(event)">
    <button class="btn-kirim" id="sendBtn" onclick="handleSend()">⬆️</button>
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
  <div class="lb-body" onclick="tutupGambar()"><img id="lbImg" src="" alt="Gambar full" onclick="event.stopPropagation()"></div>
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
const voiceAudio = document.getElementById('voiceAudio');
let sedangKirim = false;
let gambarAktif = '';
let judulAktif = 'Gambar dari Admin';
let lightboxKebuka = false;

// === STATE ROBOT, BOS ===
let autoSpeak = true; // DEFAULT ON: orang tanya -> AI balas langsung bersuara
let modeBicara = 'otomatis';
let musikOn = false;
let sedangBicara = false;
let sedangNgomongAI = false;
let mediaRecorder = null;
let rekamanChunks = [];
let audioCtx = null, analyser = null, micStream = null, silenceTimer = null, rafId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadVoices();
  muatRiwayat();
  jadwalHapusTengahMalam();
});

function setStatus(t){ document.getElementById('rpStatus').textContent = t; }

function toggleRobotPanel(){
  document.getElementById('robotPanel').classList.toggle('open');
}

function toggleMusikPanel(){
  musikOn = !musikOn;
  const btn = document.getElementById('musikToggle');
  btn.textContent = musikOn ? 'ON' : 'OFF';
  btn.classList.toggle('on', musikOn);
  if(musikOn){ audio.play().catch(()=>{}); setStatus('🎵 Musik ON.'); }
  else { audio.pause(); setStatus('🎵 Musik OFF.'); }
}

function toggleAutoSpeak(){
  autoSpeak = !autoSpeak;
  const btn = document.getElementById('autoToggle');
  btn.textContent = autoSpeak ? 'ON' : 'OFF';
  btn.classList.toggle('on', autoSpeak);
  setStatus(autoSpeak ? '🔊 Otomatis Bicara ON. AI akan jawab pakai suara.' : '🔊 Otomatis Bicara OFF.');
}

function setMode(m){
  modeBicara = m;
  document.getElementById('modeOtomatisBtn').classList.toggle('on', m==='otomatis');
  document.getElementById('modeManualBtn').classList.toggle('on', m==='manual');
  setStatus(m==='otomatis' ? 'Mode Otomatis: ngomong aja, diem -> AI balas.' : 'Mode Manual: Klik Bicara, ngomong, Klik Berhenti.');
  if(sedangBicara) stopRekam(false);
}

function getVoiceId(){
  const sel = document.getElementById('voiceSelect');
  return sel ? sel.value : '21m00Tcm4TlvDq8ikWAM';
}

async function loadVoices(){
  const sel = document.getElementById('voiceSelect');
  const namaBaru = {
    "Harry": "Uda Haris - Cowok Tegas",
    "Liam": "Uda Liam - Cowok Semangat",
    "Alice": "Uni Alis - Cewek Jelas",
    "Matilda": "Uni Tilda - Cewek Pintar",
    "Will": "Uda Will - Cowok Santai",
    "Jessica": "Uni Jessi - Cewek Ceria",
    "Eric": "Uda Erik - Cowok Halus",
    "Bella": "Uni Bela - Cewek Lembut",
    "Chris": "Uda Kris - Cowok Ramah",
    "Brian": "Uda Brian - Cowok Dalam",
    "Daniel": "Uda Daniel - Cowok Penyiar",
    "Lily": "Uni Lily - Cewek Halus",
    "Adam": "Uda Adam - Cowok Tegas",
    "Rachel": "Uni Rachel - Cewek Jernih"
  };
  try{
    const r = await fetch('/api/voices');
    const d = await r.json();
    if(d.ok && d.voices && d.voices.length){
      sel.innerHTML = '';
      d.voices.slice(0,20).forEach(v=>{
        const o = document.createElement('option');
        o.value = v.voice_id;
        o.textContent = namaBaru[v.name] || v.name;
        sel.appendChild(o);
      });
    }
  }catch(e){
    sel.innerHTML = '<option value="21m00Tcm4TlvDq8ikWAM">Uni Rachel - Cewek Jernih</option><option value="pNInz6obpgDQGcFmaJgB">Uda Adam - Cowok Tegas</option>';
  }
}

async function ngomong(teks, btn){
  if(!teks) return;
  const musikJalan = !audio.paused;
  if(musikJalan) audio.pause();
  try{
    if(btn){ btn.disabled = true; btn.classList.add('playing'); btn.textContent = '⏸️ Lagi Ngomong...'; }
    sedangNgomongAI = true;
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
      sedangNgomongAI = false;
      if(musikJalan && musikOn) audio.play().catch(()=>{});
      if(btn){ btn.disabled = false; btn.classList.remove('playing'); btn.textContent = '🔊 Dengarkan'; }
      URL.revokeObjectURL(url);
      if(modeBicara==='otomatis' && sedangBicaraModeAktif){
        setTimeout(()=>{ if(sedangBicaraModeAktif) startRekam(); }, 300);
      }
    };
  }catch(e){
    sedangNgomongAI = false;
    if(musikJalan && musikOn) audio.play().catch(()=>{});
    if(btn){ btn.disabled = false; btn.classList.remove('playing'); btn.textContent = '🔊 Dengarkan'; }
  }
}

let sedangBicaraModeAktif = false;

function klikBicaraUtama(){
  const big = document.getElementById('bicaraBigBtn');
  if(sedangBicaraModeAktif){
    sedangBicaraModeAktif = false;
    big.textContent = '🎤 Klik Bicara';
    big.classList.remove('stop');
    document.getElementById('robotBtn').classList.remove('aktif');
    document.getElementById('robotDot').classList.remove('on');
    stopRekam(false);
    setStatus('Bicara OFF. Robot berhenti dengerin.');
    return;
  }
  sedangBicaraModeAktif = true;
  big.textContent = '⏹️ Klik OFF - Berhenti';
  big.classList.add('stop');
  document.getElementById('robotBtn').classList.add('aktif');
  document.getElementById('robotDot').classList.add('on');
  if(modeBicara==='otomatis' && !autoSpeak) toggleAutoSpeak();
  setStatus(modeBicara==='otomatis' ? '🎤 Dengerin... Ngomong aja, diem dikit AI langsung balas.' : '🎤 Dengerin... Ngomong, lalu Klik OFF.');
  startRekam();
}

async function startRekam(){
  if(sedangBicara) return;
  try{
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rekamanChunks = [];
    mediaRecorder = new MediaRecorder(micStream);
    mediaRecorder.ondataavailable = e=>{ if(e.data.size>0) rekamanChunks.push(e.data); };
    mediaRecorder.onstop = async ()=>{
      stopAnalyser();
      if(micStream) micStream.getTracks().forEach(t=>t.stop());
      if(!sedangBicaraModeAktif && rekamanChunks.length===0) return;
      const blob = new Blob(rekamanChunks, { type: 'audio/webm' });
      if(blob.size < 800) {
        if(sedangBicaraModeAktif && modeBicara==='otomatis') setTimeout(()=>startRekam(), 200);
        return;
      }
      await kirimSuaraKeAI(blob);
    };
    mediaRecorder.start();
    sedangBicara = true;
    if(modeBicara==='otomatis') mulaiDeteksiDiem();
  }catch(e){
    alert('Mic gak bisa dibuka Bos. Izinin mic dulu ya. ' + e.message);
    sedangBicaraModeAktif = false;
    document.getElementById('bicaraBigBtn').textContent = '🎤 Klik Bicara';
  }
}

function stopRekam(kirim){
  if(!sedangBicara) return;
  sedangBicara = false;
  stopAnalyser();
  try{ if(mediaRecorder && mediaRecorder.state!=='inactive') mediaRecorder.stop(); }catch(e){}
}

function mulaiDeteksiDiem(){
  try{
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    let lastSuara = Date.now();
    const cek = ()=>{
      if(!sedangBicara) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for(let i=0;i<data.length;i++){ let v = (data[i]-128)/128; sum += v*v; }
      let vol = Math.sqrt(sum / data.length);
      if(vol > 0.02) lastSuara = Date.now();
      if(Date.now() - lastSuara > 1500){
        stopRekam(true);
        return;
      }
      rafId = requestAnimationFrame(cek);
    };
    rafId = requestAnimationFrame(cek);
  }catch(e){}
}
function stopAnalyser(){
  if(rafId) cancelAnimationFrame(rafId);
  if(audioCtx) { try{ audioCtx.close(); }catch(e){} audioCtx = null; }
}

async function kirimSuaraKeAI(blob){
  setStatus('⏳ Dengerin... AI lagi mikir...');
  try{
    const form = new FormData();
    form.append('audio', blob, 'rekaman.webm');
    const r = await fetch('/api/stt', { method: 'POST', body: form });
    const d = await r.json();
    if(d.ok && d.text){
      document.getElementById('userInput').value = d.text;
      await handleSend();
    } else {
      setStatus('Gagal denger Bos, coba ngomong lagi.');
      if(sedangBicaraModeAktif && modeBicara==='otomatis') setTimeout(()=>startRekam(), 500);
    }
  }catch(e){
    setStatus('Gagal kirim suara Bos: ' + e.message);
    if(sedangBicaraModeAktif && modeBicara==='otomatis') setTimeout(()=>startRekam(), 500);
  }
}

function handleKeyPress(e){ if(e.key === 'Enter') handleSend(); }

function bukaGambar(url, judul){
  gambarAktif = url || ''; judulAktif = judul || 'Gambar dari Admin';
  const lb = document.getElementById('lightbox');
  document.getElementById('lbImg').src = gambarAktif;
  document.getElementById('lbTitle').textContent = judulAktif;
  lb.classList.add('open'); document.body.style.overflow = 'hidden';
  if (!lightboxKebuka) { lightboxKebuka = true; try { history.pushState({ lightbox: true }, '', location.href); } catch(e) {} }
}
function tutupGambar(){
  if (!lightboxKebuka) return;
  if (history.state && history.state.lightbox) { history.back(); return; }
  tutupGambarLangsung();
}
function tutupGambarLangsung(){
  lightboxKebuka = false;
  document.getElementById('lightbox').classList.remove('open');
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
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
  } catch(e) { window.open(gambarAktif, '_blank'); }
}
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') tutupGambar(); });
function getUserId(){
  try {
    let uid = localStorage.getItem('rg_user_id');
    if (!uid) { uid = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); localStorage.setItem('rg_user_id', uid); }
    return uid;
  } catch(e) { return 'user-' + Date.now().toString(36); }
}
function setLoading(isLoading){
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  sedangKirim = isLoading; sendBtn.disabled = isLoading; inputEl.disabled = isLoading;
  if (!isLoading) inputEl.focus();
}
async function handleSend(){
  if (sedangKirim) return;
  const inputEl = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const prompt = inputEl.value.trim();
  if(!prompt) return;
  appendMessage(prompt, 'user');
  inputEl.value = ''; setLoading(true);
  const loadingDiv = appendMessage('Saratonyo mandengarkan...', 'ai');
  const isImageRequest = /(gambarkan|buatkan gambar|bikin gambar|lukis|foto|image|generate|gambar|desain|buatkan|bikinin)/i.test(prompt);
  try {
    if (isImageRequest) {
      let res = await fetch('/api/ai-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt, user_id: getUserId() }) });
      let data = await res.json();
      if (!res.ok || !data.ok || !data.id) throw new Error(data.error || 'Gagal kirim ke admin Bos.');
      loadingDiv.textContent = 'Lagi diproses sistem, tunggu 30 - 40 detik';
      const id = data.id;
      let sudahDapat = false; let gagalBeruntun = 0;
      const cek = setInterval(async () => {
        try {
          const cekRes = await fetch('/api/ai-status?id=' + encodeURIComponent(id));
          const hasil = await cekRes.json(); gagalBeruntun = 0;
          if (hasil.status === 'selesai') {
            sudahDapat = true; clearInterval(cek); clearTimeout(timeoutPolling);
            if (hasil.gambar && typeof hasil.gambar === 'string' && hasil.gambar.startsWith('http')) {
              const safeUrl = escapeHtml(hasil.gambar); const safePrompt = escapeHtml(prompt);
              loadingDiv.innerHTML = '<div>Gambar: ' + safePrompt + '</div><img src="' + safeUrl + '" onclick="bukaGambar(\\'' + safeUrl + '\\', \\'Gambar: ' + safePrompt + '\\')"><div style="font-size:11px;opacity:0.7;margin-top:6px">Klik gambar buat liat full</div>';
              if(autoSpeak) ngomong('Gambarnyo sudah jadi, Dunsanak. Silakan dilihat.');
            } else if (hasil.gambar) { loadingDiv.textContent = hasil.gambar; }
            else { loadingDiv.textContent = 'Selesai Bos, tapi gambarnya kosong.'; loadingDiv.classList.add('error'); }
            chatBox.scrollTop = chatBox.scrollHeight; setLoading(false); simpanRiwayat();
          }
        } catch(e) {
          gagalBeruntun++;
          if (gagalBeruntun >= 3) { clearInterval(cek); clearTimeout(timeoutPolling); loadingDiv.textContent = 'Koneksi putus Bos.'; loadingDiv.classList.add('error'); setLoading(false); }
        }
      }, 3000);
      const timeoutPolling = setTimeout(() => { clearInterval(cek); if (!sudahDapat) { loadingDiv.textContent = 'Admin belum bales Bos.'; loadingDiv.classList.add('error'); setLoading(false); } }, 300000);
      return;
    } else {
      let res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt }) });
      let data = await res.json();
      if (data.reply) {
        loadingDiv.textContent = data.reply;
        const btn = document.createElement('button');
        btn.className = 'speak-btn'; btn.textContent = '🔊 Dengarkan';
        btn.onclick = ()=> ngomong(data.reply, btn);
        const wrap = document.createElement('div'); wrap.className = 'bubble-actions'; wrap.appendChild(btn);
        loadingDiv.appendChild(wrap);
        if(autoSpeak) ngomong(data.reply, btn);
        else if(sedangBicaraModeAktif && modeBicara==='otomatis') setTimeout(()=>startRekam(), 500);
      } else throw new Error(data.error || 'Respon tidak diketahui Bos.');
    }
  } catch(e) {
    loadingDiv.textContent = e.message || 'Terjadi kesalahan Bos.';
    loadingDiv.classList.add('error');
  } finally {
    if (!isImageRequest) setLoading(false);
    chatBox.scrollTop = chatBox.scrollHeight;
    simpanRiwayat();
    if(!isImageRequest && sedangBicaraModeAktif && modeBicara==='otomatis' && !autoSpeak){
      setTimeout(()=>{ if(sedangBicaraModeAktif && !sedangBicara) startRekam(); }, 500);
    }
  }
}
function escapeHtml(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
// === RIWAYAT CHAT: KESIMPAN DI HP, OTOMATIS HAPUS JAM 00:00 WIB ===
const KUNCI_RIWAYAT = 'rg_chat_riwayat';
function tanggalWIB(){
  return new Date(Date.now() + 7*3600000).toISOString().slice(0,10);
}
function simpanRiwayat(){
  try{
    const items = [];
    document.querySelectorAll('#chatBox .chat-bubble').forEach(b=>{
      const sender = b.classList.contains('user') ? 'user' : 'ai';
      const img = b.querySelector('img');
      let text = '';
      if(img){ const d = b.querySelector('div'); text = d ? d.textContent : ''; }
      else { text = (b.firstChild && b.firstChild.nodeType===3) ? b.firstChild.nodeValue : b.textContent; }
      if(sender==='ai' && !img && (text.indexOf('Saratonyo mandengarkan')===0 || text.indexOf('Lagi diproses sistem')===0)) return;
      items.push({ sender: sender, text: text, img: img ? img.src : '', error: b.classList.contains('error') });
    });
    localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify({ tgl: tanggalWIB(), items: items.slice(-100) }));  }catch(e){}
}
function muatRiwayat(){
  try{
    const raw = localStorage.getItem(KUNCI_RIWAYAT);
    if(!raw) return;
    const data = JSON.parse(raw);
    if(!data || data.tgl !== tanggalWIB()){ localStorage.removeItem(KUNCI_RIWAYAT); return; }
    data.items.forEach(it=>{
      const msg = appendMessage(it.text, it.sender);
      if(it.error) msg.classList.add('error');
      if(it.img){
        const safeUrl = escapeHtml(it.img); const safeText = escapeHtml(it.text);
        msg.innerHTML = '<div>' + safeText + '</div><img src="' + safeUrl + '" onclick="bukaGambar(\\'' + safeUrl + '\\', \\'Gambar\\')"><div style="font-size:11px;opacity:0.7;margin-top:6px">Klik gambar buat liat full</div>';
      } else if(it.sender==='ai' && !it.error){
        const btn = document.createElement('button');
        btn.className = 'speak-btn'; btn.textContent = '🔊 Dengarkan';
        btn.onclick = ()=> ngomong(it.text, btn);
        const wrap = document.createElement('div'); wrap.className = 'bubble-actions'; wrap.appendChild(btn);
        msg.appendChild(wrap);
      }
    });
  }catch(e){}
}
function jadwalHapusTengahMalam(){
  const ms = 86400000 - ((Date.now() + 7*3600000) % 86400000);
  setTimeout(()=>{
    try{ localStorage.removeItem(KUNCI_RIWAYAT); }catch(e){}
    document.getElementById('chatBox').innerHTML = '';
    document.getElementById('app').classList.remove('mode-pilih');
    pilihAktif = false;
    jadwalHapusTengahMalam();
  }, ms + 1000);
}

// === HAPUS CHAT - CEKLIS DI KANAN KAYAK FOTO 1 ===
function appendMessage(text, sender){
  const chatBox = document.getElementById('chatBox');
  const row = document.createElement('div');
  row.className = 'pilih-row ' + (sender === 'user' ? 'user-row' : 'ai-row');
  const msg = document.createElement('div');
  msg.className = 'chat-bubble ' + sender;
  msg.textContent = text;
  const circle = document.createElement('div');
  circle.className = 'pilih-circle';
  circle.textContent = '✓';
  row.appendChild(msg);
  row.appendChild(circle);
  row.onclick = ()=>{
    if(!pilihAktif) return;
    row.classList.toggle('dipilih');
    updatePilihUI();
  };
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
function mulaiPilih(){
  if(!document.querySelectorAll('#chatBox .pilih-row').length){ alert('Belum ada chat Bos.'); return; }
  pilihAktif = true;
  document.getElementById('app').classList.add('mode-pilih');
  document.getElementById('robotPanel').classList.remove('open');
  updatePilihUI();
}
function keluarPilih(){
  pilihAktif = false;
  document.getElementById('app').classList.remove('mode-pilih');
  document.querySelectorAll('.pilih-row').forEach(r=>r.classList.remove('dipilih'));
  updatePilihUI();
}
function updatePilihUI(){
  const terpilih = document.querySelectorAll('.pilih-row.dipilih').length;
  const btn = document.getElementById('pilihHapusBtn');
  const count = document.getElementById('pilihCount');
  if(btn){ btn.disabled = terpilih === 0; btn.textContent = terpilih ? 'Hapus (' + terpilih + ')' : 'Hapus'; }
  if(count) count.textContent = terpilih ? 'Kamu menghapus ' + terpilih + ' pesan' : '';
}
function hapusTerpilih(){
  const terpilih = document.querySelectorAll('.pilih-row.dipilih');
  if(!terpilih.length) return;
  if(!confirm('Hapus ' + terpilih.length + ' pesan ini Bos?')) return;
  terpilih.forEach(r=>r.remove());
  simpanRiwayat();
  keluarPilih();
}
</script>
</body>
</html>`;
export const AI = AI_HTML;
export default AI_HTML;
