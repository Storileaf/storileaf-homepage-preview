# StoriLeaf public website design system

Version 2.1 foundation. Established 18 October 2026, consolidated in Package 2. This is the ACTIVE style authority for the new PUBLIC WEBSITE ONLY. The private customer/account and admin systems will be considered later, with smaller, denser component rules.

## Philosophy

Book-centred, editorial, warm, personal, considered and commercially clear. The finished printed book is the outcome. Design should feel like an art-directed magazine or personal archive, not a generic SaaS dashboard or photo-book storefront.

Preserve the existing approved homepage layout, content, interactions, photographs and CTA destinations. Consolidation permits only small measured placement, type or spacing changes, not broad redesign. Record any intentional page-specific variation, and obtain founder approval before materially altering an established section.

## Typography roles

Package 2 establishes reusable roles without making every section the same size. Newsreader is the display face. Manrope is the body and interface face. Georgia/Arial are fallbacks, not the public target. The older Georgia/Lato paragraph in the uploaded Brand DNA is superseded for this public website only. The logo remains an image.

Canonical implementation is `frontend/src/styles/foundations.css`, with identity and shape tokens in `tokens.css`. `Typography.tsx` separates native heading level from visual variant. Select h1/h2/h3 according to document hierarchy, not the desired size. `EditorialHeading` retains an optional emphasis and introduction, centre/left alignment and h2 default. Do not add a compulsory overline or italic formula.

| Reusable display role | Desktop size rule at a default 16px root | Narrow treatment | Leading and use |
| --- | --- | --- | --- |
| Hero | 49px to 80px, preferred 5.5vw | Existing 900/720/480/360px steps retained | 1.01, page entry |
| Feature | 46px to 64px, preferred 4.7vw | 38px below 720px | 1.04, writing/FAQ style |
| Editorial | 44px to 65px, preferred 4.75vw | 40px to 54px below 720px, 38px to 47px below 480px | 1.085, Resources style |
| Compact | 40px to 55px, preferred 4vw | 38px below 720px | 1.04, narrower invitation |
| Card | 29px to 36px, preferred 2.65vw | 27px to 33px below 720px | 1.16, editorial card |
| Newsletter | 42px to 61px, preferred 4.25vw | 39px to 49px below 480px | 1.09, shared ending |

These are semantic CSS tokens, not fixed widths or permission to restyle existing headings. At 1440px the actual hero is 79.2px, not the outdated approximate 65px maximum previously listed. The distinct discovery, gallery, physical book and process headings retain their existing section rules. Resources retains its existing 1.08 narrow-screen leading. Existing source references are still not full published parity.

| Manrope role | Default | Use |
| --- | --- | --- |
| Body and FAQ answer | 15px, regular, leading 1.7 or answer 1.75 | Narrative text |
| Lead | 15px to 17px, leading 1.67 by default | Introductory copy |
| Supporting text | 14px, leading 1.55 | Secondary readable explanation |
| Action text | 14px, bold, leading 1.35 | Ordinary actions and FAQ links |
| FAQ question | 15px, weight 600, leading 1.5 | Native disclosure summary |
| Metadata | 13px, leading 1.55 | Legal and genuinely secondary information |
| Compact label | 11px where already used | Footer grouping or utility labels, never paragraph copy |

Preserve editorial distinctions such as the source card's existing 15.5px body, homepage gallery/writing lead at 16px, compact header action on phones, scaled device illustration text and existing footer legal typography. They have been evaluated rather than blindly resized. Future interface paragraphs should use the body/support roles, not illustration sizes. Disabled/loading behaviours belong to genuine controls and are not introduced by this package.

Text sizes in the canonical source use rem bounds at the normal browser root size. Do not fix the html font size, disable user zoom or introduce fixed text-box heights. Keep unitless leading. Desktop/mobile, text enlargement and spacing checks remain necessary because relative units alone do not prove accessibility.

## Colour roles

| Token concept | Baseline | Use |
| --- | --- | --- |
| Forest | #253526 | Editorial heading and dark section/background |
| Teal | #0c6753 | Primary action on light, links, selected states |
| Antique gold | #cca86b | Accents and useful detail on forest |
| Gold CTA on dark | #d7b67e in the current newsletter | Dark-area emphasis |
| Warm paper | #f9f8f6 | Page canvas |
| Secondary warm paper | #f3f2ef | Quiet cards and panels |
| White | #ffffff | Raised surface and dark-area type |
| Sage and muted ink | Existing homepage semantic colours | Support surfaces and secondary copy |

