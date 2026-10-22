# What the detector measures

An exchange rule tells me how a quantum state changes when excitations trade places. A detector returns a current, a count, a voltage or a temperature. I want to understand how interference and fluctuations connect that rule to a measured quantity.

In the [anyon notes](../notes.html), I followed a prepared pair through a saddle model to a weighted position average. Here I compare different measurements. Preparation, motion and readout all matter, even when the underlying exchange rule stays fixed.

## The measured observable

I can learn from fluctuations even when the mean current looks unremarkable. A **current cross-correlation** compares deviations from the mean at two detectors. Its sign alone is not a particle label. A contact that sends each incident particle into one of two outputs already correlates their currents through this partitioning.

<details>
<summary>Definition of the current cross-correlation</summary>

Let $I_j(t)$ be the current operator at detector $j=1,2$ at time $t$, and let $\Delta I_j=I_j-\langle I_j\rangle$ denote its deviation from the mean. Assume stationary statistics, so correlations depend only on the time difference. One convention for the integrated cross-correlation is

$$S_{12}=\int_{-\infty}^{\infty}dt\,\frac12\langle\Delta I_1(t)\Delta I_2(0)+\Delta I_2(0)\Delta I_1(t)\rangle,$$

The average of the two operator orders makes this correlation **symmetrized**. Integration over all time differences selects its **zero-frequency** component. Different papers use different factors or normalizations, so numerical comparisons require matching the definitions.

A negative value describes anticorrelation after integrating over time delays; it need not describe every delay separately.

</details>

I ask which change in the signal distinguishes the proposed exchange process from other mechanisms in the device. That depends on what was injected, how it propagated and what the contacts did.

## Two paths can reveal one exchange

Suppose a detector outcome has two indistinguishable histories: a direct process with amplitude $A_D$ and a process with the particles exchanged, with amplitude $A_E$ before the statistical factor. For exchange angle $\theta$, the probability is

$$|A_D+e^{i\theta}A_E|^2
=|A_D|^2+|A_E|^2+2\operatorname{Re}\!\left(e^{i\theta}A_EA_D^*\right).$$

The interference term contains the exchange phase, but also the relative phase already present in $A_D,A_E$. If some unobserved degree of freedom records which history occurred, their interference can be reduced or lost. Adding a statistical phase alone does not restore it.

