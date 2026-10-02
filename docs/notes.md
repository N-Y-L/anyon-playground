# Five ideas behind the playground

[Open the playground](../index.html) · [Inspiration catalog](catalog.md) · [References](references.md)

## 1. A path can matter after the particles return

Imagine two identical particles confined to a plane. You move them without
letting them meet, then compare the final quantum state with the initial one.
An exchange can take one particle around either side of the other. A second
exchange in the same direction brings both back, but their paths have wound
around each other. Those paths cannot be continuously undone while avoiding a
collision in the plane.

A **braid** records such exchanges as the particles move through time.
For **Abelian anyons**, an exchange multiplies the state by a complex phase.
The exchange angle in this playground is $\theta$:

$$\text{exchange}: e^{i\theta},\qquad
\text{one full encircling}: e^{2i\theta}.$$

Positive exchange means counterclockwise here; the reverse motion gives the
inverse phase. Bosons have $\theta=0$ and fermions
have $\theta=\pi$. A fractional value such as $\pi/3$ is another allowed
exchange rule; it is not a fractional probability of being a fermion.
The orientation and the anyon species must be fixed when comparing signs.
The angle slider explores possible exchange rules; it does not describe tuning
one fixed material continuously from bosons to fermions.

In a material, an anyon is a **quasiparticle**: a localized collective excitation
that can move and interact as a particle. The microscopic electrons still obey
fermionic statistics. Two-dimensional motion permits anyonic exchange rules;
it does not make every two-dimensional material host anyons.

## 2. Make a phase visible by comparing paths

Multiplying an isolated state by an overall phase does not change its measurement
probabilities. Interference supplies a reference: one alternative passes around
an anyon, while the other does not. The phase difference can then change the
output probabilities.

Our ideal balanced interferometer uses

$$P_0=\frac{1+V\cos(\phi+2Nw\theta)}{2},\qquad P_1=1-P_0.$$

Here $N$ counts enclosed anyons of the same species as the moving probe,
$w$ is the signed integer number of windings, $\phi$ is an adjustable ordinary
relative phase, and $V$ is the visibility between zero and one.
For one positive winding, adding one enclosed anyon adds $2\theta$ to the
relative phase, moving the fringe toward smaller $\phi$.
At $V=0$, the output carries no phase information. This is a probability model,
not a conductance calculation: a real device also needs a model of charge,
area, tunnelling, and ordinary electromagnetic phases.

## 3. The order of exchanges can change more than a phase

**Non-Abelian anyons** have a space of states on which exchanges act as matrices.
Matrices for different exchanges need not commute. The Ising experiment uses
four anyons of type $\sigma$, with a fixed total charge equal to the vacuum.
Here **topological charge** means the type of excitation, not electric charge.

**Fusion** asks which total charge a group of anyons has when treated together.
The Ising rule $\sigma\times\sigma=1+\psi$ means that a pair can have vacuum
charge $1$ or charge $\psi$. The plus sign lists allowed channels; it does not
assign equal probabilities. The two basis states $|0\rangle$ and $|1\rangle$
label these outcomes for the first pair. The other pair must have the same
charge to keep the total vacuum.

The app's default input is the coherent superposition
$|+\rangle=(|0\rangle+|1\rangle)/\sqrt{2}$. Exchanging the first pair and then the
middle pair can give different fusion probabilities from doing those operations
in reverse. Starting in $|0\rangle$ illustrates another useful point: distinct
final states can still give identical probabilities for this particular
measurement. A measurement reveals only what it is sensitive to.

These are ideal Ising braid operations, not a simulation of a Majorana device
or a demonstration of a complete universal quantum computer.

<details>
<summary>The matrices and their order</summary>

For this choice of basis and phases, the positive exchanges are

$$\begin{gathered}
B_1=B_3=\begin{pmatrix}e^{-i\pi/8}&0\\0&e^{3i\pi/8}\end{pmatrix},\\[6pt]
F=\frac{1}{\sqrt{2}}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\\[6pt]
B_2=FB_1F.
\end{gathered}$$

$B_j$ exchanges the anyons at neighboring positions $j$ and $j+1$.
For a column state vector, “1 then 2” means $B_2B_1|+\rangle$.
It gives vacuum probability $1$; the reverse order gives $1/2$.
The inverse exchanges use the adjoint matrices. Different basis conventions
can change the matrix entries while preserving the physical predictions.
The phase convention and basis-change matrix follow the standard Ising model in
[Nayak et al., Sec. II.A.1 and Eq. (50)](https://arxiv.org/abs/0707.1889).

</details>

## 4. Count states with a fusion rule

Fibonacci anyons are a different model with two charge types, $1$ and $\tau$:

$$1\times\tau=\tau,\qquad \tau\times\tau=1+\tau.$$

Let $a_n$ and $b_n$ count fusion paths for $n$ identical $\tau$ anyons with total
charge $1$ and $\tau$, respectively. Adding one more anyon gives

$$a_{n+1}=b_n,\qquad b_{n+1}=a_n+b_n,\qquad (a_0,b_0)=(1,0).$$

For example, four $\tau$ anyons have two states when the total charge is fixed
to $1$, and three when it is fixed to $\tau$. The growth explains the name
“Fibonacci.” These numbers count basis states, not equally likely outcomes.
Fixing the total charge is part of defining the physical state space.

## 5. Two bosonic species can have nontrivial mutual statistics

The **toric code** is a lattice model with excitations called $e$ and $m$.
Each species has bosonic self-exchange statistics, but winding an $e$ once
around an $m$ multiplies the state by $-1$. A loop around $N_m$ such excitations
has factor $(-1)^{N_m}$: odd and even counts behave differently.
Repeating the winding $w$ times gives $(-1)^{N_m w}$.

This is **mutual braiding**, involving two different species. It need not be
inferred from either species' self-exchange angle. Moving an excitation across
the loop changes which charges it encloses; smoothly deforming a loop without
crossing a charge leaves its statistical factor unchanged. As before, detecting
the sign requires a comparison with a reference process.

The picture displays this exact loop rule for specified excitations. It does
not evolve the lattice spins or simulate an error-correction protocol.

## Keep one distinction in view

An exchange rule, an initial state, a path, and a measurement are separate
ingredients. The same anyon model can give different observations when the
preparation or apparatus changes. This is the bridge from the small experiments
here to the [research questions in the catalog](catalog.md).
