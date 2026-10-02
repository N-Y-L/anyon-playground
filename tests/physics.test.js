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

test('LLL pair correlations recover Bose/Fermi limits and normalized angular-momentum weights', () => {
  for (const alpha of [0, 1 / 3, 0.6, 1]) {
    const origin = P.lllPairCorrelation({ alpha, separation: 0 });
    close(origin.chi, alpha);
    close(origin.meanSeparationSquared, 4 * alpha + 2);
    assert.deepEqual(origin.weights, [{ k: 0, angularMomentum: alpha, probability: 1 }]);
    for (const separation of [1e-6, 0.25, 1, 2, 4, 6, 10, 12]) {
      const result = P.lllPairCorrelation({ alpha, separation });
      close(result.weights.reduce((sum, value) => sum + value.probability, 0), 1);
      const angularMean = result.weights.reduce((sum, value) => sum + value.angularMomentum * value.probability, 0);
      close(angularMean, result.meanAngularMomentum);
      close(result.meanSeparationSquared - result.distinguishableMeanSeparationSquared, 4 * result.chi);
      close(result.distinguishableMeanSeparationSquared, separation * separation + 2);
      assert.equal(result.termsUsed, result.weights.length);
      assert.ok(result.errorBound >= 0 && result.errorBound <= 1e-15);
      assert.ok(result.omittedProbabilityBound >= 0 && result.omittedProbabilityBound <= 1e-15);
      result.weights.forEach((entry, k) => {
        assert.equal(entry.k, k);
        close(entry.angularMomentum, 2 * k + alpha);
        assert.ok(entry.probability >= 0 && entry.probability <= 1);
      });
      if (separation <= 6 && alpha === 0) close(result.chi, result.u * (Math.tanh(result.u) - 1));
      if (separation <= 6 && alpha === 1) close(result.chi, result.u / Math.tanh(result.u) - result.u);
    }
  }
  // The endpoint distributions are Poisson weights restricted to even/odd
  // angular momenta. Evaluate factorials independently of the core recurrence.
  for (const alpha of [0, 1]) {
    const result = P.lllPairCorrelation({ alpha, separation: 2 });
    const normalization = alpha === 0 ? Math.cosh(1) : Math.sinh(1);
    for (const entry of result.weights) {
      let factorial = 1;
      for (let n = 2; n <= entry.angularMomentum; n++) factorial *= n;
      close(entry.probability, 1 / (factorial * normalization));
    }
  }
});

test('LLL fractional statistics agree with independent hypergeometric reference values', () => {
  // Reference: arXiv:0908.3945 Eq. (6), chi=alpha*(M(1,alpha,u)+
  // M(1,alpha,-u))/(M(1,1+alpha,u)+M(1,1+alpha,-u))-u.
  // Generated with Python decimal at 75 digits using the complete M series
  // M(1,b,x)=sum_n x^n/(b)_n (both signs), terminated at |term|<1e-70.
  // This is independent of the even-angular-momentum recurrence in the core.
  const fixtures = [
    [1 / 3, 1, 0.12305904948388383518],
    [1 / 3, 2, -0.11925881920748670810],
    [1 / 3, 4, -0.0074578021608886399838],
    [3 / 5, 2, 0.031162717153475272791],
    [3 / 5, 3, -0.038334621710466428601],
    [1 / 2, 6, -0.000029086896179625007749],
    [1 / 3, 10, -8.6914762112404609016e-13]
  ];
  for (const [alpha, separation, expected] of fixtures) close(P.lllPairCorrelation({ alpha, separation }).chi, expected, 2e-14);
  assert.ok(P.lllPairCorrelation({ alpha: 1 / 3, separation: 1 }).chi > 0);
  assert.ok(P.lllPairCorrelation({ alpha: 1 / 3, separation: 2 }).chi < 0);
  for (const alpha of [0, 1 / 3, 0.6, 1]) assert.ok(Math.abs(P.lllPairCorrelation({ alpha, separation: 12 }).chi) < 1e-12);
});

