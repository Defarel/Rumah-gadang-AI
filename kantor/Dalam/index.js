// ==========================================
// KANTOR DALAM - INDEX.HTML (3 NPC DUDUK, 2 JALAN-JALAN, UKURAN 0.8)
// ==========================================
export const KANTOR_DALAM_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <title>KANTOR DALAM - LUAS & RUANG SHOLAT</title>
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
<div id="loading">LOADING KANTOR LUAR BIASA LUAS (TANPA ATAP)...<br><span id="loadDetail" style="font-size:10px;color:#aaa">Merakit Ruang Kerja & Sholat Bos...</span></div>
<div id="fade">BERPINDAH AREA...</div>
<div id="top"><b id="topTitle">KANTOR DALAM - TANPA ATAP & SHOLAT</b><span id="locStatus" style="background:#00C853;padding:3px 8px;border-radius:10px;color:#fff">LUAS</span></div>
<div id="gps"><span id="gpsText">Init Bos...</span> | <span id="modeText">Workspace + Ruang Sholat</span></div>
<div id="joy"><div id="stick"></div></div>
<div id="right">
    <button id="cam" class="btn">360<br>ZOOM</button>
    <button id="zin" class="btn">ZOOM<br>IN</button>
    <button id="zout" class="btn">ZOOM<br>OUT</button>
    <button id="run" class="btn">LARI</button>
    <button id="jump" class="btn">DUDUK</button>
</div>
<div id="inter"><h2 id="it">INTERAKSI</h2><p id="idp"></p><button id="btnTap" onclick="handleInteract()">KLIK</button></div>
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

const INTERIOR_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/meeting_room.glb";
const PLAYER_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/prabowo_3d_model.glb";
const NPC_URL = "https://huggingface.co/spaces/Defarel/Rumah-Gadang-AI/resolve/main/robot_Npc.glb";

let scene = new THREE.Scene(); scene.background = new THREE.Color(0x1a1a2e);
let camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setSize(innerWidth, innerHeight); document.body.appendChild(renderer.domElement);
renderer.domElement.style.position='absolute'; renderer.domElement.style.top='0'; renderer.domElement.style.left='0'; renderer.domElement.style.zIndex='1'; renderer.domElement.style.touchAction='none';

// Pencahayaan Terang Terbuka Tanpa Atap
scene.add(new THREE.DirectionalLight(0xffffff, 1.5).position.set(20, 50, 20));
scene.add(new THREE.AmbientLight(0xffffff, 1.0));

let inG = new THREE.Group(); scene.add(inG);

// Lantai Kantor Diperbesar Luas (80x80 meter)
let largeFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({color: 0x1f202e, roughness: 0.8})
);
largeFloor.rotation.x = -Math.PI / 2;
largeFloor.position.y = -0.01;
inG.add(largeFloor);

// Karpet Ruang Sholat (Warna Hijau Khusus di Sisi Kiri)
let sholatCarpet = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 15),
    new THREE.MeshStandardMaterial({color: 0x0f5132, roughness: 0.9})
);
sholatCarpet.rotation.x = -Math.PI / 2;
sholatCarpet.position.set(-25, 0.01, 0);
inG.add(sholatCarpet);

// Mihrab / Arah Kiblat Ruang Sholat
let mihrabBox = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 0.5),
    new THREE.MeshStandardMaterial({color: 0xd4af37})
);
mihrabBox.position.set(-25, 1.5, -7.7);
inG.add(mihrabBox);

let cIn = [], npcs = [], player = null, robotBase = null, baseY = 0, walkTime = 0, loaded = 0;
const TOTAL = 3;

function addC(a, x, z, w, d){ a.push({x, z, w, d}); }
function hit(nx, nz){
    for (let c of cIn){
        if (Math.abs(nx - c.x) < c.w / 2 + 0.8 && Math.abs(nz - c.z) < c.d / 2 + 0.8) return true;
    }
    return false;
}

