// keys.js — the modal keymap engine: normal-mode motions, `/` search, the `:`
// command line with completion, and the which-key popup.
//
// Every binding calls the same function the equivalent click handler calls.

import {
  state, el, openFile, openHelp, closeBuffer, cycleBuffer, setActive,
  toggleExplorer, moveTreeCursor, activateRow, scrollBy, scrollTo, halfPage,
  runSearch, nextHit, clearSearch, message, clearMessage, setMode, setScheme,
  schemeNames, runAction, renderStatus,
} from './editor.js';
import { allFiles } from './files.js';
import * as picker from './picker.js';

let cmd = {};
let wk = {};
let pending = '';        // multi-key sequence in flight, e.g. "g" of "gg"
let pendingTimer = null;
let leader = false;      // a <Space> sequence is in progress
let searching = false;   // the `/` prompt is open rather than `:`

/* ── which-key ─────────────────────────────────────────────────────────── */

const WK_ROOT = [
  { key: 'f', group: '+find' },
  { key: 'u', group: '+ui' },
  { key: 'e', label: 'Explorer', act: 'cmd:explorer' },
  { key: 'h', label: 'Keymaps', act: 'open:help' },
  { key: 'g', label: 'GitHub', act: 'url:https://github.com/user3301' },
  { key: 'l', label: 'LinkedIn', act: 'url:https://linkedin.com/in/user3301' },
];

const WK_GROUPS = {
  f: [
    { key: 'f', label: 'Find file', act: 'picker:files' },
    { key: 'g', label: 'Live grep', act: 'picker:grep' },
    { key: 'b', label: 'Buffers', act: 'picker:buffers' },
    { key: 'h', label: 'Help', act: 'open:help' },
  ],
  u: [
    { key: 'c', label: 'Colorscheme', act: 'picker:colorscheme' },
  ],
};

function showWhichKey(prefix = '') {
  const list = prefix ? WK_GROUPS[prefix] : WK_ROOT;
  if (!list) return hideWhichKey();

  wk.title.textContent = prefix ? `<Space>${prefix}` : '<Space>';
  wk.grid.innerHTML = list.map((it) =>
    `<button type="button" class="wk-item" data-key="${it.key}"` +
      `${it.act ? ` data-act="${it.act}"` : ''}>` +
      `<span class="wk-key">${it.key}</span>` +
      `<span class="wk-sep">-&gt;</span>` +
      `<span class="${it.group ? 'wk-group' : ''}">${it.group || it.label}</span>` +
    `</button>`
  ).join('');

  for (const btn of wk.grid.querySelectorAll('.wk-item')) {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (btn.dataset.act) {
        hideWhichKey();
        leader = false;
        pending = '';
        runAction(btn.dataset.act);
      } else {
        setPending(key, { timeout: false });
        showWhichKey(key);
      }
    });
  }
  wk.root.classList.add('open');
}

function hideWhichKey() {
  wk.root?.classList.remove('open');
}

/* ── Command line ──────────────────────────────────────────────────────── */

const COMMANDS = ['q', 'qa', 'e', 'bd', 'b', 'bn', 'bp', 'colorscheme', 'help', 'Explore', 'w'];

function openCmdline(prefix) {
  searching = prefix === '/';
  cmd.prompt.textContent = prefix;
  cmd.input.value = '';
  cmd.ghost.textContent = '';
  cmd.root.classList.add('open');
  cmd.input.focus();
  setMode(searching ? 'NORMAL' : 'COMMAND');
}

function closeCmdline() {
  cmd.root.classList.remove('open');
  cmd.input.blur();
  cmd.ghost.textContent = '';
  setMode('NORMAL');
}

/** Ghost text completion for `:` — the first command or argument that matches. */
function updateGhost() {
  if (searching) { cmd.ghost.textContent = ''; return; }
  const value = cmd.input.value;
  const candidates = completionsFor(value);
  const last = value.split(/\s+/).pop();
  const hit = candidates.find((c) => c.startsWith(last) && c !== last);
  cmd.ghost.textContent = hit && last ? hit.slice(last.length) : '';
}

