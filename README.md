# Investing in Multimodal Transportation

Yuting Lin’s capstone campaign website, built with HTML, CSS, and JavaScript. Open `index.html` in a browser; no installation, network connection, or build server is required.

## Page experience

The open hero scene animates original campaign illustrations behind the title, with pause and reduced-motion support. A contextual introduction leads into the interactive infographic. The social section presents four slides inside an automatic phone carousel with swipe, keyboard, dots, and local like/save controls. Revised outreach QR artwork is included in the previews, mockups, and PDF download.

The fact sheet displays its revised front and back side by side, stacking on phones. Its combined PDF contains exactly one front and one back. The separately supplied source PDFs are retained in `assets/downloads/`; the file named front originally contained two pages.

The outreach section uses vertical scrolling to slide through the framed-wall mockup, a high-resolution bus-shelter crop, and all four posters together on black. The gallery aligns with the heading. Reduced-motion settings display the views vertically. Redundant captions and design-copy repetitions are omitted.

## Journey interaction

The full infographic appears briefly on entry. Continued scrolling zooms into a traveler moving through walking, bus, rail, and cycling. Routes draw behind the traveler and remain visible. Route extensions grow after their connections are reached; illustrations, mode descriptions, and statistics reveal along the way.

The final overview supports selection through routes, color bars, illustrations, descriptions, and stat panels. Select the same mode again, click empty artwork, or press Escape to reset. Keyboard controls use Enter/Space and retain focus indicators; mouse clicks show no outline rectangle. Reduced-motion settings show the complete clickable overview without the scroll animation.

Original typography is preserved as vector glyphs inside the infographic. Website headings/body text use local Aptos Black and Archivo names with Arial fallbacks because web-font files were not supplied. White website backgrounds distinguish the original cream artwork.

## Components and source

- `src/page.html`: document shell and component placement.
- `src/components/`: navigation, hero, introduction, infographic, investments, outreach, social, resources, event, downloads, footer, and dialog.
- `assets/css/`: component styles plus shared campaign styles.
- `assets/js/`: navigation, ambient hero, journey, outreach, social, and event behavior.
- `assets/images/` and `assets/downloads/`: local campaign artwork and revised PDFs.
- `index.html` and `infographic.html`: generated static pages committed for GitHub Pages.

Edit components rather than generated HTML. No browser-side component loading or package installation is required.

```sh
node scripts/build.cjs
node scripts/check.cjs
node scripts/check-presentation.cjs
node scripts/check-social.cjs
```

The build preserves native SVG artwork and generates the standalone infographic from the same journey component. JavaScript checks exercise route selection, gallery progression, and social navigation/autoplay without external dependencies.

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
