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
let badAppleVideo = null;
let badAppleAudioCtx = null;
let badAppleAnalyser = null;
let badAppleRenderMode = "ascii"; // "ascii" | "silhouette" | "matrix" | "kanji"
let badAppleModalActive = false;


// ════════════════════════════════════════
// 1. BOOT SEQUENCE — Ensō
// ════════════════════════════════════════

function initBoot() {
    const boot = document.getElementById("boot-screen");
    const app  = document.getElementById("app");
    const cli  = document.getElementById("cli-bar");
    if (!boot || !app) return;

    let hasBooted = false;
    try {
        hasBooted = sessionStorage.getItem("onc_zen_v1");
    } catch(e) {}

    if (hasBooted) {
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
            try {
                sessionStorage.setItem("onc_zen_v1", "1");
            } catch(e) {}
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
    initDonut();
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

        // ── BAD APPLE 1:1 RECREATION DEMOSCENE BACKGROUND ENGINE ──
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

            const t = ft * 3;
            const isLiveVideo = drawBadAppleSilhouetteFrame(mCtx, cols, rows, t);
            const imgData = mCtx.getImageData(0, 0, cols, rows).data;

            drawBadApplePixelsToCanvas(ctx, imgData, cols, rows, C_CELL, badAppleRenderMode, t);

            // Render HUD Banner
            const vid = getBadAppleVideo();
            const curTimeStr = vid ? formatTimeSec(vid.currentTime) : "00:00";
            const durTimeStr = vid && vid.duration ? formatTimeSec(vid.duration) : "03:39";
            const statusTag  = isLiveVideo ? "1:1 LIVE VIDEO STREAM" : "SYNTH PROCEDURAL";

            ctx.fillStyle = "rgba(230, 200, 158, 0.95)";
            ctx.font = "12px 'JetBrains Mono', monospace";
            ctx.fillText(`✦ BAD APPLE!! [${statusTag} | ${curTimeStr} / ${durTimeStr} | MODE: ${badAppleRenderMode.toUpperCase()}]`, 24, 40);
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
    work:     { cat: "nav",  desc: "Navigate to research & work",fn: () => navTo("work") },
    projects: { cat: "nav",  desc: "Navigate to projects",      fn: () => navTo("projects") },
    skills:   { cat: "nav",  desc: "Navigate to skills",        fn: () => navTo("skills") },
    writings: { cat: "nav",  desc: "Navigate to writings",      fn: () => navTo("writings") },
    contact:  { cat: "nav",  desc: "Navigate to contact",       fn: () => navTo("contact") },
    doom:     { cat: "fun",  desc: "Launch DOOM (1993) WASM Engine", fn: launchDoomModal },
    badapple: { cat: "fun",  desc: "Launch 1:1 Bad Apple!! Demoscene Player & Background", fn: playBadApple },
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
            else if (game === "doom") {
                clearInterval(gameLoop);
                iframe.style.display = "none";
                canvas.style.display = "block";
                createNativeDoomEngine(canvas, scoreVal);
            }
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
        if (e.key === "Escape") {
            if (palette.classList.contains("visible")) hide();
            if (badAppleModalActive) closeBadAppleModal();
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


// ════════════════════════════════════════
// BAD APPLE!! 1:1 RECREATION DEMOSCENE ENGINE
// ════════════════════════════════════════

function getBadAppleVideo() {
    if (!badAppleVideo) {
        badAppleVideo = document.createElement("video");
        badAppleVideo.id = "bad-apple-video-node";
        badAppleVideo.crossOrigin = "anonymous";
        badAppleVideo.playsInline = true;
        badAppleVideo.loop = true;
        badAppleVideo.preload = "auto";
        badAppleVideo.style.display = "none";

        const sources = [
            "https://raw.githubusercontent.com/Raj-1727/badapple-py/main/badapple.mp4",
            "https://raw.githubusercontent.com/Cohee1207/SillyTavern-BadApple/main/badapple.mp4",
            "https://archive.org/download/bad-apple-resources/Bad%20Apple%20!!%20PV.mp4"
        ];

        sources.forEach(src => {
            const s = document.createElement("source");
            s.src = src;
            s.type = "video/mp4";
            badAppleVideo.appendChild(s);
        });

        document.body.appendChild(badAppleVideo);
    }
    return badAppleVideo;
}

function startBadAppleMedia() {
    const vid = getBadAppleVideo();
    const playPromise = vid.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            initBadAppleAudioContext(vid);
            removeAudioUnlockPrompt();
        }).catch(err => {
            vid.muted = true;
            vid.play().catch(() => {});
            showAudioUnlockPrompt();
        });
    }
}

function initBadAppleAudioContext(vid) {
    if (badAppleAudioCtx) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        badAppleAudioCtx = new AudioContextClass();
        const sourceNode = badAppleAudioCtx.createMediaElementSource(vid);
        badAppleAnalyser = badAppleAudioCtx.createAnalyser();
        badAppleAnalyser.fftSize = 64;
        sourceNode.connect(badAppleAnalyser);
        badAppleAnalyser.connect(badAppleAudioCtx.destination);
    } catch (e) {
        // Audio context initialized or media node notice
    }
}

function showAudioUnlockPrompt() {
    if (document.getElementById("badapple-audio-prompt")) return;
    const prompt = document.createElement("div");
    prompt.id = "badapple-audio-prompt";
    prompt.style.cssText = `
        position: fixed; bottom: 70px; right: 24px; z-index: 99999;
        background: rgba(24, 24, 24, 0.95); border: 1px solid var(--accent);
        color: var(--accent); padding: 10px 16px; border-radius: 8px;
        font-family: var(--font-mono); font-size: 12px; cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(8px);
        display: flex; align-items: center; gap: 10px; animation: fade-up 0.3s ease;
    `;
    prompt.innerHTML = `<span>🎵 Click to Enable Bad Apple!! Audio & 1:1 Video Sync</span>`;
    prompt.addEventListener("click", () => {
        const vid = getBadAppleVideo();
        vid.muted = false;
        vid.play().then(() => {
            initBadAppleAudioContext(vid);
            removeAudioUnlockPrompt();
        });
    });
    document.body.appendChild(prompt);
}

