# Phase winding on a closed surface

I want to know what the shape of a surface requires of a quantum state before I solve for its energy or motion. Around a zero of a complex field, its phase can change by an integer multiple of $2\pi$; that integer is the **phase winding**. On a plane, I can leave other zeros outside my drawing. A sphere has no distant boundary, so I have to account for the whole surface.

I compare two models. The first is a **scalar Bose condensate**, a fluid with many bosons occupying one quantum state, described by a single complex field with no internal components. With no vector-potential coupling, its total signed winding is zero. The second is a charged particle in a radial magnetic field through the sphere. In its lowest Landau level, the zeros all have the same winding sign. The distinction lies in how local wavefunction descriptions fit together over the surface.

A **vortex** is a zero with nonzero phase winding; a vortex and an antivortex have opposite signs. The scalar example has one of each. I denote the complex field or one-particle wavefunction by $\Psi$; its modulus $|\Psi|$ is the amplitude shown by the shading. For the magnetic example, I measure flux in units $h/|q|$, where $q$ is the particle's charge and $h=2\pi\hbar$. The flux control selects the integer $N_\phi$, with the sign chosen to give positive winding. A **gauge patch** is a region with one smooth choice of vector potential and wavefunction phase. Changing patches changes the phase convention, while moving a zero changes the state.

<!-- DIRECTION-FIGURE: surfaces -->

## A scalar phase must balance

For the thin condensate shell, let $n$ be its surface number density and $\chi$ its phase, so $\Psi=\sqrt n\,e^{i\chi}$. I assume isolated zeros and a globally defined scalar field, with no gauge field or position-dependent internal state altering how its descriptions join. The integer winding $w_a$ around zero $a$ is

$$w_a=\frac{1}{2\pi}\oint_a d\chi.$$

Single-valuedness makes $w_a$ an integer. Positive orientation is set by the **local outward normal**. The same circulation viewed from one laboratory direction can therefore have opposite signs at opposite poles.

Removing small disks around every zero leaves a surface on which $d\chi$ is a globally defined closed one-form, even when no single-valued real function $\chi$ can be chosen. Stokes' theorem says the sum of its boundary integrals vanishes. Reversing the hole-boundary orientations to the small-loop convention gives

$$\sum_a w_a=0.$$

