// =========================================
// Ông Năm Chèo — CLI × Zen Portfolio
// Core Engine: Boot · Flow Field Canvas · CLI · Astrology · Arcade · I-Ching · Audio Chime
// =========================================

(() => {
"use strict";

// ── ZEN WISDOM ──
const ZEN_QUOTES = [
    '"Before enlightenment, chop wood, carry water.\nAfter enlightenment, chop wood, carry water."',
    '"The obstacle is the path."',
    '"In the beginner\'s mind there are many possibilities,\nin the expert\'s mind there are few."',
    '"Sitting quietly, doing nothing, spring comes,\nand the grass grows by itself."',
    '"When you reach the top of the mountain, keep climbing."',
    '"No snowflake ever falls in the wrong place."',
    '"The quieter you become, the more you can hear."',
    '"Let go, or be dragged."',
    '"A flower does not think of competing\nwith the flower next to it. It just blooms."',
    '"The way out is through."',
    '"Muddy water, let stand, becomes clear."',
    '"If you understand, things are just as they are.\nIf you do not understand, things are just as they are."',
];

const LOAD_TIME = Date.now();
let bgEnabled = true;
let badAppleBgMode = false;


// ════════════════════════════════════════
// 1. BOOT SEQUENCE — Ensō
// ════════════════════════════════════════

function initBoot() {
    const boot = document.getElementById("boot-screen");
    const app  = document.getElementById("app");
    const cli  = document.getElementById("cli-bar");
    if (!boot || !app) return;

    if (sessionStorage.getItem("onc_zen_v1")) {
        boot.style.display = "none";
        app.classList.add("visible");
        if (cli) cli.classList.add("visible");
        onReady();
        return;
    }

    setTimeout(() => {
        boot.classList.add("fade-out");
        setTimeout(() => {
            boot.style.display = "none";
            app.classList.add("visible");
            if (cli) cli.classList.add("visible");
            sessionStorage.setItem("onc_zen_v1", "1");
            onReady();
        }, 800);
    }, 3400);
}

function onReady() {
    initScrollSpy();
    initReveal();
    initClock();
    initZenQuotes();
    initFlowCanvas();
    initAstro();
    initArcade();
    initIChing();
}


// ════════════════════════════════════════
// 2. FLOW FIELD CANVAS BACKGROUND
// ════════════════════════════════════════

function initFlowCanvas() {
    const cvs = document.getElementById("canvas-bg");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const C_CELL = 24;
    let ft = 0;
    let mouse = { x: -9999, y: -9999, active: false };
    let ripples = [];
    let sparks  = [];

    function resize() {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });
    document.addEventListener("mouseleave", () => {
        mouse.active = false;
    });
    document.addEventListener("click", (e) => {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
            ripples.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 40 });
            playSingingBowl(320 + Math.random() * 100, 0.04);
        }
    });

    const P = Array.from({ length: 512 }, () => Math.random() * Math.PI * 2);
    function noise(x, y, z) {
        const i = Math.floor(x), j = Math.floor(y);
        const fx = x - i, fy = y - j;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const id = (a, b) => ((a & 255) + (b & 255) * 256) & 511;
        const a = Math.sin(P[id(i, j)] + z);
        const b = Math.sin(P[id(i + 1, j)] + z);
        const c = Math.sin(P[id(i, j + 1)] + z);
        const d = Math.sin(P[id(i + 1, j + 1)] + z);
        return (a + (b - a) * sx + (c - a) * sy + (d + a - b - c) * sx * sy) * 0.5 + 0.5;
    }

    const charSets = [
        ["·", "~", "≈", "≋", "∿", "~", "≈", "≋"],
        ["λ", "ψ", "∇", "∂", "∫", "δ", "∇", "∂"],
        ["█", "▓", "▒", "░", "█", "▓", "▒", "░"],
    ];

    function draw() {
        requestAnimationFrame(draw);
        if (!bgEnabled || document.hidden) {
            if (!bgEnabled) ctx.clearRect(0, 0, cvs.width, cvs.height);
            return;
        }

        ft += 0.012;
        ripples = ripples.filter(r => r.age < r.maxAge);
        ripples.forEach(r => r.age++);

        sparks = sparks.filter(s => s.age < s.maxAge);
        sparks.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.95;
            s.vy *= 0.95;
            s.age++;
        });

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.font = `${C_CELL - 6}px 'JetBrains Mono', monospace`;

        const cols = Math.ceil(cvs.width / C_CELL);
        const rows = Math.ceil(cvs.height / C_CELL);

        // ── BAD APPLE SILHOUETTE EASTER EGG MODE (Vector Shadow Engine) ──
        if (badAppleBgMode) {
            if (!cvs._maskCanvas) {
                cvs._maskCanvas = document.createElement("canvas");
                cvs._maskCtx = cvs._maskCanvas.getContext("2d");
            }
            const mCvs = cvs._maskCanvas;
            const mCtx = cvs._maskCtx;
            if (mCvs.width !== cols || mCvs.height !== rows) {
                mCvs.width = cols;
                mCvs.height = rows;
            }

            mCtx.fillStyle = "#000000";
            mCtx.fillRect(0, 0, cols, rows);
            mCtx.fillStyle = "#ffffff";

            const t = ft * 3;
            const scene = Math.floor(t / 12) % 3; // 3 dynamic scenes
            const cx = cols * 0.65;
            const cy = rows * 0.5;

            if (scene === 0) {
                // Scene 1: Spinning Apple + Dancing Figure
                const appleR = 6 + Math.sin(t * 2) * 1.5;
                mCtx.beginPath();
                mCtx.arc(cx - 15, cy - 8, appleR, 0, Math.PI * 2);
                mCtx.fill();

                // Dancing Silhouette
                const headX = cx + 8 + Math.cos(t) * 4;
                const headY = cy - 10 + Math.sin(t * 1.5) * 2;
                mCtx.beginPath(); mCtx.arc(headX, headY, 5, 0, Math.PI * 2); mCtx.fill(); // Head
                mCtx.fillRect(headX - 3, headY + 5, 6, 12); // Torso

                // Flowing Hair (Twin Tails)
                mCtx.beginPath();
                mCtx.moveTo(headX - 4, headY - 2);
                mCtx.quadraticCurveTo(headX - 14 + Math.sin(t * 2) * 4, headY + 6, headX - 12, headY + 16);
                mCtx.lineWidth = 3; mCtx.strokeStyle = "#ffffff"; mCtx.stroke();

                // Dress
                mCtx.beginPath();
                mCtx.moveTo(headX - 3, headY + 14);
                mCtx.lineTo(headX - 12 + Math.sin(t * 2.5) * 5, headY + 28);
                mCtx.lineTo(headX + 12 + Math.cos(t * 2.5) * 5, headY + 28);
                mCtx.lineTo(headX + 3, headY + 14);
                mCtx.closePath(); mCtx.fill();
            } else if (scene === 1) {
                // Scene 2: Full Pose & Slash Rays
                const headX = cx;
                const headY = cy - 12;
                mCtx.beginPath(); mCtx.arc(headX, headY, 6, 0, Math.PI * 2); mCtx.fill();
                mCtx.fillRect(headX - 4, headY + 6, 8, 14);

                // Arms outstretched
                mCtx.lineWidth = 3; mCtx.strokeStyle = "#ffffff";
                mCtx.beginPath();
                mCtx.moveTo(headX - 18, headY + 4 + Math.sin(t * 3) * 6);
                mCtx.lineTo(headX + 18, headY + 4 - Math.sin(t * 3) * 6);
                mCtx.stroke();

                // Flowing Skirt
                mCtx.beginPath();
                mCtx.moveTo(headX - 4, headY + 18);
                mCtx.lineTo(headX - 16, headY + 34);
                mCtx.lineTo(headX + 16, headY + 34);
                mCtx.closePath(); mCtx.fill();
            } else {
                // Scene 3: Huge Pulsing Bad Apple Emblem
                const rApple = 14 + Math.sin(t * 3) * 3;
                mCtx.beginPath(); mCtx.arc(cx, cy, rApple, 0, Math.PI * 2); mCtx.fill();
                mCtx.fillRect(cx - 2, cy - rApple - 4, 4, 6); // Stem
            }

            // Extract Pixel Data
            const imgData = mCtx.getImageData(0, 0, cols, rows).data;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const idx = (r * cols + c) * 4;
                    const bright = imgData[idx];

                    if (bright > 100) {
                        const chars = ["█", "▓", "▒", "░", "✦", "★", "◈"];
                        const char = chars[(c + r + Math.floor(t * 10)) % chars.length];
                        ctx.fillStyle = `rgba(246, 243, 237, ${0.85 + Math.sin(t + c * 0.1) * 0.15})`;
                        ctx.fillText(char, c * C_CELL, r * C_CELL + C_CELL);
                    } else {
                        const nx = c / cols, ny = r / rows;
                        if (noise(nx * 4, ny * 4, ft * 0.2) > 0.48) {
                            ctx.fillStyle = `rgba(223, 190, 149, 0.1)`;
                            ctx.fillText("·", c * C_CELL, r * C_CELL + C_CELL);
                        }
                    }
                }
            }

            // Render HUD Banner
            ctx.fillStyle = "rgba(230, 200, 158, 0.95)";
            ctx.font = "13px 'JetBrains Mono', monospace";
            ctx.fillText("✦ BAD APPLE!! [CANVAS VECTOR EASTER EGG ACTIVE]", 24, 40);
            return;
        }

        // ── STANDARD FLOW FIELD MODE ──
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = c * C_CELL + C_CELL / 2;
                const py = r * C_CELL + C_CELL / 2;
                const nx = c / cols, ny = r / rows;

                let angle = noise(nx * 3, ny * 3, ft * 0.3) * Math.PI * 4;
                let speed = noise(nx * 4 + 10, ny * 4 + 10, ft * 0.2 + 5);

                if (mouse.active) {
                    const dx = px - mouse.x, dy = py - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 22500) {
                        const dist = Math.sqrt(d2);
                        const inf = Math.pow(1 - dist / 150, 2) * 0.8;
                        angle += (Math.atan2(dy, dx) + Math.PI - angle) * inf;
                        speed = Math.min(1, speed + inf * 0.4);
                    }
                }

                ripples.forEach(rip => {
                    const dx = px - rip.x, dy = py - rip.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const wf = (rip.age / rip.maxAge) * 300;
                    const diff = Math.abs(dist - wf);
                    if (diff < 40) {
                        const ri = (1 - diff / 40) * (1 - rip.age / rip.maxAge) * 0.7;
                        speed = Math.min(1, speed + ri * 0.5);
                    }
                });

                if (speed < 0.3) continue;

                const seg = Math.floor((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 8);
                let charIdx = 0;
                if (speed > 0.58) charIdx = 1;
                if (speed > 0.8) charIdx = 2;
                const ch = charSets[charIdx][seg];

                // Zen Stone Garden Palette
                const alpha = Math.min(0.4, 0.05 + speed * 0.28);
                ctx.fillStyle = `rgba(196, 168, 130, ${alpha})`;
                ctx.fillText(ch, c * C_CELL, r * C_CELL + C_CELL);
            }
        }
    }

    requestAnimationFrame(draw);
}


