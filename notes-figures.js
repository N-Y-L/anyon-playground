/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./pair-states-physics.js'), require('./collider-physics.js'), require('./phonon-physics.js'));
  else root.AnyonNotesFigures = factory(root.AnyonPairStates, root.AnyonCollider, root.AnyonPhonon);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Pairs, Collider, Phonon) {
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

  function phonon({time=48}={}) {
    const times=[0,time/2,time];
    const snapshots=times.map(time=>Phonon.packet({time}));
    const title='A phonon carries moving fluctuations';
    const description='Three exact harmonic-chain snapshots of excess displacement variance on one fixed vertical scale. Mean displacement is zero. Dotted, dashed and solid curves identify the initial, halfway and final times.';
    const colors=[grey,red,blue],dashes=['2 5','10 6',''];
    function drawing(narrow, className='') {
      const width=narrow?440:760,height=narrow?444:404;
      const left=narrow?70:76,right=width-(narrow?26:32),top=82,bottom=narrow?286:292;
      const x=j=>left+(right-left)*(j+64)/128;
      const y=value=>bottom-(bottom-top)*value/.18;
      const fontSize=narrow?22:19;
      const style=index=>`stroke="${colors[index]}" stroke-width="${index===0?3.2:2.6}"${dashes[index]?` stroke-dasharray="${dashes[index]}"`:''}`;
      let body=`<text x="14" y="27">Excess displacement variance</text><text x="14" y="56" font-size="${narrow?20:18}">in ℏ / √(κM)</text><text x="${width-14}" y="56" text-anchor="end" font-size="${narrow?22:18}">⟨uⱼ⟩ = 0</text>`;
      for(const value of [0,.05,.10,.15]) {
        body+=`<path d="M${left} ${y(value)}H${right}" stroke="#ddd"/><text x="${left-10}" y="${y(value)+7}" text-anchor="end">${value===0?'0':value.toFixed(2)}</text>`;
      }
      body+=`<path d="M${left} ${top}V${bottom}H${right}" stroke="#222" fill="none"/>`;
      for(const j of [-64,-32,0,32,64]) {
        body+=`<path d="M${x(j)} ${bottom}v5" stroke="#222"/><text x="${x(j)}" y="${bottom+29}" text-anchor="middle">${j}</text>`;
      }
      // Draw the solid curve first, leaving the earlier dashed traces visible
      // when nearby-time snapshots overlap. At time zero they coincide exactly.
      for(const index of [2,1,0]) {
        const snapshot=snapshots[index];
        body+=`<path d="${snapshot.positions.map((j,n)=>`${n?'L':'M'}${x(j).toFixed(2)},${y(snapshot.excessVariance[n]).toFixed(2)}`).join(' ')}" ${style(index)} fill="none"/>`;
      }
      body+=`<text x="${(left+right)/2}" y="${bottom+61}" text-anchor="middle">Site j (position ja)</text>`;
      const legendY=narrow?418:380;
      if(narrow) body+='<text x="14" y="384">Time in √(M/κ)</text>';
      else body+='<text x="14" y="386">Time in √(M/κ):</text>';
      if(time===0) {
        const lx=narrow?24:238;
        for(const index of [2,1,0]) body+=`<path d="M${lx} ${legendY}h38" ${style(index)}/>`;
        body+=`<text x="${lx+50}" y="${legendY+7}">t = 0 (all three coincide)</text>`;
      } else {
        times.forEach((value,index)=>{
          const lx=narrow?14+index*140:238+index*174;
          body+=`<path d="M${lx} ${legendY}h30" ${style(index)}/><text x="${lx+40}" y="${legendY+7}">t = ${f(value,1)}</text>`;
        });
      }
      return `<svg xmlns="http://www.w3.org/2000/svg"${className?` class="${className}"`:''} viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}" style="font-family:Georgia,serif;font-size:${fontSize}px"><title>${title}</title><desc>${description}</desc><rect width="${width}" height="${height}" fill="white"/>${body}</svg>`;
    }
    const peak=snapshot=>snapshot.positions[snapshot.excessVariance.indexOf(Math.max(...snapshot.excessVariance))];
    return {title,svg:drawing(false),display:drawing(false,'phonon-wide')+drawing(true,'phonon-narrow'),
      summary:time===0?`At t = 0, all three snapshots peak at site ${peak(snapshots[0])}.`:`At t = ${times.map(t=>f(t,1)).join(', ')}, the peaks lie at sites ${snapshots.map(peak).join(', ')}.`,
      conventions:'Periodic harmonic chain; zero translation mode omitted. Position is in lattice spacings a, time in sqrt(M/kappa), frequency in sqrt(kappa/M), energy in hbar sqrt(kappa/M), and excess displacement variance in hbar/sqrt(kappa M). The variance is not a phonon position probability. No anharmonic damping is modeled.',
      data:{time,snapshots}};
  }
  function panel(title,description,body,width=350,height=320) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}" style="font-family:Georgia,serif;font-size:18px"><title>${title}</title><desc>${description}</desc><rect width="${width}" height="${height}" fill="white"/>${body}</svg>`;
  }
  function charge() {
    return `<figure class="inline-figure charge-figure source-figure" id="figure-charge"><h3 class="figure-title">A quasihole is a local deficit in electron density</h3><div id="charge-drawing" class="source-drawing"><a href="../assets/fulsebakke-2023-quasihole-density.svg" aria-label="Open the published quasihole density figure at full size"><img src="../assets/fulsebakke-2023-quasihole-density.svg" width="618" height="468" loading="lazy" alt="Published density profiles for a Laughlin quasihole at filling one third. Density vanishes at the center, overshoots the bulk value near three magnetic lengths, and approaches the bulk value with damped oscillations. Colored curves are finite systems; the dashed black curve is the thermodynamic limit."></a></div><figcaption>The published calculation resolves the core and its surrounding oscillations. The authors’ dimensionless electron-density profile g(r) has its bulk reference at g = 1. The source’s ℓ is our electron magnetic length ℓ<sub>B</sub>. The colored curves use spherical systems with N<sub>e</sub> = 5–100; r is chord distance. The dashed black curve is their thermodynamic extrapolation. This shows the bulk profile, not the compensating edge of a finite droplet.<span class="figure-credit">From <a href="https://doi.org/10.21468/SciPostPhys.14.6.149">Fulsebakke et al. (2023), Fig. 11(a)</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Panel cropped from the original; curves and labels unchanged.</span></figcaption><div class="table-scroll"><table class="charge-ledger"><caption>Charge accounting for a finite droplet with the same N electrons</caption><thead><tr><th scope="col">Region</th><th scope="col">Mean electron-number change</th><th scope="col">Electric charge change</th></tr></thead><tbody><tr><th scope="row">Local disk D</th><td>≈ −1/m</td><td>≈ +e/m</td></tr><tr><th scope="row">Outside D</th><td>≈ +1/m</td><td>≈ −e/m</td></tr><tr><th scope="row">Whole droplet</th><td>0 exactly</td><td>0 exactly</td></tr></tbody></table></div><p class="figure-summary">D surrounds the core and excludes distant compensation. The local entries use the screened bulk limit derived above; the total follows exactly from fixed N. The density shape alone does not evaluate the charge integral.</p><p class="figure-tools"><a href="../assets/fulsebakke-2023-quasihole-density.svg" download>Download source figure (SVG)</a></p></figure>`;
  }
  function winding() {
    function loop(inside) {
      const stationary=inside?175:48;
      return panel(inside?'One stationary quasihole enclosed':'Reference: no stationary quasihole enclosed',
        'The moving quasihole makes the same counterclockwise loop in both preparations. Only the position of the fixed quasihole changes.',
        `<text x="175" y="25" text-anchor="middle" font-size="16" fill="#555">${inside?'ONE ENCLOSED':'REFERENCE'}</text><text x="175" y="53" text-anchor="middle">Fixed quasihole ${inside?'inside':'outside'}</text><circle cx="175" cy="166" r="75" fill="none" stroke="${blue}" stroke-width="2.5"/><path d="M171 85L159 92L172 98" fill="none" stroke="${blue}" stroke-width="2.5"/><circle cx="250" cy="166" r="7" fill="white" stroke="${blue}" stroke-width="2.5"/><path d="M260 164L277 147" stroke="#777"/><text x="251" y="136">moving</text><circle cx="${stationary}" cy="166" r="6" fill="#222"/><text x="${stationary}" y="195" text-anchor="middle">fixed</text><text x="175" y="283" text-anchor="middle" font-size="21">${inside?'γ<tspan baseline-shift="sub" font-size="70%">in</tspan> = φ<tspan baseline-shift="sub" font-size="70%">B</tspan> + 2π/m':'γ<tspan baseline-shift="sub" font-size="70%">out</tspan> = φ<tspan baseline-shift="sub" font-size="70%">B</tspan>'}</text>`,350,310);
    }
    const outside=loop(false),inside=loop(true);
    const difference='γ<sub>in</sub> − γ<sub>out</sub> = 2π/m';
    const full=svg('Subtract matched loops to isolate braiding','Same loop, field, area and moving quasihole in both runs. Once dynamical phases have been removed or matched, the magnetic contribution cancels and the full-winding phase is 2 pi divided by m.',
      `<text x="380" y="27" text-anchor="middle">Same counterclockwise path, enclosed area A and magnetic field</text><svg x="10" y="42" width="350" height="310">${outside}</svg><svg x="400" y="42" width="350" height="310">${inside}</svg><path d="M72 361H688" stroke="#bbb"/><text x="380" y="404" text-anchor="middle" font-size="25">γ<tspan baseline-shift="sub" font-size="70%">in</tspan> − γ<tspan baseline-shift="sub" font-size="70%">out</tspan> = 2π/m</text><text x="380" y="435" text-anchor="middle">For m = 3: a full winding contributes 2π/3.</text><text x="380" y="473" text-anchor="middle" font-size="16">Common magnetic phase: φ<tspan baseline-shift="sub" font-size="70%">B</tspan> = q<tspan baseline-shift="sub" font-size="70%">h</tspan>Φ/ℏ = −A/(mℓ<tspan baseline-shift="sub" font-size="70%">B</tspan>²)</text>`,495);
    return {title:'Subtract matched loops to isolate braiding',svg:full,
      display:`<p class="figure-shared-condition">Same counterclockwise path, enclosed area A and magnetic field</p><div class="protocol-panels">${outside}${inside}</div><div class="phase-result"><p class="phase-difference">${difference}</p><p>For m = 3: a full winding contributes 2π/3.</p></div><p class="phase-common">Common magnetic phase: φ<sub>B</sub> = q<sub>h</sub>Φ/ℏ = −A/(mℓ<sub>B</sub>²)</p>`,
      summary:'',
      conventions:'Schematic quasihole protocols, not measured data. Counterclockwise transport in B_z = -B_0. Same loop, field and quasihole charge; dynamical phases removed or matched. Stationary core is well inside or well outside, far from the moving core; both remain far from the edge. Screened bulk limit; phases understood modulo 2 pi.',
      data:{kind:'schematic',reference:'stationary quasihole outside',comparison:'stationary quasihole inside',commonMagneticPhase:'q_h Phi/hbar = -A/(m ell_B^2)',windingDifference:'2 pi/m'}};
  }

  function makeFigure(name, value, controls, caption, extra='') {
    return `<figure class="inline-figure ${name}-figure${value.display?' concept-figure':''}" id="figure-${name}">${value.title?`<h3 class="figure-title">${value.title}</h3>`:''}<div id="${name}-drawing" class="figure-drawing" tabindex="0" aria-label="${value.display?'Figure:':'Scrollable'} ${name} figure">${value.display||value.svg}</div><p class="figure-scroll-hint">Swipe or scroll horizontally to view the whole figure.</p><figcaption>${caption}</figcaption>${controls?`<div class="figure-controls">${controls}<button type="button" data-reset-figure="${name}">Reset</button></div>`:''}<p id="${name}-summary" class="figure-summary${value.summary?'':' empty-summary'}" aria-live="polite">${value.summary}</p>${extra}<p class="figure-tools"><button type="button" data-save-svg="${name}">Save SVG</button> <button type="button" data-save-data="${name}">Save data</button> <span id="${name}-download" role="status"></span></p></figure>`;
  }
  const statControl=id=>`<label for="${id}-alpha">Statistics α <select id="${id}-alpha"><option value="0">0 · bosons</option><option value="0.3333333333333333" selected>1/3</option><option value="0.6">3/5</option><option value="1">1 · fermions</option></select></label>`;
  const sepControl=(id,separation=2)=>`<label for="${id}-separation">Label d/ℓ <input id="${id}-separation" type="range" min="0" max="6" step=".01" value="${separation}"><output id="${id}-separation-value">${separation}</output></label>`;
  function initialMarkup(name) {
    if(name==='phonon') return makeFigure(name,phonon(),`<label for="phonon-time">Final time <input id="phonon-time" type="range" min="0" max="60" step="1" value="48"><output id="phonon-time-value">48</output></label>`,'The excess fluctuations move right and spread, while their sum over the chain stays fixed. Mean atomic displacement remains zero. These are three times in the same one-phonon state; harmonic dispersion is included, damping is not.');
    if(name==='charge') return charge();
    if(name==='winding') return makeFigure(name,winding(),'','Both preparations contain two quasiholes; the outside hole supplies an equivalent reference to the calculation above. Dynamical phases are removed or matched. The displayed difference is a full winding, twice the elementary exchange angle. The paths are schematic and the result assumes separated cores in the screened bulk, with the notes’ field convention.');
    if(name==='pair') {const value=pair();return makeFigure(name,value,statControl(name)+sepControl(name),'Both curves use the same statistics and localization label. Only the preparation coefficients change. Positive χ means a larger radial moment than the distinguishable reference; negative χ means smaller. The zero-label value is a formal normalized-state limit, outside the separated-core interpretation.',`<div class="table-scroll"><table><thead><tr><th>Preparation</th><th>χ</th><th>⟨r²⟩ / ℓ²</th></tr></thead><tbody id="pair-table">${value.rows}</tbody></table></div>`);}
    if(name==='saddle') return makeFigure(name,saddle(),statControl(name)+sepControl(name,4)+`<label for="saddle-tau">Time τ <input id="saddle-tau" type="range" min="0" max="1.2" step=".01" value=".6"><output id="saddle-tau-value">0.6</output></label><button type="button" id="saddle-sensitive">Near a sign change</button>`,'Both preparations evolve at matching incoming labels under the specified SU(1,1) saddle. The curve shows the assigned quadratic moment C_alg, not a counting probability; matching its operator to a detector remains a physical requirement. Time only amplifies its initial value. The preparations differ here at finite separation, while sharing their leading large-separation tail. The usable time interval in a real saddle depends on its spatial extent and the validity of level projection.');
    if(name==='collider') return makeFigure(name,collider(),`<label for="collider-r">Junction amplitude r <input id="collider-r" type="range" min=".05" max=".98" step=".01" value=".95"><output id="collider-r-value">0.95</output></label><label for="collider-ratio">Inverse spectral width ℓₚ/L <input id="collider-ratio" type="range" min=".2" max="8" step=".1" value="2.5"><output id="collider-ratio-value">2.5</output></label>`,'A computed illustration of the extended-loop model, with identical simultaneous incident packets and time-integrating detectors. The default fermion probability is below the incoherent-path reference B₁, yet above the measured-one-source reference B₂. Nothing about the exchange rule changed. This figure models bosons and fermions; it does not interpolate to anyons.');
    throw new RangeError('Unknown figure');
  }
  return {phonon,charge,winding,pair,saddle,collider,initialMarkup};
});
