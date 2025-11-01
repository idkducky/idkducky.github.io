(function () {
  var MAP = {
    "/index-en.html": "/en.html",
    "/index-az.html": "/az.html",
    "/index-ka.html": "/ka.html",
    "/index-ua.html": "/ua.html"
  };
  var p = (location.pathname.replace(/\/+$/, "") || "/index.html");
  if (MAP[p]) {
    location.replace(MAP[p] + location.search + location.hash);
  }
})();

window.changeLang = function (sel) {
  if (!sel) return;
  var val = sel.value;
  if (!val) return;

  var LEGACY = {
    "/index-en.html": "/en.html",
    "/index-az.html": "/az.html",
    "/index-ka.html": "/ka.html",
    "/index-ua.html": "/ua.html"
  };
  if (LEGACY[val]) val = LEGACY[val];

  var current = (location.pathname.replace(/\/+$/, "") || "/index.html");
  if (val === current) return;

  document.body.classList.add("fade-out");
  var d = (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) ? 0 : 380;
  setTimeout(function(){ location.href = val; }, d);
};

document.addEventListener("DOMContentLoaded", function () {
  function sanitizeApps(root) {
    var scope = root || document;
    var apps = scope.querySelectorAll ? scope.querySelectorAll(".app") : [];
    for (var i = 0; i < apps.length; i++) {
      var a = apps[i];

      var nodes = a.childNodes;
      var rm = [];
      for (var j = 0; j < nodes.length; j++) {
        var n = nodes[j];
        if (n.nodeType === 3 && n.nodeValue && n.nodeValue.replace(/\s+/g,"").length) {
          rm.push(n);
        }
      }
      for (var r = 0; r < rm.length; r++) a.removeChild(rm[r]);

      var labels = a.querySelectorAll ? a.querySelectorAll("span.t") : [];
      for (var k = 1; k < labels.length; k++) {
        var extra = labels[k];
        if (extra && extra.parentNode) extra.parentNode.removeChild(extra);
      }
    }
  }

  var sel = document.querySelector('select[onchange^="changeLang"]');
  if (sel) {
    var current = (location.pathname.replace(/\/+$/, "") || "/index.html");
    var valueToSet = current === "/" ? "/index.html" : current;
    for (var i=0;i<sel.options.length;i++){
      if (sel.options[i].value === valueToSet){ sel.value = valueToSet; break; }
    }
  }

  var modal = document.createElement("div");
  modal.className = "folder-modal";

  var panel = document.createElement("div");
  panel.className = "folder-panel";

  var header = document.createElement("div");
  header.className = "folder-header";

  var title = document.createElement("span");
  title.className = "folder-title";
  header.appendChild(title);

  var closeBtn = document.createElement("button");
  closeBtn.className = "folder-close";
  closeBtn.setAttribute("aria-label","Close");
  closeBtn.appendChild(document.createTextNode("×"));
  header.appendChild(closeBtn);

  var grid = document.createElement("div");
  grid.className = "folder-grid";

  panel.appendChild(header);
  panel.appendChild(grid);
  modal.appendChild(panel);
  document.body.appendChild(modal);

  function openModal(label, apps){
    title.textContent = label || "Folder";
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    for (var i=0;i<apps.length;i++){
      var clone = apps[i].cloneNode(true);
      grid.appendChild(clone);
    }
    sanitizeApps(grid);

    document.body.classList.add("folder-open");
    modal.classList.remove("closing");
    modal.classList.add("open");
    try { closeBtn.focus(); } catch(e){}
  }

  function closeModal(){
    if (!modal.classList.contains("open")) return;
    modal.classList.add("closing");
    modal.classList.remove("open");
    var done = function(){
      modal.classList.remove("closing");
      document.body.classList.remove("folder-open");
      panel.removeEventListener("transitionend", done);
    };
    panel.addEventListener("transitionend", done);
    setTimeout(done, 300);
  }

  sanitizeApps(document);

  document.addEventListener("click", function(e){
    var node = e.target;

    var n = node;
    while (n) {
      if (n.tagName === "A") return;
      if (n.classList && n.classList.contains("apps")) return;
      n = n.parentNode;
    }

    var el = node;
    while (el && !(el.classList && el.classList.contains("cc-folder"))) {
      el = el.parentNode;
    }
    if (!el) return;

    var lblEl = el.querySelector(".label");
    var label = lblEl ? (lblEl.textContent || lblEl.innerText) : "Folder";
    var appsNodeList = el.querySelectorAll(".app");
    var apps = [];
    for (var i2=0;i2<appsNodeList.length;i2++) apps.push(appsNodeList[i2]);

    if (e && e.preventDefault) e.preventDefault();
    openModal(label, apps);
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function(e){ if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function(e){
    e = e || window.event;
    if (e.key === "Escape" || e.keyCode === 27){
      if (modal.classList.contains("open")) closeModal();
    }
  });

  (function(){
    var mq = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")) || null;
    function setThemeMeta(){
      var dark = mq && mq.matches;
      var meta = document.querySelector('meta[name="theme-color"]');
      if (!meta){
        meta = document.createElement("meta");
        meta.setAttribute("name","theme-color");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", dark ? "#101010" : "#ffffff");
    }
    setThemeMeta();
    if (mq && mq.addListener) mq.addListener(setThemeMeta);
  })();

  if (window.console && console.log) console.log("[site.js v14] ready (delegated + sanitized, ES5)");
});