test('LLL curve samples preserve the requested separation units and reject invalid parameters', () => {
  const curve = P.lllPairCorrelationCurve({ alpha: 1 / 3, maxSeparation: 6, points: 13 });
  assert.equal(curve.length, 13);
  curve.forEach((point, index) => {
    close(point.separation, index / 2);
    assert.deepEqual(point, P.lllPairCorrelation({ alpha: 1 / 3, separation: index / 2 }));
  });
  for (const alpha of [-0.1, 1.1, NaN, Infinity, '0.5']) assert.throws(() => P.lllPairCorrelation({ alpha, separation: 1 }));
  for (const separation of [-1, 12.1, NaN, Infinity, '2']) assert.throws(() => P.lllPairCorrelation({ alpha: 0.5, separation }));
  assert.throws(() => P.lllPairCorrelationCurve({ alpha: 0.5, points: 1 }));
  assert.throws(() => P.lllPairCorrelationCurve({ alpha: 0.5, points: 2002 }));
  assert.throws(() => P.lllPairCorrelationCurve({ alpha: 0.5, maxSeparation: 13 }));
});

test('Periodic strings distinguish contractible closure, torus windings, and inverse operations', () => {
  const size = 5;
  const empty = P.memoryStringState([], size);
  assert.equal(empty.closed, true);
  assert.deepEqual(empty.logicalParity, { x: 0, y: 0 });
  let result = P.memoryStringStep([], '0,0', '4,0', size);
  assert.deepEqual(result.defects, ['0,0', '4,0']);
  assert.equal(result.closed, false);
  assert.equal(result.logicalParity, null);
  assert.deepEqual(result.cutParity, { x: 1, y: 0 });
  assert.deepEqual(P.memoryStringStep(result.edges, '4,0', '0,0', size), empty);
  // A contractible square may cross both drawing seams without winding.
  const square = ['0,0', '4,0', '4,4', '0,4', '0,0'];
  result = empty;
  for (let i = 1; i < square.length; i++) result = P.memoryStringStep(result.edges, square[i - 1], square[i], size);
  assert.deepEqual(result.defects, []);
  assert.deepEqual(result.logicalParity, { x: 0, y: 0 });
  const horizontal = Array.from({ length: size }, (_, x) => [`${x},2`, `${(x + 1) % size},2`]);
  const vertical = Array.from({ length: size }, (_, y) => [`3,${y}`, `3,${(y + 1) % size}`]);
  assert.deepEqual(P.memoryStringState(horizontal, size).logicalParity, { x: 1, y: 0 });
  assert.deepEqual(P.memoryStringState(vertical, size).logicalParity, { x: 0, y: 1 });
  assert.deepEqual(P.memoryStringState(horizontal.concat(vertical), size).logicalParity, { x: 1, y: 1 });
  assert.deepEqual(P.memoryStringState(horizontal.concat(result.edges), size).logicalParity, { x: 1, y: 0 });
  assert.deepEqual(P.memoryStringState(horizontal.concat(horizontal.map(edge => edge.slice().reverse())), size), empty);
  // Two parallel noncontractible cycles have even winding and are stabilizers.
  const shifted = horizontal.map(edge => edge.map(key => key.replace(',2', ',3')));
  assert.deepEqual(P.memoryStringState(horizontal.concat(shifted), size).logicalParity, { x: 0, y: 0 });
});

test('Periodic syndromes and logical commutations match independent edge-qubit Pauli algebra', () => {
  // A 3x3 torus has 18 edge qubits. Represent X support and every Z check as
  // bit masks on the *primal* edges; overlap parity gives anticommutation.
  const size = 3, horizontal = (x, y) => 1 << (y * size + x), vertical = (x, y) => 1 << (size * size + y * size + x);
  const physicalEdges = [], checks = [];
  let verticalLogicalZ = 0, horizontalLogicalZ = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    physicalEdges.push({ cells: [`${x},${y}`, `${(x + 1) % size},${y}`], mask: vertical((x + 1) % size, y) });
    physicalEdges.push({ cells: [`${x},${y}`, `${x},${(y + 1) % size}`], mask: horizontal(x, (y + 1) % size) });
    checks.push({ cell: `${x},${y}`, mask: horizontal(x, y) | horizontal(x, (y + 1) % size) | vertical(x, y) | vertical((x + 1) % size, y) });
    if (x === 0) verticalLogicalZ |= vertical(x, y);
    if (y === 0) horizontalLogicalZ |= horizontal(x, y);
  }
  function parity(mask) {
    let result = 0;
    while (mask) { result ^= 1; mask &= mask - 1; }
    return result;
  }
  // Deterministic bit-pattern sample, including the empty/full configurations.
  const patterns = [0, (1 << 18) - 1];
  let seed = 2026;
  for (let i = 0; i < 256; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; patterns.push(seed & ((1 << 18) - 1)); }
  for (const pattern of patterns) {
    let operator = 0;
    const edges = physicalEdges.filter((entry, index) => (pattern >>> index) & 1).map(entry => { operator ^= entry.mask; return entry.cells; });
    const result = P.memoryStringState(edges, size);
    const expectedDefects = checks.filter(check => parity(operator & check.mask)).map(check => check.cell).sort();
    assert.deepEqual(result.defects, expectedDefects);
    assert.equal(result.defects.length % 2, 0);
    assert.deepEqual(result.cutParity, { x: parity(operator & verticalLogicalZ), y: parity(operator & horizontalLogicalZ) });
    assert.equal(result.closed, expectedDefects.length === 0);
    assert.deepEqual(result.logicalParity, result.closed ? result.cutParity : null);
  }
});

