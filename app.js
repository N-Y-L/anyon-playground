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

  const colors = { ink: '#000000', muted: '#555555', grid: '#dddddd', teal: '#147a70', coral: '#c36b51', paper: '#ffffff', faint: '#888888' };
  const defaults = {
    exchange: { thetaPi: 0.5, exchanges: 1 },
    interference: { thetaPi: 0.5, enclosed: 1, winding: 1, referencePi: 0, visibility: 1 },
    braids: { initial: 'plus', direction: 1, word: [1, 2] },
    fusion: { number: 8 },
    toric: { size: 'medium', windings: 1, defects: ['3,2', '0,0'] }
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


  function exchangeDiagram() {
    const config = state.exchange;
    const result = physics.abelianPhase(config.thetaPi * Math.PI, config.exchanges);
    const center = { x: 256, y: 191 }, rx = 157, ry = 101;
    const totalRotation = config.exchanges * Math.PI * exchangeProgress;
    function point(angle) { return { x: center.x + rx * Math.cos(angle), y: center.y - ry * Math.sin(angle) }; }
    function arc(start) {
      const samples = Math.max(2, Math.ceil(100 * exchangeProgress));
      return Array.from({ length: samples + 1 }, (_, index) => {
        const position = point(start + totalRotation * index / samples);
        return `${index ? 'L' : 'M'}${position.x.toFixed(2)},${position.y.toFixed(2)}`;
      }).join(' ');
    }
    let svg = svgFrame('Counterclockwise exchange paths and the completed braid phase on the complex unit circle');
    svg += `<defs><marker id="phase-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="${colors.teal}"/></marker></defs>`;
    svg += text(256, 51, 'COUNTERCLOCKWISE', 'text-anchor="middle" font-size="10" letter-spacing="1.8"');
    svg += `<ellipse cx="256" cy="191" rx="157" ry="101" fill="none" stroke="${colors.grid}" stroke-width="1.5" stroke-dasharray="5 7"/>`;
    svg += line(234, 191, 278, 191, 'stroke-dasharray="3 5"') + line(256, 169, 256, 213, 'stroke-dasharray="3 5"');
    svg += text(256, 234, config.exchanges === 1 ? 'half turn' : 'full turn', 'text-anchor="middle" font-size="11" font-style="italic"');
    if (exchangeProgress > 0) {
      svg += `<path d="${arc(Math.PI)}" fill="none" stroke="${colors.teal}" stroke-width="2.5" opacity="0.55"/>`;
      svg += `<path d="${arc(0)}" fill="none" stroke="${colors.coral}" stroke-width="2.5" opacity="0.65" ${config.exchanges === 2 && exchangeProgress > 0.5 ? 'stroke-dasharray="6 5"' : ''}/>`;
    }
    const first = point(Math.PI + totalRotation), second = point(totalRotation);
    for (const [position, color, label] of [[first, colors.teal, '1'], [second, colors.coral, '2']]) {
      svg += circle(position.x, position.y, 22, `fill="${color}" opacity="0.08"`);
      svg += circle(position.x, position.y, 12, `fill="${color}" stroke="${colors.paper}" stroke-width="3"`);
      svg += text(position.x, position.y + 4, label, 'text-anchor="middle" fill="#ffffff" font-size="10" font-weight="600"');
    }
    // A direction arrow lies below the right-hand side of the orbital path.
    svg += `<path d="M365,266 Q394,247 405,222" fill="none" stroke="${colors.faint}" stroke-width="1"/><path d="M399,227 L406,219 L408,230" fill="none" stroke="${colors.faint}" stroke-width="1"/>`;
    svg += line(466, 80, 466, 307);
    svg += text(581, 93, 'COMPLETED BRAID', 'text-anchor="middle" font-size="9" letter-spacing="1.2"');
    svg += circle(581, 191, 55, `fill="none" stroke="${colors.grid}" stroke-width="1.5"`);
    svg += line(511, 191, 651, 191) + line(581, 121, 581, 261);
    svg += text(654, 195, 'Re', 'font-size="10"') + text(589, 126, 'Im', 'font-size="10"');
    svg += circle(581, 191, 2, `fill="${colors.faint}"`);
    const endpoint = { x: 581 + 55 * result.phase[0], y: 191 - 55 * result.phase[1] };
    svg += `<path d="M581,191 L${endpoint.x},${endpoint.y}" fill="none" stroke="${colors.teal}" stroke-width="2" marker-end="url(#phase-arrow)"/>`;
    svg += circle(endpoint.x, endpoint.y, 4, `fill="${colors.teal}"`);
    svg += text(581, 289, complexLabel(result.phase), 'text-anchor="middle" font-family="Georgia, serif" font-size="21" fill="#147a70"');
    svg += text(256, 348, 'POSITION IN THE PLANE · SCHEMATIC', 'text-anchor="middle" font-size="9" letter-spacing="1.2"');
    svg += text(581, 348, 'COMPLEX UNIT CIRCLE', 'text-anchor="middle" font-size="9" letter-spacing="1.2"');
    $('exchange-svg').innerHTML = svg;
  }

  function renderExchange() {
    const config = state.exchange;
    const result = physics.abelianPhase(config.thetaPi * Math.PI, config.exchanges);
    setControl('exchange-theta', config.thetaPi);
    setMath('exchange-theta-value', `${texNumber(config.thetaPi)}\\pi`);
    document.querySelectorAll('[name="exchange-path"]').forEach(input => { input.checked = Number(input.value) === config.exchanges; });
    document.querySelectorAll('[data-theta]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.theta) === config.thetaPi)));
    $('exchange-operation-label').textContent = config.exchanges === 1 ? 'ONE EXCHANGE' : 'ONE FULL WINDING';
    $('exchange-play').textContent = config.exchanges === 1 ? 'Run exchange' : 'Run winding';
    setMath('exchange-phase', complexLabel(result.phase).replaceAll('−', '-'));
    $('exchange-phase').style.fontSize = complexLabel(result.phase).length > 7 ? '25px' : '';
    setText('exchange-angle', String.raw`Completed angle: \(${texAngle(result.angle)}\)`);
    let notice;
    if (config.thetaPi === 0.5) notice = String.raw`A semion acquires \(i\) after one exchange and \(-1\) after a full winding. Those are different operations.`;
    else if (config.thetaPi === 1) notice = String.raw`A fermion acquires \(-1\) after one exchange, but \(+1\) after a full winding. Exchanging twice is different from exchanging once.`;
    else if (config.thetaPi === 0 || config.thetaPi === 2) notice = String.raw`This exchange angle gives bosonic statistics: both an exchange and a full winding leave the statistical phase factor at \(+1\).`;
    else notice = String.raw`At \(\theta = ${texNumber(config.thetaPi)}\pi\), one exchange gives \(e^{i\theta}\) and a full winding gives \(e^{2i\theta}\). The same endpoint positions can hide different winding histories.`;
    setText('exchange-notice', notice);
    exchangeDiagram();
  }

  function interferenceResult(config = state.interference, referencePi = config.referencePi) {
    return physics.interference({ theta: config.thetaPi * Math.PI, enclosed: config.enclosed, winding: config.winding, referencePhase: referencePi * Math.PI, visibility: config.visibility });
  }

  function renderInterference() {
    const config = state.interference, result = interferenceResult();
    for (const [id, key] of [['theta', 'thetaPi'], ['enclosed', 'enclosed'], ['winding', 'winding'], ['reference', 'referencePi'], ['visibility', 'visibility']]) setControl(`interference-${id}`, config[key]);
    setMath('interference-theta-value', `${texNumber(config.thetaPi)}\\pi`);
    setMath('interference-reference-value', `${texNumber(config.referencePi)}\\pi`);
    $('interference-visibility-value').textContent = number(config.visibility);
    $('interference-probability').textContent = percent(result.p0);
    setText('interference-shift', String.raw`Statistical phase: \(${texAngle(result.statisticalPhase)}\)`);
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
    svg += text(674, 38, `δ = ${piAngle(result.statisticalPhase)}`, 'text-anchor="end" font-family="Georgia, serif" font-size="16" fill="#147a70"');
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
    if (config.visibility === 0) $('interference-notice').textContent = 'At zero visibility the curve is flat: every reference phase gives 50%. The model still assigns a statistical phase, but this readout cannot reveal it.';
    else if (config.enclosed === 0) $('interference-notice').textContent = 'With no enclosed anyons, the statistical contribution is zero. The two curves coincide; varying the reference phase still produces interference.';
    else if (Math.abs(Math.cos(result.statisticalPhase) - 1) < 1e-8) setText('interference-notice', String.raw`The statistical phase is a whole multiple of \(2\pi\), so these fringes coincide. A nonzero accumulated angle can have exactly the same phase multiplier as zero.`);
    else $('interference-notice').textContent = 'The enclosed anyons shift the fringe; visibility changes its contrast. One enclosed semion shifts it by half a cycle, and a second restores the original fringe.';
  }

  // SVG labels use plain operation names; the sequence readout is LaTeX.
  function braidLabel(generator) { return `B${Math.abs(generator)}${generator < 0 ? ' inverse' : ''}`; }
  function braidTex(generator) { return `B_{${Math.abs(generator)}}${generator < 0 ? '^{-1}' : ''}`; }
  function braidWordLabel(word) { return word.length ? word.map(braidLabel).join(' → ') : 'Identity · no exchanges'; }

  function braidPane(word, left, accent, paneLabel) {
    const positions = [left, left + 48, left + 96, left + 144];
    const start = 81, end = 268;
    const height = (end - start) / Math.max(1, word.length);
    let svg = text(left + 72, 33, paneLabel, 'text-anchor="middle" font-size="10" letter-spacing="1.2"');
    svg += text(left + 72, 52, word.length <= 4 ? braidWordLabel(word) : `${word.length} exchanges`, `text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${accent}"`);
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
    svg += text(left + 72, 302, 'measure the first pair', 'text-anchor="middle" font-size="10"');
    return svg;
  }

  function braidResults() {
    const config = state.braids;
    const finalA = physics.applyBraidWord(config.word, config.initial);
    const finalB = physics.applyBraidWord(config.word.slice().reverse(), config.initial);
    return { finalA, finalB, probabilitiesA: physics.probabilities(finalA), probabilitiesB: physics.probabilities(finalB), fidelity: physics.fidelity(finalA, finalB), blochA: physics.bloch(finalA), blochB: physics.bloch(finalB) };
  }

  function renderBraids() {
    const config = state.braids, result = braidResults();
    setControl('braids-initial', config.initial);
    setControl('braids-direction', config.direction);
    if (config.word.length) setMath('braids-word', config.word.map(braidTex).join(String.raw`\to `));
    else $('braids-word').textContent = 'Identity · no exchanges';
    const initialTex = {
      plus: String.raw`|+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}`,
      vacuum: String.raw`|0\rangle`,
      fermion: String.raw`|1\rangle`
    };
    setMath('braids-initial-formula', initialTex[config.initial]);
    $('braids-capacity').textContent = `${config.word.length} of 8 exchanges${config.word.length === 8 ? ' · remove one to add another' : ''}`;
    document.querySelectorAll('[data-braid]').forEach(button => { button.disabled = config.word.length >= 8; });
    $('braids-undo').disabled = config.word.length === 0;
    $('braids-probability-a').textContent = percent(result.probabilitiesA[0]);
    $('braids-probability-b').textContent = percent(result.probabilitiesB[0]);
    $('braids-bar-a').style.width = `${100 * result.probabilitiesA[0]}%`;
    $('braids-bar-b').style.width = `${100 * result.probabilitiesB[0]}%`;
    setText('braids-other-a', String.raw`\(\psi\) channel: ${percent(result.probabilitiesA[1])}`);
    setText('braids-other-b', String.raw`\(\psi\) channel: ${percent(result.probabilitiesB[1])}`);
    $('braids-fidelity').textContent = number(result.fidelity, 3);
    let svg = '<title>Chronological braid sequences for four Ising anyons; time increases downward</title><rect width="720" height="330" fill="#ffffff"/>';
    svg += line(360, 29, 360, 299);
    svg += line(32, 96, 32, 243, 'stroke="#a7b3a6"');
    svg += '<path d="M28,237 L32,245 L36,237" fill="none" stroke="#a7b3a6"/>';
    svg += text(22, 174, 'time', 'text-anchor="middle" font-size="9" transform="rotate(-90 22 174)"');
    svg += braidPane(config.word, 86, colors.teal, 'SEQUENCE A');
    svg += braidPane(config.word.slice().reverse(), 434, colors.coral, 'REVERSED ORDER');
    $('braids-svg').innerHTML = svg;
    if (result.fidelity > 1 - 1e-8) $('braids-notice').textContent = 'For this sequence and preparation, the two orders give the same state up to a global phase. Non-Abelian statistics means some braid operations do not commute; it does not require every comparison to differ.';
    else if (Math.abs(result.probabilitiesA[0] - result.probabilitiesB[0]) < 1e-8) $('braids-notice').textContent = 'These fusion probabilities agree, but the state overlap is below 1: the states differ. One measurement basis does not reveal every difference between quantum states.';
    else setText('braids-notice', String.raw`Changing the order changes the fusion probabilities for this preparation. Try \(|0\rangle\) with \(B_1\to B_2\): the probabilities can agree even when the quantum states differ.`);
  }

  function renderFusion() {
    const n = state.fusion.number, result = physics.fibonacciCounts(n);
    setControl('fusion-number', n);
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
    svg += text(679, 27, 'LINEAR SCALE · FIXED CHARGE SECTORS', 'text-anchor="end" font-size="9" letter-spacing="1"');
    $('fusion-svg').innerHTML = svg;
    const previous = physics.fibonacciCounts(n - 1);
    setText('fusion-notice', String.raw`At \(n = ${n}\), the vacuum sector has ${result.vacuum.toLocaleString('en-US')} states and the \(\tau\) sector has ${result.tau.toLocaleString('en-US')}. The latter count is \(${previous.vacuum}+${previous.tau}\), the sum of the previous two sector counts.`);
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
    return { inside, outside: state.toric.defects.length - inside, ...physics.toricPhase(inside, state.toric.windings) };
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
    const bounds = toricBounds();
    const focusedCell = document.activeElement && document.activeElement.getAttribute('data-cell');
    let svg = svgFrame('Toric-code patch with a closed e path and clickable m excitations');
    for (let row = 0; row < lattice.rows; row++) {
      for (let column = 0; column < lattice.columns; column++) {
        const key = `${column},${row}`, occupied = state.toric.defects.includes(key);
        const x = lattice.x + column * lattice.cell, y = lattice.y + row * lattice.cell;
        const enclosed = x > bounds.left - 1 && x < bounds.right && y > bounds.top - 1 && y < bounds.bottom;
        svg += `<g role="button" tabindex="0" data-cell="${key}" aria-pressed="${occupied}" aria-label="Plaquette column ${column + 1}, row ${row + 1}, ${enclosed ? 'inside' : 'outside'} loop; ${occupied ? 'remove' : 'add'} m excitation"><rect class="cell-background" x="${x + 2}" y="${y + 2}" width="${lattice.cell - 4}" height="${lattice.cell - 4}" fill="${colors.paper}"/>`;
        if (occupied) {
          svg += circle(x + lattice.cell / 2, y + lattice.cell / 2, 15, `fill="${colors.coral}" opacity="0.13"`);
          svg += circle(x + lattice.cell / 2, y + lattice.cell / 2, 10, `fill="${colors.coral}"`);
          svg += text(x + lattice.cell / 2, y + lattice.cell / 2 + 4, 'm', 'text-anchor="middle" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#fff"');
        } else svg += circle(x + lattice.cell / 2, y + lattice.cell / 2, 1.2, 'fill="#d9dfd4"');
        svg += '</g>';
      }
    }
    for (let column = 0; column <= lattice.columns; column++) svg += line(lattice.x + column * lattice.cell, lattice.y, lattice.x + column * lattice.cell, lattice.y + lattice.rows * lattice.cell, 'pointer-events="none"');
    for (let row = 0; row <= lattice.rows; row++) svg += line(lattice.x, lattice.y + row * lattice.cell, lattice.x + lattice.columns * lattice.cell, lattice.y + row * lattice.cell, 'pointer-events="none"');
    for (let row = 0; row <= lattice.rows; row++) for (let column = 0; column <= lattice.columns; column++) svg += circle(lattice.x + column * lattice.cell, lattice.y + row * lattice.cell, 2.1, 'fill="#c3cdbf" pointer-events="none"');
    svg += `<rect x="${bounds.left}" y="${bounds.top}" width="${bounds.right - bounds.left}" height="${bounds.bottom - bounds.top}" rx="0" fill="none" stroke="${colors.teal}" stroke-width="3" pointer-events="none"/>`;
    const arrowX = (bounds.left + bounds.right) / 2;
    svg += `<path d="M${arrowX + 5},${bounds.top - 4} L${arrowX - 3},${bounds.top} L${arrowX + 5},${bounds.top + 4}" fill="none" stroke="${colors.teal}" stroke-width="2" pointer-events="none"/>`;
    const particle = loopPoint(bounds, toricProgress * state.toric.windings);
    svg += circle(particle.x, particle.y, 13, `fill="${colors.teal}" stroke="${colors.paper}" stroke-width="3" pointer-events="none"`);
    svg += text(particle.x, particle.y + 4, 'e', 'text-anchor="middle" font-family="Georgia, serif" font-size="14" font-style="italic" fill="#fff" pointer-events="none"');
    svg += text(342, 358, 'A LOCAL PATCH · PARTNER EXCITATIONS MAY LIE OUTSIDE', 'text-anchor="middle" font-size="9" letter-spacing="0.8"');
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
    $('toric-inside').textContent = result.inside;
    $('toric-outside').textContent = result.outside;
    setMath('toric-phase', result.sign === -1 ? '-1' : '+1');
    $('toric-parity').textContent = `${result.inside} enclosed × ${config.windings} winding${config.windings === 1 ? '' : 's'} → ${result.sign === -1 ? 'odd' : 'even'} parity`;
    if (result.inside === 0) setText('toric-notice', String.raw`No \(m\) excitations lie inside this loop, so its multiplier is \(+1\). Adding an excitation outside the loop does not change that result.`);
    else if (config.windings % 2 === 0) setText('toric-notice', String.raw`Every minus sign occurs an even number of times, so this completed braid gives \(+1\) regardless of the enclosed count. Set an odd winding count to reveal its parity.`);
    else setText('toric-notice', String.raw`Each enclosed \(m\) contributes a minus sign per winding. An even enclosed count gives \(+1\); an odd count gives \(-1\). Excitations outside the loop do not contribute.`);
    toricDiagram();
  }

  const renderers = { exchange: renderExchange, interference: renderInterference, braids: renderBraids, fusion: renderFusion, toric: renderToric };
  function render() { renderers[active](); }
  function announce(message) { $('status-message').textContent = message; }

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
    announce(`Experiment ${views.indexOf(active) + 1}: ${$(`${active}-title`).textContent}`);
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
  document.querySelectorAll('[data-theta]').forEach(button => button.addEventListener('click', () => {
    cancelAnimation(); state.exchange.thetaPi = Number(button.dataset.theta); exchangeProgress = 0;
    $('exchange-progress').textContent = 'Ready to trace the braid'; renderExchange();
  }));
  document.querySelectorAll('[name="exchange-path"]').forEach(input => input.addEventListener('change', () => {
    cancelAnimation(); state.exchange.exchanges = Number(input.value); exchangeProgress = 0;
    $('exchange-progress').textContent = 'Ready to trace the braid'; renderExchange();
  }));
  $('exchange-play').addEventListener('click', () => {
    $('exchange-progress').textContent = 'Tracing the path…';
    animate('exchange', state.exchange.exchanges * 1900, progress => { exchangeProgress = progress; exchangeDiagram(); }, () => {
      $('exchange-progress').textContent = 'Completed braid'; announce('Braid completed. The displayed multiplier is the final statistical phase.');
    });
  });

  for (const [id, key] of [['theta', 'thetaPi'], ['enclosed', 'enclosed'], ['winding', 'winding'], ['reference', 'referencePi'], ['visibility', 'visibility']]) listenNumber(`interference-${id}`, 'interference', key);
  $('interference-play').addEventListener('click', () => {
    animate('interference', 5000, progress => { state.interference.referencePi = 2 * progress; renderInterference(); }, () => announce('Reference phase sweep completed.'));
  });

  $('braids-initial').addEventListener('change', event => { state.braids.initial = event.target.value; renderBraids(); });
  listenNumber('braids-direction', 'braids', 'direction');
  document.querySelectorAll('[data-braid]').forEach(button => button.addEventListener('click', () => {
    if (state.braids.word.length < 8) { state.braids.word.push(Number(button.dataset.braid) * state.braids.direction); renderBraids(); }
  }));
  $('braids-undo').addEventListener('click', () => { state.braids.word.pop(); renderBraids(); });
  listenNumber('fusion-number', 'fusion', 'number');
  $('fusion-add').addEventListener('click', () => { if (state.fusion.number < 16) state.fusion.number++; renderFusion(); });

  $('toric-size').addEventListener('change', event => { cancelAnimation(); state.toric.size = event.target.value; toricProgress = 0; renderToric(); });
  listenNumber('toric-windings', 'toric', 'windings');
  function toggleCell(target) {
    const cell = target.closest('[data-cell]');
    if (!cell) return;
    cancelAnimation();
    const key = cell.dataset.cell;
    if (state.toric.defects.includes(key)) state.toric.defects = state.toric.defects.filter(value => value !== key);
    else state.toric.defects.push(key);
    renderToric();
    const result = toricResults();
    announce(`${result.inside} m excitations inside; ${result.outside} outside. Loop multiplier ${result.sign === 1 ? 'plus one' : 'minus one'}.`);
  }
  $('toric-svg').addEventListener('click', event => toggleCell(event.target));
  $('toric-svg').addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCell(event.target); }
  });
  $('toric-clear').addEventListener('click', () => { cancelAnimation(); state.toric.defects = []; renderToric(); announce('All displayed m excitations cleared.'); });
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
    const svg = $(`${active}-svg`).cloneNode(true);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '720');
    svg.setAttribute('height', active === 'braids' ? '330' : '380');
    svg.removeAttribute('class');
    svg.querySelectorAll('[role="button"]').forEach(element => { element.removeAttribute('tabindex'); element.removeAttribute('role'); });
    const serialized = new XMLSerializer().serializeToString(svg);
    saveBlob(`<?xml version="1.0" encoding="UTF-8"?>\n${serialized}`, 'image/svg+xml;charset=utf-8', `anyons-${active}.svg`);
  });

  $('export-json').addEventListener('click', () => {
    const modelNames = { exchange: 'Abelian exchange', interference: 'Balanced two-path interference', braids: 'Four Ising sigma anyons, total charge vacuum', fusion: 'Fibonacci fusion dimensions', toric: 'Toric-code mutual e/m winding' };
    const results = {
      exchange: () => physics.abelianPhase(state.exchange.thetaPi * Math.PI, state.exchange.exchanges),
      interference: interferenceResult,
      braids: braidResults,
      fusion: () => physics.fibonacciCounts(state.fusion.number),
      toric: toricResults
    };
    const exportData = { schemaVersion: 1, model: modelNames[active], experiment: active, parameters: copy(state[active]), conventions: { angleUnits: 'Radians in results; parameters ending in Pi are multiples of pi.', complexNumbers: '[real, imaginary]', braidOrder: 'Chronological; positive generators are counterclockwise.', outputs: 'Ideal model results; animations are schematic.' }, results: results[active]() };
    if (active === 'exchange') exportData.diagramProgress = exchangeProgress;
    if (active === 'toric') exportData.diagramProgress = toricProgress;
    saveBlob(JSON.stringify(exportData, null, 2) + '\n', 'application/json;charset=utf-8', `anyons-${active}.json`);
  });

  typeset(document.body);
  navigate();
})();
