/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');

// Exercise the actual saved reading page and its browser scripts. This adapter
// enforces select-option matching and event wiring; it does not test layout,
// native range snapping, focus, or browser download permissions.
function createNotes() {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'docs/notes.html'), 'utf8');
  const byId = new Map();
  const figures = new Map();
  const downloads = [];
  const revoked = [];
  const attributes = source => Object.fromEntries(
    Array.from(source.matchAll(/\s([\w-]+)(?:="([^"]*)")?/g), match => [match[1], match[2] ?? ''])
  );

  class Element {
    constructor(tag, attrs = {}) {
      this.tag = tag;
      this.attrs = attrs;
      this.id = attrs.id;
      this.currentValue = attrs.value || '';
      this.options = null;
      this.children = [];
      this.handlers = {};
      this.innerHTML = '';
      this.textContent = '';
    }
    get value() { return this.currentValue; }
    set value(value) {
      const text = String(value);
      this.currentValue = this.options && !this.options.includes(text) ? '' : text;
    }
    addEventListener(name, handler) { (this.handlers[name] ||= []).push(handler); }
    dispatch(name) { for (const handler of this.handlers[name] || []) handler({ target: this }); }
    click() { this.dispatch('click'); }
    querySelectorAll(selector) {
      if (selector === 'input,select') return this.children.filter(node => ['input', 'select'].includes(node.tag));
      if (selector === 'input') return this.children.filter(node => node.tag === 'input');
      const attribute = /^\[([\w-]+)\]$/.exec(selector);
      assert.ok(attribute, `Unsupported test selector ${selector}`);
      return this.children.filter(node => Object.hasOwn(node.attrs, attribute[1]));
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    replaceChildren(...children) { this.children = children; }
  }

  for (const match of html.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/g)) {
    const figure = new Element('figure', attributes(match[1]));
    figures.set(figure.id, figure);
    byId.set(figure.id, figure);
    for (const node of match[2].matchAll(/<([a-z][\w-]*)\b([^>]*)>/g)) {
      const element = new Element(node[1], attributes(node[2]));
      figure.children.push(element);
      if (element.id) byId.set(element.id, element);
    }
    for (const select of match[2].matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)) {
      const element = byId.get(attributes(select[1]).id);
      const options = Array.from(select[2].matchAll(/<option\b([^>]*)>/g), entry => attributes(entry[1]));
      element.options = options.map(option => option.value);
      element.value = (options.find(option => Object.hasOwn(option, 'selected')) || options[0]).value;
    }
  }

  const sandbox = {
    document: { getElementById: id => byId.get(id) || null, createElement: tag => new Element(tag) },
    Blob,
    URL: {
      createObjectURL(blob) { downloads.push(blob); return `blob:notes-${downloads.length}`; },
      revokeObjectURL(url) { revoked.push(url); }
    }
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  // The generated page's actual load order must establish model globals
  // before rendering helpers, then bind the interaction handlers.
  const sources = Array.from(html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g), match => match[1]);
  assert.deepEqual(sources.map(source => source.split('?')[0]), ['../pair-states-physics.js', '../collider-physics.js', '../phonon-physics.js', '../notes-figures.js', '../notes-interactions.js']);
  for (const source of sources) {
    const [file, query] = source.split('?');
    const script = fs.readFileSync(path.join(root, 'docs', file), 'utf8');
    assert.equal(query, 'v=' + createHash('sha256').update(script).digest('hex').slice(0, 12), 'Changed scripts need fresh cache URLs');
    vm.runInContext(script, context, { filename: file });
  }

  return {
    element(id) { assert.ok(byId.has(id), `Missing control ${id}`); return byId.get(id); },
    input(id, value) { this.element(id).value = value; this.element(id).dispatch('input'); },
    reset(name) { figures.get(`figure-${name}`).querySelector('[data-reset-figure]').click(); },
    click(id) { this.element(id).click(); },
    async save(name, kind = 'data') {
      const count = downloads.length;
      figures.get(`figure-${name}`).querySelector(`[data-save-${kind}]`).click();
      assert.equal(downloads.length, count + 1, 'Save handler did not produce a download');
      const text = await downloads.at(-1).text();
      return kind === 'data' ? JSON.parse(text) : text;
    },
    revoked,
    get downloadCount() { return downloads.length; }
  };
}

