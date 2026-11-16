// Assemble static HTML at build time; hosting needs no framework or runtime fetches.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "src/page.html"), "utf8");
const html = template.replace(/\{\{ component:([\w-]+) \}\}/g, (_, name) =>
  fs
    .readFileSync(path.join(root, "src/components", `${name}.html`), "utf8")
    .trimEnd(),
);
fs.writeFileSync(path.join(root, "index.html"), html);
require("./build-infographic.cjs");
console.log("Built landing page from src/components.");
