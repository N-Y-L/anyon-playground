/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../abelian-physics.js');
const r = P.rational;
const samePhase = (actual, expected) => assert.deepEqual(actual.reducedTurns, r(...expected));
function close(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`); }

test('Rationals reduce signs and zero exactly, and reject inexact arithmetic', () => {
  assert.deepEqual(r(6, -9), r(-2, 3));
  assert.deepEqual(r(0, -3), { numerator: 0, denominator: 1 });
  assert.deepEqual(P.add(r(1, 2), r(1, 3)), r(5, 6));
  assert.deepEqual(P.multiply(r(-2, 3), r(3, 4)), r(-1, 2));
  assert.deepEqual(P.modOne(r(-7, 6)), r(5, 6));
  assert.throws(() => r(1, 0), RangeError);
  assert.throws(() => r(0.1), RangeError);
  assert.throws(() => P.multiply(r(Number.MAX_SAFE_INTEGER), r(2)), RangeError);
});

test('The four fixed inverse matrices multiply K to the identity', () => {
  assert.deepEqual(Object.values(P.models).map(model => model.signature), [0, 0, 1, 1]);
  for (const model of Object.values(P.models)) {
    for (let row = 0; row < model.K.length; row++) {
      for (let col = 0; col < model.K.length; col++) {
        const sum = model.K[row].reduce((total, entry, j) => P.add(total, P.multiply(r(entry), model.inverse[j][col])), r(0));
        assert.deepEqual(sum, r(row === col ? 1 : 0));
      }
    }
    assert.equal(model.sectors.length, Math.abs(model.determinant));
    for (let i = 0; i < model.sectors.length; i++) {
      for (let j = 0; j < model.sectors.length; j++) assert.equal(P.equivalent(model, model.sectors[i].label, model.sectors[j].label), i === j);
    }
  }
});

test('Known toric-code spins, e/m winding, and fusion table', () => {
  const labels = P.models.toric.sectors.map(sector => sector.label);
  const knownSpins = [[0, 1], [0, 1], [0, 1], [1, 2]];
  const knownMutualSigns = [[1, 1, 1, 1], [1, 1, -1, -1], [1, -1, 1, -1], [1, -1, -1, 1]];
  for (let i = 0; i < 4; i++) {
    samePhase(P.spin('toric', labels[i]), knownSpins[i]);
    for (let j = 0; j < 4; j++) {
      close(P.mutual('toric', labels[i], labels[j]).complex[0], knownMutualSigns[i][j]);
      assert.equal(P.fuse('toric', labels[i], labels[j]).sector.name, P.models.toric.sectors[i ^ j].name);
    }
  }
});

test('Double semion has the same fusion group but opposite semion spins', () => {
  const labels = P.models.doubleSemion.sectors.map(sector => sector.label);
  const knownSpins = [[0, 1], [1, 4], [3, 4], [0, 1]];
  for (let i = 0; i < 4; i++) {
    samePhase(P.spin('doubleSemion', labels[i]), knownSpins[i]);
    for (let j = 0; j < 4; j++) {
      const expectedLabel = labels[i ^ j];
      assert.deepEqual(P.fuse('doubleSemion', labels[i], labels[j]).sector.label, expectedLabel);
    }
  }
  samePhase(P.mutual('doubleSemion', [1, 0], [0, 1]), [0, 1]);
  samePhase(P.mutual('doubleSemion', [1, 0], [1, 0]), [1, 2]);
  samePhase(P.mutual('doubleSemion', [0, 1], [0, 1]), [1, 2]);
});

test('Laughlin charge, Hall response, fusion and winding match independent scalar formulas', () => {
  for (const m of [2, 3]) {
    const id = `laughlin${m}`;
    assert.deepEqual(P.hall(id), r(1, m));
    for (let a = -8; a <= 8; a++) {
      assert.deepEqual(P.charge(id, [a]), r(a, m));
      assert.equal(P.sectorFor(id, [a]).label[0], ((a % m) + m) % m);
      const exchange = P.spin(id, [a]).complex;
      close(exchange[0], Math.cos(Math.PI * a * a / m));
      close(exchange[1], Math.sin(Math.PI * a * a / m));
      for (let b = -5; b <= 5; b++) {
        const winding = P.mutual(id, [a], [b]).complex;
        close(winding[0], Math.cos(2 * Math.PI * a * b / m));
        close(winding[1], Math.sin(2 * Math.PI * a * b / m));
      }
    }
  }
});

test('Attaching an electron preserves its sector and winding but flips exchange and lowers charge by e', () => {
  const data = P.inspect('laughlin3', [1], [1], [-1]);
  assert.deepEqual(data.shiftedLabel, [-2]);
  assert.equal(data.sector.name, 'a');
  assert.deepEqual(data.charge, r(-2, 3));
  samePhase(data.originalSpin, [1, 6]);
  samePhase(data.spin, [2, 3]);
  assert.deepEqual(data.mutual.reducedTurns, data.originalMutual.reducedTurns);
  data.spin.complex.forEach((entry, index) => close(entry, -data.originalSpin.complex[index]));
  // A local electron is in the vacuum quotient sector, yet has spin −1.
  assert.equal(P.sectorFor('laughlin3', [-3]).name, '1');
  samePhase(P.spin('laughlin3', [-3]), [1, 2]);
});

test('Local shifts of either participant leave every mutual winding unchanged', () => {
  for (const model of Object.values(P.models)) {
    const localVectors = model.K.length === 1 ? [[-2], [-1], [0], [1], [2]] : [[-2, 1], [1, -1], [0, 0], [1, 2]];
    for (const a of model.sectors) for (const b of model.sectors) for (const n of localVectors) {
      const shifted = P.attachLocal(model, a.label, n);
      assert.ok(P.equivalent(model, shifted, a.label));
      assert.deepEqual(P.mutual(model, shifted, b.label).reducedTurns, P.mutual(model, a.label, b.label).reducedTurns);
      assert.deepEqual(P.mutual(model, b.label, shifted).reducedTurns, P.mutual(model, b.label, a.label).reducedTurns);
      if (!model.localFermions) assert.deepEqual(P.spin(model, shifted).reducedTurns, P.spin(model, a.label).reducedTurns);
      const deltaCharge = P.add(P.charge(model, shifted), P.negate(P.charge(model, a.label)));
      assert.deepEqual(deltaCharge, r(model.t.reduce((sum, t, i) => sum + t * n[i], 0)));
    }
  }
});

test('Fusion reduction accounts for exactly the removed local charge', () => {
  for (const model of Object.values(P.models)) for (const a of model.sectors) for (const b of model.sectors) {
    const fusion = P.fuse(model, a.label, b.label);
    const totalCharge = P.add(P.charge(model, a.label), P.charge(model, b.label));
    assert.deepEqual(totalCharge, P.charge(model, fusion.label));
    const localCharge = model.t.reduce((sum, t, i) => sum + t * fusion.removedLocal[i], 0);
    assert.deepEqual(totalCharge, P.add(P.charge(model, fusion.sector.label), r(localCharge)));
    assert.deepEqual(P.attachLocal(model, fusion.sector.label, fusion.removedLocal), fusion.label);
  }
});

test('Quadratic refinement and full self-winding hold for unreduced labels', () => {
  for (const model of Object.values(P.models)) for (const a of model.sectors) for (const b of model.sectors) {
    const sum = P.fuse(model, a.label, b.label).label;
    const composite = P.spin(model, sum);
    const predicted = P.phase(P.add(P.add(P.spin(model, a.label).turns, P.spin(model, b.label).turns), P.mutual(model, a.label, b.label).turns));
    assert.deepEqual(composite.reducedTurns, predicted.reducedTurns);
    assert.deepEqual(P.mutual(model, a.label, a.label).reducedTurns, P.phase(P.multiply(r(2), P.spin(model, a.label).turns)).reducedTurns);
  }
});

test('Clockwise operations conjugate phases without changing charges or fusion', () => {
  const forward = P.inspect('laughlin3', [1], [2], [-1], 1);
  const reverse = P.inspect('laughlin3', [1], [2], [-1], -1);
  for (const operation of ['exchange', 'mutual']) {
    close(forward[operation].complex[0], reverse[operation].complex[0]);
    close(forward[operation].complex[1], -reverse[operation].complex[1]);
  }
  assert.deepEqual(forward.charge, reverse.charge);
  assert.deepEqual(forward.fusion, reverse.fusion);
});

test('Inputs are validated and fixed model data cannot be mutated', () => {
  assert.throws(() => P.modelFor('unknown'), RangeError);
  assert.throws(() => P.spin('toric', [1]), TypeError);
  assert.throws(() => P.spin('laughlin3', [0.5]), RangeError);
  assert.throws(() => P.attachLocal('toric', [1, 0], [NaN, 0]), RangeError);
  assert.throws(() => P.inspect('laughlin2', [1], [1], [0], 0), RangeError);
  assert.throws(() => { P.models.toric.K[0][0] = 9; }, TypeError);
  assert.throws(() => { P.models.laughlin3.sectors[1].label[0] = 9; }, TypeError);
});
