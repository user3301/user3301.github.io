// highlight.js — a small tokenizer for the languages that appear on this site.
//
// Rules are tried in order at each position using sticky regexes, so comments
// and strings always win before keywords. That avoids the usual bug where a
// keyword inside a string gets coloured.

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const rule = (cls, source, flags = '') => ({ cls, re: new RegExp(source, flags + 'y') });

const WS = rule(null, '\\s+');
const DQ = rule('string', '"(?:\\\\.|[^"\\\\\\n])*"?');
const SQ = rule('string', "'(?:\\\\.|[^'\\\\\\n])*'?");
const NUM = rule('number', '\\b(?:0[xX][0-9a-fA-F_]+|\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b');
const FUNC = rule('function', '[A-Za-z_]\\w*(?=\\s*\\()');
const PROP = rule('property', '\\.[A-Za-z_]\\w*');
const IDENT = rule(null, '[A-Za-z_]\\w*');
const OP = rule('operator', '[+\\-*/%=<>!&|^~?:]+');
const PUNCT = rule('punct', '[{}()\\[\\];,.]');

const words = (cls, list) => rule(cls, `\\b(?:${list.trim().split(/\s+/).join('|')})\\b`);
const lineComment = (prefix) => rule('comment', `${prefix}[^\\n]*`);

export const LANGS = {
  go: [
    WS, lineComment('//'), rule('comment', '/\\*[\\s\\S]*?\\*/'),
    rule('string', '`[^`]*`'), DQ, SQ, NUM,
    words('keyword', `break case chan const continue default defer else fallthrough
      for func go goto if import interface map package range return select struct
      switch type var`),
    words('constant', 'nil true false iota'),
    words('type', `bool byte complex64 complex128 error float32 float64 int int8
      int16 int32 int64 rune string uint uint8 uint16 uint32 uint64 uintptr any`),
    words('function', 'make new len cap append copy delete panic recover print println'),
    FUNC, PROP, IDENT, OP, PUNCT,
  ],

  lua: [
    WS, rule('comment', '--\\[\\[[\\s\\S]*?\\]\\]'), lineComment('--'),
    rule('string', '\\[\\[[\\s\\S]*?\\]\\]'), DQ, SQ, NUM,
    words('keyword', `and break do else elseif end for function goto if in local
      not or repeat return then until while`),
    words('constant', 'nil true false'),
    words('type', 'self _G _ENV'),
    words('function', `require pairs ipairs type tostring tonumber print select
      setmetatable getmetatable rawget rawset pcall xpcall error assert unpack`),
    words('property', 'table string math os io coroutine debug vim'),
    FUNC, PROP, IDENT, OP, PUNCT,
  ],

  nix: [
    WS, lineComment('#'), rule('comment', '/\\*[\\s\\S]*?\\*/'),
    rule('string', "''[\\s\\S]*?''"), DQ, NUM,
    words('keyword', 'let in rec inherit with assert if then else or'),
    words('constant', 'true false null'),
    words('function', 'builtins import fetchurl fetchGit mkDerivation mkIf mkOption'),
    rule('property', '[A-Za-z_][\\w\'-]*(?=\\s*=)'),
    FUNC, IDENT, OP, PUNCT,
  ],

  bash: [
    WS, lineComment('#'), DQ, SQ,
    rule('constant', '\\$\\{[^}]*\\}|\\$\\w+'),
    NUM,
    words('keyword', `if then else elif fi for while until do done case esac
      function return in local export readonly declare set unset shift`),
    words('function', `echo printf cd exit source pwd ls mkdir rm cp mv cat grep
      sed awk curl git make sudo nix nvim tmux`),
    rule('operator', '[|&;<>]+'),
    OP, IDENT, PUNCT,
  ],

  python: [
    WS, lineComment('#'),
    rule('string', '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\''), DQ, SQ, NUM,
    words('keyword', `def class return if elif else for while import from as with
      try except finally raise lambda yield pass break continue global nonlocal
      in is not and or assert del await async`),
    words('constant', 'None True False self cls'),
    words('function', `print len range enumerate zip map filter open str int float
      list dict set tuple isinstance super`),
    FUNC, PROP, IDENT, OP, PUNCT,
  ],

  csharp: [
    WS, lineComment('//'), rule('comment', '/\\*[\\s\\S]*?\\*/'), DQ, SQ, NUM,
    words('keyword', `using namespace class struct interface enum public private
      protected internal static readonly const void var new return if else for
      foreach while do switch case default break continue try catch finally throw
      async await override virtual abstract sealed record get set partial where`),
    words('constant', 'null true false this base'),
    words('type', `string int long bool double float decimal object byte char
      Task List Dictionary IEnumerable Span`),
    FUNC, PROP, IDENT, OP, PUNCT,
  ],

  json: [
    WS, rule('property', '"(?:\\\\.|[^"\\\\])*"(?=\\s*:)'), DQ, NUM,
    words('constant', 'true false null'), PUNCT, OP,
  ],

  // The line-anchored rules must come before WS, or the whitespace rule eats
  // the indent and moves past the line start where `^` can still match.
  yaml: [
    rule('property', '^[ \\t]*[\\w.$-]+(?=\\s*:)', 'm'),
    rule('operator', '^[ \\t]*-(?=\\s)', 'm'),
    WS, lineComment('#'), DQ, SQ, NUM,
    words('constant', 'true false null yes no on off'),
    IDENT, PUNCT,
  ],

  diff: [
    rule('added', '^\\+[^\\n]*', 'm'),
    rule('deleted', '^-[^\\n]*', 'm'),
    rule('comment', '^@@[^\\n]*', 'm'),
  ],

  text: [],
};

LANGS.sh = LANGS.shell = LANGS.zsh = LANGS.bash;
LANGS.py = LANGS.python;
LANGS.cs = LANGS['c#'] = LANGS.csharp;
LANGS.yml = LANGS.yaml;
LANGS.golang = LANGS.go;

/** Display name and colour token for a code fence's language chip. */
export function langLabel(lang) {
  const known = {
    go: ['Go', 'var(--cyan)'], golang: ['Go', 'var(--cyan)'],
    lua: ['Lua', 'var(--purple)'],
    nix: ['Nix', 'var(--cyan)'],
    bash: ['Bash', 'var(--green)'], sh: ['Shell', 'var(--green)'],
    shell: ['Shell', 'var(--green)'], zsh: ['Zsh', 'var(--green)'],
    python: ['Python', 'var(--yellow)'], py: ['Python', 'var(--yellow)'],
    csharp: ['C#', 'var(--purple)'], cs: ['C#', 'var(--purple)'],
    json: ['JSON', 'var(--yellow)'],
    yaml: ['YAML', 'var(--orange)'], yml: ['YAML', 'var(--orange)'],
    diff: ['Diff', 'var(--green)'],
    text: ['Text', 'var(--fg-dim)'],
  };
  return known[(lang || '').toLowerCase()] || [lang || 'text', 'var(--fg-dim)'];
}

export function highlight(code, lang) {
  const rules = LANGS[(lang || '').toLowerCase()];
  if (!rules || !rules.length) return esc(code);

  let i = 0;
  let out = '';
  const n = code.length;

  outer: while (i < n) {
    for (const { cls, re } of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length > 0) {
        out += cls ? `<span class="tok-${cls}">${esc(m[0])}</span>` : esc(m[0]);
        i += m[0].length;
        continue outer;
      }
    }
    out += esc(code[i]);
    i += 1;
  }
  return out;
}
