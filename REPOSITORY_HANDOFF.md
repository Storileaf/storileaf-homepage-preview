# Repository handoff for StoriLeaf UI work

## Six-book image gallery and lightbox, 18 October 2026

**Implemented in the public GitHub Pages frontend preview following explicit founder approval.** The `See what your stories can become.` sample gallery no longer displays the three invented text/book spread examples. It now shows **exactly six landscape image placeholders**, one for each official book in this order: Life Story, Travel Memoir, Relationship Memoir, Founder's Memoir, Parent to Child Letters and Celebrating Occasions. Captions under each image show **only the book name**. All `Sample story`, `Read this example`, enlarge icon and invented page-text elements were removed from the gallery.

The gallery remains a horizontal snap-scrolling image rail. The previous arrow now uses an **explicit left-pointing SVG path** rather than relying on CSS rotation of a right-pointing arrow; the next arrow points right. They disable at the ends, without looping or autoplay. Clicking any image opens a dark overlay **image lightbox**. Within the lightbox, previous/next buttons, keyboard left/right arrows, mobile left/right swipe gestures and Escape to close work across all six book images. The close button is always present and focus returns to the triggering image button. The modal deliberately shows one image at a time, not multiple pages within one book.

**Replaceable images:** The six distinct files at `gallery/<book-slug>-open-book-placeholder.svg` are clearly **illustrative SVG placeholders, not genuine open-book product photography**. Each book has a dedicated source path in `assets/content-sections-CfrmOVRI.js` for later founder-supplied photograph replacement. The `gallery/README.md` maps the images and replacement method. Do not add real customer material to this public repository without authorisation.

**Preserved:** Exact section heading and supporting sentence, forest green background, the complete adjacent physical-book photography and three printed book details, and the remaining `See package details` Pricing link. No other page, process, production repo or backend integration was changed.

**Verification:** The successful public Chromium QA workflow checked six captions and six locally loaded SVGs, original image aspect ratios, distinct left/right arrow path directions, image-rail scrolling both ways, lightbox previous/next through all six images, keyboard navigation, Escape closure with focus return, mobile swipes in both directions, close button and responsive geometry. Real screenshots are under `qa/screenshots/six-book-gallery-desktop.png`, `six-book-gallery-mobile.png`, `six-book-lightbox-first-desktop.png`, `six-book-lightbox-sixth-desktop.png` and `six-book-lightbox-mobile.png`. First QA attempt exposed a missing gallery asset directory in the isolated test server; this was corrected in `.github/workflows/verify-homepage-ui.yml` and the final run passed. The deployed preview is awaiting founder final visual approval and actual replacement photographs. Full device and accessibility testing remain pending.


## Six-book discovery heading and paragraph alignment, 18 October 2026

**Founder-approved adjustment, implemented and Chromium verified in the PUBLIC GitHub Pages preview.** The heading **“Which part of life would you like to tell?”** and its complete original supporting paragraph **“Think of a person, a journey, the years together or a moment that stayed with you. Choose a subject to see the book it could become.”** are preserved unchanged. The founder found the paragraph visually detached because the two-column grid used a wide 1.5fr / .75fr split and `align-items:center`.

At widths **1131px and above only**, the book discovery heading grid now uses `minmax(0,1.18fr) minmax(285px,1fr)`, a restrained 24–44px column gap and **top alignment**. No other homepage heading arrangements were modified. At 1130px and below, the previously approved single-column heading and paragraph remain stacked, with the original small row gap.

**Verification:** The browser QA passed after checking the exact existing text, zero top-edge difference and 34–44px column gaps at 1280, 1440 and 1920px, plus tablet/mobile stacked reading order. Actual screenshots: `qa/screenshots/book-discovery-heading-1024px.png`, `book-discovery-heading-1280px.png`, `book-discovery-heading-1440px.png`, `book-discovery-heading-1920px.png`, `book-discovery-heading-mobile.png`. All six book descriptions, tabs, photographs and CTAs remain unchanged. Founder final visual acceptance and complete accessibility/device QA remain open. No production application or backend source changed.


## One CTA in the finished book section, 18 October 2026

