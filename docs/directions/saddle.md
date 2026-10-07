# One particle at a saddle

<p class="reading-kicker">Direction 1 · Preparation, squeezing and scattering</p>

The [two-anyon saddle calculation](../notes.md#let-a-saddle-amplify-a-correlation) combines two ingredients: the prepared pair and the potential that moves it. The one-particle problem isolates the dynamics of the saddle. There is no exchange between partners, yet the potential still stretches the state, redirects its amplitude and changes what a detector sees. These effects provide a baseline for identifying what the second particle adds.

The initial state is a coherent state of one particle's guiding center. Its means are $X_0=\ell x_0$ and $Y_0=\ell y_0$, where $\ell$ is that particle's magnetic length; both initial standard deviations are $\ell/\sqrt2$. The figure uses the dimensionless center labels $x_0,y_0$ and time $\tau=\lambda t$.

<div class="try-this">

**Preparation and evolution.** The saddle compresses $X$ and expands $Y$. Moving the initial center closer to the incoming $X$ axis makes the outgoing split more even. Evolution stretches the packet, but its overlap with a fixed mode need not decrease monotonically: approach to that mode can initially increase the overlap. At zero initial displacement the mean stays at the saddle while the state continues to squeeze. The distinction is between a stationary mean and a stationary state.

</div>

<!-- DIRECTION-FIGURE: saddle -->

## One saddle, two conjugate coordinates

Within the lowest-Landau-level description, the guiding-center coordinates obey

$$[X,Y]=i\ell^2.$$

They behave as a canonical pair, even though both originated as spatial coordinates. The projected saddle Hamiltonian is

$$H=-\frac g2(XY+YX),\qquad
\lambda=\frac{g\ell^2}{\hbar}>0.$$

Here $g$ has units of energy per length squared. The symmetrization makes the operator Hermitian. The Heisenberg equations immediately give

$$\begin{aligned}
\dot X&=-\lambda X,&X(t)&=e^{-\tau}X(0),\\
\dot Y&=\lambda Y,&Y(t)&=e^\tau Y(0).
\end{aligned}$$

One direction contracts while the other expands. Their product and commutator remain unchanged. The rate comes from the second derivatives of the potential energy at the saddle.

In the $X$ representation, $Y=-i\ell^2\partial_x$, so

$$\begin{gathered}
H=i\hbar\lambda\left(x\partial_x+\frac12\right),\\
\psi(x,t)=e^{\tau/2}\psi_0(e^\tau x).
\end{gathered}$$

The prefactor preserves normalization as the wavefunction narrows. For the initial Gaussian,

$$\begin{aligned}
\langle X\rangle&=\ell x_0e^{-\tau},&
\Delta X^2&=\frac{\ell^2}{2}e^{-2\tau},\\
\langle Y\rangle&=\ell y_0e^\tau,&
\Delta Y^2&=\frac{\ell^2}{2}e^{2\tau}.
\end{aligned}$$

The uncertainty product stays $\Delta X\Delta Y=\ell^2/2$: this is squeezing. The ellipse shows these guiding-center uncertainties, not a joint measurement of $X,Y$. In the corresponding one-particle Landau-level model, an actual position density also includes the frozen cyclotron fluctuations, which add $\ell^2/2$ to each variance.

Exponential separation alone does not establish chaos. This linear, integrable flow can be solved exactly and reversed. It supplies a useful example of instability without the repeated stretching and folding characteristic of chaotic bounded motion.

## Two different detector observables

An ideal measurement of the sign of $Y$ assigns the Gaussian the probability

$$P_+=\Pr(Y>0)=\frac12[1+\operatorname{erf}(y_0)],$$

where $\operatorname{erf}(a)=(2/\sqrt\pi)\int_0^a e^{-u^2}\,du$. This fraction is constant: the mean and width of the $Y$ distribution grow together. Its positive and negative portions move along the two outgoing directions. At $y_0=0$ the split is equal; changing $x_0$ changes the approach without changing this split. A real collection window or arrival-time gate would require its own detector model.

The overlap with a **fixed coherent mode at the origin** is a different observable. Its measurement is the projector $|0\rangle\langle0|$, where $|0\rangle$ has zero guiding-center means and variances $\ell^2/2$. Gaussian integration gives

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

This is the tail of a specified mode overlap. It is neither the total probability remaining in the system nor the probability inside a small spatial box. Norm stays one throughout. The ideal quadratic model gives this asymptotic exactly; a finite device must maintain the assumed saddle dynamics over the relevant trajectory.

## A stationary beam asks a third question

A scattering state of definite energy $E$, incident from $+X$, poses a different problem from a localized Gaussian. Here $E$ is measured relative to the saddle, omitting the constant cyclotron energy. Its generalized $X$ wavefunction is

$$\psi_{E,+}(x)\propto
\Theta(x)(x/\ell)^{-1/2-iE/(\hbar\lambda)}.$$

Here $\Theta$ restricts the incoming arm. This state is normalized by flux rather than by a finite position integral. Transforming to $Y$ uses the kernel $e^{-ixy/\ell^2}$. The half-line Fourier transform gives a squared-amplitude ratio $e^{-2\pi E/(\hbar\lambda)}$ between the positive and negative outgoing arms. Normalizing their currents yields

$$P(+Y\mid +X,E)=\frac{1}{1+e^{2\pi E/(\hbar\lambda)}}.$$

The sign follows the chosen arms: classically $E=-gXY<0$ on a trajectory from $+X$ to $+Y$. Negative energies therefore approach unit probability for that exit. Reversing the incoming arm interchanges the two probabilities. [The extended inverted-oscillator treatment](https://arxiv.org/abs/2012.09875) develops this scattering calculation and its equivalent canonical forms.

This logistic dependence has the form of a Fermi occupation with $k_BT_{\mathrm{eff}}=\hbar\lambda/(2\pi)$. No many-particle statistics entered this one-particle calculation. A pure Gaussian remains pure, and its energy spread cannot be replaced by its mean energy in the stationary formula.

## How far does the black-hole connection go?

The same scattering amplitude contains a gamma function with resonance poles

$$E_n=-i\hbar\lambda(n+1/2),\qquad n=0,1,\ldots.$$

Under outgoing boundary conditions, a pole contributes an amplitude decaying as $e^{-\lambda(n+1/2)t}$. These resonances are not normalizable eigenstates with complex energies. The Hamiltonian still generates unitary evolution; an outgoing signal can decay as probability leaves the observed mode or region. The coherent-mode overlap above has the leading probability rate $\lambda$, but one such curve does not establish the whole pole spectrum.

In a black-hole wave problem, the effective radial barrier can be approximated near its maximum by an inverted oscillator. That connects the local scattering equation to an approximation for quasinormal resonances, as explained by [Hegde, Subramanyan, Bradlyn and Vishveshwara (2019)](https://arxiv.org/abs/1812.08803). Black-hole ringdown also exists for classical waves. It should be distinguished from quantum Hawking–Unruh radiation.

For the latter connection, the state matters. [Stone (2013)](https://arxiv.org/abs/1209.2317) specifies a filled incoming fermionic sea in a quantum Hall analogue. Outgoing particles and holes have correlated partners; tracing out the partner modes produces a thermal reduced state. [Andrade e Silva and Jacobson's 2026 analysis](https://arxiv.org/abs/2609.00158v1) revisits the guiding-center derivation and clarifies the analogue Unruh interpretation. Those additional ingredients make the thermality claim stronger than recognizing a logistic scattering curve.

## Returning to the pair

For an ordinary oscillator, let $a=(X+iY)/(\sqrt2\ell)$. The quadratic operators $K_+=a^{\dagger2}/2$, $K_-=a^2/2$, and $K_0=(a^\dagger a+1/2)/2$ obey the $\mathrm{SU}(1,1)$ commutation relations. Quadratic evolution preserves even and odd occupation sectors. This gives a concrete route from familiar oscillator algebra to the generators in the [pair calculation](../notes.md#which-localized-state).

The anyon relative problem requires its own allowed angular states, preparation and operator mapping. Its representation is not obtained merely by attaching an exchange phase to this one-particle Gaussian. The one-particle calculation separates three questions for the pair: which coefficients describe the prepared state, which operators generate its motion, and which operator represents the detector?

<div class="takeaway">

**Finite detector acceptance.** Replacing the origin-mode projector by a detector with finite acceptance, at fixed preparation, defines a further calculation. Its probability need not follow the mode overlap, and an interpretation as escape depends on the collection geometry. Adding the second particle then tests which features change under the exchange constraint.

</div>

[Directions to think about](../directions.md) · [What the detector measures](detectors.md) · [Reading and talks](reading.md)
