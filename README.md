# StoriLeaf public website preview and frontend source

Updated at the Package 3 Group 5 documentation checkpoint. Frontend design work only. This is not the production website or private customer application.

[Published homepage preview](https://storileaf.github.io/storileaf-homepage-preview/)

## Current authority

The founder approved homepage is the visual reference for the new public website. Its published version is still the root static HTML, CSS and compiled JavaScript. Preserve its content, imagery, proportions, section order and interactions during source migration. Further visible refinements require separate agreement.

The active [public design system](docs/PUBLIC_DESIGN_SYSTEM.md) supersedes historical Georgia/Lato and pill styling for the new public site with Newsreader, Manrope and the approved editorial homepage geometry.

Use the [documentation index](docs/README.md) to find each authoritative record. The [handoff](REPOSITORY_HANDOFF.md) owns current work and next steps, the [component inventory](docs/COMPONENT_INVENTORY.md) owns status, the [content gate](docs/CONTENT_GATE.md) owns wording and provenance rules, and the [workflow](docs/WORKFLOW.md) owns development, documentation and release boundaries. The [performance foundations](docs/PERFORMANCE.md) and [decision register](docs/DECISIONS.md) retain their specialist guidance.

Official private Storileaf/storiYoceFj6IRAleaf main remains authoritative for actual product capabilities, packages, pricing, customer behaviour and production code. The private design/storileaf-website-ux branch records website wording and page decisions. These repositories do not automatically synchronise.

## Editable React source

The [frontend workspace](frontend/) uses Vite, React and TypeScript for staged homepage migration. It includes content provenance, design tokens, reusable components, migrated sections, tests and an isolated build. The [source validation workflow](.github/workflows/validate-public-source.yml) checks it without changing published root assets.

Packages 1 and 2 remain complete in source and the published homepage. Package 3 Groups 1 through 5 have completed implementation and browser verification within their recorded scopes. The gallery and lightbox passed first, followed by the physical book slideshow and complete shared samples field. The [Group 5 review](docs/PACKAGE_3_GROUP_5_REVIEW.md) owns this batch's evidence. The component inventory links all earlier reviews and identifies the remaining sections. Passing comparisons do not supply founder rendered acceptance.

The complete React homepage remains unfinished. How it works, hero/motion, writing showcase/dialog and final assembly still need their agreed work and checks. The output remains under frontend/dist and is not published automatically. A complete publishing switch requires full visual and functional parity and explicit founder approval.

For local development, use Node 22 and the existing commands.

    cd frontend
    npm ci
    npm run check
    npm run build
    npm run dev

## Verification and documentation

The [homepage QA workflow](.github/workflows/verify-homepage-ui.yml) checks the published static UI. Source and migration workflows retain their own scoped comparisons. Automated Chromium checks and emulated touch are not native zoom, other browser, physical device or accessibility certification.

The [pricing investigation](docs/PRICING_HYDRATION_REVIEW.md) records three unresolved export mismatches. Existing enlargement findings remain in their owning reviews. The protected pricing preview is unchanged. The [gallery guidance](gallery/README.md) records temporary image slots and replacement photography work.

Leaner documentation preserves full detail with one maintained owner per subject. The complete preceding README remains at [its immutable revision](https://github.com/Storileaf/storileaf-homepage-preview/blob/46cd1e7ef9aadb1b07fa68b4f137a3d24dffc403/README.md). Historical test records identify their tested source; the Pages run attached to each commit is the authority for that commit's deployment outcome. A successful documentation deployment does not publish the isolated React build.

## Scope and safeguards

Use public main for authorised frontend work only. Do not commit customer data, private product code, credentials, payments, authentication, databases, unauthorised subscription integrations or proprietary font files. Keep the published file guard enabled. No private production or backend work is included.

Do not use Macaly. Its old importer workflow has been retired; this does not establish that all external assets, domains and integrations have been archived or removed.

Future account, Storyteller, contributor and admin interfaces need separate, denser design decisions. The public editorial system is not permission to redesign those applications.
