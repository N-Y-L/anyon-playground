# Exchange rules in different settings

**How much richer can statistics become?** I first met anyons as pointlike excitations moving in a plane: their paths can wind around one another, and the state remembers. Now I can change the question in three ways—constrain the motion to a line, exchange extended loops, or let a braid act on several collective states.

My starting questions stay simple: **what moves, what motion is allowed, and what is forbidden?** After specifying those, I still need a quantum rule telling me how a motion acts on the state.

## A useful relation disappears in the plane

In the plane, exchanging twice in the same direction leaves a winding. For point particles free to move in ordinary three-dimensional space, that double exchange can be untangled. This geometric difference is what makes a general scalar exchange phase possible in two dimensions.

<details>
<summary>I want the braid relations</summary>

Let $b_i$ denote a counterclockwise exchange of neighbors $i$ and $i+1$. Planar braids obey

$$b_i b_{i+1}b_i=b_{i+1}b_i b_{i+1},\qquad
b_i b_j=b_j b_i\quad (|i-j|>1).$$

The first equality says that two different sequences of three exchanges can be continuously deformed into one another. The second concerns exchanges far apart. There is no requirement that $b_i^2=1$: two exchanges can leave a winding that cannot be undone without crossing a forbidden coincidence.

For identical point particles freely moving in ordinary three-dimensional space, the corresponding exchange classes reduce to permutations. Two successive exchanges can be undone, so the additional relation is $b_i^2=1$. A scalar unitary representation then gives $b_i=+1$ or $-1$, the familiar bosonic and fermionic alternatives.

The qualification “scalar” matters. A group and a representation are different pieces of the problem. The group describes motions; its representation describes how those motions act on the retained states.

</details>

## Collisions on a line

Two particles constrained to a line cannot pass around one another. If coincidence is forbidden, their order cannot change continuously. If they can meet, the collision rule becomes part of the model. The phrase “one-dimensional anyons” therefore calls for a definition before importing a planar braid picture.

One useful route is a lattice in which the phase acquired during a hop depends on how many particles occupy a site. [Kwan and collaborators](https://arxiv.org/abs/2306.01737) engineered this density-dependent phase with ultracold atoms and studied two-particle quantum walks. This gives a concrete physical meaning to a one-dimensional statistical parameter, without letting particles wind around one another in a plane.

<details>
<summary>I want the operator construction and hopping phase</summary>

A useful lattice construction starts with boson annihilation operators $b_j$ and occupation $n_j=b_j^\dagger b_j$, and defines a string operator

$$a_j=b_j\exp\!\left(i\theta\sum_{k<j}n_k\right).$$

For $j<k$, the bosonic commutation rules give $a_j a_k=e^{i\theta}a_k a_j$. Hopping transforms to

$$a_j^\dagger a_{j+1}=b_j^\dagger b_{j+1}e^{i\theta n_j}.$$

For this hop from $j+1$ to $j$, the phase depends on the destination's occupation before the hop.

**The operator order matters.** On a number state, the phase factor on the right acts first. Rearranging operators without their commutators changes the predicted phase. This check connects the abstract exchange rules to a hopping Hamiltonian with occupation-dependent matrix elements.

</details>

The on-site algebra in this model remains bosonic: even at statistical angle $\theta=\pi$, anticommutation between different sites does not impose the Pauli exclusion principle on a single site. I need the model's definition of statistics as well as its angle.

## Loops have motions that points do not

Three dimensions need not make every statistical process trivial. A loop excitation is extended: another loop can pass through its opening, and several loops can be linked.

[Wang and Levin](https://arxiv.org/abs/1403.7437) study a three-loop process in which two flux loops are braided while both remain linked to a third. The resulting phase can distinguish gauge theories that simpler braiding data do not distinguish. [Lin and Levin](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.92.035115) construct explicit lattice models demonstrating this distinction.

The third loop is part of the configuration being classified. Removing it changes the motion problem. Extended objects and linking constraints can therefore preserve information that the point-particle permutation argument never considered.

## An exchange can rotate a fusion state

For non-Abelian anyons, specifying the positions and types need not specify the state. Even with the total fusion outcome fixed, different intermediate fusion channels can span a collective state space. Braiding acts by unitary matrices on that space, and the order of two braids can matter.

In the Ising example in the [anyon notes](../notes.html#when-a-phase-is-no-longer-enough), an $R$ matrix exchanges a pair in a basis where that pair has a definite fusion channel. An $F$ matrix changes which pair I group first when labeling the collective state. Exchanging a different pair involves a basis change, the exchange, and the inverse basis change. The resulting matrix generally differs from the first exchange matrix.

These operations have to agree when different descriptions represent the same process. [Kitaev's mathematical treatment](https://arxiv.org/abs/cond-mat/0506438) develops those consistency conditions together with an explicit lattice model; the matrices are not freely adjustable choices.

<details>
<summary>I want the consistency conditions and a two-state example</summary>

Reassociating several fusions along different routes must give the same result—the pentagon condition. Reassociation and exchange must agree—the hexagon conditions.

The two Ising braid matrices $B_1$ and $B_2$ supplied in the notes give a concrete comparison: $B_1B_2|0\rangle$ and $B_2B_1|0\rangle$, with the rightmost operation acting first. Measuring in the original $|0\rangle,|1\rangle$ basis gives equal probabilities for both sequences. In the $|\pm\rangle=(|0\rangle\pm|1\rangle)/\sqrt2$ basis, the notes' convention gives $P_+=1$ for the first sequence and $P_+=1/2$ for the second. The observable difference between the two sequences depends on this preparation and readout.

</details>

## Assumptions in each setting

| New setting | What must be specified afresh? |
| --- | --- |
| Particles on a line | Collision rules and the operator or configuration-space definition of statistics |
| Loop excitations in three dimensions | Allowed deformations, linking constraints and the full braiding process |
| Non-Abelian anyons | Fusion space, basis changes, exchange matrices and measurement channel |

**The direction that interests me is how the space of possible motions becomes quantum information.** I can understand a useful example before learning a full classification. The central challenge is to connect an allowed motion to an operation on states and then to an observable consequence.
