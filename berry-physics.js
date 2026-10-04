/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE.
 * H = -Delta n.sigma/2, Delta > 0; the ground spin is aligned with n.
 * Links use <u_(j+1)|u_j>, so arg(product) is the geometric phase.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BerryPhysics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TAU = 2 * Math.PI;
  function finite(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
    return value;
  }
  function multiply(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function phasor(angle) { finite(angle, 'Angle'); return [Math.cos(angle), Math.sin(angle)]; }
  function phaseDifference(a, b) {
    finite(a, 'First phase'); finite(b, 'Second phase');
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
  }
  function spinor(beta, phi, gauge = 0) {
    finite(beta, 'Polar angle'); finite(phi, 'Azimuth'); finite(gauge, 'Gauge phase');
    if (beta < 0 || beta > Math.PI) throw new RangeError('Polar angle must lie between 0 and pi.');
    return [[Math.cos(beta / 2) * Math.cos(gauge), Math.cos(beta / 2) * Math.sin(gauge)],
      [Math.sin(beta / 2) * Math.cos(phi + gauge), Math.sin(beta / 2) * Math.sin(phi + gauge)]];
  }
  function checkState(state) {
    if (!Array.isArray(state) || state.length !== 2 || state.some(z => !Array.isArray(z) || z.length !== 2)) {
      throw new TypeError('Each spinor must contain two [real, imaginary] amplitudes.');
    }
    let norm = 0;
    for (const z of state) for (const component of z) norm += finite(component, 'State component') ** 2;
    if (!Number.isFinite(norm) || Math.abs(norm - 1) > 1e-10) throw new RangeError('Spinors must have unit norm.');
  }
  function loop(states) {
    if (!Array.isArray(states) || states.length < 2) throw new RangeError('A loop needs at least two sampled states.');
    states.forEach(checkState);
    let product = [1, 0];
    const links = states.map((current, j) => {
      const next = states[(j + 1) % states.length];
      let real = 0, imaginary = 0;
      for (let k = 0; k < 2; k++) {
        real += next[k][0] * current[k][0] + next[k][1] * current[k][1];
        imaginary += next[k][0] * current[k][1] - next[k][1] * current[k][0];
      }
      const magnitude = Math.hypot(real, imaginary);
      if (magnitude <= 1e-12) throw new RangeError(`Link ${j} has a vanishing overlap; refine the path.`);
      const value = [real / magnitude, imaginary / magnitude];
      product = multiply(product, value);
      const length = Math.hypot(...product);
      product = product.map(component => component / length);
      return { value, phase: Math.atan2(imaginary, real), magnitude };
    });
    return { links, phasor: product, phase: Math.atan2(product[1], product[0]) };
  }
  function latitude({ beta = Math.PI / 3, direction = 1, samples = 16, gaugeStrength = 0 } = {}) {
    finite(beta, 'Polar angle'); finite(gaugeStrength, 'Gauge strength');
    if (beta < 0 || beta > Math.PI) throw new RangeError('Polar angle must lie between 0 and pi.');
    if (direction !== 1 && direction !== -1) throw new RangeError('Direction must be +1 or -1.');
    if (!Number.isInteger(samples) || samples < 2 || samples > 4096) throw new RangeError('Sample count must be an integer from 2 to 4096.');
    if (gaugeStrength < 0 || gaugeStrength > 6) throw new RangeError('Gauge strength must lie between 0 and 6.');
    const azimuths = Array.from({ length: samples }, (_, j) => direction * TAU * j / samples);
    const gaugePhases = azimuths.map((_, j) => gaugeStrength * (Math.sin(TAU * j / samples) + 0.37 * Math.cos(2 * TAU * j / samples)));
    const base = loop(azimuths.map(phi => spinor(beta, phi)));
    const gauged = loop(azimuths.map((phi, j) => spinor(beta, phi, gaugePhases[j])));
    const solidAngle = direction * TAU * (1 - Math.cos(beta));
    const exactPhase = -solidAngle / 2;
    return { beta, direction, samples, gaugeStrength, azimuths, gaugePhases, solidAngle, exactPhase,
      exactPhasor: phasor(exactPhase), sampledPhase: gauged.phase, sampledPhasor: gauged.phasor,
      signedError: phaseDifference(gauged.phase, exactPhase), links: gauged.links, baseLinks: base.links,
      minimumOverlap: Math.min(...gauged.links.map(link => link.magnitude)) };
  }
  return Object.freeze({ phasor, phaseDifference, spinor, loop, latitude });
});