**Founder-approved and implemented in the public GitHub Pages frontend preview.** The lower-right detached link **“See more inside the books”** was explicitly rejected and removed from the book samples and physical details section. The existing **“See package details”** text link stays directly below the three physical book details in the right column and continues to `https://storileaf.com/pricing/`. The details **Printed copy**, **Binding and finish** and **Before print**, the binding photograph, the sample carousel, the sample dialog, exact current copy and the other sections were preserved. No replacement link was added.

With the disconnected footer link removed, the samples section's bottom padding was reduced to **80px on desktop** and **66px on narrow screens**. This is a scoped composition correction, not a redesign of the gallery or book craft panel.

Chromium browser QA passed for the sole remaining CTA, destination, detail labels, layout order and both responsive padding values. Desktop and mobile screenshots are in `qa/screenshots/physical-book-single-cta-desktop.png` and `physical-book-single-cta-mobile.png`. Browser checks alone are not founder visual approval. No production system or other product page was changed.

## Six-book discovery copy and layout, 18 October 2026

**Founder-approved copy and layout, implemented in the PUBLIC static homepage preview.** All six selectable book panels now start with one short subject-specific description followed by the three exact bullet points reviewed and approved in the conversation. No repeated product title or decorative overline was added. The **Explore this book** CTA and all six existing product destinations remain unchanged.

**Desktop layout:** Descriptions begin at the same top-left starting point, above their subject-specific bullet lists. The CTA is anchored to the bottom left rather than vertically centred with the text. The active text-and-photo panel uses a stable minimum height of 520px at widths greater than 720px, so switching between books does not move the button, panel boundary or photograph. Description space accommodates wrapping; the bullet component supports varying point counts in a future separately approved copy revision, although exactly three per book are approved now.

**Mobile layout:** The photograph remains above the text. Copy flows naturally, without forcing a desktop-sized panel or clipping longer descriptions.

**QA and source:** The compiled `assets/content-sections-CfrmOVRI.js` has separate `bookPanelIntroductions` and `bookPoints` records for all six books, and the CSS is scoped to the discovery section. The initial active Life Story SSR panel is synchronised in `index.html` and `404.html`. Chromium QA verified all six descriptions and their three bullet points word for word, valid product destinations, panel stability, top-left start and anchored bottom CTA. At 1440px, text-top, text-left, button-bottom, button-left, panel-height and image-top variations were **0px** across six tabs. All six mobile panels were checked for overlap and clipping, with nine overall responsive widths checked for page overflow. Real screenshots of all six desktop panels and the Parent to Child Letters mobile panel are in `qa/screenshots/`. The QA run passed and GitHub Pages deployment succeeded. Final founder visual approval and full physical-device/accessibility testing remain open.

The private production code, backend, pricing and gift/application behaviour were not changed. The future `/books/` overview remains unbuilt.


## Header navigation vertical alignment correction, 18 October 2026

**Implemented and Chromium verified in the public frontend preview.** The desktop navigation labels were not on the same text baseline. The books and Resources are Radix dropdown buttons, while See inside, How it works and Pricing are Radix links with an inherited `flex-col` layout. Although all five controls had matching 44px boxes, the three ordinary links were displayed **4.2px higher** than the two dropdown labels. This had been missed by previous menu edge and link arrangement tests.

The narrowly scoped CSS correction sets the five desktop nav controls to the same horizontal flex arrangement and centres their content; it also removes the chevrons' unnecessary 1px vertical offset. **Measured text midpoint variation is now 0px at both 1280px and 1440px**. Existing book and resource hover dropdowns, item destinations, text and left edge alignment are preserved. Chromium screenshots of the actual header and both expanded menus were inspected. New regression tests and captures are in `qa/screenshots/header-navigation-aligned.png`, `books-menu-desktop.png`, `resources-menu-open-desktop.png` and `qa/homepage-qa-report.json`.

The GitHub Pages preview deployment succeeded. **No production `main`, customer application, backend, commercial flow or other homepage section changed**. The page remains pending founder visual approval.

## Hero book orbit density review, 18 October 2026

**Founder requested and implemented in the public frontend preview only.** The hero background now contains **14 visible cover elements** rather than seven, split into **6 inner and 8 outer positions**. The same seven genuine, locally bundled StoriLeaf cover thumbnails are each used exactly twice. Repeated images are intentional placeholders and may be replaced individually in a later authorised visual pass. No additional cover assets were invented or imported.

