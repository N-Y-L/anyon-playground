# Anyons: paths, states, and measurements

[Open the experiments](../experiments.html) · [Ideas to explore next](catalog.md) · [Sources](references.md)

An exchange changes which particle occupies each position. For identical particles, that sounds like doing nothing: the final arrangement looks the same. Quantum mechanics nevertheless allows the path to affect amplitudes. These notes explain how that happens, how to measure it, and why different anyon models give different answers. Only ordinary quantum states, matrices, and interference are needed.

## 1. Identical configurations can be connected by different paths

A **configuration** specifies the particle positions at one instant. For two identical particles, exchanging the labels on those positions gives the same physical configuration. Remove configurations in which the particles coincide, because the separated-particle description is the one we want to study. A continuous exchange is then a closed path in this configuration space, even though two temporarily labeled particles end at opposite positions.

The relative displacement $\boldsymbol r=\boldsymbol r_1-\boldsymbol r_2$ makes this concrete. In a plane it cannot pass through the origin, and identical-particle configurations identify $\boldsymbol r$ with $-\boldsymbol r$. One exchange turns this vector through a half-turn; two exchanges in the same direction produce a full winding. That winding cannot be continuously removed without crossing the excluded origin. A **braid** records these particle trajectories through time.

In three spatial dimensions, the extra direction lets the double exchange contract to a trivial path. For an exchange represented by a scalar phase, its square must therefore equal one, giving the bosonic or fermionic signs. In two dimensions this constraint disappears:

$$\begin{aligned}
\text{one positive exchange:}&\quad e^{i\theta},\\
\text{one positive full winding:}&\quad e^{2i\theta}.
\end{aligned}$$

