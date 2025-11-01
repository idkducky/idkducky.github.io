// ===== site.js =====

// Автоматический редирект по языку браузера (только на главной)
function autoRedirectIfNeeded() {
  if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('/index.html')) return;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('en')) window.location.href = '/en.html';
  else if (lang.startsWith('az')) window.location.href = '/az.html';
  else if (lang.startsWith('ka')) window.location.href = '/ka.html';
  else window.location.href = '/index.html';
}

// Добавляем анимацию открытия мини-папок
document.addEventListener('DOMContentLoaded', () => {
  const folders = document.querySelectorAll('.cc-folder');
  folders.forEach(folder => {
    folder.addEventListener('toggle', () => {
      const content = folder.querySelector('.content');
      if (!content) return;
      if (folder.open) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // Добавляем плавное раскрытие
  const css = document.createElement('style');
  css.textContent = `
    .cc-folder .content {
      overflow: hidden;
      transition: max-height 0.35s ease;
    }
  `;
  document.head.appendChild(css);

  // Проверка загрузки CSS/JS (диагностика)
  console.log('%c[site.js] assets подключены успешно', 'color:#06b6d4; font-weight:bold;');
});

// Кнопка смены языка (если решишь добавить её внизу страницы)
function switchLang(lang) {
  const current = window.location.pathname;
  if (current.includes('en.html') && lang === 'ru') window.location.href = '/index.html';
  else if (current.includes('az.html') && lang === 'ru') window.location.href = '/index.html';
  else if (current.includes('ka.html') && lang === 'ru') window.location.href = '/index.html';
  else if (!current.includes(`${lang}.html`)) window.location.href = `/${lang}.html`;
}
