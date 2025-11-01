// v8 — iOS-style overlay folders + перевод с fade-out

// Переключение языка
function changeLang(sel) {
  const val = sel.value;
  if (!val || location.pathname.endsWith(val)) return;
  document.body.classList.add("fade-out");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
  setTimeout(() => (location.href = val), delay);
}

document.addEventListener("DOMContentLoaded", () => {
  // Создаём один общий оверлей для всех папок
  const modal = document.createElement("div");
  modal.className = "folder-modal";
  modal.innerHTML = `
    <div class="folder-panel" role="dialog" aria-modal="true" aria-labelledby="folder-title">
      <button class="folder-close" aria-label="Close">×</button>
      <div id="folder-title" class="folder-title"></div>
      <div class="folder-grid"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector(".folder-close");
  const titleEl  = modal.querySelector(".folder-title");
  const gridEl   = modal.querySelector(".folder-grid");

  function openFolder(folderEl) {
    // название берём из подписи под папкой
    const label = folderEl.querySelector(".label")?.textContent?.trim() || "Folder";
    const apps  = folderEl.querySelector(".apps")?.innerHTML || "";

    titleEl.textContent = label;
    gridEl.innerHTML = apps;

    document.body.classList.add("folder-open");
    closeBtn.focus({ preventScroll: true });
  }

  function closeFolder() {
    document.body.classList.remove("folder-open");
    // чистим сетку после закрытия (мелкая гигиена)
    setTimeout(() => { gridEl.innerHTML = ""; }, 200);
  }

  // Клик по summary → открываем модалку (а не <details>)
  document.querySelectorAll(".cc-folder").forEach(folder => {
    const summary = folder.querySelector("summary");
    if (!summary) return;
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openFolder(folder);
    });
  });

  // Закрытия
  closeBtn.addEventListener("click", () => closeFolder());
  modal.addEventListener("click", (e) => { if (e.target === modal) closeFolder(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeFolder(); });

  console.log("[site.js v8] iOS-like overlay folders ready");
});

// Экспортируем в глобал, чтобы select мог вызвать
window.changeLang = changeLang;
