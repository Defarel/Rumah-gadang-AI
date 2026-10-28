// ==========================================
// KANTOR LUAR - INDEX.HTML (AREA OUTDOOR - ROBOT KECIL & JALAN-JALAN)
// ==========================================
export const KANTOR_LUAR_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <title>KANTOR LUAR - BOS PRABOWO</title>
    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
        }
    }
    </script>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#000; overflow:hidden; height:100vh; font-family:sans-serif; touch-action:none; }
        #top { height:48px; background:#111; color:#FFD700; display:flex; align-items:center; justify-content:space-between; padding:0 10px; position:absolute; top:0; left:0; right:0; z-index:50; font-weight:900; font-size:12px; }
        #joy { position:absolute; bottom:85px; left:12px; width:110px; height:110px; background:rgba(0,0,0,0.3); border-radius:50%; border:2px solid #fff; z-index:40; }
        #stick { position:absolute; left:32px; top:32px; width:46px; height:46px; background:#fff; border-radius:50%; }
        #right { position:absolute; bottom:80px; right:10px; display:flex; flex-direction:column; gap:5px; z-index:40; align-items:center; }
        .btn { width:58px; height:58px; border-radius:50%; border:2px solid #fff; color:#fff; font-weight:900; font-size:10px; background:#000; }
        #inter { position:absolute; top:42%; left:50%; transform:translate(-50%,-50%); background:#fff; color:#000; padding:16px 20px; border-radius:16px; border:4px solid #000; display:none; z-index:9999; text-align:center; min-width:310px; }
        #inter button { width:100%; background:#FFD700; color:#000; border:3px solid #000; padding:14px; border-radius:12px; font-weight:900; font-size:16px; margin-top:10px; }
        #npcPanel { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:#111; border:3px solid #FFD700; border-radius:14px; padding:14px; display:none; z-index:80; width:92%; max-width:360px; color:#fff; }
        #npcChat { height:180px; overflow-y:auto; background:#000; border:1px solid #333; border-radius:10px; padding:8px; margin:10px 0; display:flex; flex-direction:column; gap:8px; font-size:13px; }
        #loading { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:#000; color:#FFD700; padding:12px 18px; border-radius:10px; border:2px solid #FFD700; z-index:100; font-weight:900; font-size:12px; min-width:280px; text-align:center; }
        #fade { position:absolute; top:0; left:0; right:0; bottom:0; background:#000; z-index:999; opacity:0; pointer-events:none; transition:opacity 0.8s; display:flex; align-items:center; justify-content:center; color:#FFD700; font-weight:900; font-size:20px; }
        #gps { position:absolute; top:55px; left:10px; background:rgba(0,0,0,0.8); color:#00ff88; padding:6px 10px; border-radius:8px; font-size:10px; z-index:45; border:1px solid #00ff88; }
        .bot { position:fixed; bottom:0; left:0; right:0; height:58px; background:#000; border-top:1px solid #333; display:flex; z-index:99; }
        .bot a { flex:1; text-align:center; padding:7px 0; color:#888; text-decoration:none; font-size:15px; }
        .bot a.on { color:#fff; }
    </style>
</head>
<body>
<div id="loading">LOADING KANTOR LUAR - BOS PRABOWO...<br><span id="loadDetail" style="font-size:10px;color:#aaa">Memuat Aset 3D...</span></div>
<div id="fade">BERPINDAH AREA...</div>
<div id="top"><b id="topTitle">KANTOR LUAR - BOS PRABOWO</b><span id="locStatus" style="background:#00C853;padding:3px 8px;border-radius:10px;color:#fff">AREA LUAR</span></div>
<div id="gps"><span id="gpsText">Init Bos...</span> | <span id="modeText">Robot Kecil Jalan-Jalan</span></div>
<div id="joy"><div id="stick"></div></div>
<div id="right">
    <button id="cam" class="btn">360<br>ZOOM</button>
    <button id="zin" class="btn">ZOOM<br>IN</button>
    <button id="zout" class="btn">ZOOM<br>OUT</button>
    <button id="run" class="btn">LARI</button>
    <button id="jump" class="btn">DUDUK</button>
</div>
<div id="inter"><h2 id="it">INTERAKSI</h2><p id="idp"></p><button id="btnTap" onclick="handleInteract()">KLIK</button></div>
<div id="sewaModal" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#000;padding:18px;border-radius:16px;border:4px solid #000;display:none;z-index:9999;text-align:left;min-width:320px;max-width:92%">
    <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:18px">🏢 RINCIAN SEWA TOKO!</b><button onclick="closeSewa()" style="background:#000;color:#fff;border-radius:50%;width:32px;height:32px;font-weight:900">X</button></div>
    <div style="margin:12px 0;font-size:14px;line-height:1.6;background:#f5f5f5;padding:12px;border-radius:10px;border:2px solid #000">
        <div>✅ <b>SEWA TOKO: 50K/BLN</b></div>
        <div>✅ <b>URL + TOKO: 100K/BLN</b></div>
        <div>✅ <b>PAKET LENGKAP WEB + TOKO + AI:</b></div>
        <div>👉 KONTAK KE WA!</div>
    </div>
    <div style="background:#FFD700;padding:10px;border-radius:10px;text-align:center;border:2px solid #000;margin-bottom:8px">
        <div style="font-size:12px">HUBUNGI WA:</div>
        <div style="font-size:20px;font-weight:900">082230439966</div>
    </div>
    <button onclick="chatWA()" style="width:100%;background:#25D366;color:#fff;border:3px solid #000;padding:14px;border-radius:12px;font-weight:900;font-size:16px">💬 CHAT WA SEKARANG</button>
    <button onclick="closeSewa()" style="width:100%;background:#fff;color:#000;border:2px solid #000;padding:10px;border-radius:10px;font-weight:700;margin-top:6px">TUTUP</button>
</div>
<div id="npcPanel">
    <div style="display:flex;justify-content:space-between">
        <div><b id="npcName" style="color:#00ff88">NPC</b><div id="npcRole" style="font-size:10px;color:#aaa"></div></div>
        <button onclick="closeNPC()" style="background:#333;color:#fff;border-radius:50%;width:32px;height:32px">X</button>
    </div>
    <div id="npcChat"></div>
    <div style="display:flex;gap:6px">
        <input id="npcInput" placeholder="Tanya..." style="flex:1;background:#222;border:1px solid #333;color:#fff;padding:10px;border-radius:20px">
        <button onclick="tanyaNPC()" style="background:#FFD700;color:#000;border:0;padding:10px 14px;border-radius:20px;font-weight:900">KIRIM</button>
    </div>
</div>
<div class="bot">
    <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
    <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
    <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
    <a href="/kantor" class="on">🏢<br><span style="font-size:10px">Kantor</span></a>
    <a href="/ai">🤖<br><span style="font-size:10px">AI</span></a>
    <a href="/akun">👤<br><span style="font-size:10px">Akun</span></a>
</div>
<script type="module">
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const RUMAH_GADANG_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/rumah_gadang_sumatra_barat_indonesia.glb";
const RUKO_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/storefront_house_01.glb";
const PLAYER_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/prabowo_3d_model.glb";
const NPC_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/robot_Npc.glb";

let scene = new THREE.Scene(); scene.background = new THREE.Color(0x87CEEB);
let camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setSize(innerWidth, innerHeight); document.body.appendChild(renderer.domElement);
renderer.domElement.style.position='absolute'; renderer.domElement.style.top='0'; renderer.domElement.style.left='0'; renderer.domElement.style.zIndex='1'; renderer.domElement.style.touchAction='none';

scene.add(new THREE.DirectionalLight(0xffffff, 1.2).position.set(20, 30, 20));
scene.add(new THREE.AmbientLight(0xffffff, 0.9));

let ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshStandardMaterial({color: 0x3d6b3d}));
ground.rotation.x = -Math.PI / 2; ground.position.y = -1; scene.add(ground);

let road = new THREE.Mesh(new THREE.PlaneGeometry(40, 800), new THREE.MeshStandardMaterial({color: 0x2b2b2b}));
road.rotation.x = -Math.PI / 2; road.position.y = -0.8; scene.add(road);

let outG = new THREE.Group(); scene.add(outG);
let park = new THREE.Group(); park.position.set(0, -0.9, -90); outG.add(park);
park.add(new THREE.Mesh(new THREE.BoxGeometry(90, 0.3, 60), new THREE.MeshStandardMaterial({color: 0x2ecc71})));

let cOut = [], tokos = [], npcs = [], player = null, robotBase = null, baseY = 0, walkTime = 0, loaded = 0;
const TOTAL = 4;

function addC(a, x, z, w, d){ a.push({x, z, w, d}); }
function hit(nx, nz){
    for (let c of cOut){
        if (Math.abs(nx - c.x) < c.w / 2 + 0.8 && Math.abs(nz - c.z) < c.d / 2 + 0.8) return true;
    }
    return false;
}

function updateLoad(name, pct){
    let overall = Math.round((loaded / TOTAL) * 100 + (pct ? pct / TOTAL : 0));
    document.getElementById('loading').innerHTML = 'LOADING ' + overall + '% KANTOR LUAR<br><span id="loadDetail" style="font-size:10px;color:#aaa">' + name + ' ' + pct + '% Bos</span>';
    document.getElementById('gpsText').innerText = name + ':' + pct + '% Bos';
}
function check(name){
    loaded++;
    let p = Math.round(loaded / TOTAL * 100);
    document.getElementById('loading').innerText = 'LOADING ' + p + '% KANTOR LUAR - ' + name;
    if (loaded >= TOTAL){
        document.getElementById('loading').style.display = 'none';
        document.getElementById('gpsText').innerText = 'Siap Bos! Area Luar Siap!';
    }
}
function fail(name){ check(name + ' SKIP Bos'); }

let loader = new GLTFLoader();
function loadHF(url, label, onOk){
    let done = false;
    let t = setTimeout(() => { if (!done){ done = true; fail(label + ' TIMEOUT Bos'); } }, 30000);
    loader.load(url, (g) => { if (done) return; done = true; clearTimeout(t); onOk(g); }, (xhr) => { if (xhr.lengthComputable){ updateLoad(label, Math.round(xhr.loaded / xhr.total * 100)); } }, () => { if (done) return; done = true; clearTimeout(t); fail(label); });
}

let fallbackPlayer = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({color: 0xFFD700}));
fallbackPlayer.position.set(0, 1, 55); outG.add(fallbackPlayer); player = fallbackPlayer;

loadHF(RUMAH_GADANG_URL, 'RumahGadang', (g) => {
    let m = g.scene; m.scale.set(5, 5, 5); m.position.set(0, 1, 0); m.rotation.y = Math.PI;
    park.add(m); addC(cOut, -13, -90, 12, 28); addC(cOut, 13, -90, 12, 28); check('RumahGadang');
});

let tor = new THREE.TorusGeometry(2.2, 0.25, 16, 50);
let pRG = new THREE.Mesh(tor, new THREE.MeshStandardMaterial({color: 0x00FFFF, emissive: 0x00FFFF, emissiveIntensity: 1.5}));
pRG.position.set(0, 1.8, -78); pRG.rotation.y = Math.PI / 2; outG.add(pRG);

loadHF(RUKO_URL, 'Ruko-Storefront', (g) => {
    let base = g.scene; let b = new THREE.Box3().setFromObject(base); let yOff = -b.min.y;
    let POS = [
        {x: -32, z: 45, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: -32, z: 25, n: "TOKO 2 - TERSEWA", l: "https://lynk.id/annrisel", color: "#FF0000"},
        {x: -32, z: 5, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: -32, z: -15, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: -32, z: -35, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: 32, z: 45, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: 32, z: 25, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: 32, z: 5, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: 32, z: -15, n: "DISEWAKAN", l: "", color: "#39FF14"},
        {x: 32, z: -35, n: "DISEWAKAN", l: "", color: "#39FF14"}
    ];
    POS.forEach(p => {
        let gr = base.clone(true); gr.scale.set(10, 10, 10); gr.position.set(p.x, yOff * 10 + 0.5, p.z); gr.rotation.y = p.x > 0 ? -1.57 : 1.57; outG.add(gr);
        let cv = document.createElement('canvas'); cv.width = 1024; cv.height = 256; let ctx = cv.getContext('2d');
        ctx.fillStyle = p.color; ctx.fillRect(0, 0, 1024, 256);
        ctx.fillStyle = p.color === "#FF0000" ? "#FFFFFF" : "#000000"; ctx.font = 'bold 72px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(p.n, 512, 160);
        let tx = new THREE.CanvasTexture(cv);
        let board = new THREE.Mesh(new THREE.PlaneGeometry(14, 3.5), new THREE.MeshStandardMaterial({map: tx, side: THREE.DoubleSide}));
        board.position.set(p.x + (p.x < 0 ? 16 : -16), 14, p.z); board.lookAt(0, 14, p.z); outG.add(board);
        tokos.push({x: p.x, z: p.z, nama: p.n, link: p.l}); addC(cOut, p.x, p.z, 14, 14);
    });
    check('Ruko');
});

// ✅ NPC dengan Data Patroli (Titik Asal, Tujuan Jalan-Jalan, Waktu Ubah Arah)
let NPC_OUT = [
    {nama: "Pak Sales Robot", role: "Sales Robot", emoji: "🤖", x: -26, z: 45, startX: -26, startZ: 45, targetX: -26, targetZ: 10, speed: 0.04},
    {nama: "Pak Kasir Robot", role: "Kasir Toko 2 Robot", emoji: "🤖", x: 26, z: 25, startX: 26, startZ: 25, targetX: 26, targetZ: -10, speed: 0.04}
];

function spawnRobotNPCs(){
    if (!robotBase) return;
    NPC_OUT.forEach(d => {
        // Skala dikecilkan dari 2.5 menjadi 1.3 agar pas dan proporsional
        let o = robotBase.clone(true); 
        o.scale.set(0.8, 0.8, 0.8); 
        o.position.set(d.x, 0, d.z); 
        outG.add(o); 
        npcs.push({...d, group: o, timer: Math.random() * 100});
    });
}

loadHF(NPC_URL, 'Robot-NPC', (g) => { robotBase = g.scene; spawnRobotNPCs(); check('Robot-NPC'); });
loadHF(PLAYER_URL, 'Prabowo-BOS-Player', (g) => {
    if (fallbackPlayer && fallbackPlayer.parent) fallbackPlayer.parent.remove(fallbackPlayer);
    let m = g.scene; m.scale.set(2.5, 2.5, 2.5); let pl = m.clone(true); pl.position.set(0, 0, 55); pl.rotation.y = Math.PI; outG.add(pl); player = pl;
    check('Prabowo-Player');
});

function toIn(){
    let f = document.getElementById('fade'); f.style.opacity = '1'; f.style.pointerEvents = 'auto'; f.innerHTML = 'MASUK KE KANTOR DALAM...';
    setTimeout(() => { window.location.href = '/dalam'; }, 800);
}

let camYaw = 0, camPitch = 18, camDist = 12, keys = {x: 0, y: 0}, spd = 0.4, rspd = 1.0, run = false, nearT = null, nearNPC = null, nearD = false, isSit = false;
let bj = document.getElementById('joy'), st = document.getElementById('stick'), dg = false, br;
function gbr(){ br = bj.getBoundingClientRect(); }
function mv(cx, cy){
    let bx = br.left + br.width / 2, by = br.top + br.height / 2, dx = cx - bx, dy = cy - by, m = 38, d = Math.hypot(dx, dy);
    if (d > m){ dx = dx / d * m; dy = dy / d * m; }
    st.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; keys.x = dx / m; keys.y = dy / m;
}
bj.addEventListener('touchstart', e => { dg = true; gbr(); mv(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
window.addEventListener('touchmove', e => { if (!dg) return; mv(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
window.addEventListener('touchend', () => { dg = false; st.style.transform = 'translate(0,0)'; keys.x = 0; keys.y = 0; });

let camDrag = false, lx = 0, ly = 0, lastPinch = 0;
function sCam(x, y){ if (x > innerWidth * 0.3){ camDrag = true; lx = x; ly = y; } }
function mCam(x, y){ if (!camDrag) return; let dx = x - lx, dy = y - ly; camYaw -= dx * 0.6; camPitch += dy * 0.5; camPitch = Math.max(-30, Math.min(80, camPitch)); lx = x; ly = y; }
function eCam(){ camDrag = false; }

renderer.domElement.addEventListener('touchstart', e => { if (e.touches.length == 1) sCam(e.touches[0].clientX, e.touches[0].clientY); if (e.touches.length == 2){ lastPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); } }, {passive: false});
renderer.domElement.addEventListener('touchmove', e => { if (e.touches.length == 1) mCam(e.touches[0].clientX, e.touches[0].clientY); if (e.touches.length == 2){ let d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); camDist -= (d - lastPinch) * 0.05; camDist = Math.max(3, Math.min(25, camDist)); lastPinch = d; } e.preventDefault(); }, {passive: false});
renderer.domElement.addEventListener('touchend', eCam); renderer.domElement.addEventListener('mousedown', e => sCam(e.clientX, e.clientY)); window.addEventListener('mousemove', e => { if (camDrag) mCam(e.clientX, e.clientY); }); window.addEventListener('mouseup', eCam);
renderer.domElement.addEventListener('wheel', e => { camDist += e.deltaY * 0.01; camDist = Math.max(3, Math.min(25, camDist)); e.preventDefault(); }, {passive: false});

document.getElementById('cam').addEventListener('click', () => { camYaw += 90; });
document.getElementById('zin').addEventListener('click', () => { camDist = Math.max(3, camDist - 2); });
document.getElementById('zout').addEventListener('click', () => { camDist = Math.min(25, camDist + 2); });
document.getElementById('run').addEventListener('touchstart', () => { run = true; }, {passive: false});
document.getElementById('run').addEventListener('touchend', () => { run = false; });
document.getElementById('jump').addEventListener('click', () => { isSit = !isSit; document.getElementById('gpsText').innerText = isSit ? 'DUDUK Bos' : 'BERDIRI Bos'; });

window.closeNPC = () => { document.getElementById('npcPanel').style.display = 'none'; activeNPC = null; };
window.closeSewa = () => { document.getElementById('sewaModal').style.display = 'none'; };
window.chatWA = () => { window.open('https://wa.me/6282230439966?text=Halo%20Bos%20saya%20mau%20sewa%20toko%20V9.5%20Bos%20Prabowo%20%2B%20Robot%20Bos!', '_blank'); };

let activeNPC = null;
function openNPC(n){
    activeNPC = n; document.getElementById('npcName').textContent = n.emoji + ' ' + n.nama; document.getElementById('npcRole').textContent = n.role;
    document.getElementById('npcChat').innerHTML = '<div style="color:#0f0">Halo Bos! Saya ' + n.nama + ' Robot Bos!</div>';
    document.getElementById('npcPanel').style.display = 'block'; document.getElementById('inter').style.display = 'none';
}
window.openNPC = openNPC;

async function tanyaNPC(){
    let inp = document.getElementById('npcInput'); let q = inp.value.trim(); if (!q || !activeNPC) return;
    let chat = document.getElementById('npcChat'); chat.innerHTML += '<div style="text-align:right;color:#FFD700;margin:6px 0;padding:6px 10px;background:#222;border-radius:12px">Bos: ' + q + '</div>'; inp.value = '';
    chat.innerHTML += '<div id="loadingAI" style="color:#888;font-size:12px">Robot mikir Bos...</div>'; chat.scrollTop = chat.scrollHeight;
    try {
        let prompt = "Kamu adalah " + activeNPC.nama + " robot NPC di Rumah Gadang AI. User: " + q;
        let r = await fetch('/api/ai', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({prompt})});
        let d = await r.json(); document.getElementById('loadingAI')?.remove();
        chat.innerHTML += '<div style="color:#00ff88;margin:6px 0;padding:6px 10px;background:#111;border:1px solid #333;border-radius:12px"><b>' + activeNPC.nama + ':</b> ' + (d.reply || 'Maaf Bos error') + '</div>'; chat.scrollTop = chat.scrollHeight;
    } catch (e){ document.getElementById('loadingAI')?.remove(); chat.innerHTML += '<div style="color:red">Error Bos</div>'; }
}
window.tanyaNPC = tanyaNPC;

window.handleInteract = function(){
    if (nearD){ toIn(); return; }
    if (nearNPC){ openNPC(nearNPC); return; }
    if (nearT){
        if (nearT.link && nearT.link.length > 5){ window.open(nearT.link, '_blank'); }
        else { document.getElementById('sewaModal').style.display = 'block'; document.getElementById('inter').style.display = 'none'; }
    }
};

function animate(){
    requestAnimationFrame(animate); 

    // ✅ Logika Robot NPC Jalan-Jalan / Patroli Bolak-balik Otomatis
    npcs.forEach(n => {
        if (!n.group) return;
        let dx = n.targetX - n.group.position.x;
        let dz = n.targetZ - n.group.position.z;
        let dist = Math.hypot(dx, dz);
        
        if (dist > 1.0) {
            n.group.position.x += (dx / dist) * n.speed;
            n.group.position.z += (dz / dist) * n.speed;
            n.group.rotation.y = Math.atan2(dx, dz);
            // Animasi langkah kecil naik-turun
            n.group.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.1;
        } else {
            // Tukar titik tujuan patroli (bolak-balik)
            let tempX = n.startX; let tempZ = n.startZ;
            n.startX = n.targetX; n.startZ = n.targetZ;
            n.targetX = tempX; n.targetZ = tempZ;
        }
    });

    if (!player){ renderer.render(scene, camera); return; }
    let moving = Math.hypot(keys.x, keys.y) > 0.15 && !isSit;
    if (moving){ walkTime += run ? 0.35 : 0.22; player.position.y = baseY + Math.abs(Math.sin(walkTime * 2)) * 0.18; player.rotation.z = Math.sin(walkTime) * 0.12; player.rotation.x = Math.sin(walkTime * 1.5) * 0.08; }
    else { player.position.y = THREE.MathUtils.lerp(player.position.y, baseY, 0.2); player.rotation.z = THREE.MathUtils.lerp(player.rotation.z, 0, 0.2); player.rotation.x = THREE.MathUtils.lerp(player.rotation.x, 0, 0.2); }
    
    if (!isSit && player){
        let rad = camYaw * 0.01745, fw = keys.y, stt = keys.x, cs = run ? rspd : spd;
        let mx = (Math.sin(rad) * fw + Math.cos(rad) * stt) * cs, mz = (Math.cos(rad) * fw - Math.sin(rad) * stt) * cs;
        let nx = player.position.x + mx, nz = player.position.z + mz;
        if (!hit(nx, nz)){ player.position.x = nx; player.position.z = nz; }
        if (Math.abs(mx) > 0.01 || Math.abs(mz) > 0.01) player.rotation.y = Math.atan2(mx, mz);
    }
    let yr = camYaw * 0.01745, pr = camPitch * 0.01745;
    if (player){
        let cx = player.position.x + camDist * Math.sin(yr) * Math.cos(pr), cy = player.position.y + camDist * Math.sin(pr) + 2.0, cz = player.position.z + camDist * Math.cos(yr) * Math.cos(pr);
        camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.15); camera.lookAt(player.position.x, player.position.y + 1, player.position.z);
    }
    if (pRG) pRG.rotation.z += 0.04;
    nearT = null; nearNPC = null; nearD = false; let md = 100, mn = 100;
    if (player){
        let d = Math.hypot(player.position.x, player.position.z + 78);
        document.getElementById('gpsText').innerText = 'RG:' + Math.round(d) + 'm Prabowo Bos';
        tokos.forEach(t => { let dd = Math.hypot(player.position.x - t.x, player.position.z - t.z); if (dd < md && dd < 18){ md = dd; nearT = t; } });
        npcs.forEach(n => { let dd = Math.hypot(player.position.x - n.group.position.x, player.position.z - n.group.position.z); if (dd < mn && dd < 8){ mn = dd; nearNPC = n; } });
        if (d < 11) nearD = true;
    }
    let inter = document.getElementById('inter');
    if (nearNPC){ inter.style.display = 'block'; document.getElementById('it').innerText = nearNPC.emoji + ' ' + nearNPC.nama; document.getElementById('idp').innerText = nearNPC.role; document.getElementById('btnTap').innerText = 'TANYA ROBOT'; }
    else if (nearD){ inter.style.display = 'block'; document.getElementById('it').innerText = 'MASUK MEETING'; document.getElementById('idp').innerText = 'Bos Prabowo Bos'; document.getElementById('btnTap').innerText = 'MASUK!'; }
    else if (nearT){
        inter.style.display = 'block';
        let isToko2 = nearT.nama.includes("TOKO 2");
        if (isToko2){ document.getElementById('it').innerText = nearT.nama; document.getElementById('idp').innerText = 'Sudah disewa - lynk.id/annrisel'; document.getElementById('btnTap').innerText = 'BUKA TOKO 2'; }
        else { document.getElementById('it').innerHTML = 'DISEWAKAN<br><span style="font-size:12px;color:#000">WA 082230439966</span>'; document.getElementById('idp').innerText = 'KLIK DETAIL'; document.getElementById('btnTap').innerText = 'KLIK DETAIL'; }
    }
    else inter.style.display = 'none';
    renderer.render(scene, camera);
}
animate();
</script>
</body>
</html>`;
