/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../physics.js');

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
}

function sameState(actual, expected) {
  actual.forEach((amplitude, i) => amplitude.forEach((value, j) => close(value, expected[i][j])));
}

function norm(state) {
  return state.reduce((sum, [re, im]) => sum + re * re + im * im, 0);
}

test('Abelian limits distinguish single exchange from full winding', () => {
  sameState([P.abelianPhase(0, 1).phase], [[1, 0]]);
  sameState([P.abelianPhase(Math.PI, 1).phase], [[-1, 0]]);
  sameState([P.abelianPhase(Math.PI, 2).phase], [[1, 0]]);
  sameState([P.abelianPhase(Math.PI / 2, 2).phase], [[-1, 0]]);
  close(P.abelianPhase(Math.PI / 3, 2).angle, 2 * Math.PI / 3);
  const forward = P.abelianPhase(Math.PI / 3, 1).phase;
  const backward = P.abelianPhase(Math.PI / 3, -1).phase;
  close(forward[0], backward[0]);
  close(forward[1], -backward[1]);
  sameState([P.abelianPhase(Math.PI / 3, 0).phase], [[1, 0]]);
});

test('Balanced interferometer normalization, visibility and known phase shifts', () => {
  close(P.interference({ theta: 0 }).p0, 1);
  close(P.interference({ theta: Math.PI / 2 }).p0, 0);
  close(P.interference({ theta: Math.PI / 3 }).p0, 0.25);
  close(P.interference({ theta: Math.PI / 3, enclosed: 3 }).p0, 1);
  close(P.interference({ theta: Math.PI / 3, enclosed: 0 }).p0, 1);
  close(P.interference({ theta: Math.PI / 3, winding: 0 }).p0, 1);
  close(P.interference({ theta: 1, visibility: 0 }).p0, 0.5);
  const result = P.interference({ theta: Math.PI / 3, referencePhase: -2 * Math.PI / 3 });
  close(result.p0, 1);
  for (let step = 0; step <= 50; step++) {
    const value = P.interference({ theta: step / 7, enclosed: step % 5, referencePhase: step / 3, visibility: 0.8 });
    close(value.p0 + value.p1, 1);
    assert.ok(value.p0 >= 0 && value.p0 <= 1);
  }
});

test('Every Ising generator is unitary and an inverse undoes it', () => {
  sameState(P.applyBraidWord([1], 'vacuum'), [[Math.cos(Math.PI / 8), -Math.sin(Math.PI / 8)], [0, 0]]);
  sameState(P.applyBraidWord([1], 'fermion'), [[0, 0], [Math.cos(3 * Math.PI / 8), Math.sin(3 * Math.PI / 8)]]);
  close(P.probabilities(P.applyBraidWord([2, 2], 'vacuum'))[1], 1);
  for (let generator = 1; generator <= 3; generator++) {
    for (const initial of ['vacuum', 'fermion', 'plus']) {
      const state = P.isingInitial(initial);
      for (const direction of [-1, 1]) {
        const transformed = P.applyBraidWord([direction * generator], state);
        close(norm(transformed), 1);
        sameState(P.applyBraidWord([direction * generator, -direction * generator], state), state);
      }
    }
  }
});

test('Ising generators satisfy the braid relations, including complex global phases', () => {
  for (const state of [P.isingInitial('vacuum'), P.isingInitial('fermion')]) {
    sameState(P.applyBraidWord([1, 2, 1], state), P.applyBraidWord([2, 1, 2], state));
    sameState(P.applyBraidWord([2, 3, 2], state), P.applyBraidWord([3, 2, 3], state));
    sameState(P.applyBraidWord([1, 3], state), P.applyBraidWord([3, 1], state));
  }
});

test('Noncommuting exchanges yield the stated measurable order effect', () => {
  const a = P.applyBraidWord([1, 2], 'plus');
  const b = P.applyBraidWord([2, 1], 'plus');
  close(P.probabilities(a)[0], 1);
  close(P.probabilities(b)[0], 0.5);
  close(P.fidelity(a, b), 0.5);
  // Starting in |0> hides this state difference in this particular readout.
  const c = P.applyBraidWord([1, 2], 'vacuum');
  const d = P.applyBraidWord([2, 1], 'vacuum');
  close(P.probabilities(c)[0], 0.5);
  close(P.probabilities(d)[0], 0.5);
  close(P.fidelity(c, d), 0.5);
});

