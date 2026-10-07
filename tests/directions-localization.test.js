/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const localization = require('../directions-localization.js');
const close = (a, b, tolerance) => assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`);

test('block renormalization agrees with a direct short transfer-vector product', () => {
  const values = localization.potential('random', 32), ratio = 1.4;
  let a = 1, b = 0;
  for (const value of values) { const next = -ratio * value * a - b; b = a; a = next; }
  const direct = Math.log(Math.hypot(a, b)) / values.length;
  for (const block of [1, 4, 8, 16]) close(localization.growth(values, ratio, block), direct, 1e-13);
});

test('staggered growth approaches the independent two-site transfer eigenvalue', () => {
  for (const ratio of [0.2, 1, 4]) {
    const exact = 0.5 * Math.acosh(1 + ratio * ratio / 2);
    const short = localization.growth(localization.potential('staggered', 1000), ratio);
    const long = localization.growth(localization.potential('staggered', 8000), ratio);
    assert.ok(Math.abs(long - exact) < Math.abs(short - exact));
    close(long, exact, 5e-5);
  }
});

test('quasiperiodic growth agrees with its infinite-chain closed form within finite-length error', () => {
  const values = localization.potential('quasiperiodic', 8000);
  for (const ratio of [0.5, 1.5, 2.5, 4]) {
    close(localization.growth(values, ratio), Math.max(0, Math.log(ratio / 2)), 1e-3);
  }
});

test('staggered and quasiperiodic crossings reproduce their exact superconducting boundaries', () => {
  for (const delta of [0.05, 0.3, 0.9]) for (const landscape of ['staggered', 'quasiperiodic']) {
    const s = localization.state({delta, landscape});
    assert.equal(s.crossings.length, 1);
    close(s.crossings[0], s.exactCrossing, 0.001);
    close(localization.closedForm(landscape, s.exactCrossing, delta), s.threshold, 1e-13);
  }
});

test('random sample is deterministic, prefix-consistent, and distinct from an ensemble result', () => {
  const a = localization.potential('random', 1000), b = localization.potential('random', 4000);
  assert.deepEqual(Array.from(a), Array.from(b.slice(0, a.length)));
  assert.ok(a.every(value => value >= -1 && value <= 1));
  a[0] = 123;
  assert.notEqual(localization.potential('random', 1000)[0], 123);
  const s = localization.state({landscape: 'random'});
  assert.equal(s.seed, 2013);
  assert.equal(s.exactCrossing, null);
  close(s.crossings[0], 2.6827143167593124, 1e-10);
});

test('zero potential has zero growth and high-pairing random sample can have no crossing in range', () => {
  for (const landscape of ['quasiperiodic', 'staggered', 'random']) close(localization.growth(localization.potential(landscape), 0), 0, 1e-15);
  assert.equal(localization.state({delta: 0.9, landscape: 'random'}).crossings.length, 0);
});

test('static figure is accessible and labels finite-sample limitations', () => {
  const markup = localization.initialMarkup();
  assert.match(markup, /aria-labelledby/);
  assert.match(markup, /4000-site/);
  assert.match(markup, /not an exact classification/);
  assert.doesNotMatch(markup, /NaN|Infinity/);
});

test('invalid numerical choices are rejected', () => {
  for (const params of [{delta: 1}, {delta: 0}, {sites: 2}, {sites: 4000.5}, {landscape: 'unknown'}]) assert.throws(() => localization.state(params), RangeError);
  assert.throws(() => localization.growth([1], 1, 0), RangeError);
});
