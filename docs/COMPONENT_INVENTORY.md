# Public website component inventory

Updated 19 October 2026. This is a status index, not a second design system.
The active design authority is [Public Design System](PUBLIC_DESIGN_SYSTEM.md).

| Component | Published homepage | Editable React source | Next gate |
| --- | --- | --- | --- |
| Editorial headings | Approved layout | Typed EditorialHeading plus Heading/Text semantic roles | Package 2 roles established; retain section-specific parity gate |
| Action styles | Approved homepage buttons and text links | ActionLink variants | Validate focus, target size and link destinations |
| Resources section | Two approved equal photographic cards and centred heading/overview action | Implemented as ResourcesSection; local source, retained and full ten-width parity checks pass | Final GitHub commit/CI evidence and founder review; remaining homepage assembly stays separate |
| Responsive image | Existing per-section image rules | ResponsiveImage with dimensions, alt, sizes and lazy default; source compile validated | Document srcset/crop per asset and confirm visible parity |
| Header and navigation | Published static bundled interaction | Typed SiteHeader source reference with dropdown, keyboard and native mobile dialog; not parity accepted | Match approved Radix hover, focus, touch and 9-width geometry before cutover |
| Six-book discovery | Published working tabs | Not yet migrated | Exact copy, photo, tabs and stable CTA parity |
| Book gallery | Published with modal, keyboard and swipe | Not yet migrated | Six images, lightbox and focus parity |
| Printed-book craft | Published four-image slideshow | Not yet migrated | Full-height image, indicator and motion parity |
| How it works | Published pinned four-stage sequence | Not yet migrated | Pinned layout, fourth hold, reduced-motion parity |
| Writing showcase | Published device display and interim dialog | Not yet migrated | Keep current interim action until separate page |
| Gifting | Published editorial invitation | Implemented as GiftingSection; local source, retained and full ten-width parity checks pass | Final GitHub commit/CI evidence; inherited 320px targeted text enlargement clipping remains open for Package 4 |
| FAQs | Published native disclosures with Package 2 question/link sizing | Type tokens established, component not migrated | Exact copy and disclosure parity during migration |
| Newsletter and footer | Approved combined image-to-forest unit | Source reference NewsletterFooter with typed route/currency props; not yet parity accepted | Compare full desktop/mobile geometry and interactions before cutover |
| Pricing | Published protected preview route with a previously reproduced hydration warning | Not yet migrated | Preserve currency-aware routes and appearance; investigate warning during relevant routing migration |

**Rule.** Do not describe a component as migrated because a React reference has a similar appearance. Only the original published homepage is live. Keep new source builds isolated until exact static/interactive parity and founder approval.

**Source-only QA:** [the isolated React workflow](../.github/workflows/validate-public-source.yml) exercises shared header navigation, the native mobile dialog, Resources links, newsletter/footer and nine responsive widths. It is not a substitute for full homepage parity tests.

Latest passing isolated Chromium run [39179173423](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39179173423) covers 320–1440px, header hover and keyboard Escape, the mobile native dialog and focus restoration, existing links, the currency selector and the shared footer. Its output is an experimental React component gallery, NOT the authorised homepage.

## Package 2 foundation

Typed Heading/Text and Container/Section primitives now support reusable typography and layout. The existing React Resources reference consumes them without changing copy or structure. Source tokens are mirrored and validated against the published homepage. This does not migrate the remaining homepage sections or establish complete shell parity. See [Package 2 review](PACKAGE_2_REVIEW.md).

## Package 3 Group 1

The founder authorised Resources and Gifting source migration on 19 October 2026. This group reuses the completed foundations, records approved section exceptions in the design system and adds a dedicated comparison gate. The source entry composes Gifting before Resources while retaining the existing header and footer references. Full homepage assembly and later groups remain pending approval.

Group 1 source implementation, all 16 source tests, the isolated build and retained browser regressions pass. The full comparison run passed 320, 360, 390, 430, 600, 768, 820, 1024, 1280 and 1440px and completed 19 state records. No measured geometry difference exceeded the 0.15 CSS pixel tolerance; the largest observed difference was 0.016 CSS pixels. The largest screenshot changed-pixel ratio was approximately 0.0943 percent. All normal/state visual reviews and final capture completeness checks are complete. Final GitHub commit and CI evidence remain pending. See [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md) for precise results, capture methods and limitations.

Targeted 200 percent section text at 320px reveals matching Gifting clipping in both implementations. Resources reflows. This is an inherited Package 4 quality finding, not an enlargement pass. A completed group remains an isolated source milestone, not a live homepage release or founder acceptance.