The **outer orbit radius is 10% larger** at every existing responsive radius, from 605px to 665.5px on desktop, 465px to 511.5px at the tablet breakpoint and 375px to 412.5px on narrow screens. The inner ring size, rotation direction and speed, fades, hero headline, gallery, ticker, controls and layout remain unchanged. Existing mobile and reduced-motion handling remains.

**Source and verification.** Only the public static frontend SSR snapshot (`index.html` and `404.html`), compiled orbit component, stylesheet and its browser QA checks were changed. The Chromium QA action passed, confirming 14 images, exactly two instances of each of the seven originals, all images loaded, the expected radii and no page overflow at nine widths. Actual screenshots are in `qa/screenshots/hero-fourteen-covers-desktop.png` and `hero-fourteen-covers-mobile.png`. The site has deployed successfully via GitHub Pages. These are prototype density and radius settings for founder visual review, **not final visual approval**. Production code and backend remain untouched.

## Final stage scroll hold corrected, 18 October 2026

**Public frontend preview only.** Founder feedback requested the fourth How it works stage, **Share what matters**, to remain highlighted and visibly pinned for roughly the same scrolling distance as the earlier stages. The existing CSS scroll runway was extended from 430px to 525px, without changing the four stage thresholds, row heights, text, CTA links, photograph choices or mobile layout.

The Chromium browser QA checked another **100px of scrolling while step 04 remained active**, with the corresponding photograph unchanged and the pinned stage top still at 144px. Forward and reverse transitions through all four steps also passed. A real screenshot was captured as `qa/screenshots/process-stage-four-held-desktop.png`. This is tested frontend behaviour, not final founder visual sign-off. Production and backend systems remain untouched.

## Process alignment refinement, 18 October 2026

**Current public frontend preview, browser checked and deployed.** The founder requested a lower, more comfortably centred sticky position for the How it works composition, a photograph positioned beside the four steps rather than the headline, slightly tighter stage rows, and removal of the outer divider rules. The four approved descriptions, existing photographs and both CTAs remain unchanged.

At the reviewed desktop size (1440 × 900), the pinned heading begins at **144px from the viewport top**, below the 91px header bottom. The four steps are **94px high each**, with dividers only *between* steps. The photograph begins exactly level with the first row and extends down to the CTA line, no longer sitting beside the heading. Stage progression remains independent of row height, advancing through four photographs at approximately 112px scroll intervals. Clicking or reversing scroll still works.

**Browser QA:** The public `Verify homepage visuals` workflow passed at this revision. It checked the header/title separation, stage/photo alignment, desktop sticky positions (144px for all four stages), inner versus outer dividers, four photographs, forward and reverse stage activation, stage clicks, mobile divider removal, nine responsive widths and reduced motion. Actual screenshots and `qa/homepage-qa-report.json` are committed under `qa/`. Final founder visual acceptance and full device/accessibility audits remain open.

The planned `/books/` overview is **not built**. The newsletter is a frontend-only presentation without email processing. No private application or production deployment changed.



**Frontend preview implemented, not production.** The removed final FAQ invitation has been restored between the FAQ questions and newsletter, preserving **“One question is enough to begin.”**, **“Let’s find your book.”**, and **“Explore the books”**. Its action leads to the existing homepage `#books` selector. No new page or backend was added.

The four How it works stage rows are now compact, approximately 110px at the tested desktop width, while a separate scroll runway advances the stage and photograph at 112px intervals. The text and photograph remain pinned during supported desktop scrolling. Clicking stages and reversing scroll still work. All original step copy, mobile reading flow, and reduced-motion fallback are retained.

**Verified evidence:** `qa/homepage-qa-report.json` and screenshots in `qa/screenshots/`. Browser QA passed for all four stage transitions in both directions, four distinct photographs, click controls, pinned stage position, restored invitation, Books dropdown, nine viewport widths, and reduced motion. Final visual acceptance, physical-device, and full accessibility checks remain open.

The future `/books/` page remains documented but unbuilt. The newsletter field in this public static preview cannot collect email addresses.



Read this at the beginning of any future homepage design, static preview or GitHub Pages task.

## Permanent repository references

**Private official repository**