// ════════════════════════════════════════
// 3. SOUND SYNTHESIZER (Zen Tibetan Bowl / Chime)
// ════════════════════════════════════════

function playSingingBowl() {
    // SFX Disabled
    return;
}


// ════════════════════════════════════════
// 4. CLI ENGINE
// ════════════════════════════════════════

const SECTIONS = ["about", "work", "projects", "skills", "writings", "astrology", "arcade", "iching", "contact"];

const COMMANDS = {
    help:     { cat: "sys",  desc: "Show available commands",   fn: cmdHelp },
    about:    { cat: "nav",  desc: "Navigate to about",         fn: () => navTo("about") },
    work:     { cat: "nav",  desc: "Navigate to work",          fn: () => navTo("work") },
    projects: { cat: "nav",  desc: "Navigate to projects",      fn: () => navTo("projects") },
    skills:   { cat: "nav",  desc: "Navigate to skills",        fn: () => navTo("skills") },
    writings: { cat: "nav",  desc: "Navigate to writings",      fn: () => navTo("writings") },
    astrology:{ cat: "nav",  desc: "Navigate to birth chart",   fn: () => navTo("astrology") },
    arcade:   { cat: "nav",  desc: "Navigate to arcade games",  fn: () => navTo("arcade") },
    iching:   { cat: "nav",  desc: "Navigate to I Ching oracle",fn: () => navTo("iching") },
    contact:  { cat: "nav",  desc: "Navigate to contact",       fn: () => navTo("contact") },
    badapple: { cat: "fun",  desc: "Play Bad Apple!! video",    fn: playBadApple },
    bell:     { cat: "fun",  desc: "Sound Tibetan singing bowl",fn: cmdBell },
    bg:       { cat: "sys",  desc: "Toggle background animation",fn: cmdBg },
    clear:    { cat: "sys",  desc: "Clear terminal output",     fn: cmdClear },
    ls:       { cat: "sys",  desc: "List all sections",         fn: cmdLs },
    whoami:   { cat: "sys",  desc: "Display identity",          fn: cmdWhoami },
    date:     { cat: "sys",  desc: "Show current date & time",  fn: cmdDate },
    zen:      { cat: "fun",  desc: "A moment of wisdom",        fn: cmdZen },
    neofetch: { cat: "fun",  desc: "System information",        fn: cmdNeofetch },
    reboot:   { cat: "sys",  desc: "Reload the page",           fn: () => { sessionStorage.clear(); location.reload(); } },
    echo:     { cat: "sys",  desc: "Echo text back",            fn: cmdEcho },
    sudo:     { cat: "fun",  desc: "Elevate privileges",        fn: cmdSudo },
    pwd:      { cat: "sys",  desc: "Print working directory",   fn: cmdPwd },
};

