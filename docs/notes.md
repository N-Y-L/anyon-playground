# Anyons and quantum transport

What can a quantum state remember after I exchange two identical objects? I want to follow that question from a moving disturbance in a material to an experimental signal, then consider what changes in other geometries and dynamical settings.

I assume basic graduate quantum mechanics—states, operators, superposition and adiabatic evolution—and graduate mathematics. I introduce the condensed-matter ingredients as they appear. The optional derivations can stay closed on a first pass; each states what it uses from earlier calculations. No quantum field theory is needed.

A [short paper list](conversation.md) accompanies the notes.

Put two identical particles in a plane. I move each to the other's starting point without letting them meet. That is an **exchange**. Repeating the exchange in the same direction winds them around one another; reversing the first motion undoes it. The final positions agree, but the histories differ. Particle trajectories drawn against time are called **worldlines**; a set of exchange trajectories forms a **braid**. The [exchange-path notebook](../experiments.html#exchange) lets me draw the difference.

Motion can also produce a dynamical phase from the energy and elapsed time, and, for a charged particle, a magnetic Aharonov–Bohm phase from enclosed flux. After matching or removing these contributions, an exchange can multiply the state by $e^{i\theta}$. I call $\theta$ the **exchange angle**, defined modulo $2\pi$. Bosons give $+1$ and fermions $-1$. Other exchange phases describe **Abelian anyons**. “Abelian” means that these scalar operations commute. In some systems exchange instead acts on a space of collective states, and the operations need not commute.

A global phase on an isolated state is invisible. To measure an exchange phase, I need interfering histories or a correlation between measured outcomes that depends on exchange.

## What is moving?

I start with a phonon: one quantum of a collective vibration of atoms in a solid. A localized one-phonon packet carries energy through the solid without adding an atom. It can carry a moving excess of displacement fluctuations even though the mean displacement stays zero. The particle description belongs to a pattern in the state of the whole solid.

An **excitation** is a change of state that carries energy above the ground state. A **quasiparticle** is an excitation whose persistence, motion and interactions admit a useful particle description. That description needs to remain valid over the process I want to study.

The anyons below are excitations of a two-dimensional **electron fluid**: interacting electrons with approximately uniform density in the interior and no crystalline order. Each electron has charge $-e$, with $e>0$, and obeys fermionic statistics. A localized rearrangement of this fluid can carry a different charge and obey a different exchange rule. It is these rearrangements that I will move and exchange.

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

Both $|f\rangle$ and the ground state have $\langle u_j\rangle=0$. A single phonon does not draw a little classical wave on the lattice. Instead, its extra displacement fluctuations are

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

Times are in $\sqrt{M/\kappa}$ and excess variances in $\hbar/\sqrt{\kappa M}$. The finite-chain mode probabilities, packet parameters and site values are included in the data download.

</details>

This harmonic calculation explains the phonon's particle description. The charge and statistics of an excitation in an electron fluid require a different construction.

</details>

## Make a hole without removing an electron

I use a **Laughlin fluid**, a correlated state of electrons in a strong perpendicular magnetic field. Its interior, called the **bulk**, has an excitation gap: a nonzero minimum energy to create additional bulk excitations. It is **incompressible** because changing the bulk charge density requires creating such excitations. Low-energy motion can still occur at the boundary.

The circular motion of a charged particle in a magnetic field is its **cyclotron motion**. Quantum mechanically its energies form **Landau levels**, with many possible orbit centers at each energy. The **filling** $\nu$ counts electrons per available orbital in one level. At $\nu=1/3$, the lowest level has roughly one electron per three orbitals, and interactions select their correlations.

Take $N$ electrons with the same fixed spin and positions $z_i=x_i+iy_i$. Choose a field of magnitude $B_0>0$ into the page. The **magnetic length** $\ell_B=\sqrt{\hbar/(eB_0)}$ sets the width of the lowest-level orbitals. With $C$ a normalization constant, Laughlin's trial state is

$$\Psi_3=C\prod_{i<j}(z_i-z_j)^3
\exp\!\left[-\sum_i\frac{|z_i|^2}{4\ell_B^2}\right],
\qquad \ell_B=\sqrt{\frac{\hbar}{eB_0}}.$$

The cubic zeros strongly suppress close electron pairs, reducing their repulsive interaction energy; the odd power preserves fermionic antisymmetry. For Coulomb interactions this is a trial state representing the Laughlin fluid, rather than a general exact solution.

More generally, the exponent can be an odd integer $m\geq3$ at filling $\nu=1/m$, within the Laughlin liquid regime. I keep $m=3$ as the example. Let $\eta$ be a chosen complex position in the bulk and multiply the wavefunction by $\prod_i(z_i-\eta)$. The extra zeros suppress electron density near $\eta$, creating a **quasihole**, while every electron coordinate remains present.

To calculate its charge, the derivation below rewrites the quantum probability density as the statistical weight of a fictitious plasma. That plasma **screens** an inserted charge: its particles rearrange to cancel the charge's long-distance field. This fixes the missing electron number near the quasihole at $1/m$, giving physical charge $q_h=e/m$, here $+e/3$. The plasma charges are auxiliary quantities; the quasihole's electrical charge remains. In a finite droplet with fixed $N$, compensating charge lies outside a disk $D$ surrounding the quasihole, typically near the edge.

<!-- FIGURE: charge -->

