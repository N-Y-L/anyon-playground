// Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
// Markdown is the source of truth. Math is typeset at build time, with no runtime JavaScript.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import katex from 'katex';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const figures = require('../notes-figures.js');

const docs = new URL('../docs/', import.meta.url);
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
  if (name === 'notes') body = body.replace(/<!-- FIGURE: (pair|saddle|collider) -->/g, (_, figure) => figures.initialMarkup(figure));
  const headings = [...body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  const contents = name === 'notes' ? `<nav class="contents" aria-label="In these notes"><span>In these notes</span>${headings.map(([,id,title]) => `<a href="#${id}">${title}</a>`).join('')}</nav>` : '';
  if (name === 'notes') body = body.replace(/(<\/h1>)/, '$1' + contents);
  const scripts = name === 'notes' ? ['pair-states-physics.js','collider-physics.js','notes-figures.js','notes-interactions.js'].map(file => `<script defer src="../${file}"></script>`).join('') : '';
  const page = `<!doctype html>
<!-- Generated from ${name}.md by scripts/build-docs.mjs. -->
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><link rel="stylesheet" href="../vendor/katex/katex.min.css"><link rel="stylesheet" href="reading.css">${scripts}</head>
<body><nav aria-label="Reading navigation"><a href="../index.html">All notes</a><a href="notes.html">Notes</a><a href="catalog.html">Further calculations</a><a href="references.html">Sources</a></nav>
<main id="main">${body}</main><footer><a href="${name}.md">Markdown source</a> · <a href="../LICENSE">MIT license</a> · Neil Yuanting Li</footer></body></html>\n`;
  await writeFile(new URL(name + '.html', docs), page);
  console.log('Built ' + fileURLToPath(new URL(name + '.html', docs)));
}