function updateLoad(name, pct){
    let overall = Math.round((loaded / TOTAL) * 100 + (pct ? pct / TOTAL : 0));
    document.getElementById('loading').innerHTML = 'LOADING ' + overall + '% KANTOR LUAS<br><span id="loadDetail" style="font-size:10px;color:#aaa">' + name + ' ' + pct + '% Bos</span>';
    document.getElementById('gpsText').innerText = name + ':' + pct + '% Bos';
}
function check(name){
    loaded++;
    let p = Math.round(loaded / TOTAL * 100);
    document.getElementById('loading').innerText = 'LOADING ' + p + '% KANTOR LUAS - ' + name;
    if (loaded >= TOTAL){
        document.getElementById('loading').style.display = 'none';
        document.getElementById('gpsText').innerText = 'Siap Bos! Kantor Luar Biasa Tanpa Atap Siap!';
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
fallbackPlayer.position.set(0, 1, 15); inG.add(fallbackPlayer); player = fallbackPlayer;

loadHF(INTERIOR_URL, 'MeetingRoom', (g) => {
    let m = g.scene; 
    m.traverse(o => {
        if (o.isMesh) {
            o.material.side = THREE.DoubleSide;
            if (o.name.toLowerCase().includes('roof') || o.name.toLowerCase().includes('atap') || o.name.toLowerCase().includes('ceiling')) {
                o.visible = false;
            }
        }
    });
    let box = new THREE.Box3().setFromObject(m); let cen = new THREE.Vector3(); box.getCenter(cen);
    m.position.set(-cen.x, -box.min.y + 0.05, -cen.z); m.scale.set(4, 4, 4); m.position.multiplyScalar(4); m.position.y = 0.05;
    inG.add(m);
    
    let pl = new THREE.PointLight(0xffffff, 8, 150); pl.position.set(0, 20, 0); inG.add(pl);
    check('Interior');
});

// Batas tembok luar ruangan yang diperbesar
addC(cIn, 0, 40, 80, 2); 
addC(cIn, 0, -40, 80, 2); 
addC(cIn, 40, 0, 2, 80); 
addC(cIn, -40, 0, 2, 80);

// Pintu Keluar (Torus Merah)
let tor = new THREE.TorusGeometry(2.2, 0.25, 16, 50);
let pEX = new THREE.Mesh(tor, new THREE.MeshStandardMaterial({color: 0xFF3333, emissive: 0xFF0000, emissiveIntensity: 1.5}));
pEX.position.set(0, 1.8, 25); pEX.rotation.y = Math.PI / 2; inG.add(pEX);

// Konfigurasi NPC: 3 Duduk (isSit: true), 2 Jalan-Jalan (isSit: false dengan titik patroli)
let NPC_IN = [
    {nama: "Uni Excel Robot", role: "Excel Robot (Duduk)", emoji: "🤖", x: -4, z: -2, isSit: true},
    {nama: "Uda Video Robot", role: "Video Robot (Duduk)", emoji: "🤖", x: 0, z: -2, isSit: true},
    {nama: "Naura Robot", role: "Admin Robot (Duduk)", emoji: "🤖", x: 4, z: -2, isSit: true},
    {nama: "Uda Chatbot Robot", role: "Chatbot Robot (Jalan)", emoji: "🤖", x: 10, z: 5, startX: 10, startZ: 5, targetX: 10, targetZ: -10, speed: 0.03, isSit: false},
    {nama: "Da Min Robot", role: "Marbot Ruang Sholat (Jalan)", emoji: "🕌", x: -20, z: 0, startX: -20, startZ: 0, targetX: -25, targetZ: 10, speed: 0.03, isSit: false}
];

function spawnRobotNPCs(){
    if (!robotBase) return;
    NPC_IN.forEach(d => {
        let o = robotBase.clone(true); 
        // Ukuran diatur ke 0.8 sesuai permintaan Bos
        o.scale.set(0.8, 0.8, 0.8); 
        
        // Jika status duduk, turunkan posisi Y sedikit agar pas di kursi
        let yPos = d.isSit ? -0.2 : 0;
        o.position.set(d.x, yPos, d.z); 
        
        if (d.isSit) {
            o.rotation.y = 0; // Menghadap ke depan meja meeting
        }
        
        inG.add(o); 
        npcs.push({...d, group: o});
    });
}

loadHF(NPC_URL, 'Robot-NPC', (g) => { robotBase = g.scene; spawnRobotNPCs(); check('Robot-NPC'); });
loadHF(PLAYER_URL, 'Prabowo-BOS-Player', (g) => {
    if (fallbackPlayer && fallbackPlayer.parent) fallbackPlayer.parent.remove(fallbackPlayer);
    let m = g.scene; m.scale.set(2.2, 2.2, 2.2); let pl = m.clone(true); pl.position.set(0, 0, 15); pl.rotation.y = Math.PI; inG.add(pl); player = pl;
    check('Prabowo-Player');
});

function toOut(){
    let f = document.getElementById('fade'); 
    f.style.opacity = '1'; 
    f.style.pointerEvents = 'auto'; 
    f.innerHTML = 'KELUAR KE KANTOR LUAR...';
    setTimeout(() => { 
        window.location.href = '/kantor'; 
    }, 800);
}

let camYaw = 0, camPitch = 25, camDist = 14, keys = {x: 0, y: 0}, spd = 0.9, rspd = 1.8, run = false, nearNPC = null, nearD = false, isSit = false;
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
renderer.domElement.addEventListener('touchmove', e => { if (e.touches.length == 1) mCam(e.touches[0].clientX, e.touches[0].clientY); if (e.touches.length == 2){ let d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); camDist -= (d - lastPinch) * 0.05; camDist = Math.max(4, Math.min(35, camDist)); lastPinch = d; } e.preventDefault(); }, {passive: false});
renderer.domElement.addEventListener('touchend', eCam); renderer.domElement.addEventListener('mousedown', e => sCam(e.clientX, e.clientY)); window.addEventListener('mousemove', e => { if (camDrag) mCam(e.clientX, e.clientY); }); window.addEventListener('mouseup', eCam);
renderer.domElement.addEventListener('wheel', e => { camDist += e.deltaY * 0.01; camDist = Math.max(4, Math.min(35, camDist)); e.preventDefault(); }, {passive: false});

document.getElementById('cam').addEventListener('click', () => { camYaw += 90; });
document.getElementById('zin').addEventListener('click', () => { camDist = Math.max(4, camDist - 2); });
document.getElementById('zout').addEventListener('click', () => { camDist = Math.min(35, camDist + 2); });
document.getElementById('run').addEventListener('touchstart', () => { run = true; }, {passive: false});
document.getElementById('run').addEventListener('touchend', () => { run = false; });
document.getElementById('jump').addEventListener('click', () => { isSit = !isSit; document.getElementById('gpsText').innerText = isSit ? 'DUDUK / SHOLAT' : 'BERDIRI Bos'; });

window.closeNPC = () => { document.getElementById('npcPanel').style.display = 'none'; activeNPC = null; };
window.closeSewa = () => { document.getElementById('sewaModal').style.display = 'none'; };

let activeNPC = null;
function openNPC(n){
    activeNPC = n; document.getElementById('npcName').textContent = n.emoji + ' ' + n.nama; document.getElementById('npcRole').textContent = n.role;
    document.getElementById('npcChat').innerHTML = '<div style="color:#0f0">Halo Bos! Selamat datang di ' + n.role + ' Bos!</div>';
    document.getElementById('npcPanel').style.display = 'block'; document.getElementById('inter').style.display = 'none';
}
window.openNPC = openNPC;

async function tanyaNPC(){
    let inp = document.getElementById('npcInput'); let q = inp.value.trim(); if (!q || !activeNPC) return;
    let chat = document.getElementById('npcChat'); chat.innerHTML += '<div style="text-align:right;color:#FFD700;margin:6px 0;padding:6px 10px;background:#222;border-radius:12px">Bos: ' + q + '</div>'; inp.value = '';
    chat.innerHTML += '<div id="loadingAI" style="color:#888;font-size:12px">Robot mikir Bos...</div>'; chat.scrollTop = chat.scrollHeight;
    try {
        let prompt = "Kamu adalah " + activeNPC.nama + " robot NPC di area " + activeNPC.role + ". User: " + q;
        let r = await fetch('/api/ai', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({prompt})});
        let d = await r.json(); document.getElementById('loadingAI')?.remove();
        chat.innerHTML += '<div style="color:#00ff88;margin:6px 0;padding:6px 10px;background:#111;border:1px solid #333;border-radius:12px"><b>' + activeNPC.nama + ':</b> ' + (d.reply || 'Maaf Bos error') + '</div>'; chat.scrollTop = chat.scrollHeight;
    } catch (e){ document.getElementById('loadingAI')?.remove(); chat.innerHTML += '<div style="color:red">Error Bos</div>'; }
}
window.tanyaNPC = tanyaNPC;