test('Periodic string validation excludes ambiguous small lattices and preserves inputs', () => {
  const input = Object.freeze([Object.freeze(['4,0', '0,0'])]);
  const result = P.memoryStringStep(input, '0,0', '0,4', 5);
  assert.deepEqual(input, [['4,0', '0,0']]);
  assert.deepEqual(result.defects, ['0,4', '4,0']);
  result.edges[0][0] = '2,2';
  assert.deepEqual(input, [['4,0', '0,0']]);
  for (const size of [0, 1, 2, 3.5, 65, NaN]) assert.throws(() => P.memoryStringState([], size));
  for (const invalid of ['-1,0', '01,0', '1.0,0', '1, 0', '5,0', '0,5', '9007199254740992,0']) assert.throws(() => P.memoryStringStep([], invalid, '0,0', 5));
  assert.throws(() => P.memoryStringState(null));
  assert.throws(() => P.memoryStringStep(null, '0,0', '1,0'));
  assert.throws(() => P.memoryStringState([['0,0']]));
  assert.throws(() => P.memoryStringStep([], '0,0', '0,0', 5));
  assert.throws(() => P.memoryStringStep([], '0,0', '2,0', 5));
  assert.throws(() => P.memoryStringStep([], '0,0', '1,1', 5));
  assert.throws(() => P.memoryStringStep([['0,0', '2,0']], '0,0', '1,0', 5));
  assert.deepEqual(P.memoryStringStep([], '0,0', '63,0', 64).cutParity, { x: 1, y: 0 });
});

test('Normalized readouts remain scale invariant across floating-point extremes', () => {
  // This state has exact probabilities 9/25 and 16/25, Bloch components
  // (0,24/25,-7/25), and an explicitly orthogonal partner (4,-3i).
  const first = [[3, 0], [0, 4]], orthogonal = [[4, 0], [0, -3]];
  const scaleState = (state, scale) => state.map(amplitude => amplitude.map(value => value * scale));
  for (const scale of [1e-300, 1e-200, 1e-100, 1, 1e100, 1e200, 1e300]) {
    const state = scaleState(first, scale);
    const other = scaleState(orthogonal, 1 / scale);
    sameState([P.probabilities(state)], [[9 / 25, 16 / 25]]);
    const components = P.bloch(state);
    close(components.x, 0);
    close(components.y, 24 / 25);
    close(components.z, -7 / 25);
    close(P.measurementProbabilities(state, 'x').plus, 1 / 2);
    close(P.measurementProbabilities(state, 'y').plus, 49 / 50);
    close(P.measurementProbabilities(state, 'z').plus, 9 / 25);
    close(P.fidelity(state, first), 1);
    close(P.fidelity(state, other), 0);
    close(P.fidelity(state, [[1, 0], [0, 0]]), 9 / 25);
    // Overall complex phase, as well as independently chosen magnitude,
    // cannot affect the overlap or either encoded measurement.
    const phased = state.map(([real, imaginary]) => [-imaginary, real]);
    close(P.fidelity(state, phased), 1);
    sameState([P.probabilities(phased)], [[9 / 25, 16 / 25]]);
  }
  for (const magnitude of [Number.MIN_VALUE, Number.MAX_VALUE]) {
    const plusY = [[magnitude, 0], [0, magnitude]];
    sameState([P.probabilities(plusY)], [[0.5, 0.5]]);
    close(P.bloch(plusY).y, 1);
    close(P.fidelity(plusY, P.isingInitial('plusY')), 1);
  }
  for (const invalid of [[[0, 0], [0, 0]], [[NaN, 0], [0, 1]], [[Infinity, 0], [0, 1]], [[1, 0], [0, -Infinity]]]) {
    for (const readout of [P.probabilities, P.bloch, state => P.fidelity(state, first), state => P.fidelity(first, state)]) assert.throws(() => readout(invalid));
  }
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
