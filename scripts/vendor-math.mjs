// Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
// Keep all math assets local so double-clicked pages work without internet.
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

const source = new URL('../node_modules/katex/', import.meta.url);
const target = new URL('../vendor/katex/', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', source), 'utf8'));
if (version !== '0.19.0') throw new Error('Review the vendor README before changing the KaTeX version.');

// Current browsers use WOFF2. Keep every font face and glyph, but omit the
// legacy WOFF/TTF copies and their fallback URLs from the upstream stylesheet.
const fontSource = new URL('dist/fonts/', source);
const fonts = (await readdir(fontSource)).filter(name => name.endsWith('.woff2')).sort();
const css = (await readFile(new URL('dist/katex.min.css', source), 'utf8'))
  .replaceAll(/,url\(fonts\/[^()]+\.(?:woff|ttf)\) format\("(?:woff|truetype)"\)/g, '');
const referencedFonts = [...css.matchAll(/url\(fonts\/([^()]+)\)/g)]
  .map(match => match[1]).sort();
if (fonts.length !== 20 || JSON.stringify(referencedFonts) !== JSON.stringify(fonts)) {
  throw new Error('Expected exactly the 20 KaTeX 0.19.0 WOFF2 fonts and matching CSS URLs.');
}

await mkdir(target, { recursive: true });
await cp(new URL('dist/katex.min.js', source), new URL('katex.min.js', target));
await cp(new URL('dist/contrib/auto-render.min.js', source), new URL('auto-render.min.js', target));
await cp(new URL('LICENSE', source), new URL('LICENSE', target));
const fontTarget = new URL('fonts/', target);
await rm(fontTarget, { recursive: true, force: true });
await mkdir(fontTarget);
for (const name of fonts) {
  await cp(new URL(name, fontSource), new URL(name, fontTarget));
}
await writeFile(new URL('katex.min.css', target), css);
console.log('Bundled KaTeX ' + version + ' with all 20 WOFF2 fonts and its license.');
