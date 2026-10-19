# StoriLeaf public website foundations

Updated 19 October 2026. These documents govern the NEW public website, not the existing account, Storyteller, contributor or admin applications.

Read the active [public design system](PUBLIC_DESIGN_SYSTEM.md), [content gate](CONTENT_GATE.md), [frontend workflow](WORKFLOW.md), [performance foundations](PERFORMANCE.md) and [decision register](DECISIONS.md) before starting pages.

## Authority and boundaries

Latest founder decisions take precedence for the new public website. The approved homepage is the visual baseline. The official private repository Storileaf/storiYoceFj6IRAleaf at main is authoritative for product capabilities, pricing, package terms, commercial promises, customer journeys and private applications. Brand DNA governs identity and storytelling. Private website UX documents on design/storileaf-website-ux record accepted wording and page decisions.

The prior private production Design System v1.1 specifies Georgia/Lato and predominantly pill controls. Those rules are superseded for the NEW PUBLIC WEBSITE by Newsreader/Manrope and the approved homepage geometry. They continue to describe existing account/admin interfaces until a separate redesign is authorised.

The public GitHub Pages preview deploys from main and repository root. The new frontend/ React workspace is an isolated migration foundation, not yet the source of the existing published homepage. Replacing the root static assets requires separately verified visual and functional parity. No Macaly development, backend or private production edits are authorised by these rules.

Do not treat successful CI, a proposal, an approved design, a working preview and a production release as interchangeable.

## Implementation references

- [Component migration inventory](COMPONENT_INVENTORY.md) keeps published versus editable source states distinct.
- [Content proposal template](CONTENT_PROPOSAL_TEMPLATE.md) captures verified claims, exact copy approvals and destination status.

- [Reusable public page design and release template](PAGE_SPEC_TEMPLATE.md) records source-backed copy, visual decisions, responsive behaviour and implementation proof before publishing more pages.

Package 2 typography and spacing evidence is recorded in [Package 2 review](PACKAGE_2_REVIEW.md). PUBLIC_DESIGN_SYSTEM.md remains the sole public style authority.

Package 3 Group 1 has implemented Resources and Gifting in isolated source. The [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md) records source commit 2268529, the current 15d4500 readiness/alignment harness, local evidence, earlier failed attempts, the passing 981 CI, a later failed clean-a64 replay and the inherited text enlargement finding. The working harness matching 15d passes the full local Chrome 155 matrix; its dedicated CI run 39281803940 is verified from the downloaded report and completed job log, including all retained gates and both protected-runtime guards. Programmatic component alignment is checked, while shared header navigation and URL fragment/history/restoration behaviour remain later shell work. Later groups and a complete React publishing cutover require further approval.
