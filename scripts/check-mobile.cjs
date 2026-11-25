const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const path = require("node:path");
const styles = {};
const fill = { style: {} };
const cards = ["walk", "bus", "rail", "bike"].map((mode, i) => ({
  dataset: { verticalMode: mode },
  offsetTop: 100 + i * 500,
  offsetHeight: 400,
  classList: { toggle() {} },
  getBoundingClientRect() {
    return { top: this.offsetTop };
  },
}));
const buttons = cards.map((card) => ({
  dataset: { verticalJump: card.dataset.verticalMode },
  addEventListener() {},
  setAttribute() {},
}));
const body = {
  style: {
    setProperty(k, v) {
      styles[k] = v;
    },
  },
  getBoundingClientRect: () => ({ top: 0 }),
  querySelector: () => fill,
};
const section = {
  querySelector: () => body,
  querySelectorAll: (s) =>
    s.includes("vertical-mode")
      ? cards
      : s.includes("vertical-jump")
        ? buttons
        : [],
};
const listeners = {};
vm.runInNewContext(
  fs.readFileSync(
    path.join(__dirname, "../assets/js/journey-mobile.js"),
    "utf8",
  ),
  {
    document: { querySelector: () => section },
    window: {
      innerWidth: 390,
      innerHeight: 844,
      addEventListener: (e, f) => (listeners[e] = f),
    },
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (f) => {
      f();
      return 0;
    },
    ResizeObserver: class {
      observe() {}
    },
  },
);
assert.equal(styles["--route-start"], "102px");
assert.equal(styles["--route-length"], "1910px");
assert(fill.style.background.includes("#f49c1e 26.17801047120419%"));
cards[2].offsetTop += 200;
cards[3].offsetTop += 200;
listeners.resize();
assert.equal(styles["--route-length"], "2110px");
assert(!fill.style.background.includes("NaN"));
console.log(
  "Passed: mobile route starts at first node and colors realign when card positions change.",
);
