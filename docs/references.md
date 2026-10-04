# Sources and reading routes

These are research sources for the playground and its [possible extensions](catalog.md), with a review specifying the Ising conventions. Start with a question and its figure; the full derivations can wait until the symbols are familiar.

## The small models

1. **Abelian statistics and a phase from going around another particle.** D. Arovas, J. R. Schrieffer, and F. Wilczek, “Fractional Statistics and the Quantum Hall Effect,” *Physical Review Letters* **53**, 722–723 (1984). [Publisher / DOI](https://doi.org/10.1103/PhysRevLett.53.722). A geometric-phase calculation for quantum Hall quasiholes. The playground isolates the statistical phase and treats ordinary propagation phases separately.

   Two complementary foundations are J. M. Leinaas and J. Myrheim, “On the theory of identical particles,” *Il Nuovo Cimento B* **37**, 1–23 (1977), [DOI](https://doi.org/10.1007/BF02727953), for configuration space; and R. B. Laughlin, “Anomalous Quantum Hall Effect: An Incompressible Quantum Fluid with Fractionally Charged Excitations,” *Physical Review Letters* **50**, 1395–1398 (1983), [DOI](https://doi.org/10.1103/PhysRevLett.50.1395), for the fractional quantum Hall state and its charged excitations. Fractional charge and exchange statistics are distinct statements.

2. **Noncommuting exchanges.** D. A. Ivanov, “Non-Abelian Statistics of Half-Quantum Vortices in p-Wave Superconductors,” *Physical Review Letters* **86**, 268–271 (2001). [Open preprint](https://arxiv.org/abs/cond-mat/0005069), [DOI](https://doi.org/10.1103/PhysRevLett.86.268). Derives exchange operations for vortices with Majorana modes. A primary route to the Ising-type exchange algebra; the playground uses an abstract fusion basis rather than a microscopic superconductor.

   For the exact Ising exchange phases and basis-change matrix used here, see C. Nayak, S. H. Simon, A. Stern, M. Freedman, and S. Das Sarma, “Non-Abelian Anyons and Topological Quantum Computation,” *Reviews of Modern Physics* **80**, 1083–1159 (2008), Sec. II.A.1 and Eq. (50). Section II.A.2 discusses adiabatic transport, dynamical phases, and Berry phases. [Open review](https://arxiv.org/abs/0707.1889), [DOI](https://doi.org/10.1103/RevModPhys.80.1083).

3. **Fibonacci fusion and gates.** N. E. Bonesteel, L. Hormozi, G. Zikos, and S. H. Simon, “Braid Topologies for Quantum Computation,” *Physical Review Letters* **95**, 140503 (2005). [Open preprint](https://arxiv.org/abs/quant-ph/0505065), [DOI](https://doi.org/10.1103/PhysRevLett.95.140503). Start with Fig. 1 and the fusion counting before the gate-search construction. Counts of allowed states do not determine their measurement probabilities.

   A useful contrast is S. Bravyi, “Universal Quantum Computation with the $\nu=5/2$ Fractional Quantum Hall State,” *Physical Review A* **73**, 042313 (2006). [Open preprint](https://arxiv.org/abs/quant-ph/0511178), [DOI](https://doi.org/10.1103/PhysRevA.73.042313). Ising braiding alone is not universal; this paper proposes additional operations to overcome that restriction. It is a computational proposal, not an experimental demonstration.

4. **Toric-code excitations, loops, and encoded states.** A. Yu. Kitaev, “Fault-tolerant quantum computation by anyons,” *Annals of Physics* **303**, 2–30 (2003; preprint 1997). [Open preprint](https://arxiv.org/abs/quant-ph/9707021), [DOI](https://doi.org/10.1016/S0003-4916(02)00018-0). Sections 1–2 give the lattice Hamiltonian, four-dimensional torus ground space, and string operations. The playground's periodic memory experiment isolates endpoint and logical-loop parity; it does not simulate a noisy memory's lifetime.

   For strings, measured error syndromes, and logical errors, see E. Dennis, A. Kitaev, A. Landahl, and J. Preskill, “Topological quantum memory,” *Journal of Mathematical Physics* **43**, 4452–4505 (2002). [Open preprint](https://arxiv.org/abs/quant-ph/0110143), [DOI](https://doi.org/10.1063/1.1499754). This is a useful next source after the small pair-creation experiment.

## From exchange rules to measurable signals

5. **Localized pairs and changing correlations.** S. Vishveshwara and N. R. Cooper, “Correlations and beam splitters for quantum Hall anyons,” *Physical Review B* **81**, 201306(R) (2010). [Open preprint](https://arxiv.org/abs/0908.3945), [DOI](https://doi.org/10.1103/PhysRevB.81.201306). The implemented correlation experiment evaluates the localized-state weights of Eq. (3) and the mean squared guiding-center separation comparison in Eqs. (5)–(6). Compare the sign crossover with Fig. 1; the paper's later saddle calculation concerns turning these static correlations into motion.

6. **Bulk motion and interferometry.** V. Subramanyan and S. Vishveshwara, “Correlations, dynamics, and interferometry of anyons in the lowest Landau level,” *Journal of Statistical Mechanics: Theory and Experiment* **2019**, 104003. [Open preprint](https://arxiv.org/abs/1905.00442), [DOI](https://doi.org/10.1088/1742-5468/ab3aef). Develops localized states, harmonic motion, saddle squeezing, and a proposed bulk interferometer. This is theory, not a report of device measurements.

7. **A broader set of quadratic potentials.** P. Basani, V. Subramanyan, and S. Vishveshwara, “Symmetries and dynamics of quantum Hall bulk anyons in quadratic potentials,” [arXiv:2509.15488v1](https://arxiv.org/abs/2509.15488v1) (2025). Preprint. Compare the bounded and unbounded potentials in Figs. 2–3. Its particular coherent-state construction is part of the model and should be retained when reproducing the results.

8. **Why the collider geometry matters.** S. S. Samal, S. Vishveshwara, Y. Gefen, and J. I. Väyrynen, “Quantum statistics and self-interference in extended colliders,” *Physical Review Letters* **136**, 076301 (2026). [Open published-version preprint](https://arxiv.org/abs/2412.19674v2), [DOI](https://doi.org/10.1103/td98-5ltj). Separates apparatus-dependent single-particle interference from mutual-statistics information in fermionic and bosonic collider models.

9. **An experimental fringe pattern.** J. Nakamura, S. Liang, G. C. Gardner, and M. J. Manfra, “Direct observation of anyonic braiding statistics,” *Nature Physics* **16**, 931–936 (2020). [Open preprint](https://arxiv.org/abs/2006.14115), [DOI](https://doi.org/10.1038/s41567-020-1019-1). Reports interferometer phase slips consistent with the expected fractional statistics at filling factor $1/3$. Its measured device signal is more detailed than the playground's ideal two-route probability.

For a first reading, try **5 → 6** to move from pair correlations to motion, or **1 → 9** to connect a statistical phase with an experiment. For quantum information, try **4 → 2 → 3**. These are different physical models; a toric-code $e$ or $m$ excitation, an Ising anyon, a Fibonacci anyon, and a fractional-quantum-Hall quasihole should not be treated as interchangeable.

## Tools behind the pictures

10. **Calculate a geometric phase.** M. V. Berry, “Quantal phase factors accompanying adiabatic changes,” *Proceedings of the Royal Society A* **392**, 45–57 (1984). [DOI](https://doi.org/10.1098/rspa.1984.0023). The spin experiment separates the geometric contribution from the dynamical phase and compares a closed product of discrete overlaps with the solid-angle result.

11. **Replace a phase by a matrix.** F. Wilczek and A. Zee, “Appearance of Gauge Structure in Simple Dynamical Systems,” *Physical Review Letters* **52**, 2111–2114 (1984). [DOI](https://doi.org/10.1103/PhysRevLett.52.2111). Degenerate adiabatic evolution can mix states. This is a foundation for understanding fusion-space transport, not by itself evidence of anyons.

12. **Compute with arbitrary eigenvector phases.** T. Fukui, Y. Hatsugai, and H. Suzuki, “Chern Numbers in Discretized Brillouin Zone: Efficient Method of Computing (Spin) Hall Conductances,” *Journal of the Physical Society of Japan* **74**, 1674–1677 (2005). [Preprint](https://arxiv.org/abs/cond-mat/0503172), [DOI](https://doi.org/10.1143/JPSJ.74.1674). Normalized overlaps provide gauge-invariant loop products. The playground uses the one-loop construction; it does not compute a band Chern number.

13. **Know when slow is too slow.** M. Cheng, V. Galitski, and S. Das Sarma, “Non-adiabatic Effects in the Braiding of Non-Abelian Anyons in Topological Superconductors,” *Physical Review B* **84**, 104529 (2011). [Preprint](https://arxiv.org/abs/1106.2549), [DOI](https://doi.org/10.1103/PhysRevB.84.104529). Separates unwanted transitions from dynamical effects of a split low-energy space; this motivates checking more than the bulk gap.

14. **Read Abelian topological data.** Y.-M. Lu and A. Vishwanath, “Theory and classification of interacting ‘integer’ topological phases in two dimensions: A Chern-Simons approach,” *Physical Review B* **86**, 125119 (2012). [Preprint](https://arxiv.org/abs/1205.3156), [DOI](https://doi.org/10.1103/PhysRevB.86.125119). Section II.A collects the general $K$-matrix formulas used here, although the paper's main classification concerns phases without intrinsic topological order. Their “Classification and properties of symmetry-enriched topological phases: Chern-Simons approach with applications to $Z_2$ spin liquids,” *Physical Review B* **93**, 155121 (2016), [preprint](https://arxiv.org/abs/1302.2634), [DOI](https://doi.org/10.1103/PhysRevB.93.155121), gives toric-code and double-semion examples.

15. **See topology in the ground state.** A. Kitaev and J. Preskill, “Topological entanglement entropy,” *Physical Review Letters* **96**, 110404 (2006), [preprint](https://arxiv.org/abs/hep-th/0510092), and M. Levin and X.-G. Wen, “Detecting topological order in a ground state wave function,” *Physical Review Letters* **96**, 110405 (2006), [preprint](https://arxiv.org/abs/cond-mat/0510613). These motivate the catalog's proposed entanglement experiment; it is not implemented in the playground. Their entropy combinations remove local boundary contributions under specified geometric and scale assumptions.

16. **Build matrices from fusion trees.** S. Trebst, M. Troyer, Z. Wang, and A. W. W. Ludwig, “A short introduction to Fibonacci anyon models,” *Progress of Theoretical Physics Supplement* **176**, 384 (2008), [preprint](https://arxiv.org/abs/0902.3275), develops the basis construction and interacting-anyon Hamiltonians. The numerical exchange convention in the playground follows S. Bseiso et al., “Minimal Quantum Circuits for Simulating Fibonacci Anyons,” [arXiv:2407.21761v2](https://arxiv.org/html/2407.21761v2#S2.SS1) (2024), Sec. II.1: right-handed Fibonacci data, with positive exchange counterclockwise. This convention matters when comparing matrices across papers.

17. **Turn a fusion preference into an interaction.** A. Feiguin et al., “Interacting anyons in topological quantum liquids: The golden chain,” *Physical Review Letters* **98**, 160409 (2007), [preprint](https://arxiv.org/abs/cond-mat/0612341), [DOI](https://doi.org/10.1103/PhysRevLett.98.160409). Its local interaction favors one neighboring fusion channel. The F-matrix converts that projector into the common basis needed to assemble a many-anyon Hamiltonian.

18. **Connect bulk data to edges.** X.-G. Wen, “Topological orders and edge excitations in fractional quantum Hall states,” *Advances in Physics* **44**, 405 (1995), [preprint](https://arxiv.org/abs/cond-mat/9506066), [DOI](https://doi.org/10.1080/00018739500101566). A broader introduction to the K-matrix description, torus degeneracy, and edge excitations. The compact Abelian note uses these ideas without assuming the field-theory formalism.

Three routes through the foundations:

- **Transport:** [exchange](../experiments.html#exchange) → [interference](../experiments.html#interference) → [Berry phase](../berry.html) → Arovas–Schrieffer–Wilczek.
- **Operations:** [fusion counting](../experiments.html#fusion) → [fusion bases](../fusion-basis.html) → [Ising readout](../experiments.html#braids) → Fibonacci gate construction.
- **Phases of matter:** [toric strings](../experiments.html#toric) → [memory](../experiments.html#memory) → [$K$ matrices](../abelian.html) → perturbations and microscopic realizations.

19. **Let the fusion space retain a route record.** P. Bonderson, K. Shtengel, and J. K. Slingerland, “Interferometry of non-Abelian Anyons,” *Annals of Physics* **323**, 2709–2755 (2008). [Open preprint](https://arxiv.org/abs/0707.4206), [DOI](https://doi.org/10.1016/j.aop.2008.01.012). Develops measurement theory for specified anyonic interferometers. The coherent-control example in the Ising note is a simpler thought experiment calculated directly from that note's braid matrices.

## Software provenance

- [**QuTiP — upstream repository**](https://github.com/qutip/qutip): quantum dynamics in Python; [BSD-3-Clause license](https://github.com/qutip/qutip/blob/master/LICENSE.txt).
- [**qecsim — upstream repository**](https://github.com/qecsim/qecsim): stabilizer-code and decoder simulations, including the toric code; [BSD-3-Clause license](https://github.com/qecsim/qecsim/blob/master/LICENSE).
- [**Stim — upstream repository**](https://github.com/quantumlib/Stim): stabilizer-circuit simulation and sampling; [Apache-2.0 license](https://github.com/quantumlib/Stim/blob/main/LICENSE).

These are reference projects for possible extensions. The [catalog](catalog.md#useful-upstream-software) explains which problem each solves and the limits of its scope.
