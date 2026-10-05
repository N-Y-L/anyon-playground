/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
(function () {
  'use strict';
  const F=window.AnyonNotesFigures, values={}, downloadURLs={};
  const el=id=>document.getElementById(id);
  const number=id=>Number(el(id).value);
  function update(name) {
    try {
      let parameters;
      if(name==='collider') parameters={r:number('collider-r'),ratio:number('collider-ratio')};
      else {parameters={alpha:number(`${name}-alpha`),separation:number(`${name}-separation`)};if(name==='saddle')parameters.tau=number('saddle-tau');}
      const result=F[name](parameters);values[name]=result;
      el(`${name}-drawing`).innerHTML=result.svg;
      el(`${name}-summary`).textContent=result.summary;
      if(result.rows)el('pair-table').innerHTML=result.rows;
      for(const input of el(`figure-${name}`).querySelectorAll('input')) {const out=el(input.id+'-value');if(out)out.textContent=Number(input.value).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');}
    } catch(error) {el(`${name}-summary`).textContent=`Could not calculate this setting: ${error.message}`;}
  }
  function reset(name) {
    if(name==='collider'){el('collider-r').value=.95;el('collider-ratio').value=2.5;}
    else{el(`${name}-alpha`).value=String(1/3);el(`${name}-separation`).value=2;if(name==='saddle')el('saddle-tau').value=.6;}
    update(name);
  }
  function save(name,kind) {
    const result=values[name], mime=kind==='svg'?'image/svg+xml':'application/json';
    const body=kind==='svg'?result.svg:JSON.stringify({model:name,conventions:'See the adjacent notes. Guiding-center lengths use ell; collider length ell_p is inverse spectral width. C_alg is an assigned algebraic moment, not a detector probability.',results:result.data},null,2);
    if(downloadURLs[name])URL.revokeObjectURL(downloadURLs[name]);
    const url=URL.createObjectURL(new Blob([body],{type:mime}));downloadURLs[name]=url;
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`anyon-${name}.${kind==='svg'?'svg':'json'}`;anchor.textContent='Download again';
    el(`${name}-download`).replaceChildren(anchor);anchor.click();
  }
  for(const name of ['pair','saddle','collider']){
    const figure=el(`figure-${name}`);if(!figure)continue;
    figure.querySelectorAll('input,select').forEach(input=>input.addEventListener('input',()=>update(name)));
    figure.querySelector('[data-reset-figure]').addEventListener('click',()=>reset(name));
    figure.querySelector('[data-save-svg]').addEventListener('click',()=>save(name,'svg'));
    figure.querySelector('[data-save-data]').addEventListener('click',()=>save(name,'json'));
    update(name);
  }
  el('saddle-sensitive')?.addEventListener('click',()=>{el('saddle-alpha').value='.6';if(el('saddle-alpha').value==='')el('saddle-alpha').value='0.6';el('saddle-separation').value=2.1;update('saddle');});
})();