function removeAudioUnlockPrompt() {
    const el = document.getElementById("badapple-audio-prompt");
    if (el) el.remove();
}

function drawBadAppleSilhouetteFrame(mCtx, cols, rows, t) {
    let isLiveVideo = false;
    const vid = getBadAppleVideo();

    if (vid && vid.readyState >= 2 && !vid.paused && !vid.ended) {
        try {
            mCtx.drawImage(vid, 0, 0, cols, rows);
            isLiveVideo = true;
        } catch (e) {
            // CORS fallback to procedural
        }
    }

    if (!isLiveVideo) {
        mCtx.fillStyle = "#000000";
        mCtx.fillRect(0, 0, cols, rows);
        mCtx.fillStyle = "#ffffff";

        const sceneTime = t * 2.5;
        const scene = Math.floor(sceneTime / 10) % 3;
        const cx = cols * 0.5;
        const cy = rows * 0.5;

        if (scene === 0) {
            const headX = cx + Math.sin(t * 1.5) * 6;
            const headY = cy - 8 + Math.cos(t * 2) * 3;
            mCtx.beginPath(); mCtx.arc(headX, headY, 6, 0, Math.PI * 2); mCtx.fill();
            mCtx.fillRect(headX - 4, headY + 6, 8, 14);

            mCtx.beginPath();
            mCtx.moveTo(headX - 4, headY - 2);
            mCtx.quadraticCurveTo(headX - 16 + Math.sin(t * 3) * 6, headY + 8, headX - 14, headY + 20);
            mCtx.moveTo(headX + 4, headY - 2);
            mCtx.quadraticCurveTo(headX + 16 - Math.sin(t * 3) * 6, headY + 8, headX + 14, headY + 20);
            mCtx.lineWidth = 3; mCtx.strokeStyle = "#ffffff"; mCtx.stroke();

            mCtx.beginPath();
            mCtx.moveTo(headX - 4, headY + 18);
            mCtx.lineTo(headX - 18 + Math.sin(t * 2) * 4, headY + 32);
            mCtx.lineTo(headX + 18 - Math.sin(t * 2) * 4, headY + 32);
            mCtx.closePath(); mCtx.fill();
        } else if (scene === 1) {
            const rApple = 12 + Math.sin(t * 3) * 2;
            mCtx.beginPath(); mCtx.arc(cx - 10, cy, rApple, 0, Math.PI * 2); mCtx.fill();
            mCtx.fillRect(cx - 12, cy - rApple - 4, 4, 6);
            const headX = cx + 14; const headY = cy - 10;
            mCtx.beginPath(); mCtx.arc(headX, headY, 5, 0, Math.PI * 2); mCtx.fill();
            mCtx.fillRect(headX - 3, headY + 5, 6, 12);
        } else {
            const rOuter = 18 + Math.sin(t * 2) * 2;
            mCtx.beginPath(); mCtx.arc(cx, cy, rOuter, 0, Math.PI * 2); mCtx.fill();
            mCtx.fillStyle = "#000000";
            mCtx.beginPath(); mCtx.arc(cx, cy, rOuter - 5, 0, Math.PI * 2); mCtx.fill();
            mCtx.fillStyle = "#ffffff";
            mCtx.beginPath(); mCtx.arc(cx, cy, 6, 0, Math.PI * 2); mCtx.fill();
        }
    }
    return isLiveVideo;
}

function drawBadApplePixelsToCanvas(ctx, imgData, cols, rows, C_CELL, mode, t) {
    const asciiChars = ["█", "▓", "▒", "░", "✦", "★", "◈", "@", "#", "%"];
    const matrixChars = ["0", "1", "ﾊ", "ﾐ", "ﾋ", "ｰ", "ｳ", "ｼ", "ﾅ", "ﾓ"];
    const kanjiChars  = ["影", "絵", "華", "夢", "音", "奏", "林", "檎", "東", "方"];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) * 4;
            const rVal = imgData[idx];
            const gVal = imgData[idx+1];
            const bVal = imgData[idx+2];
            const bright = (rVal * 0.299 + gVal * 0.587 + bVal * 0.114);

            if (bright > 90) {
                if (mode === "silhouette") {
                    ctx.fillStyle = `rgba(246, 243, 237, 0.95)`;
                    ctx.fillText("█", c * C_CELL, r * C_CELL + C_CELL);
                } else if (mode === "matrix") {
                    const char = matrixChars[(c + r + Math.floor(t * 12)) % matrixChars.length];
                    ctx.fillStyle = `rgba(178, 227, 172, ${0.85 + Math.sin(t + c * 0.1) * 0.15})`;
                    ctx.fillText(char, c * C_CELL, r * C_CELL + C_CELL);
                } else if (mode === "kanji") {
                    const char = kanjiChars[(c + r + Math.floor(t * 8)) % kanjiChars.length];
                    ctx.fillStyle = `rgba(230, 200, 158, 0.95)`;
                    ctx.fillText(char, c * C_CELL, r * C_CELL + C_CELL);
                } else { // "ascii"
                    const char = asciiChars[(c + r + Math.floor(t * 10)) % asciiChars.length];
                    ctx.fillStyle = `rgba(246, 243, 237, ${0.85 + Math.sin(t + c * 0.1) * 0.15})`;
                    ctx.fillText(char, c * C_CELL, r * C_CELL + C_CELL);
                }
            } else {
                if (mode === "matrix") {
                    if ((c * 3 + r * 7) % 19 === 0) {
                        ctx.fillStyle = `rgba(178, 227, 172, 0.12)`;
                        ctx.fillText(".", c * C_CELL, r * C_CELL + C_CELL);
                    }
                } else {
                    const nx = c / cols, ny = r / rows;
                    if (noise(nx * 4, ny * 4, t * 0.2) > 0.48) {
                        ctx.fillStyle = `rgba(223, 190, 149, 0.1)`;
                        ctx.fillText("·", c * C_CELL, r * C_CELL + C_CELL);
                    }
                }
            }
        }
    }
}

