// icons.js — inline SVG, drawn on a 24×24 grid.
//
// Nerd Font devicons are the authentic choice here, but they mean shipping a
// multi-megabyte font and showing tofu to anyone who doesn't have it. These
// render everywhere and inherit colour from the filetype class.

const PATHS = {
  file: `<path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 2.5V7a.5.5 0 0 0 .5.5H19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,

  markdown: `<rect x="1.6" y="5" width="20.8" height="14" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.6 16V8.4h2.5l2.5 3.1 2.5-3.1h2.5V16h-2.5v-4l-2.5 3.1L7.1 12v4z" fill="currentColor"/><path d="M17.7 8.4h2.1v3.9h1.9l-2.95 3.9-2.95-3.9h1.9z" fill="currentColor"/>`,

  lua: `<circle cx="10.5" cy="13" r="7.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="13.6" cy="9.9" r="1.9" fill="currentColor"/><circle cx="19.4" cy="5.2" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/>`,

  folder: `<path d="M2.8 19.2V5.6a1 1 0 0 1 1-1h4.9l2 2.4h9.5a1 1 0 0 1 1 1v11.2a1 1 0 0 1-1 1H3.8a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,

  folderOpen: `<path d="M2.8 19.2V5.6a1 1 0 0 1 1-1h4.9l2 2.4h9.5a1 1 0 0 1 1 1v2.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M2.8 19.2l2.4-8a1 1 0 0 1 .96-.7h15.1a1 1 0 0 1 .96 1.3l-2.1 7a1 1 0 0 1-.96.7H3.8a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,

  chevron: `<path d="M9 5.5l7 6.5-7 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,

  close: `<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,

  branch: `<circle cx="7" cy="5.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="7" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7 8v8M17 11.5c0 3.5-3 4.2-6 4.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`,

  search: `<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 15.5L21 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,

  error: `<circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 7v6" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.2" fill="var(--bg)"/>`,

  warn: `<path d="M12 3.2l9.5 16.4h-19z" fill="currentColor"/><path d="M12 9.2v5" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.15" fill="var(--bg)"/>`,

  info: `<circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 11v6" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1.2" fill="var(--bg)"/>`,

  hint: `<circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M9.6 10a2.4 2.4 0 1 1 2.9 2.4v1.4" stroke="var(--bg)" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="12.4" cy="16.6" r="1.1" fill="var(--bg)"/>`,

  link: `<path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.5 1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.5-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,

  checkbox: `<rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>`,

  checkboxChecked: `<rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="currentColor"/><path d="M7.5 12.2l3.2 3.2 5.8-6.2" fill="none" stroke="var(--bg)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>`,

  menu: `<path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>`,

  terminal: `<rect x="2.5" y="4" width="19" height="16" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 9l3 3-3 3M12.5 15.2h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`,

  palette: `<path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.7 0-.8.7-1.5 1.6-1.5h1.7a4.7 4.7 0 0 0 4.7-4.7c0-4-4-7-8.8-7z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.6" cy="11.4" r="1.4" fill="currentColor"/><circle cx="11" cy="7.4" r="1.4" fill="currentColor"/><circle cx="15.8" cy="8.4" r="1.4" fill="currentColor"/>`,

  book: `<path d="M3.5 5.2a1 1 0 0 1 1.2-1c2 .3 4.9.9 7.3 2.3 2.4-1.4 5.3-2 7.3-2.3a1 1 0 0 1 1.2 1v12.4a1 1 0 0 1-.85 1c-1.9.3-4.5.9-6.6 2.1a2 2 0 0 1-2.1 0c-2.1-1.2-4.7-1.8-6.6-2.1a1 1 0 0 1-.85-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6.5v13.6" fill="none" stroke="currentColor" stroke-width="1.6"/>`,

  buffers: `<rect x="2.5" y="6.5" width="13" height="13" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 4.5h11a2 2 0 0 1 2 2v11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,

  keyboard: `<rect x="1.8" y="5.5" width="20.4" height="13" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.6 9.4h.02M9 9.4h.02M12.4 9.4h.02M15.8 9.4h.02M18.4 9.4h.02M5.6 12.6h.02M9 12.6h.02M12.4 12.6h.02M15.8 12.6h.02M18.4 12.6h.02" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><path d="M7.6 15.6h8.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>`,

  github: `<path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.68-.21.68-.47v-1.8c-2.77.6-3.35-1.19-3.35-1.19-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.09.63-1.34-2.21-.25-4.54-1.11-4.54-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.56 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A9.8 9.8 0 0 0 12 2.2z" fill="currentColor"/>`,

  linkedin: `<path d="M4.5 3h15A1.5 1.5 0 0 1 21 4.5v15A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7.6 10.4v7M7.6 7.1v.02M11.4 17.4v-7M11.4 13.2c0-1.6.9-2.6 2.4-2.6s2.4 1 2.4 2.8v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,

  mail: `<rect x="2.5" y="4.8" width="19" height="14.4" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.2 6.6l8.8 6 8.8-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`,
};

/** Map a filename to an icon key and a palette colour token. */
export function fileIcon(name) {
  if (name.endsWith('.md')) return { key: 'markdown', color: 'var(--blue)' };
  if (name.endsWith('.lua')) return { key: 'lua', color: 'var(--purple)' };
  if (name.endsWith('.nix')) return { key: 'file', color: 'var(--cyan)' };
  if (name.endsWith('.json')) return { key: 'file', color: 'var(--yellow)' };
  if (name.endsWith('.go')) return { key: 'file', color: 'var(--cyan)' };
  return { key: 'file', color: 'var(--fg-dim)' };
}

/**
 * Build an <svg> string. `cls` lands on the element so CSS can size it;
 * every icon inherits `currentColor`, so colour comes from the parent.
 */
export function icon(key, cls = '') {
  const body = PATHS[key];
  if (!body) return '';
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}

export { PATHS };
