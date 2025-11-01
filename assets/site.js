// v5 — overlay-папки «поверх себя» + плавная смена языка

function changeLang(sel) {
  const val = sel.value; if (!val) return;
  document.body.classList.add('fade-out');
  const d = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
  setTimeout(() => { location.href = val; }, d);
}

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация «папок»
  document.querySelectorAll('.cc-folder').forEach(folder => {
    const summary = folder.querySelector('summary');
    const content = folder.querySelector('.content');

    if (!summary || !content) return;

    // 1) Гасим стандартный toggle <details>, используем кастом-оверлей
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Переключаем режим поверх себя
      const isOpen = folder.classList.toggle('open-overlay');
      // Лёгкая страховка фокуса/скролла
      if (isOpen) {
        // ставим фокус на контент, чтобы ESC работал
        content.setAttribute('tabindex', '-1');
        content.focus({ preventScroll: true });
      }
    });

    // 2) Кнопка закрытия (добавляем, если нет)
    if (!content.querySelector('.cc-close')) {
      const btn = document.createElement('button');
      btn.className = 'cc-close';
      btn.setAttribute('aria-label', 'Close');
      btn.innerText = '×';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        folder.classList.remove('open-overlay');
      });
      content.appendChild(btn);
    }

    // 3) Закрытие по ESC
    content.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        folder.classList.remove('open-overlay');
      }
    });

    // 4) Клик вне контента — закрыть (только внутри карточки)
    folder.addEventListener('click', (e) => {
      if (!folder.classList.contains('open-overlay')) return;
      const inside = content.contains(e.target) || summary.contains(e.target);
      if (!inside) folder.classList.remove('open-overlay');
    });
  });

  console.log('[site.js] overlay folders ready');
});
