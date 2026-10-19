# Frontend source, design and release workflow

Status 18 October 2026 founder session. This replaces Macaly-dependent public UI work.

## Two current states

Published Pages root is the founder-reviewed static homepage with index.html, 404.html, assets/, covers/, gallery/ and pricing/. Do not overwrite or regenerate it from incomplete source.

Editable frontend/ is the React and TypeScript foundation for shared components and future public pages. Its Vite build produces frontend/dist and is isolated from the published root. The live homepage is not yet fully reimplemented there. Building the foundation does not establish visual or behavioural parity.

Private official main is read-only for this work and remains authoritative for product and commercial facts. Public preview main is the frontend workspace. Private UX documentation is maintained on design/storileaf-website-ux. No automatic synchronisation exists.

## Controlled visible package reviews

The founder asked to see styling packages on the existing published homepage before final visual acceptance. Package 1 was specifically authorised for publication after its source work. This does not grant blanket permission for future visible changes or whole-homepage replacement.

For each package, state whether it is source-only, a bounded published correction or a replacement page. Obtain approval of exact scope. A small authorised correction may edit the relevant existing static CSS rule in place, without appending more override layers, reconstructing unrelated sections or deploying frontend/dist. Preserve approved content, images, destinations and interactions.

Compare original and changed rendering before release. Update the protected baseline deliberately to the verified correction commit, never disable protection. Keep source tokens and public design documentation aligned. Verify Pages deployment and the actual live browser result, then request founder visual review. Implementation approval and final visual acceptance are distinct.

## Ordered workflow

1. Retrieve current public main HEAD, relevant files and founder decisions. Read current private product documentation when product facts or copy are involved.
2. Define the page or correction's job, structure, exact copy and interaction boundaries.
3. Pass the Content Gate for new or revised public wording. A factual source is not founder approval of exact copy.
4. Pass active design-system and responsive review before authorising visible changes.
5. Build maintainable React components for new pages. Use the bounded exception above for specifically approved static homepage corrections.
6. Run content validation, TypeScript, component tests, isolated build and published-file protection.
7. Inspect rendered desktop/mobile states, keyboard, focus, relevant touch, zoom and reduced motion.
8. Obtain founder approval for material visible changes and destinations before release.
9. Publish only the approved target. Confirm actual successful Pages deployment for the final branch HEAD and inspect the live output.
10. Update affected decisions, component status, design documents and both repository handoffs after substantial milestones. Final visual acceptance must remain explicit.

## Source commands and protection

From frontend run npm ci, npm run check, npm run build and npm run preview. The compiled result remains an isolated reference, not the published homepage. The source workflow is read-only and must not push generated root files.

scripts/verify-homepage-ui.mjs is the existing static Chromium regression. frontend/scripts/guard-published.mjs pins the protected release, documented in frontend/baseline/README.md. Changes to protected files require a scoped approval, browser evidence and deliberate baseline update.

The read-only review-published-package1 workflow retains live action, focus and navigation checks at all nine widths. Its original before/after comparison is historical evidence, not a veto on later authorised typography. The Package 2 review owns the current typography and spacing comparison. Candidate preparation code was retired after release. QA artifacts are evidence, not a second implementation. The existing homepage QA workflow may append a screenshot-only commit; verify its final deployment too.

## Cutover criteria

The future Homepage must reproduce the actual published homepage, including copy, images, dropdowns, navigation, tabs, gallery/lightbox, sticky four-stage sequence, writing modal until its separately approved page, newsletter/footer and responsive states. Require deterministic static rendering or a reviewed strategy without hydration mismatch.

Require screenshots at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px against the protected baseline. Compare fonts, colours, position and content, and test relevant expanded, hover, focus, keyboard, touch, reduced-motion, zoom and short-height states. Verify pricing/currency navigation and accessible labels. Only founder acceptance authorises the complete React cutover. Experimental dist is never automatically deployed.

## Maintainability and status

Public design-system documentation describes reusable decisions. The source token file is canonical for new components. Components own scoped rules. Static CSS is the migration reference and may receive only explicit bounded corrections until each component has accepted parity. Do not add global override layers or silently remove approved material.

Use proposed, founder-approved, implemented-preview, browser-verified and production-released separately. Preserve superseded history without maintaining contradictory active rules or duplicate product specifications.

## Content, page ownership and performance

Use the public page specification template and component inventory. An approximate source reference is not a migrated component. A card becomes a whole-card link only for a verified destination. Resources, Activities and practice plans are not automatically live routes. The shared NewsletterFooter should be reused with deliberate route props after complete parity acceptance.

Source checks validate copy provenance, approved states, ledger references, destinations and image metadata. They cannot replace human factual review or exact founder approval. No new claims can be inferred from existing production pages alone.

Images reserve intrinsic dimensions, have meaningful alt text, appropriate crop/srcset/sizes and lazy loading except justified priority assets. Keep fonts efficient and motion restrained. Do not add generic skeletons to static content. Full performance optimisation follows broader website implementation; it does not justify changing approved photography, animation or layouts now.

## Repository boundaries

Do not run the retired Macaly importer. Do not commit secrets, proprietary fonts, customer data, authentication, payments, databases, private app code or unauthorised newsletter integrations to the public repo. Do not modify private production main.

Account, Storyteller, contributor and admin interfaces remain a separate later design project. Passing source, static or live browser checks is not founder visual approval, physical-device certification or full accessibility certification.

## Package 2 continuity

Foundation CSS is the canonical type/spacing source and its homepage mirror is tested. Changes need corresponding source/static browser evidence and a deliberate protected-baseline update. Keep the earlier package history for audit, but replace temporary source edit whitelists with semantic regression checks when later work is authorised. Passing tests and publication for review remain distinct from final founder acceptance.
