/* Copyright (c) 2026 Neil Yuanting Li. MIT License; see LICENSE. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const physics = require('../src/models/physics.js');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'experiments.html'), 'utf8');
const application = fs.readFileSync(path.join(root, 'src/pages/app.js'), 'utf8');

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
  // Observe the real model calls made by each interaction. This retains exact
  // numerical checks without adding test-only access to the page controller.
  const calculations = new Map();
  const observedPhysics = Object.fromEntries(Object.entries(physics).map(([name, value]) => [name,
    typeof value !== 'function' ? value : (...args) => {
      const result = value(...args);
      const call = JSON.parse(JSON.stringify({ args, result }));
      if (!calculations.has(name)) calculations.set(name, []);
      calculations.get(name).push(call);
      return result;
    }
  ]));
  const windowEvents = {};
  const window = {
    AnyonPhysics: observedPhysics,
    katex: { render: (latex, target) => { target.textContent = latex; } },
    renderMathInElement() {},
    location: { hash: `#${view}` },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener: (name, callback) => { windowEvents[name] = callback; },
    cancelAnimationFrame() {}
  };
  vm.runInNewContext(application, { window, document }, { filename: 'app.js' });
  return {
    element,
    input(id, value, event = 'input') { calculations.clear(); element(id).value = value; element(id).dispatch(event); },
    click(id) { calculations.clear(); element(id).click(); },
    preset(attribute, value) {
      const button = elements.find(item => item.getAttribute(attribute) === value);
      assert.ok(button, `Missing preset: ${attribute}=${value}`);
      calculations.clear(); button.click();
    },
    cell(svgId, attribute, key) {
      const target = element(svgId).querySelector(`[${attribute}="${key}"]`);
      assert.ok(target, `Missing rendered cell: ${key}`);
      calculations.clear(); element(svgId).dispatch('click', target);
    },
    navigate(next) { calculations.clear(); window.location.hash = `#${next}`; windowEvents.hashchange({}); },
    calculation(name) {
      const calls = calculations.get(name);
      assert.ok(calls?.length, `The interaction did not call ${name}`);
      return calls[0];
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

test('Interference slider ticks preserve exact presets and display physical angles', () => {
  const app = createApp('interference');
  checkSixtiethSlider(app, 'interference-theta', 30);
  app.preset('data-interference-example', 'laughlin');
  checkSixtiethSlider(app, 'interference-theta', 20);
  let calculation = app.calculation('interference');
  close(calculation.args[0].theta, Math.PI / 3);
  close(calculation.result.p0, 1 / 4);
  assert.equal(app.element('interference-probability').textContent, 'Output 0: 25%');
  assert.match(app.element('interference-theta-value').textContent, /\\frac\{\\pi\}\{3\}/);

  app.input('interference-theta', 21);
  calculation = app.calculation('interference');
  close(calculation.args[0].theta, 21 * Math.PI / 60);
  close(calculation.result.statisticalPhase, 7 * Math.PI / 10);
  close(calculation.result.p0, (1 + Math.cos(7 * Math.PI / 10)) / 2);
  assert.equal(app.element('interference-probability').textContent, `Output 0: ${(100 * calculation.result.p0).toFixed(1)}%`);
  for (const tick of [0, 60]) {
    app.input('interference-theta', tick);
    calculation = app.calculation('interference');
    close(calculation.args[0].theta, tick * Math.PI / 60);
    close(calculation.result.statisticalPhase, tick === 0 ? 0 : 2 * Math.PI);
    close(calculation.result.p0, 1);
    assert.equal(app.element('interference-probability').textContent, 'Output 0: 100%');
  }
  app.preset('data-reset', 'interference');
  checkSixtiethSlider(app, 'interference-theta', 30);
  close(app.calculation('interference').args[0].theta, Math.PI / 2);
});

test('Correlation slider ticks preserve one third and both physical endpoint limits', () => {
  const app = createApp('correlations');
  checkSixtiethSlider(app, 'correlations-alpha', 20);
  for (const preset of ['close', 'separated']) {
    app.preset('data-correlations-example', preset);
    checkSixtiethSlider(app, 'correlations-alpha', 20);
    const calculation = app.calculation('lllPairCorrelation');
    assert.equal(calculation.args[0].alpha, 1 / 3);
    assert.equal(calculation.result.alpha, 1 / 3);
    assert.match(app.element('correlations-alpha-value').textContent, /\\frac\{1\}\{3\}/);
    assert.equal(app.element('correlations-chi').textContent, calculation.result.chi.toFixed(5));
  }
  app.input('correlations-alpha', 21);
  let calculation = app.calculation('lllPairCorrelation');
  assert.equal(calculation.args[0].alpha, 21 / 60);
  assert.equal(calculation.result.alpha, 21 / 60);
  app.input('correlations-separation', 0);
  for (const tick of [0, 60]) {
    app.input('correlations-alpha', tick);
    calculation = app.calculation('lllPairCorrelation');
    assert.equal(calculation.args[0].alpha, tick / 60);
    close(calculation.result.chi, tick === 0 ? 0 : 1);
    close(calculation.result.meanSeparationSquared, tick === 0 ? 2 : 6);
    assert.equal(app.element('correlations-chi').textContent, tick === 0 ? '0.00000' : '1.00000');
    assert.match(app.element('correlations-moments').textContent, new RegExp(`&=${tick === 0 ? '2' : '6'}\\.0000`));
  }
  app.preset('data-reset', 'correlations');
  checkSixtiethSlider(app, 'correlations-alpha', 20);
  assert.equal(app.calculation('lllPairCorrelation').args[0].alpha, 1 / 3);
});

test('Custom memory strings give usable instructions and keep seam crossings out of ground-space labels', () => {
  const app = createApp('memory');
  app.click('memory-clear');
  app.cell('memory-svg', 'data-memory-cell', '0,2');
  app.cell('memory-svg', 'data-memory-cell', '4,2');
  const notice = app.element('memory-notice').textContent;
  assert.match(notice, /select.*neighbor/i);
  assert.doesNotMatch(notice, /continue the worked path/i);
  assert.equal(app.element('memory-path-next').disabled, true);
  assert.equal(app.element('memory-path-prev').disabled, true);
  let result = app.calculation('memoryStringState').result;
  assert.deepEqual(result.defects, ['0,2', '4,2']);
  assert.deepEqual(result.cutParity, { x: 1, y: 0 });
  assert.equal(result.logicalParity, null);
  assert.equal(app.element('memory-logical').textContent, 'Not assigned while endpoints remain');
  assert.equal(app.element('memory-wilson').textContent, '');
  assert.equal(app.element('memory-defect-count').textContent, 2);
  assert.match(app.element('memory-energy').textContent, /\{J_m\}=4$/);
  app.cell('memory-svg', 'data-memory-cell', '4,2');
  app.cell('memory-svg', 'data-memory-cell', '0,2');
  result = app.calculation('memoryStringState').result;
  assert.deepEqual(result.defects, []);
  assert.deepEqual(result.logicalParity, { x: 0, y: 0 });
  assert.equal(app.element('memory-defect-count').textContent, 0);
  assert.match(app.element('memory-wilson').textContent, /vertical.*&=1.*horizontal.*&=1/);
});

test('Braid direction is labeled as a future choice and only affects the appended generator', () => {
  const label = /<label\b[^>]*for="braids-direction"[^>]*>([\s\S]*?)<\/label>/.exec(html);
  assert.ok(label);
  assert.match(label[1], /next exchange/i);
  const app = createApp('braids');
  const before = app.calculation('applyBraidWord');
  const displayedBefore = app.element('braids-state-a').textContent;
  app.input('braids-direction', -1);
  const unchanged = app.calculation('applyBraidWord');
  assert.deepEqual(unchanged.args[0], [1, 2]);
  assert.deepEqual(unchanged.result, before.result);
  assert.equal(app.element('braids-state-a').textContent, displayedBefore);
  app.preset('data-braid', '2');
  const changed = app.calculation('applyBraidWord');
  assert.deepEqual(changed.args[0], [1, 2, -2]);
  // B2 and its inverse cancel, leaving the +z quarter-turn of |+>.
  const bloch = app.calculation('bloch').result;
  close(bloch.x, 0);
  close(bloch.y, 1);
  close(bloch.z, 0);
  close(app.calculation('measurementProbabilities').result.plus, 0.5);
  assert.equal(app.element('braids-probability-a').textContent, '50%');
  assert.match(app.element('braids-bloch-svg').getAttribute('aria-label'), /Y: state A 1\.00/);
  assert.match(app.element('braids-svg').innerHTML, /B2\^-1/);
});

test('Direct fusion-path selection, navigation buttons, and changed sectors stay synchronized', () => {
  const app = createApp('fusion');
  const selector = app.element('fusion-path-index');
  assert.equal(selector.min, '1');
  assert.equal(selector.max, '2');
  assert.equal(selector.step, '1');
  assert.equal(selector.value, '1');
  app.input('fusion-path-index', 2);
  let calculation = app.calculation('fibonacciPathAt');
  assert.equal(calculation.args[2], 1);
  assert.deepEqual(calculation.result, ['tau', 'tau', 'tau', 'vacuum']);
  assert.match(app.element('fusion-path-svg').getAttribute('aria-label'), /vacuum, tau, tau, tau, vacuum/);
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
  calculation = app.calculation('fibonacciPathAt');
  assert.equal(calculation.args[2], 986);
  assert.deepEqual(calculation.result, Array(16).fill('tau'));
  assert.match(app.element('fusion-path-position').textContent, /Path 987 of 987/);
  assert.equal(app.element('fusion-path-svg').getAttribute('aria-label'), `Path 987 of 987; cumulative charges: vacuum, ${Array(16).fill('tau').join(', ')}.`);
  app.input('fusion-number', 2);
  assert.equal(selector.value, '1');
  assert.equal(selector.max, '1');
  assert.equal(app.element('fusion-path-next').disabled, true);
  assert.equal(app.calculation('fibonacciPathAt').args[2], 0);
});
