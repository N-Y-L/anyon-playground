/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function () {
  'use strict';
  const P = globalThis.FusionBasisPhysics;
  const byId = id => document.getElementById(id);
  if (!P) {
    const message = document.createElement('p');
    message.className = 'error-message';
    message.textContent = 'The calculation module did not load. Keep fusion-basis-physics.js beside this page and reload.';
    byId('main').prepend(message);
    return;
  }
  const colors = ['#145b91', '#a33b2b'];
  const examples = {
    order: { a: [1, 2], b: [2, 1] },
    relation: { a: [1, 2, 1], b: [2, 1, 2] },
    inverse: { a: [2, -2], b: [] }
  };
  let exportUrl = null;
  const number = (value, digits = 4) => (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits);
  const percent = value => number(100 * value, 2) + '%';
  function complex(value, tex = false) {
    const re = Math.abs(value[0]) < 0.00005 ? 0 : value[0];
    const im = Math.abs(value[1]) < 0.00005 ? 0 : value[1];
    if (im === 0) return number(re);
    const sign = im < 0 ? '−' : '+';
    const real = re === 0 ? '' : number(re);
    const formatted = real + (real ? ' ' + sign + ' ' : im < 0 ? '−' : '') + number(Math.abs(im)) + 'i';
    return tex ? formatted.replaceAll('−', '-') : formatted;
  }
  const vector = state => '\\begin{pmatrix}' + state.map(a => complex(a, true)).join('\\\\') + '\\end{pmatrix}';
  function math(id, tex, display = true) {
    const element = byId(id);
    if (globalThis.katex) katex.render(tex, element, { displayMode: display, throwOnError: false });
    else element.textContent = tex;
  }
  function text(x, y, value, options = '') {
    return '<text x="' + x + '" y="' + y + '" ' + options + '>' + value + '</text>';
  }
  function treeMarkup(side, state) {
    const probabilities = P.probabilities(state);
    const isLeft = side === 'L';
    const branch = isLeft ? 108 : 232;
    const root = isLeft ? 184 : 156;
    const pair = isLeft ? [52, 164] : [176, 288];
    const other = isLeft ? 288 : 52;
    let svg = '<rect width="340" height="335" fill="white"/><g font-family="Times New Roman,serif" font-size="20" fill="#000">';
    svg += '<title>' + (isLeft ? 'Left-associated tree: pair 1–2' : 'Right-associated tree: pair 2–3') + '</title>';
    svg += '<desc>Two possible intermediate charges, vacuum 1 and tau, label the basis. Displayed amplitudes and probabilities are for the same prepared physical state.</desc>';
    const xs = isLeft ? [52, 164, 288] : [52, 176, 288];
    xs.forEach((x, i) => { svg += text(x, 19, 'position ' + (i + 1), 'font-size="15" text-anchor="middle"'); svg += text(x, 45, 'τ', 'text-anchor="middle"'); });
    svg += '<g stroke="#222" stroke-width="2" fill="none"><path d="M ' + pair[0] + ' 54 L ' + branch + ' 110 L ' + pair[1] + ' 54 M ' + branch + ' 110 L ' + branch + ' 150 L ' + root + ' 197 L ' + other + ' 54 M ' + root + ' 197 L ' + root + ' 220"/></g>';
    svg += '<circle cx="' + branch + '" cy="110" r="3"/><circle cx="' + root + '" cy="197" r="3"/>';
    svg += text(branch + (isLeft ? -14 : 14), 139, (isLeft ? 'a' : 'b') + ' ∈ {1, τ}', 'font-size="18" text-anchor="' + (isLeft ? 'end' : 'start') + '"');
    svg += text(root, 242, 'total τ', 'text-anchor="middle"');
    svg += text(10, 272, 'channel', 'font-size="16"') + text(102, 272, 'amplitude', 'font-size="16"') + text(325, 272, 'probability', 'font-size="16" text-anchor="end"');
    ['1', 'τ'].forEach((channel, index) => {
      const y = 297 + 27 * index;
      svg += text(25, y, channel, 'fill="' + colors[index] + '"') + text(102, y, complex(state[index]), 'font-size="16"') + text(325, y, percent(probabilities[index]), 'font-size="16" text-anchor="end"');
    });
    return svg + '</g>';
  }
  function initial() { return P.initialState(byId('fb-initial').value); }
  function renderBasis() {
    const left = initial(), right = P.changeBasis(left);
    math('fb-preparation', 'c_L=' + vector(left) + ',\\qquad c_R=' + vector(right));
    byId('fb-left-tree').innerHTML = treeMarkup('L', left);
    byId('fb-right-tree').innerHTML = treeMarkup('R', right);
    const leftProbability = P.probabilities(left)[0], rightProbability = P.probabilities(right)[0];
    byId('fb-basis-observation').textContent = 'The state has not changed. The chance of vacuum charge is ' + percent(leftProbability) + ' for pair 1–2 and ' + percent(rightProbability) + ' for pair 2–3. Changing basis and back recovers the input, with squared overlap ' + number(P.fidelity(left, P.changeBasis(right)), 6) + '.';
  }
  function phasorMarkup(stage) {
    const amplitudes = stage.amplitudes;
    let svg = '<rect width="660" height="305" fill="white"/><g font-family="Times New Roman,serif" font-size="21" fill="#000">';
    svg += '<title>Complex amplitudes in the ' + (stage.basis === 'L' ? 'left' : 'right') + ' fusion basis</title>';
    svg += '<desc>Real components are horizontal and imaginary components vertical. Each circle has radius one. Channel 1 amplitude ' + complex(amplitudes[0]) + '; channel tau amplitude ' + complex(amplitudes[1]) + '.</desc>';
    svg += text(330, 26, (stage.basis === 'L' ? 'Left basis: pair 1–2' : 'Right basis: pair 2–3'), 'text-anchor="middle"');
    svg += '<defs>' + colors.map((color, index) => '<marker id="fb-arrow-' + index + '" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 7 3.5 L 0 7 Z" fill="' + color + '"/></marker>').join('') + '</defs>';
    amplitudes.forEach((amplitude, index) => {
      const x = 166 + 328 * index, y = 151, radius = 78;
      svg += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="none" stroke="#aaa"/>';
      svg += '<path d="M ' + (x - 91) + ' ' + y + ' H ' + (x + 91) + ' M ' + x + ' ' + (y - 91) + ' V ' + (y + 91) + '" fill="none" stroke="#bbb"/>';
      svg += text(x + 93, y + 6, 'Re', 'font-size="17"') + text(x + 6, y - 87, 'Im', 'font-size="17"');
      const endX = x + amplitude[0] * radius, endY = y - amplitude[1] * radius;
      if (Math.hypot(...amplitude) > 1e-8) svg += '<path d="M ' + x + ' ' + y + ' L ' + endX + ' ' + endY + '" fill="none" stroke="' + colors[index] + '" stroke-width="2.5" marker-end="url(#fb-arrow-' + index + ')"/>';
      else svg += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + colors[index] + '"/>';
      svg += text(x, 270, 'channel ' + (index === 0 ? '1' : 'τ') + ': ' + complex(amplitude), 'font-size="20" fill="' + colors[index] + '" text-anchor="middle"');
      svg += text(x, 298, 'P = ' + percent(P.probabilities(amplitudes)[index]), 'font-size="19" text-anchor="middle"');
    });
    return svg + '</g>';
  }
  function renderExchange() {
    const input = initial(), direction = Number(byId('fb-direction').value);
    const stageIndex = Number(byId('fb-stage').value), stages = P.exchangeStages(input, direction), stage = stages[stageIndex];
    const descriptions = [
      'Prepared state. The coefficients refer to the charge of pair 1–2.',
      'Passive F-move. The same state now has coefficients for the charge of pair 2–3.',
      'Physical ' + (direction === 1 ? 'counterclockwise' : 'clockwise') + ' exchange. Each pair-23 channel gains its exchange phase; its probability is unchanged.',
      'Passive change back. The output can now be compared directly with the input in the left basis.'
    ];
    byId('fb-stage-description').textContent = descriptions[stageIndex];
    math('fb-stage-vector', (stageIndex > 1 ? "c'" : 'c') + '_{' + stage.basis + '}=' + vector(stage.amplitudes));
    byId('fb-phase-svg').innerHTML = phasorMarkup(stage);
    byId('fb-previous').disabled = stageIndex === 0;
    byId('fb-next').disabled = stageIndex === 3;
    const physical = stage.basis === 'L' ? stage.amplitudes : P.changeBasis(stage.amplitudes);
    byId('fb-stage-fidelity').textContent = number(P.fidelity(input, physical), 6);
    const before = P.probabilities(input)[0], current = P.probabilities(physical)[0];
    byId('fb-exchange-observation').textContent = 'At this step, a pair-12 charge measurement would give vacuum with probability ' + percent(current) + ' (input: ' + percent(before) + '). ' + (stageIndex < 2 ? 'No physical exchange has occurred.' : 'The changed state comes from the channel-dependent exchange phases, not from either coordinate transformation.');
  }
  function wordLabel(word) { return word.length ? '[' + word.join(', ').replaceAll('-', '−') + ']' : 'no exchange'; }
  function comparisonData() {
    const example = examples[byId('fb-comparison').value];
    return P.compareWords(example.a, example.b, P.initialState(byId('fb-comparison-initial').value));
  }
  function renderComparison() {
    const example = examples[byId('fb-comparison').value], result = comparisonData();
    math('fb-comparison-input', 'c_{L,\\mathrm{in}}=' + vector(P.initialState(byId('fb-comparison-initial').value)));
    byId('fb-word-a').textContent = 'A: ' + wordLabel(example.a);
    byId('fb-word-b').textContent = 'B: ' + wordLabel(example.b);
    ['a', 'b'].forEach((label, index) => {
      const state = index === 0 ? result.stateA : result.stateB;
      state.forEach((amplitude, channel) => math('fb-amplitude-' + label + '-' + channel, complex(amplitude, true), false));
      byId('fb-p12-' + label).textContent = percent(index === 0 ? result.pair12A[0] : result.pair12B[0]);
      byId('fb-p23-' + label).textContent = percent(index === 0 ? result.pair23A[0] : result.pair23B[0]);
    });
    const residual = result.matrixDistance === 0 ? '0' : result.matrixDistance.toExponential(3);
    const conclusion = byId('fb-comparison').value === 'order'
      ? 'The operators do not commute. These two pair-charge readouts test the chosen input.'
      : byId('fb-comparison').value === 'relation' ? 'The two words implement the same operator, as required by the braid relation.' : 'An exchange followed by its inverse returns every input to itself.';
    byId('fb-comparison-result').textContent = 'Squared state overlap: ' + number(result.fidelity, 6) + '. Matrix residual ‖U_A − U_B‖_F: ' + residual + '. ' + conclusion;
  }
  function renderAll() { renderBasis(); renderExchange(); renderComparison(); }
  function prepareDownload(contents, type, filename) {
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = URL.createObjectURL(new Blob([contents], { type }));
    const link = byId('fb-export-download');
    link.href = exportUrl;
    link.download = filename;
    link.textContent = filename;
    byId('fb-export-ready').hidden = false;
    link.click();
  }
  function saveSvg() {
    let body, width, height;
    if (byId('fb-export-figure').value === 'trees') {
      width = 720; height = 415;
      body = '<rect width="720" height="415" fill="white"/><g font-family="Times New Roman,serif" fill="#000" font-size="22">' + text(180, 28, 'Left basis: pair 1–2', 'text-anchor="middle"') + text(540, 28, 'Right basis: pair 2–3', 'text-anchor="middle"') + '</g><g transform="translate(10 45)">' + treeMarkup('L', initial()) + '</g><g transform="translate(370 45)">' + treeMarkup('R', P.changeBasis(initial())) + '</g><text x="360" y="409" text-anchor="middle" font-family="Times New Roman,serif" font-size="18">Same state; two different pair-charge measurements.</text>';
    } else {
      width = 660; height = 305;
      body = phasorMarkup(P.exchangeStages(initial(), Number(byId('fb-direction').value))[Number(byId('fb-stage').value)]);
    }
    const svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' + body + '</svg>';
    prepareDownload(svg, 'image/svg+xml;charset=utf-8', 'fibonacci-' + byId('fb-export-figure').value + '.svg');
  }
  function saveParameters() {
    const input = initial(), example = examples[byId('fb-comparison').value];
    const data = {
      schemaVersion: 1, model: 'Three Fibonacci tau anyons with fixed total tau',
      convention: { chirality: 'right-handed', positiveExchange: 'counterclockwise viewed from above the plane',
        channelOrder: ['1', 'tau'], wordOrder: 'chronological; [1,2] has matrix B2 B1',
        complexEncoding: '[real, imaginary]', basis: 'left association ((tau tau)_a tau)_tau',
        source: 'https://arxiv.org/html/2407.21761v2#S2.SS1' },
      phi: P.phi, fMatrix: P.fMatrix(), counterclockwiseR: P.braidMatrix(1),
      initialChoice: byId('fb-initial').value, inputLeft: input, inputRight: P.changeBasis(input),
      direction: Number(byId('fb-direction').value), selectedStep: Number(byId('fb-stage').value),
      exchangeSteps: P.exchangeStages(input, Number(byId('fb-direction').value)),
      comparison: { choice: byId('fb-comparison').value, initialChoice: byId('fb-comparison-initial').value,
        input: P.initialState(byId('fb-comparison-initial').value), wordA: example.a, wordB: example.b, ...comparisonData() }
    };
    prepareDownload(JSON.stringify(data, null, 2) + '\n', 'application/json;charset=utf-8', 'fibonacci-fusion-basis.json');
  }
  byId('fb-initial').addEventListener('change', () => { byId('fb-stage').value = '0'; renderBasis(); renderExchange(); });
  byId('fb-direction').addEventListener('change', renderExchange);
  byId('fb-stage').addEventListener('change', renderExchange);
  byId('fb-previous').addEventListener('click', () => { byId('fb-stage').value = String(Math.max(0, Number(byId('fb-stage').value) - 1)); renderExchange(); });
  byId('fb-next').addEventListener('click', () => { byId('fb-stage').value = String(Math.min(3, Number(byId('fb-stage').value) + 1)); renderExchange(); });
  byId('fb-comparison').addEventListener('change', renderComparison);
  byId('fb-comparison-initial').addEventListener('change', renderComparison);
  byId('fb-reset').addEventListener('click', () => {
    byId('fb-initial').value = 'vacuum'; byId('fb-direction').value = '1'; byId('fb-stage').value = '0';
    byId('fb-comparison').value = 'order'; byId('fb-comparison-initial').value = 'plus';
    byId('fb-export-ready').hidden = true;
    renderAll();
  });
  byId('fb-export-svg').addEventListener('click', saveSvg);
  byId('fb-export-json').addEventListener('click', saveParameters);
  window.addEventListener('pagehide', () => { if (exportUrl) URL.revokeObjectURL(exportUrl); });
  if (globalThis.renderMathInElement) renderMathInElement(document.body, { delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }], throwOnError: false });
  renderAll();
})();
