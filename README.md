# StoriLeaf public website preview and frontend source

Frontend design work only. This is not the production website or private customer application.

[Published homepage preview](https://storileaf.github.io/storileaf-homepage-preview/)

## Current authority

The founder approved homepage is the visual reference for the new public website. Its published version is still the root static HTML, CSS and compiled JavaScript. Preserve its content, imagery, proportions, section order and interactions during source migration. Further visible refinements require separate agreement.

The active [public design system](docs/PUBLIC_DESIGN_SYSTEM.md) supersedes historical Georgia/Lato and pill styling for the new public site with Newsreader, Manrope and the approved editorial homepage geometry.

Use the [documentation index](docs/README.md) to find each authoritative record. The [handoff](REPOSITORY_HANDOFF.md) owns current work and next steps, the [component inventory](docs/COMPONENT_INVENTORY.md) owns status, the [content gate](docs/CONTENT_GATE.md) owns wording and provenance rules, and the [workflow](docs/WORKFLOW.md) owns development, documentation and release boundaries. The [performance foundations](docs/PERFORMANCE.md) and [decision register](docs/DECISIONS.md) retain their specialist guidance.

Official private Storileaf/storiYoceFj6IRAleaf main remains authoritative for actual product capabilities, packages, pricing, customer behaviour and production code. The private design/storileaf-website-ux branch records website wording and page decisions. These repositories do not automatically synchronise.

## Editable React source

The [frontend workspace](frontend/) uses Vite, React and TypeScript for staged homepage migration. It includes content provenance, design tokens, reusable components, migrated sections, tests and an isolated build. The [source validation workflow](.github/workflows/validate-public-source.yml) checks it without changing published root assets.

Packages 1 and 2 remain complete in source and the published homepage. Current section milestones, remaining work and detailed migration reviews are maintained in the component inventory and handoff linked above. Passing comparisons do not supply founder rendered acceptance. This README does not maintain a second list of group completion states.

The complete React homepage is assembled and verified for its recorded scopes. Source output remains under frontend/dist. The separately authorised react-review address contains a fixed verified snapshot and does not update automatically. Root replacement still requires complete applicable verification, founder rendered acceptance and explicit approval.

For local development, use Node 22 and the existing commands.

    cd frontend
    npm ci
    npm run check
    npm run build
    npm run dev

## Verification and documentation

The [homepage QA workflow](.github/workflows/verify-homepage-ui.yml) checks the published static UI. Source and migration workflows retain their own scoped comparisons. Automated Chromium checks and emulated touch are not native zoom, other browser, physical device or accessibility certification.

The [pricing investigation](docs/PRICING_HYDRATION_REVIEW.md) records the verified and published default saved footer correction. Currency route documents and selected book query snapshots remain unresolved and require separate repair approval. Existing enlargement findings remain in their owning reviews. The [gallery guidance](gallery/README.md) records temporary image slots and replacement photography work.

Leaner documentation preserves full detail with one maintained owner per subject. The complete preceding README remains at [its immutable revision](https://github.com/Storileaf/storileaf-homepage-preview/blob/46cd1e7ef9aadb1b07fa68b4f137a3d24dffc403/README.md), and the [Group 5 closure README](https://github.com/Storileaf/storileaf-homepage-preview/blob/4c8fa3b6c25f29ae0e3f18bf5d7fbb8d03501cec/README.md) preserves its former milestone summary. Historical test records identify their tested source; the Pages run attached to each commit is the authority for that commit's deployment outcome. A successful documentation deployment does not publish the isolated React build.

## Scope and safeguards

Use public main for authorised frontend work only. Do not commit customer data, private product code, credentials, payments, authentication, databases, unauthorised subscription integrations or proprietary font files. Keep the published file guard enabled. No private production or backend work is included.

Do not use Macaly. Its old importer workflow has been retired; this does not establish that all external assets, domains and integrations have been archived or removed.

Future account, Storyteller, contributor and admin interfaces need separate, denser design decisions. The public editorial system is not permission to redesign those applications.
