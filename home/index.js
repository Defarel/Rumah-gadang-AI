export const HOME_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif}
.header{display:flex;justify-content:space-between;align-items:center;padding:10px;background:#000;border:2px solid #0f0}
.input-box{display:flex;gap:10px;padding:10px}
.input-box input{flex:1;padding:12px;border-radius:12px;border:2px solid #0f0;background:#111;color:#fff;outline:none}
.btn-plus{width:50px;background:#222;border-radius:12px;color:#fff;font-size:24px;border:2px solid #0f0}
.btn-kirim{width:100%;padding:12px;background:#0f0;color:#000;font-weight:bold;border-radius:12px;border:none;margin:10px 0}
#listTulisan{padding:10px;min-height:60vh}
.tulis-item{border:1px solid #0f0;padding:10px;margin-bottom:10px;border-radius:12px;background:#111}
.tulis-item img{max-width:100%;border-radius:10px;margin-top:8px}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-around;background:#000;padding:8px 0;border-top:1px solid #333}
.bottom-nav div{text-align:center;font-size:12px}
</style>
</head>
<body>

<div class="header">
  <div style="display:flex;align-items:center;gap:8px">
    <img src="/icon.png" style="width:32px;height:32px;border-radius:50%;border:2px solid #0f0">
    <b><span style="color:#0f0">Rumah</span> Gadang AI</b>
  </div>
  <div id="userBtn" style="background:#fff;color:#000;padding:4px 12px;border-radius:20px;font-size:14px">sp.fc</div>
</div>

<div style="border:2px solid #0f0;padding:10px">
  <div class="input-box">
    <input id="tulisInput" placeholder="Tulis disini...">
    <button class="btn-plus" onclick="document.getElementById('fileInput').click()">+</button>
    <input type="file" id="fileInput" hidden accept="image/*" onchange="previewFile(event)">
  </div>
  <img id="previewImg" style="display:none;width:100%;border-radius:12px;margin-top:10px">
  <button class="btn-kirim" onclick="kirimTulis()">KIRIM</button>
</div>

<div id="listTulisan"><p style="text-align:center;color:#666;margin-top:20px">Loading...</p></div>

<div class="bottom-nav">
  <div>🏠<br>Home</div><div>🖼️<br>Foto</div><div>🎬<br>Video</div><div>🏢<br>Kantor</div><div>🤖<br>AI</div><div>👤<br>Akun</div>
</div>

<script>
let selectedFileBase64 = "";
let userEmail = localStorage.getItem('user_email') || localStorage.getItem('email') || "sp.fc@rumahgadang-ai.my.id";
let userName = localStorage.getItem('user_name') || "sp.fc";

function previewFile(e){
  let file = e.target.files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = function(ev){
    selectedFileBase64 = ev.target.result;
    document.getElementById('previewImg').src = selectedFileBase64;
    document.getElementById('previewImg').style.display = 'block';
  }
  reader.readAsDataURL(file);
}

async function kirimTulis(){
  let input = document.getElementById('tulisInput');
  let isi = input.value.trim();
  if(!isi && !selectedFileBase64){
    alert("Tulis dulu Bos");
    return;
  }
  let btn = document.querySelector('.btn-kirim');
  btn.innerText = "MENGIRIM...";
  btn.disabled = true;
  
  try{
    let res = await fetch('/api/tulis', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        isi: isi,
        text: isi,
        judul: isi,
        email: userEmail,
        user_email: userEmail,
        picture: selectedFileBase64,
        tulisImg: selectedFileBase64,
        name: userName
      })
    });
    let data = await res.json();
    console.log("Kirim result:", data);
    if(data.ok || data.id || res.ok){
      input.value = "";
      selectedFileBase64 = "";
      document.getElementById('previewImg').style.display = 'none';
      document.getElementById('fileInput').value = "";
      await loadTulis();
    }else{
      alert("Gagal: " + (data.error||"unknown"));
    }
  }catch(err){
    console.error(err);
    alert("Error kirim: " + err.message);
  }
  btn.innerText = "KIRIM";
  btn.disabled = false;
}

async function loadTulis(){
  let container = document.getElementById('listTulisan');
  try{
    let res = await fetch('/api/tulis?t='+Date.now());
    let data = await res.json();
    console.log("Load data:", data);
    
    // HANDLE SEMUA FORMAT BOS
    let list = [];
    if(Array.isArray(data)) list = data;
    else if(data.results) list = data.results;
    else if(data.data) list = data.data;
    else if(data.tulisan) list = data.tulisan;
    
    if(!list || list.length === 0){
      container.innerHTML = '<p style="text-align:center;color:#666;margin-top:20px">Belum ada tulisan Bos</p>';
      return;
    }
    
    let html = "";
    list.forEach(item=>{
      let isi = item.isi || item.text || item.judul || "";
      let pic = item.picture || item.tulisImg || item.url || "";
      let email = item.email || item.user_email || "anon";
      let waktu = item.created_at || item.time || Date.now();
      let date = new Date(waktu).toLocaleString('id-ID');
      html += \`<div class="tulis-item">
        <div style="font-size:12px;color:#0f0">\${email} • \${date}</div>
        <div style="margin-top:6px;white-space:pre-wrap">\${isi}</div>
        \${pic ? \`<img src="\${pic}">\` : ""}
      </div>\`;
    });
    container.innerHTML = html;
    
  }catch(err){
    console.error("Load error:", err);
    container.innerHTML = '<p style="text-align:center;color:#f00">Error load: '+err.message+'</p>';
  }
}

// LOAD PAS AWAL
loadTulis();

// CEK EMAIL DARI LOCALSTORAGE
try{
  let e = localStorage.getItem('user_email') || localStorage.getItem('email');
  if(e) document.getElementById('userBtn').innerText = e.split('@')[0];
}catch{}
</script>
</body>
</html>
`;
