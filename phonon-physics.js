/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * One phonon in a periodic harmonic chain, with its translation mode fixed.
 * Position is j in units of lattice spacing a; q = k a; time is
 * tau = t sqrt(kappa/M). Frequencies are in sqrt(kappa/M), excitation
 * energy in hbar sqrt(kappa/M), and displacement variance in hbar/sqrt(kappa M).
 * The plotted quantity is extra displacement variance, not a position
 * probability or an atomic displacement. Its spatial sum need not equal one.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AnyonPhonon = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function finite(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`${name} must be a finite number.`);
    }
  }

  function packet({ time = 0, sites = 128, center = -28,
    centralWaveNumber = Math.PI / 3, waveNumberWidth = 0.18 } = {}) {
    finite(sites, 'Number of sites');
    if (!Number.isInteger(sites) || sites % 2 !== 0 || sites < 8 || sites > 512) {
      throw new RangeError('Number of sites must be an even integer from 8 to 512.');
    }
    finite(time, 'Dimensionless time');
    if (time < 0 || time > 120) {
      throw new RangeError('Dimensionless time must lie between 0 and 120.');
    }
    finite(center, 'Packet center');
    if (center < -sites / 2 || center > sites / 2 - 1) {
      throw new RangeError('Packet center must lie within the returned site interval.');
    }
    finite(centralWaveNumber, 'Central wave number');
    if (centralWaveNumber <= 0 || centralWaveNumber >= Math.PI) {
      throw new RangeError('Central wave number must lie strictly between 0 and pi.');
    }
    finite(waveNumberWidth, 'Wave-number width');
    if (waveNumberWidth <= 0 || waveNumberWidth > 1) {
      throw new RangeError('Wave-number width must be positive and at most 1.');
    }

    // Use one Brillouin zone, [-pi, pi), counting the zone boundary once.
    // This Gaussian is sampled in that interval, not wrapped in wave number.
    // Omitting q=0 removes the free uniform translation, whose frequency is zero.
    const modes = [];
    for (let n = -sites / 2; n < sites / 2; n++) {
      if (n === 0) continue;
      const waveNumber = 2 * Math.PI * n / sites;
      modes.push({
        waveNumber,
        frequency: 2 * Math.abs(Math.sin(waveNumber / 2)),
        distance: Math.abs(waveNumber - centralWaveNumber)
      });
    }

    // |f_q|^2 is proportional to exp[-(q-q0)^2/(2 sigma^2)]. Remove the
    // largest common exponent before normalizing, so even a width narrower
    // than the discrete mode spacing has a well-defined single-mode limit.
    const nearestDistance = Math.min(...modes.map(mode => mode.distance));
    const rawProbabilities = modes.map(({ distance }) => distance === nearestDistance ? 1
      : Math.exp(-0.5 * ((distance - nearestDistance) / waveNumberWidth)
        * ((distance + nearestDistance) / waveNumberWidth)));
    const rawSum = rawProbabilities.reduce((total, value) => total + value, 0);
    const modeProbabilities = modes.map((mode, index) => ({
      waveNumber: mode.waveNumber,
      frequency: mode.frequency,
      probability: rawProbabilities[index] / rawSum
    }));
    const positions = Array.from({ length: sites }, (_, index) => index - sites / 2);

    // f_q(tau) = |f_q| exp[-i q center - i Omega(q) tau]. The displacement
    // operator gives Delta<u_j^2> = |sum_q f_q(tau) exp(i q j)/sqrt(Omega)|^2/N.
    const excessVariance = positions.map(position => {
      let real = 0, imaginary = 0;
      for (const { waveNumber, frequency, probability } of modeProbabilities) {
        const amplitude = Math.sqrt(probability / frequency);
        const phase = waveNumber * (position - center) - frequency * time;
        real += amplitude * Math.cos(phase);
        imaginary += amplitude * Math.sin(phase);
      }
      return (real * real + imaginary * imaginary) / sites;
    });

    return {
      parameters: { time, sites, center, centralWaveNumber, waveNumberWidth },
      positions,
      excessVariance,
      // A fixed one-phonon state has no matrix element of an operator that
      // changes phonon number by one. This remains exact during harmonic motion.
      meanDisplacement: positions.map(() => 0),
      modeProbabilities,
      normalization: modeProbabilities.reduce((total, mode) => total + mode.probability, 0),
      energy: modeProbabilities.reduce((total, mode) => total + mode.probability * mode.frequency, 0),
      varianceSum: excessVariance.reduce((total, value) => total + value, 0),
      // dOmega/dq at positive q0, in units a sqrt(kappa/M). This describes a
      // packet's motion when its spectrum is narrow, resolved by the q grid,
      // and away from q=0 and the zone edge. A very narrow discrete spectrum
      // can instead describe a delocalized normal mode. The exact finite-ring
      // evolution above includes dispersion and wraparound, but no damping.
      groupVelocity: Math.cos(centralWaveNumber / 2)
    };
  }

  return Object.freeze({ packet });
});
