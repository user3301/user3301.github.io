// picker.js — the snacks.nvim picker: prompt on top, fuzzy-matched list on the
// left, live preview on the right. Sources are files, grep, buffers and
// colorschemes.

import { allFiles, cachedFile } from './files.js';
import { icon, fileIcon } from './icons.js';
import {
  state, openFile, setActive, setScheme, schemeNames, message,
} from './editor.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let el = {};
let items = [];
let filtered = [];
let sel = 0;
let source = 'files';
let previousScheme = null;

export function initPicker() {
  el = {
    root: document.getElementById('picker'),
    overlay: document.getElementById('overlay'),
    title: document.getElementById('picker-title'),
    input: document.getElementById('picker-input'),
    list: document.getElementById('picker-list'),
    count: document.getElementById('picker-count'),
    preview: document.getElementById('picker-preview'),
  };

  el.input.addEventListener('input', () => {
    applyFilter();
    // Colorschemes preview live, the way :colorscheme does with wildmenu.
    if (source === 'colorscheme' && filtered[sel]) setScheme(filtered[sel].value);
  });
  el.input.addEventListener('keydown', onKey);
  el.overlay.addEventListener('click', () => close(true));
  document.addEventListener('nvim:picker', (e) => open(e.detail));
}

/**
 * Subsequence match, scored the way fuzzy finders rank: earlier matches and
 * consecutive runs win. Returns null when the pattern doesn't match at all.
 */
function fuzzy(text, pattern) {
  if (!pattern) return { score: 0, hits: [] };
  const lower = text.toLowerCase();
  const pat = pattern.toLowerCase();
  const hits = [];
  let ti = 0;
  let score = 0;
  let streak = 0;

  for (const ch of pat) {
    const at = lower.indexOf(ch, ti);
    if (at === -1) return null;
    hits.push(at);
    streak = at === ti && ti !== 0 ? streak + 1 : 0;
    score += streak * 4 - at * 0.4;
    if (at === 0 || /[\s/._-]/.test(lower[at - 1])) score += 8; // word boundary
    ti = at + 1;
  }
  return { score: score - text.length * 0.05, hits };
}

function markHits(text, hits) {
  if (!hits?.length) return esc(text);
  const set = new Set(hits);
  return [...text]
    .map((ch, i) => (set.has(i) ? `<span class="m">${esc(ch)}</span>` : esc(ch)))
    .join('');
}

/* ── Sources ───────────────────────────────────────────────────────────── */

function buildItems(kind) {
  if (kind === 'files') {
    return allFiles().map((f) => ({
      label: f.name,
      sub: f.desc || f.path,
      value: f.name,
      iconKey: fileIcon(f.name).key,
      color: fileIcon(f.name).color,
      preview: () => cachedFile(f.path).slice(0, 4000),
      run: () => openFile(f.name),
    }));
  }

  if (kind === 'buffers') {
    return state.buffers.map((b, i) => ({
      label: b.name,
      sub: `buffer ${i + 1}`,
      value: b.name,
      iconKey: fileIcon(b.name).key,
      color: fileIcon(b.name).color,
      preview: () => cachedFile(b.path).slice(0, 4000),
      run: () => setActive(i),
    }));
  }

  if (kind === 'colorscheme') {
    return schemeNames().map((name) => ({
      label: name,
      sub: name.includes('day') || name.includes('latte') || name.includes('light')
        ? 'light' : 'dark',
      value: name,
      iconKey: 'palette',
      color: 'var(--purple)',
      preview: () => `:colorscheme ${name}\n\nApplied live — press <CR> to keep it,\n<Esc> to revert.`,
      run: () => {
        setScheme(name);
        previousScheme = null;
        message(`colorscheme ${name}`);
      },
    }));
  }

  // Grep: one entry per matching line across every cached file.
  const out = [];
  for (const f of allFiles()) {
    const text = cachedFile(f.path);
    text.split('\n').forEach((line, n) => {
      if (!line.trim()) return;
      out.push({
        label: line.trim().slice(0, 120),
        sub: `${f.name}:${n + 1}`,
        value: f.name,
        iconKey: fileIcon(f.name).key,
        color: fileIcon(f.name).color,
        searchText: line,
        preview: () => contextAround(text, n),
        run: () => openFile(f.name),
      });
    });
  }
  return out;
}

