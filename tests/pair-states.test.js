/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../pair-states-physics.js');

function close(actual, expected, tolerance = 2e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
}

test('Both preparations normalize and have the regular-sector formal zero limit', () => {
  for (const preparation of ['localized', 'coherent']) {
    for (const alpha of [0, 1e-9, 1 / 3, 0.6, 1 - 1e-9, 1]) {
      const zero = P.pairState({ alpha, separation: 0, preparation });
      assert.deepEqual(zero.weights, [{ n: 0, probability: 1 }]);
      assert.equal(zero.chi, alpha);
      assert.equal(zero.delta, 0);
      assert.equal(zero.formalZeroLimit, true);
      close(zero.radialMoment, 4 * alpha + 2);
      for (const separation of [1e-6, 0.1, 1, 2, 4, 8]) {
        const state = P.pairState({ alpha, separation, preparation });
        close(state.weights.reduce((sum, item) => sum + item.probability, 0), 1, 5e-15);
        assert.ok(state.weights.every(item => item.probability >= 0));
        assert.ok(state.convergence.chiTruncationBound <= 1.0001e-15);
        assert.ok(state.convergence.terms < 100);
        close((state.radialMoment - state.referenceRadialMoment) / 4, state.chi);
      }
    }
  }
});

test('Boson and fermion sums reproduce independent tanh and coth formulas', () => {
  for (const separation of [0.01, 0.2, 1, 2, 3, 5, 8]) {
    const u = separation ** 2 / 4;
    // expm1 avoids losing the tiny large-u limiting values.
    const boson = -2 * u / (Math.exp(2 * u) + 1);
    const fermion = 2 * u / Math.expm1(2 * u);
    for (const preparation of ['localized', 'coherent']) {
      close(P.pairState({ alpha: 0, separation, preparation }).chi, boson, 1e-14);
      close(P.pairState({ alpha: 1, separation, preparation }).chi, fermion, 1e-14);
    }
  }
});

test('Generalized coherent coefficients solve K- c = beta c', () => {
  for (const alpha of [0, 1 / 3, 0.6, 1]) {
    for (const separation of [0, 0.2, 2, 5, 8]) {
      const state = P.pairState({ alpha, separation, preparation: 'coherent' });
      const coefficients = state.weights.map(({ probability }) => Math.sqrt(probability));
      let normSquared = 0;
      let K1 = 0;
      for (let n = 0; n < coefficients.length; n++) {
        const next = coefficients[n + 1] || 0;
        const lowered = Math.sqrt((n + 1) * (n + alpha + 0.5)) * next;
        normSquared += (lowered - state.beta * coefficients[n]) ** 2;
        K1 += coefficients[n] * lowered;
      }
      assert.ok(normSquared < 1e-13, `Lowering eigenstate residual ${normSquared}`);
      close(K1, state.K1, 2e-14);
      assert.equal(state.delta, 0);
    }
  }
});

test('Localized correction agrees with direct adjacent-coefficient matrix elements', () => {
  for (const alpha of [0, 1 / 3, 0.44, 0.6, 1]) {
    for (const separation of [0, 0.2, 1, 2, 4, 8]) {
      const state = P.pairState({ alpha, separation, preparation: 'localized' });
      let directK1 = 0;
      for (let n = 0; n < state.weights.length - 1; n++) {
        directK1 += Math.sqrt((n + 1) * (n + alpha + 0.5)
          * state.weights[n].probability * state.weights[n + 1].probability);
      }
      close(directK1, state.K1, 2e-14);
      assert.ok(state.delta >= 0);
    }
  }
  close(P.pairState({ alpha: 0.44, separation: 2 * Math.sqrt(2.03) }).delta,
    0.018091899158007685, 2e-14);
});

