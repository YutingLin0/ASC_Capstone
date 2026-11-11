# Current implementation update

The website now embeds the original interactive vector infographic from the “Make infographic segments clickable” chat. Its opening sequence and mode highlighting are preserved. The simplified stage selector, static infographic preview, and static infographic download were removed. The notes below record the initial wireframe planning and source review; infographic recommendations there are superseded by this update.

# Investing in Multimodal Transportation — wireframe

Open index.html in a browser. All artwork and downloads are bundled; no installation is required. The prototype is local-only and has not been published.

## Design system extracted from the campaign

- Aptos Black: heavy uppercase headlines. Archivo SemiBold: body text and labels. Confirmed by embedded PDF font metadata. Web font files were not supplied, so the prototype uses local font names with Arial fallbacks. Obtain licensed web fonts before final production.
- Blue walking, orange buses, green rail, purple cycling; navy text and cream backgrounds. Prototype visual-match RGB tokens: #4076C5, #F59300, #17B143, #6165BE, #0C1D32, #FFFEF9. These are screen approximations, not certified brand values: original art uses CMYK fills, including (82,49,0,0), (2,45,100,0), (89,0,100,0), and (69,57,0,0). Confirm RGB conversion against the original design files before final production.
- Preserve angular route lines, open circular connection points, transport pictograms, textured illustrations, four-color bars, and rounded information panels. Existing artwork is rendered directly from the supplied PDFs.
- Proposed website rules: 8px spacing rhythm, 24px mobile gutters, 1,152px content width, 16–18px body copy, 44px minimum touch controls. Keep small text navy; do not rely on color alone for mode labels. Test final colors for contrast after conversion.

## Recommended structure and reason

1. Introduction: explain the proposed initiative in everyday language. Establish capstone status.
2. Interactive journey: make the research brief's central idea tangible. Four mode buttons reveal infrastructure needs and connection benefits. The final design should rebuild the supplied illustrated route with its original icons as responsive vector artwork; this wireframe tests content and interaction first.
3. Investment fact sheet: explain Plan → Invest → Connect, then show the actual fact sheet and regional examples. Explicitly identify Long Island and Hudson Valley examples so they are not mistaken for NYC projects.
4. Outreach posters: show all four campaign messages and original graphics with readable HTML supporting text.
5. Official NYMTC resources: primary conversion, linking to the current plan and TIP rather than reproducing changing project data.
6. Information session: a fictional, clearly labeled capstone concept. Date and link are unconfirmed. The preview form sends and stores nothing; real registration would require a service and privacy copy.
7. Downloads: the supplied fact sheet, static infographic, and four-poster PDF in one resource library.

## Content grounding

The research brief centers on first/last-mile access, investment → improvement → connection → journey, and safer, more accessible everyday travel. All narrative copy follows those themes. No new measured benefits or project funding claims have been added to the HTML text.

Supplied source files reviewed:
- ASC Capstone Research (2).pdf: one-page research brief, visually reviewed because the page has no extractable text.
- Capstone- fact sheet.pdf: three pages; main content on pages 2–3.
- Capstone-journey infographic.pdf: one page.
- Capstone- Outreach posters.pdf: six pages; four distinct messages on pages 2–5, plus presentation/mockup pages.

The brief names a social media post series as a deliverable, but no separate social asset was present. It is a future addition rather than invented content.

Original PDFs retain historical statistics and funding amounts. Treat them as supplied campaign content, not newly verified current data. Verify each figure, time period, geography, and project status with its primary source before public launch. Do not treat expected benefits as measured results. Verify or replace the poster QR destinations.

Official resources checked during preparation:
- https://www.nymtc.org/movingforward2055/complete-plan-and-appendices/index.html
- https://www.nymtc.org/REQUIRED-PLANNING-PRODUCTS/TIP1

## Hosting recommendation

Use a GitHub repository to retain the source and GitHub Pages to host the finished static campaign. GitHub Pages serves HTML/CSS/JavaScript and supports a github.io address or a custom domain. This prototype is built in that compatible format. A real registration flow could link to an approved external event service; GitHub Pages itself does not process registrations.

Official documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## Review interactions

- Navigation scrolls to each section.
- Walk / Bus / Rail / Bike update the journey panel.
- Campaign-color toggle switches the wireframe's design tokens.
- Original infographic and investments page can be expanded.
- PDFs and larger poster previews open from actual bundled files.
- Information-session sign-up preview is a demo, with keyboard-accessible dialog and no network submission.
- Mobile layout stacks content; navigation remains horizontally scrollable.
