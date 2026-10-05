# Further calculations

The [connected notes](notes.md) leave three concrete calculations open. Each would add physical information missing from the displayed models.

## Prepare the pair microscopically

Put two weak repulsive pinning potentials into a finite Laughlin droplet and calculate its low-energy states as the pins move or are released. Compare the resulting effective amplitudes with the two preparation families in the notes. The radial moment is a first test; off-diagonal quadratic matrix elements test the operator mapping as well. Finite-size convergence, separation from the edge and leakage out of the quasihole manifold matter here.

[Kjønsberg–Leinaas](https://arxiv.org/abs/cond-mat/9606214) supplies the microscopic-to-anyon state map. [Vishveshwara–Cooper](https://arxiv.org/abs/0908.3945) uses the projected-coordinate preparation, while [Subramanyan–Vishveshwara](https://arxiv.org/abs/1905.00442) develops the generalized coherent construction. The [2025 quadratic-potential preprint](https://arxiv.org/abs/2509.15488) extends the latter's dynamics. These sources do not make the preparations interchangeable.

## Give the outgoing state a detector

The saddle figure evolves assigned quadratic moments. A detector with a specified spatial acceptance and time window instead needs an outgoing-state probability. Calculate that probability and compare it with the weighted moment; their signs need not contain the same information. The distinction already occurs for ordinary particles, before an anyon extension is attempted.

For the [extended collider](https://arxiv.org/abs/2412.19674), change the incident spectral shape while retaining identical source preparations. Determine how the one-source reference and the exchange overlap change separately. The existing loop model uses a uniform spectral window; a Gaussian or experimentally measured spectrum would be a new calculation.

## Retain the right phase information

The calibrated boson/fermion reference removes single-particle contributions. In an anyon device, some single-source processes already carry braiding information. Deriving the appropriate subtraction requires a model of those tunneling histories, rather than a continuous exchange-angle replacement in a boson/fermion formula.

Interferometry poses a related control problem: an enclosed-charge transition can move the edge, changing the ordinary flux phase at the same time as the statistical phase. The [Nakamura author manuscript](https://arxiv.org/abs/2006.14115) shows how device electrostatics enters the interpretation.

## Independent branches

The [toric-code note](../experiments.html#toric) gives an explicit lattice Hamiltonian with mutual statistics. Its [memory extension](../experiments.html#memory) explains why removing all local defects need not restore the original encoded state. The [Abelian notebook](../abelian.html) compares fusion and statistics. The [fusion-basis notebook](../fusion-basis.html) develops operations in a collective space and connects them to interacting anyon chains. These are useful separate problems rather than prerequisites for the bulk-pair calculation.

## Useful upstream software

[QuTiP](https://github.com/qutip/qutip) provides quantum-state dynamics; [qecsim](https://github.com/qecsim/qecsim) and [Stim](https://github.com/quantumlib/Stim) address stabilizer-code and error-correction calculations. They solve different problems. None is needed to run this site, and using one would not by itself supply the microscopic model or detector mapping required above.
