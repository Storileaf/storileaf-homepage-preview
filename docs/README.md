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

Package 3 Group 1 has implemented Resources and Gifting in isolated source. The [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md) records source commit 2268529, the current 15d4500 readiness/alignment harness, local evidence, earlier failed attempts, the passing 981 CI, a later failed clean-a64 replay and the inherited text enlargement finding. The working harness matching 15d passes the full local Chrome 155 matrix; its dedicated CI run 39281803940 is verified from the downloaded report and completed job log, including all retained gates and both protected-runtime guards. Group 1 checked programmatic component alignment. Shared navigation and URL fragment/history/restoration behaviour were outside its scope and now belong to Group 3 below.

Package 3 Group 2 implements the reassurance band, six native FAQs and final invitation in isolated source, preserving current wording, position and expanded layouts. Source remains as committed at 8cd289a, with complete local evidence and final committed CI passing at gate correction 6b5f983. The [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md) owns copy provenance, rendered results, artifact links, retained findings and the initial editorial count failure and correction.

Package 3 Group 3 is authorised for shared header, newsletter, footer and navigation parity, including currency, anchors, current page semantics and pricing investigation. Source implementation, complete local rendered and functional verification, and the committed CI replay pass. The [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md) owns its evidence and current review state. The [pricing hydration review](PRICING_HYDRATION_REVIEW.md) preserves the read-only diagnosis and bounded future repair options; the protected pricing export is unchanged.

The homepage remains incomplete and unpublished as React. Founder rendered acceptance, work beyond the authorised shared group and a complete React cutover remain separate gates. PUBLIC_DESIGN_SYSTEM.md is the sole active style authority.
