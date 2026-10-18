# Frontend source, design and release workflow

Status 18 October 2026. This workflow replaces Macaly-dependent public UI implementation for new website work.

## Two current states

Published Pages root is the current founder-approved static homepage with index.html, 404.html, assets/, covers/, gallery/ and pricing/. Do not overwrite or regenerate it while source parity is incomplete.

Editable frontend/ is the NEW React and TypeScript foundation for shared components and future public pages. Its Vite build produces frontend/dist/ and is isolated from the published repository root. The live homepage is not yet reimplemented in this editable source. Building the foundation does NOT establish visual or behavioural parity.

Private official repository main is read-only for this work and remains the source of actual product and commercial facts. Only the public preview main can be used for frontend work, and private UX documentation is maintained on design/storileaf-website-ux. No automatic synchronisation exists.

## Ordered workflow

1. Retrieve current public main HEAD, relevant source, latest founder decisions and private product documentation.
2. Write the proposed page's single job, page structure, copy and interaction boundaries.
3. Pass Content Gate before publishing public wording. Separate proposed copy from exact founder acceptance.
4. Pass the active public design system and mandatory responsive review before authorising visual modifications.
5. Build or edit source-controlled React components. Do not manually patch built bundles for new pages.
6. Run content ledger validation, TypeScript check, build and published-root immutability guard.
7. Verify actual rendered output, desktop/mobile and interaction states; include keyboard, zoom and reduced-motion.
8. Obtain founder approval for material visible changes and destinations.
9. Publish only the approved target. Confirm actual successful GitHub Pages deployment for the final branch HEAD.
10. Update decision log, source/component docs, status and both repository handoffs for substantial milestones.

## Source commands

From the frontend directory run npm install, npm run check, npm run build and npm run preview. The compiled result is an isolated component foundation, not the production root. A GitHub workflow checks this on code changes.

For the existing static site, scripts/verify-homepage-ui.mjs remains the documented Chromium browser regression. The root files are protected by the pinned approved release commit in frontend/scripts/guard-published.mjs, with context in frontend/baseline/README.md, while migration proceeds. Changes to those files require an explicitly scoped approved edit and a deliberate baseline update with fresh screenshots.

## Cutover criteria

The future editable Homepage component must reproduce the actual published homepage, including full content, interactive menu/dropdowns, tabs, gallery lightbox, sticky four-step sequence, writing modal (until its separately approved page), newsletter/footer, responsive states and all image assets. The React output needs deterministic static rendering or an otherwise reviewed no-hydration-mismatch strategy.

Require nine-width visual snapshots and interaction checks against the current baseline. Compare real desktop and mobile layouts, fonts, colour, content and positioning. Check accessible links/labels and source-only routing of pricing and other pages. Only after founder review may built source replace published root files. There is no automatic deployment of the experimental dist directory.

## Maintainability

Public design-system docs describe reusable decisions. Components own their own scoped rules. The source token file is canonical for implementation. Old CSS remains as a reference only until each visual component is migrated and parity accepted. Do not append more global override layers or silently remove founder-approved content.

Use project-level status words consistently. Proposed, founder-approved, implemented-preview, browser-verified and production-released are separate. Documentation should keep current rules concise, preserve superseded history, and avoid duplicating product specifications.

## Repository boundaries

Do not run the old Macaly bootstrap importer. Do not commit API secrets, paid fonts, customer data, authentication, database, payment handlers or private app code to the public frontend. Do not modify the official private production main branch.

## Source component parity and CI safety

Reusable components should expose structured props for type, image dimensions, semantics and destination state. A card is a whole-card link only when a genuine destination exists. Static editorial images reserve space and use lazy loading by default; measured LCP images may opt into eager loading. Do not add generic skeletons to static photography.

The isolated React source validator installs from a committed npm lockfile with read-only repository access. It must never push generated files or replace the GitHub Pages root. The content gate validates exact copy provenance, approved public states, use of ledger IDs and verified destinations. Browser QA and founder sign-off remain separate requirements for publishing any regenerated homepage.
