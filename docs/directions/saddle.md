# One particle at a saddle

A **saddle of the potential energy** is a stationary point where the energy curves upward in one direction and downward in another. A single-particle packet near a saddle can stretch, split and lose overlap with its initial shape. Removing the second particle from the [two-anyon calculation](../notes.md#let-a-saddle-amplify-a-correlation) isolates this motion from exchange. The same unstable dynamics also appears in barrier scattering and in wave equations near a black hole.

I retain the lowest Landau level, freezing the particle's cyclotron motion and describing its **guiding center**, the center of the orbit, by coordinates $X,Y$. For charge $q$ in a field of magnitude $B_0$, the magnetic length is $\ell=\sqrt{\hbar/(|q|B_0)}$. I choose the field orientation so that $[X,Y]=i\ell^2$.

The initial **coherent state** is a Gaussian with equal uncertainties in $X,Y$ and the minimum allowed uncertainty product. Its means are $X_0=\ell x_0$ and $Y_0=\ell y_0$, defining the dimensionless displacement labels $x_0,y_0$. I write $\Delta X,\Delta Y$ for the standard deviations; initially both are $\ell/\sqrt2$. The figure uses dimensionless time $\tau=\lambda t$, where $t$ is time and $\lambda>0$ is the stretching rate derived below.

The figure reports two probabilities: $P_+$ is the probability of measuring $Y>0$, while $P_0$ is the squared overlap with a fixed coherent state centered at the origin. Its logarithmic decay rate, $-d\ln P_0/d\tau$, is negative while that overlap grows and positive while it falls.

As the initial packet approaches the incoming $X$ axis, the outgoing split becomes more even. A packet centered exactly on the saddle keeps its mean position while its shape changes. A stationary mean need not mean a stationary state.

<!-- DIRECTION-FIGURE: saddle -->

## One saddle, two conjugate coordinates

Within the lowest-Landau-level description, the guiding-center coordinates obey

$$[X,Y]=i\ell^2.$$

They behave as a canonical pair, even though both originated as spatial coordinates. Let $g>0$ set the saddle curvature, with units of energy per length squared. The projected Hamiltonian $H$ and stretching rate $\lambda$ are

$$H=-\frac g2(XY+YX),\qquad
\lambda=\frac{g\ell^2}{\hbar}>0.$$

Symmetrizing $XY$ makes the Hamiltonian Hermitian. The Heisenberg equations give

$$\begin{aligned}
\dot X&=-\lambda X,&X(t)&=e^{-\tau}X(0),\\
\dot Y&=\lambda Y,&Y(t)&=e^\tau Y(0).
\end{aligned}$$

One direction contracts while the other expands. Their product and commutator remain unchanged. The rate comes from the second derivatives of the potential energy at the saddle.

<details>
<summary>Wavefunction and widths</summary>

In the $X$ representation, $x$ is the eigenvalue of $X$ and $Y=-i\ell^2\partial_x$. If $\psi_0(x)$ is the initial wavefunction, its evolved wavefunction $\psi(x,t)$ satisfies

$$\begin{gathered}
H=i\hbar\lambda\left(x\partial_x+\frac12\right),\\
\psi(x,t)=e^{\tau/2}\psi_0(e^\tau x).
\end{gathered}$$

The prefactor preserves normalization as the wavefunction narrows. Writing $\Delta X^2=\langle X^2\rangle-\langle X\rangle^2$ and similarly for $Y$, the initial Gaussian evolves with

$$\begin{aligned}
\langle X\rangle&=\ell x_0e^{-\tau},&
\Delta X^2&=\frac{\ell^2}{2}e^{-2\tau},\\
\langle Y\rangle&=\ell y_0e^\tau,&
\Delta Y^2&=\frac{\ell^2}{2}e^{2\tau}.
\end{aligned}$$

The uncertainty product stays $\Delta X\Delta Y=\ell^2/2$. In the corresponding one-particle Landau-level model, an actual position density also includes the frozen cyclotron fluctuations, which add $\ell^2/2$ to each variance.

</details>

**Squeezing** is this reciprocal contraction and expansion of quantum widths. The ellipse shows guiding-center uncertainties, not a joint measurement of the noncommuting $X,Y$ coordinates. No probability is lost.

Exponential separation alone does not establish chaos. This linear flow can be solved exactly and reversed. It is an instability without the repeated stretching and folding characteristic of chaotic bounded motion.

## Two different detector observables

Let $P_+$ be the probability that a measurement of the guiding-center coordinate gives $Y>0$. For the Gaussian,

$$P_+=\Pr(Y>0)=\frac12[1+\operatorname{erf}(y_0)],$$

where $\operatorname{erf}(a)=(2/\sqrt\pi)\int_0^a e^{-u^2}\,du$. This fraction is constant: the mean and width of the $Y$ distribution grow together. Its positive and negative portions move along the two outgoing directions. At $y_0=0$ the split is equal; changing $x_0$ changes the approach without changing this split. A real collection window or arrival-time gate would require its own detector model.

A different measurement tests whether the state matches a fixed Gaussian $|0\rangle$ centered at the origin, with guiding-center variances $\ell^2/2$. Its projector is $|0\rangle\langle0|$, and its probability is the squared overlap with that reference state. A centered packet loses overlap as it squeezes; a displaced packet can initially gain overlap as it approaches. At late times the overlap probability decays at rate $\lambda$.

<details>
<summary>Overlap formula and its late-time limit</summary>

Writing $|\psi(t)\rangle$ for the evolved packet and $P_0(t)$ for this overlap probability, Gaussian integration gives

$$\begin{aligned}
P_0(t)&=|\langle0|\psi(t)\rangle|^2\\
&=\operatorname{sech}\tau\,
\exp\!\left[-\frac{x_0^2}{2}(1-\tanh\tau)
-\frac{y_0^2}{2}(1+\tanh\tau)\right].
\end{aligned}$$

For a centered packet, $P_0=\operatorname{sech}\tau$: it loses overlap while its mean remains fixed. A displaced packet can first gain overlap as it approaches. At late positive times,

$$P_0(t)\sim2e^{-y_0^2}e^{-\lambda t}.$$

The logarithmic plot turns this exponential tail into a straight line. Its instantaneous dimensionless decay rate is

$$-\frac{d\ln P_0}{d\tau}=\tanh\tau-\frac{x_0^2-y_0^2}{2}\operatorname{sech}^2\tau.$$

A negative value means the overlap is still rising. For $\tau\geq0$, its maximum occurs at $\tau_{\mathrm{peak}}=\max[0,\tfrac12\operatorname{arsinh}(x_0^2-y_0^2)]$. Increasing $|x_0|$ at fixed $y_0$ can move this peak to later times without changing the late slope. Preparation can delay the decay without changing its asymptotic rate.

</details>

This is the tail of a specified mode overlap. It is neither the total probability remaining in the system nor the probability inside a small spatial box. Norm stays one throughout. The ideal quadratic model gives this asymptotic exactly; a finite device must maintain the assumed saddle dynamics over the relevant trajectory.

## A stationary beam asks a third question

A scattering state of definite energy $E$ poses a different problem from a localized Gaussian. Here $E$ is measured relative to the saddle, omitting the constant cyclotron energy. The notation $+X$ means the incoming arm on the positive $X$ side, and $+Y$ the outgoing arm on the positive $Y$ side. The conditional probability of that exit is

$$P(+Y\mid +X,E)=\frac{1}{1+e^{2\pi E/(\hbar\lambda)}}.$$

This has the form of the equilibrium occupation probability of a fermionic energy level, with chemical potential at the saddle energy. The temperature parameter would be $T_{\mathrm{eff}}=\hbar\lambda/(2\pi k_B)$, where $k_B$ is Boltzmann's constant. Here it is a scale in a one-particle scattering formula; no many-particle statistics has entered. A pure Gaussian remains pure, and its energy spread cannot be replaced by its mean energy in this stationary formula.

<details>
<summary>Scattering state and sign convention</summary>

Let $x$ be the eigenvalue of $X$, and let $\Theta(x)$ be one for $x>0$ and zero for $x<0$. The generalized wavefunction for incidence from $+X$ is

$$\psi_{E,+}(x)\propto
\Theta(x)(x/\ell)^{-1/2-iE/(\hbar\lambda)}.$$

The step function restricts the incoming arm. This state is normalized by probability flux, the probability crossing a section per unit time, rather than by a finite position integral. With $y$ the eigenvalue of $Y$, transforming to that representation uses the kernel $e^{-ixy/\ell^2}$. The half-line Fourier transform gives a squared-amplitude ratio $e^{-2\pi E/(\hbar\lambda)}$ between the positive and negative outgoing arms. Normalizing their currents yields the probability above.

The sign follows the chosen arms: classically $E=-gXY<0$ on a trajectory from $+X$ to $+Y$. As $E/(\hbar\lambda)\to-\infty$, the probability of the $+Y$ exit approaches one. Reversing the incoming arm interchanges the two probabilities. [The extended inverted-oscillator treatment](https://arxiv.org/abs/2012.09875) develops this scattering calculation and its equivalent canonical forms.

</details>

## How far does the black-hole connection go?

Near the top of a smooth barrier, the potential is approximately a constant minus a positive multiple of position squared. This is the **inverted harmonic oscillator**. Waves move away from its unstable maximum. Requiring waves to leave the barrier region, without a continuing incident wave, gives decaying resonant solutions.

<details>
<summary>Resonance poles</summary>

Analytically continuing the scattering amplitude to complex energy reveals poles, called **resonance poles**, at

$$E_n=-i\hbar\lambda(n+1/2),\qquad n=0,1,\ldots.$$

Under outgoing boundary conditions, a pole contributes an amplitude decaying as $e^{-\lambda(n+1/2)t}$. These resonances are not normalizable eigenstates with complex energies. The Hamiltonian still generates unitary evolution; an outgoing signal can decay as probability leaves the observed mode or region. The coherent-mode overlap above has the leading probability rate $\lambda$, but one such curve does not establish the whole pole spectrum.

</details>

In a black-hole wave problem, the effective radial barrier can be approximated near its maximum by an inverted oscillator. This gives an approximation to **quasinormal modes**: decaying wave solutions that leave toward infinity and enter the horizon. Their contribution to the decaying oscillation after a disturbance is called **ringdown**. [Hegde, Subramanyan, Bradlyn and Vishveshwara (2019)](https://arxiv.org/abs/1812.08803) develop this connection. Ringdown exists for classical waves; it does not require Hawking radiation, the quantum radiation associated with a black-hole horizon.

For a connection to quantum radiation, the state matters. [Stone (2013)](https://arxiv.org/abs/1209.2317) fills a set of incoming fermion states to form a **Fermi sea** in a quantum Hall model. The outgoing particles and holes—missing occupations in that sea—have correlated partners. Tracing out partner modes produces a thermal reduced state. [Andrade e Silva and Jacobson (2026)](https://arxiv.org/abs/2609.00158v1) revisit the derivation and its relation to the **Unruh effect**, the thermal response of a uniformly accelerated detector to the vacuum in flat spacetime. These state and observation choices provide the content behind the thermal description.

## Returning to the pair

For an ordinary oscillator, a Hamiltonian made from quadratic combinations of creation and annihilation operators preserves the even and odd occupation sectors: states with even occupation can mix with one another but cannot become odd. This connects oscillator algebra to the [pair calculation](../notes.md#which-localized-state).

<details>
<summary>Oscillator operators</summary>

The oscillator annihilation operator is $a=(X+iY)/(\sqrt2\ell)$, with $[a,a^\dagger]=1$. Define $K_+=a^{\dagger2}/2$, $K_-=a^2/2$, and $K_0=(a^\dagger a+1/2)/2$. They obey $[K_0,K_\pm]=\pm K_\pm$ and $[K_+,K_-]=-2K_0$, the $\mathfrak{su}(1,1)$ commutation relations used in the pair model.

</details>

For two anyons, their separation and relative angle form the relative-coordinate problem. The exchange rule restricts its angular states. Their amplitudes depend on preparation, while the physical potential and measurement must be represented by appropriate effective operators. Adding an exchange phase to this one-particle Gaussian does not supply those ingredients.

The inverted oscillator connects quantum transport to broader wave physics through a shared local instability. Which features survive changes of state, observable or boundary condition? In the examples above, stretching follows directly from the Hamiltonian, resonances depend on outgoing boundary conditions, and the thermal reduced state comes from a specified many-particle state with unobserved partner modes.

[Further directions](../directions.md) · [What the detector measures](detectors.md) · [Reading and talks](reading.md)
