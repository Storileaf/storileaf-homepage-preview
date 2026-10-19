# Public website component inventory

Updated 18 October 2026. This is a status index, not a second design system.
The active design authority is [Public Design System](PUBLIC_DESIGN_SYSTEM.md).

| Component | Published homepage | Editable React source | Next gate |
| --- | --- | --- | --- |
| Editorial headings | Approved layout | Typed EditorialHeading plus Heading/Text semantic roles | Package 2 roles established; retain section-specific parity gate |
| Action styles | Approved homepage buttons and text links | ActionLink variants | Validate focus, target size and link destinations |
| Photographic resource cards | Two approved equal Resources cards | ResourceCategoryCard, full-card link only for verified destinations | Pixel and keyboard parity |
| Responsive image | Existing per-section image rules | ResponsiveImage with dimensions, alt, sizes and lazy default; source compile validated | Document srcset/crop per asset and confirm visible parity |
| Header and navigation | Published static bundled interaction | Typed SiteHeader source reference with dropdown, keyboard and native mobile dialog; not parity accepted | Match approved Radix hover, focus, touch and 9-width geometry before cutover |
| Six-book discovery | Published working tabs | Not yet migrated | Exact copy, photo, tabs and stable CTA parity |
| Book gallery | Published with modal, keyboard and swipe | Not yet migrated | Six images, lightbox and focus parity |
| Printed-book craft | Published four-image slideshow | Not yet migrated | Full-height image, indicator and motion parity |
| How it works | Published pinned four-stage sequence | Not yet migrated | Pinned layout, fourth hold, reduced-motion parity |
| Writing showcase | Published device display and interim dialog | Not yet migrated | Keep current interim action until separate page |
| Gifting | Published editorial invitation | Not yet migrated | Exact buyer/Storyteller distinction |
| FAQs | Published native disclosures with Package 2 question/link sizing | Type tokens established, component not migrated | Exact copy and disclosure parity during migration |
| Newsletter and footer | Approved combined image-to-forest unit | Source reference NewsletterFooter with typed route/currency props; not yet parity accepted | Compare full desktop/mobile geometry and interactions before cutover |
| Pricing | Published protected preview route | Not yet migrated | Validate currency-aware route and source facts before any cutover |

**Rule.** Do not describe a component as migrated because a React reference has a similar appearance. Only the original published homepage is live. Keep new source builds isolated until exact static/interactive parity and founder approval.

**Source-only QA:** [the isolated React workflow](../.github/workflows/validate-public-source.yml) exercises shared header navigation, the native mobile dialog, Resources links, newsletter/footer and nine responsive widths. It is not a substitute for full homepage parity tests.

Latest passing isolated Chromium run [39179173423](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39179173423) covers 320–1440px, header hover and keyboard Escape, the mobile native dialog and focus restoration, existing links, the currency selector and the shared footer. Its output is an experimental React component gallery, NOT the authorised homepage.

## Package 2 foundation

Typed Heading/Text and Container/Section primitives now support reusable typography and layout. The existing React Resources reference consumes them without changing copy or structure. Source tokens are mirrored and validated against the published homepage. This does not migrate the remaining homepage sections or establish complete shell parity. See [Package 2 review](PACKAGE_2_REVIEW.md).
