/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const wires = require('../directions-wires.js');

const close = (actual, expected, tolerance = 2e-12) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

// Independent finite-matrix calculation, including row swaps at vanishing pivots.
function determinant(sites, delta, mu) {
  const matrix = Array.from({length: sites}, (_, row) => Array.from({length: sites}, (_, col) =>
    row === col ? -mu : col === row + 1 ? -(1 - delta) : row === col + 1 ? -(1 + delta) : 0));
  let result = 1;
  for (let col = 0; col < sites; col++) {
    let pivot = col;
    for (let row = col + 1; row < sites; row++) if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    if (Math.abs(matrix[pivot][col]) < 1e-14) return 0;
    if (pivot !== col) { [matrix[pivot], matrix[col]] = [matrix[col], matrix[pivot]]; result *= -1; }
    result *= matrix[col][col];
    for (let row = col + 1; row < sites; row++) {
      const factor = matrix[row][col] / matrix[col][col];
      for (let k = col + 1; k < sites; k++) matrix[row][k] -= factor * matrix[col][k];
    }
  }
  return result;
}

test('profile is normalized and its finite Majorana-matrix residual is confined to the far end', () => {
  for (const mu of [-2.4, -1.9, -0.6, 0, 0.9, 2, 2.4]) for (const delta of [0.05, 0.2, 0.7, 0.95]) {
    const s = wires.state({sites: 31, delta, mu});
    close(s.profile.reduce((sum, value) => sum + value * value, 0), 1);
    for (let j = 0; j < s.sites; j++) {
      const result = -mu * s.profile[j] - (1 - delta) * (s.profile[j - 1] || 0) - (1 + delta) * (s.profile[j + 1] || 0);
      close(result, j === s.sites - 1 ? s.residual : 0);
    }
  }
});

test('oscillatory recurrence agrees with the independently evaluated closed-form solution', () => {
  for (const delta of [0.05, 0.3, 0.8]) for (const mu of [-0.7, 0, 0.7]) {
    const s = wires.state({sites: 24, delta, mu});
    const q = Math.acos(-mu / (2 * Math.sqrt(1 - delta * delta)));
    const raw = Array.from({length: 24}, (_, j) => s.rho ** j * Math.sin((j + 1) * q) / Math.sin(q));
    const norm = Math.hypot(...raw);
    raw.forEach((value, j) => close(s.profile[j], value / norm));
  }
});

test('every analytic crossing makes the finite matrix singular and reverses its determinant sign', () => {
  for (const sites of [2, 3, 6, 11]) for (const delta of [0.1, 0.35, 0.75]) {
    for (const mu of wires.zeroCrossings(sites, delta)) {
      const s = wires.state({sites, delta, mu});
      close(determinant(sites, delta, mu), 0, 2e-10);
      close(s.residual, 0, 2e-12);
      assert.equal(s.atCrossing, true);
      assert.equal(s.parity, null);
      const before = determinant(sites, delta, mu - 1e-5);
      const after = determinant(sites, delta, mu + 1e-5);
      assert.ok(before * after < 0);
      assert.equal(wires.state({sites, delta, mu: mu - 1e-5}).parity, Math.sign(before));
      assert.equal(wires.state({sites, delta, mu: mu + 1e-5}).parity, Math.sign(after));
    }
  }
});

test('odd and even lengths differ at zero potential, including the occupancy parity limits', () => {
  for (const sites of [8, 9, 20, 21]) {
    const s = wires.state({sites, delta: 0.4, mu: 0});
    assert.equal(s.atCrossing, sites % 2 === 1);
    assert.equal(wires.state({sites, mu: -3}).parity, 1);
    assert.equal(wires.state({sites, mu: 3}).parity, sites % 2 ? -1 : 1);
  }
});

test('a small boundary residual alone does not label an exact parity crossing', () => {
  const s = wires.state({sites: 60, delta: 0.8, mu: 0.35});
  assert.ok(Math.abs(s.residual) < 1e-20);
  assert.equal(s.atCrossing, false);
});

test('growth-versus-decay criterion recovers the bulk boundary beyond the oscillation boundary', () => {
  for (const delta of [0.05, 0.4, 0.95]) {
    close(wires.state({delta, mu: 2}).decayRate, 0);
    close(wires.state({delta, mu: -2}).decayRate, 0);
    const outsideOscillations = wires.state({delta, mu: (2 + 2 * Math.sqrt(1 - delta * delta)) / 2});
    assert.equal(outsideOscillations.oscillatory, false);
    assert.equal(outsideOscillations.topological, true);
    assert.ok(outsideOscillations.decayRate > 0);
    assert.ok(wires.state({delta, mu: 2.2}).decayRate < 0);
  }
});

