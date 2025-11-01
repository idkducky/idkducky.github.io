// site.js v10 — iOS-style modal folders, smooth open/close + language switch
(function () {
  // ---- language switch ----
  window.changeLang = function (sel) {
    const val = sel?.value;
    if (!val || location.pathname.endsWith(val)) return;
    document.body.classList.add("fade-out");
    const d = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380;
    setTimeout(() => (location.href = val), d);
    const LEGACY = {
  "/index-en.html": "/en.html",
  "/index-az.html": "/az.html",
  "/index-ka.html": "/ka.html",
  "/index-ua.html": "/ua.html"
};
val = LEGACY[val] || val;
  };

  // ---- build single modal once ----
  document.addEventListener("DOMContentLoaded", () => {
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

    const openModal = (label, apps) => {
      title.textContent = label || "Folder";
      grid.innerHTML = "";
      apps.forEach(a => grid.appendChild(a.cloneNode(true)));
      document.body.classList.add("folder-open");
      modal.classList.remove("closing");
      modal.classList.add("open");
      closeBtn.focus({ preventScroll: true });
    };

    const closeModal = () => {
      if (!modal.classList.contains("open")) return;
      modal.classList.add("closing");
      modal.classList.remove("open");
      // ждём конец CSS-перехода (резерв: 260мс)
      const done = () => {
        modal.classList.remove("closing");
        document.body.classList.remove("folder-open");
        panel.removeEventListener("transitionend", done);
      };
      panel.addEventListener("transitionend", done, { once: true });
      setTimeout(done, 260);
    };

    // attach handlers to all folders
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

    // close interactions
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    console.log("[site.js v10] modal ready");
  });
})();