Colour tokens for NEW React components are in frontend/src/styles/tokens.css. Never apply pale gold as normal text on white. Ensure legible contrast for normal, hover, focus, selected, disabled and error states. Preserve dark overlays behind type on photography.

## Containers and spacing

`Container` uses the existing 1184px content maximum. Total inline gutters are 96px above 900px, 64px at 900px and below, and 40px at 480px and below. That means 48px, 32px and 20px per side before the maximum width adds more outside space. Header and hero media retain their own wider compositions.

`Section` supplies standard spacing of 94px, 70px and 57px at the same breakpoints. Compact spacing is 70px, 57px and 40px. A `none` option supports compositions that own their spacing. These are reusable defaults, not replacements for every homepage section's intentional top/bottom spacing.

Named gaps connect title to copy (19px), card title to copy (13px), copy to following action (25px) and introductory heading group to content (43px desktop, 30px intermediate). Resources retains its specifically published 26px phone gap. Responsive card padding retains 24px to 36px fluid desktop, 28px/30px/30px intermediate, 25px/25px/28px smaller and 23px/23px/26px phone. Use small 8/12/16/20/24/32/40px spacing steps for ordinary component interiors, and named editorial exceptions where they already exist.

The published homepage retains its asymmetric discovery, gallery/craft, devices, gifting, Resources, FAQ and photographic ending spacing. The process section's scroll runway, sticky alignment and reduced-motion/short-height variants are not ordinary section padding and must not be normalised. See the Package 2 measured inventory and review record before migrating them.

The source foundation tokens are mirrored into a bounded block in the existing homepage CSS, scoped to the homepage. `frontend/scripts/sync-foundations.mjs` checks exact agreement. It writes only when explicitly invoked with `--write` for an authorised release. Existing effective declarations consume tokens in place, with original fallbacks for the separate pricing preview. Do not append another stylesheet override layer or disable the published baseline guard.

## Shape hierarchy

The interface uses restrained shapes, not universal pills. Rectangular public action buttons and paired newsletter controls share the approved 6px action radius. Larger category cards retain 20px or 17px on small screens, media 18px and principal panels 22px. Circular markers and specialised navigation controls remain separate families. Do not apply the action radius to every element with corners.

### Approved action family

The founder explicitly approved the remaining Package 1 source changes on 18 October 2026. Ordinary filled and outlined actions, the Start your story header action, gold actions and the paired newsletter input/action share `--sl-radius-action` at 6px. The header, newsletter and gold source token names are aliases of that single token, not independently maintained values.

The founder subsequently authorised applying Package 1 to the existing published homepage so the visible result can be reviewed. The static homepage now uses the same 6px header/newsletter control corners, primary/gold hover colours and responsive resource focus treatment. This supersedes the former source-only publication boundary for this package. It does not authorise a complete React cutover, further visible changes or private production deployment. The founder accepted the published Package 1 result before requesting Package 2.

The earlier 9px header/newsletter/gold values were inherited implementation differences, not a necessary hierarchy. The homepage stylesheet mirrors the relevant source values through homepage-scoped custom properties, with existing fallbacks for the separate pricing preview. The pricing page's styling is not changed by this release.

Preserve existing dimensions, typography, padding, labels and destinations. The mobile source and published header actions remain 45px high at 390px and 430px. Resource keyboard focus follows the parent card radius, retaining its 3px outline and 5px inset.

### Approved feedback and semantics

Primary action links use hover background #0b5848 through `--sl-teal-hover`. Normal background remains #0c6753 and text remains white. Gold actions use hover background #e9cb93 through `--sl-gold-action-hover`. Existing normal colours are preserved. The published gifting action retains antique gold #cca86b, while the newsletter and experimental source gold ActionLink use #d7b67e. Text remains forest #253526. Package 1 does not unify those normal gold shades or change the existing newsletter hover appearance.

Outlined actions explicitly use forest #253526. This corrected browser-default link blue in the source; the published outlined buttons already used forest, so their text colour needed no change. Existing border and background treatments are retained. Text actions retain their existing teal treatment. No additional outline/text hover palette was approved in this change.

The source primary/gold hover rules apply to real ActionLink anchors, not the non-interactive spans used for planned destinations. Use links for navigation and buttons for local actions. Keep independently visible keyboard focus. Pointer-held appearances retain the hover colour without geometry changes or a new animation.

No disabled or loading API, asynchronous operation or newsletter subscription service was introduced. Document such states when an actual component needs them, with separate behaviour and content approval. Do not simulate working destinations or dim an entire control to manufacture a state catalogue.

