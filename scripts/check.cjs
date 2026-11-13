// Dependency-free regression checks for static pages and the journey interaction.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const landing = read('index.html');
const standalone = read('infographic.html');

for (const [name, html] of [['index.html', landing], ['infographic.html', standalone]]) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${name}: duplicate IDs`);
  for (const [, link] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^https?:/.test(link)) continue;
    if (link.startsWith('#')) assert(ids.includes(link.slice(1)), `${name}: missing ${link}`);
    else assert(fs.existsSync(path.join(root, link)), `${name}: missing asset ${link}`);
  }
  assert(!html.includes('ns2:href'), `${name}: broken SVG glyph namespace`);
}
const scene = (html) => html.match(/<section id="journey"[\s\S]*?<\/section>/)[0];
assert.equal(scene(landing), scene(standalone), 'Regenerate the standalone infographic');
assert(!landing.includes('journey-heading'), 'Removed toolbar must stay removed');
assert(!landing.includes('data-text="•"'), 'Duplicate dark bullets must stay removed');
const svg = scene(landing).match(/<svg [\s\S]*?<\/svg>/)[0];
assert(svg.lastIndexOf('class="hotspots"') > svg.lastIndexOf('id="bike-callout"'));

const { journeyState } = require('../assets/js/journey.js');
for (let step = 0; step <= 1000; step++) {
  const state = journeyState(step / 1000);
  assert(state.local >= 0 && state.local <= 1);
  assert(state.zoom >= 0 && state.zoom <= 1);
}
for (let mode = 0; mode < 4; mode++) assert.equal(journeyState(.105 + mode * .19).phase, mode);
assert(journeyState(1).overview, 'Journey must finish in the clickable overview');

// Exercise the actual selection functions against mode surfaces and panels.
const source = read('assets/js/journey.js');
const modes = ['walk', 'bus', 'rail', 'bike'];
const panels = modes.map((mode) => ({ dataset: { contentMode: mode }, style: {} }));
const illustrations = modes.map((mode) => ({ dataset: { revealMode: mode }, style: {} }));
const surfaces = [...panels, ...illustrations].map((surface) => ({
  ...surface, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; },
}));
const parts = modes.map((mode) => ({
  dataset: { mode }, classList: { remove() {}, contains() { return true; } },
  getAttribute() { return null; }, setAttribute() {},
}));
const context = {
  parts, contentPanels: panels, illustrations,
  scene: { querySelectorAll() { return surfaces; } },
  document: { getElementById() { return {}; } },
};
vm.createContext(context);
const start = source.indexOf('  function highlight(mode)');
const end = source.indexOf('  parts.forEach((part) => {\n    part.addEventListener', start);
assert(start >= 0 && end > start);
vm.runInContext('let selected=null,overview=true;' + source.slice(start, end), context);
for (const mode of modes) {
  vm.runInContext(`selectMode('${mode}')`, context);
  assert.equal(panels.find((panel) => panel.dataset.contentMode === mode).style.opacity, '1');
  assert(panels.filter((panel) => panel.dataset.contentMode !== mode).every((panel) => panel.style.opacity === '.22'));
  vm.runInContext(`selectMode('${mode}')`, context);
  assert(panels.every((panel) => panel.style.opacity === '1'));
}
console.log('Passed: assets, anchors, glyph references, generated page parity, 1,001 scroll states, all modes, and selection/reset.');
