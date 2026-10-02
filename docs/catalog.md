# Ideas to explore next

Start with the five small models in the playground. Each isolates one question; none simulates an entire quantum Hall material. The extensions below are proposals, with enough detail to choose a next experiment.

## In the playground

| Model | Try this | What it establishes |
| --- | --- | --- |
| Abelian exchange and winding | Compare one exchange with one complete trip around another anyon. | A full winding accumulates twice the exchange angle. |
| Ideal interferometer | Change the number of enclosed anyons, then reduce visibility. | A statistical phase becomes observable when compared with a coherent reference route. |
| Ising braid order | Exchange neighboring pairs in different orders, then compare states and measurements. | Non-Abelian exchanges can act as matrices that do not commute. |
| Fibonacci fusion counts | Add one anyon at a time and keep track of each possible total charge. | The number of allowed fusion states follows a Fibonacci recurrence. |
| Toric-code loops | Wind an electric-type excitation, called $e$, around magnetic-type excitations, called $m$. | Each enclosed $m$ contributes a minus sign to an $e$ loop; this is a mutual statistical phase. |

The [references](references.md) identify the models' scientific sources. “Fusion” means combining anyons and asking which collective particle type, or *topological charge*, remains. A diagram of paths describes an operation; it does not by itself measure the resulting phase.

## Eight extensions

### 1. Can the same kind of anyon bunch and antibunch?

Keep the exchange rule fixed and vary the separation of two localized packets in the **lowest Landau level**: the lowest cyclotron-energy level for charged motion in a perpendicular magnetic field. Sum the specified angular-state weights and compare the mean squared separation with a matched distinguishable-particle preparation. Fractional-statistics packets in this model cross between larger and smaller separations than the reference; this reflects the prepared state, not a change of statistics or a force. **Intermediate:** a convergent numerical sum with limiting-case checks. [Vishveshwara & Cooper, 2010, Eqs. (3), (5), (6), Fig. 1](https://arxiv.org/abs/0908.3945).

### 2. Can a saddle turn a compact packet into a long, thin one?

Evolve a lowest-Landau-level packet under a quadratic saddle potential and plot its center and widths. The slow orbit-center coordinates do not commute: one width contracts as the other expands, resembling position–momentum squeezing. Then add a pair and track its outgoing position correlation, remembering that an average product of positions is not a detector-arm probability. **Intermediate:** linear evolution first, then the appropriate pair-state representation. [Subramanyan & Vishveshwara, 2019, Sec. IV](https://arxiv.org/abs/1905.00442).

### 3. What changes when a trap becomes a saddle?

Vary two curvatures of a quadratic potential using the cited preprint's two-anyon coherent states. Changing one curvature's sign turns a closed elliptical trap into a saddle: bounded oscillations become unbounded motion, with correlations affecting the evolution. Keep the state construction consistent; different definitions of a localized packet need not give identical curves. **Advanced:** projected quantum dynamics and convergence checks. [Basani, Subramanyan & Vishveshwara, 2025, Figs. 2–3](https://arxiv.org/abs/2509.15488v1), a preprint.

### 4. Why do experimental interference stripes jump?

Extend the ideal interferometer to a synthetic map with a magnetic-flux phase and an enclosed-particle count that changes at selected boundaries. Watch smooth fringes acquire jumps, then compare with the experiment's slips consistent with a full-winding phase of $2\pi/3$ at filling factor $1/3$. Actual device interpretation also needs electrostatics and edge motion. **Easy** for the illustration; advanced for fitting measurements. [Nakamura et al., 2020](https://arxiv.org/abs/2006.14115), an experiment separate from the bulk-packet proposals above.

### 5. Can an apparatus make fermions look as though they bunch?

Model an extended collider with several scattering routes and compare single-source and two-source signals. The paper finds apparent fermion bunching relative to a specified classical benchmark because each particle interferes with its own alternative routes; a different current correlator reveals mutual-statistics information. Begin with the paper's ordinary fermions and bosonic extension before attempting fractional statistics. **Advanced:** wave-packet scattering, time averaging, and precise benchmarks. [Samal, Vishveshwara, Gefen & Väyrynen, 2026](https://arxiv.org/abs/2412.19674v2).

### 6. Do the bends in a path matter?

Add a freehand closed-path editor and count complete windings around a pinned anyon, rejecting paths through it. Large changes of shape preserve the statistical phase while the winding stays fixed. Display a separate magnetic-flux phase that can change with enclosed area: topology fixes the statistical contribution, not every phase acquired in motion. **Easy:** planar geometry and complex phases. [Arovas, Schrieffer & Wilczek, 1984](https://doi.org/10.1103/PhysRevLett.53.722), for the quantum Hall geometric-phase calculation motivating this illustration.

### 7. Can a short braid approximate a chosen quantum gate?

Move from fusion counts to a two-dimensional encoded state, multiply Fibonacci braid matrices, and search short exchange sequences. Compare each operation with a target rotation while ignoring a common overall phase; watch the best error decrease as more candidates become available. Longer sequences are not automatically better, and Fibonacci matrices differ from the existing Ising matrices. **Intermediate** for short searches; advanced for efficient compilation. [Bonesteel et al., 2005, Figs. 1–3](https://arxiv.org/abs/quant-ph/0505065).

### 8. When does a wandering defect erase a stored bit?

Put the toric code on a periodic square grid, create a pair of excitations, extend the string separating them, and close it. Endpoints can disappear while a loop wrapping around the grid changes the encoded state. Later, add random errors and a decoder: an algorithm that infers corrections from measured defects. **Intermediate** for strings and parity; advanced for noisy decoding. [Kitaev, 2003, Sec. 1](https://arxiv.org/abs/quant-ph/9707021); the existing card illustrates only the mutual phase.

## Useful upstream software

Larger simulations benefit from established numerical tools. These repositories are optional resources, not bundled dependencies.

| Repository | Useful next step | Scope and license |
| --- | --- | --- |
| [QuTiP](https://github.com/qutip/qutip) | Finite-basis Hamiltonian evolution and open-system dynamics for packet experiments. | General quantum-dynamics library, not a ready-made anyon model. The anyon basis and Hamiltonian must still be supplied. [BSD-3-Clause](https://github.com/qutip/qutip/blob/master/LICENSE.txt). |
| [qecsim](https://github.com/qecsim/qecsim) | Toric-code errors, measurements, and decoding. | Includes a [toric-code model and matching decoder](https://qecsim.github.io/api/models/toric.html). An appropriate starting point for extension 8. [BSD-3-Clause](https://github.com/qecsim/qecsim/blob/master/LICENSE). |
| [Stim](https://github.com/quantumlib/Stim) | Larger stabilizer-circuit experiments and error-correction sampling. | Efficient for the restricted circuit operations used in stabilizer codes; it does not simulate arbitrary Fibonacci gates. [Apache-2.0](https://github.com/quantumlib/Stim/blob/main/LICENSE). |

An original implementation keeps these small demos easy to inspect; use a package for larger calculations and fork it when the package itself needs changes. Any upstream code used retains its own copyright and license requirements, as specified in the linked licenses.
