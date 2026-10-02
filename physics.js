/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * Small, deterministic anyon models. Angles are dimensionless radians.
 * Complex numbers are [real, imaginary]; states are column vectors.
 * Scientific conventions and sources are documented in docs/notes.md.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AnyonPhysics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const multiply = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const conjugate = a => [a[0], -a[1]];
  const magnitudeSquared = a => a[0] * a[0] + a[1] * a[1];
  const polar = angle => [Math.cos(angle), Math.sin(angle)];

  function finite(value, name) {
    if (!Number.isFinite(value)) throw new TypeError(name + ' must be finite.');
    return value;
  }

  function integer(value, name, min, max) {
    if (!Number.isSafeInteger(value) || value < min || value > max) {
      throw new RangeError(name + ' must be an integer from ' + min + ' to ' + max + '.');
    }
    return value;
  }

  function validateState(state) {
    if (!Array.isArray(state) || state.length !== 2) throw new TypeError('A state needs two complex amplitudes.');
    state.forEach(amplitude => {
      if (!Array.isArray(amplitude) || amplitude.length !== 2) throw new TypeError('Complex amplitudes use [real, imaginary].');
      amplitude.forEach(value => finite(value, 'Amplitude'));
    });
    const norm = state.reduce((sum, amplitude) => sum + magnitudeSquared(amplitude), 0);
    if (!(norm > 0) || !Number.isFinite(norm)) throw new RangeError('State norm must be positive and finite.');
    return norm;
  }

  function abelianPhase(theta, exchanges) {
    finite(theta, 'Exchange angle');
    integer(exchanges, 'Number of completed exchanges', -1000000, 1000000);
    const angle = theta * exchanges;
    finite(angle, 'Accumulated angle');
    return { angle, wrappedAngle: Math.atan2(Math.sin(angle), Math.cos(angle)), phase: polar(angle) };
  }

  // Balanced two-path readout. The enclosed objects have the same Abelian type
  // as the moving probe. One full winding equals two exchanges. The reference
  // phase absorbs non-statistical path phases; visibility is phenomenological.
  function interference({ theta, enclosed = 1, winding = 1, referencePhase = 0, visibility = 1 }) {
    finite(theta, 'Exchange angle');
    integer(enclosed, 'Enclosed count', 0, 1000000);
    integer(winding, 'Winding count', -1000000, 1000000);
    finite(referencePhase, 'Reference phase');
    finite(visibility, 'Visibility');
    if (visibility < 0 || visibility > 1) throw new RangeError('Visibility must lie between 0 and 1.');
    const statisticalPhase = 2 * enclosed * winding * theta;
    const totalPhase = statisticalPhase + referencePhase;
    finite(totalPhase, 'Total phase');
    const p0 = (1 + visibility * Math.cos(totalPhase)) / 2;
    return { statisticalPhase, totalPhase, p0, p1: 1 - p0 };
  }

  function applyMatrix(matrix, state) {
    validateState(state);
    if (!Array.isArray(matrix) || matrix.length !== 2 || matrix.some(row => !Array.isArray(row) || row.length !== 2)) {
      throw new TypeError('The braid matrix must be 2 by 2.');
    }
    matrix.flat().forEach(amplitude => {
      if (!Array.isArray(amplitude) || amplitude.length !== 2) throw new TypeError('Complex matrix entries use [real, imaginary].');
      amplitude.forEach(value => finite(value, 'Matrix entry'));
    });
    return matrix.map(row => add(multiply(row[0], state[0]), multiply(row[1], state[1])));
  }

  function isingInitial(name = 'vacuum') {
    if (name === 'vacuum') return [[1, 0], [0, 0]];
    if (name === 'fermion') return [[0, 0], [1, 0]];
    if (name === 'plus') return [[Math.SQRT1_2, 0], [Math.SQRT1_2, 0]];
    throw new RangeError('Initial state must be vacuum, fermion, or plus.');
  }

  // Four Ising sigma anyons, fixed total vacuum charge. Basis 0/1 means that
  // particles 1 and 2 fuse to vacuum/psi; particles 3 and 4 then have that same
  // charge. Positive generators mean counterclockwise exchange. R is the
  // standard Ising R matrix and F=H, so B2=F R F; B1=B3=R.
  function isingBraid(index, direction = 1) {
    integer(index, 'Generator index', 1, 3);
    if (direction !== 1 && direction !== -1) throw new RangeError('Direction must be +1 or -1.');
    const r0 = polar(-Math.PI / 8);
    const r1 = polar(3 * Math.PI / 8);
    let matrix;
    if (index === 2) {
      const diagonal = [(r0[0] + r1[0]) / 2, (r0[1] + r1[1]) / 2];
      const offDiagonal = [(r0[0] - r1[0]) / 2, (r0[1] - r1[1]) / 2];
      matrix = [[diagonal.slice(), offDiagonal.slice()], [offDiagonal.slice(), diagonal.slice()]];
    } else matrix = [[r0, [0, 0]], [[0, 0], r1]];
    // These matrices are symmetric, so conjugation is also the adjoint.
    return direction === 1 ? matrix : matrix.map(row => row.map(conjugate));
  }

  // Word order is chronological: [1,2] applies B1 first and B2 second.
  // The final matrix product is therefore B2 B1, acting on a column vector.
  function applyBraidWord(word, initial = 'vacuum') {
    if (!Array.isArray(word)) throw new TypeError('A braid word must be an array.');
    let state = typeof initial === 'string' ? isingInitial(initial) : initial.map(amplitude => amplitude.slice());
    validateState(state);
    for (const generator of word) {
      if (!Number.isInteger(generator)) throw new TypeError('Braid generators must be signed integers.');
      integer(Math.abs(generator), 'Generator magnitude', 1, 3);
      state = applyMatrix(isingBraid(Math.abs(generator), Math.sign(generator)), state);
    }
    return state;
  }

  function probabilities(state) {
    const norm = validateState(state);
    return state.map(amplitude => magnitudeSquared(amplitude) / norm);
  }

  function bloch(state) {
    const norm = validateState(state);
    const product = multiply(conjugate(state[0]), state[1]);
    return {
      x: 2 * product[0] / norm,
      y: 2 * product[1] / norm,
      z: (magnitudeSquared(state[0]) - magnitudeSquared(state[1])) / norm
    };
  }

  function fidelity(a, b) {
    const normA = validateState(a);
    const normB = validateState(b);
    const overlap = add(multiply(conjugate(a[0]), b[0]), multiply(conjugate(a[1]), b[1]));
    return Math.min(1, Math.max(0, magnitudeSquared(overlap) / (normA * normB)));
  }

  // Count a left-associated fusion basis for n Fibonacci tau anyons.
  // tau x tau = 1 + tau; 1 x tau = tau. Counts are dimensions, not probabilities.
  // n<=70 keeps every result exactly representable as a JavaScript integer.
  function fibonacciCounts(n) {
    integer(n, 'Anyon count', 0, 70);
    let vacuum = 1;
    let tau = 0;
    for (let step = 0; step < n; step++) [vacuum, tau] = [tau, vacuum + tau];
    return { n, vacuum, tau, total: vacuum + tau };
  }

  // A path lists the cumulative charge after adding each successive tau.
  // The initial vacuum is implicit. Every path is one basis state, not a
  // classical fusion history that necessarily occurred.
  function fibonacciPaths(n, totalCharge = 'either') {
    integer(n, 'Anyon count for explicit paths', 0, 12);
    if (!['either', 'vacuum', 'tau'].includes(totalCharge)) throw new RangeError('Unknown total charge.');
    let paths = [[]];
    for (let step = 0; step < n; step++) {
      const next = [];
      for (const path of paths) {
        const lastCharge = path.length ? path[path.length - 1] : 'vacuum';
        if (lastCharge === 'tau') next.push(path.concat('vacuum'));
        next.push(path.concat('tau'));
      }
      paths = next;
    }
    return paths.filter(path => totalCharge === 'either' || (path.length ? path[path.length - 1] : 'vacuum') === totalCharge);
  }

  // Mutual statistics only: an e excitation winding around m excitations in
  // the toric-code anyon model gives (-1)^(N*w). Same-type e/e and m/m exchanges
  // are bosonic. This function does not evolve the lattice many-body state.
  function toricPhase(enclosedCount, windings = 1) {
    integer(enclosedCount, 'Enclosed m count', 0, 1000000);
    integer(windings, 'Winding count', -1000000, 1000000);
    const angle = Math.PI * enclosedCount * windings;
    const sign = (enclosedCount * windings) % 2 === 0 ? 1 : -1;
    return { angle, phase: [sign, 0], sign };
  }

  // Signed winding number of a polygon about a point, in Cartesian x/y.
  // A point on the path returns null: moving through the anyon is outside
  // the separated-anyon approximation and must not receive a braid phase.
  function windingNumber(point, polygon) {
    finite(point.x, 'Point x');
    finite(point.y, 'Point y');
    if (!Array.isArray(polygon) || polygon.length < 3) throw new RangeError('A loop needs at least three vertices.');
    polygon.forEach(vertex => { finite(vertex.x, 'Vertex x'); finite(vertex.y, 'Vertex y'); });
    let winding = 0;
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const px = point.x - a.x;
      const py = point.y - a.y;
      const cross = dx * py - dy * px;
      const lengthSquared = dx * dx + dy * dy;
      const coordinateScale = Math.max(1, Math.abs(dx), Math.abs(dy), Math.abs(px), Math.abs(py));
      const epsilon = 1e-10 * coordinateScale * coordinateScale;
      if (lengthSquared === 0) {
        if (px * px + py * py <= epsilon) return null;
        continue;
      }
      const projection = px * dx + py * dy;
      if (Math.abs(cross) <= epsilon && projection >= -epsilon && projection <= lengthSquared + epsilon) return null;
      if (a.y <= point.y && b.y > point.y && cross > 0) winding++;
      if (a.y > point.y && b.y <= point.y && cross < 0) winding--;
    }
    return winding;
  }

  return Object.freeze({
    TAU, abelianPhase, interference, isingInitial, isingBraid, applyMatrix,
    applyBraidWord, probabilities, bloch, fidelity, fibonacciCounts,
    fibonacciPaths, toricPhase, windingNumber
  });
});
