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
  function fusionSvg(model, data) {
    const svg = $('abelian-fusion-svg');
    const probe = model.sectors[state.probe], target = model.sectors[state.target];
    const heading = `${model.name}: ${probe.name} × ${target.name} = ${data.fusion.sector.name}`;
    const subtitle = model.localFermions ? 'Sector fusion modulo local electrons' : '';
    const reduction = `${vectorText(data.fusion.label)} = ${vectorText(data.fusion.sector.label)} + K ${vectorText(data.fusion.removedLocal)}`;
    svg.setAttribute('aria-label', `${heading}. ${subtitle ? subtitle + '. ' : ''}Integer labels ${vectorText(data.shiftedLabel)} plus ${vectorText(data.target)} give ${vectorText(data.fusion.label)}. Remove local K n with n ${vectorText(data.fusion.removedLocal)}.`);
    svg.innerHTML = `<title>${escapeXml(heading)}</title><desc>${escapeXml(reduction)}. Coordinates are label bookkeeping, not particle positions.</desc><rect width="660" height="245" fill="white"/>
      <defs><marker id="abelian-fusion-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#555"/></marker></defs>
      ${text(330, 27, heading, 23)}
      ${subtitle ? text(330, 50, subtitle, 18, '#555') : ''}
      <path d="M 170 83 L 327 125 M 170 166 L 327 125 L 418 125" fill="none" stroke="#777" stroke-width="1.5" marker-end="url(#abelian-fusion-arrow)"/>
      ${text(105, 78, probe.name, 25, '#145b91')}${text(105, 105, vectorText(data.shiftedLabel), 23, '#145b91')}
      ${text(105, 163, target.name, 25, '#a33b2b')}${text(105, 190, vectorText(data.target), 23, '#a33b2b')}
      ${text(510, 116, data.fusion.sector.name, 28)}${text(510, 146, vectorText(data.fusion.label), 23)}
      ${text(330, 225, reduction, 22)}`;
  }
  function phaseSvg(model, data) {
    const svg = $('abelian-phase-svg');
    const heading = `${model.name} · ${state.direction === 1 ? 'counterclockwise' : 'clockwise'}`;
    const description = `${model.name}. Probe ${vectorText(data.shiftedLabel)}, target ${vectorText(data.target)}. Exchange ${phaseText(data.exchange)}; full winding ${phaseText(data.mutual)}.`;
    svg.setAttribute('aria-label', description);
    const circle = (center, phase, label, color, arrowId) => {
      const x = center + 70 * phase.complex[0], y = 167 - 70 * phase.complex[1];
      return `${text(center, 60, label, 23)}<circle cx="${center}" cy="167" r="70" fill="none" stroke="#777"/>
        <path d="M ${center - 70} 167 H ${center + 70} M ${center} 97 V 237" stroke="#ddd" fill="none"/>
        ${text(center + 89, 174, '+1', 19)}${text(center - 88, 174, '−1', 19)}${text(center, 91, 'i', 19)}${text(center, 258, '−i', 19)}
        <line x1="${center}" y1="167" x2="${x}" y2="${y}" stroke="${color}" stroke-width="2.5" marker-end="url(#${arrowId})"/>
        <circle cx="${x}" cy="${y}" r="4" fill="${color}"/>
        ${text(center, 298, phaseText(phase), 24, color)}`;
    };
    svg.innerHTML = `<title>${escapeXml(description)}</title><desc>Complex unit circles. Horizontal axis is real; vertical axis is imaginary. Arrows are final multipliers, not particle paths.</desc><rect width="660" height="320" fill="white"/>
      <defs><marker id="abelian-spin-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#145b91"/></marker><marker id="abelian-mutual-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a33b2b"/></marker></defs>
      ${text(330, 20, heading, 19, '#555')}${circle(160, data.exchange, `Exchange ${vectorText(data.shiftedLabel)}`, '#145b91', 'abelian-spin-arrow')}${circle(495, data.mutual, `Winding around ${vectorText(data.target)}`, '#a33b2b', 'abelian-mutual-arrow')}`;
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
        button.textContent = phaseText(phase);
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
    fusionSvg(model, data); phaseSvg(model, data); windingTable(model);
    math('abelian-matrix', `K=${matrixTex(model.K)},\\quad K^{-1}=${matrixTex(model.inverse)},\\quad t=${vectorTex(model.t)},\\quad |\\det K|=${model.sectorCount},\\quad \\nu=${fractionTex(data.hall)}.`, true);
    $('abelian-model-note').textContent = modelNotes[state.model];
    $('abelian-sector-readout').textContent = `Probe ${vectorText(data.shiftedLabel)} stays in sector ${data.sector.name}`;
    math('abelian-exchange-readout', `U_{\\rm exchange}=${phaseTex(data.exchange)}`);
    math('abelian-mutual-readout', `U_{\\rm winding}=${phaseTex(data.mutual)}`);
    math('abelian-charge-readout', `q/e=${fractionTex(data.charge)}`);
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
    const svg = $($('abelian-export-figure').value).cloneNode(true);
    const dimensions = svg.getAttribute('viewBox').split(' ').map(Number);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', String(dimensions[2])); svg.setAttribute('height', String(dimensions[3]));
    svg.removeAttribute('class');
    save(`<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svg)}`, 'image/svg+xml;charset=utf-8', `${state.model}-${svg.id}.svg`);
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
