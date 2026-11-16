// Exercise gallery progression without browser or package dependencies.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

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
console.log("Passed: 1,001 gallery positions and reduced-motion gallery.");
