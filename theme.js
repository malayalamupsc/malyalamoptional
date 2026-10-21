// Theme switcher: Day (light), Dark, Eye protection (warm, low blue light).
// Runs in <head> so the saved theme is applied before the page paints (no flash).
(function () {
  var KEY = "ml-theme", THEMES = ["light", "dark", "eye"], root = document.documentElement;
  function saved() { try { var v = localStorage.getItem(KEY); return THEMES.indexOf(v) > -1 ? v : null; } catch (e) { return null; } }
  function system() { return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
  function apply(t) {
    root.setAttribute("data-theme", t);
    root.style.colorScheme = t === "dark" ? "dark" : "light";
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m && document.head) { m = document.createElement("meta"); m.name = "theme-color"; document.head.appendChild(m); }
    if (m) m.content = t === "dark" ? "#1C2826" : t === "eye" ? "#F4ECD8" : "#FDFCFA";
    var bs = document.querySelectorAll(".theme-switch button");
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-pressed", bs[i].dataset.t === t);
  }
  apply(saved() || "dark");   // Dark is the default until a visitor picks another theme
  var ICON = {
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
  }, LABEL = {light: "Day theme", dark: "Dark theme", eye: "Eye protection theme"};
  document.addEventListener("DOMContentLoaded", function () {
    var top = document.querySelector("header.top"); if (!top) return;
    var box = document.createElement("div"); box.className = "theme-switch"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Theme");
    box.innerHTML = THEMES.map(function (t) {
      return '<button type="button" data-t="' + t + '" title="' + LABEL[t] + '" aria-label="' + LABEL[t] + '"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[t] + '</svg></button>';
    }).join("");
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      try { localStorage.setItem(KEY, b.dataset.t); } catch (x) {}
      apply(b.dataset.t);
    });
    top.appendChild(box); apply(root.getAttribute("data-theme"));
  });
})();
