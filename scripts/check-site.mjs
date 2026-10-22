// Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
// Check the saved offline site, including links that a model test cannot follow.
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import katex from 'katex';
import { marked } from 'marked';

const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['.git', 'node_modules']);
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.filter(entry => !ignored.has(entry.name)).map(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  }));
  return groups.flat();
}
const files = new Set(await filesIn(root));
const htmlPages = new Map();
const references = [];
const errors = [];
const relative = file => path.relative(root, file);
const decode = text => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function fail(file, message) { errors.push(`${relative(file)}: ${message}`); }
function htmlReferences(file, source) {
  for (const match of source.matchAll(/<(a|link|script|img)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
    references.push({ file, url: decode(match[2]) });
  }
}
let equations = 0;
for (const file of files) {
  if (file.endsWith('.html')) {
    const source = await readFile(file, 'utf8');
    const ids = new Set();
    for (const match of source.matchAll(/\b(?:id|data-view)="([^"]+)"/g)) {
      if (ids.has(match[1])) fail(file, `duplicate ID ${match[1]}`);
      ids.add(match[1]);
    }
    htmlPages.set(file, ids);
    htmlReferences(file, source);
    let details = 0;
    for (const match of source.matchAll(/<\/?(?:details|summary)\b[^>]*>/g)) {
      if (match[0].startsWith('<details')) details++;
      else if (match[0].startsWith('</details')) {
        if (--details < 0) fail(file, 'unmatched closing details');
      } else if (match[0].startsWith('<summary') && details <= 0) fail(file, 'summary outside details');
    }
    if (details !== 0) fail(file, 'unclosed details');
    // Generated reading pages are already typeset by the strict build. The
    // directly authored notebooks still contain TeX for browser-side rendering.
    for (const match of source.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      try {
        katex.renderToString(decode(match[1] ?? match[2]), { displayMode: match[2] !== undefined, throwOnError: true, strict: 'error', trust: false });
        equations++;
      } catch (error) { fail(file, error.message); }
    }
  } else if (file.endsWith('.css')) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) references.push({ file, url: match[1] });
  } else if (file.endsWith('.md')) {
    const source = await readFile(file, 'utf8');
    marked.walkTokens(marked.lexer(source), token => {
      if (token.type === 'link' || token.type === 'image') references.push({ file, url: token.href });
    });
    htmlReferences(file, source);
  }
}
let localReferences = 0;
for (const { file, url } of references) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) continue;
  localReferences++;
  let target, fragment;
  try {
    const parsed = new URL(url, 'file://' + file);
    target = fileURLToPath(parsed);
    fragment = decodeURIComponent(parsed.hash.slice(1));
  } catch (error) { fail(file, `invalid URL ${url}: ${error.message}`); continue; }
  if (!files.has(target)) { fail(file, `missing file ${url}`); continue; }
  // Markdown reading sources share their anchors with the built HTML pages.
  const anchorFile = target.endsWith('.md') ? target.slice(0, -3) + '.html' : target;
  if (fragment && htmlPages.has(anchorFile) && !htmlPages.get(anchorFile).has(fragment)) fail(file, `missing anchor ${url}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlPages.size} HTML pages, ${localReferences} local links/assets, and ${equations} notebook math expressions.`);
}
