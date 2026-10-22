# Geometry without a global orientation

In the plane, “exchange counterclockwise” has a consistent meaning after choosing a normal. On a Möbius band, following a normal continuously around the band brings it back reversed. A quantum state with a preferred handedness must accommodate this reversal.

The obstruction appears before any Hamiltonian is chosen. It constrains the possible magnetic fields and the way local descriptions of a quantum state can join. Determining the resulting phase of matter still requires an electronic model.

## A normal after one circuit

An arrow kept perpendicular to the surface returns to the same point reversed after one circuit. Two circuits restore it.

<details>
<summary>Coordinate description of the band</summary>

The figure uses a convenient embedding in three-dimensional space. Lengths are measured in units of the centre circle's radius:

$$\begin{aligned}
\mathbf r(s,u)=\big(&[1+u\cos(s/2)]\cos s,\\
&[1+u\cos(s/2)]\sin s,\ u\sin(s/2)\big),
\end{aligned}$$

with $|u|\leq0.38$. The parameter $s$ runs around the band; $u$ runs across it. The edges of the coordinate rectangle are identified by

$$\mathbf r(s+2\pi,u)=\mathbf r(s,-u).$$

That minus sign is the twist. At the centre, $u=0$, one circuit returns to the same point. But the direction across the band has reversed.

</details>

For the figure, let $s$ be the angle traveled around the centre circle, increasing by $2\pi$ per circuit, and $\mathbf n$ the chosen unit normal. A fixed laboratory field $\mathbf B$ has magnitude $B_0$ and tilt $\beta$ from the laboratory $z$ axis. The surface colors indicate the sign of $\mathbf B\cdot\mathbf n$; the graph shows the dimensionless component $\mathbf B\cdot\mathbf n/B_0$. The solid contour marks where it vanishes. The camera angle around the band, called the view azimuth, changes only the drawing.

<!-- DIRECTION-FIGURE: orientation -->

At zero travel, the moving arrow agrees with the gray reference arrow. After **One circuit**, it is back at the starting point, pointing the other way; **Two circuits** restore it. Changing the view azimuth changes only the drawing; the normal and magnetic-field calculation stay the same.

<details>
<summary>Normal explicitly</summary>

Let $s$ be the angle followed around the centre circle, increasing by $2\pi$ per circuit. The tangent and across-band direction are perpendicular unit vectors. Their cross product gives the unit normal $\mathbf n(s)$:

$$\mathbf n(s)=\big(\cos s\sin(s/2),\ \sin s\sin(s/2),\ -\cos(s/2)\big).$$

The expression satisfies $|\mathbf n|=1$, and

$$\mathbf n(s+2\pi)=-\mathbf n(s),\qquad
\mathbf n(s+4\pi)=\mathbf n(s).$$

</details>

The arrow stays perpendicular throughout its journey. Its failure to return after one circuit shows why no continuous choice of unit normal exists on the whole band. This is **nonorientability**. There is no physical tear at the join; the coordinate description needs an orientation-reversing transition there.

These two circuits track an ordinary geometric vector. They do not calculate the phase acquired by a spin state or by exchanging particles. A Berry phase, the geometric phase of an adiabatically transported quantum state, also requires specifying that state and its transport.

## A fixed laboratory field

A laboratory magnetic field can exist perfectly well around the band. The obstruction concerns its **component perpendicular to the surface**. If that component were continuous and nonzero everywhere, it would itself choose a normal everywhere, contradicting the Möbius geometry. Somewhere it must vanish.

The solid zero contour in the figure marks places where the field is tangent. At the dashed coordinate cut, only the convention for the normal changes; a color change there need not mark a physical change.

<details>
<summary>Field projection and checks on the figure</summary>

A uniform ambient magnetic field of magnitude $B_0>0$, tilted by an angle $\beta$ from the laboratory $z$ axis, is

$$\mathbf B=B_0(\sin\beta,0,\cos\beta).$$

Let $s$ be the angle along the centre circle and $\mathbf n(s)$ the continuously followed unit normal. The field itself has no difficulty existing around a Möbius band. Its dimensionless signed component $b(s)$ along the normal is

$$\begin{aligned}
b(s)&=\frac{\mathbf B\cdot\mathbf n(s)}{B_0}\\
&=\sin\beta\cos s\sin(s/2)-\cos\beta\cos(s/2).
\end{aligned}$$

