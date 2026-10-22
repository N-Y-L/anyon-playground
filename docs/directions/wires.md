# End modes in a finite wire

In the Kitaev model, a superconducting wire can support a **Majorana end mode**: a low-energy mode concentrated near a boundary and described by a Hermitian fermionic operator. Two such modes together form an ordinary fermionic mode that can be empty or occupied. If their spatial profiles overlap, those two occupations can have different energies.

When the wire is long compared with the distance over which an end profile decays, its two ends overlap only exponentially weakly. The energy splitting is then exponentially small. The model has a gap to excitations in its interior and short-range couplings. A small local perturbation that preserves fermion parity (whether particle number is even or odd) cannot directly couple distant ends. This is the protection at issue; an exact zero in a finite wire requires additional conditions. [Kitaev's construction](https://arxiv.org/abs/cond-mat/0010440) makes the distinction explicit.

The wire has $N$ sites. I write $w>0$ for the hopping energy, which couples neighboring sites; $\Delta$ for a real superconducting pairing amplitude, which couples states differing by a pair of fermions; and $\mu$ for the chemical potential, the energy parameter controlling occupation. The figure uses $0<\Delta<w$. The energy splitting $E_0\geq0$ is the magnitude of the difference between the lowest even and odd energies.

## The condition at the far end

<!-- DIRECTION-FIGURE: wires -->

The **Nearest exact crossing** control selects a degeneracy of the lowest empty and occupied states. Adding one site can remove that degeneracy. Increasing the pairing amplitude crowds the black crossing ticks into a narrower interval, while the infinite-chain phase boundaries stay at $\mu/w=\pm2$.

The two profiles have signs fixed independently at their own ends. For positive $\mu$, the **Remove alternating site sign** view reveals their slower envelope modulation. **Compare zero-energy recurrence** overlays the trial profile: at a crossing it matches the finite left mode; a short wire with weak pairing can show a visible difference between them.

## The wire Hamiltonian

The Kitaev chain retains one fermionic state per site, with no independent spin label. Its pairing terms change fermion number by two, preserving its evenness or oddness, called **fermion parity**. A superconducting condensate supplies the pair amplitude; treating it as a fixed parameter is the mean-field approximation used here.

For an infinite uniform chain with nonzero pairing, the topological regime is $|\mu|<2w$. Here this means that the interior is gapped while an open, semi-infinite chain has a zero-energy end mode. “Semi-infinite” means one boundary with the chain extending indefinitely away from it.

<details>
<summary>Hamiltonian, Majorana operators and bulk spectrum</summary>

Let $c_j$ annihilate a fermion at site $j$, with $c_j^\dagger$ creating one. For $N$ sites with open ends, the Hamiltonian is

$$
H=\sum_{j=1}^{N-1}\left[-w c_{j+1}^{\dagger}c_j
+\Delta c_{j+1}^{\dagger}c_j^{\dagger}+\mathrm{h.c.}\right]
-\mu\sum_{j=1}^{N}\left(c_j^{\dagger}c_j-\frac12\right).
$$

The abbreviation “h.c.” adds the Hermitian conjugate of the preceding terms. The Hamiltonian is quadratic in the fermion operators. Particle number is not conserved, but its parity operator $P=(-1)^{\sum_j c_j^\dagger c_j}$ is.

Each site operator decomposes into two Hermitian operators $a_j,b_j$. With the anticommutator $\{A,B\}=AB+BA$ and Kronecker delta $\delta_{jk}$,

$$
a_j=c_j+c_j^\dagger,\qquad b_j=i(c_j^\dagger-c_j),
\qquad \{a_j,a_k\}=\{b_j,b_k\}=2\delta_{jk}.
$$

These definitions are possible for every fermion site; by themselves they do not establish an end mode. A zero-energy end mode is a *particular linear combination* that commutes with the Hamiltonian and is localized near a boundary. That distinction is central to [Kitaev's original construction](https://arxiv.org/abs/cond-mat/0010440).

For an infinite uniform chain, set the lattice spacing to one and let $k$ be the wave number. The nonnegative bulk excitation energy $E(k)$ is

$$
E(k)=\sqrt{(\mu+2w\cos k)^2+4\Delta^2\sin^2 k}.
$$

At nonzero pairing, its gap closes at $\mu=\pm2w$. The interval $|\mu|<2w$ supports end modes in the semi-infinite problem. A finite chain adds a second boundary; it does not automatically inherit exact zero energy throughout this interval.

</details>

## The finite energy and its profiles

The blue and red profiles show the two spatial parts of the lowest fermionic mode. Their overlap couples the ends and produces the displayed energy splitting between the lowest even and odd states. At an exact crossing, either occupation has the same energy. A very small value on a logarithmic plot is not automatically an exact zero.

<details>
<summary>Matrix calculation and numerical precision</summary>

Write $a_j=c_j+c_j^\dagger$ and $b_j=i(c_j^\dagger-c_j)$, where $c_j$ annihilates a fermion at site $j$. Collect these operators into column vectors $a,b$. In $H=(i/2)a^{\mathsf T}Mb$, the real coupling matrix has diagonal entries $M_{jj}=-\mu$, upper-diagonal entries $M_{j,j+1}=-(w-\Delta)$ and lower-diagonal entries $M_{j+1,j}=-(w+\Delta)$. Its singular values are the nonnegative quasiparticle energies. The smallest, $E_0$, is the magnitude of the energy difference between the lowest even and odd states. Away from a crossing, the parity label identifies the lower state; at an exact zero, the two states are degenerate.

Let $v,u$ be the left and right singular vectors of this mode, each normalized to unit sum of squares. They give the blue and red profiles and obey $M^{\mathsf T}v=E_0u$ and $Mu=E_0v$ with consistent signs. The figure instead fixes both signs positive at their own ends; the common coupling in these equations can then be $-E_0$. The two profiles are components of one fermionic degree of freedom.

The calculation uses inverse iteration with pivoted tridiagonal solves and a shifted iteration when needed. It preserves the distinction between tiny energies and analytic zeros. The $10^{-14}w$ floor is a plotting choice; values beneath it are not all zero. Near an exact crossing, rounding the control parameter limits the interpretation of a tiny computed splitting. Unconverged points are omitted and reported.

</details>

## A recurrence for the left profile

Starting at the left boundary, the zero-energy equation fixes the profile one site at a time. It can satisfy every equation along the wire and still fail at the right boundary. Normalization changes the size of the profile; it cannot repair that failure.

<details>
<summary>Recurrence and its boundary residual</summary>

Let $c_j$ annihilate a fermion at site $j$, and set $a_j=c_j+c_j^\dagger$, $b_j=i(c_j^\dagger-c_j)$. A Hermitian left-end candidate has the form $\Gamma_L=\sum_{j=1}^{N}v_j a_j$, where the real coefficients $v_j$ give its spatial profile. Collecting the $a_j,b_j$ into vectors, I write $H=(i/2)\,a^{\mathsf T}Mb$. The nonzero entries of the coupling matrix $M$ are

$$
M_{jj}=-\mu,\qquad M_{j,j+1}=-(w-\Delta),\qquad
M_{j+1,j}=-(w+\Delta).
$$

The commutator condition is $M^{\mathsf T}v=0$. In the interior it becomes

$$
(w+\Delta)v_{j+1}+\mu v_j+(w-\Delta)v_{j-1}=0.
$$

The left boundary is represented by a fictitious site $0$ with $v_0=0$. A temporary normalization $v_1=1$ lets the recurrence fix every later coefficient. The optional recurrence comparison divides them by $\sqrt{\sum_{j=1}^{N}v_j^2}$, so the displayed operator satisfies $\Gamma_L^2=1$ on the finite set of sites.

That normalization does **not** repair the right boundary. A finite zero mode also requires $v_{N+1}=0$. For the normalized profile, the sole nonzero component of $M^{\mathsf T}v$ is otherwise

$$
r=(M^{\mathsf T}v)_N=(w+\Delta)v_{N+1}.
$$

This is the signed residual reported when the recurrence comparison is enabled. Its magnitude measures how well this trial operator commutes with $H$; it is not a calculated eigenenergy. When $|\mu|<2w$, the recurrence describes a decaying semi-infinite end solution, truncated to $N$ sites. Beyond that bulk interval, even the infinite continuation fails to be normalizable.

</details>

## Decay and oscillation

An end profile can decay smoothly or decay while oscillating. The oscillations let the overlap between opposite ends change sign as parameters vary, giving exact crossings at special values. Localization itself does not require those oscillations.

<details>
<summary>Decay envelope and oscillation wave number</summary>

The zero-energy profile coefficients $v_j$ obey $(w+\Delta)v_{j+1}+\mu v_j+(w-\Delta)v_{j-1}=0$. Trying $v_j\propto z^j$, with complex factor $z$, gives two roots obeying

$$
(w+\Delta)z^2+\mu z+(w-\Delta)=0.
$$

They are complex conjugates when $|\mu|<2\sqrt{w^2-\Delta^2}$. Their modulus $\rho$ sets the decay per site, and their phase $q$ sets the oscillation wave number:

$$
\rho=\sqrt{\frac{w-\Delta}{w+\Delta}},\qquad
\cos q=-\frac{\mu}{2\sqrt{w^2-\Delta^2}}.
$$

The left-boundary solution is then proportional to

$$
v_j=\rho^{j-1}\frac{\sin(jq)}{\sin q}.
$$

The power of $\rho$ sets the decay envelope; the sine controls nodes and relative signs. Outside this oscillatory interval the roots become real. A site-to-site alternating sign can remain, but there is no sinusoidal envelope modulation. The solution can still decay until $|\mu|$ reaches $2w$.

</details>

[Hegde and Vishveshwara's study](https://arxiv.org/abs/1603.03394) connects these profiles to finite-chain parity switches and extends the analysis to disorder.

## Exact degeneracy in a finite wire

The black ticks mark parameters where the left-end zero solution also meets the right boundary. Adding one site changes that matching condition, so a crossing need not survive the change of length. The infinite-chain transition stays at $|\mu|=2w$.

<details>
<summary>Exact crossing values</summary>

In the interval $|\mu|<2\sqrt{w^2-\Delta^2}$, the zero-energy profile oscillates with wave number $q$ satisfying $\cos q=-\mu/[2\sqrt{w^2-\Delta^2}]$. Its vanishing at the fictitious site $N+1$ requires $\sin[(N+1)q]=0$. The resulting chemical potentials $\mu_p$, indexed by integer $p$, are

$$
\mu_p=2\sqrt{w^2-\Delta^2}\cos\frac{p\pi}{N+1},
\qquad p=1,\ldots,N.
$$

These are the black ticks. They are exact zero-mode locations for this uniform finite Hamiltonian, not estimates of its whole low-energy spectrum. At each location a left Majorana solution and its reflected right counterpart combine into a zero-energy fermionic mode. Occupying it changes parity without changing energy. Passing through a simple crossing reverses which parity has the lower energy.

An odd $N$ supplies an immediate check: it admits $p=(N+1)/2$, hence a crossing at $\mu=0$; an even $N$ does not. Increasing the chain length changes the allowed boundary phases and adds crossings; it does not move the bulk transition.

</details>

The parity reported here labels the lowest-energy state among both parity sectors. An isolated system governed by a parity-conserving Hamiltonian cannot jump between those sectors just because their energies cross. This distinction controls [the quench calculation](quenches.md).

## The associated localization problem

A nonuniform potential opens another connection: the end-mode equation can be mapped to a localization problem in a chain without superconducting pairing. The mapping separates a decay supplied by pairing from the growth of solutions in the associated normal chain. The end mode survives when the decay wins.

<details>
<summary>Mapping and condition for a decaying end mode</summary>

Let $\mu_j$ be the chemical potential at site $j$ and $v_j$ the zero-energy end profile. Define $\rho=\sqrt{(w-\Delta)/(w+\Delta)}$ and new coefficients $\psi_j$ by $v_j=\rho^j\psi_j$. This substitution removes the asymmetric nearest-neighbor coefficients:

$$
\sqrt{w^2-\Delta^2}\,(\psi_{j+1}+\psi_{j-1})+\mu_j\psi_j=0.
$$

This is a zero-energy equation for an associated **normal chain**, meaning a hopping model without superconducting pairing. Such a lattice description with one orbital per site is called a tight-binding model. Define $\gamma_N$ as the nonnegative asymptotic growth exponent per site of its transfer-matrix product: the matrix product propagates $(\psi_j,\psi_{j-1})$ along the chain. Define the positive pairing-induced decay rate as $\gamma_S=-\log\rho$. The original profile's leading exponent is $\gamma_N-\gamma_S$: the end solution decays when $\gamma_N<\gamma_S$.

For a uniform potential, $\gamma_N=0$ inside the associated normal band and $\gamma_N=\operatorname{arcosh}(|\mu|/[2\sqrt{w^2-\Delta^2}])$ outside it. Equating growth and decay recovers $|\mu|=2w$. Thus the two boundaries in the figure emerge from one calculation.

</details>

[DeGottardi, Sen and Vishveshwara](https://arxiv.org/abs/1208.0015) use this connection to find superconducting phase boundaries with periodic, quasiperiodic and disordered potentials.

## Patterned potentials

The figure compares an alternating (**staggered**) potential, a nonrepeating sinusoidal (**quasiperiodic**) potential and a random potential. Their common amplitude $V\geq0$ has units of energy. The associated chain without pairing has hopping energy $t'=\sqrt{w^2-\Delta^2}$. Its rate $\gamma_N$ describes the asymptotic exponential growth per site of solutions. The horizontal line is the competing decay rate supplied by pairing, $\gamma_S=\tfrac12\log[(w+\Delta)/(w-\Delta)]$. An end solution decays when $\gamma_N<\gamma_S$. The point where the two rates become equal depends on the spatial pattern, not only the range of site energies.

<!-- DIRECTION-FIGURE: localization -->

<details>
<summary>Two exact thresholds</summary>

Write $t'=\sqrt{w^2-\Delta^2}$ for the hopping energy in the associated normal chain. The **staggered** potential alternates sign: $\mu_j=V(-1)^j$. Its two-site transfer matrix gives $\gamma_N=\operatorname{arsinh}(V/2t')$. The **quasiperiodic** potential is $\mu_j=V\cos(2\pi\beta j+\phi)$, with irrational $\beta$ and fixed phase $\phi$, so it never repeats exactly on the integer sites. Its infinite-chain result is $\gamma_N=\max[0,\log(V/2t')]$. Equating each rate to $\gamma_S$ gives the critical amplitudes $V_c$:

$$
V_c=2\Delta,\qquad V_c=2(w+\Delta).
$$

</details>

The random curve uses independent onsite values uniform in $[-V,V]$, with one fixed sequence rescaled as $V$ changes. It has no closed-form comparison in this figure. A change of sample would change the finite estimate; this curve is not a disorder average.

<details>
<summary>Potential definitions and numerical checks</summary>

The normal-chain coefficients obey $t'(\psi_{j+1}+\psi_{j-1})+\mu_j\psi_j=0$, where $t'=\sqrt{w^2-\Delta^2}$ and $\mu_j$ is the site potential. Every curve starts from $(\psi_1,\psi_0)=(1,0)$ and propagates through 4000 sites. Its norm is removed every eight steps, and the accumulated logarithm divided by 4000 estimates $\gamma_N$. The amplitude grid has spacing $0.05w$, with the quasiperiodic normal-chain threshold added; crossings are linearly interpolated. The numerical crossing therefore has finite-length and grid errors.

The quasiperiodic choice is $\beta=(\sqrt5-1)/2$, $\phi=0.3$ radians. The random sequence uses the mulberry32 generator with seed 2013. The gray curve is the infinite-chain closed form, not a fit. At $\Delta/w=0.3$, the finite calculation places the quasiperiodic crossing near $2.59984w$ and the staggered crossing near $0.60011w$, compared with exact values $2.6w$ and $0.6w$. The shaded region records the finite estimate's comparison with $\gamma_S$; the topological criterion itself concerns the infinite chain.

</details>

Finite size and nonuniform potentials turn protection into a quantitative question about decay lengths and energy splittings. The infinite chain's topological phase, the decay of a semi-infinite end solution and an exact zero in a particular finite wire are related but distinct statements. How do these properties constrain the storage and manipulation of information shared between the ends? A braiding operation would additionally require a protocol for moving or coupling the modes; the static spectrum is only part of that problem.

## Read further

- A. Yu. Kitaev, “Unpaired Majorana fermions in quantum wires,” *Physics–Uspekhi* **44**, 131–136 (2001). [Paper](https://arxiv.org/abs/cond-mat/0010440).
- S. S. Hegde and S. Vishveshwara, “Majorana wave-function oscillations, fermion parity switches, and disorder in Kitaev chains,” *Physical Review B* **94**, 115166 (2016). [Paper](https://arxiv.org/abs/1603.03394).
- W. DeGottardi, D. Sen and S. Vishveshwara, “Majorana Fermions in Superconducting 1D Systems Having Periodic, Quasiperiodic, and Disordered Potentials,” *Physical Review Letters* **110**, 146404 (2013). [Paper](https://arxiv.org/abs/1208.0015).

[Return to the directions](../directions.md) · [Ramps and conserved parity](quenches.md)
