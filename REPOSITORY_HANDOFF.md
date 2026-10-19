# Repository handoff for StoriLeaf UI work

18 October 2026 founder session. Package 1 is applied to the existing static homepage for founder visual review. Full previous handoff records remain in [earlier handoff records](REPOSITORY_HANDOFF_HISTORY_29283c2.md) and Git history. Preserve their section approvals and exact content unless explicitly superseded.

## Current workspace and authority

This public repository is the active frontend workspace. GitHub Pages serves the existing static homepage from main and the repository root. The editable React, TypeScript and Vite workspace under frontend builds separately into frontend/dist. That source remains an incomplete component reference, not the homepage replacement.

The sole public styling authority is [Public Design System](docs/PUBLIC_DESIGN_SYSTEM.md). Read the [workflow](docs/WORKFLOW.md), [content gate](docs/CONTENT_GATE.md), [component inventory](docs/COMPONENT_INVENTORY.md) and [Package 1 record](docs/PACKAGE_1_REVIEW.md) before continuing.

Private Storileaf/storiYoceFj6IRAleaf main remains authoritative for product capabilities, packages, commercial terms and customer behaviour. UX plans and approved copy live on design/storileaf-website-ux. Repositories do not synchronise automatically. Do not use Macaly or modify private production/backend systems.

## Latest founder instruction and implementation

The founder explicitly asked to apply Package 1 to the existing published site so the visible result could be reviewed before acceptance. This supersedes the earlier source-only boundary for these specific corrections. Publishing an incomplete React homepage remains prohibited.

Published stylesheet commit fae8c1aa3640581906d430fdf1656f957da6dde6 implements 6px header/newsletter control corners, the approved primary/gold hover colours and responsive resource focus corners. Ordinary buttons, forest outlined-button text and the 45px mobile action height already matched and were preserved. Only the existing compiled CSS changed in that release commit. Other layouts, content, images, destinations, interactions, typography and spacing were not modified.

The shared stylesheet uses homepage-scoped properties with unchanged fallback values for the separate pricing preview. The protected-root guard now pins the explicitly authorised release instead of forbidding it. Do not disable that guard. The source implementation and canonical tokens remain intact.

[Candidate review 39188384903](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39188384903) passed comprehensive homepage regression, nine-width shape/state checks and before/after geometry comparison. It recorded unchanged pricing appearance; a pre-existing pricing hydration warning was independently reproduced with both stylesheets and remains a separate migration issue. See the Package 1 record for the exact diff and screenshots. Confirm source CI, Pages deployment and live verification for the final branch head, rather than assuming an earlier passing candidate run is deployment evidence.

## What still requires approval or implementation

Final founder visual acceptance of published Package 1 is pending. Package 2 typography and spacing has not started. Future package proposals must identify whether they change source only or the visible preview. The founder wants visible package reviews; each published scope must still be explicit.

Full editable homepage reconstruction, nine-width screenshot parity, complex interaction migration, account/dashboard design and final accessibility certification remain unfinished. Do not deploy frontend/dist over root. Source header/footer references do not establish full migration.

Preserve the approved physical book presentation, four circular process markers and spacing, two equal photographic Resources cards with centred heading and Browse all resources, and combined photographic newsletter/footer. Try answering a question still opens the unsaved practice dialog. A standalone practice page is a deferred plan, not a live route.

Real gallery and craft photography, final hero motion and reassurance-band decisions, Books/Resources/Activities pages, newsletter integration and wider public pages remain deferred. Do not invent product capabilities, package inclusions, pricing, delivery promises or destinations.

## Verification and working boundaries

Inspect the latest branch head before each change. Implement only the authorised scope. Keep exact wording approval separate from implementation and release approval. Use actual browser screenshots, responsive widths, keyboard/focus/touch and relevant motion/zoom/height checks. Passing automation is not founder visual approval.

The read-only Package 1 workflow tests committed files and waits for the actual Pages stylesheet before live browser checks. It no longer prepares edits or writes blobs. The historical preparation helper has been retired. The existing homepage screenshot workflow may append a QA-only bot commit; check the final Pages head after it finishes.

Macaly is not part of the current tested frontend runtime or build workflow. That does not prove every unique old project upload or setting is archived. Preserve original assets and inspect attached services before deleting the external project.
