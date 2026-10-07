# Ask what the detector actually knows

An exchange rule tells you how a quantum state changes when excitations are exchanged. A detector returns a current, a count, a voltage or a temperature. The interesting work lies between those two sentences.

The [anyon notes](../notes.html) followed a prepared pair through an assigned saddle Hamiltonian to a weighted moment. They also identified the remaining step: match the effective operators to the physical system and derive the detector's observable. Now change the detector. Which part of that argument must you rebuild?

## Start with the quantity on the vertical axis

Before reading an experimental interpretation, write down the measured observable. For stationary currents, a cross-correlation is a quantity of the form

$$S_{12}=\int_{-\infty}^{\infty}dt\,\frac12\langle\Delta I_1(t)\Delta I_2(0)+\Delta I_2(0)\Delta I_1(t)\rangle,$$

where $\Delta I_j=I_j-\langle I_j\rangle$ is the fluctuation of the current at detector $j$. This convention gives a symmetrized, zero-frequency correlation. Papers may use different factors or normalizations; compare definitions before comparing numbers.

A negative value describes anticorrelation after integrating over time delays; it need not describe every delay separately. To infer statistics, you still need to know what was injected, how particles or quasiparticles propagated, and what the contacts did. Even ordinary partitioning produces correlations. The useful question is: **which change in the signal distinguishes the proposed statistical process from the alternatives in this device?**

## Two paths can reveal one exchange

Suppose a detector outcome can arise through a direct amplitude $A_D$ and an exchanged amplitude $A_E$. If the exchange contributes the phase $e^{i\theta}$, the probability contains

$$|A_D+e^{i\theta}A_E|^2
=|A_D|^2+|A_E|^2+2\operatorname{Re}\!\left(e^{i\theta}A_EA_D^*\right).$$

There is the opening for statistics: two experimentally indistinguishable alternatives interfere. But their relative dynamical phase and their distinguishability also matter. If the alternatives become distinguishable, adding a statistical phase alone does not restore the missing interference term.

[Vishveshwara's Hanbury Brown–Twiss proposal](https://arxiv.org/abs/cond-mat/0304568) turns this idea into a calculation for Laughlin edge quasiparticles, with two sources and two sinks. After subtracting the correlations measured with each source alone, its equal-time correlator contains a cosine of the exchange angle. That equal-time result is distinct from the time-integrated $S_{12}$ above. Read the device and weak-tunneling assumptions alongside the cosine: the proposal connects a specific correlator to an edge model.

**Try this on paper.** Set $A_D=A_E=1/2$, and compare $\theta=0$, $\pi/3$ and $\pi$. Then give $A_E$ an extra phase $\varphi$. Your detector now sees $\theta+\varphi$. What independent calibration would let you separate them?

## Encircling gives a different phase

For identical Abelian anyons, two exchanges in the same sense give a full braid, with phase $e^{2i\theta}$. A path that surrounds a localized quasiparticle therefore probes a different motion from one half-exchange.

In a simple fixed-area interferometer description, the phase is

$$\phi=2\pi\frac{q}{e}\frac{\Phi}{\Phi_0}+N_{\rm enc}(2\theta)+\phi_0,
\qquad \Phi_0=\frac he.$$

Here $q$ is the interfering quasiparticle's charge, $\Phi$ the enclosed flux, $N_{\rm enc}$ the number of enclosed quasiparticles of the same relevant type, and $\phi_0$ a reference phase. Signs depend on the charge and path conventions. The first term is electromagnetic; the second is statistical.

[Nakamura and collaborators](https://www.nature.com/articles/s41567-020-1019-1) observed interference phase slips at filling $\nu=1/3$ consistent with a full-braid phase $2\pi/3$. Screening layers reduce coupling between interior charge and the edge, and the [author manuscript](https://arxiv.org/abs/2006.14115) explains the checks on accompanying ordinary phase shifts. This is why the electrostatics matters: changing enclosed charge can also change the effective path area and hence its electromagnetic phase.

If you measure only $e^{2i\theta}$, you determine $\theta$ modulo $\pi$. Recovering a particular exchange angle requires additional physical information. Keep the half-exchange and full braid labeled throughout the calculation.

## A collider adds dynamics to the inference

In an electronic anyon collider, dilute incoming beams meet a tunneling contact and the outgoing current fluctuations are compared. [Rosenow, Levkivskyi and Halperin](https://arxiv.org/abs/1509.08470) calculate this observable for fractional quantum Hall edges. Their result ties the correlations to the quasiparticle statistics through the dynamics of the edge and tunneling process.

This is a useful next step after the two-amplitude exercise: the measured signal is assembled from many tunneling histories and source events. A pair wavefunction in an unbounded saddle and a current-noise experiment are different measurement problems. To compare them, explicitly construct the outgoing state and the detector observable in each case.

### Random arrivals can still carry a phase

Here is a short calculation behind the [time-domain braiding interpretation](https://arxiv.org/abs/2510.04319v2). A tunneling correlator compares events at two times. In the simple Laughlin-edge model, each beam anyon passing between them contributes a full-braid phase, with its sign set by the edge and orientation. Take that sign to be positive. If the number of passages $N$ is Poisson distributed with mean $\eta$, then

$$F(\eta)=\left\langle e^{2i\theta N}\right\rangle
=\sum_{n=0}^{\infty}e^{-\eta}\frac{\eta^n}{n!}e^{2i\theta n}
=\exp\!\left[\eta\left(e^{2i\theta}-1\right)\right].$$

The random count reduces the magnitude to $|F|=e^{-\eta(1-\cos 2\theta)}$. Its first correction is linear in $\eta$: simultaneous arrivals from two beams are not required for this factor. To obtain a current correlation, combine it with the edge's equilibrium correlator and tunneling dynamics.

**Try this on paper.** At $\theta=\pi/3$, find the magnitude and phase of $F$. Then compare $\theta=0$ and $\pi$: both give $F=1$. This full-braid factor alone cannot distinguish bosons from fermions; their other correlation properties still differ.

## Keep a small evidence ledger

| Measurement | First question to answer |
| --- | --- |
| Phase slip in interference | What changed inside the loop, and did the path area change too? |
| Current cross-correlation | Which histories contribute, and which source/contact model sets the normalization? |
| Fractional charge inferred from transport | What establishes the charge? What additional measurement addresses statistics? |
| Thermal transport | Which edge modes carry heat, and do they equilibrate on the device length? |

These are complementary questions. Fractional charge alone does not identify an exchange phase, and a thermal measurement does not directly perform a braid. The [Feldman–Halperin review](https://arxiv.org/abs/2102.08998) is a useful guide to how charge, statistics and their experimental signatures fit together.

Choose one paper and draw three boxes: **preparation → evolution → observable**. Put every approximation under the box where it enters. Once that diagram is complete, the paper's strongest claim—and the next useful measurement—will be much easier to locate.
