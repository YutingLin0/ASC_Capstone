const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert");
class El {
  constructor() {
    this.attrs = {};
    this.events = {};
    this.style = {};
    this.children = [];
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  getAttribute(k) {
    return this.attrs[k];
  }
  addEventListener(k, f) {
    this.events[k] = f;
  }
  click() {
    this.events.click();
  }
}
const selectors = [
  ".social-carousel",
  ".social-track",
  ".social-prev",
  ".social-next",
  ".social-status",
  ".social-counter",
  ".social-like",
  ".social-save",
];
const els = Object.fromEntries(selectors.map((s) => [s, new El()]));
const dots = Array.from({ length: 4 }, () => new El());
els[".social-track"].children = dots.map(() => new El());
const phone = new El();
phone.querySelector = () => new El();
phone.contains = () => false;
let progress = 0;
const listeners = {};
const stage = {
  offsetHeight: 700,
  clientWidth: 1200,
  style: {
    setProperty(k, v) {
      this[k] = v;
    },
    removeProperty(k) {
      delete this[k];
    },
  },
};
const intro = new El();
const story = {
  offsetHeight: 3500,
  querySelector: (s) => (s === ".social-scroll-stage" ? stage : intro),
  getBoundingClientRect: () => ({ top: 88 - progress * 2800 }),
};
const post = { querySelector: (s) => els[s], querySelectorAll: () => dots };
vm.runInNewContext(
  fs.readFileSync(
    require("node:path").join(__dirname, "../assets/js/social.js"),
    "utf8",
  ),
  {
    document: {
      querySelector: (s) => (s === ".social-phone" ? phone : post),
      getElementById: () => story,
      addEventListener() {},
    },
    window: {
      innerWidth: 1200,
      addEventListener: (e, f) => (listeners[e] = f),
      matchMedia: () => ({ matches: false, addEventListener() {} }),
    },
    getComputedStyle: () => ({ top: "88" }),
    requestAnimationFrame: (f) => {
      f();
      return 0;
    },
    clearTimeout() {},
    setTimeout: (f) => {},
    IntersectionObserver: class {
      constructor(f) {
        this.f = f;
      }
      observe() {
        this.f([{ isIntersecting: true }]);
      }
    },
  },
);
assert(els[".social-prev"].disabled);
for (const [p, slide] of [
  [0.35, 1],
  [0.5, 2],
  [0.7, 3],
  [1, 4],
]) {
  progress = p;
  listeners.scroll();
  assert.equal(els[".social-counter"].textContent, `${slide} / 4`);
}
assert.equal(intro.style.opacity, "0");
assert.equal(stage.style["--phone-shift"], "0px");
dots[0].click();
els[".social-next"].click();
assert.equal(els[".social-track"].style.transform, "translateX(-100%)");
dots[3].click();
assert(els[".social-next"].disabled);
els[".social-carousel"].events.keydown({
  key: "ArrowLeft",
  preventDefault() {},
});
assert.equal(els[".social-counter"].textContent, "3 / 4");
for (const s of [".social-like", ".social-save"]) {
  els[s].click();
  assert.equal(els[s].attrs["aria-pressed"], "true");
  els[s].click();
  assert.equal(els[s].attrs["aria-pressed"], "false");
}
console.log(
  "Carousel arrows, dots, keyboard, boundaries, like and save toggles passed.",
);
