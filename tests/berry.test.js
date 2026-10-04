/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../berry-physics.js');
const close = (a, b, tolerance = 2e-12) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const samePhasor = (a, b) => a.forEach((value, i) => close(value, b[i]));

test('North pole, equator and south pole have phases 0, pi and 0 modulo 2 pi', () => {
  for (const samples of [8, 16, 64, 256]) for (const direction of [-1, 1]) {
    for (const [beta, expected] of [[0, [1, 0]], [Math.PI / 2, [-1, 0]], [Math.PI, [1, 0]]]) {
      const result = P.latitude({ beta, direction, samples, gaugeStrength: 4 });
      samePhasor(result.sampledPhasor, expected);
      close(result.signedError, 0);
    }
  }
});
test('Sampled spinors agree with the independently evaluated latitude overlap polynomial', () => {
  for (const beta of [0.17, Math.PI / 3, 1.89, 2.97]) for (const direction of [-1, 1]) {
    for (const samples of [8, 16, 32, 128, 256]) {
      const c2 = Math.cos(beta / 2) ** 2, s2 = 1 - c2;
      const step = direction * 2 * Math.PI / samples;
      const angle = samples * Math.atan2(-s2 * Math.sin(step), c2 + s2 * Math.cos(step));
      const result = P.latitude({ beta, direction, samples, gaugeStrength: 3.8 });
      samePhasor(result.sampledPhasor, [Math.cos(angle), Math.sin(angle)]);
    }
  }
});
test('Local rephasing changes link phases and leaves their closed product unchanged', () => {
  for (const samples of [8, 32, 128, 256]) for (const gaugeStrength of [0.7, 3, 6]) {
    const base = P.latitude({ samples });
    const changed = P.latitude({ samples, gaugeStrength });
    samePhasor(base.sampledPhasor, changed.sampledPhasor);
    assert.ok(changed.links.some((link, j) => Math.abs(P.phaseDifference(link.phase, base.links[j].phase)) > 0.001));
    for (let j = 0; j < samples; j++) {
      const expected = base.links[j].phase + changed.gaugePhases[j] - changed.gaugePhases[(j + 1) % samples];
      close(P.phaseDifference(changed.links[j].phase, expected), 0);
    }
  }
  // Nonperiodic-looking, unrelated endpoint phases still cancel through the closing link.
  const states = [0, 0.7, 2.1, 4.8].map(phi => P.spinor(1.2, phi));
  const phases = [0.2, -2, 0.9, 2.8];
  const changed = [0, 0.7, 2.1, 4.8].map((phi, j) => P.spinor(1.2, phi, phases[j]));
  samePhasor(P.loop(states).phasor, P.loop(changed).phasor);
});
test('Reversing the circuit conjugates the product and reverses the signed solid angle', () => {
  for (const beta of [0.25, Math.PI / 3, 1.7, 2.7]) {
    const forward = P.latitude({ beta, gaugeStrength: 2.3 });
    const backward = P.latitude({ beta, direction: -1, gaugeStrength: 5 });
    samePhasor(backward.sampledPhasor, [forward.sampledPhasor[0], -forward.sampledPhasor[1]]);
    close(backward.solidAngle, -forward.solidAngle);
  }
});
test('A 60-degree cone converges to minus pi/2 with approximately quadratic discretization error', () => {
  const coarse = P.latitude({ samples: 8 }), medium = P.latitude({ samples: 32 }), fine = P.latitude({ samples: 128 });
  close(coarse.sampledPhase, -1.507836086164841);
  close(medium.sampledPhase, -1.5670022446914715);
  close(fine.sampledPhase, -1.570559732047843);
  close(fine.exactPhase, -Math.PI / 2);
  assert.ok(Math.abs(medium.signedError) < Math.abs(coarse.signedError) / 15);
  assert.ok(Math.abs(fine.signedError) < Math.abs(medium.signedError) / 15);
});
test('Circular error compares phases across the principal-argument branch cut', () => {
  close(P.phaseDifference(-Math.PI + 0.01, Math.PI - 0.02), 0.03);
  close(P.phaseDifference(Math.PI, -Math.PI), 0);
  close(P.phaseDifference(0, -2 * Math.PI), 0);
});
test('Malformed inputs and orthogonal neighboring states are rejected explicitly', () => {
  for (const options of [{ beta: NaN }, { beta: -0.01 }, { beta: Math.PI + 0.01 }, { direction: 0 },
    { samples: 1 }, { samples: 8.5 }, { samples: 4097 }, { gaugeStrength: Infinity }, { gaugeStrength: 7 }]) {
    assert.throws(() => P.latitude(options));
  }
  assert.throws(() => P.loop([[[1, 0], [0, 0]], [[0, 0], [1, 0]]]), /vanishing overlap/);
  assert.throws(() => P.latitude({ beta: Math.PI / 2, samples: 2 }), /vanishing overlap/);
  assert.throws(() => P.loop([[[2, 0], [0, 0]], [[1, 0], [0, 0]]]), /unit norm/);
  assert.throws(() => P.loop([[[NaN, 0], [0, 0]], [[1, 0], [0, 0]]]), /finite/);
  assert.throws(() => P.loop([[1, 0], [0, 1]]), /spinor/);
});
