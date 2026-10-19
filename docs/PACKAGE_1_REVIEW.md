# Package 1 review

18 October 2026 founder session. Source implementation completed, then publication to the existing static homepage explicitly authorised for visual review. The founder accepted the published result before authorising Package 2.

The [Public Design System](PUBLIC_DESIGN_SYSTEM.md) is the sole public style authority. This file records approval, implementation and verification, not a competing specification. Earlier analysis is preserved in [Package 1 history](PACKAGE_1_REVIEW_HISTORY_29283c2.md) and this file's Git history.

## Latest founder instruction and publication

The founder requested that Package 1 be applied to the existing published site so its visible effects can be inspected and approved. This supersedes the earlier instruction to retain changes only in editable source for this package. It does not authorise publishing the unfinished React component gallery or redesigning any section.

Published styling commit fae8c1aa3640581906d430fdf1656f957da6dde6 changes only assets/index-DhPZyX4z.css. The verified stylesheet blob is 63264460b41696c96dcd7bf5e3643986aa3b17d8. The previous CSS blob was 3c1a3051f8a3428197a261213012b99acafde249.

The static header action and both newsletter controls now use 6px corners. Ordinary buttons already used 6px. Primary button hover is #0b5848. Gold button hover is #e9cb93, matching the newsletter's existing hover treatment. Normal gold colours remain as published, including antique gold on the gifting action. Resource focus inherits the parent card's 17px small-screen or 20px wider corner, preserving outline thickness and inset.

The published outlined buttons already had forest text and the mobile header action already measured 45px, so no redundant text-colour or height edit was made. All layouts, typography, spacing, wording, images, destinations, animations and existing interactions are retained. Homepage-scoped properties with fallbacks preserve the separate pricing preview's appearance.

The published homepage remains static HTML/CSS/JavaScript. Nothing from frontend/dist replaces it. The protected-root guard is repinned to the specifically authorised CSS commit, not disabled.

## Prepublication verification

[Candidate review run 39188384903](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39188384903) passed the existing comprehensive homepage browser regression and the Package 1 comparative checks before release. Its [artifact 12159027522](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39188384903/artifacts/12159027522) contains the exact CSS diff, original/candidate files, reports and actual desktop/mobile screenshots.

All nine required widths, 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px, recorded unchanged measured geometry, text, typography, padding and margins. Header/newsletter corners measured 6px; source-matching 45px mobile action height was preserved. The responsive resource focus, normal/hover/held/focus action states and document overflow checks passed.

The original homepage regression verified the header menus, six-book tabs, gallery/lightbox, carousel and physical slideshow, four-stage process, writing practice, Resources composition and combined newsletter/footer. No external navigation or subscription submission was performed by the new tests.

The separate pricing preview retained identical measured appearance. Its existing React hydration error 418 was independently reproduced with both original and candidate stylesheets and recorded in the comparison report. It is a pre-existing pricing migration issue, not a new Package 1 regression or a claim of error-free pricing. No pricing code was changed.

The permanent read-only Package 1 workflow rechecks committed static files and the actual GitHub Pages URL. Its live stage waits for the deployed stylesheet hash, then opens a fresh browser without stylesheet injection or mocked requests, checks all nine widths and records live desktop/mobile images. Read the run for the actual final branch head before claiming successful deployment or live verification. Automated results are not final founder visual approval.

## Original source implementation

The founder approved one 6px rectangular action family, explicit forest outlined-action text and shared primary/gold hover feedback. Source commit 9946f52804175998690af9c89cd6d09b957ad93a implemented these. Follow-up 870aadee138b989423a8ef1ffec7ce826f452943 documented them and improved review screenshots.

Header, gold and newsletter source token names alias the ordinary 6px action token. Outlined source actions use forest #253526. Actual primary ActionLink anchors use #0b5848 on hover; gold anchors use #e9cb93. New hover rules exclude planned non-interactive spans. Existing source normal geometry and colours are otherwise retained.

Earlier approved source corrections remain. The mobile header action is 45px at 390px and 430px. Resource focus follows the parent card radius while retaining the 3px outline and 5px inset. Other card, media, panel, icon, navigation and utility shapes remain unchanged.

[Source run 39185486663](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39185486663) passed the original source checks. Later source regression expectations now recognise the specifically authorised published 6px header/newsletter update. Temporary source-edit guards still require deliberate updates for future authorised styling packages.

## Scope and next decision

Package 1's approved source and published refinements are implemented for founder review. Full React migration, complete visual parity, physical-device accessibility review and final design acceptance remain outstanding. The next proposed stage is measured typography and spacing. Do not begin Package 2 or another visible change without instruction.

No copy, pricing, destination, disabled/loading API, asynchronous operation or subscription integration was added. Outline/text hover palettes were not redesigned. Future genuine asynchronous controls require separate behaviour and content approval. The current writing practice remains the existing unsaved dialog.

## Macaly boundary

The current public workflow no longer imports or builds from Macaly. Runtime/configuration scans and tested preview/source states recorded no Macaly references or requests. Historical references are preserved.

This does not certify that every original project upload, source file, domain setting or integration is archived. Preserve unique assets and check attached services before deleting an external project. Private production systems were not modified or fully audited by this package.
