# Anyons: paths, states, and measurements

[Open the experiments](../experiments.html) · [Ideas to explore next](catalog.md) · [Sources](references.md)

Put two identical particles back where they started and take a photograph. Nothing has changed. Now let their quantum amplitudes interfere: the counts can change. The photograph missed something that the experiment remembers—the paths.

Start by separating paths, states, and measurements. Then build an anyon from a spin Hamiltonian, organize collective fusion states, and apply the ideas to a particular quantum Hall preparation. Bring ordinary quantum states, matrices, and interference; no quantum field theory is needed. The [contents](../index.html) give the matching interactive reading order.

## The particles return. What has changed?

A **configuration** specifies the particle positions at one instant. For two identical particles, exchanging the labels on those positions gives the same physical configuration. Remove configurations in which the particles coincide, because the separated-particle description is the one we want to study. A continuous exchange is then a closed path in this configuration space, even though two temporarily labeled particles end at opposite positions.

The relative displacement $\boldsymbol r=\boldsymbol r_1-\boldsymbol r_2$ makes this concrete. In a plane it cannot pass through the origin, and identical-particle configurations identify $\boldsymbol r$ with $-\boldsymbol r$. One exchange turns this vector through a half-turn; two exchanges in the same direction produce a full winding. That winding cannot be continuously removed without crossing the excluded origin. A **braid** records these particle trajectories through time.

In three spatial dimensions, the extra direction lets the double exchange contract to a trivial path. For an exchange represented by a scalar phase, its square must therefore equal one, giving the bosonic or fermionic signs. In two dimensions this constraint disappears:

$$\begin{aligned}
\text{one positive exchange:}&\quad e^{i\theta},\\
\text{one positive full winding:}&\quad e^{2i\theta}.
\end{aligned}$$

