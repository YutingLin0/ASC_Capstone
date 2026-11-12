// The landing page is the canonical artwork source. Generate its embeddable version.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scene = html.match(/<section id="journey"[\s\S]*?<\/section>/)?.[0];
if (!scene) throw new Error("Landing page is missing the journey section.");
const output = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Every Part of the Journey Matters — Interactive Journey</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="stylesheet" href="assets/css/journey.css">
  <script src="assets/js/journey.js" defer></script>
</head>
<body class="brand standalone-journey">
  <main>${scene}</main>
</body>
</html>
`;
fs.writeFileSync(path.join(root, "infographic.html"), output);
console.log("Generated infographic.html from the approved landing-page scene.");
