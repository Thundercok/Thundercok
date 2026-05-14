// ==========================================
// js/core.js - HỆ ĐIỀU HÀNH & GIAO DIỆN CỐT LÕI
// ==========================================

// --- 1. BOOT SEQUENCE ---
const baseLines = [
  "initializing onc//lab...",
  "mounting research modules...",
  "loading ephemeris tables...",
  "calibrating flow field renderer...",
  "connecting to academic server...",
  "importing vrptw heuristics...",
  "loading saigonride dataset...",
  "neural pathways optimized for data science",
];
const jokeLines = [
  "ông năm chèo protocol engaged...",
  "con mẫn mặt dầy trả nợ cho người ta đi...",
  "certified loli hunter tracker enabled...",
  "sudo apt install motivation... FAILED",
  "compiling feelings.cpp... FATAL ERROR",
  "brew install discipline... NO BREW FOUND",
  "decrypting mắm tôm secrets...",
  "tìm kiếm người yêu... 404 NOT FOUND",
];

let bootLines = [];
for (let i = 0; i < 40; i++) {
  if (Math.random() > 0.75)
    bootLines.push(jokeLines[Math.floor(Math.random() * jokeLines.length)]);
  else
    bootLines.push(
      `[SYS] loading module 0x${Math.floor(Math.random() * 16777215).toString(16)}... OK`,
    );
}
bootLines = [
  ...baseLines.slice(0, 4),
  ...bootLines,
  ...baseLines.slice(4),
  "✦ system ready",
];

async function runBoot() {
  const bs = document.getElementById("boot-screen"),
    shell = document.getElementById("shell");
  if (!bs || !shell) return;

  if (sessionStorage.getItem("onc_lab_v9")) {
    bs.style.display = "none";
    shell.classList.add("visible");
    return;
  }

  let i = 0;
  const iv = setInterval(() => {
    const el = document.createElement("div");
    el.className = "boot-line" + (i === bootLines.length - 1 ? " hl" : "");
    el.textContent = `[${(Math.random() * 1000).toFixed(3)}] ${bootLines[i]}`;
    bs.appendChild(el);
    bs.scrollTop = bs.scrollHeight;
    i++;

    if (i >= bootLines.length) {
      clearInterval(iv);
      setTimeout(() => {
        bs.style.display = "none";
        shell.classList.add("visible");
        sessionStorage.setItem("onc_lab_v9", "1");
      }, 400);
    }
  }, 15);
}

