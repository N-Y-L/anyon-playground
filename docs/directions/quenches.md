# Ramps and conserved parity

The quasihole motion in the earlier notes assumed that the surrounding electrons followed their instantaneous low-energy state. A time-dependent Hamiltonian makes that assumption a dynamical question: does an initially prepared ground state follow the ground state as the parameters change? Going slowly can help, but the answer also depends on which states the dynamics can reach.

A sudden change is usually called a **quench**; a change over a finite time is a **ramp**. A chemical-potential ramp in a finite superconducting wire connects the [end modes](wires.html) to a precise question: when does failing to reach the lowest energy mean that the ramp was too fast?

## A knob and a conserved quantity

For an open Kitaev chain with fermion annihilation operators $c_j$ and occupations $n_j=c_j^\dagger c_j$, the Hamiltonian is

$$\begin{aligned}
H(t)&=-w\sum_{j=1}^{L-1}(c_j^\dagger c_{j+1}+\mathrm{h.c.})\\
&\quad+\Delta\sum_{j=1}^{L-1}(c_jc_{j+1}+\mathrm{h.c.})
-\mu(t)\sum_{j=1}^{L}(n_j-\tfrac12).
\end{aligned}$$

Here $L$ is the number of sites, $w>0$ the hopping energy, $\Delta$ a real pairing energy, and $\mu(t)$ the changing chemical potential. “h.c.” adds the Hermitian conjugate. Pairing changes particle number by two, so particle number is not conserved. Its evenness or oddness is:

$$P=(-1)^{\sum_jn_j},\qquad [H(t),P]=0.$$

Every term contains an even number of fermion operators. Thus an initially even state stays even, and an initially odd state stays odd, under this closed unitary evolution. A superconducting pair can enter or leave without changing parity. Single-electron exchange with an environment would require a different model. [Kitaev's original wire construction](https://arxiv.org/abs/cond-mat/0010440) gives the Hamiltonian and its end modes.

## What does “slow” need?

For a smooth, fixed path of finite-dimensional Hamiltonians, stretching the time taken can suppress transitions out of an isolated instantaneous eigenspace. The separation from other accessible states matters: a small gap generally demands a longer ramp. [Jansen, Ruskai and Seiler](https://arxiv.org/abs/quant-ph/0603175) make this dependence precise. A small rate alone is not a complete criterion.

For the uniform infinite Kitaev chain with nonzero pairing, the bulk excitation gap closes at $|\mu|=2w$. A finite wire has discrete levels instead; their spacings must be examined for the chosen length and boundary conditions. One cannot take a finite-size adiabatic result and assume its required ramp time stays finite as the wire grows.

There is another kind of crossing. Two levels of opposite parity can become degenerate without coupling. Since the ramp preserves parity, the relevant gap for following a state is the gap to accessible states **within its parity sector**. A crossing with the other sector can change which state has the lowest energy overall while leaving the actual state on a smooth branch.

## The evolving branch and the ground-state reference

Let $|\psi(t)\rangle$ have parity $p=\pm1$. If the instantaneous, nondegenerate ground state $|g(t)\rangle$ has parity $-p$, orthogonality gives

$$F(t)=|\langle g(t)|\psi(t)\rangle|^2=0.$$

This holds at every ramp speed. The dynamics cannot transfer population between the two sectors. It may nevertheless follow the lowest state *within its original sector* extremely well.

In a finite topological wire, the two Majorana end modes overlap. Their coupling splits the two lowest states of opposite parity; changing parameters can reverse their energy ordering. [Hegde, Shivamoggi, Vishveshwara and Sen](https://arxiv.org/html/1412.5255) studied the resulting **parity blocking** during ramps. Their calculation shows that the overlap with the instantaneous ground state can vanish even for slow driving. Such parity crossings can occur within the topological phase; they need not mark a closing of the bulk gap.

## A two-state crossing

In a fixed basis of the two end states, let $f$ be the fermion formed from the two Majorana modes, with occupation $n_f=0$ or $1$. A simple Hamiltonian is

$$H_{\rm end}(t)=\varepsilon(t)(f^\dagger f-\tfrac12).$$

This gives a two-state illustration of the crossing, not a simulation of a full wire ramp. Its energies are $-\varepsilon/2$ for the empty state and $+\varepsilon/2$ for the occupied state.

An initially empty state with $\varepsilon>0$ lies on the lower branch. As $\varepsilon$ sweeps through zero, the two energy lines cross without any matrix element connecting them.

The state stays empty, acquiring only a phase. For $\varepsilon<0$, it is an excited state, and its energy above the instantaneous ground state is $-\varepsilon$. Making the sweep slower changes none of these occupations. The fidelity to the unique ground state changes from one to zero because the reference changes branches. The evolving state has not jumped. At the crossing itself, both states are ground states; the projector onto their span defines the ground-space reference without arbitrarily selecting one of them.

## Two energy comparisons

For the full wire, let $E_{\rm gs}(t)$ be the lowest many-body energy over both sectors and $E_p(t)$ the lowest energy in the initial sector. Then

$$\langle H(t)\rangle-E_{\rm gs}(t)
=\bigl[\langle H(t)\rangle-E_p(t)\bigr]
+\bigl[E_p(t)-E_{\rm gs}(t)\bigr].$$

The first term measures excitation above the accessible sector's lowest state. The second records the cost of staying in that sector when the other one lies lower. Only the first can be reduced by improving adiabatic following within the sector. Parity conservation still permits transitions between states of the same parity, including creation of quasiparticle pairs.

Comparing both energy references while varying the duration and wire length separately distinguishes excitations generated during the drive from a change in ground-state parity. Both effects can contribute to the same signal. [Hegde and collaborators, §§2 and 7](https://arxiv.org/html/1412.5255) give the detailed wire calculation.
