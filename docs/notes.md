# Anyons and quantum transport

Put two identical particles far apart in a plane. Move each to the other's starting position, keeping them apart throughout: that is an **exchange**. The paths matter. Doing the exchange twice in the same direction winds the particles around one another; undoing the first motion retraces the paths. These are different processes in two dimensions.

Quantum transport adds ordinary phases from elapsed time, energies and magnetic flux. After those contributions are removed or matched against a reference process, an exchange can leave a residual effect that depends on how the paths wind. This is **exchange statistics**. In the simplest case the effect is a scalar phase $e^{i\theta}$; the angle $\theta$ is the **statistical phase** of the exchange. Bosons have $\theta=0$, fermions $\theta=\pi$, modulo $2\pi$. Particles with other values are **Abelian anyons**. “Abelian” says that these scalar operations commute. Some systems instead allow exchanges to act by noncommuting matrices on several states; those are non-Abelian anyons, discussed at the end.

What counts as the particle? A change in the state of many electrons can be concentrated in one region and transported to another. In the example we will construct, such a moving rearrangement carries charge $+e/3$. Transport two of them slowly enough for the electrons to follow their instantaneous low-energy state, and exchanging them can contribute $e^{i\pi/3}$. The electrons themselves still carry charge $-e$ and obey fermionic antisymmetry. It is the two rearrangements that are exchanged.

A phase multiplying one isolated state is unobservable; the exchange phase becomes measurable as a relative phase between coherent histories, or through the interference it imposes on a two-particle state. We will construct the many-electron state, calculate the charge and exchange phase of its moving rearrangements, and then ask what a preparation and a detector actually measure. The first step is to make the particle description concrete.

## What is moving?

A particle in a material need not be one of the material's constituents. A concrete example is a phonon, a quantum of a normal mode of the atoms' motion. For a periodic chain of $N$ atoms of mass $M$, lattice spacing $a$, displacement $u_j$ from site $ja$, conjugate momentum $p_j$, and nearest-neighbor spring constant $\kappa$,

$$\begin{aligned}
H&=\sum_j\left[\frac{p_j^2}{2M}+\frac{\kappa}{2}(u_{j+1}-u_j)^2\right]\\
&=\sum_{k\ne0}\hbar\omega_k\left(a_k^\dagger a_k+\frac12\right),\\
\omega_k&=2\sqrt{\frac\kappa M}\left|\sin\frac{ka}{2}\right|.
\end{aligned}$$

The uniform translation mode is fixed; the other allowed wave numbers are $k=2\pi n/(Na)$. Here $a_k^\dagger$ excites a normal coordinate involving the whole chain. It adds energy $\hbar\omega_k$ and crystal momentum $\hbar k$, modulo $\hbar$ times a reciprocal-lattice vector. It does not add an atom.

A localized one-phonon state is a superposition $|f\rangle=\sum_k f_k a_k^\dagger|0\rangle$, with $\sum_k|f_k|^2=1$. To see what changes in the solid, use its actual displacement operator,

$$u_j=\sum_{k\ne0}\sqrt{\frac{\hbar}{2MN\omega_k}}
\left(a_ke^{ikja}+a_k^\dagger e^{-ikja}\right).$$

Both $|f\rangle$ and the ground state have $\langle u_j\rangle=0$. A single phonon does not draw a little classical wave on the lattice. Instead, its extra displacement fluctuations are

$$\begin{gathered}
\langle u_j^2\rangle_f-\langle u_j^2\rangle_0\\
=\frac{\hbar}{MN}\left|\sum_{k\ne0}\frac{f_k e^{ikja}}{\sqrt{\omega_k}}\right|^2.
\end{gathered}$$

Under time evolution each $f_k$ gains $e^{-i\omega_kt}$. A packet narrow around $k_0$ therefore carries its excess fluctuations and energy along the chain with group velocity $d\omega_k/dk|_{k_0}$. No atom travels along with the packet. The packet can spread; anharmonic interactions can give it a finite lifetime. The particle description is useful when this lifetime is long compared with the motion or scattering being studied.

The following snapshots show the excess fluctuations carried by a packet concentrated around $k_0a=\pi/3$.

<!-- FIGURE: phonon -->

<details class="figure-method">
<summary>Packet and units used in the figure</summary>

For a concrete packet, take $N=128$ and

$$f_k=C\exp\!\left[-\frac{(ka-\pi/3)^2}{4(0.18)^2}\right]e^{28ika},$$

with $C$ fixed by $\sum_k|f_k|^2=1$ over the nonzero allowed modes in $-\pi\leq ka<\pi$. Its initial envelope is centered near site $j=-28$. The plotted curves evaluate the variance above directly; no classical displacement is assigned to the state.

Times are in $\sqrt{M/\kappa}$ and excess variances in $\hbar/\sqrt{\kappa M}$. The finite-chain mode probabilities, packet parameters and site values are included in the data download.

</details>

The single phonon is an **excitation**: a change carrying energy above the ground state. This is the useful content of **quasiparticle**: a sufficiently persistent excitation whose states, energy, motion and interactions admit an effective particle description. Phonons get this description from harmonic normal modes. The localized charged excitations below arise from a correlated electronic state, by a different construction. Quantizing a spring has not explained their charge or their statistics.

## Make a hole without removing an electron

The example will be an **electron fluid**: a state of interacting electrons with approximately uniform density in its interior and no crystalline order. Its quantum state is still a many-electron wavefunction.

Take spin-polarized electrons confined to a plane in a uniform magnetic field. Write the field as $\mathbf B=-B_0\hat{\mathbf z}$, with $B_0>0$, choose $z_j=x_j+iy_j$, and use the symmetric gauge $\mathbf A=(B_0y/2,-B_0x/2,0)$. With electron charge $-e$, $e>0$, these conventions make lowest-Landau-level wavefunctions a holomorphic function of the $z_j$ times a Gaussian and make the statistical angles below positive for counterclockwise exchange.