function playBadApple(args) {
    if (typeof args === "string" && args.trim()) {
        const sub = args.trim().toLowerCase();
        if (sub === "modal" || sub === "player") {
            launchBadAppleModal();
            return;
        } else if (sub === "play") {
            badAppleBgMode = true;
            startBadAppleMedia();
            cliPrint(`<span class="cli-accent">✦ Bad Apple!! 1:1 Stream: PLAYING</span>`);
            return;
        } else if (sub === "stop" || sub === "pause") {
            const vid = getBadAppleVideo();
            if (vid) vid.pause();
            badAppleBgMode = false;
            cliPrint(`<span class="cli-result">✦ Bad Apple!! 1:1 Stream: PAUSED</span>`);
            return;
        } else if (["ascii", "silhouette", "matrix", "kanji"].includes(sub)) {
            badAppleRenderMode = sub;
            cliPrint(`<span class="cli-accent">✦ Bad Apple!! Render Mode set to: ${sub.toUpperCase()}</span>`);
            return;
        }
    }

    badAppleBgMode = !badAppleBgMode;
    if (badAppleBgMode) {
        startBadAppleMedia();
        launchBadAppleModal();
        cliPrint(`<span class="cli-accent">✦ Bad Apple!! 1:1 Demoscene Player: ACTIVE</span>`);
    } else {
        const vid = getBadAppleVideo();
        if (vid) vid.pause();
        cliPrint(`<span class="cli-result">✦ Bad Apple!! Mode: DEACTIVATED</span>`);
    }
}