let cmdHistory = [];
let historyIdx = -1;

function initCLI() {
    const input = document.getElementById("cli-input");
    if (!input) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const raw = input.value.trim();
            if (!raw) return;

            cmdHistory.unshift(raw);
            if (cmdHistory.length > 50) cmdHistory.pop();
            historyIdx = -1;

            const parts = raw.split(/\s+/);
            const cmd   = parts[0].toLowerCase();
            const args  = parts.slice(1).join(" ");

            cliPrint(`<span class="cli-cmd">guest@onc:~$ ${esc(raw)}</span>`);

            if (COMMANDS[cmd]) {
                COMMANDS[cmd].fn(args);
            } else if (cmd === "rm" && args.includes("-rf")) {
                cliPrint(`<span class="cli-error">☽ Nice try. In Zen, we do not destroy — we release.</span>`);
            } else {
                cliPrint(`<span class="cli-error">command not found: ${esc(cmd)}. Type 'help' for available commands.</span>`);
            }

            input.value = "";
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIdx < cmdHistory.length - 1) {
                historyIdx++;
                input.value = cmdHistory[historyIdx];
            }
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIdx > 0) {
                historyIdx--;
                input.value = cmdHistory[historyIdx];
            } else {
                historyIdx = -1;
                input.value = "";
            }
        }

        if (e.key === "Tab") {
            e.preventDefault();
            const partial = input.value.trim().toLowerCase();
            if (!partial) return;
            const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial));
            if (matches.length === 1) {
                input.value = matches[0] + " ";
            } else if (matches.length > 1) {
                cliPrint(`<span class="cli-result">${matches.join("  ")}</span>`);
            }
        }
    });
}

