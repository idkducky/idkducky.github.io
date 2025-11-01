// v6 — simple & reliable: language switch + smooth accordion

function changeLang(sel){
  const val = sel.value; if(!val) return;
  // absolute links expected: /index.html, /en.html, ...
  document.body.classList.add('fade-out');
  const d = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
  setTimeout(()=>{ location.href = val; }, d);
}

document.addEventListener('DOMContentLoaded', () => {
  // smooth accordion for details elements
  document.querySelectorAll('.cc-folder').forEach(det => {
    const content = det.querySelector('.content');
    if(!content) return;
    // start state
    if(det.open){ content.style.maxHeight = content.scrollHeight + 'px'; }
    else { content.style.maxHeight = '0'; content.style.overflow = 'hidden'; }
    // animate on toggle
    det.addEventListener('toggle', () => {
      content.style.overflow = 'hidden';
      if(det.open){
        content.style.maxHeight = content.scrollHeight + 'px';
        // after transition ends keep auto height for responsiveness
        const onEnd = () => { content.style.maxHeight = 'none'; content.removeEventListener('transitionend', onEnd); };
        content.addEventListener('transitionend', onEnd);
      } else {
        // set current height then force to 0 for smooth collapse
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(()=>{ content.style.maxHeight = '0'; });
      }
    });
    // ensure transition style
    content.style.transition = 'max-height .35s ease';
  });

  console.log('[site.js v6] ready');
});
