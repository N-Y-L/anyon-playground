/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * Three Fibonacci tau anyons, fixed total charge tau; channels [1, tau].
 * Complex entries are [real, imaginary]; states are column vectors.
 * Right-handed chirality, positive = counterclockwise, as in Bseiso et al.,
 * arXiv:2407.21761v2, Sec. II.1, Eqs. (2)-(3). The opposite chirality
 * conjugates R. No dynamical or electromagnetic transport phase is included.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FusionBasisPhysics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const phi = (1 + Math.sqrt(5)) / 2;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const multiply = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const conjugate = a => [a[0], -a[1]];
  const absoluteSquared = a => a[0] ** 2 + a[1] ** 2;
  const phase = angle => [Math.cos(angle), Math.sin(angle)];
  const identity = () => [[[1, 0], [0, 0]], [[0, 0], [1, 0]]];

  function validateComplex(value) {
    if (!Array.isArray(value) || value.length !== 2 || !value.every(Number.isFinite)) {
      throw new TypeError('Complex numbers must contain two finite real components.');
    }
  }
  function validateState(state) {
    if (!Array.isArray(state) || state.length !== 2) throw new TypeError('A state needs two complex amplitudes.');
    state.forEach(validateComplex);
    if (!state.flat().some(value => value !== 0)) throw new RangeError('The zero vector is not a state.');
  }
  function validateMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length !== 2 || matrix.some(row => !Array.isArray(row) || row.length !== 2)) {
      throw new TypeError('A matrix must be 2 by 2.');
    }
    matrix.flat().forEach(validateComplex);
  }
  function normalized(state) {
    validateState(state);
    const scale = Math.max(...state.flat().map(Math.abs));
    const scaled = state.map(a => a.map(value => value / scale));
    const norm = Math.sqrt(scaled.reduce((sum, a) => sum + absoluteSquared(a), 0));
    return scaled.map(a => a.map(value => value / norm));
  }
  function applyMatrix(matrix, state) {
    validateMatrix(matrix);
    validateState(state);
    return matrix.map(row => add(multiply(row[0], state[0]), multiply(row[1], state[1])));
  }
  function matrixProduct(a, b) {
    validateMatrix(a);
    validateMatrix(b);
    return a.map(row => b[0].map((_, column) => add(multiply(row[0], b[0][column]), multiply(row[1], b[1][column]))));
  }
  function adjoint(matrix) {
    validateMatrix(matrix);
    return matrix[0].map((_, column) => matrix.map(row => conjugate(row[column])));
  }
  function fMatrix() {
    return [[[1 / phi, 0], [1 / Math.sqrt(phi), 0]], [[1 / Math.sqrt(phi), 0], [-1 / phi, 0]]];
  }
  function braidMatrix(index, direction = 1) {
    if (index !== 1 && index !== 2) throw new RangeError('The adjacent pair index must be 1 or 2.');
    if (direction !== 1 && direction !== -1) throw new RangeError('Direction must be +1 (counterclockwise) or -1 (clockwise).');
    const r = [[phase(-4 * Math.PI / 5), [0, 0]], [[0, 0], phase(3 * Math.PI / 5)]];
    const forward = index === 1 ? r : matrixProduct(fMatrix(), matrixProduct(r, fMatrix()));
    return direction === 1 ? forward : adjoint(forward);
  }
  function initialState(channel = 'vacuum') {
    if (channel === 'vacuum') return [[1, 0], [0, 0]];
    if (channel === 'tau') return [[0, 0], [1, 0]];
    if (channel === 'plus') return [[Math.SQRT1_2, 0], [Math.SQRT1_2, 0]];
    if (channel === 'plusY') return [[Math.SQRT1_2, 0], [0, Math.SQRT1_2]];
    throw new RangeError('Unknown initial state.');
  }
  // F is real, symmetric, and its own inverse in this gauge. This changes
  // coordinates between pair-12 and pair-23 fusion bases, not the state.
  function changeBasis(state) { return applyMatrix(fMatrix(), state); }
  function probabilities(state) { return normalized(state).map(absoluteSquared); }
  function fidelity(a, b) {
    const first = normalized(a), second = normalized(b);
    const overlap = add(multiply(conjugate(first[0]), second[0]), multiply(conjugate(first[1]), second[1]));
    return Math.max(0, Math.min(1, absoluteSquared(overlap)));
  }
  // Input words are chronological: [1,2] means B1 first, then B2, so U=B2 B1.
  function wordMatrix(word) {
    if (!Array.isArray(word)) throw new TypeError('A word must be an array of signed pair indices.');
    if (word.length > 1000) throw new RangeError('A word is limited to 1000 exchanges.');
    let result = identity();
    for (const generator of word) {
      if (![1, 2, -1, -2].includes(generator)) throw new RangeError('Generators must be 1, 2, -1, or -2.');
      result = matrixProduct(braidMatrix(Math.abs(generator), Math.sign(generator)), result);
    }
    return result;
  }
  function applyWord(word, state) { return applyMatrix(wordMatrix(word), state); }
  function matrixDistance(a, b) {
    validateMatrix(a);
    validateMatrix(b);
    return Math.sqrt(a.flat().reduce((sum, entry, index) => sum + entry.reduce((s, value, component) => s + (value - b.flat()[index][component]) ** 2, 0), 0));
  }
  function exchangeStages(state, direction = 1) {
    validateState(state);
    const left = state.map(a => a.slice());
    const right = changeBasis(left);
    const exchanged = applyMatrix(braidMatrix(1, direction), right);
    const final = changeBasis(exchanged);
    return [
      { basis: 'L', operation: 'prepare', physicalExchange: false, amplitudes: left },
      { basis: 'R', operation: 'F', physicalExchange: false, amplitudes: right },
      { basis: 'R', operation: 'R', physicalExchange: true, amplitudes: exchanged },
      { basis: 'L', operation: 'F-inverse', physicalExchange: false, amplitudes: final }
    ];
  }
  function compareWords(first, second, state) {
    const a = wordMatrix(first), b = wordMatrix(second);
    const stateA = applyMatrix(a, state), stateB = applyMatrix(b, state);
    return {
      stateA, stateB, matrixA: a, matrixB: b,
      matrixDistance: matrixDistance(a, b), fidelity: fidelity(stateA, stateB),
      pair12A: probabilities(stateA), pair12B: probabilities(stateB),
      pair23A: probabilities(changeBasis(stateA)), pair23B: probabilities(changeBasis(stateB))
    };
  }
  return Object.freeze({ phi, fMatrix, braidMatrix, initialState, changeBasis, applyMatrix, matrixProduct,
    adjoint, probabilities, fidelity, wordMatrix, applyWord, matrixDistance, exchangeStages, compareWords });
});
