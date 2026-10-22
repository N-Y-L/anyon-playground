# Questions to explore

After the [connected notes](notes.md), I have a few directions rather than a fixed project. What attracts me is the gap between a clean exchange rule and a real preparation or measurement. Each question below changes one ingredient and asks what survives.

## How much does a packet remember its preparation?

The exchange rule determines allowed states, but it does not choose their amplitudes. The two [localized-pair preparations](notes.md#replace-the-electron-fluid-by-two-effective-particles) already produce different fractional-statistics correlations. I would like to understand which features survive across preparations, and which encode how the excitations were localized or released.

[Vishveshwara and Cooper](https://arxiv.org/abs/0908.3945) and [Subramanyan and Vishveshwara](https://arxiv.org/abs/1905.00442) give concrete starting points. Their state families are useful examples, not interchangeable definitions of an anyon. [Kjønsberg and Leinaas](https://arxiv.org/abs/cond-mat/9606214) connects this issue to the microscopic quasihole description.

## Which observable tells me what I want to know?

A separation moment averages a power of the distance between particles. A coincidence probability counts joint detector events. A current correlation measures how currents fluctuate together. These observables weight an outgoing state differently. I want to understand what information each makes accessible, and which comparisons remain meaningful when the detector changes.

The [saddle](notes.md#let-a-saddle-amplify-a-correlation) makes this question visible. The [detector direction](directions/detectors.md) broadens it to edge transport. A useful calculation would have to specify its state and measured operator; I do not need to prescribe that calculation before deciding which physical question interests me.

## What should a reference preserve?

The [extended collider](notes.md#when-a-splitter-has-an-interior) shows why interference between paths available to one particle belongs in a comparison intended to isolate mutual exchange. Anyons make the question richer: some single-source histories can already carry braiding information. How should a reference retain the information I want while removing an unwanted contribution?

Interferometry poses a related problem. A charge transition can change both the statistical phase and the area enclosed by a path. The [Nakamura experiment](https://arxiv.org/abs/2006.14115) makes the link between topology and electrostatics concrete.

## What changes with geometry or a drive?

I can follow [seven directions](directions.md): saddle potentials, detectors, wire end states, closed surfaces, Möbius geometry, changes of Hamiltonian parameters in time, and other exchange settings. These are different models, so I first ask what moves, which paths or states are available, and what is measured. The connection to anyons may be direct, or it may be a shared question about topology and dynamics.

For another microscopic example, the [toric-code notebook](../experiments.html#toric) starts from a spin Hamiltonian and shows how moving one type of excitation around another produces a phase. Its [memory extension](../experiments.html#memory) asks how local defects can disappear while quantum information stored in global properties of the state changes. The [fusion-basis notebook](../fusion-basis.html) explores the collective states that remain when particle types and positions are fixed.

These are broad entry points, not claims that the open questions are new or that a project is already feasible. I can use the [paper shortlist](conversation.md) to begin a conversation, then choose the direction worth understanding more deeply.

<details>
<summary>Tools if a question eventually becomes a calculation</summary>

[QuTiP](https://github.com/qutip/qutip) provides quantum-state dynamics; [qecsim](https://github.com/qecsim/qecsim) and [Stim](https://github.com/quantumlib/Stim) address stabilizer-code and error-correction calculations. They solve different problems. None is needed to read or run this site, and none supplies the missing physical model by itself.

</details>
