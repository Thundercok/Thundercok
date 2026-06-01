// ==========================================
// js/papers.js - DOCUMENTATION ENGINE LOGIC
// ==========================================

const papers = [
  {
    id: "doc-linked-list",
    title: "Cấu trúc Singly Linked List",
    desc: "Tìm hiểu cấu trúc danh sách liên kết đơn, cách cấp phát RAM vật lý và phân tích độ phức tạp thuật toán.",
    tags: ["docs", "dsa"],
    duration: "5 mins",
    icon: "TXT",
    type: "markdown",
    url: "papers/dsa/linked-list-doc.md",
  },
  {
    id: "dsa-dijkstra",
    title: "[App] Dijkstra State Machine",
    desc: "Mô phỏng trực quan hoạt động của thuật toán tìm đường ngắn nhất Dijkstra dưới dạng máy trạng thái.",
    tags: ["dsa"],
    duration: "O(V²)",
    icon: "APP",
    type: "iframe",
    url: "papers/dsa/dijkstra-state.html",
  },
  {
    id: "vrptw-paper",
    title: "Research: Heuristics cho VRPTW",
    desc: "Nghiên cứu về các thuật toán Heuristics tối ưu hóa bài toán định tuyến phương tiện có ràng buộc cửa sổ thời gian.",
    tags: ["research"],
    duration: "15 mins",
    icon: "PDF",
    type: "iframe",
    url: "papers/VRPTW-VI.pdf",
  }
];

let activePaper = papers[0].id;
let currentCategory = "all";

function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".cat-pill").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(`'${cat}'`));
  });
  renderPapers();
}

function renderPapers() {
  const q = document.getElementById("psearch")?.value.toLowerCase() || "";
  const el = document.getElementById("plist");
  if (!el) return;

  el.innerHTML = "";
  papers
    .filter((p) => {
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchCategory = currentCategory === "all" || p.tags.includes(currentCategory);
      return matchQuery && matchCategory;
    })
    .forEach((p) => {
      const d = document.createElement("div");
      d.className = "pcard" + (activePaper === p.id ? " active" : "");
      d.innerHTML = `
        <div class="pc-header">
          <span class="pc-tag">[${p.tags[0]}]</span>
          <span class="pc-format-icon">[${p.icon}]</span>
        </div>
        <div class="pc-title">${p.title}</div>
        <div class="pc-desc">${p.desc}</div>
        <div class="pc-meta">
          <span>${p.duration}</span>
          <span style="font-size:9px;opacity:0.6">${p.type.toUpperCase()}</span>
        </div>
      `;
      d.onclick = () => loadPaper(p);
      el.appendChild(d);
    });
}

async function loadPaper(p) {
  activePaper = p.id;
  renderPapers();

  const titleEl = document.getElementById("viewer-title");
  if (titleEl) titleEl.textContent = p.title;

  const mdViewer = document.getElementById("md-viewer");
  const iframeViewer = document.getElementById("content-embed");

  if (!mdViewer || !iframeViewer) return;

  if (p.type === "markdown") {
    iframeViewer.style.display = "none";
    mdViewer.style.display = "block";
    mdViewer.innerHTML =
      "<div style=\"color:var(--sage); text-align:center; padding: 40px; font-family:'DM Mono',monospace;\">[SYS] fetching document...</div>";

    try {
      const response = await fetch(p.url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const rawText = await response.text();

      let cleanContent = rawText.replace(/^[ \t]+/gm, "");
      let html = marked.parse(cleanContent);

      // Render Simulator an toàn và thông minh
      const basePath = p.url.substring(0, p.url.lastIndexOf("/") + 1);
      html = html.replace(/::SIMULATOR\[(.*?)\]::/g, (match, simPath) => {
        let finalPath = simPath;
        if (!simPath.startsWith("http") && !simPath.startsWith("/")) {
          finalPath = basePath + simPath;
        }
        return `<div class="sim-container"><iframe src="${finalPath}"></iframe></div>`;
      });

      // Xử lý Hộp cảnh báo (Alert blocks) kiểu GitHub
      html = html.replace(/<blockquote>\s*<p>\[!NOTE\]/gi, '<blockquote class="note"><p>');
      html = html.replace(/<blockquote>\s*<p>\[!WARNING\]/gi, '<blockquote class="warning"><p>');
      html = html.replace(/<blockquote>\s*<p>\[!TIP\]/gi, '<blockquote class="tip"><p>');
      html = html.replace(/<blockquote>\s*<p>\[!IMPORTANT\]/gi, '<blockquote class="tip"><p>');

      mdViewer.innerHTML = html;
    } catch (e) {
      mdViewer.innerHTML = `<div style="background: var(--bg3); padding: 20px; border: 1px solid var(--rose); color:var(--rose);"><b>[ERROR]</b> Lỗi tải file: ${p.url}<br><br>Chi tiết: ${e.message}</div>`;
    }
  } else {
    mdViewer.style.display = "none";
    iframeViewer.style.display = "block";
    iframeViewer.src = p.url;
  }
}

function openExternal() {
  const p = papers.find((x) => x.id === activePaper);
  if (p && p.url) window.open(p.url, "_blank");
}

function toggleFullscreen() {
  const layout = document.querySelector(".papers-layout");
  const btn = document.getElementById("btn-fullscreen");
  if (!layout || !btn) return;

  const isFullscreen = layout.classList.toggle("fullscreen-view");
  btn.innerHTML = isFullscreen ? "[restore view]" : "[expand view]";
}

// KHỞI CHẠY KHI DOM ĐÃ SẴN SÀNG
document.addEventListener("DOMContentLoaded", () => {
  renderPapers();
  if (papers.length > 0) loadPaper(papers[0]);
});