A vortex and an antivortex satisfy this condition. Moving them changes neither the sum nor the requirement to count the far side. They may annihilate if their cores meet, but topology does not determine the trajectory or the energy barrier. [Padavić, Sun, Lannert and Vishveshwara (2020)](https://arxiv.org/abs/2005.13030) study those additional dynamical and energetic questions for shell condensates, including stabilization by rotation.

The figure evaluates an explicit complex scalar with the chosen zeros. Color shows its phase, and darkening within each hue shows decreasing modulus, with square-root contrast for visibility. This shows the modulus relative to its sampled maximum, not probability density. The small loop integrates phase increments around the selected zero; its orientation uses the local outward normal. The plotted modulus is a chosen profile, not an equilibrium condensate solution.

## Magnetic flux changes how the wavefunction is patched

I now use [Haldane's spherical quantum Hall construction](https://doi.org/10.1103/PhysRevLett.51.605): a radial field with nonzero net flux, as if a magnetic monopole sat at the center. This is an idealized model; an ordinary uniform laboratory field has zero net flux through a closed sphere. I write $N_\phi=q\Phi/h\geq0$ for the integer signed flux, with $\Phi$ the outward flux. Nonzero $N_\phi$ requires overlapping gauge patches, and their phase relation changes the total winding count.

<details>
<summary>Flux integer and gauge-patch argument</summary>

For charge $q$ and magnetic field $\mathbf B$, integrate over the sphere $S^2$ with outward area element $d\mathbf S$. The dimensionless flux $N_\phi$ and monopole parameter $Q=N_\phi/2$ are

$$N_\phi=\frac{q}{2\pi\hbar}\int_{S^2}\mathbf B\cdot d\mathbf S
=2Q\geq0$$

with $N_\phi$ an integer, as required for consistent gauge transitions.

A vector potential for nonzero monopole flux cannot be smooth everywhere in one gauge. Let $\Psi_N,\Psi_S$ be descriptions of the same state on northern and southern patches, and let $\phi$ be longitude. In the convention here they satisfy

$$\Psi_S=e^{-iN_\phi\phi}\Psi_N,$$

Such patchwise complex amplitudes are called a **section of a complex line bundle**. The integer measuring the winding of its gauge transition, equivalently the total flux in these units, is its **first Chern number**, $N_\phi$.

The phase derivative alone is no longer the same one-form in both patches. If $\chi$ is the local phase and $\mathbf A$ the local vector potential, the combination $d\chi-(q/\hbar)\mathbf A\cdot d\mathbf r$ is gauge invariant. Applying Stokes' theorem after removing disks around the zeros gives $\sum_a w_a=q\Phi/h=N_\phi$. A phase jump at the boundary between gauge patches is not another physical vortex. A true zero has vanishing amplitude in every regular gauge.

</details>

Switching patches in the figure changes the phase colors while the modulus and physical zeros stay fixed. The × marks the pole excluded from the selected patch. The displayed magnetic states have nonzero modulus there, so the apparent winding at that pole is a singularity of the chosen phase convention. Winding around a physical zero is evaluated in a patch regular near that zero.

## The lowest Landau level makes the count explicit

For a nonzero state in the lowest Landau level, there are exactly $N_\phi$ zeros, counted with multiplicity. All have positive winding in the chosen convention. A general state outside that level may have extra positive–negative pairs while keeping the same signed total.

<details>
<summary>Zeros in the polynomial</summary>

Let $\theta$ be colatitude measured from the north pole and $\phi$ longitude. Northern-patch coordinates $u,v$ can be chosen as

$$u=\cos\frac\theta2,\qquad
v=e^{i\phi}\sin\frac\theta2,$$

The pair $(u,v)$ is often called a spinor coordinate; it labels position on the sphere, not an additional physical spin. A nonzero one-particle lowest-Landau-level state is a homogeneous polynomial of degree $N_\phi$, the flux integer, in these coordinates. Let $(u_a,v_a)$ identify zero $a$, and let $C$ normalize the state. Factoring the polynomial gives

$$\Psi_N(u,v)=C\prod_{a=1}^{N_\phi}(u v_a-v u_a),$$

Each factor vanishes at its specified point. In a regular local complex coordinate it is linear, so a simple zero has winding $+1$. Coincident factors give a higher-order zero: multiplicity matters. There are exactly $N_\phi$ zeros over the whole sphere, including any at a chart's missing pole.

The positive signs use the chosen field and orientation. The lowest-Landau-level condition is essential to the unsigned count: a general smooth section can contain additional positive–negative pairs while retaining the same signed total.

Changing a zero's longitude selects a different polynomial at fixed flux. Changing the flux changes the degree and the allowed state space. Rotating the camera changes neither. For comparison, multiplying one linear factor by the complex conjugate of another cancels their gauge phases and constructs a scalar with the displayed positive–negative pair.

</details>

## The Laughlin shift

Geometry also changes the relation between electron number and magnetic flux. On the sphere, the Laughlin state needs slightly fewer flux quanta than the large-system filling alone would suggest. The offset is called the **shift**. It connects simple zero counting to the response of quantum Hall matter to curvature.

<details>
<summary>Counting that gives the shift</summary>

For electron $i$ at colatitude $\theta_i$ and longitude $\phi_i$, set $u_i=\cos(\theta_i/2)$ and $v_i=e^{i\phi_i}\sin(\theta_i/2)$. For $N$ electrons and odd positive integer $m$, the spherical Laughlin polynomial is

$$\Psi_m=\prod_{i<j}(u_i v_j-u_j v_i)^m,$$

up to normalization. With every electron coordinate except $i$ fixed, its degree in $(u_i,v_i)$ is $m(N-1)$: there are $N-1$ other electrons, each contributing an order-$m$ zero. A one-particle lowest-level polynomial must have degree $N_\phi$, the signed flux integer. Writing $\nu$ for the large-system filling and $\mathcal S$ for the finite offset called the shift gives

$$N_\phi=m(N-1)=\nu^{-1}N-\mathcal S,\qquad
\nu=\frac1m,\quad\mathcal S=m.$$

Setting $N_\phi=mN$ would miss this offset. [Wen and Zee (1992)](https://doi.org/10.1103/PhysRevLett.69.953) connect it to the response of the Hall fluid's density to spatial curvature. A quasihole insertion adds one linear factor for every electron, increasing the required flux by one while leaving the electron number fixed.

</details>

## From a closed surface to a laboratory shell

The geometry is experimentally useful, but the two models should remain distinct. [Carollo and collaborators (2022)](https://www.nature.com/articles/s41586-022-04639-8) observed ultracold atomic bubbles in orbital microgravity, including partial shell coverings. [Jia and collaborators (2022)](https://arxiv.org/abs/2208.01360) created a shell condensate using two atomic species and studied its expansion and self-interference. Neither result alone supplies the monopole flux in Haldane's model.

Geometry can organize defects and constrain quantum fluids before their detailed dynamics is known. I want to understand how those constraints meet energetics, rotation and experimental control. Opening a hole in the shell is a useful thought experiment: the boundary gives phase winding somewhere to go, changing the closed-surface argument.

[Directions](../directions.md) · [Geometry without a global orientation](orientation.md) · [Longer reading and talks](reading.md)
