/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const physics = require('../physics.js');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'experiments.html'), 'utf8');
const application = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} differs from ${expected}`);
}

// This adapter runs the unchanged application and its actual event handlers.
// It covers control/data contracts, not browser layout, native range snapping,
// or KaTeX rendering. Those still need browser checks.
function createApp(view) {
  const attributes = source => Object.fromEntries(
    Array.from(source.matchAll(/([\w-]+)="([^"]*)"/g), match => [match[1], match[2]])
  );
  function matches(element, selector) {
    const match = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
    assert.ok(match, `Unsupported test selector: ${selector}`);
    return Object.hasOwn(element.attributes, match[1]) &&
      (match[2] === undefined || element.getAttribute(match[1]) === match[2]);
  }
  class Element {
    constructor(tagName, attrs = {}) {
      this.tagName = tagName;
      this.attributes = { ...attrs };
      this.dataset = Object.fromEntries(Object.entries(attrs)
        .filter(([name]) => name.startsWith('data-'))
        .map(([name, value]) => [name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), value]));
      this.style = {};
      this.handlers = {};
      this.children = [];
      this.value = attrs.value || '';
      this.textContent = '';
      this.innerHTML = '';
      this.disabled = false;
    }
    get value() { return this.currentValue; }
    set value(value) { this.currentValue = String(value); }
    get min() { return this.getAttribute('min'); }
    set min(value) { this.setAttribute('min', value); }
    get max() { return this.getAttribute('max'); }
    set max(value) { this.setAttribute('max', value); }
    get step() { return this.getAttribute('step'); }
    set step(value) { this.setAttribute('step', value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name, callback) { (this.handlers[name] ||= []).push(callback); }
    dispatch(name, target = this) {
      for (const callback of this.handlers[name] || []) callback({ target, preventDefault() {} });
    }
    click() { if (!this.disabled) this.dispatch('click'); }
    closest(selector) { return matches(this, selector) ? this : null; }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    querySelectorAll(selector) { return parseElements(this.innerHTML).filter(element => matches(element, selector)); }
    replaceChildren() { this.children = []; this.value = ''; }
    append(child) { this.children.push(child); if (this.tagName === 'select' && this.children.length === 1) this.value = child.value; }
    focus() { document.activeElement = this; }
    scrollIntoView() {}
  }
  function parseElements(markup) {
    return Array.from(markup.matchAll(/<([a-z][\w-]*)\b[^>]*>/gi), match => new Element(match[1], attributes(match[0])));
  }
  const elements = parseElements(html);
  const element = id => {
    const found = elements.find(item => item.getAttribute('id') === id);
    assert.ok(found, `Missing HTML element: ${id}`);
    return found;
  };
  const document = {
    body: new Element('body'), activeElement: null,
    getElementById: element,
    querySelectorAll: selector => elements.filter(item => matches(item, selector)),
    createElement: tagName => new Element(tagName),
    addEventListener() {}
  };
  const windowEvents = {};
  const window = {
    AnyonPhysics: physics,
    katex: { render: (latex, target) => { target.textContent = latex; } },
    renderMathInElement() {},
    location: { hash: `#${view}` },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener: (name, callback) => { windowEvents[name] = callback; },
    cancelAnimationFrame() {}
  };
  let savedBlob;
  vm.runInNewContext(application, {
    window, document, Blob,
    URL: { createObjectURL: blob => { savedBlob = blob; return 'blob:test'; }, revokeObjectURL() {} }
  }, { filename: 'app.js' });
  return {
    element,
    input(id, value, event = 'input') { element(id).value = value; element(id).dispatch(event); },
    click(id) { element(id).click(); },
    preset(attribute, value) {
      const button = elements.find(item => item.getAttribute(attribute) === value);
      assert.ok(button, `Missing preset: ${attribute}=${value}`);
      button.click();
    },
    cell(svgId, attribute, key) {
      const target = element(svgId).querySelector(`[${attribute}="${key}"]`);
      assert.ok(target, `Missing rendered cell: ${key}`);
      element(svgId).dispatch('click', target);
    },
    navigate(next) { window.location.hash = `#${next}`; windowEvents.hashchange({}); },
    async exportJSON() {
      savedBlob = undefined;
      element('export-json').click();
      assert.ok(savedBlob, 'The export handler did not produce a file');
      return JSON.parse(await savedBlob.text());
    }
  };
}

function checkSixtiethSlider(app, id, expectedTick) {
  const slider = app.element(id);
  assert.equal(slider.min, '0');
  assert.equal(slider.max, '60');
  assert.equal(slider.step, '1');
  assert.equal(slider.value, String(expectedTick));
}

test('Interference slider ticks preserve exact presets and export physical angles', async () => {
  const app = createApp('interference');
  checkSixtiethSlider(app, 'interference-theta', 30);
  app.preset('data-interference-example', 'laughlin');
  checkSixtiethSlider(app, 'interference-theta', 20);
  let data = await app.exportJSON();
  assert.equal(data.parameters.thetaPi, 1 / 3);
  close(data.results.p0, 1 / 4);
  assert.match(app.element('interference-theta-value').textContent, /\\frac\{\\pi\}\{3\}/);

  app.input('interference-theta', 21);
  data = await app.exportJSON();
  assert.equal(data.parameters.thetaPi, 21 / 60);
  close(data.results.statisticalPhase, 7 * Math.PI / 10);
  close(data.results.p0, (1 + Math.cos(7 * Math.PI / 10)) / 2);
  for (const tick of [0, 60]) {
    app.input('interference-theta', tick);
    data = await app.exportJSON();
    assert.equal(data.parameters.thetaPi, tick / 60);
    close(data.results.statisticalPhase, tick === 0 ? 0 : 2 * Math.PI);
    close(data.results.p0, 1);
  }
  app.preset('data-reset', 'interference');
  checkSixtiethSlider(app, 'interference-theta', 30);
  assert.equal((await app.exportJSON()).parameters.thetaPi, 0.5);
});

