# Development

This is a static site. The committed HTML, JavaScript, styles and math-rendering
assets are sufficient for offline reading; readers do not need Node.js or a build.
Node.js 22.12 or newer is required for development. The build dependencies are
pinned in `package-lock.json`; install them with `npm ci --ignore-scripts`.

## Editing and validation

1. Edit reading prose in `docs/*.md` or `docs/directions/*.md`. These files are
   authoritative; changes made only to their HTML copies will be overwritten.
2. Keep numerical models in `src/models/`, figure rendering in `src/figures/`
   and page controls in `src/pages/`. The `directions-*.js` figure modules also
   contain their corresponding models. Styles belong in `styles/`.
3. Run `npm run docs` to regenerate reading pages. The build typesets math with
   KaTeX and inserts static figure defaults. Include the generated HTML with
   changes to its Markdown, figures, scripts or styles.
4. Run `npm run check` for generated-page consistency, local links, math, asset
   references, and all model and control tests. `npm test` runs just the tests.
5. Open the affected pages and inspect equations, default figures and controls.
   Check that the reading pages still make sense without JavaScript.

The root HTML pages are maintained directly. Keep their URLs stable when moving
supporting files, and update references in pages, tests and build scripts together.
In the reading pages, math and default figures are generated at build time;
the browser scripts provide optional interaction. Notebook math is typeset locally
in the browser. The build uses Marked and KaTeX and rejects invalid math.

Opening `index.html` directly is sufficient for normal use. For an optional local
server, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://127.0.0.1:8000). On Windows, use `py -3` instead of
`python3`. Stop the server with Ctrl+C.

## Models and interpretation

Conventions and derivations belong beside the figures in the notes. Preserve
these distinctions when changing a calculation or its labels:

- **Phonons:** the finite periodic harmonic chain has its translation mode fixed.
  The plot shows excess displacement variance, with zero mean displacement; it
  is not a phonon position probability.
- **Quasihole density:** the credited Fulsebakke et al. (2023) figure shows a bulk
  profile, distinct from the finite-droplet charge accounting below it. The
  winding diagram is a schematic of the screened bulk limit.
- **Pair states:** lengths use the effective particle's magnetic length, not the
  electron's. The localization label is not an exact separation. The normalized
  zero-label limit is mathematical; physical quasihole cores cannot remain
  separated there. The two preparations have different angular weights for
  fractional statistics.
- **Saddle:** the notes define a representation of the su(1,1) algebra. Its assigned
  quadratic observables require operator matching before interpretation as
  physical spatial measurements; a weighted moment is not a coincidence rate.
- **Loop collider:** noninteracting bosons and fermions have identical synchronized
  packets, a uniform spectral window and detectors integrated over all outgoing
  times. This calculation is not an anyon extension.
- **Independent notebooks:** Ising, Fibonacci, toric-code and K-matrix notebooks
  describe different theories. None solves a full interacting electron fluid or
  a noisy error-correction experiment.

Calculations are deterministic. The phonon tests cover normalization, conserved
energy, the Fourier sum rule and displacement variance, including an independent
small-chain Fock-space calculation. The pair series has a truncation bound;
collider quadrature reports a refinement error estimate, not a rigorous global
error bound. Extend the relevant checks when changing these models.

## Bundled assets

Keep math assets local so the site remains usable offline. See the
[KaTeX distribution notes](vendor/katex/README.md) for the font subset and refresh
procedure. Retain its license when updating the pinned package and bundled files.

The Fulsebakke et al. density panel is a credited vector figure under CC BY 4.0;
the repository's MIT license does not replace that license. Preserve its
[provenance and attribution](assets/README.md) when changing its presentation.
