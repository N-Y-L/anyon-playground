# Take away a global orientation

In the plane, “exchange counterclockwise” sounds unambiguous. Choose a normal pointing out of the page, and the right-hand rule fixes the direction. On a Möbius band, a small patch still has two possible normals. The surprise arrives when you try to carry that choice all the way around.

This route changes the surface before choosing a quantum Hamiltonian. The first calculation is geometry: follow a normal, return to the same point, and compare. It tells us which magnetic fields and boundary identifications a subsequent model must respect.

## Take the arrow for a walk

The figure uses a convenient embedding in three-dimensional space. Lengths are measured in units of the centre circle's radius:

$$\begin{aligned}
\mathbf r(s,u)=\big(&[1+u\cos(s/2)]\cos s,\\
&[1+u\cos(s/2)]\sin s,\ u\sin(s/2)\big),
\end{aligned}$$

with $|u|\leq0.38$. The parameter $s$ runs around the band; $u$ runs across it. The edges of the coordinate rectangle are identified by

$$\mathbf r(s+2\pi,u)=\mathbf r(s,-u).$$

That minus sign is the twist. At the centre, $u=0$, one circuit returns to the same point. But the direction across the band has reversed.

<!-- DIRECTION-FIGURE: orientation -->

First set the travel to zero and note the gray reference arrow. Then choose **One circuit**. The moving arrow is back at the starting point, pointing the other way. Choose **Two circuits** to restore it. Use the view azimuth to inspect the ribbon from another side. Changing the view changes only the drawing; the normal and magnetic-field calculation stay the same.

Along the centre circle, the tangent and across-band direction are perpendicular unit vectors. Their cross product gives the unit normal

$$\mathbf n(s)=\big(\cos s\sin(s/2),\ \sin s\sin(s/2),\ -\cos(s/2)\big).$$

Check the result directly: $|\mathbf n|=1$, and

$$\mathbf n(s+2\pi)=-\mathbf n(s),\qquad
\mathbf n(s+4\pi)=\mathbf n(s).$$

The arrow stays perpendicular throughout its journey. Its failure to return after one circuit shows why no continuous choice of unit normal exists on the whole band. This is **nonorientability**. There is no physical tear at the join; the coordinate description needs an orientation-reversing transition there.

These two circuits track an ordinary geometric vector. They do not derive the phase of a spinor, an exchange angle, or a Berry phase. Each of those requires a quantum state and a transport rule.

## Keep the field fixed in the laboratory

Now apply a uniform ambient magnetic field of magnitude $B_0>0$, tilted by an angle $\beta$ from the laboratory $z$ axis:

$$\mathbf B=B_0(\sin\beta,0,\cos\beta).$$

The field itself has no difficulty existing around a Möbius band. Its signed component along our moving normal is

$$\begin{aligned}
b(s)&=\frac{\mathbf B\cdot\mathbf n(s)}{B_0}\\
&=\sin\beta\cos s\sin(s/2)-\cos\beta\cos(s/2).
\end{aligned}$$

Move the tilt control and watch the graph. The locations of its zeros change, but $b(s+2\pi)=-b(s)$ remains true. If the value at the starting point is nonzero, its sign is opposite after one circuit. Continuity requires a zero between them. If the starting value is zero, we already have one.

At such a zero the field is tangent to the surface, or has zero magnitude in a more general field configuration. This argument applies to any continuous, single-valued ambient field evaluated along this loop: the field agrees at the returning point while the followed normal reverses. A continuous, everywhere nonzero perpendicular field would instead supply a global normal, contradicting the geometry.

The surface colors extend this calculation across the full width, using the normalized cross product $\partial_s\mathbf r\times\partial_u\mathbf r$. Blue and red mark the two signs relative to that local normal. At the dashed coordinate cut, the chosen normal reverses, so a color change there can come entirely from the convention. The solid zero contour marks something physical: places where the field is tangent. Moving the cut would change the sign convention without moving those places.

The graph uses the continuously followed arrow over two circuits. Its sign depends on that choice. The actual normal projection, $(\mathbf B\cdot\mathbf n)\mathbf n$, is independent of the arrow's sign and agrees after one circuit. Both the scalar factor and the normal reverse together. The rings mark every distinct zero on the centre circle; changing the tilt can create extra zeros in pairs. At the tilt where a pair first appears, the graph touches zero without crossing it there.

Try the endpoints of the tilt control. At $\beta=0$, a whole transverse line through $s=\pi$ has zero normal field. At $\beta=90^\circ$, the field is tangent all along the chosen cut, so a physical zero and a coordinate join coincide. Neither the colored surface nor its zero contour represents a quantum phase or a conducting channel.

## What must a Hall state do at the join?

The [Laughlin calculation](../notes.html#make-a-hole-without-removing-an-electron) began with a plane and a fixed perpendicular field. We cannot transplant that setup by bending its drawing and leaving all its assumptions intact.

A chiral Hall phase assigns a handedness to its response. In local coordinates, reflection reverses the sign assigned to the Hall conductivity. A homogeneous single chiral phase therefore cannot simply be identified with itself across the Möbius reflection while preserving that handedness. A concrete model must explain how its local descriptions meet.

[Beugeling, Quelle and Morais Smith](https://arxiv.org/abs/1403.6998) examine this problem using electronic band models. Their constructions distinguish local Hall regions and domain-wall channels from a uniform Hall state. A zero of the field in our figure locates a geometric obstruction; predicting conducting channels there still requires the electronic Hamiltonian, filling and gap structure.

## Two partners can be glued differently

A helical edge has counterpropagating partners related by time reversal. An orientation-reversing identification can exchange the partners rather than demand that one chiral branch keep its handedness. Beugeling and collaborators construct compatible quantum-spin-Hall models with intrinsic spin-orbit coupling, using an **orientable double cover**: retain both possible local orientations above each physical point, then specify their identification.

The two-circuit normal trace gives a picture of that cover. Labels defined relative to the local normal exchange after one circuit; this does not by itself rotate a physical spin or forbid choosing a fixed laboratory spin axis. The spin-dependent Hamiltonian supplies the physical rule. The two-dimensional shape alone does not guarantee a protected helical edge.

Nor does nonorientability exclude all topological order. [Chan, Teo and Ryu](https://arxiv.org/abs/1509.03920) construct topological phases on nonorientable surfaces by specifying how a parity symmetry acts on the anyons. That is the useful next step after the geometric exercise: identify what the reflection must exchange, and check that the proposed quantum theory supports that identification.

For a first reading, follow [Beugeling and collaborators, §II](https://arxiv.org/html/1403.6998) with the normal plot beside you. Separate three objects on your sketch: the laboratory field, the chosen local normal, and the electronic state. Only the first two have been calculated in this figure.
