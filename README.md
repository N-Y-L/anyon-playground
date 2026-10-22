# Anyons and quantum transport

Notes and interactive calculations on what a quantum state can remember after
exchanging identical objects: quasiparticles, Laughlin quasiholes, fractional
statistics, non-Abelian fusion states and measured signals.

The assumed background is graduate mathematics, basic graduate quantum mechanics
and very basic condensed-matter physics. Landau levels, guiding centers and edge
channels are introduced where needed; no field theory is required.

The writing is Codex-assisted. Please read these notes with a grain of salt and
check important claims against the cited papers.

## Start reading

- [Connected notes](docs/notes.md): the main argument, with optional derivations
  and figures.
- [Three papers to remember](docs/conversation.md): a short reading list with
  recall prompts and discussion questions.
- [Directions to explore](docs/directions.md): follow-on questions and detailed
  subchapters. These are starting points, not claims of completed research.

## Open the site

Visit the [website](https://n-y-l.github.io/anyon-playground/), or download and
extract the repository ZIP, then open `index.html`. No installation or internet
connection is needed for the text, equations or calculations. Paper links and
the companion transport site require internet access.

The saved reading pages include typeset equations and default figures, so they
remain readable without JavaScript. Interactive controls are optional.

## Contribute

With Node.js 22.12 or newer:

```sh
npm ci --ignore-scripts
npm run docs
npm run check
```

Edit the Markdown in `docs/` and regenerate its HTML reading copies. See
[development guidance](DEVELOPMENT.md) for the workflow, model limits and exports.

## Repository map

| Location | Purpose |
| --- | --- |
| `index.html`, root HTML pages | Site entry point and independent notebooks |
| `docs/` | Authoritative Markdown and generated offline HTML |
| `src/models/` | Numerical models, independent of the page interface |
| `src/figures/`, `src/pages/` | Figure rendering and page controls |
| `styles/` | Reading and notebook styles |
| `tests/`, `scripts/` | Model tests, site checks and documentation build |
| `assets/`, `vendor/` | Credited figures and bundled math renderer |

## License and credits

[MIT](LICENSE), copyright (c) 2026 Neil Yuanting Li. Bundled KaTeX retains its
[own license](vendor/katex/LICENSE); see its [distribution notes](vendor/katex/README.md).
The quasihole density figure retains its source's CC BY 4.0 license. See
[figure credits and provenance](assets/README.md).