test('figure provides static accessible output and finite values throughout the control range', () => {
  const initial = wires.initialMarkup();
  assert.match(initial, /data-directions-wires/);
  assert.match(initial, /aria-labelledby/);
  assert.match(initial, /Nearest exact crossing/);
  assert.match(initial, /smallest singular value/);
  for (const sites of [6, 60]) for (const delta of [0.05, 0.95]) for (const mu of [-2.4, 0, 2.4]) {
    const s = wires.state({sites, delta, mu});
    assert.ok(s.profile.every(Number.isFinite));
    assert.ok(Number.isFinite(s.residual));
    assert.doesNotMatch(wires.profileSVG(s) + wires.energySVG(s), /NaN|Infinity/);
  }
});

test('invalid lengths and unsupported parameter values are rejected', () => {
  for (const options of [{sites: 1}, {sites: 2.5}, {sites: 121}, {delta: 0}, {delta: 1}, {delta: NaN}, {mu: Infinity}, {mu: 3.1}]) {
    assert.throws(() => wires.state(options), RangeError);
  }
});


test('finite two-site splitting agrees with the independent many-body parity energies', () => {
  // Even block ground energy is -sqrt(mu^2 + Delta^2), odd block ground energy is -w.
  for (const delta of [0.05, 0.2, 0.7, 0.95]) for (const mu of [-2.4, -1, 0, 0.4, 2]) {
    const s = wires.state({sites: 2, delta, mu});
    assert.equal(s.converged, true);
    close(s.energy, Math.abs(Math.hypot(mu, delta) - 1), 2e-12);
  }
});

test('finite singular profiles solve both matrix equations up to their independent end signs', () => {
  for (const sites of [6, 7, 24, 60]) for (const delta of [0.05, 0.3, 0.9]) for (const mu of [0.2, 1, 1.9, 2.4]) {
    const s = wires.state({sites, delta, mu});
    assert.equal(s.converged, true);
    close(Math.hypot(...s.leftMode), 1);
    close(Math.hypot(...s.rightMode), 1);
    const product = s.leftMode.map((value, j) => -mu * value - (1 - delta) * (s.leftMode[j - 1] || 0) - (1 + delta) * (s.leftMode[j + 1] || 0));
    const signedEnergy = product.reduce((sum, value, j) => sum + value * s.rightMode[j], 0);
    close(Math.abs(signedEnergy), s.energy, 3e-10);
    assert.ok(Math.hypot(...product.map((value, j) => value - signedEnergy * s.rightMode[j])) < 2e-8);
  }
});

test('finite spectrum agrees with independent dense-SVD reference values', () => {
  // NumPy 2.3.5 dense SVD, checked from the explicit tridiagonal matrix.
  for (const [sites, delta, mu, energy] of [[6, 0.05, 1, 0.238790025735756], [6, 0.05, 1.9, 0.0997287885885134], [24, 0.3, 1, 0.00016309270805147999], [20, 0.2, 0.6, 0.010718496303959664]]) {
    close(wires.state({sites, delta, mu}).energy, energy, 2e-12);
  }
});

test('recurrence is kept distinct from the finite eigenvector and energy', () => {
  const s = wires.state({sites: 6, delta: 0.05, mu: 1});
  const overlap = s.profile.reduce((sum, value, j) => sum + value * s.leftMode[j], 0);
  assert.ok(overlap * overlap < 0.85);
  assert.ok(Math.abs(s.residual - s.energy) > 0.1);
  const markup = wires.profileSVG(s, 360, {stagger: true, compare: true});
  assert.match(markup, /zero-energy left recurrence/);
  assert.match(markup, /N\+1/);
});

test('energy curve retains raw sub-floor values and identifies convergence', () => {
  const curve = wires.splittingCurve(24, 0.3);
  assert.equal(curve.failures, 0);
  assert.ok(curve.points.some(point => point.energy < 1e-14));
  assert.ok(curve.points.every(point => point.energy >= 0 && Number.isFinite(point.energy)));
  assert.equal(wires.splittingCurve(24, 0.3), curve);
});