The one-electron Hamiltonian is $H=\boldsymbol\Pi^2/(2m_e)$, where $\boldsymbol\Pi=\mathbf p+e\mathbf A$ and $m_e$ is the band mass. Since $[\Pi_x,\Pi_y]=i\hbar eB_0$, the operator $c=\ell_B(\Pi_x+i\Pi_y)/(\sqrt2\hbar)$ obeys $[c,c^\dagger]=1$. Thus $H=\hbar\omega_c(c^\dagger c+1/2)$, with $\omega_c=eB_0/m_e$ and $\ell_B=\sqrt{\hbar/(eB_0)}$. These equally spaced cyclotron energies are the **Landau levels**.

We need their wavefunctions, not just their energies. In the lowest level, $c\varphi=0$ becomes

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

The normalization and radius follow by setting $t=|z|^2/(2\ell_B^2)$ in the radial integral and using $\int_0^\infty t^j e^{-t}dt=j!$. Increasing $j$ moves the orbital weight outward without changing its cyclotron energy. A large disk of radius $R$ accommodates roughly $R^2/(2\ell_B^2)=A/(2\pi\ell_B^2)$ such orbitals, with boundary corrections. Freezing the cyclotron energy therefore leaves many possible states: it does not freeze where an electron's orbit is centered. At fractional **filling** $\nu=2\pi\ell_B^2n_e$, with mean electron number density $n_e$, the lowest level is partly occupied. Interactions select a many-electron state within that large degeneracy. [Tong, §1.4.3](https://arxiv.org/abs/1606.06687), gives the symmetric-gauge construction; the field orientation here fixes our choice of $z$.

When interaction energies are small compared with $\hbar\omega_c$, mixing with higher levels is weak and this lowest-level projection is useful. Within the partly filled level, those interactions still do all the work of selecting the state. For $\nu=1/m$, take odd $m\geq3$ in the Laughlin liquid regime, with $m=3$ as the main example. Laughlin proposed

$$\begin{aligned}
\Psi_m(z_1,\ldots,z_N)&=C_m\prod_{i<j}(z_i-z_j)^m\\
&\quad\exp\!\left[-\sum_i\frac{|z_i|^2}{4\ell_B^2}\right].
\end{aligned}$$

The polynomial is antisymmetric because $m$ is odd. Its highest power in one electron coordinate is $m(N-1)$, so a large droplet occupies roughly $mN$ lowest-level orbitals: $N$ electrons then give filling $1/m$, up to finite-size edge corrections. More than antisymmetry is happening: when two electrons approach, the amplitude vanishes as their separation to the $m$th power. The state strongly suppresses nearby electron pairs, reducing the cost of repulsive interactions without paying additional cyclotron energy. For suitable short-range interactions it is an exact ground state; for a Coulomb system it is a trial state representing the Laughlin phase, not an exact general solution. The gap protecting this correlated fluid against unwanted **bulk** excitations is an interaction-generated many-body gap $\Delta$, distinct from the cyclotron spacing $\hbar\omega_c$. The edge of a finite droplet can still have low-energy motion.

Now multiply by one factor for every electron:

$$\begin{gathered}
\Phi_\eta(z_1,\ldots,z_N)\\
=\prod_i(z_i-\eta)\Psi_m(z_1,\ldots,z_N),\\
|\Psi_\eta\rangle=\frac{|\Phi_\eta\rangle}{\sqrt{\mathcal Z(\eta)}},\\
\mathcal Z(\eta)=\langle\Phi_\eta|\Phi_\eta\rangle.
\end{gathered}$$

The $z_i$ are electron coordinates, integrated over in an expectation value. The complex number $\eta$ is a parameter selecting where the extra zeros sit. No electron coordinate was deleted: this is still an $N$-electron wavefunction. Antisymmetry in the $z_i$ is unchanged.

The extra zero makes finding an electron at $\eta$ impossible. Whether the surrounding rearrangement is localized is a physical question, answered by the electron number density

$$n_\eta(\mathbf r)=\left\langle\Psi_\eta\left|\sum_i\delta^{(2)}(\mathbf r-\mathbf r_i)\right|\Psi_\eta\right\rangle.$$

In the Laughlin fluid, this density has a localized deficit near $\eta$ and returns to the bulk value away from it. The positively charged deficit is a **quasihole**. Write $n_L(\mathbf r)$ for the density of $\Psi_m$ without a quasihole. On a finite droplet, the displaced electronic charge goes elsewhere, typically toward the edge; a disk $D$ used to measure the quasihole should surround its core but exclude that distant compensation. Its charge is

$$q_h=-e\int_D\big[n_\eta(\mathbf r)-n_L(\mathbf r)\big]d^2r.$$

A zero in a polynomial has located the quasihole, but has not yet evaluated this integral. To find the missing charge, write its probability density as a classical Boltzmann weight. Up to constants independent of electron positions,

$$\begin{aligned}
-\log|\Phi_\eta|^2&=-2m\sum_{i<j}\log\frac{|z_i-z_j|}{\ell_B}\\
&\quad-2\sum_i\log\frac{|z_i-\eta|}{\ell_B}\\
&\quad+\sum_i\frac{|z_i|^2}{2\ell_B^2}.
\end{aligned}$$

This is the energy divided by temperature of a fictitious two-dimensional plasma with logarithmic repulsion. One convention assigns auxiliary charge $m$ to each plasma particle, charge $1$ to the inserted impurity, and inverse temperature $2/m$. The same logarithmic interaction then produces both coefficients, $2m$ and $2$. The quadratic term acts as the potential of a uniform neutralizing background, fixing the bulk density. These are auxiliary charges used to evaluate the quantum probability distribution, not the electrical charges in the sample.

Now use a physical property of this auxiliary plasma: in its screening liquid regime, the rearranged density cancels the impurity's long-distance logarithmic field. If $\delta n=n_\eta-n_L$ is the change in particle number density, the impurity plus its surrounding response must therefore have zero auxiliary charge:

$$\begin{gathered}
1+m\int_D\delta n\,d^2r=0\\
\Longrightarrow\quad\int_D\delta n\,d^2r=-\frac1m\\
\Longrightarrow\quad q_h=\frac em.
\end{gathered}$$

Screening is the input that fixes the integral, rather than merely saying that the density returns to its bulk value. It holds in the plasma liquid regime used to describe the Laughlin fluid here; the polynomial alone has not proved it. Translating back to electrons gives a localized physical charge $+e/m$, which has not been electrically neutralized. On a finite droplet its compensating charge remains outside $D$.