function launchBadAppleModal() {
    let modal = document.getElementById("bad-apple-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "bad-apple-modal";
        modal.innerHTML = `
            <div class="badapple-modal-content">
                <div class="badapple-header">
                    <div class="badapple-title">
                        <span>✦ 東方幻想郷 · Bad Apple!! 1:1 Shadow Art Demoscene</span>
                        <span class="badapple-badge" id="badapple-stream-status">1:1 LIVE STREAM</span>
                    </div>
                    <button class="badapple-close-btn" id="badapple-btn-close">[✕ ESC]</button>
                </div>
                <div class="badapple-screen-wrap">
                    <canvas id="badapple-modal-canvas"></canvas>
                    <div class="crt-scanline"></div>
                    <div class="badapple-hud-overlay">
                        <span id="badapple-hud-time">00:00 / 03:39</span>
                        <span id="badapple-hud-fps">60 FPS</span>
                    </div>
                </div>
                <div class="badapple-controls">
                    <div class="badapple-timeline-row">
                        <span id="badapple-time-cur">00:00</span>
                        <input type="range" class="badapple-seekbar" id="badapple-seekbar" min="0" max="219" value="0" step="0.5">
                        <span id="badapple-time-dur">03:39</span>
                    </div>
                    <div class="badapple-btns-row">
                        <div class="badapple-group">
                            <button class="badapple-mode-btn" id="badapple-btn-play">▶ PLAY</button>
                            <button class="badapple-mode-btn" id="badapple-btn-audio">🔊 AUDIO</button>
                            <button class="badapple-mode-btn" id="badapple-btn-bg">📺 SYNC BG</button>
                        </div>
                        <div class="badapple-group">
                            <button class="badapple-mode-btn active" data-mode="ascii">ASCII</button>
                            <button class="badapple-mode-btn" data-mode="silhouette">SILHOUETTE</button>
                            <button class="badapple-mode-btn" data-mode="matrix">MATRIX</button>
                            <button class="badapple-mode-btn" data-mode="kanji">KANJI</button>
                        </div>
                        <div class="badapple-group">
                            <canvas id="badapple-spectrum-canvas" width="120" height="24"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("badapple-btn-close").addEventListener("click", closeBadAppleModal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeBadAppleModal();
        });

        const btnPlay = document.getElementById("badapple-btn-play");
        btnPlay.addEventListener("click", () => {
            const vid = getBadAppleVideo();
            if (vid.paused) {
                startBadAppleMedia();
                btnPlay.textContent = "❚❚ PAUSE";
            } else {
                vid.pause();
                btnPlay.textContent = "▶ PLAY";
            }
        });

        const btnAudio = document.getElementById("badapple-btn-audio");
        btnAudio.addEventListener("click", () => {
            const vid = getBadAppleVideo();
            vid.muted = !vid.muted;
            btnAudio.textContent = vid.muted ? "🔇 MUTED" : "🔊 AUDIO";
            if (!vid.muted) {
                initBadAppleAudioContext(vid);
                removeAudioUnlockPrompt();
            }
        });

        const btnBg = document.getElementById("badapple-btn-bg");
        btnBg.classList.toggle("active", badAppleBgMode);
        btnBg.addEventListener("click", () => {
            badAppleBgMode = !badAppleBgMode;
            btnBg.classList.toggle("active", badAppleBgMode);
        });

        modal.querySelectorAll(".badapple-mode-btn[data-mode]").forEach(btn => {
            btn.addEventListener("click", () => {
                modal.querySelectorAll(".badapple-mode-btn[data-mode]").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                badAppleRenderMode = btn.dataset.mode;
            });
        });

        const seekbar = document.getElementById("badapple-seekbar");
        seekbar.addEventListener("input", () => {
            const vid = getBadAppleVideo();
            if (vid && !isNaN(vid.duration)) {
                vid.currentTime = parseFloat(seekbar.value);
            }
        });
    }

    modal.style.display = "flex";
    badAppleModalActive = true;
    startBadAppleMedia();

    requestAnimationFrame(updateBadAppleModalFrame);
}

function closeBadAppleModal() {
    const modal = document.getElementById("bad-apple-modal");
    if (modal) modal.style.display = "none";
    badAppleModalActive = false;
}

function updateBadAppleModalFrame() {
    if (!badAppleModalActive) return;

    const modalCvs = document.getElementById("badapple-modal-canvas");
    if (modalCvs) {
        const mCtx = modalCvs.getContext("2d");
        const cellW = 7;
        const cellH = 9;
        const width = modalCvs.clientWidth || 640;
        const height = modalCvs.clientHeight || 420;

        if (modalCvs.width !== width || modalCvs.height !== height) {
            modalCvs.width = width;
            modalCvs.height = height;
        }

        const cols = Math.floor(width / cellW);
        const rows = Math.floor(height / cellH);

        if (!modalCvs._maskCvs) {
            modalCvs._maskCvs = document.createElement("canvas");
            modalCvs._maskCtx = modalCvs._maskCvs.getContext("2d");
        }
        const offCvs = modalCvs._maskCvs;
        const offCtx = modalCvs._maskCtx;
        if (offCvs.width !== cols || offCvs.height !== rows) {
            offCvs.width = cols;
            offCvs.height = rows;
        }

        const t = (Date.now() - LOAD_TIME) * 0.001;
        const isLive = drawBadAppleSilhouetteFrame(offCtx, cols, rows, t);
        const imgData = offCtx.getImageData(0, 0, cols, rows).data;

        mCtx.fillStyle = "#0e0e0e";
        mCtx.fillRect(0, 0, width, height);
        mCtx.font = `${cellH - 1}px 'JetBrains Mono', monospace`;

        drawBadApplePixelsToCanvas(mCtx, imgData, cols, rows, cellW, badAppleRenderMode, t);

        const statusEl = document.getElementById("badapple-stream-status");
        if (statusEl) {
            statusEl.textContent = isLive ? "1:1 LIVE VIDEO STREAM" : "SYNTH PROCEDURAL";
        }

        const vid = getBadAppleVideo();
        if (vid) {
            const cur = vid.currentTime || 0;
            const dur = vid.duration || 219;
            const timeCurEl = document.getElementById("badapple-time-cur");
            const timeDurEl = document.getElementById("badapple-time-dur");
            const hudTimeEl  = document.getElementById("badapple-hud-time");
            const seekbar    = document.getElementById("badapple-seekbar");
            const btnPlay    = document.getElementById("badapple-btn-play");

            if (timeCurEl) timeCurEl.textContent = formatTimeSec(cur);
            if (timeDurEl) timeDurEl.textContent = formatTimeSec(dur);
            if (hudTimeEl)  hudTimeEl.textContent = `${formatTimeSec(cur)} / ${formatTimeSec(dur)}`;
            if (seekbar) {
                seekbar.max = dur;
                seekbar.value = cur;
            }
            if (btnPlay) {
                btnPlay.textContent = vid.paused ? "▶ PLAY" : "❚❚ PAUSE";
            }
        }
    }

    renderSpectrumCanvas();

    requestAnimationFrame(updateBadAppleModalFrame);
}

function renderSpectrumCanvas() {
    const specCvs = document.getElementById("badapple-spectrum-canvas");
    if (!specCvs || !badAppleAnalyser) return;
    const sCtx = specCvs.getContext("2d");
    const bufferLength = badAppleAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    badAppleAnalyser.getByteFrequencyData(dataArray);

    sCtx.clearRect(0, 0, specCvs.width, specCvs.height);
    const barW = specCvs.width / 16;
    for (let i = 0; i < 16; i++) {
        const val = dataArray[i * 2] || 0;
        const h = (val / 255) * specCvs.height;
        sCtx.fillStyle = "rgba(230, 200, 158, 0.85)";
        sCtx.fillRect(i * barW, specCvs.height - h, barW - 2, h);
    }
}

function formatTimeSec(s) {
    if (isNaN(s) || s < 0) return "00:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m < 10 ? "0" + m : m}:${sec < 10 ? "0" + sec : sec}`;
}


// ════════════════════════════════════════
// 10. NATIVE 3D RAYCASTER DOOM ENGINE
// ════════════════════════════════════════

let activeDoomInstance = null;

function createNativeDoomEngine(canvas, hudEl) {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let animFrame = null;
    let audioCtx = null;

    // Web Audio Sound Synthesizer
    function playDoomSFX(type) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === "suspended") audioCtx.resume();
            const now = audioCtx.currentTime;

            if (type === "pistol") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(450, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === "shotgun") {
                const bufferSize = audioCtx.sampleRate * 0.3;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.05));
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                noise.connect(gain);
                gain.connect(audioCtx.destination);
                noise.start(now);
            } else if (type === "plasma") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === "door") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.linearRampToValueAtTime(240, now + 0.4);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.4);
            } else if (type === "hit" || type === "pain") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.linearRampToValueAtTime(40, now + 0.2);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === "pickup") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === "growl") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(90, now);
                osc.frequency.linearRampToValueAtTime(45, now + 0.35);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.35);
            }
        } catch (e) {}
    }

    // Procedural Wall Textures (64x64)
    const TEX_SIZE = 64;
    const textures = [];
    
    function generateDoomTextures() {
        const createTexCanvas = (drawFn) => {
            const tCvs = document.createElement("canvas");
            tCvs.width = TEX_SIZE; tCvs.height = TEX_SIZE;
            const tCtx = tCvs.getContext("2d");
            drawFn(tCtx);
            return tCtx.getImageData(0, 0, TEX_SIZE, TEX_SIZE).data;
        };

        // 1: Techwall (Blue steel panel)
        textures[1] = createTexCanvas((c) => {
            c.fillStyle = "#222c36"; c.fillRect(0, 0, 64, 64);
            c.strokeStyle = "#3b4d5e"; c.lineWidth = 2; c.strokeRect(2, 2, 60, 60);
            c.fillStyle = "#5a7a9e"; c.fillRect(6, 6, 52, 6); c.fillRect(6, 52, 52, 6);
            c.fillStyle = "#33bbff"; c.fillRect(10, 28, 44, 8); // Cyan circuit line
            c.fillStyle = "#111"; c.fillRect(2, 2, 4, 4); c.fillRect(58, 2, 4, 4);
        });

        // 2: Brick (Red/brown stone)
        textures[2] = createTexCanvas((c) => {
            c.fillStyle = "#4a221b"; c.fillRect(0, 0, 64, 64);
            c.strokeStyle = "#24100c"; c.lineWidth = 2;
            for (let y = 0; y < 64; y += 16) {
                c.beginPath(); c.moveTo(0, y); c.lineTo(64, y); c.stroke();
                const offset = (y % 32 === 0) ? 0 : 16;
                for (let x = offset; x < 64; x += 32) {
                    c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 16); c.stroke();
                }
            }
        });

        // 3: Hazard (Yellow/Black stripes)
        textures[3] = createTexCanvas((c) => {
            c.fillStyle = "#d4a21d"; c.fillRect(0, 0, 64, 64);
            c.fillStyle = "#181818";
            for (let i = -64; i < 128; i += 16) {
                c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 12, 0); c.lineTo(i - 4, 64); c.lineTo(i - 16, 64); c.fill();
            }
            c.strokeStyle = "#333"; c.strokeRect(0, 0, 64, 64);
        });

        // 4: Steel Door
        textures[4] = createTexCanvas((c) => {
            c.fillStyle = "#3a3f47"; c.fillRect(0, 0, 64, 64);
            c.strokeStyle = "#5e6673"; c.lineWidth = 3; c.strokeRect(4, 4, 56, 56);
            c.fillStyle = "#1e2226"; c.fillRect(10, 10, 44, 20); c.fillRect(10, 34, 44, 20);
            c.fillStyle = "#ff3333"; c.fillRect(50, 30, 6, 6); // Red key lock
        });

        // 5: Blood Wall
        textures[5] = createTexCanvas((c) => {
            c.fillStyle = "#383231"; c.fillRect(0, 0, 64, 64);
            c.fillStyle = "#8b1818";
            for (let i = 0; i < 12; i++) {
                c.beginPath();
                c.arc((i * 17) % 64, (i * 23) % 64, 8 + (i % 6), 0, Math.PI * 2);
                c.fill();
            }
        });

        // 6: Exit Wall
        textures[6] = createTexCanvas((c) => {
            c.fillStyle = "#112b18"; c.fillRect(0, 0, 64, 64);
            c.fillStyle = "#2ecc71"; c.font = "bold 16px monospace"; c.fillText("EXIT", 12, 38);
            c.strokeStyle = "#27ae60"; c.lineWidth = 2; c.strokeRect(4, 4, 56, 56);
        });
    }

    generateDoomTextures();

    // Game State
    const MAP_W = 20, MAP_H = 20;
    const map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,4,1,0,1,0,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,0,0,1,1,1,0,1,0,0,1,0,1],
        [1,0,4,0,1,0,0,0,0,0,0,0,1,0,4,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,3,3,1,0,1,0,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,2,2,1,0,1,1,1,1,4,1,1,1],
        [1,0,0,0,1,0,4,0,2,2,1,0,1,0,0,0,0,0,0,1],
        [1,1,1,0,1,0,1,0,0,0,0,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,1,1,4,1,1,1,0,1,0,0,1,0,1],
        [1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,1,0,1],
        [1,0,4,0,0,0,0,1,0,1,0,0,0,0,0,0,0,4,0,1],
        [1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,1,0,1,0,4,0,1,0,4,0,1,1,1,5,5,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,5,6,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    const doorOpen = Array.from({length: MAP_H}, () => Array(MAP_W).fill(0)); // 0 = closed, 1 = fully open

    // Player State
    const player = {
        x: 2.5, y: 2.5,
        dirX: 1, dirY: 0,
        planeX: 0, planeY: 0.66,
        angle: 0,
        health: 100, armor: 50, ammo: 50,
        kills: 0, score: 0,
        weapon: 1, // 1: Pistol, 2: Shotgun, 3: Plasma
        recoil: 0,
        bobbing: 0,
        painFlash: 0,
        pickupFlash: 0
    };

    // Keys State
    const keys = {};

    // Dynamic Enemies & Pickups
    let entities = [
        { type: "zombieman", x: 6.5, y: 3.5, hp: 30, state: "idle", cooldown: 0 },
        { type: "zombieman", x: 14.5, y: 7.5, hp: 30, state: "idle", cooldown: 0 },
        { type: "imp", x: 9.5, y: 9.5, hp: 60, state: "idle", cooldown: 0 },
        { type: "imp", x: 16.5, y: 14.5, hp: 60, state: "idle", cooldown: 0 },
        { type: "demon", x: 4.5, y: 17.5, hp: 120, state: "idle", cooldown: 0 },
        { type: "health", x: 3.5, y: 3.5, active: true },
        { type: "armor", x: 14.5, y: 3.5, active: true },
        { type: "ammo", x: 10.5, y: 13.5, active: true }
    ];

    let projectiles = [];

    // Weapon Shooting
    let canShoot = true;
    function shootWeapon() {
        if (!canShoot || player.ammo <= 0) return;
        canShoot = false;

        player.recoil = 12;

        if (player.weapon === 1) { // Pistol
            player.ammo -= 1;
            playDoomSFX("pistol");
            fireHitscan(1, 25);
            setTimeout(() => { canShoot = true; }, 220);
        } else if (player.weapon === 2) { // Shotgun
            player.ammo = Math.max(0, player.ammo - 2);
            playDoomSFX("shotgun");
            for (let i = 0; i < 5; i++) fireHitscan(3, 12, (Math.random() - 0.5) * 0.15);
            setTimeout(() => { canShoot = true; }, 650);
        } else if (player.weapon === 3) { // Plasma
            player.ammo = Math.max(0, player.ammo - 1);
            playDoomSFX("plasma");
            fireHitscan(1, 35);
            setTimeout(() => { canShoot = true; }, 120);
        }

        if (hudEl) hudEl.textContent = player.score;
    }

    function fireHitscan(rangeFactor, damage, spreadAngle = 0) {
        const shootDirX = player.dirX + player.planeX * spreadAngle;
        const shootDirY = player.dirY + player.planeY * spreadAngle;

        let closestTarget = null;
        let minDist = 12;

        entities.forEach(ent => {
            if (ent.hp && ent.hp > 0 && ent.state !== "dead") {
                const dx = ent.x - player.x;
                const dy = ent.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const dot = (dx * shootDirX + dy * shootDirY) / dist;
                if (dot > 0.94 && dist < minDist) {
                    minDist = dist;
                    closestTarget = ent;
                }
            }
        });

        if (closestTarget) {
            closestTarget.hp -= damage;
            closestTarget.state = "pain";
            playDoomSFX("hit");
            if (closestTarget.hp <= 0) {
                closestTarget.state = "dead";
                player.kills++;
                player.score += 150;
                playDoomSFX("growl");
            }
        }
    }

    function interactDoor() {
        const checkX = Math.floor(player.x + player.dirX * 1.2);
        const checkY = Math.floor(player.y + player.dirY * 1.2);
        if (checkX >= 0 && checkX < MAP_W && checkY >= 0 && checkY < MAP_H) {
            if (map[checkY][checkX] === 4) {
                doorOpen[checkY][checkX] = 1;
                playDoomSFX("door");
            }
        }
    }

    // Input Listeners
    function onKeyDown(e) {
        keys[e.key.toLowerCase()] = true;
        if (["1", "2", "3"].includes(e.key)) player.weapon = parseInt(e.key);
        if (e.key === " " || e.key === "Control") shootWeapon();
        if (e.key.toLowerCase() === "e") interactDoor();
    }
    function onKeyUp(e) { keys[e.key.toLowerCase()] = false; }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Main Engine Frame Update & Render
    function updatePhysics() {
        const moveSpeed = (keys["shift"] ? 0.08 : 0.045);
        const rotSpeed = 0.04;

        let isMoving = false;
        if (keys["w"] || keys["arrowup"]) {
            const nextX = player.x + player.dirX * moveSpeed;
            const nextY = player.y + player.dirY * moveSpeed;
            if (map[Math.floor(player.y)][Math.floor(nextX)] === 0 || doorOpen[Math.floor(player.y)][Math.floor(nextX)] > 0.8) player.x = nextX;
            if (map[Math.floor(nextY)][Math.floor(player.x)] === 0 || doorOpen[Math.floor(nextY)][Math.floor(player.x)] > 0.8) player.y = nextY;
            isMoving = true;
        }
        if (keys["s"] || keys["arrowdown"]) {
            const nextX = player.x - player.dirX * moveSpeed;
            const nextY = player.y - player.dirY * moveSpeed;
            if (map[Math.floor(player.y)][Math.floor(nextX)] === 0 || doorOpen[Math.floor(player.y)][Math.floor(nextX)] > 0.8) player.x = nextX;
            if (map[Math.floor(nextY)][Math.floor(player.x)] === 0 || doorOpen[Math.floor(nextY)][Math.floor(player.x)] > 0.8) player.y = nextY;
            isMoving = true;
        }
        if (keys["a"] || keys["arrowleft"]) {
            const oldDirX = player.dirX;
            player.dirX = player.dirX * Math.cos(-rotSpeed) - player.dirY * Math.sin(-rotSpeed);
            player.dirY = oldDirX * Math.sin(-rotSpeed) + player.dirY * Math.cos(-rotSpeed);
            const oldPlaneX = player.planeX;
            player.planeX = player.planeX * Math.cos(-rotSpeed) - player.planeY * Math.sin(-rotSpeed);
            player.planeY = oldPlaneX * Math.sin(-rotSpeed) + player.planeY * Math.cos(-rotSpeed);
        }
        if (keys["d"] || keys["arrowright"]) {
            const oldDirX = player.dirX;
            player.dirX = player.dirX * Math.cos(rotSpeed) - player.dirY * Math.sin(rotSpeed);
            player.dirY = oldDirX * Math.sin(rotSpeed) + player.dirY * Math.cos(rotSpeed);
            const oldPlaneX = player.planeX;
            player.planeX = player.planeX * Math.cos(rotSpeed) - player.planeY * Math.sin(rotSpeed);
            player.planeY = oldPlaneX * Math.sin(rotSpeed) + player.planeY * Math.cos(rotSpeed);
        }

        if (isMoving) player.bobbing += 0.2;

        if (player.recoil > 0) player.recoil -= 1.5;
        if (player.painFlash > 0) player.painFlash -= 0.05;
        if (player.pickupFlash > 0) player.pickupFlash -= 0.05;

        // Pickups check
        entities.forEach(ent => {
            if (ent.active) {
                const dist = Math.hypot(ent.x - player.x, ent.y - player.y);
                if (dist < 0.6) {
                    ent.active = false;
                    player.pickupFlash = 0.5;
                    playDoomSFX("pickup");
                    if (ent.type === "health") player.health = Math.min(100, player.health + 25);
                    if (ent.type === "armor") player.armor = Math.min(100, player.armor + 25);
                    if (ent.type === "ammo") player.ammo = Math.min(99, player.ammo + 25);
                }
            }
        });

        // AI Logic
        entities.forEach(ent => {
            if (ent.hp && ent.hp > 0) {
                const dist = Math.hypot(player.x - ent.x, player.y - ent.y);
                if (dist < 8) ent.state = "chase";
                if (ent.state === "chase" && dist > 0.8) {
                    const angle = Math.atan2(player.y - ent.y, player.x - ent.x);
                    const speed = 0.02;
                    ent.x += Math.cos(angle) * speed;
                    ent.y += Math.sin(angle) * speed;
                }
                if (dist < 1.0 && Math.random() < 0.03) {
                    player.health = Math.max(0, player.health - 8);
                    player.painFlash = 0.6;
                    playDoomSFX("pain");
                }
            }
        });
    }

    // Render 3D Scene
    function renderFrame() {
        const W = canvas.width;
        const H = canvas.height;
        const zBuffer = new Array(W);

        // Ceiling & Floor
        ctx.fillStyle = "#161c16"; ctx.fillRect(0, 0, W, H / 2);
        ctx.fillStyle = "#0c100c"; ctx.fillRect(0, H / 2, W, H / 2);

        // DDA Raycasting
        for (let x = 0; x < W; x++) {
            const cameraX = 2 * x / W - 1;
            const rayDirX = player.dirX + player.planeX * cameraX;
            const rayDirY = player.dirY + player.planeY * cameraX;

            let mapX = Math.floor(player.x);
            let mapY = Math.floor(player.y);

            const deltaDistX = Math.abs(1 / rayDirX);
            const deltaDistY = Math.abs(1 / rayDirY);

            let stepX, stepY, sideDistX, sideDistY;

            if (rayDirX < 0) { stepX = -1; sideDistX = (player.x - mapX) * deltaDistX; }
            else { stepX = 1; sideDistX = (mapX + 1.0 - player.x) * deltaDistX; }

            if (rayDirY < 0) { stepY = -1; sideDistY = (player.y - mapY) * deltaDistY; }
            else { stepY = 1; sideDistY = (mapY + 1.0 - player.y) * deltaDistY; }

            let hit = 0;
            let side = 0;

            while (hit === 0) {
                if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
                else { sideDistY += deltaDistY; mapY += stepY; side = 1; }

                if (mapX < 0 || mapX >= MAP_W || mapY < 0 || mapY >= MAP_H) break;
                if (map[mapY][mapX] > 0) {
                    if (map[mapY][mapX] === 4 && doorOpen[mapY][mapX] > 0.8) continue;
                    hit = map[mapY][mapX];
                }
            }

            let perpWallDist = (side === 0) ? (mapX - player.x + (1 - stepX) / 2) / rayDirX : (mapY - player.y + (1 - stepY) / 2) / rayDirY;
            perpWallDist = Math.max(0.05, perpWallDist);
            zBuffer[x] = perpWallDist;

            const lineHeight = Math.floor(H / perpWallDist);
            const drawStart = Math.max(0, -lineHeight / 2 + H / 2);
            const drawEnd = Math.min(H - 1, lineHeight / 2 + H / 2);

            // Shading & Color
            const texIdx = Math.min(6, hit);
            const brightness = Math.max(0.15, Math.min(1.0, 1.2 / (1 + perpWallDist * 0.25))) * (side === 1 ? 0.75 : 1.0);
            
            ctx.fillStyle = (texIdx === 1) ? `rgba(59,77,94,${brightness})`
                          : (texIdx === 2) ? `rgba(180,60,40,${brightness})`
                          : (texIdx === 3) ? `rgba(212,162,29,${brightness})`
                          : (texIdx === 4) ? `rgba(94,102,115,${brightness})`
                          : (texIdx === 5) ? `rgba(139,24,24,${brightness})`
                          : `rgba(46,204,113,${brightness})`;
            
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }

        // Render Sprites (Enemies & Items)
        const sortedEntities = entities.map(e => ({...e, dist: Math.hypot(player.x - e.x, player.y - e.y)}))
                                       .sort((a, b) => b.dist - a.dist);

        sortedEntities.forEach(ent => {
            if (ent.active === false || ent.state === "dead") return;
            const spriteX = ent.x - player.x;
            const spriteY = ent.y - player.y;

            const invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);
            const transformX = invDet * (player.dirY * spriteX - player.dirX * spriteY);
            const transformY = invDet * (-player.planeY * spriteX + player.planeX * spriteY);

            if (transformY > 0.2) {
                const spriteScreenX = Math.floor((W / 2) * (1 + transformX / transformY));
                const spriteHeight = Math.abs(Math.floor(H / transformY));
                const spriteWidth = spriteHeight;

                const drawStartX = Math.max(0, Math.floor(-spriteWidth / 2 + spriteScreenX));
                const drawEndX = Math.min(W - 1, Math.floor(spriteWidth / 2 + spriteScreenX));

                const color = (ent.type === "imp") ? "#e67e22"
                            : (ent.type === "demon") ? "#e74c3c"
                            : (ent.type === "zombieman") ? "#9b59b6"
                            : (ent.type === "health") ? "#2ecc71"
                            : (ent.type === "armor") ? "#3498db" : "#f1c40f";

                for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
                    if (transformY < zBuffer[stripe]) {
                        ctx.fillStyle = color;
                        const sY1 = Math.max(0, -spriteHeight / 2 + H / 2);
                        const sY2 = Math.min(H - 1, spriteHeight / 2 + H / 2);
                        ctx.fillRect(stripe, sY1, 1, sY2 - sY1);
                    }
                }
            }
        });

        // Weapon Render
        const bobX = Math.sin(player.bobbing) * 6;
        const bobY = Math.abs(Math.cos(player.bobbing)) * 6 + player.recoil;
        const wCenterX = W / 2 + bobX;
        const wBottomY = H + bobY;

        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(wCenterX - 14, wBottomY - 70, 28, 70);
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(wCenterX - 6, wBottomY - 95, 12, 35);

        if (player.recoil > 4) { // Muzzle Flash
            ctx.fillStyle = "#f39c12";
            ctx.beginPath();
            ctx.arc(wCenterX, wBottomY - 105, 16, 0, Math.PI * 2);
            ctx.fill();
        }

        // Flash Overlays
        if (player.painFlash > 0) {
            ctx.fillStyle = `rgba(231, 76, 60, ${player.painFlash * 0.4})`;
            ctx.fillRect(0, 0, W, H);
        }
        if (player.pickupFlash > 0) {
            ctx.fillStyle = `rgba(241, 196, 15, ${player.pickupFlash * 0.35})`;
            ctx.fillRect(0, 0, W, H);
        }

        // Mini-Map Overlay (Top Right)
        const mmSize = 70;
        const mmScale = mmSize / MAP_W;
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(W - mmSize - 10, 10, mmSize, mmSize);
        ctx.strokeStyle = "rgba(230,200,158,0.4)";
        ctx.strokeRect(W - mmSize - 10, 10, mmSize, mmSize);

        for (let r = 0; r < MAP_H; r++) {
            for (let c = 0; c < MAP_W; c++) {
                if (map[r][c] > 0 && doorOpen[r][c] < 0.8) {
                    ctx.fillStyle = "#555";
                    ctx.fillRect(W - mmSize - 10 + c * mmScale, 10 + r * mmScale, mmScale, mmScale);
                }
            }
        }
        // Player marker
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(W - mmSize - 10 + player.x * mmScale - 1.5, 10 + player.y * mmScale - 1.5, 3, 3);

        // DOOM HUD Status Bar
        ctx.fillStyle = "#111";
        ctx.fillRect(0, H - 24, W, 24);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(0, H - 24, W, 24);

        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#2ecc71"; ctx.fillText(`HEALTH: ${player.health}%`, 10, H - 8);
        ctx.fillStyle = "#3498db"; ctx.fillText(`ARMOR: ${player.armor}%`, 90, H - 8);
        ctx.fillStyle = "#f1c40f"; ctx.fillText(`AMMO: ${player.ammo}`, 170, H - 8);
        ctx.fillStyle = "#e67e22"; ctx.fillText(`WEAPON: ${player.weapon === 1 ? "PISTOL" : player.weapon === 2 ? "SHOTGUN" : "PLASMA"}`, 240, H - 8);
    }

    function loop() {
        updatePhysics();
        renderFrame();
        animFrame = requestAnimationFrame(loop);
    }

    loop();

    return {
        destroy: () => {
            if (animFrame) cancelAnimationFrame(animFrame);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            if (audioCtx) { try { audioCtx.close(); } catch(e){} }
        }
    };
}


