# Geometry without a global orientation

In the plane, “exchange counterclockwise” sounds unambiguous. A normal pointing out of the page fixes the direction through the right-hand rule. On a Möbius band, a small patch still has two possible normals, but following either choice around the band reverses it.

The geometry can be fixed before choosing a quantum Hamiltonian. The first calculation compares a normal with its direction after transport around the band. It constrains the magnetic fields and boundary identifications available to a subsequent model.

## A normal after one circuit

The figure uses a convenient embedding in three-dimensional space. Lengths are measured in units of the centre circle's radius:

$$\begin{aligned}
\mathbf r(s,u)=\big(&[1+u\cos(s/2)]\cos s,\\
&[1+u\cos(s/2)]\sin s,\ u\sin(s/2)\big),
\end{aligned}$$

with $|u|\leq0.38$. The parameter $s$ runs around the band; $u$ runs across it. The edges of the coordinate rectangle are identified by

$$\mathbf r(s+2\pi,u)=\mathbf r(s,-u).$$

That minus sign is the twist. At the centre, $u=0$, one circuit returns to the same point. But the direction across the band has reversed.

<!-- DIRECTION-FIGURE: orientation -->

At zero travel, the moving arrow agrees with the gray reference arrow. After **One circuit**, it is back at the starting point, pointing the other way; **Two circuits** restore it. Changing the view azimuth changes only the drawing; the normal and magnetic-field calculation stay the same.

Along the centre circle, the tangent and across-band direction are perpendicular unit vectors. Their cross product gives the unit normal

$$\mathbf n(s)=\big(\cos s\sin(s/2),\ \sin s\sin(s/2),\ -\cos(s/2)\big).$$

The expression satisfies $|\mathbf n|=1$, and

$$\mathbf n(s+2\pi)=-\mathbf n(s),\qquad
\mathbf n(s+4\pi)=\mathbf n(s).$$

The arrow stays perpendicular throughout its journey. Its failure to return after one circuit shows why no continuous choice of unit normal exists on the whole band. This is **nonorientability**. There is no physical tear at the join; the coordinate description needs an orientation-reversing transition there.

These two circuits track an ordinary geometric vector. They do not derive the phase of a spinor, an exchange angle, or a Berry phase. Each of those requires a quantum state and a transport rule.

## A fixed laboratory field

A uniform ambient magnetic field of magnitude $B_0>0$, tilted by an angle $\beta$ from the laboratory $z$ axis, is

$$\mathbf B=B_0(\sin\beta,0,\cos\beta).$$

The field itself has no difficulty existing around a Möbius band. Its signed component along the moving normal is

$$\begin{aligned}
b(s)&=\frac{\mathbf B\cdot\mathbf n(s)}{B_0}\\
&=\sin\beta\cos s\sin(s/2)-\cos\beta\cos(s/2).
\end{aligned}$$

Changing the tilt moves the zeros, but $b(s+2\pi)=-b(s)$ remains true. If the value at the starting point is nonzero, its sign is opposite after one circuit. Continuity requires a zero between them. If the starting value is zero, the condition already holds.

At such a zero the field is tangent to the surface, or has zero magnitude in a more general field configuration. This argument applies to any continuous, single-valued ambient field evaluated along this loop: the field agrees at the returning point while the followed normal reverses. A continuous, everywhere nonzero perpendicular field would instead supply a global normal, contradicting the geometry.

The surface colors extend this calculation across the full width, using the normalized cross product $\partial_s\mathbf r\times\partial_u\mathbf r$. Blue and red mark the two signs relative to that local normal. At the dashed coordinate cut, the chosen normal reverses, so a color change there can come entirely from the convention. The solid zero contour marks something physical: places where the field is tangent. Moving the cut would change the sign convention without moving those places.

The graph uses the continuously followed arrow over two circuits. Its sign depends on that choice. The actual normal projection, $(\mathbf B\cdot\mathbf n)\mathbf n$, is independent of the arrow's sign and agrees after one circuit. Both the scalar factor and the normal reverse together. The rings mark every distinct zero on the centre circle; changing the tilt can create extra zeros in pairs. At the tilt where a pair first appears, the graph touches zero without crossing it there.

The endpoint tilts provide two useful checks. At $\beta=0$, a whole transverse line through $s=\pi$ has zero normal field. At $\beta=90^\circ$, the field is tangent all along the chosen cut, so a physical zero and a coordinate join coincide. Neither the colored surface nor its zero contour represents a quantum phase or a conducting channel.

## What must a Hall state do at the join?

The [Laughlin calculation](../notes.html#make-a-hole-without-removing-an-electron) began with a plane and a fixed perpendicular field. Bending its drawing into a Möbius band does not preserve those assumptions.

A chiral Hall phase assigns a handedness to its response. In local coordinates, reflection reverses the sign assigned to the Hall conductivity. A homogeneous single chiral phase therefore cannot simply be identified with itself across the Möbius reflection while preserving that handedness. A concrete model must explain how its local descriptions meet.

[Beugeling, Quelle and Morais Smith](https://arxiv.org/abs/1403.6998) examine this problem using electronic band models. Their constructions distinguish local Hall regions and domain-wall channels from a uniform Hall state. A zero of the field in the figure locates a geometric obstruction; predicting conducting channels there still requires the electronic Hamiltonian, filling and gap structure.

## Helical partners and the double cover

A helical edge has counterpropagating partners related by time reversal. An orientation-reversing identification can exchange the partners rather than demand that one chiral branch keep its handedness. Beugeling and collaborators construct compatible quantum-spin-Hall models with intrinsic spin-orbit coupling, using an **orientable double cover**. This retains both possible local orientations above each physical point; their identification is part of the model.

The two-circuit normal trace gives a picture of that cover. Labels defined relative to the local normal exchange after one circuit; this does not by itself rotate a physical spin or forbid choosing a fixed laboratory spin axis. The spin-dependent Hamiltonian supplies the physical rule. The two-dimensional shape alone does not guarantee a protected helical edge.

Nor does nonorientability exclude all topological order. [Chan, Teo and Ryu](https://arxiv.org/abs/1509.03920) construct topological phases on nonorientable surfaces by specifying how a parity symmetry acts on the anyons. The question beyond the geometric calculation is what the reflection must exchange, and whether the proposed quantum theory supports that identification.

A useful distinction in [Beugeling and collaborators, §II](https://arxiv.org/html/1403.6998) is between three objects: the laboratory field, the chosen local normal, and the electronic state. Only the first two have been calculated in this figure.