[Storileaf/storiYoceFj6IRAleaf](https://github.com/Storileaf/storiYoceFj6IRAleaf)

Contains the actual product implementation, public Next.js website, customer and admin app, commercial rules and the homepage UX decision record on branch `design/storileaf-website-ux`. The [Homepage Master Implementation Brief](https://github.com/Storileaf/storiYoceFj6IRAleaf/blob/design/storileaf-website-ux/website-ux/docs/HOMEPAGE_MASTER_IMPLEMENTATION_BRIEF.md) is the canonical source for approved website copy and design direction.

**Public frontend UI preview repository**

[Storileaf/storileaf-homepage-preview](https://github.com/Storileaf/storileaf-homepage-preview)

Holds only a static user-interface snapshot for visual reviews on GitHub Pages, including HTML, CSS, JavaScript, approved public imagery and its setup workflow. No backend, API, customer records, authentication or payments belong here.

**Live GitHub Pages location, browser-verified 16 October 2026**

https://storileaf.github.io/storileaf-homepage-preview/

The site is **LIVE**: the homepage and a bundled cover image returned HTTP 200; a real browser loaded the page, book tabs and mobile navigation. Recheck after future updates.

## Exact boundaries

- Keep the real StoriLeaf `main` branch and live domain independent of this preview.
- Use existing approved copy and images. Do not interpret unapproved prototype decisions as final.
- UI interactions in the static prototype are browser-only. Links to external StoriLeaf pages do not make those backend functions part of this repository.
- Do not copy `apps/app/`, `convex/`, secrets, payments, API routes, private customer media or admin source here.
- Public preview changes do not sync automatically back to the private product repository.
- Public Pages content is visible to visitors even though the official source repository is private.
- This preview is marked `noindex` to reduce search indexing, but that is not access control.

## Static preview bootstrap

The `main` branch deployment is initially filled by the [Bootstrap standalone frontend workflow](.github/workflows/bootstrap-frontend.yml), which downloads a SHA-256-verified ZIP of the already browser-tested homepage and commits the static files. The archive was prepared as a Macaly-independent UI build with **seven book covers hosted locally in the preview**, no Macaly Bridge and no backend application source.

The bootstrap completed successfully. GitHub Pages is configured at repository **Settings → Pages → Deploy from a branch → main → /(root)**. The first Pages build was triggered by a README-only push and [completed successfully](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/38987374849).

To update design later, regenerate or replace the static UI deliberately, capture and inspect desktop/mobile screenshots, then record changes against the approved homepage brief. Do not treat the bootstrap snapshot as an automatically maintained codebase.

**Related private handoff** [website-ux/docs/REPOSITORY_HANDOFF.md](https://github.com/Storileaf/storiYoceFj6IRAleaf/blob/design/storileaf-website-ux/website-ux/docs/REPOSITORY_HANDOFF.md).

## Status

Created and first published 16 October 2026. **Deployment verified live** at https://storileaf.github.io/storileaf-homepage-preview/. GitHub Pages workflow passed. Desktop and mobile browser checks confirmed working cover images, tabs, mobile navigation and no page-wide overflow at 1440px and 390px. The real product repo and production site were not changed.

## Approved homepage refinement and future Books page, 17 October 2026

**Implemented in public static preview only:** The four-step "How it works" scroll sequence is more compact on desktop; active step numbers have readable contrast; the existing scroll-activated photography, all four exact descriptions and mobile layout are preserved. The lower CTAs now say **Choose a book** and **Explore gifting**. Gift links to the existing public gifting page.

**Interim destination:** Until a Books overview page is explicitly authorised and built, **Choose a book** continues to the homepage's working `#books` selector. Do not link to a nonexistent route.

**Documented future page. NOT BUILT:** A public `/books/` overview will introduce all six StoriLeaf books. When separately authorised, the **Choose a book** button should link to that overview. The desktop header parent **The books** label should also provide navigation to the overview while retaining the present hover-open menu and its six book links plus gift entry. Mobile navigation must retain its existing operable disclosure. The design, exact copy and construction of `/books/` are still for a future brief.

**Newsletter presentation:** The inline email-field layout has been restored visually on the homepage. The field is **disabled** because this is a frontend-only public preview, not a working subscription service. Its **Subscribe** action opens the existing public StoriLeaf newsletter heading. No addresses are captured in this repository, and successful subscription delivery is not claimed. Integrating an inline subscription form remains outside scope.

**Source workflow:** This is a narrowly scoped adjustment to the compiled frontend snapshot. The repository still needs a maintainable frontend-only source and build workflow before extensive further redesign. The official private production repository and application are unchanged.
