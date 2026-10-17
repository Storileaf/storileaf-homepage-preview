# Repository handoff for StoriLeaf UI work

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
