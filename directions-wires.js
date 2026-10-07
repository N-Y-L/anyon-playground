/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DirectionsWires = api;
  if (typeof document !== 'undefined') {
    const start = () => document.querySelectorAll('[data-directions-wires]').forEach(api.attach);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
    else start();
  }
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  // All energies are measured in the positive hopping w; the lattice spacing is one.
  const defaults = Object.freeze({sites: 20, delta: 0.2, mu: 0.6});

  const BIG = 1e120, SMALL = 1e-120;

  function workspace(N) {
    const A = () => new Float64Array(N);
    return { N, dl: A(), d: A(), du: A(), du2: A(), piv: new Uint8Array(N), x: A(), y: A(), p: A(), D: A(), l1: A(), l2: A() };
  }

  // LU factorization of M with partial pivoting (the scheme of LAPACK dgttrf). Returns sign(det M).
  // Pivots smaller than 1e-20 are replaced by 1e-20 so that the solves stay finite for an exactly singular M.
  function factorM(W, a, b, mu, scale) {
    const { N, dl, d, du, du2, piv } = W, tiny = 1e-20 * scale;
    for (let i = 0; i < N; i++) { d[i] = -mu; dl[i] = -b; du[i] = -a; du2[i] = 0; piv[i] = 0; }
    let sign = 1;
    for (let i = 0; i < N - 1; i++) {
      if (Math.abs(d[i]) >= Math.abs(dl[i])) {
        if (Math.abs(d[i]) < tiny) d[i] = d[i] < 0 ? -tiny : tiny;
        const m = dl[i] / d[i];
        dl[i] = m; d[i + 1] -= m * du[i];
      } else {
        const m = d[i] / dl[i];
        d[i] = dl[i]; dl[i] = m;
        const t = du[i]; du[i] = d[i + 1]; d[i + 1] = t - m * du[i];
        if (i < N - 2) { du2[i] = du[i + 1]; du[i + 1] = -m * du[i + 1]; }
        piv[i] = 1; sign = -sign;
      }
      if (d[i] < 0) sign = -sign;
    }
    if (Math.abs(d[N - 1]) < tiny) d[N - 1] = d[N - 1] < 0 ? -tiny : tiny;
    if (d[N - 1] < 0) sign = -sign;
    return sign;
  }
  const rescale = v => { for (let i = 0; i < v.length; i++) v[i] *= SMALL; };
  // v <- M^-1 v, up to a positive factor. Returns how many times the vector was scaled by 1e-120 to avoid overflow.
  function solveM(W, v) {
    const { N, dl, d, du, du2, piv } = W;
    let k = 0;
    for (let i = 0; i < N - 1; i++) {
      if (piv[i]) { const t = v[i]; v[i] = v[i + 1]; v[i + 1] = t - dl[i] * v[i]; } else v[i + 1] -= dl[i] * v[i];
    }
    v[N - 1] /= d[N - 1];
    if (Math.abs(v[N - 1]) > BIG) { rescale(v); k++; }
    if (N > 1) { v[N - 2] = (v[N - 2] - du[N - 2] * v[N - 1]) / d[N - 2]; if (Math.abs(v[N - 2]) > BIG) { rescale(v); k++; } }
    for (let i = N - 3; i >= 0; i--) {
      v[i] = (v[i] - du[i] * v[i + 1] - du2[i] * v[i + 2]) / d[i];
      if (Math.abs(v[i]) > BIG) { rescale(v); k++; }
    }
    return k;
  }
  // v <- M^-T v, up to a positive factor (same convention).
  function solveMT(W, v) {
    const { N, dl, d, du, du2, piv } = W;
    let k = 0;
    v[0] /= d[0];
    if (Math.abs(v[0]) > BIG) { rescale(v); k++; }
    if (N > 1) { v[1] = (v[1] - du[0] * v[0]) / d[1]; if (Math.abs(v[1]) > BIG) { rescale(v); k++; } }
    for (let i = 2; i < N; i++) {
      v[i] = (v[i] - du[i - 1] * v[i - 1] - du2[i - 2] * v[i - 2]) / d[i];
      if (Math.abs(v[i]) > BIG) { rescale(v); k++; }
    }
    for (let i = N - 2; i >= 0; i--) {
      if (piv[i]) { const t = v[i + 1]; v[i + 1] = v[i] - dl[i] * t; v[i] = t; } else v[i] -= dl[i] * v[i + 1];
    }
    return k;
  }
  function normalize(v) {
    let s = 0;
    for (let i = 0; i < v.length; i++) s += v[i] * v[i];
    s = Math.sqrt(s);
    if (s > 0) { const r = 1 / s; for (let i = 0; i < v.length; i++) v[i] *= r; }
    return s;
  }

  // Cholesky-type factorization L D L^T of the pentadiagonal matrix T - s, T = M^T M:
  //   T[j][j] = mu^2 + a^2 (j > 1) + b^2 (j < N),  T[j][j+1] = mu (a + b),  T[j][j+2] = a b.
  // It succeeds with all D > 0 exactly when T - s is positive definite, that is when s < E0^2.
  function factorT(W, a, b, mu, s) {
    const { N, D, l1, l2 } = W, e = mu * (a + b), f = a * b, base = mu * mu - s, a2 = a * a, b2 = b * b;
    let Dj = base + (N > 1 ? b2 : 0);
    if (!(Dj > 0)) return false;
    D[0] = Dj; l1[0] = e / Dj; l2[0] = f / Dj;
    for (let j = 1; j < N; j++) {
      Dj = base + a2 + (j < N - 1 ? b2 : 0) - l1[j - 1] * l1[j - 1] * D[j - 1] - (j > 1 ? f * l2[j - 2] : 0);
      if (!(Dj > 0)) return false;
      D[j] = Dj; l1[j] = (e - f * l1[j - 1]) / Dj; l2[j] = f / Dj;
    }
    return true;
  }
  function solveT(W, v) {
    const { N, D, l1, l2 } = W;
    if (N > 1) v[1] -= l1[0] * v[0];
    for (let j = 2; j < N; j++) v[j] -= l1[j - 1] * v[j - 1] + l2[j - 2] * v[j - 2];
    for (let j = 0; j < N; j++) v[j] /= D[j];
    if (N > 1) v[N - 2] -= l1[N - 2] * v[N - 1];
    for (let j = N - 3; j >= 0; j--) v[j] -= l1[j] * v[j + 1] + l2[j] * v[j + 2];
  }

  // Smallest singular value E0 of M and its right singular vector, in O(N) operations per step.
  //
  // Stage A: inverse iteration x <- (M^T M)^-1 x with two tridiagonal solves per step. With u = M^-T x / |M^-T x|
  //   the estimate E0 = 1 / |M^-1 u| has relative error of second order in the error of u, also when E0 is tiny.
  //   The error contracts by q = (E0/E1)^2 per step; the stage ends when q times the last change is below 1e-9.
  // Stage B (only if q > 0.1, where E0 is not small): the same iteration with a shift, x <- (M^T M - s)^-1 x.
  //   A shift s is used only if the Cholesky factorization of M^T M - s succeeds; in exact arithmetic this gives s < E0^2, so the
  //   iteration can only converge to the lowest mode. With s = (Rayleigh quotient) - (residual) convergence is quadratic.
  // Inverse solves retain small-energy information without forming M^T M in stage A.
  // Near an analytic zero, input rounding and pivot regularization limit the returned energy.
  // Written for delta >= 0; the returned vector is the workspace array and is overwritten by the next call.
  function lowestMode(N, delta, mu, W) {
    W = W && W.N === N ? W : workspace(N);
    const a = 1 + delta, b = 1 - delta, scale = Math.abs(mu) + Math.abs(a) + Math.abs(b);
    const { x, y, p } = W;
    const detSign = factorM(W, a, b, mu, scale);
    for (let i = 0; i < N; i++) { const t = (i + 1) * 0.6180339887498949; x[i] = t - Math.floor(t) - 0.37; }
    normalize(x);
    let sigma = 0, previous = Infinity, steps = 0, stage = 'A', converged = false, lower = 0;
    for (let k = 1; k <= 40 && !converged; k++) {
      y.set(x);
      solveMT(W, y); normalize(y);
      const scaled = solveM(W, y), nz = normalize(y);
      let change = 0;
      for (let i = 0; i < N; i++) { const t = y[i] - x[i]; change += t * t; }
      change = Math.sqrt(change);
      x.set(y);
      sigma = nz > 0 ? 1 / nz : 0;
      for (let i = 0; i < scaled; i++) sigma *= SMALL;
      steps = k;
      if (change <= 1e-13) converged = true;
      else if (k >= 2) {
        const rate = change / previous;
        if (rate * change <= 1e-9 && rate < 0.5) converged = true;
        else if (rate > 0.1 && sigma > 1e-5) break;
      }
      previous = change;
    }
    if (!converged) {
      stage = 'B';
      const tolerance = 2e-15 * scale * scale;
      let factor = 1;
      for (let k = 0; k <= 60; k++) {
        // Rayleigh quotient theta = |M x|^2 and residual r = |M^T M x - theta x|, both with M itself.
        let theta = 0, r = 0;
        for (let i = 0; i < N; i++) { const t = -mu * x[i] - (i > 0 ? b * x[i - 1] : 0) - (i < N - 1 ? a * x[i + 1] : 0); p[i] = t; theta += t * t; }
        for (let i = 0; i < N; i++) { const t = -mu * p[i] - (i > 0 ? a * p[i - 1] : 0) - (i < N - 1 ? b * p[i + 1] : 0) - theta * x[i]; r += t * t; }
        r = Math.sqrt(r);
        sigma = Math.sqrt(theta);
        if (r <= 1e-9 * theta + tolerance) { converged = true; break; }
        if (k === 60) break;
        let s = theta - factor * r, ok = false;
        for (let tries = 0; tries < 12; tries++) {
          if (s <= lower) s = lower;
          ok = factorT(W, a, b, mu, s);
          if (ok || s === lower) break;
          factor *= 4; s = theta - factor * r;
        }
        if (!ok) break;
        lower = s;
        solveT(W, x); normalize(x);
        steps++;
        factor = Math.max(1, factor / 2);
      }
    }
    return { E0: sigma, v: x, detSign, stage, steps, converged, lowerBound: Math.sqrt(lower) };
  }

  function parameters({sites = defaults.sites, delta = defaults.delta, mu = defaults.mu} = {}) {
    if (!Number.isInteger(sites) || sites < 2 || sites > 120) throw new RangeError('sites must be an integer from 2 to 120');
    if (!Number.isFinite(delta) || delta <= 0 || delta >= 1) throw new RangeError('delta must satisfy 0 < delta < 1');
    if (!Number.isFinite(mu) || Math.abs(mu) > 3) throw new RangeError('mu must be finite with magnitude at most 3');
    return {sites, delta, mu};
  }

  function zeroCrossings(sites, delta) {
    parameters({sites, delta});
    const boundary = 2 * Math.sqrt(1 - delta * delta);
    return Array.from({length: sites}, (_, j) => boundary * Math.cos((sites - j) * Math.PI / (sites + 1)));
  }

  function state(options = {}) {
    const {sites, delta, mu} = parameters(options);
    // Solve the left boundary problem at zero energy, without imposing the right boundary.
    const raw = [0, 1];
    for (let j = 1; j <= sites; j++) raw.push((-mu * raw[j] - (1 - delta) * raw[j - 1]) / (1 + delta));
    const norm = Math.hypot(...raw.slice(1, sites + 1));
    const profile = raw.slice(1, sites + 1).map(value => value / norm);
    const next = raw[sites + 1] / norm;
    const crossings = zeroCrossings(sites, delta);
    const nearest = crossings.reduce((best, value) => Math.abs(mu - value) < Math.abs(mu - best) ? value : best);
    // A tiny residual can also mean strong localization. Identify a crossing from its analytic location.
    const atCrossing = Math.abs(mu - nearest) < 1e-12;
    const crossed = crossings.filter(value => value < mu).length;
    const oscillationBoundary = 2 * Math.sqrt(1 - delta * delta);
    const pairingDecay = 0.5 * Math.log((1 + delta) / (1 - delta));
    const normalGrowth = Math.abs(mu) <= oscillationBoundary ? 0 : Math.acosh(Math.abs(mu) / oscillationBoundary);
    const mode = lowestMode(sites, delta, mu);
    const sign = mode.v[0] < 0 ? -1 : 1;
    const leftMode = Array.from(mode.v, value => sign * value);
    const rightMode = leftMode.slice().reverse();
    return {
      energy: mode.E0, leftMode, rightMode, converged: mode.converged, iterations: mode.steps,
      sites, delta, mu, profile, next, residual: (1 + delta) * next,
      crossings, nearest, atCrossing, parity: atCrossing ? null : (crossed % 2 ? -1 : 1),
      oscillationBoundary, rho: Math.sqrt((1 - delta) / (1 + delta)),
      topological: Math.abs(mu) < 2,
      oscillatory: Math.abs(mu) < oscillationBoundary,
      pairingDecay, normalGrowth, decayRate: pairingDecay - normalGrowth
    };
  }

  const fixed = (value, digits = 3) => (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits);
  const scientific = value => Math.abs(value) < 1e-300 ? '0' : value.toExponential(3).replace('e-', ' × 10^−').replace('e+', ' × 10^');
  const scientificHTML = value => scientific(value).replace(/\^([−\d]+)$/, '<sup>$1</sup>');

  let curveCache = null;
  function splittingCurve(sites, delta) {
    parameters({sites, delta});
    if (curveCache && curveCache.sites === sites && curveCache.delta === delta) return curveCache;
    const grid = Array.from({length: 181}, (_, j) => -2.4 + 4.8 * j / 180);
    const crossings = zeroCrossings(sites, delta);
    for (const [j, mu] of crossings.entries()) {
      for (const offset of [-0.001, 0, 0.001]) grid.push(mu + offset);
      if (j) grid.push((mu + crossings[j - 1]) / 2);
    }
    grid.sort((a, b) => a - b);
    const W = workspace(sites), points = [];
    for (const mu of grid) {
      if (points.length && Math.abs(mu - points.at(-1).mu) < 1e-13) continue;
      const mode = lowestMode(sites, delta, mu, W);
      points.push({mu, energy: mode.E0, converged: mode.converged});
    }
    curveCache = {sites, delta, points, failures: points.filter(point => !point.converged).length};
    return curveCache;
  }

  function energySVG(s, width = 680, curve = splittingCurve(s.sites, s.delta)) {
    const left = 48, right = width - 24, top = 32, bottom = 206, floor = 1e-14;
    const x = mu => left + (right - left) * (mu + 2.4) / 4.8;
    const y = energy => top + (bottom - top) * (1 - Math.log10(Math.max(floor, energy))) / 15;
    let path = '', continuing = false;
    const points = curve.points.concat({mu: s.mu, energy: s.energy, converged: s.converged}).sort((a, b) => a.mu - b.mu);
    for (const point of points) {
      if (!point.converged || !Number.isFinite(point.energy)) { continuing = false; continue; }
      path += `${continuing ? 'L' : 'M'}${x(point.mu).toFixed(3)} ${y(point.energy).toFixed(3)}`;
      continuing = true;
    }
    const boundaries = [-2.4, ...s.crossings, 2.4];
    const parityBands = boundaries.slice(0, -1).map((a, j) => j % 2 ? `<rect x="${x(a)}" y="214" width="${x(boundaries[j + 1]) - x(a)}" height="8" fill="#aaa"/>` : '').join('');
    const id = `wires-energy-${width}`;
    return `<svg viewBox="0 0 ${width} 271" role="img" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="${id}-title">Finite-wire energy splitting</title>
      <desc id="${id}-desc">The magnitude of the energy difference between the lowest even and odd states is the smallest singular value of the finite Majorana matrix. The logarithmic plot has a display floor of ten to the minus fourteen. Black ticks mark analytic zeros and gray strips mark odd ground-state parity. The selected energy is ${scientific(s.energy)} in hopping units.</desc>
      <g font-family="Georgia,serif" font-size="14" fill="#333">
      <text x="${(left + right) / 2}" y="18" text-anchor="middle">Finite-chain splitting E₀/w</text>
      <rect x="${x(-2)}" y="${top}" width="${x(2) - x(-2)}" height="${bottom - top}" fill="#f1f5f7"/>
      ${[-14, -8, -2, 1].map(power => `<path d="M${left} ${y(10 ** power)}H${right}" stroke="#ddd"/><text x="${left - 7}" y="${y(10 ** power) + 5}" text-anchor="end">10<tspan dy="-5" font-size="10">${power < 0 ? '−' + -power : power}</tspan></text>`).join('')}
      <path d="M${left} ${top}V${bottom}H${right}" stroke="#888" fill="none"/>
      <path d="M${x(-2)} ${top}V222M${x(2)} ${top}V222" stroke="#777"/>
      <path d="M${x(-s.oscillationBoundary)} ${top}V${bottom}M${x(s.oscillationBoundary)} ${top}V${bottom}" stroke="#a26a35" stroke-dasharray="5 4"/>
      <path d="${path}" fill="none" stroke="#145b91" stroke-width="1.8" stroke-linejoin="round"/>
      ${parityBands}
      ${s.crossings.map(mu => `<path d="M${x(mu)} 211V226" stroke="#444"/>`).join('')}
      ${s.converged ? `<circle cx="${x(s.mu)}" cy="${y(s.energy)}" r="4" fill="#145b91" stroke="white"/>` : ''}
      ${[-2, 0, 2].map(mu => `<text x="${x(mu)}" y="243" text-anchor="middle">${mu < 0 ? '−2' : mu}</text>`).join('')}
      <text x="${(left + right) / 2}" y="265" text-anchor="middle">Chemical potential μ/w</text>
      </g></svg>`;
  }

  function profileSVG(s, width = 680, view = {}) {
    if (!s.converged) return `<svg viewBox="0 0 ${width} 80" role="img" aria-label="Finite profiles unavailable"><text x="${width / 2}" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="14">The finite-mode iteration did not converge.</text></svg>`;
    const left = 48, right = width - 24, top = 32, bottom = 210;
    const stagger = !!view.stagger && s.mu > 0, compare = !!view.compare;
    const transform = (profile, rightEnd = false) => profile.map((value, j) => value * (stagger && ((rightEnd ? s.sites - 1 - j : j) % 2) ? -1 : 1));
    const a = transform(s.leftMode), b = transform(s.rightMode, true), reference = transform(s.profile);
    const all = a.concat(b, compare ? reference.concat(s.next) : []);
    const limit = Math.max(0.2, Math.ceil(10 * Math.max(...all.map(Math.abs))) / 10);
    const x = site => left + (right - left) * (site - 1) / (compare ? s.sites : s.sites - 1);
    const y = value => (top + bottom) / 2 - (bottom - top) * value / (2 * limit);
    const line = values => values.map((value, j) => `${x(j + 1)},${y(value)}`).join(' ');
    const id = `wires-profile-${width}`;
    return `<svg viewBox="0 0 ${width} 278" role="img" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="${id}-title">Two normalized finite-wire singular profiles</title>
      <desc id="${id}-desc">Blue is the left a-type profile and dashed red the right b-type profile for the lowest finite-chain singular value. Each has sum of squared coefficients equal to one and is positive at its own end. ${stagger ? 'At positive chemical potential, the alternating site sign is removed separately from each end.' : 'All relative site signs are retained.'} ${compare ? 'Dotted brown shows the normalized zero-energy left recurrence, and its continuation to site N plus one.' : ''}</desc>
      <g font-family="Georgia,serif" font-size="14" fill="#333">
      <text x="${(left + right) / 2}" y="18" text-anchor="middle">${stagger ? 'Profiles with alternating sign removed' : 'Signed finite-chain profiles'}</text>
      <path d="M${left} ${top}V${bottom}H${right}M${left} ${y(0)}H${right}" stroke="#aaa" fill="none"/>
      ${[-limit, 0, limit].map(value => `<text x="${left - 8}" y="${y(value) + 5}" text-anchor="end">${fixed(value, 1)}</text>`).join('')}
      <polyline points="${line(b)}" fill="none" stroke="#9d493e" stroke-width="2" stroke-dasharray="6 4"/>
      <polyline points="${line(a)}" fill="none" stroke="#145b91" stroke-width="2"/>
      ${a.map((value, j) => `<circle cx="${x(j + 1)}" cy="${y(value)}" r="${width < 400 ? 1.8 : 2.4}" fill="#145b91"/>`).join('')}
      ${compare ? `<polyline points="${line(reference)}" fill="none" stroke="#a26a35" stroke-width="1.6" stroke-dasharray="2 3"/><path d="M${x(s.sites)} ${y(reference.at(-1))}L${x(s.sites + 1)} ${y(s.next * (stagger && s.sites % 2 ? -1 : 1))}" stroke="#a26a35" stroke-dasharray="2 3"/><circle cx="${x(s.sites + 1)}" cy="${y(s.next * (stagger && s.sites % 2 ? -1 : 1))}" r="4" fill="white" stroke="#a26a35"/>` : ''}
      <text x="${left}" y="239" text-anchor="middle">1</text><text x="${right}" y="239" text-anchor="end">${compare ? 'N+1' : s.sites}</text>
      <text x="${(left + right) / 2}" y="268" text-anchor="middle">Site j · μ/w = ${fixed(s.mu)}</text>
      </g></svg>`;
  }

  function plots(s, view = {}) {
    const curve = splittingCurve(s.sites, s.delta);
    return `<div class="wires-wide">${energySVG(s, 680, curve)}${profileSVG(s, 680, view)}</div><div class="wires-narrow">${energySVG(s, 360, curve)}${profileSVG(s, 360, view)}</div>`;
  }

  function summary(s, view = {}) {
    const parity = s.atCrossing ? 'At this analytic zero, the even and odd ground states are degenerate.' : `The lowest-energy state has <strong>${s.parity > 0 ? 'even' : 'odd'} fermion parity</strong>.`;
    const energy = !s.converged ? 'The lowest-mode iteration did not converge at this setting.' : s.atCrossing ? 'The exact splitting is zero; floating-point input rounding and the solver can leave a small computed remainder.' : `The computed splitting is E₀/w = ${scientificHTML(s.energy)}${s.energy < 1e-14 ? ', below the plotted display floor' : ''}.`;
    const mode = s.topological ? 'The semi-infinite problem supports decaying end modes here.' : 'Here the plotted finite profiles belong to the lowest bulk level, not a localized end mode.';
    const residual = view.compare ? `<p><strong>Zero-energy recurrence comparison:</strong> r/w = ${scientificHTML(s.residual)} at the far boundary. This is a boundary-condition residual, not an excitation energy; the dotted profile need not equal the finite singular mode.</p>` : '';
    const failures = curveCache && curveCache.sites === s.sites && curveCache.delta === s.delta ? curveCache.failures : 0;
    return `<p>${energy} ${parity}</p><p>${mode} Oscillation boundary: |μ|/w = ${fixed(s.oscillationBoundary)}; bulk transition: |μ|/w = 2.</p>${residual}${failures ? `<p>${failures} unconverged curve points have been omitted.</p>` : ''}`;
  }

  function initialMarkup() {
    const s = state(defaults), view = {stagger: false, compare: false};
    return `<figure class="inline-figure directions-wires" data-directions-wires>
      <style>
      .directions-wires .wires-narrow{display:none}
      .directions-wires svg{display:block;width:100%;height:auto}
      .directions-wires .wires-legend{font:14px/1.5 system-ui,sans-serif;color:#555;margin:8px 0 18px}
      .directions-wires .wires-summary{font-size:16px;line-height:1.5}
      .directions-wires .wires-summary p{margin:12px 0}
      .directions-wires .figure-controls{border-top:1px solid #ddd;padding-top:16px}
      .directions-wires .figure-controls output{min-width:60px}
      .directions-wires .figure-controls input[type=checkbox]{width:auto;flex:none}
      @media(max-width:520px){.directions-wires .wires-wide{display:none}.directions-wires .wires-narrow{display:block}}
      @media print{.directions-wires .wires-wide{display:block}.directions-wires .wires-narrow{display:none}.directions-wires .wires-summary{font-size:9pt}.directions-wires .wires-legend{font-size:8pt}}
      </style>
      <div data-wires-plots>${plots(s, view)}</div>
      <p class="wires-legend">Top: finite-chain splitting on a logarithmic scale. Black ticks are exact zeros; gray bars indicate odd ground parity. Brown dashed lines mark the oscillation boundaries; solid gray lines mark the bulk transitions. Bottom: blue left profile and dashed red right profile, each normalized by its sum of squares.</p>
      <div class="figure-controls">
        <label for="wires-sites">Sites N <input id="wires-sites" data-wires-input="sites" type="range" min="6" max="60" step="1" value="${s.sites}"><output for="wires-sites">${s.sites}</output></label>
        <label for="wires-delta">Pairing Δ/w <input id="wires-delta" data-wires-input="delta" type="range" min="0.05" max="0.95" step="0.01" value="${s.delta}"><output for="wires-delta">${fixed(s.delta)}</output></label>
        <label for="wires-mu">Potential μ/w <input id="wires-mu" data-wires-input="mu" type="range" min="-2.4" max="2.4" step="any" value="${s.mu}"><output for="wires-mu">${fixed(s.mu)}</output></label>
        <label><input type="checkbox" data-wires-display="stagger">Remove alternating site sign (μ &gt; 0)</label>
        <label><input type="checkbox" data-wires-display="compare">Compare zero-energy recurrence</label>
        <button type="button" data-wires-crossing>Nearest exact crossing</button><button type="button" data-wires-reset>Reset</button>
      </div>
      <div class="wires-summary" data-wires-summary aria-live="polite">${summary(s, view)}</div>
      <figcaption>The uniform, open Kitaev chain with real 0 &lt; Δ &lt; w. E₀ is the smallest singular value of its finite Majorana matrix. The two profiles are singular vectors, not two independent excitations. Their signs are independently positive at their own ends. Values below 10⁻¹⁴w are clipped only in the plot; analytic zeros are identified separately from tiny numerical estimates.</figcaption>
      <noscript><p>The default has N = 20, Δ/w = 0.2, and μ/w = 0.6. The static figure remains readable; controls require JavaScript.</p></noscript>
    </figure>`;
  }

  function attach(element) {
    if (element.dataset.wiresAttached) return;
    element.dataset.wiresAttached = 'true';
    const inputs = [...element.querySelectorAll('[data-wires-input]')];
    const displays = [...element.querySelectorAll('[data-wires-display]')];
    function update() {
      const values = Object.fromEntries(inputs.map(input => [input.dataset.wiresInput, Number(input.value)]));
      const view = Object.fromEntries(displays.map(input => [input.dataset.wiresDisplay, input.checked]));
      const s = state(values);
      for (const input of inputs) input.nextElementSibling.textContent = input.dataset.wiresInput === 'sites' ? s.sites : fixed(values[input.dataset.wiresInput], 4);
      element.querySelector('[data-wires-plots]').innerHTML = plots(s, view);
      element.querySelector('[data-wires-summary]').innerHTML = summary(s, view);
      return s;
    }
    inputs.concat(displays).forEach(input => input.addEventListener('input', update));
    element.querySelector('[data-wires-crossing]').addEventListener('click', () => {
      const s = update();
      inputs.find(input => input.dataset.wiresInput === 'mu').value = s.nearest;
      update();
    });
    element.querySelector('[data-wires-reset]').addEventListener('click', () => {
      inputs.forEach(input => { input.value = defaults[input.dataset.wiresInput]; });
      displays.forEach(input => { input.checked = false; });
      update();
    });
    update();
  }

  return Object.freeze({defaults, parameters, zeroCrossings, state, splittingCurve, profileSVG, energySVG, initialMarkup, attach});
});