function cliPrint(html) {
    const output = document.getElementById("cli-output");
    if (!output) return;
    const line = document.createElement("div");
    line.className = "cli-line";
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function esc(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
}

function navTo(id) {
    const el   = document.getElementById(id);
    const main = document.getElementById("main-content");
    if (!el) return;

    if (window.innerWidth > 900 && main) {
        main.scrollTo({ top: el.offsetTop - 32, behavior: "smooth" });
    } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    cliPrint(`<span class="cli-result">→ ${id}</span>`);
}

function cmdHelp() {
    const cats = {};
    for (const [name, cmd] of Object.entries(COMMANDS)) {
        if (!cats[cmd.cat]) cats[cmd.cat] = [];
        cats[cmd.cat].push({ name, desc: cmd.desc });
    }

    let out = `<span class="cli-accent">Available commands:</span>\n`;
    for (const [cat, cmds] of Object.entries(cats)) {
        out += `\n<span class="cli-accent">[${cat}]</span>\n`;
        for (const c of cmds) {
            out += `  ${c.name.padEnd(12)} <span class="cli-result">${c.desc}</span>\n`;
        }
    }
    out += `\n<span class="cli-result">Tip: use Tab for autocomplete, ↑↓ for history</span>`;
    cliPrint(out);
}

function cmdBell() {
    playSingingBowl(432, 0.25);
    cliPrint(`<span class="cli-accent">🔔 *gong* — Tibetan Singing Bowl chimed at 432 Hz</span>`);
}

function cmdBg() {
    bgEnabled = !bgEnabled;
    cliPrint(`<span class="cli-result">Background animation: ${bgEnabled ? "ENABLED" : "DISABLED"}</span>`);
}

function cmdClear() {
    const output = document.getElementById("cli-output");
    if (output) output.innerHTML = "";
}

function cmdLs() {
    cliPrint(`<span class="cli-accent">${SECTIONS.join("  ")}</span>`);
}

function cmdWhoami() {
    cliPrint(`<span class="cli-result">Ông Năm Chèo\nAI & Optimization Engineer\nSaigon, Vietnam ☽</span>`);
}

function cmdDate() {
    const now = new Date();
    cliPrint(`<span class="cli-result">${now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "long" })}</span>`);
}

function cmdZen() {
    const q = ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)];
    cliPrint(`\n<span class="cli-accent">${q}</span>\n`);
    playSingingBowl(528, 0.1);
}

function cmdNeofetch() {
    const uptime  = Math.floor((Date.now() - LOAD_TIME) / 1000);
    const mins    = Math.floor(uptime / 60);
    const secs    = uptime % 60;

    const lines = [
        "",
        `  <span class="cli-accent">  ╭─────╮</span>    <span class="cli-cmd">guest@onc</span>`,
        `  <span class="cli-accent">  │ ☽   │</span>    ─────────────`,
        `  <span class="cli-accent">  ╰─────╯</span>    OS:      Zen Terminal v2.0`,
        `              Host:    Saigon, Vietnam`,
        `              Shell:   onc-sh`,
        `              Res:     ${window.innerWidth}×${window.innerHeight}`,
        `              Theme:   stone-garden`,
        `              Uptime:  ${mins}m ${secs}s`,
        `              Memory:  ∞ (zen mind)`,
        "",
    ];
    cliPrint(`<span class="cli-result">${lines.join("\n")}</span>`);
}

function cmdEcho(args) {
    cliPrint(`<span class="cli-result">${esc(args || "")}</span>`);
}

function cmdSudo() {
    cliPrint(`<span class="cli-error">☽ In Zen, there is no sudo. All permissions come from within.</span>`);
}

function cmdPwd() {
    const main = document.getElementById("main-content");
    let current = "~";
    if (main) {
        const scrollPos = main.scrollTop + 100;
        for (const id of SECTIONS) {
            const sec = document.getElementById(id);
            if (sec && sec.offsetTop <= scrollPos) current = id;
        }
    }
    cliPrint(`<span class="cli-result">/home/guest/${current}</span>`);
}


// ════════════════════════════════════════
// 5. ASTROLOGY MODULE
// ════════════════════════════════════════