test('Bloch conventions and fusion readout agree with elementary qubit states', () => {
  assert.deepEqual(P.bloch(P.isingInitial('vacuum')), { x: 0, y: 0, z: 1 });
  assert.deepEqual(P.bloch(P.isingInitial('fermion')), { x: 0, y: 0, z: -1 });
  close(P.bloch(P.isingInitial('plus')).x, 1);
  const plusY = [[Math.SQRT1_2, 0], [0, Math.SQRT1_2]];
  close(P.bloch(plusY).y, 1);
  const word = Array.from({ length: 1000 }, (_, index) => [1, -2, 3, 2, -1][index % 5]);
  const state = P.applyBraidWord(word, 'plus');
  close(norm(state), 1, 1e-10);
  const { x, y, z } = P.bloch(state);
  close(x * x + y * y + z * z, 1);
});

test('Fibonacci fusion dimensions obey boundary cases and independently enumerated paths', () => {
  assert.deepEqual(P.fibonacciCounts(0), { n: 0, vacuum: 1, tau: 0, total: 1 });
  assert.deepEqual(P.fibonacciCounts(1), { n: 1, vacuum: 0, tau: 1, total: 1 });
  assert.deepEqual(P.fibonacciCounts(2), { n: 2, vacuum: 1, tau: 1, total: 2 });
  assert.deepEqual(P.fibonacciCounts(6), { n: 6, vacuum: 5, tau: 8, total: 13 });
  for (let n = 0; n <= 12; n++) {
    const counts = P.fibonacciCounts(n);
    assert.equal(P.fibonacciPaths(n).length, counts.total);
    assert.equal(P.fibonacciPaths(n, 'vacuum').length, counts.vacuum);
    assert.equal(P.fibonacciPaths(n, 'tau').length, counts.tau);
    for (const path of P.fibonacciPaths(n)) {
      let previous = 'vacuum';
      for (const charge of path) {
        assert.ok(previous !== 'vacuum' || charge === 'tau');
        previous = charge;
      }
    }
  }
  const ratio = P.fibonacciCounts(30).total / P.fibonacciCounts(29).total;
  close(ratio, (1 + Math.sqrt(5)) / 2, 1e-10);
  const large = P.fibonacciCounts(70);
  assert.ok(Number.isSafeInteger(large.total));
});

test('Toric mutual statistics depend on enclosed parity and winding parity', () => {
  for (let count = 0; count < 10; count++) {
    assert.equal(P.toricPhase(count).sign, count % 2 === 0 ? 1 : -1);
    assert.equal(P.toricPhase(count, -1).sign, P.toricPhase(count).sign);
    assert.equal(P.toricPhase(count, 2).sign, 1);
    assert.equal(P.toricPhase(count, 0).sign, 1);
  }
});

test('Loop winding survives deformation, changes sign on reversal, and rejects collisions', () => {
  const square = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }];
  const center = { x: 0, y: 0 };
  assert.equal(P.windingNumber(center, square), 1);
  assert.equal(P.windingNumber(center, square.slice().reverse()), -1);
  assert.equal(P.windingNumber({ x: 2, y: 0 }, square), 0);
  assert.equal(P.windingNumber({ x: 1, y: 0 }, square), null);
  assert.equal(P.windingNumber({ x: 1, y: 1 }, square), null);
  assert.equal(P.windingNumber(center, square.concat(square)), 2);
  const deformed = [{ x: -2, y: -3 }, { x: 1, y: -2 }, { x: 2, y: 3 }, { x: -3, y: 2 }];
  assert.equal(P.windingNumber(center, deformed), 1);
  assert.equal(P.windingNumber(center, square.concat(square.slice().reverse())), 0);
});

test('Invalid inputs fail explicitly rather than producing plausible-looking results', () => {
  assert.throws(() => P.abelianPhase(NaN, 1));
  assert.throws(() => P.abelianPhase(1, 0.5));
  assert.throws(() => P.interference({ theta: 1, visibility: 1.1 }));
  assert.throws(() => P.interference({ theta: 1, enclosed: 0.5 }));
  assert.throws(() => P.applyBraidWord([0]));
  assert.throws(() => P.applyBraidWord([4]));
  assert.throws(() => P.applyBraidWord(['1']));
  assert.throws(() => P.isingBraid(1, 0));
  assert.throws(() => P.probabilities([[0, 0], [0, 0]]));
  assert.throws(() => P.fibonacciCounts(71));
  assert.throws(() => P.fibonacciPaths(13));
  assert.throws(() => P.toricPhase(-1));
});
