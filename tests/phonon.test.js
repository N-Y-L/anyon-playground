/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Phonon = require('../phonon-physics.js');

function close(actual, expected, tolerance = 2e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
}

test('One phonon normalizes, with conserved excitation energy and zero mean displacement', () => {
  for (const parameters of [
    {},
    { sites: 8, center: 0, centralWaveNumber: 0.3, waveNumberWidth: 1 },
    { sites: 512, center: -125, centralWaveNumber: 2.8, waveNumberWidth: 0.08 }
  ]) {
    const initial = Phonon.packet(parameters);
    assert.equal(initial.positions.length, initial.parameters.sites);
    assert.equal(initial.positions[0], -initial.parameters.sites / 2);
    assert.equal(initial.positions.at(-1), initial.parameters.sites / 2 - 1);
    assert.equal(initial.modeProbabilities.length, initial.parameters.sites - 1);
    assert.ok(initial.modeProbabilities.every(mode => mode.waveNumber !== 0
      && mode.frequency > 0 && mode.probability >= 0));
    assert.ok(initial.energy > 0 && initial.energy <= 2);
    close(initial.normalization, 1);
    for (const time of [0, 1.25, 30, 120]) {
      const evolved = Phonon.packet({ ...parameters, time });
      close(evolved.normalization, 1);
      close(evolved.energy, initial.energy);
      close(evolved.varianceSum, initial.varianceSum);
      assert.deepEqual(evolved.modeProbabilities, initial.modeProbabilities);
      assert.ok(evolved.excessVariance.every(value => Number.isFinite(value) && value >= 0));
      assert.deepEqual(evolved.meanDisplacement, Array(evolved.parameters.sites).fill(0));
    }
  }
});

test('The spatial variance sum obeys discrete Fourier orthogonality, not unit probability normalization', () => {
  const parameters = { sites: 64, center: -9.5, centralWaveNumber: Math.PI / 2, waveNumberWidth: 0.22 };
  for (const time of [0, 5.7, 51, 120]) {
    const result = Phonon.packet({ ...parameters, time });
    // Sum_j exp[i(q-q')j] = N delta_qq': all phase-dependent cross terms vanish.
    const spectralSum = result.modeProbabilities.reduce((total, mode) =>
      total + mode.probability / mode.frequency, 0);
    close(result.varianceSum, spectralSum);
    close(result.excessVariance.reduce((total, value) => total + value, 0), spectralSum);
    assert.ok(Math.abs(result.varianceSum - 1) > 0.2);
  }
});

test('Translating the preparation shifts the variance samples periodically', () => {
  const sites = 64, shift = -56;
  for (const time of [0, 7.5, 25]) {
    const original = Phonon.packet({ sites, center: 28, time });
    const shifted = Phonon.packet({ sites, center: 28 + shift, time });
    for (let index = 0; index < sites; index++) {
      const source = ((index - shift) % sites + sites) % sites;
      close(shifted.excessVariance[index], original.excessVariance[source]);
    }
  }
});

test('A resolved narrow packet moves in the positive direction near its group velocity before wrapping', () => {
  const parameters = { sites: 256, center: -40, centralWaveNumber: 1.1, waveNumberWidth: 0.1 };
  const initial = Phonon.packet(parameters);
  const meanPosition = result => result.positions.reduce((total, position, index) =>
    total + position * result.excessVariance[index], 0) / result.varianceSum;
  const initialPosition = meanPosition(initial);
  close(initialPosition, parameters.center, 1e-8);
  close(initial.groupVelocity, Math.cos(parameters.centralWaveNumber / 2));
  for (const time of [10, 20, 30]) {
    const result = Phonon.packet({ ...parameters, time });
    const velocity = (meanPosition(result) - initialPosition) / time;
    assert.ok(velocity > 0);
    close(velocity, initial.groupVelocity, 0.01);
    // The tails remain remote from the periodic boundary in this comparison.
    assert.ok(result.excessVariance[0] + result.excessVariance.at(-1) < 1e-10);
  }
});

test('A single normal mode has uniform excess variance and its exact excitation energy', () => {
  const sites = 64, waveNumber = 2 * Math.PI * 8 / sites;
  const frequency = Math.sqrt(2 - 2 * Math.cos(waveNumber));
  for (const waveNumberWidth of [1e-6, Number.MIN_VALUE]) {
    for (const time of [0, 17, 120]) {
      const result = Phonon.packet({ sites, center: 3, centralWaveNumber: waveNumber,
        waveNumberWidth, time });
      close(result.energy, frequency);
      close(result.varianceSum, 1 / frequency);
      for (const variance of result.excessVariance) close(variance, 1 / (sites * frequency));
    }
  }
});