function contextAround(text, line) {
  const lines = text.split('\n');
  const from = Math.max(0, line - 6);
  return lines.slice(from, line + 9)
    .map((l, i) => `${String(from + i + 1).padStart(4)} ${l}`)
    .join('\n');
}

/* ── Filtering + render ────────────────────────────────────────────────── */

function applyFilter() {
  const q = el.input.value.trim();
  // Grep matches against the line body; everything else against the label.
  const scored = [];
  for (const it of items) {
    const target = source === 'grep' ? (it.searchText || it.label) : it.label;
    const m = fuzzy(target, q);
    if (m) scored.push({ ...it, score: m.score, hits: q ? m.hits : [] });
  }
  if (q) scored.sort((a, b) => b.score - a.score);
  filtered = scored.slice(0, 200);
  sel = 0;
  render();
}

function render() {
  el.count.textContent = `${filtered.length}/${items.length}`;

  if (!filtered.length) {
    el.list.innerHTML = '<div class="picker-empty">No results</div>';
    el.preview.innerHTML = '';
    return;
  }

  el.list.innerHTML = filtered.map((it, i) => {
    const body = source === 'grep'
      ? `<span class="tree-name">${markHits(it.label, it.hits)}</span>` +
        `<span class="picker-sub">${esc(it.sub)}</span>`
      : `<span class="tree-name">${markHits(it.label, it.hits)}</span>` +
        `<span class="picker-sub">${esc(it.sub)}</span>`;
    return (
      `<div class="picker-item${i === sel ? ' sel' : ''}" data-i="${i}">` +
        `<span class="tree-icon" style="color:${it.color}">${icon(it.iconKey)}</span>` +
        body +
      `</div>`
    );
  }).join('');

  for (const node of el.list.querySelectorAll('.picker-item')) {
    node.addEventListener('click', () => {
      sel = Number(node.dataset.i);
      confirm();
    });
    node.addEventListener('mousemove', () => {
      const i = Number(node.dataset.i);
      if (i === sel) return;
      sel = i;
      highlight();
      renderPreview();
    });
  }
  renderPreview();
}

function highlight() {
  for (const node of el.list.querySelectorAll('.picker-item')) {
    node.classList.toggle('sel', Number(node.dataset.i) === sel);
  }
  el.list.querySelector('.picker-item.sel')?.scrollIntoView({ block: 'nearest' });
}

function renderPreview() {
  const it = filtered[sel];
  if (!it) return;
  el.preview.innerHTML =
    `<div class="picker-preview-head">${esc(it.sub || it.label)}</div>` +
    `<pre class="md-pre" style="padding:0">${esc(it.preview ? it.preview() : '')}</pre>`;
}

/* ── Open / close / confirm ────────────────────────────────────────────── */

const TITLES = {
  files: 'Files', grep: 'Grep', buffers: 'Buffers', colorscheme: 'Colorschemes',
};

export function open(kind = 'files') {
  source = kind;
  items = buildItems(kind);
  previousScheme = kind === 'colorscheme' ? state.scheme : null;

  el.title.textContent = TITLES[kind] || kind;
  el.input.value = '';
  el.root.classList.add('open');
  el.overlay.classList.add('open');
  applyFilter();
  el.input.focus();
}

export function close(revert = false) {
  // Escaping the colorscheme picker puts the old theme back, like Neovim does.
  if (revert && source === 'colorscheme' && previousScheme) setScheme(previousScheme);
  previousScheme = null;
  el.root.classList.remove('open');
  el.overlay.classList.remove('open');
  el.input.blur();
}

export const isOpen = () => el.root?.classList.contains('open');

function confirm() {
  const it = filtered[sel];
  if (!it) return close();
  previousScheme = null;
  close();
  it.run();
}

function move(delta) {
  if (!filtered.length) return;
  sel = (sel + delta + filtered.length) % filtered.length;
  highlight();
  renderPreview();
  if (source === 'colorscheme') setScheme(filtered[sel].value);
}

function onKey(e) {
  const ctrl = e.ctrlKey || e.metaKey;
  if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
  if (e.key === 'Enter') { e.preventDefault(); confirm(); return; }
  if (e.key === 'ArrowDown' || (ctrl && e.key === 'n') || (ctrl && e.key === 'j')) {
    e.preventDefault(); move(1); return;
  }
  if (e.key === 'ArrowUp' || (ctrl && e.key === 'p') || (ctrl && e.key === 'k')) {
    e.preventDefault(); move(-1); return;
  }
  e.stopPropagation(); // let the input keep ordinary typing
}