Changing the tilt moves the zeros, but $b(s+2\pi)=-b(s)$ remains true. If the value at the starting point is nonzero, its sign is opposite after one circuit. Continuity requires a zero between them. If the starting value is zero, the condition already holds.

At such a zero the field is tangent to the surface, or has zero magnitude in a more general field configuration. This argument applies to any continuous, single-valued ambient field evaluated along this loop: the field agrees at the returning point while the followed normal reverses. A continuous, everywhere nonzero perpendicular field would instead supply a global normal, contradicting the geometry.

The surface colors extend this calculation across the width. Using the position $\mathbf r(s,u)$ defined in the coordinate description, with $u$ the transverse coordinate, the local normal is the normalized cross product $\partial_s\mathbf r\times\partial_u\mathbf r$. Blue and red mark the two projection signs. At the dashed coordinate cut, the chosen normal reverses, so a color change there can come entirely from the convention. The solid zero contour marks places where the field is tangent. Moving the cut would change the sign convention without moving those places.

The graph uses the continuously followed arrow over two circuits. Its sign depends on that choice. The actual normal projection, $(\mathbf B\cdot\mathbf n)\mathbf n$, is independent of the arrow's sign and agrees after one circuit. Both the scalar factor and the normal reverse together. The rings mark every distinct zero on the centre circle; changing the tilt can create extra zeros in pairs. At the tilt where a pair first appears, the graph touches zero without crossing it there.

The endpoint tilts provide two useful checks. At $\beta=0$, a whole transverse line through $s=\pi$ has zero normal field. At $\beta=90^\circ$, the field is tangent all along the chosen cut, so a physical zero and a coordinate join coincide.

</details>

The field projection constrains an electronic model. Whether the model has a conducting channel along a zero contour depends on its quantum state, as the Hall examples below illustrate.

## What must a Hall state do at the join?

The [Laughlin calculation](../notes.html#make-a-hole-without-removing-an-electron) began with a plane and a fixed perpendicular field. Bending its drawing into a Möbius band does not preserve those assumptions.

The **Hall conductivity** relates a transverse electric current to an applied electric field. A **chiral** Hall phase has a handed response: reversing spatial orientation reverses the sign assigned to that conductivity. A homogeneous single chiral phase therefore cannot simply be identified with itself across the Möbius reflection while preserving its handedness. The local descriptions must join in a way that accounts for this reversal.

[Beugeling, Quelle and Morais Smith](https://arxiv.org/abs/1403.6998) examine this problem in lattice electron models. Their constructions include local Hall regions separated by **domain walls**, interfaces where the response changes. Conducting modes can run along those interfaces. A zero of the field in the figure identifies a geometric constraint; predicting a conducting mode there still requires the Hamiltonian, electron occupation and excitation gaps.

## Helical partners and the double cover

A **helical edge** has two modes propagating in opposite directions and related by time reversal. A **quantum spin Hall insulator** has a gapped interior and such boundary pairs. In the noninteracting models considered here, one pair remains gapless under small time-reversal-preserving perturbations. An orientation-reversing identification can exchange the partners rather than require one chiral mode to keep its handedness.

Beugeling and collaborators construct compatible models with intrinsic **spin-orbit coupling**, terms coupling electron spin to orbital motion. They use an **orientable double cover**, a surface with two points above each physical point, representing the two possible local orientations. Identifying those copies gives the Möbius model.

The two-circuit normal trace gives a picture of that cover. Labels defined relative to the local normal exchange after one circuit; this does not by itself rotate a physical spin or forbid choosing a fixed laboratory spin axis. The spin-dependent Hamiltonian supplies the physical rule. The two-dimensional shape alone does not guarantee a protected helical edge.

Nonorientability also allows suitable phases with anyonic excitations. [Chan, Teo and Ryu](https://arxiv.org/abs/1509.03920) construct such phases by specifying how a spatial reflection acts on the anyon types. Their “parity symmetry” means this reflection, distinct from the even or odd fermion-number parity in the wire notes.

The general question is what a reflection must exchange—propagating modes, spin labels or anyon types—and whether the quantum theory contains the required partners. [Beugeling and collaborators, §II](https://arxiv.org/html/1403.6998) distinguish the laboratory field, the chosen normal and the electronic state. The figure calculates the first two; the electronic model determines which states can occupy the band.
