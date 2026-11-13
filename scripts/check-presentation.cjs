// Exercise autoplay and gallery progression without browser or package dependencies.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const nodes = new Map();
const timers = new Map();
let timerId = 0;
const labels = ["work", "learn", "care", "connect"].map((destination) => ({
  dataset: { destination },
  setAttribute() {},
  removeAttribute() {},
}));
const card = { dataset: {}, classList: { remove() {}, add() {} } };
const explorer = {
  classList: { remove() {}, add() {} },
  style: { setProperty() {} },
  querySelector: () => card,
};
function node(id) {
  if (!nodes.has(id))
    nodes.set(id, {
      replaceChildren() {},
      addEventListener(event, fn) {
        this[event] = fn;
      },
      setAttribute() {},
    });
  return nodes.get(id);
}
const heroDocument = {
  hidden: false,
  addEventListener() {},
  querySelector: (selector) =>
    selector === ".destination-explorer" ? explorer : node(selector),
  querySelectorAll: () => labels,
  getElementById: node,
  createElement: (tag) => ({ tag }),
  createTextNode: (text) => ({ text }),
};
vm.runInNewContext(read("assets/js/hero.js"), {
  document: heroDocument,
  requestAnimationFrame: (fn) => fn(),
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  IntersectionObserver: class {
    observe() {}
  },
  setTimeout: (fn, ms) => {
    timers.set(++timerId, { fn, ms });
    return timerId;
  },
  clearTimeout: (id) => timers.delete(id),
});
assert.equal(card.dataset.illustration, "bus");
for (const expected of ["walk", "access", "walk", "bus"]) {
  const rotation = [...timers.entries()].find(([, t]) => t.ms === 4700);
  assert(rotation);
  timers.delete(rotation[0]);
  rotation[1].fn();
  const change = [...timers.entries()].find(([, t]) => t.ms === 300);
  assert(change);
  timers.delete(change[0]);
  change[1].fn();
  assert.equal(card.dataset.illustration, expected);
}
node("hero-motion-toggle").click();
assert.equal(timers.size, 0, "Pause must stop the autoplay timers");

let progress = 0;
const listeners = {};
const slides = Array.from({ length: 3 }, () => ({}));
const track = { children: slides, style: {} };
const stage = { offsetHeight: 800, clientWidth: 1200 };
const story = {
  offsetHeight: 4000,
  querySelector: (selector) =>
    selector === ".outreach-scroll-stage" ? stage : track,
  getBoundingClientRect: () => ({ top: 85 - 3200 * progress }),
};
const preference = {
  matches: false,
  addEventListener(event, fn) {
    this.change = fn;
  },
};
vm.runInNewContext(read("assets/js/outreach.js"), {
  document: { querySelector: () => story },
  window: { addEventListener: (event, fn) => (listeners[event] = fn) },
  matchMedia: () => preference,
  getComputedStyle: () => ({ top: "85" }),
  requestAnimationFrame: (fn) => fn(),
});
for (let sample = 0; sample <= 1000; sample++) {
  progress = sample / 1000;
  listeners.scroll();
  assert.equal(slides.filter((slide) => !slide.inert).length, 1);
  assert(!track.style.transform.includes("NaN"));
}
assert.equal(track.style.transform, "translate3d(-2400px,0,0)");
preference.matches = true;
preference.change();
assert(
  slides.every((slide) => !slide.inert),
  "Reduced motion must expose all slides",
);
assert.equal(track.style.transform, "");
console.log(
  "Passed: four-scene hero loop, pause, 1,001 gallery positions, and reduced-motion gallery.",
);