function initAstro() {
    const btn = document.getElementById("btn-calc-astro");
    const res = document.getElementById("astro-result");
    if (!btn || !res) return;

    btn.addEventListener("click", () => {
        const dob = document.getElementById("a-dob").value;
        const tob = document.getElementById("a-tob").value;
        const pob = document.getElementById("a-pob").value || "Hồ Chí Minh";

        if (!dob) return;

        const date = new Date(dob + "T" + (tob || "12:00"));
        const month = date.getMonth() + 1;
        const day   = date.getDate();

        // Zodiac signs
        const zodiacs = [
            { name: "Capricorn (Ma Kết)", sym: "♑", elem: "Earth" },
            { name: "Aquarius (Bảo Bình)", sym: "♒", elem: "Air" },
            { name: "Pisces (Song Ngư)", sym: "♓", elem: "Water" },
            { name: "Aries (Bạch Dương)", sym: "♈", elem: "Fire" },
            { name: "Taurus (Kim Ngưu)", sym: "♉", elem: "Earth" },
            { name: "Gemini (Song Tử)", sym: "♊", elem: "Air" },
            { name: "Cancer (Cự Giải)", sym: "♋", elem: "Water" },
            { name: "Leo (Sư Tử)", sym: "♌", elem: "Fire" },
            { name: "Virgo (Xử Nữ)", sym: "♍", elem: "Earth" },
            { name: "Libra (Thiên Bình)", sym: "♎", elem: "Air" },
            { name: "Scorpio (Bọ Cạp)", sym: "♏", elem: "Water" },
            { name: "Sagittarius (Nhân Mã)", sym: "♐", elem: "Fire" },
        ];

        const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
        let sunIdx = month - 1;
        if (day < dates[sunIdx]) sunIdx = (sunIdx + 11) % 12;

        const sunSign = zodiacs[sunIdx];
        const moonSign = zodiacs[(sunIdx + 4) % 12]; // Simulated offset for moon
        const ascSign  = zodiacs[(sunIdx + (date.getHours() % 12)) % 12]; // Simulated ascendant

        playSingingBowl(528, 0.2);

        res.innerHTML = `
            <div class="astro-cards">
                <div class="astro-card">
                    <div class="astro-card-title">Sun Sign ☉</div>
                    <div class="astro-card-val">${sunSign.sym} ${sunSign.name}</div>
                    <div class="astro-card-sub">Element: ${sunSign.elem}</div>
                </div>
                <div class="astro-card">
                    <div class="astro-card-title">Moon Sign ☽</div>
                    <div class="astro-card-val">${moonSign.sym} ${moonSign.name}</div>
                    <div class="astro-card-sub">Element: ${moonSign.elem}</div>
                </div>
                <div class="astro-card">
                    <div class="astro-card-title">Ascendant ⬆</div>
                    <div class="astro-card-val">${ascSign.sym} ${ascSign.name}</div>
                    <div class="astro-card-sub">Origin: ${esc(pob)}</div>
                </div>
            </div>
        `;
    });
}


// ════════════════════════════════════════
// 6. ARCADE MODULE (Snake, Tetris, Zen Pong, DOOM)
// ════════════════════════════════════════

