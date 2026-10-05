/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./pair-states-physics.js'), require('./collider-physics.js'));
  else root.AnyonNotesFigures = factory(root.AnyonPairStates, root.AnyonCollider);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Pairs, Collider) {
  'use strict';
  const blue = '#145b91', red = '#a33b2b', grey = '#666';
  const f = (n, digits = 4) => Math.abs(n) < 5 * 10 ** (-digits - 1) ? '0' : n.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
  const statisticsLabel = alpha => alpha === 1/3 ? '1/3' : alpha === 0.6 ? '3/5' : f(alpha);
  const svg = (title, description, content, height = 380) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 ${height}" role="img" aria-label="${title}" style="font-family:Georgia,serif;font-size:18px"><title>${title}</title><desc>${description}</desc><rect width="760" height="${height}" fill="white"/>${content}</svg>`;
  function plot({ title, description, parameterLabel, series, xMin = 0, xMax, yMin, yMax, xLabel, yLabel, markX, xticks, yticks }) {
    const x = v => 72 + 654 * (v - xMin) / (xMax - xMin), y = v => 278 - 218 * (v - yMin) / (yMax - yMin);
    let body = `<text x="72" y="25">${yLabel}</text>`;
    if (parameterLabel) body += `<text x="72" y="48" font-size="16" fill="#444">${parameterLabel}</text>`;
    for (const v of yticks) body += `<path d="M72 ${y(v)}H726" stroke="${v === 0 ? '#777' : '#ddd'}"/><text x="61" y="${y(v)+6}" text-anchor="end">${f(v,2)}</text>`;
    body += '<path d="M72 60V278H726" stroke="#222" fill="none"/>';
    for (const v of xticks) body += `<path d="M${x(v)} 278v5" stroke="#222"/><text x="${x(v)}" y="305" text-anchor="middle">${f(v,2)}</text>`;
    if (markX !== undefined) body += `<path d="M${x(markX)} 60V278" stroke="#999" stroke-dasharray="3 6"/>`;
    series.forEach((s, index) => {
      body += `<path d="${s.points.map(([a,b],i) => `${i ? 'L' : 'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ')}" stroke="${s.color}" fill="none" stroke-width="2.6"${s.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
      if (s.mark) body += `<circle cx="${x(s.mark[0])}" cy="${y(s.mark[1])}" r="4.5" fill="${s.color}"/>`;
      const lx = 75 + 320 * index;
      body += `<path d="M${lx} 358h30" stroke="${s.color}" stroke-width="2.6"${s.dash?' stroke-dasharray="8 5"':''}/><text x="${lx+39}" y="364">${s.name}</text>`;
    });
    body += `<text x="400" y="333" text-anchor="middle">${xLabel}</text>`;
    return svg(title, description, body);
  }
  function pair({alpha=1/3,separation=2}={}) {
    const localized=Pairs.pairState({alpha,separation,preparation:'localized'}), coherent=Pairs.pairState({alpha,separation,preparation:'coherent'});
    const series = ['localized','coherent'].map((preparation,i)=>({name:i?'Lowering-operator coherent':'Projected coordinate',color:i?red:blue,dash:i,points:Array.from({length:151},(_,n)=>{const s=6*n/150;return [s,Pairs.pairState({alpha,separation:s,preparation}).chi];}),mark:[separation,i?coherent.chi:localized.chi]}));
    const yMin=-.35,yMax=Math.max(.4,alpha+.08);
    const ticks=alpha>.65?[-.25,0,.25,.5,.75,1]:[-.25,0,.25,.5].filter(v=>v<yMax);
    return { svg:plot({title:'The same exchange rule, two preparations',description:`Separation excess chi versus label distance in magnetic lengths. Statistics alpha=${statisticsLabel(alpha)}. Blue projected coordinate; dashed red generalized coherent.`,parameterLabel:`α = ${statisticsLabel(alpha)}; selected label d/ℓ = ${f(separation,2)}`,series,xMax:6,yMin,yMax,xLabel:'Localization-label separation d / ℓ',yLabel:'χ = excess mean squared separation / (4ℓ²)',markX:separation,xticks:[0,1,2,3,4,5,6],yticks:ticks}),
      summary:`At α = ${statisticsLabel(alpha)} and d/ℓ = ${f(separation,2)}: projected-coordinate χ = ${f(localized.chi)}; generalized-coherent χ = ${f(coherent.chi)}.`,
      data:{alpha,separation,localized,coherent},
      rows:[['Projected coordinate',localized],['Generalized coherent',coherent]].map(([name,d])=>`<tr><th scope="row">${name}</th><td>${f(d.chi)}</td><td>${f(d.radialMoment)}</td></tr>`).join('') };
  }
  function saddle({alpha=1/3,separation=4,tau=.6}={}) {
    const at = preparation=>Pairs.saddle({alpha,separation,preparation,tau});
    const localized=at('localized'),coherent=at('coherent');
    const series=['localized','coherent'].map((preparation,i)=>({name:i?'Lowering-operator coherent':'Projected coordinate',color:i?red:blue,dash:i,points:Array.from({length:121},(_,n)=>{const t=1.2*n/120;return [t,Pairs.saddle({alpha,separation,preparation,tau:t}).outgoingMoment];}),mark:[tau,i?coherent.outgoingMoment:localized.outgoingMoment]}));
    const values=series.flatMap(s=>s.points.map(p=>p[1]));
    const range=Math.max(.12,...values.map(Math.abs));
    return {svg:plot({title:'Saddle evolution of the assigned outgoing moment',description:'The model moment C_alg grows exponentially. Blue projected coordinate includes delta; dashed red coherent has delta zero. These are not detector coincidence probabilities.',parameterLabel:`α = ${statisticsLabel(alpha)}; initial label d/ℓ = ${f(separation,2)}; marker τ = ${f(tau,2)}`,series,xMax:1.2,yMin:-range*1.12,yMax:range*1.12,xLabel:'Time τ = gℓ²t / ℏ',yLabel:'Assigned outgoing moment C_alg / ℓ²',markX:tau,xticks:[0,.3,.6,.9,1.2],yticks:[-range,0,range]}),
      summary:`At α = ${statisticsLabel(alpha)}, d/ℓ = ${f(separation,2)} and τ = ${f(tau,2)}: projected-coordinate C_alg/ℓ² = ${f(localized.outgoingMoment)}; generalized-coherent C_alg/ℓ² = ${f(coherent.outgoingMoment)}. The coordinate-state correction δ = ${f(localized.initial.delta)}.`,data:{alpha,separation,tau,localized,coherent}};
  }
  function collider({r=.95,ratio=2.5}={}) {
    const data=Collider.calculate({r,ratio});
    const values=[['Incoherent paths B₁',data.B1,grey],['One-source control B₂',data.B2,grey],['Fermion coincidence',data.fermion,blue],['Boson coincidence',data.boson,red]];
    let body='<text x="236" y="25">Probability: one particle in each drain</text>';
    for(const t of [0,.25,.5,.75,1]) body+=`<path d="M${236+470*t} 47V287" stroke="#ddd"/><text x="${236+470*t}" y="315" text-anchor="middle">${t}</text>`;
    values.forEach(([label,value,color],i)=>{const y=62+i*58;body+=`<text x="222" y="${y+19}" text-anchor="end">${label}</text><rect x="236" y="${y}" width="${470*value}" height="28" fill="${color}" opacity=".88"/><text x="${Math.min(710,244+470*value)}" y="${y+21}" fill="#111">${f(value,3)}</text>`;});
    body+=`<text x="236" y="357">r = ${f(r,2)}; inverse spectral width ℓₚ/L = ${f(ratio,2)}</text>`;
    return {svg:svg('A reference changes the apparent sign',`Coincidence probabilities for a symmetric loop collider. B1=${f(data.B1)}; B2=${f(data.B2)}; fermions=${f(data.fermion)}; bosons=${f(data.boson)}.`,body),summary:`Fermions: P₁₁ − B₁ = ${f(data.fermion-data.B1)}; P₁₁ − B₂ = ${f(data.fermion-data.B2)}. Bosons: P₁₁ − B₂ = ${f(data.boson-data.B2)}.`,data};
  }
  function makeFigure(name, value, controls, caption, extra='') {
    return `<figure class="inline-figure" id="figure-${name}"><div id="${name}-drawing" class="figure-drawing" tabindex="0" aria-label="Scrollable ${name} figure">${value.svg}</div><p class="figure-scroll-hint">Swipe or scroll horizontally to view the whole figure.</p><figcaption>${caption}</figcaption><div class="figure-controls">${controls}<button type="button" data-reset-figure="${name}">Reset</button></div><p id="${name}-summary" class="figure-summary" aria-live="polite">${value.summary}</p>${extra}<p class="figure-tools"><button type="button" data-save-svg="${name}">Save SVG</button> <button type="button" data-save-data="${name}">Save data</button> <span id="${name}-download" role="status"></span></p></figure>`;
  }
  const statControl=id=>`<label for="${id}-alpha">Statistics α <select id="${id}-alpha"><option value="0">0 · bosons</option><option value="0.3333333333333333" selected>1/3</option><option value="0.6">3/5</option><option value="1">1 · fermions</option></select></label>`;
  const sepControl=(id,separation=2)=>`<label for="${id}-separation">Label d/ℓ <input id="${id}-separation" type="range" min="0" max="6" step=".01" value="${separation}"><output id="${id}-separation-value">${separation}</output></label>`;
  function initialMarkup(name) {
    if(name==='pair') {const value=pair();return makeFigure(name,value,statControl(name)+sepControl(name),'Both curves use the same statistics and localization label. Only the preparation coefficients change. Positive χ means a larger radial moment than the distinguishable reference; negative χ means smaller. The zero-label value is a formal normalized-state limit, outside the separated-core interpretation.',`<div class="table-scroll"><table><thead><tr><th>Preparation</th><th>χ</th><th>⟨r²⟩ / ℓ²</th></tr></thead><tbody id="pair-table">${value.rows}</tbody></table></div>`);}
    if(name==='saddle') return makeFigure(name,saddle(),statControl(name)+sepControl(name,4)+`<label for="saddle-tau">Time τ <input id="saddle-tau" type="range" min="0" max="1.2" step=".01" value=".6"><output id="saddle-tau-value">0.6</output></label><button type="button" id="saddle-sensitive">Near a sign change</button>`,'Both preparations evolve at matching incoming labels under the specified SU(1,1) saddle. The curve shows the assigned quadratic moment C_alg, not a counting probability; matching its operator to a detector remains a physical requirement. Time only amplifies its initial value. The preparations differ here at finite separation, while sharing their leading large-separation tail. The usable time interval in a real saddle depends on its spatial extent and the validity of level projection.');
    if(name==='collider') return makeFigure(name,collider(),`<label for="collider-r">Junction amplitude r <input id="collider-r" type="range" min=".05" max=".98" step=".01" value=".95"><output id="collider-r-value">0.95</output></label><label for="collider-ratio">Inverse spectral width ℓₚ/L <input id="collider-ratio" type="range" min=".2" max="8" step=".1" value="2.5"><output id="collider-ratio-value">2.5</output></label>`,'A computed illustration of the extended-loop model, with identical simultaneous incident packets and time-integrating detectors. The default fermion probability is below the incoherent-path reference B₁, yet above the measured-one-source reference B₂. Nothing about the exchange rule changed. This figure models bosons and fermions; it does not interpolate to anyons.');
    throw new RangeError('Unknown figure');
  }
  return {pair,saddle,collider,initialMarkup};
});
