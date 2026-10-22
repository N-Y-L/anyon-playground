# Ramps and conserved parity

The quasihole motion in the earlier notes relied on electrons following an instantaneous low-energy state. Slowing the motion helps only if the desired state is accessible. A small energy gap can demand a long preparation time; a conserved quantity can forbid the transition altogether.

A sudden change is usually called a **quench**; a change over a finite time is a **ramp**. A finite superconducting wire separates the two obstacles particularly clearly. Its [end modes](wires.html) allow the lowest-energy state to change its parity—the evenness or oddness of its fermion number—as a parameter varies.

## A knob and a conserved quantity

The **Kitaev chain** has one fermionic state per site, hopping between neighbors and superconducting pairing. Hopping preserves particle number; pairing couples states differing by two particles. Both preserve parity. Varying the chemical potential—the energy parameter controlling occupation—does not allow an even state to become odd.

<details>
<summary>Hamiltonian and parity check</summary>

For an open chain of $L$ sites, let $c_j$ annihilate a fermion at site $j$ and $n_j=c_j^\dagger c_j$ count its occupation. Let $w>0$ be the hopping energy, $\Delta$ a real pairing amplitude and $\mu(t)$ the chemical potential at time $t$. With “h.c.” denoting the Hermitian conjugate, the Hamiltonian is

$$\begin{aligned}
H(t)&=-w\sum_{j=1}^{L-1}(c_j^\dagger c_{j+1}+\mathrm{h.c.})\\
&\quad+\Delta\sum_{j=1}^{L-1}(c_jc_{j+1}+\mathrm{h.c.})
-\mu(t)\sum_{j=1}^{L}(n_j-\tfrac12).
\end{aligned}$$

Pairing changes particle number by two, so particle number is not conserved. The parity operator $P$, with eigenvalue $+1$ for even particle number and $-1$ for odd particle number, obeys

$$P=(-1)^{\sum_jn_j},\qquad [H(t),P]=0.$$

Every term contains an even number of fermion operators. Thus an initially even state stays even, and an initially odd state stays odd, under this closed unitary evolution. A superconducting pair can enter or leave without changing parity. [Kitaev's original wire construction](https://arxiv.org/abs/cond-mat/0010440) gives the Hamiltonian and its end modes.

</details>

This constraint assumes a closed, parity-conserving model. Single-electron exchange with an environment changes the physical question.

## What does “slow” need?

For a smooth, fixed path of finite-dimensional Hamiltonians, stretching the time taken can suppress transitions out of an isolated instantaneous eigenspace. The separation from other accessible states matters: a small gap generally demands a longer ramp. [Jansen, Ruskai and Seiler](https://arxiv.org/abs/quant-ph/0603175) make this dependence precise. A small rate alone is not a complete criterion.

For the uniform infinite Kitaev chain with nonzero pairing, the bulk excitation gap closes at $|\mu|=2w$, where $\mu$ is the chemical potential and $w$ the hopping energy. A finite wire has discrete levels instead; their spacings must be examined for the chosen length and boundary conditions. One cannot take a finite-size adiabatic result and assume its required ramp time stays finite as the wire grows.

There is another kind of crossing. Two levels of opposite parity can become degenerate without coupling. The **even and odd parity sectors** are the subspaces with those two parity values. Since the ramp preserves parity, the gap relevant to following a state is the gap to accessible states within its own sector. A crossing with the other sector can change which state has the lowest energy overall while leaving the evolving state on a smooth branch.

## The evolving branch and the ground-state reference

If an initially even state evolves while the ground state becomes odd, their overlap is exactly zero. More generally, let the normalized evolving state $|\psi(t)\rangle$ have parity $p=\pm1$, with $+1$ denoting even. If the instantaneous, nondegenerate ground state $|g(t)\rangle$ has parity $-p$, their squared overlap, or **fidelity**, is

$$F(t)=|\langle g(t)|\psi(t)\rangle|^2=0.$$

This holds at every ramp speed. The dynamics cannot transfer population between the two sectors. It may nevertheless follow the lowest state *within its original sector* extremely well.

In the topological regime, a long open Kitaev wire has a gapped interior and two low-energy **Majorana end modes**, localized modes described by Hermitian fermionic operators. Their finite overlap splits the two lowest states of opposite parity; changing parameters can reverse their energy ordering. [Hegde, Shivamoggi, Vishveshwara and Sen](https://arxiv.org/html/1412.5255) studied the resulting **parity blocking**: conserved parity prevents the evolving state from following a ground state that switches sector. Such crossings can occur without closing the bulk excitation gap.

## A two-state crossing

In a fixed basis of the two end states, let $f$ annihilate the fermionic mode formed from the two Majorana modes. Its occupation $n_f=f^\dagger f$ is $0$ or $1$. Let $\varepsilon(t)$ be the signed energy of the occupied state relative to the empty state. A simple Hamiltonian is

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

Preparation can therefore fail in two different senses: a fast drive can excite accessible states, or accurate following can leave the system above an inaccessible ground state of opposite parity. How much energy comes from unwanted excitations, and how much is the cost of conserved parity? The two energy comparisons separate these effects when preparing or manipulating topological states. [Hegde and collaborators, §§2 and 7](https://arxiv.org/html/1412.5255) give the detailed wire example.
