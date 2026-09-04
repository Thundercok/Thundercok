// =========================================================
// Japanese Guide to Color & Outfit Coordination Controller
// 配色総鑑 (Haishoku Sōkan — Sanzo Wada) & Wardrobe Studio
// =========================================================

(() => {
    "use strict";

    // ── 1. STATE ──
    const state = {
        activeTab: "palettes", // 'palettes', 'colors', 'nippon', 'saved'
        activeSilhouette: "smart_casual", // 'smart_casual', 'cityboy', 'wabi_sabi', 'feminine'
        currentPaletteId: 142, // Default classic Sanzo Wada palette
        currentLayers: {
            outerwear: "#27221f", // Default charcoal/dark
            top: "#fef4f4",       // Default crisp light
            bottom: "#165e83",    // Default indigo
            shoes: "#786b59"      // Default tea brown/leather
        },
        currentLayerNames: {
            outerwear: "Sumi-iro (Đen mực)",
            top: "Sakura-iro (Hồng phớt)",
            bottom: "Ai-iro (Xanh chàm)",
            shoes: "Rikyucha (Nâu trà)"
        },
        searchQuery: "",
        countFilter: "all",
        seasonFilter: "all",
        vibeFilter: "all",
        baseColorFilter: null,
        bookmarkedIds: new Set(JSON.parse(localStorage.getItem("sanzo_saved_palettes") || "[]")),
    };

    // ── 2. SVG SILHOUETTE DEFINITIONS ──
    const SILHOUETTES = {
        smart_casual: `
            <g id="sil-smart-casual">
                <!-- Head / Neck -->
                <circle cx="80" cy="28" r="16" fill="#e8d5c4" stroke="rgba(226,196,153,0.3)" stroke-width="1.5"/>
                <path d="M74,44 L74,54 L86,54 L86,44 Z" fill="#dfc7b2" />
                
                <!-- Inner Top (Shirt & Collar) -->
                <path class="mannequin-layer-path" data-layer="top" d="M68,54 L92,54 L98,115 L62,115 Z" fill="${'${top}'}" stroke="rgba(0,0,0,0.15)" stroke-width="1.2"/>
                <path d="M73,54 L80,72 L87,54 L80,62 Z" fill="#ffffff" opacity="0.85"/>
                <path d="M78,63 L82,63 L80,105 Z" fill="${'${shoes}'}" opacity="0.9" /> <!-- Tie accent -->
                
                <!-- Outerwear (Tailored Blazer) -->
                <path class="mannequin-layer-path" data-layer="outerwear" d="M68,54 L44,72 L38,150 L56,152 L62,105 L60,165 L100,165 L98,105 L104,152 L122,150 L116,72 L92,54 L86,108 L80,118 L74,108 Z" fill="${'${outerwear}'}" stroke="rgba(255,255,255,0.15)" stroke-width="1.2"/>
                
                <!-- Lapel Shadows -->
                <path d="M68,54 L76,102 L80,118 L62,105 Z" fill="rgba(0,0,0,0.25)"/>
                <path d="M92,54 L84,102 L80,118 L98,105 Z" fill="rgba(0,0,0,0.25)"/>

                <!-- Bottom (Tailored Trousers) -->
                <path class="mannequin-layer-path" data-layer="bottom" d="M61,165 L99,165 L103,260 L85,260 L80,188 L75,260 L57,260 Z" fill="${'${bottom}'}" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
                <line x1="70" y1="172" x2="70" y2="258" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
                <line x1="90" y1="172" x2="90" y2="258" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

                <!-- Footwear (Derby Shoes) -->
                <path class="mannequin-layer-path" data-layer="shoes" d="M54,260 L74,260 L76,275 L50,275 Z" fill="${'${shoes}'}" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
                <path class="mannequin-layer-path" data-layer="shoes" d="M86,260 L106,260 L110,275 L84,275 Z" fill="${'${shoes}'}" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
            </g>
        `,
        cityboy: `
            <g id="sil-cityboy">
                <!-- Head / Beanie -->
                <circle cx="80" cy="28" r="16" fill="#e8d5c4"/>
                <path class="mannequin-layer-path" data-layer="shoes" d="M62,24 C62,10 98,10 98,24 Z" fill="${'${shoes}'}" opacity="0.9"/>
                
                <!-- Inner Top (Boxy Crewneck Tee) -->
                <path class="mannequin-layer-path" data-layer="top" d="M60,52 L100,52 L105,130 L55,130 Z" fill="${'${top}'}" stroke="rgba(0,0,0,0.15)"/>
                
                <!-- Outerwear (Oversized Harrington / Cardigan) -->
                <path class="mannequin-layer-path" data-layer="outerwear" d="M60,50 L34,70 L26,145 L46,148 L54,115 L52,168 L108,168 L106,115 L114,148 L134,145 L126,70 L100,50 L92,90 L80,166 L68,90 Z" fill="${'${outerwear}'}" stroke="rgba(255,255,255,0.15)" stroke-width="1.2"/>
                
                <!-- Bottom (Wide-leg Balloon Pants) -->
                <path class="mannequin-layer-path" data-layer="bottom" d="M52,168 L108,168 L114,258 L86,258 L80,195 L74,258 L46,258 Z" fill="${'${bottom}'}" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
                
                <!-- Shoes (Chunky Retro Sneakers) -->
                <path class="mannequin-layer-path" data-layer="shoes" d="M43,258 L72,258 L75,276 L40,276 Z" fill="${'${shoes}'}" stroke="rgba(0,0,0,0.2)"/>
                <path class="mannequin-layer-path" data-layer="shoes" d="M88,258 L117,258 L120,276 L85,276 Z" fill="${'${shoes}'}" stroke="rgba(0,0,0,0.2)"/>
            </g>
        `,
        wabi_sabi: `
            <g id="sil-wabi-sabi">
                <!-- Head -->
                <circle cx="80" cy="28" r="16" fill="#e8d5c4"/>
                
                <!-- Inner Top (Linen Slub Tee) -->
                <path class="mannequin-layer-path" data-layer="top" d="M64,52 L96,52 L100,125 L60,125 Z" fill="${'${top}'}"/>
                <path d="M72,52 L80,68 L88,52 Z" fill="#dfc7b2"/>
                
                <!-- Outerwear (Kimono-Inspired Haori Wrap) -->
                <path class="mannequin-layer-path" data-layer="outerwear" d="M64,50 L36,75 L28,155 L48,158 L58,110 L52,175 L108,175 L102,110 L112,158 L132,155 L124,75 L96,50 L88,110 L80,135 L72,110 Z" fill="${'${outerwear}'}" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
                
                <!-- Bottom (Relaxed Linen Trousers) -->
                <path class="mannequin-layer-path" data-layer="bottom" d="M52,175 L108,175 L110,260 L85,260 L80,198 L75,260 L50,260 Z" fill="${'${bottom}'}" stroke="rgba(0,0,0,0.2)"/>
                
                <!-- Shoes (Leather Mules / Loafers) -->
                <path class="mannequin-layer-path" data-layer="shoes" d="M47,260 L73,260 L75,274 L45,274 Z" fill="${'${shoes}'}"/>
                <path class="mannequin-layer-path" data-layer="shoes" d="M87,260 L113,260 L115,274 L85,274 Z" fill="${'${shoes}'}"/>
            </g>
        `,
        feminine: `
            <g id="sil-feminine">
                <!-- Head / Hair -->
                <circle cx="80" cy="28" r="15" fill="#e8d5c4"/>
                <path d="M64,24 Q80,10 96,24 Q98,42 94,48 L90,44 Q80,20 68,44 Z" fill="#27221f"/>
                
                <!-- Inner Top (Silk Blouse) -->
                <path class="mannequin-layer-path" data-layer="top" d="M68,52 L92,52 L96,120 L64,120 Z" fill="${'${top}'}"/>
                
                <!-- Outerwear (Long Trench Coat) -->
                <path class="mannequin-layer-path" data-layer="outerwear" d="M68,50 L46,70 L40,145 L56,148 L62,112 L50,210 L110,210 L98,112 L104,148 L120,145 L114,70 L92,50 L86,105 L80,122 L74,105 Z" fill="${'${outerwear}'}" stroke="rgba(255,255,255,0.15)" stroke-width="1.2"/>
                <!-- Trench Belt -->
                <rect x="58" y="118" width="44" height="6" fill="${'${shoes}'}" rx="2"/>
                
                <!-- Bottom (Pleated Midi Skirt) -->
                <path class="mannequin-layer-path" data-layer="bottom" d="M58,124 L102,124 L116,238 L44,238 Z" fill="${'${bottom}'}" stroke="rgba(0,0,0,0.15)"/>
                
                <!-- Chelsea Boots -->
                <path class="mannequin-layer-path" data-layer="shoes" d="M56,238 L72,238 L74,275 L52,275 Z" fill="${'${shoes}'}"/>
                <path class="mannequin-layer-path" data-layer="shoes" d="M88,238 L104,238 L108,275 L86,275 Z" fill="${'${shoes}'}"/>
            </g>
        `
    };

    // ── 3. DOM ELEMENTS ──
    let dom = {};

    function initDOM() {
        dom = {
            mannequinContainer: document.getElementById("mannequin-container"),
            silBtns: document.querySelectorAll(".sil-btn"),
            
            // Layer chips & text
            layerChips: {
                outerwear: document.getElementById("chip-outerwear"),
                top: document.getElementById("chip-top"),
                bottom: document.getElementById("chip-bottom"),
                shoes: document.getElementById("chip-shoes")
            },
            layerNames: {
                outerwear: document.getElementById("name-outerwear"),
                top: document.getElementById("name-top"),
                bottom: document.getElementById("name-bottom"),
                shoes: document.getElementById("name-shoes")
            },
            
            // Actions
            btnSwapOuterInner: document.getElementById("btn-swap-outer-inner"),
            btnSwapTopBottom: document.getElementById("btn-swap-top-bottom"),
            btnCycleColors: document.getElementById("btn-cycle-colors"),
            btnRandomOutfit: document.getElementById("btn-random-outfit"),
            btnSaveWardrobe: document.getElementById("btn-save-current-palette"),
            
            // Ratio Panel
            ratioSegments: document.getElementById("ratio-bar-segments"),
            ratioBadge: document.getElementById("ratio-harmony-badge"),
            adviceText: document.getElementById("outfit-advice-content"),
            
            // Tabs & Explorers
            tabBtns: document.querySelectorAll(".tab-btn"),
            tabPanels: {
                palettes: document.getElementById("tab-panel-palettes"),
                colors: document.getElementById("tab-panel-colors"),
                nippon: document.getElementById("tab-panel-nippon"),
                saved: document.getElementById("tab-panel-saved")
            },
            
            // Grids
            palettesGrid: document.getElementById("palettes-grid"),
            colorsGrid: document.getElementById("colors-grid"),
            nipponGrid: document.getElementById("nippon-grid"),
            savedGrid: document.getElementById("saved-grid"),
            savedCountBadge: document.getElementById("saved-count-badge"),
            
            // Filters
            searchInput: document.getElementById("search-input"),
            countPills: document.querySelectorAll("[data-count-filter]"),
            seasonPills: document.querySelectorAll("[data-season-filter]"),
            vibePills: document.querySelectorAll("[data-vibe-filter]"),
            baseColorDots: document.querySelectorAll(".base-color-dot"),
            clearBaseBtn: document.getElementById("clear-base-color"),
            
            toast: document.getElementById("toast-notification")
        };
    }

    // ── 4. MANNEQUIN RENDERING & UPDATE ──
    function renderMannequin() {
        if (!dom.mannequinContainer) return;
        const template = SILHOUETTES[state.activeSilhouette] || SILHOUETTES.smart_casual;
        
        // Interpolate colors into SVG
        const filledSVG = template
            .replace(/\${outerwear}/g, state.currentLayers.outerwear)
            .replace(/\${top}/g, state.currentLayers.top)
            .replace(/\${bottom}/g, state.currentLayers.bottom)
            .replace(/\${shoes}/g, state.currentLayers.shoes);

        dom.mannequinContainer.innerHTML = `
            <svg viewBox="0 0 160 290" xmlns="http://www.w3.org/2000/svg">
                ${filledSVG}
            </svg>
        `;

        // Update layer chips & labels
        Object.keys(state.currentLayers).forEach(layerKey => {
            if (dom.layerChips[layerKey]) {
                dom.layerChips[layerKey].style.backgroundColor = state.currentLayers[layerKey];
            }
            if (dom.layerNames[layerKey]) {
                dom.layerNames[layerKey].textContent = `${state.currentLayerNames[layerKey]} (${state.currentLayers[layerKey]})`;
            }
        });

        // Update 60-30-10 ratio visualization
        updateRatioPanel();
    }

    function updateRatioPanel() {
        if (!dom.ratioSegments) return;
        
        const pal = window.SANZO_DATA.combinations.find(p => p.id === state.currentPaletteId);
        const ratios = pal ? pal.ratios : [60, 30, 10];
        const hexes = [state.currentLayers.outerwear, state.currentLayers.bottom, state.currentLayers.top, state.currentLayers.shoes];

        let barHTML = "";
        ratios.forEach((pct, idx) => {
            const col = hexes[idx % hexes.length];
            barHTML += `<div class="ratio-segment" style="width: ${pct}%; background-color: ${col};" title="${pct}%"></div>`;
        });
        dom.ratioSegments.innerHTML = barHTML;

        if (dom.ratioBadge && pal) {
            dom.ratioBadge.textContent = pal.harmony;
        }

        if (dom.adviceText && pal) {
            dom.adviceText.innerHTML = `
                <strong>${pal.title}</strong> — ${pal.season}<br>
                <span>${pal.outfitDesc}</span>
            `;
        }
    }

    // ── 5. APPLY PALETTE TO FITTING STUDIO ──
    function applyPalette(paletteId, customHexes = null) {
        state.currentPaletteId = paletteId;
        const pal = window.SANZO_DATA.combinations.find(p => p.id === paletteId);
        if (!pal) return;

        const hexes = customHexes || pal.hexes;
        const viNames = pal.viNames;

        if (hexes.length === 2) {
            // 2-color setup: Outer/Bottom + Top
            state.currentLayers.outerwear = hexes[0];
            state.currentLayers.bottom = hexes[0];
            state.currentLayers.top = hexes[1];
            state.currentLayers.shoes = hexes[0];

            state.currentLayerNames.outerwear = viNames[0];
            state.currentLayerNames.bottom = viNames[0];
            state.currentLayerNames.top = viNames[1];
            state.currentLayerNames.shoes = viNames[0];
        } else if (hexes.length === 3) {
            // 3-color setup: Outer + Top + Bottom + Shoes
            state.currentLayers.outerwear = hexes[0];
            state.currentLayers.top = hexes[1];
            state.currentLayers.bottom = hexes[2];
            state.currentLayers.shoes = hexes[0];

            state.currentLayerNames.outerwear = viNames[0];
            state.currentLayerNames.top = viNames[1];
            state.currentLayerNames.bottom = viNames[2];
            state.currentLayerNames.shoes = viNames[0];
        } else {
            // 4-color setup: Full Quad
            state.currentLayers.outerwear = hexes[0];
            state.currentLayers.top = hexes[1];
            state.currentLayers.bottom = hexes[2];
            state.currentLayers.shoes = hexes[3];

            state.currentLayerNames.outerwear = viNames[0];
            state.currentLayerNames.top = viNames[1];
            state.currentLayerNames.bottom = viNames[2];
            state.currentLayerNames.shoes = viNames[3];
        }

        renderMannequin();
        highlightActiveCard();
        showToast(`Đã áp dụng ${pal.title} lên phòng thử đồ!`);
    }

    function highlightActiveCard() {
        document.querySelectorAll(".palette-card").forEach(card => {
            const cid = parseInt(card.getAttribute("data-id"));
            card.classList.toggle("active-selected", cid === state.currentPaletteId);
        });
    }

    // ── 6. SWAPPING & ROTATING LAYERS ──
    function swapOuterInner() {
        const tmpColor = state.currentLayers.outerwear;
        const tmpName = state.currentLayerNames.outerwear;

        state.currentLayers.outerwear = state.currentLayers.top;
        state.currentLayerNames.outerwear = state.currentLayerNames.top;

        state.currentLayers.top = tmpColor;
        state.currentLayerNames.top = tmpName;

        renderMannequin();
        showToast("Đã đổi màu Áo khoác ↔ Áo trong!");
    }

    function swapTopBottom() {
        const tmpColor = state.currentLayers.top;
        const tmpName = state.currentLayerNames.top;

        state.currentLayers.top = state.currentLayers.bottom;
        state.currentLayerNames.top = state.currentLayerNames.bottom;

        state.currentLayers.bottom = tmpColor;
        state.currentLayerNames.bottom = tmpName;

        renderMannequin();
        showToast("Đã đổi màu Áo trong ↔ Quần/Váy!");
    }

    function cycleColors() {
        const pal = window.SANZO_DATA.combinations.find(p => p.id === state.currentPaletteId);
        if (!pal) return;

        // Shift layers circularly
        const keys = ["outerwear", "top", "bottom", "shoes"];
        const firstCol = state.currentLayers[keys[0]];
        const firstName = state.currentLayerNames[keys[0]];

        for (let i = 0; i < keys.length - 1; i++) {
            state.currentLayers[keys[i]] = state.currentLayers[keys[i + 1]];
            state.currentLayerNames[keys[i]] = state.currentLayerNames[keys[i + 1]];
        }
        state.currentLayers[keys[keys.length - 1]] = firstCol;
        state.currentLayerNames[keys[keys.length - 1]] = firstName;

        renderMannequin();
        showToast("Đã xoay vòng màu sắc qua các lớp trang phục!");
    }

    // ── 7. RENDER PALETTES GRID ──
    function filterPalettes() {
        const list = window.SANZO_DATA.combinations;
        return list.filter(item => {
            // Count filter
            if (state.countFilter !== "all" && item.count !== parseInt(state.countFilter)) {
                return false;
            }
            // Season filter
            if (state.seasonFilter !== "all" && item.seasonCode !== state.seasonFilter) {
                return false;
            }
            // Vibe filter
            if (state.vibeFilter !== "all" && !item.vibes.includes(state.vibeFilter)) {
                return false;
            }
            // Base Color Matcher
            if (state.baseColorFilter) {
                const target = state.baseColorFilter.toLowerCase();
                const hasMatchingColor = item.hexes.some(h => h.toLowerCase() === target) ||
                    item.colorIds.some(cid => {
                        const colObj = window.SANZO_DATA.colors[cid];
                        return colObj && (colObj.family === target || colObj.hex.toLowerCase() === target);
                    });
                if (!hasMatchingColor) return false;
            }
            // Search query
            if (state.searchQuery) {
                const q = state.searchQuery.toLowerCase().trim();
                const matchId = item.id.toString() === q || `#${item.id}` === q;
                const matchTitle = item.title.toLowerCase().includes(q);
                const matchNames = item.names.some(n => n.toLowerCase().includes(q));
                const matchVi = item.viNames.some(v => v.toLowerCase().includes(q));
                const matchHex = item.hexes.some(h => h.toLowerCase().includes(q));
                if (!matchId && !matchTitle && !matchNames && !matchVi && !matchHex) return false;
            }
            return true;
        });
    }

    function renderPalettesGrid() {
        if (!dom.palettesGrid) return;
        const filtered = filterPalettes();

        if (filtered.length === 0) {
            dom.palettesGrid.innerHTML = `
                <div class="saved-empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">🔍</div>
                    <p style="color: var(--text);">Không tìm thấy bảng phối màu nào phù hợp.</p>
                    <button class="btn btn-outline" id="btn-reset-filters">Xóa toàn bộ bộ lọc</button>
                </div>
            `;
            const resetBtn = document.getElementById("btn-reset-filters");
            if (resetBtn) resetBtn.addEventListener("click", resetAllFilters);
            return;
        }

        dom.palettesGrid.innerHTML = filtered.map(pal => {
            const isBookmarked = state.bookmarkedIds.has(pal.id);
            const isSelected = pal.id === state.currentPaletteId;

            const swatchesHTML = pal.hexes.map((hex, i) => `
                <div class="swatch-column" style="background-color: ${hex};" title="${pal.viNames[i]} (${hex})">
                    <span class="swatch-hex-tip">${hex}</span>
                </div>
            `).join("");

            const colorRowsHTML = pal.names.map((name, i) => `
                <div class="palette-color-row">
                    <span class="p-color-name">${pal.viNames[i]}</span>
                    <span class="p-color-hex">${pal.hexes[i]}</span>
                </div>
            `).join("");

            const tagsHTML = pal.vibes.map(v => `<span class="meta-tag">${v}</span>`).join("");

            return `
                <div class="palette-card ${isSelected ? 'active-selected' : ''}" data-id="${pal.id}">
                    <div class="palette-header">
                        <div>
                            <span class="palette-id-badge">#${String(pal.id).padStart(3, '0')} · ${pal.count} Màu</span>
                            <div class="palette-title">${pal.title}</div>
                        </div>
                        <div class="palette-actions">
                            <button class="icon-btn ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${pal.id}" title="${isBookmarked ? 'Bỏ lưu' : 'Lưu vào tủ đồ'}">
                                ${isBookmarked ? '❤️' : '🤍'}
                            </button>
                            <button class="icon-btn" data-action="copy" data-hexes="${pal.hexes.join(',')}" title="Copy mã HEX">
                                📋
                            </button>
                        </div>
                    </div>

                    <div class="palette-swatches-strip">
                        ${swatchesHTML}
                    </div>

                    <div class="palette-color-list">
                        ${colorRowsHTML}
                    </div>

                    <div class="palette-meta-tags">
                        <span class="meta-tag" style="color: var(--accent);">${pal.season}</span>
                        ${tagsHTML}
                    </div>

                    <button class="card-apply-btn" data-action="apply" data-id="${pal.id}">
                        <span>👘 Thử lên người</span>
                    </button>
                </div>
            `;
        }).join("");

        // Attach event listeners to card clicks
        dom.palettesGrid.querySelectorAll(".palette-card").forEach(card => {
            card.addEventListener("click", (e) => {
                const cid = parseInt(card.getAttribute("data-id"));
                if (e.target.closest("[data-action='bookmark']")) {
                    toggleBookmark(cid);
                    e.stopPropagation();
                    return;
                }
                if (e.target.closest("[data-action='copy']")) {
                    const hexes = e.target.closest("[data-action='copy']").getAttribute("data-hexes");
                    copyToClipboard(hexes);
                    e.stopPropagation();
                    return;
                }
                applyPalette(cid);
            });
        });
    }

    // ── 8. RENDER 159 COLORS CATALOG TAB ──
    function renderColorsCatalog() {
        if (!dom.colorsGrid) return;
        const colors = window.SANZO_DATA.colors;

        dom.colorsGrid.innerHTML = colors.map(col => `
            <div class="color-swatch-card" data-hex="${col.hex}" data-family="${col.family}">
                <div class="swatch-visual-block" style="background-color: ${col.hex};">
                    <span class="swatch-hex-tip" style="opacity: 1; background: rgba(0,0,0,0.6);">${col.hex}</span>
                </div>
                <div class="swatch-info-block">
                    <div class="swatch-en-name">${col.name}</div>
                    <div class="swatch-jp-name">${col.jpName} (${col.romaji})</div>
                    <div class="swatch-vi-name">${col.viName}</div>
                    <div class="swatch-hex-label">Xuất hiện trong ${col.combinations.length} bảng phối</div>
                </div>
            </div>
        `).join("");

        dom.colorsGrid.querySelectorAll(".color-swatch-card").forEach(card => {
            card.addEventListener("click", () => {
                const hex = card.getAttribute("data-hex");
                setBaseColor(hex);
                switchTab("palettes");
            });
        });
    }

    // ── 9. RENDER TRADITIONAL NIPPON COLORS TAB ──
    function renderNipponColors() {
        if (!dom.nipponGrid) return;
        const list = window.SANZO_DATA.traditionalColors;

        dom.nipponGrid.innerHTML = list.map(item => `
            <div class="nippon-card" data-hex="${item.hex}">
                <div class="nippon-header" style="background-color: ${item.hex};">
                    <div class="nippon-kanji-big">${item.kanji}</div>
                    <span class="palette-id-badge" style="background: rgba(0,0,0,0.4); color: #fff;">${item.hex}</span>
                </div>
                <div class="nippon-body">
                    <div class="nippon-name-en">${item.en} · ${item.vi}</div>
                    <div class="nippon-romaji">${item.romaji} (${item.kanji})</div>
                    <p class="nippon-desc">${item.desc}</p>
                    <button class="card-apply-btn" style="margin-top: 6px;" data-action="find-nippon" data-hex="${item.hex}">
                        <span>🔍 Tìm bảng phối có sắc này</span>
                    </button>
                </div>
            </div>
        `).join("");

        dom.nipponGrid.querySelectorAll("[data-action='find-nippon']").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const hex = btn.getAttribute("data-hex");
                setBaseColor(hex);
                switchTab("palettes");
                e.stopPropagation();
            });
        });
    }

    // ── 10. RENDER SAVED WARDROBE TAB ──
    function renderSavedWardrobe() {
        if (!dom.savedGrid) return;
        const savedIds = Array.from(state.bookmarkedIds);
        
        if (dom.savedCountBadge) {
            dom.savedCountBadge.textContent = savedIds.length;
        }

        if (savedIds.length === 0) {
            dom.savedGrid.innerHTML = `
                <div class="saved-empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">👘</div>
                    <h4 style="color: var(--text); font-size: 16px;">Tủ đồ của bạn chưa có bảng phối nào</h4>
                    <p style="color: var(--text-secondary); max-width: 420px; font-size: 13px;">
                        Hãy bấm vào biểu tượng 🤍 ở góc mỗi bảng màu để lưu lại các set đồ ưng ý cho những dịp đi làm, dạo phố hoặc sự kiện!
                    </p>
                    <button class="btn btn-primary" id="btn-explore-now" style="margin-top: 10px;">Khám phá 348 bảng màu</button>
                </div>
            `;
            const expBtn = document.getElementById("btn-explore-now");
            if (expBtn) expBtn.addEventListener("click", () => switchTab("palettes"));
            return;
        }

        const savedPalettes = window.SANZO_DATA.combinations.filter(p => state.bookmarkedIds.has(p.id));

        dom.savedGrid.innerHTML = savedPalettes.map(pal => {
            const swatchesHTML = pal.hexes.map((hex, i) => `
                <div class="swatch-column" style="background-color: ${hex};" title="${pal.viNames[i]} (${hex})">
                    <span class="swatch-hex-tip">${hex}</span>
                </div>
            `).join("");

            return `
                <div class="palette-card active-selected" data-id="${pal.id}">
                    <div class="palette-header">
                        <div>
                            <span class="palette-id-badge">#${String(pal.id).padStart(3, '0')}</span>
                            <div class="palette-title">${pal.title}</div>
                        </div>
                        <div class="palette-actions">
                            <button class="icon-btn bookmarked" data-action="remove-bookmark" data-id="${pal.id}" title="Xóa khỏi tủ đồ">
                                🗑️
                            </button>
                        </div>
                    </div>

                    <div class="palette-swatches-strip">
                        ${swatchesHTML}
                    </div>

                    <div class="palette-meta-tags">
                        <span class="meta-tag" style="color: var(--accent);">${pal.season}</span>
                        ${pal.vibes.map(v => `<span class="meta-tag">${v}</span>`).join("")}
                    </div>

                    <button class="card-apply-btn" data-action="apply" data-id="${pal.id}">
                        <span>👘 Thử lên người</span>
                    </button>
                </div>
            `;
        }).join("");

        dom.savedGrid.querySelectorAll(".palette-card").forEach(card => {
            card.addEventListener("click", (e) => {
                const cid = parseInt(card.getAttribute("data-id"));
                if (e.target.closest("[data-action='remove-bookmark']")) {
                    toggleBookmark(cid);
                    e.stopPropagation();
                    return;
                }
                applyPalette(cid);
            });
        });
    }

    // ── 11. BOOKMARK / FAVORITES LOGIC ──
    function toggleBookmark(paletteId) {
        if (state.bookmarkedIds.has(paletteId)) {
            state.bookmarkedIds.delete(paletteId);
            showToast(`Đã xóa bảng #${paletteId} khỏi tủ đồ.`);
        } else {
            state.bookmarkedIds.add(paletteId);
            showToast(`Đã lưu bảng #${paletteId} vào tủ đồ! ❤️`);
        }

        localStorage.setItem("sanzo_saved_palettes", JSON.stringify(Array.from(state.bookmarkedIds)));
        renderPalettesGrid();
        renderSavedWardrobe();
    }

    // ── 12. TAB SWITCHING ──
    function switchTab(tabName) {
        state.activeTab = tabName;
        dom.tabBtns.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
        });

        Object.keys(dom.tabPanels).forEach(key => {
            if (dom.tabPanels[key]) {
                dom.tabPanels[key].style.display = key === tabName ? "block" : "none";
            }
        });

        if (tabName === "palettes") renderPalettesGrid();
        else if (tabName === "colors") renderColorsCatalog();
        else if (tabName === "nippon") renderNipponColors();
        else if (tabName === "saved") renderSavedWardrobe();
    }

    // ── 13. RANDOM OUTFIT GENERATOR (HÔM NAY MẶC GÌ?) ──
    function pickRandomOutfit() {
        const list = window.SANZO_DATA.combinations;
        const randomPal = list[Math.floor(Math.random() * list.length)];
        
        applyPalette(randomPal.id);
        
        // Smooth scroll to fitting studio if on mobile
        if (window.innerWidth <= 1080) {
            const studio = document.querySelector(".fitting-studio");
            if (studio) studio.scrollIntoView({ behavior: "smooth" });
        }

        showToast(`🎲 Gợi ý ngẫu nhiên: ${randomPal.title} (${randomPal.season})!`);
    }

    // ── 14. BASE COLOR MATCHER ──
    function setBaseColor(colorValue) {
        state.baseColorFilter = colorValue;
        dom.baseColorDots.forEach(dot => {
            dot.classList.toggle("active", dot.getAttribute("data-color") === colorValue);
        });
        if (dom.clearBaseBtn) {
            dom.clearBaseBtn.style.display = colorValue ? "inline" : "none";
        }
        renderPalettesGrid();
        showToast(`Đang lọc các bảng màu hợp với sắc: ${colorValue}`);
    }

    function clearBaseColor() {
        state.baseColorFilter = null;
        dom.baseColorDots.forEach(dot => dot.classList.remove("active"));
        if (dom.clearBaseBtn) dom.clearBaseBtn.style.display = "none";
        renderPalettesGrid();
    }

    function resetAllFilters() {
        state.searchQuery = "";
        state.countFilter = "all";
        state.seasonFilter = "all";
        state.vibeFilter = "all";
        state.baseColorFilter = null;

        if (dom.searchInput) dom.searchInput.value = "";
        dom.countPills.forEach(p => p.classList.toggle("active", p.getAttribute("data-count-filter") === "all"));
        dom.seasonPills.forEach(p => p.classList.toggle("active", p.getAttribute("data-season-filter") === "all"));
        dom.vibePills.forEach(p => p.classList.toggle("active", p.getAttribute("data-vibe-filter") === "all"));
        dom.baseColorDots.forEach(d => d.classList.remove("active"));
        if (dom.clearBaseBtn) dom.clearBaseBtn.style.display = "none";

        renderPalettesGrid();
        showToast("Đã đặt lại toàn bộ bộ lọc!");
    }

    // ── 15. TOAST & CLIPBOARD UTILITIES ──
    let toastTimeout = null;
    function showToast(msg) {
        if (!dom.toast) return;
        dom.toast.textContent = msg;
        dom.toast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            dom.toast.classList.remove("show");
        }, 2800);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`📋 Đã sao chép: ${text}`);
        }).catch(() => {
            showToast("Không thể sao chép vào bộ nhớ tạm.");
        });
    }

    // ── 16. EVENT LISTENERS SETUP ──
    function setupEventListeners() {
        // Silhouette buttons
        dom.silBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                dom.silBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                state.activeSilhouette = btn.getAttribute("data-sil");
                renderMannequin();
            });
        });

        // Layer actions
        if (dom.btnSwapOuterInner) dom.btnSwapOuterInner.addEventListener("click", swapOuterInner);
        if (dom.btnSwapTopBottom) dom.btnSwapTopBottom.addEventListener("click", swapTopBottom);
        if (dom.btnCycleColors) dom.btnCycleColors.addEventListener("click", cycleColors);
        if (dom.btnRandomOutfit) dom.btnRandomOutfit.addEventListener("click", pickRandomOutfit);
        if (dom.btnSaveWardrobe) dom.btnSaveWardrobe.addEventListener("click", () => toggleBookmark(state.currentPaletteId));

        // Tab switching
        dom.tabBtns.forEach(btn => {
            btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
        });

        // Search input
        if (dom.searchInput) {
            dom.searchInput.addEventListener("input", (e) => {
                state.searchQuery = e.target.value;
                renderPalettesGrid();
            });
        }

        // Count filter pills
        dom.countPills.forEach(pill => {
            pill.addEventListener("click", () => {
                dom.countPills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                state.countFilter = pill.getAttribute("data-count-filter");
                renderPalettesGrid();
            });
        });

        // Season filter pills
        dom.seasonPills.forEach(pill => {
            pill.addEventListener("click", () => {
                dom.seasonPills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                state.seasonFilter = pill.getAttribute("data-season-filter");
                renderPalettesGrid();
            });
        });

        // Vibe filter pills
        dom.vibePills.forEach(pill => {
            pill.addEventListener("click", () => {
                dom.vibePills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                state.vibeFilter = pill.getAttribute("data-vibe-filter");
                renderPalettesGrid();
            });
        });

        // Base color wardrobe dots
        dom.baseColorDots.forEach(dot => {
            dot.addEventListener("click", () => {
                const col = dot.getAttribute("data-color");
                if (state.baseColorFilter === col) {
                    clearBaseColor();
                } else {
                    setBaseColor(col);
                }
            });
        });

        if (dom.clearBaseBtn) {
            dom.clearBaseBtn.addEventListener("click", clearBaseColor);
        }
    }

    // ── 17. INITIALIZATION ──
    function init() {
        initDOM();
        setupEventListeners();
        
        // Initial setup with Wada #142 (Asagi & Navy)
        applyPalette(142);
        renderPalettesGrid();
        renderColorsCatalog();
        renderNipponColors();
        renderSavedWardrobe();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
