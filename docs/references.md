# Sources and reading routes

These are research sources for the playground and its [possible extensions](catalog.md), with a review specifying the Ising conventions. Start with a question and its figure; the full derivations can wait until the symbols are familiar.

## The small models

1. **Abelian statistics and a phase from going around another particle.** D. Arovas, J. R. Schrieffer, and F. Wilczek, “Fractional Statistics and the Quantum Hall Effect,” *Physical Review Letters* **53**, 722–723 (1984). [Publisher / DOI](https://doi.org/10.1103/PhysRevLett.53.722). A geometric-phase calculation for quantum Hall quasiholes. The playground isolates the statistical phase and treats ordinary propagation phases separately.

2. **Noncommuting exchanges.** D. A. Ivanov, “Non-Abelian Statistics of Half-Quantum Vortices in p-Wave Superconductors,” *Physical Review Letters* **86**, 268–271 (2001). [Open preprint](https://arxiv.org/abs/cond-mat/0005069), [DOI](https://doi.org/10.1103/PhysRevLett.86.268). Derives exchange operations for vortices with Majorana modes. A primary route to the Ising-type exchange algebra; the playground uses an abstract fusion basis rather than a microscopic superconductor.

   For the exact Ising exchange phases and basis-change matrix used here, see C. Nayak, S. H. Simon, A. Stern, M. Freedman, and S. Das Sarma, “Non-Abelian Anyons and Topological Quantum Computation,” *Reviews of Modern Physics* **80**, 1083–1159 (2008), Sec. II.A.1 and Eq. (50). [Open review](https://arxiv.org/abs/0707.1889), [DOI](https://doi.org/10.1103/RevModPhys.80.1083).

3. **Fibonacci fusion and gates.** N. E. Bonesteel, L. Hormozi, G. Zikos, and S. H. Simon, “Braid Topologies for Quantum Computation,” *Physical Review Letters* **95**, 140503 (2005). [Open preprint](https://arxiv.org/abs/quant-ph/0505065), [DOI](https://doi.org/10.1103/PhysRevLett.95.140503). Start with Fig. 1 and the fusion counting before the gate-search construction. Counts of allowed states do not determine their measurement probabilities.

4. **Toric-code excitations and loops.** A. Yu. Kitaev, “Fault-tolerant quantum computation by anyons,” *Annals of Physics* **303**, 2–30 (2003; preprint 1997). [Open preprint](https://arxiv.org/abs/quant-ph/9707021), [DOI](https://doi.org/10.1016/S0003-4916(02)00018-0). Section 1 introduces the lattice model, its electric and magnetic excitations, and their mutual phase. A full code also has collective states and logical operations that the small phase illustration omits.

## From exchange rules to measurable signals

5. **Localized pairs and changing correlations.** S. Vishveshwara and N. R. Cooper, “Correlations and beam splitters for quantum Hall anyons,” *Physical Review B* **81**, 201306(R) (2010). [Open preprint](https://arxiv.org/abs/0908.3945), [DOI](https://doi.org/10.1103/PhysRevB.81.201306). Start with Fig. 1. Equations (3), (5), and (6) specify the preparation and correlation measure; the later saddle calculation connects them to motion.

6. **Bulk motion and interferometry.** V. Subramanyan and S. Vishveshwara, “Correlations, dynamics, and interferometry of anyons in the lowest Landau level,” *Journal of Statistical Mechanics: Theory and Experiment* **2019**, 104003. [Open preprint](https://arxiv.org/abs/1905.00442), [DOI](https://doi.org/10.1088/1742-5468/ab3aef). Develops localized states, harmonic motion, saddle squeezing, and a proposed bulk interferometer. This is theory, not a report of device measurements.

7. **A broader set of quadratic potentials.** P. Basani, V. Subramanyan, and S. Vishveshwara, “Symmetries and dynamics of quantum Hall bulk anyons in quadratic potentials,” [arXiv:2509.15488v1](https://arxiv.org/abs/2509.15488v1) (2025). Preprint. Compare the bounded and unbounded potentials in Figs. 2–3. Its particular coherent-state construction is part of the model and should be retained when reproducing the results.

8. **Why the collider geometry matters.** S. S. Samal, S. Vishveshwara, Y. Gefen, and J. I. Väyrynen, “Quantum statistics and self-interference in extended colliders,” *Physical Review Letters* **136**, 076301 (2026). [Open published-version preprint](https://arxiv.org/abs/2412.19674v2), [DOI](https://doi.org/10.1103/td98-5ltj). Separates apparatus-dependent single-particle interference from mutual-statistics information in fermionic and bosonic collider models.

9. **An experimental fringe pattern.** J. Nakamura, S. Liang, G. C. Gardner, and M. J. Manfra, “Direct observation of anyonic braiding statistics,” *Nature Physics* **16**, 931–936 (2020). [Open preprint](https://arxiv.org/abs/2006.14115), [DOI](https://doi.org/10.1038/s41567-020-1019-1). Reports interferometer phase slips consistent with the expected fractional statistics at filling factor $1/3$. Its measured device signal is more detailed than the playground's ideal two-route probability.

For a first reading, try **5 → 6** to move from pair correlations to motion, or **1 → 9** to connect a statistical phase with an experiment. For quantum information, try **4 → 2 → 3**. These are different physical models; a toric-code $e$ or $m$ excitation, an Ising anyon, a Fibonacci anyon, and a fractional-quantum-Hall quasihole should not be treated as interchangeable.

## Software provenance

10. [**QuTiP — upstream repository**](https://github.com/qutip/qutip): quantum dynamics in Python; [BSD-3-Clause license](https://github.com/qutip/qutip/blob/master/LICENSE.txt).
11. [**qecsim — upstream repository**](https://github.com/qecsim/qecsim): stabilizer-code and decoder simulations, including the toric code; [BSD-3-Clause license](https://github.com/qecsim/qecsim/blob/master/LICENSE).
12. [**Stim — upstream repository**](https://github.com/quantumlib/Stim): stabilizer-circuit simulation and sampling; [Apache-2.0 license](https://github.com/quantumlib/Stim/blob/main/LICENSE).

These are reference projects for possible extensions. The [catalog](catalog.md#useful-upstream-software) explains which problem each solves and the limits of its scope.
