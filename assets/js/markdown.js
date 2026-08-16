// markdown.js — markdown to HTML, styled the way render-markdown.nvim renders
// it in a buffer: heading bars, fenced blocks with a language chip, callouts,
// concealed list bullets, box-drawn tables.
//
// Output is semantic HTML (real h1/p/a/table) so screen readers and the
// no-JavaScript fallback both get something sensible.

import { highlight, langLabel } from './highlight.js';
import { icon } from './icons.js';

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;');

// A NUL byte, written as an escape so it stays visible in the source. It
// cannot appear in the markdown, so it is safe as a placeholder delimiter.
const SENTINEL = '\u0000';

// Assembled at runtime so the address never appears in the page source.
const EMAIL_B64 = 'emhlbHVuLmdhaUBnbWFpbC5jb20=';

function emailLink() {
  const addr = atob(EMAIL_B64);
  return `<a class="md-link" href="mailto:${addr}">${icon('mail', 'icon-inline')}${addr}</a>`;
}

/** Inline spans: code, links, emphasis. Code is extracted first so that
 *  emphasis markers inside a code span are left alone. */
function inline(src) {
  const codes = [];
  let s = src.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(code);
    return `${SENTINEL}${codes.length - 1}${SENTINEL}`;
  });

  s = esc(s);

  s = s
    .replace(/\{\{email\}\}/g, () => emailLink())
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
      (_, alt, src2) => `<img class="md-img" src="${src2}" alt="${alt}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      const external = /^https?:/.test(href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ' data-internal="1"';
      return `<a class="md-link" href="${href}"${attrs}>${text}</a>`;
    })
    .replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g,
      (_, href) => `<a class="md-link" href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="md-strong">$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:!?)]|$)/g, '$1<em class="md-em">$2</em>')
    .replace(/(^|[\s(])_([^_\n]+)_(?=[\s.,;:!?)]|$)/g, '$1<em class="md-em">$2</em>')
    .replace(/~~([^~]+)~~/g, '<del class="md-del">$1</del>');

  return s.replace(new RegExp(`${SENTINEL}(\\d+)${SENTINEL}`, 'g'),
    (_, i) => `<code class="md-code">${esc(codes[Number(i)])}</code>`);
}

const CALLOUTS = {
  NOTE: { color: 'var(--blue)', icon: 'info', label: 'Note' },
  TIP: { color: 'var(--green)', icon: 'hint', label: 'Tip' },
  IMPORTANT: { color: 'var(--purple)', icon: 'info', label: 'Important' },
  WARNING: { color: 'var(--yellow)', icon: 'warn', label: 'Warning' },
  CAUTION: { color: 'var(--red)', icon: 'error', label: 'Caution' },
};

function renderCodeBlock(lang, code) {
  const body = highlight(code.replace(/\n$/, ''), lang);
  // An undeclared fence gets no language chip, matching render-markdown.nvim.
  if (!lang) return `<div class="md-codeblock"><pre class="md-pre"><code>${body}</code></pre></div>`;

  const [label, color] = langLabel(lang);
  return (
    `<div class="md-codeblock">` +
      `<div class="md-codeblock-head" style="--lang-color:${color}">` +
        `<span class="md-lang-dot"></span><span class="md-lang">${esc(label)}</span>` +
      `</div>` +
      `<pre class="md-pre"><code>${body}</code></pre>` +
    `</div>`
  );
}

function renderTable(rows, aligns) {
  const cell = (tag, cells) =>
    cells.map((c, i) => {
      const a = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
      return `<${tag}${a}>${inline(c)}</${tag}>`;
    }).join('');

  const head = `<thead><tr>${cell('th', rows[0])}</tr></thead>`;
  const body = rows.slice(1)
    .map((r) => `<tr>${cell('td', r)}</tr>`).join('');
  return `<div class="md-table-wrap"><table class="md-table">${head}<tbody>${body}</tbody></table></div>`;
}

const splitRow = (line) =>
  line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());

/** A list item's marker glyph varies by depth, like render-markdown's bullets. */
const BULLET_CLASS = ['b-disc', 'b-circle', 'b-diamond', 'b-square'];

