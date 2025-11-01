// site.js v9 — iOS-style folders with smooth open/close
document.addEventListener("DOMContentLoaded", () => {
  const folders = document.querySelectorAll(".cc-folder");
  const modal = document.createElement("div");
  modal.className = "folder-modal";
  modal.innerHTML = `
    <div class="folder-panel">
      <div class="folder-header">
        <span class="folder-title"></span>
        <button class="folder-close" aria-label="Закрыть">×</button>
      </div>
      <div class="folder-grid"></div>
    </div>`;
  document.body.appendChild(modal);

  const panel = modal.querySelector(".folder-panel");
  const grid = modal.querySelector(".folder-grid");
  const title = modal.querySelector(".folder-title");
  const closeBtn = modal.querySelector(".folder-close");

  const openModal = (label, apps) => {
    title.textContent = label;
    grid.innerHTML = "";
    apps.forEach(a => grid.appendChild(a.cloneNode(true)));
    document.body.classList.add("folder-open");
    modal.style.display = "flex";
    requestAnimationFrame(() => modal.classList.add("open"));
  };

  const closeModal = () => {
    modal.classList.remove("open");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.classList.remove("folder-open");
    }, 250);
  };

  folders.forEach(folder => {
    folder.querySelector("summary").addEventListener("click", e => {
      e.preventDefault();
      const label = folder.querySelector(".label").textContent;
      const apps = folder.querySelectorAll(".app");
      openModal(label, apps);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
  console.log("[site.js v9] iOS modal smooth OK");
});

// смена языка
function changeLang(sel) {
  const val = sel.value;
  if (!val || location.pathname.endsWith(val)) return;
  document.body.classList.add("fade-out");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 400;
  setTimeout(() => (location.href = val), delay);
}
