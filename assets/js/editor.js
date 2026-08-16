// editor.js — buffers, the explorer tree, the bufferline and the statusline.
//
// Everything here is reachable by mouse and by keyboard; keys.js drives the
// same functions the click handlers call, so the two paths can't drift.

import { TREE, allFiles, readFile, cachedFile } from './files.js';
import { renderMarkdown } from './markdown.js';
import { highlight } from './highlight.js';
import { icon, fileIcon } from './icons.js';
import { applyScheme, savedScheme, SCHEMES } from './colorschemes.js';

export const state = {
  buffers: [],        // [{ name, path, html, scroll }]
  active: -1,
  mode: 'NORMAL',
  explorerOpen: true,
  treeCursor: 0,      // index into the flattened visible tree
  scheme: savedScheme(),
  search: { term: '', hits: [], index: -1 },
};

export const el = {};

const BANNER = [
  '                          _____  _____   ___   _ ',
  ' _   _  ___    ___  _ __ |___ / |___ /  / _ \\ / |',
  "| | | |/ __|  / _ \\| '__|  |_ \\   |_ \\ | | | || |",
  '| |_| |\\__ \\ |  __/| |    ___) | ___) || |_| || |',
  ' \\__,_||___/  \\___||_|   |____/ |____/  \\___/ |_|',
].join('\n');

const DASH_ITEMS = [
  { key: 'f', icon: 'search', label: 'Find file', hint: '<Space>ff', act: 'picker:files' },
  { key: 'r', icon: 'markdown', label: 'Open README', hint: 'r', act: 'open:README.md' },
  { key: 'g', icon: 'terminal', label: 'Live grep', hint: '<Space>fg', act: 'picker:grep' },
  { key: 'c', icon: 'palette', label: 'Colorscheme', hint: '<Space>uc', act: 'picker:colorscheme' },
  { key: 'h', icon: 'book', label: 'Keymaps', hint: ':help', act: 'open:help' },
  { key: 'q', icon: 'github', label: 'GitHub', hint: '', act: 'url:https://github.com/user3301' },
];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── Boot ──────────────────────────────────────────────────────────────── */

export function mount() {
  el.app = document.getElementById('app');
  el.explorer = document.getElementById('explorer');
  el.tree = document.getElementById('tree');
  el.tabline = document.getElementById('tabline');
  el.buffer = document.getElementById('buffer');
  el.gutter = document.getElementById('gutter');
  el.status = document.getElementById('statusline');
  el.message = document.getElementById('message');
  el.scrim = document.getElementById('scrim');

  applyScheme(state.scheme);
  renderExplorer();
  renderTabline();
  bindStatusline();

  el.buffer.addEventListener('scroll', onScroll, { passive: true });
  el.scrim.addEventListener('click', () => toggleExplorer(false));

  // Internal markdown links open a buffer instead of navigating away.
  el.buffer.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-internal]');
    if (!a) return;
    e.preventDefault();
    const name = a.getAttribute('href').split('/').pop();
    openFile(name);
  });

  window.addEventListener('hashchange', openFromHash);
  window.addEventListener('resize', () => {
    syncExplorerToBreakpoint();
    requestAnimationFrame(renderGutter);
  });

  state.wasMobile = isMobile();
  state.explorerOpen = !state.wasMobile;
  applyExplorerState();
}

/* ── Explorer ──────────────────────────────────────────────────────────── */

/** Flatten the tree to the rows currently visible (collapsed dirs hidden). */
export function visibleRows(nodes = TREE, depth = 0, acc = []) {
  for (const n of nodes) {
    acc.push({ node: n, depth });
    if (n.type === 'dir' && n.open) visibleRows(n.children, depth + 1, acc);
  }
  return acc;
}