This scalar case defines **Abelian** statistics: the exchange factors commute. The argument does not classify every possible representation acting on internal states. The configuration-space approach originates with [Leinaas and Myrheim](https://doi.org/10.1007/BF02727953).

[In the exchange experiment](../experiments.html#exchange), positive means counterclockwise; reversing a path gives the inverse factor. Try making an extravagant detour. If the winding is unchanged and the particles never meet, its statistical contribution stays fixed. Bosons have $\theta=0$ and fermions $\theta=\pi$; $\theta=\pi/3$ is another exchange rule, not a probability of being fermionic. The slider compares models rather than continuously changing one material's excitation type.

## How can electrons make something that is not an electron?

In an electronic material, an anyon is a **quasiparticle**: a localized excitation of a many-electron state that can be moved and detected as a particle. Its exchange properties belong to the collective excitation; the underlying electrons retain fermionic statistics. Two-dimensional motion permits these possibilities, but does not by itself produce the required state of matter.

The models of well-separated anyons assume an energy **gap** $\Delta$ between the relevant states and unwanted bulk excitations. Transport should be slow enough to avoid exciting across that gap, and the anyons should remain far enough apart that their cores do not overlap appreciably. Temperature, unwanted excitations, and residual interactions can spoil the description; a gap alone does not establish an anyon phase.

Even ideal slow transport accumulates several contributions. The **dynamical phase** depends on energy and elapsed time, $-\int E(t)\,dt/\hbar$. A **Berry phase** is a geometric contribution from how the instantaneous quantum state changes along the path. Its statistical part distinguishes braids; other geometric contributions, including a charged particle's magnetic-flux phase, can depend on the shape or area. Thus deforming a path need not preserve its complete measured phase. For non-Abelian anyons, transport can act as a matrix within a low-energy state space instead of supplying only a scalar phase. [Nayak et al., Sec. II.A.2](https://arxiv.org/abs/0707.1889) develops this separation.

A concrete example is the electronic **Laughlin state** at filling factor $\nu=1/m$, with positive odd integer $m$. Filling factor counts electrons per magnetic flux quantum. Its elementary quasihole has charge $+e/m$, where the electron charge is $-e$ and $e>0$: a localized charge deficit shared by the collective state, not a chopped-up electron. With the handedness chosen here, its exchange angle is $\theta=\pi/m$. Thus at $\nu=1/3$, measuring charge $e/3$ and measuring an exchange phase $\pi/3$ ask different questions. Charge sets electromagnetic coupling; statistics concerns exchange. [Laughlin's construction](https://doi.org/10.1103/PhysRevLett.50.1395) establishes the fractional excitation; [Arovas, Schrieffer, and Wilczek](https://doi.org/10.1103/PhysRevLett.53.722) calculate its statistics. Reversing braid orientation conjugates the phase.

## Give the phase something to interfere with

An overall phase multiplying one isolated state cannot change measurement probabilities. To see a statistical phase, compare two coherent alternatives leading to the same output. In the ideal interferometer, one route winds around the enclosed anyons relative to the other.

Let $|u\rangle$ and $|l\rangle$ denote upper and lower routes. After balanced splitting and propagation, a coherent state is

$$|\Psi\rangle=\frac{|u\rangle+e^{i\Phi}|l\rangle}{\sqrt{2}},
\qquad \Phi=\phi+2Nw\theta.$$

Here $N$ is the number of enclosed anyons of the probe's species, $w$ is the signed relative winding count, and $\phi$ collects the ordinary relative phase. A balanced recombiner adds the route amplitudes at output 0 and subtracts them at output 1. Each full route contributes magnitude $1/2$, giving

$$\begin{gathered}
c_0=\frac{1+e^{i\Phi}}{2},\qquad
c_1=\frac{1-e^{i\Phi}}{2},\\[4pt]
P_0=|c_0|^2=\frac{1+\cos\Phi}{2},\qquad P_1=1-P_0.
\end{gathered}$$

The [interference experiment](../experiments.html#interference) compares the output-0 fringe with and without enclosed anyons as the ordinary phase is swept. Cancellation at one output redirects probability to the other. For one positive winding, adding one enclosed anyon adds $2\theta$ to $\Phi$, moving a fringe toward smaller $\phi$.

Try $\phi=0$, one winding, and $\theta=\pi/3$. With no enclosed anyon, output 0 is certain. Add one, and $\Phi=2\pi/3$ gives $P_0=(1-1/2)/2=1/4$. No particle needed to hit the enclosed excitation; the interfering alternatives acquired a different relative phase.

Partial coherence requires more than shortening one state's amplitude. In the balanced-route basis, use a **density matrix**, which describes both pure states and statistical mixtures:

$$\rho=\frac12\begin{pmatrix}
1&V e^{-i\Phi}\\
V e^{i\Phi}&1
\end{pmatrix},\qquad 0\leq V\leq1.$$

The diagonal entries are route populations; the off-diagonal entries retain their coherence. The visibility $V$ reduces that coherence while leaving both populations at $1/2$. Recombining gives $P_0=[1+V\cos\Phi]/2$. At $V=0$ there is no fringe; at $V=1$ the pure-state amplitude picture applies. For intermediate $V$, no single state vector represents this density matrix.

<details>
<summary>Check the density-matrix calculation</summary>

Output 0 measures $|+\rangle=(|u\rangle+|l\rangle)/\sqrt{2}$. Therefore

$$P_0=\langle+|\rho|+\rangle
=\frac{\rho_{uu}+\rho_{ll}+\rho_{ul}+\rho_{lu}}2
=\frac{1+V\cos\Phi}{2}.$$

The eigenvalues of $\rho$ are $(1+V)/2$ and $(1-V)/2$, both nonnegative in the stated range. Its purity is $\operatorname{Tr}\rho^2=(1+V^2)/2$. Phase averaging or route information recorded by an environment can produce reduced coherence; the slider specifies the resulting density matrix rather than a microscopic noise mechanism.

</details>

How does this reach a laboratory? The [Nakamura et al. experiment](https://arxiv.org/abs/2006.14115) reports phase slips consistent with $2\pi/3$ braiding at filling $1/3$. Our calculation isolates output probabilities; interpreting that device also requires charge, area, and tunneling. A fringe is evidence about a model of the whole apparatus, not a label announcing its cause.

## Calculate the phase instead of supplying it

In the [Berry-phase note](../berry.html), a spin follows a slowly turning field with Hamiltonian $H=-\Delta\,\boldsymbol n\cdot\boldsymbol\sigma/2$, where $\Delta>0$ is the gap and $\boldsymbol n$ is a unit vector. Its instantaneous ground state can be written

$$|u(\beta,\phi)\rangle=\begin{pmatrix}\cos(\beta/2)\\e^{i\phi}\sin(\beta/2)\end{pmatrix}.$$

The polar angle is $\beta$; increasing azimuth $\phi$ describes a positive circuit. Neighboring eigenvectors need not have compatible phase conventions. Provided adjacent states have nonzero overlap, multiply their normalized overlaps around the closed loop instead:

$$W_N=\prod_{j=0}^{N-1}\frac{\langle u_{j+1}|u_j\rangle}{|\langle u_{j+1}|u_j\rangle|},\qquad u_N=u_0,\qquad \gamma_N=\arg W_N.$$

Under $|u_j\rangle\mapsto e^{i\alpha_j}|u_j\rangle$, each factor acquires $e^{i(\alpha_j-\alpha_{j+1})}$; the phases cancel around the cycle. Try scrambling those phase choices. The links change; the loop does not. For a fine discretization of the latitude, $\gamma_N$ approaches $-\pi(1-\cos\beta)$ modulo $2\pi$. This is half the negative solid angle. Coarse sampling approximates a different, polygonal path through state space, so convergence matters. [Berry's original paper](https://doi.org/10.1098/rspa.1984.0023) gives the adiabatic phase; [Fukui, Hatsugai, and Suzuki](https://arxiv.org/abs/cond-mat/0503172) use normalized overlaps to build gauge-invariant lattice calculations.

This spin is not an anyon. Change the loop's area and its phase changes continuously: geometric does not mean topological. For a nearly degenerate group of states, overlaps become matrices and transport can mix the states. That is the setting of [Wilczek and Zee](https://doi.org/10.1103/PhysRevLett.52.2111); such mixing alone still does not establish anyons. In an anyon problem we must identify a suitable low-energy space, keep excitations separated, and isolate what depends on the braid.

## Build an anyon out of spins

The **toric code** places a qubit on every edge of a periodic square lattice. Let $X_j,Z_j$ be Pauli operators on edge $j$, distinct from the encoded Pauli operators introduced later. At each vertex $s$, multiply $X$ over the four incident edges; around each square plaquette $p$, multiply $Z$ over its boundary:

$$\begin{gathered}
A_s=\prod_{j\ni s}X_j,\qquad B_p=\prod_{j\in\partial p}Z_j,\\
H=-J_e\sum_s A_s-J_m\sum_p B_p,\qquad J_e,J_m>0.
\end{gathered}$$

The commuting operators $A_s$ and $B_p$ are **stabilizers**: the ground space has eigenvalue $+1$ for all of them. A vertex and a plaquette share zero or two edges; each shared edge contributes an anticommutation sign, so the two signs cancel. A violation $A_s=-1$ is called an electric excitation $e$; $B_p=-1$ is a magnetic excitation $m$. These names describe the model's charges, not literal electron and magnetic-monopole particles. [Kitaev's construction](https://arxiv.org/abs/quant-ph/9707021) supplies the Hamiltonian and excitations.

Apply $Z$ along an open path of lattice edges. Interior vertices touch two operated edges and retain their stabilizer sign; each endpoint touches one, creating an $e$ pair from the ground space. Similarly, an $X$ string crossing edges between plaquette centers creates and moves an $m$ pair. In the [pair-string picture](../experiments.html#toric), selecting neighboring plaquettes applies $X$ to their shared edge.

Predict the energy as you extend that string. Only the endpoints violate stabilizers: each $m$ changes one Hamiltonian term from $-J_m$ to $+J_m$. The pair therefore costs $4J_m$ above the ground energy, independent of its separation. The interior leaves no trail of excited plaquettes. This follows directly from [Kitaev's Hamiltonian](https://arxiv.org/abs/quant-ph/9707021); [Dennis et al.](https://arxiv.org/abs/quant-ph/0110143) connects the endpoints to error detection and memory.

On the periodic lattice, each species has even total excitation parity; a loop can still enclose an odd count when a partner lies outside. Direct configuration editing specifies a charge pattern rather than this local preparation protocol.

Now close an $e$ string around a contractible region $S$. Multiplying the enclosed plaquette operators cancels every interior edge twice, leaving the boundary:

$$W_e(\partial S)=\prod_{j\in\partial S}Z_j
=\prod_{p\in S}B_p.$$

For a state $|\Psi\rangle$ with $N_m$ definite enclosed magnetic excitations,

$$W_e(\partial S)|\Psi\rangle=(-1)^{N_m}|\Psi\rangle.$$

One enclosed $m$ therefore contributes a minus sign to the $e$ loop, despite both species having bosonic self-exchange. Repeating the winding gives $(-1)^{wN_m}$. This **mutual statistics** depends on both species. Detecting its phase requires a reference process, just as in the interferometer.

The interactive grid is a local patch tracking string endpoints and loop factors. It does not represent the complete periodic spin state, evolve its many-spin wavefunction, or decode noisy measurements.

## All the defects disappeared. Is the memory safe?

Create an $m$ pair, take one around a periodic direction, and bring it back to its partner. The pair annihilates, removing its $4J_m$ excitation energy. Every stabilizer reads $+1$ again—and yet the completed string can act on the encoded state. Returning to the ground energy need not return the same ground state.

The memory readout gives $E-E_0=2J_mN_m$, where $E_0$ is the ground energy and $N_m$ now counts all remaining magnetic defects, rather than those inside a chosen loop. These $X$ strings leave every $A_s$ unchanged, so there is no electric-excitation contribution.

The [memory experiment](../experiments.html#memory) makes the boundary periodic: leaving one edge of the drawing re-enters through the opposite edge. Compare a small closed $X$ string with one wrapping right around the lattice. The small loop contracts and is a product of local stabilizers. The wrapping loop cannot be filled by a bounded region; it is a **logical operator**, acting within the ground-state space. A torus has two independent wrapping directions and four ground states, enough for two encoded qubits. Local measurements in a small contractible region cannot distinguish these ideal ground states; logical loop measurements can. [Kitaev, Secs. 1–2](https://arxiv.org/abs/quant-ph/9707021) constructs this nonlocal information.

<details>
<summary>Count the four ground states without field theory</summary>

An $L\times L$ periodic square lattice, with $L\geq3$, has $2L^2$ edge qubits. There are $L^2$ vertex and $L^2$ plaquette stabilizers, but $\prod_s A_s=\prod_p B_p=I$: each edge occurs twice. These two relations leave $2L^2-2$ independent constraints. Each fixed stabilizer eigenvalue halves the state-space dimension, so

$$\dim\mathcal H_{\rm ground}=2^{2L^2-(2L^2-2)}=4.$$

The missing two constraints leave two quantum degrees of freedom; the logical loops act on them.

</details>

Here is the sign test. A horizontal dual-lattice $X$ loop crosses a vertical direct-lattice $Z$ loop once. Since $XZ=-ZX$ on their shared edge, the completed $X$ loop reverses the eigenvalue of that logical $Z$ measurement. For an initial state with definite logical $Z$, this flips its encoded value. It need not change every possible input state: an eigenstate of the applied logical $X$ is unchanged up to phase.

The display counts crossings of two fixed periodic seams modulo two. For **closed** strings, these parities distinguish trivial cycles from logical ones; open strings still have endpoints and do not yet define a ground-space operation. The point of topological protection is now concrete: a sufficiently small local disturbance cannot implement a whole wrapping string. A sequence of disturbances can. Detecting and correcting their evolving endpoints is the task of a decoder, and [Dennis et al.](https://arxiv.org/abs/quant-ph/0110143) shows why that task matters. The demo tracks string algebra and logical parity, not a noisy memory's lifetime.

## What identifies an Abelian theory?

The [$K$-matrix note](../abelian.html) packages fusion and statistics into integer vectors and a bilinear form. The toric code and double-semion model each have four excitation types with the same rules for combining them, but different exchange factors. That is a useful warning: even the list of particles and their fusion rules does not identify all of their physics. An additional charge vector specifies electromagnetic response. Attaching a local particle leaves mutual braiding unchanged; in an electronic theory it can flip an exchange sign. Keeping that distinction explicit prevents a bookkeeping convention from becoming a false physical claim.

## Why do Fibonacci numbers turn up here?

**Topological charge** labels an excitation type, not its electric charge; $1$ denotes the vacuum type. **Fusion** asks which total type a group has when regarded together. Fibonacci anyons have types $1$ and $\tau$, with rules

$$1\times\tau=\tau,\qquad \tau\times\tau=1+\tau.$$

The plus sign lists allowed channels, not a superposition with specified amplitudes or equally likely results. Fuse particles successively and record the cumulative charge. If it is $1$, adding $\tau$ forces the next charge to be $\tau$; if it is $\tau$, there are two possibilities. Let $a_n$ and $b_n$ count paths for $n$ particles ending in $1$ and $\tau$:

$$\begin{gathered}
a_{n+1}=b_n,\qquad b_{n+1}=a_n+b_n,\\
(a_0,b_0)=(1,0).
\end{gathered}$$

For four particles with total vacuum, the two paths are

| Path | Cumulative charge, starting with the empty system |
| --- | --- |
| 1 | $1\to\tau\to1\to\tau\to1$ |
| 2 | $1\to\tau\to\tau\to\tau\to1$ |

Each is a basis state for this fusion ordering. A general state assigns amplitudes to them; counting two states does not make their probabilities $1/2$. Fixing total charge defines the sector being counted: four particles instead have three paths with total $\tau$. [Explore the paths](../experiments.html#fusion) before approaching Fibonacci braid matrices and the gate constructions of [Bonesteel et al.](https://arxiv.org/abs/quant-ph/0505065).

Different anyon models have different computational powers. Ising braiding alone does not supply arbitrary quantum gates; an additional resource is needed, as in [Bravyi's proposal](https://arxiv.org/abs/quant-ph/0511178). Fibonacci braids can approximate a universal gate set. “Non-Abelian” tells us that order matters; it does not tell us everything those operations can compute.

## Turn fusion data into an operation

The [fusion-basis note](../fusion-basis.html) asks which pair has a definite collective charge. The same three-anyon state has different coefficients in the two association bases. For Fibonacci anyons, the basis transformation involves $d=(1+\sqrt5)/2$: its squared entries give $d^{-2}$ and $d^{-1}$, which add to one. Exchanging the second pair is diagonal in its own fusion basis; conjugating by the basis transformation produces a matrix that mixes the first pair's channels. Checking inverses and the braid relation tests the supplied representation. It does not derive the entire anyon theory, or prove gate universality from a few examples.

## The same positions can hide a different state

Now compare the Fibonacci calculation with a different non-Abelian model. Keep four Ising anyons at specified positions. Their collective state has room to store information. The types are the vacuum $1$, a non-Abelian excitation $\sigma$, and a fermionic excitation $\psi$. The fusion rule is

$$\sigma\times\sigma=1+\psi.$$

The plus sign lists two allowed fusion channels, not equally probable results. Four $\sigma$ anyons with fixed total vacuum have a two-dimensional **fusion Hilbert space**. Choose $|0\rangle$ when the first pair fuses to $1$, and $|1\rangle$ when it fuses to $\psi$. The other pair has the matching charge so the total remains vacuum. These labels describe collective states, not a separate spin carried by each anyon. In the ideal separated-anyon limit, a measurement near just one anyon cannot read these collective labels.

Exchanging a pair with definite fusion channel multiplies its amplitude by that channel's **R phase**. Choosing a different pair requires a change of fusion basis, described by an **F matrix**. In the convention used here,

$$\begin{gathered}
R=\begin{pmatrix}e^{-i\pi/8}&0\\0&e^{3i\pi/8}\end{pmatrix},\\[5pt]
F=\frac1{\sqrt{2}}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\\[5pt]
B_1=B_3=R,\qquad B_2=F^{-1}RF=FRF.
\end{gathered}$$

$B_j$ exchanges neighboring positions $j$ and $j+1$. To exchange the middle pair, express the state in the basis where that pair's charge is definite, apply $R$, then transform back. The basis change itself is a mathematical description, not an extra physical braid. These numerical matrices are data of the Ising model; ordinary indistinguishability alone does not determine them. Their conventions are specified in [Nayak et al., Sec. II.A.1 and Eq. (50)](https://arxiv.org/abs/0707.1889); [Ivanov](https://arxiv.org/abs/cond-mat/0005069) derives the non-Abelian exchange action for vortices with Majorana modes.

Their order dependence has a familiar mechanism: rotations about different axes. Write a normalized state as $c_0|0\rangle+c_1|1\rangle$. Its **Bloch vector** collects expectations of the Pauli operators on this encoded two-state space:

$$\begin{aligned}
x=\langle X\rangle&=2\operatorname{Re}(c_0^*c_1),\\
y=\langle Y\rangle&=2\operatorname{Im}(c_0^*c_1),\\
z=\langle Z\rangle&=|c_0|^2-|c_1|^2.
\end{aligned}$$

Since $FZF=X$, the same braid matrices can be written

$$B_1=e^{i\pi/8}e^{-i\pi Z/4},\qquad
B_2=e^{i\pi/8}e^{-i\pi X/4}.$$

The common phase does not affect these encoded-qubit measurements. Each remaining exponential rotates the Bloch vector through $+\pi/2$ about its indicated axis. Predict the result in the [braid experiment](../experiments.html#braids) starting from $|0\rangle$, whose vector points along $+z$. Chronological “1 then 2” means $B_2B_1|0\rangle$: the $z$ rotation leaves it still, then the $x$ rotation takes it to $-y$. Reverse the order and it ends at $+x$.

A $Z$ measurement reads the original pair's fusion charge: $+1$ means vacuum and $-1$ means $\psi$. Both final vectors give those outcomes with equal probability, hiding the difference. An $X$ measurement instead gives $+1$ with probability $1/2$ for the first order and 1 for the reverse. Measuring $X$ or $Y$ requires a basis rotation before fusion readout; generally a Pauli measurement $O$ gives probabilities $(1\pm\langle O\rangle)/2$. Noncommuting operations change the state, but the chosen measurement determines whether you see it.

For weakly split fusion states, transport should avoid bulk excitations yet finish before the residual splitting accumulates an appreciable relative dynamical phase. Indefinitely slower motion is not automatically closer to the ideal braid.

### A fusion state can retain information about the route

The [Ising note's illustrated thought experiment](../experiments.html#braids) makes two earlier ideas meet. Suppose coherent control applies either $I$ or a full middle-pair winding, $U=B_2^2=e^{-i\pi/4}X$, to an initial fusion state $|\chi\rangle$. The positions return in either alternative. A balanced recombiner gives

$$P_0=\frac{1+\operatorname{Re}[e^{i\phi}\langle\chi|U|\chi\rangle]}2,$$

where $\phi$ includes the other controllable relative phases and the output measurement does not resolve fusion. For $|\chi\rangle=|0\rangle$, the alternatives leave orthogonal records and $P_0=1/2$. For $|\chi\rangle=|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$, the records agree up to phase and $P_0=[1+\cos(\phi-\pi/4)]/2$. Both preparations have the same total vacuum charge. Entanglement with an unmeasured fusion state can remove path interference while the joint state remains pure. A braid's common phase, invisible in an isolated encoded-state measurement, can become a relative phase between coherent alternatives. This ideal controlled operation is not a device model; [Bonderson, Shtengel, and Slingerland](https://arxiv.org/abs/0707.4206) develop the broader non-Abelian interferometry theory.

## Can the same anyons bunch and antibunch?

It is tempting to picture fractional statistics as a fixed halfway point between bosons and fermions. Test that picture by holding the exchange angle fixed and moving two prepared wave packets farther apart. In [Vishveshwara and Cooper's model](https://arxiv.org/abs/0908.3945), their mean squared separation can cross from above to below a distinguishable-particle reference. Nothing in the exchange rule has changed.

The particles occupy the **lowest Landau level**, the lowest cyclotron-energy level in a perpendicular magnetic field. The remaining slow position variables describe their orbit centers, or **guiding centers**. Let $\ell$ be the single-particle magnetic length in this effective model, $d$ the separation of the packet's localization labels, $s=d/\ell$, and $\alpha=\theta/\pi$. The plotted quantity is

$$\chi(s,\alpha)=\frac{\langle r^2\rangle_\alpha-\langle r^2\rangle_{\rm ref}}{4\ell^2},
\qquad \langle r^2\rangle_{\rm ref}=(s^2+2)\ell^2.$$

Here $r$ is the relative guiding-center separation, and the reference uses distinguishable particles with matched packet labels. Positive $\chi$ means a larger mean squared separation than that reference, and negative $\chi$ a smaller one. These are the paper's antibunching and bunching comparisons; they are not detector coincidence probabilities.

[Try the correlation experiment](../experiments.html#correlations) at $\alpha=1/3$. At $s=2$, the model gives $\chi\simeq-0.1193$: a mean squared guiding-center separation of about $5.523\ell^2$, compared with $6\ell^2$ for the reference. Yet its formal small-separation limit is $\chi\to+1/3$. The preparation selects different weights among the same allowed angular states; no interparticle force was added to produce this crossover.

<details>
<summary>Compute the curve from its angular-state weights</summary>

Set $u=s^2/4$. A relative half-turn exchanges the particles, so the angular boundary condition is $\psi(\varphi+\pi)=e^{i\pi\alpha}\psi(\varphi)$. An angular eigenstate $e^{iL\varphi/\hbar}$ must therefore have $L/\hbar=2k+\alpha$; the lowest-Landau-level branch used here has $k=0,1,\ldots$. For the localized states in the paper's Eq. (3), their normalized weights are

$$p_k=\frac{u^{2k+\alpha}/\Gamma(2k+\alpha+1)}
{\displaystyle\sum_{j=0}^{\infty}u^{2j+\alpha}/\Gamma(2j+\alpha+1)},
\qquad \chi=\sum_{k=0}^{\infty}(2k+\alpha)p_k-u.$$

The gamma function extends the factorial: $\Gamma(n+1)=n!$. The bosonic and fermionic limits provide useful checks:

$$\chi(s,0)=u(\tanh u-1),\qquad
\chi(s,1)=u(\coth u-1).$$

As $s\to0$, only the lowest angular state, $k=0$, survives after normalization. It has $\langle r^2\rangle_\alpha=(4\alpha+2)\ell^2$, compared with the reference's $2\ell^2$: subtract and divide by $4\ell^2$ to obtain $\chi\to\alpha$. The excess separation comes from the allowed angular state, without a repulsive potential. This endpoint is formal; coincident quasiparticle cores lie outside the physical separated-anyon description. These weights specify a preparation, not a universal consequence of the exchange angle alone. [Equations (3), (5), and (6)](https://arxiv.org/abs/0908.3945) give the construction.

</details>

## What would a research calculation have to establish?

A good next question is not merely “does the curve look right?” It is “what observation would rule out my interpretation?” The small models suggest concrete checks:

- **Identify the states and energy scales.** Let $\Delta_{\min}$ be the smallest gap to unwanted states along a path and $\delta E$ the energy spread within the fusion space. Slow motion suppresses leakage; excessive time can accumulate relative phases from the splitting. The schematic window $\hbar/\Delta_{\min}\ll T\ll\hbar/\delta E$ names competing scales, not a sufficient adiabaticity test. Leakage also depends on how the Hamiltonian changes and on its transition matrix elements. [Cheng, Galitski, and Das Sarma](https://arxiv.org/abs/1106.2549) work through these effects for Majorana braiding.
- **Specify the measurement.** Fractional electric charge, a statistical phase, a pair-separation moment, and a fusion probability are different observables. Write the operator or protocol before interpreting the plot.
- **Test what survives a change of description.** Local eigenvector phases must cancel from a closed Berry loop. A fusion-basis change must transform observables as well as states. Adding a local particle must preserve mutual statistics.
- **Test what survives a change of physics.** Numerical convergence is different from stability against Hamiltonian perturbations. The solvable toric code supplies exact degeneracy and string algebra; establishing the surrounding phase requires showing how its gap and nonlocal information persist away from that special point.

These are ways to ask sharper questions, not prerequisites for enjoying the pictures. Pick one surprise, reproduce its calculation, and change one assumption at a time.