function initArcade() {
    const canvas = document.getElementById("arcade-canvas");
    const iframe = document.getElementById("arcade-iframe");
    const scoreVal = document.getElementById("arcade-score-val");
    if (!canvas || !iframe) return;

    const ctx = canvas.getContext("2d");
    let activeGame = "snake";
    let gameLoop = null;
    let score = 0;

    // Snake State
    let snake = [{x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}];
    let dir = {x: 0, y: -1};
    let food = {x: 5, y: 5};
    const GRID = 16;
    const COLS = 20, ROWS = 25;

    // Tetris State
    const TETRIS_COLS = 10, TETRIS_ROWS = 20;
    const TETRIS_GRID = 16;
    let tetrisBoard = Array.from({length: TETRIS_ROWS}, () => Array(TETRIS_COLS).fill(0));
    let currentPiece = null;
    let piecePos = {x: 3, y: 0};

    const PIECES = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[0, 1, 0], [1, 1, 1]], // T
        [[1, 0, 0], [1, 1, 1]], // L
        [[0, 0, 1], [1, 1, 1]], // J
        [[0, 1, 1], [1, 1, 0]], // S
        [[1, 1, 0], [0, 1, 1]]  // Z
    ];

    function startSnake() {
        clearInterval(gameLoop);
        iframe.style.display = "none";
        canvas.style.display = "block";

        snake = [{x: 10, y: 12}, {x: 10, y: 13}, {x: 10, y: 14}];
        dir = {x: 0, y: -1};
        score = 0;
        if (scoreVal) scoreVal.textContent = "0";

        gameLoop = setInterval(() => {
            const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

            if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
                clearInterval(gameLoop);
                ctx.fillStyle = "rgba(0,0,0,0.85)";
                ctx.fillRect(0, 0, 320, 400);
                ctx.fillStyle = "#dfbe95";
                ctx.font = "16px 'JetBrains Mono', monospace";
                ctx.fillText("GAME OVER", 110, 200);
                return;
            }

            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                if (scoreVal) scoreVal.textContent = score;
                food = {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)};
                playSingingBowl(600, 0.1);
            } else {
                snake.pop();
            }

            ctx.fillStyle = "#121212";
            ctx.fillRect(0, 0, 320, 400);

            // Food
            ctx.fillStyle = "#dfbe95";
            ctx.fillRect(food.x * GRID + 2, food.y * GRID + 2, GRID - 4, GRID - 4);

            // Snake
            ctx.fillStyle = "#a6d6a0";
            snake.forEach(s => {
                ctx.fillRect(s.x * GRID + 1, s.y * GRID + 1, GRID - 2, GRID - 2);
            });
        }, 100);
    }

    function spawnTetrisPiece() {
        currentPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
        piecePos = {x: 3, y: 0};
    }

    function startTetris() {
        clearInterval(gameLoop);
        iframe.style.display = "none";
        canvas.style.display = "block";
        tetrisBoard = Array.from({length: TETRIS_ROWS}, () => Array(TETRIS_COLS).fill(0));
        score = 0;
        if (scoreVal) scoreVal.textContent = "0";
        spawnTetrisPiece();

        gameLoop = setInterval(() => {
            // Move down
            if (!checkCollision(currentPiece, piecePos.x, piecePos.y + 1)) {
                piecePos.y++;
            } else {
                // Lock piece
                currentPiece.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (cell && piecePos.y + r < TETRIS_ROWS) {
                            tetrisBoard[piecePos.y + r][piecePos.x + c] = 1;
                        }
                    });
                });

                // Clear lines
                tetrisBoard = tetrisBoard.filter(row => !row.every(c => c === 1));
                while (tetrisBoard.length < TETRIS_ROWS) {
                    tetrisBoard.unshift(Array(TETRIS_COLS).fill(0));
                    score += 20;
                    if (scoreVal) scoreVal.textContent = score;
                    playSingingBowl(520, 0.15);
                }

                spawnTetrisPiece();
                if (checkCollision(currentPiece, piecePos.x, piecePos.y)) {
                    clearInterval(gameLoop);
                    ctx.fillStyle = "rgba(0,0,0,0.85)";
                    ctx.fillRect(0, 0, 320, 400);
                    ctx.fillStyle = "#dfbe95";
                    ctx.font = "16px 'JetBrains Mono', monospace";
                    ctx.fillText("TETRIS OVER", 100, 200);
                    return;
                }
            }

            drawTetris();
        }, 300);
    }

    function checkCollision(piece, px, py) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece[r].length; c++) {
                if (piece[r][c]) {
                    let newX = px + c;
                    let newY = py + r;
                    if (newX < 0 || newX >= TETRIS_COLS || newY >= TETRIS_ROWS) return true;
                    if (newY >= 0 && tetrisBoard[newY][newX]) return true;
                }
            }
        }
        return false;
    }

    function drawTetris() {
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, 320, 400);

        // Draw Board
        const offsetX = 80;
        for (let r = 0; r < TETRIS_ROWS; r++) {
            for (let c = 0; c < TETRIS_COLS; c++) {
                if (tetrisBoard[r][c]) {
                    ctx.fillStyle = "#dfbe95";
                    ctx.fillRect(offsetX + c * TETRIS_GRID, r * TETRIS_GRID, TETRIS_GRID - 1, TETRIS_GRID - 1);
                }
            }
        }

        // Draw Current Piece
        if (currentPiece) {
            ctx.fillStyle = "#a6d6a0";
            currentPiece.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell) {
                        ctx.fillRect(offsetX + (piecePos.x + c) * TETRIS_GRID, (piecePos.y + r) * TETRIS_GRID, TETRIS_GRID - 1, TETRIS_GRID - 1);
                    }
                });
            });
        }
    }

    function startPong() {
        clearInterval(gameLoop);
        iframe.style.display = "none";
        canvas.style.display = "block";
        score = 0;

        gameLoop = setInterval(() => {
            pongBall.x += pongBall.dx;
            pongBall.y += pongBall.dy;

            if (pongBall.x <= 0 || pongBall.x >= 320) pongBall.dx *= -1;
            if (pongBall.y <= 0) pongBall.dy *= -1;

            if (pongBall.y >= 380 && Math.abs(pongBall.x - pongP1) < 40) {
                pongBall.dy *= -1;
                score += 5;
                if (scoreVal) scoreVal.textContent = score;
                playSingingBowl(500, 0.1);
            } else if (pongBall.y > 400) {
                pongBall = {x: 160, y: 100, dx: 3, dy: 3};
            }

            ctx.fillStyle = "#121212";
            ctx.fillRect(0, 0, 320, 400);

            // Paddle
            ctx.fillStyle = "#dfbe95";
            ctx.fillRect(pongP1 - 30, 380, 60, 8);

            // Ball
            ctx.fillStyle = "#a6d6a0";
            ctx.beginPath();
            ctx.arc(pongBall.x, pongBall.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }, 16);
    }

    function startEmbed(url) {
        clearInterval(gameLoop);
        canvas.style.display = "none";
        iframe.style.display = "block";
        iframe.src = url;
    }

    document.querySelectorAll(".game-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".game-tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const game = btn.dataset.game;
            activeGame = game;

            if (game === "snake") startSnake();
            else if (game === "pong") startPong();
            else if (game === "tetris") startTetris();
            else if (game === "doom") startEmbed("https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos");
            else if (game === "wolf3d") startEmbed("https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fwolf3d.jsdos");
        });
    });

    document.addEventListener("keydown", (e) => {
        if (activeGame === "snake") {
            if (e.key === "ArrowUp" || e.key === "w") { if (dir.y !== 1) dir = {x: 0, y: -1}; }
            if (e.key === "ArrowDown" || e.key === "s") { if (dir.y !== -1) dir = {x: 0, y: 1}; }
            if (e.key === "ArrowLeft" || e.key === "a") { if (dir.x !== 1) dir = {x: -1, y: 0}; }
            if (e.key === "ArrowRight" || e.key === "d") { if (dir.x !== -1) dir = {x: 1, y: 0}; }
        } else if (activeGame === "tetris") {
            if (e.key === "ArrowLeft" || e.key === "a") {
                if (!checkCollision(currentPiece, piecePos.x - 1, piecePos.y)) piecePos.x--;
            }
            if (e.key === "ArrowRight" || e.key === "d") {
                if (!checkCollision(currentPiece, piecePos.x + 1, piecePos.y)) piecePos.x++;
            }
            if (e.key === "ArrowDown" || e.key === "s") {
                if (!checkCollision(currentPiece, piecePos.x, piecePos.y + 1)) piecePos.y++;
            }
            if (e.key === "ArrowUp" || e.key === "w") {
                // Rotate matrix
                const rotated = currentPiece[0].map((_, i) => currentPiece.map(row => row[i]).reverse());
                if (!checkCollision(rotated, piecePos.x, piecePos.y)) currentPiece = rotated;
            }
            drawTetris();
        } else if (activeGame === "pong") {
            if (e.key === "ArrowLeft" || e.key === "a") pongP1 = Math.max(30, pongP1 - 20);
            if (e.key === "ArrowRight" || e.key === "d") pongP1 = Math.min(290, pongP1 + 20);
        }
    });

    startSnake();
}


