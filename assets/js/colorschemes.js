// colorschemes.js — palettes ported from the real Neovim themes.
//
// Every scheme fills the same semantic token set, which the stylesheet consumes
// as CSS custom properties. Syntax colours are derived from the accents in
// applyScheme() so a new theme only needs its palette, not a highlight table.

export const SCHEMES = {
  'tokyonight-night': {
    light: false,
    bg: '#1a1b26', bgDark: '#16161e', bgFloat: '#16161e', bgAlt: '#1f2335',
    bgHl: '#292e42', bgSel: '#2e3c64',
    fg: '#c0caf5', fgDim: '#a9b1d6', fgGutter: '#3b4261', fgNum: '#737aa2',
    border: '#2f3549', comment: '#565f89',
    blue: '#7aa2f7', cyan: '#7dcfff', green: '#9ece6a', yellow: '#e0af68',
    orange: '#ff9e64', red: '#f7768e', purple: '#bb9af7', pink: '#c0a3e8',
    teal: '#1abc9c',
  },

  'tokyonight-storm': {
    light: false,
    bg: '#24283b', bgDark: '#1f2335', bgFloat: '#1f2335', bgAlt: '#1f2335',
    bgHl: '#292e42', bgSel: '#2e3c64',
    fg: '#c0caf5', fgDim: '#a9b1d6', fgGutter: '#3b4261', fgNum: '#737aa2',
    border: '#3b4261', comment: '#565f89',
    blue: '#7aa2f7', cyan: '#7dcfff', green: '#9ece6a', yellow: '#e0af68',
    orange: '#ff9e64', red: '#f7768e', purple: '#bb9af7', pink: '#c0a3e8',
    teal: '#1abc9c',
  },

  'tokyonight-day': {
    light: true,
    bg: '#e1e2e7', bgDark: '#d4d6e4', bgFloat: '#d4d6e4', bgAlt: '#d9dbe6',
    bgHl: '#c4c8da', bgSel: '#b7c1e3',
    fg: '#3760bf', fgDim: '#6172b0', fgGutter: '#a8aecb', fgNum: '#7086b5',
    border: '#a8aecb', comment: '#848cb5',
    blue: '#2e7de9', cyan: '#007197', green: '#587539', yellow: '#8c6c3e',
    orange: '#b15c00', red: '#f52a65', purple: '#9854f1', pink: '#7847bd',
    teal: '#118c74',
  },

  'catppuccin-mocha': {
    light: false,
    bg: '#1e1e2e', bgDark: '#181825', bgFloat: '#181825', bgAlt: '#181825',
    bgHl: '#313244', bgSel: '#45475a',
    fg: '#cdd6f4', fgDim: '#bac2de', fgGutter: '#45475a', fgNum: '#7f849c',
    border: '#45475a', comment: '#6c7086',
    blue: '#89b4fa', cyan: '#89dceb', green: '#a6e3a1', yellow: '#f9e2af',
    orange: '#fab387', red: '#f38ba8', purple: '#cba6f7', pink: '#f5c2e7',
    teal: '#94e2d5',
  },

  'catppuccin-latte': {
    light: true,
    bg: '#eff1f5', bgDark: '#e6e9ef', bgFloat: '#e6e9ef', bgAlt: '#e6e9ef',
    bgHl: '#dce0e8', bgSel: '#bcc0cc',
    fg: '#4c4f69', fgDim: '#5c5f77', fgGutter: '#bcc0cc', fgNum: '#8c8fa1',
    border: '#bcc0cc', comment: '#8c8fa1',
    blue: '#1e66f5', cyan: '#04a5e5', green: '#40a02b', yellow: '#df8e1d',
    orange: '#fe640b', red: '#d20f39', purple: '#8839ef', pink: '#ea76cb',
    teal: '#179299',
  },

  'gruvbox-dark': {
    light: false,
    bg: '#282828', bgDark: '#1d2021', bgFloat: '#1d2021', bgAlt: '#32302f',
    bgHl: '#3c3836', bgSel: '#504945',
    fg: '#ebdbb2', fgDim: '#d5c4a1', fgGutter: '#504945', fgNum: '#7c6f64',
    border: '#504945', comment: '#928374',
    blue: '#83a598', cyan: '#8ec07c', green: '#b8bb26', yellow: '#fabd2f',
    orange: '#fe8019', red: '#fb4934', purple: '#d3869b', pink: '#d3869b',
    teal: '#689d6a',
  },

  'gruvbox-light': {
    light: true,
    bg: '#fbf1c7', bgDark: '#f2e5bc', bgFloat: '#f2e5bc', bgAlt: '#f2e5bc',
    bgHl: '#ebdbb2', bgSel: '#d5c4a1',
    fg: '#3c3836', fgDim: '#504945', fgGutter: '#bdae93', fgNum: '#a89984',
    border: '#bdae93', comment: '#928374',
    blue: '#076678', cyan: '#427b58', green: '#79740e', yellow: '#b57614',
    orange: '#af3a03', red: '#9d0006', purple: '#8f3f71', pink: '#8f3f71',
    teal: '#427b58',
  },

  'kanagawa-wave': {
    light: false,
    bg: '#1f1f28', bgDark: '#16161d', bgFloat: '#16161d', bgAlt: '#2a2a37',
    bgHl: '#2a2a37', bgSel: '#363646',
    fg: '#dcd7ba', fgDim: '#c8c093', fgGutter: '#54546d', fgNum: '#727169',
    border: '#54546d', comment: '#727169',
    blue: '#7e9cd8', cyan: '#7fb4ca', green: '#98bb6c', yellow: '#e6c384',
    orange: '#ffa066', red: '#ff5d62', purple: '#957fb8', pink: '#d27e99',
    teal: '#7aa89f',
  },

  'rose-pine': {
    light: false,
    bg: '#191724', bgDark: '#1f1d2e', bgFloat: '#1f1d2e', bgAlt: '#1f1d2e',
    bgHl: '#26233a', bgSel: '#403d52',
    fg: '#e0def4', fgDim: '#908caa', fgGutter: '#403d52', fgNum: '#6e6a86',
    border: '#403d52', comment: '#6e6a86',
    blue: '#9ccfd8', cyan: '#9ccfd8', green: '#31748f', yellow: '#f6c177',
    orange: '#ebbcba', red: '#eb6f92', purple: '#c4a7e7', pink: '#ebbcba',
    teal: '#31748f',
  },

  'nord': {
    light: false,
    bg: '#2e3440', bgDark: '#292e39', bgFloat: '#3b4252', bgAlt: '#3b4252',
    bgHl: '#3b4252', bgSel: '#434c5e',
    fg: '#d8dee9', fgDim: '#c0c8d4', fgGutter: '#4c566a', fgNum: '#6b7794',
    border: '#4c566a', comment: '#7b88a1',
    blue: '#81a1c1', cyan: '#88c0d0', green: '#a3be8c', yellow: '#ebcb8b',
    orange: '#d08770', red: '#bf616a', purple: '#b48ead', pink: '#b48ead',
    teal: '#8fbcbb',
  },
};

