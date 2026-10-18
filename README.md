# StoriLeaf homepage UI preview

**Current homepage preview, 18 October 2026.** The compact four-step process pins below the header, with its photograph aligned alongside the steps and no divider above the first or beneath the fourth. The 94px desktop rows still change independently as the visitor scrolls. The FAQ invitation and newsletter remain present. See the QA screenshots and report under `qa/`.

**Earlier homepage preview, 18 October 2026.** The How it works stages are compact and use an independent scroll runway. The original FAQ final invitation has been restored before the newsletter. The future six-book overview page remains unbuilt. See [REPOSITORY_HANDOFF.md](REPOSITORY_HANDOFF.md) and `qa/homepage-qa-report.json` for the specific implementation and QA results.



A standalone **frontend-only** design preview for StoriLeaf. It is not the production website or customer application.

**Live GitHub Pages homepage preview (verified 16 October 2026)**

https://storileaf.github.io/storileaf-homepage-preview/

## Which GitHub repository to use

| Repository | Purpose |
| --- | --- |
| [Storileaf/storiYoceFj6IRAleaf](https://github.com/Storileaf/storiYoceFj6IRAleaf) | Private official product/application repository, actual public website, product documentation and approved homepage UX decisions |
| [Storileaf/storileaf-homepage-preview](https://github.com/Storileaf/storileaf-homepage-preview) | This public repository, containing only the static frontend design preview and its approved marketing images |

**The repositories do not synchronise automatically.** The approved homepage direction is documented in [the private repository's Homepage Master Brief](https://github.com/Storileaf/storiYoceFj6IRAleaf/blob/design/storileaf-website-ux/website-ux/docs/HOMEPAGE_MASTER_IMPLEMENTATION_BRIEF.md). Product, package, pricing, purchase, login and private app capabilities must always be checked against the private official repository, not inferred from this prototype.

## Frontend-only boundary

Only compiled HTML, CSS, JavaScript, approved public book-cover images and the static Pages deployment workflow belong here.

**Do not add** backend/API code, database or customer data, authentication or billing implementation, secrets, checkout integrations, `convex/`, private app source or server configuration.

The current export shows the homepage and a pricing **UI-only** mock-up. Some links open the existing public StoriLeaf site or separate application. They are navigation destinations, not backend implementation inside this repository.

This preview is public and marked `noindex`, but anyone with the link may view it. The actual StoriLeaf domain and live code are unchanged.

## Pages status and setup

A one-time GitHub Actions job pulls the verified static UI archive and commits its frontend assets to this repository's `main` branch. See [Bootstrap standalone frontend](.github/workflows/bootstrap-frontend.yml) and [REPOSITORY_HANDOFF.md](REPOSITORY_HANDOFF.md).

Pages is configured to deploy from **main → /(root)**. The [successful GitHub Pages deployment](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/38987374849) completed after an explicit README-only commit triggered the site's first Pages build. The live homepage, bundled cover thumbnails, six interactive book tabs and mobile navigation were tested in a browser; no document-wide overflow was observed at 1440px and 390px. This is a visual prototype, not a production release.

Future edits should update the UI deliberately, test the rendered design and record approval/QA, rather than modifying the production repository to experiment.

<!-- Initial Pages deployment completed successfully after a README-only push on 16 October 2026. -->

## Latest homepage preview adjustment

The How it works steps are condensed and their active numbers remain legible. The CTAs are **Choose a book** (temporarily returns to the on-page six-book selector) and **Explore gifting** (existing gift page). The inline newsletter layout is visible again, but email collection is not connected in this frontend-only preview; the subscription action points to the existing public site. The future `/books/` overview and corresponding header navigation are documented in [REPOSITORY_HANDOFF.md](REPOSITORY_HANDOFF.md), **not built**.
