# Public website component inventory

Updated 19 October 2026. This is a status index, not a second design system.
The active design authority is [Public Design System](PUBLIC_DESIGN_SYSTEM.md).

| Component | Published homepage | Editable React source | Next gate |
| --- | --- | --- | --- |
| Editorial headings | Approved layout | Typed EditorialHeading plus Heading/Text semantic roles | Package 2 roles established; retain section-specific parity gate |
| Action styles | Approved homepage buttons and text links | ActionLink variants | Validate focus, target size and link destinations |
| Resources section | Two approved equal photographic cards and centred heading/overview action | Implemented as ResourcesSection; local source, retained and corrected full ten-width checks pass | Founder review of completed dedicated evidence; remaining homepage assembly stays separate |
| Responsive image | Existing per-section image rules | ResponsiveImage with dimensions, alt, sizes and lazy default; source compile validated | Document srcset/crop per asset and confirm visible parity |
| Header and navigation | Published static bundled interaction | Typed SiteHeader source reference with dropdown, keyboard and native mobile dialog; not parity accepted | Match approved Radix hover, focus, touch and 9-width geometry before cutover |
| Hero | Published photograph carousel, phrase ticker and fourteen rotating book covers | Not yet migrated | Preserve exact copy, imagery, crops, proportions, existing motion and responsive interactions; final motion settings remain deferred |
| Reassurance band | Published three-part band with current wording and position retained by the Group 2 instruction | ReassuranceBand implemented with verified local and committed ten width parity | Founder rendered review; full surrounding hero/discovery composition remains later work |
| Six-book discovery | Published working tabs | Not yet migrated | Exact copy, photo, tabs and stable CTA parity |
| Book gallery | Published with modal, keyboard and swipe | Not yet migrated | Six images, lightbox and focus parity |
| Printed-book craft | Published four-image slideshow | Not yet migrated | Full-height image, indicator and motion parity |
| How it works | Published pinned four-stage sequence | Not yet migrated | Pinned layout, fourth hold, reduced-motion parity |
| Writing showcase | Published device display and interim dialog | Not yet migrated | Keep current interim action until separate page |
| Gifting | Published editorial invitation | Implemented as GiftingSection; local source, retained and corrected full ten-width checks pass | Founder review; inherited 320px targeted text enlargement clipping remains open for Package 4 |
| FAQs | Published native disclosures with Package 2 question/link sizing | FaqSection implemented with verified local and committed closed and expanded parity | Founder rendered review of disclosure, focus and enlargement evidence |
| Final book invitation | Published invitation following FAQs | FinalInvitation implemented within FaqSection with verified local and committed expanded layout parity | Preserve wording, destination and expanded-layout movement; omit inappropriate current page semantics in source |
| Newsletter and footer | Approved combined image-to-forest unit | Source reference NewsletterFooter with typed route/currency props; not yet parity accepted | Compare full desktop/mobile geometry and interactions before cutover |
| Pricing | Published protected preview route with a previously reproduced hydration warning | Not yet migrated | Preserve currency-aware routes and appearance; investigate warning during relevant routing migration |

**Rule.** Do not describe a component as migrated because a React reference has a similar appearance. Only the original published homepage is live. Keep new source builds isolated until exact static/interactive parity and founder approval.

**Source-only QA:** [the isolated React workflow](../.github/workflows/validate-public-source.yml) exercises shared header navigation, the native mobile dialog, Resources links, newsletter/footer and nine responsive widths. It is not a substitute for full homepage parity tests.

Earlier shared-shell reference evidence is retained in passing isolated Chromium run [39179173423](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39179173423). It covers 320–1440px, header hover and keyboard Escape, the mobile native dialog and focus restoration, existing links, the currency selector and the shared footer. Its output is an experimental React component gallery, not the authorised homepage. Current Group 1 evidence is recorded below and in the [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md).

## Package 2 foundation

Typed Heading/Text and Container/Section primitives now support reusable typography and layout. The existing React Resources reference consumes them without changing copy or structure. Source tokens are mirrored and validated against the published homepage. This does not migrate the remaining homepage sections or establish complete shell parity. See [Package 2 review](PACKAGE_2_REVIEW.md).

## Package 3 Group 1

The founder authorised Resources and Gifting source migration on 19 October 2026. This group reuses the completed foundations, records approved section exceptions in the design system and adds a dedicated comparison gate. The source entry composes Gifting before Resources while retaining the existing header and footer references. Full homepage assembly remains incomplete. Group 2 is separately authorised below; later groups require approval.

Group 1 source implementation, all 16 source tests, the isolated build and retained browser regressions pass. The working harness matching correction 15d450003ed528b2fccf753e52aeddf99eafa52b passed 320, 360, 390, 430, 600, 768, 820, 1024, 1280 and 1440px locally in Chrome 155 and completed 19 state records. All 48 capture geometry checks and 18 final programmatic section placements passed. No measured geometry difference exceeded the 0.15 CSS pixel tolerance; the largest observed difference was 0.016 CSS pixels. The largest screenshot changed-pixel ratio was approximately 0.0943 percent. The local report records its pre-commit HEAD a64c6a2; the tested harness contents match 15d, while section source remains unchanged from 22685299cb7912b38352875c3dd2b2f77fec6374. Dedicated CI run 39281803940 is verified from the downloaded report and completed job log, including all retained gates and both protected-runtime guards. The review retains earlier failed attempts, the passing 981 CI and later failed clean-a64 replay, with the demonstrated CSS viewport readiness correction. See [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md) for current evidence and precise limitations.

Group 1 verifies programmatic section alignment through scrollIntoView with preserved IDs, computed margins/padding, document clamping, final placement and visibility. Actual shared header navigation, URL fragments, router history and restoration are still pending shell parity; this group does not claim to fix or certify them.

Targeted 200 percent section text at 320px reveals matching Gifting clipping in both implementations. Resources reflows. This is an inherited Package 4 quality finding, not an enlargement pass. A completed group remains an isolated source milestone, not a live homepage release or founder acceptance.

## Package 3 Group 2

The founder authorised the reassurance band, six FAQs and final invitation on 19 October 2026. Their current wording, native disclosure behaviour and section compositions are retained in source. Preserve the reassurance band's full homepage position immediately after the hero and ticker and before discovery. The partial source reserves these neighbours for later migration without fabricating visible placeholders.

The isolated implementation and full local rendered comparison pass. Source remains as committed at 8cd289a; final Group 2 CI and retained regressions pass at verification correction 6b5f983. All ten widths have been visually reviewed. The [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md) owns scope, inherited copy provenance, exact checkpoints, artifact verification and the editorial gate correction history. Founder visual acceptance, complete homepage parity and a React cutover remain separate gates. Group 1's inherited Gifting clipping and the pricing hydration warning remain open.