// Independently apply the displacement operator in bosonic occupation space.
// Applying it once to a one-phonon state reaches only the vacuum and the
// two-phonon sector, so this sparse calculation needs no Fock-space truncation.
function addAmplitude(state, occupations, real, imaginary) {
  const key = occupations.join(',');
  const entry = state.get(key) || { occupations, real: 0, imaginary: 0 };
  entry.real += real;
  entry.imaginary += imaginary;
  state.set(key, entry);
}

function applyDisplacement(state, position, modes, sites) {
  const result = new Map();
  for (const { occupations, real, imaginary } of state.values()) {
    modes.forEach(({ waveNumber, frequency }, index) => {
      for (const change of [-1, 1]) {
        const occupation = occupations[index];
        if (change === -1 && occupation === 0) continue;
        const updated = occupations.slice();
        updated[index] += change;
        const ladderFactor = Math.sqrt(change === -1 ? occupation : occupation + 1);
        const scale = ladderFactor / Math.sqrt(2 * sites * frequency);
        const phase = -change * waveNumber * position;
        const cosine = Math.cos(phase), sine = Math.sin(phase);
        addAmplitude(result, updated, scale * (real * cosine - imaginary * sine),
          scale * (real * sine + imaginary * cosine));
      }
    });
  }
  return result;
}

function normSquared(state) {
  return [...state.values()].reduce((total, entry) =>
    total + entry.real ** 2 + entry.imaginary ** 2, 0);
}

test('An explicit small-chain Fock-space calculation reproduces the excess displacement covariance', () => {
  const parameters = { sites: 8, center: -1, centralWaveNumber: Math.PI / 2, waveNumberWidth: 0.55 };
  const modes = [];
  // The lattice dynamical matrix has eigenvalue 2-2 cos(q). This construction
  // uses an independent mode order and direct Gaussian amplitudes.
  for (let n = 1; n < parameters.sites; n++) {
    const waveNumber = 2 * Math.PI * (n < parameters.sites / 2 ? n : n - parameters.sites) / parameters.sites;
    modes.push({ waveNumber, frequency: Math.sqrt(2 - 2 * Math.cos(waveNumber)) });
  }
  const amplitudes = modes.map(mode => Math.exp(-0.25 * ((mode.waveNumber - parameters.centralWaveNumber)
    / parameters.waveNumberWidth) ** 2));
  const normalization = Math.sqrt(amplitudes.reduce((total, amplitude) => total + amplitude ** 2, 0));
  const vacuum = new Map();
  addAmplitude(vacuum, Array(modes.length).fill(0), 1, 0);

  for (const time of [0, 0.7, 2]) {
    const onePhonon = new Map();
    modes.forEach((mode, index) => {
      const occupations = Array(modes.length).fill(0);
      occupations[index] = 1;
      const phase = -mode.waveNumber * parameters.center - mode.frequency * time;
      addAmplitude(onePhonon, occupations, amplitudes[index] * Math.cos(phase) / normalization,
        amplitudes[index] * Math.sin(phase) / normalization);
    });
    close(normSquared(onePhonon), 1);
    const result = Phonon.packet({ ...parameters, time });
    result.positions.forEach((position, index) => {
      const displaced = applyDisplacement(onePhonon, position, modes, parameters.sites);
      const groundDisplaced = applyDisplacement(vacuum, position, modes, parameters.sites);
      // For Hermitian u_j, <u_j^2> = ||u_j |state>||^2.
      close(result.excessVariance[index], normSquared(displaced) - normSquared(groundDisplaced));
      let meanReal = 0, meanImaginary = 0;
      for (const [key, entry] of onePhonon) {
        const other = displaced.get(key);
        if (!other) continue;
        meanReal += entry.real * other.real + entry.imaginary * other.imaginary;
        meanImaginary += entry.real * other.imaginary - entry.imaginary * other.real;
      }
      assert.equal(meanReal, 0);
      assert.equal(meanImaginary, 0);
      assert.equal(result.meanDisplacement[index], 0);
    });
  }
});

test('Parameter bounds reject nonphysical or unsupported inputs explicitly', () => {
  for (const sites of [7, 9, 514, 128.5, '128', NaN, Infinity]) {
    assert.throws(() => Phonon.packet({ sites }));
  }
  for (const time of [-0.1, 120.1, '0', NaN, Infinity]) {
    assert.throws(() => Phonon.packet({ time }));
  }
  for (const center of [-65, 64, '0', NaN, Infinity]) {
    assert.throws(() => Phonon.packet({ center }));
  }
  for (const centralWaveNumber of [0, -0.1, Math.PI, 4, '1', NaN, Infinity]) {
    assert.throws(() => Phonon.packet({ centralWaveNumber }));
  }
  for (const waveNumberWidth of [0, -0.1, 1.01, '0.18', NaN, Infinity]) {
    assert.throws(() => Phonon.packet({ waveNumberWidth }));
  }
  assert.doesNotThrow(() => Phonon.packet({ sites: 8, center: -4 }));
  assert.doesNotThrow(() => Phonon.packet({ sites: 8, center: 3 }));
});
