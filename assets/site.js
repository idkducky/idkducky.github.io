// Плавное исчезновение при смене языка
function changeLang(sel) {
  const val = sel.value; if (!val) return;
  document.body.classList.add('fade-out');
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
  setTimeout(() => { location.href = val; }, delay);
}

// Автоопределение языка — вызываем ТОЛЬКО на главной (RU)
function autoRedirectIfNeeded() {
  const p = new URLSearchParams(location.search);
  const f = (p.get('lang') || '').toLowerCase();
  if (f === 'en') return location.replace('en.html');
  if (f === 'az') return location.replace('az.html');
  if (f === 'ka' || f === 'ge') return location.replace('ka.html');

  if (!f) {
    const lng = (navigator.language || '').toLowerCase();
    if (lng.startsWith('en')) return location.replace('en.html');
    if (lng.startsWith('az')) return location.replace('az.html');
    if (lng.startsWith('ka')) return location.replace('ka.html');
  }
}
