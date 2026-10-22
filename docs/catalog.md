# Preparation and measurement

An exchange rule constrains the possible states and their evolution, but does not specify how to prepare an excitation or detect it. The [main notes](notes.md) leave several questions about this distinction.

## Dependence on preparation

The two [localized-pair preparations](notes.md#replace-the-electron-fluid-by-two-effective-particles) have the same fractional exchange angle but different pair correlations. Which features persist across preparations, and which depend on how the excitations were localized or released?

[Vishveshwara and Cooper](https://arxiv.org/abs/0908.3945) and [Subramanyan and Vishveshwara](https://arxiv.org/abs/1905.00442) provide concrete examples of different state families. [Kjønsberg and Leinaas](https://arxiv.org/abs/cond-mat/9606214) connect the effective two-particle description to microscopic quasiholes. Comparing these constructions is a way to separate consequences of exchange symmetry from consequences of a chosen preparation.

## Dependence on the observable

A separation moment averages a power of the distance between particles. A coincidence probability counts joint detector events. A current correlation measures how currents fluctuate together. These observables weight the outgoing state differently; agreement in one does not imply agreement in the others.

The [saddle calculation](notes.md#let-a-saddle-amplify-a-correlation) makes this distinction explicit: a growing quadratic moment does not by itself determine a coincidence probability. Connecting the model to a detector requires its outgoing state, the measured operator and a physical account of the detector's response. The [transport discussion](directions/detectors.md) considers related issues for currents along a sample's boundary.

## The reference measurement

In the [extended collider](notes.md#when-a-splitter-has-an-interior), a reference intended to isolate mutual exchange must retain interference between paths already available to one particle. Anyons complicate the separation because some single-source histories can themselves contain braiding. A useful extension would have to determine which statistical contribution the chosen comparison actually isolates.

Interferometry has a related ambiguity. A charge transition can change both the statistical phase and the area enclosed by a path. The [Nakamura experiment](https://arxiv.org/abs/2006.14115) illustrates why topology and electrostatics must be considered together when interpreting a phase jump.

## Geometry and dynamics

[Further directions](directions.md) consider saddle potentials, wire end states, closed surfaces, Möbius geometry, time-dependent Hamiltonians and other exchange settings. Each changes the allowed motions, the available states or the observable. Some connections concern anyons directly; others concern the wider relation between topology and dynamics.

The [toric-code example](../experiments.html#toric) gives another microscopic starting point: a spin Hamiltonian in which moving one excitation around another produces a phase. Its [memory extension](../experiments.html#memory) shows how local defects can disappear while information stored in global properties of the state changes. The [fusion-basis calculation](../fusion-basis.html) instead examines the collective states that remain at fixed particle types and positions.