export function renderExplorer() {
  const rows = visibleRows();
  state.treeCursor = Math.max(0, Math.min(state.treeCursor, rows.length - 1));
  const activePath = state.buffers[state.active]?.path;

  el.tree.innerHTML = rows.map((r, i) => {
    const n = r.node;
    const isDir = n.type === 'dir';
    const ic = isDir
      ? { key: n.open ? 'folderOpen' : 'folder', color: 'var(--blue)' }
      : fileIcon(n.name);
    const classes = [
      'tree-row',
      isDir ? 'is-dir' : 'is-file',
      i === state.treeCursor ? 'cursor' : '',
      !isDir && n.path === activePath ? 'active' : '',
    ].filter(Boolean).join(' ');

    return (
      `<button type="button" class="${classes}" data-i="${i}" data-depth="${r.depth}"` +
        ` style="--depth:${r.depth}"` +
        (isDir ? ` aria-expanded="${n.open}"` : '') +
        ` title="${esc(n.desc || n.name)}">` +
        `<span class="tree-indent"></span>` +
        `<span class="tree-chevron">${icon('chevron')}</span>` +
        `<span class="tree-icon" style="color:${ic.color}">${icon(ic.key)}</span>` +
        `<span class="tree-name">${esc(n.name)}</span>` +
        (n.git ? `<span class="tree-git" data-status="${n.git}">${n.git}</span>` : '') +
      `</button>`
    );
  }).join('');

  for (const btn of el.tree.querySelectorAll('.tree-row')) {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      state.treeCursor = i;
      activateRow(i);
    });
  }
}

/** Open a file row, or toggle a directory row. */
export function activateRow(i = state.treeCursor) {
  const row = visibleRows()[i];
  if (!row) return;
  if (row.node.type === 'dir') {
    row.node.open = !row.node.open;
    renderExplorer();
  } else {
    openFile(row.node.name);
    if (isMobile()) toggleExplorer(false);
  }
}

export function moveTreeCursor(delta) {
  const rows = visibleRows();
  state.treeCursor = (state.treeCursor + delta + rows.length) % rows.length;
  renderExplorer();
  el.tree.querySelector('.tree-row.cursor')?.scrollIntoView({ block: 'nearest' });
}

export const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

/** Push `state.explorerOpen` onto the DOM for the current breakpoint. */
function applyExplorerState() {
  const open = state.explorerOpen;
  if (isMobile()) {
    el.explorer.classList.toggle('open', open);
    el.scrim.classList.toggle('open', open);
    el.app.classList.remove('no-explorer');
  } else {
    el.app.classList.toggle('no-explorer', !open);
    el.explorer.classList.remove('open');
    el.scrim.classList.remove('open');
  }
}

export function toggleExplorer(force) {
  state.explorerOpen = force ?? !state.explorerOpen;
  applyExplorerState();
  requestAnimationFrame(renderGutter);
}

/**
 * The drawer starts closed on mobile but the sidebar starts open on desktop,
 * so the flag has to be re-seeded whenever the breakpoint is crossed —
 * otherwise the first tap toggles a flag that already disagrees with what the
 * user can see, and nothing appears to happen.
 */
function syncExplorerToBreakpoint() {
  const mobile = isMobile();
  if (mobile === state.wasMobile) return;
  state.wasMobile = mobile;
  state.explorerOpen = !mobile;
  applyExplorerState();
}

/* ── Buffers ───────────────────────────────────────────────────────────── */

export async function openFile(name) {
  if (name === 'help') return openHelp();

  const file = allFiles().find((f) => f.name === name || f.path === name);
  if (!file) {
    message(`E484: Can't open file ${name}`, true);
    return;
  }

  const existing = state.buffers.findIndex((b) => b.path === file.path);
  if (existing !== -1) {
    setActive(existing);
    return;
  }

  let text;
  try {
    text = await readFile(file.path);
  } catch (err) {
    message(err.message, true);
    return;
  }

  const html = file.name.endsWith('.md')
    ? renderMarkdown(text)
    : `<div class="md-codeblock"><div class="md-codeblock-head" style="--lang-color:var(--purple)">` +
      `<span class="md-lang-dot"></span><span class="md-lang">Lua</span></div>` +
      `<pre class="md-pre"><code>${highlight(text, 'lua')}</code></pre></div>`;

  state.buffers.push({ name: file.name, path: file.path, html, scroll: 0 });
  setActive(state.buffers.length - 1);
}

export function openHelp() {
  const existing = state.buffers.findIndex((b) => b.path === ':help');
  if (existing !== -1) return setActive(existing);
  state.buffers.push({
    name: 'help.txt',
    path: ':help',
    html: renderMarkdown(HELP_DOC),
    scroll: 0,
  });
  setActive(state.buffers.length - 1);
}

