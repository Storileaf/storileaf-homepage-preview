# Repository handoff for StoriLeaf public website work

## Current milestone

19 October 2026. Packages 1 and 2 are implemented in the isolated React source and the existing published homepage. The founder responded positively to the final Package 2 release and authorised Package 3 Group 1, covering Resources and Gifting in the editable source, their parity checks and supporting documentation. Both sections are implemented in public commit 22685299cb7912b38352875c3dd2b2f77fec6374. Source validation, all 16 tests, the isolated build, retained browser regressions and full ten-width comparison pass locally. Source, Package 2, editorial, footer and Pages workflows pass on GitHub. Corrected harness 981016e6609733cc436cf7c74b0214dda53563a1 passes the complete local Chrome 155 matrix. Two earlier CI attempts remain as diagnostic history; final dedicated CI verification is pending. See the [Group 1 review](docs/PACKAGE_3_GROUP_1_REVIEW.md) for precise results and limitations.

Retain the completed Newsreader and Manrope roles, responsive containers and spacing, 15px FAQ questions with 1.5 leading, 15px standalone editorial actions, 15px footer column headings with 1.4 leading and 13px currency text at all widths. Answers remain 15px. The current source migration does not reopen Packages 1 or 2 or create a separate retrospective approval record.

The existing static homepage remains the visual reference, including its completed foundation refinements. Preserve its exact wording, imagery, crops, proportions, layout, section order, destinations, animations and interactions. Group 1 leaves the published homepage and separate pricing preview unchanged. Later migration groups and a full React cutover require further founder approval.

Earlier section approvals and exact copy decisions remain in [earlier handoff records](REPOSITORY_HANDOFF_HISTORY_29283c2.md) and Git history. Current status here supersedes older statements that Package 1 is unapproved or Package 2 has not begun.

## Workspace and authority

Public Storileaf/storileaf-homepage-preview main is the active frontend workspace. GitHub Pages serves the root static HTML, CSS and JavaScript. The isolated frontend directory contains an incomplete React, TypeScript and Vite source foundation building into frontend/dist. Do not publish the incomplete source over the homepage.

The [Public Design System](docs/PUBLIC_DESIGN_SYSTEM.md) is the sole public style authority. Read [workflow](docs/WORKFLOW.md), [content gate](docs/CONTENT_GATE.md), [component inventory](docs/COMPONENT_INVENTORY.md), [Package 1 record](docs/PACKAGE_1_REVIEW.md), [Package 2 record](docs/PACKAGE_2_REVIEW.md) and the current [Group 1 review](docs/PACKAGE_3_GROUP_1_REVIEW.md).

Private Storileaf/storiYoceFj6IRAleaf main remains authoritative for actual product capabilities, packages, pricing, commercial terms and customer behaviour. Approved website copy and plans are on design/storileaf-website-ux. These repositories do not synchronise automatically. Do not modify private production, authentication, payments, databases, customer data or backend systems.

## Foundations and publication

Canonical typography and spacing tokens live in frontend/src/styles/foundations.css. Identity and the accepted 6px action family remain in tokens.css. Typography.tsx separates visual role from semantic heading level. Layout.tsx provides native Container and Section wrappers without introducing additional DOM layers. EditorialHeading and the existing source reference consume these foundations.

The bounded token mirror inside the static CSS is checked by sync-foundations.mjs and unit tests. Original fallbacks preserve the separate pricing preview. Existing effective CSS declarations consume tokens in place. Do not append more override layers or treat token extraction as permission for global resizing.

Retain distinct discovery, gallery, physical book, process and newsletter compositions. Standard spacing defaults do not replace intentional asymmetric section padding. The process scroll runway and reduced-motion/short-height treatments are not ordinary section spacing. Small device illustration labels are not paragraph text. The source remains a reference pending full component parity.

The protected-root guard is deliberately repinned for the authorised static release, never disabled. Package 2 candidate and live checks distinguish original and revised styles, preserve content and unrelated geometry, exercise FAQ keyboard/touch/text enlargement, and confirm the actual Pages stylesheet hash. Review the successful workflow for the relevant commit before claiming deployment evidence. A QA-only bot commit can follow the existing homepage screenshot workflow.

## Remaining work

Attach the final dedicated CI result and artifact evidence for the current corrected harness before proposing the next migration group. The source reuses existing primitives and records section exceptions in the sole design system. Its composition keeps Gifting before Resources, with the existing source header and footer still treated as references awaiting their own parity work.

Full React homepage reconstruction, complete nine-width visual and functional parity, broader browser and physical device checks, and full native zoom review remain pending. Group 1 evidence concerns its two sections only. The source build remains unpublished, and no new public page or asynchronous newsletter behaviour is introduced.

Preserve the approved physical book presentation, circular process markers, equal photographic Resources cards, centred Browse all resources, and combined photographic newsletter/footer. Try answering a question still opens the existing unsaved practice dialog. Its future standalone page remains deferred.

Genuine gallery/craft photography, final hero motion and reassurance-band decisions, Books/Resources/Activities pages, newsletter wiring and wider public pages remain deferred. Private account, Storyteller, contributor and admin interfaces need a separate compact system later.

Incorrect static current-page semantics on homepage section links remain pending navigation migration work. The separate pricing preview retains a previously reproduced hydration warning. Group 1 must preserve that preview and must not claim the warning has been resolved without specific evidence.

The targeted 200 percent section text experiment at 320×568px found Gifting heading and paragraph text clipped at the panel's right edge in both the published and React versions. The button's right edge also extends into the clipped area; the Range report does not flag its label. Resources reflows. Keep this inherited Package 4 finding visible in the records. Matching document overflow and clipping do not constitute an enlargement quality pass. A visible correction needs a scoped proposal and founder approval.

## Working rules

Inspect latest branch heads and source before editing. Implement only founder-authorised scope. Keep factual copy verification separate from exact wording approval and visual acceptance. Use real desktop/mobile screenshots and relevant focus, keyboard, touch, reduced motion, zoom and short-height tests. Passing automation is not founder approval or full accessibility certification.

Do not use Macaly. Tested public source and preview no longer depend on its runtime or build workflow. That does not prove all original project assets or attached settings are archived; preserve unique files and check attached services before deletion.


## Editorial action sizing, 19 October 2026

The founder approved 15px standalone editorial text actions in the static homepage and React source. Inline reading links inherit paragraph size. Navigation, footer utilities and buttons are excluded. The separately approved footer completion is now implemented in source and the static preview. Menu links remain 14px regular and legal text remains 13px. See docs/FOOTER_TYPE_REVIEW.md. See docs/EDITORIAL_LINK_REVIEW.md for exact scope and verification. Implementation and final visual acceptance remain distinct.
