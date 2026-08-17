# user3301.github.io

Personal website: [www.user3301.com](https://www.user3301.com)

A Neovim-shaped portfolio. Content lives in real markdown files, opened as
buffers in a browser-side editor with a snacks.nvim-style file explorer,
bufferline, lualine statusline, fuzzy picker, which-key popup and a `:` command
line. Everything is reachable by keyboard *and* by mouse.

## Running it

No build step, no dependencies. ES modules need a real origin, so use a server
rather than opening `index.html` from disk:

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000
```

Deploying is `git push` — GitHub Pages serves the repository as-is.

## Editing content

Every page is a markdown file in `content/`. To add one:

1. Write `content/whatever.md`
2. Add an entry to `TREE` in `assets/js/files.js`

The renderer supports GitHub-flavoured tables, task lists, alert callouts
(`> [!NOTE]`), and fenced code with syntax highlighting. `{{email}}` expands to
a mailto link assembled in the browser, so the address never sits in the page
source.

## Layout

```
index.html                  shell + no-JavaScript fallback
content/*.md                all page content
assets/css/nvim.css         editor chrome and markdown styling
assets/js/
  main.js                   entry point
  editor.js                 buffers, explorer, bufferline, statusline
  keys.js                   modal keymaps, : command line, which-key
  picker.js                 snacks-style fuzzy picker
  markdown.js               markdown -> HTML
  highlight.js              syntax highlighting
  colorschemes.js           10 Neovim palettes
  files.js                  the virtual file tree
  icons.js                  inline SVG devicons
```

## Notes

- **Colorschemes** — gruvbox (dark/light), tokyonight (night/storm/day),
  catppuccin (mocha/latte), kanagawa, rose-pine, nord. Switch with
  `:colorscheme` or `<Space>uc`; the choice persists in `localStorage`, and a
  first-time visitor always gets gruvbox-dark regardless of their OS
  light/dark preference. The fallback palette at the top of `nvim.css` mirrors
  the default so the first paint doesn't flash.
- **No Nerd Font required.** Filetype icons are inline SVG and all chrome
  (borders, tree guides, powerline separators, bullets) is drawn in CSS. The
  bundled JetBrains Mono subset has no glyphs above U+2500, so box-drawing
  characters would have broken the monospace grid.
- **Fonts** are self-hosted (~53KB for both weights); nothing is fetched from a
  third party at runtime.
- **Without JavaScript** the page falls back to a plain semantic résumé, and
  there is JSON-LD `Person` markup for crawlers.

## Keys

`<Space>` for which-key. `<Space>ff` find file, `<Space>fg` live grep,
`<Space>e` explorer, `/` search, `:` command line, `j`/`k`/`gg`/`G`/`<C-d>`/`<C-u>`
to move, `1`–`9` and `gt`/`gT` for buffers. Full list at `:help`.