export function setActive(i) {
  if (state.active === i && el.buffer.dataset.path === state.buffers[i]?.path) return;
  // Remember where we were in the outgoing buffer.
  if (state.buffers[state.active]) state.buffers[state.active].scroll = el.buffer.scrollTop;

  state.active = i;
  const buf = state.buffers[i];
  clearSearch();

  if (!buf) {
    renderDashboard();
  } else {
    el.buffer.classList.remove('is-dashboard');
    el.buffer.dataset.path = buf.path;
    el.buffer.innerHTML = `<div class="buffer-inner">${buf.html}</div>`;
    el.buffer.scrollTop = buf.scroll || 0;
    if (buf.path !== ':help') {
      history.replaceState(null, '', `#${buf.name}`);
    }
    document.title = `${buf.name} — user3301`;
  }

  renderTabline();
  renderExplorer();
  renderGutter();
  renderStatus();
}

export function closeBuffer(i = state.active) {
  if (!state.buffers[i]) return;
  state.buffers.splice(i, 1);
  const next = Math.min(i, state.buffers.length - 1);
  state.active = -1; // force setActive to re-render
  setActive(next);
  if (!state.buffers.length) history.replaceState(null, '', location.pathname);
}

export function cycleBuffer(delta) {
  if (state.buffers.length < 2) return;
  const n = state.buffers.length;
  setActive((state.active + delta + n) % n);
}

function renderDashboard() {
  el.buffer.dataset.path = '';
  el.buffer.classList.add('is-dashboard');
  document.title = 'user3301 — Senior Software Engineer';
  el.buffer.innerHTML =
    `<div class="dashboard">` +
      `<pre class="dash-art" aria-label="user3301">${esc(BANNER)}</pre>` +
      `<div class="dash-sub">Senior Software Engineer · Neovim · NixOS · UTC+10</div>` +
      `<div class="dash-keys">` +
        DASH_ITEMS.map((d) =>
          `<button type="button" class="dash-key" data-act="${d.act}">` +
            icon(d.icon) +
            `<span>${esc(d.label)}</span>` +
            `<span class="k">${esc(d.hint)}</span>` +
          `</button>`
        ).join('') +
      `</div>` +
      `<div class="dash-foot">All buffers closed · press <kbd>e</kbd> for the explorer</div>` +
    `</div>`;

  for (const btn of el.buffer.querySelectorAll('.dash-key')) {
    btn.addEventListener('click', () => runAction(btn.dataset.act));
  }
}

/** Dashboard and which-key both dispatch through here. */
export function runAction(act) {
  const [kind, arg] = [act.slice(0, act.indexOf(':')), act.slice(act.indexOf(':') + 1)];
  if (kind === 'open') openFile(arg);
  else if (kind === 'url') window.open(arg, '_blank', 'noopener');
  else if (kind === 'picker') document.dispatchEvent(new CustomEvent('nvim:picker', { detail: arg }));
  else if (kind === 'cmd') document.dispatchEvent(new CustomEvent('nvim:cmd', { detail: arg }));
}

/* ── Bufferline ────────────────────────────────────────────────────────── */