<!-- FIGURE: charge -->

A complementary check is adiabatic insertion of one electromagnetic flux quantum $h/e$ through a small region. Faraday's law, $\oint\mathbf E\cdot d\mathbf l=-d\Phi/dt$, produces a circulating electric field. The Hall conductivity $\sigma_{xy}$ relates the transverse current density to this field, so radial charge transport across an enclosing circle has magnitude $|I_r|=|\sigma_{xy}\dot\Phi|$. Integrating in time with $|\sigma_{xy}|=e^2/(mh)$ gives $|\Delta Q|=|\sigma_{xy}|h/e=e/m$; the insertion direction chooses deficit or excess. This uses the Hall response of the same phase, so it checks the charge without furnishing an independent derivation of that response.

What licenses treating $\eta$ as a position of a mobile particle? A smooth repulsive potential for electrons can pin the deficit. Moving the potential slowly transports a family of low-energy many-electron states with a localized density deficit following it. This works when the bulk gap persists, the quasihole stays away from the edge and other cores, and the motion does not excite the fluid across $\Delta$. Removing or weakening the pinning permits superpositions of different positions. An effective wavefunction for the quasihole describes those superpositions. It is a new description of states made from the same electrons, not another elementary constituent added to the Hamiltonian.

With two quasiholes the family is

$$\Phi_{\eta_1,\eta_2}=\prod_i(z_i-\eta_1)(z_i-\eta_2)\Psi_m.$$

Here the puzzle sharpens. This polynomial is symmetric in $\eta_1,\eta_2$. Nevertheless, adiabatically exchanging their pinning potentials can give a fractional phase. Swapping two parameter names in a formula has not transported the state along a path. That transport is what must be calculated next.