function completionsFor(value) {
  const parts = value.split(/\s+/);
  if (parts.length <= 1) return COMMANDS;
  const verb = parts[0];
  if (verb === 'colorscheme' || verb === 'colo') return schemeNames();
  if (verb === 'e' || verb === 'edit') return allFiles().map((f) => f.name);
  if (verb === 'b') return state.buffers.map((_, i) => String(i + 1));
  return [];
}

function completeCmdline() {
  const value = cmd.input.value;
  const parts = value.split(/\s+/);
  const last = parts.pop();
  const hit = completionsFor(value).find((c) => c.startsWith(last) && c !== last);
  if (!hit) return;
  cmd.input.value = [...parts, hit].join(' ');
  updateGhost();
}

function runCommand(raw) {
  const line = raw.trim().replace(/^:/, '');
  if (!line) return;
  const [verb, ...rest] = line.split(/\s+/);
  const arg = rest.join(' ');

  switch (verb) {
    case 'q': case 'q!': case 'bd': case 'bdelete':
      if (!state.buffers.length) message('E444: Cannot close last window');
      else closeBuffer();
      break;
    case 'qa': case 'qa!': case 'quitall':
      while (state.buffers.length) closeBuffer(0);
      break;
    case 'e': case 'edit': {
      if (!arg) return message('E32: No file name', true);
      const file = allFiles().find((f) => f.name === arg || f.name.startsWith(arg));
      if (file) openFile(file.name);
      else message(`E484: Can't open file ${arg}`, true);
      break;
    }
    case 'b': case 'buffer': {
      const n = Number(arg);
      if (state.buffers[n - 1]) setActive(n - 1);
      else message(`E86: Buffer ${arg} does not exist`, true);
      break;
    }
    case 'bn': case 'bnext': cycleBuffer(1); break;
    case 'bp': case 'bprev': case 'bprevious': cycleBuffer(-1); break;
    case 'colo': case 'colorscheme':
      if (!arg) { picker.open('colorscheme'); break; }
      if (schemeNames().includes(arg)) {
        setScheme(arg);
        message(`colorscheme ${arg}`);
      } else {
        message(`E185: Cannot find color scheme '${arg}'`, true);
      }
      break;
    case 'help': case 'h': openHelp(); break;
    case 'Explore': case 'Ex': toggleExplorer(true); break;
    case 'w': case 'write':
      message("E45: 'readonly' option is set (add ! to override)", true);
      break;
    default:
      message(`E492: Not an editor command: ${verb}`, true);
  }
}

/* ── Normal mode ───────────────────────────────────────────────────────── */

/**
 * Hold a partial key sequence. Plain sequences like `g` time out the way
 * vim's `timeoutlen` does, but once the which-key popup is on screen it stays
 * until you press a key, hit Escape, or click away — which is how
 * which-key.nvim behaves. `timeoutlen` there gates how long before the popup
 * appears, not how long it lives.
 */
function setPending(key, { timeout = true } = {}) {
  pending = key;
  clearTimeout(pendingTimer);
  if (!timeout) return;
  pendingTimer = setTimeout(() => { pending = ''; hideWhichKey(); leader = false; }, 1400);
}

function clearPending() {
  pending = '';
  leader = false;
  clearTimeout(pendingTimer);
  hideWhichKey();
}

