# Preparation and measurement

The [anyon introduction](notes.md) establishes what exchange can do to a quantum state. The [pair and transport calculations](transport.md) ask how that change becomes visible. They suggest three concrete comparisons, each separating an exchange rule from the additional physics needed to use it.

## Change the preparation, keep the exchange rule

The two [localized-pair preparations](transport.md#replace-the-electron-fluid-by-two-effective-particles) have the same fractional exchange angle but different pair correlations. [Vishveshwara and Cooper](https://arxiv.org/abs/0908.3945) and [Subramanyan and Vishveshwara](https://arxiv.org/abs/1905.00442) supply these state families. [Kjønsberg and Leinaas](https://arxiv.org/abs/cond-mat/9606214) connect the effective two-particle description to microscopic quasiholes.

Evolving both preparations through the same potential and calculating the same observable gives a controlled comparison. Which features persist, and which reflect the way the excitations were localized? A further variation is to add an interaction energy depending on particle separation while retaining the same exchange rule. Its effect on the signal would test how much a proposed signature depends on the assumed dynamics.

## Change the observable, keep the outgoing state

A separation moment averages a power of the distance between particles. A coincidence probability measures how often specified joint detector events occur. A current correlation measures how currents fluctuate together. These observables weight the outgoing state differently.

The [saddle calculation](transport.md#let-a-saddle-amplify-a-correlation) determines a growing quadratic moment. To predict joint arrivals in two outputs, one must instead specify the collection regions and calculate the probability of detecting one excitation in each. Does the feature identified in the moment survive that change of observable? Finite collection windows and arrival-time resolution then become explicit parts of the calculation. The [detector chapter](directions/detectors.md) considers the related problem for currents along a sample's boundary.

## Change the reference, keep the propagation

In the [extended collider](transport.md#when-a-splitter-has-an-interior), a reference intended to isolate mutual exchange must retain interference between paths already available to one particle. [Samal and collaborators](https://arxiv.org/html/2412.19674) show this for bosons and fermions. Their paper leaves an anyonic extension unresolved: histories with only one source active can already contain braiding. Which of these histories should the reference retain, and which statistical contribution would subtraction isolate?

Interferometry poses a related inference problem. A change in enclosed charge can alter both the statistical phase and the area enclosed by a path. The [Nakamura experiment](https://arxiv.org/abs/2006.14115) shows why independent control of this electrostatic response matters. Comparing the reference process is as important as calculating the signal.

## From readout to preparation and geometry

These comparisons concern the readout of statistics. The other [research directions](directions.md) ask how finite energy splittings and conserved parity constrain manipulation, and how a sphere or Möbius band changes the allowed states. They connect the same distinction—what topology fixes and what the Hamiltonian must supply—to different physical problems.

The [toric-code example](../experiments.html#toric) provides another microscopic starting point: a spin Hamiltonian in which moving one excitation around another produces a phase. Its [memory calculation](../experiments.html#memory) follows how local defects can disappear while information stored globally changes. The [fusion-basis calculation](../fusion-basis.html) instead examines collective states at fixed particle types and positions.
