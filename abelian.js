/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function () {
  'use strict';
  const P = window.AbelianPhysics;
  const $ = id => document.getElementById(id);
  if (!P || !window.katex || !window.renderMathInElement) {
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = 'The model or math renderer could not load. Keep this page, its scripts, and the vendor folder together, then reopen abelian.html.';
    $('main').prepend(error);
    return;
  }
  const mathOptions = { throwOnError: true, trust: false, strict: 'error' };
  const typeset = element => window.renderMathInElement(element, { ...mathOptions,
    delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'],
    errorCallback: (message, error) => { throw error || new Error(message); }
  });
  const math = (id, source, displayMode = false) => window.katex.render(source, $(id), { ...mathOptions, displayMode });
  const fractionTex = fraction => fraction.denominator === 1 ? String(fraction.numerator) : `${fraction.numerator < 0 ? '-' : ''}\\frac{${Math.abs(fraction.numerator)}}{${fraction.denominator}}`;
  const vectorText = vector => `(${vector.join(', ')})`;
  const vectorTex = vector => `\\begin{pmatrix}${vector.join('\\\\')}\\end{pmatrix}`;
  const matrixTex = matrix => `\\begin{pmatrix}${matrix.map(row => row.map(entry => typeof entry === 'number' ? entry : fractionTex(entry)).join('&')).join('\\\\')}\\end{pmatrix}`;
  const escapeXml = text => String(text).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
  const text = (x, y, content, size = 21, color = '#000', anchor = 'middle') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="Times New Roman, Times, serif" text-anchor="${anchor}">${escapeXml(content)}</text>`;
  const defaults = () => ({ model: 'toric', probe: 1, target: 2, n: [0, 0], direction: 1 });
  let state = defaults();
  let downloadUrl = null;
  const modelNotes = {
    toric: 'Four sectors with fusion group ℤ₂ × ℤ₂. e and m are bosons with mutual winding −1; ε = e × m is an emergent fermion. The chosen charge vector is zero: these symbols e and m are not electromagnetic charge and flux.',
    doubleSemion: 'Four sectors with the same fusion group ℤ₂ × ℤ₂. s and s̄ exchange with opposite phases +i and −i; s × s̄ = b is bosonic. The bar denotes opposite semion handedness: each semion is its own fusion inverse, s × s = s̄ × s̄ = 1.',
    laughlin2: 'Two sectors with fusion group ℤ₂. The representative a = (1) has charge +e/2 and exchange factor i. Two a particles fuse to the local charge-e boson (2), in the vacuum sector.',
    laughlin3: 'Three sectors modulo local electrons, with fusion group ℤ₃. The listed a = (1) has charge +e/3 and exchange factor exp(iπ/3). Three a particles give a local charge +e fermion (3); quotienting identifies its sector with 1 but does not preserve its exchange factor.'
  };
  function phaseTex(phase) {
    const fraction = phase.reducedTurns;
    const exact = { '0': '+1', '1/4': 'i', '1/2': '-1', '3/4': '-i' }[P.format(fraction)];
    if (exact) return exact;
    const numerator = fraction.numerator * 2 > fraction.denominator ? fraction.numerator - fraction.denominator : fraction.numerator;
    const coefficient = P.rational(2 * numerator, fraction.denominator);
    const sign = coefficient.numerator < 0 ? '-' : '';
    const magnitude = Math.abs(coefficient.numerator);
    const imaginaryNumerator = `${magnitude === 1 ? '' : magnitude}\\pi i`;
    // The sign multiplies the whole imaginary exponent; placing a negative
    // fraction after i pi without grouping would introduce a real term.
    const exponent = coefficient.denominator === 1 ? imaginaryNumerator : `\\frac{${imaginaryNumerator}}{${coefficient.denominator}}`;
    return `e^{${sign}${exponent}}`;
  }
  function phaseText(phase) {
    const fraction = phase.reducedTurns;
    const exact = { '0': '+1', '1/4': 'i', '1/2': '−1', '3/4': '−i' }[P.format(fraction)];
    if (exact) return exact;
    const coefficient = P.rational(2 * (fraction.numerator * 2 > fraction.denominator ? fraction.numerator - fraction.denominator : fraction.numerator), fraction.denominator);
    const numerator = coefficient.numerator === 1 ? '' : coefficient.numerator === -1 ? '−' : String(coefficient.numerator).replace('-', '−');
    return `exp(${numerator}πi${coefficient.denominator === 1 ? '' : '/' + coefficient.denominator})`;
  }
  function setSectors(model) {
    for (const id of ['abelian-probe', 'abelian-target']) {
      $(id).replaceChildren(...model.sectors.map((sector, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${sector.name} : ${vectorText(sector.label)}`;
        return option;
      }));
    }
    $('abelian-local-two-field').hidden = model.K.length === 1;
    $('abelian-local-two').disabled = model.K.length === 1;
    $('abelian-local-note').textContent = model.localFermions
      ? 'n₁ = −1 attaches an electron (charge −e); +1 attaches a local hole (charge +e). Either flips the exchange sign.'
      : model.K.length === 1 ? 'n₁ = +1 adds a local charge-e boson; −1 adds its antiparticle. Both preserve the exchange factor.'
        : 'Each column of K is a neutral local boson in this model. Either attachment preserves the exchange factor.';
  }
  function syncControls() {
    const model = P.models[state.model];
    $('abelian-model').value = state.model;
    setSectors(model);
    $('abelian-probe').value = String(state.probe);
    $('abelian-target').value = String(state.target);
    $('abelian-local-one').value = String(state.n[0]);
    $('abelian-local-two').value = String(state.n[1] || 0);
    $('abelian-direction').value = String(state.direction);
  }
  function result() {
    const model = P.models[state.model];
    return P.inspect(model, model.sectors[state.probe].label, model.sectors[state.target].label, state.n, state.direction);
  }
  function comparisonRows(model, data) {
    const originalExchange = P.phase(P.multiply(data.originalSpin.turns, P.rational(state.direction)));
    return [
      { label: 'Integer label', tex: [vectorTex(data.representative), vectorTex(data.shiftedLabel)], plain: [vectorText(data.representative), vectorText(data.shiftedLabel)] },
      { label: 'Charge q/e', tex: [fractionTex(data.originalCharge), fractionTex(data.charge)], plain: [P.format(data.originalCharge), P.format(data.charge)] },
      { label: 'Identical-probe exchange', tex: [phaseTex(originalExchange), phaseTex(data.exchange)], plain: [phaseText(originalExchange), phaseText(data.exchange)] },
      { label: `Winding around ${model.sectors[state.target].name}`, tex: [phaseTex(data.originalMutual), phaseTex(data.mutual)], plain: [phaseText(data.originalMutual), phaseText(data.mutual)] }
    ];
  }
  function comparisonTable(model, data) {
    const table = $('abelian-comparison-table'), attached = state.n.some(component => component !== 0);
    table.caption.textContent = `${model.name}: probe sector ${data.sector.name}, ${state.direction === 1 ? 'counterclockwise' : 'clockwise'}`;
    const header = document.createElement('tr');
    ['Quantity', attached ? 'Listed representative' : 'Selected representative', ...(attached ? ['After attachment'] : [])].forEach(label => {
      const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = label; header.append(cell);
    });
    table.tHead.replaceChildren(header);
    table.tBodies[0].replaceChildren(...comparisonRows(model, data).map(item => {
      const row = document.createElement('tr'), title = document.createElement('th'); title.scope = 'row'; title.textContent = item.label; row.append(title);
      item.tex.slice(0, attached ? 2 : 1).forEach(source => {
        const cell = document.createElement('td'); window.katex.render(source, cell, mathOptions); row.append(cell);
      });
      return row;
    }));
    math('abelian-fusion-equation', `${vectorTex(data.shiftedLabel)}+${vectorTex(data.target)}=${vectorTex(data.fusion.label)}=${vectorTex(data.fusion.sector.label)}+K${vectorTex(data.fusion.removedLocal)}`, true);
  }
  function tableSvg(model, data, kind) {
    const summary = kind === 'summary', width = 760, height = summary ? 355 : 155 + model.sectorCount * 53;
    let body = `<title>${escapeXml(model.name)}: ${summary ? 'local attachment comparison' : 'full-winding matrix'}</title><rect width="${width}" height="${height}" fill="white"/>` +
      text(380, 28, `${model.name} · ${state.direction === 1 ? 'counterclockwise' : 'clockwise'}`, 23);
    if (summary) {
      body += text(440, 74, 'Listed representative', 20) + text(645, 74, 'After attachment', 20);
      comparisonRows(model, data).forEach((row, index) => {
        const y = 119 + index * 47;
        body += text(24, y, row.label, 20, '#000', 'start') + text(440, y, row.plain[0], 21) + text(645, y, row.plain[1], 21);
      });
      body += text(380, 320, `Both labels belong to sector ${data.sector.name}; target ${vectorText(data.target)}.`, 20);
    } else {
      const x = index => 230 + index * 130;
      body += text(28, 81, 'Probe / target', 20, '#000', 'start');
      model.sectors.forEach((target, col) => { body += text(x(col), 81, target.name, 23); });
      model.sectors.forEach((probe, row) => {
        const y = 129 + row * 53;
        body += text(88, y, probe.name, 23);
        model.sectors.forEach((target, col) => {
          const phase = P.phase(P.multiply(P.mutual(model, probe.label, target.label).turns, P.rational(state.direction)));
          body += text(x(col), y, phaseText(phase), 21);
        });
      });
      body += text(380, height - 16, 'All local attachments leave this matrix unchanged.', 19);
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
  }
  function windingTable(model) {
    const table = $('abelian-mutual-table');
    const header = document.createElement('tr');
    const corner = document.createElement('th');
    corner.scope = 'col'; corner.textContent = 'Probe / target'; header.append(corner);
    model.sectors.forEach(sector => { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = sector.name; header.append(cell); });
    table.tHead.replaceChildren(header);
    const rows = model.sectors.map((probe, i) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th'); heading.scope = 'row'; heading.textContent = probe.name; row.append(heading);
      model.sectors.forEach((target, j) => {
        const cell = document.createElement('td'), button = document.createElement('button');
        const phase = P.phase(P.multiply(P.mutual(model, probe.label, target.label).turns, P.rational(state.direction)));
        window.katex.render(phaseTex(phase), button, mathOptions);
        button.dataset.probe = String(i); button.dataset.target = String(j);
        button.setAttribute('aria-label', `${probe.name} around ${target.name}: ${phaseText(phase)}. Select these particles.`);
        button.setAttribute('aria-pressed', String(i === state.probe && j === state.target));
        if (i === state.probe && j === state.target) { button.style.fontWeight = 'bold'; button.style.outline = '2px solid #145b91'; button.style.outlineOffset = '2px'; }
        cell.append(button); row.append(cell);
      });
      return row;
    });
    table.tBodies[0].replaceChildren(...rows);
    $('abelian-table-caption').textContent = `${model.name}: ${state.direction === 1 ? 'counterclockwise' : 'clockwise'} full winding`;
  }
  function render() {
    const model = P.models[state.model], data = result();
    comparisonTable(model, data); windingTable(model);
    math('abelian-matrix', `K=${matrixTex(model.K)},\\quad K^{-1}=${matrixTex(model.inverse)},\\quad t=${vectorTex(model.t)},\\quad |\\det K|=${model.sectorCount},\\quad \\nu=${fractionTex(data.hall)}.`, true);
    $('abelian-model-note').textContent = modelNotes[state.model];
    const changed = state.n.some(component => component !== 0);
    const chargeChange = P.add(data.charge, P.negate(data.originalCharge));
    const spinRatio = P.phase(P.add(data.spin.turns, P.negate(data.originalSpin.turns)));
    const observation = changed
      ? `Attachment changes ℓ from ${vectorText(data.representative)} to ${vectorText(data.shiftedLabel)}. Charge changes by ${P.format(chargeChange)} e. The counterclockwise exchange factor is multiplied by ${phaseText(spinRatio)}; the mutual-winding factor stays ${phaseText(data.mutual)}.`
      : `No local particle is attached. The selected sector has representative ${vectorText(data.representative)} and charge ${P.format(data.charge)} e. Compare exchange ${phaseText(data.exchange)} with full winding ${phaseText(data.mutual)}: the target matters.`;
    $('abelian-observation').textContent = observation;
  }
  $('abelian-model').addEventListener('change', event => {
    state.model = event.target.value;
    const model = P.models[state.model];
    state.probe = Math.min(state.probe, model.sectorCount - 1);
    state.target = Math.min(state.target, model.sectorCount - 1);
    state.n = model.K.map(() => 0);
    syncControls(); render();
  });
  [['abelian-probe', 'probe'], ['abelian-target', 'target'], ['abelian-direction', 'direction']].forEach(([id, key]) => $(id).addEventListener('change', event => { state[key] = Number(event.target.value); render(); }));
  ['abelian-local-one', 'abelian-local-two'].forEach((id, i) => $(id).addEventListener('change', event => { state.n[i] = Number(event.target.value); render(); }));
  $('abelian-mutual-table').addEventListener('click', event => {
    const button = event.target.closest('button[data-probe]');
    if (!button) return;
    state.probe = Number(button.dataset.probe); state.target = Number(button.dataset.target);
    $('abelian-probe').value = String(state.probe); $('abelian-target').value = String(state.target);
    render();
    // Rendering recreates the table. Restore keyboard focus to its selected cell.
    $('abelian-mutual-table').querySelector(`button[data-probe="${state.probe}"][data-target="${state.target}"]`).focus({ preventScroll: true });
  });
  $('abelian-reset').addEventListener('click', () => { state = defaults(); syncControls(); render(); $('abelian-announcement').textContent = 'All settings reset to toric-code e around m, without local attachment.'; });
  document.querySelectorAll('[data-abelian-example]').forEach(button => button.addEventListener('click', () => {
    state = defaults();
    if (button.dataset.abelianExample === 'fermion') { state.probe = 3; state.target = 3; }
    if (button.dataset.abelianExample === 'semions') state.model = 'doubleSemion';
    if (button.dataset.abelianExample === 'electron') { state.model = 'laughlin3'; state.target = 1; state.n = [-1]; }
    syncControls(); render();
    $('abelian-announcement').textContent = `Example selected: ${button.textContent}.`;
  }));
  function save(contents, type, filename) {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([contents], { type }));
    const link = $('abelian-download'); link.href = downloadUrl; link.download = filename; link.textContent = filename;
    $('abelian-export-ready').hidden = false; link.click();
    $('abelian-announcement').textContent = `${filename} prepared. Its download link remains below the export controls.`;
  }
  $('abelian-export-svg').addEventListener('click', () => {
    const kind = $('abelian-export-figure').value;
    save(tableSvg(P.models[state.model], result(), kind), 'image/svg+xml;charset=utf-8', `${state.model}-${kind}.svg`);
  });
  $('abelian-export-json').addEventListener('click', () => {
    const model = P.models[state.model];
    const data = { schemaVersion: 1, model: model.name, modelId: model.id, K: model.K, inverseK: model.inverse, chargeVector: model.t,
      parameters: { probeIndex: state.probe, targetIndex: state.target, localAttachment: state.n.slice(), direction: state.direction },
      conventions: { rationalNumbers: '{ numerator, denominator }, reduced exactly', phaseTurns: 'Angle divided by 2 pi; complex coordinates are approximate [real, imaginary].', positiveDirection: 'Counterclockwise', charge: 'q/e with e > 0; for K=3 the electron label is -3.', sectors: 'Quotient by all local K n; for odd K exchange factors depend on representatives.', fusion: 'The integer-label sum is exact. Removing K n may remove a local integer charge.', torusDegeneracy: 'Ideal gapped-phase value; finite-size splitting is not calculated.' },
      sectorCount: model.sectorCount, idealTorusDegeneracy: model.sectorCount, chiralCentralCharge: model.signature,
      sectors: model.sectors.map(sector => ({ ...sector, representativeSpin: P.spin(model, sector.label), charge: P.charge(model, sector.label) })),
      counterclockwiseMutualMatrix: model.sectors.map(left => model.sectors.map(right => P.mutual(model, left.label, right.label))),
      results: result(), sources: ['https://doi.org/10.1103/PhysRevB.93.155121', 'https://arxiv.org/abs/1205.3156', 'https://arxiv.org/abs/cond-mat/9506066'] };
    save(JSON.stringify(data, null, 2) + '\n', 'application/json;charset=utf-8', `anyons-abelian-${state.model}.json`);
  });
  window.addEventListener('pagehide', () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); });
  typeset(document.body); syncControls(); render();
})();
