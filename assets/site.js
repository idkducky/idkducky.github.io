(() => {
  const MAP = {
    "/index-en.html": "/en.html",
    "/index-az.html": "/az.html",
    "/index-ka.html": "/ka.html",
    "/index-ua.html": "/ua.html",
  };
  const p = (location.pathname.replace(/\/+$/, "") || "/index.html");
  if (MAP[p]) location.replace(`${MAP[p]}${location.search}${location.hash}`);
})();

window.changeLang = (sel) => {
  const LEGACY = {
    "/index-en.html": "/en.html",
    "/index-az.html": "/az.html",
    "/index-ka.html": "/ka.html",
    "/index-ua.html": "/ua.html",
  };
  let val = sel?.value;
  if (!val) return;
  val = LEGACY[val] || val;

  const current = (location.pathname.replace(/\/+$/, "") || "/index.html");
  if (val === current) return;

  document.body.classList.add("fade-out");
  const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380;
  setTimeout(() => (location.href = val), delay);
};

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.querySelector('select[onchange^="changeLang"]');
  if (sel) {
    const current = (location.pathname.replace(/\/+$/, "") || "/index.html");
    const value = current === "/" ? "/index.html" : current;
    if ([...sel.options].some(o => o.value === value)) sel.value = value;
  }

  const modal = document.createElement("div");
  modal.className = "folder-modal";
  modal.innerHTML = `
    <div class="folder-panel" role="dialog" aria-modal="true">
      <div class="folder-header">
        <span class="folder-title"></span>
        <button class="folder-close" aria-label="Close">×</button>
      </div>
      <div class="folder-grid"></div>
    </div>`;
  document.body.append(modal);

  const panel = modal.querySelector(".folder-panel");
  const title = modal.querySelector(".folder-title");
  const grid  = modal.querySelector(".folder-grid");
  const closeBtn = modal.querySelector(".folder-close");

  const buildCleanApp = (a) => {
    const href = a.getAttribute("href") || "#";
    const t    = a.querySelector(".t")?.textContent?.trim() || a.textContent.trim();
    const img  = a.querySelector("img");
    const src  = img?.getAttribute("src") || "";
    const alt  = img?.getAttribute("alt") || t || "";

    const clone = document.createElement("a");
    clone.className = "app";
    clone.href = href;
    clone.target = "_blank";
    clone.rel = "noopener";

    const i = document.createElement("img");
    i.src = src;
    i.alt = alt;

    const span = document.createElement("span");
    span.className = "t";
    span.textContent = t;

    clone.append(i, span);
    return clone;
  };

  const openModal = (label, apps) => {
    title.textContent = label || "Folder";
    grid.innerHTML = "";
    apps.forEach(a => grid.append(buildCleanApp(a)));
    document.body.classList.add("folder-open");
    modal.classList.add("open");
    closeBtn.focus({ preventScroll: true });
  };

  const closeModal = () => {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.classList.remove("folder-open");
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest(".apps a")) return;

    const folder = e.target.closest(".cc-folder");
    if (!folder) return;

    e.preventDefault();
    const label = folder.querySelector(".label")?.textContent?.trim() || "Folder";
    const apps  = [...folder.querySelectorAll(".app")];
    openModal(label, apps);
  });
  
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  const mq = matchMedia("(prefers-color-scheme: dark)");
  const setThemeMeta = () => {
    const meta = document.querySelector('meta[name="theme-color"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name","theme-color");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute("content", mq.matches ? "#101010" : "#ffffff");
  };
  setThemeMeta();
  mq.addEventListener?.("change", setThemeMeta);

  console.log("[site.js v20] modern build ready");
});