// --- 2. CLOCK + DATE ---
function getLunarDate(date) {
  try {
    const parts = new Intl.DateTimeFormat("vi-VN-u-ca-chinese", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(date);
    let d = "",
      m = "",
      y = "";
    for (let p of parts) {
      if (p.type === "day") d = p.value;
      if (p.type === "month") m = p.value;
      if (p.type === "relatedYear") y = p.value;
    }
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  } catch (e) {
    return "--/--/----";
  }
}

setInterval(() => {
  const d = new Date(),
    p = (n) => String(n).padStart(2, "0");
  const clockEl = document.getElementById("clock-display");
  const gregorianEl = document.getElementById("date-gregorian");
  const lunarEl = document.getElementById("date-lunar");

  if (clockEl)
    clockEl.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;

  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  if (gregorianEl)
    gregorianEl.textContent = `${days[d.getDay()]}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  if (lunarEl) lunarEl.textContent = getLunarDate(d);
}, 1000);

// --- 3. TABS + COMMAND PALETTE ---
// Khai báo biến toàn cục để các file JS khác có thể truy cập
window.currentTab = "home";
window.currentGame = null;
window.currentGameInterval = null;

function switchTab(id) {
  window.currentTab = id;
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.tab === id));
  document
    .querySelectorAll(".pane")
    .forEach((p) => p.classList.remove("active"));
  const pane = document.getElementById("pane-" + id);
  if (pane) {
    pane.style.animation = "none";
    pane.offsetHeight;
    pane.style.animation = null;
    pane.classList.add("active");
  }

  // Dừng game Arcade nếu chuyển tab
  if (id !== "arcade" && window.currentGameInterval) {
    clearInterval(window.currentGameInterval);
    window.currentGameInterval = null;
  }
}

document
  .querySelectorAll(".tab")
  .forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.tab)));

const palette = document.getElementById("cmd-palette"),
  cmdInput = document.getElementById("cmd-input"),
  cmdList = document.getElementById("cmd-list");

const commands = [
  { cat: "nav", name: "home", action: () => switchTab("home") },
  { cat: "nav", name: "papers", action: () => switchTab("papers") },
  { cat: "nav", name: "astrology", action: () => switchTab("astro") },
  { cat: "nav", name: "arcade", action: () => switchTab("arcade") },
  {
    cat: "sys",
    name: "reboot",
    action: () => {
      sessionStorage.clear();
      location.reload();
    },
  },
];

let selIdx = 0;
function renderCmds(f = "") {
  if (!cmdList) return;
  cmdList.innerHTML = "";
  const fl = commands.filter((c) => c.name.includes(f.toLowerCase()));
  if (selIdx >= fl.length) selIdx = 0;

  fl.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "cmd-item" + (i === selIdx ? " selected" : "");
    el.innerHTML = `<span>${c.name}</span><span style="color:var(--muted);font-size:9px">${c.cat}</span>`;
    el.onmousedown = (e) => {
      e.preventDefault();
      c.action();
      hidePal();
    };
    el.onmouseover = () => {
      selIdx = i;
      renderCmds(cmdInput.value);
    };
    cmdList.appendChild(el);
  });
}

function showPal() {
  if (!palette || !cmdInput) return;
  palette.classList.add("visible");
  cmdInput.value = "";
  selIdx = 0;
  renderCmds();
  setTimeout(() => cmdInput.focus(), 30);
}

function hidePal() {
  if (palette) palette.classList.remove("visible");
}

if (cmdInput) {
  cmdInput.addEventListener("blur", () =>
    setTimeout(() => {
      if (palette && palette.classList.contains("visible")) hidePal();
    }, 120),
  );
  cmdInput.addEventListener("input", () => renderCmds(cmdInput.value));
}

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    palette && palette.classList.contains("visible") ? hidePal() : showPal();
  }
  if (e.key === "Escape") hidePal();

  if (palette && palette.classList.contains("visible")) {
    const fl = commands.filter((c) =>
      c.name.includes(cmdInput.value.toLowerCase()),
    );
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selIdx = (selIdx + 1) % fl.length;
      renderCmds(cmdInput.value);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      selIdx = (selIdx - 1 + fl.length) % fl.length;
      renderCmds(cmdInput.value);
    }
    if (e.key === "Enter" && fl[selIdx]) {
      e.preventDefault();
      fl[selIdx].action();
      hidePal();
    }
  }
});

// --- 4. FLOW FIELD BACKGROUND ---
const bgCvs = document.getElementById("canvas-bg");
const bgCtx = bgCvs ? bgCvs.getContext("2d") : null;
const C_CELL = 24;
let ft = 0,
  mouse = { x: -9999, y: -9999, active: false },
  ripples = [];
const MOUSE_R = 150,
  MOUSE_R2 = MOUSE_R * MOUSE_R,
  RIP_R = 300,
  BAND = 40;

function resizeCvs() {
  if (!bgCvs) return;
  bgCvs.width = window.innerWidth;
  bgCvs.height = window.innerHeight;
}
resizeCvs();
window.addEventListener("resize", resizeCvs);

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});
document.addEventListener("mouseleave", () => {
  mouse.active = false;
});
document.addEventListener("click", (e) => {
  if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON")
    ripples.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 45 });
});

const P = Array.from({ length: 512 }, () => Math.random() * Math.PI * 2);
function noise(x, y, z) {
  const i = Math.floor(x),
    j = Math.floor(y),
    fx = x - i,
    fy = y - j;
  const sx = fx * fx * (3 - 2 * fx),
    sy = fy * fy * (3 - 2 * fy);
  const id = (a, b) => ((a & 255) + (b & 255) * 256) & 511;
  const a = Math.sin(P[id(i, j)] + z),
    b = Math.sin(P[id(i + 1, j)] + z),
    c = Math.sin(P[id(i, j + 1)] + z),
    d = Math.sin(P[id(i + 1, j + 1)] + z);
  return (
    (a + (b - a) * sx + (c - a) * sy + (d + a - b - c) * sx * sy) * 0.5 + 0.5
  );
}
function lerpA(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

const colorCache = [];
const CACHE_STEPS = 40;
for (let i = 0; i <= CACHE_STEPS; i++) {
  let s = i / CACHE_STEPS,
    light = Math.floor(18 + s * 35),
    alpha = 0.08 + s * 0.38;
  colorCache.push(`hsla(125,${Math.floor(30 + s * 25)}%,${light}%,${alpha})`);
}
const getCachedColor = (s) =>
  colorCache[Math.floor(Math.min(1, Math.max(0, s)) * CACHE_STEPS)];
const charSets = [
  ["—", "\\", "|", "/", "—", "\\", "|", "/"],
  ["+", "×", "*", "+", "×", "*", "+", "×"],
  ["#", "@", "$", "%", "#", "@", "$", "%"],
];
let lastDrawTime = 0;
const TARGET_FPS = 24,
  FRAME_INTERVAL = 1000 / TARGET_FPS;

function drawFlow(currentTime) {
  if (!bgCtx) return;
  requestAnimationFrame(drawFlow);
  if (document.hidden) return;

  const deltaTime = currentTime - lastDrawTime;
  if (deltaTime < FRAME_INTERVAL) return;
  lastDrawTime = currentTime - (deltaTime % FRAME_INTERVAL);

  ft += 0.02;
  ripples = ripples.filter((r) => r.age < r.maxAge);
  ripples.forEach((r) => r.age++);

  bgCtx.clearRect(0, 0, bgCvs.width, bgCvs.height);
  bgCtx.font = `${C_CELL - 4}px 'DM Mono',monospace`;

  const cols = Math.ceil(bgCvs.width / C_CELL),
    rows = Math.ceil(bgCvs.height / C_CELL);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = c * C_CELL + C_CELL / 2,
        py = r * C_CELL + C_CELL / 2;
      const nx = c / cols,
        ny = r / rows;
      let angle = noise(nx * 3, ny * 3, ft * 0.35) * Math.PI * 4;
      let speed = noise(nx * 4 + 10, ny * 4 + 10, ft * 0.25 + 5);

      if (mouse.active) {
        const dx = px - mouse.x,
          dy = py - mouse.y,
          d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_R2) {
          const dist = Math.sqrt(d2),
            inf = Math.pow(1 - dist / MOUSE_R, 2) * 0.9;
          angle = lerpA(angle, Math.atan2(dy, dx) + Math.PI, inf);
          speed = Math.min(1, speed + inf * 0.4);
        }
      }
      if (ripples.length > 0) {
        ripples.forEach((rip) => {
          const dx = px - rip.x,
            dy = py - rip.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            wf = (rip.age / rip.maxAge) * RIP_R,
            diff = Math.abs(dist - wf);
          if (diff < BAND) {
            const ri = (1 - diff / BAND) * (1 - rip.age / rip.maxAge) * 0.75;
            angle = lerpA(angle, Math.atan2(dy, dx), ri);
            speed = Math.min(1, speed + ri * 0.5);
          }
        });
      }
      if (speed < 0.28) continue;

      const seg = Math.floor(
        ((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) /
          (Math.PI * 2)) *
          8,
      );
      let charSetIdx = 0;
      if (speed > 0.55) charSetIdx = 1;
      if (speed > 0.78) charSetIdx = 2;
      let ch = charSets[charSetIdx][seg];
      let isHovered = false;

      if (mouse.active) {
        const dx = px - mouse.x,
          dy = py - mouse.y;
        if (dx * dx + dy * dy < 40000) isHovered = true;
      }
      if (isHovered) {
        let light = Math.floor(18 + speed * 35),
          alpha = Math.min(0.75, (0.08 + speed * 0.38) * 1.5);
        bgCtx.fillStyle = `hsla(125,${Math.floor(30 + speed * 25)}%,${light}%,${alpha})`;
      } else {
        bgCtx.fillStyle = getCachedColor(speed);
      }
      bgCtx.fillText(ch, c * C_CELL, r * C_CELL + C_CELL);
    }
  }
}

// Khởi chạy hệ thống sau khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
  runBoot();
  requestAnimationFrame(drawFlow);
});
