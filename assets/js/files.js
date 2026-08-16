// files.js — the virtual filesystem the explorer renders.
//
// Content lives in real markdown files under content/, fetched on demand and
// cached. Adding a page means adding the file and one entry here.

export const TREE = [
  {
    type: 'dir',
    name: 'user3301',
    open: true,
    children: [
      { type: 'file', name: 'README.md', path: 'content/README.md', git: 'M',
        desc: 'Start here' },
      { type: 'file', name: 'experience.md', path: 'content/experience.md',
        desc: 'Ten years, four companies' },
      { type: 'file', name: 'skills.md', path: 'content/skills.md',
        desc: 'Languages, platforms, infra' },
      { type: 'file', name: 'education.md', path: 'content/education.md',
        desc: 'Monash University' },
      {
        type: 'dir',
        name: 'config',
        open: true,
        children: [
          { type: 'file', name: 'uses.md', path: 'content/uses.md', git: 'A',
            desc: 'Editor, OS, keyboard' },
          { type: 'file', name: 'init.lua', path: 'content/init.lua',
            desc: 'The profile, in Lua' },
        ],
      },
      { type: 'file', name: 'contact.md', path: 'content/contact.md',
        desc: 'Get in touch' },
    ],
  },
];

/** Depth-first list of every file node, in display order. */
export function allFiles(nodes = TREE, acc = []) {
  for (const n of nodes) {
    if (n.type === 'dir') allFiles(n.children, acc);
    else acc.push(n);
  }
  return acc;
}

export function findByName(name) {
  return allFiles().find((f) => f.name === name || f.path === name);
}

const cache = new Map();

/** Fetch a file's raw text, caching both hits and the error text. */
export async function readFile(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`E484: Can't open file ${path}`);
  const text = await res.text();
  cache.set(path, text);
  return text;
}

/** Preload everything so the picker can grep across files without waiting. */
export async function preloadAll() {
  await Promise.all(
    allFiles().map((f) => readFile(f.path).catch(() => ''))
  );
}

export function cachedFile(path) {
  return cache.get(path) ?? '';
}
