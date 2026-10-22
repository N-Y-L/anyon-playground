# Preparation, motion and detection

These calculations examine how preparation and propagation turn an exchange rule into a measured signal. They use the Laughlin quasiholes, Landau levels, exchange statistics and Berry phase introduced in the [main notes](notes.md). The two-particle preparations lead to a saddle model; the final collider calculation uses bosons and fermions to isolate the effect of one-particle interference.

## Replace the electron fluid by two effective particles

Two preparations can give different mean squared separations at the same charge and exchange angle. The exchange rule restricts the allowed states; preparation determines their amplitudes.

[Vishveshwara and Cooper (2010)](https://arxiv.org/abs/0908.3945) retain only pair states in the lowest effective Landau level, a restriction called **projection**. The **guiding center** is the center of a cyclotron orbit. Their observable is the mean squared separation of the two guiding centers. They compare it with two distinguishable particles prepared with the same localization labels and packet widths. Distinguishable particles carry labels that can tell them apart, so their exchanged alternatives do not interfere.

The localization label $d$ specifies the intended relative separation before projection; it approximates a measured packet separation only for distant packets. At fractional statistics, the difference in mean squared separation from the distinguishable reference can change sign as $d$ changes. The exchange angle has remained fixed. Thus a fixed exchange angle does not prescribe the sign of this separation comparison.

The calculation compares this preparation with another family used by [Subramanyan and Vishveshwara (2019)](https://arxiv.org/abs/1905.00442). These are generalized coherent states, defined below as eigenstates of a specified lowering operator. The families agree for bosons and fermions but give different angular-state weights for fractional statistics. Which family, if either, describes a state released from a particular trap depends on its preparation.

<details class="derivation">
<summary>Derivation: two preparation families and their separation curves</summary>

The [microscopic quasihole state](notes.md#make-a-hole-without-removing-an-electron) depends on $N$ electron positions and two quasihole parameters. The bulk-pair problem of [Vishveshwara and Cooper](https://arxiv.org/abs/0908.3945) instead starts from two effective particles, endowed with the quasiholes' charge and exchange rule. The electron coordinates no longer appear. Their effects enter through the effective parameters, the allowed states, and the conditions under which this reduction works.

I use equal charges $q=e/m$ and exchange angle $\theta=\pi/m$ for Laughlin filling $1/m$, in the field $B_z=-B_0$. I neglect the quasiholes' mutual interaction in this model and retain their lowest effective Landau level. Its orthogonal projector will be denoted $P$; projected observables have the form $POP$. The electron magnetic length remains $\ell_B=\sqrt{\hbar/(eB_0)}$. The new magnetic length is

$$\ell=\sqrt{\frac{\hbar}{|q|B_0}}=\sqrt m\,\ell_B.$$

This differs from the electron magnetic length. A smooth potential supplies the slow motion after projection; an effective mass, if introduced before projection, drops out of the remaining orbit-center dynamics. The relation to the microscopic electron system concerns its space of low-energy quasihole states. Introducing an unprojected charged particle constructs an effective projected description; it does not derive a quasihole mass or a microscopic cyclotron ladder. The model describes well-separated low-energy excitations; the underlying Coulomb many-electron problem remains outside it. Whether a particular trap prepares one of its states has to be checked separately.

A particle coordinate in a magnetic field separates into cyclotron motion and the **guiding center**, the center of that orbit. To see how projection changes its algebra, take one particle with kinetic momentum $\boldsymbol\Pi=\mathbf p-q\mathbf A$, where $\mathbf A$ is a vector potential for the signed field $B_z$. Write its full position as $(x_{\rm full},y_{\rm full})$ and its guiding center as $(X,Y)$:

$$\begin{aligned}
[\Pi_x,\Pi_y]&=i\hbar qB_z,\\
X&=x_{\rm full}+\frac{\Pi_y}{qB_z},\\
Y&=y_{\rm full}-\frac{\Pi_x}{qB_z}.
\end{aligned}$$

The cyclotron coordinate is $\boldsymbol\rho=\mathbf r_{\rm full}-(X,Y)$. Commuting the displayed expressions gives

$$\begin{aligned}
[X,Y]&=-\frac{i\hbar}{qB_z},\\
[\rho_x,\rho_y]&=\frac{i\hbar}{qB_z},\\
[X,\rho_a]&=[Y,\rho_a]=0.
\end{aligned}$$

The opposite commutators cancel in the full position, whose components commute. Lowest-level projection $P$ freezes the cyclotron oscillator in its ground state. Its mean coordinate vanishes, $P\boldsymbol\rho P=0$, but its mean squared radius does not: since $\rho^2=\boldsymbol\Pi^2/(qB_z)^2$ and the ground cyclotron energy is $\hbar|qB_z|/(2M)$ for the effective mass $M$, one obtains $P\rho^2P=\ell^2P$. Thus $P\mathbf r_{\rm full}P$ acts as the guiding center, while $P r_{\rm full}^2P$ contains an additional frozen $\ell^2$.

For positive quasiholes in our into-page field, the guiding-center commutator is $[X_i,Y_j]=i\ell^2\delta_{ij}$. Define center-of-mass and relative guiding-center operators

$$\begin{gathered}
X=\frac{X_1+X_2}{2},\quad Y=\frac{Y_1+Y_2}{2},\\
x=X_1-X_2,\quad y=Y_1-Y_2.
\end{gathered}$$

Their commutators are $[X,Y]=i\ell^2/2$ and formally $[x,y]=2i\ell^2$ before restricting to observables unchanged by exchanging the particles. I write $r^2=x^2+y^2$ for the squared relative guiding-center radius. The two independent frozen cyclotron ground states contribute $2\ell^2$ to the relative squared radius. This same decomposition explains both the minimum guiding-center width and the constant to subtract from a full-position moment.

Exchange sends $(x,y)$ to $(-x,-y)$. To pass from the transported electron state to an effective coordinate wavefunction, first make the phase convention explicit. Write $\alpha=\theta/\pi$; for the Laughlin quasihole, $\alpha=1/m$. The [Berry calculation](notes.md#exchange-the-quasiholes-transport-the-electron-state) gave a statistical Berry connection $\mathcal A_{\rm stat}=\alpha\,d\varphi$, where $\varphi=\arg\zeta$ and $\zeta=\eta_1-\eta_2$. The original normalized electron-state family is single-valued in these parameters. On a chosen angular branch, change its phase to

$$\begin{gathered}
|\widetilde\Psi(\zeta)\rangle=e^{i\alpha\varphi}|\Psi(\zeta)\rangle,\\
\widetilde{\mathcal A}_{\rm stat}
=\mathcal A_{\rm stat}-\alpha\,d\varphi=0.
\end{gathered}$$

The transformation law follows from $\mathcal A=i\langle\Psi|d\Psi\rangle$. It removes the statistical connection locally, leaving the electromagnetic contribution in place. The same statistics now appears in the boundary condition of the rephased electron-state family: after an exchange, $|\widetilde\Psi(\varphi+\pi)\rangle=e^{i\pi\alpha}|\widetilde\Psi(\varphi)\rangle$. The coefficient of a fixed physical state in this rephased family, or an overlap with its bra, carries the inverse phase. Let $r_{\rm full}$ denote the full relative distance and $\varphi$ its angle. The effective scalar wavefunction obeys

$$\begin{gathered}
\psi(r_{\rm full},\varphi+\pi)=e^{-i\pi\alpha}\psi(r_{\rm full},\varphi).
\end{gathered}$$

For positive quasihole charge in our into-page field, lowest-level coordinate orbitals in symmetric gauge depend on $x_{\rm full}-iy_{\rm full}$ rather than $x_{\rm full}+iy_{\rm full}$ apart from a Gaussian; this is the antiholomorphic convention. Here and below $x_{\rm full},y_{\rm full}$ denote the full relative coordinates. The orbitals are proportional to $(x_{\rm full}-iy_{\rm full})^j$ times a Gaussian. Their angular factor $e^{-ij\varphi}$ satisfies this boundary condition when $j=2n+\alpha$, $n=0,1,\ldots$. The statistics fixes the boundary condition; the charge and field fix the holomorphic or antiholomorphic form. Complex-conjugating the coordinate convention gives the positive boundary phase used in many pair-model papers, with unchanged physical content. With the stated electromagnetic gauge and statistical phase convention, the orbital generator $-i\hbar\partial_\varphi$ has eigenvalues $-j\hbar$; $j$ is the nonnegative orbital index used below; it labels angular momentum, not a radial excitation. Bosons retain even $j$ and fermions odd $j$; fractional statistics shift the sequence. The regular branch $j\geq0$ also specifies the model's short-distance behavior. These restrictions say which states are available, not which states a preparation occupies. The [microscopic-to-anyon mapping](https://arxiv.org/abs/cond-mat/9606214) makes the complex conjugation explicit.

### The localized pair is a superposition, not a separation eigenstate

The relative coordinate has magnetic length $\sqrt2\ell$. For the orbital wavefunctions, return temporarily to the commuting full relative position before projection and write $w=(x_{\rm full}-iy_{\rm full})/(2\ell)$. This scalar coordinate is distinct from the noncommuting guiding-center operators $x,y$ above. Let $|n,\alpha\rangle$ denote the normalized basis state with orbital index $j=2n+\alpha$, and let $\Gamma$ be the Euler gamma function. With measure $d^2w$ over one $2\pi$ angular interval and a branch chosen, its wavefunction is

$$\begin{gathered}
\phi_{n,\alpha}(w)=\frac{w^j e^{-|w|^2/2}}{\sqrt{\pi\Gamma(j+1)}},\\
j=2n+\alpha.
\end{gathered}$$

The scalar product here uses $d^2w$; choosing the physical half-plane of unordered configurations changes only a common normalization. The gamma function enters through the radial integral, $\int_0^\infty t^j e^{-t}dt=\Gamma(j+1)$, with $t=|w|^2$. The branch of $w^j$ carries the exchange boundary condition.

Within this auxiliary point-particle model, the full position ket $|w_0\rangle$ exists before projection. The projector $P_\alpha$ onto the lowest-level states with this exchange angle gives

$$\begin{aligned}
P_\alpha|w_0\rangle&=\sum_n|n,\alpha\rangle\langle n,\alpha|w_0\rangle\\
&=\sum_n\phi_{n,\alpha}(w_0)^*|n,\alpha\rangle.
\end{aligned}$$

Normalize the projected state at a nonzero label. It maximizes the probability density there among states in the retained sector: Cauchy–Schwarz gives $|\langle w_0|\psi\rangle|^2\leq\langle w_0|P_\alpha|w_0\rangle$, and the projected state saturates the bound. This is one precise meaning of localization; it does not assert minimum width. An exact position eigenstate would require the higher levels that projection removed. For a label on the incoming $x$ axis, take real $w_0=d/(2\ell)$ and set $s=d/\ell$, $u=s^2/4$. The common Gaussian cancels on normalization. What remains is exactly the localized-coordinate preparation used in the 2010 calculation:

$$\begin{gathered}
|u,\alpha\rangle_{\rm loc}\\
=\frac{1}{\sqrt{Z_\alpha(u)}}\sum_{n=0}^{\infty}
\frac{u^{n+\alpha/2}}{\sqrt{\Gamma(2n+\alpha+1)}}|n,\alpha\rangle,\\
Z_\alpha(u)=\sum_{n=0}^{\infty}\frac{u^{2n+\alpha}}{\Gamma(2n+\alpha+1)}.
\end{gathered}$$

The label $d$ agrees asymptotically with a packet separation. At small $d$ it is not a measured separation; the mean squared guiding-center separation must be calculated from the state. Opposite relative labels describe the same unordered pair. Projection supplies a definite amplitude for every angular state allowed by the exchange rule.

The same radial integral gives the full relative-position moment of one orbital,

$$\begin{aligned}
\langle r_{\rm full}^2\rangle_j&=4\ell^2\frac{\Gamma(j+2)}{\Gamma(j+1)}\\
&=4\ell^2(j+1).
\end{aligned}$$

The full position is the guiding center plus the frozen cyclotron coordinate. In the relative lowest level, the latter contributes $2\ell^2$ to the squared radius. Subtract it to obtain the guiding-center observable used by the paper:

$$r^2|n,\alpha\rangle=\big[4j+2\big]\ell^2|n,\alpha\rangle.
$$

Thus the $2\ell^2$ left at $j=0$ is the guiding-center zero-point width, not an omitted cyclotron term. Matched differences of full-position and guiding-center radial moments agree, because the extra frozen contribution cancels.

For the distinguishable reference, prepare two independent guiding-center **coherent states**: Gaussian packets saturating $\Delta X_i\Delta Y_i\geq\ell^2/2$ with equal widths in both directions. Center them at $(d/2,0)$ and $(-d/2,0)$. Each has $\operatorname{Var}X_i=\operatorname{Var}Y_i=\ell^2/2$. Independence gives $\operatorname{Var}x=\operatorname{Var}y=\ell^2$, while $\langle x\rangle=d$ and $\langle y\rangle=0$. Thus $\langle r^2\rangle_{\rm d}=d^2+2\ell^2=(s^2+2)\ell^2$. This reference fixes both the labels and the packet widths. Define the excess relative to it by

$$\chi=\frac{\langle r^2\rangle-\langle r^2\rangle_{\rm d}}{4\ell^2}.
$$

Squaring the amplitudes gives probabilities $p_n=u^{2n+\alpha}/[\Gamma(2n+\alpha+1)Z_\alpha]$. The separation excess is then an angular-momentum average:

$$\boxed{\begin{aligned}
\chi_{\rm loc}(u,\alpha)&=\sum_n(2n+\alpha)p_n-u\\
&=u\frac{d\log Z_\alpha}{du}-u.
\end{aligned}}$$

For bosons, $Z_0=\cosh u$; for fermions, $Z_1=\sinh u$. Therefore

$$\begin{aligned}
\chi_{\rm loc}(u,0)&=u(\tanh u-1),\\
\chi_{\rm loc}(u,1)&=u(\coth u-1).
\end{aligned}$$

The first is negative and the second positive: the prepared bosons have a smaller mean squared guiding-center separation than their distinguishable reference, and the fermions a larger one. As $u\to0$, only the lowest angular state survives after normalization, giving $\chi\to\alpha$. For a fractional example, $\alpha=1/3$ and $s=2$ give $\chi_{\rm loc}\simeq-0.1193$. The mean squared guiding-center separation is then $5.523\ell^2$ instead of the reference's $6\ell^2$. The same exchange rule has given a positive excess at small separation and a negative one here. No interparticle force was added; changing the localization labels changed the weights of the available angular states.

The words “bunching” and “antibunching” in this calculation refer to the sign of this **mean squared separation comparison**. It is neither a pair-density function at a particular point nor the probability that two detectors click together. Also, $s\to0$ is a formal limit of the point-anyon model: actual quasihole cores eventually overlap. This limit checks the point-particle calculation but does not describe overlapping quasihole cores.

### Which localized state?

The alternative preparation used in [Subramanyan and Vishveshwara’s dynamics study](https://arxiv.org/abs/1905.00442) is defined by operators that preserve the exchange condition. A linear relative coordinate changes angular momentum by one unit and takes a state out of the chosen sector. Quadratic combinations—squares or products of coordinate operators—can connect neighboring allowed states, whose orbital indices differ by two.

I define three operators $K_0,K_-,K_+$ by their action on the basis $|n,\alpha\rangle$, with $\kappa=\alpha/2+1/4$:

$$\begin{gathered}
K_0|n,\alpha\rangle=(n+\kappa)|n,\alpha\rangle,\\
K_-|n,\alpha\rangle=\sqrt{n(n+2\kappa-1)}|n-1,\alpha\rangle,\\
K_+=K_-^\dagger.
\end{gathered}$$

They satisfy $[K_0,K_\pm]=\pm K_\pm$ and $[K_+,K_-]=-2K_0$. These commutation relations define the Lie algebra $\mathfrak{su}(1,1)$. Its **representation** here is simply the displayed action of its generators on the states; no further representation theory is assumed. The operators preserve the exchange boundary condition. For bosons and fermions they can be built from squares of an ordinary oscillator lowering operator. At fractional statistics that identification requires extra angular-momentum-dependent factors, which the saddle calculation will make explicit.

A **generalized coherent state** here means precisely an eigenstate of this lowering operator, $K_-|\beta,\alpha\rangle=\beta|\beta,\alpha\rangle$. With $\mathcal N$ chosen to normalize the state, the recurrence between its coefficients gives

$$\begin{gathered}
|\beta,\alpha\rangle_{\rm coh}\\
=\mathcal N\sum_{n=0}^{\infty}
\frac{\beta^n}{\sqrt{n!\,\Gamma(n+\alpha+1/2)}}|n,\alpha\rangle.
\end{gathered}$$

Use the same incoming-axis label as before by taking real $\beta=u/2$. Its probabilities are proportional to $(u/2)^{2n}/[n!\Gamma(n+\alpha+1/2)]$. Compute $\chi=2\langle n\rangle+\alpha-u$ again, using these new weights. Bosonic and fermionic endpoints agree exactly with the previous preparation, but fractional statistics give different curves. The two preparations obey the same exchange boundary condition but have different coefficients.

<!-- FIGURE: pair -->

For numerical work the positive series is sufficient. Writing $I_\mu$ for the modified Bessel function of order $\mu$, the same result is

$$\chi_{\rm coh}(u,\alpha)
=u\frac{I_{\alpha+1/2}(u)}{I_{\alpha-1/2}(u)}-u+\alpha,$$

where $I_\mu(u)=\sum_{n\geq0}(u/2)^{2n+\mu}/[n!\Gamma(n+\mu+1)]$. This function arises from the normalization series and its derivative.

At large $u$, the coherent-state excess has the leading tail $\chi_{\rm coh}\sim\alpha(\alpha-1)/(2u)$ for $0<\alpha<1$; the localized-coordinate excess decays exponentially with a power prefactor.

For the ideal Laughlin trial family, its microscopic normalization already constrains the effective state. Put $\eta_{1,2}=\pm\zeta/2$ and $u=|\zeta|^2/(4\ell^2)$. Expanding $\prod_i(z_i^2-\zeta^2/4)\Psi_m$ in powers of $\zeta^2$ gives electron states with different total angular momenta, hence orthogonal states in a rotationally symmetric droplet. Let $A_n$ be the nonnegative squared norms of those expansion coefficients, including the fixed length factors. Their total norm and normalized weights are

$$\begin{gathered}
\mathcal Z_2(u)=\sum_{n=0}^{N}A_nu^{2n},\qquad
p_n=\frac{A_nu^{2n}}{\mathcal Z_2(u)},\\
\langle j\rangle=\alpha+u\partial_u\log\mathcal Z_2.
\end{gathered}$$

The last line uses the angular-basis identification $j=2n+\alpha$. For separated holes well inside a sufficiently large droplet, write $\mathcal Z_2=C e^u u^{-\alpha}[1+\varepsilon(u)]$, where $C$ is independent of $u$ and $\varepsilon(u)$ describes corrections to the screened bulk expression derived in the [Berry calculation](notes.md#exchange-the-quasiholes-transport-the-electron-state). The leading terms cancel in $\chi=\langle j\rangle-u$, leaving $\chi=u\partial_u\log[1+\varepsilon(u)]$. The residual therefore tests the screening and edge corrections. Of the two preparations above, the projected-coordinate family has the rapidly decaying corrections consistent with short-range screening; the generalized coherent family has an algebraic correction. This motivates [Kjønsberg and Leinaas's approximate coordinate-state mapping](https://arxiv.org/abs/cond-mat/9606214). The full norm would determine every $A_n$; its screened asymptotic form does not. A specified pinning-and-release protocol still needs its own microscopic state and operator mapping.


</details>

<span id="let-a-saddle-amplify-the-difference"></span>

## Let a saddle amplify a correlation

A **saddle potential** curves upward along one direction and downward along a perpendicular direction. Retaining the lowest Landau level changes its dynamics: the two guiding-center coordinates form a conjugate pair. For a suitable orientation of the axes, the guiding-center coordinates $X_s,Y_s$ evolve in time $t$ with a positive rate $\lambda$:

$$X_s(t)=e^{-\lambda t}X_s(0),\qquad
Y_s(t)=e^{\lambda t}Y_s(0).$$

The rate $\lambda$ is set by the second spatial derivatives of the potential energy and by the magnetic length. Their widths change reciprocally: this is **squeezing**. It happens for one particle too, so exponential stretching alone is not evidence for anyonic statistics.

For a pair, the model below can amplify a correlation already present in the initial state. It represents squared relative coordinates by particular operators; interpreting its output as spatial data requires showing that these operators agree with the projected physical observables. If $y_1,y_2$ are the measured outgoing positions, the moment $\langle y_1y_2\rangle$ weights each event by their product. A few distant events can dominate this average, so its sign does not determine the probability that both particles leave on the same side.

The [one-particle calculation](directions/saddle.md) describes the dynamics introduced by the saddle alone. It also connects the saddle equation to barrier scattering and to the decaying oscillations of a perturbed black hole, called gravitational ringdown.

<details class="derivation">
<summary>Derivation: the quadratic algebra, its operator mapping and the figure</summary>

This calculation uses the [two preparation families](#replace-the-electron-fluid-by-two-effective-particles) and their [generators](#which-localized-state). Here $\alpha=\theta/\pi$ is the exchange parameter, $\ell$ the effective particle magnetic length, $d$ the localization label, $u=d^2/(4\ell^2)$ and $\beta=u/2$. The dimensionless separation excess is $\chi=[\langle r^2\rangle-\langle r^2\rangle_{\rm d}]/(4\ell^2)$, where the subscript $\rm d$ denotes the distinguishable reference. The pair derivation supplies the basis $|n,\alpha\rangle$ and the matrix elements of $K_0,K_\pm$ needed below.

A smooth saddle potential has one stable and one unstable direction of drift. For a single guiding center, write $X_s,Y_s$ with $[X_s,Y_s]=i\ell^2$ and choose its oriented energy as $H=-g(X_sY_s+Y_sX_s)/2$, where $g>0$ has units of energy per length squared. Define the rate $\lambda=g\ell^2/\hbar$. The Heisenberg equations give

$$\begin{gathered}
\dot X_s=-\lambda X_s,\qquad \dot Y_s=\lambda Y_s,\\
\lambda=\frac{g\ell^2}{\hbar}.
\end{gathered}$$

An incoming packet contracts along $X_s$ and expands along $Y_s$. A rotation of axes writes the same energy as the difference of two quadratic curvatures. The saddle resembles a beam splitter because incoming motion approaches its center along one direction and outgoing motion separates along the other. Quantum widths and tunneling determine the splitting; a classical trajectory alone cannot predict it.

For the relative motion of the pair, I use the $\mathfrak{su}(1,1)$ model of the cited dynamics papers. Define the Hermitian combinations $K_1,K_2$ and the relative Hamiltonian $H_{\rm rel}$ by

$$\begin{aligned}
K_1&=\frac{K_++K_-}{2},\\
K_2&=\frac{K_+-K_-}{2i},\\
H_{\rm rel}&=2g\ell^2K_2.
\end{aligned}$$

The relative quadratic observables in this model are

$$\begin{aligned}
Q_x&=4\ell^2(K_0+K_1),\\
Q_y&=4\ell^2(K_0-K_1),\\
r^2&=Q_x+Q_y=8\ell^2K_0.
\end{aligned}$$

$Q_x$ and $Q_y$ represent the squared relative coordinates along the contracting and expanding directions. At the boson and fermion endpoints these generators reduce to the usual quadratic oscillator representation. For fractional statistics these are the algebraic model’s assigned quadratic observables. Even for effective point anyons, they differ from directly projecting the bare Cartesian squares. For example, use the dimensionless full relative coordinate $w=(x_{\rm full}-iy_{\rm full})/(2\ell)$. Multiplication by $w^2/2$ connects neighboring normalized orbitals with coefficient $\tfrac12\sqrt{(j+1)(j+2)}$, whereas $K_+$ has coefficient $\sqrt{(n+1)(n+\alpha+1/2)}$. The difference between the squares of these coefficients is $\alpha(\alpha-1)/4$; it vanishes only at the boson and fermion endpoints. The radial operator agrees, but the off-diagonal quadratics require a specified mapping. Thus matching this solvable Hamiltonian and its observables to a particular physical saddle is part of the effective description, already before returning to the microscopic electron fluid. [The anyon-coordinate construction](https://arxiv.org/abs/cond-mat/9606214) exhibits the required angular-momentum-dependent factors.

With this operator assignment, the commutators give

$$\begin{aligned}
\dot K_0&=-2\lambda K_1,\\
\dot K_1&=-2\lambda K_0,\\
\dot K_2&=0.
\end{aligned}$$

Writing $\tau=\lambda t$, solve these two coupled linear equations:

$$\begin{pmatrix}K_0(t)\\K_1(t)\end{pmatrix}
=\begin{pmatrix}\cosh2\tau&-\sinh2\tau\\-\sinh2\tau&\cosh2\tau\end{pmatrix}
\begin{pmatrix}K_0(0)\\K_1(0)\end{pmatrix}.$$

Consequently $Q_x(t)=e^{-2\tau}Q_x(0)$ and $Q_y(t)=e^{2\tau}Q_y(0)$. **Squeezing** means this reciprocal contraction and expansion of widths. It is a unitary deformation of the packet, not cooling or loss of probability.

In the generalized coherent preparation, $\langle K_1\rangle=\beta=u/2$ and $\langle K_2\rangle=0$, exactly as in its matched distinguishable reference. Their difference in $K_0$ is $\chi(0)/2$. Subtracting the reference after evolving both states therefore gives

$$\chi_{\rm coh}(t)=\chi_{\rm coh}(0)\cosh2\tau.$$

Let $Y=(Y_1+Y_2)/2$ be the center-of-mass guiding-center coordinate. For a coherent packet centered at the saddle, its initial variance is $\langle Y^2\rangle=\ell^2/4$. The algebraic model then gives the assigned outgoing moment

$$\begin{aligned}
C_{\rm alg}(t)&=\langle Y^2(t)\rangle-\frac14\langle Q_y(t)\rangle\\
&=-\frac{\ell^2}{2}e^{2\tau}\chi_{\rm coh}(0).
\end{aligned}$$

If the model operators are matched to measured positions, $Y$ represents $(y_1+y_2)/2$ and $Q_y$ represents $(y_1-y_2)^2$. The identity $y_1y_2=Y^2-(y_1-y_2)^2/4$ then makes $C_{\rm alg}=\langle y_1y_2\rangle$. That operator matching is required for a spatial measurement. A negative initial separation excess produces a positive assigned outgoing moment. The saddle amplifies a correlation already present in the prepared state. It does not change the exchange angle.

For the localized-coordinate preparation, one extra expectation value matters:

$$\begin{gathered}
\delta=\langle K_1\rangle_{\rm loc}-\frac u2,\\
\chi_{\rm loc}(t)=\chi_{\rm loc}(0)\cosh2\tau-2\delta\sinh2\tau,
\end{gathered}$$

$$\frac{C_{\rm alg,loc}(t)}{\ell^2}=e^{2\tau}\left[-\frac{\chi_{\rm loc}(0)}2+\delta\right].$$

Using the projected-coordinate probabilities $p_n=u^{2n+\alpha}/[\Gamma(2n+\alpha+1)Z_\alpha(u)]$ from the pair derivation, the correction in the figure is

$$\delta=\frac u2\sum_{n=0}^\infty p_n
\left[\sqrt{1-\frac{\alpha(\alpha-1)}{(2n+\alpha+1)(2n+\alpha+2)}}-1\right].$$

It vanishes for bosons and fermions. To see its origin, define $T_+=w^2/2$ on the retained coordinate-wavefunction basis and $T_1=(T_++T_+^\dagger)/2$. The adjacent-coefficient recurrence of the projected-coordinate state gives $\langle T_1\rangle_{\rm loc}=u/2$ exactly. Thus $\delta=\langle K_1-T_1\rangle_{\rm loc}$ measures the operator-assignment difference in this state. It can decide the outgoing sign near a zero of $\chi$.

At large $u$ and $0<\alpha<1$, expanding the displayed sum gives $\delta\sim\alpha(1-\alpha)/(4u)$, which dominates the exponentially small $\chi_{\rm loc}$. Both preparations therefore share the leading outgoing tail

$$\frac{C_{\rm alg,loc}(t)}{\ell^2}
\sim\frac{C_{\rm alg,coh}(t)}{\ell^2}
\sim e^{2\tau}\frac{\alpha(1-\alpha)}{4u}.$$

They differ at subleading order and at finite separation. The figure starts at $\alpha=1/3$, $d/\ell=4$: at $\tau=0.6$, the assigned moments are $0.05515\ell^2$ and $0.06976\ell^2$ for the projected-coordinate and generalized coherent states. Using the bare projected quadratics would also change the Hamiltonian algebra; it cannot be implemented by simply deleting $\delta$ from this time evolution.

<!-- FIGURE: saddle -->

An ideal detector that records whether both particles exit into the same half-plane measures the probability

$$P_{\rm same}=\left\langle\mathbf 1_{y_1y_2>0}\right\rangle,$$

where the indicator is the projector onto that region for a specified outgoing position measurement. A real detector has a finite spatial and time response instead. When interpreted as a spatial moment, $C_{\rm alg}$ weights every event by the product $y_1y_2$: a few widely separated events can outweigh many near the center. Its sign cannot determine $P_{\rm same}$. Predicting detector counts therefore requires the outgoing state, a detector model and a mapping from the algebraic operators to measured coordinates.

The exponential evolution is valid only while the potential remains smooth over a packet and weak enough not to mix the retained levels with higher ones; eventually the expanding packet leaves the region where a quadratic saddle is an adequate approximation. Close encounters can bring quasihole cores and residual interactions into play. These conditions delimit the time interval over which a physical saddle could follow the simple exponential evolution.

A more general quadratic potential provides a useful extension. For one guiding center, let $V=(aX_s^2+bY_s^2)/2$, where $a,b$ are the energy curvatures along its principal axes. This gives $\ddot X_s=-(\ell^4ab/\hbar^2)X_s$. Curvatures of the same sign give oscillatory motion; opposite signs give exponential drift. The [2025 preprint by Basani, Subramanyan and Vishveshwara](https://arxiv.org/abs/2509.15488) develops such trap and saddle dynamics for the generalized coherent pair states. Its symmetry methods build on the same quadratic algebra. Changing a curvature can change stable motion into unstable motion; it does not interpolate the particle statistics.

</details>

## When a splitter has an interior

A **beam splitter** couples two incoming channels to two outgoing channels; each channel is a propagating mode. I first take a lossless splitter whose scattering amplitudes are effectively constant over the incident packet's wave numbers. A balanced splitter sends one incident particle to either output with probability $1/2$. I inject one particle in each input, with identical synchronized packets and matching internal states. Bosons then leave together; fermions leave in different outputs. The alternatives “both transmit” and “both reflect” interfere. This conclusion depends on the matching of the packets and on the one-particle scattering amplitudes.

[Samal, Vishveshwara, Gefen and Väyrynen (2026)](https://arxiv.org/abs/2412.19674) studied an **extended collider** in which a particle can make several trips around an antidot—a depleted region with a circulating edge path—before exiting. One particle already interferes with itself. A comparison that discards this coherence can suggest **bunching**, an excess of same-output events relative to the chosen reference, even for fermions.

I therefore keep the apparatus's one-particle interference in the reference calculation, while making the two particles distinguishable. Subtracting this reference isolates the exchange contribution in the model. The paper does this for noninteracting bosons and fermions. It leaves an anyonic extension open, because even a single-source process can contain braiding information.

An anyonic extension must specify the contributing paths and tunneling processes. Replacing the bosonic or fermionic exchange sign by $e^{i\theta}$ alone does not determine the result.

<details class="derivation">
<summary>Derivation: packet interference and the two distinguishable references</summary>

This calculation is independent of the pair-state algebra. It uses only one-particle scattering and bosonic or fermionic symmetrization. I compare the coincidence probability with a reference made from distinguishable particles, keeping their input packets and the apparatus fixed.

The [transport derivation of incoming flux and mean current](https://n-y-l.github.io/quantum-transport-notes/docs/notes.html#counting) relates channels to reservoirs. The two-particle calculation below additionally requires the interference between scattering alternatives.

<span id="point-splitter"></span>

Start with a pointlike splitter and two identical incident packets, one in each input channel. A channel is a propagating input or output mode. At wave number $k$, let $T(k)$ be the amplitude to remain in the original channel and $R(k)$ the amplitude to switch channels. The **scattering matrix** $S(k)$ maps incoming amplitudes to outgoing ones. For a symmetric, lossless device,

$$\begin{gathered}
S(k)=\begin{pmatrix}T(k)&R(k)\\R(k)&T(k)\end{pmatrix},\\
|T|^2+|R|^2=1,\\
TR^*+RT^*=0.
\end{gathered}$$

At a point splitter these amplitudes can be approximately constant over the packet spectrum. A **coincidence** means one particle in each output; denote its probability by $P_{11}^{B}$ for bosons and $P_{11}^{F}$ for fermions. It has two indistinguishable alternatives: both particles remain or both switch. Symmetrization adds their amplitudes for bosons and antisymmetrization subtracts them for fermions. With identical simultaneous packets,

$$\begin{aligned}
P_{11}^{B}&=(|T|^2-|R|^2)^2,\\
P_{11}^{F}&=1.
\end{aligned}$$

At a balanced splitter, these are zero and one. The result assumes matching internal states and temporal packets; distinct spin states or delayed packets can remove the exchange interference.

A source supplies incoming particles; a drain is a large output reservoir that collects them. An extended collider can keep a packet circulating before letting it out. In the model of [Samal, Vishveshwara, Gefen and Väyrynen](https://arxiv.org/abs/2412.19674), two channels couple through a loop around an **antidot**, a depleted region supporting a closed edge path. An **edge channel** is a low-energy mode propagating along the boundary of a Hall fluid. A particle may complete different numbers of loops before reaching a drain. These delayed alternatives interfere even when only one source is active. This is single-particle self-interference; no partner is required.

A smaller example of this one-particle interference is the [side-orbital calculation](https://n-y-l.github.io/quantum-transport-notes/docs/notes.html#side-orbital): a coherent excursion into a second orbital can cancel transmission completely. Although the device differs, it demonstrates why a one-source reference must retain interference inside the apparatus.

<span id="collider-packets"></span>

Take channels with the same linear dispersion, $E(k)=\hbar vk$ after choosing the energy origin, so every component has propagation speed $v$. Normalize the wave-number states by $\langle k|k^\prime\rangle=\delta(k-k^\prime)$. Use identical synchronized pure input packets with common amplitude $\phi(k)$ and probability density $p(k)=|\phi(k)|^2$, normalized by $\int p(k)dk=1$. The detectors count all outgoing times. Let $a,b$ be the total probabilities to remain or switch channels, and let $J$ be the transmitted–reflected amplitude overlap:

$$\begin{aligned}
a&=\int p(k)|T(k)|^2dk,\\
b&=1-a,\\
J&=\int p(k)T(k)R^*(k)dk.
\end{aligned}$$

The probabilities $a,b$ can be measured with one source active at a time. Write the outgoing coincidence amplitude at wave numbers $k,k'$ as

$$\begin{aligned}
\mathcal A_{B/F}(k,k')&=\phi(k)\phi(k')\\
&\quad\big[T(k)T(k')\pm R(k)R(k')\big].
\end{aligned}$$

The first term leaves both particles in their original channels; the second switches them. Both alternatives put one particle in each output, so their amplitudes must be added before squaring. Counting all outgoing temporal modes amounts to summing probabilities over the orthogonal spectral modes, giving $P_{11}=\int dk\,dk'|\mathcal A|^2$. The two squared terms yield $a^2+b^2$. The cross term factorizes into $J^2$, so

$$\begin{aligned}
P_{11}^{B/F}&=a^2+b^2\pm2\operatorname{Re}J^2\\
&=a^2+b^2\mp2|J|^2.
\end{aligned}$$

The last sign follows from unitarity: $TR^*$ is imaginary at every $k$, hence $J$ is imaginary. Equal spectral probabilities without equal phases and arrival times would not justify this step; a relative delay changes the amplitude overlap.

For a point splitter, $|J|^2=ab$ and the earlier formulas return. In an extended device, transmitted and reflected packets can have different time profiles, so $|J|^2<ab$ is possible. Two fermions can then leave through the same drain in different temporal modes. The exclusion principle forbids occupation of the same complete one-particle state, not use of the same macroscopic wire.

Let $P_{i\to j}$ be the probability that a particle from input $i$ reaches output $j$. Define the reference coincidence probability $B_2$ for distinguishable particles, preserving everything the apparatus does to each packet:

$$\begin{aligned}
B_2&=P_{1\to1}P_{2\to2}+P_{1\to2}P_{2\to1}\\
&=a^2+b^2.
\end{aligned}$$

These probabilities are obtained by activating the sources separately under the same device conditions. Subtract this reference to define the remaining exchange contribution $Q_{\rm irr}$:

$$Q_{\rm irr}^{F/B}\equiv P_{11}^{F/B}-B_2=\pm2|J|^2.$$

The term “irreducible” here denotes that specific subtraction. For a dilute train of random emissions, extracting the analogous two-source coincidence from measured currents also requires subtracting correlations recorded with each source alone, to remove pairs emitted by the same source. The single-source mean currents then provide the four probabilities in $B_2$. The source subtraction and the subsequent $B_2$ comparison remove different contributions.

For comparison, a different reference $B_1$ discards interference between the paths of each individual particle. Sum path probabilities instead of path amplitudes, obtaining $a_{\rm cl},b_{\rm cl}$, and set $B_1=a_{\rm cl}^2+b_{\rm cl}^2$. It removes single-particle coherence as well as exchange interference, so it need not agree with $B_2$. The figure gives an explicit case in which this changes the apparent sign.

For the displayed loop, $r$ is the real amplitude to remain on a local channel at either of the two junctions, $L$ is the loop circumference, and $q=kL$ is a dimensionless wave number. In this section $q$ denotes that wave number, rather than electric charge. With the junction phase chosen as zero,

$$\begin{aligned}
T(q)&=\frac{r(1-e^{iq})}{1-r^2e^{iq}},\\
R(q)&=-\frac{(1-r^2)e^{iq/2}}{1-r^2e^{iq}}.
\end{aligned}$$

Expanding the denominator as a geometric series identifies successive windings. Squaring each winding separately gives $b_{\rm cl}=(1-r^2)/(1+r^2)$ and $a_{\rm cl}=2r^2/(1+r^2)$. Adding the amplitudes first gives the resonant $T,R$ used in $B_2$. The figure integrates over a uniform incident spectrum $0\leq q\leq L/\ell_p$, where $\ell_p$ sets the inverse spectral width. One edge of this window is fixed at the resonance $q=0$, where the paths give complete channel switching and $T=0$; translating the window relative to the resonances would change the probabilities. Here $\ell_p$ is not a root-mean-square packet length: a perfectly sharp spectral window has long spatial tails.

<!-- FIGURE: collider -->

At $r=0.95$ and $\ell_p/L=2.5$, the calculated fermion coincidence is about $0.808$. It lies below $B_1\simeq0.903$ but above $B_2\simeq0.552$. The apparent “fermion bunching” relative to $B_1$ includes the effect of restoring single-particle coherence. The calibrated exchange contribution remains positive, about $0.256$.

This is a boson/fermion theory of a noninteracting extended scatterer, published in 2026. It does **not** derive an anyon version by replacing a sign with $e^{i\theta}$. In an anyon device, even a process with only one active source may involve a tunneling excitation winding in spacetime around other excitations. That statistical contribution can enter the source-alone signal being subtracted. Extending the reference procedure while retaining the desired anyonic information is an open problem identified by the paper. Both the bulk-pair and collider calculations show that a measured correlation depends on preparation and propagation as well as exchange.

</details>