function launchDoomModal() {
    let modal = document.getElementById("doom-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "doom-modal";
        modal.style.cssText = `
            position: fixed; inset: 0; z-index: 10000;
            background: rgba(10, 10, 10, 0.96); backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 20px; gap: 14px;
        `;
        modal.innerHTML = `
            <div style="width: 100%; max-width: 820px; display: flex; justify-content: space-between; align-items: center; background: rgba(20,20,20,0.8); padding: 12px 18px; border-radius: 8px; border: 1px solid rgba(230,200,158,0.25);">
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--accent);">✦ DOOM (1993) — Native 3D Raycaster Engine</span>
                <div style="display: flex; gap: 10px;">
                    <button id="mode-doom-native" style="background: var(--accent); border: 1px solid var(--accent); color: #111; font-weight: 700; padding: 5px 12px; cursor: pointer; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">[ NATIVE 3D ]</button>
                    <button id="mode-doom-wasm" style="background: none; border: 1px solid var(--accent); color: var(--accent); padding: 5px 12px; cursor: pointer; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">[ WASM WAD ]</button>
                    <button id="fullscreen-doom" style="background: none; border: 1px solid var(--accent); color: var(--accent); padding: 5px 12px; cursor: pointer; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">[ 🗖 FULLSCREEN ]</button>
                    <button id="close-doom" style="background: none; border: 1px solid var(--zen-red); color: var(--zen-red); padding: 5px 12px; cursor: pointer; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">✕ CLOSE</button>
                </div>
            </div>
            <div id="doom-viewport" style="width: 100%; max-width: 820px; height: 520px; max-height: 72vh; border: 1px solid rgba(230,200,158,0.3); border-radius: 10px; overflow: hidden; background: #000; box-shadow: 0 20px 60px rgba(0,0,0,0.8); position: relative;">
                <canvas id="doom-native-canvas" width="480" height="320" style="width: 100%; height: 100%; display: block; image-rendering: pixelated;"></canvas>
                <iframe id="doom-frame" style="width: 100%; height: 100%; border: none; display: none;" title="DOOM (1993)" allow="autoplay; keyboard; fullscreen"></iframe>
            </div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-align: center;">
                Controls: <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> move · <kbd>Space</kbd> / <kbd>Ctrl</kbd> fire · <kbd>E</kbd> open door · <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> weapon · <kbd>Shift</kbd> run · <kbd>Esc</kbd> exit
            </div>
        `;
        document.body.appendChild(modal);

        const nativeCvs = document.getElementById("doom-native-canvas");
        const iframe = document.getElementById("doom-frame");
        const btnNative = document.getElementById("mode-doom-native");
        const btnWasm = document.getElementById("mode-doom-wasm");

        let activeEngine = createNativeDoomEngine(nativeCvs);

        btnNative.addEventListener("click", () => {
            iframe.style.display = "none";
            nativeCvs.style.display = "block";
            btnNative.style.background = "var(--accent)"; btnNative.style.color = "#111";
            btnWasm.style.background = "none"; btnWasm.style.color = "var(--accent)";
            if (!activeEngine) activeEngine = createNativeDoomEngine(nativeCvs);
        });

        btnWasm.addEventListener("click", () => {
            if (activeEngine) { activeEngine.destroy(); activeEngine = null; }
            nativeCvs.style.display = "none";
            iframe.style.display = "block";
            iframe.src = "https://www.retrogames.cc/embed/42436-doom-usa.html";
            btnWasm.style.background = "var(--accent)"; btnWasm.style.color = "#111";
            btnNative.style.background = "none"; btnNative.style.color = "var(--accent)";
        });

        document.getElementById("close-doom").addEventListener("click", () => {
            modal.style.display = "none";
            if (activeEngine) { activeEngine.destroy(); activeEngine = null; }
            if (iframe) iframe.src = "";
        });

        document.getElementById("fullscreen-doom").addEventListener("click", () => {
            const viewport = document.getElementById("doom-viewport");
            if (viewport && viewport.requestFullscreen) viewport.requestFullscreen();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.style.display !== "none") {
                modal.style.display = "none";
                if (activeEngine) { activeEngine.destroy(); activeEngine = null; }
                if (iframe) iframe.src = "";
            }
        });
    } else {
        modal.style.display = "flex";
        const nativeCvs = document.getElementById("doom-native-canvas");
        if (nativeCvs) createNativeDoomEngine(nativeCvs);
    }

    cliPrint(`<span class="cli-accent">✦ DOOM 3D Engine initialized. Press W/A/S/D to move, Space/Ctrl to fire, E for doors!</span>`);
}
function initDonut() {
    const preTag = document.getElementById("ascii-donut");
    if (!preTag) return;
    
    let A = 1, B = 1;
    
    const renderDonut = () => {
        let b = [];
        let z = [];
        A += 0.07;
        B += 0.03;
        
        let cA = Math.cos(A), sA = Math.sin(A),
            cB = Math.cos(B), sB = Math.sin(B);
            
        for(let k = 0; k < 1760; k++) {
            b[k] = k % 80 === 79 ? "\n" : " ";
            z[k] = 0;
        }
        
        for(let j = 0; j < 6.28; j += 0.07) {
            let ct = Math.cos(j), st = Math.sin(j);
            for(let i = 0; i < 6.28; i += 0.02) {
                let sp = Math.sin(i), cp = Math.cos(i),
                    h = ct + 2,
                    D = 1 / (sp * h * sA + st * cA + 5),
                    t = sp * h * cA - st * sA;
                    
                let x = Math.floor(40 + 30 * D * (cp * h * cB - t * sB)),
                    y = Math.floor(12 + 15 * D * (cp * h * sB + t * cB)),
                    o = x + 80 * y,
                    N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
                    
                if(y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
                    z[o] = D;
                    b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
                }
            }
        }
        preTag.textContent = b.join("");
        requestAnimationFrame(renderDonut);
    };
    
    renderDonut();
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
