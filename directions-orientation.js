/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DirectionsOrientation = api;
  if (typeof document !== 'undefined') {
    const start = () => document.querySelectorAll('[data-directions-orientation]').forEach(api.attach);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const PI = Math.PI, WIDTH = 0.38;
  const defaults = Object.freeze({ sPi: 0.4, betaDeg: 25, view: 'oblique', azimuthDeg: -60 });
  const views = Object.freeze({ oblique: 25, top: 90, low: 10 });
  const fixed = (n, places = 2) => (Math.abs(n) < 0.5 * 10 ** -places ? 0 : n).toFixed(places);
  const dot = (a, b) => a.reduce((sum, v, j) => sum + v * b[j], 0);
  const add = (a, b, scale = 1) => a.map((v, j) => v + scale * b[j]);

  function finite(value, name) {
    if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
    return value;
  }

  // The coordinates are in units of the centre-circle radius.
  function ribbonPoint(s, u = 0) {
    finite(s, 's'); finite(u, 'u');
    return [(1 + u * Math.cos(s / 2)) * Math.cos(s),
      (1 + u * Math.cos(s / 2)) * Math.sin(s), u * Math.sin(s / 2)];
  }

  // Cross product of r_s and r_u at u=0; it has unit norm there.
  function coreNormal(s) {
    finite(s, 's');
    return [Math.cos(s) * Math.sin(s / 2), Math.sin(s) * Math.sin(s / 2), -Math.cos(s / 2)];
  }

  // r_s × r_u across the full width. Its norm is sqrt(rho² + u²/4).
  function ribbonNormalVector(s, u) {
    finite(s, 's'); finite(u, 'u');
    const c = Math.cos(s / 2), g = Math.sin(s / 2), rho = 1 + u * c;
    return [rho * g * Math.cos(s) - u / 2 * Math.sin(s),
      rho * g * Math.sin(s) + u / 2 * Math.cos(s), -rho * c];
  }

  function ribbonNormal(s, u) {
    const normal = ribbonNormalVector(s, u), length = Math.hypot(...normal);
    return normal.map(value => value / length);
  }

  function fieldVector(beta) {
    finite(beta, 'beta');
    const snap = value => Math.abs(value) < 1e-15 ? 0 : value;
    return [snap(Math.sin(beta)), 0, snap(Math.cos(beta))];
  }

  function normalField(s, beta) { return dot(coreNormal(s), fieldVector(beta)); }
  function surfaceNormalField(s, u, beta) { return dot(ribbonNormal(s, u), fieldVector(beta)); }
  function surfaceFieldNumerator(s, u, beta) { return dot(ribbonNormalVector(s, u), fieldVector(beta)); }

  function bisect(f, left, right) {
    let atLeft = f(left);
    for (let j = 0; j < 55; j++) {
      const middle = (left + right) / 2, value = f(middle);
      if (value === 0) return middle;
      if (Math.sign(value) === Math.sign(atLeft)) { left = middle; atLeft = value; }
      else right = middle;
    }
    return (left + right) / 2;
  }

  function cubicRoots(a, b, c, d) {
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    const discriminant = q * q / 4 + p * p * p / 27, shift = -b / (3 * a);
    // At a repeated root, return the two distinct values, including the tangency.
    if (Math.abs(discriminant) < 2e-15) {
      const root = Math.cbrt(-q / 2);
      return [2 * root + shift, -root + shift];
    }
    if (discriminant > 0) {
      const r = Math.sqrt(discriminant);
      return [Math.cbrt(-q / 2 + r) + Math.cbrt(-q / 2 - r) + shift];
    }
    const radius = 2 * Math.sqrt(-p / 3);
    const angle = Math.acos(Math.max(-1, Math.min(1, 3 * q / (p * radius)))) / 3;
    return [0, 1, 2].map(j => radius * Math.cos(angle - 2 * PI * j / 3) + shift);
  }

  // All distinct zeros on [0, 2 pi), including a zero which only touches the axis.
  // x=tan(s/2) gives S*x³+C*x²-S*x+C=0. Use its reciprocal at small tilt.
  function coreZeros(beta) {
    finite(beta, 'beta');
    if (beta < 0 || beta > PI / 2) throw new RangeError('Zero search uses tilt 0–pi/2');
    const [S, , C] = fieldVector(beta);
    if (S === 0) return [PI];
    if (C === 0) return [0, PI / 2, 3 * PI / 2];
    const roots = beta <= PI / 4
      ? cubicRoots(C, -S, C, S).map(y => 2 * Math.atan2(1, y))
      : cubicRoots(S, C, -S, C).map(x => 2 * Math.atan(x) + (x < 0 ? 2 * PI : 0));
    return roots.sort((a, b) => a - b).filter((s, j, all) => j === 0 || s - all[j - 1] > 1e-8);
  }

  function coreZeroDetails(beta) {
    const [S, , C] = fieldVector(beta);
    return coreZeros(beta).map(s => {
      const slope = S * (0.5 * Math.cos(s / 2) * Math.cos(s) - Math.sin(s / 2) * Math.sin(s)) + 0.5 * C * Math.sin(s / 2);
      return { s, tangent: Math.abs(slope) < 1e-8 };
    });
  }

  // Trace the zero set on a triangular parameter mesh. Roots on edges are bisected
  // using the actual field, including whole zero edges at axial or in-plane tilt.
  // Line segments approximate the contour between these roots; they are not channels.
  function zeroContour(beta, along = 96, across = 8) {
    finite(beta, 'beta');
    if (!Number.isInteger(along) || along < 4 || !Number.isInteger(across) || across < 2) {
      throw new RangeError('Contour mesh must have at least four by two cells');
    }
    const segments = [], seen = new Set();
    const key = p => {
      const atJoin = Math.abs(p[0] - 2 * PI) < 1e-10;
      return `${(atJoin ? 0 : p[0]).toFixed(9)},${(atJoin ? -p[1] : p[1]).toFixed(9)}`;
    };
    const addSegment = (a, b, cell) => {
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-10) return;
      const id = [key(a), key(b)].sort().join('|');
      if (!seen.has(id)) { seen.add(id); segments.push({ points: [a, b], cell }); }
    };
    const value = p => {
      const v = surfaceFieldNumerator(p[0], p[1], beta);
      return Math.abs(v) < 1e-13 ? 0 : v;
    };
    for (let j = 0; j < along; j++) for (let v = 0; v < across; v++) {
      const a = 2 * PI * j / along, b = 2 * PI * (j + 1) / along;
      const u = -WIDTH + 2 * WIDTH * v / across, next = -WIDTH + 2 * WIDTH * (v + 1) / across;
      const corners = [[a, u], [b, u], [b, next], [a, next]], cell = j * across + v;
      for (const triangle of [[corners[0], corners[1], corners[2]], [corners[0], corners[2], corners[3]]]) {
        const hits = [];
        for (let k = 0; k < 3; k++) {
          const p = triangle[k], q = triangle[(k + 1) % 3], fp = value(p), fq = value(q);
          if (fp === 0 && fq === 0) { addSegment(p, q, cell); continue; }
          let hit;
          if (fp === 0) hit = p;
          else if (fq === 0) hit = q;
          else if (fp * fq < 0) {
            const at = t => [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
            hit = at(bisect(t => surfaceFieldNumerator(...at(t), beta), 0, 1));
          }
          if (hit && !hits.some(h => Math.hypot(h[0] - hit[0], h[1] - hit[1]) < 1e-10)) hits.push(hit);
        }
        if (hits.length === 2) addSegment(hits[0], hits[1], cell);
      }
    }
    return segments;
  }

  // Antiperiodicity brackets at least one zero. This finds one, not all zeros.
  function oneZero(beta) {
    finite(beta, 'beta');
    let left = 0, right = 2 * PI, atLeft = normalField(left, beta);
    if (Math.abs(atLeft) < 1e-14) return left;
    for (let j = 0; j < 60; j++) {
      const middle = (left + right) / 2, value = normalField(middle, beta);
      if (Math.abs(value) < 1e-14) return middle;
      if (Math.sign(value) === Math.sign(atLeft)) { left = middle; atLeft = value; }
      else right = middle;
    }
    return (left + right) / 2;
  }

  function state({ sPi = defaults.sPi, betaDeg = defaults.betaDeg, view = defaults.view, azimuthDeg = defaults.azimuthDeg } = {}) {
    finite(sPi, 's/pi'); finite(betaDeg, 'field tilt'); finite(azimuthDeg, 'view azimuth');
    if (sPi < 0 || sPi > 4 || betaDeg < 0 || betaDeg > 90 || azimuthDeg < -180 || azimuthDeg > 180 || !Object.hasOwn(views, view)) {
      throw new RangeError('Travel must be 0–4 pi, tilt 0–90 degrees, azimuth −180–180 degrees, and view a listed option');
    }
    const s = sPi * PI, beta = betaDeg * PI / 180;
    return { sPi, betaDeg, view, azimuthDeg, s, beta, point: ribbonPoint(s), normal: coreNormal(s),
      field: fieldVector(beta), component: normalField(s, beta), zero: oneZero(beta), zeros: coreZeroDetails(beta) };
  }

  function project(point, view, azimuthDeg) {
    const azimuth = azimuthDeg * PI / 180, elevation = views[view] * PI / 180;
    // Right, up, toward-viewer form a right-handed camera basis: no reflected band.
    const x = -Math.sin(azimuth) * point[0] + Math.cos(azimuth) * point[1];
    const across = Math.cos(azimuth) * point[0] + Math.sin(azimuth) * point[1];
    const vertical = -Math.sin(elevation) * across + Math.cos(elevation) * point[2];
    const depth = Math.cos(elevation) * across + Math.sin(elevation) * point[2];
    return [220 + 106 * x, 192 - 106 * vertical, depth];
  }

  const points = array => array.map(p => `${fixed(p[0], 3)},${fixed(p[1], 3)}`).join(' ');
  function arrow(from, to, color, dashed = false) {
    const dx = to[0] - from[0], dy = to[1] - from[1], length = Math.hypot(dx, dy);
    if (length < 6) {
      const toward = (to[2] || 0) >= (from[2] || 0);
      const mark = toward ? `<circle cx="${from[0]}" cy="${from[1]}" r="2" fill="${color}"/>`
        : `<path d="M${from[0] - 3},${from[1] - 3}l6,6M${from[0] - 3},${from[1] + 3}l6,-6" stroke="${color}" stroke-width="1.6"/>`;
      return `<circle cx="${from[0]}" cy="${from[1]}" r="6" fill="white" stroke="${color}" stroke-width="1.8"/>${mark}`;
    }
    const ux = dx / length, uy = dy / length, base = [to[0] - 10 * ux, to[1] - 10 * uy];
    return `<path d="M${points([from])}L${points([to])}" stroke="${color}" stroke-width="2.8" ${dashed ? 'stroke-dasharray="4 3"' : ''}/>
      <polygon points="${points([to, [base[0] - 4 * uy, base[1] + 4 * ux], [base[0] + 4 * uy, base[1] - 4 * ux]])}" fill="${color}"/>`;
  }

  function ribbonSVG(s) {
    // Paint small surface facets from back to front. No raster canvas is used.
    const facets = [], count = 96, across = 8;
    const projected = point => project(point, s.view, s.azimuthDeg);
    const contour = Array.from({ length: count * across }, () => []);
    for (const segment of zeroContour(s.beta, count, across)) contour[segment.cell].push(segment.points);
    for (let j = 0; j < count; j++) {
      const a = 2 * PI * j / count, b = 2 * PI * (j + 1) / count;
      for (let v = 0; v < across; v++) {
        const u = -WIDTH + 2 * WIDTH * v / across, next = -WIDTH + 2 * WIDTH * (v + 1) / across;
        const vertices = [ribbonPoint(a, u), ribbonPoint(b, u), ribbonPoint(b, next), ribbonPoint(a, next)].map(projected);
        const component = surfaceNormalField((a + b) / 2, (u + next) / 2, s.beta);
        const hue = component >= 0 ? [31, 113, 162] : [179, 72, 55];
        const color = `rgb(${hue.map(channel => Math.round(250 - 0.83 * Math.abs(component) * (250 - channel))).join(',')})`;
        const lines = contour[j * across + v].map(segment => {
          const pair = segment.map(p => projected(ribbonPoint(...p)));
          return `<polyline class="orientation-zero-contour" points="${points(pair)}" fill="none" stroke="#30383b" stroke-width="2.7" stroke-linecap="round"/>`;
        }).join('');
        facets.push({ depth: vertices.reduce((sum, p) => sum + p[2], 0) / 4,
          markup: `<polygon points="${points(vertices)}" fill="${color}" stroke="${color}" stroke-width=".45"/>${lines}` });
      }
    }
    facets.sort((a, b) => a.depth - b.depth);
    const edge = [], core = [], cut = [];
    // Both coordinate edges are a single physical boundary traced over 4 pi.
    for (let j = 0; j <= 240; j++) edge.push(projected(ribbonPoint(4 * PI * j / 240, WIDTH)));
    for (let j = 0; j <= 120; j++) core.push(projected(ribbonPoint(2 * PI * j / 120)));
    for (let j = 0; j <= 8; j++) cut.push(projected(ribbonPoint(0, -WIDTH + 2 * WIDTH * j / 8)));
    const origin = ribbonPoint(0), base = projected(s.point), tip = projected(add(s.point, s.normal, 0.65));
    const reference = arrow(projected(origin), projected(add(origin, coreNormal(0), 0.65)), '#7d8387', true);
    const f = projected(s.field), zero = projected([0, 0, 0]), fieldEnd = [55 + (f[0] - zero[0]) * 0.50, 69 + (f[1] - zero[1]) * 0.50, f[2] - zero[2]];
    return `<svg viewBox="0 0 440 350" role="img" aria-labelledby="orientation-ribbon-title orientation-ribbon-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="orientation-ribbon-title">The local normal field across a Möbius band</title>
      <desc id="orientation-ribbon-desc">Blue and red show positive and negative B dot n for a local normal continuous on the rectangle cut at s=0; white is zero. The solid dark curve is the sampled zero contour. The dashed dark line marks the coordinate cut, where the color convention reverses. After ${fixed(s.sPi / 2)} circuits, the dark normal arrow is (${s.normal.map(n => fixed(n, 3)).join(', ')}). Gray marks the initial normal. Brown is the uniform laboratory field, tilted ${fixed(s.betaDeg, 0)} degrees from z. Arrows and guide lines are overlaid for clarity.</desc>
      ${facets.map(facet => facet.markup).join('')}
      <polyline points="${points(edge)}" fill="none" stroke="#748187" stroke-width="1.05"/>
      <polyline points="${points(core)}" fill="none" stroke="#758086" stroke-width="1" stroke-dasharray="2 4"/>
      <polyline points="${points(cut)}" fill="none" stroke="white" stroke-width="3.8"/>
      <polyline points="${points(cut)}" fill="none" stroke="#30383b" stroke-width="1.9" stroke-dasharray="5 3"/>
      ${reference}${arrow(base, tip, '#17292f')}
      <circle cx="${base[0]}" cy="${base[1]}" r="4" fill="#17292f" stroke="white" stroke-width="1.5"/>
      <g font-family="system-ui,sans-serif" font-size="13" fill="#4b5558">
      ${arrow([55, 69], fieldEnd, '#995334')}
      <text x="18" y="20">Uniform field B</text><text x="18" y="38">Laboratory direction</text>
      <text x="220" y="340" text-anchor="middle">${fixed(s.sPi / 2)} circuit${s.sPi === 2 ? '' : 's'} around the centre circle</text>
      </g></svg>`;
  }

  function fieldSVG(s) {
    const left = 48, top = 38, width = 354, height = 228;
    const x = angle => left + width * angle / (4 * PI), y = value => top + height * (1 - value) / 2;
    function curve(from, to) {
      return Array.from({ length: 161 }, (_, j) => {
        const angle = from + (to - from) * j / 160;
        return `${j ? 'L' : 'M'}${fixed(x(angle), 3)} ${fixed(y(normalField(angle, s.beta)), 3)}`;
      }).join('');
    }
    const zeroes = s.zeros.flatMap(z => [z.s, z.s + 2 * PI, z.s + 4 * PI]).filter(z => z <= 4 * PI);
    return `<svg viewBox="0 0 440 350" role="img" aria-labelledby="orientation-field-title orientation-field-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="orientation-field-title">Signed normal field over two circuits</title>
      <desc id="orientation-field-desc">The normal component divided by field magnitude is ${fixed(s.component, 3)} at s divided by pi equal to ${fixed(s.sPi)}. It changes sign after one circuit. All ${s.zeros.length} distinct core zeros per circuit are highlighted, including any tangency: s divided by pi equals ${s.zeros.map(z => fixed(z.s / PI, 3)).join(', ')} on the first circuit.</desc>
      <g font-family="system-ui,sans-serif" font-size="13" fill="#3d484b">
      <path d="M48 38V266H402" fill="none" stroke="#a7afb1"/>
      <path d="M48 ${y(0)}H402" stroke="#a7afb1"/>
      <path d="M${x(2 * PI)} 38V266" stroke="#c5cdcf" stroke-dasharray="3 4"/>
      ${[-1, 0, 1].map(v => `<text x="37" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('')}
      ${['0', 'π', '2π', '3π', '4π'].map((label, j) => `<text x="${x(j * PI)}" y="287" text-anchor="middle">${label}</text>`).join('')}
      <text x="49" y="19">B · n / B₀</text><text x="225" y="314" text-anchor="middle">Travel s</text>
      <path d="${curve(0, 2 * PI)}" fill="none" stroke="#17657c" stroke-width="2.4"/>
      <path d="${curve(2 * PI, 4 * PI)}" fill="none" stroke="#17657c" stroke-width="2.4" stroke-dasharray="6 4"/>
      ${zeroes.map(z => `<circle cx="${x(z)}" cy="${y(0)}" r="5.5" fill="white" stroke="#a56821" stroke-width="2"/>`).join('')}
      <path d="M${x(s.s)} ${y(0)}V${y(s.component)}" stroke="#17657c" stroke-dasharray="2 3"/>
      <circle cx="${x(s.s)}" cy="${y(s.component)}" r="4.5" fill="#17657c" stroke="white" stroke-width="1.5"/>
      <text x="225" y="341" text-anchor="middle">One circuit: same point, opposite normal</text>
      </g></svg>`;
  }

  function summary(s) {
    let returnText = 'Follow the normal continuously; its length stays one.';
    if (Math.abs(s.sPi - 2) < 1e-8) returnText = 'One circuit: back at the starting point, with the opposite normal.';
    if (Math.abs(s.sPi - 4) < 1e-8) returnText = 'Two circuits: both the point and the normal are back at their starting values.';
    if (s.sPi === 0) returnText = 'At the start, the dark normal coincides with the gray reference.';
    const zeros = s.zeros.map(z => `${fixed(z.s / PI, 3)}${z.tangent ? ' (touches zero)' : ''}`).join(', ');
    return `<p><strong>${returnText}</strong></p><p>The selected signed component is B · n / B₀ = <strong>${fixed(s.component, 3)}</strong>. The ${s.zeros.length} distinct core zero${s.zeros.length === 1 ? '' : 's'} on 0 ≤ s/π &lt; 2 ${s.zeros.length === 1 ? 'is' : 'are'} at <strong>${zeros}</strong>. At a zero, this nonzero field is tangent to the surface.${s.betaDeg === 90 ? ' At this tilt the coordinate cut is also a physical zero line; a cut and a zero need not be separate.' : ''}</p>`;
  }

  function initialMarkup() {
    const s = state();
    return `<figure class="inline-figure directions-orientation" data-directions-orientation>
      <style>
      .directions-orientation .orientation-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .directions-orientation .orientation-panel h3{font:normal 18px/1.4 Georgia,serif;margin:0 0 6px}
      .directions-orientation .orientation-panel svg{display:block;width:100%;height:auto}
      .directions-orientation .orientation-legend{font:12px/1.6 system-ui,sans-serif;color:#566166;margin:0 0 12px}
      .directions-orientation .orientation-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 24px;border-top:1px solid #d4dcdf;padding-top:17px;margin-top:10px}
      .directions-orientation .orientation-controls label{display:grid;grid-template-columns:1fr auto;gap:6px 12px;font:14px/1.5 system-ui,sans-serif;color:#34474d}
      .directions-orientation .orientation-controls input{grid-column:1/-1;width:100%;margin:0;accent-color:#17657c;min-height:24px}
      .directions-orientation .orientation-controls output{font-variant-numeric:tabular-nums}
      .directions-orientation .orientation-controls select{grid-column:1/-1;background:#fff;border:1px solid #a6b6bc;border-radius:4px;color:#34474d;padding:7px;font:14px system-ui,sans-serif;max-width:100%}
      .directions-orientation .orientation-presets{display:flex;flex-wrap:wrap;gap:7px;align-items:center;grid-column:1/-1}
      .directions-orientation .orientation-presets button{border:1px solid #a6b6bc;border-radius:4px;background:#f6fafb;color:#244f5b;padding:7px 10px;cursor:pointer;font:13px/1.3 system-ui,sans-serif;min-height:34px}
      .directions-orientation .orientation-presets button:hover{background:#e9f3f6}
      .directions-orientation :is(button,input,select):focus-visible{outline:2px solid #17657c;outline-offset:3px}
      .directions-orientation .orientation-summary{font-size:16px;line-height:1.55;margin-top:18px}
      .directions-orientation .orientation-summary p{margin:8px 0}
      @media(max-width:660px){.directions-orientation .orientation-panels{grid-template-columns:1fr;gap:22px}.directions-orientation .orientation-panel{max-width:470px;width:100%;margin:auto}.directions-orientation .orientation-controls{grid-template-columns:1fr}}
      @media print{.directions-orientation .orientation-controls{display:none}.directions-orientation .orientation-panels{grid-template-columns:1fr 1fr}.directions-orientation .orientation-summary{font-size:9pt}}
      </style>
      <div class="orientation-panels">
        <div class="orientation-panel"><h3>Follow a local normal</h3><div data-orientation-ribbon>${ribbonSVG(s)}</div><p class="orientation-legend">Surface blue/red: positive/negative B · n using the chosen local normal. Solid dark curve: zero contour. Dashed dark line: coordinate cut. Dark arrow: followed normal · gray dashed arrow: starting normal · brown arrow: fixed field. End-on dot/cross: toward/away. Arrows and guide lines are overlaid.</p></div>
        <div class="orientation-panel"><h3>Find where the field is tangent</h3><div data-orientation-field>${fieldSVG(s)}</div><p class="orientation-legend">Solid: first circuit · dashed: second circuit · blue dot: selected point · amber rings: all distinct core zeros and their repeats. The graph follows the normal continuously across the coordinate cut.</p></div>
      </div>
      <div class="orientation-controls">
        <label for="orientation-travel">Travel s/π <output data-orientation-value="sPi" for="orientation-travel">${fixed(s.sPi)}</output><input id="orientation-travel" data-orientation-input="sPi" type="range" min="0" max="4" step="0.01" value="${s.sPi}"></label>
        <label for="orientation-tilt">Field tilt from z <output data-orientation-value="betaDeg" for="orientation-tilt">${s.betaDeg}°</output><input id="orientation-tilt" data-orientation-input="betaDeg" type="range" min="0" max="90" step="1" value="${s.betaDeg}"></label>
        <label for="orientation-view">View <select id="orientation-view" data-orientation-view><option value="oblique">Oblique</option><option value="top">From above</option><option value="low">Low angle</option></select></label>
        <label for="orientation-azimuth">View azimuth <output data-orientation-value="azimuthDeg" for="orientation-azimuth">${s.azimuthDeg}°</output><input id="orientation-azimuth" data-orientation-input="azimuthDeg" type="range" min="-180" max="180" step="2" value="${s.azimuthDeg}"></label>
        <div class="orientation-presets"><button type="button" data-orientation-travel="0">Start</button><button type="button" data-orientation-travel="2">One circuit</button><button type="button" data-orientation-travel="4">Two circuits</button><button type="button" data-orientation-reset>Reset</button></div>
      </div>
      <div class="orientation-summary" data-orientation-summary aria-live="polite">${summary(s)}</div>
      <figcaption>A geometric Möbius band of half-width 0.38, with centre-circle radius one. Surface colors use the unit normal across the full width; the arrow and graph use the centre circle. The zero contour is traced on a parameter mesh. The calculation follows geometry and a uniform field; it does not compute an electronic spectrum, spin evolution or a quantum phase.</figcaption>
      <noscript><p>The default figure shows s/π = 0.40 and field tilt 25°. The geometry remains readable; changing the controls requires JavaScript.</p></noscript>
    </figure>`;
  }

  function attach(element) {
    if (element.dataset.orientationAttached) return;
    element.dataset.orientationAttached = 'true';
    const inputs = [...element.querySelectorAll('[data-orientation-input]')];
    const view = element.querySelector('[data-orientation-view]');
    function update() {
      const params = Object.fromEntries(inputs.map(input => [input.dataset.orientationInput, Number(input.value)]));
      const s = state({ ...params, view: view.value });
      element.querySelector('[data-orientation-value="sPi"]').textContent = fixed(s.sPi);
      element.querySelector('[data-orientation-value="betaDeg"]').textContent = `${fixed(s.betaDeg, 0)}°`;
      element.querySelector('[data-orientation-value="azimuthDeg"]').textContent = `${fixed(s.azimuthDeg, 0)}°`;
      element.querySelector('[data-orientation-ribbon]').innerHTML = ribbonSVG(s);
      element.querySelector('[data-orientation-field]').innerHTML = fieldSVG(s);
      element.querySelector('[data-orientation-summary]').innerHTML = summary(s);
    }
    for (const input of inputs) input.addEventListener('input', update);
    view.addEventListener('change', update);
    for (const button of element.querySelectorAll('[data-orientation-travel]')) {
      button.addEventListener('click', () => {
        inputs.find(input => input.dataset.orientationInput === 'sPi').value = button.dataset.orientationTravel;
        update();
      });
    }
    element.querySelector('[data-orientation-reset]').addEventListener('click', () => {
      for (const input of inputs) input.value = defaults[input.dataset.orientationInput];
      view.value = defaults.view;
      update();
    });
    update();
  }

  return Object.freeze({ defaults, WIDTH, ribbonPoint, coreNormal, ribbonNormalVector, ribbonNormal,
    fieldVector, normalField, surfaceNormalField, zeroContour, coreZeros, coreZeroDetails,
    oneZero, state, ribbonSVG, fieldSVG, initialMarkup, attach });
});