[Laughlin (1983)](https://doi.org/10.1103/PhysRevLett.50.1395) supplies this wavefunction and its charged excitations. A fraction of an electron's charge has emerged from a state containing a whole number of electrons.

<details class="derivation">
<summary>Derivation: Landau levels, the Laughlin state and the screening argument</summary>

This calculation starts from a charged-particle Hamiltonian, constructs the lowest Landau level, and uses it for the $N$-electron Laughlin state.

Take electrons with the same fixed spin, confined to a plane in a uniform magnetic field $\mathbf B=-B_0\hat{\mathbf z}$, where $B_0>0$. Choose $z_j=x_j+iy_j$ and the vector potential $\mathbf A=(B_0y/2,-B_0x/2,0)$, called the symmetric gauge. With electron charge $-e$, these conventions make lowest-Landau-level wavefunctions holomorphic in the $z_j$ apart from a Gaussian, and give the positive exchange angles below for counterclockwise motion.

The one-electron Hamiltonian is $H=\boldsymbol\Pi^2/(2m_e)$, where $\boldsymbol\Pi=\mathbf p+e\mathbf A$ is the kinetic momentum. The **band mass** $m_e$ is the effective mass entering the electron kinetic energy in the material. Since $[\Pi_x,\Pi_y]=i\hbar eB_0$, the operator $c=\ell_B(\Pi_x+i\Pi_y)/(\sqrt2\hbar)$ obeys $[c,c^\dagger]=1$. Thus $H=\hbar\omega_c(c^\dagger c+1/2)$, with $\omega_c=eB_0/m_e$ and $\ell_B=\sqrt{\hbar/(eB_0)}$. These equally spaced cyclotron energies are the **Landau levels**.

We need their wavefunctions, not just their energies. For a one-electron wavefunction $\varphi$ in the lowest level, $c\varphi=0$ becomes

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

The normalization and radius follow by setting $t=|z|^2/(2\ell_B^2)$ in the radial integral and using $\int_0^\infty t^j e^{-t}dt=j!$. Increasing $j$ moves the orbital weight outward without changing its cyclotron energy. A large disk of radius $R$ and area $A=\pi R^2$ accommodates roughly $R^2/(2\ell_B^2)=A/(2\pi\ell_B^2)$ such orbitals, with boundary corrections. Freezing the cyclotron energy therefore leaves many possible states: it does not freeze where an electron's orbit is centered. At fractional **filling** $\nu=2\pi\ell_B^2n_e$, with mean electron number density $n_e$, the lowest level is partly occupied. Interactions select a many-electron state within that large degeneracy. [Tong, §1.4.3](https://arxiv.org/abs/1606.06687), gives the symmetric-gauge construction; the field orientation here fixes our choice of $z$.

When interaction energies are small compared with $\hbar\omega_c$, mixing with higher levels is weak. **Projection** means restricting the Hilbert space to the retained level and replacing an operator $O$ by $POP$, where $P$ is the orthogonal projector onto that space. Within the partly filled level, those interactions still do all the work of selecting the state. For $\nu=1/m$, take odd $m\geq3$ in the Laughlin liquid regime, with $m=3$ as the main example. With $C_m$ fixed by normalization, Laughlin proposed

$$\begin{aligned}
\Psi_m(z_1,\ldots,z_N)&=C_m\prod_{i<j}(z_i-z_j)^m\\
&\quad\exp\!\left[-\sum_i\frac{|z_i|^2}{4\ell_B^2}\right].
\end{aligned}$$

The polynomial is antisymmetric because $m$ is odd. Its highest power in one electron coordinate is $m(N-1)$, so a large droplet occupies roughly $mN$ lowest-level orbitals: $N$ electrons then give filling $1/m$, up to finite-size edge corrections. More than antisymmetry is happening: when two electrons approach, the amplitude vanishes as their separation to the $m$th power. The state strongly suppresses nearby electron pairs, reducing the cost of repulsive interactions without paying additional cyclotron energy. For suitable short-range interactions it is an exact ground state; for a Coulomb system it is a trial state representing the Laughlin fluid, not an exact general solution. The gap protecting this correlated fluid against additional bulk excitations is an interaction-generated many-body gap $\Delta$, distinct from the cyclotron spacing $\hbar\omega_c$. The edge of a finite droplet can still have low-energy motion.

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

A zero in a polynomial has located the quasihole, but has not yet evaluated this integral. To find the missing charge, write the quantum probability density in the form $\exp(-\beta U)$, a classical Boltzmann weight. Here $U$ is an auxiliary potential energy and $\beta$ an inverse temperature, with Boltzmann's constant absorbed into the units. Up to constants independent of electron positions,

$$\begin{aligned}
-\log|\Phi_\eta|^2&=-2m\sum_{i<j}\log\frac{|z_i-z_j|}{\ell_B}\\
&\quad-2\sum_i\log\frac{|z_i-\eta|}{\ell_B}\\
&\quad+\sum_i\frac{|z_i|^2}{2\ell_B^2}.
\end{aligned}$$

The right-hand side is $\beta U$ for a fictitious two-dimensional plasma: particles interacting through logarithmic potentials. In dimensionless units, one convention assigns auxiliary charge $m$ to each plasma particle, charge $1$ to the inserted impurity at $\eta$, and inverse temperature $\beta=2/m$. The same logarithmic interaction then produces both coefficients, $2m$ and $2$. The quadratic term acts as the potential of a uniform neutralizing background, fixing the bulk density. These are auxiliary charges used to evaluate the quantum probability distribution, not the electrical charges in the sample.

Now use a physical property of this auxiliary plasma: in its screening liquid regime, the rearranged density cancels the impurity's long-distance logarithmic field. If $\delta n=n_\eta-n_L$ is the change in particle number density, the impurity plus its surrounding response must therefore have zero auxiliary charge:

$$\begin{gathered}
1+m\int_D\delta n\,d^2r=0\\
\Longrightarrow\quad\int_D\delta n\,d^2r=-\frac1m\\
\Longrightarrow\quad q_h=\frac em.
\end{gathered}$$

Screening is the input that fixes the integral, rather than merely saying that the density returns to its bulk value. It holds in the plasma liquid regime used to describe the Laughlin fluid here; the polynomial alone has not proved it. Translating back to electrons gives a localized physical charge $+e/m$, which has not been electrically neutralized. On a finite droplet its compensating charge remains outside $D$.


A complementary check inserts magnetic flux $\Phi(t)$ adiabatically through a small region, changing it by one flux quantum $h/e$. Here $h=2\pi\hbar$ and $t$ is time. Faraday's law, $\oint\mathbf E\cdot d\mathbf l=-d\Phi/dt$, produces a circulating electric field. A Hall current flows transverse to the electric field. The Hall conductivity $\sigma_{xy}$ relates that current density to this field, so the radial electric current $I_r$ across an enclosing circle has magnitude $|I_r|=|\sigma_{xy}\dot\Phi|$. Integrating in time with $|\sigma_{xy}|=e^2/(mh)$ gives the transported charge $|\Delta Q|=|\sigma_{xy}|h/e=e/m$; the insertion direction chooses deficit or excess. This uses the Hall response of the same fluid, so it checks the charge without furnishing an independent derivation of that response.

What licenses treating $\eta$ as a position of a mobile particle? A smooth repulsive potential for electrons can pin the deficit. Moving the potential slowly transports a family of low-energy many-electron states with a localized density deficit following it. This works when the bulk gap persists, the quasihole stays away from the edge and other cores, and the motion does not excite the fluid across $\Delta$. Removing or weakening the pinning permits superpositions of different positions. An effective wavefunction for the quasihole describes those superpositions. It is a new description of states made from the same electrons, not another elementary constituent added to the Hamiltonian.

With two quasiholes the family is

$$\Phi_{\eta_1,\eta_2}=\prod_i(z_i-\eta_1)(z_i-\eta_2)\Psi_m.$$

Here the puzzle sharpens. This polynomial is symmetric in $\eta_1,\eta_2$. Nevertheless, adiabatically exchanging their pinning potentials can give a fractional phase. Swapping two parameter names in a formula has not transported the state along a path. That transport is what must be calculated next.

The construction is [Laughlin’s](https://doi.org/10.1103/PhysRevLett.50.1395). For longer accounts of the wavefunction and quasiholes, see [Tong, §§3.1–3.2](https://arxiv.org/abs/1606.06687) and [Simon, Ch. 20](https://www-thphys.physics.ox.ac.uk/people/SteveSimon/topological2019/Topobook-Oct18-2019.pdf).

</details>

## Exchange the quasiholes, transport the electron state

For two chosen quasihole positions $\eta_1,\eta_2$, the electron wavefunction is proportional to $\prod_i(z_i-\eta_1)(z_i-\eta_2)\Psi_3$. It is symmetric in the labels $\eta_1,\eta_2$. So where could a fractional exchange phase hide?

I can hold a quasihole in place with a **pinning potential**, a local repulsive potential for electrons that favors a density deficit there. Slowly moving two such potentials transports the many-electron state. Let $|\Psi(\boldsymbol\eta)\rangle$ be a normalized instantaneous eigenstate, with $\boldsymbol\eta$ collecting the real coordinates of the pins. Choose it smoothly and single-valuedly around the closed path. Adiabatic evolution then adds, besides the dynamical phase, a **Berry phase**:

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

This density includes the moving hole's own density distortion, so one must not treat the entire integrand as a fixed function of $z$ and casually perform a contour integral. Instead, compare transport with and without a second, well-separated hole inside the same path. Screening makes the density difference near the stationary hole independent of the distant moving hole, up to corrections that vanish with separation. The moving core's contribution is the same in the two processes and cancels. For that stationary density difference $\delta n(z)$, the contour integral is legitimate. The difference $\Delta\gamma$ between the two Berry phases is

$$\begin{aligned}
\Delta\gamma&=i\int d^2z\,\delta n(z)\oint\frac{d\eta}{\eta-z}\\
&=-2\pi\int_{\mathrm{inside}}\delta n(z)\,d^2z\\
&=\frac{2\pi}{m}.
\end{aligned}$$

The same density deficit gave charge $e/m$ and now gives a full-winding phase $2\pi/m$. This is the mechanism: transporting a zero of the electron wavefunction samples the density of the other electrons; the second quasihole changes the number sampled by a fraction.

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

This gives a physical realization of a possibility allowed by two-dimensional topology. For two indistinguishable, noncoincident points, the relative vector $\mathbf r$ is identified with $-\mathbf r$. An exchange rotates it through $\pi$ and is a closed loop in the unordered configuration space. A second exchange in the same direction makes a full winding; retracing the first exchange has zero winding. The full winding cannot contract in a plane without crossing the excluded coincidence. In three dimensions it can, so a scalar exchange operation must square to one. In two dimensions its phase need not. **Abelian anyons** are the case in which these statistical operations are scalar phases. The adjective describes commuting exchange operations.

The [path figure](../experiments.html#exchange) draws this distinction. Its paths specify a braid; they do not calculate the ordinary magnetic and dynamical phases. At $m=3$, a positive exchange gives $e^{i\pi/3}$ and a full winding gives $e^{2i\pi/3}$. The electrons underneath still obey the original antisymmetry in the $z_i$.

</details>

## When a phase is no longer enough

For the Laughlin state on a disk, fixing the well-separated quasihole positions leaves one low-energy state, up to a phase, once the edge state is fixed. Some other systems retain several states even after the positions, excitation types and combined type of all excitations are fixed. Their energies become degenerate as the separations grow, and a measurement near one isolated excitation cannot distinguish them. Transport acts on this collective state space by a unitary matrix. When different exchanges do not commute, the excitations are **non-Abelian anyons**.

To label the states, I ask what excitation type a pair presents to a probe surrounding both, or what type remains when they are brought together. This is its **fusion channel**. The type is often called a topological charge; it need not be an electric charge. In the Ising anyon model there are types $1$ (vacuum, meaning no nontrivial excitation), $\sigma$ and $\psi$ (a fermionic excitation), with

$$\sigma\times\sigma=1+\psi.$$

The plus sign lists allowed pair types, not equal probabilities. The other rules needed here are $\psi\times\psi=1$ and that vacuum acts as an identity, so $1\times1=1$ and $1\times\psi=\psi$. Four $\sigma$ excitations with total type $1$ therefore span two states: the first pair and the second pair can both have type $1$, or both type $\psi$. A mixed assignment has total type $\psi$ and is excluded. I call the two allowed states $|0\rangle,|1\rangle$. These are collective pair labels, not a spin attached to each excitation.

One exchange can rotate a collective state, and exchanging a different pair can rotate it in a different way. Order can matter, just as it does for rotations about different axes. To observe the difference, I need a measurement that distinguishes the resulting states.

For this transport, “slow” means slow enough to avoid exciting states above the collective space. If finite separation weakly splits its states, the braid should also finish before that splitting is resolved dynamically. The gap above the space and the splitting within it set different timescales; arbitrarily slow motion is not the goal.

[Ivanov (2001)](https://arxiv.org/abs/cond-mat/0005069) obtains such operations in a particular two-dimensional superconducting model. Electrons pair with one unit of relative orbital angular momentum, called **$p$-wave pairing**. Their coherent pair state, the **condensate**, has a complex amplitude with an overall phase and a spin orientation. A **vortex** is a defect around which this phase winds. The paper studies **half-quantum vortices**: a $\pi$ phase winding combines with a $\pi$ rotation of the spin orientation, returning the condensate to itself. Each binds a **Majorana zero mode**, a localized zero-energy mode represented by a Hermitian fermionic operator. Two such operators combine into one ordinary fermion mode, which can be empty or occupied.

The **fermion parity** records whether the total fermion number is even or odd. Superconducting pairing changes that number by two and preserves its parity. Four separated vortices have two fermion modes and, at fixed parity, two allowed joint occupations. Their exchange operations act noncommutatively on this two-dimensional space. Ivanov determines the operations up to an overall phase; the [paper discussion](conversation.md#3-ivanov-the-exchange-has-room-to-rotate-a-state) follows the four-vortex example.

Information stored in these collective states is insensitive to local disturbances in the limit of well-separated excitations and a persistent gap. Finite separation and the creation of additional excitations limit this protection. Even ideal Ising braids generate only a restricted set of unitary operations, so additional operations are needed for arbitrary quantum computation. [Nayak and collaborators](https://arxiv.org/abs/0707.1889) develop this connection.

<details class="derivation">
<summary>Derivation: two noncommuting Ising braid matrices</summary>

I use four Ising $\sigma$ excitations with total type $1$. In the basis $|0\rangle,|1\rangle$, the pairs $(1,2)$ and $(3,4)$ both have type $1$ or both have type $\psi$, respectively. In one standard convention, the exchange matrix for the first pair is $R=\operatorname{diag}(e^{-i\pi/8},e^{3i\pi/8})$. The matrix $F$ changes to the basis where the middle pair $(2,3)$ has definite type. Thus the exchange matrices $B_1$ for the first pair and $B_2$ for the middle pair are

$$\begin{gathered}
F=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\\
B_1=R,\qquad B_2=F^{-1}RF.
\end{gathered}$$

These matrices are additional physical data of the Ising model; counting states does not determine them. $F$ is a basis change, while $B_2$ represents physical transport. Multiplication gives $B_1B_2\ne B_2B_1$. Up to a common phase they are rotations through $\pi/2$ generated by different Pauli matrices. The [Ising figure](../experiments.html#braids) supplies a measurement that distinguishes the resulting states. The [fusion-basis note](../fusion-basis.html) introduces the analogous calculation for the different Fibonacci anyon model.

</details>

Fractional charge, fractional exchange phase and a non-Abelian state space are distinct properties. A Laughlin quasihole has the first two; the Ising example introduces the third.

## What an interferometer has actually measured

I now turn to a measured signal. Although the Hall fluid has a bulk gap, it carries low-energy excitations along its boundary. These propagating boundary modes are **edge channels**. At a narrow constriction, a quasiparticle can tunnel between nearby edges. Two separated constrictions provide alternative paths enclosing part of the fluid; their amplitudes interfere if coherence is maintained. This device is an **interferometer**.

Let $G_{\rm osc}$ be the oscillatory part of its conductance, the derivative of mean current with respect to a small applied voltage. At filling $1/3$, the interfering charge is $q_h=e/3$. Write $\Phi$ for the signed enclosed magnetic flux, $N$ for the enclosed quasihole count relative to a reference, and $\Theta_0$ for the other phase contributions. A simple fixed-path description gives the relative phase $\Theta$ as

$$G_{\rm osc}\propto\cos\Theta,\qquad
\Theta=\frac{q_h\Phi}{\hbar}+N\frac{2\pi}{3}+\Theta_0.$$

Adding one enclosed quasihole changes the statistical term by a **full braid**, $2\pi/3$.

[Nakamura, Liang, Gardner and Manfra (2020)](https://www.nature.com/articles/s41567-020-1019-1) measured discrete conductance-fringe shifts at filling $1/3$, consistent with this braiding phase. Their reported magnitude was $(0.31\pm0.04)\,2\pi$. This is evidence for Abelian statistics; it does not demonstrate non-Abelian operations.

Changing the enclosed charge can also move the edge, changing the path area and its magnetic phase. Conducting screening layers reduced this electrostatic coupling, and device checks constrained the remaining effect. The measured conductance contains both the statistical phase and these changes in the path.

I can now ask a meaningful experimental question: what independent control separates a statistical phase slip from a change in the path? The detailed account below explains why the charge and geometry have to be read together.

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

## Replace the electron fluid by two effective particles

Knowing the charge and exchange rule does not yet specify a pair wavefunction. The exchange rule constrains the available states; the preparation determines their amplitudes. I now examine two particular preparations.

[Vishveshwara and Cooper (2010)](https://arxiv.org/abs/0908.3945) retain only pair states in the lowest effective Landau level, a restriction called **projection**. The **guiding center** is the center of a cyclotron orbit. Their observable is the mean squared separation of the two guiding centers. They compare it with two distinguishable particles prepared with the same localization labels and packet widths. Distinguishable particles carry labels that can tell them apart, so their exchanged alternatives do not interfere.

The localization label $d$ specifies the intended relative separation before projection; it approximates a measured packet separation only for distant packets. At fractional statistics, the difference in mean squared separation from the distinguishable reference can change sign as $d$ changes. The exchange angle has remained fixed. Thus a fixed exchange angle does not prescribe the sign of this separation comparison.

The calculation compares this preparation with another family used by [Subramanyan and Vishveshwara (2019)](https://arxiv.org/abs/1905.00442). These are generalized coherent states, defined below as eigenstates of a specified lowering operator. The families agree for bosons and fermions but give different angular-state weights for fractional statistics. Which family, if either, describes a state released from a particular trap depends on its preparation.

<details class="derivation">
<summary>Derivation: two preparation families and their separation curves</summary>

Now change descriptions. The microscopic state above depended on $N$ electron positions and two quasihole parameters. The bulk-pair problem of [Vishveshwara and Cooper](https://arxiv.org/abs/0908.3945) instead starts from two effective particles, endowed with the quasiholes' charge and exchange rule. The electron coordinates no longer appear. Their effects enter through the effective parameters, the allowed states, and the conditions under which this reduction works.

I use equal charges $q=e/m$ and exchange angle $\theta=\pi/m$ for Laughlin filling $1/m$, in the field $B_z=-B_0$. I neglect the quasiholes' mutual interaction in this model and retain their lowest effective Landau level. Its orthogonal projector will be denoted $P$; projected observables have the form $POP$. The electron magnetic length remains $\ell_B=\sqrt{\hbar/(eB_0)}$. The new magnetic length is

$$\ell=\sqrt{\frac{\hbar}{|q|B_0}}=\sqrt m\,\ell_B.$$

It is not the electron magnetic length. A smooth potential supplies the slow motion after projection; an effective mass, if introduced before projection, drops out of the remaining orbit-center dynamics. The relation to the microscopic electron system concerns its space of low-energy quasihole states. Introducing an unprojected charged particle constructs an effective projected description; it does not derive a quasihole mass or a microscopic cyclotron ladder. This is a model for well-separated low-energy excitations, not a re-solution of the Coulomb many-electron problem. Whether a particular trap prepares one of its states has to be checked separately.

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

Exchange sends $(x,y)$ to $(-x,-y)$. To pass from the transported electron state to an effective coordinate wavefunction, first make the phase convention explicit. Write $\alpha=\theta/\pi$; for the Laughlin quasihole, $\alpha=1/m$. The calculation above gave a statistical Berry connection $\mathcal A_{\rm stat}=\alpha\,d\varphi$, where $\varphi=\arg\zeta$ and $\zeta=\eta_1-\eta_2$. The original normalized electron-state family is single-valued in these parameters. On a chosen angular branch, change its phase to

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

For a nonzero label, its normalized form maximizes the probability density at that label among states in the retained sector: Cauchy–Schwarz gives $|\langle w_0|\psi\rangle|^2\leq\langle w_0|P_\alpha|w_0\rangle$, and the projected state saturates the bound. This makes it a natural localized state without claiming minimum width. It cannot be a position eigenstate, because projection has removed the higher levels needed to make one. For a label on the incoming $x$ axis, take real $w_0=d/(2\ell)$ and set $s=d/\ell$, $u=s^2/4$. The common Gaussian cancels on normalization. What remains is exactly the localized-coordinate preparation used in the 2010 calculation:

$$\begin{gathered}
|u,\alpha\rangle_{\rm loc}\\
=\frac{1}{\sqrt{Z_\alpha(u)}}\sum_{n=0}^{\infty}
\frac{u^{n+\alpha/2}}{\sqrt{\Gamma(2n+\alpha+1)}}|n,\alpha\rangle,\\
Z_\alpha(u)=\sum_{n=0}^{\infty}\frac{u^{2n+\alpha}}{\Gamma(2n+\alpha+1)}.
\end{gathered}$$

The label $d$ agrees asymptotically with a packet separation. At small $d$ it is not a measured separation; we will calculate the mean squared guiding-center separation. Opposite relative labels describe the same unordered pair. Notice what the projection has supplied beyond the exchange rule: a definite amplitude for every allowed angular state.

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

Squaring the amplitudes gives probabilities $p_n=u^{2n+\alpha}/[\Gamma(2n+\alpha+1)Z_\alpha]$. The whole calculation now reduces to an angular-momentum average:

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

The words “bunching” and “antibunching” in this calculation refer to the sign of this **mean squared separation comparison**. It is neither a pair-density function at a particular point nor the probability that two detectors click together. Also, $s\to0$ is a formal limit of the point-anyon model: actual quasihole cores eventually overlap. The clean limiting formula is useful for checking the calculation, not for promising a physical experiment at zero separation.

### Which localized state?

There is another natural way to prepare a compact pair, used in [Subramanyan and Vishveshwara’s dynamics study](https://arxiv.org/abs/1905.00442). It becomes clear once we identify the operators that preserve the exchange condition. A linear relative coordinate changes angular momentum by one unit and takes a state out of the chosen sector. Quadratic combinations—squares or products of coordinate operators—can connect neighboring allowed states, whose orbital indices differ by two.

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

Use the same incoming-axis label as before by taking real $\beta=u/2$. Its probabilities are proportional to $(u/2)^{2n}/[n!\Gamma(n+\alpha+1/2)]$. Compute $\chi=2\langle n\rangle+\alpha-u$ again, using these new weights. Bosonic and fermionic endpoints agree exactly with the previous preparation, but fractional statistics give different curves. The exchange boundary condition has not changed. The coefficients have.

<!-- FIGURE: pair -->

For numerical work the positive series is sufficient. Writing $I_\mu$ for the modified Bessel function of order $\mu$, the same result is

$$\chi_{\rm coh}(u,\alpha)
=u\frac{I_{\alpha+1/2}(u)}{I_{\alpha-1/2}(u)}-u+\alpha,$$

where $I_\mu(u)=\sum_{n\geq0}(u/2)^{2n+\mu}/[n!\Gamma(n+\mu+1)]$. The defining series explains where the function comes from: it is the normalization and its derivative, not a new physical postulate.

At large $u$, the coherent-state excess has the leading tail $\chi_{\rm coh}\sim\alpha(\alpha-1)/(2u)$ for $0<\alpha<1$; the localized-coordinate excess decays exponentially with a power prefactor. Thus the distinction survives beyond a small numerical correction at one separation.

For the ideal Laughlin trial family, its microscopic normalization already constrains the effective state. Put $\eta_{1,2}=\pm\zeta/2$ and $u=|\zeta|^2/(4\ell^2)$. Expanding $\prod_i(z_i^2-\zeta^2/4)\Psi_m$ in powers of $\zeta^2$ gives electron states with different total angular momenta, hence orthogonal states in a rotationally symmetric droplet. Let $A_n$ be the nonnegative squared norms of those expansion coefficients, including the fixed length factors. Their total norm and normalized weights are

$$\begin{gathered}
\mathcal Z_2(u)=\sum_{n=0}^{N}A_nu^{2n},\qquad
p_n=\frac{A_nu^{2n}}{\mathcal Z_2(u)},\\
\langle j\rangle=\alpha+u\partial_u\log\mathcal Z_2.
\end{gathered}$$

The last line uses the angular-basis identification $j=2n+\alpha$. For separated holes well inside a sufficiently large droplet, write $\mathcal Z_2=C e^u u^{-\alpha}[1+\varepsilon(u)]$, where $C$ is independent of $u$ and $\varepsilon(u)$ describes corrections to the screened bulk expression derived in the [Berry calculation](#exchange-the-quasiholes-transport-the-electron-state). The leading terms cancel in $\chi=\langle j\rangle-u$, leaving $\chi=u\partial_u\log[1+\varepsilon(u)]$. The residual therefore tests the screening and edge corrections. Of the two preparations above, the projected-coordinate family has the rapidly decaying corrections consistent with short-range screening; the generalized coherent family has an algebraic correction. This motivates [Kjønsberg and Leinaas's approximate coordinate-state mapping](https://arxiv.org/abs/cond-mat/9606214). The full norm would determine every $A_n$; its screened asymptotic form does not. A specified pinning-and-release protocol still needs its own microscopic state and operator mapping.


</details>

<span id="let-a-saddle-amplify-the-difference"></span>

## Let a saddle amplify a correlation

A **saddle potential** curves upward along one direction and downward along a perpendicular direction. Retaining the lowest Landau level changes its dynamics: the two guiding-center coordinates form a conjugate pair. For a suitable orientation of the axes, the guiding-center coordinates $X_s,Y_s$ evolve in time $t$ with a positive rate $\lambda$:

$$X_s(t)=e^{-\lambda t}X_s(0),\qquad
Y_s(t)=e^{\lambda t}Y_s(0).$$

The rate $\lambda$ is set by the second spatial derivatives of the potential energy and by the magnetic length. Their widths change reciprocally: this is **squeezing**. It happens for one particle too, so exponential stretching alone is not evidence for anyonic statistics.

For a pair, the model below can amplify a correlation already present in the initial state. It represents squared relative coordinates by particular operators; interpreting its output as spatial data requires showing that these operators agree with the projected physical observables. If $y_1,y_2$ are the measured outgoing positions, the moment $\langle y_1y_2\rangle$ weights each event by their product. A few distant events can dominate this average, so its sign does not determine the probability that both particles leave on the same side.

I want to distinguish features inherited from the pair from features produced by the saddle. The [one-particle calculation](directions/saddle.md) provides a baseline. It also connects the saddle equation to barrier scattering and to the decaying oscillations of a perturbed black hole, called gravitational ringdown.

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

The calculation is short once that physical choice is explicit. The commutators give

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

A detector needs a different calculation. An ideal measurement of whether both particles exit into the same half-plane asks for

$$P_{\rm same}=\left\langle\mathbf 1_{y_1y_2>0}\right\rangle,$$

where the indicator is the projector onto that region for a specified outgoing position measurement. A real detector has a finite spatial and time response instead. When interpreted as a spatial moment, $C_{\rm alg}$ weights every event by the product $y_1y_2$: a few widely separated events can outweigh many near the center. Its sign cannot determine $P_{\rm same}$. Connecting the algebraic model to clicks therefore requires matching its operators to the measured coordinates, as well as the outgoing state and a detector model, not merely naming the saddle a splitter.

The growing solution also has a physical stopping point. The potential must remain smooth over a packet and weak enough not to mix the retained levels with higher ones; eventually the expanding packet leaves the region where a quadratic saddle is an adequate approximation. Close encounters can bring quasihole cores and residual interactions into play. These conditions delimit the time interval over which a physical saddle could follow the simple exponential evolution.

A more general quadratic potential provides a useful extension. For one guiding center, let $V=(aX_s^2+bY_s^2)/2$, where $a,b$ are the energy curvatures along its principal axes. This gives $\ddot X_s=-(\ell^4ab/\hbar^2)X_s$. Curvatures of the same sign give oscillatory motion; opposite signs give exponential drift. The [2025 preprint by Basani, Subramanyan and Vishveshwara](https://arxiv.org/abs/2509.15488) develops such trap and saddle dynamics for the generalized coherent pair states. Its symmetry methods build on the same quadratic algebra. Changing a curvature can change stable motion into unstable motion; it does not interpolate the particle statistics.

</details>

## When a splitter has an interior

A **beam splitter** couples two incoming channels to two outgoing channels; each channel is a propagating mode. I first take a lossless splitter whose scattering amplitudes are effectively constant over the incident packet's wave numbers. A balanced splitter sends one incident particle to either output with probability $1/2$. I inject one particle in each input, with identical synchronized packets and matching internal states. Bosons then leave together; fermions leave in different outputs. The alternatives “both transmit” and “both reflect” interfere. This conclusion depends on the matching of the packets and on the one-particle scattering amplitudes.

[Samal, Vishveshwara, Gefen and Väyrynen (2026)](https://arxiv.org/abs/2412.19674) studied an **extended collider** in which a particle can make several trips around an antidot—a depleted region with a circulating edge path—before exiting. One particle already interferes with itself. A comparison that discards this coherence can suggest **bunching**, an excess of same-output events relative to the chosen reference, even for fermions.

I therefore keep the apparatus's one-particle interference in the reference calculation, while making the two particles distinguishable. Subtracting this reference isolates the exchange contribution in the model. The paper does this for noninteracting bosons and fermions. It leaves an anyonic extension open, because even a single-source process can contain braiding information.

The broad question is how to distinguish exchange effects from preparation and propagation through several coherent paths. A boson or fermion result cannot answer the anyon problem merely by replacing its exchange sign with $e^{i\theta}$; the contributing paths and tunneling processes must also be specified.

<details class="derivation">
<summary>Derivation: packet interference and the two distinguishable references</summary>

This calculation is independent of the pair-state algebra. It uses only one-particle scattering and bosonic or fermionic symmetrization. I compare the coincidence probability with a reference made from distinguishable particles, keeping their input packets and the apparatus fixed.

For more background on what a channel carries, the optional [transport derivation of incoming flux and mean current](https://n-y-l.github.io/quantum-transport-notes/docs/notes.html#counting) supplies the connection to reservoirs. Return here for the two-particle calculation: a one-particle transmission probability alone does not give a coincidence probability.

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

At a balanced splitter, these are zero and one. The result assumes matching internal states and temporal packets; distinct spin states or delayed packets can remove the exchange interference. “Two particles arrived” is not enough to specify a collision.

A source supplies incoming particles; a drain is a large output reservoir that collects them. An extended collider can keep a packet circulating before letting it out. In the model of [Samal, Vishveshwara, Gefen and Väyrynen](https://arxiv.org/abs/2412.19674), two channels couple through a loop around an **antidot**, a depleted region supporting a closed edge path. An **edge channel** is a low-energy mode propagating along the boundary of a Hall fluid. A particle may complete different numbers of loops before reaching a drain. These delayed alternatives interfere even when only one source is active. This is single-particle self-interference; no partner is required.

A smaller example of this one-particle interference is the [side-orbital calculation](https://n-y-l.github.io/quantum-transport-notes/docs/notes.html#side-orbital): a coherent excursion into a second orbital can cancel transmission completely. It is a different device, useful for seeing why a one-source reference must retain interference inside the apparatus. After that optional detour, resume with the packet calculation below.

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

The first term leaves both input particles in their original channels; the second swaps which input supplies each detector. Counting all outgoing temporal modes is equivalent to summing probabilities over these orthogonal spectral modes, giving $P_{11}=\int dk\,dk'|\mathcal A|^2$. The two squared terms yield $a^2+b^2$. The cross term factorizes into $J^2$, so

$$\begin{aligned}
P_{11}^{B/F}&=a^2+b^2\pm2\operatorname{Re}J^2\\
&=a^2+b^2\mp2|J|^2.
\end{aligned}$$

The last sign follows from unitarity: $TR^*$ is imaginary at every $k$, hence $J$ is imaginary. This is the important interference step. Equal spectral probabilities without equal phases and arrival times would not justify it; a relative delay changes the amplitude overlap.

For a point splitter, $|J|^2=ab$ and the earlier formulas return. In an extended device, transmitted and reflected packets can have different time profiles, so $|J|^2<ab$ is possible. Two fermions can then leave through the same drain in different temporal modes. The exclusion principle forbids occupation of the same complete one-particle state, not use of the same macroscopic wire.

Let $P_{i\to j}$ be the probability that a particle from input $i$ reaches output $j$. Define the reference coincidence probability $B_2$ for distinguishable particles, preserving everything the apparatus does to each packet:

$$\begin{aligned}
B_2&=P_{1\to1}P_{2\to2}+P_{1\to2}P_{2\to1}\\
&=a^2+b^2.
\end{aligned}$$

These probabilities are obtained by activating the sources separately under the same device conditions. Subtract this reference to define the remaining exchange contribution $Q_{\rm irr}$:

$$Q_{\rm irr}^{F/B}\equiv P_{11}^{F/B}-B_2=\pm2|J|^2.$$

The term “irreducible” here denotes that specific subtraction. For a dilute train of random emissions, extracting the analogous two-source coincidence from measured currents also requires subtracting correlations recorded with each source alone, to remove pairs emitted by the same source. The single-source mean currents then provide the four probabilities in $B_2$. This source subtraction and the subsequent $B_2$ comparison do different jobs.

For comparison, a different reference $B_1$ discards interference between the paths of each individual particle. Sum path probabilities instead of path amplitudes, obtaining $a_{\rm cl},b_{\rm cl}$, and set $B_1=a_{\rm cl}^2+b_{\rm cl}^2$. It removes single-particle coherence as well as exchange interference, so it need not agree with $B_2$. The figure gives an explicit case in which this changes the apparent sign.

For the displayed loop, $r$ is the real amplitude to remain on a local channel at either of the two junctions, $L$ is the loop circumference, and $q=kL$ is a dimensionless wave number. In this section $q$ denotes that wave number, rather than electric charge. With the junction phase chosen as zero,

$$\begin{aligned}
T(q)&=\frac{r(1-e^{iq})}{1-r^2e^{iq}},\\
R(q)&=-\frac{(1-r^2)e^{iq/2}}{1-r^2e^{iq}}.
\end{aligned}$$

Expanding the denominator as a geometric series identifies successive windings. Squaring each winding separately gives $b_{\rm cl}=(1-r^2)/(1+r^2)$ and $a_{\rm cl}=2r^2/(1+r^2)$. Adding the amplitudes first gives the resonant $T,R$ used in $B_2$. The figure integrates over a uniform incident spectrum $0\leq q\leq L/\ell_p$, where $\ell_p$ sets the inverse spectral width. One edge of this window is fixed at the resonance $q=0$, where the paths give complete channel switching and $T=0$; translating the window relative to the resonances would change the probabilities. Here $\ell_p$ is not a root-mean-square packet length: a perfectly sharp spectral window has long spatial tails.

<!-- FIGURE: collider -->

At $r=0.95$ and $\ell_p/L=2.5$, the calculated fermion coincidence is about $0.808$. It lies below $B_1\simeq0.903$ but above $B_2\simeq0.552$. Calling that first comparison “fermion bunching” does not mean that fermions changed statistics. The reference has included an extra change of physics. The calibrated exchange contribution remains positive, about $0.256$.

This is a boson/fermion theory of a noninteracting extended scatterer, published in 2026. It does **not** derive an anyon version by replacing a sign with $e^{i\theta}$. In an anyon device, even a process with only one active source may involve a tunneling excitation winding in spacetime around other excitations. That statistical contribution can enter the source-alone signal being subtracted. Extending the reference procedure while retaining the desired anyonic information is an open problem identified by the paper. The bulk-pair and collider calculations meet at a concrete issue: which parts of a measured correlation come from exchange, which from preparation, and which from propagation through the device?

</details>

<span id="a-calculation-worth-taking-further"></span>

## Questions I want to carry forward

These calculations leave several broad questions:

- **Preparation.** Which features of an anyon signal survive changes in how I localize and release the excitations? The two pair preparations give a concrete example of this dependence.
- **Evidence and measurement.** Which combination of observables best separates statistics from ordinary interference and interactions? Interferometers and colliders expose different ambiguities.
- **Geometry and dynamics.** What survives when I change the surface, boundary or drive? A sphere changes global winding constraints; a Möbius band makes handedness a consistency question; a conserved parity can obstruct following a changing ground state.

[Directions to think about](directions.md) develops these settings through separate calculations.

The [paper list and questions](conversation.md) returns to three examples: Berry transport of Laughlin quasiholes, experimental phase slips, and noncommuting exchanges of vortex states.
