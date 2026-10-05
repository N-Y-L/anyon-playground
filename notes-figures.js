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
    const left=72,right=726,top=146,bottom=352;
    const maximum=Math.ceil(Math.max(...snapshots[0].excessVariance)/.025)*.025;
    const x=j=>left+(right-left)*(j+64)/128;
    const y=v=>bottom-(bottom-top)*v/maximum;
    let body='<text x="72" y="26">Mean displacement: ⟨uⱼ⟩ = 0 at every site and time</text>';
    body+='<path d="M72 65H726" stroke="#777"/>';
    for(let j=-64;j<=64;j+=4) body+=`<circle cx="${x(j)}" cy="65" r="2.2" fill="#555"/>`;
    body+='<text x="72" y="115">Excess displacement variance, in ℏ / √(κM)</text>';
    for(const value of [0,maximum/2,maximum])body+=`<path d="M72 ${y(value)}H726" stroke="#ddd"/><text x="61" y="${y(value)+6}" text-anchor="end">${f(value,3)}</text>`;
    body+=`<path d="M72 ${top}V${bottom}H726" stroke="#222" fill="none"/>`;
    for(const j of [-64,-32,0,32,64])body+=`<path d="M${x(j)} ${bottom}v5" stroke="#222"/><text x="${x(j)}" y="${bottom+27}" text-anchor="middle">${j}</text>`;
    const colors=[grey,red,blue],dashes=['3 5','9 5',''];
    snapshots.forEach((snapshot,index)=>{
      const dash=dashes[index]?` stroke-dasharray="${dashes[index]}"`:'';
      body+=`<path d="${snapshot.positions.map((j,n)=>`${n?'L':'M'}${x(j).toFixed(2)},${y(snapshot.excessVariance[n]).toFixed(2)}`).join(' ')}" stroke="${colors[index]}" stroke-width="2.5" fill="none"${dash}/>`;
      const lx=76+index*219;
      body+=`<path d="M${lx} 427h32" stroke="${colors[index]}" stroke-width="2.5"${dash}/><text x="${lx+42}" y="433">t = ${f(times[index],1)}</text>`;
    });
    body+='<text x="400" y="405" text-anchor="middle">Site j (position ja)</text><text x="72" y="466">Times in √(M/κ); N = 128; central wave number k₀a = π/3</text>';
    const peak=snapshot=>snapshot.positions[snapshot.excessVariance.indexOf(Math.max(...snapshot.excessVariance))];
    return {svg:svg('A one-phonon packet carries fluctuations along the chain','Three exact harmonic-chain snapshots of excess displacement variance. The mean displacement at every site remains zero. Curves use the same vertical scale and distinct line styles.',body,490),
      summary:`The variance peaks near sites ${snapshots.map(peak).join(', ')} at times ${times.map(t=>f(t,1)).join(', ')}. Its summed excess stays ${f(snapshots[0].varianceSum,4)} in units ℏ/√(κM); the mean displacement stays zero.`,
      conventions:'Periodic harmonic chain; zero translation mode omitted. Position is in lattice spacings a, time in sqrt(M/kappa), frequency in sqrt(kappa/M), energy in hbar sqrt(kappa/M), and excess displacement variance in hbar/sqrt(kappa M). The variance is not a phonon position probability. No anharmonic damping is modeled.',
      data:{time,snapshots}};
  }
  function panel(title,description,body,width=350,height=320) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}" style="font-family:Georgia,serif;font-size:18px"><title>${title}</title><desc>${description}</desc><rect width="${width}" height="${height}" fill="white"/>${body}</svg>`;
  }
  function charge() {
    const drawing=panel('Measure the charge inside D, leaving the compensation outside','A schematic finite electron droplet. The dashed local measurement disk D contains the quasihole core and excludes the distant compensating region near the edge.',
      '<text x="175" y="24" text-anchor="middle">Finite electron droplet</text><circle cx="175" cy="184" r="120" fill="#e4e4e4" stroke="#444" stroke-width="1.5"/><circle cx="175" cy="184" r="100" fill="white"/><circle cx="175" cy="184" r="65" fill="none" stroke="#222" stroke-width="2" stroke-dasharray="7 5"/><circle cx="175" cy="184" r="18" fill="#e6eef4" stroke="#145b91" stroke-width="2"/><text x="175" y="222" text-anchor="middle">core</text><text x="239" y="132">D</text><path d="M82 60L102 98" stroke="#555"/><text x="30" y="51">distant compensation</text>');
    const ledger='<div class="charge-ledger"><p><strong>Inside D</strong><br>Mean electron-number change ≈ −1/m<br>Electric charge ≈ +e/m</p><p><strong>Outside D, mostly near the edge</strong><br>Mean electron-number change ≈ +1/m<br>Electric charge ≈ −e/m</p><p><strong>Whole droplet</strong><br>Same N electrons: ΔN = 0<br>Total charge change: ΔQ = 0</p></div>';
    const labels='<text x="380" y="62" font-weight="bold">Inside D</text><text x="380" y="92">Mean electron-number change ≈ −1/m</text><text x="380" y="120">Electric charge ≈ +e/m</text><text x="380" y="172" font-weight="bold">Outside D, mostly near the edge</text><text x="380" y="202">Mean electron-number change ≈ +1/m</text><text x="380" y="230">Electric charge ≈ −e/m</text><text x="380" y="282" font-weight="bold">Whole droplet: ΔN = 0, ΔQ = 0</text><text x="28" y="355">Spatial bookkeeping in the screened bulk limit; no density profile is plotted.</text>';
    const full=svg('Fractional local charge without removing an electron','The local electronic deficit and distant compensation cancel over the full same-N system. Geometry and shading are schematic, not a calculated density.',`<svg x="0" y="0" width="350" height="320">${drawing}</svg>${labels}`,380);
    return {svg:full,display:`<div class="charge-layout">${drawing}${ledger}</div>`,
      summary:'For m = 3, the local charge approaches +e/3 even though the total electron number is unchanged.',
      conventions:'Charge-accounting schematic for a finite same-electron-number Laughlin droplet in the screened, well-separated bulk limit. The local charge approaches e/m; the total number difference is exactly zero. Shading is not a computed electron density or an auxiliary plasma charge.',
      data:{kind:'schematic',localMeanElectronNumberChange:'approximately -1/m',localElectricCharge:'approximately +e/m',wholeDropletElectronNumberChange:0}};
  }
  function winding() {
    function loop(inside) {
      const stationary=inside?175:53;
      return panel(inside?'Stationary quasihole inside the loop':'Stationary quasihole outside the loop',
        'One quasihole follows the same counterclockwise circle in both preparations. The stationary quasihole is well inside or well outside. Path geometry is schematic.',
        `<text x="175" y="27" text-anchor="middle">Stationary hole ${inside?'inside':'outside'}</text><circle cx="175" cy="146" r="78" fill="none" stroke="${blue}" stroke-width="2.5"/><path d="M169 62L157 68L169 74" fill="none" stroke="${blue}" stroke-width="2.5"/><circle cx="253" cy="146" r="7" fill="white" stroke="${blue}" stroke-width="2.5"/><path d="M263 144L281 126" stroke="#555"/><text x="257" y="114">moving</text><circle cx="${stationary}" cy="146" r="6" fill="#222"/><text x="${stationary}" y="177" text-anchor="middle">fixed</text><text x="175" y="251" text-anchor="middle">Same CCW path, area A</text><text x="175" y="294" text-anchor="middle">${inside?'γ<tspan baseline-shift="sub" font-size="70%">in</tspan> = φ<tspan baseline-shift="sub" font-size="70%">B</tspan> + 2π/m':'γ<tspan baseline-shift="sub" font-size="70%">out</tspan> = φ<tspan baseline-shift="sub" font-size="70%">B</tspan>'}</text>`);
    }
    const outside=loop(false),inside=loop(true);
    const full=svg('Matched winding paths isolate the statistical phase','Compare a stationary quasihole outside and inside an identical counterclockwise loop. The common magnetic contribution cancels; in the screened bulk limit the extra full-winding phase is 2 pi divided by m.',
      `<svg x="10" y="0" width="350" height="320">${outside}</svg><svg x="400" y="0" width="350" height="320">${inside}</svg><text x="380" y="355" text-anchor="middle">γ<tspan baseline-shift="sub" font-size="70%">in</tspan> − γ<tspan baseline-shift="sub" font-size="70%">out</tspan> = 2π/m → 2π/3 for m = 3</text><text x="380" y="390" text-anchor="middle">φ<tspan baseline-shift="sub" font-size="70%">B</tspan> = q<tspan baseline-shift="sub" font-size="70%">h</tspan>Φ/ℏ = −A/(mℓ<tspan baseline-shift="sub" font-size="70%">B</tspan>²), common to the two paths</text>`,415);
    return {svg:full,display:`<div class="protocol-panels">${outside}${inside}</div><p class="phase-difference">γ<sub>in</sub> − γ<sub>out</sub> = 2π/m → 2π/3 for m = 3</p><p class="phase-common">φ<sub>B</sub> = q<sub>h</sub>Φ/ℏ = −A/(mℓ<sub>B</sub>²), common to the two paths</p>`,
      summary:'Each run retains its magnetic phase. Subtracting matched runs isolates a full winding, not a single exchange.',
      conventions:'Schematic quasihole protocols, not measured data. Counterclockwise transport in B_z = -B_0. Same loop, field and quasihole charge; dynamical phases removed or matched. Stationary core is well inside or well outside, far from the moving core; both remain far from the edge. Screened bulk limit; phases understood modulo 2 pi.',
      data:{kind:'schematic',reference:'stationary quasihole outside',comparison:'stationary quasihole inside',commonMagneticPhase:'q_h Phi/hbar = -A/(m ell_B^2)',windingDifference:'2 pi/m'}};
  }

  function makeFigure(name, value, controls, caption, extra='') {
    return `<figure class="inline-figure${value.display?' concept-figure':''}" id="figure-${name}"><div id="${name}-drawing" class="figure-drawing" tabindex="0" aria-label="${value.display?'Diagram:':'Scrollable'} ${name} figure">${value.display||value.svg}</div><p class="figure-scroll-hint">Swipe or scroll horizontally to view the whole figure.</p><figcaption>${caption}</figcaption>${controls?`<div class="figure-controls">${controls}<button type="button" data-reset-figure="${name}">Reset</button></div>`:''}<p id="${name}-summary" class="figure-summary" aria-live="polite">${value.summary}</p>${extra}<p class="figure-tools"><button type="button" data-save-svg="${name}">Save SVG</button> <button type="button" data-save-data="${name}">Save data</button> <span id="${name}-download" role="status"></span></p></figure>`;
  }
  const statControl=id=>`<label for="${id}-alpha">Statistics α <select id="${id}-alpha"><option value="0">0 · bosons</option><option value="0.3333333333333333" selected>1/3</option><option value="0.6">3/5</option><option value="1">1 · fermions</option></select></label>`;
  const sepControl=(id,separation=2)=>`<label for="${id}-separation">Label d/ℓ <input id="${id}-separation" type="range" min="0" max="6" step=".01" value="${separation}"><output id="${id}-separation-value">${separation}</output></label>`;
  function initialMarkup(name) {
    if(name==='phonon') return makeFigure(name,phonon(),`<label for="phonon-time">Last snapshot time <input id="phonon-time" type="range" min="0" max="60" step="1" value="48"><output id="phonon-time-value">48</output></label>`,'Exact snapshots of the one-phonon state specified above, at the initial, halfway and selected final times. The lower curves show excess displacement variance, not mean atomic displacement or a phonon position probability. Harmonic dispersion spreads the packet slightly; no damping is modeled. The upper dots mark the zero mean at fixed sites. Times are in √(M/κ).');
    if(name==='charge') return makeFigure(name,charge(),'','The disk D includes the localized deficit but excludes distant electronic compensation. The charge inside D approaches +e/m in the screened bulk limit, while integrating the density difference over the whole same-N droplet gives exactly zero. Shading marks regions only; no density profile or microscopic length scale is asserted. This physical compensation is distinct from neutralization of the fictitious plasma impurity used in the derivation.');
    if(name==='winding') return makeFigure(name,winding(),'','An equivalent reference keeps two quasiholes in both preparations. In the reference the fixed hole lies well outside the loop; in the second preparation it lies well inside. The moving hole follows the same path in the same field. After removing or matching dynamical phases, the common electromagnetic phase φ<sub>B</sub> cancels. The +2π/m difference uses the notes’ field and counterclockwise conventions, in the screened bulk limit with cores and edge well separated. These diagrams do not specify physical radii.');
    if(name==='pair') {const value=pair();return makeFigure(name,value,statControl(name)+sepControl(name),'Both curves use the same statistics and localization label. Only the preparation coefficients change. Positive χ means a larger radial moment than the distinguishable reference; negative χ means smaller. The zero-label value is a formal normalized-state limit, outside the separated-core interpretation.',`<div class="table-scroll"><table><thead><tr><th>Preparation</th><th>χ</th><th>⟨r²⟩ / ℓ²</th></tr></thead><tbody id="pair-table">${value.rows}</tbody></table></div>`);}
    if(name==='saddle') return makeFigure(name,saddle(),statControl(name)+sepControl(name,4)+`<label for="saddle-tau">Time τ <input id="saddle-tau" type="range" min="0" max="1.2" step=".01" value=".6"><output id="saddle-tau-value">0.6</output></label><button type="button" id="saddle-sensitive">Near a sign change</button>`,'Both preparations evolve at matching incoming labels under the specified SU(1,1) saddle. The curve shows the assigned quadratic moment C_alg, not a counting probability; matching its operator to a detector remains a physical requirement. Time only amplifies its initial value. The preparations differ here at finite separation, while sharing their leading large-separation tail. The usable time interval in a real saddle depends on its spatial extent and the validity of level projection.');
    if(name==='collider') return makeFigure(name,collider(),`<label for="collider-r">Junction amplitude r <input id="collider-r" type="range" min=".05" max=".98" step=".01" value=".95"><output id="collider-r-value">0.95</output></label><label for="collider-ratio">Inverse spectral width ℓₚ/L <input id="collider-ratio" type="range" min=".2" max="8" step=".1" value="2.5"><output id="collider-ratio-value">2.5</output></label>`,'A computed illustration of the extended-loop model, with identical simultaneous incident packets and time-integrating detectors. The default fermion probability is below the incoherent-path reference B₁, yet above the measured-one-source reference B₂. Nothing about the exchange rule changed. This figure models bosons and fermions; it does not interpolate to anyons.');
    throw new RangeError('Unknown figure');
  }
  return {phonon,charge,winding,pair,saddle,collider,initialMarkup};
});
