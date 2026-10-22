/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DirectionsLocalization = api;
  if (typeof document !== 'undefined') {
    const start = () => document.querySelectorAll('[data-directions-localization]').forEach(api.attach);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
    else start();
  }
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const defaults = Object.freeze({delta: 0.3, landscape: 'quasiperiodic'});
  const constants = Object.freeze({sites: 4000, seed: 2013, beta: (Math.sqrt(5) - 1) / 2, phase: 0.3, maxAmplitude: 4.5, intervals: 90});
  const landscapes = ['quasiperiodic', 'staggered', 'random'];
  const shapeCache = new Map();

  function validate(delta, landscape, sites) {
    if (!Number.isFinite(delta) || delta < 0.05 || delta > 0.9) throw new RangeError('delta must be from 0.05 to 0.9');
    if (!landscapes.includes(landscape)) throw new RangeError('unknown potential landscape');
    if (!Number.isInteger(sites) || sites < 16 || sites > 32000) throw new RangeError('sites must be an integer from 16 to 32000');
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function potential(landscape, sites = constants.sites) {
    validate(defaults.delta, landscape, sites);
    const key = `${landscape}:${sites}`;
    if (shapeCache.has(key)) return shapeCache.get(key).slice();
    const values = new Float64Array(sites), random = mulberry32(constants.seed);
    for (let j = 1; j <= sites; j++) values[j - 1] = landscape === 'quasiperiodic' ? Math.cos(2 * Math.PI * constants.beta * j + constants.phase) : landscape === 'staggered' ? (j % 2 ? -1 : 1) : 2 * random() - 1;
    shapeCache.set(key, values);
    return values.slice();
  }

  // Finite-vector growth estimate at zero energy, from (psi_1, psi_0)=(1,0).
  // Rescaling changes neither the recursion nor the accumulated logarithmic growth.
  function growth(values, ratio, blockSize = 8) {
    if (!values.length || !Number.isFinite(ratio) || ratio < 0 || ratio > 20) throw new RangeError('invalid potential ratio');
    if (!Number.isInteger(blockSize) || blockSize < 1 || blockSize > 16) throw new RangeError('invalid rescaling interval');
    let a = 1, b = 0, logSum = 0;
    for (let j = 0; j < values.length;) {
      const stop = Math.min(values.length, j + blockSize);
      for (; j < stop; j++) { const next = -ratio * values[j] * a - b; b = a; a = next; }
      const norm = Math.hypot(a, b);
      a /= norm; b /= norm; logSum += Math.log(norm);
    }
    return logSum / values.length;
  }

  function closedForm(landscape, amplitude, delta) {
    const hopping = Math.sqrt(1 - delta * delta);
    if (landscape === 'quasiperiodic') return amplitude > 2 * hopping ? Math.log(amplitude / (2 * hopping)) : 0;
    if (landscape === 'staggered') return Math.asinh(amplitude / (2 * hopping));
    return null;
  }

  function state({delta = defaults.delta, landscape = defaults.landscape, sites = constants.sites} = {}) {
    validate(delta, landscape, sites);
    const hopping = Math.sqrt(1 - delta * delta), threshold = 0.5 * Math.log((1 + delta) / (1 - delta));
    const values = potential(landscape, sites);
    const amplitudes = Array.from({length: constants.intervals + 1}, (_, j) => constants.maxAmplitude * j / constants.intervals);
    if (landscape === 'quasiperiodic') amplitudes.push(2 * hopping);
    amplitudes.sort((a, b) => a - b);
    const points = amplitudes.filter((value, j) => !j || Math.abs(value - amplitudes[j - 1]) > 1e-12).map(amplitude => ({amplitude, estimate: growth(values, amplitude / hopping), exact: closedForm(landscape, amplitude, delta)}));
    const crossings = [], intervals = [];
    let from = 0, below = points[0].estimate < threshold;
    for (let j = 1; j < points.length; j++) {
      const point = points[j], now = point.estimate < threshold;
      if (now === below) continue;
      const previous = points[j - 1];
      const crossing = previous.amplitude + (point.amplitude - previous.amplitude) * (threshold - previous.estimate) / (point.estimate - previous.estimate);
      crossings.push(crossing); intervals.push({from, to: crossing, below}); from = crossing; below = now;
    }
    intervals.push({from, to: constants.maxAmplitude, below});
    return {delta, landscape, sites, hopping, threshold, points, crossings, intervals,
      exactCrossing: landscape === 'quasiperiodic' ? 2 * (1 + delta) : landscape === 'staggered' ? 2 * delta : null,
      seed: landscape === 'random' ? constants.seed : null};
  }

  const fixed = (value, digits = 3) => (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits);
  function chartSVG(s, width = 680) {
    const left = 46, right = width - 24, top = 30, bottom = 228;
    const x = value => left + (right - left) * value / constants.maxAmplitude;
    const y = value => bottom - (bottom - top) * value / 1.6;
    const path = property => s.points.map((point, j) => `${j ? 'L' : 'M'}${x(point.amplitude).toFixed(3)} ${y(point[property]).toFixed(3)}`).join('');
    const id = `localization-${width}`;
    return `<svg viewBox="0 0 ${width} 291" role="img" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="${id}-title">Normal-chain growth compared with pairing-induced decay</title>
      <desc id="${id}-desc">The blue curve is the finite growth estimate on ${s.sites} sites for the ${s.landscape} potential. The red dashed line is the pairing threshold ${fixed(s.threshold)} per site. Shading marks where this finite estimate lies below the threshold. ${s.exactCrossing === null ? 'The random potential uses one fixed sample, seed 2013.' : `A gray line gives the infinite-chain closed form; its exact crossing is ${fixed(s.exactCrossing)} hopping units.`}</desc>
      <defs><clipPath id="${id}-clip"><rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}"/></clipPath></defs>
      <g font-family="Georgia,serif" font-size="14" fill="#333">
      <text x="${(left + right) / 2}" y="18" text-anchor="middle">Growth and decay per site</text>
      ${s.intervals.filter(interval => interval.below).map(interval => `<rect x="${x(interval.from)}" y="${top}" width="${x(interval.to) - x(interval.from)}" height="${bottom - top}" fill="#edf3f6"/>`).join('')}
      ${[0, 0.4, 0.8, 1.2, 1.6].map(value => `<path d="M${left} ${y(value)}H${right}" stroke="#ddd"/><text x="${left - 7}" y="${y(value) + 5}" text-anchor="end">${fixed(value, 1)}</text>`).join('')}
      <g clip-path="url(#${id}-clip)">
      ${s.exactCrossing !== null ? `<path d="${path('exact')}" fill="none" stroke="#aaa" stroke-width="5"/>` : ''}
      <path d="${path('estimate')}" fill="none" stroke="#145b91" stroke-width="2"/>
      <path d="M${left} ${y(s.threshold)}H${right}" stroke="#9d493e" stroke-width="2" stroke-dasharray="6 4"/>
      ${s.crossings.map(value => `<path d="M${x(value)} ${top}V${bottom}" stroke="#888" stroke-dasharray="3 4"/><circle cx="${x(value)}" cy="${y(s.threshold)}" r="3.5" fill="#145b91"/>`).join('')}
      </g><path d="M${left} ${top}V${bottom}H${right}" stroke="#888" fill="none"/>
      ${[0, 1, 2, 3, 4].map(value => `<text x="${x(value)}" y="252" text-anchor="middle">${value}</text>`).join('')}
      <text x="${(left + right) / 2}" y="280" text-anchor="middle">Potential amplitude V/w</text>
      </g></svg>`;
  }

  function plots(s) { return `<div class="localization-wide">${chartSVG(s)}</div><div class="localization-narrow">${chartSVG(s, 360)}</div>`; }
  function summary(s) {
    const crossing = s.crossings.length ? `The finite estimate crosses the pairing threshold at V/w = ${s.crossings.map(value => fixed(value, s.landscape === 'random' ? 2 : 4)).join(', ')}.` : `There is no estimated crossing for V/w ≤ ${constants.maxAmplitude}.`;
    const exact = s.exactCrossing === null ? 'This is one fixed random sample, not a disorder average or an exact phase boundary.' : `The infinite-chain boundary is V/w = ${fixed(s.exactCrossing, 4)}. The numerical crossing includes finite-length and amplitude-grid errors.`;
    return `<p>γ<sub>S</sub> = ${fixed(s.threshold, 4)} per site; associated normal hopping t′/w = ${fixed(s.hopping, 4)}.</p><p>${crossing} ${exact}</p>`;
  }

  function initialMarkup() {
    const s = state();
    return `<figure class="inline-figure directions-localization" data-directions-localization>
      <style>
      .directions-localization .localization-narrow{display:none}.directions-localization svg{display:block;width:100%;height:auto}
      .directions-localization .localization-legend{font:14px/1.5 system-ui,sans-serif;color:#555}
      .directions-localization .localization-summary{font-size:16px;line-height:1.5}.directions-localization .localization-summary p{margin:12px 0}
      .directions-localization .figure-controls{border-top:1px solid #ddd;padding-top:16px}
      @media(max-width:520px){.directions-localization .localization-wide{display:none}.directions-localization .localization-narrow{display:block}}
      @media print{.directions-localization .localization-wide{display:block}.directions-localization .localization-narrow{display:none}.directions-localization .localization-summary{font-size:9pt}.directions-localization .localization-legend{font-size:8pt}}
      </style>
      <div data-localization-plots>${plots(s)}</div>
      <p class="localization-legend">Blue: finite growth estimate. Dashed red: pairing-induced decay γ<sub>S</sub>. Gray, when available: infinite-chain closed form. Shading means the finite estimate lies below γ<sub>S</sub>; curves stop at the plot's vertical limits.</p>
      <div class="figure-controls">
        <label for="localization-delta">Pairing Δ/w <input id="localization-delta" type="range" min="0.05" max="0.9" step="0.01" value="${s.delta}" data-localization-delta><output for="localization-delta">${fixed(s.delta, 2)}</output></label>
        <label for="localization-landscape">Potential <select id="localization-landscape" data-localization-landscape><option value="quasiperiodic">Quasiperiodic</option><option value="staggered">Staggered</option><option value="random">Random: one fixed sample</option></select></label>
        <button type="button" data-localization-reset>Reset</button>
      </div>
      <div class="localization-summary" data-localization-summary aria-live="polite">${summary(s)}</div>
      <figcaption>A 4000-site normal-chain calculation estimates the growth exponent at zero energy. The superconducting criterion concerns the infinite-chain exponent. The potential shape stays fixed as V changes; for the random curve this means the same seeded sample at every amplitude. The numerical crossing is not an exact classification of a finite wire.</figcaption>
      <noscript><p>The static default is quasiperiodic with Δ/w = 0.3. Changing parameters requires JavaScript.</p></noscript>
    </figure>`;
  }

  function attach(element) {
    if (element.dataset.localizationAttached) return;
    element.dataset.localizationAttached = 'true';
    const delta = element.querySelector('[data-localization-delta]'), landscape = element.querySelector('[data-localization-landscape]');
    function update() {
      const s = state({delta: Number(delta.value), landscape: landscape.value});
      delta.nextElementSibling.textContent = fixed(s.delta, 2);
      element.querySelector('[data-localization-plots]').innerHTML = plots(s);
      element.querySelector('[data-localization-summary]').innerHTML = summary(s);
    }
    delta.addEventListener('input', update); landscape.addEventListener('change', update);
    element.querySelector('[data-localization-reset]').addEventListener('click', () => {delta.value = defaults.delta; landscape.value = defaults.landscape; update();});
    update();
  }
  return Object.freeze({defaults, constants, potential, growth, closedForm, state, chartSVG, initialMarkup, attach});
});
