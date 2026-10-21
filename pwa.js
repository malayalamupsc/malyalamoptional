// Registers the app, and adds an "Install app" button to the header when the browser allows it.
(function () {
  if ("serviceWorker" in navigator) addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  var standalone = matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches || navigator.standalone;
  var evt = null, btn = null;
  function show() { if (btn && evt && !standalone) btn.hidden = false; }
  addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); evt = e; show(); });
  addEventListener("appinstalled", function () { evt = null; if (btn) btn.hidden = true; });
  document.addEventListener("DOMContentLoaded", function () {
    var top = document.querySelector("header.top"); if (!top || standalone) return;
    btn = document.createElement("button"); btn.type = "button"; btn.className = "install-btn"; btn.hidden = true;
    btn.textContent = "Install app";
    btn.onclick = function () { if (!evt) return; evt.prompt(); evt.userChoice.then(function () { evt = null; btn.hidden = true; }); };
    top.appendChild(btn); show();
  });
})();
