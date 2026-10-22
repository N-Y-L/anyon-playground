# Reading notes and talks

I start with the [three-paper shortlist](../conversation.md). The sources below are longer companions for particular directions.

I have grouped them around saddle scattering, wire end modes and the interpretation of detector signals. Each entry identifies a connection to the calculations in these notes.

## Three calculations and their sources

**Dilation and scattering.** A dilation rescales a coordinate; in the [single-particle saddle](saddle.html), one coordinate contracts while its conjugate expands. [Subramanyan, Hegde, Vishveshwara and Bradlyn's inverted-oscillator article](https://arxiv.org/abs/2012.09875) develops this evolution and barrier scattering in several physical settings. I use its state preparation, observables and boundary conditions to check which parts of a comparison carry over.

**Majorana modes on a short chain.** [Kitaev's quantum-wire paper](https://arxiv.org/abs/cond-mat/0010440) starts the [wire calculation](wires.html). Each ordinary fermion operator can be written using two Hermitian Majorana operators. At zero chemical potential and equal positive hopping and pairing amplitudes, the Hamiltonian couples these Majorana operators across neighboring sites, leaving one unpaired at each end. A four-site chain already displays this pattern. [Hegde and Vishveshwara](https://arxiv.org/abs/1603.03394) connect the end profiles to their decay, spatial oscillations and changes of the potential away from this limit.

**Exchange in a detector signal.** [Vishveshwara's correlation proposal](https://arxiv.org/abs/cond-mat/0304568) and [Nakamura and collaborators' interferometry experiment](https://www.nature.com/articles/s41567-020-1019-1) approach statistics through different motions and observables. A device diagram with the measured quantity attached to its contacts makes the distinction concrete. The [detector notes](detectors.html) collect the corresponding amplitude and phase comparisons.

## Longer companions

[David Tong's quantum Hall lectures](https://arxiv.org/abs/1606.06687) give a continuous account from Landau levels to the fractional effect and field-theory descriptions. The wavefunction construction, quasiholes and effective descriptions provide context for the calculations used here.

[Feldman and Halperin](https://arxiv.org/abs/2102.08998) offer a detailed account of fractional charge, statistics and the logic of their detection. It is particularly useful when two papers use similar words for different measurement protocols. Its experimental survey covers work through its publication date; device-specific claims are documented in the original studies.

[Kitaev's honeycomb-model article](https://arxiv.org/abs/cond-mat/0506438) connects a lattice model to fusion, the combined excitation type of several anyons, and braiding, their exchange motions. Its appendices develop the basis changes denoted $F$ and the exchange matrices denoted $R$ in the calculations.

## Talks and associated questions

[Smitha Vishveshwara's Rutgers seminar, “From nano-constrictions to event horizons”](https://cmsr.rutgers.edu/newsevents-cmsr/event-details/1161-smitha-vishveshwara-from-nano-constrictions-to-event-horizons-facets-of-the-inverted-harmonic-oscillator), has a recording linked on the event page. The inverted oscillator is the common equation. Exponential stretching, scattering probabilities with a thermal form, and gravitational ringdown—the decaying wave signal after a disturbance—need different physical assumptions. The saddle figure isolates stretching and the probability of matching a fixed Gaussian reference state.

[The Perimeter talk “Braiding statistics of loops in three spatial dimensions”](https://pirsa.org/14120034) accompanies the [loop-braiding calculation](statistics.html#loops-have-motions-that-points-do-not). The linked-loop process raises a geometric question: which deformation ceases to be allowed when the third loop remains present?

Smitha Vishveshwara's [Illinois research page](https://physics.illinois.edu/people/directory/profile/smivish) places these connections in the broader setting of topological dynamics, ultracold gases and gravitation.

## Questions left by these calculations

- **Saddle:** which similarities between different wave problems follow from the shared equation, and which require a particular state or measurement?
- **Wire ramp:** when is slow preparation limited by a small energy gap, and when is it forbidden by conservation of even or odd fermion number?
- **Exchange signal:** which measurements distinguish an exchange phase from an ordinary phase accumulated during propagation?

The [source list](sources.html) collects the starting papers for all seven [directions](../directions.html).
