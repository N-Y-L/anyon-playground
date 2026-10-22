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
const figures = require('../src/figures/notes-figures.js');

const root = new URL('../', import.meta.url);
const docs = new URL('docs/', root);
const checkOnly = process.argv.includes('--check');
let staleFiles = 0;
async function savePage(file, content) {
  const current = await readFile(file, 'utf8').catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (current === content) return;
  if (checkOnly) {
    console.error('Needs rebuilding: ' + fileURLToPath(file));
    staleFiles++;
  } else {
    await writeFile(file, content);
    console.log('Updated ' + fileURLToPath(file));
  }
}
async function assetVersion(file) {
  return createHash('sha256').update(await readFile(new URL(file, root))).digest('hex').slice(0, 12);
}
const styleVersion = await assetVersion('styles/reading.css');
const mathStyleVersion = await assetVersion('vendor/katex/katex.min.css');
const notesScripts = (await Promise.all(['src/models/pair-states-physics.js','src/models/collider-physics.js','src/models/phonon-physics.js','src/figures/notes-figures.js','src/pages/notes-interactions.js'].map(async file => {
  const version = await assetVersion(file);
  return `<script defer src="../${file}?v=${version}"></script>`;
}))).join('');
// The notebook HTML is authored directly. Refresh only its asset versions so
// returning readers receive changed scripts and styles after a deployment.
for (const name of ['index', 'experiments', 'berry', 'abelian', 'fusion-basis']) {
  const file = new URL(name + '.html', root);
  let html = await readFile(file, 'utf8');
  const assets = [...html.matchAll(/(?:src|href)="((?:src|styles|vendor)\/[^"?]+\.(?:js|css))(?:\?v=[^"]*)?"/g)];
  for (const match of assets) {
    html = html.replace(match[0], match[0].split('=')[0] + `="${match[1]}?v=${await assetVersion(match[1])}"`);
  }
  await savePage(file, html);
}
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
  ['catalog', 'Questions to explore'],
  ['directions', 'Directions to think about'],
  ['conversation', 'Three papers'],
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
  const contentsLabel = 'Contents';
  const showContents = (name === 'notes' || isChapter) && headings.length > 1;
  const contents = showContents ? `<nav class="contents" aria-label="${contentsLabel}"><p>${contentsLabel}</p><ul>${headings.map(([,id,title]) => `<li><a href="#${id}">${title.replace(/<\/?a\b[^>]*>/g, '')}</a></li>`).join('')}</ul></nav>` : '';
  if (showContents) body = body.replace(/(<h2\b)/, contents + '$1');
  let scripts = name === 'notes' ? notesScripts : '';
  if (isChapter) {
    // A chapter may contain more than one model. Each named figure supplies its
    // static default and its own controls, with one script per model on the page.
    const figureNames = [...new Set([...body.matchAll(/<!-- DIRECTION-FIGURE: ([a-z-]+) -->/g)].map(match => match[1]))];
    for (const figureName of figureNames) {
      const scriptName = `src/figures/directions-${figureName}.js`;
      const figure = require('../' + scriptName);
      body = body.replaceAll(`<!-- DIRECTION-FIGURE: ${figureName} -->`, figure.initialMarkup());
      const version = await assetVersion(scriptName);
      scripts += `<script defer src="../../${scriptName}?v=${version}"></script>`;
    }
  }
  const navigation = readingPages.map(([page, label]) => {
    const current = page === name ? ' aria-current="page"' : isChapter && page === 'directions' ? ' aria-current="location"' : '';
    return `<a href="${docsPath}${page}.html"${current}>${label}</a>`;
  }).join(' · ');
  const breadcrumb = isChapter ? `<p class="chapter-path"><a href="../directions.html">Directions to think about</a> <span aria-hidden="true">/</span> <span aria-current="page">${escape(title)}</span></p>` : '';
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><link rel="stylesheet" href="${sitePath}vendor/katex/katex.min.css?v=${mathStyleVersion}"><link rel="stylesheet" href="${sitePath}styles/reading.css?v=${styleVersion}">${scripts}</head>
<body><nav aria-label="Reading navigation"><a href="${sitePath}index.html">All notes</a> · ${navigation}</nav>
<main id="main">${breadcrumb}${body}</main><footer><a href="${sourceName}.md">Markdown source</a> · <a href="${sitePath}LICENSE">Code: MIT</a> · <a href="${sitePath}assets/README.md">Image credits</a> · Neil Yuanting Li</footer></body></html>\n`;
  await savePage(new URL(name + '.html', docs), page.replace(/^[ \t]+$/gm, ''));
}
if (staleFiles) {
  console.error(`Run npm run docs to update ${staleFiles} file(s).`);
  process.exitCode = 1;
} else {
  console.log(checkOnly ? 'Generated pages and asset versions are current.' : 'Reading pages and asset versions built successfully.');
}
