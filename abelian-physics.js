/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * Fixed Abelian K-matrix examples. Rational exponents are exact; complex
 * coordinates are floating-point values used only to draw unit circles.
 * Positive winding is counterclockwise in the convention of abelian.html.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AbelianPhysics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function safe(value) {
    if (!Number.isSafeInteger(value)) throw new RangeError('Exact arithmetic requires safe integers.');
    return value;
  }
  function gcd(a, b) {
    while (b) [a, b] = [b, a % b];
    return a;
  }
  function rational(numerator, denominator = 1) {
    safe(numerator); safe(denominator);
    if (!denominator) throw new RangeError('A denominator must be nonzero.');
    if (denominator < 0) { numerator = -numerator; denominator = -denominator; }
    const divisor = gcd(Math.abs(numerator), denominator);
    return Object.freeze({ numerator: numerator === 0 ? 0 : numerator / divisor, denominator: denominator / divisor });
  }
  const add = (a, b) => rational(safe(safe(a.numerator * b.denominator) + safe(b.numerator * a.denominator)), safe(a.denominator * b.denominator));
  const multiply = (a, b) => rational(safe(a.numerator * b.numerator), safe(a.denominator * b.denominator));
  const negate = a => rational(-a.numerator, a.denominator);
  const modOne = a => rational(((a.numerator % a.denominator) + a.denominator) % a.denominator, a.denominator);
  const value = a => a.numerator / a.denominator;
  const format = a => a.denominator === 1 ? String(a.numerator) : `${a.numerator}/${a.denominator}`;

  function freezeDeep(object) {
    Object.values(object).forEach(item => { if (item && typeof item === 'object') freezeDeep(item); });
    return Object.freeze(object);
  }
  function makeModel(id, name, K, t, names, labels) {
    const determinant = K.length === 1 ? K[0][0] : K[0][0] * K[1][1] - K[0][1] * K[1][0];
    const inverse = K.length === 1 ? [[rational(1, determinant)]] : [
      [rational(K[1][1], determinant), rational(-K[0][1], determinant)],
      [rational(-K[1][0], determinant), rational(K[0][0], determinant)]
    ];
    const signature = K.length === 1 ? Math.sign(K[0][0]) : determinant < 0 ? 0 : 2 * Math.sign(K[0][0] + K[1][1]);
    return freezeDeep({ id, name, K, t, determinant, inverse, sectorCount: Math.abs(determinant),
      signature,
      localFermions: K.some((row, i) => Math.abs(row[i] % 2) === 1),
      sectors: names.map((name, i) => ({ name, label: labels[i] })) });
  }
  const models = freezeDeep({
    toric: makeModel('toric', 'Toric code', [[0, 2], [2, 0]], [0, 0], ['1', 'e', 'm', 'ε'], [[0, 0], [1, 0], [0, 1], [1, 1]]),
    doubleSemion: makeModel('doubleSemion', 'Double semion', [[2, 0], [0, -2]], [0, 0], ['1', 's', 's̄', 'b'], [[0, 0], [1, 0], [0, 1], [1, 1]]),
    laughlin2: makeModel('laughlin2', 'Bosonic Laughlin, K = 2', [[2]], [1], ['1', 'a'], [[0], [1]]),
    laughlin3: makeModel('laughlin3', 'Electronic Laughlin, K = 3', [[3]], [1], ['1', 'a', 'a²'], [[0], [1], [2]])
  });
  function modelFor(model) {
    const result = typeof model === 'string' ? models[model] : model;
    if (!result || models[result.id] !== result) throw new RangeError('Choose one of the four fixed models.');
    return result;
  }
  function vector(model, label) {
    if (!Array.isArray(label) || label.length !== model.K.length) throw new TypeError('Label dimension must match K.');
    label.forEach(component => {
      if (!Number.isSafeInteger(component) || Math.abs(component) > 1000000) throw new RangeError('Label components must be integers between −1000000 and 1000000.');
    });
    return label;
  }
  function inverseTimes(model, label) {
    model = modelFor(model); vector(model, label);
    return model.inverse.map(row => row.reduce((sum, element, i) => add(sum, multiply(element, rational(label[i]))), rational(0)));
  }
  function bilinear(model, left, right) {
    model = modelFor(model); vector(model, left);
    const response = inverseTimes(model, right);
    return response.reduce((sum, element, i) => add(sum, multiply(rational(left[i]), element)), rational(0));
  }
  function equivalent(model, left, right) {
    model = modelFor(model); vector(model, left); vector(model, right);
    return inverseTimes(model, left.map((entry, i) => entry - right[i])).every(entry => entry.denominator === 1);
  }
  function sectorFor(model, label) {
    model = modelFor(model); vector(model, label);
    return model.sectors.find(sector => equivalent(model, label, sector.label));
  }
  function attachLocal(model, label, n) {
    model = modelFor(model); vector(model, label); vector(model, n);
    const shifted = model.K.map((row, i) => safe(label[i] + row.reduce((sum, entry, j) => safe(sum + safe(entry * n[j])), 0)));
    return vector(model, shifted);
  }
  function fuse(model, left, right) {
    model = modelFor(model); vector(model, left); vector(model, right);
    const label = left.map((entry, i) => entry + right[i]);
    const sector = sectorFor(model, label);
    const removedLocal = inverseTimes(model, label.map((entry, i) => entry - sector.label[i])).map(entry => entry.numerator);
    return { label, sector, removedLocal };
  }
  function phase(turns) {
    const reducedTurns = modOne(turns);
    const angle = 2 * Math.PI * value(reducedTurns);
    const clean = coordinate => Math.abs(coordinate) < 1e-14 ? 0 : coordinate;
    return { turns, reducedTurns, complex: [clean(Math.cos(angle)), clean(Math.sin(angle))] };
  }
  const spin = (model, label) => phase(multiply(bilinear(model, label, label), rational(1, 2)));
  const mutual = (model, left, right) => phase(bilinear(model, left, right));
  const charge = (model, label) => bilinear(modelFor(model), modelFor(model).t, label);
  const hall = model => bilinear(modelFor(model), modelFor(model).t, modelFor(model).t);

  function inspect(model, left, right, n, direction = 1) {
    model = modelFor(model);
    if (direction !== 1 && direction !== -1) throw new RangeError('Direction must be +1 or −1.');
    const shifted = attachLocal(model, left, n);
    const directionFactor = rational(direction);
    return {
      representative: left.slice(), localAttachment: n.slice(), shiftedLabel: shifted,
      target: right.slice(), sector: sectorFor(model, shifted), fusion: fuse(model, shifted, right),
      charge: charge(model, shifted), originalCharge: charge(model, left),
      originalSpin: spin(model, left), spin: spin(model, shifted),
      exchange: phase(multiply(spin(model, shifted).turns, directionFactor)),
      mutual: phase(multiply(mutual(model, shifted, right).turns, directionFactor)),
      originalMutual: phase(multiply(mutual(model, left, right).turns, directionFactor)),
      hall: hall(model), direction
    };
  }

  return Object.freeze({ models, modelFor, rational, add, multiply, negate, modOne, value, format,
    inverseTimes, bilinear, equivalent, sectorFor, attachLocal, fuse, phase, spin, mutual, charge, hall, inspect });
});
