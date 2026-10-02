/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function () {
  'use strict';

  const physics = window.AnyonPhysics;
  const $ = id => document.getElementById(id);
  if (!physics || !window.katex || !window.renderMathInElement) {
    const message = document.createElement('p');
    message.className = 'error-message';
    message.textContent = 'The model or math renderer could not load. Keep the complete repository, including the vendor folder, together and reopen experiments.html.';
    $('main').prepend(message);
    return;
  }

  const colors = { ink: '#000000', muted: '#555555', grid: '#dddddd', teal: '#145b91', coral: '#a33b2b', paper: '#ffffff', faint: '#888888' };
  const defaults = {
    exchange: { thetaPi: 0.5, exchanges: 1, direction: 1, deformation: 0 },
    interference: { thetaPi: 0.5, enclosed: 1, winding: 1, referencePi: 0, visibility: 1 },
    braids: { initial: 'plus', direction: 1, measurement: 'z', word: [1, 2] },
    fusion: { number: 4, charge: 'vacuum', pathIndex: 0 },
    toric: { size: 'medium', windings: 1, mode: 'pairs', anchor: null, baselineDefects: [], defects: ['0,0', '3,2'], edges: [['0,0', '1,0'], ['1,0', '2,0'], ['2,0', '3,0'], ['3,0', '3,1'], ['3,1', '3,2']] }
  };
  const copy = value => JSON.parse(JSON.stringify(value));
  const state = copy(defaults);
  const views = Object.keys(defaults);
  let active = 'exchange';
  let animationFrame = null;
  let animationView = null;
  let exchangeProgress = 0;
  let toricProgress = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const number = (value, places = 2) => Math.abs(value) < 1e-10 ? (0).toFixed(places) : value.toFixed(places).replace('-', '−');
  const percent = value => `${number(100 * value, Math.abs(value * 100 - Math.round(value * 100)) < 1e-8 ? 0 : 1)}%`;
  const piAngle = value => `${number(value / Math.PI)}π`;
  const cleanNumber = value => Math.abs(value) < 1e-10 ? 0 : value;
  const xml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
  const attributeDefault = (options, name, value) => new RegExp(`(?:^|\\s)${name}=`).test(options) ? '' : `${name}="${value}"`;
  const text = (x, y, label, options = '') => `<text x="${x}" y="${y}" ${attributeDefault(options, 'fill', colors.muted)} ${attributeDefault(options, 'font-family', 'Arial, sans-serif')} ${attributeDefault(options, 'font-size', '12')} ${options}>${xml(label)}</text>`;
  const line = (x1, y1, x2, y2, options = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attributeDefault(options, 'stroke', colors.grid)} ${options}/>`;
  const circle = (x, y, radius, options = '') => `<circle cx="${x}" cy="${y}" r="${radius}" ${options}/>`;
  const svgFrame = title => `<title>${xml(title)}</title><rect width="720" height="380" fill="${colors.paper}"/>`;

  function complexLabel(phase) {
    const real = cleanNumber(phase[0]);
    const imaginary = cleanNumber(phase[1]);
    if (Math.abs(imaginary) < 1e-8) return real >= 0 ? '+1' : '−1';
    if (Math.abs(real) < 1e-8) return imaginary >= 0 ? 'i' : '−i';
    return `${number(real)} ${imaginary >= 0 ? '+' : '−'} ${number(Math.abs(imaginary))}i`;
  }

  function cancelAnimation() {
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    if (animationView === 'exchange' && exchangeProgress < 1) $('exchange-progress').textContent = 'Paused · run again to restart';
    animationFrame = null;
    animationView = null;
    $('exchange-play').disabled = false;
    $('interference-play').disabled = false;
    $('toric-play').disabled = false;
  }

  // Motion illustrates paths only. Model results always describe complete braids.
  function animate(view, duration, update, complete) {
    cancelAnimation();
    animationView = view;
    $(`${view}-play`).disabled = true;
    if (reduceMotion.matches) {
      update(1);
      cancelAnimation();
      complete();
      return;
    }
    const start = performance.now();
    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      update(progress);
      if (progress < 1) animationFrame = requestAnimationFrame(frame);
      else {
        cancelAnimation();
        complete();
      }
    }
    animationFrame = requestAnimationFrame(frame);
  }

  function setControl(id, value) { $(id).value = value; }

  const mathOptions = { throwOnError: true, trust: false, strict: 'error' };
  function typeset(element) {
    window.renderMathInElement(element, {
      ...mathOptions,
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'],
      errorCallback: (message, error) => { throw error || new Error(message); }
    });
  }
  function setText(id, content) {
    $(id).textContent = content;
    typeset($(id));
  }
  function setMath(id, latex) { window.katex.render(latex, $(id), mathOptions); }
  const texNumber = (value, places = 2) => number(value, places).replace('−', '-');
  const texAngle = value => `${texNumber(value / Math.PI)}\\pi`;
  function piTex(value) {
    const sign = value < 0 ? '-' : '';
    const absolute = Math.abs(value);
    for (const denominator of [1, 2, 3, 4, 6]) {
      const numerator = Math.round(absolute * denominator);
      if (Math.abs(absolute * denominator - numerator) < 1e-9) {
        if (numerator === 0) return '0';
        const top = (numerator === 1 ? '' : numerator) + String.raw`\pi`;
        return sign + (denominator === 1 ? top : String.raw`\frac{${top}}{${denominator}}`);
      }
    }
    return `${texNumber(value, 3)}\\pi`;
  }



  function exchangeResult() {
    return physics.abelianPhase(state.exchange.thetaPi * Math.PI, state.exchange.exchanges * state.exchange.direction);
  }

  function exchangeDiagram() {
    const config = state.exchange, result = exchangeResult();
    const center = { x: 249, y: 192 }, rx = 155, ry = 103;
    // Positive radius and antipodal angles keep the particles separated.
    function point(angle) {
      const radius = 1 + 0.20 * config.deformation * Math.sin(2 * angle);
      return { x: center.x + rx * radius * Math.cos(angle), y: center.y - ry * radius * Math.sin(angle) };
    }
    function rotation(progress) {
      const turns = config.exchanges === 0 ? 2 * Math.min(progress, 1 - progress) : config.exchanges * progress;
      return config.direction * Math.PI * turns;
    }
    function trajectory(start) {
      return Array.from({ length: 121 }, (_, index) => {
        const position = point(start + rotation(exchangeProgress * index / 120));
        return `${index ? 'L' : 'M'}${position.x.toFixed(2)},${position.y.toFixed(2)}`;
      }).join(' ');
    }
    const outline = Array.from({ length: 121 }, (_, index) => {
      const position = point(2 * Math.PI * index / 120);
      return `${index ? 'L' : 'M'}${position.x.toFixed(2)},${position.y.toFixed(2)}`;
    }).join(' ');
    let svg = svgFrame('Separated anyons follow deformable exchange paths; the statistical phase depends only on the completed braid');
    svg += `<defs><marker id="phase-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="${colors.teal}"/></marker></defs>`;
    svg += text(249, 34, config.exchanges === 0 ? 'Exchange, then retrace the motion' : `${config.direction === 1 ? 'Counterclockwise' : 'Clockwise'} motion`, 'text-anchor="middle" font-size="14"');
    svg += `<path d="${outline}" fill="none" stroke="${colors.grid}" stroke-width="1.5" stroke-dasharray="5 6"/>`;
    svg += line(230, 192, 268, 192, 'stroke-dasharray="3 5"') + line(249, 173, 249, 211, 'stroke-dasharray="3 5"');
    for (const [start, color, label] of [[Math.PI, colors.teal, '1'], [0, colors.coral, '2']]) {
      if (exchangeProgress > 0) svg += `<path d="${trajectory(start)}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
      const initial = point(start), current = point(start + rotation(exchangeProgress));
      svg += circle(initial.x, initial.y, 14, `fill="none" stroke="${color}" stroke-dasharray="3 3"`);
      svg += circle(current.x, current.y, 12, `fill="${color}" stroke="white" stroke-width="2"`);
      svg += text(current.x, current.y + 4, label, 'text-anchor="middle" fill="#fff" font-size="12"');
    }
    const direction = config.exchanges === 0 && exchangeProgress > 0.5 ? -config.direction : config.direction;
    const arrowStart = point(-0.5), arrowEnd = point(-0.5 + direction * 0.17);
    svg += `<path d="M${arrowStart.x},${arrowStart.y} L${arrowEnd.x},${arrowEnd.y}" fill="none" stroke="${colors.teal}" stroke-width="1.8" marker-end="url(#phase-arrow)"/>`;
    svg += line(467, 55, 467, 322);
    svg += text(584, 70, 'Final statistical multiplier', 'text-anchor="middle" font-size="13"');
    svg += circle(584, 190, 61, `fill="none" stroke="${colors.grid}"`);
    svg += line(507, 190, 661, 190) + line(584, 113, 584, 267);
    svg += text(663, 194, 'Re', 'font-size="12"') + text(591, 119, 'Im', 'font-size="12"');
    const end = { x: 584 + 61 * result.phase[0], y: 190 - 61 * result.phase[1] };
    svg += `<path d="M584,190 L${end.x},${end.y}" fill="none" stroke="${colors.teal}" stroke-width="2" marker-end="url(#phase-arrow)"/>`;
    svg += circle(end.x, end.y, 4, `fill="${colors.teal}"`);
    svg += text(584, 300, complexLabel(result.phase), 'text-anchor="middle" font-family="Georgia, serif" font-size="20"');
    svg += text(249, 355, 'Planar paths; dashed circles mark starting positions', 'text-anchor="middle" font-size="12"');
    svg += text(584, 355, 'Unit circle in the complex plane', 'text-anchor="middle" font-size="11"');
    $('exchange-svg').innerHTML = svg;
    setControl('exchange-scrub', exchangeProgress);
  }

  function renderExchange() {
    const config = state.exchange, result = exchangeResult();
    setControl('exchange-theta', config.thetaPi);
    setControl('exchange-direction', config.direction);
    setControl('exchange-deformation', config.deformation);
    setMath('exchange-theta-value', piTex(config.thetaPi));
    $('exchange-deformation-value').textContent = percent(config.deformation);
    document.querySelectorAll('[name="exchange-path"]').forEach(input => { input.checked = Number(input.value) === config.exchanges; });
    document.querySelectorAll('[data-theta]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.theta) === config.thetaPi)));
    const operation = config.exchanges === 0 ? 'Exchange and inverse' : config.exchanges === 1 ? 'One exchange' : 'Two exchanges in the same direction';
    $('exchange-operation-label').textContent = operation;
    $('exchange-play').textContent = config.exchanges === 0 ? 'Run exchange and inverse' : config.exchanges === 1 ? 'Run exchange' : 'Run winding';
    setMath('exchange-phase', complexLabel(result.phase).replaceAll('−', '-'));
    setText('exchange-angle', String.raw`\(k=${config.exchanges * config.direction}\); accumulated angle \(${piTex(result.angle / Math.PI)}\).`);
    if (config.exchanges === 0) setText('exchange-notice', String.raw`An exchange followed by its inverse has \(k=0\), so \(e^{i\theta}e^{-i\theta}=1\) for every exchange angle. This is different from two exchanges in the same direction.`);
    else if (config.thetaPi === 0.5) setText('exchange-notice', String.raw`For a semion, one counterclockwise exchange gives \(i\); a clockwise exchange gives \(-i\). A full winding in either direction gives \(-1\). Deforming the paths leaves these values unchanged.`);
    else if (config.thetaPi === 1) setText('exchange-notice', String.raw`A fermion gives \(-1\) for one exchange and \(+1\) for two. A full winding therefore hides the distinction between this fermionic rule and the bosonic rule; a single exchange distinguishes them.`);
    else setText('exchange-notice', String.raw`The chosen operation has \(k=${config.exchanges * config.direction}\). Its multiplier is \(e^{ik\theta}\), independent of the drawn shape. An observable phase difference requires a second route as a reference.`);
    exchangeDiagram();
  }

  function interferenceResult(config = state.interference, referencePi = config.referencePi) {
    return physics.interference({ theta: config.thetaPi * Math.PI, enclosed: config.enclosed, winding: config.winding, referencePhase: referencePi * Math.PI, visibility: config.visibility });
  }

  function complexTex(value) {
    const [real, imaginary] = value.map(cleanNumber);
    if (Math.abs(imaginary) < 1e-9) return texNumber(real, 3);
    const imaginaryPart = Math.abs(Math.abs(imaginary) - 1) < 1e-9 ? 'i' : `${texNumber(Math.abs(imaginary), 3)}i`;
    if (Math.abs(real) < 1e-9) return (imaginary < 0 ? '-' : '') + imaginaryPart;
    return `${texNumber(real, 3)}${imaginary < 0 ? '-' : '+'}${imaginaryPart}`;
  }

  function renderInterferenceState(result) {
    const coherent = result.coherentOutputAmplitudes !== null;
    $('interference-coherent-figure').hidden = !coherent;
    $('interference-mixed-explanation').hidden = coherent;
    const rho = result.pathDensityMatrix;
    setMath('interference-density', String.raw`\rho\approx\begin{pmatrix}${complexTex(rho[0][0])}&${complexTex(rho[0][1])}\\${complexTex(rho[1][0])}&${complexTex(rho[1][1])}\end{pmatrix},\qquad\operatorname{Tr}\rho=1.`);
    if (!coherent) return;
    let svg = '<title>Complex amplitude addition for the two output ports in the fully coherent case</title><rect width="720" height="240" fill="white"/>';
    svg += '<defs><marker id="phasor-fixed" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="black"/></marker><marker id="phasor-moving" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#145b91"/></marker><marker id="phasor-sum" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#a33b2b"/></marker></defs>';
    result.coherentOutputAmplitudes.forEach((amplitude, port) => {
      const x = 175 + port * 360, y = 119, scale = 77;
      const end = { x: x + scale * amplitude[0], y: y - scale * amplitude[1] };
      svg += circle(x, y, scale, 'fill="none" stroke="#dddddd"');
      svg += line(x - 93, y, x + 99, y) + line(x, y - 91, x, y + 91);
      svg += text(x + 98, y - 5, 'Re', 'font-size="11"') + text(x + 5, y - 91, 'Im', 'font-size="11"');
      svg += text(x, 21, `Output ${port}`, 'text-anchor="middle" font-size="14"');
      svg += `<path d="M${x},${y} L${x + scale / 2},${y}" stroke="black" stroke-width="2" fill="none" marker-end="url(#phasor-fixed)"/>`;
      svg += `<path d="M${x + scale / 2},${y} L${end.x},${end.y}" stroke="${colors.teal}" stroke-width="2" fill="none" marker-end="url(#phasor-moving)"/>`;
      if (Math.hypot(...amplitude) > 1e-8) svg += `<path d="M${x},${y} L${end.x},${end.y}" stroke="${colors.coral}" stroke-width="2" stroke-dasharray="4 4" fill="none" marker-end="url(#phasor-sum)"/>`;
      svg += circle(end.x, end.y, 3.5, `fill="${colors.coral}"`);
      svg += text(x, 228, `Squared length = ${percent(port === 0 ? result.p0 : result.p1)}`, 'text-anchor="middle" font-size="13"');
    });
    $('interference-phasors').innerHTML = svg;
    setMath('interference-amplitudes', String.raw`A_0\approx ${complexTex(result.coherentOutputAmplitudes[0])},\qquad A_1\approx ${complexTex(result.coherentOutputAmplitudes[1])}.`);
  }

  function renderInterference() {
    const config = state.interference, result = interferenceResult();
    for (const [id, key] of [['theta', 'thetaPi'], ['enclosed', 'enclosed'], ['winding', 'winding'], ['reference', 'referencePi'], ['visibility', 'visibility']]) setControl(`interference-${id}`, config[key]);
    setMath('interference-theta-value', piTex(config.thetaPi));
    setMath('interference-reference-value', piTex(config.referencePi));
    $('interference-visibility-value').textContent = number(config.visibility);
    $('interference-probability').textContent = `Output 0: ${percent(result.p0)}`;
    $('interference-probability-one').textContent = `Output 1: ${percent(result.p1)}`;
    setText('interference-shift', String.raw`Statistical phase \(\delta=${piTex(result.statisticalPhase / Math.PI)}\)`);
    const chart = { left: 74, right: 674, top: 67, bottom: 294 };
    const x = phasePi => chart.left + phasePi / 2 * (chart.right - chart.left);
    const y = probability => chart.bottom - probability * (chart.bottom - chart.top);
    let svg = svgFrame('Interference fringe: output probability as a function of reference phase');
    for (const tick of [0, 0.25, 0.5, 0.75, 1]) {
      svg += line(chart.left, y(tick), chart.right, y(tick), 'stroke-width="1"');
      svg += text(chart.left - 13, y(tick) + 4, number(tick, tick === 0 || tick === 1 ? 0 : 2), 'text-anchor="end" font-size="11"');
    }
    for (const tick of [0, 0.5, 1, 1.5, 2]) {
      svg += line(x(tick), chart.top, x(tick), chart.bottom, 'stroke-width="1" stroke-dasharray="3 6"');
      svg += text(x(tick), chart.bottom + 25, ['0', 'π/2', 'π', '3π/2', '2π'][tick * 2], 'text-anchor="middle" font-size="12"');
    }
    svg += text(22, 183, 'Probability P₀', 'text-anchor="middle" transform="rotate(-90 22 183)" font-size="12"');
    svg += text(374, 352, 'Reference phase φ (radians)', 'text-anchor="middle" font-size="12"');
    svg += text(674, 38, `δ = ${piAngle(result.statisticalPhase)}`, 'text-anchor="end" font-family="Georgia, serif" font-size="16" fill="#145b91"');
    function curve(enclosed) {
      return Array.from({ length: 181 }, (_, index) => {
        const reference = 2 * index / 180;
        const value = interferenceResult({ ...config, enclosed }, reference).p0;
        return `${index ? 'L' : 'M'}${x(reference).toFixed(2)},${y(value).toFixed(2)}`;
      }).join(' ');
    }
    svg += `<path d="${curve(0)}" fill="none" stroke="${colors.faint}" stroke-width="1.7" stroke-dasharray="5 5"/>`;
    svg += `<path d="${curve(config.enclosed)}" fill="none" stroke="${colors.teal}" stroke-width="3" stroke-linecap="round"/>`;
    const pointX = x(config.referencePi), pointY = y(result.p0);
    svg += line(pointX, chart.top - 6, pointX, chart.bottom + 6, `stroke="${colors.coral}" opacity="0.65" stroke-dasharray="3 4"`);
    svg += circle(pointX, pointY, 7, `fill="${colors.teal}" stroke="${colors.paper}" stroke-width="2.5"`);
    $('interference-svg').innerHTML = svg;
    renderInterferenceState(result);
    if (active === 'interference') syncExportChoices();
    if (config.visibility === 0) $('interference-notice').textContent = 'At zero visibility the curve is flat: every reference phase gives 50%. The model still assigns a statistical phase, but this readout cannot reveal it.';
    else if (config.enclosed === 0) $('interference-notice').textContent = 'With no enclosed anyons, the statistical contribution is zero. The two curves coincide; varying the reference phase still produces interference.';
    else if (Math.abs(Math.cos(result.statisticalPhase) - 1) < 1e-8) setText('interference-notice', String.raw`The statistical phase is a whole multiple of \(2\pi\), so these fringes coincide. A nonzero accumulated angle can have exactly the same phase multiplier as zero.`);
    else $('interference-notice').textContent = 'The enclosed anyons shift the fringe; visibility changes its contrast. One enclosed semion shifts it by half a cycle, and a second restores the original fringe.';
  }

  // SVG labels use plain operation names; the sequence readout is LaTeX.
  function braidLabel(generator) { return `B${Math.abs(generator)}${generator < 0 ? '^-1' : ''}`; }
  function braidTex(generator) { return `B_{${Math.abs(generator)}}${generator < 0 ? '^{-1}' : ''}`; }
  function braidWordLabel(word) { return word.length ? word.map(braidLabel).join(' → ') : 'Identity · no exchanges'; }

  function braidPane(word, left, accent, paneLabel) {
    const positions = [left, left + 48, left + 96, left + 144];
    const start = 81, end = 268;
    const height = (end - start) / Math.max(1, word.length);
    let svg = text(left + 72, 33, paneLabel, 'text-anchor="middle" font-size="10" letter-spacing="1.2"');
    svg += text(left + 72, 52, word.length <= 3 ? braidWordLabel(word) : `${word.length} exchanges`, `text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${accent}"`);
    for (let column = 0; column < 4; column++) {
      svg += text(positions[column], 73, String(column + 1), 'text-anchor="middle" font-size="9"');
      svg += circle(positions[column], start, 4, `fill="${accent}" opacity="0.7"`);
      svg += circle(positions[column], end, 4, `fill="${accent}" opacity="0.7"`);
    }
    if (word.length === 0) {
      positions.forEach(position => { svg += line(position, start, position, end, `stroke="${accent}" stroke-width="2" opacity="0.55"`); });
    }
    word.forEach((generator, row) => {
      const index = Math.abs(generator) - 1;
      const y0 = start + row * height, y1 = y0 + height;
      const x0 = positions[index], x1 = positions[index + 1];
      positions.forEach((position, column) => {
        if (column !== index && column !== index + 1) svg += line(position, y0, position, y1, `stroke="${accent}" stroke-width="2" opacity="0.32"`);
      });
      const toRight = `M${x0},${y0} C${x0},${y0 + height * 0.42} ${x1},${y1 - height * 0.42} ${x1},${y1}`;
      const toLeft = `M${x1},${y0} C${x1},${y0 + height * 0.42} ${x0},${y1 - height * 0.42} ${x0},${y1}`;
      const over = generator > 0 ? toRight : toLeft, under = generator > 0 ? toLeft : toRight;
      svg += `<path d="${under}" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.75"/>`;
      svg += `<path d="${over}" fill="none" stroke="${colors.paper}" stroke-width="8"/>`;
      svg += `<path d="${over}" fill="none" stroke="${accent}" stroke-width="2.5"/>`;
      svg += text(left + 172, y0 + height / 2 + 4, braidLabel(generator), `font-size="12" fill="${accent}"`);
    });
    svg += text(left + 72, 302, state.braids.measurement === 'z' ? 'measure the first pair' : `measure in the ${state.braids.measurement.toUpperCase()} basis`, 'text-anchor="middle" font-size="10"');
    return svg;
  }

  // Fixing a global phase changes only the printed representative of a state.
  // Evolution, measurements, and fidelity always use the untouched core output.
  function canonicalState(vector) {
    const norm = Math.sqrt(vector.reduce((sum, [real, imaginary]) => sum + real * real + imaginary * imaginary, 0));
    const pivot = vector.find(([real, imaginary]) => Math.hypot(real, imaginary) > 1e-10);
    const magnitude = Math.hypot(pivot[0], pivot[1]);
    return vector.map(([real, imaginary]) => [
      cleanNumber((real * pivot[0] + imaginary * pivot[1]) / (norm * magnitude)),
      cleanNumber((imaginary * pivot[0] - real * pivot[1]) / (norm * magnitude))
    ]);
  }

  function stateKetTex(vector, label) {
    const [first, second] = canonicalState(vector);
    const close = (left, right) => Math.abs(left - right) < 1e-9;
    const prefix = String.raw`\lvert\psi_{${label}}\rangle`;
    if (close(first[0], 1) && close(first[1], 0)) return prefix + String.raw`=\lvert0\rangle`;
    if (close(second[0], 1) && close(first[0], 0) && close(first[1], 0)) return prefix + String.raw`=\lvert1\rangle`;
    if (close(first[0], Math.SQRT1_2) && close(first[1], 0)) {
      if (close(Math.abs(second[0]), Math.SQRT1_2) && close(second[1], 0)) {
        return prefix + String.raw`=\frac{\lvert0\rangle${second[0] < 0 ? '-' : '+'}\lvert1\rangle}{\sqrt{2}}`;
      }
      if (close(second[0], 0) && close(Math.abs(second[1]), Math.SQRT1_2)) {
        return prefix + String.raw`=\frac{\lvert0\rangle${second[1] < 0 ? '-' : '+'}i\lvert1\rangle}{\sqrt{2}}`;
      }
    }
    // A numerical fallback keeps the formatter usable if preparations expand.
    const coefficient = ([real, imaginary]) => {
      if (Math.abs(imaginary) < 1e-9) return texNumber(real, 3);
      return String.raw`\left(${texNumber(real, 3)}${imaginary < 0 ? '-' : '+'}${texNumber(Math.abs(imaginary), 3)}i\right)`;
    };
    return prefix + String.raw`\approx ${coefficient(first)}\lvert0\rangle+${coefficient(second)}\lvert1\rangle`;
  }

  function braidResults() {
    const config = state.braids;
    const finalA = physics.applyBraidWord(config.word, config.initial);
    const finalB = physics.applyBraidWord(config.word.slice().reverse(), config.initial);
    return {
      finalA, finalB,
      probabilitiesA: physics.probabilities(finalA),
      probabilitiesB: physics.probabilities(finalB),
      measurementAxis: config.measurement,
      measurementA: physics.measurementProbabilities(finalA, config.measurement),
      measurementB: physics.measurementProbabilities(finalB, config.measurement),
      fidelity: physics.fidelity(finalA, finalB),
      blochA: physics.bloch(finalA), blochB: physics.bloch(finalB),
      displayedStateA: canonicalState(finalA), displayedStateB: canonicalState(finalB),
      displayedStateConvention: 'Normalized; the first nonzero amplitude is real and positive. Original amplitudes are retained in finalA and finalB.'
    };
  }

  function renderBlochComponents(result) {
    const left = 172, right = 620, zero = (left + right) / 2;
    const position = value => zero + cleanNumber(value) * (right - left) / 2;
    let svg = '<title>Expectation values of Pauli X, Y, and Z for the two final states, on a shared scale from minus one to one</title><rect width="720" height="230" fill="#ffffff"/>';
    for (const tick of [-1, -0.5, 0, 0.5, 1]) {
      svg += line(position(tick), 41, position(tick), 202, `stroke="${tick === 0 ? colors.faint : colors.grid}" ${tick === 0 ? '' : 'stroke-dasharray="3 5"'}`);
      svg += text(position(tick), 28, number(tick, Number.isInteger(tick) ? 0 : 1), 'text-anchor="middle" font-size="12"');
    }
    ['x', 'y', 'z'].forEach((axis, row) => {
      const center = 63 + row * 58;
      svg += text(58, center + 8, axis.toUpperCase(), 'font-family="Georgia, serif" font-size="19" font-style="italic"');
      for (const [offset, label, vector, color] of [[-7, 'A', result.blochA, colors.teal], [10, 'B', result.blochB, colors.coral]]) {
        const value = cleanNumber(vector[axis]), y = center + offset;
        svg += text(127, y + 4, label, `text-anchor="middle" font-size="12" fill="${color}"`);
        svg += line(left, y, right, y, 'stroke="#eeeeee"');
        if (Math.abs(value) > 1e-9) svg += `<rect x="${Math.min(zero, position(value))}" y="${y - 4}" width="${Math.abs(position(value) - zero)}" height="8" fill="${color}"/>`;
        svg += circle(position(value), y, 3, `fill="${color}"`);
        svg += text(650, y + 4, value > 1e-9 ? `+${number(value, 2)}` : number(value, 2), `font-size="12" fill="${color}"`);
      }
    });
    svg += text(396, 224, 'Expectation value; the same scale is used for both states', 'text-anchor="middle" font-size="12"');
    $('braids-bloch-svg').innerHTML = svg;
    $('braids-bloch-svg').setAttribute('aria-label', ['x', 'y', 'z'].map(axis => `${axis.toUpperCase()}: state A ${number(result.blochA[axis], 2)}, state B ${number(result.blochB[axis], 2)}`).join('; '));
  }

  function renderBraids() {
    const config = state.braids, result = braidResults();
    setControl('braids-initial', config.initial);
    setControl('braids-direction', config.direction);
    setControl('braids-measurement', config.measurement);
    if (config.word.length) setMath('braids-word', config.word.map(braidTex).join(String.raw`\to `));
    else $('braids-word').textContent = 'Identity · no exchanges';
    const initialTex = {
      plus: String.raw`\lvert+\rangle = \frac{\lvert0\rangle + \lvert1\rangle}{\sqrt{2}}`,
      plusY: String.raw`\lvert+_y\rangle = \frac{\lvert0\rangle + i\lvert1\rangle}{\sqrt{2}}`,
      vacuum: String.raw`\lvert0\rangle`,
      fermion: String.raw`\lvert1\rangle`
    };
    setMath('braids-initial-formula', initialTex[config.initial]);
    setMath('braids-state-a', stateKetTex(result.finalA, 'A'));
    setMath('braids-state-b', stateKetTex(result.finalB, 'B'));
    $('braids-capacity').textContent = `${config.word.length} of 8 exchanges${config.word.length === 8 ? ' · remove one to add another' : ''}`;
    document.querySelectorAll('[data-braid]').forEach(button => { button.disabled = config.word.length >= 8; });
    $('braids-undo').disabled = config.word.length === 0;
    const measurementLabel = config.measurement === 'z' ? 'First pair → vacuum' : `+1 outcome in the ${config.measurement.toUpperCase()} basis`;
    $('braids-label-a').textContent = `A: ${measurementLabel}`;
    $('braids-label-b').textContent = `B: ${measurementLabel}`;
    $('braids-probability-a').textContent = percent(result.measurementA.plus);
    $('braids-probability-b').textContent = percent(result.measurementB.plus);
    $('braids-bar-a').style.width = `${100 * result.measurementA.plus}%`;
    $('braids-bar-b').style.width = `${100 * result.measurementB.plus}%`;
    const otherLabel = config.measurement === 'z' ? String.raw`\(\psi\) channel` : String.raw`\(-1\) outcome in the \(${config.measurement.toUpperCase()}\) basis`;
    setText('braids-other-a', `${otherLabel}: ${percent(result.measurementA.minus)}`);
    setText('braids-other-b', `${otherLabel}: ${percent(result.measurementB.minus)}`);
    $('braids-fidelity').textContent = number(result.fidelity, 3);
    let svg = '<title>Chronological braid sequences for four Ising anyons; time increases downward</title><rect width="720" height="330" fill="#ffffff"/>';
    svg += line(360, 29, 360, 299);
    svg += line(32, 96, 32, 243, 'stroke="#a7b3a6"');
    svg += '<path d="M28,237 L32,245 L36,237" fill="none" stroke="#a7b3a6"/>';
    svg += text(22, 174, 'time', 'text-anchor="middle" font-size="9" transform="rotate(-90 22 174)"');
    svg += braidPane(config.word, 86, colors.teal, 'Sequence A');
    svg += braidPane(config.word.slice().reverse(), 434, colors.coral, 'Sequence B');
    $('braids-svg').innerHTML = svg;
    renderBlochComponents(result);
    if (result.fidelity > 1 - 1e-8) $('braids-notice').textContent = 'The normalized kets and all three components agree: these two orders give the same state up to a global phase. Some braid operations fail to commute, but not every choice of sequence and initial state reveals a difference.';
    else if (Math.abs(result.measurementA.plus - result.measurementB.plus) < 1e-8) setText('braids-notice', String.raw`The selected \(${config.measurement.toUpperCase()}\)-basis probabilities agree, although the final kets differ. The component plot shows which other basis can distinguish them. The squared overlap below one confirms that they are not the same state up to global phase.`);
    else setText('braids-notice', String.raw`The same exchanges in a different order give different final states. This difference is visible in the \(${config.measurement.toUpperCase()}\)-basis probabilities. The component plot and normalized kets show the state change behind the probabilities.`);
  }

  function fusionResults() {
    const config = state.fusion;
    const counts = physics.fibonacciCounts(config.number);
    return {
      ...counts,
      selectedSector: config.charge,
      sectorDimension: counts[config.charge],
      selectedPathIndex: config.pathIndex,
      selectedPath: physics.fibonacciPathAt(config.number, config.charge, config.pathIndex),
      pathConvention: 'Zero-based index. Entries are cumulative charges after adding each tau anyon; the initial vacuum is implicit. Each path labels one fusion basis state, not a probability or a measured trajectory.'
    };
  }

  let fusionGraphCache = null;
  function fusionGraphEdges(n, charge, dimension) {
    const key = `${n}:${charge}`;
    if (fusionGraphCache && fusionGraphCache.key === key) return fusionGraphCache.edges;
    const edges = new Map();
    // At most 987 paths occur in one sector for n <= 16. Reading their edges
    // from the core avoids implementing a second fusion recurrence in the UI.
    for (let index = 0; index < dimension; index++) {
      let previous = 'vacuum';
      physics.fibonacciPathAt(n, charge, index).forEach((next, step) => {
        edges.set(`${step}:${previous}:${next}`, { step, previous, next });
        previous = next;
      });
    }
    fusionGraphCache = { key, edges: Array.from(edges.values()) };
    return fusionGraphCache.edges;
  }

  function renderFusionPath(result) {
    const config = state.fusion, n = config.number;
    const width = n >= 12 ? Math.max(720, 180 + 50 * n) : 720;
    const chart = { left: 95, right: width - 105, vacuum: 77, tau: 162 };
    const x = step => chart.left + step / n * (chart.right - chart.left);
    const y = charge => chart[charge];
    const edges = fusionGraphEdges(n, config.charge, result.sectorDimension);
    const nodes = new Map();
    let svg = `<title>Fusion basis paths for ${n} Fibonacci anyons with fixed total charge ${config.charge}; path ${config.pathIndex + 1} of ${result.sectorDimension} is highlighted</title><rect width="${width}" height="250" fill="#ffffff"/>`;
    svg += text(23, y('vacuum') + 5, '1', 'font-family="Georgia, serif" font-size="18"');
    svg += text(23, y('tau') + 5, 'τ', 'font-family="Georgia, serif" font-size="18" font-style="italic"');
    svg += text(22, 30, 'charge', 'font-size="12"');
    for (const charge of ['vacuum', 'tau']) svg += line(chart.left, y(charge), chart.right, y(charge), 'stroke="#eeeeee"');
    for (const edge of edges) {
      svg += line(x(edge.step), y(edge.previous), x(edge.step + 1), y(edge.next), 'stroke="#c7c7c7" stroke-width="1.5"');
      nodes.set(`${edge.step}:${edge.previous}`, { step: edge.step, charge: edge.previous });
      nodes.set(`${edge.step + 1}:${edge.next}`, { step: edge.step + 1, charge: edge.next });
    }
    let previous = 'vacuum';
    result.selectedPath.forEach((charge, step) => {
      svg += line(x(step), y(previous), x(step + 1), y(charge), `stroke="${colors.teal}" stroke-width="3.5"`);
      previous = charge;
    });
    for (const node of nodes.values()) svg += circle(x(node.step), y(node.charge), 4.5, 'fill="#ffffff" stroke="#888888" stroke-width="1.5"');
    ['vacuum', ...result.selectedPath].forEach((charge, step) => { svg += circle(x(step), y(charge), 5, `fill="${colors.teal}" stroke="#ffffff" stroke-width="1"`); });
    for (let step = 0; step <= n; step++) {
      svg += text(x(step), 203, step, 'text-anchor="middle" font-size="12"');
    }
    svg += text((chart.left + chart.right) / 2, 234, 'Number of added tau anyons, k', 'text-anchor="middle" font-size="12"');
    svg += text(width - 17, y(config.charge) - 17, `${result.sectorDimension} states`, 'text-anchor="end" font-size="12"');
    svg += text(width - 17, y(config.charge) + 4, config.charge === 'vacuum' ? 'total 1' : 'total tau', 'text-anchor="end" font-size="12"');
    const target = $('fusion-path-svg');
    target.setAttribute('viewBox', `0 0 ${width} 250`);
    target.style.minWidth = n >= 12 ? `${width}px` : '';
    target.innerHTML = svg;
    target.setAttribute('aria-label', `Path ${config.pathIndex + 1} of ${result.sectorDimension}; cumulative charges: vacuum, ${result.selectedPath.join(', ')}.`);
    const chargeTex = charge => charge === 'vacuum' ? '1' : String.raw`\tau`;
    const tuple = (start, end) => {
      if (end - start === 1) return String.raw`c_{${end}}=${chargeTex(result.selectedPath[start])}`;
      const indices = end - start <= 3 ? Array.from({ length: end - start }, (_, index) => `c_{${start + index + 1}}`).join(',') : String.raw`c_{${start + 1}},\ldots,c_{${end}}`;
      return String.raw`(${indices})=\bigl(${result.selectedPath.slice(start, end).map(chargeTex).join(',')}\bigr)`;
    };
    const pathTex = n <= 8 ? String.raw`c_0=1,\quad ${tuple(0, n)}` : String.raw`\begin{aligned}c_0&=1\\${tuple(0, 8).replace('=', '&=')}\\${tuple(8, n).replace('=', '&=')}\end{aligned}`;
    setMath('fusion-path-formula', pathTex);
    $('fusion-path-position').textContent = `Path ${config.pathIndex + 1} of ${result.sectorDimension} in the ${config.charge === 'vacuum' ? 'vacuum' : 'tau'} sector`;
    $('fusion-path-prev').disabled = config.pathIndex === 0;
    $('fusion-path-next').disabled = config.pathIndex >= result.sectorDimension - 1;
  }

  function renderFusion() {
    const n = state.fusion.number, result = fusionResults();
    setControl('fusion-number', n);
    setControl('fusion-charge', state.fusion.charge);
    $('fusion-number-value').textContent = n;
    $('fusion-vacuum').textContent = result.vacuum.toLocaleString('en-US');
    $('fusion-tau').textContent = result.tau.toLocaleString('en-US');
    $('fusion-add').disabled = n >= 16;
    const chart = { left: 76, right: 682, top: 50, bottom: 294 };
    const maxValue = Math.max(2, result.tau);
    // A shared linear scale makes the two final-charge sectors comparable.
    const roughStep = maxValue / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const tickStep = Math.max(1, [1, 2, 5, 10].find(step => step * magnitude >= roughStep) * magnitude);
    const yMax = Math.ceil(maxValue / tickStep) * tickStep;
    const y = count => chart.bottom - count / yMax * (chart.bottom - chart.top);
    let svg = svgFrame(`Fusion space dimensions for one through ${n} Fibonacci anyons`);
    for (let tick = 0; tick <= yMax + tickStep / 2; tick += tickStep) {
      svg += line(chart.left, y(tick), chart.right, y(tick));
      svg += text(chart.left - 13, y(tick) + 4, tick.toLocaleString('en-US'), 'text-anchor="end" font-size="11"');
    }
    const groupWidth = (chart.right - chart.left) / n;
    const barWidth = Math.min(23, groupWidth * 0.29);
    for (let count = 1; count <= n; count++) {
      const values = physics.fibonacciCounts(count);
      const center = chart.left + (count - 0.5) * groupWidth;
      for (const [value, shift, color, sector] of [[values.vacuum, -barWidth - 1.5, colors.coral, '1'], [values.tau, 1.5, colors.teal, 'τ']]) {
        svg += `<rect x="${center + shift}" y="${y(value)}" width="${barWidth}" height="${chart.bottom - y(value)}" rx="1.5" fill="${color}" opacity="${count === n ? 1 : 0.58}"><title>${count} anyons, total charge ${sector}: ${value} fusion states</title></rect>`;
      }
      svg += text(center, chart.bottom + 24, count, `text-anchor="middle" font-size="11" ${count === n ? 'fill="#243b3d" font-weight="700"' : ''}`);
    }
    svg += text(22, 174, 'Fusion-space dimension', 'text-anchor="middle" transform="rotate(-90 22 174)" font-size="12"');
    svg += text(378, 352, 'Number of τ anyons, n', 'text-anchor="middle" font-size="12"');
    svg += text(679, 27, 'Linear scale; separate total-charge sectors', 'text-anchor="end" font-size="9" letter-spacing="1"');
    $('fusion-svg').innerHTML = svg;
    renderFusionPath(result);
    const chargeTex = state.fusion.charge === 'vacuum' ? '1' : String.raw`\tau`;
    setText('fusion-notice', String.raw`For \(n=${n}\) anyons with fixed total charge \(${chargeTex}\), the fusion space has ${result.sectorDimension.toLocaleString('en-US')} independent basis states. The highlighted path labels one of these states; it is not a trajectory or a sequence of measured fusion outcomes. Each \(c_k\) is the cumulative charge after adding \(k\) anyons.`);
  }

  const lattice = { x: 139, y: 37, cell: 58, columns: 7, rows: 5 };
  function toricBounds() {
    const sizes = { small: { left: 3, right: 4, top: 2, bottom: 3 }, medium: { left: 2, right: 5, top: 1, bottom: 4 }, large: { left: 1, right: 6, top: 1, bottom: 4 } };
    const size = sizes[state.toric.size];
    return { left: lattice.x + size.left * lattice.cell, right: lattice.x + size.right * lattice.cell, top: lattice.y + size.top * lattice.cell, bottom: lattice.y + size.bottom * lattice.cell };
  }

  function toricResults() {
    const bounds = toricBounds();
    const polygon = [{ x: bounds.left, y: bounds.top }, { x: bounds.right, y: bounds.top }, { x: bounds.right, y: bounds.bottom }, { x: bounds.left, y: bounds.bottom }];
    const inside = state.toric.defects.filter(key => {
      const [column, row] = key.split(',').map(Number);
      const point = { x: lattice.x + (column + 0.5) * lattice.cell, y: lattice.y + (row + 0.5) * lattice.cell };
      return physics.windingNumber(point, polygon) !== 0;
    }).length;
    return { inside, outside: state.toric.defects.length - inside, ...physics.toricPhase(inside, state.toric.windings), stringConvention: 'Each listed dual edge applies X on the shared lattice edge; m occupations are the reference occupations toggled by string endpoints.' };
  }

  function loopPoint(bounds, progress) {
    const width = bounds.right - bounds.left, height = bounds.bottom - bounds.top;
    const length = 2 * (width + height);
    // Top left -> bottom left -> bottom right -> top right is CCW in the plane.
    let distance = (progress % 1) * length;
    if (distance <= height) return { x: bounds.left, y: bounds.top + distance };
    distance -= height;
    if (distance <= width) return { x: bounds.left + distance, y: bounds.bottom };
    distance -= width;
    if (distance <= height) return { x: bounds.right, y: bounds.bottom - distance };
    return { x: bounds.right - (distance - height), y: bounds.top };
  }

  function toricDiagram() {
    const config = state.toric, bounds = toricBounds();
    const focusedCell = document.activeElement && document.activeElement.getAttribute('data-cell');
    const center = key => {
      const [column, row] = key.split(',').map(Number);
      return { x: lattice.x + (column + 0.5) * lattice.cell, y: lattice.y + (row + 0.5) * lattice.cell };
    };
    let svg = svgFrame('Toric-code plaquette excitations, dual X strings, and a contractible direct-lattice e loop');
    for (let column = 0; column <= lattice.columns; column++) svg += line(lattice.x + column * lattice.cell, lattice.y, lattice.x + column * lattice.cell, lattice.y + lattice.rows * lattice.cell);
    for (let row = 0; row <= lattice.rows; row++) svg += line(lattice.x, lattice.y + row * lattice.cell, lattice.x + lattice.columns * lattice.cell, lattice.y + row * lattice.cell);
    for (const [from, to] of config.edges) {
      const a = center(from), b = center(to);
      svg += line(a.x, a.y, b.x, b.y, `stroke="${colors.coral}" stroke-width="3" stroke-dasharray="5 4" pointer-events="none"`);
    }
    for (let row = 0; row < lattice.rows; row++) {
      for (let column = 0; column < lattice.columns; column++) {
        const key = `${column},${row}`, occupied = config.defects.includes(key), selected = config.anchor === key;
        const x = lattice.x + column * lattice.cell, y = lattice.y + row * lattice.cell;
        const enclosed = x > bounds.left - 1 && x < bounds.right && y > bounds.top - 1 && y < bounds.bottom;
        const label = `Plaquette column ${column + 1}, row ${row + 1}, ${enclosed ? 'inside' : 'outside'} loop; ${occupied ? 'm present' : 'no m'}${selected ? '; selected starting plaquette' : ''}`;
        svg += `<g role="button" tabindex="0" data-cell="${key}" aria-label="${label}"><rect class="cell-background" x="${x + 2}" y="${y + 2}" width="${lattice.cell - 4}" height="${lattice.cell - 4}" fill="transparent" ${selected ? 'stroke="black" stroke-width="2" stroke-dasharray="4 3"' : ''}/>`;
        if (occupied) {
          svg += circle(x + lattice.cell / 2, y + lattice.cell / 2, 11, `fill="${colors.coral}"`);
          svg += text(x + lattice.cell / 2, y + lattice.cell / 2 + 4, 'm', 'text-anchor="middle" font-family="Georgia,serif" font-size="15" font-style="italic" fill="white"');
        } else svg += circle(x + lattice.cell / 2, y + lattice.cell / 2, 2, 'fill="#999999"');
        svg += '</g>';
      }
    }
    for (let row = 0; row <= lattice.rows; row++) for (let column = 0; column <= lattice.columns; column++) svg += circle(lattice.x + column * lattice.cell, lattice.y + row * lattice.cell, 2, 'fill="#888888" pointer-events="none"');
    svg += `<rect x="${bounds.left}" y="${bounds.top}" width="${bounds.right - bounds.left}" height="${bounds.bottom - bounds.top}" fill="none" stroke="${colors.teal}" stroke-width="3" pointer-events="none"/>`;
    const arrowX = (bounds.left + bounds.right) / 2;
    svg += `<path d="M${arrowX + 5},${bounds.top - 4} L${arrowX - 3},${bounds.top} L${arrowX + 5},${bounds.top + 4}" fill="none" stroke="${colors.teal}" stroke-width="2" pointer-events="none"/>`;
    const particle = loopPoint(bounds, toricProgress * config.windings);
    svg += circle(particle.x, particle.y, 13, `fill="${colors.teal}" stroke="white" stroke-width="3" pointer-events="none"`);
    svg += text(particle.x, particle.y + 4, 'e', 'text-anchor="middle" font-family="Georgia,serif" font-size="15" font-style="italic" fill="white" pointer-events="none"');
    svg += text(342, 359, 'Squares carry m excitations; lattice edges carry the spins', 'text-anchor="middle" font-size="12"');
    $('toric-svg').innerHTML = svg;
    if (focusedCell !== null && focusedCell !== undefined) {
      const replacement = $('toric-svg').querySelector(`[data-cell="${focusedCell}"]`);
      if (replacement) replacement.focus({ preventScroll: true });
    }
  }

  function renderToric() {
    const config = state.toric, result = toricResults();
    setControl('toric-size', config.size);
    setControl('toric-windings', config.windings);
    setControl('toric-action', config.mode);
    $('toric-inside').textContent = result.inside;
    $('toric-outside').textContent = result.outside;
    setMath('toric-phase', result.sign === -1 ? '-1' : '+1');
    setText('toric-parity', String.raw`\((-1)^{${result.inside}\times${config.windings}}=${result.sign}\)`);
    if (config.mode === 'pairs') {
      const oddReference = config.baselineDefects.length % 2 === 1;
      $('toric-mode-note').textContent = 'Select a square and an adjacent square. Their occupations both flip; selecting the same edge twice undoes it. Strings record changes from the reference configuration.' + (oddReference ? ' This reference configuration has an odd displayed count; a partner is assumed outside the patch.' : '');
      $('toric-action-hint').textContent = config.anchor === null ? 'Select a plaquette to begin an edge operation.' : 'Selected a plaquette. Choose a neighboring square that shares an edge, or select the same square to cancel.';
    } else {
      $('toric-mode-note').textContent = 'Each click directly edits one occupation. This is a specified reference configuration, not local creation of a lone excitation; partners may lie outside the patch.';
      $('toric-action-hint').textContent = 'Configuration editor: click a square to toggle its occupation.';
    }
    if (result.inside === 0) setText('toric-notice', String.raw`No \(m\)'s are enclosed, so the loop gives \(+1\). A closed \(X\) string can remain in the drawing even after its endpoints have annihilated. On this patch it does not represent a logical operation around a torus.`);
    else if (config.windings % 2 === 0) setText('toric-notice', String.raw`Each enclosed minus sign occurs an even number of times, so the result is \(+1\). Change to one winding to read the enclosed parity.`);
    else setText('toric-notice', String.raw`The loop encloses ${result.inside} \(m\) excitation${result.inside === 1 ? '' : 's'}. An \(X\) edge that carries an endpoint across the loop flips this parity and the loop sign. Applying an edge entirely inside or entirely outside leaves the sign unchanged.`);
    toricDiagram();
  }

  const renderers = { exchange: renderExchange, interference: renderInterference, braids: renderBraids, fusion: renderFusion, toric: renderToric };
  function render() { renderers[active](); }
  function announce(message) { $('status-message').textContent = message; }

  const figureChoices = {
    exchange: [['exchange-svg', 'Exchange paths and phase']],
    interference: [['interference-svg', 'Interference fringe'], ['interference-phasors', 'Coherent amplitude addition']],
    braids: [['braids-svg', 'Braid sequences'], ['braids-bloch-svg', 'Encoded Pauli expectations']],
    fusion: [['fusion-svg', 'Fusion-space dimensions'], ['fusion-path-svg', 'Selected fusion basis path']],
    toric: [['toric-svg', 'Strings and loop on the lattice']]
  };
  function syncExportChoices() {
    const selector = $('export-figure'), selected = selector.value;
    const options = figureChoices[active].filter(([id]) => id !== 'interference-phasors' || state.interference.visibility === 1);
    const signature = options.map(([id]) => id).join(',');
    if (selector.dataset.options === signature) return;
    selector.replaceChildren();
    for (const [value, label] of options) {
      const option = document.createElement('option'); option.value = value; option.textContent = label; selector.append(option);
    }
    if (options.some(([id]) => id === selected)) selector.value = selected;
    selector.dataset.options = signature;
  }

  function navigate() {
    const hash = window.location.hash.slice(1);
    if (hash === 'main') return;
    active = views.includes(hash) ? hash : 'exchange';
    cancelAnimation();
    document.querySelectorAll('[data-view]').forEach(section => { section.hidden = section.dataset.view !== active; });
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (link.dataset.nav === active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = `${$(`${active}-title`).textContent} — Anyons`;
    render();
    syncExportChoices();
    announce(`Note ${views.indexOf(active) + 1}: ${$(`${active}-title`).textContent}`);
  }

  function reset(view) {
    cancelAnimation();
    state[view] = copy(defaults[view]);
    if (view === 'exchange') { exchangeProgress = 0; $('exchange-progress').textContent = 'Ready to trace the braid'; }
    if (view === 'toric') toricProgress = 0;
    renderers[view]();
    announce('Experiment reset to its starting settings.');
  }

  function listenNumber(id, view, key, eventType = 'input') {
    $(id).addEventListener(eventType, event => {
      cancelAnimation();
      state[view][key] = Number(event.target.value);
      if (view === 'exchange') { exchangeProgress = 0; $('exchange-progress').textContent = 'Ready to trace the braid'; }
      if (view === 'toric') toricProgress = 0;
      renderers[view]();
    });
  }

  listenNumber('exchange-theta', 'exchange', 'thetaPi');
  listenNumber('exchange-direction', 'exchange', 'direction', 'change');
  $('exchange-deformation').addEventListener('input', event => {
    cancelAnimation(); state.exchange.deformation = Number(event.target.value); renderExchange();
  });
  $('exchange-scrub').addEventListener('input', event => {
    cancelAnimation(); exchangeProgress = Number(event.target.value);
    $('exchange-progress').textContent = exchangeProgress === 1 ? 'Completed braid' : 'Schematic motion; the phase readout describes the completed braid';
    exchangeDiagram();
  });
  document.querySelectorAll('[data-theta]').forEach(button => button.addEventListener('click', () => {
    cancelAnimation(); state.exchange.thetaPi = Number(button.dataset.theta); exchangeProgress = 0;
    $('exchange-progress').textContent = 'Ready to trace the braid'; renderExchange();
  }));
  document.querySelectorAll('[name="exchange-path"]').forEach(input => input.addEventListener('change', () => {
    cancelAnimation(); state.exchange.exchanges = Number(input.value); exchangeProgress = 0;
    $('exchange-progress').textContent = 'Ready to trace the braid'; renderExchange();
  }));
  document.querySelectorAll('[data-exchange-example]').forEach(button => button.addEventListener('click', () => {
    cancelAnimation(); state.exchange = copy(defaults.exchange);
    state.exchange.exchanges = { exchange: 1, winding: 2, undo: 0 }[button.dataset.exchangeExample];
    exchangeProgress = 0; $('exchange-progress').textContent = 'Ready to trace the braid'; renderExchange();
  }));
  $('exchange-play').addEventListener('click', () => {
    $('exchange-progress').textContent = 'Tracing the path…';
    const duration = (state.exchange.exchanges === 1 ? 1 : 2) * 1900;
    animate('exchange', duration, progress => { exchangeProgress = progress; exchangeDiagram(); }, () => {
      $('exchange-progress').textContent = 'Completed braid'; announce('Braid completed. The multiplier is the final statistical phase.');
    });
  });

  for (const [id, key] of [['theta', 'thetaPi'], ['enclosed', 'enclosed'], ['winding', 'winding'], ['reference', 'referencePi'], ['visibility', 'visibility']]) listenNumber(`interference-${id}`, 'interference', key);
  document.querySelectorAll('[data-interference-example]').forEach(button => button.addEventListener('click', () => {
    cancelAnimation(); state.interference = copy(defaults.interference);
    if (button.dataset.interferenceExample === 'two') state.interference.enclosed = 2;
    if (button.dataset.interferenceExample === 'laughlin') state.interference.thetaPi = 1 / 3;
    if (button.dataset.interferenceExample === 'incoherent') state.interference.visibility = 0;
    renderInterference();
  }));
  $('interference-play').addEventListener('click', () => {
    animate('interference', 5000, progress => { state.interference.referencePi = 2 * progress; renderInterference(); }, () => announce('Reference phase sweep completed.'));
  });

  $('braids-initial').addEventListener('change', event => { state.braids.initial = event.target.value; renderBraids(); });
  $('braids-measurement').addEventListener('change', event => { state.braids.measurement = event.target.value; renderBraids(); });
  listenNumber('braids-direction', 'braids', 'direction');
  document.querySelectorAll('[data-braid]').forEach(button => button.addEventListener('click', () => {
    if (state.braids.word.length < 8) { state.braids.word.push(Number(button.dataset.braid) * state.braids.direction); renderBraids(); }
  }));
  $('braids-undo').addEventListener('click', () => { state.braids.word.pop(); renderBraids(); });
  const braidExamples = {
    order: { initial: 'plus', direction: 1, measurement: 'z', word: [1, 2] },
    hidden: { initial: 'vacuum', direction: 1, measurement: 'z', word: [1, 2] },
    undo: { initial: 'plus', direction: 1, measurement: 'z', word: [1, -1] }
  };
  document.querySelectorAll('[data-braid-example]').forEach(button => button.addEventListener('click', () => {
    state.braids = copy(braidExamples[button.dataset.braidExample]);
    renderBraids();
    announce('Braid example loaded.');
  }));
  $('fusion-number').addEventListener('input', event => { state.fusion.number = Number(event.target.value); state.fusion.pathIndex = 0; renderFusion(); });
  $('fusion-charge').addEventListener('change', event => { state.fusion.charge = event.target.value; state.fusion.pathIndex = 0; renderFusion(); });
  $('fusion-add').addEventListener('click', () => { if (state.fusion.number < 16) state.fusion.number++; state.fusion.pathIndex = 0; renderFusion(); });
  $('fusion-path-prev').addEventListener('click', () => { if (state.fusion.pathIndex > 0) state.fusion.pathIndex--; renderFusion(); });
  $('fusion-path-next').addEventListener('click', () => {
    const dimension = physics.fibonacciCounts(state.fusion.number)[state.fusion.charge];
    if (state.fusion.pathIndex < dimension - 1) state.fusion.pathIndex++;
    renderFusion();
  });
  const fusionExamples = {
    'four-vacuum': { number: 4, charge: 'vacuum', pathIndex: 0 },
    'four-tau': { number: 4, charge: 'tau', pathIndex: 0 },
    growth: { number: 12, charge: 'vacuum', pathIndex: 0 }
  };
  document.querySelectorAll('[data-fusion-example]').forEach(button => button.addEventListener('click', () => {
    state.fusion = copy(fusionExamples[button.dataset.fusionExample]);
    renderFusion();
    announce('Fusion example loaded.');
  }));

  $('toric-size').addEventListener('change', event => { cancelAnimation(); state.toric.size = event.target.value; toricProgress = 0; renderToric(); });
  listenNumber('toric-windings', 'toric', 'windings');
  $('toric-action').addEventListener('change', event => {
    cancelAnimation();
    state.toric.mode = event.target.value;
    state.toric.anchor = null;
    if (state.toric.mode === 'configuration') {
      // Occupation editing starts a new reference configuration, with no
      // claim about which physical string prepared it.
      state.toric.baselineDefects = state.toric.defects.slice();
      state.toric.edges = [];
    }
    renderToric();
  });
  function toggleCell(target) {
    const cell = target.closest('[data-cell]');
    if (!cell) return;
    cancelAnimation();
    const config = state.toric, key = cell.dataset.cell;
    if (config.mode === 'configuration') {
      config.defects = config.defects.includes(key) ? config.defects.filter(value => value !== key) : config.defects.concat(key);
      config.baselineDefects = config.defects.slice();
      config.edges = [];
    } else if (config.anchor === null) {
      config.anchor = key;
    } else if (config.anchor === key) {
      config.anchor = null;
    } else {
      const [ax, ay] = config.anchor.split(',').map(Number), [bx, by] = key.split(',').map(Number);
      if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) {
        $('toric-action-hint').textContent = 'Those squares do not share an edge. Choose a nearest neighbor of the highlighted square.';
        return;
      }
      const changed = physics.toricStringStep(config.edges, config.anchor, key);
      config.edges = changed.edges;
      const defects = new Set(config.baselineDefects);
      for (const defect of changed.defects) {
        if (defects.has(defect)) defects.delete(defect); else defects.add(defect);
      }
      config.defects = Array.from(defects).sort();
      config.anchor = null;
    }
    renderToric();
    const result = toricResults();
    announce(`${result.inside} m excitations inside; ${result.outside} outside. Loop multiplier ${result.sign === 1 ? 'plus one' : 'minus one'}.`);
  }
  $('toric-svg').addEventListener('click', event => toggleCell(event.target));
  $('toric-svg').addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCell(event.target); }
  });
  function clearToric() {
    cancelAnimation();
    Object.assign(state.toric, { defects: [], baselineDefects: [], edges: [], anchor: null });
    toricProgress = 0;
  }
  $('toric-clear').addEventListener('click', () => { clearToric(); renderToric(); announce('Reset to the reference state without displayed m excitations.'); });
  document.querySelectorAll('[data-toric-example]').forEach(button => button.addEventListener('click', () => {
    state.toric = copy(defaults.toric);
    clearToric();
    if (button.dataset.toricExample === 'straddle') state.toric = copy(defaults.toric);
    if (button.dataset.toricExample === 'closed') {
      state.toric.edges = [['1,1', '2,1'], ['2,1', '2,2'], ['2,2', '1,2'], ['1,2', '1,1']];
    }
    renderToric();
    announce('Toric-code example loaded.');
  }));
  $('toric-play').addEventListener('click', () => animate('toric', 2800 * state.toric.windings, progress => { toricProgress = progress; toricDiagram(); }, () => announce('Loop completed.')));

  document.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => reset(button.dataset.reset)));
  window.addEventListener('hashchange', navigate);
  document.addEventListener('visibilitychange', () => { if (document.hidden && animationView) cancelAnimation(); });
  reduceMotion.addEventListener('change', () => { if (animationView) cancelAnimation(); });

  let downloadUrl = null;
  function saveBlob(contents, type, filename) {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([contents], { type }));
    const link = $('export-download');
    link.href = downloadUrl;
    link.download = filename;
    link.textContent = filename;
    $('export-ready').hidden = false;
    link.click();
    announce(`${filename} prepared. The download link remains available below.`);
  }

  $('export-svg').addEventListener('click', () => {
    const figureId = $('export-figure').value;
    const svg = $(figureId).cloneNode(true);
    const [, , width, height] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.removeAttribute('class');
    svg.removeAttribute('style');
    svg.querySelectorAll('[role="button"]').forEach(element => { element.removeAttribute('tabindex'); element.removeAttribute('role'); });
    const serialized = new XMLSerializer().serializeToString(svg);
    saveBlob(`<?xml version="1.0" encoding="UTF-8"?>\n${serialized}`, 'image/svg+xml;charset=utf-8', `anyons-${figureId.replace(/-svg$/, '')}.svg`);
  });

  $('export-json').addEventListener('click', () => {
    const modelNames = { exchange: 'Abelian exchange', interference: 'Balanced two-path interference', braids: 'Four Ising sigma anyons, total charge vacuum', fusion: 'Fibonacci fusion dimensions', toric: 'Toric-code mutual e/m winding' };
    const results = {
      exchange: exchangeResult,
      interference: interferenceResult,
      braids: braidResults,
      fusion: fusionResults,
      toric: toricResults
    };
    const exportData = { schemaVersion: 2, model: modelNames[active], experiment: active, parameters: copy(state[active]), conventions: { angleUnits: 'Radians in results; parameters ending in Pi are multiples of pi.', complexNumbers: '[real, imaginary]', braidOrder: 'Chronological; positive generators are counterclockwise.', outputs: 'Ideal model results; animations are schematic.' }, results: results[active]() };
    if (active === 'exchange') exportData.diagramProgress = exchangeProgress;
    if (active === 'toric') exportData.diagramProgress = toricProgress;
    saveBlob(JSON.stringify(exportData, null, 2) + '\n', 'application/json;charset=utf-8', `anyons-${active}.json`);
  });

  typeset(document.body);
  navigate();
})();