test('Correlation slider ticks preserve one third and both physical endpoint limits', async () => {
  const app = createApp('correlations');
  checkSixtiethSlider(app, 'correlations-alpha', 20);
  for (const preset of ['close', 'separated']) {
    app.preset('data-correlations-example', preset);
    checkSixtiethSlider(app, 'correlations-alpha', 20);
    const data = await app.exportJSON();
    assert.equal(data.parameters.alpha, 1 / 3);
    assert.equal(data.results.alpha, 1 / 3);
    assert.match(app.element('correlations-alpha-value').textContent, /\\frac\{1\}\{3\}/);
  }
  app.input('correlations-alpha', 21);
  let data = await app.exportJSON();
  assert.equal(data.parameters.alpha, 21 / 60);
  assert.equal(data.results.alpha, 21 / 60);
  app.input('correlations-separation', 0);
  for (const tick of [0, 60]) {
    app.input('correlations-alpha', tick);
    data = await app.exportJSON();
    assert.equal(data.parameters.alpha, tick / 60);
    close(data.results.chi, tick === 0 ? 0 : 1);
    close(data.results.meanSeparationSquared, tick === 0 ? 2 : 6);
  }
  app.preset('data-reset', 'correlations');
  checkSixtiethSlider(app, 'correlations-alpha', 20);
  assert.equal((await app.exportJSON()).parameters.alpha, 1 / 3);
});

test('Custom memory strings give usable instructions and keep seam crossings out of ground-space labels', async () => {
  const app = createApp('memory');
  app.click('memory-clear');
  app.cell('memory-svg', 'data-memory-cell', '0,2');
  app.cell('memory-svg', 'data-memory-cell', '4,2');
  const notice = app.element('memory-notice').textContent;
  assert.match(notice, /select.*neighbor/i);
  assert.doesNotMatch(notice, /continue the worked path/i);
  assert.equal(app.element('memory-path-next').disabled, true);
  assert.equal(app.element('memory-path-prev').disabled, true);
  let data = await app.exportJSON();
  assert.equal(data.parameters.example, 'custom');
  assert.deepEqual(data.results.defects, ['0,2', '4,2']);
  assert.deepEqual(data.results.cutParity, { x: 1, y: 0 });
  assert.equal(data.results.logicalParity, null);
  assert.equal(data.results.groundSpaceLoopEigenvalues, null);
  assert.equal(data.results.energyInJm, 4);
  app.cell('memory-svg', 'data-memory-cell', '4,2');
  app.cell('memory-svg', 'data-memory-cell', '0,2');
  data = await app.exportJSON();
  assert.deepEqual(data.results.defects, []);
  assert.deepEqual(data.results.groundSpaceLoopEigenvalues, { verticalZ: 1, horizontalZ: 1 });
});

test('Braid direction is labeled as a future choice and only affects the appended generator', async () => {
  const label = /<label\b[^>]*for="braids-direction"[^>]*>([\s\S]*?)<\/label>/.exec(html);
  assert.ok(label);
  assert.match(label[1], /next exchange/i);
  const app = createApp('braids');
  const before = await app.exportJSON();
  app.input('braids-direction', -1);
  const unchanged = await app.exportJSON();
  assert.deepEqual(unchanged.parameters.word, [1, 2]);
  assert.deepEqual(unchanged.results.finalA, before.results.finalA);
  app.preset('data-braid', '2');
  const changed = await app.exportJSON();
  assert.deepEqual(changed.parameters.word, [1, 2, -2]);
  // B2 and its inverse cancel, leaving the +z quarter-turn of |+>.
  close(changed.results.blochA.x, 0);
  close(changed.results.blochA.y, 1);
  close(changed.results.blochA.z, 0);
  close(changed.results.measurementA.plus, 0.5);
  assert.match(app.element('braids-svg').innerHTML, /B2\^-1/);
});

test('Direct fusion-path selection, navigation buttons, and changed sectors stay synchronized', async () => {
  const app = createApp('fusion');
  const selector = app.element('fusion-path-index');
  assert.equal(selector.min, '1');
  assert.equal(selector.max, '2');
  assert.equal(selector.step, '1');
  assert.equal(selector.value, '1');
  app.input('fusion-path-index', 2);
  let data = await app.exportJSON();
  assert.equal(data.parameters.pathIndex, 1);
  assert.deepEqual(data.results.selectedPath, ['tau', 'tau', 'tau', 'vacuum']);
  assert.match(app.element('fusion-path-position').textContent, /Path 2 of 2/);
  assert.equal(app.element('fusion-path-next').disabled, true);
  app.click('fusion-path-prev');
  assert.equal(selector.value, '1');
  app.click('fusion-path-next');
  assert.equal(selector.value, '2');

  app.input('fusion-number', 16);
  assert.equal(selector.value, '1');
  assert.equal(selector.max, '610');
  app.input('fusion-charge', 'tau', 'change');
  assert.equal(selector.value, '1');
  assert.equal(selector.max, '987');
  app.input('fusion-path-index', 987);
  data = await app.exportJSON();
  assert.equal(data.parameters.pathIndex, 986);
  assert.deepEqual(data.results.selectedPath, Array(16).fill('tau'));
  assert.match(app.element('fusion-path-position').textContent, /Path 987 of 987/);
  app.input('fusion-number', 2);
  assert.equal(selector.value, '1');
  assert.equal(selector.max, '1');
  assert.equal(app.element('fusion-path-next').disabled, true);
  assert.equal((await app.exportJSON()).parameters.pathIndex, 0);
});