window.handleInteract = function(){
    if (nearD){ toOut(); return; }
    if (nearNPC){ openNPC(nearNPC); return; }
};

function animate(){
    requestAnimationFrame(animate); 

    // ✅ Logika Robot NPC: 3 Duduk diam, 2 Jalan-Jalan (Patroli)
    npcs.forEach(n => {
        if (!n.group) return;
        if (!n.isSit) {
            let dx = n.targetX - n.group.position.x;
            let dz = n.targetZ - n.group.position.z;
            let dist = Math.hypot(dx, dz);
            
            if (dist > 1.0) {
                n.group.position.x += (dx / dist) * n.speed;
                n.group.position.z += (dz / dist) * n.speed;
                n.group.rotation.y = Math.atan2(dx, dz);
                n.group.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.1;
            } else {
                let tempX = n.startX; let tempZ = n.startZ;
                n.startX = n.targetX; n.startZ = n.targetZ;
                n.targetX = tempX; n.targetZ = tempZ;
            }
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
        let cx = player.position.x + camDist * Math.sin(yr) * Math.cos(pr), cy = player.position.y + camDist * Math.sin(pr) + 2.5, cz = player.position.z + camDist * Math.cos(yr) * Math.cos(pr);
        camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.15); camera.lookAt(player.position.x, player.position.y + 1, player.position.z);
    }
    if (pEX) pEX.rotation.z -= 0.04;
    nearNPC = null; nearD = false; let mn = 100;
    if (player){
        let isSholatArea = player.position.x < -15;
        let areaName = isSholatArea ? "🕌 Ruang Sholat" : "💻 Ruang Kerja / Workspace";
        document.getElementById('gpsText').innerText = areaName + ' Bos';

        npcs.forEach(n => { let dd = Math.hypot(player.position.x - n.group.position.x, player.position.z - n.group.position.z); if (dd < mn && dd < 6){ mn = dd; nearNPC = n; } });
        let de = Math.hypot(player.position.x, player.position.z - 25);
        if (de < 6) nearD = true;
    }
    let inter = document.getElementById('inter');
    if (nearNPC){ inter.style.display = 'block'; document.getElementById('it').innerText = nearNPC.emoji + ' ' + nearNPC.nama; document.getElementById('idp').innerText = nearNPC.role; document.getElementById('btnTap').innerText = 'TANYA ROBOT'; }
    else if (nearD){ inter.style.display = 'block'; document.getElementById('it').innerText = 'KELUAR'; document.getElementById('idp').innerText = 'Balik ke Luar'; document.getElementById('btnTap').innerText = 'KELUAR'; }
    else inter.style.display = 'none';
    renderer.render(scene,camera);
}
animate();
</script>
</body>
</html>`;