export function renderTabline() {
  const tabs = state.buffers.map((b, i) => {
    const ic = fileIcon(b.name);
    return (
      `<button type="button" class="tab${i === state.active ? ' active' : ''}" data-i="${i}">` +
        `<span class="tab-index">${i + 1}</span>` +
        `<span class="tree-icon" style="color:${ic.color}">${icon(ic.key)}</span>` +
        `<span class="tab-name">${esc(b.name)}</span>` +
        `<span class="tab-close" role="button" tabindex="-1" data-close="${i}"` +
          ` aria-label="Close ${esc(b.name)}">${icon('close')}</span>` +
      `</button>`
    );
  }).join('');

  el.tabline.innerHTML =
    tabs +
    `<span class="tabline-spacer"></span>` +
    `<span class="tabline-actions">` +
      `<button type="button" class="icon-btn mobile-only" data-act="explorer" aria-label="Toggle explorer">${icon('menu')}</button>` +
      `<button type="button" class="icon-btn" data-act="picker:files" aria-label="Find file">${icon('search')}</button>` +
      `<button type="button" class="icon-btn" data-act="picker:colorscheme" aria-label="Change colorscheme">${icon('palette')}</button>` +
      `<button type="button" class="icon-btn" data-act="open:help" aria-label="Keymaps">${icon('book')}</button>` +
    `</span>`;

  for (const tab of el.tabline.querySelectorAll('.tab')) {
    tab.addEventListener('click', (e) => {
      const close = e.target.closest('[data-close]');
      if (close) {
        e.stopPropagation();
        closeBuffer(Number(close.dataset.close));
        return;
      }
      setActive(Number(tab.dataset.i));
    });
    // Middle-click closes, as it does in bufferline.nvim.
    tab.addEventListener('auxclick', (e) => {
      if (e.button !== 1) return;
      e.preventDefault();
      closeBuffer(Number(tab.dataset.i));
    });
  }

  for (const btn of el.tabline.querySelectorAll('.icon-btn')) {
    btn.addEventListener('click', () => {
      if (btn.dataset.act === 'explorer') toggleExplorer();
      else runAction(btn.dataset.act);
    });
  }

  el.tabline.querySelector('.tab.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/* ── Gutter ────────────────────────────────────────────────────────────── */

const lineHeight = () => {
  const fs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs')) || 13.5;
  const lh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lh')) || 1.62;
  return fs * lh;
};

/**
 * Hybrid line numbers, the way `number` + `relativenumber` look together:
 * the cursor line shows its absolute number, every other line shows its
 * distance. The cursor sits a third of the way down the viewport and moves
 * with the scroll, so the numbers behave like a real buffer.
 */
export function renderGutter() {
  if (!el.gutter) return;
  if (!state.buffers[state.active]) {
    el.gutter.innerHTML = '';
    return;
  }

  const lh = lineHeight();
  const total = Math.max(1, Math.ceil(el.buffer.scrollHeight / lh));
  const first = Math.floor(el.buffer.scrollTop / lh);
  const visible = Math.ceil(el.buffer.clientHeight / lh) + 2;
  const cursor = Math.min(total - 1, first + Math.floor(visible / 3));

  let html = '';
  for (let n = first; n < Math.min(total, first + visible); n += 1) {
    const isCursor = n === cursor;
    const label = isCursor ? n + 1 : Math.abs(n - cursor);
    html += `<div class="gutter-num${isCursor ? ' current' : ''}">${label}</div>`;
  }
  el.gutter.innerHTML = html;
  el.gutter.style.paddingTop = `${14 + first * lh - el.buffer.scrollTop}px`;
  state.cursorLine = cursor + 1;
  state.totalLines = total;
}

let scrollQueued = false;
function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    renderGutter();
    renderStatus();
  });
}

/* ── Statusline ────────────────────────────────────────────────────────── */

function bindStatusline() {
  el.status.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (btn) runAction(btn.dataset.act);
  });
}

export function renderStatus() {
  const buf = state.buffers[state.active];
  const pct = (() => {
    const max = el.buffer.scrollHeight - el.buffer.clientHeight;
    if (max <= 2) return 'All';
    if (el.buffer.scrollTop < 2) return 'Top';
    if (el.buffer.scrollTop >= max - 2) return 'Bot';
    return `${Math.round((el.buffer.scrollTop / max) * 100)}%`;
  })();

  const ft = !buf ? 'dashboard'
    : buf.name.endsWith('.lua') ? 'lua'
    : buf.path === ':help' ? 'help' : 'markdown';

  el.status.innerHTML =
    `<span class="sl sl-mode">${state.mode}</span>` +
    `<button type="button" class="sl sl-branch" data-act="url:https://github.com/user3301/user3301.github.io"` +
      ` title="Open the repository">${icon('branch')}master</button>` +
    `<span class="sl sl-diag"><span class="sl-diag-e">${icon('error')}0</span>` +
      `<span class="sl-diag-w">${icon('warn')}0</span></span>` +
    `<span class="sl-spacer"></span>` +
    `<span class="sl sl-file">${esc(buf ? buf.name : '[No Name]')}</span>` +
    `<span class="sl sl-filetype">${ft}</span>` +
    `<button type="button" class="sl sl-scheme" data-act="picker:colorscheme"` +
      ` title="Change colorscheme">${icon('palette')}${state.scheme}</button>` +
    `<span class="sl sl-enc">utf-8</span>` +
    `<span class="sl sl-pos">${state.cursorLine || 1}:1</span>` +
    `<span class="sl sl-pct">${pct}</span>`;
}

export function setMode(mode) {
  state.mode = mode;
  document.body.dataset.mode = mode;
  renderStatus();
}

export function setScheme(name) {
  state.scheme = applyScheme(name);
  renderStatus();
  return state.scheme;
}

export function schemeNames() {
  return Object.keys(SCHEMES);
}

/* ── Messages ──────────────────────────────────────────────────────────── */

let messageTimer;
export function message(text, isError = false) {
  clearTimeout(messageTimer);
  el.message.textContent = text;
  el.message.classList.toggle('error', isError);
  el.message.classList.add('open');
  messageTimer = setTimeout(() => el.message.classList.remove('open'), 3200);
}

