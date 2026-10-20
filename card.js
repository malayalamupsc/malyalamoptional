// Shared by index.html and admin.html: builds a collection card.
// Needs esc() and sb from config.js (load this file after config.js).
function cardImgUrl(path) { return path ? sb.storage.from("docx").getPublicUrl(path).data.publicUrl : null; }
function cardHtml(o) {
  const tag = o.href ? "a" : "div";
  return '<' + tag + ' class="cc"' + (o.href ? ' href="' + esc(o.href) + '"' : '') + '>' +
    '<div class="cc-img">' + (o.img ? '<img src="' + esc(o.img) + '" alt="" loading="lazy">' : '<div class="cc-ph"><img src="favicon.png" alt=""></div>') +
    (o.badge ? '<span class="cc-badge">' + esc(o.badge) + '</span>' : '') + '</div>' +
    '<div class="cc-body"><h3 class="cc-title">' + esc(o.title || "Card title") + '</h3>' +
    (o.desc ? '<p class="cc-desc">' + esc(o.desc) + '</p>' : '') +
    '<span class="cc-btn">' + esc(o.btn || "Explore") +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span></div></' + tag + '>';
}