[Vishveshwara's Hanbury Brown–Twiss proposal](https://arxiv.org/abs/cond-mat/0304568) applies this idea to quasiparticles propagating along the boundary, or **edge**, of a Laughlin fluid. Two source contacts inject excitations and two sink contacts collect them. After subtracting the correlations measured with each source alone, the equal-time current correlation contains a cosine of the exchange angle. The calculation assumes weak tunneling, so transfer between edges can be treated perturbatively. Its equal-time result differs from a correlation integrated over time delays.

For equal real amplitudes $A_D=A_E=1/2$, the probability reduces to $[1+\cos\theta]/2$: it is $1$, $3/4$ and $0$ at $\theta=0$, $\pi/3$ and $\pi$, respectively. An extra phase $\varphi$ in $A_E$ changes the result to $[1+\cos(\theta+\varphi)]/2$. This simple check exposes the ambiguity: separating the statistical phase from an ordinary relative phase requires an independent calibration or a reference process that cancels the latter.

## Encircling gives a different phase

For identical Abelian anyons, two exchanges in the same sense give a full braid, with phase $e^{2i\theta}$. A path that surrounds a localized quasiparticle therefore probes a different motion from one half-exchange.

An **interferometer** combines coherent paths so their relative phase affects the measured signal. For a fixed-area loop, let $q$ be the interfering quasiparticle's charge, $\Phi$ the enclosed magnetic flux and $N_{\rm enc}$ the number of enclosed quasiparticles of the same type. With electron charge $-e$, $e>0$, define the flux quantum $\Phi_0=h/e$, where $h=2\pi\hbar$. A reference phase $\phi_0$ collects other matched contributions. The total relative phase is

$$\phi=2\pi\frac{q}{e}\frac{\Phi}{\Phi_0}+N_{\rm enc}(2\theta)+\phi_0,
\qquad \Phi_0=\frac he.$$

Signs depend on the charge and path conventions. The first term is electromagnetic; the second is statistical.

[Nakamura and collaborators](https://www.nature.com/articles/s41567-020-1019-1) observed discrete shifts of the interference pattern, called **phase slips**, consistent with a full-braid phase $2\pi/3$. Their filling was $\nu=1/3$, meaning roughly one electron per three available lowest-Landau-level orbitals. Conducting screening layers reduce the electrostatic coupling between interior charge and the edge. The [author manuscript](https://arxiv.org/abs/2006.14115) explains checks on ordinary phase shifts: changing enclosed charge can also change the path area and hence its magnetic phase.

A measurement of $e^{2i\theta}$ determines $\theta$ only modulo $\pi$. Recovering a particular exchange angle requires additional physical information. The distinction between a half-exchange and a full braid therefore matters throughout the calculation.

## A collider adds dynamics to the inference

In an electronic **anyon collider**, dilute incoming beams meet a contact where quasiparticles can tunnel between two edges; the outgoing current fluctuations are then compared. [Rosenow, Levkivskyi and Halperin](https://arxiv.org/abs/1509.08470) calculate this observable for fractional quantum Hall edges. Their result ties the correlations to statistics through the dynamics of edge propagation and tunneling.

The measured signal is assembled from many tunneling histories and source events, beyond the two alternatives in the amplitude example above. A pair wavefunction in an unbounded saddle and a current-noise experiment are different measurement problems. Comparing them requires an explicit outgoing state and detector observable in each case.

### Random arrivals can still carry a phase

I do not always need two wave packets to arrive simultaneously for statistics to affect a signal. The [time-domain braiding interpretation](https://arxiv.org/abs/2510.04319v2) concerns a correlation between tunneling operators at two times. In the simple Laughlin-edge model, beam anyons passing between those times contribute full-braid phases. Their random number can reduce the magnitude of the averaged interference contribution while leaving a nonzero phase.

<details>
<summary>Random-arrival calculation</summary>

The phase sign is set by the edge and orientation. For the positive convention, let the number of passages $N$ have a Poisson distribution with mean $\eta$. Its probability of $N=n$ is $e^{-\eta}\eta^n/n!$. Calling the averaged phase factor $F(\eta)$ gives

$$F(\eta)=\left\langle e^{2i\theta N}\right\rangle
=\sum_{n=0}^{\infty}e^{-\eta}\frac{\eta^n}{n!}e^{2i\theta n}
=\exp\!\left[\eta\left(e^{2i\theta}-1\right)\right].$$

The random count reduces the magnitude to $|F|=e^{-\eta(1-\cos 2\theta)}$. Its first correction is linear in $\eta$: simultaneous arrivals from two beams are not required for this factor. The current correlation also depends on the edge's equilibrium correlator and tunneling dynamics.

At $\theta=\pi/3$, the factor is $F=e^{-3\eta/2}e^{i\sqrt3\eta/2}$, giving magnitude $e^{-3\eta/2}$ and phase $\sqrt3\eta/2$ modulo $2\pi$. Both $\theta=0$ and $\pi$ instead give $F=1$. This full-braid factor alone cannot distinguish bosons from fermions; their other correlation properties still differ.

</details>

## What each measurement establishes

| Measurement | Physical questions |
| --- | --- |
| Phase slip in interference | What changed inside the loop, and did the path area change too? |
| Current cross-correlation | Which histories contribute, and which source/contact model sets the normalization? |
| Fractional charge inferred from transport | What establishes the charge? What additional measurement addresses statistics? |
| Heat transport | Which boundary modes carry energy, and do they exchange enough energy to approach a common temperature within the device? |

These are complementary questions. Fractional charge alone does not identify an exchange phase, and a thermal measurement does not directly perform a braid. The [Feldman–Halperin review](https://arxiv.org/abs/2102.08998) is a useful guide to how charge, statistics and their experimental signatures fit together.

I want to understand which measurements complement one another and when different physical mechanisms produce similar signals. In each case I need to connect the prepared state, its evolution and the measured observable. The exchange rule supplies one part of that connection.
