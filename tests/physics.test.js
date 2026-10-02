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

// General complex matrix multiplication, independent of the model's formulas.
function matrixProduct(a, b) {
  return a.map(row => b[0].map((_, column) => row.reduce((sum, value, k) => [
    sum[0] + value[0] * b[k][column][0] - value[1] * b[k][column][1],
    sum[1] + value[0] * b[k][column][1] + value[1] * b[k][column][0]
  ], [0, 0])));
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

test('Interferometer density matrices are physical and reproduce the Hadamard readout', () => {
  const h = [[[Math.SQRT1_2, 0], [Math.SQRT1_2, 0]], [[Math.SQRT1_2, 0], [-Math.SQRT1_2, 0]]];
  for (const visibility of [0, 0.2, 0.8, 1]) {
    for (const theta of [0, Math.PI / 4, Math.PI / 3, Math.PI, -0.3]) {
      const result = P.interference({ theta, enclosed: 2, winding: -1, referencePhase: 0.7, visibility });
      const rho = result.pathDensityMatrix;
      close(rho[0][0][0] + rho[1][1][0], 1);
      close(rho[0][0][1], 0);
      close(rho[1][1][1], 0);
      close(rho[0][1][0], rho[1][0][0]);
      close(rho[0][1][1], -rho[1][0][1]);
      const coherenceSquared = rho[0][1][0] ** 2 + rho[0][1][1] ** 2;
      const determinant = rho[0][0][0] * rho[1][1][0] - coherenceSquared;
      close(determinant, (1 - visibility * visibility) / 4);
      assert.ok(rho[0][0][0] >= 0 && rho[1][1][0] >= 0 && determinant >= -1e-14);
      const purity = matrixProduct(rho, rho);
      close(purity[0][0][0] + purity[1][1][0], (1 + visibility * visibility) / 2);
      const output = matrixProduct(matrixProduct(h, rho), h);
      close(output[0][0][0], result.p0);
      close(output[1][1][0], result.p1);
      close(output[0][0][1], 0);
      close(output[1][1][1], 0);
      if (visibility < 1) assert.equal(result.coherentOutputAmplitudes, null);
    }
  }
  assert.deepEqual(P.interference({ theta: 0, visibility: 0 }).pathDensityMatrix, [
    [[0.5, 0], [0, -0]], [[0, 0], [0.5, 0]]
  ]);
});

test('Coherent interferometer amplitudes have the stated phase convention and correct probabilities', () => {
  const quarterCycle = P.interference({ theta: 0, referencePhase: Math.PI / 2 });
  sameState(quarterCycle.coherentOutputAmplitudes, [[0.5, 0.5], [0.5, -0.5]]);
  for (const phase of [-2.7, 0, Math.PI / 2, Math.PI, 1.3 * Math.PI]) {
    const result = P.interference({ theta: 0, referencePhase: phase });
    const pathState = [[Math.SQRT1_2, 0], [Math.cos(phase) * Math.SQRT1_2, Math.sin(phase) * Math.SQRT1_2]];
    const h = [[[Math.SQRT1_2, 0], [Math.SQRT1_2, 0]], [[Math.SQRT1_2, 0], [-Math.SQRT1_2, 0]]];
    sameState(P.applyMatrix(h, pathState), result.coherentOutputAmplitudes);
    close(norm(result.coherentOutputAmplitudes), 1);
    const outputProbabilities = P.probabilities(result.coherentOutputAmplitudes);
    close(outputProbabilities[0], result.p0);
    close(outputProbabilities[1], result.p1);
    // Build |path><path| independently to fix the off-diagonal phase sign.
    for (let row = 0; row < 2; row++) for (let column = 0; column < 2; column++) {
      const [ar, ai] = pathState[row], [br, bi] = pathState[column];
      sameState([result.pathDensityMatrix[row][column]], [[ar * br + ai * bi, ai * br - ar * bi]]);
    }
  }
  assert.equal(P.interference({ theta: 0, visibility: 1 - Number.EPSILON }).coherentOutputAmplitudes, null);
});

test('Every Ising generator is unitary and an inverse undoes it', () => {
  sameState(P.applyBraidWord([1], 'vacuum'), [[Math.cos(Math.PI / 8), -Math.sin(Math.PI / 8)], [0, 0]]);
  sameState(P.applyBraidWord([1], 'fermion'), [[0, 0], [Math.cos(3 * Math.PI / 8), Math.sin(3 * Math.PI / 8)]]);
  close(P.probabilities(P.applyBraidWord([2, 2], 'vacuum'))[1], 1);
  for (let generator = 1; generator <= 3; generator++) {
    for (const initial of ['vacuum', 'fermion', 'plus', 'plusY']) {
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

test('Pauli measurements agree with direct eigenvector projections and normalize the input', () => {
  const plusY = P.isingInitial('plusY');
  sameState(plusY, [[Math.SQRT1_2, 0], [0, Math.SQRT1_2]]);
  assert.deepEqual(P.measurementProbabilities(plusY, 'y'), { plus: 1, minus: 0, expectation: 1 });
  assert.deepEqual(P.measurementProbabilities(P.isingInitial('vacuum')), { plus: 1, minus: 0, expectation: 1 });
  assert.deepEqual(P.measurementProbabilities(P.isingInitial('fermion'), 'z'), { plus: 0, minus: 1, expectation: -1 });
  assert.deepEqual(P.measurementProbabilities(P.isingInitial('plus'), 'x'), { plus: 1, minus: 0, expectation: 1 });
  for (const state of [plusY, [[2, -1], [1, 3]], [[-1, 2], [4, -0.5]]]) {
    const [[ar, ai], [br, bi]] = state;
    // Project onto (1,+1)/sqrt(2), (1,+i)/sqrt(2), and (1,0).
    const expectedPlus = {
      x: ((ar + br) ** 2 + (ai + bi) ** 2) / (2 * norm(state)),
      y: ((ar + bi) ** 2 + (ai - br) ** 2) / (2 * norm(state)),
      z: (ar * ar + ai * ai) / norm(state)
    };
    const changedOverallPhaseAndScale = state.map(([real, imaginary]) => [-3 * imaginary, 3 * real]);
    for (const axis of ['x', 'y', 'z']) {
      const result = P.measurementProbabilities(state, axis);
      close(result.plus, expectedPlus[axis]);
      close(result.plus + result.minus, 1);
      close(result.expectation, result.plus - result.minus);
      assert.ok(result.plus >= 0 && result.minus >= 0);
      close(P.measurementProbabilities(changedOverallPhaseAndScale, axis).plus, result.plus);
    }
  }
});

test('Changing the readout basis reveals the Ising state difference hidden by fusion probabilities', () => {
  const a = P.applyBraidWord([1, 2], 'vacuum');
  const b = P.applyBraidWord([2, 1], 'vacuum');
  close(P.measurementProbabilities(a, 'z').plus, 0.5);
  close(P.measurementProbabilities(b, 'z').plus, 0.5);
  close(P.measurementProbabilities(a, 'x').plus, 0.5);
  close(P.measurementProbabilities(b, 'x').plus, 1);
  close(P.measurementProbabilities(a, 'y').plus, 0);
  close(P.measurementProbabilities(b, 'y').plus, 0.5);
  for (const state of [a, b]) {
    const directFusion = P.probabilities(state);
    const zReadout = P.measurementProbabilities(state);
    close(zReadout.plus, directFusion[0]);
    close(zReadout.minus, directFusion[1]);
  }
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

test('Direct fusion-path selection exactly matches independently enumerated paths and their order', () => {
  for (let n = 0; n <= 12; n++) {
    for (const sector of ['vacuum', 'tau']) {
      const paths = P.fibonacciPaths(n, sector);
      if (!paths.length) assert.throws(() => P.fibonacciPathAt(n, sector, 0), /no fusion paths/);
      paths.forEach((path, index) => assert.deepEqual(P.fibonacciPathAt(n, sector, index), path));
    }
  }
});

test('Large fusion spaces support exact indexed paths without enumerating all states', () => {
  const n = 70;
  const fibonacci = [0n, 1n];
  for (let i = 2; i <= n; i++) fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
  // Independent ranking uses the closed sector dimensions F_(r-1), F_r
  // for the r anyons following each lexicographically earlier vacuum branch.
  function rank(path, target) {
    let result = 0n;
    let previous = 'vacuum';
    path.forEach((charge, step) => {
      assert.ok(charge === 'vacuum' || charge === 'tau');
      assert.ok(previous !== 'vacuum' || charge === 'tau');
      if (previous === 'tau' && charge === 'tau') {
        const remaining = path.length - step - 1;
        result += remaining === 0 ? (target === 'vacuum' ? 1n : 0n)
          : fibonacci[remaining - (target === 'vacuum' ? 1 : 0)];
      }
      previous = charge;
    });
    assert.equal(previous, target);
    return result;
  }
  for (const sector of ['vacuum', 'tau']) {
    const count = P.fibonacciCounts(n)[sector];
    assert.equal(BigInt(count), fibonacci[n - (sector === 'vacuum' ? 1 : 0)]);
    const samples = [0, 1, Math.floor(count / 2), count - 2, count - 1];
    for (const index of samples) {
      const path = P.fibonacciPathAt(n, sector, index);
      assert.equal(path.length, n);
      assert.equal(rank(path, sector), BigInt(index));
    }
    assert.throws(() => P.fibonacciPathAt(n, sector, count));
    assert.throws(() => P.fibonacciPathAt(n, sector, -1));
  }
  assert.deepEqual(P.fibonacciPathAt(70, 'vacuum', 0), Array.from({ length: 70 }, (_, index) => index % 2 ? 'vacuum' : 'tau'));
  assert.deepEqual(P.fibonacciPathAt(70, 'tau', P.fibonacciCounts(70).tau - 1), Array(70).fill('tau'));
});

test('Toric mutual statistics depend on enclosed parity and winding parity', () => {
  for (let count = 0; count < 10; count++) {
    assert.equal(P.toricPhase(count).sign, count % 2 === 0 ? 1 : -1);
    assert.equal(P.toricPhase(count, -1).sign, P.toricPhase(count).sign);
    assert.equal(P.toricPhase(count, 2).sign, 1);
    assert.equal(P.toricPhase(count, 0).sign, 1);
  }
});

test('Toric X-string steps create a pair, move an endpoint, and cancel on reversal', () => {
  const created = P.toricStringStep([], '0,0', '1,0');
  assert.deepEqual(created, { edges: [['0,0', '1,0']], defects: ['0,0', '1,0'] });
  const moved = P.toricStringStep(created.edges, '1,0', '2,0');
  assert.deepEqual(moved, { edges: [['0,0', '1,0'], ['1,0', '2,0']], defects: ['0,0', '2,0'] });
  assert.deepEqual(P.toricStringStep(moved.edges, '2,0', '1,0'), created);
  assert.deepEqual(P.toricStringStep(created.edges, '1,0', '0,0'), { edges: [], defects: [] });
});

test('Closed toric strings have no endpoints and disjoint strings combine modulo two', () => {
  const square = ['0,0', '1,0', '1,1', '0,1', '0,0'];
  let result = { edges: [], defects: [] };
  for (let step = 1; step < square.length; step++) result = P.toricStringStep(result.edges, square[step - 1], square[step]);
  assert.deepEqual(result.defects, []);
  assert.deepEqual(result.edges, [['0,0', '0,1'], ['0,0', '1,0'], ['0,1', '1,1'], ['1,0', '1,1']]);
  const disjoint = P.toricStringStep(result.edges, '8,9', '8,10');
  assert.deepEqual(disjoint.defects, ['8,9', '8,10']);
  assert.deepEqual(P.toricStringStep(disjoint.edges, '8,10', '8,9'), result);
  for (let step = square.length - 1; step > 0; step--) result = P.toricStringStep(result.edges, square[step], square[step - 1]);
  assert.deepEqual(result, { edges: [], defects: [] });
  // Oppositely written occurrences of the same existing edge also cancel.
  assert.deepEqual(P.toricStringStep([['1,0', '0,0'], ['0,0', '1,0']], '2,0', '2,1'), {
    edges: [['2,0', '2,1']], defects: ['2,0', '2,1']
  });
});

test('Toric string updates validate every edge, sort numerically, and leave input untouched', () => {
  const input = Object.freeze([Object.freeze(['10,1', '10,0']), Object.freeze(['2,1', '2,0'])]);
  const result = P.toricStringStep(input, '1,1', '1,0');
  assert.deepEqual(result, {
    edges: [['1,0', '1,1'], ['2,0', '2,1'], ['10,0', '10,1']],
    defects: ['1,0', '1,1', '2,0', '2,1', '10,0', '10,1']
  });
  assert.deepEqual(input, [['10,1', '10,0'], ['2,1', '2,0']]);
  result.edges[1][0] = '99,99';
  assert.equal(input[1][1], '2,0');
  for (const invalid of ['-1,0', '01,0', '1.0,0', '1, 0', '1e2,0', '0', '9007199254740992,0']) {
    assert.throws(() => P.toricStringStep([], invalid, '0,0'));
  }
  assert.throws(() => P.toricStringStep(null, '0,0', '1,0'));
  assert.throws(() => P.toricStringStep([['0,0']], '0,0', '1,0'));
  assert.throws(() => P.toricStringStep([], '0,0', '0,0'));
  assert.throws(() => P.toricStringStep([], '0,0', '1,1'));
  assert.throws(() => P.toricStringStep([['0,0', '2,0']], '0,0', '1,0'));
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
  assert.throws(() => P.measurementProbabilities([[1, 0], [0, 0]], 'q'));
  assert.throws(() => P.measurementProbabilities([[0, 0], [0, 0]], 'x'));
  assert.throws(() => P.fibonacciCounts(71));
  assert.throws(() => P.fibonacciPaths(13));
  assert.throws(() => P.fibonacciPathAt(71, 'vacuum', 0));
  assert.throws(() => P.fibonacciPathAt(4, 'either', 0));
  assert.throws(() => P.fibonacciPathAt(4, 'vacuum', 0.5));
  assert.throws(() => P.fibonacciPathAt(4, 'vacuum', Number.MAX_SAFE_INTEGER + 1));
  assert.throws(() => P.fibonacciPathAt(0, 'tau', 0), /no fusion paths/);
  assert.throws(() => P.fibonacciPathAt(1, 'vacuum', 0), /no fusion paths/);
  assert.throws(() => P.toricPhase(-1));
});
