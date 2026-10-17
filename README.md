# StoriLeaf homepage UI preview

A standalone **frontend-only** design preview for StoriLeaf. It is not the production website or customer application.

**Expected GitHub Pages address once enabled**

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

## First-time publishing

A one-time GitHub Actions job pulls the verified static UI archive and commits its frontend assets to this repository's `main` branch. See [Bootstrap standalone frontend](.github/workflows/bootstrap-frontend.yml) and [REPOSITORY_HANDOFF.md](REPOSITORY_HANDOFF.md).

When the UI files appear, open [Settings → Pages](https://github.com/Storileaf/storileaf-homepage-preview/settings/pages) and select **Deploy from a branch**, **main**, **/(root)**. Save, then wait for GitHub Pages to report that the site is live. Do not assume the address is working until it has been tested.

Future edits should update the UI deliberately, test the rendered design and record approval/QA, rather than modifying the production repository to experiment.

<!-- GitHub Pages publication retry: 2026-10-16. The static frontend is unchanged; this README update triggers a fresh branch build. -->
