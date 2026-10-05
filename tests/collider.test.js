/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const C = require('../collider-physics.js');

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected} by ${Math.abs(actual - expected)}`);
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const multiply = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const scale = (a, value) => [a[0] * value, a[1] * value];
const squared = a => a[0] * a[0] + a[1] * a[1];

// Closed-form integrals, independent of the model's numerical quadrature.
// With Q=1/ratio and u=cos(q/2), integrating TR* reduces to atanh(u*c).
// atan2 supplies the continuous branch of the transmission integral at Q>pi.
function analytic(r, ratio) {
  if (r === 0) return { a: 0, b: 1, J: 0, fermion: 1, boson: 1 };
  const Q = 1 / ratio, delta = 1 - r * r, total = 1 + r * r;
  const b = (2 * delta / total) * Math.atan2(total * Math.sin(Q / 2), delta * Math.cos(Q / 2)) / Q;
  const J = (2 * delta / total) * (Math.atanh(2 * r / total) - Math.atanh(2 * r * Math.cos(Q / 2) / total)) / Q;
  const a = 1 - b, baseline = a * a + b * b;
  return { a, b, J, fermion: baseline + 2 * J * J, boson: baseline - 2 * J * J };
}

test('The standalone browser build exposes the same model without a DOM or module loader', () => {
  const browser = {};
  runInNewContext(readFileSync(require.resolve('../collider-physics.js'), 'utf8'), browser);
  assert.equal(typeof browser.AnyonCollider.calculate, 'function');
  assert.equal(typeof browser.AnyonCollider.scattering, 'function');
  close(browser.AnyonCollider.calculate().fermion, C.calculate().fermion, 1e-14);
});

test('Symmetric scattering is unitary, including zero momentum and full coupling', () => {
  for (const r of [0, 0.05, 0.3, 0.7, 0.95, 0.98]) {
    for (const q of [0, 1e-12, 0.03, 0.4, Math.PI, 5, 2 * Math.PI, -0.6]) {
      const { T, R, transmission, reflection } = C.scattering({ r, q });
      close(transmission + reflection, 1, 2e-14);
      // Off-diagonal entry of S*S† is TR*+RT*=2 Re(TR*).
      close(2 * (T[0] * R[0] + T[1] * R[1]), 0, 2e-14);
      // For a monochromatic pair, the fermion determinant has unit modulus.
      close(squared(add(multiply(T, T), scale(multiply(R, R), -1))), 1, 4e-14);
    }
  }
  assert.deepEqual(C.scattering({ r: 0.7, q: 0 }).T, [0, 0]);
});

test('At r=0 both packets change edge with certainty, for either statistics', () => {
  for (const ratio of [0.2, 1, 2.5, 8]) {
    const value = C.calculate({ r: 0, ratio });
    close(value.a, 0);
    close(value.b, 1);
    close(value.Jabs2, 0);
    for (const key of ['B1', 'B2', 'fermion', 'boson']) close(value[key], 1);
  }
});

test('The narrow-spectrum limit approaches a monochromatic pair with the correct leading correction', () => {
  // Around q=0, T=-i*r*q/(1-r^2)+O(q^2). Averaging the uniform
  // spectrum gives P_F=1-r^2*Q^2/[6(1-r^2)^2]+O(Q^4).
  const r = 0.2, coefficient = r * r / (6 * (1 - r * r) ** 2);
  const broad = C.calculate({ r, ratio: 4, tolerance: 1e-12 });
  const narrow = C.calculate({ r, ratio: 8, tolerance: 1e-12 });
  assert.ok(narrow.fermion > broad.fermion);
  const broadCoefficient = (1 - broad.fermion) / broad.qMax ** 2;
  const narrowCoefficient = (1 - narrow.fermion) / narrow.qMax ** 2;
  assert.ok(Math.abs(narrowCoefficient - coefficient) < Math.abs(broadCoefficient - coefficient));
  close(narrowCoefficient, coefficient, 0.005 * coefficient);
  close(narrow.fermion, 1, 0.0002);
});

test('Uniform-spectrum quadrature agrees with analytic integrals throughout the control domain', () => {
  for (const r of [0.05, 0.2, 0.6, 0.95, 0.98]) {
    for (const ratio of [0.2, 0.3, 1, 2.5, 8]) {
      const result = C.calculate({ r, ratio, tolerance: 1e-11 });
      const exact = analytic(r, ratio);
      for (const key of ['a', 'b', 'fermion', 'boson']) close(result[key], exact[key], 2e-11);
      close(result.J[0], 0, 1e-14);
      close(result.J[1], exact.J, 2e-11);
      assert.ok(result.boson >= -2e-13 && result.fermion <= 1 + 2e-13);
      assert.ok(result.boson <= result.B2 && result.B2 <= result.fermion);
      assert.ok(result.Jabs2 <= result.a * result.b + 2e-13);
      assert.ok(result.errorEstimate <= 1e-11);
      assert.ok(result.normalizationResidual < 2e-14);
      assert.ok(result.unitarityResidual < 2e-14);
      assert.equal(result.converged, true);
    }
  }
});

test('Direct two-momentum integration of independent winding amplitudes reproduces coincidence probabilities', () => {
  const r = 0.55, ratio = 1.4, panels = 120, Q = 1 / ratio;
  const nodes = [];
  for (let i = 0; i <= panels; i++) {
    const q = Q * i / panels;
    // Sum actual loop histories, rather than call the model's S-matrix.
    let T = [r, 0], R = [0, 0];
    for (let n = 0; n < 45; n++) {
      R = add(R, scale([Math.cos((n + 0.5) * q), Math.sin((n + 0.5) * q)], -(1 - r * r) * r ** (2 * n)));
      T = add(T, scale([Math.cos((n + 1) * q), Math.sin((n + 1) * q)], -(1 - r * r) * r ** (2 * n + 1)));
    }
    const weight = (i === 0 || i === panels ? 1 : i % 2 ? 4 : 2) / (3 * panels);
    nodes.push({ T, R, weight });
  }
  let fermion = 0, boson = 0;
  for (const first of nodes) for (const second of nodes) {
    const direct = multiply(first.T, second.T), exchange = multiply(first.R, second.R);
    const weight = first.weight * second.weight;
    fermion += weight * squared(add(direct, scale(exchange, -1)));
    boson += weight * squared(add(direct, exchange));
  }
  const result = C.calculate({ r, ratio, tolerance: 1e-12 });
  close(result.fermion, fermion, 1e-9);
  close(result.boson, boson, 1e-9);
});

test('Reference example reproduces opposite conclusions from the two comparison values', () => {
  // Model parameters from Samal et al. Fig. 2b; values independently checked
  // by Python Simpson quadrature (2000 and 10000 panels), not measured data.
  const result = C.calculate();
  close(result.a, 0.6609488126663744);
  close(result.b, 0.3390511873336256);
  close(result.B1, 0.9027560734285236);
  close(result.B2, 0.5518090405974314);
  close(result.fermion, 0.8077073791568912);
  close(result.boson, 0.2959107020379716);
  assert.ok(result.fermion < result.B1);
  assert.ok(result.fermion > result.B2);
  close(result.fermion - result.B2, 2 * result.Jabs2);
  close(result.boson - result.B2, -2 * result.Jabs2);
});

test('Sharper resonances converge under a stricter tolerance and expose conservation residuals', () => {
  const loose = C.calculate({ r: 0.98, ratio: 0.2, tolerance: 1e-7 });
  const tight = C.calculate({ r: 0.98, ratio: 0.2, tolerance: 1e-12 });
  assert.ok(tight.panels > loose.panels);
  for (const key of ['a', 'b', 'Jabs2', 'fermion', 'boson']) close(tight[key], loose[key], 2e-7);
  const exact = analytic(0.98, 0.2);
  close(tight.fermion, exact.fermion, 2e-12);
  assert.ok(tight.errorEstimate < loose.errorEstimate);
  assert.ok(tight.normalizationResidual < 2e-14);
});

test('Invalid inputs and unsupported anyon or junction-phase parameters are rejected', () => {
  for (const value of [NaN, Infinity, '0.5', null]) {
    assert.throws(() => C.calculate({ r: value }), TypeError);
    assert.throws(() => C.calculate({ ratio: value }), TypeError);
  }
  for (const r of [-0.1, 0.981, 1]) assert.throws(() => C.calculate({ r }), RangeError);
  for (const ratio of [0, 0.19, 8.01]) assert.throws(() => C.calculate({ ratio }), RangeError);
  for (const tolerance of [0, 1e-13, 0.1]) assert.throws(() => C.calculate({ tolerance }), RangeError);
  assert.throws(() => C.calculate({ alpha: 1 / 3 }), /Unsupported collider parameter/);
  assert.throws(() => C.calculate({ theta: 0 }), /Unsupported collider parameter/);
  assert.throws(() => C.calculate([]), TypeError);
  assert.throws(() => C.scattering({ q: Infinity }), TypeError);
  assert.throws(() => C.scattering(), TypeError);
});
