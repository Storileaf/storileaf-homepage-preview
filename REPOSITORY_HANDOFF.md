# Repository handoff for StoriLeaf UI work

## Corrective homepage pass, 18 October 2026

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
