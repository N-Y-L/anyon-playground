/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * Two specified preparations in the effective LLL SU(1,1) pair model.
 * separation = d_label / ell; u = separation^2 / 4. It is a preparation
 * label, not the mean separation. alpha is the regular-sector exchange
 * parameter. x and y denote the stable and unstable axes of the saddle.
 * Sources: arXiv:0908.3945, 1905.00442, cond-mat/9606214, 2509.15488.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AnyonPairStates = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TRUNCATION_TOLERANCE = 1e-15;
  const MAX_TERMS = 1024;

  function finite(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`${name} must be finite.`);
    }
    return value;
  }

  function checkAlpha(alpha) {
    finite(alpha, 'Statistics parameter');
    if (alpha < 0 || alpha > 1) throw new RangeError('Statistics parameter must lie between 0 and 1.');
  }

  function sum(values) {
    let total = 0, correction = 0;
    for (const value of values) {
      const adjusted = value - correction;
      const next = total + adjusted;
      correction = (next - total) - adjusted;
      total = next;
    }
    return total;
  }

  // K0|n> = diagonal|n>; K-|n> = lowering|n-1>, with K+ = (K-)†.
  // These are generalized generators, not a linear oscillator acting on
  // fractional powers. The n=0 lowering coefficient is exactly zero.
  function generatorElements({ alpha, n }) {
    checkAlpha(alpha);
    if (!Number.isInteger(n) || n < 0 || n > MAX_TERMS) {
      throw new RangeError(`Angular-momentum index must be an integer from 0 to ${MAX_TERMS}.`);
    }
    return {
      diagonal: n + alpha / 2 + 1 / 4,
      lowering: n === 0 ? 0 : Math.sqrt(n * (n + alpha - 1 / 2)),
      raising: Math.sqrt((n + 1) * (n + alpha + 1 / 2))
    };
  }

  function pairState({ alpha = 1 / 3, separation = 2, preparation = 'localized' } = {}) {
    checkAlpha(alpha);
    finite(separation, 'Separation label');
    if (separation < 0 || separation > 8) throw new RangeError('Separation label must lie between 0 and 8 magnetic lengths.');
    if (preparation !== 'localized' && preparation !== 'coherent') {
      throw new RangeError('Preparation must be localized or coherent.');
    }

    const u = separation * separation / 4;
    const beta = u / 2;
    const raw = [1];
    let total = 1, last = 1, tailMassBound = 0, tailFirstMomentBound = 0;

    if (u > 0) {
      let converged = false;
      for (let n = 0; n < MAX_TERMS - 1; n++) {
        const ratio = preparation === 'localized'
          ? u * u / ((2 * n + alpha + 1) * (2 * n + alpha + 2))
          : beta * beta / ((n + 1) * (n + alpha + 1 / 2));
        const next = last * ratio;
        // All subsequent ratios decrease. Once ratio < 1, the omitted
        // mass and first moment are bounded by geometric-series tails.
        if (ratio < 1) {
          tailMassBound = next / (1 - ratio);
          tailFirstMomentBound = next * ((n + 1) / (1 - ratio) + ratio / (1 - ratio) ** 2);
          if (2 * tailFirstMomentBound / total <= TRUNCATION_TOLERANCE) {
            converged = true;
            break;
          }
        }
        raw.push(next);
        total += next;
        last = next;
      }
      if (!converged) throw new Error('Pair-state expansion did not converge within its term limit.');
    }

    total = sum(raw);
    const weights = raw.map((value, n) => ({ n, probability: value / total }));
    const meanN = sum(weights.map(({ n, probability }) => n * probability));
    // Centering the summand avoids subtracting two large moments at the end.
    const chi = u === 0 ? alpha : sum(weights.map(({ n, probability }) => (2 * n + alpha - u) * probability));
    const K0 = generatorElements({ alpha, n: 0 }).diagonal + meanN;

    // For the coordinate preparation, <K1> differs from beta. Rationalizing
    // sqrt(1+v)-1 retains precision near the boson and fermion endpoints.
    const delta = preparation === 'coherent' ? 0 : beta * sum(weights.map(({ n, probability }) => {
      const v = alpha * (1 - alpha) / ((2 * n + alpha + 1) * (2 * n + alpha + 2));
      return probability * v / (Math.sqrt(1 + v) + 1);
    }));
    const K1 = beta + delta;
    const probabilityTailBound = tailMassBound / total;
    const v0 = alpha * (1 - alpha) / ((alpha + 1) * (alpha + 2));
    const maxCorrection = v0 / (Math.sqrt(1 + v0) + 1);

    return {
      alpha, separation, preparation, u, beta, chi, delta, K0, K1, K2: 0,
      meanN, weights,
      // Radial moments and assigned quadratic observables, in units of ell^2.
      // Qx and Qy require operator matching before a spatial interpretation.
      radialMoment: 8 * K0,
      referenceRadialMoment: 4 * u + 2,
      Qx: 4 * (K0 + K1), Qy: 4 * (K0 - K1),
      formalZeroLimit: u === 0,
      convergence: {
        terms: raw.length,
        probabilityTailBound,
        chiTruncationBound: 2 * tailFirstMomentBound / total,
        deltaTruncationBound: preparation === 'coherent' ? 0 : beta * maxCorrection * probabilityTailBound,
        // Tail bounds concern truncation only; double-precision arithmetic
        // adds roundoff. This scale is an estimate, not a rigorous bound.
        roundoffScale: 32 * Number.EPSILON * (1 + u + meanN)
      }
    };
  }

  // tau = (saddle curvature coefficient) * ell^2 * t / hbar.
  // Choosing x stable and y unstable incorporates the field/drift orientation.
  function saddleFlow(tau) {
    finite(tau, 'Dimensionless saddle time');
    if (Math.abs(tau) > 8) throw new RangeError('Dimensionless saddle time must lie between -8 and 8.');
    return [[Math.exp(-tau), 0], [0, Math.exp(tau)]];
  }

  function saddle({ alpha = 1 / 3, separation = 2, preparation = 'localized', tau = 0 } = {}) {
    const flow = saddleFlow(tau);
    const initial = pairState({ alpha, separation, preparation });
    const decay = flow[0][0] ** 2, growth = flow[1][1] ** 2;
    const cosh = (growth + decay) / 2, sinh = (growth - decay) / 2;
    const K0 = initial.K0 * cosh - initial.K1 * sinh;
    const K1 = initial.K1 * cosh - initial.K0 * sinh;
    return {
      initial, tau, flow, K0, K1, K2: 0,
      chi: initial.chi * cosh - 2 * initial.delta * sinh,
      // C_alg/ell^2 for a COM coherent state at the origin and an incoming
      // relative label on the x-axis. Interpreting this assigned moment as
      // <y1 y2>/ell^2 requires matching the effective spatial observables.
      // It is not a same-detector or opposite-detector event probability.
      outgoingMoment: growth * (-initial.chi / 2 + initial.delta),
      Qx: initial.Qx * decay, Qy: initial.Qy * growth,
      referenceQx: (4 * initial.u + 1) * decay, referenceQy: growth,
      chiTruncationBound: cosh * initial.convergence.chiTruncationBound
        + 2 * Math.abs(sinh) * initial.convergence.deltaTruncationBound,
      outgoingTruncationBound: growth * (initial.convergence.chiTruncationBound / 2
        + initial.convergence.deltaTruncationBound)
    };
  }

  return Object.freeze({ pairState, saddle, saddleFlow, generatorElements });
});
