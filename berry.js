/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function () {
  'use strict';
  const P = window.BerryPhysics, $ = id => document.getElementById(id);
  if (!P || !window.katex || !window.renderMathInElement) {
    const error = document.createElement('p'); error.className = 'error-message';
    error.textContent = 'The calculation or math renderer could not load. Keep this page, its scripts, and the vendor folder together, then reopen berry.html.';
    $('main').prepend(error); return;
  }
  const BLUE = '#145b91', TAU = 2 * Math.PI;
  const defaults = () => ({ betaDegrees: 60, direction: 1, samples: 16, gaugeStrength: 0, selectedLink: 0 });
  let state = defaults(), data, downloadUrl = null;
  const xml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
  const label = (x, y, value, size = 20, color = '#000', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Times New Roman, Times, serif" font-size="${size}" fill="${color}">${xml(value)}</text>`;
  const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`;
  const rounded = (number, places = 6) => (Math.abs(number) < 0.5 * 10 ** -places ? 0 : number).toFixed(places);
  const piText = number => `${rounded(number / Math.PI)}π`;
  const startSvg = (description, height) => `<title>${xml(description)}</title><rect width="660" height="${height}" fill="white"/>`;
  const spherePoint = phi => [Math.sin(data.beta) * Math.cos(phi), Math.sin(data.beta) * Math.sin(phi), Math.cos(data.beta)];
  // Right=(1,0,0), up=(0,1/2,sqrt(3)/2), camera=(0,-sqrt(3)/2,1/2).
  // Positive depth is the near hemisphere; this same projection is used everywhere.
  const project = p => ({ x: 300 + 128 * p[0], y: 190 - 128 * (0.5 * p[1] + Math.sqrt(3) / 2 * p[2]), depth: -Math.sqrt(3) / 2 * p[1] + 0.5 * p[2] });
  function pathParts(points) {
    const parts = ['', '']; let previousSide = -1;
    for (let j = 1; j < points.length; j++) {
      const a = project(points[j - 1]), b = project(points[j]);
      const side = a.depth + b.depth >= 0 ? 1 : 0;
      parts[side] += `${side === previousSide ? '' : `M${a.x},${a.y}`}L${b.x},${b.y}`;
      previousSide = side;
    }
    return parts;
  }
  function surfaceCurve(points, color, width = 1) {
    const [back, front] = pathParts(points);
    return `<path d="${back}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="5 5"/><path d="${front}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
  }
  function between(a, b, t) {
    const point = a.map((v, j) => (1 - t) * v + t * b[j]), length = Math.hypot(...point);
    return point.map(v => v / length);
  }
  function sphereSvg() {
    const svg = $('berry-sphere-svg');
    const description = `${state.samples} spin directions at polar angle ${state.betaDegrees} degrees, ${state.direction === 1 ? 'counterclockwise' : 'clockwise'} from positive z. Link ${state.selectedLink} is highlighted.`;
    svg.setAttribute('aria-label', description);
    const circle = fn => Array.from({ length: 181 }, (_, j) => fn(TAU * j / 180));
    const vertices = data.azimuths.map(spherePoint);
    const polygon = [];
    for (let j = 0; j < vertices.length; j++) for (let k = 0; k < 8; k++) polygon.push(between(vertices[j], vertices[(j + 1) % vertices.length], k / 8));
    polygon.push(vertices[0]);
    const j = state.selectedLink, selected = Array.from({ length: 17 }, (_, k) => between(vertices[j], vertices[(j + 1) % vertices.length], k / 16));
    const origin = project([0, 0, 0]), start = project(vertices[0]);
    const axes = [[1.12, 0, 0, 'x'], [0, 1.12, 0, 'y'], [0, 0, 1.12, 'z']].map(axis => {
      const p = project(axis);
      return `<line x1="${origin.x}" y1="${origin.y}" x2="${p.x}" y2="${p.y}" stroke="#aaa" ${p.depth < 0 ? 'stroke-dasharray="3 4"' : ''}/>${label(p.x + (axis[3] === 'x' ? 14 : 0), p.y - 9, axis[3], 20, '#555')}`;
    }).join('');
    let arrow = '';
    if (Math.sin(data.beta) > 1e-7) {
      // Follow the sampled polygon, not an independently oriented screen-space ellipse.
      const arrowPoints = Array.from({ length: 25 }, (_, k) => {
        const index = (0.12 + 0.06 * k / 24) * state.samples, a = Math.floor(index);
        return project(between(vertices[a % state.samples], vertices[(a + 1) % state.samples], index - a));
      });
      const path = arrowPoints.map((p, k) => `${k ? 'L' : 'M'}${p.x},${p.y}`).join('');
      arrow = `<path d="${path}" stroke="${BLUE}" stroke-width="2.5" fill="none" ${arrowPoints[12].depth < 0 ? 'stroke-dasharray="5 5"' : ''} marker-end="url(#berry-loop-arrow)"/>`;
    }
    const dots = vertices.map((v, k) => { const p = project(v); return `<circle cx="${p.x}" cy="${p.y}" r="${state.samples > 64 ? 1.6 : 2.5}" fill="${BLUE}"/>`; }).join('');
    const selectedDots = [vertices[j], vertices[(j + 1) % state.samples]].map(v => { const p = project(v); return `<circle cx="${p.x}" cy="${p.y}" r="5" fill="white" stroke="${BLUE}" stroke-width="2"/>`; }).join('');
    svg.innerHTML = startSvg(description, 360) + `<defs>${marker('berry-loop-arrow', BLUE)}${marker('berry-state-arrow', '#000')}</defs>` +
      label(330, 24, 'Directions of the ground-state spin', 23) + axes +
      `<circle cx="300" cy="190" r="128" fill="none" stroke="#999"/>` +
      surfaceCurve(circle(t => [Math.cos(t), Math.sin(t), 0]), '#aaa') +
      surfaceCurve(circle(t => [Math.cos(t), 0, Math.sin(t)]), '#ddd') +
      surfaceCurve(circle(t => [0, Math.cos(t), Math.sin(t)]), '#ddd') +
      surfaceCurve(circle(spherePoint), '#777', 1) + surfaceCurve(polygon, BLUE, 1.8) +
      surfaceCurve(selected, BLUE, 4) + dots + arrow +
      `<line x1="300" y1="190" x2="${start.x}" y2="${start.y}" stroke="#000" stroke-width="1.6" marker-end="url(#berry-state-arrow)"/>` +
      selectedDots + `<circle cx="${start.x}" cy="${start.y}" r="5" fill="white" stroke="#000" stroke-width="1.6"/>` +
      label(start.x + 15, start.y + 24, 'n(0)', 20, '#000', 'start') +
      label(330, 347, `β = ${state.betaDegrees}°; N = ${state.samples}; ${state.direction === 1 ? 'counterclockwise' : 'clockwise'} from +z`, 19);
  }
  function phaseSvg() {
    const svg = $('berry-phase-svg'), cx = 145, cy = 128, radius = 76;
    const description = `Exact phase ${piText(data.exactPhase)}, sampled ${piText(data.sampledPhase)}, circular error ${Math.abs(data.signedError).toPrecision(4)} radians.`;
    svg.setAttribute('aria-label', description);
    const vector = (value, color, dashed, id) => {
      const x = cx + radius * value[0], y = cy - radius * value[1];
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="${dashed ? 2 : 3.5}" ${dashed ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#${id})"/><circle cx="${x}" cy="${y}" r="${dashed ? 6 : 3}" fill="${dashed ? 'white' : color}" stroke="${color}" stroke-width="1.5"/>`;
    };
    svg.innerHTML = startSvg(description, 255) + `<defs>${marker('berry-exact-arrow', '#000')}${marker('berry-sample-arrow', BLUE)}</defs>` +
      `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#999"/><path d="M55 128H238M145 40V217" stroke="#ddd" fill="none"/>` +
      label(253, 135, 'Re', 19) + label(145, 32, 'Im', 19) + label(232, 115, '+1', 18) + label(57, 115, '−1', 18) +
      vector(data.exactPhasor, '#000', false, 'berry-exact-arrow') + vector(data.sampledPhasor, BLUE, true, 'berry-sample-arrow') +
      label(310, 76, `Exact: ${piText(data.exactPhase)}`, 22, '#000', 'start') +
      label(310, 111, `Sampled: ${piText(data.sampledPhase)}`, 22, BLUE, 'start') +
      label(310, 154, `|error| = ${Math.abs(data.signedError).toExponential(2)} rad`, 21, '#000', 'start') +
      label(310, 189, `Ω = ${rounded(data.solidAngle / Math.PI, 4)}π sr`, 20, '#555', 'start') +
      label(330, 243, 'These arrows are phase factors, not spin directions.', 19);
  }
  function linksSvg() {
    const svg = $('berry-links-svg'), x = j => 65 + 535 * j / (state.samples - 1), y = phase => 143 - 96 * phase / Math.PI;
    const description = `Overlap phases for all ${state.samples} links. Gauge strength ${state.gaugeStrength}. Selected link ${state.selectedLink} returns to index ${(state.selectedLink + 1) % state.samples}.`;
    svg.setAttribute('aria-label', description);
    const ticks = [-1, 0, 1].map(t => `<path d="M65 ${y(t * Math.PI)}H600" fill="none" stroke="#ddd"/>${label(52, y(t * Math.PI) + 6, t === 0 ? '0' : t === 1 ? 'π' : '−π', 19, '#000', 'end')}`).join('');
    const selectedX = x(state.selectedLink);
    const points = data.links.map((link, j) => `<circle cx="${x(j)}" cy="${y(link.phase)}" r="${state.samples > 64 ? 2 : 3}" fill="${BLUE}"/>`).join('');
    svg.innerHTML = startSvg(description, 290) + label(330, 23, 'A link depends on the phase choices; the closed loop does not.', 20) + ticks +
      `<path d="M65 47V239H600" fill="none" stroke="#999"/><line x1="65" x2="600" y1="${y(data.baseLinks[0].phase)}" y2="${y(data.baseLinks[0].phase)}" stroke="#000" stroke-width="2" stroke-dasharray="6 4"/>` +
      `<line x1="${selectedX}" x2="${selectedX}" y1="47" y2="239" stroke="${BLUE}" stroke-dasharray="2 4"/>` + points +
      `<circle cx="${selectedX}" cy="${y(data.links[state.selectedLink].phase)}" r="6" fill="white" stroke="${BLUE}" stroke-width="2"/>` +
      label(65, 262, '0', 19) + label(600, 262, String(state.samples - 1), 19) + label(330, 278, 'Link index j (last link closes the loop)', 19);
  }
  function syncControls() {
    for (const [id, key] of [['beta', 'betaDegrees'], ['direction', 'direction'], ['samples', 'samples'], ['gauge', 'gaugeStrength']]) $('berry-' + id).value = state[key];
    state.selectedLink = Math.min(state.selectedLink, state.samples - 1);
    $('berry-link').max = state.samples - 1; $('berry-link').value = state.selectedLink;
  }
  function render() {
    data = P.latitude({ beta: state.betaDegrees * Math.PI / 180, direction: state.direction, samples: state.samples, gaugeStrength: state.gaugeStrength });
    $('berry-beta-value').textContent = `${state.betaDegrees}°`;
    $('berry-gauge-value').textContent = rounded(state.gaugeStrength, 1);
    const j = state.selectedLink, next = (j + 1) % state.samples;
    $('berry-link-value').textContent = `${j} → ${next}`;
    $('berry-exact').textContent = piText(data.exactPhase); $('berry-sampled').textContent = piText(data.sampledPhase);
    $('berry-error').textContent = `${Math.abs(data.signedError).toExponential(3)} rad`;
    $('berry-overlap').textContent = `Smallest overlap magnitude: ${rounded(data.minimumOverlap)}.`;
    $('berry-observation').textContent = state.betaDegrees === 0 || state.betaDegrees === 180
      ? 'At this pole the spin direction never moves. The phase factor is +1, even if the chosen eigenvector phase winds.'
      : `The circuit uses ${state.samples} distinct sampled directions. Change g to redistribute the link phases, or increase N to reduce the geometric sampling error. The solid angle changes when β changes.`;
    window.katex.render(String.raw`j=${j}:\quad ${rounded(data.baseLinks[j].phase)}+(${rounded(data.gaugePhases[j])})-(${rounded(data.gaugePhases[next])})\equiv ${rounded(data.links[j].phase)}\pmod{2\pi}`, $('berry-selected-equation'), { displayMode: true, throwOnError: true });
    $('berry-selected-detail').textContent = `In radians: original link phase + phase choice at ${j} − phase choice at ${next} = current link phase, modulo 2π. ${next === 0 ? 'This is the closing link; the initial phase choice must be reused.' : 'The next link contains the opposite contribution from their shared endpoint.'}`;
    sphereSvg(); phaseSvg(); linksSvg();
  }
  for (const [id, key, event] of [['beta', 'betaDegrees', 'input'], ['direction', 'direction', 'change'], ['samples', 'samples', 'change'], ['gauge', 'gaugeStrength', 'input'], ['link', 'selectedLink', 'input']]) {
    $('berry-' + id).addEventListener(event, e => { state[key] = Number(e.target.value); syncControls(); render(); });
  }
  document.querySelectorAll('[data-berry-example]').forEach(button => button.addEventListener('click', () => {
    state = defaults(); state.betaDegrees = { cone: 60, equator: 90, north: 0, south: 180 }[button.dataset.berryExample];
    syncControls(); render(); $('berry-announcement').textContent = `Loaded ${button.textContent}; other settings reset.`;
  }));
  $('berry-reset').addEventListener('click', () => { state = defaults(); syncControls(); render(); $('berry-announcement').textContent = 'Reset to a 60-degree counterclockwise loop, 16 samples, and zero phase-choice strength.'; });
  function save(contents, type, filename) {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([contents], { type }));
    const link = $('berry-download'); link.href = downloadUrl; link.download = filename; link.textContent = filename;
    $('berry-export-ready').hidden = false; link.click();
    $('berry-announcement').textContent = `${filename} prepared. The download link remains below the export controls.`;
  }
  $('berry-export-svg').addEventListener('click', () => {
    const svg = $($('berry-export-figure').value).cloneNode(true), box = svg.getAttribute('viewBox').split(' ').map(Number);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); svg.setAttribute('width', box[2]); svg.setAttribute('height', box[3]);
    for (const element of [svg, ...svg.querySelectorAll('*')]) for (const attribute of [...element.attributes]) {
      if (/^on/i.test(attribute.name) || ['tabindex', 'class'].includes(attribute.name) || attribute.name.startsWith('data-')) element.removeAttribute(attribute.name);
    }
    save(`<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svg)}`, 'image/svg+xml;charset=utf-8', `${svg.id}.svg`);
  });
  $('berry-export-json').addEventListener('click', () => save(JSON.stringify({ schemaVersion: 1, model: 'Spin-1/2 ground-state latitude Berry phase',
    parameters: { ...state, betaRadians: data.beta }, units: { angles: 'radians except betaDegrees', solidAngle: 'steradians' },
    conventions: { Hamiltonian: 'H = -Delta n.sigma/2, Delta > 0', positiveDirection: 'Increasing azimuth, counterclockwise from +z',
      overlap: '<u_(j+1)|u_j> / |<u_(j+1)|u_j>|; closing state is the initial stored state', phase: 'arg of the cyclic link product, modulo 2 pi',
      gauge: 'alpha_j = g[sin(2 pi j/N) + 0.37 cos(4 pi j/N)]', error: 'arg(exp(i sampledPhase) exp(-i exactPhase)); geometric discretization error',
      scope: 'Geometric phase only; no time evolution, dynamical phase, anyons, or adiabatic leakage is simulated.' }, results: data,
    sources: ['https://doi.org/10.1098/rspa.1984.0023', 'https://arxiv.org/abs/cond-mat/0503172'] }, null, 2) + '\n', 'application/json;charset=utf-8', 'berry-latitude.json'));
  window.addEventListener('pagehide', () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); });
  window.renderMathInElement(document.body, { throwOnError: true, trust: false, strict: 'error',
    delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'], errorCallback: (message, error) => { throw error || new Error(message); } });
  syncControls(); render();
})();
