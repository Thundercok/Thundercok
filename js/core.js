// =========================================
// Nguyễn Văn Mười — Minimal Research Portfolio
// Core Engine: Navigation · Command Palette
// =========================================

(() => {
    "use strict";

    // ── 1. INITIALIZATION ──
    document.addEventListener("DOMContentLoaded", () => {
        initScrollSpy();
        initCmdPalette();
    });

    // ── 2. SCROLL SPY & NAVIGATION ──
    function initScrollSpy() {
        const sections = document.querySelectorAll(".section");
        const navLinks = document.querySelectorAll(".nav-link");
        const mainContent = document.getElementById("main-content");

        if (!mainContent || sections.length === 0) return;

        // Smooth nav clicking
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

        // Intersection Observer for scrollSpy
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

        // Global Keydown Shortcut
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

        // Search Input Filtering & Arrow Navigation
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

        // Click Outside to Close
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
