# Move to the end of a wire

<p class="reading-kicker">A finite Kitaev chain · End profiles and parity switches</p>

In the anyon notes, nonlocal information appeared in a collective state space. Here is another place to look for information that is difficult to assign to one small region: the two ends of a superconducting wire. Start with a practical question. **If the ends carry protected modes, why can the wire still distinguish two states by their energy?**

The first figure calculates that finite energy splitting and the two spatial parts of its lowest mode. Then build a zero-energy profile from the left end and ask whether it also obeys the boundary condition at the right. These are related calculations, but they answer different questions. A second figure asks whether the end solution survives a nonuniform potential.

## Let the far end set a condition

<!-- DIRECTION-FIGURE: wires -->

<div class="try-this">

**Try three changes.** First press **Nearest exact crossing**, then change the number of sites by one. The old crossing need not survive. Next set a small pairing and vary the potential: compare changes of sign in the profile with the sequence of black ticks. Finally increase the pairing. The ticks crowd into a narrower interval, while the bulk boundaries stay at $\mu/w=\pm2$.

Before each change, predict which feature should move. The two profiles have signs fixed independently at their own ends. For positive $\mu$, use **Remove alternating site sign** to reveal their slower envelope modulation. Then enable **Compare zero-energy recurrence**: at a crossing it matches the finite left mode; a short wire with weak pairing can show a visible difference between them.

</div>

## Give the wire a Hamiltonian

Consider $N$ sites with open ends and one spinless fermion operator $c_j$ per site. We use

$$
H=\sum_{j=1}^{N-1}\left[-w c_{j+1}^{\dagger}c_j
+\Delta c_{j+1}^{\dagger}c_j^{\dagger}+\mathrm{h.c.}\right]
-\mu\sum_{j=1}^{N}\left(c_j^{\dagger}c_j-\frac12\right).
$$

Here $w>0$ is the hopping energy, $\Delta$ is a real pairing amplitude, and $\mu$ is the chemical potential. We restrict the figure to $0<\Delta<w$. This is a quadratic superconducting mean-field model: the pair terms change particle number by two, so particle number is not conserved, but fermion parity $P=(-1)^{\sum_j c_j^\dagger c_j}$ is.

Write each site operator as two Hermitian operators,

$$
a_j=c_j+c_j^\dagger,\qquad b_j=i(c_j^\dagger-c_j),
\qquad \{a_j,a_k\}=\{b_j,b_k\}=2\delta_{jk}.
$$

