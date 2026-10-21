// Reading progress bar + "continue where you left off". Everything is stored in this browser only.
(function () {
  var KEY = "ml:prog:";
  function load(id) { try { return JSON.parse(localStorage.getItem(KEY + id)); } catch (e) { return null; } }
  function save(id, o) { try { localStorage.setItem(KEY + id, JSON.stringify(o)); } catch (e) {} }
  // small label for the article lists ("45% read" / "Read")
  window.progChip = function (id) {
    var s = load(id); if (!s || !(s.p > 0.03)) return "";
    return s.p >= 0.97 ? '<span class="chip read-chip done">Read ✓</span>' : '<span class="chip read-chip">' + Math.round(s.p * 100) + '% read</span>';
  };
  var started = null;
  window.initProgress = function (id, box) {
    if (!box) return;
    var bar = document.getElementById("readbar");
    if (!bar) { bar = document.createElement("div"); bar.id = "readbar"; bar.setAttribute("role", "progressbar"); bar.setAttribute("aria-label", "Reading progress"); document.body.appendChild(bar); }
    var geo = function () {
      var r = box.getBoundingClientRect(), top = r.top + scrollY, h = Math.max(r.height, 1), vh = innerHeight;
      return {top: top, h: h, vh: vh};
    };
    var calc = function () { var g = geo(); return Math.min(1, Math.max(0, (scrollY + g.vh - g.top) / g.h)); };
    var paint = function () { var p = calc(); bar.style.transform = "scaleX(" + p + ")"; bar.setAttribute("aria-valuenow", Math.round(p * 100)); return p; };
    var timer = null, best = 0;
    if (started === id) { paint(); return; }          // the page repainted (cache -> fresh): listeners already exist
    started = id;
    var prev = load(id); best = prev ? prev.p : 0;
    addEventListener("scroll", function () {
      var p = paint();
      clearTimeout(timer);
      timer = setTimeout(function () { if (p > best || p < best) { best = p; save(id, {p: p, t: Date.now()}); } }, 400);
    }, {passive: true});
    addEventListener("resize", paint);
    paint();
    // offer to jump back
    if (prev && prev.p > 0.03 && prev.p < 0.97 && scrollY < 80) {
      var t = document.createElement("div"); t.className = "resume-toast"; t.setAttribute("role", "status");
      t.innerHTML = '<span>Continue where you left off <b>(' + Math.round(prev.p * 100) + '%)</b>?</span><button type="button" class="go">Continue</button><button type="button" class="no">Start over</button>';
      document.body.appendChild(t);
      var close = function () { t.remove(); clearTimeout(auto); };
      t.querySelector(".go").onclick = function () {
        var g = geo(); scrollTo({top: Math.max(0, g.top + prev.p * g.h - g.vh), behavior: "smooth"}); close();
      };
      t.querySelector(".no").onclick = function () { save(id, {p: 0, t: Date.now()}); best = 0; close(); };
      var auto = setTimeout(close, 15000);
    }
  };
})();