export function renderMarkdown(src) {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;

  const isBlank = (l) => !l || !l.trim();

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) { i += 1; continue; }

    // Fenced code block
    const fence = line.match(/^\s*```+\s*(\S+)?\s*$/);
    if (fence) {
      const lang = fence[1] === 'text' ? '' : (fence[1] || '');
      const buf = [];
      i += 1;
      while (i < lines.length && !/^\s*```+\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      out.push(renderCodeBlock(lang, buf.join('\n')));
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].replace(/\s+#+\s*$/, '');
      const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
      out.push(
        `<h${level} class="md-h md-h${level}" id="${id}">` +
          `<span class="md-h-hash" aria-hidden="true">${heading[1]}</span>` +
          `<span class="md-h-text">${inline(text)}</span>` +
        `</h${level}>`
      );
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
      out.push('<hr class="md-hr">');
      i += 1;
      continue;
    }

    // Blockquote / GitHub alert
    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''));
        i += 1;
      }
      const alert = buf[0]?.match(/^\[!(\w+)\]\s*$/);
      if (alert && CALLOUTS[alert[1].toUpperCase()]) {
        const c = CALLOUTS[alert[1].toUpperCase()];
        const body = renderMarkdown(buf.slice(1).join('\n'));
        out.push(
          `<div class="md-callout" style="--callout:${c.color}">` +
            `<div class="md-callout-head">${icon(c.icon, 'icon-inline')}<span>${c.label}</span></div>` +
            `<div class="md-callout-body">${body}</div>` +
          `</div>`
        );
      } else {
        out.push(`<blockquote class="md-quote">${renderMarkdown(buf.join('\n'))}</blockquote>`);
      }
      continue;
    }

    // Table: a pipe row followed by a delimiter row
    if (line.includes('|') && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1] || '')) {
      const aligns = splitRow(lines[i + 1]).map((c) => {
        const left = c.startsWith(':');
        const right = c.endsWith(':');
        if (left && right) return 'center';
        if (right) return 'right';
        return left ? 'left' : '';
      });
      const rows = [splitRow(line)];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && !isBlank(lines[i])) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      out.push(renderTable(rows, aligns));
      continue;
    }

    // Lists, including nesting by indent and GitHub task items
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const items = [];
      while (i < lines.length && !isBlank(lines[i])) {
        const m = lines[i].match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
        if (!m) {
          // Lazy continuation of the previous item.
          if (items.length) items[items.length - 1].text += ` ${lines[i].trim()}`;
          i += 1;
          continue;
        }
        items.push({
          depth: Math.floor(m[1].replace(/\t/g, '  ').length / 2),
          ordered: /\d/.test(m[2]),
          marker: m[2],
          text: m[3],
        });
        i += 1;
      }
      out.push(renderList(items));
      continue;
    }

    // Paragraph
    const buf = [];
    while (i < lines.length && !isBlank(lines[i])
           && !/^\s*(#{1,6}\s|```|>|([-*+]|\d+[.)])\s)/.test(lines[i])) {
      buf.push(lines[i].trim());
      i += 1;
    }
    if (buf.length) out.push(`<p class="md-p">${inline(buf.join(' '))}</p>`);
  }

  return out.join('\n');
}

/** Turn the flat item list into nested <ul>/<ol> by depth. */
function renderList(items, start = 0, depth = 0) {
  const ordered = items[start]?.ordered;
  const tag = ordered ? 'ol' : 'ul';
  let html = `<${tag} class="md-list md-list-d${Math.min(depth, 3)}">`;
  let i = start;

  while (i < items.length && items[i].depth >= depth) {
    if (items[i].depth > depth) {
      const nested = renderList(items, i, depth + 1);
      // Fold the sublist into the item above it. If this list opens on an
      // over-indented item there is nothing to fold into, so append instead
      // of silently dropping it.
      html = html.endsWith('</li>')
        ? `${html.slice(0, -'</li>'.length)}${nested}</li>`
        : html + nested;
      i = skipDeeper(items, i, depth);
      continue;
    }

    const it = items[i];
    const task = it.text.match(/^\[([ xX])\]\s+(.*)$/);
    if (task) {
      const done = task[1].toLowerCase() === 'x';
      html += `<li class="md-li md-task${done ? ' done' : ''}">` +
        `<span class="md-check" aria-hidden="true">${icon(done ? 'checkboxChecked' : 'checkbox', 'icon-inline')}</span>` +
        `<span class="md-li-text">${inline(task[2])}</span></li>`;
    } else {
      const bullet = ordered
        ? `<span class="md-num" aria-hidden="true">${esc(it.marker)}</span>`
        : `<span class="md-bullet ${BULLET_CLASS[Math.min(depth, 3)]}" aria-hidden="true"></span>`;
      html += `<li class="md-li">${bullet}<span class="md-li-text">${inline(it.text)}</span></li>`;
    }
    i += 1;
  }

  return `${html}</${tag}>`;
}

function skipDeeper(items, from, depth) {
  let i = from;
  while (i < items.length && items[i].depth > depth) i += 1;
  return i;
}
