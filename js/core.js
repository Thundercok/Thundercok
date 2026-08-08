// =========================================
// Nguyễn Văn Mười — Research Portfolio System
// Core Engine: Navigation · Command Palette · Flow Field Canvas
// =========================================

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        initScrollSpy();
        initCmdPalette();
        initFlowCanvas();
    });

    // ── 1. SCROLL SPY & NAVIGATION ──
    function initScrollSpy() {
        const sections = document.querySelectorAll(".section");
        const navLinks = document.querySelectorAll(".nav-link");
        const mainContent = document.getElementById("main-content");

        if (!mainContent || sections.length === 0) return;

        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const targetId = link.getAttribute("href")?.substring(1);
                if (!targetId) return;

                const targetSec = document.getElementById(targetId);
                if (targetSec) {
                    e.preventDefault();
                    targetSec.scrollIntoView({ behavior: "smooth" });
                }
            });
        });

        const observerOptions = {
            root: mainContent,
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("data-section") === id
                        );
                    });
                }
            });
        }, observerOptions);

        sections.forEach((sec) => observer.observe(sec));
    }

    function navTo(sectionId) {
        const sec = document.getElementById(sectionId);
        if (sec) {
            sec.scrollIntoView({ behavior: "smooth" });
        }
    }

    // ── 2. INTERACTIVE CANVAS FLOW FIELD BACKGROUND ──
    function initFlowCanvas() {
        const cvs = document.getElementById("canvas-bg");
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        const C_CELL = 24;
        let ft = 0;
        let mouse = { x: -9999, y: -9999, active: false };
        let ripples = [];

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
                ripples.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 45 });
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
            if (document.hidden) return;

            ft += 0.01;
            ripples = ripples.filter(r => r.age < r.maxAge);
            ripples.forEach(r => r.age++);

            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.font = `${C_CELL - 6}px 'JetBrains Mono', monospace`;

            const cols = Math.ceil(cvs.width / C_CELL);
            const rows = Math.ceil(cvs.height / C_CELL);

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

                    if (speed < 0.32) continue;

                    const seg = Math.floor((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 8);
                    let charIdx = 0;
                    if (speed > 0.58) charIdx = 1;
                    if (speed > 0.8) charIdx = 2;
                    const ch = charSets[charIdx][seg];

                    const alpha = Math.min(0.35, 0.04 + speed * 0.22);
                    ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
                    ctx.fillText(ch, c * C_CELL, r * C_CELL + C_CELL);
                }
            }
        }

        draw();
    }

    // ── 3. COMMAND PALETTE (Ctrl+K) ──
    const COMMAND_ITEMS = [
        { label: "Go to About", cat: "Navigation", fn: () => navTo("about") },
        { label: "Go to Experience & Education", cat: "Navigation", fn: () => navTo("work") },
        { label: "Go to Projects", cat: "Navigation", fn: () => navTo("projects") },
        { label: "Go to Skills", cat: "Navigation", fn: () => navTo("skills") },
        { label: "Go to Publications & CV", cat: "Navigation", fn: () => navTo("writings") },
        { label: "Go to Contact", cat: "Navigation", fn: () => navTo("contact") },
        { label: "Open GitHub Profile", cat: "Links", fn: () => window.open("https://github.com/Thundercok", "_blank") },
        { label: "Send Email", cat: "Links", fn: () => window.location.href = "mailto:cathuys69@gmail.com" },
    ];

    function initCmdPalette() {
        const palette = document.getElementById("cmd-palette");
        const searchInput = document.getElementById("cmd-search");
        const cmdList = document.getElementById("cmd-list");

        if (!palette || !searchInput || !cmdList) return;

        let selectedIdx = 0;
        let filteredItems = [...COMMAND_ITEMS];

        function renderList() {
            cmdList.innerHTML = "";
            if (filteredItems.length === 0) {
                cmdList.innerHTML = '<div class="cmd-item"><span>No commands found</span></div>';
                return;
            }

            filteredItems.forEach((item, idx) => {
                const el = document.createElement("div");
                el.className = `cmd-item ${idx === selectedIdx ? "selected" : ""}`;
                el.innerHTML = `
                    <span>${item.label}</span>
                    <span class="cmd-cat">${item.cat}</span>
                `;
                el.addEventListener("click", () => {
                    item.fn();
                    closePalette();
                });
                cmdList.appendChild(el);
            });
        }

        function openPalette() {
            palette.classList.add("visible");
            searchInput.value = "";
            selectedIdx = 0;
            filteredItems = [...COMMAND_ITEMS];
            renderList();
            setTimeout(() => searchInput.focus(), 50);
        }

        function closePalette() {
            palette.classList.remove("visible");
        }

        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (palette.classList.contains("visible")) {
                    closePalette();
                } else {
                    openPalette();
                }
            } else if (e.key === "Escape" && palette.classList.contains("visible")) {
                closePalette();
            }
        });

        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            filteredItems = COMMAND_ITEMS.filter((item) =>
                item.label.toLowerCase().includes(query) || item.cat.toLowerCase().includes(query)
            );
            selectedIdx = 0;
            renderList();
        });

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (filteredItems.length > 0) {
                    selectedIdx = (selectedIdx + 1) % filteredItems.length;
                    renderList();
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (filteredItems.length > 0) {
                    selectedIdx = (selectedIdx - 1 + filteredItems.length) % filteredItems.length;
                    renderList();
                }
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredItems[selectedIdx]) {
                    filteredItems[selectedIdx].fn();
                    closePalette();
                }
            }
        });

        document.addEventListener("click", (e) => {
            if (
                palette.classList.contains("visible") &&
                !palette.contains(e.target) &&
                !e.target.closest(".cmd-hint")
            ) {
                closePalette();
            }
        });
    }
})();
