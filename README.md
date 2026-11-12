# Investing in Multimodal Transportation

Yuting Lin’s capstone campaign website, built with HTML, CSS, and JavaScript. Open `index.html` in a browser; no installation, network connection, or build server is required.

## Approved journey interaction

The full infographic appears briefly on entry. Continued scrolling zooms into a traveler moving through walking, bus, rail, and cycling. Routes draw behind the traveler and remain visible. Route extensions grow after their connections are reached; illustrations, mode descriptions, and statistics reveal along the way.

The final overview supports selection through routes, color bars, illustrations, descriptions, and stat panels. Select the same mode again, click empty artwork, or press Escape to reset. Keyboard controls use Enter/Space and retain focus indicators; mouse clicks show no outline rectangle. Reduced-motion settings show the complete clickable overview without the scroll animation.

Original typography is preserved as vector glyphs inside the infographic. Website headings/body text use local Aptos Black and Archivo names with Arial fallbacks because web-font files were not supplied. White website backgrounds distinguish the original cream artwork.

## Organization

- `index.html`: landing-page sections, copy, and canonical inline infographic artwork.
- `infographic.html`: generated standalone version of the same scroll scene.
- `assets/css/styles.css`: page layout and campaign colors.
- `assets/css/journey.css`: infographic layout, reveals, motion, and focus styling.
- `assets/js/main.js`: navigation and demonstration event dialog.
- `assets/js/journey.js`: scroll progression, traveler, reveals, and overview selection.
- `assets/images/`: fact-sheet and poster previews.
- `assets/downloads/`: original fact-sheet and poster PDFs.
- `docs/design-system.md`: visual system, content sources, and publication notes.
- `docs/research-brief.pdf`: supplied research brief.
- `scripts/build-infographic.cjs`: generates the standalone page from the canonical scene.
- `scripts/check.cjs`: dependency-free asset and interaction checks.

## Editing and checking

Edit the artwork/scene in `index.html`, then regenerate the standalone page:

```sh
node scripts/build-infographic.cjs
node scripts/check.cjs
node --check assets/js/main.js
node --check assets/js/journey.js
```

Both HTML pages are tracked and ready for static hosting. The generated page does not require Node in the browser. Do not edit `infographic.html` independently.

## Embedding

Host the complete folder, then link to `infographic.html` or embed it:

```html
<iframe
  src="https://YOUR-HOST/ASC_Capstone/infographic.html"
  title="Interactive multimodal transportation journey"
  width="100%"
  height="900"
  style="border:0"
  loading="lazy"
></iframe>
```

The standalone page contains its own scroll journey. Adjust the iframe height to suit your layout; scrolling inside it drives the scene.

## GitHub Pages

In repository Settings → Pages, choose “Deploy from a branch,” then `main` and `/ (root)`. Committing files does not enable hosting. The `.nojekyll` file allows direct static serving.

## Content scope

This is an independent educational capstone proposal, not an official NYMTC announcement. The information session and registration remain clearly labeled fictional demonstrations; the form sends and stores no data. Official NYMTC resources are linked from the site.

Verify source statistics, project funding/status, and poster QR destinations before public launch. The original PDF downloads retain supplied artwork and historical figures. No static infographic preview or PDF download is included.
