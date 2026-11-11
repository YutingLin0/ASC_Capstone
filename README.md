# ASC Capstone: Investing in Multimodal Transportation

An interactive landing-page wireframe for Yuting Lin’s proposed multimodal transportation campaign. Built with plain HTML, CSS, and JavaScript; no build step or external runtime dependencies.

## Open locally

Open `index.html` directly in a browser. Open `infographic.html` for the standalone interactive infographic. All image previews and original PDF downloads are included.

## Files

- `index.html`: campaign landing page and section copy.
- `infographic.html`: standalone, reusable interactive journey.
- `assets/css/styles.css`: shared responsive styling and campaign color tokens.
- `assets/js/main.js`: landing-page display toggle, navigation, and demo dialog.
- `assets/images/`: original campaign artwork previews.
- `assets/downloads/`: original fact sheet, infographic, and poster PDFs.
- `docs/design-system.md`: extracted design system, content grounding, and recommendations.
- `docs/research-brief.pdf`: original campaign research brief.
- `docs/section-copy.txt`: editorial copy reference; HTML is the current source of truth.

## Include the infographic in another website

Host this folder, then link to `infographic.html` or embed it:

```html
<iframe
  src="https://YOUR-HOST/ASC_Capstone/infographic.html"
  title="Interactive multimodal transportation journey"
  width="100%"
  height="1100"
  style="border: 0;"
  loading="lazy"
></iframe>
```

Adjust the height for your layout. The standalone page uses the same shared files as the landing page. The infographic is self-contained, with its original vector artwork, styling, and interaction code inside `infographic.html`.

## Checks

Run `node scripts/check.cjs` to verify both pages, local assets, navigation anchors, and the embedded original vector infographic. JavaScript syntax can be checked with `node --check assets/js/main.js`.

## GitHub Pages

This repository is ready for static hosting. In repository Settings → Pages, choose Deploy from a branch, then the main branch and root folder. Enabling hosting is separate from committing the code. No GitHub Actions workflow is required.

## Scope and limitations

This is a low-fidelity content and interaction prototype. Original artwork remains in color; a button previews campaign colors elsewhere. Aptos Black and Archivo SemiBold web fonts were not supplied, so local font names and fallback fonts are used. The infographic preserves the original illustrated vector route, opening highlight sequence, and clickable routes, boxes, and color bars. Static infographic previews and downloads are omitted.

The information session and registration are explicitly fictional demonstrations. The form sends and stores no data. This is an educational capstone, not an official NYMTC site. Verify source statistics, funding, project status, and poster QR destinations before public launch.
