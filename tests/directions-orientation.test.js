/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const O = require('../directions-orientation.js');
const PI = Math.PI;
const dot = (a, b) => a.reduce((sum, value, j) => sum + value * b[j], 0);
function close(a, b, tolerance = 2e-12) { assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`); }
function vectorClose(a, b, tolerance) { a.forEach((v, j) => close(v, b[j], tolerance)); }

test('The embedding glues with transverse reversal and has one connected boundary', () => {
  for (const s of [-2, 0, 0.31, PI / 2, PI, 5.1]) {
    for (const u of [-O.WIDTH, -0.12, 0, 0.27, O.WIDTH]) {
      vectorClose(O.ribbonPoint(s + 2 * PI, u), O.ribbonPoint(s, -u));
      vectorClose(O.ribbonPoint(s + 4 * PI, u), O.ribbonPoint(s, u));
    }
  }
  vectorClose(O.ribbonPoint(2 * PI, O.WIDTH), O.ribbonPoint(0, -O.WIDTH));
  vectorClose(O.ribbonPoint(4 * PI, O.WIDTH), O.ribbonPoint(0, O.WIDTH));
});

test('The supplied core normal is unit and perpendicular to numerical surface tangents', () => {
  // Finite differences of the independent embedding, not the analytic normal.
  const h = 1e-5;
  for (let j = 0; j <= 40; j++) {
    const s = 4 * PI * j / 40, normal = O.coreNormal(s);
    const before = O.ribbonPoint(s - h), after = O.ribbonPoint(s + h);
    const lower = O.ribbonPoint(s, -h), upper = O.ribbonPoint(s, h);
    const tangent = after.map((v, k) => (v - before[k]) / (2 * h));
    const transverse = upper.map((v, k) => (v - lower[k]) / (2 * h));
    close(dot(normal, normal), 1);
    close(dot(normal, tangent), 0, 2e-10);
    close(dot(normal, transverse), 0, 2e-10);
  }
});

test('One circuit reverses the core normal and two restore it', () => {
  for (let j = 0; j <= 40; j++) {
    const s = 2 * PI * j / 40;
    vectorClose(O.coreNormal(s + 2 * PI), O.coreNormal(s).map(v => -v));
    vectorClose(O.coreNormal(s + 4 * PI), O.coreNormal(s));
  }
  vectorClose(O.state({ sPi: 0 }).point, O.state({ sPi: 2 }).point);
  vectorClose(O.state({ sPi: 2 }).point, O.state({ sPi: 4 }).point);
});

test('Full-width normal agrees with the cross product of independent finite-difference tangents', () => {
  const h = 1e-5;
  for (const s of [0, 0.31, PI / 2, PI, 4.1, 2 * PI, 9.2]) {
    for (const u of [-O.WIDTH, -0.11, 0, 0.21, O.WIDTH]) {
      const before = O.ribbonPoint(s - h, u), after = O.ribbonPoint(s + h, u);
      const lower = O.ribbonPoint(s, u - h), upper = O.ribbonPoint(s, u + h);
      const a = after.map((v, j) => (v - before[j]) / (2 * h));
      const b = upper.map((v, j) => (v - lower[j]) / (2 * h));
      const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      vectorClose(O.ribbonNormalVector(s, u), cross, 8e-10);
      const normal = O.ribbonNormal(s, u);
      close(dot(normal, normal), 1);
      close(dot(normal, a), 0, 8e-10);
      close(dot(normal, b), 0, 8e-10);
    }
  }
});

test('Full-width field and normal obey the Möbius seam while their physical projection agrees', () => {
  for (const s of [0, 0.27, 1.4, 4.8]) for (const u of [-O.WIDTH, -0.1, 0, 0.2, O.WIDTH]) {
    const first = O.ribbonNormal(s, -u), next = O.ribbonNormal(s + 2 * PI, u);
    vectorClose(next, first.map(value => -value));
    for (const beta of [0, 0.47, PI / 2]) {
      const a = O.surfaceNormalField(s, -u, beta), b = O.surfaceNormalField(s + 2 * PI, u, beta);
      close(a, -b);
      vectorClose(first.map(v => a * v), next.map(v => b * v));
    }
  }
});

test('The normal component reverses, has a zero, and its physical projection is single valued', () => {
  for (let degrees = 0; degrees <= 90; degrees++) {
    const beta = degrees * PI / 180;
    close(dot(O.fieldVector(beta), O.fieldVector(beta)), 1);
    const zero = O.oneZero(beta);
    assert.ok(zero >= 0 && zero <= 2 * PI);
    close(O.normalField(zero, beta), 0, 3e-13);
    for (const s of [0, 0.47, 2.31, 5.9]) {
      const b = O.normalField(s, beta), next = O.normalField(s + 2 * PI, beta);
      close(next, -b);
      vectorClose(O.coreNormal(s).map(v => b * v), O.coreNormal(s + 2 * PI).map(v => next * v));
    }
  }
  close(O.oneZero(0), PI);
  close(O.normalField(0, PI / 2), 0);
});

test('Views change only rendering, and markup stays finite and vector based', () => {
  const physical = O.state({ sPi: 1.2, betaDeg: 42 });
  for (const view of ['oblique', 'top', 'low']) for (const azimuthDeg of [-180, -60, 20, 180]) {
    const s = O.state({ sPi: 1.2, betaDeg: 42, view, azimuthDeg });
    close(s.component, physical.component);
    vectorClose(s.normal, physical.normal);
    for (const svg of [O.ribbonSVG(s), O.fieldSVG(s)]) {
      assert.match(svg, /<svg/);
      assert.doesNotMatch(svg, /NaN|Infinity|<image\b|data:image|<canvas\b/);
      assert.match(svg, /<desc/);
    }
  }
  assert.match(O.initialMarkup(), /data-directions-orientation/);
  assert.match(O.initialMarkup(), /orientation-zero-contour/);
  assert.match(O.initialMarkup(), /id="orientation-azimuth"/);
});

test('Every core zero is reported, including the non-crossing zero where a pair appears', () => {
  vectorClose(O.coreZeros(0), [PI]);
  vectorClose(O.coreZeros(PI / 2), [0, PI / 2, 3 * PI / 2]);
  // The discriminant of the zero equation changes sign at tan²(beta)=(11+sqrt(125))/2.
  const critical = Math.atan(Math.sqrt((11 + Math.sqrt(125)) / 2));
  assert.equal(O.coreZeros(critical - 1e-7).length, 1);
  assert.equal(O.coreZeros(critical + 1e-7).length, 3);
  const criticalZeros = O.coreZeroDetails(critical);
  assert.equal(criticalZeros.length, 2);
  assert.equal(criticalZeros.filter(z => z.tangent).length, 1);
  const touch = criticalZeros.find(z => z.tangent).s;
  assert.ok(O.normalField(touch - 1e-3, critical) * O.normalField(touch + 1e-3, critical) > 0);
  for (const beta of [1e-10, 0.2, 1.1, critical - 1e-7, critical, critical + 1e-7, 1.5, PI / 2 - 1e-10, PI / 2]) {
    for (const s of O.coreZeros(beta)) {
      assert.ok(s >= 0 && s < 2 * PI);
      close(O.normalField(s, beta), 0, 1e-12);
    }
  }
});

test('Core zero counts agree with independent dense sign sampling away from tangency', () => {
  const steps = 20000;
  for (const degrees of [0, 25, 60, 73, 74, 80, 89]) {
    const beta = degrees * PI / 180;
    let count = 0, before = O.normalField(0, beta);
    for (let j = 1; j <= steps; j++) {
      const after = O.normalField(2 * PI * j / steps, beta);
      if (after !== 0) { if (before * after < 0) count++; before = after; }
    }
    assert.equal(O.coreZeros(beta).length, count);
  }
});

test('The full-width contour finds physical zeros and retains whole tangent-field lines', () => {
  for (const beta of [0, PI / 6, 74 * PI / 180, PI / 2]) {
    const contour = O.zeroContour(beta);
    assert.ok(contour.length >= 8);
    for (const segment of contour) {
      for (const [s, u] of segment.points) {
        assert.ok(s >= 0 && s <= 2 * PI && Math.abs(u) <= O.WIDTH + 1e-14);
        close(O.surfaceNormalField(s, u, beta), 0, 2e-12);
      }
      const [a, b] = segment.points, middle = a.map((v, j) => (v + b[j]) / 2);
      // The displayed straight mesh segment approximates the continuous zero curve.
      close(O.surfaceNormalField(...middle, beta), 0, 0.0015);
    }
  }
  for (const u of [-O.WIDTH, -0.13, 0, 0.24, O.WIDTH]) {
    close(O.surfaceNormalField(PI, u, 0), 0);
    close(O.surfaceNormalField(0, u, PI / 2), 0);
    close(O.surfaceNormalField(2 * PI, -u, PI / 2), 0);
  }
  const axialLine = O.zeroContour(0).flatMap(segment => segment.points);
  assert.ok(axialLine.some(([s, u]) => Math.abs(s - PI) < 1e-12 && Math.abs(u + O.WIDTH) < 1e-12));
  assert.ok(axialLine.some(([s, u]) => Math.abs(s - PI) < 1e-12 && Math.abs(u - O.WIDTH) < 1e-12));
  const joinLine = O.zeroContour(PI / 2).filter(segment => segment.points.every(([s]) => Math.abs(s) < 1e-12));
  assert.ok(joinLine.length >= 8);
});

test('Invalid model parameters fail explicitly', () => {
  for (const params of [{ sPi: -1 }, { sPi: 4.1 }, { betaDeg: -1 }, { betaDeg: 91 },
    { betaDeg: NaN }, { sPi: '2' }, { azimuthDeg: NaN }, { azimuthDeg: 181 }, { view: 'unknown' }, { view: '__proto__' }]) {
    assert.throws(() => O.state(params), RangeError);
  }
  assert.throws(() => O.coreNormal(NaN), RangeError);
  assert.throws(() => O.ribbonPoint(0, Infinity), RangeError);
  assert.throws(() => O.oneZero(NaN), RangeError);
  assert.throws(() => O.coreZeros(-0.1), RangeError);
  assert.throws(() => O.coreZeros(PI), RangeError);
  assert.throws(() => O.zeroContour(0, 1, 8), RangeError);
});
