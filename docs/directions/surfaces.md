# Close the surface

<p class="reading-kicker">Direction 4 · Phase winding, magnetic flux and the sphere</p>

On a plane, a drawing can leave the compensating winding outside the picture. Close the surface into a sphere and there is no distant boundary. What does that require of the zeros of a wavefunction?

There are two answers worth comparing. A scalar condensate without gauge flux must have zero **total signed phase winding**. A charged particle in a positive-flux lowest Landau level has a wavefunction whose zeros all carry positive winding. The distinction lies in how the wavefunction is defined across the sphere.

<div class="try-this">

**Predict before changing the state.** Start with the vortex–antivortex pair. Follow the small loop around each zero: does the phase color cycle in the same direction? Rotate the view until a zero moves behind the sphere. Has its winding disappeared? Then choose the magnetic lowest Landau level with two flux quanta. Compare the signs, move zero 1, and switch gauge patches. Predict which changes affect the phase colors and which can change the physical zeros.

</div>

<!-- DIRECTION-FIGURE: surfaces -->

## A scalar phase must balance

First consider a thin, closed condensate shell described by one smooth complex scalar $\Psi=\sqrt n\,e^{i\chi}$. Assume isolated zeros and no gauge flux or internal texture that changes the scalar's patching. Around a small positively oriented loop enclosing zero $a$, define

$$w_a=\frac{1}{2\pi}\oint_a d\chi.$$

Single-valuedness makes $w_a$ an integer. Positive orientation is set by the **local outward normal**. The same circulation viewed from one laboratory direction can therefore have opposite signs at opposite poles.

Remove small disks around every zero. On the remaining surface, $d\chi$ is a globally defined closed one-form, even when no single-valued real function $\chi$ can be chosen. Stokes' theorem says the sum of its boundary integrals vanishes. Reversing the hole-boundary orientations to the small-loop convention gives

$$\sum_a w_a=0.$$

A vortex and an antivortex satisfy this condition. Moving them changes neither the sum nor the requirement to count the far side. They may annihilate if their cores meet, but topology does not determine the trajectory or the energy barrier. [Padavić, Sun, Lannert and Vishveshwara (2020)](https://arxiv.org/abs/2005.13030) study those additional dynamical and energetic questions for shell condensates, including stabilization by rotation.

The figure evaluates an explicit complex scalar with the chosen zeros. Color shows its phase, and darkening within each hue shows decreasing modulus, with square-root contrast for visibility. This shows the modulus relative to its sampled maximum, not probability density. The small loop integrates phase increments around the selected zero; its orientation uses the local outward normal. The plotted modulus is a chosen profile, not an equilibrium condensate solution.

## Magnetic flux changes how the wavefunction is patched

Now introduce a radial magnetic field with monopole flux, following [Haldane's spherical quantum Hall construction](https://doi.org/10.1103/PhysRevLett.51.605). Let $q$ be the particle charge and choose the orientation so that

$$N_\phi=\frac{q}{2\pi\hbar}\int_{S^2}\mathbf B\cdot d\mathbf S
=2Q\geq0$$

is an integer. Here $Q$ labels the monopole strength. This is a specified magnetic-flux model: an ordinary uniform laboratory field has zero net flux through a closed sphere.

A vector potential for nonzero monopole flux cannot be smooth everywhere in one gauge. Use northern and southern patches. Their wavefunctions represent the same physical state but differ on the overlap by a gauge phase; in our convention,

$$\Psi_S=e^{-iN_\phi\phi}\Psi_N,$$

where $\phi$ is longitude. Such patchwise complex amplitudes are a **section of a complex line bundle**. The bundle's Chern number is the flux integer $N_\phi$.

This changes the preceding argument. The phase derivative alone is no longer the same one-form in both patches; the gauge-invariant combination includes the vector potential. Applying Stokes' theorem with that connection gives a total signed zero index equal to $N_\phi$. A phase jump along a gauge seam is not another physical vortex. A true zero has vanishing amplitude in every regular gauge.

Switch patches in the figure: the color field changes while the modulus and physical zeros stay fixed. The × marks the pole excluded from the selected patch. The displayed magnetic states have nonzero modulus there, so its apparent phase winding is a gauge defect. The numerical winding around a physical zero is always evaluated in a patch regular near that zero.

## The lowest Landau level makes the count explicit

Use northern-patch spinor coordinates

$$u=\cos\frac\theta2,\qquad
v=e^{i\phi}\sin\frac\theta2,$$

with colatitude $\theta$. A nonzero one-particle lowest-Landau-level state is a homogeneous polynomial of degree $N_\phi$ in $u,v$. Factoring it gives

$$\Psi_N(u,v)=C\prod_{a=1}^{N_\phi}(u v_a-v u_a),$$

where $(u_a,v_a)$ identifies zero $a$ and $C$ normalizes the state. Each factor vanishes at that point. In a regular local complex coordinate it is linear, so a simple zero has winding $+1$. Coincident factors give a higher-order zero: multiplicity matters. There are exactly $N_\phi$ zeros over the whole sphere, including any at a chart's missing pole.

The positive signs use the chosen field and orientation. The lowest-Landau-level condition is essential to the unsigned count: a general smooth section can contain additional positive–negative pairs while retaining the same signed total.

Changing a zero's longitude selects a different polynomial at fixed flux. Changing the flux changes the degree and the allowed state space. Rotating the camera changes neither. For comparison, multiplying one linear factor by the complex conjugate of another cancels their gauge phases and constructs a scalar with the displayed positive–negative pair.

## Recover the Laughlin shift

For $N$ electrons, the spherical Laughlin polynomial is

$$\Psi_m=\prod_{i<j}(u_i v_j-u_j v_i)^m,$$

up to normalization, with odd $m$. Hold every electron coordinate except $i$ fixed. The polynomial has degree $m(N-1)$ in $(u_i,v_i)$: there are $N-1$ other electrons, each contributing an order-$m$ zero. Compatibility with the one-particle Landau level therefore requires

$$N_\phi=m(N-1)=\nu^{-1}N-\mathcal S,\qquad
\nu=\frac1m,\quad\mathcal S=m.$$

Here $\nu$ is the thermodynamic filling and $\mathcal S$ the **shift**, a finite-size offset in the flux–particle relation. It is not obtained by blindly setting $N_\phi=mN$. [Wen and Zee (1992)](https://doi.org/10.1103/PhysRevLett.69.953) connect this spherical counting to orbital-spin response and spatial curvature. A quasihole insertion adds one linear factor for every electron, increasing the required flux by one while leaving the electron number fixed.

## From a closed surface to a laboratory shell

The geometry is experimentally useful, but the two models should remain distinct. [Carollo and collaborators (2022)](https://www.nature.com/articles/s41586-022-04639-8) observed ultracold atomic bubbles in orbital microgravity, including partial shell coverings. [Jia and collaborators (2022)](https://arxiv.org/abs/2208.01360) created a shell condensate using two atomic species and studied its expansion and self-interference. Neither result alone supplies the monopole flux in Haldane's model.

<div class="takeaway">

**A question to carry forward:** open a small hole in the scalar shell. Repeat the winding argument while retaining the new boundary integral. Which step enforced zero total winding, and what can now pass through the boundary? Specify the field and its boundary conditions before importing a zero-counting rule from another system.

</div>

[Choose another direction](../directions.md) · [Take away a global orientation](orientation.md) · [Longer reading and talks](reading.md)