This scalar case defines **Abelian** statistics: the exchange factors commute. The argument does not classify every possible representation acting on internal states. The configuration-space approach originates with [Leinaas and Myrheim](https://doi.org/10.1007/BF02727953).

[In the exchange experiment](../experiments.html#exchange), positive means counterclockwise; reversing a path gives the inverse factor. Compare exchange and winding, then deform the path. The statistical contribution stays fixed while the winding is unchanged. Bosons have $\theta=0$ and fermions $\theta=\pi$; $\theta=\pi/3$ is a different exchange rule, not a probability of being fermionic. The slider compares models rather than continuously changing the identity of an excitation in one material.

## 2. Where the particle comes from, and what its phase contains

In an electronic material, an anyon is a **quasiparticle**: a localized excitation of a many-electron state that can be moved and detected as a particle. Its exchange properties belong to the collective excitation; the underlying electrons retain fermionic statistics. Two-dimensional motion permits these possibilities, but does not by itself produce the required state of matter.

The models of well-separated anyons assume an energy **gap** $\Delta$ between the relevant states and unwanted bulk excitations. Transport should be slow enough to avoid exciting across that gap, and the anyons should remain far enough apart that their cores do not overlap appreciably. Temperature, unwanted excitations, and residual interactions can spoil the description; a gap alone does not establish an anyon phase.

Even ideal slow transport accumulates several contributions. The **dynamical phase** depends on energy and elapsed time, $-\int E(t)\,dt/\hbar$. A **Berry phase** is a geometric contribution from how the instantaneous quantum state changes along the path. Its statistical part distinguishes braids; other geometric contributions, including a charged particle's magnetic-flux phase, can depend on the shape or area. Thus deforming a path need not preserve its complete measured phase. For non-Abelian anyons, transport can act as a matrix within a low-energy state space instead of supplying only a scalar phase. [Nayak et al., Sec. II.A.2](https://arxiv.org/abs/0707.1889) develops this separation.

A concrete condensed-matter example is the electronic **Laughlin state** at filling factor $\nu=1/m$, with positive odd integer $m$. Here filling factor counts electrons per magnetic flux quantum. Its elementary quasihole has charge $+e/m$, where the electron charge is $-e$ and $e>0$. With the handedness chosen to match this playground, the quasihole exchange angle is $\theta=\pi/m$. Charge and exchange angle are distinct properties: one sets electromagnetic coupling, the other the statistical part of braiding. [Laughlin's construction](https://doi.org/10.1103/PhysRevLett.50.1395) establishes the fractional excitation; [Arovas, Schrieffer, and Wilczek](https://doi.org/10.1103/PhysRevLett.53.722) calculate its statistics. Reversing braid orientation conjugates the phase.

## 3. Interference turns a relative phase into a probability

An overall phase multiplying one isolated state cannot change measurement probabilities. To see a statistical phase, compare two coherent alternatives leading to the same output. In the ideal interferometer, one route winds around the enclosed anyons relative to the other.

<svg viewBox="0 0 660 160" width="660" style="max-width:100%;height:auto" role="img" aria-labelledby="routes-title">
<title id="routes-title">Two coherent routes split, surround an enclosed excitation, and recombine before two outputs.</title>
<g fill="none" stroke="black" stroke-width="2">
<path d="M20 80H100L200 25H420L520 80L620 35M100 80L200 135H420L520 80L620 125"/>
</g>
<g fill="black"><circle cx="100" cy="80" r="4"/><circle cx="520" cy="80" r="4"/><circle cx="310" cy="80" r="6"/></g>
<g font-family="serif" font-size="17" text-anchor="middle"><text x="310" y="18">upper route</text><text x="310" y="156">lower route</text><text x="310" y="106">enclosed anyon</text><text x="632" y="35">0</text><text x="632" y="129">1</text></g>
</svg>

Let $|u\rangle$ and $|l\rangle$ denote upper and lower routes. After balanced splitting and propagation, a coherent state is

$$|\Psi\rangle=\frac{|u\rangle+e^{i\Phi}|l\rangle}{\sqrt{2}},
\qquad \Phi=\phi+2Nw\theta.$$

Here $N$ is the number of enclosed anyons of the probe's species, $w$ is the signed relative winding count, and $\phi$ collects the ordinary relative phase. A balanced recombiner adds the route amplitudes at output 0 and subtracts them at output 1. Each full route contributes magnitude $1/2$, giving

$$\begin{gathered}
c_0=\frac{1+e^{i\Phi}}{2},\qquad
c_1=\frac{1-e^{i\Phi}}{2},\\[4pt]
P_0=|c_0|^2=\frac{1+\cos\Phi}{2},\qquad P_1=1-P_0.
\end{gathered}$$

The [phasor diagram](../experiments.html#interference) draws complex amplitudes as arrows: their vector sum determines the probability after taking its squared length. Cancellation at one output redirects probability to the other. For one positive winding, adding one enclosed anyon adds $2\theta$ to $\Phi$, moving a fringe toward smaller $\phi$.

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

This predicts output probabilities, not conductance. The [Nakamura et al. experiment](https://arxiv.org/abs/2006.14115) reports phase slips consistent with $2\pi/3$ braiding at filling $1/3$, using a device whose charge, area, and tunneling also matter.

## 4. Non-Abelian exchange acts on a fusion state

Some anyons have several states available even after their positions and individual types are fixed. **Topological charge** names an excitation type, including the vacuum $1$; it is not electric charge. **Fusion** asks which total type a group has when treated together. For Ising anyons,

$$\sigma\times\sigma=1+\psi.$$

The plus sign lists two allowed fusion channels, not equally probable results. Four $\sigma$ anyons with fixed total vacuum have a two-dimensional **fusion Hilbert space**. Choose $|0\rangle$ when the first pair fuses to $1$, and $|1\rangle$ when it fuses to $\psi$. The other pair has the matching charge so the total remains vacuum. These labels describe collective states, not a separate spin carried by each anyon.

Exchanging a pair with definite fusion channel multiplies its amplitude by that channel's **R phase**. Choosing a different pair requires a change of fusion basis, described by an **F matrix**. In the convention used here,

$$\begin{gathered}
R=\begin{pmatrix}e^{-i\pi/8}&0\\0&e^{3i\pi/8}\end{pmatrix},\\[5pt]
F=\frac1{\sqrt{2}}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\\[5pt]
B_1=B_3=R,\qquad B_2=F^{-1}RF=FRF.
\end{gathered}$$

$B_j$ exchanges neighboring positions $j$ and $j+1$. To exchange the middle pair, express the state in the basis where that pair's charge is definite, apply $R$, then transform back. The basis change itself is a mathematical description, not an extra physical braid. These numerical matrices are data of the Ising model; ordinary indistinguishability alone does not determine them. Their conventions are specified in [Nayak et al., Sec. II.A.1 and Eq. (50)](https://arxiv.org/abs/0707.1889); [Ivanov](https://arxiv.org/abs/cond-mat/0005069) derives the non-Abelian exchange action for vortices with Majorana modes.

Because $B_1$ and $B_2$ do not commute, chronological “1 then 2” means $B_2B_1|\Psi\rangle$, and reversing the order can change the state. With input $|+\rangle=(|0\rangle+|1\rangle)/\sqrt{2}$, the first order gives first-pair vacuum probability 1, whereas the reverse gives $1/2$.

A single readout can nevertheless miss a difference. Write a normalized state as $c_0|0\rangle+c_1|1\rangle$. Its **Bloch vector** collects expectations of the Pauli operators on this encoded two-state space:

$$\begin{aligned}
x=\langle X\rangle&=2\operatorname{Re}(c_0^*c_1),\\
y=\langle Y\rangle&=2\operatorname{Im}(c_0^*c_1),\\
z=\langle Z\rangle&=|c_0|^2-|c_1|^2.
\end{aligned}$$

A $Z$ measurement reads the original pair's fusion charge: $+1$ means vacuum and $-1$ means $\psi$. The $X$ and $Y$ measurements use superposition bases, requiring an appropriate basis rotation before fusion readout. For a chosen Pauli operator $O=X,Y,Z$, outcome probabilities are $(1\pm\langle O\rangle)/2$. In the [braid experiment](../experiments.html#braids), start with $|0\rangle$: the two orders have identical $Z$ probabilities but different $X$ and $Y$ expectations. The Bloch vector makes the missed information visible. These are ideal operations, not a simulation of a complete device.

For weakly split fusion states, transport should avoid bulk excitations yet finish before the residual splitting accumulates an appreciable relative dynamical phase. Indefinitely slower motion is not automatically closer to the ideal braid.

## 5. Fibonacci numbers count allowed fusion paths

Fibonacci anyons are a different model, with types $1$ and $\tau$ and rules

$$1\times\tau=\tau,\qquad \tau\times\tau=1+\tau.$$

Fuse particles successively and record the cumulative charge. If it is $1$, adding $\tau$ forces the next charge to be $\tau$; if it is $\tau$, there are two possibilities. Let $a_n$ and $b_n$ count paths for $n$ particles ending in $1$ and $\tau$:

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

## 6. A spin model explains the toric-code minus sign

The **toric code** places a qubit on every edge of a periodic square lattice. Let $X_j,Z_j$ be Pauli operators on edge $j$, distinct from the encoded Pauli operators above. At each vertex $s$, multiply $X$ over the four incident edges; around each square plaquette $p$, multiply $Z$ over its boundary:

$$\begin{gathered}
A_s=\prod_{j\ni s}X_j,\qquad B_p=\prod_{j\in\partial p}Z_j,\\
H=-J_e\sum_s A_s-J_m\sum_p B_p,\qquad J_e,J_m>0.
\end{gathered}$$

The commuting operators $A_s$ and $B_p$ are **stabilizers**: the ground space has eigenvalue $+1$ for all of them. A vertex and a plaquette share zero or two edges; each shared edge contributes an anticommutation sign, so the two signs cancel. A violation $A_s=-1$ is called an electric excitation $e$; $B_p=-1$ is a magnetic excitation $m$. These names describe the model's charges, not literal electron and magnetic-monopole particles. [Kitaev's construction](https://arxiv.org/abs/quant-ph/9707021) supplies the Hamiltonian and excitations.

Apply $Z$ along an open path of lattice edges. Interior vertices touch two operated edges and retain their stabilizer sign; each endpoint touches one, creating an $e$ pair from the ground space. Extending the string moves an endpoint. Similarly, an $X$ string crossing edges along a path between plaquette centers creates and moves an $m$ pair. In the [pair-string picture](../experiments.html#toric), selecting neighboring plaquettes applies $X$ to their shared edge and updates both endpoints. [Dennis et al.](https://arxiv.org/abs/quant-ph/0110143) explains their relation to error syndromes and memory.

On the periodic lattice, each species has even total excitation parity; a loop can still enclose an odd count when a partner lies outside. Direct configuration editing specifies a charge pattern rather than this local preparation protocol.

Now close an $e$ string around a contractible region $S$. Multiplying the enclosed plaquette operators cancels every interior edge twice, leaving the boundary:

$$W_e(\partial S)=\prod_{j\in\partial S}Z_j
=\prod_{p\in S}B_p.$$

For a state $|\Psi\rangle$ with $N_m$ definite enclosed magnetic excitations,

$$W_e(\partial S)|\Psi\rangle=(-1)^{N_m}|\Psi\rangle.$$

One enclosed $m$ therefore contributes a minus sign to the $e$ loop, despite both species having bosonic self-exchange. Repeating the winding gives $(-1)^{wN_m}$. This **mutual statistics** depends on both species. Detecting its phase requires a reference process, just as in the interferometer. A loop wrapping around the periodic lattice cannot be written as a product over a bounded interior and can act on the encoded ground states; that is the next step toward a topological memory.

The interactive grid is a local patch tracking string endpoints and loop factors. It does not represent the complete periodic spin state, evolve its many-spin wavefunction, or decode noisy measurements.

The examples now connect five distinct ingredients: an exchange rule, a prepared state, a transport path, an apparatus, and a measurement. For the next calculation, the [catalog](catalog.md) offers packet correlations, saddle dynamics, experimental fringe maps, and memory errors, each with its own minimal model.
