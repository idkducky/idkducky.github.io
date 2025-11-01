// site.js v11 — normalize old paths + set language select by current URL + iOS modal

// --- 0) Нормализация старых путей (если кто-то пришёл по старым ссылкам) ---
(function normalizeLegacyPaths() {
  const MAP = {
    "/index-en.html": "/en.html",
    "/index-az.html": "/az.html",
    "/index-ka.html": "/ka.html",
    "/index-ua.html": "/ua.html"
  };
  const p = (location.pathname.replace(/\/+$/, "") || "/index.html");
  if (MAP[p]) location.replace(MAP[p] + location.search + location.hash);
})();

// --- 1) Переключение языка ---
window.changeLang = function (sel) {
  let val = sel?.value;
  if (!val) return;

  // защита от старых значений
  const LEGACY = {
    "/index-en.html": "/en.html",
    "/index-az.html": "/az.html",
    "/index-ka.html": "/ka.html",
    "/index-ua.html": "/ua.html"
  };
  val = LEGACY[val] || val;

  const current = (location.pathname.replace(/\/+$/, "") || "/index.html");
  if (val === current) return; // уже на этом языке

  document.body.classList.add("fade-out");
  const d = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380;
  setTimeout(() => (location.href = val), d);
};

document.addEventListener("DOMContentLoaded", () => {
  // --- 2) Синхронизируем селектор с текущим URL ---
  const sel = document.querySelector('select[onchange^="changeLang"]');
  if (sel) {
    const current = (location.pathname.replace(/\/+$/, "") || "/index.html");
    const valueToSet = current === "/" ? "/index.html" : current;
    if ([...sel.options].some(o => o.value === valueToSet)) sel.value = valueToSet;
  }

  // --- 3) iOS-модалка «папок» ---
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
  document.body.appendChild(modal);

  const panel = modal.querySelector(".folder-panel");
  const title = modal.querySelector(".folder-title");
  const grid  = modal.querySelector(".folder-grid");
  const closeBtn = modal.querySelector(".folder-close");

  function openModal(label, apps) {
    title.textContent = label || "Folder";
    grid.innerHTML = "";
    apps.forEach(a => grid.appendChild(a.cloneNode(true)));
    document.body.classList.add("folder-open");
    modal.classList.remove("closing");
    modal.classList.add("open");
    closeBtn.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.add("closing");
    modal.classList.remove("open");
    const done = () => { modal.classList.remove("closing"); document.body.classList.remove("folder-open"); };
    panel.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 260);
  }

  document.querySelectorAll(".cc-folder").forEach(folder => {
    const summary = folder.querySelector("summary");
    if (!summary) return;
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const label = folder.querySelector(".label")?.textContent?.trim();
      const apps = Array.from(folder.querySelectorAll(".app"));
      openModal(label, apps);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  console.log("[site.js v11] ready");
});