These definitions are possible for every fermion site; by themselves they do not establish an end mode. A zero-energy end mode is a *particular linear combination* that commutes with the Hamiltonian and is localized near a boundary. That distinction is central to [Kitaev's original construction](https://arxiv.org/abs/cond-mat/0010440).

For an infinite uniform chain, with lattice spacing set to one, the positive bulk excitation energy is

$$
E(k)=\sqrt{(\mu+2w\cos k)^2+4\Delta^2\sin^2 k}.
$$

At nonzero pairing, its gap closes at $\mu=\pm2w$. The interval $|\mu|<2w$ supports end modes in the semi-infinite problem. A finite chain adds a second boundary; it does not automatically inherit exact zero energy throughout this interval.

## Read the finite energy and its profiles

For the quadratic Hamiltonian, the singular values of the real Majorana coupling matrix $M$ below are the positive quasiparticle energies. Its smallest singular value $E_0$ is the magnitude of the energy difference between the lowest even and odd states. It is nonnegative; the parity label tells you which state lies lower.

The blue and red profiles are the left and right singular vectors of this one mode, with each normalized to unit sum of squares. They obey $M^{\mathsf T}v=E_0u$ and $Mu=E_0v$ with consistent singular-vector signs. The figure instead fixes both signs positive at their own ends; the common coupling in these equations can then be $-E_0$. The two profiles are components of one fermionic degree of freedom.

<details>
<summary>Computing a very small splitting</summary>

The calculation uses inverse iteration with pivoted tridiagonal solves and a shifted iteration when needed. It preserves the distinction between tiny energies and analytic zeros. The $10^{-14}w$ floor is a plotting choice; values beneath it are not all zero. Near an exact crossing, rounding the control parameter limits the interpretation of a tiny computed splitting. Unconverged points are omitted and reported.

</details>

## Build the left profile one site at a time

Seek a Hermitian zero-mode operator $\Gamma_L=\sum_{j=1}^{N}v_j a_j$ with real coefficients. Writing $H=(i/2)\,a^{\mathsf T}Mb$, the nonzero entries of $M$ are

$$
M_{jj}=-\mu,\qquad M_{j,j+1}=-(w-\Delta),\qquad
M_{j+1,j}=-(w+\Delta).
$$

The commutator condition is $M^{\mathsf T}v=0$. In the interior it becomes

$$
(w+\Delta)v_{j+1}+\mu v_j+(w-\Delta)v_{j-1}=0.
$$

Introduce a fictitious site $0$ and impose $v_0=0$. Choose $v_1=1$ temporarily; the recurrence then fixes every later coefficient. The optional recurrence comparison divides them by $\sqrt{\sum_{j=1}^{N}v_j^2}$, so the displayed operator satisfies $\Gamma_L^2=1$ on the finite set of sites.

That normalization does **not** repair the right boundary. A finite zero mode also requires $v_{N+1}=0$. For the normalized profile, the sole nonzero component of $M^{\mathsf T}v$ is otherwise

$$
r=(M^{\mathsf T}v)_N=(w+\Delta)v_{N+1}.
$$

This is the signed residual reported when the recurrence comparison is enabled. Its magnitude measures how well this trial operator commutes with $H$; it is not a calculated eigenenergy. When $|\mu|<2w$, the recurrence describes a decaying semi-infinite end solution, truncated to $N$ sites. Beyond that bulk interval, even the infinite continuation fails to be normalizable.

## Separate decay from oscillation

Substitute $v_j\propto z^j$ into the recurrence. The two roots obey

$$
(w+\Delta)z^2+\mu z+(w-\Delta)=0.
$$

They are complex conjugates when $|\mu|<2\sqrt{w^2-\Delta^2}$. Put

$$
\rho=\sqrt{\frac{w-\Delta}{w+\Delta}},\qquad
\cos q=-\frac{\mu}{2\sqrt{w^2-\Delta^2}}.
$$

The left-boundary solution is then proportional to

$$
v_j=\rho^{j-1}\frac{\sin(jq)}{\sin q}.
$$

The power of $\rho$ sets the decay envelope; the sine controls nodes and relative signs. Outside this oscillatory interval the roots become real. A site-to-site alternating sign can remain, but there is no sinusoidal envelope modulation. The solution can still decay until $|\mu|$ reaches $2w$.

The distinction gives a useful reading question for [Hegde and Vishveshwara's study](https://arxiv.org/abs/1603.03394): which observations depend on an oscillation, and which only require localization? Their transfer-matrix treatment connects these profiles to finite-chain parity switches and extends the analysis to disorder.

## Make a finite wire exactly degenerate

Within the oscillatory interval, the far-end condition requires $\sin[(N+1)q]=0$. Reindexing the allowed integers gives the complete set

$$
\mu_p=2\sqrt{w^2-\Delta^2}\cos\frac{p\pi}{N+1},
\qquad p=1,\ldots,N.
$$

These are the black ticks. They are exact zero-mode locations for this uniform finite Hamiltonian, not estimates of its whole low-energy spectrum. At each location an $a$-type solution and a reflected $b$-type solution combine into a zero-energy fermionic degree of freedom. Occupying it changes parity without changing energy. Passing through a simple crossing reverses which parity has the lower energy.

There is an immediate check: an odd $N$ admits $p=(N+1)/2$, hence a crossing at $\mu=0$; an even $N$ does not. Also notice what making the chain longer does. It changes the allowed boundary phases and adds crossings; it does not move the bulk transition.

The parity reported here labels the lowest-energy state among both parity sectors. An isolated system governed by a parity-conserving Hamiltonian cannot jump between those sectors just because their energies cross. Carry that observation to [the quench calculation](quenches.md).

## Turn an end-mode question into a localization question

Now allow the potential to vary by site. The same substitution $v_j=\rho^j\psi_j$ removes the asymmetric coefficients:

$$
\sqrt{w^2-\Delta^2}\,(\psi_{j+1}+\psi_{j-1})+\mu_j\psi_j=0.
$$

This is a zero-energy equation for an associated normal tight-binding chain. Define its nonnegative growth exponent per site as $\gamma_N$, and define the positive pairing-induced decay rate as $\gamma_S=-\log\rho$. The original profile's leading exponent is $\gamma_N-\gamma_S$: the end solution decays when $\gamma_N<\gamma_S$.

For a uniform potential, $\gamma_N=0$ inside the associated normal band and $\gamma_N=\operatorname{arcosh}(|\mu|/[2\sqrt{w^2-\Delta^2}])$ outside it. Equating growth and decay recovers $|\mu|=2w$. Thus the two boundaries in the figure emerge from one calculation.

[DeGottardi, Sen and Vishveshwara](https://arxiv.org/abs/1208.0015) use the normal-state localization problem to find superconducting phase boundaries with periodic, quasiperiodic and disordered potentials. The next figure carries out that comparison. The uniform wire above provides the check to recover before changing the potential.

## Give the potential a pattern

<!-- DIRECTION-FIGURE: localization -->

Hold the pairing fixed and switch between the three potentials. Why does increasing the same amplitude $V$ cross the pairing threshold at different places? The normal-chain growth depends on the pattern, not only the range of onsite energies.

For the staggered potential $\mu_j=V(-1)^j$, the two-site transfer matrix gives $\gamma_N=\operatorname{arsinh}(V/2t')$, where $t'=\sqrt{w^2-\Delta^2}$. For the quasiperiodic potential $\mu_j=V\cos(2\pi\beta j+\phi)$, the infinite-chain result is $\gamma_N=\max[0,\log(V/2t')]$. Equating these to $\gamma_S$ gives, respectively,

$$
V_c=2\Delta,\qquad V_c=2(w+\Delta).
$$

The random curve uses independent onsite values uniform in $[-V,V]$, with one fixed sequence rescaled as $V$ changes. It has no closed-form comparison in this figure. A change of sample would change the finite estimate; this curve is not a disorder average.

<details>
<summary>Potential definitions and numerical checks</summary>

Every curve propagates the vector $(\psi_1,\psi_0)=(1,0)$ through 4000 sites. Its norm is removed every eight steps, and the accumulated logarithm divided by 4000 estimates the asymptotic growth exponent. The amplitude grid has spacing $0.05w$, with the quasiperiodic normal-chain threshold added; crossings are linearly interpolated. The numerical crossing therefore has finite-length and grid errors.

The quasiperiodic choice is $\beta=(\sqrt5-1)/2$, $\phi=0.3$ radians. The random sequence uses the mulberry32 generator with seed 2013. The gray curve is the infinite-chain closed form, not a fit. At $\Delta/w=0.3$, the finite calculation places the quasiperiodic crossing near $2.59984w$ and the staggered crossing near $0.60011w$, compared with exact values $2.6w$ and $0.6w$. The shaded region records the finite estimate's comparison with $\gamma_S$; the topological criterion itself concerns the infinite chain.

</details>

<div class="takeaway">

**Keep three statements separate:** the infinite bulk is topological; a semi-infinite end solution decays; a particular finite wire has an exact zero mode. The boundary condition tells you when the third statement follows. The wire calculation alone does not enact an exchange of modes or establish a braiding operation.

</div>

## Read further

- A. Yu. Kitaev, “Unpaired Majorana fermions in quantum wires,” *Physics–Uspekhi* **44**, 131–136 (2001). [Paper](https://arxiv.org/abs/cond-mat/0010440).
- S. S. Hegde and S. Vishveshwara, “Majorana wave-function oscillations, fermion parity switches, and disorder in Kitaev chains,” *Physical Review B* **94**, 115166 (2016). [Paper](https://arxiv.org/abs/1603.03394).
- W. DeGottardi, D. Sen and S. Vishveshwara, “Majorana Fermions in Superconducting 1D Systems Having Periodic, Quasiperiodic, and Disordered Potentials,” *Physical Review Letters* **110**, 146404 (2013). [Paper](https://arxiv.org/abs/1208.0015).

[Return to the directions](../directions.md) · [Change the Hamiltonian in time](quenches.md)