function onKeydown(e) {
  // Never steal keys from a real input, and never from browser shortcuts.
  const target = e.target;
  if (target.matches?.('input, textarea, [contenteditable]')) return;
  if (e.altKey || e.metaKey) return;

  const key = e.key;
  const ctrl = e.ctrlKey;

  if (key === 'Escape') {
    clearPending();
    clearSearch();
    clearMessage();
    if (picker.isOpen()) picker.close(true);
    return;
  }

  if (picker.isOpen()) return; // the picker input owns the keyboard

  // ── leader sequences ──
  if (leader) {
    e.preventDefault();
    if (WK_GROUPS[pending]) {
      const hit = WK_GROUPS[pending].find((i) => i.key === key);
      clearPending();
      if (hit) runAction(hit.act);
      return;
    }
    const root = WK_ROOT.find((i) => i.key === key);
    if (root?.group) { setPending(key, { timeout: false }); showWhichKey(key); return; }
    if (root?.act) {
      clearPending();
      if (root.act === 'cmd:explorer') toggleExplorer();
      else runAction(root.act);
      return;
    }
    clearPending();
    return;
  }

  if (key === ' ' && !ctrl) {
    e.preventDefault();
    leader = true;
    setPending('', { timeout: false });
    showWhichKey();
    return;
  }

  // ── multi-key sequences ──
  if (pending === 'g') {
    e.preventDefault();
    clearPending();
    if (key === 'g') scrollTo('top');
    else if (key === 't') cycleBuffer(1);
    else if (key === 'T') cycleBuffer(-1);
    return;
  }

  // ── ctrl bindings ──
  if (ctrl) {
    if (key === 'd') { e.preventDefault(); halfPage(1); return; }
    if (key === 'u') { e.preventDefault(); halfPage(-1); return; }
    if (key === 'j') { e.preventDefault(); moveTreeCursor(1); return; }
    if (key === 'k') { e.preventDefault(); moveTreeCursor(-1); return; }
    if (key === 'w') { e.preventDefault(); closeBuffer(); return; }
    return; // leave every other Ctrl combo to the browser
  }

  // ── single keys ──
  switch (key) {
    case 'j': e.preventDefault(); scrollBy(3); break;
    case 'k': e.preventDefault(); scrollBy(-3); break;
    case 'g': e.preventDefault(); setPending('g'); break;
    case 'G': e.preventDefault(); scrollTo('bottom'); break;
    case 'n': e.preventDefault(); nextHit(1); break;
    case 'N': e.preventDefault(); nextHit(-1); break;
    case 'e': e.preventDefault(); toggleExplorer(); break;
    case 'r': if (!state.buffers.length) { e.preventDefault(); openFile('README.md'); } break;
    case '/': e.preventDefault(); openCmdline('/'); break;
    case ':': e.preventDefault(); openCmdline(':'); break;
    case 'Enter': {
      if (document.activeElement?.closest?.('#tree')) return; // buttons handle it
      e.preventDefault();
      activateRow();
      break;
    }
    default:
      if (/^[1-9]$/.test(key)) {
        e.preventDefault();
        const i = Number(key) - 1;
        if (state.buffers[i]) setActive(i);
      }
  }
}

/* ── Wiring ────────────────────────────────────────────────────────────── */

export function initKeys() {
  cmd = {
    root: document.getElementById('cmdline'),
    prompt: document.getElementById('cmdline-prompt'),
    input: document.getElementById('cmdline-input'),
    ghost: document.getElementById('cmdline-ghost'),
  };
  wk = {
    root: document.getElementById('whichkey'),
    title: document.getElementById('whichkey-title'),
    grid: document.getElementById('whichkey-grid'),
  };

  cmd.input.addEventListener('input', () => {
    updateGhost();
    // `/` searches as you type, like `incsearch`.
    if (searching) {
      const n = runSearch(cmd.input.value);
      if (cmd.input.value && !n) message(`E486: Pattern not found: ${cmd.input.value}`, true);
      else clearMessage();
    }
  });

  cmd.input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      e.preventDefault();
      if (searching) clearSearch();
      closeCmdline();
      return;
    }
    if (e.key === 'Tab') { e.preventDefault(); completeCmdline(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = cmd.input.value;
      closeCmdline();
      if (searching) {
        if (state.search.hits.length) message(`/${value}  [${state.search.hits.length} matches]`);
      } else {
        runCommand(value);
      }
    }
  });

  // The popup no longer times out, so clicking away is how you dismiss it
  // without choosing something. Escape works too, via onKeydown.
  document.addEventListener('mousedown', (e) => {
    if (!wk.root.classList.contains('open')) return;
    if (e.target.closest('#whichkey')) return;
    clearPending();
  });

  document.addEventListener('keydown', onKeydown);
  document.addEventListener('nvim:cmd', (e) => {
    if (e.detail === 'explorer') toggleExplorer();
  });

  setMode('NORMAL');
  renderStatus();
}
