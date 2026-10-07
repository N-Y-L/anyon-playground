# Anyons and quantum transport

[Read online](https://n-y-l.github.io/anyon-playground/) · [Connected notes](docs/notes.md)

How does a many-electron state acquire movable excitations, and how does their
exchange rule become a signal? The connected notes follow Laughlin quasiholes
through charge, Berry transport, two-particle preparation, quadratic dynamics
and calibrated measurements. They use graduate quantum mechanics and mathematics
without assuming quantum field theory.

The main reading page begins with an exact one-phonon fluctuation packet,
a published quasihole density profile with local/global charge accounting, and matched
winding paths that isolate the statistical phase. Three later comparisons show
projected-coordinate and generalized-coherent pair states, their assigned saddle
moments, and two references for an extended boson/fermion collider. Ten independent notebooks
remain available for exchange, interference, Berry numerics, toric strings and
memory, Abelian data, fusion paths and bases, Ising braids, and localized pairs.

Start with the connected anyon notes. The separate
[quantum-transport notes](https://n-y-l.github.io/quantum-transport-notes/)
provide optional, linked detours on channel current and single-particle
interference at the collider section; they are not prerequisites for the
quasihole construction. Each detour links back to its point of departure.

[Directions to think about](docs/directions.md) offers optional follow-on reading
after the connected notes. Seven chapters connect the saddle, detector inference,
Majorana wires, closed surfaces, Möbius geometry, ramps and other exchange problems.
Five interactive figures explore a Gaussian guiding center and its overlap decay,
finite-wire modes and parity crossings, localization in nonuniform wires,
sphere phase textures and zero counts, and a normal carried around a Möbius band.

## Open

Use the [website](https://n-y-l.github.io/anyon-playground/), or download the
repository ZIP, extract it, and double-click `index.html`. No installation or
internet connection is needed for the text, equations or calculations. KaTeX
and its fonts are bundled locally. Source links and the companion transport site require internet.

Default figures and typeset math in `docs/` are included in the saved HTML,
so that the connected notes also remain readable without JavaScript. Controls
provide optional parameter changes; the argument does not require using them.
The main-note and notebook SVG and JSON export buttons save the displayed figure and its parameters/results.
JSON exports are records, not importable sessions.

## Models and limits

- The phonon plot evaluates a finite periodic harmonic chain with its translation
  mode fixed. It shows excess displacement variance; mean displacement remains
  zero. It is not a phonon position probability. The quasihole density figure is a credited numerical result from Fulsebakke et al.
  (2023); its bulk profile is distinct from the finite-droplet charge accounting below it.
  The winding diagram is a schematic of the screened bulk limit.
- Pair lengths use the effective particle's magnetic length, not the electron's.
  The localization label is not an exact separation. The normalized zero-label
  limit is mathematical; physical quasihole cores cannot remain separated there.
- The two pair preparations have different angular weights for fractional
  statistics. The saddle uses a specified SU(1,1) representation. Its assigned
  quadratic observables require operator matching before interpreting them as
  physical spatial measurements; a weighted moment is not a coincidence rate.
- The loop-collider model describes noninteracting bosons and fermions with
  identical synchronized packets, a uniform spectral window, and detectors
  integrated over all outgoing times. It is not an anyon extension.
- Ising, Fibonacci, toric-code and K-matrix notebooks specify different theories.
  None of the figures solves a full interacting electron fluid or a noisy
  error-correction experiment.

Conventions and derivations are next to the figures. Calculations are deterministic.
The phonon calculation records every finite-chain mode and plotted site; its
normalization, conserved energy, Fourier sum rule and displacement variance are
checked, including an independent small-chain Fock-space calculation.
The pair-series tail has a truncation bound; collider quadrature reports a
refinement error estimate, not a rigorous global error bound.

## Code and checks

| Files | Purpose |
|---|---|
| `docs/notes.md` | Authoritative connected prose and mathematics |
| `docs/directions.md`, `docs/directions/` | Optional follow-on reading and detailed subchapters |
| `directions-*.js` | Follow-on models, accessible static SVG defaults and interactive controls |
| `phonon-physics.js`, `pair-states-physics.js`, `collider-physics.js` | DOM-free models for the main notes |
| `notes-figures.js`, `notes-interactions.js` | Shared static/live SVG figures and controls |
| `physics.js`, `app.js`, `experiments.html` | Original independent interactive models |
| `berry*`, `fusion-basis*`, `abelian*` | Independent model and interface modules |
| `tests/` | Physical limits, identities, convergence and control behavior |
| `scripts/build-docs.mjs` | Markdown → accessible math and static figure defaults |

Node.js 22.12 or newer is sufficient to run all model tests:

```sh
npm test
```

To edit the Markdown and regenerate the committed reading copies:

```sh
npm ci --ignore-scripts
npm run docs
```

The build uses pinned versions of Marked and KaTeX. No build is required to
read the downloaded site. A local server is optional:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://127.0.0.1:8000); on Windows use `py -3` instead
of `python3`. Stop the server with Ctrl+C.

## License

[MIT](LICENSE), copyright (c) 2026 Neil Yuanting Li.
Bundled KaTeX retains its [MIT license](vendor/katex/LICENSE).

## Figure credits

The quasihole density panel is from Fulsebakke et al., *SciPost Physics* **14**, 149
(2023), Fig. 11(a), reused under CC BY 4.0. It is distributed locally as a vector
SVG for sharp, offline reading. See [image provenance and license](assets/README.md).
The repository's MIT license does not replace the source figure's CC BY license.
