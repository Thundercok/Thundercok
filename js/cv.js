// =========================================================
// HARVARD CV & INTERACTIVE EVIDENCE SYSTEM ENGINE
// =========================================================

(() => {
    "use strict";

    const EVIDENCE_DATA = {
        vrptw: {
            tag: "RESEARCH",
            title: "Hybrid GNN-DDQN + ALNS Solver for VRPTW",
            subtitle: "Thesis Research · Supervised by TS. Hồ Thị Linh (TDTU)",
            content: `
                <div class="evidence-section">
                    <div class="evidence-sec-heading">Problem & Architecture</div>
                    <p>Vehicle Routing Problem with Time Windows (VRPTW) is NP-hard. We developed a hybrid neural-metaheuristic solver combining <strong>Graph Attention Networks (GAT)</strong> for spatial-temporal embeddings, <strong>Double DQN (DDQN)</strong> for constructive heuristic operator selection, and <strong>Adaptive Large Neighborhood Search (ALNS)</strong> with Numba JIT acceleration.</p>
                </div>

                <div class="evidence-section">
                    <div class="evidence-sec-heading">Strict Cold-Start Empirical Benchmark</div>
                    <div class="evidence-card">
                        <p style="font-size: 11px; color: #8b949e; margin-bottom: 6px;">Evaluated under strict independent cold-starts from <code>build_greedy</code> in cleared directory across 62+ benchmark instances.</p>
                        <table class="benchmark-table">
                            <thead>
                                <tr>
                                    <th>Instance Scale</th>
                                    <th>ALNS-Base (NV)</th>
                                    <th>Hybrid-DDQN (NV)</th>
                                    <th>Wilcoxon p</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>c2_4_1</strong> (400 Cust)</td>
                                    <td>13.00</td>
                                    <td class="val-highlight">12.20</td>
                                    <td>p = 0.0078</td>
                                </tr>
                                <tr>
                                    <td><strong>r2_4_1</strong> (400 Cust)</td>
                                    <td>8.80</td>
                                    <td class="val-highlight">8.10</td>
                                    <td>p = 0.0156</td>
                                </tr>
                                <tr>
                                    <td><strong>rc2_4_1</strong> (400 Cust)</td>
                                    <td>12.80</td>
                                    <td class="val-highlight">12.50</td>
                                    <td>p = 0.3750</td>
                                </tr>
                                <tr>
                                    <td><strong>200-Cust Scale</strong></td>
                                    <td>NV Matched</td>
                                    <td class="val-highlight">TD -1.75% to -4.07%</td>
                                    <td>Degradation &lt;20%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="evidence-section">
                    <div class="evidence-sec-heading">Scientific Findings</div>
                    <p>Revealed scale-aware performance divergence: At 200-customer scale, both solvers reach the NV floor, with Hybrid-DDQN dominating on travel distance (1.75%–4.07% TD gap). At 400-customer scale, Hybrid-DDQN achieves statistically significant vehicle count reductions (0.70–0.80 vehicles on c2/r2 classes).</p>
                </div>

                <div class="evidence-links-grid">
                    <a href="papers/VRPTW-VI.pdf" target="_blank" rel="noopener" class="evidence-action-link">
                        <span>📄 Read Research Paper (PDF)</span>
                        <span>↗</span>
                    </a>
                    <a href="https://github.com/Thundercok/vrptw-neural-hybrid-optimizer" target="_blank" rel="noopener" class="evidence-action-link">
                        <span>💻 View Python / PyTorch Codebase</span>
                        <span>↗</span>
                    </a>
                </div>
            `
        },

        nesy: {
            tag: "NEURO-SYMBOLIC",
            title: "NeSy-DocAI: Neuro-Symbolic Document AI",
            subtitle: "Vision-Language + Z3 SMT Constraint Verification",
            content: `
                <div class="evidence-section">
                    <div class="evidence-sec-heading">Architecture & Methodology</div>
                    <p>Pure LLMs/VLMs frequently suffer from arithmetic hallucination on tabular documents. NeSy-DocAI bridges perceptual understanding with formal verification:</p>
                    <ul style="padding-left: 16px; margin-top: 6px; font-size: 12px; color: #c9d1d9;">
                        <li><strong>Perceptual Layer:</strong> Qwen2.5-VL parses visual invoice layouts, bounding boxes, and tabular key-value tokens.</li>
                        <li><strong>Symbolic Layer:</strong> Formulates extracted quantities, unit prices, VAT rates, and grand totals into first-order logic equations solved by <strong>Z3 SMT Solver</strong>.</li>
                        <li><strong>Refinement Loop:</strong> Detects and formally corrects arithmetic inconsistencies before database ingestion.</li>
                    </ul>
                </div>

                <div class="evidence-section">
                    <div class="evidence-sec-heading">Tech Stack</div>
                    <div class="evidence-card">
                        <code>PyTorch · Qwen2.5-VL · Z3 SMT Theorem Prover · FastAPI · Docker</code>
                    </div>
                </div>

                <div class="evidence-links-grid">
                    <a href="https://github.com/Thundercok/nesy-docai" target="_blank" rel="noopener" class="evidence-action-link">
                        <span>💻 View GitHub Repository</span>
                        <span>↗</span>
                    </a>
                </div>
            `
        },

        cctv: {
            tag: "VISION & EDGE",
            title: "PG-MTAN: Edge CCTV Multi-Task Vision",
            subtitle: "Physics-Guided Multi-Task Attention Network",
            content: `
                <div class="evidence-section">
                    <div class="evidence-sec-heading">Core Capabilities</div>
                    <p>Real-time edge analytics system processing low-quality municipal CCTV camera streams for concurrent traffic density estimation and urban flood water level assessment.</p>
                </div>

                <div class="evidence-section">
                    <div class="evidence-sec-heading">Performance Metrics</div>
                    <div class="evidence-card">
                        <table class="benchmark-table">
                            <tr>
                                <td><strong>Throughput</strong></td>
                                <td class="val-highlight">54.0 FPS (Jetson Orin)</td>
                            </tr>
                            <tr>
                                <td><strong>Backbone</strong></td>
                                <td>ConvNeXt-V2 + SAM 2</td>
                            </tr>
                            <tr>
                                <td><strong>Time-Series Storage</strong></td>
                                <td>TimescaleDB + FastAPI</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="evidence-links-grid">
                    <a href="https://github.com/Thundercok/hcmc-traffic-analytics" target="_blank" rel="noopener" class="evidence-action-link">
                        <span>💻 View Repository</span>
                        <span>↗</span>
                    </a>
                </div>
            `
        },

        spider: {
            tag: "SYSTEMS",
            title: "Spider-The-Web-Crawler (Rust Async)",
            subtitle: "High-Throughput Concurrent Scraping Engine",
            content: `
                <div class="evidence-section">
                    <div class="evidence-sec-heading">Engineering Highlights</div>
                    <p>Constructed a high-concurrency web crawling pipeline in Rust leveraging the Tokio asynchronous runtime, non-blocking I/O, worker actor channels, and zero-copy HTML parsing to minimize memory footprint during massive URL stream sweeps.</p>
                </div>

                <div class="evidence-links-grid">
                    <a href="https://github.com/Thundercok/Spider-The-Web-Crawler" target="_blank" rel="noopener" class="evidence-action-link">
                        <span>💻 View Rust Source Code</span>
                        <span>↗</span>
                    </a>
                </div>
            `
        },

        awards: {
            tag: "HONORS & LEADERSHIP",
            title: "Awards, Contests & Student Leadership",
            subtitle: "Competitive Programming & Community Impact",
            content: `
                <div class="evidence-section">
                    <div class="evidence-sec-heading">Contest Achievements</div>
                    <ul style="padding-left: 16px; font-size: 12px; color: #c9d1d9;">
                        <li><strong>2nd Place Winner:</strong> ITZone Software Contest (TDTU).</li>
                        <li><strong>DataStorm AI Contest:</strong> Active participant tackling real-world predictive ML pipelines.</li>
                        <li><strong>TDTU Entrance Scholarship:</strong> Academic merit award recipient.</li>
                    </ul>
                </div>

                <div class="evidence-section">
                    <div class="evidence-sec-heading">Leadership & Mentorship</div>
                    <p><strong>Vice Lead — Vườn Ươm Nhà Nấm:</strong> Directed student academic operations and project pipelines.<br><br>
                    <strong>Team Lead — ITZone Club:</strong> Hosted technical sharing workshops on algorithms and coached junior student teams.</p>
                </div>
            `
        },

        education: {
            tag: "ACADEMICS",
            title: "Education & Global Experience",
            subtitle: "Ton Duc Thang University & CCU Taiwan",
            content: `
                <div class="evidence-section">
                    <div class="evidence-sec-heading">Computer Science Curriculum</div>
                    <p><strong>Ton Duc Thang University (2022 — Present):</strong> B.S. in Computer Science with focus on Operations Research, Deep Reinforcement Learning, and Neuro-Symbolic AI. Thesis supervised by TS. Hồ Thị Linh.</p>
                    <p style="margin-top: 8px;"><strong>Chinese Culture University (Taipei, Taiwan - 2026):</strong> Specialized coursework in Deep Learning, Computer Vision, and international research exchange.</p>
                </div>

                <div class="evidence-section">
                    <div class="evidence-sec-heading">Language Proficiency</div>
                    <p><strong>IELTS 7.5</strong> (English) · Basic Mandarin · Vietnamese (Native).</p>
                </div>
            `
        }
    };

    function initCV() {
        const drawer = document.getElementById("evidence-drawer");
        const drawerTag = document.getElementById("evidence-tag");
        const drawerTitle = document.getElementById("evidence-title");
        const drawerContent = document.getElementById("evidence-content");
        const closeBtn = document.getElementById("btn-close-drawer");
        const printBtn = document.getElementById("btn-print-cv");
        const toggleDrawerBtn = document.getElementById("btn-toggle-evidence");
        const evidenceLinks = document.querySelectorAll(".evidence-link");

        function openEvidence(key) {
            const data = EVIDENCE_DATA[key];
            if (!data) return;

            drawerTag.textContent = data.tag;
            drawerTitle.textContent = data.title;
            drawerContent.innerHTML = `
                <div style="font-size: 11.5px; color: #8b949e; margin-bottom: 12px; font-weight: 500;">${data.subtitle}</div>
                ${data.content}
            `;

            drawer.classList.remove("collapsed");
            if (toggleDrawerBtn) {
                toggleDrawerBtn.classList.add("btn-primary");
                toggleDrawerBtn.classList.remove("btn-outline");
            }

            // Scroll drawer into view on mobile
            if (window.innerWidth <= 1024) {
                drawer.scrollIntoView({ behavior: "smooth" });
            }
        }

        function closeEvidence() {
            drawer.classList.add("collapsed");
            if (toggleDrawerBtn) {
                toggleDrawerBtn.classList.remove("btn-primary");
                toggleDrawerBtn.classList.add("btn-outline");
            }
        }

        // Event Listeners for Evidence Links
        evidenceLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                const key = link.getAttribute("data-evidence");
                if (key && EVIDENCE_DATA[key]) {
                    e.preventDefault();
                    openEvidence(key);
                }
            });
        });

        // Close Drawer Button
        if (closeBtn) {
            closeBtn.addEventListener("click", closeEvidence);
        }

        // Toggle Drawer Button
        if (toggleDrawerBtn) {
            toggleDrawerBtn.addEventListener("click", () => {
                if (drawer.classList.contains("collapsed")) {
                    openEvidence("vrptw"); // default open VRPTW
                } else {
                    closeEvidence();
                }
            });
        }

        // Print CV
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                window.print();
            });
        }

        // Keyboard Shortcut: Escape to close drawer, Ctrl+P to print
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeEvidence();
            }
        });

        // Open default evidence on large screens
        if (window.innerWidth > 1200) {
            openEvidence("vrptw");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCV);
    } else {
        initCV();
    }
})();
