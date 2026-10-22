# An introduction to anyons

Exchange two identical particles, then exchange them again in the same direction. Their positions are restored. Must their quantum state be restored too? For ordinary bosonic or fermionic statistics the two exchange factors multiply to $+1$. In two dimensions there are further possibilities. **Anyons** are particlelike excitations with statistical rules beyond ordinary bosons and fermions: exchanges can produce other phases, or act on several collective states. Different excitation types can also have nontrivial winding phases with one another.

The background assumed here is graduate mathematics and basic graduate quantum mechanics: states, operators, superposition and adiabatic evolution. Condensed-matter concepts are introduced as needed. The main text develops the physical argument; expandable sections give its derivations. The later [transport calculations](transport.md) examine preparation and detection in more detail.

## Why two dimensions matter

I keep the particles well separated and move each to the other's starting point. This motion is an **exchange**. Interchanging their names on paper is only a relabeling; it says nothing about how they moved. Drawing their trajectories against time gives **worldlines**. A **braid** records these paths up to smooth deformations that avoid collisions and preserve their endpoints.

For two particles, follow the relative vector $\mathbf r=\mathbf r_1-\mathbf r_2$. Since the particles are identical, $\mathbf r$ and $-\mathbf r$ describe the same unordered configuration. An elementary counterclockwise exchange turns this vector through $\pi$. A second exchange in the same direction makes a full $2\pi$ turn; reversing the first motion gives zero net turn. In the plane, the full turn cannot be continuously shrunk away without passing through $\mathbf r=0$, a collision. In three dimensions the relative direction can leave the plane, and that loop can shrink. The [path figure](../experiments.html#exchange) contrasts two exchanges with an exchange followed by its inverse.

This is a statement about the paths. To connect it to statistics, first separate phases caused by ordinary dynamics and applied fields. Energy and elapsed time give a **dynamical phase**; a charged particle encircling magnetic flux acquires an **Aharonov–Bohm phase**. The remaining statistical action is called **topological** when it depends only on the braid, not on the precise path shape. Deforming a path can change those other phases even while its statistical action stays fixed.

Suppose one counterclockwise exchange acts by the scalar $U=e^{i\theta}$, with **exchange angle** $\theta$ defined modulo $2\pi$. In three dimensions the contractible double exchange requires $U^2=1$, hence $U=+1$ for bosons or $-1$ for fermions. In two dimensions there is no such requirement. One exchange, two exchanges in the same direction, and an exchange followed by its inverse give, respectively,

$$U=e^{i\theta},\qquad U^2=e^{2i\theta},\qquad U^{-1}U=1.$$

For example, a **semion** has $U=i$: two exchanges give $-1$, although an exchange and its inverse still cancel. Scalar statistical operations commute and are called **Abelian**. Later, exchanges will act by matrices that need not commute. The configuration-space argument goes back to [Leinaas and Myrheim (1977)](https://doi.org/10.1007/BF02727953).

Two dimensions permit these rules; they do not guarantee a material realizes them. Nor is $\theta$ generally a continuously adjustable property of one material: different angles can describe different phases of matter or different excitations. We need a microscopic state, an object that can move in it, and a measurement of the resulting transformation.

## What is moving?

A phonon is one quantum of a collective atomic vibration. A localized one-phonon packet carries energy through a solid, although no atom travels with it. What moves is a pattern of extra displacement fluctuations; the mean displacement can remain zero. The particle description applies to this pattern in the solid's quantum state.

An **excitation** is a change of state that carries energy above the ground state. When it persists long enough to move and interact as a particle, it is called a **quasiparticle**. The description must remain valid during the motion or scattering being studied.

An important realization uses a two-dimensional **electron fluid**: interacting electrons with approximately uniform density in the interior and no crystalline order. Each electron has charge $-e$, with $e>0$, and obeys fermionic statistics. A localized rearrangement of this fluid can carry a different charge and obey a different exchange rule. These rearrangements are the objects being exchanged. A spin system can also support anyons; the next example obtains a winding phase directly from Pauli operators.

<details class="derivation">
<summary>Derivation: a moving one-phonon fluctuation packet</summary>

A **normal mode** is a collective displacement pattern whose amplitude oscillates at one frequency when the potential energy is approximated by terms quadratic in the displacements. This is the **harmonic approximation**. Consider a periodic chain of $N$ atoms of mass $M$, lattice spacing $a$, displacement $u_j$ from site $ja$, conjugate momentum $p_j$, and nearest-neighbor spring constant $\kappa$. The mode wave numbers are $k=2\pi n/(Na)$ for the $N$ integers $n$ giving $-\pi/a\leq k<\pi/a$. I fix the uniform translation mode $k=0$. For each remaining mode, $a_k$ and $a_k^\dagger$ are oscillator annihilation and creation operators, and $\omega_k$ is its frequency:

$$\begin{aligned}
H&=\sum_j\left[\frac{p_j^2}{2M}+\frac{\kappa}{2}(u_{j+1}-u_j)^2\right]\\
&=\sum_{k\ne0}\hbar\omega_k\left(a_k^\dagger a_k+\frac12\right),\\
\omega_k&=2\sqrt{\frac\kappa M}\left|\sin\frac{ka}{2}\right|.
\end{aligned}$$

Acting with $a_k^\dagger$ adds energy $\hbar\omega_k$. It also adds **crystal momentum** $\hbar k$, the momentum label associated with translation by one lattice spacing; this label is defined modulo $2\pi\hbar/a$. The excited normal coordinate involves the whole chain.

Let $|0\rangle$ be the ground state of all retained modes. A localized one-phonon state is a superposition $|f\rangle=\sum_{k\ne0} f_k a_k^\dagger|0\rangle$, with amplitudes normalized by $\sum_{k\ne0}|f_k|^2=1$. To see what changes in the solid, I use the displacement operator,

$$u_j=\sum_{k\ne0}\sqrt{\frac{\hbar}{2MN\omega_k}}
\left(a_ke^{ikja}+a_k^\dagger e^{-ikja}\right).$$

Both $|f\rangle$ and the ground state have $\langle u_j\rangle=0$. The moving packet appears in the displacement fluctuations:

$$\begin{gathered}
\langle u_j^2\rangle_f-\langle u_j^2\rangle_0\\
=\frac{\hbar}{MN}\left|\sum_{k\ne0}\frac{f_k e^{ikja}}{\sqrt{\omega_k}}\right|^2.
\end{gathered}$$

Under time evolution each $f_k$ gains $e^{-i\omega_kt}$. A packet narrow around $k_0$ therefore carries its excess fluctuations and energy along the chain with group velocity $d\omega_k/dk|_{k_0}$. No atom travels along with the packet. The packet can spread; interactions beyond this quadratic approximation, called **anharmonic** terms, can give it a finite lifetime. The particle description is useful when this lifetime is long compared with the motion or scattering being studied.

The following snapshots show the excess fluctuations carried by a packet concentrated around $k_0a=\pi/3$.

<!-- FIGURE: phonon -->

<details class="figure-method">
<summary>Packet and units used in the figure</summary>

For a concrete packet, take $N=128$ and

$$f_k=C\exp\!\left[-\frac{(ka-\pi/3)^2}{4(0.18)^2}\right]e^{28ika},$$

with $C$ fixed by $\sum_k|f_k|^2=1$ over the nonzero allowed modes in $-\pi\leq ka<\pi$. Its initial envelope is centered near site $j=-28$. The plotted curves evaluate the variance above directly; no classical displacement is assigned to the state.

Times are in $\sqrt{M/\kappa}$ and excess variances in $\hbar/\sqrt{\kappa M}$.

</details>

This harmonic calculation explains the phonon's particle description. The charge and statistics of an excitation in an electron fluid require a different construction.

</details>

## Derive a winding phase from spins

Anyons can also arise in a model containing only localized spins. In **Kitaev's toric code**, put a spin $1/2$ on every edge $\ell$ of a square lattice. Its Pauli operators obey $X_\ell Z_\ell=-Z_\ell X_\ell$; operators on different edges commute. The four edges meeting at a vertex $s$ form its **star**. An elementary square is a **plaquette** $p$, with boundary $\partial p$. Define products acting on these groups of spins and an energy that favors their $+1$ eigenvalues:

$$\begin{gathered}
A_s=\prod_{\ell\ni s}X_\ell,\qquad
B_p=\prod_{\ell\in\partial p}Z_\ell,\\
H=-J_e\sum_s A_s-J_m\sum_p B_p,
\qquad J_e,J_m>0.
\end{gathered}$$

A star and a plaquette share zero or two edges. Their anticommutation signs therefore cancel: every $A_s$ commutes with every $B_p$. On a lattice with periodic boundaries, a ground state has all these eigenvalues $+1$. The positive constants $J_e,J_m$ have units of energy. A vertex with $A_s=-1$ carries an excitation of type $e$; a plaquette with $B_p=-1$ carries type $m$, costing $2J_e$ and $2J_m$, respectively. On the periodic lattice each type must be created in pairs. Here $e,m$ label excitation types, not electrical charges. [Kitaev's original construction](https://arxiv.org/abs/quant-ph/9707021) supplies this exactly solvable Hamiltonian.

Applying $Z_\ell$ flips the two adjacent star eigenvalues. A product of $Z$ operators along an open lattice path—a **string operator**—flips every interior star twice, leaving only its endpoints excited. Extending the string moves an endpoint; applying it again annihilates the pair. The energy depends on the endpoints, not their separation: these excitations are **deconfined**. Separating them does not cost an ever-growing energy. Products of $X$ similarly create and move $m$ pairs along the **dual lattice**, whose links connect neighboring plaquette centers across their shared edges.

Now move an $e$ around the boundary of a region $R$ of plaquettes. Its closed string is

$$W_e(\partial R)=\prod_{\ell\in\partial R}Z_\ell
=\prod_{p\in R}B_p.$$

The second equality follows because each interior edge occurs twice and $Z_\ell^2=1$; only boundary edges survive. For a simultaneous eigenstate $|\Psi\rangle$ with $N_m$ enclosed $m$ excitations,

$$W_e(\partial R)|\Psi\rangle=(-1)^{N_m}|\Psi\rangle.$$

One enclosed $m$ therefore gives a minus sign. Equivalently, the $Z$ loop anticommutes with an $X$ string that crosses it once. Deforming the loop across unexcited plaquettes multiplies it only by operators with eigenvalue $+1$. The phase depends on the parity of enclosed $m$'s, not the loop shape. This is **mutual statistics**, measured by winding one type around another; an interference reference makes the sign observable.

Bringing excitations together gives their **fusion rules**:

$$e\times e=m\times m=1,\qquad
e\times m=\epsilon,\qquad \epsilon\times\epsilon=1.$$

Here $1$ is the vacuum type, and $\epsilon$ is the combined type of an $e$ and an $m$. Fusion specifies the total excitation type, also called **topological charge**; it does not require a bound state. Fusing to vacuum can release energy into ordinary excitations, while leaving no nontrivial topological charge. Direct same-type exchanges give $+1$ for both $e$ and $m$: their self-statistics are bosonic. Exchanging two $\epsilon$ composites additionally includes one mutual winding, giving $-1$, so $\epsilon$ is fermionic. [Kitaev's exchange calculation, §5.2](https://arxiv.org/html/cond-mat/0506438v3#S5.SS2), establishes this distinction. The [lattice figure](../experiments.html#toric) lets us create strings and test the winding sign.

## Make a hole without removing an electron

The main example is a **Laughlin fluid**, a correlated state of electrons in a strong perpendicular magnetic field. Its interior, called the **bulk**, has an excitation gap: a nonzero minimum energy to create additional bulk excitations. It is **incompressible** because changing the bulk charge density requires creating such excitations. Low-energy motion can still occur at the boundary.

The circular motion of a charged particle in a magnetic field is its **cyclotron motion**. Quantum mechanically its energies form **Landau levels**, with many possible orbit centers at each energy. The **filling** $\nu$ counts electrons per available orbital in one level. At $\nu=1/3$, the lowest level has roughly one electron per three orbitals. All those orbitals have the same kinetic energy. The electrons can therefore change their correlations to reduce repulsion without paying additional cyclotron energy.

Take $N$ electrons with the same fixed spin and positions $z_i=x_i+iy_i$. Choose a field of magnitude $B_0>0$ into the page. The **magnetic length** $\ell_B=\sqrt{\hbar/(eB_0)}$ sets the width of the lowest-level orbitals. With $C$ a normalization constant, Laughlin's trial state is

$$\Psi_3=C\prod_{i<j}(z_i-z_j)^3
\exp\!\left[-\sum_i\frac{|z_i|^2}{4\ell_B^2}\right],
\qquad \ell_B=\sqrt{\frac{\hbar}{eB_0}}.$$

As two electrons approach, the cubic factor drives the wavefunction rapidly toward zero. Close pairs become unlikely, reducing their repulsive interaction energy. The odd power also preserves fermionic antisymmetry. For Coulomb interactions this is a trial state representing the Laughlin fluid, rather than a general exact solution.

More generally, the exponent can be an odd integer $m\geq3$ at filling $\nu=1/m$, within the Laughlin liquid regime. The main example will be $m=3$. Let $\eta$ be a chosen complex position in the bulk and multiply the wavefunction by $\prod_i(z_i-\eta)$. The extra zeros suppress electron density near $\eta$, creating a **quasihole**, while every electron coordinate remains present.

To count the missing electrons, the derivation rewrites the quantum probability density as the statistical weight of a fictitious plasma. That plasma **screens** an inserted charge: its particles rearrange to cancel the charge's long-distance field. This fixes the missing electron number near the quasihole at $1/m$, giving physical charge $q_h=e/m$, here $+e/3$. The plasma charges are auxiliary quantities; the quasihole's electrical charge remains. In a finite droplet with fixed $N$, compensating charge lies outside a disk $D$ surrounding the quasihole, typically near the edge.

<!-- FIGURE: charge -->

[Laughlin (1983)](https://doi.org/10.1103/PhysRevLett.50.1395) supplies this wavefunction and its charged excitations. The fractional charge is carried by a localized density deficit in a state containing a whole number of electrons.

<details class="derivation">
<summary>Derivation: Landau levels, the Laughlin state and the screening argument</summary>

This calculation starts from a charged-particle Hamiltonian, constructs the lowest Landau level, and uses it for the $N$-electron Laughlin state.

Take electrons with the same fixed spin, confined to a plane in a uniform magnetic field $\mathbf B=-B_0\hat{\mathbf z}$, where $B_0>0$. Choose $z_j=x_j+iy_j$ and the vector potential $\mathbf A=(B_0y/2,-B_0x/2,0)$, called the symmetric gauge. With electron charge $-e$, these conventions make lowest-Landau-level wavefunctions holomorphic in the $z_j$ apart from a Gaussian, and give the positive exchange angles below for counterclockwise motion.

The one-electron Hamiltonian is $H=\boldsymbol\Pi^2/(2m_e)$, where $\boldsymbol\Pi=\mathbf p+e\mathbf A$ is the kinetic momentum. The **band mass** $m_e$ is the effective mass entering the electron kinetic energy in the material. Since $[\Pi_x,\Pi_y]=i\hbar eB_0$, the operator $c=\ell_B(\Pi_x+i\Pi_y)/(\sqrt2\hbar)$ obeys $[c,c^\dagger]=1$. Thus $H=\hbar\omega_c(c^\dagger c+1/2)$, with $\omega_c=eB_0/m_e$ and $\ell_B=\sqrt{\hbar/(eB_0)}$. These equally spaced cyclotron energies are the **Landau levels**.

For a one-electron wavefunction $\varphi$ in the lowest level, $c\varphi=0$ becomes

$$\begin{gathered}
\left(\partial_{\bar z}+\frac{z}{4\ell_B^2}\right)\varphi=0,\qquad
\partial_{\bar z}=\frac12(\partial_x+i\partial_y),\\
\varphi(z,\bar z)=f(z)e^{-|z|^2/(4\ell_B^2)}.
\end{gathered}$$

The Gaussian cancels the term proportional to $z$; the remaining function $f$ is holomorphic. Its monomials give normalized orbitals

$$\begin{gathered}
\varphi_j(z)=\frac{[z/(\sqrt2\ell_B)]^j}{\sqrt{2\pi\ell_B^2j!}}
 e^{-|z|^2/(4\ell_B^2)},\qquad j=0,1,\ldots,\\
\langle |z|^2\rangle_j=2\ell_B^2(j+1).
\end{gathered}$$

The normalization and radius follow by setting $t=|z|^2/(2\ell_B^2)$ in the radial integral and using $\int_0^\infty t^j e^{-t}dt=j!$. Increasing $j$ moves the orbital weight outward without changing its cyclotron energy. A large disk of radius $R$ and area $A=\pi R^2$ accommodates roughly $R^2/(2\ell_B^2)=A/(2\pi\ell_B^2)$ such orbitals, with boundary corrections. Fixing the cyclotron energy leaves the orbit center free. Electrons can occupy different places without changing that energy. At fractional **filling** $\nu=2\pi\ell_B^2n_e$, with mean electron number density $n_e$, the lowest level is partly occupied. Interactions select a many-electron state within that large degeneracy. [Tong, §1.4.3](https://arxiv.org/abs/1606.06687), gives the symmetric-gauge construction; the field orientation here fixes our choice of $z$.

When interaction energies are small compared with $\hbar\omega_c$, mixing with higher levels is weak. **Projection** means restricting the Hilbert space to the retained level and replacing an operator $O$ by $POP$, where $P$ is the orthogonal projector onto that space. Within the partly filled level, interactions select the state. For $\nu=1/m$, take odd $m\geq3$ in the Laughlin liquid regime, with $m=3$ as the main example. With $C_m$ fixed by normalization, Laughlin proposed

$$\begin{aligned}
\Psi_m(z_1,\ldots,z_N)&=C_m\prod_{i<j}(z_i-z_j)^m\\
&\quad\exp\!\left[-\sum_i\frac{|z_i|^2}{4\ell_B^2}\right].
\end{aligned}$$

The polynomial is antisymmetric because $m$ is odd. Its highest power in one electron coordinate is $m(N-1)$, so a large droplet occupies roughly $mN$ lowest-level orbitals: $N$ electrons then give filling $1/m$, up to finite-size edge corrections. When two electrons approach, the amplitude vanishes as their separation to the $m$th power. The state strongly suppresses nearby electron pairs, reducing the cost of repulsive interactions without paying additional cyclotron energy. For suitable short-range interactions it is an exact ground state; for a Coulomb system it is a trial state representing the Laughlin fluid, not an exact general solution. The gap protecting this correlated fluid against additional bulk excitations is an interaction-generated many-body gap $\Delta$, distinct from the cyclotron spacing $\hbar\omega_c$. The edge of a finite droplet can still have low-energy motion.

Now multiply by one factor for every electron:

$$\begin{gathered}
\Phi_\eta(z_1,\ldots,z_N)\\
=\prod_i(z_i-\eta)\Psi_m(z_1,\ldots,z_N),\\
|\Psi_\eta\rangle=\frac{|\Phi_\eta\rangle}{\sqrt{\mathcal Z(\eta)}},\\
\mathcal Z(\eta)=\langle\Phi_\eta|\Phi_\eta\rangle.
\end{gathered}$$

The $z_i$ are electron coordinates, integrated over in an expectation value. The complex number $\eta$ is a parameter selecting where the extra zeros sit. No electron coordinate was deleted: this is still an $N$-electron wavefunction. Antisymmetry in the $z_i$ is unchanged.

The extra zero makes finding an electron at $\eta$ impossible. To check whether the surrounding rearrangement is localized, let $\mathbf r_i=(x_i,y_i)$ denote electron positions and $\delta^{(2)}$ the two-dimensional Dirac delta distribution. The electron number density is

$$n_\eta(\mathbf r)=\left\langle\Psi_\eta\left|\sum_i\delta^{(2)}(\mathbf r-\mathbf r_i)\right|\Psi_\eta\right\rangle.$$

In the Laughlin fluid, this density has a localized deficit near $\eta$ and returns to the bulk value away from it. The positively charged deficit is a **quasihole**. Write $n_L(\mathbf r)$ for the density of $\Psi_m$ without a quasihole. On a finite droplet, the displaced electronic charge goes elsewhere, typically toward the edge; a disk $D$ used to measure the quasihole should surround its core but exclude that distant compensation. Its charge is

$$q_h=-e\int_D\big[n_\eta(\mathbf r)-n_L(\mathbf r)\big]d^2r.$$

Evaluating the missing charge requires the integrated density response. To obtain it, write the quantum probability density in the form $\exp(-\beta U)$, a classical Boltzmann weight. Here $U$ is an auxiliary potential energy and $\beta$ an inverse temperature, with Boltzmann's constant absorbed into the units. Up to constants independent of electron positions,

$$\begin{aligned}
-\log|\Phi_\eta|^2&=-2m\sum_{i<j}\log\frac{|z_i-z_j|}{\ell_B}\\
&\quad-2\sum_i\log\frac{|z_i-\eta|}{\ell_B}\\
&\quad+\sum_i\frac{|z_i|^2}{2\ell_B^2}.
\end{aligned}$$

The right-hand side is $\beta U$ for a fictitious two-dimensional plasma: particles interacting through logarithmic potentials. In dimensionless units, one convention assigns auxiliary charge $m$ to each plasma particle, charge $1$ to the inserted impurity at $\eta$, and inverse temperature $\beta=2/m$. The same logarithmic interaction then produces both coefficients, $2m$ and $2$. The quadratic term acts as the potential of a uniform neutralizing background, fixing the bulk density. These are auxiliary charges used to evaluate the quantum probability distribution, not the electrical charges in the sample.

In the screening liquid regime of this auxiliary plasma, the rearranged density cancels the impurity's long-distance logarithmic field. If $\delta n=n_\eta-n_L$ is the change in particle number density, the impurity plus its surrounding response must therefore have zero auxiliary charge:

$$\begin{gathered}
1+m\int_D\delta n\,d^2r=0\\
\Longrightarrow\quad\int_D\delta n\,d^2r=-\frac1m\\
\Longrightarrow\quad q_h=\frac em.
\end{gathered}$$

Screening is the input that fixes the integral, rather than merely saying that the density returns to its bulk value. It holds in the plasma liquid regime used to describe the Laughlin fluid here; the polynomial alone has not proved it. Translating back to electrons gives a localized physical charge $+e/m$, which has not been electrically neutralized. On a finite droplet its compensating charge remains outside $D$.

A fractional mean alone would not establish a fractional quasiparticle: an ordinary electron spread between two regions also gives fractional expected charge in either one. Here the excess charge approaches a fixed value as $D$ grows beyond the quasihole core while staying inside the bulk. This expectation-value calculation does not by itself determine charge fluctuations. A measurement of the bare electron number in a sharply bounded region still has integer outcomes, with fluctuations even in the ground state. Identifying a well-defined fractional excitation requires comparing its excess charge and fluctuations with that background; [Kjønsberg and Leinaas, §2](https://arxiv.org/abs/cond-mat/9901266), make this distinction explicit.


A complementary check inserts magnetic flux $\Phi(t)$ adiabatically through a small region, changing it by one flux quantum $h/e$. Here $h=2\pi\hbar$ and $t$ is time. Faraday's law, $\oint\mathbf E\cdot d\mathbf l=-d\Phi/dt$, produces a circulating electric field. A Hall current flows transverse to the electric field. The Hall conductivity $\sigma_{xy}$ relates that current density to this field, so the radial electric current $I_r$ across an enclosing circle has magnitude $|I_r|=|\sigma_{xy}\dot\Phi|$. Integrating in time with $|\sigma_{xy}|=e^2/(mh)$ gives the transported charge $|\Delta Q|=|\sigma_{xy}|h/e=e/m$; the insertion direction chooses deficit or excess. This uses the Hall response of the same fluid, so it checks the charge without furnishing an independent derivation of that response.

The parameter $\eta$ acquires the meaning of a mobile quasihole position through pinning and transport. A smooth repulsive potential for electrons can pin the deficit. Moving the potential slowly transports a family of low-energy many-electron states with a localized density deficit following it. This works when the bulk gap persists, the quasihole stays away from the edge and other cores, and the motion does not excite the fluid across $\Delta$. Removing or weakening the pinning permits superpositions of different positions. An effective wavefunction for the quasihole describes those superpositions. It is a new description of states made from the same electrons, not another elementary constituent added to the Hamiltonian.

With two quasiholes the family is

$$\Phi_{\eta_1,\eta_2}=\prod_i(z_i-\eta_1)(z_i-\eta_2)\Psi_m.$$

This polynomial is symmetric in $\eta_1,\eta_2$, but that symmetry does not determine the phase acquired during transport. Adiabatically exchanging the pinning potentials moves the state along a path in parameter space; the accumulated phase must be calculated along that path.

The construction is [Laughlin’s](https://doi.org/10.1103/PhysRevLett.50.1395). For longer accounts of the wavefunction and quasiholes, see [Tong, §§3.1–3.2](https://arxiv.org/abs/1606.06687) and [Simon, Ch. 20](https://www-thphys.physics.ox.ac.uk/people/SteveSimon/topological2019/Topobook-Oct18-2019.pdf).

</details>

## Exchange the quasiholes, transport the electron state

For two chosen quasihole positions $\eta_1,\eta_2$, the electron wavefunction is proportional to $\prod_i(z_i-\eta_1)(z_i-\eta_2)\Psi_3$. Interchanging the labels $\eta_1,\eta_2$ leaves this polynomial unchanged. Transporting the quasiholes accumulates a phase along the path.

A **pinning potential** is a local repulsive potential for electrons that holds a quasihole in place by favoring a density deficit there. Slowly moving two such potentials transports the many-electron state. Let $|\Psi(\boldsymbol\eta)\rangle$ be a normalized instantaneous eigenstate, with $\boldsymbol\eta$ collecting the real coordinates of the pins. Choose it smoothly and single-valuedly around the closed path. Adiabatic evolution then adds, besides the dynamical phase, a **Berry phase**:

$$\gamma=i\oint\langle\Psi|\nabla_{\boldsymbol\eta}\Psi\rangle\cdot d\boldsymbol\eta.$$

The inner product integrates over all electron coordinates. I move one quasihole counterclockwise around a loop and compare the same path with and without a second, well-separated quasihole inside. The magnetic phase from the enclosed area matches. The extra phase is $2\pi/3$: one complete encircling. A direct half-exchange calculation fixes $\theta=\pi/3$ for the elementary quasihole in this orientation. Reversing the exchange reverses the phase.

In the figure, $A$ is the loop area and $\Phi=-B_0A$ its signed magnetic flux. Both runs have the same magnetic phase $\phi_B=q_h\Phi/\hbar$. The fixed quasihole lies inside the loop in one run and outside it in the reference run; their Berry phases are $\gamma_{\rm in}$ and $\gamma_{\rm out}$. Keeping both quasiholes far from each other and the edge makes the outside-hole reference equivalent to having no second hole nearby.

<!-- FIGURE: winding -->

[Arovas, Schrieffer and Wilczek (1984)](https://doi.org/10.1103/PhysRevLett.53.722) made the link between quasihole transport and fractional statistics. The exchange rule is obtained by transporting the underlying electron state.

For these quasiholes, one counterclockwise exchange gives $e^{i\pi/3}$ and one encircling gives $e^{2i\pi/3}$. The statistical contribution depends on the braid and is unchanged by smooth path deformations that keep the quasiholes separated. The full Berry phase can also contain area-dependent contributions, which must be separated.

<details class="derivation">
<summary>Derivation: Berry transport, the half-exchange and planar topology</summary>

I use the Laughlin state $\Psi_m$ at filling $1/m$, with odd $m\geq3$, charge $q_h=e/m$ and field $B_z=-B_0$. The unnormalized two-quasihole state is $\Phi_{\eta_1,\eta_2}=\prod_i(z_i-\eta_1)(z_i-\eta_2)\Psi_m$; $\Psi_{\eta_1,\eta_2}$ denotes the same state divided by its norm. The [charge derivation](#make-a-hole-without-removing-an-electron) supplies the plasma screening argument and the integrated deficit $-1/m$.

Pin one quasihole at the origin and move another around a circle $\eta=Re^{i\varphi}$ in the bulk, with radius $R$ and polar angle $\varphi$. Let the radius be large compared with the quasihole cores, but small compared with the distance to the edge. After removing the dynamical phase, the transported state acquires the Berry phase

$$\gamma=i\int_0^{2\pi}\langle\Psi_{\eta,0}|\partial_\varphi\Psi_{\eta,0}\rangle\,d\varphi.$$

The inner product integrates over all electron coordinates. On this circular path the normalization is independent of $\varphi$ by rotational symmetry. Write $n_{\eta,0}(z)$ for the electron density of the normalized two-hole state $\Psi_{\eta,0}$; only the first parameter moves. Differentiating the insertion factor in $\Phi_{\eta,0}$ gives

$$\begin{aligned}
\partial_\eta\Phi_{\eta,0}&=\sum_i\frac{1}{\eta-z_i}\Phi_{\eta,0},\\
\gamma&=i\oint d\eta\int d^2z\,\frac{n_{\eta,0}(z)}{\eta-z}.
\end{aligned}$$

This density includes the moving hole's own distortion and depends on $\eta$, so it cannot be held fixed during the contour integral. Compare transport with and without a second, well-separated hole inside the same path. Screening makes the density difference near the stationary hole independent of the distant moving hole, up to corrections that vanish with separation. The moving core's contribution is the same in the two processes and cancels. For that stationary density difference $\delta n(z)$, the contour integral is legitimate. The difference $\Delta\gamma$ between the two Berry phases is

$$\begin{aligned}
\Delta\gamma&=i\int d^2z\,\delta n(z)\oint\frac{d\eta}{\eta-z}\\
&=-2\pi\int_{\mathrm{inside}}\delta n(z)\,d^2z\\
&=\frac{2\pi}{m}.
\end{aligned}$$

The same density deficit gives both charge $e/m$ and a full-winding phase $2\pi/m$. Transporting a zero of the electron wavefunction samples the electron density; the second quasihole changes the enclosed electron number by a fraction.

The uniform electron number density is $n_e=1/(2\pi m\ell_B^2)$. It contributes $-2\pi n_e A=-A/(m\ell_B^2)$ for enclosed area $A$. With our field convention this equals the electromagnetic Aharonov–Bohm phase $q_h\Phi/\hbar$, where $\Phi=-B_0A$. That area-dependent contribution survives even with no other quasihole present. It is the **difference** $\Delta\gamma$ that isolates braiding. The instantaneous energy $E(t)$ contributes the dynamical phase $-\int E(t)dt/\hbar$, which must likewise be removed or matched between the two protocols. A generic Berry phase is not automatically a statistical phase.


A full winding is two exchanges, so this result fixes an exchange phase only up to a sign. To find the sign for the elementary quasihole, transport the normalized two-hole state through a half exchange itself. The same screening argument supplies the needed normalization.

The electron integral $\mathcal Z_2=\langle\Phi_{\eta_1,\eta_2}|\Phi_{\eta_1,\eta_2}\rangle$ omits interactions involving only the fixed plasma impurities and background. Restoring them multiplies it by

$$|\eta_1-\eta_2|^{2/m}
\exp\!\left[-\frac{|\eta_1|^2+|\eta_2|^2}{2m\ell_B^2}\right].$$

The power is the Boltzmann factor for two auxiliary unit charges; the Gaussian is their coupling to the neutralizing background. In the screened bulk liquid, separated impurities with their screening clouds have no residual long-range interaction. This completed partition function—the integral of the full plasma Boltzmann weight—is therefore independent of their positions, up to vanishing overlap and edge corrections. Hence

$$\begin{aligned}
\mathcal Z_2&\propto\exp\!\left[\frac{|\eta_1|^2+|\eta_2|^2}{2m\ell_B^2}\right]\\
&\quad|\eta_1-\eta_2|^{-2/m}.
\end{aligned}$$

Because the unnormalized electron state is holomorphic in the parameters, $\partial_{\eta_a}\mathcal Z_2=\langle\Phi|\partial_{\eta_a}\Phi\rangle$. Differentiating $|\Psi\rangle=\mathcal Z_2^{-1/2}|\Phi\rangle$ also contributes $-\tfrac12d\log\mathcal Z_2$. Combining these terms gives the **Berry connection**, the differential expression whose path integral gives the Berry phase:

$$\begin{aligned}
\mathcal A&=i\langle\Psi|d\Psi\rangle\\
&=\frac i2\sum_{a=1}^2\Bigl(
\partial_{\eta_a}\log\mathcal Z_2\,d\eta_a\\
&\qquad-\partial_{\bar\eta_a}\log\mathcal Z_2\,d\bar\eta_a\Bigr).
\end{aligned}$$

The Gaussian part gives the electromagnetic contribution already found. For the relative parameter $\zeta=\eta_1-\eta_2$, the mutual part is

$$\begin{aligned}
\mathcal A_{\rm stat}&=-\frac{i}{2m}
\left(\frac{d\zeta}{\zeta}-\frac{d\bar\zeta}{\bar\zeta}\right)\\
&=\frac1m\,d\arg\zeta.
\end{aligned}$$

A counterclockwise exchange rotates $\zeta$ by $\pi$. The initial and final electron wavefunctions in this single-valued parameter convention are identical, since the two-hole polynomial is symmetric in its parameters. There is no extra endpoint sign. After removing the electromagnetic contribution, the exchange phase is therefore $\theta=\pi/m$, giving $e^{i\pi/m}$. The phase of a full winding is $2\theta$, as before. Binding an additional local electron would change the exchange sign; that is a different excitation.

The calculation extends [Arovas, Schrieffer and Wilczek’s transport argument](https://doi.org/10.1103/PhysRevLett.53.722); the normalization route is developed in [Tong, §3.2](https://arxiv.org/abs/1606.06687). A different phase convention can move this statistical contribution from the Berry connection into a multivalued parameter factor. It cannot alter the physical transport.

This realizes one of the exchange rules allowed by the [planar path argument](#why-two-dimensions-matter). At $m=3$, a positive exchange gives $e^{i\pi/3}$ and a full winding gives $e^{2i\pi/3}$. The underlying electrons retain their original antisymmetry in the $z_i$.

</details>

## What an interferometer has actually measured

A phase multiplying an entire state cannot be observed. Interference supplies a reference. In an ideal two-path experiment, prepare a mobile Abelian anyon in equal amplitudes for orthogonal route states $|a\rangle$ and $|b\rangle$. Arrange their relative path to encircle a stationary anyon of the same type once counterclockwise. If the remaining relative phase is $\phi$, the state just before recombination is

$$|\chi\rangle=\frac{|a\rangle+e^{i(\phi+2\theta)}|b\rangle}{\sqrt2}.$$

A balanced recombiner has an output corresponding to $|+\rangle=(|a\rangle+|b\rangle)/\sqrt2$. Its detection probability is

$$P_+=|\langle+|\chi\rangle|^2=\frac{1+\cos(\phi+2\theta)}2.$$

With $\phi=0$, an empty loop gives $P_+=1$; a Laughlin quasihole with $\theta=\pi/3$ inside gives $P_+=1/4$. The enclosed quasihole has changed a probability. This ideal comparison assumes the other phases are matched and no unobserved degree of freedom records which route was taken. Losing that coherence removes the interference signal.

Charge can move along the boundary of a Hall fluid even when its bulk is gapped. The low-energy excitations propagate in boundary modes called **edge channels**. At a narrow constriction, a quasiparticle can tunnel between nearby edges. Two separated constrictions provide alternative paths enclosing part of the fluid; their amplitudes interfere if coherence is maintained. This **interferometer** measures a current response from many such tunneling events, rather than the single-particle probability just calculated.

Let $G_{\rm osc}$ be the oscillatory part of its conductance, the derivative of mean current with respect to a small applied voltage. At filling $1/3$, the interfering charge is $q_h=e/3$. Write $\Phi$ for the signed enclosed magnetic flux, $N$ for the enclosed quasihole count relative to a reference, and $\Theta_0$ for the other phase contributions. A simple fixed-path description gives the relative phase $\Theta$ as

$$G_{\rm osc}\propto\cos\Theta,\qquad
\Theta=\frac{q_h\Phi}{\hbar}+N\frac{2\pi}{3}+\Theta_0.$$

Adding one enclosed quasihole changes the statistical term by a **full braid**, $2\pi/3$.

[Nakamura, Liang, Gardner and Manfra (2020)](https://www.nature.com/articles/s41567-020-1019-1) measured discrete conductance-fringe shifts at filling $1/3$, consistent with this braiding phase. Their reported magnitude was $(0.31\pm0.04)\,2\pi$. This is evidence for Abelian statistics; it does not demonstrate non-Abelian operations.

Changing the enclosed charge can also move the edge, changing the path area and its magnetic phase. Conducting screening layers reduced this electrostatic coupling, and device checks constrained the remaining effect. The measured conductance contains both the statistical phase and these changes in the path.

Assigning a measured phase slip to braiding therefore requires independent constraints on changes in the path area.

<details class="derivation">
<summary>Derivation: the phase model and the electrostatic ambiguity</summary>

I keep the paths fixed initially and generalize to filling $\nu=1/m$, with interfering quasihole charge $q_h=e/m$. For a counterclockwise relative path of area $A$, the signed flux is $\Phi=B_zA=-B_0A$. Let $N$ count enclosed quasiholes of this type relative to a reference, and let $\Theta_0$ collect the other matched phase contributions. Two weak tunneling alternatives give an oscillatory conductance $G_{\rm osc}$ determined by their relative phase $\Theta$:

$$\begin{gathered}
G_{\rm osc}\propto\cos\Theta,\\
\Theta=\frac{q_h\Phi}{\hbar}+N\frac{2\pi}{m}+\Theta_0.
\end{gathered}$$

Reversing that path reverses both displayed phase contributions. The statistical term is a full encircling, not one exchange. Varying flux moves the fringes continuously; changing $N$ by one at fixed path adds $2\pi/m$.

Interpreting a measured phase slip as a braid phase requires identifying the charge transition as the addition or removal of one quasiparticle, and constraining accompanying changes of the path.

The same charge transition that changes $N$ can move the edge. Returning to $m=3$, let $\Delta N$ be the change in enclosed quasihole count. At fixed magnetic field, an area change $\Delta A$ then changes the relative phase by

$$\Delta\Theta=\frac{q_h B_z\Delta A}{\hbar}+\Delta N\frac{2\pi}{3}.$$

Nakamura and collaborators checked how the continuous interference fringes and discrete transitions shifted with magnetic field and gate voltage, as well as reproducibility and residual electrostatic coupling. Their [author manuscript](https://arxiv.org/abs/2006.14115) presents these controls and the phase extraction.

</details>

## When a phase is no longer enough

Fix the quasihole positions on a disk and hold the edge state fixed. For well-separated Laughlin quasiholes, one low-energy state remains, up to a phase. Other systems can retain several states even when the excitation types and their combined type are fixed. As separation grows, their energies approach equality and local measurements near one excitation cease to distinguish them. Exchanges act within this space by unitary matrices. If different exchanges fail to commute, the excitations are **non-Abelian anyons**.

A pair's **fusion channel** is its combined topological charge: the excitation type seen by a probe surrounding both particles, or the type that remains when they are brought together. As in the spin example, it need not be an electric charge. In the Ising anyon model there are types $1$ (vacuum, meaning no nontrivial excitation), $\sigma$ and $\psi$ (a fermionic excitation), with

$$\sigma\times\sigma=1+\psi.$$

The plus sign lists allowed pair types, not equal probabilities. The other rules needed here are $\psi\times\psi=1$ and that vacuum acts as an identity, so $1\times1=1$ and $1\times\psi=\psi$. Four $\sigma$ excitations with total type $1$ therefore span two states: the first pair and the second pair can both have type $1$, or both type $\psi$. A mixed assignment has total type $\psi$ and is excluded. I call the two allowed states $|0\rangle,|1\rangle$. These are collective pair labels, not a spin attached to each excitation.

One exchange can rotate a collective state, and exchanging a different pair can rotate it in a different way. Let $B_1$ exchange the first pair counterclockwise and $B_2$ the middle pair. Starting from $|0\rangle$, the Ising matrices specified below give, up to an overall phase,

$$\begin{aligned}
B_1B_2|0\rangle&=\frac{|0\rangle+|1\rangle}{\sqrt2}=|+\rangle,\\
B_2B_1|0\rangle&=\frac{|0\rangle-i|1\rangle}{\sqrt2}.
\end{aligned}$$

The rightmost operation acts first. Measuring the first pair's fusion channel gives vacuum with probability $1/2$ in either state, so this measurement misses the difference. The middle pair is different: its vacuum channel is $|+\rangle$. Projecting onto that channel gives probabilities **$1$ and $1/2$**, respectively. The exchange order has changed a measurable outcome. The [Ising figure](../experiments.html#braids) lets us compose the operations and choose which pair to measure.

For this transport, “slow” means slow enough to avoid exciting states above the collective space. If finite separation weakly splits its states, the braid should also finish before that splitting is resolved dynamically. The gap above the space and the splitting within it therefore constrain transport on different timescales.

[Ivanov (2001)](https://arxiv.org/abs/cond-mat/0005069) obtains noncommuting exchanges in a particular two-dimensional superconducting model. Electrons form a coherent pair state, or **condensate**, described by a complex amplitude. A **vortex** is a defect around which that amplitude's phase winds as we follow a closed spatial circuit. The vortices studied in the paper bind **Majorana zero modes**: localized zero-energy modes represented by Hermitian fermionic operators. Two such operators combine into one ordinary fermion mode, which can be empty or occupied.

The **fermion parity** records whether the total fermion number is even or odd. Creating or annihilating a pair changes fermion number by two and preserves parity. Four separated vortices have two fermion modes and, at fixed parity, two allowed joint occupations. Their exchange operations act noncommutatively on this two-dimensional space. Ivanov determines the operations up to an overall phase; the [paper discussion](conversation.md#ivanov-non-abelian-exchange-of-vortices) follows the four-vortex example.

<details class="derivation">
<summary>The superconducting model and its Majorana operators</summary>

Ivanov's model has pairs with total spin $1$ (**spin-triplet pairing**) and one unit of relative orbital angular momentum (**$p$-wave pairing**). The pairing is **chiral**: it selects one sense of orbital rotation. Besides its overall phase, the pair amplitude has a pairing axis along which the pair's spin projection is zero. A **half-quantum vortex** combines a $\pi$ phase winding with a $\pi$ rotation of that axis on a circuit around the core, returning the condensate to itself. It is these defects, in this model, that bind the Majorana modes.

Write two normalized Majorana operators as $\gamma_1,\gamma_2$. They satisfy $\gamma_j^\dagger=\gamma_j$ and $\{\gamma_i,\gamma_j\}=2\delta_{ij}$, where $\{A,B\}=AB+BA$. The combination

$$c=\frac{\gamma_1+i\gamma_2}{2},\qquad
c^\dagger=\frac{\gamma_1-i\gamma_2}{2}$$

obeys $c^2=0$ and $\{c,c^\dagger\}=1$. Its occupation $c^\dagger c$ is therefore $0$ or $1$. Four Majoranas make two occupations $n_1,n_2$. At even parity the possibilities are $(0,0)$ and $(1,1)$; at odd parity they are $(0,1)$ and $(1,0)$. A single pair at fixed parity has only one allowed occupation, so four modes are needed for this two-state encoding.

</details>

<details class="derivation">
<summary>Derivation: two noncommuting Ising braid matrices</summary>

I use four Ising $\sigma$ excitations with total type $1$. In the basis $|0\rangle,|1\rangle$, the pairs $(1,2)$ and $(3,4)$ both have type $1$ or both have type $\psi$, respectively. In one standard convention, the exchange matrix for the first pair is $R=\operatorname{diag}(e^{-i\pi/8},e^{3i\pi/8})$. The matrix $F$ changes to the basis where the middle pair $(2,3)$ has definite type. Thus the exchange matrices $B_1$ for the first pair and $B_2$ for the middle pair are

$$\begin{gathered}
F=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\\
B_1=R,\qquad B_2=F^{-1}RF.
\end{gathered}$$

These matrices are additional physical data of the Ising model; counting states does not determine them. $F$ is a basis change, while $B_2$ represents physical transport. Multiplication gives the two output states above. The row $\langle0|F=(\langle0|+\langle1|)/\sqrt2=\langle+|$ extracts the amplitude for the middle pair to fuse to vacuum. Thus

$$\begin{aligned}
|\langle+|B_1B_2|0\rangle|^2&=1,\\
|\langle+|B_2B_1|0\rangle|^2&=\left|\frac{1-i}{2}\right|^2=\frac12.
\end{aligned}$$

The operations fail to commute even after disregarding an overall phase. Up to such a phase, $B_1$ and $B_2$ are rotations through $\pi/2$ generated by different Pauli matrices. The [fusion-basis note](../fusion-basis.html) introduces the analogous calculation for the different Fibonacci anyon model.

</details>

Fractional charge, fractional exchange phase and a non-Abelian state space are distinct properties. A Laughlin quasihole has the first two; the Ising example introduces the third.

## What is protected?

A gap makes it costly to create extra excitations. That alone does not protect stored information: independent spins in a magnetic field are gapped, but a local field can still read or rotate one spin. The extra ingredient here is that different collective states look the same to local probes. For well-separated non-Abelian anyons, the information is in how their types combine. A measurement near one anyon cannot determine a distant pair's fusion channel.

The toric code shows a related effect even without anyons present. Join opposite edges of the square lattice to make a torus. A closed $Z$ string that can shrink to a point is a product of plaquette operators and has value $+1$ in every ground state. A string around a hole of the torus cannot be reduced this way. Take two $Z$ strings around the two independent cycles: they commute, and their two eigenvalues, each $+1$ or $-1$, label **four ground states**, all with the same local star and plaquette values. A local disturbance cannot read which state was chosen; a process extending around the torus can.

<details class="derivation">
<summary>Derivation: why the torus has four ground states</summary>

For an $L\times L$ square lattice with periodic boundaries, with integer $L\geq3$, there are $2L^2$ spins, $L^2$ stars and $L^2$ plaquettes. The product of all stars is the identity, because each edge occurs twice. The product of all plaquettes is also the identity. Only $L^2-1$ constraints of each kind are independent. Starting from a Hilbert space of dimension $2^{2L^2}$, each independent commuting constraint halves the dimension. The ground space therefore has dimension

$$2^{2L^2-(L^2-1)-(L^2-1)}=4.$$

An $e$ string or an $m$ string wrapping a noncontractible cycle acts within this space: it leaves no endpoints, hence creates no excitations. Appropriate crossing strings anticommute and change the global loop values. Strings confined to a small disk cannot do this. [Kitaev's construction](https://arxiv.org/abs/quant-ph/9707021) makes the distinction between local errors and global operations explicit.

</details>

This is a characteristic of **topological order**: a gapped phase with locally indistinguishable collective states on suitable closed surfaces, and excitations with fusion and braiding rules stable under weak local perturbations that do not close the gap. The torus degeneracy and a non-Abelian fusion space are different manifestations. The toric code's anyons are Abelian; its four torus ground states do not make them non-Abelian. Conversely, four non-Abelian anyons can supply a fusion space on an ordinary disk.

At finite separation, a perturbation can couple collective states through virtual processes, giving a small energy splitting. Real unwanted excitations can also travel and change a fusion result or a global loop value. Protection therefore improves with separation and control of excitations; it is not immunity to every error. Smoothly changing a braid's path preserves its statistical action, but performing the wrong braid does not.

For quantum computation, the protected states must also be prepared, transformed and measured. Ising braids supply only a restricted set of transformations; they cannot approximate every unitary operation. Additional operations are required. [Nayak and collaborators (2008)](https://arxiv.org/abs/0707.1889) explain both the attraction of this approach and the constraints. The [toric-code memory calculation](../experiments.html#memory) illustrates how a local error process can eventually change a global state.

<span id="a-calculation-worth-taking-further"></span>
<span id="questions-i-want-to-carry-forward"></span>

## Further directions

One direction begins before any of these measurements: which interactions stabilize an anyon phase, and which combinations of fusion and braiding rules can occur in a physical system? The toric Hamiltonian constructs one answer; the Laughlin state is a trial wavefunction whose phase must survive realistic interactions. Finding and identifying further realizations requires both a candidate many-body state and evidence for its excitations.

The examples also leave three questions about manipulating those excitations. First, how can a detector separate statistics from changes in preparation, path area and interactions? Second, what keeps a collective state protected while it is moved and measured? Third, which excitation types and motions remain possible when the surface or boundary changes? The [further directions](directions.md) develop these questions through calculations and papers.

<span id="replace-the-electron-fluid-by-two-effective-particles"></span>
<span id="the-localized-pair-is-a-superposition-not-a-separation-eigenstate"></span>
<span id="which-localized-state"></span>
<span id="figure-pair"></span>
<span id="let-a-saddle-amplify-the-difference"></span>
<span id="let-a-saddle-amplify-a-correlation"></span>
<span id="figure-saddle"></span>
<span id="when-a-splitter-has-an-interior"></span>
<span id="point-splitter"></span>
<span id="collider-packets"></span>
<span id="figure-collider"></span>

The [transport continuation](transport.md) follows one route in detail: prepare two effective anyons, let a saddle potential separate their trajectories, and ask which measured quantity retains information about exchange. A final collider example shows how even one-particle interference can alter a comparison intended to reveal statistics. These calculations supply assumptions that can be changed and observables that can be recalculated.

The [selected papers](conversation.md) connect the central ideas to their original calculations and experiments.