Existing source menu, header shell, icon and utility control values remain named tokens pending their own parity review. See the [Package 1 review and verification record](PACKAGE_1_REVIEW.md). Source references are not full homepage parity or accessibility certification.

## Reusable public components

Shared SiteHeader with original gold logo on forest, Books/Resources accessible dropdowns, mobile navigation and exact Start your story action.

Shared NewsletterFooter as one photographic field gradually fading to forest. A typed React reference exists in frontend/src/components/NewsletterFooter.tsx, with caller-provided internal routes and currency selection, but it has NOT replaced the approved live footer. This is the standard ending intended for all future public pages, subject to parity and production form integration later.

EditorialSectionHeading with centred and split layouts, no mandatory italic formula. Primary/outline/gold-on-dark/text Action components with consistent feedback and accessible targets.

BookSelector, BookGallery and PrintedBookDetail keep their separately approved behaviours and exact copy. The sticky four-stage ProcessStory is a specialised editorial feature, not a generic dashboard scroll primitive.

ResourceCategoryCard keeps equal photographic panels and a centred Browse all resources treatment. The Activities and all-Resources destinations are unbuilt and cannot be presented as live.

The existing homepage writing modal is an interim action. Its intended replacement is a dedicated public practice page, documented separately, not yet built.

Do not automatically impose a uniform equal-card grid or the same colour/italic treatment on every section.

## Photography

Use original or permission-cleared StoriLeaf images. Cover book craft, storytelling, letters, meaningful objects and authentic India-led families with regional and generational breadth. Include founders, relationships, travel, celebrations, young and playful moments, not only elderly family nostalgia. Respect image crop, focal point, descriptive alt, ratios and genuine finished-product provenance. Replace temporary photographs without forcing layout changes. Six current gallery slots remain honest placeholders.

## Interaction, motion and accessibility

Aim for at least 44px effective principal touch targets, sensible focus-visible states, true keyboard/touch operation, accessible names, Escape/focus restoration for dialogs and visible form validation when real forms are built. Keep meaningful actions distinct from inert preview treatments.

Respect prefers-reduced-motion. The founder explicitly rejected an extra prominent hero Pause movement button; do not add one. The existing hero cover orbit settings, carousel and ticker are visual trial settings. Do not change them under the guise of performance optimisation.

Do not copy current static aria-current mistakes into new source. Distinguish a current route from an ordinary anchor and verify the hydrated state.

## Responsive QA

Every new public page must be intentionally designed and checked at widths 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440 CSS pixels, plus short-height, 200 percent zoom, keyboard, touch and reduced-motion states. Carousels may scroll intentionally but the whole document may not overflow.

Keep both clean section screenshots and realistic sticky header/context captures. Automated passing checks do not equal founder visual approval. During migration, distinguish the protected static baseline from explicitly approved source refinements. Package 1's published refinements are recorded in its release evidence. All other unapproved differences still require correction or founder review.

## Separation from future account dashboards

The later authenticated workspace, Storyteller/contributor and admin interfaces may share identity colours, type choices and accessibility principles, but their component densities, navigation, tables, forms and workflow patterns require a separate approval. No current private application styling is changed now.

## Open items

Actual open-book photography, trust-band first phrase/placement, hero motion settings, full physical accessibility review, resource destination pages, dedicated practice page, newsletter backend, real production performance measurement and parity-based React cutover. These remain recorded decisions to take later.

The deployed static homepage, including the specifically authorised Package 1 refinements submitted for review, remains the migration reference. Its approved layout, content and interactions must be reproduced faithfully.

## Implementation maturity

The public React source is deliberately staged. Typed ResourceCategoryCard, EditorialHeading, ActionLink, ResponsiveImage and NewsletterFooter references exist, but they are not a second approved homepage. The current compiled root remains visually authoritative until a complete React rebuild passes desktop/mobile screenshot parity, accounts for approved refinements and receives founder acceptance. Consult [component inventory](COMPONENT_INVENTORY.md) before describing any component as migrated.

## Source-only shared shell maturity

Typed SiteHeader and NewsletterFooter React references now exist, using caller-provided explicit routes and currency rather than hardcoding future unbuilt website pages. The source-only Chromium gate covers nine widths and fundamental interactions. The published Radix navigation, homepage and compiled CSS remain the migration reference. No React cutover has been approved; source references need complete side-by-side screenshots, tab/modal/slideshow parity and final founder acceptance before they can replace live assets.
