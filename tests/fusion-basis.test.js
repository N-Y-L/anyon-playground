/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../fusion-basis-physics.js');
const phi = (1 + Math.sqrt(5)) / 2;
const identity = [[[1, 0], [0, 0]], [[0, 0], [1, 0]]];
const phase = angle => [Math.cos(angle), Math.sin(angle)];

function near(actual, expected, tolerance = 2e-13) {
  if (Array.isArray(expected)) { assert.equal(actual.length, expected.length); expected.forEach((value, i) => near(actual[i], value, tolerance)); }
  else assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
}
// Independent reference arithmetic checks the entire complex operator, not
// just a favorable input state, or the implementation's reported residual.
function product(a, b) {
  return a.map(row => b[0].map((_, j) => row.reduce((sum, [ar, ai], k) => [
    sum[0] + ar * b[k][j][0] - ai * b[k][j][1],
    sum[1] + ar * b[k][j][1] + ai * b[k][j][0]
  ], [0, 0])));
}
const adjoint = a => a[0].map((_, i) => a.map(row => [row[i][0], -row[i][1]]));
const column = state => state.map(value => [value]);
const expectation = (state, matrix) => product(adjoint(column(state)), product(matrix, column(state)))[0][0];

test('F is the Fibonacci recoupling matrix, unitary and involutory', () => {
  const f = P.fMatrix();
  near(f, [[[1 / phi, 0], [Math.sqrt(1 / phi), 0]], [[Math.sqrt(1 / phi), 0], [-1 / phi, 0]]]);
  near(product(adjoint(f), f), identity);
  near(product(f, f), identity);
  near(P.probabilities(P.changeBasis(P.initialState('vacuum'))), [1 / phi ** 2, 1 / phi]);
  near(P.probabilities(P.changeBasis(P.initialState('tau'))), [1 / phi, 1 / phi ** 2]);
});

test('passive F preserves expectations when the same observable changes coordinates', () => {
  const f = P.fMatrix();
  const pair12Vacuum = [[[1, 0], [0, 0]], [[0, 0], [0, 0]]];
  const observableInRightBasis = product(f, product(pair12Vacuum, adjoint(f)));
  for (const name of ['vacuum', 'tau', 'plus', 'plusY']) {
    const left = P.initialState(name), right = P.changeBasis(left);
    near(expectation(right, observableInRightBasis), expectation(left, pair12Vacuum));
    near(P.changeBasis(right), left);
  }
  // Keeping the diagonal projector instead measures a different pair.
  near(expectation(P.changeBasis(P.initialState()), pair12Vacuum), [1 / phi ** 2, 0]);
});

test('positive R fixes right-handed counterclockwise convention including its phases', () => {
  const r = P.braidMatrix(1, 1);
  near(r[0][0], [-Math.cos(Math.PI / 5), -Math.sin(Math.PI / 5)]);
  near(r[1][1], [-Math.cos(2 * Math.PI / 5), Math.sin(2 * Math.PI / 5)]);
  near(r[0][1], [0, 0]); near(r[1][0], [0, 0]);
  // Balancing with the specified chirality theta_tau = exp(+4 pi i / 5).
  const winding = product(r, r);
  near(winding[0][0], phase(-8 * Math.PI / 5));
  near(winding[1][1], phase(-4 * Math.PI / 5));
  near(P.braidMatrix(1, -1), adjoint(r));
});

test('exchange of positions 2 and 3 has the independently simplified analytic matrix', () => {
  // Simplification of FRF: diagonal (phi^-1 e^(4 pi i/5), -phi^-1)
  // and off-diagonal phi^-1/2 e^(-3 pi i/5).
  const d = phase(4 * Math.PI / 5).map(x => x / phi);
  const o = phase(-3 * Math.PI / 5).map(x => x / Math.sqrt(phi));
  near(P.braidMatrix(2), [[d, o], [o, [-1 / phi, 0]]]);
  near(P.probabilities(P.applyWord([2], P.initialState())), [1 / phi ** 2, 1 / phi]);
});

test('both generators are unitary and both exchange orientations are inverses', () => {
  for (const index of [1, 2]) for (const direction of [1, -1]) {
    const matrix = P.braidMatrix(index, direction);
    near(product(adjoint(matrix), matrix), identity);
    near(product(matrix, P.braidMatrix(index, -direction)), identity);
    near(P.wordMatrix(Array(10).fill(direction * index)), identity);
  }
});

test('Yang–Baxter relation holds as a full matrix equality for either orientation', () => {
  for (const direction of [1, -1]) {
    const a = P.braidMatrix(1, direction), b = P.braidMatrix(2, direction);
    near(product(a, product(b, a)), product(b, product(a, b)));
  }
  near(P.wordMatrix([1, 2, 1]), P.wordMatrix([2, 1, 2]));
});