// ════════════════════════════════════════
// 7. I CHING ORACLE (Kinh Dịch Bói Quẻ)
// ════════════════════════════════════════

const HEXAGRAMS = [
    { num: 1, name: "乾 (Càn - The Creative)", sym: "䷀", meaning: "Great success through perseverance. Pure Yang power. Action with wisdom and strength." },
    { num: 2, name: "坤 (Khôn - The Receptive)", sym: "䷁", meaning: "Devotion, yielding, spatial awareness. Embrace patience and harmony like the fertile earth." },
    { num: 11, name: "泰 (Thái - Peace & Harmony)", sym: "䷊", meaning: "Prosperity, balance, effortless flow. Heaven and Earth connect in mutual abundance." },
    { num: 24, name: "復 (Phục - Return / Renewal)", sym: "䷗", meaning: "A new turning point. Light returns after darkness. Fresh beginnings emerge naturally." },
    { num: 52, name: "艮 (Cấn - Keeping Still)", sym: "䷳", meaning: "Restraint, meditation, inner peace. When it is time to stop, stop. Stillness of mind." },
    { num: 63, name: "旣濟 (Ký Tế - After Completion)", sym: "䷾", meaning: "Completion achieved. Maintain vigilance and order. Order transitions back to chaos." },
];

function initIChing() {
    const btn = document.getElementById("btn-cast-iching");
    const out = document.getElementById("iching-output");
    if (!btn || !out) return;

    btn.addEventListener("click", () => {
        const hex = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];
        playSingingBowl(432, 0.25);

        out.style.display = "block";
        out.innerHTML = `
            <div class="iching-symbol">${hex.sym}</div>
            <div class="iching-title">Hexagram #${hex.num}: ${hex.name}</div>
            <div class="iching-meaning">${hex.meaning}</div>
        `;
    });
}


// ════════════════════════════════════════
// 8. SCROLL SPY & REVEAL
// ════════════════════════════════════════

function initScrollSpy() {
    const main     = document.getElementById("main-content");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");
    if (!main || !sections.length || !navLinks.length) return;

    const root = window.innerWidth > 900 ? main : null;

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.dataset.section === id);
                });
            }
        }
    }, {
        root,
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0,
    });

    sections.forEach(s => observer.observe(s));

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navTo(link.dataset.section);
        });
    });
}

function initReveal() {
    const bodies = document.querySelectorAll(".section-body");
    const main   = document.getElementById("main-content");
    if (!bodies.length) return;

    const root = window.innerWidth > 900 ? main : null;

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        }
    }, {
        root,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.05,
    });

    bodies.forEach(b => observer.observe(b));
}


// ════════════════════════════════════════
// 9. COMMAND PALETTE (Ctrl+K)
// ════════════════════════════════════════

