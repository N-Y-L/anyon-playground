/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * Noninteracting boson/fermion packets in the symmetric extended collider of
 * Samal et al., arXiv:2412.19674v2, Eq. S21 and Eqs. S53-S68.
 * q=kL is dimensionless; the junction reflection phase is fixed at zero.
 * Both sources emit the same packet, simultaneously, with uniform spectral
 * probability on 0 <= q <= 1/ratio. ratio=ell/L, ell=hbar*v/(e*V), describes
 * spectral width, NOT rms spatial width (the sharp window has long tails).
 * Detectors integrate over all outgoing temporal modes. No anyon interpolation.
 * Complex numbers use [real, imaginary]. This module has no DOM dependencies.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AnyonCollider = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function options(value, allowed) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new TypeError('Collider parameters must be an object.');
    }
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) throw new TypeError('Unsupported collider parameter: ' + key + '.');
    }
  }

  function finite(value, name) {
    if (!Number.isFinite(value)) throw new TypeError(name + ' must be finite.');
  }

  function reflectionAmplitude(r) {
    finite(r, 'Reflection amplitude');
    // r=0 is retained for the exact fully coupled limit; UI starts at 0.05.
    if (r < 0 || r > 0.98) throw new RangeError('Reflection amplitude must lie between 0 and 0.98.');
  }

  function divide([ar, ai], [br, bi]) {
    const denominator = br * br + bi * bi;
    return [(ar * br + ai * bi) / denominator, (ai * br - ar * bi) / denominator];
  }

  function amplitudes(r, q) {
    const sine = Math.sin(q / 2), cosine = Math.cos(q / 2);
    const rSquared = r * r, coupling = 1 - rSquared;
    // 1-cos(q)=2 sin(q/2)^2 avoids cancellation near q=0.
    const denominator = [coupling + 2 * rSquared * sine * sine, -2 * rSquared * sine * cosine];
    const T = divide([2 * r * sine * sine, -2 * r * sine * cosine], denominator);
    const R = divide([-coupling * cosine, -coupling * sine], denominator);
    const transmission = T[0] * T[0] + T[1] * T[1];
    const reflection = R[0] * R[0] + R[1] * R[1];
    const overlap = [T[0] * R[0] + T[1] * R[1], T[1] * R[0] - T[0] * R[1]];
    return { T, R, transmission, reflection, overlap };
  }

  function scattering(parameters = {}) {
    options(parameters, ['r', 'q']);
    const { r = 0.95, q } = parameters;
    reflectionAmplitude(r);
    finite(q, 'Dimensionless momentum q');
    return amplitudes(r, q);
  }

  function probabilities(integrals, r) {
    const [a, b, real, imaginary] = integrals;
    const Jabs2 = real * real + imaginary * imaginary;
    const B2 = a * a + b * b;
    const classicalA = 2 * r * r / (1 + r * r);
    const classicalB = (1 - r * r) / (1 + r * r);
    return {
      a, b, J: [real, imaginary], Jabs2,
      B1: classicalA * classicalA + classicalB * classicalB,
      B2, fermion: B2 + 2 * Jabs2, boson: B2 - 2 * Jabs2
    };
  }

  function integrate(r, qMax, panels) {
    const sums = [0, 0, 0, 0], corrections = [0, 0, 0, 0];
    let unitarityResidual = 0;
    for (let index = 0; index <= panels; index++) {
      const value = amplitudes(r, qMax * index / panels);
      const weight = index === 0 || index === panels ? 1 : index % 2 ? 4 : 2;
      const terms = [value.transmission, value.reflection, ...value.overlap];
      // Compensated sums control accumulated floating-point error. The uniform
      // density 1/qMax cancels the qMax factor from the integration step.
      for (let component = 0; component < terms.length; component++) {
        const increment = weight * terms[component] - corrections[component];
        const next = sums[component] + increment;
        corrections[component] = (next - sums[component]) - increment;
        sums[component] = next;
      }
      unitarityResidual = Math.max(unitarityResidual,
        Math.abs(value.transmission + value.reflection - 1),
        2 * Math.abs(value.overlap[0]));
    }
    return {
      ...probabilities(sums.map(value => value / (3 * panels)), r),
      unitarityResidual
    };
  }

  function calculate(parameters = {}) {
    options(parameters, ['r', 'ratio', 'tolerance']);
    const { r = 0.95, ratio = 2.5, tolerance = 1e-10 } = parameters;
    reflectionAmplitude(r);
    finite(ratio, 'Spectral length ratio');
    finite(tolerance, 'Quadrature tolerance');
    if (ratio < 0.2 || ratio > 8) throw new RangeError('Spectral length ratio must lie between 0.2 and 8.');
    if (tolerance < 1e-12 || tolerance > 1e-5) {
      throw new RangeError('Quadrature tolerance must lie between 1e-12 and 1e-5.');
    }

    const qMax = 1 / ratio;
    const quantities = ['a', 'b', 'Jabs2', 'B2', 'fermion', 'boson'];
    let panels = 64, previous = integrate(r, qMax, panels);
    let previousDifference = Infinity;
    while (panels < 32768) {
      panels *= 2;
      const result = integrate(r, qMax, panels);
      const difference = Math.max(...quantities.map(key => Math.abs(result[key] - previous[key])),
        ...result.J.map((value, index) => Math.abs(value - previous.J[index])));
      const normalizationResidual = Math.abs(result.a + result.b - 1);
      // Successive Simpson refinements estimate the remaining error as /15.
      // This is a convergence estimate, not a rigorous truncation bound. Require
      // two refinements and decreasing differences before accepting it; retain
      // a roundoff floor and independently measured conservation residuals.
      const errorEstimate = Math.max(difference / 15, 64 * Number.EPSILON,
        normalizationResidual, result.unitarityResidual);
      if (panels >= 256 && difference <= previousDifference && errorEstimate <= tolerance) {
        return {
          r, ratio, qMax, ...result, errorEstimate, converged: true, panels,
          normalizationResidual
        };
      }
      previousDifference = difference;
      previous = result;
    }
    throw new Error('Collider quadrature did not converge to the requested tolerance.');
  }

  return { calculate, scattering };
});