test('Reading-page controls, exact statistics presets, resets, and exported results remain synchronized', async () => {
  const page = createNotes();
  for (const name of ['pair', 'saddle', 'collider']) {
    assert.match(page.element(`${name}-drawing`).innerHTML, /<svg/);
    assert.doesNotMatch(page.element(`${name}-summary`).textContent, /Could not calculate/);
  }

  let data = await page.save('pair');
  assert.equal(data.results.alpha, 1 / 3);
  assert.equal(data.results.separation, 2);
  assert.ok(Math.abs(data.results.localized.chi + 0.11925881920748752) < 1e-12);
  page.input('pair-alpha', '1');
  page.input('pair-separation', '0');
  data = await page.save('pair');
  assert.equal(data.results.localized.chi, 1);
  assert.equal(data.results.coherent.chi, 1);
  assert.equal(data.results.localized.radialMoment, 6);
  assert.equal(page.element('pair-separation-value').textContent, '0');
  assert.match(page.element('pair-table').innerHTML, /<td>6<\/td>/);
  page.reset('pair');
  assert.equal((await page.save('pair')).results.alpha, 1 / 3);

  page.click('saddle-sensitive');
  assert.equal(page.element('saddle-alpha').value, '0.6');
  data = await page.save('saddle');
  assert.equal(data.results.alpha, 0.6);
  assert.equal(data.results.separation, 2.1);
  // This setting exposes the correction: localized chi is positive while
  // the assigned outgoing moment is also positive, despite the naive -chi rule.
  assert.ok(data.results.localized.initial.chi > 0);
  assert.ok(data.results.localized.outgoingMoment > 0);
  page.input('saddle-tau', '0');
  const before = (await page.save('saddle')).results.localized.outgoingMoment;
  page.input('saddle-tau', '1.2');
  const after = (await page.save('saddle')).results.localized.outgoingMoment;
  assert.ok(Math.abs(after / before - Math.exp(2.4)) < 1e-12);
  page.reset('saddle');
  data = await page.save('saddle');
  assert.equal(data.results.alpha, 1 / 3);
  assert.equal(data.results.separation, 4);
  assert.equal(data.results.tau, 0.6);
  assert.match(data.conventions, /assigned algebraic moment/);
  const svg = await page.save('saddle', 'svg');
  assert.match(svg, /C_alg \/ ℓ²/);
  assert.match(svg, /α = 1\/3; initial label d\/ℓ = 4; marker τ = 0\.6/);
  assert.match(page.element('saddle-summary').textContent, /α = 1\/3, d\/ℓ = 4 and τ = 0\.6/);
  assert.doesNotMatch(svg, /<image\b|data:image/);

  page.input('collider-r', '.8');
  page.input('collider-ratio', '1.5');
  data = await page.save('collider');
  assert.equal(data.results.r, 0.8);
  assert.equal(data.results.ratio, 1.5);
  page.reset('collider');
  data = await page.save('collider');
  assert.equal(data.results.r, 0.95);
  assert.equal(data.results.ratio, 2.5);
  assert.ok(data.results.fermion < data.results.B1);
  assert.ok(data.results.fermion > data.results.B2);
  assert.ok(data.results.boson < data.results.B2);
  assert.ok(data.results.converged);
  assert.equal(page.revoked.length, page.downloadCount - 3, 'Each replacement download should release its previous object URL');
});

// Verify the new calculations stay connected to the saved page, including offline defaults.
test('Early reading figures retain exact packet data, reset behavior and vector exports', async () => {
  const page=createNotes();
  for(const name of ['phonon','charge','winding']) {
    assert.match(page.element(`${name}-drawing`).innerHTML, /<svg/);
    assert.doesNotMatch(page.element(`${name}-summary`).textContent, /Could not calculate/);
    const svg=await page.save(name,'svg');
    assert.doesNotMatch(svg, /<image\b|data:image/);
    assert.match(svg, /<title>/);
  }
  let data=await page.save('phonon');
  assert.equal(data.results.time,48);
  assert.deepEqual(data.results.snapshots.map(x=>x.parameters.time),[0,24,48]);
  assert.match(data.conventions,/not a phonon position probability/);
  page.input('phonon-time','60');
  data=await page.save('phonon');
  assert.deepEqual(data.results.snapshots.map(x=>x.parameters.time),[0,30,60]);
  assert.equal(page.element('phonon-time-value').textContent,'60');
  page.reset('phonon');
  assert.equal((await page.save('phonon')).results.time,48);
});