export const SCHEME_NAMES = Object.keys(SCHEMES);
export const DEFAULT_SCHEME = 'gruvbox-dark';
export const DEFAULT_LIGHT_SCHEME = 'gruvbox-light';
const STORAGE_KEY = 'nvim-colorscheme';

/** Blend `hex` toward `to` by `amount` (0..1). Used for derived tints. */
function mix(hex, to, amount) {
  const parse = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(to);
  const c = (a, b) => Math.round(a + (b - a) * amount);
  return `rgb(${c(r1, r2)} ${c(g1, g2)} ${c(b1, b2)})`;
}

/** Same, but returns an rgba() so it can sit over any background. */
function alpha(hex, a) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function applyScheme(name) {
  const scheme = SCHEMES[name] ? name : DEFAULT_SCHEME;
  const p = SCHEMES[scheme];
  const root = document.documentElement;
  const set = (k, v) => root.style.setProperty(k, v);

  set('--bg', p.bg);
  set('--bg-dark', p.bgDark);
  set('--bg-float', p.bgFloat);
  set('--bg-alt', p.bgAlt);
  set('--bg-hl', p.bgHl);
  set('--bg-sel', p.bgSel);
  set('--fg', p.fg);
  set('--fg-dim', p.fgDim);
  set('--fg-gutter', p.fgGutter);
  set('--fg-num', p.fgNum);
  set('--border', p.border);
  set('--comment', p.comment);

  for (const key of ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'purple', 'pink', 'teal']) {
    set(`--${key}`, p[key]);
  }

  set('--accent', p.blue);

  // Statusline mode colours, matching lualine's defaults.
  set('--mode-normal', p.blue);
  set('--mode-insert', p.green);
  set('--mode-visual', p.purple);
  set('--mode-command', p.yellow);
  set('--mode-replace', p.red);

  // Syntax roles, derived so new palettes need no highlight table.
  set('--syn-keyword', p.purple);
  set('--syn-string', p.green);
  set('--syn-number', p.orange);
  set('--syn-function', p.blue);
  set('--syn-type', p.yellow);
  set('--syn-constant', p.orange);
  set('--syn-operator', p.cyan);
  set('--syn-property', p.cyan);
  set('--syn-comment', p.comment);
  set('--syn-punct', p.fgDim);

  // Heading backgrounds: the accent barely tinted into the editor background,
  // which is what render-markdown.nvim does for its heading bars.
  const headingColors = [p.blue, p.purple, p.green, p.orange, p.cyan, p.red];
  headingColors.forEach((c, i) => {
    set(`--h${i + 1}`, c);
    set(`--h${i + 1}-bg`, alpha(c, p.light ? 0.14 : 0.11));
  });

  set('--shadow', p.light ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0.45)');
  set('--overlay', p.light ? 'rgba(0, 0, 0, 0.22)' : 'rgba(0, 0, 0, 0.45)');
  set('--cursor-fg', p.bg);
  set('--search-bg', alpha(p.yellow, 0.35));
  set('--search-cur-bg', p.orange);
  set('--diff-add', alpha(p.green, 0.16));
  set('--diff-del', alpha(p.red, 0.16));
  set('--indent-guide', mix(p.bg, p.fg, 0.14));

  root.dataset.colorscheme = scheme;
  root.style.colorScheme = p.light ? 'light' : 'dark';

  // Keep the browser UI (address bar on mobile) in step with the theme.
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = p.bgDark;

  try {
    localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // Private browsing — the theme just won't persist.
  }
  return scheme;
}

export function savedScheme() {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Ignore; fall through to the default.
  }
  if (stored && SCHEMES[stored]) return stored;

  // No stored preference: respect the OS light/dark setting, staying within
  // the default theme's own family rather than jumping to another palette.
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefersLight ? DEFAULT_LIGHT_SCHEME : DEFAULT_SCHEME;
}
