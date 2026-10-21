// Full screen. Browsers never allow a page to go full screen on its own at load (same as pressing F11),
// so this enters full screen on the visitor's first click, tap or key press. A header button toggles it,
// and exiting (Esc or the button) turns auto full screen off until the button is pressed again.
(function () {
  var KEY = "ml-fullscreen", de = document.documentElement;
  var can = de.requestFullscreen || de.webkitRequestFullscreen;
  if (!can) return;                                   // e.g. iPhone Safari
  var isFs = function () { return !!(document.fullscreenElement || document.webkitFullscreenElement); };
  var pref = function () { try { return localStorage.getItem(KEY) !== "off"; } catch (e) { return true; } };
  var setPref = function (v) { try { localStorage.setItem(KEY, v ? "on" : "off"); } catch (e) {} };
  function enter() {
    var p = (de.requestFullscreen || de.webkitRequestFullscreen).call(de);
    if (p && p.catch) p.catch(function () {});
  }
  function leave() { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }

  var armed = pref();
  function onFirst(e) {
    if (e.type === "keydown" && e.key === "Escape") return;
    if (e.target.closest && e.target.closest(".fs-btn")) return;   // the button handles itself
    if (armed && pref() && !isFs()) enter();
    remove();
  }
  var evs = ["pointerdown", "keydown", "touchend"];
  function remove() { evs.forEach(function (n) { document.removeEventListener(n, onFirst, true); }); }
  evs.forEach(function (n) { document.addEventListener(n, onFirst, true); });

  var btn;
  function paint() {
    if (!btn) return;
    var on = isFs();
    btn.setAttribute("aria-pressed", on);
    btn.title = btn.ariaLabel = on ? "Exit full screen" : "Full screen";
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (on ? '<path d="M9 3v4a2 2 0 0 1-2 2H3M21 9h-4a2 2 0 0 1-2-2V3M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4"/>'
          : '<path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4"/>') + '</svg>';
  }
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (n) {
    document.addEventListener(n, function () { if (!isFs() && btn && btn.dataset.entered) setPref(false); if (isFs() && btn) btn.dataset.entered = "1"; paint(); });
  });
  document.addEventListener("DOMContentLoaded", function () {
    var top = document.querySelector("header.top"); if (!top) return;
    btn = document.createElement("button"); btn.type = "button"; btn.className = "fs-btn";
    btn.onclick = function () { if (isFs()) leave(); else { setPref(true); enter(); } };
    top.appendChild(btn); paint();
  });
})();
