# KaTeX 0.19.0

Local distribution of [KaTeX](https://katex.org/), the MIT-licensed math renderer.
The JavaScript, all 20 WOFF2 font files, and [LICENSE](LICENSE) are copied
unchanged from the pinned `katex@0.19.0` npm package. The stylesheet retains
every font family, style, weight, and layout rule; only its WOFF and TTF fallback
URLs are removed. No glyphs are subsetted. Omitting those duplicate formats
removes 40 files and 816,780 bytes of font assets.

This bundle requires a browser with WOFF2 support, including current Chrome,
Edge, Firefox, and Safari. Older browsers without WOFF2 support are unsupported.
See [MDN's web-font guidance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Web_fonts)
and [KaTeX's font-format documentation](https://katex.org/docs/font).
Keep `fonts/` beside `katex.min.css`: its relative URLs allow local pages to
render math without an internet connection.

To reproduce this bundle from the repository root:

```sh
npm ci --ignore-scripts
node scripts/vendor-math.mjs
npm run docs
```

The script checks the pinned version and matching font references, replaces
the font directory with the complete WOFF2 set, and makes the same CSS change
on every run. Review the version guard and expected font count before updating
the dependency.
