/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DirectionsSaddle = api;
  if (typeof document !== 'undefined') {
    const start = () => document.querySelectorAll('[data-directions-saddle]').forEach(api.attach);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const defaults = Object.freeze({ x0: 2, y0: 0.5, tau: 0.75 });

  function bounded(value, name, limit) {
    if (!Number.isFinite(value) || Math.abs(value) > limit) {
      throw new RangeError(`${name} must be finite and have magnitude at most ${limit}`);
    }
    return value;
  }

  // Integrate exp(-u²) directly. Saturation at six has error below double precision.
  function erf(x) {
    bounded(x, 'erf argument', 1e6);
    const a = Math.abs(x);
    if (a >= 6) return Math.sign(x);
    const n = 256, step = a / n;
    let sum = 1 + Math.exp(-a * a);
    for (let j = 1; j < n; j++) sum += (j % 2 ? 4 : 2) * Math.exp(-((j * step) ** 2));
    return Math.sign(x) * 2 * step * sum / (3 * Math.sqrt(Math.PI));
  }

  function state({ x0 = defaults.x0, y0 = defaults.y0, tau = defaults.tau } = {}) {
    bounded(x0, 'x0', 10); bounded(y0, 'y0', 10); bounded(tau, 'tau', 10);
    const contraction = Math.exp(-tau), expansion = Math.exp(tau);
    const tanh = Math.tanh(tau);
    return {
      x0, y0, tau,
      meanX: x0 * contraction,
      meanY: y0 * expansion,
      varianceX: contraction * contraction / 2,
      varianceY: expansion * expansion / 2,
      covarianceXY: 0,
      localDecayRate: tanh - (x0 * x0 - y0 * y0) / (2 * Math.cosh(tau) ** 2),
      peakTime: Math.max(0, Math.asinh(x0 * x0 - y0 * y0) / 2),
      originOverlap: Math.exp(-x0 * x0 * (1 - tanh) / 2 - y0 * y0 * (1 + tanh) / 2) / Math.cosh(tau),
      positiveY: (1 + erf(y0)) / 2,
      lateOverlap: 2 * Math.exp(-y0 * y0 - tau)
    };
  }

  // Flux fraction into +Y for a monochromatic state incident from +X.
  // epsilon = E/(hbar lambda), with the saddle energy subtracted.
  function stationarySplit(epsilon) {
    bounded(epsilon, 'scaled energy', 1e6);
    const decaying = Math.exp(-2 * Math.PI * Math.abs(epsilon));
    const positiveY = epsilon >= 0 ? decaying / (1 + decaying) : 1 / (1 + decaying);
    return { positiveY, negativeY: 1 - positiveY };
  }

  const fixed = (value, digits = 2) => (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits);

  function covarianceSVG(s) {
    const sigmaX = Math.sqrt(s.varianceX), sigmaY = Math.sqrt(s.varianceY);
    // Both axes use the same scale; expanding the bounds never changes the aspect ratio.
    const extent = Math.ceil(Math.max(4, Math.abs(s.x0) + 1.5, Math.abs(s.y0) + 1.5,
      Math.abs(s.meanX) + 1.3 * sigmaX, Math.abs(s.meanY) + 1.3 * sigmaY) / 2) * 2;
    const scale = 126 / extent, cx = 174, cy = 155;
    const x = value => cx + scale * value, y = value => cy - scale * value;
    return `<svg viewBox="0 0 352 320" role="img" aria-labelledby="saddle-cov-title saddle-cov-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="saddle-cov-title">Guiding-center covariance ellipse</title>
      <desc id="saddle-cov-desc">The blue ellipse is centered at (${fixed(s.meanX)}, ${fixed(s.meanY)}) in magnetic lengths, with standard deviations ${fixed(sigmaX)} and ${fixed(sigmaY)}. The dashed ellipse is the initial state. Both axes span minus ${extent} to plus ${extent} magnetic lengths.</desc>
      <g font-family="Georgia,serif" font-size="14" fill="#343434">
      <path d="M48 155H300M174 29V281" fill="none" stroke="#b8b8b8"/>
      <path d="M48 151V159M300 151V159M170 29H178M170 281H178" stroke="#aaa"/>
      <text x="48" y="179" text-anchor="middle">−${extent}</text><text x="300" y="179" text-anchor="middle">${extent}</text>
      <text x="161" y="33" text-anchor="end">${extent}</text><text x="161" y="285" text-anchor="end">−${extent}</text>
      <text x="311" y="148">X/ℓ</text><text x="186" y="24">Y/ℓ</text><text x="163" y="172">0</text>
      <ellipse cx="${x(s.x0)}" cy="${y(s.y0)}" rx="${scale / Math.sqrt(2)}" ry="${scale / Math.sqrt(2)}" fill="none" stroke="#777" stroke-width="1.5" stroke-dasharray="4 3"/>
      <ellipse cx="${x(s.meanX)}" cy="${y(s.meanY)}" rx="${scale * sigmaX}" ry="${scale * sigmaY}" fill="#145b911c" stroke="#145b91" stroke-width="2"/>
      <circle cx="${x(s.meanX)}" cy="${y(s.meanY)}" r="2.5" fill="#145b91"/>
      <text x="174" y="313" text-anchor="middle">Equal axis scales · range ±${extent}ℓ</text></g>
    </svg>`;
  }

  function overlapSVG(s, logarithmic = true) {
    const left = 43, top = 28, width = 280, height = 238;
    const x = tau => left + width * tau / 6;
    const y = p => top + height * (logarithmic ? -Math.log10(p) / 4 : 1 - p);
    const exact = [], asymptotic = [];
    for (let j = 0; j <= 160; j++) {
      const t = 6 * j / 160, sample = state({ x0: s.x0, y0: s.y0, tau: t });
      exact.push(`${j ? 'L' : 'M'}${fixed(x(t), 3)} ${fixed(y(sample.originOverlap), 3)}`);
      if (t >= 1) asymptotic.push(`${asymptotic.length ? 'L' : 'M'}${fixed(x(t), 3)} ${fixed(y(sample.lateOverlap), 3)}`);
    }
    return `<svg viewBox="0 0 352 320" role="img" aria-labelledby="saddle-overlap-title saddle-overlap-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="saddle-overlap-title">Probability of projection onto the fixed origin mode</title>
      <desc id="saddle-overlap-desc">The solid curve is the exact coherent-mode overlap from scaled time zero to six, on a ${logarithmic ? 'logarithmic' : 'linear'} probability axis. The dashed curve is its late-time approximation. At the selected time ${fixed(s.tau)}, the probability is ${fixed(s.originOverlap, 4)}, with local decay rate ${fixed(s.localDecayRate, 3)} in units of lambda.</desc>
      <defs><clipPath id="saddle-overlap-window"><rect x="43" y="28" width="280" height="238"/></clipPath></defs>
      <g font-family="Georgia,serif" font-size="14" fill="#343434">
      <path d="M43 28V266H323" fill="none" stroke="#888"/>
      ${(logarithmic ? [[1, '1'], [0.1, '10⁻¹'], [0.01, '10⁻²'], [0.001, '10⁻³'], [0.0001, '10⁻⁴']] : [[1, '1'], [0.5, '½'], [0, '0']]).map(([p, label]) => `<path d="M43 ${y(p)}H323" stroke="#ddd"/><text x="36" y="${y(p) + 4}" text-anchor="end" font-size="12">${label}</text>`).join('')}
      <text x="43" y="18" font-size="12">${logarithmic ? 'Log probability' : 'Probability'}</text>
      ${[0, 1, 2, 3, 4, 5, 6].map(t => `<text x="${x(t)}" y="288" text-anchor="middle">${t}</text>`).join('')}
      <text x="183" y="313" text-anchor="middle">Scaled time τ = λt</text>
      <g clip-path="url(#saddle-overlap-window)">
      <path d="${asymptotic.join('')}" fill="none" stroke="#a26a35" stroke-width="1.8" stroke-dasharray="5 4"/>
      <path d="${exact.join('')}" fill="none" stroke="#145b91" stroke-width="2.3"/>
      <path d="M${x(s.tau)} 266V${y(s.originOverlap)}" stroke="#145b91" stroke-width="1" stroke-dasharray="2 3"/>
      <circle cx="${x(s.tau)}" cy="${y(s.originOverlap)}" r="4" fill="#145b91"/>
      </g></g></svg>`;
  }

  function summary(s) {
    return `<p><strong>At τ = ${fixed(s.tau)}:</strong> the standard deviations are ΔX/ℓ = ${fixed(Math.sqrt(s.varianceX), 3)} and ΔY/ℓ = ${fixed(Math.sqrt(s.varianceY), 3)}. Their product stays ½.</p>
      <p><strong>Origin-mode overlap:</strong> ${fixed(100 * s.originOverlap, 2)}%. <strong>Positive-Y fraction:</strong> ${fixed(100 * s.positiveY, 2)}%, unchanged by evolving time.</p>
      <p><strong>Local decay rate −d ln P₀/dτ:</strong> ${fixed(s.localDecayRate, 3)}${s.localDecayRate < 0 ? ' (negative means the overlap is rising)' : ''}; it tends to 1. The overlap peaks at τ = ${fixed(s.peakTime, 3)} for τ ≥ 0.</p>`;
  }

  function initialMarkup() {
    const s = state(defaults);
    return `<figure class="inline-figure directions-saddle" data-directions-saddle>
      <style>
      .directions-saddle .saddle-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
      .directions-saddle .saddle-panel h3{font-size:18px;font-weight:normal;line-height:1.4;margin:0 0 8px}
      .directions-saddle .saddle-panel svg{width:100%;height:auto;display:block}
      .directions-saddle .saddle-legend{font:13px/1.5 system-ui,sans-serif;color:#555;margin:4px 0 12px}
      .directions-saddle .saddle-summary{font-size:16px;line-height:1.5}
      .directions-saddle .saddle-summary p{margin:10px 0}
      .directions-saddle .figure-controls{border-top:1px solid #ddd;padding-top:16px}
      @media(max-width:660px){.directions-saddle .saddle-panels{grid-template-columns:1fr;gap:24px}.directions-saddle .saddle-panel{max-width:430px;width:100%;margin:auto}}
      @media print{.directions-saddle .saddle-panels{grid-template-columns:1fr 1fr}.directions-saddle .saddle-summary{font-size:9pt}.directions-saddle .saddle-panel h3{font-size:11pt}.directions-saddle .saddle-legend{font-size:8pt}}
      </style>
      <div class="saddle-panels">
        <div class="saddle-panel"><h3>One packet, squeezed</h3><div data-saddle-covariance>${covarianceSVG(s)}</div><p class="saddle-legend">Blue: current covariance · dashed gray: initial covariance. Ellipse radii are one standard deviation; axis limits expand together when needed.</p></div>
        <div class="saddle-panel"><h3>A fixed mode at the origin</h3><div data-saddle-overlap>${overlapSVG(s)}</div><p class="saddle-legend">Blue: exact overlap · dashed brown: late-time form. A straight tail on the log scale reveals exponential decay. The dot marks the selected time.</p></div>
      </div>
      <div class="figure-controls">
        <label for="saddle-x0">Initial X/ℓ <input id="saddle-x0" data-saddle-input="x0" type="range" min="0" max="3" step="0.1" value="${defaults.x0}"><output for="saddle-x0">${fixed(defaults.x0)}</output></label>
        <label for="saddle-y0">Initial Y/ℓ <input id="saddle-y0" data-saddle-input="y0" type="range" min="-1.5" max="1.5" step="0.1" value="${defaults.y0}"><output for="saddle-y0">${fixed(defaults.y0)}</output></label>
        <label for="saddle-tau">Time τ <input id="saddle-tau" data-saddle-input="tau" type="range" min="0" max="6" step="0.05" value="${defaults.tau}"><output for="saddle-tau">${fixed(defaults.tau)}</output></label>
        <label for="saddle-scale">Overlap scale <select id="saddle-scale" data-saddle-scale><option value="log">Logarithmic</option><option value="linear">Linear</option></select></label>
        <button type="button" data-saddle-reset>Reset</button>
      </div>
      <div class="saddle-summary" data-saddle-summary aria-live="polite">${summary(s)}</div>
      <figcaption>A coherent guiding-center state evolves under the ideal quadratic saddle. The ellipse describes noncommuting guiding-center coordinates; it is not a joint position measurement. The right panel uses a projection onto a fixed coherent mode, not a detector collecting a finite region.</figcaption>
      <noscript><p>The displayed default is X₀/ℓ = 2, Y₀/ℓ = 0.5 and τ = 0.75. The figures and calculation remain readable; changing parameters requires JavaScript.</p></noscript>
    </figure>`;
  }

  function attach(element) {
    if (element.dataset.saddleAttached) return;
    element.dataset.saddleAttached = 'true';
    const inputs = [...element.querySelectorAll('[data-saddle-input]')];
    const scaleControl = element.querySelector('[data-saddle-scale]');
    function update() {
      const params = Object.fromEntries(inputs.map(input => [input.dataset.saddleInput, Number(input.value)]));
      const s = state(params);
      for (const input of inputs) input.nextElementSibling.textContent = fixed(params[input.dataset.saddleInput]);
      element.querySelector('[data-saddle-covariance]').innerHTML = covarianceSVG(s);
      element.querySelector('[data-saddle-overlap]').innerHTML = overlapSVG(s, scaleControl.value === 'log');
      element.querySelector('[data-saddle-summary]').innerHTML = summary(s);
    }
    for (const input of inputs) input.addEventListener('input', update);
    scaleControl.addEventListener('change', update);
    element.querySelector('[data-saddle-reset]').addEventListener('click', () => {
      for (const input of inputs) input.value = defaults[input.dataset.saddleInput];
      scaleControl.value = 'log';
      update();
    });
    update();
  }

  return Object.freeze({ defaults, erf, state, stationarySplit, covarianceSVG, overlapSVG, initialMarkup, attach });
});
