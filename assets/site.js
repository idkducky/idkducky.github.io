// v7 — restored folder toggling + working translations
function changeLang(sel) {
  const val = sel.value;
  if (!val) return;
  document.body.classList.add("fade-out");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
  setTimeout(() => (location.href = val), delay);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cc-folder").forEach(det => {
    const content = det.querySelector(".content");
    if (!content) return;

    // начальные параметры
    content.style.overflow = "hidden";
    content.style.transition = "max-height .35s ease";
    if (det.open) content.style.maxHeight = content.scrollHeight + "px";
    else content.style.maxHeight = "0";

    det.addEventListener("toggle", () => {
      if (det.open) {
        content.style.maxHeight = content.scrollHeight + "px";
        const onEnd = () => {
          content.style.maxHeight = "none";
          content.removeEventListener("transitionend", onEnd);
        };
        content.addEventListener("transitionend", onEnd);
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        requestAnimationFrame(() => {
          content.style.maxHeight = "0";
        });
      }
    });
  });

  console.log("[site.js v7] toggles fixed");
});