test('words are chronological and reversals invert the entire unitary', () => {
  near(P.wordMatrix([1, 2]), product(P.braidMatrix(2), P.braidMatrix(1)));
  const word = [1, -2, 1, 2, 2, -1, -2];
  const inverse = word.toReversed().map(generator => -generator);
  near(P.wordMatrix(word.concat(inverse)), identity);
  near(P.wordMatrix([]), identity);
  near(P.applyWord(word, P.initialState('plusY')), product(P.wordMatrix(word), column(P.initialState('plusY'))).map(row => row[0]));
});

test('noncommutativity is visible in a chosen pair measurement, not just global phase', () => {
  const result = P.compareWords([1, 2], [2, 1], P.initialState('plus'));
  near(result.fidelity, 0.25);
  near(result.pair12A[0], 0.5 + phi ** (-1.5));
  near(result.pair12B[0], 0.5 - Math.cos(2 * Math.PI / 5) / phi ** 1.5);
  assert.ok(result.matrixDistance > 1.7);
  assert.ok(Math.abs(result.pair12A[0] - result.pair12B[0]) > 0.6);
});

test('equal pair-12 probabilities can hide distinct output states', () => {
  const result = P.compareWords([1, 2], [2, 1], P.initialState());
  near(result.pair12A, result.pair12B);
  near(result.fidelity, 1 / phi ** 2);
  near(result.pair23A[0], 1 / phi ** 2);
  near(result.pair23B[0], 1);
});

test('exchange stepper separates passive coordinates from physical evolution', () => {
  for (const name of ['vacuum', 'tau', 'plus', 'plusY']) for (const direction of [1, -1]) {
    const state = P.initialState(name), copy = JSON.stringify(state);
    const steps = P.exchangeStages(state, direction);
    assert.deepEqual(steps.map(step => step.basis), ['L', 'R', 'R', 'L']);
    assert.deepEqual(steps.map(step => step.physicalExchange), [false, false, true, false]);
    near(P.changeBasis(steps[1].amplitudes), state);
    near(P.probabilities(steps[1].amplitudes), P.probabilities(steps[2].amplitudes));
    near(steps[3].amplitudes, P.applyWord([2 * direction], state));
    assert.equal(JSON.stringify(state), copy);
  }
});

test('recoupling contributions cancel before exchange and interfere differently after it', () => {
  for (const name of ['vacuum', 'tau', 'plus', 'plusY']) for (const direction of [1, -1]) {
    const steps = P.exchangeStages(P.initialState(name), direction);
    for (const stage of [0, 2]) {
      const input = steps[stage].amplitudes, before = JSON.stringify(input);
      const terms = P.basisContributions(input);
      const sum = terms.map(row => row[0].map((component, index) => component + row[1][index]));
      near(sum, steps[stage + 1].amplitudes);
      assert.equal(JSON.stringify(input), before);
    }
  }
  const right = P.changeBasis(P.initialState('vacuum'));
  const noExchange = P.basisContributions(right)[1];
  near(noExchange[0], [phi ** (-1.5), 0]);
  near(noExchange[1], [-(phi ** (-1.5)), 0]);
  const exchanged = P.exchangeStages(P.initialState('vacuum'))[2].amplitudes;
  const terms = P.basisContributions(exchanged)[1];
  const output = terms[0].map((component, index) => component + terms[1][index]);
  near(output[0] ** 2 + output[1] ** 2, 1 / phi);
  assert.throws(() => P.basisContributions([[0, 0], [0, 0]]));
});

test('readouts are normalized and global-phase insensitive, including extreme finite scales', () => {
  const first = [[3, 0], [0, 4]], phased = [[0, 3], [-4, 0]];
  near(P.probabilities(first), [9 / 25, 16 / 25]);
  near(P.fidelity(first, phased), 1);
  for (const scale of [1e-250, 1e250]) near(P.probabilities(first.map(a => a.map(value => scale * value))), [9 / 25, 16 / 25]);
});

test('invalid states, words, and directions cannot silently produce plausible readouts', () => {
  for (const state of [[[0, 0], [0, 0]], [[Infinity, 0], [0, 0]], [[1, 0]], [1, 0]]) assert.throws(() => P.probabilities(state));
  for (const word of [[0], [3], [1.5], ['1'], null]) assert.throws(() => P.wordMatrix(word));
  assert.throws(() => P.braidMatrix(2, 0)); assert.throws(() => P.braidMatrix(3));
  assert.throws(() => P.initialState('unknown'));
  assert.throws(() => P.wordMatrix(Array(1001).fill(1)));
});
