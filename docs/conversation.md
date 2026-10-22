# Selected papers

These papers cover the microscopic origin of fractional statistics, evidence from interferometry and non-Abelian exchange. The final paper concerns the interpretation of collider measurements. The [main notes](notes.md) develop the physics used below.

<span id="1-arovas-schrieffer-and-wilczek-the-electron-state-knows-the-statistics"></span>

## Arovas, Schrieffer and Wilczek: fractional statistics from a wavefunction

D. Arovas, J. R. Schrieffer and F. Wilczek, **“Fractional Statistics and the Quantum Hall Effect” (1984)**. [Physical Review Letters 53, 722–723](https://doi.org/10.1103/PhysRevLett.53.722) · [Open copy](https://pitp.phas.ubc.ca/confs/7pines2009/readings/arovas_ASW_1984.pdf)

Arovas, Schrieffer and Wilczek started with an electronic wavefunction and calculated the charge and statistics of its quasiholes. A quasihole is a localized deficit of electron density. Its position enters the wavefunction as a parameter, so moving the hole means changing the state of the electrons. Moving it slowly enough for that state to follow gives a Berry phase. Subtracting the ordinary magnetic phase isolates the contribution from the other quasihole.

Planar topology tells us which exchange phases are possible; this calculation tells us which one the Laughlin state produces. The filling $\nu$ counts electrons per available orbital in one Landau level. At $\nu=1/3$, one exchange gives $\pi/3$ and a full encircling gives $2\pi/3$, with orientation fixed as in [the derivation](notes.md#exchange-the-quasiholes-transport-the-electron-state). The electrons themselves remain fermions. What has changed is the object being exchanged.

The paper is only two pages. Its central argument is the relation between quasihole transport and the Berry phase of the many-electron state. The screening assumption is essential: it allows local quasihole properties to be extracted from that state.

<span id="2-nakamura-and-colleagues-a-braid-shifts-a-fringe"></span>

## Nakamura and colleagues: braiding in an interference signal

J. Nakamura, S. Liang, G. C. Gardner and M. J. Manfra, **“Direct observation of anyonic braiding statistics” (2020)**. [Nature Physics 16, 931–936](https://doi.org/10.1038/s41567-020-1019-1) · [Author manuscript](https://arxiv.org/abs/2006.14115)

Nakamura and colleagues measured discrete shifts of conductance interference fringes at filling $\nu=1/3$. Conductance is the current response to an applied voltage. The observed phase changes were consistent with the $2\pi/3$ acquired when one Laughlin quasihole encircles another.

The difficulty is that an enclosed charge can also move the conducting boundary and change the area of the interference path. That changes the enclosed magnetic flux and hence the ordinary magnetic phase. Nearby conducting layers reduce this electrostatic response; their use, together with the experimental checks, supports the interpretation in terms of Abelian braiding. The [interferometer calculation](notes.md#what-an-interferometer-has-actually-measured) separates these contributions.

Figures 1 and 2 show the device, fringes and phase jumps. The important experimental question is how to distinguish a change in enclosed topological charge from a change in the path itself.

<span id="3-ivanov-the-exchange-has-room-to-rotate-a-state"></span>

## Ivanov: non-Abelian exchange of vortices

D. A. Ivanov, **“Non-Abelian Statistics of Half-Quantum Vortices in p-Wave Superconductors” (2001)**. [Physical Review Letters 86, 268–271](https://doi.org/10.1103/PhysRevLett.86.268) · [Author manuscript](https://arxiv.org/abs/cond-mat/0005069)

Ivanov derived exchange operators for vortices supporting Majorana zero modes. A vortex is a defect around which the phase of a superconducting pair amplitude winds. A Majorana zero mode is described by a fermionic operator equal to its Hermitian conjugate and commuting with the ideal low-energy Hamiltonian. Two such modes form one ordinary fermionic mode, which can be empty or occupied without changing the energy.

For four vortices, two fermionic modes give four occupation states. Fixing their total fermion parity—the evenness or oddness of the occupation sum—leaves two of them. Exchanges act on this space, and the operators for different pairs need not commute. Thus an exchange history can change the collective state even when all vortex positions return to their initial values.

Equations (8)–(10) and the four-vortex example give the construction; the [Ising example](notes.md#when-a-phase-is-no-longer-enough) works through a two-state version. The modes must remain well separated so their energy splitting is negligible. The braid operators are determined up to an overall phase. This is a theoretical mechanism, not a demonstration that a particular material realizes it.

## Samal and colleagues: statistics in an extended collider

S. S. Samal, S. Vishveshwara, Y. Gefen and J. I. Väyrynen, **“Quantum Statistics and Self-Interference in Extended Colliders” (2026)**. [Physical Review Letters 136, 076301](https://doi.org/10.1103/td98-5ltj) · [Author manuscript](https://arxiv.org/abs/2412.19674)

A collider sends two incident particles through a scattering region toward output detectors. If the region provides paths with different delays, even one particle can interfere with itself. A comparison that discards this interference can make fermions appear to bunch: the probability of finding one particle in each output falls below the reference.

Samal and colleagues construct the reference from measurements with one source running at a time. It retains one-particle interference and separates it from the contribution due to exchange between the incident particles. Figure 2 and [the collider calculation](notes.md#when-a-splitter-has-an-interior) show the distinction.

Their result concerns bosons and fermions. An anyonic extension remains open because single-source processes can already contain braiding. Which of those processes should a reference retain? This connects the paper to the broader problem of [inferring statistics from detector signals](directions/detectors.md).
