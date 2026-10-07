/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DirectionsSurfaces = api;
  if (typeof document !== 'undefined') {
    const start = () => document.querySelectorAll('[data-directions-surfaces]').forEach(api.attach);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const radians = Math.PI / 180;
  const defaults = Object.freeze({ mode: 'scalar', separation: 120, flux: 4, zeroLongitude: 30, yaw: 25, showBack: true, patch: 'north', selectedZero: 1 });
  function range(value, name, low, high) {
    if (!Number.isFinite(value) || value < low || value > high) throw new RangeError(`${name} must lie between ${low} and ${high}`);
    return value;
  }
  const dot = (a, b) => a.reduce((sum, x, j) => sum + x * b[j], 0);
  const multiply = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const conjugate = a => [a[0], -a[1]];
  const subtract = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const phase = angle => [Math.cos(angle), Math.sin(angle)];
  function spherePoint(theta, phi) {
    return [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
  }
  function spinor(theta, phi, patch = 'north') {
    range(theta, 'colatitude', 0, Math.PI); range(phi, 'longitude', -100, 100);
    if (patch !== 'north' && patch !== 'south') throw new RangeError('Unknown gauge patch');
    const u = [Math.cos(theta / 2), 0];
    const v = multiply(phase(phi), [Math.sin(theta / 2), 0]);
    return patch === 'north' ? [u, v] : [multiply(phase(-phi), u), multiply(phase(-phi), v)];
  }
  function zeroFactor(theta, phi, zero, patch) {
    const [u, v] = spinor(theta, phi, patch);
    const [ua, va] = spinor(zero.theta, zero.phi);
    return subtract(multiply(u, va), multiply(v, ua));
  }
  // An unnormalized LLL section. Its modulus is that of a chosen state, not an equilibrium prediction.
  function magneticAmplitude(theta, phi, zeros, patch = 'north') {
    return zeros.reduce((value, zero) => multiply(value, zeroFactor(theta, phi, zero, patch)), [1, 0]);
  }
  // Opposite bundle phases cancel: this product is a globally defined scalar.
  function scalarAmplitude(theta, phi, zeros, patch = 'north') {
    if (zeros.length !== 2) throw new RangeError('A scalar example requires one pair');
    return multiply(zeroFactor(theta, phi, zeros[0], patch), conjugate(zeroFactor(theta, phi, zeros[1], patch)));
  }
  function project(vector, yaw, elevation = 18) {
    const p = yaw * radians, e = elevation * radians;
    const right = [-Math.sin(p), Math.cos(p), 0];
    const up = [-Math.sin(e) * Math.cos(p), -Math.sin(e) * Math.sin(p), Math.cos(e)];
    const forward = [Math.cos(e) * Math.cos(p), Math.cos(e) * Math.sin(p), Math.sin(e)];
    return { x: dot(vector, right), y: dot(vector, up), depth: dot(vector, forward) };
  }
  function makeZero(id, theta, phi, winding) {
    return { id, theta, phi, winding, vector: spherePoint(theta, phi) };
  }
  function state(options = {}) {
    const p = { ...defaults, ...options };
    if (p.mode !== 'scalar' && p.mode !== 'magnetic') throw new RangeError('Unknown surface model');
    if (p.patch !== 'north' && p.patch !== 'south') throw new RangeError('Unknown gauge patch');
    range(p.selectedZero, 'selected zero', 1, 8);
    if (!Number.isInteger(p.selectedZero)) throw new RangeError('Selected zero must be an integer');
    range(p.separation, 'separation', 20, 180);
    range(p.flux, 'flux quanta', 0, 8);
    if (!Number.isInteger(p.flux)) throw new RangeError('Flux quanta must be an integer');
    range(p.zeroLongitude, 'zero longitude', 0, 360); range(p.yaw, 'view angle', 0, 360);
    if (typeof p.showBack !== 'boolean') throw new RangeError('Far-side visibility must be boolean');
    let zeros;
    if (p.mode === 'scalar') {
      const half = p.separation * radians / 2;
      zeros = [makeZero(1, Math.PI / 2 - half, 20 * radians, 1), makeZero(2, Math.PI / 2 + half, 20 * radians, -1)];
    } else {
      // A deterministic spread of roots is a choice of state, not an equilibrium prediction.
      zeros = Array.from({ length: p.flux }, (_, j) => makeZero(j + 1,
        Math.acos(1 - 2 * (j + 0.5) / p.flux),
        j === 0 ? p.zeroLongitude * radians : (j * Math.PI * (3 - Math.sqrt(5))) % (2 * Math.PI), 1));
    }
    zeros = zeros.map(zero => ({ ...zero, projected: project(zero.vector, p.yaw) }));
    const front = zeros.filter(zero => zero.projected.depth >= 0).length;
    return { ...p, selectedZero: Math.min(p.selectedZero, Math.max(1, zeros.length)), zeros, front, back: zeros.length - front,
      signedTotal: zeros.reduce((sum, zero) => sum + zero.winding, 0),
      positive: zeros.filter(zero => zero.winding > 0).length,
      negative: zeros.filter(zero => zero.winding < 0).length,
      chernNumber: p.mode === 'scalar' ? 0 : p.flux };
  }
  const fixed = value => value.toFixed(2);
  function fieldAt(s, theta, phi, patch = s.patch) {
    const amplitude = s.mode === 'scalar' ? scalarAmplitude(theta, phi, s.zeros, patch)
      : magneticAmplitude(theta, phi, s.zeros, patch);
    return { amplitude, phase: Math.atan2(amplitude[1], amplitude[0]), modulus: Math.hypot(...amplitude) };
  }
  // A small positively oriented geodesic loop; its tangent basis obeys e_theta × e_phi = n.
  // The phase is evaluated in a regular gauge near the selected zero, including at either pole.
  function windingLoop(s) {
    const zero = s.zeros[s.selectedZero - 1];
    if (!zero) return null;
    const nearest = s.zeros.filter(other => other !== zero).reduce((distance, other) =>
      Math.min(distance, Math.acos(Math.max(-1, Math.min(1, dot(zero.vector, other.vector))))), Math.PI);
    const radius = Math.min(0.16, nearest / 3);
    const a = [Math.cos(zero.theta) * Math.cos(zero.phi), Math.cos(zero.theta) * Math.sin(zero.phi), -Math.sin(zero.theta)];
    const b = [-Math.sin(zero.phi), Math.cos(zero.phi), 0];
    const patch = zero.vector[2] < 0 ? 'south' : 'north';
    let change = 0, previous, minimumModulus = Infinity;
    const points = [];
    for (let j = 0; j <= 128; j++) {
      const angle = 2 * Math.PI * j / 128;
      const vector = zero.vector.map((x, k) => x * Math.cos(radius) + Math.sin(radius) * (a[k] * Math.cos(angle) + b[k] * Math.sin(angle)));
      const theta = Math.acos(Math.max(-1, Math.min(1, vector[2]))), phi = Math.atan2(vector[1], vector[0]);
      const field = fieldAt(s, theta, phi, patch);
      if (previous !== undefined) change += Math.atan2(Math.sin(field.phase - previous), Math.cos(field.phase - previous));
      previous = field.phase;
      minimumModulus = Math.min(minimumModulus, field.modulus);
      points.push(vector);
    }
    return { zeroId: zero.id, radius, points, winding: change / (2 * Math.PI), patch, minimumModulus };
  }
  const palette = [[38, 104, 154], [232, 224, 205], [177, 72, 59], [139, 131, 166]];
  function phaseColor(angle, relativeModulus = 1) {
    const position = ((angle / (2 * Math.PI)) % 1 + 1) % 1 * 4;
    const index = Math.floor(position), fraction = position - index;
    const brightness = 0.12 + 0.88 * Math.sqrt(Math.max(0, Math.min(1, relativeModulus)));
    const channels = palette[index].map((value, j) => Math.round(brightness * (value + fraction * (palette[(index + 1) % 4][j] - value))));
    return `rgb(${channels.join(',')})`;
  }
  let normalizationCache;
  function sampledMaximum(s) {
    const key = JSON.stringify([s.mode, s.separation, s.flux, s.zeroLongitude]);
    if (normalizationCache && normalizationCache.key === key) return normalizationCache.maximum;
    let maximum = 0;
    // Normalize with a whole-sphere mesh, independent of camera and gauge patch.
    for (let i = 0; i <= 36; i++) for (let j = 0; j < 72; j++) {
      maximum = Math.max(maximum, fieldAt(s, i * Math.PI / 36, j * 2 * Math.PI / 72, 'north').modulus);
    }
    normalizationCache = { key, maximum };
    return maximum;
  }
  function fieldTiles(s) {
    const maximum = sampledMaximum(s), cells = [], steps = 54, step = 276 / steps;
    const p = s.yaw * radians, e = 18 * radians;
    const right = [-Math.sin(p), Math.cos(p), 0];
    const up = [-Math.sin(e) * Math.cos(p), -Math.sin(e) * Math.sin(p), Math.cos(e)];
    const forward = [Math.cos(e) * Math.cos(p), Math.cos(e) * Math.sin(p), Math.sin(e)];
    // Sample the front hemisphere in screen coordinates. Clip the boundary cells to a true circle.
    for (let row = 0; row < steps; row++) for (let col = 0; col < steps; col++) {
      let x = -1 + 2 * (col + 0.5) / steps, y = 1 - 2 * (row + 0.5) / steps;
      const radius = Math.hypot(x, y);
      if (radius > 1 + Math.SQRT2 / steps) continue;
      if (radius >= 1) { x *= 0.999999 / radius; y *= 0.999999 / radius; }
      const depth = Math.sqrt(Math.max(0, 1 - x * x - y * y));
      const n = right.map((value, k) => x * value + y * up[k] + depth * forward[k]);
      const sample = fieldAt(s, Math.acos(Math.max(-1, Math.min(1, n[2]))), Math.atan2(n[1], n[0]));
      cells.push(`<rect x="${fixed(72 + col * step)}" y="${fixed(33 + row * step)}" width="${fixed(step + 0.02)}" height="${fixed(step + 0.02)}" fill="${phaseColor(sample.phase, sample.modulus / maximum)}"/>`);
    }
    return cells.join('');
  }
  function gridPath(points, yaw, front) {
    let drawing = false, path = '';
    for (const point of points) {
      const projected = project(point, yaw);
      if ((projected.depth >= 0) === front) {
        path += `${drawing ? 'L' : 'M'}${fixed(210 + 138 * projected.x)} ${fixed(171 - 138 * projected.y)}`;
        drawing = true;
      } else drawing = false;
    }
    return path;
  }
  function globeSVG(s) {
    const circles = [];
    for (const latitude of [-60, -30, 0, 30, 60]) {
      circles.push(Array.from({ length: 145 }, (_, j) => spherePoint((90 - latitude) * radians, 2 * Math.PI * j / 144)));
    }
    for (let longitude = 0; longitude < 180; longitude += 30) {
      const angle = longitude * radians;
      circles.push(Array.from({ length: 145 }, (_, j) => {
        const t = 2 * Math.PI * j / 144;
        return [Math.sin(t) * Math.cos(angle), Math.sin(t) * Math.sin(angle), Math.cos(t)];
      }));
    }
    const paths = circles.map(points => `<path d="${gridPath(points, s.yaw, true)}" stroke="#ffffff" opacity="0.25"/>`).join('');
    const markers = [...s.zeros].sort((a, b) => a.projected.depth - b.projected.depth)
      .filter(zero => s.showBack || zero.projected.depth >= 0).map(zero => {
        const front = zero.projected.depth >= 0, positive = zero.winding > 0;
        const color = positive ? '#145b91' : '#9c4d35';
        const x = 210 + 138 * zero.projected.x, y = 171 - 138 * zero.projected.y;
        return `<g opacity="${front ? 1 : 0.45}"><circle cx="${x}" cy="${y}" r="12" fill="${front ? '#fff' : '#f5f5f5'}" stroke="${color}" stroke-width="2"${front ? '' : ' stroke-dasharray="3 2"'}/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="${color}" font-size="19">${positive ? '+' : '−'}</text><text x="${x + 15}" y="${y - 10}" font-size="12" fill="#444">${zero.id}</text></g>`;
      }).join('');
    const pole = project([0, 0, 1], s.yaw);
    const loop = windingLoop(s);
    let loopDrawing = '';
    if (loop) {
      const front = gridPath(loop.points, s.yaw, true), back = gridPath(loop.points, s.yaw, false);
      loopDrawing = `<path d="${front}" fill="none" stroke="#fff" stroke-width="4"/><path d="${front}" fill="none" stroke="#202020" stroke-width="1.6"/>`;
      if (s.showBack) loopDrawing += `<path d="${back}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 4" opacity="0.6"/>`;
      const j = loop.points.findIndex((point, i) => i > 10 && i < 117 && project(point, s.yaw).depth > 0);
      if (j > 0) {
        const current = project(loop.points[j], s.yaw), next = project(loop.points[j + 1], s.yaw);
        const dx = next.x - current.x, dy = -(next.y - current.y), length = Math.hypot(dx, dy);
        const x = 210 + 138 * current.x, y = 171 - 138 * current.y, ux = dx / length, uy = dy / length;
        loopDrawing += `<path d="M${x + 4 * ux} ${y + 4 * uy}L${x - 4 * ux + 3 * uy} ${y - 4 * uy - 3 * ux}L${x - 4 * ux - 3 * uy} ${y - 4 * uy + 3 * ux}Z" fill="#202020" stroke="#fff" stroke-width="0.8"/>`;
      }
    }
    const gaugePole = project([0, 0, s.patch === 'north' ? -1 : 1], s.yaw);
    const gaugeMark = s.mode === 'magnetic' && s.flux > 0 && (s.showBack || gaugePole.depth >= 0)
      ? `<g opacity="${gaugePole.depth >= 0 ? 1 : 0.6}"><circle cx="${210 + 138 * gaugePole.x}" cy="${171 - 138 * gaugePole.y}" r="8" fill="#fff" stroke="#444" stroke-dasharray="2 2"/><text x="${210 + 138 * gaugePole.x}" y="${176 - 138 * gaugePole.y}" text-anchor="middle" font-size="17" fill="#444">×</text></g>` : '';
    const key = Array.from({ length: 64 }, (_, j) => `<rect x="${92 + j * 236 / 64}" y="357" width="${236 / 64 + 0.1}" height="12" fill="${phaseColor(j * 2 * Math.PI / 64)}"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 402" role="img" aria-labelledby="surface-globe-title surface-globe-description">
      <title id="surface-globe-title">${s.mode === 'scalar' ? 'A scalar vortex and antivortex' : `${s.flux} positive zeros in a magnetic LLL state`}</title>
      <desc id="surface-globe-description">Color shows the phase of the chosen ${s.mode === 'scalar' ? 'globally defined scalar' : `LLL section in the ${s.patch} gauge patch`}; darker shading means smaller modulus with square-root contrast. ${s.front} zeros lie on the near hemisphere and ${s.back} on the far hemisphere. The whole-sphere signed count is ${s.signedTotal}.${loop ? ` The small oriented loop around zero ${loop.zeroId} gives winding ${fixed(loop.winding)}.` : ''}</desc>
      <defs><clipPath id="surface-disk"><circle cx="210" cy="171" r="138"/></clipPath></defs>
      <g clip-path="url(#surface-disk)" shape-rendering="crispEdges">${fieldTiles(s)}</g>
      <circle cx="210" cy="171" r="138" fill="none" stroke="#8c989f" stroke-width="1.2"/>
      <g fill="none" stroke-width="0.8">${paths}</g>
      <g font-family="Georgia,serif">${loopDrawing}${markers}${gaugeMark}<text x="${210 + 138 * pole.x}" y="${171 - 138 * pole.y - 19}" text-anchor="middle" font-size="13" fill="#444" stroke="#fff" stroke-width="0.3">north</text>
      <text x="210" y="334" text-anchor="middle" font-size="14" fill="#555">${s.mode === 'scalar' ? 'Scalar phase' : `${s.patch === 'north' ? 'North' : 'South'} gauge patch`} · view ${Math.round(s.yaw)}°</text>
      ${key}<text x="92" y="387" text-anchor="middle" font-size="13">0</text><text x="210" y="387" text-anchor="middle" font-size="13">π</text><text x="328" y="387" text-anchor="middle" font-size="13">2π</text><text x="53" y="368" font-size="13">Phase</text></g>
    </svg>`;
  }
  function ledger(s) {
    const loop = windingLoop(s);
    return `<h3>Count the whole sphere</h3>
      <p class="surface-count">${s.positive} positive − ${s.negative} negative = <strong>${s.signedTotal}</strong></p>
      <p>${s.mode === 'scalar' ? 'A globally defined scalar has total signed winding zero.' : `The bundle has Chern number ${s.chernNumber}; this LLL state has ${s.flux} positive zeros, counted with multiplicity.`}</p>
      <p>${s.front} near-side · ${s.back} far-side. Rotating the view changes visibility, not this total.</p>
      <ul class="surface-zero-list">${s.zeros.map(zero => `<li>Zero ${zero.id}: ${zero.winding > 0 ? '+1' : '−1'}, ${zero.projected.depth >= 0 ? 'near' : 'far'} side</li>`).join('') || '<li>No zeros: the zero-flux LLL state is constant.</li>'}</ul>
      ${loop ? `<p><strong>Follow the small loop:</strong> zero ${loop.zeroId} gives Δarg Ψ/(2π) = ${fixed(loop.winding)}. The arrow follows positive orientation around the local outward normal${s.mode === 'magnetic' ? `; the count uses a regular ${loop.patch} patch near this zero` : ''}.</p>` : ''}
      ${s.mode === 'magnetic' && s.flux > 0 ? `<p><strong>× Gauge pole:</strong> the ${s.patch === 'north' ? 'south' : 'north'} pole is outside the selected gauge patch. Its nonzero modulus is continuous; its phase in this gauge is undefined there. Switching patches moves this defect and leaves the physical zeros fixed.</p>` : ''}`;
  }
  function initialMarkup() {
    const s = state();
    return `<figure class="inline-figure directions-surfaces" data-directions-surfaces>
      <style>
      .directions-surfaces .surface-layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:24px;align-items:center}
      .directions-surfaces .surface-globe svg{display:block;width:100%;height:auto}
      .directions-surfaces .surface-ledger{font-size:16px;line-height:1.5}
      .directions-surfaces .surface-ledger h3{font-size:21px;font-weight:normal;margin:8px 0 12px}
      .directions-surfaces .surface-ledger p{margin:12px 0}
      .directions-surfaces .surface-count{font-size:21px}
      .directions-surfaces .surface-zero-list{font:13px/1.45 system-ui,sans-serif;padding-left:18px;margin:14px 0;columns:2}
      .directions-surfaces .surface-zero-list li{margin:4px 0;break-inside:avoid}
      .directions-surfaces .surface-legend{font:13px/1.5 system-ui,sans-serif;color:#555;margin:8px 0 18px}
      .directions-surfaces [hidden]{display:none!important}
      .directions-surfaces input[type=checkbox]{width:auto}
      .directions-surfaces .figure-controls{border-top:1px solid #ddd;padding-top:16px}
      @media(max-width:650px){.directions-surfaces .surface-layout{grid-template-columns:1fr;gap:4px}.directions-surfaces .surface-globe{max-width:430px;width:100%;margin:auto}.directions-surfaces .surface-ledger{padding:0 12px}}
      @media print{.directions-surfaces .surface-layout{grid-template-columns:1.15fr 1fr;gap:12pt}.directions-surfaces .surface-ledger{font-size:9pt}.directions-surfaces .surface-count,.directions-surfaces .surface-ledger h3{font-size:11pt}.directions-surfaces .surface-zero-list,.directions-surfaces .surface-legend{font-size:8pt}}
      </style>
      <div class="surface-layout"><div class="surface-globe" data-surface-globe>${globeSVG(s)}</div><div class="surface-ledger" data-surface-ledger aria-live="polite">${ledger(s)}</div></div>
      <p class="surface-legend">Color: phase (gauge-dependent for the magnetic state). Darkening within each hue: smaller |Ψ| relative to its sampled maximum over the sphere, with square-root contrast; this shows modulus, not probability density. Blue + and rust − mark physical zeros; dashed, pale markers are on the far side. The arrow follows the selected zero's small winding loop.</p>
      <div class="figure-controls">
        <label for="surface-model">State <select id="surface-model" data-surface-input="mode"><option value="scalar">Scalar vortex–antivortex pair</option><option value="magnetic">Magnetic lowest Landau level</option></select></label>
        <label for="surface-separation" data-surface-scalar>Pair separation <input id="surface-separation" data-surface-input="separation" type="range" min="20" max="180" step="5" value="120"><output for="surface-separation">120°</output></label>
        <label for="surface-flux" data-surface-magnetic hidden>Flux quanta <input id="surface-flux" data-surface-input="flux" type="range" min="0" max="8" step="1" value="4"><output for="surface-flux">4</output></label>
        <label for="surface-zero" data-surface-magnetic hidden>Zero 1 longitude <input id="surface-zero" data-surface-input="zeroLongitude" type="range" min="0" max="360" step="5" value="30"><output for="surface-zero">30°</output></label>
        <label for="surface-patch" data-surface-magnetic hidden>Gauge patch <select id="surface-patch" data-surface-input="patch"><option value="north">North (excludes south pole)</option><option value="south">South (excludes north pole)</option></select></label>
        <label for="surface-loop">Inspect a winding <select id="surface-loop" data-surface-input="selectedZero"><option value="1">Zero 1 (+1)</option><option value="2">Zero 2 (−1)</option></select></label>
        <label for="surface-yaw">Rotate view <input id="surface-yaw" data-surface-input="yaw" type="range" min="0" max="360" step="5" value="25"><output for="surface-yaw">25°</output></label>
        <label for="surface-back"><input id="surface-back" data-surface-input="showBack" type="checkbox" checked>Show far-side markers</label>
        <button type="button" data-surface-turn>Turn around</button><button type="button" data-surface-reset>Reset</button>
      </div>
      <figcaption>Phase, relative modulus and winding counts of explicit scalar and LLL functions on a sphere. The controls select configurations and viewpoints; they do not solve the Gross–Pitaevskii equation, predict equilibrium positions, or evolve vortices. Phase in the magnetic case depends on the chosen gauge patch. The ledger always includes the far hemisphere.</figcaption>
      <noscript><p>The default shows a scalar pair separated by 120°. Its signed total is zero. Changing the state or viewpoint requires JavaScript.</p></noscript>
    </figure>`;
  }
  function attach(element) {
    if (element.dataset.surfacesAttached) return;
    element.dataset.surfacesAttached = 'true';
    const inputs = [...element.querySelectorAll('[data-surface-input]')];
    function update() {
      const values = Object.fromEntries(inputs.map(input => [input.dataset.surfaceInput,
        input.type === 'checkbox' ? input.checked : ['mode', 'patch'].includes(input.dataset.surfaceInput) ? input.value : Number(input.value)]));
      const s = state(values);
      for (const input of inputs) {
        if (input.type === 'range') input.nextElementSibling.textContent = `${values[input.dataset.surfaceInput]}${input.dataset.surfaceInput === 'flux' ? '' : '°'}`;
        if (input.dataset.surfaceInput === 'zeroLongitude') input.disabled = s.flux === 0;
        if (input.dataset.surfaceInput === 'selectedZero') {
          input.innerHTML = s.zeros.map(zero => `<option value="${zero.id}">Zero ${zero.id} (${zero.winding > 0 ? '+1' : '−1'})</option>`).join('') || '<option value="1">No zeros</option>';
          input.value = s.selectedZero;
          input.disabled = s.zeros.length === 0;
        }
      }
      element.querySelectorAll('[data-surface-scalar]').forEach(node => { node.hidden = s.mode !== 'scalar'; });
      element.querySelectorAll('[data-surface-magnetic]').forEach(node => { node.hidden = s.mode !== 'magnetic'; });
      element.querySelector('[data-surface-globe]').innerHTML = globeSVG(s);
      element.querySelector('[data-surface-ledger]').innerHTML = ledger(s);
    }
    for (const input of inputs) input.addEventListener(input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input', update);
    element.querySelector('[data-surface-turn]').addEventListener('click', () => {
      const yaw = inputs.find(input => input.dataset.surfaceInput === 'yaw');
      yaw.value = (Number(yaw.value) + 180) % 360;
      update();
    });
    element.querySelector('[data-surface-reset]').addEventListener('click', () => {
      for (const input of inputs) {
        if (input.type === 'checkbox') input.checked = defaults[input.dataset.surfaceInput];
        else input.value = defaults[input.dataset.surfaceInput];
      }
      update();
    });
    update();
  }
  return Object.freeze({ defaults, spherePoint, spinor, magneticAmplitude, scalarAmplitude, project, state, fieldAt, windingLoop, phaseColor, sampledMaximum, globeSVG, initialMarkup, attach });
});
