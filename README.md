# Anyon playground

**Exchange two particles. Wind one around another. Change the order.**
In two dimensions, these operations can leave a quantum state with more than
the familiar bosonic or fermionic exchange sign. This playground makes that
difference visible through five small experiments and short accompanying notes.
Some elementary quantum mechanics helps; no knowledge of anyons is assumed.

## Open and explore

Download or clone this repository, then **double-click `index.html`**.
Everything runs locally in your browser. No installation, account, internet
connection, or build step is needed for the demos. Research links need internet.
Equations are written in LaTeX and typeset with a locally bundled copy of KaTeX.

Start with the first two experiments, then explore in any order:

| Experiment | What to look for |
|---|---|
| Exchange and winding | One exchange and one complete encircling give different phases. |
| Interference | An enclosed anyon shifts a fringe; reduced coherence makes the shift harder to see. |
| Ising braids | Exchanging different pairs in a different order can change a measurement. |
| Fibonacci fusion | A simple rule generates a growing space of possible states. |
| Toric-code loops | Winding one kind of excitation around another can change a sign. |

Each experiment has adjustable inputs, a reset, and an explanation of the model.
The Ising, Fibonacci, and toric-code examples describe **different anyon models**.
They are not stages of one material simulation.

Read the [short notes](docs/notes.md) for the common ideas, or browse the
[inspiration catalog](docs/catalog.md) for papers, existing software, and possible
next experiments. [References](docs/references.md) connect the models to sources.

## What is calculated?

The demos calculate statistical phases, ideal interference probabilities, small
braid matrices, fusion-state counts, and loop parity. Drawn paths are schematics;
the app does not solve an interacting electron fluid or reproduce an experimental
device. Assumptions and conventions are stated beside each calculation.
Angles are in radians; all displayed quantities are dimensionless. The
calculations are deterministic and use no random sampling.

## Change the code

| File | Purpose |
|---|---|
| `physics.js` | Numerical models, independent of the interface |
| `app.js` | Controls, SVG drawings, and explanatory text |
| `styles.css` | Layout and appearance |
| `index.html` | Plain index of experiments, notes, and code |
| `experiments.html` | Interactive examples |
| `tests/physics.test.js` | Physical identities and limiting cases |

To check the numerical models, install Node.js 22.12 or newer, then run from this
folder:

```sh
node --test tests/physics.test.js
```

For a local web-server preview, Python 3 is sufficient:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://127.0.0.1:8000). On Windows, use `py -3` in place of
`python3`. Press **Ctrl+C** to stop the server. The double-click method needs
neither Python nor Node.js.

The Markdown files in `docs/` are the source for the included HTML reading
copies. After editing them, regenerate those copies with Node.js:

```sh
npm install --ignore-scripts
npm run docs
```

This optional editing step uses the versions of Marked and KaTeX pinned in
`package-lock.json`. Exploring the finished pages and running the physics tests
require no package installation. SVG exports contain
vector drawings; JSON exports record parameters, conventions, and model results.
Each export leaves a download link available for another try.

## License

[MIT](LICENSE). Copyright (c) 2026 Neil Yuanting Li.
Bundled KaTeX retains its own [MIT license](vendor/katex/LICENSE).