test('SU(1,1) ladder commutators and Casimir hold away from truncation edges', () => {
  for (const alpha of [0, 1 / 3, 0.6, 1]) {
    const kappa = alpha / 2 + 0.25;
    for (let n = 0; n < 30; n++) {
      const current = P.generatorElements({ alpha, n });
      const next = P.generatorElements({ alpha, n: n + 1 });
      // Diagonal matrix element of [K+,K-] and the raising element of [K0,K+].
      close(current.lowering ** 2 - current.raising ** 2, -2 * current.diagonal, 3e-13);
      close((next.diagonal - current.diagonal) * current.raising, current.raising, 1e-13);
      close(current.diagonal ** 2 - (current.lowering ** 2 + current.raising ** 2) / 2,
        kappa * (kappa - 1), 3e-13);
    }
  }
});

test('Known fractional states differ between preparations at fixed statistics and label', () => {
  const localized = P.pairState({ alpha: 1 / 3, separation: 2, preparation: 'localized' });
  const coherent = P.pairState({ alpha: 1 / 3, separation: 2, preparation: 'coherent' });
  // Independently summed reference values, with u=1.
  close(localized.chi, -0.11925881920748682, 2e-14);
  close(coherent.chi, -0.147762032405635, 2e-14);
  // Near a zero, the small localized correction changes the outgoing sign.
  const state = P.saddle({ alpha: 0.6, separation: 2 * Math.sqrt(1.1), tau: 0 });
  assert.ok(state.initial.chi > 0);
  assert.ok(state.outgoingMoment > 0);
});

test('Saddle moment evolution agrees with an independent ODE integration', () => {
  for (const preparation of ['localized', 'coherent']) {
    const initial = P.pairState({ alpha: 0.6, separation: 2, preparation });
    let k0 = initial.K0, k1 = initial.K1;
    const tau = 0.7, steps = 1000, dt = tau / steps;
    for (let j = 0; j < steps; j++) {
      const a = [-2 * k1, -2 * k0];
      const b = [-2 * (k1 + dt * a[1] / 2), -2 * (k0 + dt * a[0] / 2)];
      const c = [-2 * (k1 + dt * b[1] / 2), -2 * (k0 + dt * b[0] / 2)];
      const d = [-2 * (k1 + dt * c[1]), -2 * (k0 + dt * c[0])];
      k0 += dt * (a[0] + 2 * b[0] + 2 * c[0] + d[0]) / 6;
      k1 += dt * (a[1] + 2 * b[1] + 2 * c[1] + d[1]) / 6;
    }
    const result = P.saddle({ alpha: 0.6, separation: 2, preparation, tau });
    close(result.K0, k0);
    close(result.K1, k1);
    close(result.chi, (result.Qx + result.Qy - result.referenceQx - result.referenceQy) / 4);
    close(result.outgoingMoment, Math.exp(2 * tau) / 4 - result.Qy / 4);
  }
});

test('Saddle flow preserves area and is undone by reversing time', () => {
  for (const tau of [-3, -1, 0, 0.5, 2, 3]) {
    const forward = P.saddleFlow(tau), reverse = P.saddleFlow(-tau);
    close(forward[0][0] * forward[1][1], 1);
    close(forward[0][0] * reverse[0][0], 1);
    close(forward[1][1] * reverse[1][1], 1);
    const initial = P.pairState({ alpha: 1 / 3, separation: 3 });
    const result = P.saddle({ alpha: 1 / 3, separation: 3, tau });
    close(result.Qx * reverse[0][0] ** 2, initial.Qx);
    close(result.Qy * reverse[1][1] ** 2, initial.Qy);
    const coherent = P.saddle({ alpha: 1 / 3, separation: 3, preparation: 'coherent', tau });
    close(coherent.chi, coherent.initial.chi * Math.cosh(2 * tau));
  }
});

test('Invalid parameters fail explicitly', () => {
  for (const alpha of [-0.01, 1.01, NaN, Infinity, '0.5']) {
    assert.throws(() => P.pairState({ alpha }));
  }
  for (const separation of [-1, 8.01, NaN]) assert.throws(() => P.pairState({ separation }));
  assert.throws(() => P.pairState({ preparation: 'unknown' }));
  assert.throws(() => P.saddle({ tau: Infinity }));
  assert.throws(() => P.saddle({ tau: 9 }));
  assert.throws(() => P.generatorElements({ alpha: 0.3, n: -1 }));
});
