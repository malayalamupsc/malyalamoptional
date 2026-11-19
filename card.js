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

// ---- Collections inside collections (shared by index.html and admin.html) ----
// A collection whose parent_id is missing, empty or points at a deleted collection counts as top level.
function folderParent(folders, f) { return f.parent_id && folders.find(x => x.id === f.parent_id && x.id !== f.id) || null; }
function folderChildren(folders, id) { return folders.filter(f => f.parent_id === id && f.id !== id); }
function folderTop(folders) { return folders.filter(f => !folderParent(folders, f)); }
// This collection plus everything nested under it, at any depth (safe even if bad data forms a loop).
function folderTree(folders, id) {
  const seen = new Set([id]), stack = [id];
  while (stack.length) folderChildren(folders, stack.pop()).forEach(c => { if (!seen.has(c.id)) { seen.add(c.id); stack.push(c.id); } });
  return seen;
}
// Parent chain, outermost first: [grandparent, parent, folder]
function folderChain(folders, f) {
  const out = [f], seen = new Set([f.id]);
  for (let p = folderParent(folders, f); p && !seen.has(p.id); p = folderParent(folders, p)) { out.unshift(p); seen.add(p.id); }
  return out;
}
function folderPathName(folders, f) { return folderChain(folders, f).map(x => x.name).join(" › "); }
