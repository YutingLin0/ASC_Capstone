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
let pending;
const post = { querySelector: (s) => els[s], querySelectorAll: () => dots };
vm.runInNewContext(
  fs.readFileSync(
    require("node:path").join(__dirname, "../assets/js/social.js"),
    "utf8",
  ),
  {
    document: {
      querySelector: (s) => (s === ".social-phone" ? phone : post),
      addEventListener() {},
    },
    window: { matchMedia: () => ({ matches: false, addEventListener() {} }) },
    clearTimeout() {},
    setTimeout: (f) => {
      pending = f;
    },
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
pending();
assert.equal(els[".social-counter"].textContent, "2 / 4");
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
