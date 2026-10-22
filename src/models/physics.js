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
    const scale = Math.max(...state.flat().map(Math.abs));
    if (scale === 0) throw new RangeError('State must have a nonzero amplitude.');
    return scale;
  }

  // Physical readouts do not depend on the overall amplitude scale. Divide
  // by the largest component before forming a norm, so even finite states
  // near the floating-point extremes can be normalized without overflow or
  // underflow. Linear evolution itself still preserves the supplied scale.
  function scaledState(state) {
    const scale = validateState(state);
    return state.map(amplitude => amplitude.map(value => value / scale));
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
    const phase = polar(totalPhase);
    // In the two-path basis, visibility reduces the off-diagonal coherence.
    // Recombination is H rho H, with H the balanced Hadamard beam splitter.
    const pathDensityMatrix = [
      [[0.5, 0], [visibility * phase[0] / 2, -visibility * phase[1] / 2]],
      [[visibility * phase[0] / 2, visibility * phase[1] / 2], [0.5, 0]]
    ];
    // Only V=1 specifies a pure path state (1, exp(i Delta))/sqrt(2).
    // Its output amplitudes use this chosen overall phase convention.
    const coherentOutputAmplitudes = visibility === 1
      ? [[(1 + phase[0]) / 2, phase[1] / 2], [(1 - phase[0]) / 2, -phase[1] / 2]]
      : null;
    return { statisticalPhase, totalPhase, p0, p1: 1 - p0, pathDensityMatrix, coherentOutputAmplitudes };
  }

  // Localized two-anyon states in the lowest Landau level, following
  // Vishveshwara and Cooper, arXiv:0908.3945, Eqs. (3), (5), and (6).
  // separation=|z| is packet-center separation in single-particle magnetic
  // lengths ell; alpha=theta/pi. The relative guiding-center angular momenta
  // are (2k+alpha) hbar. With u=|z|^2/4 their probabilities are proportional
  // to u^(2k+alpha)/Gamma(2k+alpha+1). Cancel the common factor to start at 1.
  // chi is the excess mean squared guiding-center separation divided by
  // 4 ell^2. Positive chi means antibunching; this is not a g^(2) function.
  function lllPairCorrelation({ alpha, separation }) {
    finite(alpha, 'Statistics parameter');
    finite(separation, 'Packet separation');
    if (alpha < 0 || alpha > 1) throw new RangeError('Statistics parameter must lie between 0 and 1.');
    if (separation < 0 || separation > 12) throw new RangeError('Packet separation must lie between 0 and 12 magnetic lengths.');
    const u = separation * separation / 4;
    const rawWeights = [];
    let weight = 1, total = 0, totalCorrection = 0, excess = 0, excessCorrection = 0;
    let errorBound = Infinity, omittedProbabilityBound = Infinity;
    for (let k = 0; k < 1000; k++) {
      const angularMomentum = 2 * k + alpha;
      rawWeights.push({ k, angularMomentum, weight });
      // Compensated sums also retain accuracy when the excess nearly cancels.
      const totalIncrement = weight - totalCorrection;
      const nextTotal = total + totalIncrement;
      totalCorrection = (nextTotal - total) - totalIncrement;
      total = nextTotal;
      const excessIncrement = (angularMomentum - u) * weight - excessCorrection;
      const nextExcess = excess + excessIncrement;
      excessCorrection = (nextExcess - excess) - excessIncrement;
      excess = nextExcess;

      const ratio = u * u / ((angularMomentum + 1) * (angularMomentum + 2));
      const nextWeight = weight * ratio;
      if (ratio < 1) {
        // Later ratios decrease. A geometric series bounds all omitted
        // weights and their first angular-momentum moment, so this is an
        // absolute truncation bound for chi (floating roundoff is separate).
        const tailWeight = nextWeight / (1 - ratio);
        const tailAngularMoment = nextWeight * ((angularMomentum + 2) / (1 - ratio) + 2 * ratio / ((1 - ratio) ** 2));
        omittedProbabilityBound = tailWeight / total;
        errorBound = (tailAngularMoment + (u + Math.abs(excess / total)) * tailWeight) / total;
        if (errorBound <= 1e-15) break;
      }
      weight = nextWeight;
      if (k === 999) throw new Error('The lowest-Landau-level sum did not converge.');
    }
    // At separation=0 this is the continuous normalized-state limit |0,alpha>.
    // The endpoint formulas avoid cancellation of exponentially small tails.
    let chi = excess / total;
    if (alpha === 0) chi = -2 * u / (Math.expm1(2 * u) + 2);
    if (alpha === 1) chi = u === 0 ? 1 : 2 * u / Math.expm1(2 * u);
    const meanAngularMomentum = u + chi;
    const weights = rawWeights.map(entry => ({ k: entry.k, angularMomentum: entry.angularMomentum, probability: entry.weight / total }));
    return {
      alpha, separation, u, chi, meanAngularMomentum,
      meanSeparationSquared: 4 * meanAngularMomentum + 2,
      distinguishableMeanSeparationSquared: separation * separation + 2,
      weights, termsUsed: weights.length, errorBound, omittedProbabilityBound
    };
  }

  function lllPairCorrelationCurve({ alpha, maxSeparation = 6, points = 121 }) {
    finite(maxSeparation, 'Maximum packet separation');
    if (maxSeparation < 0 || maxSeparation > 12) throw new RangeError('Maximum separation must lie between 0 and 12 magnetic lengths.');
    integer(points, 'Number of curve points', 2, 2001);
    return Array.from({ length: points }, (_, index) => lllPairCorrelation({ alpha, separation: maxSeparation * index / (points - 1) }));
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
    if (name === 'plusY') return [[Math.SQRT1_2, 0], [0, Math.SQRT1_2]];
    throw new RangeError('Initial state must be vacuum, fermion, plus, or plusY.');
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
    const weights = scaledState(state).map(magnitudeSquared);
    const norm = weights[0] + weights[1];
    return weights.map(weight => weight / norm);
  }

  function bloch(state) {
    const scaled = scaledState(state);
    const norm = magnitudeSquared(scaled[0]) + magnitudeSquared(scaled[1]);
    const product = multiply(conjugate(scaled[0]), scaled[1]);
    return {
      x: 2 * product[0] / norm,
      y: 2 * product[1] / norm,
      z: (magnitudeSquared(scaled[0]) - magnitudeSquared(scaled[1])) / norm
    };
  }

  // Born probabilities for the +/-1 eigenstates of a Pauli operator in the
  // encoded qubit. X or Y readout needs a basis change before ordinary fusion
  // measurement. Normalize the input, as in probabilities() and bloch().
  function measurementProbabilities(state, axis = 'z') {
    if (!['x', 'y', 'z'].includes(axis)) throw new RangeError('Measurement axis must be x, y, or z.');
    const expectation = Math.max(-1, Math.min(1, bloch(state)[axis]));
    const plus = (1 + expectation) / 2;
    return { plus, minus: 1 - plus, expectation };
  }

  function fidelity(a, b) {
    const first = scaledState(a), second = scaledState(b);
    const normA = magnitudeSquared(first[0]) + magnitudeSquared(first[1]);
    const normB = magnitudeSquared(second[0]) + magnitudeSquared(second[1]);
    const overlap = add(multiply(conjugate(first[0]), second[0]), multiply(conjugate(first[1]), second[1]));
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

  // Select one fusion-basis path without enumerating an exponentially large
  // list. At each step, count the paths in the vacuum branch before deciding
  // which branch contains index. The ordering is identical to fibonacciPaths:
  // cumulative vacuum charge precedes tau wherever both choices are allowed.
  function fibonacciPathAt(n, totalCharge, index) {
    integer(n, 'Anyon count', 0, 70);
    if (!['vacuum', 'tau'].includes(totalCharge)) throw new RangeError('A fixed total charge must be vacuum or tau.');

    // completions[r][charge] counts ways to reach the chosen final charge
    // from this intermediate charge after adding r further tau anyons.
    const completions = [{ vacuum: totalCharge === 'vacuum' ? 1 : 0, tau: totalCharge === 'tau' ? 1 : 0 }];
    for (let remaining = 1; remaining <= n; remaining++) {
      const previous = completions[remaining - 1];
      completions.push({ vacuum: previous.tau, tau: previous.vacuum + previous.tau });
    }
    const count = completions[n].vacuum;
    if (count === 0) throw new RangeError('This total-charge sector has no fusion paths for the chosen anyon count.');
    integer(index, 'Fusion-path index', 0, count - 1);

    const path = [];
    let charge = 'vacuum';
    for (let step = 0; step < n; step++) {
      const remaining = n - step - 1;
      if (charge === 'vacuum') charge = 'tau';
      else {
        const vacuumBranchCount = completions[remaining].vacuum;
        if (index < vacuumBranchCount) charge = 'vacuum';
        else {
          index -= vacuumBranchCount;
          charge = 'tau';
        }
      }
      path.push(charge);
    }
    return path;
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

  // Apply X on the lattice edge shared by two neighboring plaquettes.
  // Plaquette labels are nonnegative integer "column,row" keys. A sequence
  // of these operations is a dual-lattice string: its odd-incidence endpoints
  // are m excitations, since X flips the adjacent B_p=product(Z) eigenvalues.
  // Repeating an edge cancels it (X^2=I). Geometry bounds belong to the UI.
  function toricStringStep(edges, from, to) {
    if (!Array.isArray(edges)) throw new TypeError('String edges must be an array of cell-key pairs.');
    const coordinates = new Map();
    function parseCell(key) {
      if (typeof key !== 'string' || !/^(0|[1-9]\d*),(0|[1-9]\d*)$/.test(key)) {
        throw new TypeError('A cell key must be column,row with nonnegative integers and no leading zeros.');
      }
      const point = key.split(',').map(Number);
      if (!point.every(Number.isSafeInteger)) throw new RangeError('Cell coordinates must be safe integers.');
      coordinates.set(key, point);
      return point;
    }
    function compareCells(a, b) {
      const first = coordinates.get(a), second = coordinates.get(b);
      return first[0] - second[0] || first[1] - second[1];
    }
    function canonicalEdge(a, b) {
      const first = parseCell(a), second = parseCell(b);
      if (Math.abs(first[0] - second[0]) + Math.abs(first[1] - second[1]) !== 1) {
        throw new RangeError('A string step must join nearest-neighbor plaquettes.');
      }
      return compareCells(a, b) < 0 ? [a, b] : [b, a];
    }
    const edgeParity = new Map();
    function toggle(a, b) {
      const edge = canonicalEdge(a, b);
      const key = edge.join('|');
      if (edgeParity.has(key)) edgeParity.delete(key);
      else edgeParity.set(key, edge);
    }
    for (const edge of edges) {
      if (!Array.isArray(edge) || edge.length !== 2) throw new TypeError('Each string edge must contain exactly two cell keys.');
      toggle(edge[0], edge[1]);
    }
    toggle(from, to);
    const updatedEdges = Array.from(edgeParity.values()).sort((a, b) => compareCells(a[0], b[0]) || compareCells(a[1], b[1]));
    const oddIncidence = new Set();
    for (const edge of updatedEdges) for (const cell of edge) {
      if (oddIncidence.has(cell)) oddIncidence.delete(cell);
      else oddIncidence.add(cell);
    }
    return { edges: updatedEdges, defects: Array.from(oddIncidence).sort(compareCells) };
  }

  // X strings on an L by L periodic dual lattice, initially in the toric-code
  // ground space. L>=3 makes an undirected pair of neighboring cell labels
  // identify one edge even across a seam (L=2 would have parallel edges).
  // Cut parities count seam crossings. Only an endpoint-free operator maps
  // the ground space back into itself, so logicalParity is null otherwise.
  // An x-winding X string anticommutes with the vertical direct-lattice Z
  // loop; y winding anticommutes with the horizontal Z loop. These describe
  // logical operations, not measurement outcomes for an unspecified state.
  function memoryStringState(edges, size = 6) {
    integer(size, 'Periodic lattice size', 3, 64);
    if (!Array.isArray(edges)) throw new TypeError('String edges must be an array of cell-key pairs.');
    const coordinates = new Map();
    function parseCell(key) {
      if (typeof key !== 'string' || !/^(0|[1-9]\d*),(0|[1-9]\d*)$/.test(key)) {
        throw new TypeError('A cell key must be column,row with nonnegative integers and no leading zeros.');
      }
      const point = key.split(',').map(Number);
      point.forEach(value => integer(value, 'Periodic cell coordinate', 0, size - 1));
      coordinates.set(key, point);
      return point;
    }
    function compareCells(a, b) {
      const first = coordinates.get(a), second = coordinates.get(b);
      return first[0] - second[0] || first[1] - second[1];
    }
    const edgeParity = new Map();
    for (const edge of edges) {
      if (!Array.isArray(edge) || edge.length !== 2) throw new TypeError('Each string edge must contain exactly two cell keys.');
      const a = parseCell(edge[0]), b = parseCell(edge[1]);
      const dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]);
      if (!((dy === 0 && (dx === 1 || dx === size - 1)) || (dx === 0 && (dy === 1 || dy === size - 1)))) {
        throw new RangeError('A periodic string step must join nearest-neighbor plaquettes, including wrapped neighbors.');
      }
      const canonical = compareCells(edge[0], edge[1]) < 0 ? edge.slice() : [edge[1], edge[0]];
      const key = canonical.join('|');
      if (edgeParity.has(key)) edgeParity.delete(key);
      else edgeParity.set(key, canonical);
    }
    const updatedEdges = Array.from(edgeParity.values()).sort((a, b) => compareCells(a[0], b[0]) || compareCells(a[1], b[1]));
    const oddIncidence = new Set();
    const cutParity = { x: 0, y: 0 };
    for (const edge of updatedEdges) {
      for (const cell of edge) {
        if (oddIncidence.has(cell)) oddIncidence.delete(cell); else oddIncidence.add(cell);
      }
      const a = coordinates.get(edge[0]), b = coordinates.get(edge[1]);
      if (Math.abs(a[0] - b[0]) === size - 1) cutParity.x ^= 1;
      if (Math.abs(a[1] - b[1]) === size - 1) cutParity.y ^= 1;
    }
    const defects = Array.from(oddIncidence).sort(compareCells);
    const closed = defects.length === 0;
    return { size, edges: updatedEdges, defects, closed, cutParity, logicalParity: closed ? { ...cutParity } : null };
  }

  function memoryStringStep(edges, from, to, size = 6) {
    if (!Array.isArray(edges)) throw new TypeError('String edges must be an array of cell-key pairs.');
    return memoryStringState(edges.concat([[from, to]]), size);
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
    TAU, abelianPhase, interference, lllPairCorrelation, lllPairCorrelationCurve,
    isingInitial, isingBraid, applyMatrix,
    applyBraidWord, probabilities, bloch, measurementProbabilities, fidelity,
    fibonacciCounts, fibonacciPaths, fibonacciPathAt, toricPhase, toricStringStep,
    memoryStringState, memoryStringStep, windingNumber
  });
});
