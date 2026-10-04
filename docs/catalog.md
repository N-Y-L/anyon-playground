# Ideas to explore next

There is more to anyons than unusual exchange signs. Start with any of the experiments below, then follow the question that bothers you. The nine directions distinguish what you can already try from the next calculation; each gives a model, something to observe, and a pitfall worth catching.

The [contents](../index.html) give the implemented experiments and their reading order. Here the question is what calculation could follow each one; nothing below is implied to be implemented unless marked explicitly.

## Nine directions

### 1. Can the same kind of anyon bunch and antibunch?

**Implemented:** keep the exchange rule fixed and vary the separation of localized packets in the **lowest Landau level**, the lowest cyclotron-energy level in a perpendicular field. Their mean squared guiding-center separation crosses above or below a matched distinguishable-particle reference in the specified state family. The next calculation would compare this preparation with the coherent states of the later dynamics paper, then ask which detector observable distinguishes them. **Intermediate:** normalized angular-state sums and convergence checks; do not relabel the plotted moment as a coincidence probability. [Vishveshwara & Cooper, 2010, Eqs. (3), (5), (6)](https://arxiv.org/abs/0908.3945); [Subramanyan & Vishveshwara, 2019](https://arxiv.org/abs/1905.00442).

### 2. Can a saddle turn a compact packet into a long, thin one?

Evolve a lowest-Landau-level packet under a quadratic saddle potential and plot its center and widths. The slow orbit-center coordinates do not commute: one width contracts as the other expands, resembling position–momentum squeezing. Then add a pair and track its outgoing position correlation, remembering that an average product of positions is not a detector-arm probability. **Intermediate:** linear evolution first, then the appropriate pair-state representation. [Subramanyan & Vishveshwara, 2019, Sec. IV](https://arxiv.org/abs/1905.00442).

### 3. What changes when a trap becomes a saddle?

Vary two curvatures of a quadratic potential using the cited preprint's two-anyon coherent states. Changing one curvature's sign turns a closed elliptical trap into a saddle: bounded oscillations become unbounded motion, with correlations affecting the evolution. Keep the state construction consistent; different definitions of a localized packet need not give identical curves. **Advanced:** projected quantum dynamics and convergence checks. [Basani, Subramanyan & Vishveshwara, 2025, Figs. 2–3](https://arxiv.org/abs/2509.15488v1), a preprint.

### 4. Why do experimental interference stripes jump?

Give the ideal interferometer two controls: magnetic flux and enclosed-particle count, and plot a synthetic fringe map. The charge sets the electromagnetic phase response; statistics sets the contribution from winding around quasiparticles. Watch continuous stripes acquire jumps, then compare with the reported $2\pi/3$ slips at filling $1/3$. **Intermediate** for separating the two phase contributions; advanced for fitting a device, where electrostatics and edge motion also shift fringes—fractional charge alone does not measure statistics. [Nakamura et al., 2020](https://arxiv.org/abs/2006.14115) provides experimental evidence, distinct from the bulk-packet theory above.

A **proposed non-Abelian extension** asks a different question: can the fusion space remember which route was taken? If the routes leave normalized states $|u_a\rangle$ and $|u_b\rangle$, tracing over that unmeasured space weights the interference cross term by $\langle u_b|u_a\rangle$. Orthogonal records erase the fringe even when the joint state remains pure. Start with a two-dimensional fusion space before modeling repeated probes; [Bonderson, Shtengel, and Slingerland](https://arxiv.org/abs/0707.4206) develop the measurement theory.

### 5. Can an apparatus make fermions look as though they bunch?

Model an extended collider with several scattering routes and compare single-source and two-source signals. The paper finds apparent fermion bunching relative to a specified classical benchmark because each particle interferes with its own alternative routes; a different current correlator reveals mutual-statistics information. Begin with the paper's ordinary fermions and bosonic extension before attempting fractional statistics. **Advanced:** wave-packet scattering, time averaging, and precise benchmarks. [Samal, Vishveshwara, Gefen & Väyrynen, 2026](https://arxiv.org/abs/2412.19674v2).

### 6. Do the bends in a path matter?

**Implemented starting point:** deform the two separated-particle paths while keeping their exchange or winding fixed, and inspect the unchanged statistical factor. The [Berry experiment](../berry.html) now supplies the geometric counterexample: a spin loop whose phase changes with its solid angle. A further model would accept a freehand closed loop around a pinned anyon and calculate both winding and enclosed area. Compare the unchanged statistical contribution with an area-dependent magnetic-flux phase; their sum need not remain fixed under deformation. **Intermediate**, with collision rejection essential: a path through the anyon leaves the assumed separated-particle model. [Arovas, Schrieffer & Wilczek, 1984](https://doi.org/10.1103/PhysRevLett.53.722).

### 7. Can a short braid approximate a chosen quantum gate?

**Implemented starting point:** [construct and compare Fibonacci braid matrices](../fusion-basis.html), including inverse and braid-relation checks. The next calculation would choose a target qubit rotation and search short products, comparing operations up to overall phase. Watch the best approximation improve as more candidates become available, then compare with the restricted set reachable by Ising braids alone. This asks what non-Abelian exchange can actually compute: order dependence does not guarantee universality. **Intermediate** for short searches; advanced for efficient compilation, and increasing length helps only when useful sequences are found. [Bonesteel et al., 2005](https://arxiv.org/abs/quant-ph/0505065) constructs Fibonacci gates; [Bravyi, 2006](https://arxiv.org/abs/quant-ph/0511178) supplies an additional resource for Ising computation.

### 8. Can a memory change after every defect disappears?

**Implemented:** create an open $X$ string on the periodic grid, wrap it around, and close it. The endpoints cost energy; the intervening string does not. Annihilating them restores the ground energy yet can reverse a definite crossing logical $Z$ value. Next, inject random local errors and let a decoder choose corrections from endpoint measurements, then count incorrect logical operations. **Advanced** for a credible memory benchmark: topological protection limits what small local disturbances can do, but it does not make a two-dimensional memory automatically immune to accumulated errors. [Kitaev, 2003](https://arxiv.org/abs/quant-ph/9707021); [Dennis et al., 2002](https://arxiv.org/abs/quant-ph/0110143).

### 9. Can the ground state reveal anyons before you move one?

Start with a toric-code ground state, choose a region of edge qubits, and calculate its entanglement entropy from the independent stabilizers supported there. Then combine entropies of overlapping regions to cancel the ordinary boundary contribution. For suitable large regions in a gapped two-dimensional topological phase, the remaining term measures the total quantum dimension: $\gamma=\ln\mathcal D$, with $\mathcal D=\sqrt{\sum_a d_a^2}$. Each $d_a$ describes the asymptotic growth of fusion states for type $a$; it is not the dimension of a local particle's Hilbert space. **Proposed, intermediate to advanced:** begin at the exactly solvable point and check region geometry and finite-size effects before interpreting a fitted constant. [Kitaev and Preskill](https://arxiv.org/abs/hep-th/0510092) and [Levin and Wen](https://arxiv.org/abs/cond-mat/0510613) give complementary subtraction constructions. This probes ground-state structure rather than an exchange protocol.

## Useful upstream software

Larger simulations benefit from established numerical tools. These repositories are optional resources, not bundled dependencies.

| Repository | Useful next step | Scope and license |
| --- | --- | --- |
| [QuTiP](https://github.com/qutip/qutip) | Finite-basis Hamiltonian evolution and open-system dynamics for packet experiments. | General quantum-dynamics library, not a ready-made anyon model. The anyon basis and Hamiltonian must still be supplied. [BSD-3-Clause](https://github.com/qutip/qutip/blob/master/LICENSE.txt). |
| [qecsim](https://github.com/qecsim/qecsim) | Toric-code errors, measurements, and decoding. | Includes a [toric-code model and matching decoder](https://qecsim.github.io/api/models/toric.html). An appropriate starting point for extension 8. [BSD-3-Clause](https://github.com/qecsim/qecsim/blob/master/LICENSE). |
| [Stim](https://github.com/quantumlib/Stim) | Larger stabilizer-circuit experiments and error-correction sampling. | Efficient for the restricted circuit operations used in stabilizer codes; it does not simulate arbitrary Fibonacci gates. [Apache-2.0](https://github.com/quantumlib/Stim/blob/main/LICENSE). |
