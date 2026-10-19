# Package 1 review

18 October 2026. Approved source scope implemented. Published homepage unchanged.

The [Public Design System](PUBLIC_DESIGN_SYSTEM.md) is the sole public style authority. This file records approval, implementation and verification, not a competing specification. The complete earlier review is preserved unchanged in [Package 1 history](PACKAGE_1_REVIEW_HISTORY_29283c2.md).

## Founder approval

After the two earlier source corrections, the founder explicitly answered yes to one 6px rectangular action family, explicit forest text for outlined actions and shared primary/gold hover feedback using the existing header and newsletter colours. The approval expressly left the published homepage untouched.

This supersedes the temporary retention of separate 9px header, newsletter and gold values in editable source. Those differences were inherited implementation details, not a required design hierarchy.

## Implemented source changes

Commit 9946f52804175998690af9c89cd6d09b957ad93a gives ordinary filled and outlined actions, the header action, gold actions and paired newsletter controls one 6px value. Existing component token names alias the action token so they cannot drift independently.

Outlined actions now specify forest #253526. Interactive primary ActionLink anchors use #0b5848 on hover, matching the header. Interactive gold anchors use #e9cb93, matching the newsletter. The existing header and newsletter feedback now reads the shared colour tokens. Their normal colours and text colours are unchanged.

New hover rules exclude planned ActionLink spans. No destination, copy, image, component behaviour, disabled/loading API or subscription integration changed. Outline and text hover palettes were not redesigned. Pointer-held appearances retain their hover treatment without geometry changes.

Earlier approved corrections remain in place. The mobile source header action is 45px high at 390px and 430px. Resource focus follows its parent's 17px small-screen or 20px wider radius, retaining the existing outline thickness and inset. Other card, media, panel, icon, navigation and utility control shapes remain unchanged.

## Verification evidence

[Source validation and Chromium run 39185486663](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39185486663) passed for the styling commit. It covered types, content provenance, protected published files, the existing nine foundation tests, isolated compilation, navigation, mobile dialog, currency routes, shared footer, shape and state checks.

The shape report recorded no problems at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. Normal source element geometry, typography, padding and margins were unchanged against source baseline 29283c2223f9c88d5161a079d287edf30f724f72 at all nine widths. Header and newsletter radii changed only from 9px to 6px. Responsive resource focus remained correct.

State checks exercised actual header/newsletter controls and test-only ActionLink fixtures. They verified normal, hover, pointer-held and keyboard focus states, explicit outline text and non-interactive planned spans. Fixtures are not new public copy. External navigation and newsletter submission were not invoked.

A QA-only follow-up clears transient text selection left by pointer-held tests before review screenshots. It preserves focus and page styling. Both clean component captures and complete desktop/mobile source captures are produced by the [source workflow](../.github/workflows/validate-public-source.yml), with reports in its browser QA artifact. Read the run for the actual checked commit rather than assuming an earlier successful run covers later code.

## Published boundary

The original static homepage, pricing routes, compiled bundles, covers and gallery remain protected. The static header and newsletter still retain 9px corners. The approved 6px source rule is an intentional migration refinement, not permission to publish a new homepage. Full reconstruction and founder acceptance remain required.

The source guard restricts this styling package to the approved token and CSS changes. A later authorised typography or migration package must deliberately update this temporary review boundary. Do not bypass published-root protection.

## Completion and next work

The approved Package 1 source corrections and state rules are implemented. This is not a declaration of full homepage parity, finished accessibility certification or founder acceptance of the rendered replacement. Future genuine asynchronous controls need separate disabled/loading behaviour and content approval. Navigation and specialised controls still require their own migration parity checks.

The next proposed package is measured typography and spacing foundations. Do not begin visible typography changes or migrate new sections without the corresponding founder instruction.

## Macaly boundary retained

The current public workflow no longer imports or builds from Macaly. Runtime/configuration scanning and browser checks recorded no Macaly references or attempted requests in the tested preview/source states. Historical references are preserved in the earlier review.

This does not certify that every original project upload, source file, domain setting or integration is archived. Preserve unique source and assets and check attached services before deleting an external project. The private production platform was not modified or fully audited by this package.
