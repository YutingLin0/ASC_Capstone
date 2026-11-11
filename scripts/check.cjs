// Dependency-free checks for static links and the shared journey component.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

for (const page of ['index.html', 'infographic.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: duplicate IDs`);
  for (const [, link] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^https?:/.test(link)) continue;
    if (link.startsWith('#')) {
      assert(ids.includes(link.slice(1)), `${page}: missing anchor ${link}`);
    } else {
      assert(fs.existsSync(path.join(root, link)), `${page}: missing file ${link}`);
    }
  }
}

const modes = ['walk', 'bus', 'rail', 'bike'];
const buttons = modes.map((mode) => ({
  dataset: { mode },
  attributes: {},
  setAttribute(key, value) { this.attributes[key] = value; },
  addEventListener(event, handler) { this[event] = handler; },
}));
const panel = { replaceChildren(...children) { this.children = children; } };
const document = {
  getElementById: () => panel,
  querySelectorAll: () => buttons,
  createElement: () => ({ append(child) { this.child = child; } }),
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/journey.js'), 'utf8'), { document });
for (const button of buttons) {
  button.click();
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(buttons.filter((item) => item.attributes['aria-pressed'] === 'true').length, 1);
  assert(panel.children[0].textContent.toLowerCase().startsWith(button.dataset.mode));
  assert(panel.children[1].textContent.length > 50);
}
console.log('Passed: both pages, local assets, anchors, unique IDs, and all four journey interactions.');
