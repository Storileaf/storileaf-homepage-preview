# Public website decisions and future work

Updated 19 October 2026.

## Active decisions

The existing homepage is the approved VISUAL REFERENCE for all future public marketing/editorial website pages. No major layout or content changes during style consolidation; only small measured differences may be proposed or corrected.

Newsreader and Manrope, forest/teal/paper/sage/gold, restrained editorial control shapes and original wordmark on forest supersede older Georgia/Lato and blanket pill-control direction for the NEW PUBLIC WEBSITE.

Use a shared photographic newsletter-to-footer composition across public pages. Content, consent and real subscription wiring still need separate decisions.

Create a proper React source/build pipeline in the public preview, with source parity gates before replacing existing static root. Use the private official repository for factual claims and the new public Content Gate for approval tracking. The old site is a useful reference, not a mandatory design template.

Create performance-conscious foundations, including image dimensions, selective lazy loading, font strategy and real asynchronous skeletons when needed. Final optimisation comes after the wider public site is built.

Keep documentation current and concise. Historical Macaly design passes and the old Design System v1.1 are context, not the active authority for new pages.

## Boundaries

Public website now, account/Storyteller/contributor/admin pages later. Future authenticated dashboards may share colour and fonts but need their own compact responsive system and separate founder approval.

Deferred public pages include the Books overview, the Resources hub and Activities pages, and the dedicated writing practice page. Existing newsletter backend and new image assets remain future work. No backend, authentication, payments or private production modifications now.

## Current migration stage

The isolated frontend/ React foundation is established. Packages 1 and 2 are implemented in source and the published homepage, and the founder responded positively to the final Package 2 release. Group 1 Resources and Gifting have verified source and comparison evidence in the [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md). Its final documentation Pages run 39284398139 is confirmed successful for e1f2ab9, updated at 16:44:58 UTC on 19 October, resolving the earlier deployment delay.

The founder has now authorised Group 2 covering the reassurance band, six FAQs and final invitation. Preserve the reassurance band's current wording and position, native independent disclosures, expanded layouts and the invitation beneath them. The isolated implementation, 19 source tests, build and full local rendered comparison pass. Local retained source UI, shape and dependency, focus and full Group 1 checks pass. All ten reassurance and closed/all open FAQ widths have been visually inspected without source divergence. New CI, remaining legacy workflow gates and deployment evidence remain under verification. See [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md).

The whole homepage has not been migrated. The current homepage remains published as compiled root assets and cannot be replaced until editable React source reaches complete visual and functional parity and receives explicit founder approval. Preserve the static output throughout Groups 1 and 2. Further migration groups and a React publishing cutover require separate approval.

## Source hardening milestone

The isolated React reference now includes a shared NewsletterFooter with currency and route props, responsive image dimensions and lazy loading, semantic verified whole-card links and expanded content provenance checks. The root GitHub Pages homepage is unchanged. Full homepage source parity remains an open migration stage, not a completed conversion.

## Browser-checked shared source references

The isolated React build now includes source-only SiteHeader and NewsletterFooter alongside the editorial heading, resource card and image primitives. Source CI runs a browser regression with nine responsive widths, native mobile dialog focus restoration, hover menus and shared-footer visual checks. The source build is NOT deployed at the Pages root. Whole-homepage React reconstruction remains a future staged implementation within the already authorised frontend programme; do not report it complete from these source-reference checks alone.

## Package 2 typography and spacing

The founder accepted the published Package 1 result, then authorised completion of Package 2 on the same visible-review basis. Reusable type, container and spacing foundations preserve distinct editorial sections. FAQ questions use 15px. The initial 14px FAQ action treatment was superseded by the later 15px editorial action decision below. Existing answer text and content remain. See PACKAGE_2_REVIEW.md and the active public design system for the completed state.


## Editorial action sizing, 19 October 2026

The founder approved 15px standalone editorial text actions in the static homepage and React source. Inline reading links inherit paragraph size. Navigation, footer utilities and buttons are excluded. Footer heading and currency readability was subsequently completed under the separate decision below. See EDITORIAL_LINK_REVIEW.md for exact scope and verification. Implementation and final visual acceptance remain distinct.


## Footer typography and Package 2 completion, 19 October 2026

The founder approved 15px column headings at weight 650 with 1.4 leading and 13px currency text on all screens. Menu links remain 14px regular, and legal text remains 13px. Preserve the shared photographic footer, grouping, gaps, wording, destinations and currency behaviour. This closes the bounded Package 2 implementation; final rendered acceptance remains distinct. Incorrect static current-page section-link semantics remain separately scoped navigation migration work. See FOOTER_TYPE_REVIEW.md.

## Package 3 Group 1, 19 October 2026

The approved scope is Resources and Gifting in the isolated source, with exact published content and rendered comparisons. Reuse the completed foundations and retain the two sections' published exceptions in the sole public design system. The existing source entry composes Gifting before Resources. New public routes, other homepage sections, source shell acceptance and publication of React remain outside this group.

Keep Resources' unbuilt Activities and overview destinations noninteractive. Carry Gifting wording forward from the protected homepage without inventing a separate exact copy approval date. Record measured section parity before proposing the next group. The current positioning gate uses programmatic scrollIntoView to check component IDs, computed offsets, clamping, final placement and visibility. Actual header navigation and URL fragment/history/restoration behaviour remain later shell migration work. The readiness and alignment corrections change the test harness, with no section or runtime navigation edits. Preserve historical package evidence and the protected root guard.

The targeted 200 percent text check at 320px identified inherited Gifting clipping in both the published and React panels. Resources reflows. Carry the finding into Package 4 and propose any visible correction before implementing it. Equal clipping and no document overflow do not establish text enlargement quality.

## Package 3 Group 2, 19 October 2026

The founder extended the proposed FAQ and final invitation group to include the reassurance band, expressly preserving its current words and position. Its required full homepage position is immediately after the hero and ticker and before discovery. Source assembly reserves those unmigrated neighbours without inserting placeholder sections. Do not reopen historical reassurance alternatives while implementing this group or create retrospective final visual acceptance.

Keep the six FAQs as native independent details/summary disclosures, including multiple expanded answers. Retain exact questions, answers, action labels and destinations. Keep the final invitation inside the same section below the FAQ grid, with its existing books destination and normal supporting sentence. The new invitation source omits inappropriate current page semantics inherited from the static anchor. Its appearance and destination remain. The protected static markup and wider navigation semantics remain later migration work.

The bounded inherited content gate and ledger retain complete text values against the protected homepage. No new exact wording approval date is invented. Private main factual review found no conflict requiring a copy change within the authorised scope. Source implementation, measured component parity, founder rendered acceptance and permission to publish React must be recorded separately.
