// main.js — entry point.

import { mount, openFile, openFromHash, renderGutter, renderStatus, message } from './editor.js';
import { initKeys } from './keys.js';
import { initPicker } from './picker.js';
import { preloadAll } from './files.js';

async function boot() {
  mount();
  initPicker();
  initKeys();

  // A deep link wins; otherwise land on the README so visitors see content
  // immediately rather than an empty dashboard.
  if (!openFromHash()) await openFile('README.md');

  renderGutter();
  renderStatus();

  // Grep needs every file in memory. Do it after first paint so it never
  // delays the content the visitor actually came for.
  preloadAll().catch(() => message('Some files failed to preload', true));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