function initPalette() {
    const palette  = document.getElementById("cmd-palette");
    const searchEl = document.getElementById("cmd-search");
    const listEl   = document.getElementById("cmd-list");
    if (!palette || !searchEl || !listEl) return;

    const items = Object.entries(COMMANDS).map(([name, cmd]) => ({
        name,
        cat: cmd.cat,
        action: () => {
            if (cmd.cat === "nav") navTo(name);
            else cmd.fn("");
        },
    }));

    let selIdx = 0;

    function render(filter = "") {
        listEl.innerHTML = "";
        const filtered = items.filter(c => c.name.includes(filter.toLowerCase()));
        if (selIdx >= filtered.length) selIdx = Math.max(0, filtered.length - 1);

        filtered.forEach((c, i) => {
            const el = document.createElement("div");
            el.className = "cmd-item" + (i === selIdx ? " selected" : "");
            el.setAttribute("role", "option");
            el.innerHTML = `<span>${c.name}</span><span class="cmd-cat">${c.cat}</span>`;
            el.onmousedown = (e) => { e.preventDefault(); c.action(); hide(); };
            el.onmouseover = () => { selIdx = i; render(searchEl.value); };
            listEl.appendChild(el);
        });
    }

    function show() {
        palette.classList.add("visible");
        searchEl.value = "";
        selIdx = 0;
        render();
        setTimeout(() => searchEl.focus(), 30);
    }

    function hide() {
        palette.classList.remove("visible");
    }

    searchEl.addEventListener("input", () => { selIdx = 0; render(searchEl.value); });
    searchEl.addEventListener("blur", () => setTimeout(() => {
        if (palette.classList.contains("visible")) hide();
    }, 150));

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            palette.classList.contains("visible") ? hide() : show();
            return;
        }
        if (e.key === "Escape" && palette.classList.contains("visible")) {
            hide();
            return;
        }

        if (!palette.classList.contains("visible")) return;
        const filtered = items.filter(c => c.name.includes(searchEl.value.toLowerCase()));

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selIdx = (selIdx + 1) % filtered.length;
            render(searchEl.value);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selIdx = (selIdx - 1 + filtered.length) % filtered.length;
            render(searchEl.value);
        } else if (e.key === "Enter" && filtered[selIdx]) {
            e.preventDefault();
            filtered[selIdx].action();
            hide();
        }
    });
}


// ════════════════════════════════════════
// 10. CLOCK & LUNAR DATE
// ════════════════════════════════════════

function initClock() {
    const pad = n => String(n).padStart(2, "0");

    function tick() {
        const now = new Date();

        const clockEl = document.getElementById("clock-display");
        if (clockEl) {
            clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }

        const lunarEl = document.getElementById("lunar-display");
        if (lunarEl) {
            try {
                const parts = new Intl.DateTimeFormat("vi-VN-u-ca-chinese", {
                    day: "numeric", month: "numeric", year: "numeric",
                }).formatToParts(now);
                let d = "", m = "", y = "";
                for (const p of parts) {
                    if (p.type === "day")         d = p.value;
                    if (p.type === "month")       m = p.value;
                    if (p.type === "relatedYear") y = p.value;
                }
                lunarEl.textContent = `âm: ${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
            } catch {
                lunarEl.textContent = "";
            }
        }
    }

    tick();
    setInterval(tick, 1000);
}


// ════════════════════════════════════════
// 11. ZEN QUOTE ROTATOR
// ════════════════════════════════════════

function initZenQuotes() {
    const el = document.getElementById("zen-quote");
    if (!el) return;

    let idx = Math.floor(Math.random() * ZEN_QUOTES.length);
    el.innerHTML = `<em>${ZEN_QUOTES[idx].replace(/\n/g, "<br>")}</em>`;

    setInterval(() => {
        el.style.opacity = "0";
        setTimeout(() => {
            idx = (idx + 1) % ZEN_QUOTES.length;
            el.innerHTML = `<em>${ZEN_QUOTES[idx].replace(/\n/g, "<br>")}</em>`;
            el.style.opacity = "1";
        }, 500);
    }, 18000);
}


function playBadApple() {
    badAppleBgMode = !badAppleBgMode;
    if (badAppleBgMode) {
        cliPrint(`<span class="cli-accent">✦ Bad Apple!! Canvas Background Easter Egg: ACTIVE</span>`);
        playBadAppleMelody();
    } else {
        cliPrint(`<span class="cli-result">✦ Bad Apple!! Background Mode: DEACTIVATED</span>`);
    }
}

function playBadAppleMelody() {
    // Bad Apple intro motif notes (D4, D#4, D4, C4, A#3, A3, G3)
    const notes = [293.66, 311.13, 293.66, 261.63, 233.08, 220.00, 196.00, 220.00];
    notes.forEach((freq, i) => {
        setTimeout(() => {
            playSingingBowl(freq, 0.2);
        }, i * 180);
    });
}


function initGithubHeatmap() {
    const grid = document.getElementById("gh-heatmap-grid");
    if (!grid) return;
    grid.innerHTML = "";
    for (let i = 0; i < 52 * 7; i++) {
        const box = document.createElement("div");
        box.className = "gh-box";
        const r = Math.random();
        if (r > 0.4) {
            const level = Math.floor(Math.random() * 4) + 1;
            box.classList.add(`level-${level}`);
        } else {
            box.classList.add("level-0");
        }
        grid.appendChild(box);
    }
}


// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    initBoot();
    initCLI();
    initPalette();
    initGithubHeatmap();

    const badAppleBtn = document.getElementById("btn-play-badapple");
    if (badAppleBtn) {
        badAppleBtn.addEventListener("click", playBadApple);
    }
});

})();
