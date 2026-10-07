/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../directions-saddle.js');

function close(actual, expected, tolerance = 2e-12) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
}

test('Saddle covariance stays positive and saturates the uncertainty bound', () => {
  for (const tau of [-8, -2, 0, 0.7, 3, 8]) {
    const s = S.state({ x0: 2, y0: -0.4, tau });
    assert.ok(s.varianceX > 0 && s.varianceY > 0);
    close(s.varianceX * s.varianceY - s.covarianceXY ** 2, 0.25);
    close(s.meanX * s.meanY, -0.8);
    assert.ok(s.originOverlap >= 0 && s.originOverlap <= 1);
  }
});

test('Origin-mode overlap agrees with independent complex wavefunction integration', () => {
  // Composite Simpson rule in u=x/ell, integrating the normalized wavefunctions.
  for (const [x0, y0, tau] of [[0, 0, 0], [1, 2, 0], [1, 2, 0.7], [-2, 0.5, 2], [0.5, -2, -2]]) {
    const n = 12000, step = 32 / n, expansion = Math.exp(tau);
    let real = 0, imaginary = 0;
    for (let j = 0; j <= n; j++) {
      const u = -16 + j * step;
      const weight = j === 0 || j === n ? 1 : j % 2 ? 4 : 2;
      const amplitude = Math.exp(tau / 2 - u * u / 2 - (expansion * u - x0) ** 2 / 2) / Math.sqrt(Math.PI);
      const phase = y0 * (expansion * u - x0 / 2);
      real += weight * amplitude * Math.cos(phase);
      imaginary += weight * amplitude * Math.sin(phase);
    }
    close(S.state({ x0, y0, tau }).originOverlap, (real * real + imaginary * imaginary) * (step / 3) ** 2);
  }
});

test('Gaussian arm fraction is preparation dependent and unchanged by squeezing', () => {
  close(S.erf(1), 0.8427007929497149, 5e-11);
  close(S.erf(2), 0.9953222650189527, 5e-11);
  close(S.state({ y0: 0 }).positiveY, 0.5);
  for (const y0 of [-1.5, -0.5, 0.5, 1.5]) {
    const early = S.state({ y0, tau: 0 });
    const later = S.state({ y0, tau: 3 });
    close(early.positiveY, later.positiveY);
    close(early.positiveY + S.state({ y0: -y0 }).positiveY, 1);
  }
});

test('Stationary flux splits respect the classical arms and remain normalized', () => {
  close(S.stationarySplit(0).positiveY, 0.5);
  assert.ok(S.stationarySplit(-8).positiveY > 1 - 1e-14);
  assert.ok(S.stationarySplit(8).positiveY < 1e-14);
  for (const e of [-1000, -2, -0.3, 0, 0.3, 2, 1000]) {
    const split = S.stationarySplit(e);
    close(split.positiveY + split.negativeY, 1);
    close(split.positiveY, S.stationarySplit(-e).negativeY);
  }
});

test('The late-time probability has rate lambda, and invalid parameters fail', () => {
  const s = S.state({ x0: 2, y0: 0.5, tau: 9 });
  assert.ok(Math.abs(s.originOverlap / s.lateOverlap - 1) < 1e-6);
  for (const params of [{ tau: NaN }, { x0: Infinity }, { y0: '1' }, { tau: 11 }]) {
    assert.throws(() => S.state(params), RangeError);
  }
});

test('Local decay rate agrees with a numerical logarithmic derivative and locates the peak', () => {
  const h = 1e-5;
  for (const [x0, y0] of [[0, 0], [3, 0.4], [0.5, 1.5], [2, -0.5]]) {
    for (const tau of [0, 0.8, 3, 6]) {
      const s = S.state({ x0, y0, tau });
      const earlier = S.state({ x0, y0, tau: tau - h }).originOverlap;
      const later = S.state({ x0, y0, tau: tau + h }).originOverlap;
      close(s.localDecayRate, -(Math.log(later) - Math.log(earlier)) / (2 * h), 2e-9);
    }
    const peak = S.state({ x0, y0, tau: S.state({ x0, y0 }).peakTime });
    if (peak.tau > 0) close(peak.localDecayRate, 0);
    assert.ok(peak.originOverlap >= S.state({ x0, y0, tau: peak.tau + 0.05 }).originOverlap);
    if (peak.tau > 0.05) assert.ok(peak.originOverlap >= S.state({ x0, y0, tau: peak.tau - 0.05 }).originOverlap);
  }
  close(S.state({ tau: 10 }).localDecayRate, 1, 2e-8);
});

test('Both overlap display scales retain finite curves at all control extremes', () => {
  for (const x0 of [0, 3]) for (const y0 of [-1.5, 0, 1.5]) for (const tau of [0, 6]) {
    const s = S.state({ x0, y0, tau });
    for (const logarithmic of [true, false]) assert.doesNotMatch(S.overlapSVG(s, logarithmic), /NaN|Infinity|undefined/);
  }
});