export function clearMessage() {
  clearTimeout(messageTimer);
  el.message.classList.remove('open');
}

/* ── Scrolling (keyboard) ──────────────────────────────────────────────── */

export function scrollBy(lines) {
  el.buffer.scrollBy({ top: lines * lineHeight(), behavior: 'auto' });
}
export function scrollTo(where) {
  el.buffer.scrollTo({
    top: where === 'top' ? 0 : el.buffer.scrollHeight,
    behavior: 'auto',
  });
}
export function halfPage(dir) {
  scrollBy((dir * el.buffer.clientHeight) / lineHeight() / 2);
}

/* ── In-buffer search ──────────────────────────────────────────────────── */

export function runSearch(term) {
  clearSearch();
  state.search.term = term;
  if (!term) return 0;

  const root = el.buffer.querySelector('.buffer-inner');
  if (!root) return 0;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue.trim() && n.parentElement.closest('script,style') === null
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });

  const needle = term.toLowerCase();
  const targets = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.toLowerCase().includes(needle)) targets.push(node);
  }

  for (const text of targets) {
    const frag = document.createDocumentFragment();
    const value = text.nodeValue;
    let from = 0;
    for (;;) {
      const at = value.toLowerCase().indexOf(needle, from);
      if (at === -1) break;
      frag.appendChild(document.createTextNode(value.slice(from, at)));
      const mark = document.createElement('mark');
      mark.className = 'search-hit';
      mark.textContent = value.slice(at, at + term.length);
      frag.appendChild(mark);
      from = at + term.length;
    }
    frag.appendChild(document.createTextNode(value.slice(from)));
    text.parentNode.replaceChild(frag, text);
  }

  state.search.hits = [...el.buffer.querySelectorAll('mark.search-hit')];
  if (state.search.hits.length) nextHit(0);
  return state.search.hits.length;
}

export function nextHit(delta = 1) {
  const { hits } = state.search;
  if (!hits.length) return;
  state.search.index = (state.search.index + delta + hits.length) % hits.length;
  hits.forEach((h, i) => h.classList.toggle('current', i === state.search.index));
  hits[state.search.index].scrollIntoView({ block: 'center', behavior: 'auto' });
}

export function clearSearch() {
  const root = el.buffer.querySelector('.buffer-inner');
  if (root) {
    for (const mark of root.querySelectorAll('mark.search-hit')) {
      mark.replaceWith(document.createTextNode(mark.textContent));
    }
    root.normalize();
  }
  state.search = { term: '', hits: [], index: -1 };
}

/* ── Deep links ────────────────────────────────────────────────────────── */

export function openFromHash() {
  const name = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!name) return false;
  const file = allFiles().find((f) => f.name === name);
  if (!file) return false;
  openFile(file.name);
  return true;
}

/* ── :help ─────────────────────────────────────────────────────────────── */

const HELP_DOC = `# Keymaps

Everything here also works with a mouse — click the tree, the tabs, the
statusline, or the buttons in the top right.

## Navigation

| Key | Action |
|---|---|
| \`j\` / \`k\` | Scroll down / up |
| \`<C-d>\` / \`<C-u>\` | Half page down / up |
| \`gg\` / \`G\` | Top / bottom of buffer |
| \`/\` | Search in buffer |
| \`n\` / \`N\` | Next / previous match |
| \`<Esc>\` | Clear search, close popups |

## Buffers

| Key | Action |
|---|---|
| \`1\` … \`9\` | Go to buffer by number |
| \`gt\` / \`gT\` | Next / previous buffer |
| \`<C-w>\` | Close current buffer |

## Explorer

| Key | Action |
|---|---|
| \`<Space>e\` | Toggle explorer |
| \`<C-j>\` / \`<C-k>\` | Move tree cursor |
| \`<CR>\` | Open file, or expand directory |

## Find

| Key | Action |
|---|---|
| \`<Space>ff\` | Find file |
| \`<Space>fg\` | Live grep |
| \`<Space>fb\` | Buffers |
| \`<Space>uc\` | Colorscheme |

## Commands

| Command | Action |
|---|---|
| \`:e {file}\` | Edit file |
| \`:q\` | Close buffer |
| \`:qa\` | Close all buffers |
| \`:bd\` | Delete buffer |
| \`:b {n}\` | Go to buffer n |
| \`:colorscheme {name}\` | Change theme |
| \`:help\` | This page |

> [!TIP]
> Press \`<Space>\` on its own to see the which-key popup.
`;
