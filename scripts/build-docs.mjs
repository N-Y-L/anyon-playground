// Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
// Markdown is the source of truth. Math is typeset at build time, with no runtime JavaScript.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import katex from 'katex';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const figures = require('../notes-figures.js');

const docs = new URL('../docs/', import.meta.url);
const styleVersion = createHash('sha256').update(await readFile(new URL('reading.css', docs))).digest('hex').slice(0, 12);
const notesScripts = (await Promise.all(['pair-states-physics.js','collider-physics.js','phonon-physics.js','notes-figures.js','notes-interactions.js'].map(async file => {
  const version = createHash('sha256').update(await readFile(new URL('../' + file, docs))).digest('hex').slice(0, 12);
  return `<script defer src="../${file}?v=${version}"></script>`;
}))).join('');
// A changed stylesheet needs a new URL even for readers with an older page open.
const home = new URL('../index.html', import.meta.url);
await writeFile(home, (await readFile(home, 'utf8')).replace(/href="docs\/reading\.css(?:\?v=[^"]*)?"/, `href="docs/reading.css?v=${styleVersion}"`));
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function renderMath(tex, displayMode) {
  return katex.renderToString(tex.trim(), {
    displayMode,
    output: 'htmlAndMathml',
    throwOnError: true,
    trust: false,
    strict: 'error'
  });
}

// Tokenize math before Markdown's emphasis and escape rules touch the TeX.
// KaTeX's MathML accompanies its visual HTML for accessible equation reading.
marked.use({
  renderer: {
    heading({tokens, depth}) {
      const text = this.parser.parseInline(tokens);
      const id = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
  },
  extensions: [
    {
      name: 'displayMath',
      level: 'block',
      start(source) { return source.match(/^ {0,3}\$\$/m)?.index; },
      tokenizer(source) {
        const match = /^ {0,3}\$\$([\s\S]+?)\$\$(?:[ \t]*(?:\n|$))/.exec(source);
        if (match) return {type: 'displayMath', raw: match[0], tex: match[1]};
      },
      renderer(token) {
        return `<div class="equation">${renderMath(token.tex, true)}</div>\n`;
      }
    },
    {
      name: 'inlineMath',
      level: 'inline',
      start(source) { return source.match(/(?<![\\$])\$(?!\$)/)?.index; },
      tokenizer(source) {
        const match = /^\$(?!\$)((?:\\[^\n]|[^\\$\n])+)\$(?!\$)/.exec(source);
        if (match) return {type: 'inlineMath', raw: match[0], tex: match[1]};
      },
      renderer(token) { return renderMath(token.tex, false); }
    }
  ]
});

for (const name of ['notes', 'catalog', 'references']) {
  const source = await readFile(new URL(name + '.md', docs), 'utf8');
  const title = source.split('\n')[0].replace(/^# /, '');
  let body = marked.parse(source).replace(/href="([^":]+)\.md(#[^"]*)?"/g, 'href="$1.html$2"');
  if (name === 'notes') body = body.replace(/<!-- FIGURE: (phonon|charge|winding|pair|saddle|collider) -->/g, (_, figure) => figures.initialMarkup(figure));
  const headings = [...body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  const contents = name === 'notes' ? `<nav class="contents" aria-label="In these notes"><span>In these notes</span>${headings.map(([,id,title]) => `<a href="#${id}">${title}</a>`).join('')}</nav>` : '';
  if (name === 'notes') body = body.replace(/(<h2\b)/, contents + '$1');
  const scripts = name === 'notes' ? notesScripts : '';
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><link rel="stylesheet" href="../vendor/katex/katex.min.css"><link rel="stylesheet" href="reading.css?v=${styleVersion}">${scripts}</head>
<body><nav aria-label="Reading navigation"><a href="../index.html">All notes</a><a href="notes.html">Notes</a><a href="catalog.html">Further calculations</a><a href="references.html">Sources</a></nav>
<main id="main">${body}</main><footer><a href="${name}.md">Markdown source</a> · <a href="../LICENSE">Code: MIT</a> · <a href="../assets/README.md">Image credits</a> · Neil Yuanting Li</footer></body></html>\n`;
  await writeFile(new URL(name + '.html', docs), page);
  console.log('Built ' + fileURLToPath(new URL(name + '.html', docs)));
}