The construction is [Laughlin’s](https://doi.org/10.1103/PhysRevLett.50.1395). For longer accounts of the wavefunction and quasiholes, see [Tong, §§3.1–3.2](https://arxiv.org/abs/1606.06687) and [Simon, Ch. 20](https://www-thphys.physics.ox.ac.uk/people/SteveSimon/topological2019/Topobook-Oct18-2019.pdf).

## Exchange the quasiholes, transport the electron state

Pin one quasihole at the origin and move another around a circle $\eta=Re^{i\varphi}$ in the bulk. Let the radius be large compared with the quasihole cores, but small compared with the distance to the edge. After removing the dynamical phase, the transported state acquires the Berry phase

$$\gamma=i\int_0^{2\pi}\langle\Psi_{\eta,0}|\partial_\varphi\Psi_{\eta,0}\rangle\,d\varphi.$$

The inner product integrates over all electron coordinates. On this circular path the normalization is independent of $\varphi$ by rotational symmetry. For the two-hole family write $\Phi_{\eta,0}$ and $\Psi_{\eta,0}$; only the first parameter moves. Differentiating its insertion factor gives

$$\begin{aligned}
\partial_\eta\Phi_{\eta,0}&=\sum_i\frac{1}{\eta-z_i}\Phi_{\eta,0},\\
\gamma&=i\oint d\eta\int d^2z\,\frac{n_{\eta,0}(z)}{\eta-z}.
\end{aligned}$$

Here $n_{\eta,0}$ is the electron density in the two-hole state. It includes the moving hole's own density distortion, so one must not treat the entire integrand as a fixed function of $z$ and casually perform a contour integral. Instead, compare transport with and without a second, well-separated hole inside the same path. Screening makes the density difference near the stationary hole independent of the distant moving hole, up to corrections that vanish with separation. The moving core's contribution is the same in the two processes and cancels. For that stationary density difference $\delta n(z)$, the contour integral is legitimate:

$$\begin{aligned}
\Delta\gamma&=i\int d^2z\,\delta n(z)\oint\frac{d\eta}{\eta-z}\\
&=-2\pi\int_{\mathrm{inside}}\delta n(z)\,d^2z\\
&=\frac{2\pi}{m}.
\end{aligned}$$

The same density deficit gave charge $e/m$ and now gives a full-winding phase $2\pi/m$. This is the mechanism: transporting a zero of the electron wavefunction samples the density of the other electrons; the second quasihole changes the number sampled by a fraction.

The uniform background contributes $-2\pi n_e A=-A/(m\ell_B^2)$ for enclosed area $A$. With our field convention this equals the electromagnetic Aharonov–Bohm phase $q_h\Phi/\hbar$, where $\Phi=-B_0A$. That area-dependent contribution survives even with no other quasihole present. It is the **difference** $\Delta\gamma$ that isolates braiding. The dynamical phase, $-\int E(t)dt/\hbar$, must likewise be removed or matched between the two protocols. A generic Berry phase is not automatically a statistical phase.

<!-- FIGURE: winding -->

A full winding is two exchanges, so this result fixes an exchange phase only up to a sign. To find the sign for the elementary quasihole, transport the normalized two-hole state through a half exchange itself. The same screening argument supplies the needed normalization.

The electron integral $\mathcal Z_2=\langle\Phi_{\eta_1,\eta_2}|\Phi_{\eta_1,\eta_2}\rangle$ omits interactions involving only the fixed plasma impurities and background. Restoring them multiplies it by

$$|\eta_1-\eta_2|^{2/m}
\exp\!\left[-\frac{|\eta_1|^2+|\eta_2|^2}{2m\ell_B^2}\right].$$

The power is the Boltzmann factor for two auxiliary unit charges; the Gaussian is their coupling to the neutralizing background. In the screened bulk liquid, separated impurities with their screening clouds have no residual long-range interaction. This completed partition function is therefore independent of their positions, up to vanishing overlap and edge corrections. Hence

$$\begin{aligned}
\mathcal Z_2&\propto\exp\!\left[\frac{|\eta_1|^2+|\eta_2|^2}{2m\ell_B^2}\right]\\
&\quad|\eta_1-\eta_2|^{-2/m}.
\end{aligned}$$

Because the unnormalized electron state is holomorphic in the parameters, $\partial_{\eta_a}\mathcal Z_2=\langle\Phi|\partial_{\eta_a}\Phi\rangle$. Differentiating $|\Psi\rangle=\mathcal Z_2^{-1/2}|\Phi\rangle$ also contributes $-\tfrac12d\log\mathcal Z_2$. Combining these terms gives the normalized Berry connection

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

This gives a physical realization of a possibility allowed by two-dimensional topology. For two indistinguishable, noncoincident points, the relative vector $\mathbf r$ is identified with $-\mathbf r$. An exchange rotates it through $\pi$ and is a closed loop in the unordered configuration space. A second exchange in the same direction makes a full winding; retracing the first exchange has zero winding. The full winding cannot contract in a plane without crossing the excluded coincidence. In three dimensions it can, so a one-dimensional unitary representation of exchange must square to one. In two dimensions its phase need not. **Abelian anyons** are the case in which these statistical operations are scalar phases. The adjective describes commuting operations, not weak interactions or small fractional charge.

The [path figure](../experiments.html#exchange) draws this distinction. Its paths specify a braid; they do not calculate the ordinary magnetic and dynamical phases. At $m=3$, a positive exchange gives $e^{i\pi/3}$ and a full winding gives $e^{2i\pi/3}$. The electrons underneath still obey the original antisymmetry in the $z_i$.

## Replace the electron fluid by two effective particles

Now change descriptions. The microscopic state above depended on $N$ electron positions and two quasihole parameters. The bulk-pair problem of [Vishveshwara and Cooper](https://arxiv.org/abs/0908.3945) instead starts from two effective particles, endowed with the quasiholes' charge and exchange rule. The electron coordinates no longer appear. Their effects enter through the effective parameters, the allowed states, and the conditions under which this reduction works.

Take equal quasihole charges $q=e/m$, neglect their mutual interaction in this model, and project their motion to the lowest effective Landau level. The new magnetic length is

$$\ell=\sqrt{\frac{\hbar}{|q|B_0}}=\sqrt m\,\ell_B.$$

It is not the electron magnetic length. A smooth potential supplies the slow motion after projection; an effective mass, if introduced before projection, drops out of the remaining orbit-center dynamics. The microscopic mapping used here concerns the low-energy quasihole manifold. Introducing an unprojected charged particle constructs an effective projected description; it does not derive a quasihole mass or a microscopic cyclotron ladder. This is a model for well-separated low-energy excitations, not a re-solution of the Coulomb many-electron problem. Whether a particular trap prepares one of its states has to be checked separately.

A particle coordinate in a magnetic field separates into cyclotron motion and the **guiding center**, the center of that orbit. To see how projection changes its algebra, take one particle with kinetic momentum $\boldsymbol\Pi=\mathbf p-q\mathbf A$ in signed field $B_z$:

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

Their commutators are $[X,Y]=i\ell^2/2$ and formally $[x,y]=2i\ell^2$ before restricting to exchange-invariant observables. The two independent frozen cyclotron ground states contribute $2\ell^2$ to the relative squared radius. This same decomposition explains both the minimum guiding-center width and the constant to subtract from a full-position moment.

Exchange sends $(x,y)$ to $(-x,-y)$. To pass from the transported electron state to an effective coordinate wavefunction, first make the phase convention explicit. Write $\alpha=\theta/\pi$; for the Laughlin quasihole, $\alpha=1/m$. The calculation above gave a statistical Berry connection $\mathcal A_{\rm stat}=\alpha\,d\varphi$, where $\varphi=\arg\zeta$ and $\zeta=\eta_1-\eta_2$. The original normalized electron-state family is single-valued in these parameters. On a chosen angular branch, change its phase to

$$\begin{gathered}
|\widetilde\Psi(\zeta)\rangle=e^{i\alpha\varphi}|\Psi(\zeta)\rangle,\\
\widetilde{\mathcal A}_{\rm stat}
=\mathcal A_{\rm stat}-\alpha\,d\varphi=0.
\end{gathered}$$

The transformation law follows from $\mathcal A=i\langle\Psi|d\Psi\rangle$. It removes the statistical connection locally, leaving the electromagnetic contribution in place. The same statistics now appears in the frame's boundary condition: after an exchange, $|\widetilde\Psi(\varphi+\pi)\rangle=e^{i\pi\alpha}|\widetilde\Psi(\varphi)\rangle$. A coefficient representing a fixed physical state in this frame, or an overlap with its bra, carries the inverse phase. Thus the effective scalar wavefunction obeys

$$\begin{gathered}
\psi(r,\varphi+\pi)=e^{-i\pi\alpha}\psi(r,\varphi).
\end{gathered}$$

For positive quasihole charge in our into-page field, lowest-level coordinate orbitals in symmetric gauge are antiholomorphic, proportional to $(x_{\rm full}-iy_{\rm full})^j$ times a Gaussian. Their angular factor $e^{-ij\varphi}$ satisfies this boundary condition when $j=2n+\alpha$, $n=0,1,\ldots$. The statistics fixes the boundary condition; the charge and field fix the holomorphic or antiholomorphic form. Complex-conjugating the coordinate convention gives the positive boundary phase used in many pair-model papers, with unchanged physical content. With the stated electromagnetic gauge and statistical phase convention, the orbital generator $-i\hbar\partial_\varphi$ has eigenvalues $-j\hbar$; $j$ is the nonnegative radial index used below. Bosons retain even $j$ and fermions odd $j$; fractional statistics shift the sequence. The regular branch $j\geq0$ also specifies the model's short-distance behavior. These restrictions say which states are available, not which states a preparation occupies. The [microscopic-to-anyon mapping](https://arxiv.org/abs/cond-mat/9606214) makes the complex conjugation explicit.

### The localized pair is a superposition, not a separation eigenstate

The relative coordinate has magnetic length $\sqrt2\ell$. For the orbital wavefunctions, return temporarily to the commuting full relative position before projection and write $w=(x_{\rm full}-iy_{\rm full})/(2\ell)$. This scalar coordinate is distinct from the noncommuting guiding-center operators $x,y$ above. With measure $d^2w$ over one $2\pi$ angular interval and a branch chosen, normalized orbitals are

$$\begin{gathered}
\phi_{n,\alpha}(w)=\frac{w^j e^{-|w|^2/2}}{\sqrt{\pi\Gamma(j+1)}},\\
j=2n+\alpha.
\end{gathered}$$

The scalar product here uses $d^2w$; choosing the physical half-plane of unordered configurations changes only a common normalization. The gamma function enters through the radial integral, $\int_0^\infty t^j e^{-t}dt=\Gamma(j+1)$, with $t=|w|^2$. The branch of $w^j$ carries the exchange boundary condition.

Within this auxiliary point-particle model, the full position ket $|w_0\rangle$ exists before projection. Project it onto these orbitals:

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

For the distinguishable reference, prepare two independent guiding-center coherent packets centered at $(d/2,0)$ and $(-d/2,0)$. Each has $\operatorname{Var}X_i=\operatorname{Var}Y_i=\ell^2/2$. Independence gives $\operatorname{Var}x=\operatorname{Var}y=\ell^2$, while $\langle x\rangle=d$ and $\langle y\rangle=0$. Thus $\langle r^2\rangle_{\rm d}=d^2+2\ell^2=(s^2+2)\ell^2$. This reference fixes both the labels and the packet widths. Define the excess relative to it by

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

Define three generators by their action on this basis, with $\kappa=\alpha/2+1/4$:

$$\begin{gathered}
K_0|n,\alpha\rangle=(n+\kappa)|n,\alpha\rangle,\\
K_-|n,\alpha\rangle=\sqrt{n(n+2\kappa-1)}|n-1,\alpha\rangle,\\
K_+=K_-^\dagger.
\end{gathered}$$

They satisfy $[K_0,K_\pm]=\pm K_\pm$ and $[K_+,K_-]=-2K_0$. This is the $\mathfrak{su}(1,1)$ algebra; those commutators and matrix elements are all we need from its representation theory. They specify a model of exchange-preserving quadratic operations. An ordinary oscillator's single-step lowering operator is not an operator within a fractional-statistics sector, so replacing $K_-$ by an unqualified $a^2/2$ would conceal a real assumption.

A **generalized coherent state** here means precisely an eigenstate of this lowering operator, $K_-|\beta,\alpha\rangle=\beta|\beta,\alpha\rangle$. The recurrence between its coefficients gives

$$\begin{gathered}
|\beta,\alpha\rangle_{\rm coh}\\
=\mathcal N\sum_{n=0}^{\infty}
\frac{\beta^n}{\sqrt{n!\,\Gamma(n+\alpha+1/2)}}|n,\alpha\rangle.
\end{gathered}$$

Use the same incoming-axis label as before by taking real $\beta=u/2$. Its probabilities are proportional to $(u/2)^{2n}/[n!\Gamma(n+\alpha+1/2)]$. Compute $\chi=2\langle n\rangle+\alpha-u$ again, using these new weights. Bosonic and fermionic endpoints agree exactly with the previous preparation, but fractional statistics give different curves. The exchange boundary condition has not changed. The coefficients have.

<!-- FIGURE: pair -->

For numerical work the positive series is sufficient. In conventional special-function notation its result is

$$\chi_{\rm coh}(u,\alpha)
=u\frac{I_{\alpha+1/2}(u)}{I_{\alpha-1/2}(u)}-u+\alpha,$$

where $I_\mu(u)=\sum_{n\geq0}(u/2)^{2n+\mu}/[n!\Gamma(n+\mu+1)]$ is the modified Bessel function. The defining series explains where the function comes from: it is the normalization and its derivative, not a new physical postulate.

At large $u$, the coherent-state excess has the leading tail $\chi_{\rm coh}\sim\alpha(\alpha-1)/(2u)$ for $0<\alpha<1$; the localized-coordinate excess decays exponentially with a power prefactor. Thus the distinction survives beyond a small numerical correction at one separation.

For the ideal Laughlin trial family, its microscopic normalization already constrains the effective state. Put $\eta_{1,2}=\pm\zeta/2$ and $u=|\zeta|^2/(4\ell^2)$. Expanding $\prod_i(z_i^2-\zeta^2/4)\Psi_m$ in powers of $\zeta^2$ gives electron states with different total angular momenta, hence orthogonal states in a rotationally symmetric droplet. Absorbing fixed length factors into constants $A_n$, their norm and normalized weights are

$$\begin{gathered}
\mathcal Z_2(u)=\sum_{n=0}^{N}A_nu^{2n},\qquad
p_n=\frac{A_nu^{2n}}{\mathcal Z_2(u)},\\
\langle j\rangle=\alpha+u\partial_u\log\mathcal Z_2.
\end{gathered}$$

The last line uses the angular-basis identification $j=2n+\alpha$. For separated holes well inside a sufficiently large droplet, write the screened norm as $\mathcal Z_2=C e^u u^{-\alpha}[1+\varepsilon(u)]$. The leading terms cancel in $\chi=\langle j\rangle-u$, leaving $\chi=u\partial_u\log[1+\varepsilon(u)]$. The residual therefore tests the screening and edge corrections. Of the two preparations above, the projected-coordinate family has the rapidly decaying corrections consistent with short-range screening; the generalized coherent family has an algebraic correction. This motivates [Kjønsberg and Leinaas's approximate coordinate-state mapping](https://arxiv.org/abs/cond-mat/9606214). The full norm would determine every $A_n$; its screened asymptotic form does not. A specified pinning-and-release protocol still needs its own microscopic state and operator mapping.

<span id="let-a-saddle-amplify-the-difference"></span>

## Let a saddle amplify a correlation

A smooth saddle potential has one stable and one unstable direction of drift. For a single guiding center, write $X_s,Y_s$ with $[X_s,Y_s]=i\ell^2$ and choose its oriented energy as $H=-g(X_sY_s+Y_sX_s)/2$, where $g>0$ has units of energy per length squared. The Heisenberg equations give

$$\begin{gathered}
\dot X_s=-\lambda X_s,\qquad \dot Y_s=\lambda Y_s,\\
\lambda=\frac{g\ell^2}{\hbar}.
\end{gathered}$$

An incoming packet contracts along $X_s$ and expands along $Y_s$. A rotation of axes writes the same energy as the difference of two quadratic curvatures. The saddle resembles a beam splitter because incoming motion approaches its center along one direction and outgoing motion separates along the other. Quantum widths and tunneling determine the splitting; a classical trajectory alone cannot predict it.

For a pair, adopt the solvable algebraic model of the cited bulk-dynamics papers. Let

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

$Q_x$ and $Q_y$ represent the squared relative coordinates along the contracting and expanding directions. At the boson and fermion endpoints these generators reduce to the usual quadratic oscillator representation. For fractional statistics these are the algebraic model’s assigned quadratic observables. Even for effective point anyons, they differ from directly projecting the bare Cartesian squares. For example, multiplication by $w^2/2$ connects neighboring normalized orbitals with coefficient $\tfrac12\sqrt{(j+1)(j+2)}$, whereas $K_+$ has coefficient $\sqrt{(n+1)(n+\alpha+1/2)}$. The difference between the squares of these coefficients is $\alpha(\alpha-1)/4$; it vanishes only at the boson and fermion endpoints. The radial operator agrees, but the off-diagonal quadratics require a specified mapping. Thus matching this solvable Hamiltonian and its observables to a particular physical saddle is part of the effective description, already before returning to the microscopic electron fluid. [The anyon-coordinate construction](https://arxiv.org/abs/cond-mat/9606214) exhibits the required angular-momentum-dependent factors.

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

For a center-of-mass coherent packet centered at the saddle, the initial variance is $\langle Y^2\rangle=\ell^2/4$. The algebraic model then gives the assigned outgoing moment

$$\begin{aligned}
C_{\rm alg}(t)&=\langle Y^2(t)\rangle-\frac14\langle Q_y(t)\rangle\\
&=-\frac{\ell^2}{2}e^{2\tau}\chi_{\rm coh}(0).
\end{aligned}$$

If the assigned $Q_y$ is matched to the measured relative squared coordinate, this equals $\langle y_1y_2\rangle$, by $y_1y_2=Y^2-y^2/4$. That operator matching is required for a spatial measurement. A negative initial separation excess produces a positive assigned outgoing moment. The saddle amplifies a correlation already present in the prepared state. It does not change the exchange angle.

For the localized-coordinate preparation, one extra expectation value matters:

$$\begin{gathered}
\delta=\langle K_1\rangle_{\rm loc}-\frac u2,\\
\chi_{\rm loc}(t)=\chi_{\rm loc}(0)\cosh2\tau-2\delta\sinh2\tau,
\end{gathered}$$

$$\frac{C_{\rm alg,loc}(t)}{\ell^2}=e^{2\tau}\left[-\frac{\chi_{\rm loc}(0)}2+\delta\right].$$

The explicit sum used in the figure is

$$\delta=\frac u2\sum_{n=0}^\infty p_n
\left[\sqrt{1-\frac{\alpha(\alpha-1)}{(2n+\alpha+1)(2n+\alpha+2)}}-1\right].$$

It vanishes for bosons and fermions. Its origin can be seen directly from the bare projected quadratic $T_+=w^2/2$ and its Hermitian part $T_1=(T_++T_+^\dagger)/2$. The adjacent-coefficient recurrence of the projected-coordinate state gives $\langle T_1\rangle_{\rm loc}=u/2$ exactly. Thus $\delta=\langle K_1-T_1\rangle_{\rm loc}$ measures the operator-assignment difference in this state. It can decide the outgoing sign near a zero of $\chi$.

At large $u$ and $0<\alpha<1$, expanding the displayed sum gives $\delta\sim\alpha(1-\alpha)/(4u)$, which dominates the exponentially small $\chi_{\rm loc}$. Both preparations therefore share the leading outgoing tail

$$\frac{C_{\rm alg,loc}(t)}{\ell^2}
\sim\frac{C_{\rm alg,coh}(t)}{\ell^2}
\sim e^{2\tau}\frac{\alpha(1-\alpha)}{4u}.$$

They differ at subleading order and at finite separation. The figure starts at $\alpha=1/3$, $d/\ell=4$: at $\tau=0.6$, the assigned moments are $0.05515\ell^2$ and $0.06976\ell^2$ for the projected-coordinate and generalized coherent states. Using the bare projected quadratics would also change the Hamiltonian algebra; it cannot be implemented by simply deleting $\delta$ from this time evolution.

<!-- FIGURE: saddle -->

A detector needs a different calculation. An ideal measurement of whether both particles exit into the same half-plane asks for

$$P_{\rm same}=\left\langle\mathbf 1_{y_1y_2>0}\right\rangle,$$

where the indicator is the projector onto that region for a specified outgoing position measurement. A real detector has a finite spatial and time response instead. When interpreted as a spatial moment, $C_{\rm alg}$ weights every event by the product $y_1y_2$: a few widely separated events can outweigh many near the center. Its sign cannot determine $P_{\rm same}$. Connecting the algebraic model to clicks therefore requires matching its operators to the measured coordinates, as well as the outgoing state and a detector model, not merely naming the saddle a splitter.

The growing solution also has a physical stopping point. The potential must remain smooth over a packet and weak enough not to mix the retained levels with higher ones; eventually the expanding packet leaves the region where a quadratic saddle is an adequate approximation. Close encounters can bring quasihole cores and residual interactions into play. These conditions delimit the time interval over which the simple exponential evolution describes the proposed experiment.

A more general quadratic potential provides a useful extension. For one guiding center, $V=(aX_s^2+bY_s^2)/2$ gives $\ddot X_s=-(\ell^4ab/\hbar^2)X_s$. Curvatures of the same sign give oscillatory motion; opposite signs give exponential drift. The [2025 preprint by Basani, Subramanyan and Vishveshwara](https://arxiv.org/abs/2509.15488) develops such trap and saddle dynamics for the generalized coherent pair states. Its symmetry methods build on the same quadratic algebra. Changing a curvature can change stable motion into unstable motion; it does not interpolate the particle statistics.

## When a splitter has an interior

The pair calculation has made a reference indispensable: “more separated” meant more separated than a particular distinguishable preparation. A collider poses the same problem in another form. What should count as the result of two distinguishable particles in an apparatus with its own coherent paths?

For more background on what a channel carries, the optional [transport derivation of incoming flux and mean current](https://n-y-l.github.io/quantum-transport-notes/docs/notes.html#counting) supplies the connection to reservoirs. Return here for the two-particle calculation: a one-particle transmission probability alone does not give a coincidence probability.

<span id="point-splitter"></span>

Start with a pointlike balanced splitter and two identical incident packets, one in each input channel. A **channel** here is a propagating input or output mode. For a symmetric lossless splitter write its one-particle scattering matrix as

$$\begin{gathered}
S(k)=\begin{pmatrix}T(k)&R(k)\\R(k)&T(k)\end{pmatrix},\\
|T|^2+|R|^2=1,\\
TR^*+RT^*=0.
\end{gathered}$$

$T$ is the amplitude to remain in the original channel, $R$ to switch, and $k$ labels the incident wave number. At a point splitter these amplitudes can be approximately constant over the packet spectrum. If each input contains one particle, a coincidence—one particle in each output—has two indistinguishable alternatives: both remain or both switch. Symmetrizing adds their amplitudes for bosons; antisymmetrizing subtracts them for fermions. With identical simultaneous packets this gives

$$\begin{aligned}
P_{11}^{B}&=(|T|^2-|R|^2)^2,\\
P_{11}^{F}&=1.
\end{aligned}$$

At a balanced splitter, these are zero and one. The result assumes matching internal states and temporal packets; distinct spin states or delayed packets can remove the exchange interference. “Two particles arrived” is not enough to specify a collision.

A drain is an output reservoir in which particles are collected. An extended collider can keep a packet circulating before letting it out. In the model of [Samal, Vishveshwara, Gefen and Väyrynen](https://arxiv.org/abs/2412.19674), two channels couple through a loop around an **antidot**, a depleted region supporting a closed edge path. An **edge channel** is a low-energy mode propagating along the boundary of a Hall fluid. A particle may complete different numbers of loops before reaching a drain. These delayed alternatives interfere even when only one source is active. This is single-particle self-interference; no partner is required.

A smaller example of this one-particle interference is the [side-orbital calculation](https://n-y-l.github.io/quantum-transport-notes/docs/notes.html#side-orbital): a coherent excursion into a second orbital can cancel transmission completely. It is a different device, useful for seeing why a one-source reference must retain interference inside the apparatus. After that optional detour, resume with the packet calculation below.

<span id="collider-packets"></span>

Take channels with the same linear dispersion and outgoing spectral modes normalized by $\langle k|k^\prime\rangle=\delta(k-k^\prime)$. Use identical synchronized pure input packets with common spectral amplitude $\phi(k)$ and probability $p(k)=|\phi(k)|^2$, with $\int p(k)dk=1$, and the detectors count all outgoing times. Define

$$\begin{aligned}
a&=\int p(k)|T(k)|^2dk,\\
b&=1-a,\\
J&=\int p(k)T(k)R^*(k)dk.
\end{aligned}$$

Here $a$ and $b$ are probabilities measured with one source at a time. $J$ measures overlap between the transmitted and reflected packet amplitudes. Write the outgoing coincidence amplitude at wave numbers $k,k'$ as

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

The appropriate distinguishable-quantum-particle reference preserves everything the apparatus does to each individual packet:

$$\begin{aligned}
B_2&=P_{1\to1}P_{2\to2}+P_{1\to2}P_{2\to1}\\
&=a^2+b^2.
\end{aligned}$$

The arrow probabilities are obtained by activating the sources separately under the same device conditions. Subtract this reference and the remaining exchange contribution is

$$Q_{\rm irr}^{F/B}\equiv P_{11}^{F/B}-B_2=\pm2|J|^2.$$

The term “irreducible” here denotes that specific subtraction. For a dilute train of random emissions, extracting the analogous two-source coincidence from measured currents also requires subtracting correlations recorded with each source alone, to remove pairs emitted by the same source. The single-source mean currents then provide the four probabilities in $B_2$. This source subtraction and the subsequent $B_2$ comparison do different jobs.

For comparison, a different reference $B_1$ discards interference between the paths of each individual particle. Sum path probabilities instead of path amplitudes, obtaining $a_{\rm cl},b_{\rm cl}$, and set $B_1=a_{\rm cl}^2+b_{\rm cl}^2$. It removes single-particle coherence as well as exchange interference, so it need not agree with $B_2$. The figure gives an explicit case in which this changes the apparent sign.

For the displayed loop, $r$ is the real amplitude to remain on a local channel at either junction, $L$ the loop circumference, and $q=kL$. With the junction phase chosen as zero,

$$\begin{aligned}
T(q)&=\frac{r(1-e^{iq})}{1-r^2e^{iq}},\\
R(q)&=-\frac{(1-r^2)e^{iq/2}}{1-r^2e^{iq}}.
\end{aligned}$$

Expanding the denominator as a geometric series identifies successive windings. Squaring each winding separately gives $b_{\rm cl}=(1-r^2)/(1+r^2)$ and $a_{\rm cl}=2r^2/(1+r^2)$. Adding the amplitudes first gives the resonant $T,R$ used in $B_2$. The figure integrates over a uniform incident spectrum $0\leq q\leq L/\ell_p$, where $\ell_p$ sets the inverse spectral width. One edge of this window is fixed at the resonance $q=0$, where $T=0$; translating the window relative to the resonances would change the probabilities. Here $\ell_p$ is not an rms packet length: a perfectly sharp spectral window has long spatial tails.

<!-- FIGURE: collider -->

At $r=0.95$ and $\ell_p/L=2.5$, the calculated fermion coincidence is about $0.808$. It lies below $B_1\simeq0.903$ but above $B_2\simeq0.552$. Calling that first comparison “fermion bunching” does not mean that fermions changed statistics. The reference has included an extra change of physics. The calibrated exchange contribution remains positive, about $0.256$.

This is a boson/fermion theory of a noninteracting extended scatterer, published in 2026. It does **not** derive an anyon version by replacing a sign with $e^{i\theta}$. In an anyon device, even a process with only one active source may involve a tunneling excitation winding in spacetime around other excitations. That statistical contribution can enter the source-alone signal being subtracted. Extending the reference procedure while retaining the desired anyonic information is an open problem identified by the paper. The bulk-pair and collider calculations meet at a concrete issue: which parts of a measured correlation come from exchange, which from preparation, and which from propagation through the device?

## What an interferometer has actually measured

A different route keeps the phase itself in view. In a quantum Hall interferometer, two weak tunneling alternatives for an edge quasiparticle enclose a region of the fluid. Their relative amplitude produces an oscillatory contribution to the measured conductance—the change in mean current per small change in applied voltage—

$$\begin{gathered}
G_{\rm osc}\propto\cos\Theta,\\
\Theta=\frac{q_h\Phi}{\hbar}+N\frac{2\pi}{m}+\Theta_0.
\end{gathered}$$

$\Phi=B_zA=-B_0A$ is the signed flux for a counterclockwise relative path of area $A$, $N$ the number of enclosed quasiholes of the specified type relative to a reference, and $\Theta_0$ the other matched phase contributions. Reversing that path reverses both displayed phase contributions. The statistical term is a full encircling, not one exchange. Varying flux moves the fringes continuously; changing $N$ by one at fixed path adds $2\pi/m$.

[Nakamura and collaborators](https://www.nature.com/articles/s41567-020-1019-1) measured discrete shifts in the conductance interference pattern at filling $1/3$, with a reported braiding phase magnitude $(0.31\pm0.04)\,2\pi$, consistent with $2\pi/3$. That inference depends on interpreting each localized-charge transition as a change of one quasiparticle and constraining ordinary phase shifts in the device. It is evidence for Abelian encircling statistics, distinct from observing non-Abelian braid operations.

The same charge transition that changes $N$ can move the edge. At fixed magnetic field, an area change $\Delta A$ changes the flux and gives

$$\Delta\Theta=\frac{q_h B_z\Delta A}{\hbar}+\Delta N\frac{2\pi}{3}.$$

This is why electrostatics enters an experiment about topology. The device used screening layers to reduce coupling between charge in the interior and the edge; the authors also checked fringe and transition slopes, reproducibility, and residual coupling. The ideal braid phase is insensitive to smooth path deformations after electromagnetic contributions are removed. The measured conductance has no obligation to remove those contributions for us. [The author manuscript](https://arxiv.org/abs/2006.14115) presents the phase extraction and device controls.

## A calculation worth taking further

There is now a precise question behind “how do anyons move?” Start with two weak pins in a microscopic Laughlin droplet, choose their separation and release protocol, and project the resulting state onto the low-energy quasihole manifold. How accurately does the released state follow the projected-coordinate description motivated by the ideal trial family, and does the chosen protocol instead produce generalized coherent weights or another superposition? The state can first be tested through its radial weights. The physical saddle Hamiltonian and measured position operators must also be projected into the same manifold and compared with the assigned algebraic generators; matching the state alone does not match its dynamics or its readout. Only with that operator map can $\delta$ and the outgoing model moment be interpreted for the apparatus. The two preparations share a leading large-separation tail in the assigned saddle moment but differ at finite separation. State preparation and operator assignment must therefore be tested together.

A controlled study would keep cores and edges separated, track leakage out of the chosen manifold, and compare results as system size and the retained basis increase. It would then derive the actual detector observable from the outgoing state, using the same preparation in the distinguishable comparison. The point is not to find a curve that looks fractional. It is to establish which measured difference survives after the state and apparatus have been specified.

For extended colliders the corresponding unresolved step is the one-source reference: preserve the phase information carried by a single packet's paths while deciding which of those paths already encode anyonic braiding. The solvable boson/fermion calculation tells us why this separation is necessary. It does not do the anyon calculation in advance.

These questions lead directly into [the 2010 bulk-pair paper](https://arxiv.org/abs/0908.3945), [the 2019 dynamics treatment](https://arxiv.org/abs/1905.00442), [the 2025 quadratic-potential preprint](https://arxiv.org/abs/2509.15488), and [the 2026 collider paper](https://arxiv.org/abs/2412.19674). Each changes a definite ingredient of the calculation, rather than supplying another name for fractional statistics.

## When a phase is no longer enough

The Laughlin example gives one state for fixed, well-separated quasihole positions and specified overall excitation type, up to a phase. In other phases those same data can leave several nearly degenerate low-energy states. A measurement near one isolated excitation cannot distinguish them. Transport can act by a matrix on this collective space; different exchanges need not commute. This is the additional physical structure of **non-Abelian anyons**.

To label the states, ask what excitation type a pair presents to a probe surrounding both, or what type remains when they are brought together. This is its **fusion channel**. The type is often called a topological charge; it need not be an electric charge. In the Ising anyon model there are types $1$ (vacuum, meaning no nontrivial excitation), $\sigma$ and $\psi$ (a fermionic excitation), with

$$\sigma\times\sigma=1+\psi.$$

The plus sign lists allowed pair types, not equal probabilities. The other rules needed here are $\psi\times\psi=1$ and that vacuum acts as an identity, so $1\times1=1$ and $1\times\psi=\psi$. Four $\sigma$ excitations with total type $1$ therefore span two states: the first pair and the second pair can both have type $1$, or both type $\psi$. A mixed assignment has total type $\psi$ and is excluded. Call the two allowed states $|0\rangle,|1\rangle$. These are collective pair labels, not a spin attached to each excitation.

In a standard Ising convention, exchanging the first pair acts as $R=\operatorname{diag}(e^{-i\pi/8},e^{3i\pi/8})$. To exchange the middle pair, change to the basis in which that pair's type is definite, using

$$\begin{gathered}
F=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\\
B_1=R,\qquad B_2=F^{-1}RF.
\end{gathered}$$

The matrices are physical data of this model, not determined by the dimensions of the space alone. $F$ changes coordinates; $B_2$ physically transports excitations. Up to a common phase, $B_1$ and $B_2$ are quarter-turns about different Pauli axes, so their order matters. The [Ising figure](../experiments.html#braids) shows a measurement that distinguishes the resulting states; the [fusion-basis note](../fusion-basis.html) works through the analogous construction in the different Fibonacci model. [Nayak and collaborators](https://arxiv.org/abs/0707.1889) give the broader theory.

The distinction from the bulk pair above is structural: a scalar statistical phase has become an operation within an unresolved collective state space. It brings new questions about preparation and measurement, while leaving the same obligation to identify which microscopic states and which measured quantities the effective calculation describes.
