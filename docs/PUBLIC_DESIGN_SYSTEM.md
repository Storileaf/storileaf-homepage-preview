# StoriLeaf public website design system

Version 2.0 foundation. Established 18 October 2026. This is the ACTIVE style authority for the new PUBLIC WEBSITE ONLY. The private customer/account and admin systems will be considered later, with smaller, denser component rules.

## Philosophy

Book-centred, editorial, warm, personal, considered and commercially clear. The finished printed book is the outcome. Design should feel like an art-directed magazine or personal archive, not a generic SaaS dashboard or photo-book storefront.

Preserve the existing approved homepage layout, content, interactions, photographs and CTA destinations. Consolidation permits only small measured placement, type or spacing changes, not broad redesign. Record any intentional page-specific variation, and obtain founder approval before materially altering an established section.

## Typography roles

Use Newsreader for display headings and selective meaningful italic emphasis. Use Manrope for body, navigation, controls, labels, secondary text and forms. Georgia and system sans are fallback families, not target typography. The StoriLeaf wordmark must remain an actual image, not recreated typography.

| Role | Working current homepage reference | Purpose |
| --- | --- | --- |
| Hero display | About 42–65px, responsive | Main promise and page entry |
| Large editorial title | About 44–67px, section dependent | Important sections |
| Compact editorial title | About 36–46px | Narrow/secondary compositions |
| Card title | About 29–36px | Resource, book and feature cards |
| Main body | Baseline 15px | Narrative copy |
| Lead copy | Usually 15–17px | Explanations beneath headings |
| Navigation and actions | Mostly 13–15px | Interactive controls |
| Fine metadata | Smaller only where legibility remains good | Genuine secondary details |

These are OBSERVED starting ranges, not permission to resize the approved homepage globally. Final type tokens should follow real measured desktop and mobile comparisons. Prefer readable main text and sentence case. Never force an italic phrase or decorative overline into every future section. Functional form labels, statuses and accessible names are not decorative overlines.

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

Approved homepage content width is 1184px. Current total inline gutters are 96px desktop, 64px intermediate and 40px narrow phone. Current base vertical section spacing is about 94px desktop, 70px tablet and 57px small phone, with justified section-specific exceptions. These are baseline rules to simplify, not authority for blind global replacements.

Use three conceptual spacing roles. Section spacing separates independent narratives. Component spacing defines panels, grids and photography. Text spacing keeps titles, descriptions and actions meaningfully connected. Do not pile section margins on section padding or use decorative whitespace without a role.

## Shape hierarchy

The current interface deliberately uses restrained shapes, not universal pills. Observed examples include 6px ordinary buttons, 9px newsletter controls, about 17–20px category cards, 18px media and 22px principal panels. Circular number/icon markers can remain round. Use named shape roles and document meaningful exceptions, rather than copying the old 40px-card/999px-pill standards.

### Retained button roles during migration

Package 1 began on 18 October 2026. Preserve ordinary filled and outlined actions at 6px, the published Start your story header action at 9px, and paired newsletter controls at 9px. These are retained component roles, not a universal radius for all public controls. The source header now references its own 9px token instead of its earlier 8px literal. This correction does not alter the published homepage.

Existing source card, menu, header shell and utility control values now use named tokens in frontend/src/styles/tokens.css. Their other computed values are retained pending full component parity. The experimental gold ActionLink keeps its existing 9px radius under a separate token; this is not a rule that colour alone determines shape on future pages.

Full button state and touch-target consolidation is still open. See the [Package 1 review and verification record](PACKAGE_1_REVIEW.md) for measured evidence and proposals. Do not treat the source reference's geometry or an unreviewed state as automatically approved simply because it uses a token.

## Reusable public components

Shared SiteHeader with original gold logo on forest, Books/Resources accessible dropdowns, mobile navigation and exact Start your story action.

Shared NewsletterFooter as one photographic field gradually fading to forest. A typed React reference now exists in frontend/src/components/NewsletterFooter.tsx, with caller-provided internal routes and currency selection, but it has NOT replaced the approved live footer. This is the standard ending intended for all future public pages, subject to parity and production form integration later.

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

Keep both clean section screenshots and realistic sticky header/context captures. Automated passing checks do not equal founder visual approval.

## Separation from future account dashboards

The later authenticated workspace, Storyteller/contributor and admin interfaces may share identity colours, type choices and accessibility principles, but their component densities, navigation, tables, forms and workflow patterns require a separate approval. No current private application styling is changed now.

## Open items

Actual open-book photography, trust-band first phrase/placement, hero motion settings, full physical accessibility review, resource destination pages, dedicated practice page, newsletter backend, real production performance measurement and parity-based React cutover. These remain recorded decisions to take later.

The current deployed static homepage remains the visual baseline until the editable source reproduces it faithfully.

## Implementation maturity

The public React source is deliberately staged. Typed ResourceCategoryCard, EditorialHeading, ActionLink, ResponsiveImage and NewsletterFooter references exist, but they are not a second approved homepage. The current compiled root remains visually authoritative until a complete React rebuild passes desktop/mobile screenshot parity and founder acceptance. Consult [component inventory](COMPONENT_INVENTORY.md) before describing any component as migrated.

## Source-only shared shell maturity

Typed SiteHeader and NewsletterFooter React references now exist, using caller-provided explicit routes and currency rather than hardcoding future unbuilt website pages. The source-only Chromium gate passes nine widths and fundamental interactions. The published Radix navigation, homepage and compiled CSS are still the authoritative appearance. No React cutover has been approved; source references need exact side-by-side screenshots, tab/modal/slideshow parity and final founder acceptance before they can replace live assets.
