# Repository handoff for StoriLeaf UI work

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
