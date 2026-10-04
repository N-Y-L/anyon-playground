# Anyons: visual notes

**[Open the live playground](https://N-Y-L.github.io/anyon-playground/)** ·
[Source code](https://github.com/N-Y-L/anyon-playground)

Exchange two identical particles and ask what the state remembers. Ten
interactive notes follow that question into interference, spatial correlations,
quantum memory, and the tools used to calculate them, with the calculation beside each figure. The intended reader
knows graduate quantum mechanics and some condensed matter, but has no prior anyon or quantum field
theory background. The interface is plain HTML on a white page.

## Open and explore

Use the [website](https://N-Y-L.github.io/anyon-playground/) directly, or explore
offline: download the ZIP from [GitHub](https://github.com/N-Y-L/anyon-playground)
(**Code → Download ZIP**), extract it, and **double-click `index.html`**.
Cloning the repository works too. The downloaded demos need no installation,
account, internet connection, or build step; research links need internet.
Equations use a locally bundled copy of KaTeX.

The [contents](https://N-Y-L.github.io/anyon-playground/) arrange the notes by the calculation you want to understand. Follow each row from left to right on a first reading:

| Purpose | Reading order | What the comparison reveals |
|---|---|---|
| Identify and measure a phase | Exchange → Interference → Berry phase | Winding, relative phase, coherence, and gauge-invariant numerical transport are different questions. |
| Build and classify an anyon phase | Toric strings → Topological memory → Abelian theories | Microscopic string algebra leads to mutual statistics and nonlocal information; fusion rules alone do not identify a theory. |
| Act on collective states | Fusion paths → Fusion bases → Ising braids | Count a space, construct its operations, then choose a measurement that detects the result. |
| Follow a quantum Hall calculation | Pair correlations | The same statistical rule can give opposite correlation signs when preparation changes. |

The figures show comparisons that the controls let you test. Derivations and exact readouts carry the simpler arithmetic.
Four short cat comics introduce puzzles about paths, quantum memory, fusion records,
and changes of basis. Each has a caption and a text transcript. Select a comic or its caption link to open the full-size image.

Each note introduces its symbols, gives worked example settings, and explains
what its readout measures. Controls have a reset; mathematical derivations and
model limits sit beside the figures.
The Ising, Fibonacci, and toric-code examples describe **different anyon models**.
They are not stages of one material simulation.

Read the [connected notes](docs/notes.md) for the argument in one place, or browse the
[inspiration catalog](docs/catalog.md) for papers, existing software, and possible
next experiments. [References](docs/references.md) connect the models to sources.

## What is calculated?

The demos calculate statistical phases, ideal interference probabilities, small
braid matrices, encoded measurement probabilities, explicit fusion basis paths,
lowest-Landau-level pair correlations, and local and logical toric-string parities. Drawn paths are schematics;
the app does not solve an interacting electron fluid or reproduce an experimental
device. Assumptions and conventions are stated beside each calculation.
The toric-code panel tracks magnetic plaquette eigenvalues and strings of Pauli
operators and logical loop eigenvalues; it does not store an entire many-spin
wavefunction or implement error correction. The correlation note uses the
particular localized-pair preparation of Vishveshwara and Cooper (2010),
linked beside its formulas. It computes a guiding-center separation moment,
not a detector coincidence probability. Angles are in radians; distances and
correlations use the dimensionless units defined in the note.
The Berry example computes a cyclic overlap product for a spin, not a microscopic anyon braid. The Abelian examples take specified $K$ matrices as low-energy data, not as proof that a proposed Hamiltonian realizes them.
The calculations are deterministic and use no random sampling.

## Change the code

| File | Purpose |
|---|---|
| `physics.js` | Numerical models, independent of the interface |
| `app.js` | Controls, SVG drawings, and explanatory text |
| `styles.css` | Plain-page layout and figure controls |
| `index.html` | Plain index of experiments, notes, and code |
| `experiments.html` | Interactive examples |
| `berry*`, `fusion-basis*`, `abelian*` | Independent notes, each with a DOM-free numerical model and a browser interface |
| `tests/*.test.js` | Physical identities, convention checks, and limiting cases |

To check the numerical models, install Node.js 22.12 or newer, then run from this
folder:

```sh
node --test tests/*.test.js
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
require no package installation.

The fusion-path slider selects any basis state directly; the previous/next
buttons move one state at a time. The angle slider in the interferometer and the
statistics slider in the correlation note include both endpoints and preserve
exact one-third presets.

Choose a figure from the footer to save its SVG. Exchange and correlation figures
keep their curve legends, and the toric figure records its winding count and loop
multiplier inside the saved image. JSON exports record parameters,
conventions, and computed results, including the selected measurement basis,
fusion path, pair-correlation preparation, or toric string. These are records, not files that can be reimported
through the interface.
Each export leaves a download link available for another try.

## License

[MIT](LICENSE). Copyright (c) 2026 Neil Yuanting Li.
Bundled KaTeX retains its own [MIT license](vendor/katex/LICENSE).
