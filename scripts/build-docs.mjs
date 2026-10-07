// Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
// Markdown is the source of truth. Math is typeset at build time;
// interactive figures add their own small, page-specific scripts.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import katex from 'katex';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const figures = require('../notes-figures.js');

const docs = new URL('../docs/', import.meta.url);
const styleVersion = createHash('sha256').update(await readFile(new URL('reading.css', docs))).digest('hex').slice(0, 12);
const directionsStyleVersion = createHash('sha256').update(await readFile(new URL('directions.css', docs))).digest('hex').slice(0, 12);
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

const readingPages = [
  ['notes', 'Notes'],
  ['catalog', 'Further calculations'],
  ['directions', 'Directions to think about'],
  ['references', 'Sources']
];

const chapterFiles = await readdir(new URL('directions/', docs), {withFileTypes: true}).catch(error => {
  if (error.code === 'ENOENT') return [];
  throw error;
});
const chapterNames = chapterFiles.filter(file => file.isFile() && file.name.endsWith('.md'))
  .map(file => 'directions/' + file.name.slice(0, -3)).sort();

for (const name of [...readingPages.map(([name]) => name), ...chapterNames]) {
  const isChapter = name.startsWith('directions/');
  const docsPath = isChapter ? '../' : '';
  const sitePath = isChapter ? '../../' : '../';
  const sourceName = name.split('/').at(-1);
  const source = await readFile(new URL(name + '.md', docs), 'utf8');
  const title = source.split('\n')[0].replace(/^# /, '');
  let body = marked.parse(source).replace(/href="([^":]+)\.md(#[^"]*)?"/g, 'href="$1.html$2"');
  if (name === 'notes') body = body.replace(/<!-- FIGURE: (phonon|charge|winding|pair|saddle|collider) -->/g, (_, figure) => figures.initialMarkup(figure));
  const headings = [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
  const contentsLabel = isChapter ? 'On this page' : 'In these notes';
  const showContents = (name === 'notes' || isChapter) && headings.length > 1;
  const contents = showContents ? `<nav class="contents${isChapter ? ' chapter-contents' : ''}" aria-label="${contentsLabel}"><span>${contentsLabel}</span>${headings.map(([,id,title]) => `<a href="#${id}">${title.replace(/<\/?a\b[^>]*>/g, '')}</a>`).join('')}</nav>` : '';
  if (showContents) body = body.replace(/(<h2\b)/, contents + '$1');
  let scripts = name === 'notes' ? notesScripts : '';
  if (isChapter) {
    // A chapter may contain more than one model. Each named figure supplies its
    // static default and its own controls, with one script per model on the page.
    const figureNames = [...new Set([...body.matchAll(/<!-- DIRECTION-FIGURE: ([a-z-]+) -->/g)].map(match => match[1]))];
    for (const figureName of figureNames) {
      const scriptName = `directions-${figureName}.js`;
      const figure = require('../' + scriptName);
      body = body.replaceAll(`<!-- DIRECTION-FIGURE: ${figureName} -->`, figure.initialMarkup());
      const version = createHash('sha256').update(await readFile(new URL('../' + scriptName, docs))).digest('hex').slice(0, 12);
      scripts += `<script defer src="../../${scriptName}?v=${version}"></script>`;
    }
  }
  const extraStyles = name === 'directions' || isChapter ? `<link rel="stylesheet" href="${docsPath}directions.css?v=${directionsStyleVersion}">` : '';
  const navigation = readingPages.map(([page, label]) => {
    const current = page === name ? ' aria-current="page"' : isChapter && page === 'directions' ? ' aria-current="location"' : '';
    return `<a href="${docsPath}${page}.html"${current}>${label}</a>`;
  }).join('');
  const breadcrumb = isChapter ? `<p class="chapter-path"><a href="../directions.html">Directions to think about</a> <span aria-hidden="true">/</span> <span aria-current="page">${escape(title)}</span></p>` : '';
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><link rel="stylesheet" href="${sitePath}vendor/katex/katex.min.css"><link rel="stylesheet" href="${docsPath}reading.css?v=${styleVersion}">${extraStyles}${scripts}</head>
<body><nav aria-label="Reading navigation"><a href="${sitePath}index.html">All notes</a>${navigation}</nav>
<main id="main">${breadcrumb}${body}</main><footer><a href="${sourceName}.md">Markdown source</a> · <a href="${sitePath}LICENSE">Code: MIT</a> · <a href="${sitePath}assets/README.md">Image credits</a> · Neil Yuanting Li</footer></body></html>\n`;
  await writeFile(new URL(name + '.html', docs), page.replace(/^[ \t]+$/gm, ''));
  console.log('Built ' + fileURLToPath(new URL(name + '.html', docs)));
}
