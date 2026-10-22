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
// native range snapping or focus.
function createNotes() {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'docs/notes.html'), 'utf8');
  const byId = new Map();
  const figures = new Map();
  const calculations = new Map();
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
    document: { getElementById: id => byId.get(id) || null }
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  // The generated page's actual load order must establish model globals
  // before rendering helpers, then bind the interaction handlers.
  const sources = Array.from(html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g), match => match[1]);
  assert.deepEqual(sources.map(source => source.split('?')[0]), ['../src/models/pair-states-physics.js', '../src/models/collider-physics.js', '../src/models/phonon-physics.js', '../src/figures/notes-figures.js', '../src/pages/notes-interactions.js']);
  for (const source of sources) {
    const [file, query] = source.split('?');
    const script = fs.readFileSync(path.join(root, 'docs', file), 'utf8');
    assert.equal(query, 'v=' + createHash('sha256').update(script).digest('hex').slice(0, 12), 'Changed scripts need fresh cache URLs');
    if (file.endsWith('/notes-interactions.js')) {
      // Observe the figure calculations requested by the real controller,
      // without exposing its private state.
      for (const name of ['phonon', 'winding', 'pair', 'saddle', 'collider']) {
        const calculate = sandbox.AnyonNotesFigures[name];
        sandbox.AnyonNotesFigures[name] = parameters => {
          const result = calculate(parameters);
          calculations.set(name, result);
          return result;
        };
      }
    }
    vm.runInContext(script, context, { filename: file });
  }

  return {
    element(id) { assert.ok(byId.has(id), `Missing control ${id}`); return byId.get(id); },
    input(id, value) { this.element(id).value = value; this.element(id).dispatch('input'); },
    reset(name) { figures.get(`figure-${name}`).querySelector('[data-reset-figure]').click(); },
    click(id) { this.element(id).click(); },
    result(name) {
      const result = calculations.get(name);
      assert.ok(result, `The controller did not calculate ${name}`);
      assert.equal(this.element(`${name}-drawing`).innerHTML, result.display || result.svg);
      assert.equal(this.element(`${name}-summary`).textContent, result.summary);
      if (result.rows) assert.equal(this.element('pair-table').innerHTML, result.rows);
      return JSON.parse(JSON.stringify(result));
    }
  };
}

test('Reading-page controls, exact statistics presets, resets, and displayed results remain synchronized', () => {
  const page = createNotes();
  for (const name of ['pair', 'saddle', 'collider']) {
    assert.match(page.element(`${name}-drawing`).innerHTML, /<svg/);
    assert.doesNotMatch(page.element(`${name}-summary`).textContent, /Could not calculate/);
  }

  let result = page.result('pair');
  assert.equal(result.data.alpha, 1 / 3);
  assert.equal(result.data.separation, 2);
  assert.ok(Math.abs(result.data.localized.chi + 0.11925881920748752) < 1e-12);
  page.input('pair-alpha', '1');
  page.input('pair-separation', '0');
  result = page.result('pair');
  assert.equal(result.data.localized.chi, 1);
  assert.equal(result.data.coherent.chi, 1);
  assert.equal(result.data.localized.radialMoment, 6);
  assert.equal(page.element('pair-separation-value').textContent, '0');
  assert.match(page.element('pair-table').innerHTML, /<td>6<\/td>/);
  page.reset('pair');
  assert.equal(page.result('pair').data.alpha, 1 / 3);

  page.click('saddle-sensitive');
  assert.equal(page.element('saddle-alpha').value, '0.6');
  result = page.result('saddle');
  assert.equal(result.data.alpha, 0.6);
  assert.equal(result.data.separation, 2.1);
  // This setting exposes the correction: localized chi is positive while
  // the assigned outgoing moment is also positive, despite the naive -chi rule.
  assert.ok(result.data.localized.initial.chi > 0);
  assert.ok(result.data.localized.outgoingMoment > 0);
  page.input('saddle-tau', '0');
  const before = page.result('saddle').data.localized.outgoingMoment;
  page.input('saddle-tau', '1.2');
  const after = page.result('saddle').data.localized.outgoingMoment;
  assert.ok(Math.abs(after / before - Math.exp(2.4)) < 1e-12);
  page.reset('saddle');
  result = page.result('saddle');
  assert.equal(result.data.alpha, 1 / 3);
  assert.equal(result.data.separation, 4);
  assert.equal(result.data.tau, 0.6);
  const svg = page.element('saddle-drawing').innerHTML;
  assert.match(svg, /C_alg \/ ℓ²/);
  assert.match(svg, /α = 1\/3; initial label d\/ℓ = 4; marker τ = 0\.6/);
  assert.match(page.element('saddle-summary').textContent, /α = 1\/3, d\/ℓ = 4 and τ = 0\.6/);
  assert.doesNotMatch(svg, /<image\b|data:image/);

  page.input('collider-r', '.8');
  page.input('collider-ratio', '1.5');
  result = page.result('collider');
  assert.equal(result.data.r, 0.8);
  assert.equal(result.data.ratio, 1.5);
  page.reset('collider');
  result = page.result('collider');
  assert.equal(result.data.r, 0.95);
  assert.equal(result.data.ratio, 2.5);
  assert.ok(result.data.fermion < result.data.B1);
  assert.ok(result.data.fermion > result.data.B2);
  assert.ok(result.data.boson < result.data.B2);
  assert.ok(result.data.converged);
});

// Verify the new calculations stay connected to the saved page, including offline defaults.
test('Early reading figures retain exact packet data, reset behavior and vector drawings', () => {
  const page=createNotes();
  for(const name of ['phonon','winding']) {
    assert.match(page.element(`${name}-drawing`).innerHTML, /<svg/);
    assert.doesNotMatch(page.element(`${name}-summary`).textContent, /Could not calculate/);
    const svg=page.element(`${name}-drawing`).innerHTML;
    assert.doesNotMatch(svg, /<image\b|data:image/);
    assert.match(svg, /<title>/);
  }
  let result=page.result('phonon');
  assert.equal(result.data.time,48);
  assert.deepEqual(result.data.snapshots.map(x=>x.parameters.time),[0,24,48]);
  assert.match(result.conventions,/not a phonon position probability/);
  page.input('phonon-time','60');
  result=page.result('phonon');
  assert.deepEqual(result.data.snapshots.map(x=>x.parameters.time),[0,30,60]);
  assert.equal(page.element('phonon-time-value').textContent,'60');
  page.reset('phonon');
  assert.equal(page.result('phonon').data.time,48);
});
