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

The founder authorised Group 2 covering the reassurance band, six FAQs and final invitation, preserving the band's current wording and position, native independent disclosures and expanded layouts. Source, local rendered comparison and committed CI are verified. The [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md) owns the evidence and inherited quality findings.

The founder has now authorised Group 3 to bring the shared header, newsletter, footer and navigation into parity, including currency, anchors, current page semantics and investigation of the pricing warning. Source implementation and complete local rendered and functional verification pass; the committed CI replay remains to be verified. The [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md) records its scope and evidence separately from founder visual acceptance.

The whole homepage has not been migrated. The current homepage remains published as compiled root assets and cannot be replaced until editable React source reaches complete visual and functional parity and receives explicit founder approval. Preserve the static output throughout Groups 1, 2 and 3. Work beyond the authorised shared group and a React publishing cutover require separate approval.

## Source hardening milestone

The earlier isolated React reference introduced a shared NewsletterFooter with currency and route props, responsive image dimensions and lazy loading, semantic verified whole-card links and expanded content provenance checks. Group 3 builds on these references. The root GitHub Pages homepage is unchanged. Full homepage source parity remains an open migration stage, not a completed conversion.

## Browser-checked shared source references

The earlier isolated build introduced SiteHeader and NewsletterFooter alongside the editorial heading, resource card and image primitives. Its browser regression covered nine responsive widths, a native mobile dialog, hover menus and shared footer checks. These were reference checks, not accepted exact replacements. Group 3 supersedes the earlier handwritten menu/dialog implementation and reference geometry with the published Radix behaviour and protected rendered comparisons. The source build remains unpublished at the Pages root.

## Package 2 typography and spacing

The founder accepted the published Package 1 result, then authorised completion of Package 2 on the same visible-review basis. Reusable type, container and spacing foundations preserve distinct editorial sections. FAQ questions use 15px. The initial 14px FAQ action treatment was superseded by the later 15px editorial action decision below. Existing answer text and content remain. See PACKAGE_2_REVIEW.md and the active public design system for the completed state.


## Editorial action sizing, 19 October 2026

The founder approved 15px standalone editorial text actions in the static homepage and React source. Inline reading links inherit paragraph size. Navigation, footer utilities and buttons are excluded. Footer heading and currency readability was subsequently completed under the separate decision below. See EDITORIAL_LINK_REVIEW.md for exact scope and verification. Implementation and final visual acceptance remain distinct.


## Footer typography and Package 2 completion, 19 October 2026

The founder approved 15px column headings at weight 650 with 1.4 leading and 13px currency text on all screens. Menu links remain 14px regular, and legal text remains 13px. Preserve the shared photographic footer, grouping, gaps, wording, destinations and currency behaviour. This closes the bounded Package 2 implementation; final rendered acceptance remains distinct. Group 3 addresses current page semantics in the new shared source while preserving the protected static markup. See FOOTER_TYPE_REVIEW.md.

## Package 3 Group 1, 19 October 2026

The approved scope is Resources and Gifting in the isolated source, with exact published content and rendered comparisons. Reuse the completed foundations and retain the two sections' published exceptions in the sole public design system. The existing source entry composes Gifting before Resources. New public routes, other homepage sections, source shell acceptance and publication of React remain outside this group.

Keep Resources' unbuilt Activities and overview destinations noninteractive. Carry Gifting wording forward from the protected homepage without inventing a separate exact copy approval date. Record measured section parity before proposing the next group. The Group 1 positioning gate uses programmatic scrollIntoView to check component IDs, computed offsets, clamping, final placement and visibility. Actual header navigation and URL fragment/history/restoration behaviour were outside that group and are now covered by the authorised Group 3. The Group 1 readiness and alignment corrections changed the test harness, with no section or runtime navigation edits. Preserve historical package evidence and the protected root guard.

The targeted 200 percent text check at 320px identified inherited Gifting clipping in both the published and React panels. Resources reflows. Carry the finding into Package 4 and propose any visible correction before implementing it. Equal clipping and no document overflow do not establish text enlargement quality.

## Package 3 Group 2, 19 October 2026

The founder extended the proposed FAQ and final invitation group to include the reassurance band, expressly preserving its current words and position. Its required full homepage position is immediately after the hero and ticker and before discovery. Source assembly reserves those unmigrated neighbours without inserting placeholder sections. Do not reopen historical reassurance alternatives while implementing this group or create retrospective final visual acceptance.

Keep the six FAQs as native independent details/summary disclosures, including multiple expanded answers. Retain exact questions, answers, action labels and destinations. Keep the final invitation inside the same section below the FAQ grid, with its existing books destination and normal supporting sentence. The new invitation source omits inappropriate current page semantics inherited from the static anchor. Its appearance and destination remain. Group 3 extends this correction to shared source navigation without changing the protected static markup.

The bounded inherited content gate and ledger retain complete text values against the protected homepage. No new exact wording approval date is invented. Private main factual review found no conflict requiring a copy change within the authorised scope. Source implementation, measured component parity, founder rendered acceptance and permission to publish React must be recorded separately.

## Group 2 editorial regression gate, 19 October 2026

Source checkpoint 8cd289a and verification correction 6b5f983 are fully verified in the [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md). The retained editorial gate now counts three Resources and five FAQ actions separately while requiring every source editorial action to remain 15px. This corrects a former global count assumption without changing source, styles or copy. The detailed review retains the initial failure and successful corrected runs.

## Package 3 Group 3, 19 October 2026

Bring the existing shared references into exact published parity. Preserve the desktop Radix menus, mobile Radix dialog and native nested disclosures, newsletter and footer composition, currency behaviour and actual destinations. Keep the Package 1 action radius at 6px and the visible header action at 45px high. No new public page, new wording, product behaviour or visible refinement is approved by this group.

Shared source section navigation resolves locally only for top, Resources, Activities and questions, which already exist in the partial composition. The restored Skip to content control separately targets the existing main-content landmark. All missing section and book targets keep their actual published URLs. Preserve original ledger destinations and omit inappropriate aria-current="page" on section links and the skip control.

Seventeen bounded inherited shared records retain exact protected wording, including the skip control, bringing the ledger to 88 records. This records authorised reuse against e9550069 without assigning retrospective original approval dates. Earlier Group 1 and Group 2 inheritance rules remain unchanged.

Retained source checks exercise actual Radix behaviour in the browser. Obsolete handwritten event-handler string assertions and experimental shared geometry are superseded by the published parity checks, while meaningful Package 1 and Package 2 rules remain. Complete group verification, founder rendered acceptance and permission to publish React remain separate.

The pricing warning investigation identified three mismatches in the protected export. Its saved default pricing footer contains a removed arrow, currency deep links receive a homepage fallback document, and a selected-book query begins with the default book document. The [pricing review](PRICING_HYDRATION_REVIEW.md) records diagnosis and bounded next options. Runtime repair needs a separate concrete proposal; Group 3 does not change pricing HTML, compiled bundles or the protected baseline. Gifting text clipping under enlargement remains a separate open quality finding.

The completed local Group 3 comparison retains inherited footer label and currency control clipping at 320px and desktop navigation overflow at 1440px under targeted doubled text. These findings need a separate visible reflow proposal. Source native skip navigation continues within main, and mobile dialog focus restoration uses preventScroll to retain the chosen section position. The published skip and emulated touch focus limitations are recorded explicitly; matching those defects is not required.
