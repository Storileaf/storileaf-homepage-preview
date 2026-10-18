# StoriLeaf public website preview and frontend source

Status 18 October 2026. Frontend design work only. This is not the production website or private customer application.

**Published homepage**  
https://storileaf.github.io/storileaf-homepage-preview/

## Current authority

The founder-approved homepage is the visual reference for the next generation of public website pages. Its current published version is still the root static HTML/CSS/JavaScript. Do not change its content, section order or interactions during design-system consolidation without a separately agreed correction.

The active [public design system](docs/PUBLIC_DESIGN_SYSTEM.md) replaces earlier Georgia/Lato and pill-only website styling with Newsreader, Manrope and the current warm editorial site direction.

- [Public website documentation index](docs/README.md)
- [Content creation and factual approval gate](docs/CONTENT_GATE.md)
- [Development, parity and QA workflow](docs/WORKFLOW.md)
- [Early performance foundations](docs/PERFORMANCE.md)
- [Founder decisions and deferred work](docs/DECISIONS.md)
- [Implementation handoff and historical decisions](REPOSITORY_HANDOFF.md)

The official private repository Storileaf/storiYoceFj6IRAleaf remains authoritative for actual product, packages, pricing, customer behaviour and production code. The private UX branch design/storileaf-website-ux records the approved public website copy and page decisions. These repositories do not automatically synchronise.

## Editable React source

The new [frontend/](frontend/) workspace is a Vite, React and TypeScript source foundation for reusable components and future public pages. It includes a content approval ledger, design tokens, typed components, tests and an isolated build. The [source build workflow](.github/workflows/validate-public-source.yml) checks these without changing published root assets.

**Migration status:** this source workspace is NOT yet a complete replacement for the approved homepage. The source-driven component reference is an initial slice of the page's design. Before moving the published homepage to editable React, all sections, wording, interactions, browser states and screenshots must match the approved static baseline. The build output stays under frontend/dist and is not published automatically.

To develop the source locally, install Node 22 and run:

    cd frontend
    npm ci
    npm run check
    npm run build
    npm run dev

Current source validation uses the approved root baseline and nine-width static-site Chromium QA as a separate reference.

## Existing browser QA

The [homepage QA workflow](.github/workflows/verify-homepage-ui.yml) tests the published static UI and records screenshots under [qa/](qa/). Passing automated QA is not founder visual acceptance or full accessibility/physical-device certification.

Photo replacements for the six book gallery slots are documented in [gallery/README.md](gallery/README.md). Current homepage imagery includes approved temporary assets and visual placeholders.

## Scope and safety

Use the public repo for approved frontend work only. Do not commit customer data, private product code, credentials, payments, authentication, databases, unauthorised subscription integrations or proprietary font files. Do not use Macaly to implement further changes.

Future account, Storyteller, contributor and admin pages will receive their own denser/dashboard-appropriate styling decisions later. The public website system is not a mandate to redesign those private applications.

The older Macaly importer workflow has been retired so it cannot overwrite the current approved public homepage.
