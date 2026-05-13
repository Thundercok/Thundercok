// ==========================================
// js/papers.js - DOCUMENTATION ENGINE LOGIC
// ==========================================

const papers = [
  {
    id: "doc-linked-list",
    title: "📖 Docs: Cấu trúc Singly Linked List",
    tags: ["docs", "dsa"],
    type: "markdown",
    url: "papers/linked-list-doc.md", // Đảm bảo đường dẫn này đúng với máy bạn
  },
  {
    id: "dsa-dijkstra",
    title: "[App] Dijkstra State Machine",
    tags: ["dsa"],
    type: "iframe",
    url: "papers/dijkstra-state.html",
  },
];

let activePaper = null;

function renderPapers() {
  const q = document.getElementById("psearch")?.value.toLowerCase() || "";
  const el = document.getElementById("plist");
  if (!el) return;

  el.innerHTML = "";
  papers
    .filter((p) => !q || p.title.toLowerCase().includes(q))
    .forEach((p) => {
      const d = document.createElement("div");
      d.className = "pcard" + (activePaper === p.id ? " active" : "");
      d.innerHTML = `<div class="pc-tag">[${p.tags[0]}]</div><div class="pc-title">${p.title}</div>`;
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

      // [PROD FIX]: Tự động nội suy đường dẫn tương đối
      // Lấy thư mục chứa file markdown hiện tại (vd: "papers/dsa/linked-list/")
      const basePath = p.url.substring(0, p.url.lastIndexOf("/") + 1);

      // Render Simulator an toàn và thông minh
      html = html.replace(/::SIMULATOR\[(.*?)\]::/g, (match, simPath) => {
        let finalPath = simPath;
        // Nếu không phải link tuyệt đối (http) hoặc link từ root (/), thì tự động nối basePath
        if (!simPath.startsWith("http") && !simPath.startsWith("/")) {
          finalPath = basePath + simPath;
        }
        return `<div class="sim-container"><iframe src="${finalPath}"></iframe></div>`;
      });

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

// KHỞI CHẠY KHI DOM ĐÃ SẴN SÀNG
document.addEventListener("DOMContentLoaded", () => {
  renderPapers();
  if (papers.length > 0) loadPaper(papers[0]);
});
