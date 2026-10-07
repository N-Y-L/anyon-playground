/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../directions-surfaces.js');
const close = (a, b, tolerance = 2e-11) => assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`);
const multiply = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// Measure phase increments around a positively oriented small spherical loop.
function winding(amplitude, zero) {
  const n = zero.vector, axis = Math.abs(n[2]) < 0.8 ? [0, 0, 1] : [1, 0, 0];
  const raw = cross(axis, n), norm = Math.hypot(...raw), a = raw.map(x => x / norm), b = cross(n, a);
  const radius = 0.025, phases = [];
  for (let j = 0; j <= 256; j++) {
    const angle = 2 * Math.PI * j / 256;
    const point = n.map((x, k) => Math.cos(radius) * x + Math.sin(radius) * (Math.cos(angle) * a[k] + Math.sin(angle) * b[k]));
    const value = amplitude(Math.acos(Math.max(-1, Math.min(1, point[2]))), Math.atan2(point[1], point[0]));
    phases.push(Math.atan2(value[1], value[0]));
  }
  let sum = 0;
  for (let j = 1; j < phases.length; j++) {
    const difference = phases[j] - phases[j - 1];
    sum += Math.atan2(Math.sin(difference), Math.cos(difference));
  }
  return sum / (2 * Math.PI);
}

test('Actual scalar functions have opposite local windings, including antipodal poles', () => {
  for (const separation of [20, 95, 180]) {
    const s = S.state({ separation });
    for (const zero of s.zeros) {
      const amplitude = (theta, phi) => S.scalarAmplitude(theta, phi, s.zeros, zero.vector[2] < -0.8 ? 'south' : 'north');
      close(winding(amplitude, zero), zero.winding);
      close(Math.hypot(...amplitude(zero.theta, zero.phi)), 0);
    }
    close(s.signedTotal, 0);
  }
});

test('LLL polynomial factors produce positive winding and preserve flux count', () => {
  for (const flux of [0, 1, 2, 5, 8]) {
    const s = S.state({ mode: 'magnetic', flux, zeroLongitude: 215 });
    assert.equal(s.zeros.length, flux);
    assert.equal(s.signedTotal, flux);
    for (const zero of s.zeros) {
      const amplitude = (theta, phi) => S.magneticAmplitude(theta, phi, s.zeros, zero.vector[2] < -0.8 ? 'south' : 'north');
      close(winding(amplitude, zero), 1);
      close(Math.hypot(...amplitude(zero.theta, zero.phi)), 0);
    }
  }
});

test('Gauge patches change an LLL section phase but leave a scalar and both moduli invariant', () => {
  const theta = 1.1, phi = 0.83;
  const pair = S.state().zeros;
  const scalarN = S.scalarAmplitude(theta, phi, pair, 'north');
  const scalarS = S.scalarAmplitude(theta, phi, pair, 'south');
  close(scalarN[0], scalarS[0]); close(scalarN[1], scalarS[1]);
  for (const flux of [1, 3, 8]) {
    const zeros = S.state({ mode: 'magnetic', flux }).zeros;
    const north = S.magneticAmplitude(theta, phi, zeros, 'north');
    const south = S.magneticAmplitude(theta, phi, zeros, 'south');
    const expected = multiply([Math.cos(-flux * phi), Math.sin(-flux * phi)], north);
    close(south[0], expected[0]); close(south[1], expected[1]);
    close(Math.hypot(...north), Math.hypot(...south));
  }
});

test('Rotating the view preserves all zeros, norms, and the whole-sphere ledger', () => {
  for (const mode of ['scalar', 'magnetic']) for (const yaw of [0, 65, 180, 285, 360]) {
    const s = S.state({ mode, yaw, flux: 7 });
    assert.equal(s.front + s.back, s.zeros.length);
    assert.equal(s.signedTotal, mode === 'scalar' ? 0 : 7);
    for (const zero of s.zeros) {
      close(Math.hypot(...zero.vector), 1);
      close(Math.hypot(zero.projected.x, zero.projected.y, zero.projected.depth), 1);
    }
    assert.doesNotMatch(S.globeSVG(s), /NaN|Infinity|undefined/);
  }
});

test('Noninteger flux and invalid configurations cannot create plausible diagrams', () => {
  for (const values of [{ flux: 1.5 }, { flux: -1 }, { mode: 'unknown' }, { separation: 0 }, { yaw: NaN }, { showBack: 'yes' }]) {
    assert.throws(() => S.state(values), RangeError);
  }
});

test('Displayed winding loops resolve each physical zero, including both scalar poles', () => {
  for (const separation of [20, 120, 180]) for (const selectedZero of [1, 2]) {
    const s = S.state({ separation, selectedZero });
    const loop = S.windingLoop(s);
    close(loop.winding, s.zeros[selectedZero - 1].winding);
    assert.ok(loop.minimumModulus > 0);
    for (const point of loop.points) close(Math.hypot(...point), 1);
  }
  for (const flux of [1, 4, 8]) for (let selectedZero = 1; selectedZero <= flux; selectedZero++) {
    const s = S.state({ mode: 'magnetic', flux, selectedZero, patch: 'south' });
    close(S.windingLoop(s).winding, 1);
  }
  assert.equal(S.windingLoop(S.state({ mode: 'magnetic', flux: 0, selectedZero: 8 })), null);
});

test('Display normalization is independent of camera and gauge; gauge poles are not zeros', () => {
  for (const flux of [1, 4, 8]) {
    const s = S.state({ mode: 'magnetic', flux });
    const changed = S.state({ mode: 'magnetic', flux, patch: 'south', yaw: 230 });
    close(S.sampledMaximum(s), S.sampledMaximum(changed));
    for (const theta of [0, Math.PI]) assert.ok(S.fieldAt(s, theta, 0).modulus > 0);
    for (const [theta, phi] of [[0.3, 2.1], [1.5, -0.4], [2.8, 1]]) {
      close(S.fieldAt(s, theta, phi).modulus, S.fieldAt(changed, theta, phi).modulus);
    }
  }
  close(S.sampledMaximum(S.state({ mode: 'magnetic', flux: 0 })), 1);
  assert.equal(S.phaseColor(0), S.phaseColor(2 * Math.PI));
});
