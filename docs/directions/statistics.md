# Exchange rules in different settings

For Abelian anyons moving in a plane, paths can wind around one another and multiply the state by a phase determined by that winding. Three changes lead to different statistical problems: motion constrained to a line, extended loop excitations in three dimensions, and exchanges acting on several collective states.

Each problem begins by specifying what moves, which motions are allowed and which configurations are excluded. The **configuration space** is the set of allowed arrangements. Paths through it describe motions; a quantum representation specifies how those motions act on states.

## A useful relation disappears in the plane

For noncoincident point particles in the plane, exchanging twice in the same direction leaves a winding. For point particles free to move in ordinary three-dimensional space, that double exchange can be untangled. This permits a general **scalar exchange phase** in two dimensions: exchange acts by multiplication by a complex number of unit modulus.

<details>
<summary>Braid relations</summary>

Choose reference positions along a line in the plane, and let $b_i$ denote a counterclockwise exchange of particles at adjacent reference positions $i,i+1$. They remain in the plane during the motion. The resulting braids obey

$$b_i b_{i+1}b_i=b_{i+1}b_i b_{i+1},\qquad
b_i b_j=b_j b_i\quad (|i-j|>1).$$

The first equality says that two different sequences of three exchanges can be continuously deformed into one another. The second concerns exchanges far apart. There is no requirement that $b_i^2=1$: two exchanges can leave a winding that cannot be undone without crossing a forbidden coincidence.

For identical point particles freely moving in ordinary three-dimensional space, the corresponding exchange classes reduce to permutations. Two successive exchanges can be undone, so the additional relation is $b_i^2=1$, where $1$ denotes the trivial motion. Its scalar quantum representation gives exchange factor $+1$ or $-1$, the familiar bosonic and fermionic alternatives.

The qualification “scalar” matters. A group and a representation are different pieces of the problem. The group describes motions; its representation describes how those motions act on the retained states.

</details>

## Collisions on a line

Two particles constrained to a line cannot pass around one another. If coincidence is forbidden, their order cannot change continuously. If they can meet, the collision rule becomes part of the model. The phrase “one-dimensional anyons” therefore calls for a definition before importing a planar braid picture.

One useful route is a lattice in which the phase acquired during a hop depends on how many particles occupy a site. [Kwan and collaborators](https://arxiv.org/abs/2306.01737) engineered this density-dependent phase with ultracold atoms. They studied two-particle **quantum walks**, the coherent spreading caused by hopping between sites. A controllable angle $\theta$ in the hopping phase gives the statistical parameter in this one-dimensional model.

<details>
<summary>Operator construction and hopping phase</summary>

Let $b_j$ annihilate a boson at site $j$ and let $n_j=b_j^\dagger b_j$ count its occupation. Here $b_j$ is an annihilation operator, unrelated to the braid generator used earlier. Define a new annihilation operator $a_j$ by attaching a phase depending on the total occupation to its left:

$$a_j=b_j\exp\!\left(i\theta\sum_{k<j}n_k\right).$$

For $j<k$, the bosonic commutation rules give $a_j a_k=e^{i\theta}a_k a_j$. Hopping transforms to

$$a_j^\dagger a_{j+1}=b_j^\dagger b_{j+1}e^{i\theta n_j}.$$

For this hop from $j+1$ to $j$, the phase depends on the destination's occupation before the hop.

On a number state, the phase factor on the right acts first. Rearranging operators without their commutators changes the predicted phase. The operator order thus connects the exchange rules to the occupation-dependent matrix elements of a hopping Hamiltonian.

</details>

The on-site algebra in this model remains bosonic: even at statistical angle $\theta=\pi$, anticommutation between different sites does not impose the Pauli exclusion principle on a single site. The angle specifies only part of the statistical rule.

## Loops have motions that points do not

Three dimensions need not make every statistical process trivial. A **loop excitation** is an excitation concentrated along a closed curve, rather than near one point. Another loop can pass through its opening without the curves intersecting, and several loops can remain linked during a motion.

[Wang and Levin](https://arxiv.org/abs/1403.7437) study loops carrying an emergent gauge flux: a point excitation transported around such a loop can acquire a phase, analogous to motion around magnetic flux. They braid two flux loops while both remain linked to a third. The resulting phase distinguishes models whose simpler braiding data agree. [Lin and Levin](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.92.035115) construct explicit lattice models demonstrating this distinction.

The third loop is part of the configuration being classified. Removing it changes the motion problem. Extended objects and linking constraints can therefore preserve information that the point-particle permutation argument never considered.

## An exchange can rotate a fusion state

For **non-Abelian anyons**, specifying positions and excitation types can leave several collective states. A **fusion channel** labels the combined excitation type of a pair, as seen by a probe enclosing it or when the pair is brought together. Even with the total type fixed, different intermediate pair channels can span a state space. Braiding acts by unitary matrices on that space, and the order of two braids can matter.

In the Ising example in the [anyon notes](../notes.html#when-a-phase-is-no-longer-enough), an $R$ matrix exchanges a pair in a basis where that pair has a definite fusion channel. An $F$ matrix changes which pair is grouped first when labeling the collective state. Exchanging a different pair involves a basis change, the exchange, and the inverse basis change. The resulting matrix generally differs from the first exchange matrix.

These operations have to agree when different descriptions represent the same process. [Kitaev's mathematical treatment](https://arxiv.org/abs/cond-mat/0506438) develops those consistency conditions together with an explicit lattice model; the matrices are not freely adjustable choices.

<details>
<summary>Consistency conditions and a two-state example</summary>

The **pentagon condition** requires different sequences of regrouping fusions to give the same basis transformation. The **hexagon conditions** require regrouping and exchange to give consistent descriptions of the same motion.

For the example, take four Ising anyons of type $\sigma$ with total vacuum type $1$. The fusion rule $\sigma\times\sigma=1+\psi$ allows each pair to have vacuum type $1$ or fermionic type $\psi$. Let $|0\rangle$ label the state where the first and second pairs both have type $1$, and $|1\rangle$ where both have type $\psi$. In the convention of the main notes,

$$R=\operatorname{diag}(e^{-i\pi/8},e^{3i\pi/8}),\qquad
F=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}.$$

Exchanging the first pair acts as $B_1=R$; exchanging the middle pair acts as $B_2=F^{-1}RF$.

Starting from $|0\rangle$, compare $B_1B_2|0\rangle$ with $B_2B_1|0\rangle$, with the rightmost operation acting first. Measuring in the original $|0\rangle,|1\rangle$ basis gives equal probabilities for both sequences. In the basis $|\pm\rangle=(|0\rangle\pm|1\rangle)/\sqrt2$, let $P_+$ denote the probability of the $|+\rangle$ outcome. It is $1$ for the first sequence and $1/2$ for the second. The observable distinction depends on both the preparation and the measurement.

</details>

## Assumptions in each setting

| New setting | What must be specified afresh? |
| --- | --- |
| Particles on a line | Collision rules and the operator or configuration-space definition of statistics |
| Loop excitations in three dimensions | Allowed deformations, linking constraints and the full braiding process |
| Non-Abelian anyons | Fusion space, basis changes, exchange matrices and measurement channel |

Statistics depends both on the allowed motions and on their action on quantum states. New settings raise two linked questions: which exchanges remain distinct under continuous deformation, and which measurements distinguish their actions? The line, loop and fusion examples change different parts of that problem.
