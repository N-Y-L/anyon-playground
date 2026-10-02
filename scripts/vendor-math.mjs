// Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
// Keep all math assets local so double-clicked pages work without internet.
import { cp, mkdir, readFile } from 'node:fs/promises';

const source = new URL('../node_modules/katex/', import.meta.url);
const target = new URL('../vendor/katex/', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', source), 'utf8'));
if (version !== '0.19.0') throw new Error('Review the vendor README before changing the KaTeX version.');
await mkdir(target, { recursive: true });
for (const name of ['katex.min.js', 'katex.min.css']) {
  await cp(new URL('dist/' + name, source), new URL(name, target));
}
await cp(new URL('dist/contrib/auto-render.min.js', source), new URL('auto-render.min.js', target));
await cp(new URL('LICENSE', source), new URL('LICENSE', target));
await cp(new URL('dist/fonts/', source), new URL('fonts/', target), { recursive: true });
console.log('Bundled KaTeX ' + version + ' with its fonts and license.');
