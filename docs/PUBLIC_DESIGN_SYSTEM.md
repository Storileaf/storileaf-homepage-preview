# StoriLeaf public website design system

Version 2.1 foundation. Established 18 October 2026, consolidated in Package 2. Updated 20 October 2026 for Package 3 source migration Groups 1 through 8. This is the ACTIVE style authority for the new PUBLIC WEBSITE ONLY. The private customer/account and admin systems will be considered later, with smaller, denser component rules.

## Philosophy

Book-centred, editorial, warm, personal, considered and commercially clear. The finished printed book is the outcome. Design should feel like an art-directed magazine or personal archive, not a generic SaaS dashboard or photo-book storefront.

Preserve the existing approved homepage layout, content, interactions, photographs and CTA destinations. Packages 1 and 2 are complete. Migration may correct source differences to reproduce the approved published baseline. Propose every additional visible refinement and obtain founder approval before implementing it. Keep existing intentional section variations scoped.

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
| Control action | Existing 14px default, component exceptions retained | Filled, outlined and gold buttons; not editorial text links |
| Editorial text action | 15px Manrope, existing weight and leading retained | Standalone reading-section actions, resource labels and links below FAQ answers |
| FAQ question | 15px, weight 600, leading 1.5 | Native disclosure summary |
| Metadata | 13px, leading 1.55 | Legal and genuinely secondary information |
| Footer column heading | 15px, existing weight 650, leading 1.4 | Gold grouping headings above 14px regular navigation links |
| Currency selector | 13px at all widths | Existing native currency control |
| Compact label | 11px where specifically retained | Illustration or compact utility labels, never paragraph copy or footer column headings |

Preserve editorial distinctions such as the source card's existing 15.5px body, homepage gallery/writing lead at 16px, compact header action on phones, scaled device illustration text and existing footer legal typography. They have been evaluated rather than blindly resized. Future interface paragraphs should use the body/support roles, not illustration sizes. Disabled/loading behaviours belong to genuine controls and are not introduced by this package.

The founder approved 15px standalone editorial text actions on 19 October 2026. `--sl-text-editorial-action` aliases the 15px body token, while `--sl-text-action` retains the ordinary control baseline. Inline paragraph links inherit their surrounding text size. Colours, weights, arrows, gaps and destinations are unchanged. Header navigation, footer utilities and button labels are excluded. Activities and Browse all resources remain non-interactive labels until their pages exist. The founder subsequently approved 15px footer column headings with 1.4 leading and 13px currency text at all widths. These now use dedicated aliases of the body and metadata tokens. Existing gold, weight 650, 14px menu links, 13px legal text, gaps, controls and photographic composition are retained. See [footer completion review](FOOTER_TYPE_REVIEW.md). See [editorial link review](EDITORIAL_LINK_REVIEW.md).

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

`Container` uses the existing 1184px content maximum. Total inline gutters are 96px above 900px, 64px at 900px and below, and 40px at 480px and below. That means 48px, 32px and 20px per side before the maximum width adds more outside space. Header and hero media retain their own wider compositions. The shared gallery and physical presentation retain the 1440px samples frame described in the Group 5 rules below.

`Section` supplies standard spacing of 94px, 70px and 57px at the same breakpoints. Compact spacing is 70px, 57px and 40px. A `none` option supports compositions that own their spacing. These are reusable defaults, not replacements for every homepage section's intentional top/bottom spacing.

Named gaps connect title to copy (19px), card title to copy (13px), copy to following action (25px) and introductory heading group to content (43px desktop, 30px intermediate). Resources retains its specifically published 26px phone gap. Responsive card padding retains 24px to 36px fluid desktop, 28px/30px/30px intermediate, 25px/25px/28px smaller and 23px/23px/26px phone. Use small 8/12/16/20/24/32/40px spacing steps for ordinary component interiors, and named editorial exceptions where they already exist.

The published homepage retains its asymmetric discovery, gallery/craft, devices, gifting, Resources, FAQ and photographic ending spacing. The process section's scroll runway, sticky alignment and reduced-motion/short-height variants are not ordinary section padding and must not be normalised. See the Package 2 measured inventory and review record before migrating them.

### Homepage editorial section exceptions

The authorised Group 1 migration carries Resources and Gifting into isolated source. Match their actual published rules after Packages 1 and 2. Shared primitives supply the reusable typography, spacing and action roles; scoped section rules retain the intentional composition. These are existing homepage exceptions, not new global defaults.

Resources keeps a centred two-line editorial heading, its original introduction and the centred Browse all resources label beneath two equal photographic cards. Retain the published 26px phone heading gap rather than the earlier source reference's 30px gap. Preserve the published card text size, padding, responsive corners, image ratios and crops, arrow placement and hover treatment. Blog & guides remains a whole-card link with focus following the card corners. The Activities card and overview action remain noninteractive labels. Do not create controls to imitate those planned destinations.

Gifting retains its distinct photographic editorial composition, exact heading and supporting copy, and existing gift action. Preserve its own heading scale, text measure, section spacing, image sizing/crop and responsive layout rather than assigning the generic Resources treatment. Its normal gold action uses the established antique gold #cca86b and the approved #e9cb93 hover, with the 6px action radius. Do not substitute the newsletter's different normal gold shade.

| Existing section rule | Published value retained in Group 1 |
| --- | --- |
| Resources section padding | 97px above and 106px below; 77px and 84px at 720px and below |
| Resources heading and card detail | Emphasis weight 420; card heading tracking -.015em; 15px card body at 720px and below |
| Resources image and action | Centred crop; 1.76 ratio at 720px and below, then 1.72 at 480px and below; linked action arrow moves 3px on hover |
| Gifting section and panel | 76px above and 84px below; 54px each at 720px and below. Panel radius 24px, then 18px at 720px and below |
| Gifting columns and reading copy | .94fr/1.06fr desktop columns, equal columns at 900px and below, single column with image first at 720px and below. Body 16px with 1.76 leading, then 15px at 720px and below |
| Gifting action | 13px text at weight 650 and 1.4 leading, minimum height 49px, 20px icon gap, 12px/24px padding and the shared 6px action radius |
| Gifting photograph | Crop 52%/50%; minimum height 480px desktop and 460px at 900px and below; fixed 300px image height at 720px and below, then 250px at 480px and below |
| Anchor landing | Root scroll padding 100px above 720px and 80px at 720px and below. Resources and Gifting section scroll margins 116px above 720px and 96px at 720px and below. The Activities target retains 116px at all widths |

Resources retains the published warm paper, muted ink and sage image bed HSL values in its scoped rules. Gifting retains its published sage gradient, forest panel, photographic veil and restrained image hover. These exact migration values remain local to the two sections and do not change the generic palette or other section defaults. Image sources, alt text and intrinsic dimensions remain together in the image manifest.

The source shared composition owns the root scroll context without changing effective section offsets. Group 1 measured programmatic alignment using unique preserved IDs, computed scroll margins and root padding, document clamping, final position and visibility. Group 3 extends this to actual shared navigation, URL fragments, router history and restoration. Only targets present in the partial composition resolve locally. See [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md) for the route boundary and integrated verification.

The source entry places Gifting before Resources, preserving their relative homepage order. Both section migrations need actual baseline/source screenshots and relevant interaction checks before parity can be recorded. See [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md) for scope and evidence, and keep style decisions in this document.

### Reassurance, FAQ and final invitation exceptions

Group 2 preserves the reassurance band's current wording, icons, dividers and responsive layout. Its required full homepage position is immediately after the hero and ticker and before book discovery. Group 4 placed discovery directly after it; Group 7 now reconstructs the preceding hero and ticker in source. Do not change the band's wording or position during migration or treat historical alternatives as active implementation instructions. The Group 7 review owns the served comparison of this assembled relationship.

The band retains three equal columns above 720px and stacked rows at 720px and below. Its 27px vertical padding becomes 17px at that breakpoint. Text remains 17px on wide screens, 15px at 1130px and below, 16px at 720px and below, then the 15px body role at 480px and below. Its deliberate 700 weight and 1.45 leading remain. Icon roundels are 45px wide, becoming 41px at 1130px and below. These are retained section rules, not new defaults for body copy or controls.

The FAQ grid keeps its .8fr/1.2fr columns and 95px gap, then a 60px gap at 1120px and below. At 900px and below it becomes one column with a 34px gap. Top section padding is 78px, becoming 52px at 480px and below. The feature heading role and the original teal emphasis remain. The native summary keeps 15px Manrope, weight 600 and 1.5 leading. Row padding remains 21px vertically, then 20px at 480px and below. Answer paragraphs retain 15px and 1.75 leading. Editorial actions retain the 15px action role and their existing hover and focus treatment.

Use independent native details and summary elements. Preserve simultaneous expanded answers, the disclosure icon's 45 degree rotation and natural answer height. Do not add an exclusive accordion, fixed answer heights or JavaScript keyboard substitution. The questions section retains its 116px scroll margin, becoming 96px at 720px and below, within the existing source scroll context.

The final invitation remains inside the questions section after the FAQ grid. It keeps its divider, supporting paragraph and separate heading, with the button alongside on wider screens and beneath at 480px and below. Its top margin is 69px, becoming 40px at 720px and below. Padding remains 48px above and 55px below, then 34px and 40px at 480px and below. The deliberately distinct heading is 42px with 1.12 leading, 36px at 720px and below and 37px at 480px and below. Do not replace these inherited values with a global normalisation.

The invitation action keeps the shared 6px radius and approved teal hover, with its inherited 13px label, minimum 49px height, 20px icon gap and 12px/24px padding. Its published books destination is unchanged. Omit inappropriate current page semantics in the new source. Group 3 also corrects shared source navigation semantics while preserving the protected static markup.

Warm paper, sage and muted ink values remain scoped to these sections. See [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md) for implementation, inherited copy provenance and rendered evidence. This group introduces no new image assets or global identity tokens.

The source foundation tokens are mirrored into a bounded block in the existing homepage CSS, scoped to the homepage. `frontend/scripts/sync-foundations.mjs` checks exact agreement. It writes only when explicitly invoked with `--write` for an authorised release. Existing effective declarations consume tokens in place, with original fallbacks for the separate pricing preview. Do not append another stylesheet override layer or disable the published baseline guard.

## Shape hierarchy

The interface uses restrained shapes, not universal pills. Rectangular public action buttons and paired newsletter controls share the approved 6px action radius. Larger category cards retain 20px or 17px on small screens, media 18px and principal panels 22px. Circular markers and specialised navigation controls remain separate families. Do not apply the action radius to every element with corners.

### Approved action family

The founder explicitly approved the remaining Package 1 source changes on 18 October 2026. Ordinary filled and outlined actions, the Start your story header action, gold actions and the paired newsletter input/action share `--sl-radius-action` at 6px. The header, newsletter and gold source token names are aliases of that single token, not independently maintained values.

The founder subsequently authorised applying Package 1 to the existing published homepage so the visible result can be reviewed. The static homepage now uses the same 6px header/newsletter control corners, primary/gold hover colours and responsive resource focus treatment. This supersedes the former source-only publication boundary for this package. It does not authorise a complete React cutover, further visible changes or private production deployment. The founder accepted the published Package 1 result before requesting Package 2.

The earlier 9px header/newsletter/gold values were inherited implementation differences, not a necessary hierarchy. The homepage stylesheet mirrors the relevant source values through homepage-scoped custom properties, with existing fallbacks for the separate pricing preview. The pricing page's styling is not changed by this release.

Preserve existing dimensions, typography, padding, labels and destinations. Start your story remains 45px high at every width where the header action is visible. Resource keyboard focus follows the parent card radius, retaining its 3px outline and 5px inset.

### Approved feedback and semantics

Primary action links use hover background #0b5848 through `--sl-teal-hover`. Normal background remains #0c6753 and text remains white. Gold actions use hover background #e9cb93 through `--sl-gold-action-hover`. Existing normal colours are preserved. The published gifting action retains antique gold #cca86b, while the newsletter and experimental source gold ActionLink use #d7b67e. Text remains forest #253526. Package 1 does not unify those normal gold shades or change the existing newsletter hover appearance.

Outlined actions explicitly use forest #253526. This corrected browser-default link blue in the source; the published outlined buttons already used forest, so their text colour needed no change. Existing border and background treatments are retained. Text actions retain their existing teal treatment. No additional outline/text hover palette was approved in this change.

The source primary/gold hover rules apply to real ActionLink anchors, not the non-interactive spans used for planned destinations. Use links for navigation and buttons for local actions. Keep independently visible keyboard focus. Pointer-held appearances retain the hover colour without geometry changes or a new animation.

No disabled or loading API, asynchronous operation or newsletter subscription service was introduced. Document such states when an actual component needs them, with separate behaviour and content approval. Do not simulate working destinations or dim an entire control to manufacture a state catalogue.

Group 3 reconstructs the published header shell, menu, icon and utility geometry in scoped component rules. Earlier experimental source geometry is not an independent design authority. Specialised navigation shapes remain separate from the 6px action family. See the [Package 1 review and verification record](PACKAGE_1_REVIEW.md) and [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md). Source implementation is not full homepage parity or accessibility certification.

## Reusable public components

Shared SiteHeader with original gold logo on forest, the published Radix Books and Resources menus, Radix mobile dialog with native nested disclosures, and exact Start your story action. Preserve the existing keyboard skip control, menu labels, book descriptions and destinations.

Shared NewsletterFooter as one photographic field gradually fading to forest. Group 3 reconstructs frontend/src/components/NewsletterFooter.tsx with explicit route and currency props, the approved typography, grouping, link order and Get in touch without an arrow. It has not replaced the live footer. This remains the intended ending for future public pages, subject to complete parity and separate production form integration.

EditorialSectionHeading with centred and split layouts, no mandatory italic formula. Primary/outline/gold-on-dark/text Action components with consistent feedback and accessible targets.

BookDiscovery, BookGallery and PhysicalBookPresentation keep their separately approved behaviours and exact copy. BookGallery owns the shared samples field and accepts PhysicalBookPresentation in its existing composition slot. HowItWorks implements the specialised sticky four-stage editorial progression described below; it is not a generic dashboard scroll primitive.

ResourceCategoryCard keeps equal photographic panels and a centred Browse all resources treatment. Activities and Browse all resources remain noninteractive section labels because their destination pages are unbuilt. Preserve the existing interim Resources and Activities header anchors.

The existing homepage writing modal is an interim action. Its intended replacement is a dedicated public practice page, documented separately, not yet built.

Do not automatically impose a uniform equal-card grid or the same colour/italic treatment on every section.

## Photography

Use original or permission-cleared StoriLeaf images. Cover book craft, storytelling, letters, meaningful objects and authentic India-led families with regional and generational breadth. Include founders, relationships, travel, celebrations, young and playful moments, not only elderly family nostalgia. Respect image crop, focal point, descriptive alt, ratios and genuine finished-product provenance. Replace temporary photographs without forcing layout changes. Six current gallery slots remain honest placeholders.

## Interaction, motion and accessibility

Aim for at least 44px effective principal touch targets, sensible focus-visible states, true keyboard/touch operation, accessible names, Escape/focus restoration for dialogs and visible form validation when real forms are built. Keep meaningful actions distinct from inert preview treatments.

Respect prefers-reduced-motion. The founder explicitly rejected an extra prominent hero Pause movement button; do not add one. The existing hero cover orbit settings, carousel and ticker are visual trial settings. Do not change them under the guise of performance optimisation.

Do not copy current static aria-current mistakes into new source. Group 3 shared section links and the skip control omit aria-current="page". Distinguish a current route from an ordinary anchor and verify the rendered state.

## Responsive QA

Every new public page must be intentionally designed and checked at widths 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440 CSS pixels, plus short-height, 200 percent zoom, keyboard, touch and reduced-motion states. Carousels may scroll intentionally but the whole document may not overflow.

Keep both clean section screenshots and realistic sticky header/context captures. Automated passing checks do not equal founder visual approval. During migration, distinguish the protected static baseline from explicitly approved source refinements. Package 1's published refinements are recorded in its release evidence. All other unapproved differences still require correction or founder review.

## Separation from future account dashboards

The later authenticated workspace, Storyteller/contributor and admin interfaces may share identity colours, type choices and accessibility principles, but their component densities, navigation, tables, forms and workflow patterns require a separate approval. No current private application styling is changed now.

## Open items

Actual open-book photography, any later refinement of the retained reassurance band, hero motion settings, full physical accessibility review, resource destination pages, dedicated practice page, newsletter backend, real production performance measurement and parity-based React cutover. These remain recorded decisions to take later.

Group 1 identified an inherited text enlargement limitation. At 320×568px with the section text sizes targeted to 200 percent, both static and React Gifting clip heading and paragraph text inside the panel despite no document overflow. The button's right edge also extends into the clipped area; the Range report does not flag its label. Resources reflows. This remains an open Package 4 quality finding, not an accepted enlargement outcome or permission to change the visible composition. See [Group 1 review](PACKAGE_3_GROUP_1_REVIEW.md) for the measured capture method and scope.

The deployed static homepage, including the completed Package 1 and Package 2 refinements, remains the migration reference. Its approved layout, content and interactions must be reproduced faithfully. The founder's positive final Package 2 response allows the staged work to continue without reopening the foundation work or inventing a separate acceptance record.

## Implementation maturity and evidence ownership

The public React source is deliberately staged. Its current implementation status belongs in the [component inventory](COMPONENT_INVENTORY.md), and detailed verification belongs in the relevant package review. This partial composition is not a second approved homepage. The current compiled root remains the comparison reference until complete visual and functional parity and explicit founder acceptance permit a publishing decision.

The detailed historical implementation paragraphs previously repeated here remain intact at [the preceding design-system revision](https://github.com/Storileaf/storileaf-homepage-preview/blob/2d57aa278afd657ecf2edd99e91eb370f603020c/docs/PUBLIC_DESIGN_SYSTEM.md#implementation-maturity). The [Group 1](PACKAGE_3_GROUP_1_REVIEW.md), [Group 2](PACKAGE_3_GROUP_2_REVIEW.md), [Group 3](PACKAGE_3_GROUP_3_REVIEW.md), [Group 4](PACKAGE_3_GROUP_4_REVIEW.md), [Group 5](PACKAGE_3_GROUP_5_REVIEW.md), [Group 6](PACKAGE_3_GROUP_6_REVIEW.md) and [Group 7](PACKAGE_3_GROUP_7_REVIEW.md) reviews own their source identities, diagnostic failures, run records and measured evidence. Linking a review does not imply that its checkpoint has passed. Those details are preserved rather than copied into further active summaries.

Group 4 extends the FAQ/invitation route props to the rendered local Books target without changing their content or styles. Group 5 adds the rendered local Samples target and Group 6 adds How it works. Group 7 reuses Books and Samples for the reconstructed hero's existing actions. Only uniquely rendered targets may resolve locally. The Group 7 review owns Hero verification; writing showcase, the practice dialog and complete page assembly remain unfinished. Founder visual acceptance and complete homepage cutover remain separate.

## Shared component migration

Shared header, newsletter, footer and navigation retain the reconstructed published Radix controls, geometry and existing currency storage/pricing contract. The [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md) owns its original evidence and the later group reviews record affected regressions. The [pricing hydration investigation](PRICING_HYDRATION_REVIEW.md) identified three protected export mismatches; none is repaired by the source migration. No React cutover or founder acceptance is recorded.

Group 3 targeted enlargement records inherited footer label and currency control clipping at 320px and desktop navigation document overflow at 1440px with shared text doubled. These are open quality findings, not desired reusable behaviour or an enlargement acceptance. Propose bounded reflow corrections before visible implementation changes. The measured normal geometry and completed Packages 1 and 2 remain protected.

## Group 4 discovery preservation

The authorised six book discovery migration retains its own published heading scale, introduction, horizontal tab rail, panel proportions, text measures, list markers, image crop and stable action placement. Reuse the completed foundations while keeping these existing section exceptions scoped. This design system owns the retained rules below. The [Group 4 review](PACKAGE_3_GROUP_4_REVIEW.md) records comparison methods, measurements and evidence.

| Discovery element | Retained rule |
| --- | --- |
| Section | Existing 1184px container and foundation gutters. Top/bottom padding 94/101px above 900px and 81/84px at 900px and below. Scroll margin 116px, changing to 96px at 720px and below. |
| Heading layout | Two columns in the ratio 1.18 to 1 with a 285px minimum second column and clamp(24px, 2.7vw, 44px) gap. One column at 1130px and below with a 16px row gap. |
| Heading type | Newsreader, clamp(47px, 4.8vw, 67px), 1.04 leading and minus .032em tracking. At 720px and below use clamp(42px, 8vw, 57px); at 480px and below use clamp(38px, 9vw, 47px). Emphasis remains a separate teal line at weight 420. |
| Supporting paragraph | Manrope 16px with 1.8 leading, 385px maximum width on the two column layout and 690px on the single column layout. Retain the existing muted ink. |
| Tabs offset and rail | Tabs start 36px below the heading, changing to 27px at 720px and below. Retain horizontal overflow, 14px inline scroll padding, thin scrollbar and the existing right fade at 900px and below. |
| Wide tabs | Six equal columns, 100px minimum height, 20/12/22px top/horizontal/bottom padding, weight 650, clamp(16px, 1.35vw, 19px) type, 1.35 leading and balanced labels. |
| Narrow tabs | At 900px and below use 174px fixed tab widths, 84px minimum height, 15/16px padding and 17px type. At 480px and below use 158px widths and 16px type; at 360px and below use 147px widths. |
| Active tab and focus | Teal text, retained sage tint and 3px underline inset 11px at both ends. Keyboard outline is 2px teal inset 4px, with the original 3px half opacity teal focus ring. Hover retains the lighter sage tint without selecting a different book. |
| Panel | Starts 22px below the rail, minimum height 520px, 1px retained forest border tint, 20px corners and warm paper background. Text/photo ratio .88 to 1.12, changing to .9 to 1.1 at 900px and below. At 720px and below use one column, natural panel height and photograph first. |
| Copy | Padding clamp(32px, 3.4vw, 52px), 18px flex gap and 470px reading measure. Padding becomes 29px at 720px and below, then 25px vertically and 23px horizontally at 480px and below. |
| Panel introduction | Weight 600, clamp(16px, 1.32vw, 18px), 1.55 leading and 84px minimum height. At 720px and below use 17px, automatic minimum height and no maximum width. |
| Panel list | Three 16px weight 500 points with 1.5 leading, 14px gap and 23px left inset. Gold circular markers are 7px, positioned .68em from the top. |
| Panel action | Existing primary action, 6px corners, 49px minimum height, 12/24px padding, 20px icon gap and 17px arrow. Align to the bottom through automatic top margin on wide layouts; use 6px top margin and normal shrinking at 720px and below. Retain Package 1 hover and focus colours. |
| Photograph | Original lazy decoded source, declared 850 by 660 dimensions, centred cover crop. Minimum visual height 445px, then 410px at 900px, 315px at 720px, 270px at 480px and 255px at 360px and below. |
| Motion | Active indicator uses the existing 220ms transform/opacity transition. Photo entry lasts 350ms from .55 opacity and scale 1.016 to full opacity and scale 1. Reduced motion disables photo entry and makes other discovery transitions effectively instantaneous. |

Preserve the original automatic Radix tab activation, active tab reveal and reduced motion behaviour. Retain the six individual book destinations, default Life Story selection and existing image sources. Discovery follows the reassurance band. Group 7 restores the preceding hero and ticker in source without changing that join. Shared Books navigation and the final invitation may use the actual local section without changing their visual treatment or canonical content records. No new pricing selection, public page, hero motion decision or visible refinement is introduced by the discovery migration.

The complete Group 4 local and committed comparisons pass for the normal and interactive scope recorded in its review. Targeted text doubling reproduces inherited Relationship Memoir and Celebrating Occasions label bounds issues at 320px and 1440px. These are open reflow findings rather than desired reusable behaviour. Preserve the approved normal layout and propose a bounded visible correction before implementing an enlargement refinement. Parity does not establish enlargement acceptance or complete Package 4 quality.

## Group 5 gallery and physical presentation preservation

BookGallery and PhysicalBookPresentation share one samples section and one radial forest field. The section follows discovery. Do not split the background, insert an additional visible wrapper or change the existing join. These are retained homepage exceptions, not new global defaults. Their source rules are scoped in `frontend/src/styles/homepage-media.css` and `homepage-craft.css`. Exact words and image identities belong in the media content records, and measured verification belongs in the [Group 5 review](PACKAGE_3_GROUP_5_REVIEW.md).

| Media element | Retained rule |
| --- | --- |
| Shared field | Samples frame maximum 1440px with existing foundation gutters. Radial teal tint centred at 15%/16% over forest. Top border 20px and padding 93px above/80px below; at 720px and below use 14px border and 77px/66px padding. Scroll margin 116px, then 96px at 720px and below. |
| Gallery heading | Newsreader clamp(50px,5.1vw,70px), weight 450, 1.01 leading, minus .045em tracking. Gold emphasis weight 430. At 720px and below use 39px/1.04. Lead 16px/1.7, then 15px on narrow screens. Heading bottom gap 48px, then 30px. |
| Gallery rail | One manually scrollable horizontal row, proximity snapping and preserved inline scroll padding. Card width clamp(320px,43vw,560px), then min(79vw,520px) at 900px and min(84vw,410px) at 720px. Maximum 355px at 480px. No autoplay. |
| Gallery images and labels | Six original temporary SVG images in original order. Image ratio 3/2, centred cover crop, 14px corners and existing border/shadow. Formal name only below each image, Manrope 17px weight 650 with 1.45 leading, then 16px at 720px. No sample text, extra caption or enlargement icon. Fine-pointer image hover scales to 1.015 over 220ms only without reduced motion. |
| Gallery controls | Existing opposite 44px circular previous/next controls. Preserve disabled endpoints, spacing and narrow vertical arrangement at 360px and below. Opener focus uses the existing 2px gold outline with 5px offset and 14px corners. |
| Lightbox | Single selected image with previous/next arrows, keyboard left/right, touch swipes, Escape and close control. Navigation stops at both ends, never loops. Preserve focus trap, background isolation and restoration to the clicked opener. No autoplay or extra controls. |
| Lightbox layout | Width min(1180px,100vw minus 32px), maximum height 100dvh minus 24px, 20/24/24px padding, 16px corners. At 720px use viewport width minus 16px, 12/10/16px padding and 12px corners. Image uses contain, 9px corners and the existing viewport height bound. Retain the forest surface, dark blurred overlay, title and hidden instructions. |
| Gallery to craft join | 51px top margin, 1px internal divider, 50px top padding becoming 38px at 480px. Desktop columns 1.08fr/.92fr, second column minimum 360px, gap clamp(38px,5vw,82px). At 900px and below stack with 32px gap. |
| Physical photograph | Full height of the desktop copy column, minimum 520px, 12px corners and centred cover crop. At 900px use landscape ratio 1.58 and no minimum height; at 720px use 1.35. Preserve the four temporary photographs and existing bottom gradient. No visible slideshow caption. |
| Physical heading and introduction | Heading Newsreader clamp(42px,4vw,58px), weight 450, 1.03 leading, minus .04em tracking, gold emphasis weight 430. Use 38px at 720px. Introduction remains 16px/1.75 with 22px top margin. |
| Three physical details | Details start 30px below the introduction, then 26px at 720px. Icon and heading share a row. Icon tile 45px with 12px corners and 16px gap, then 42px and 13px gap. Heading Newsreader weight 600, clamp(20px,1.8vw,23px)/1.2, then 21px. Description remains 15px/1.65, no top margin, aligned 61px from the detail left edge, then 55px. Detail gaps 24px, then 23px. |
| Physical action | One existing See package details link below the details, 28px top margin. Preserve the canonical pricing URL, gold colour, Manrope 15px weight 650 and 1.6 leading, 15px arrow gap, underline on hover and 3px arrow movement. |
| Slideshow | Four accessible indicators with one pressed state. Existing active white elongated mark and quiet inactive dots. Advance every 6500ms while the observer reports the section visible, loop after the fourth, and reset the interval after manual selection. Preserve 900ms crossfade, observer/timer cleanup and immediate response to reduced motion. Reduced motion prevents autoplay and removes the crossfade. Only the active photograph has exposed alternative text. |

Retain original temporary asset provenance rather than presenting placeholders as finished product photographs. The gallery and physical checkpoints are sequential; the physical checkpoint must compare the complete shared field because the radial background depends on combined section height. Principal target recommendations do not silently authorise resizing the specialised existing slideshow indicators. Broader accessibility, native zoom and device acceptance remain Package 4 work. Matching section parity is not founder approval or authority to publish React.

## Group 6 How it works preservation

HowItWorks follows the combined gallery and physical presentation. Preserve the published composition rather than treating its scroll runway as ordinary section spacing. Scoped rules are in `frontend/src/styles/homepage-process.css`; pure interval helpers are in `frontend/src/sections/processProgress.ts`. These retained exceptions do not change global foundation tokens. The [Group 6 review](PACKAGE_3_GROUP_6_REVIEW.md) owns implementation and verification evidence, while the content gate and process.json own wording and image provenance.

| Process element | Retained rule |
| --- | --- |
| Heading | Newsreader clamp(43px,4.15vw,59px), 1.05 leading and minus .04em tracking. Teal italic emphasis is a separate line at weight 420 with 12px top margin. At 720px and below use clamp(43px,7.3vw,55px) and a 9px emphasis gap. |
| Wide composition | Above 900px use .99fr/1.01fr columns with clamp(37px,5vw,70px) gap. The heading occupies the first row, steps the second, actions the third. The photograph spans rows two and three and stretches with the content rather than imposing a fixed text box. |
| Markers and dividers | Circular markers are 38px square, becoming 36px at 720px and below. Active marker remains white on teal. Each list row keeps 5px vertical inset around its button and a single lower divider, except the last. Keep the 12px button corners separate from circular markers and the 6px action family. |
| Desktop rows | At least 94px high, with 4px/10px button padding and 15px grid gap. Titles retain 17.5px weight 700 and 1.32 leading; descriptions retain 15px and 1.48 leading. Their actual heights must not define scroll intervals. |
| Narrow composition | At 900px and below stack the copy and photograph with a 35px gap. Preserve 80px section padding, becoming 76px at 720px. Photograph height is 420px, then 355px at 720px and 300px at 480px. Existing 20px photograph corners remain. |
| Image treatment | Preserve the four sources, declared attributes and alternative text. Cover crop is centred, becoming 50%/35% at 720px and below. Entry lasts 320ms from .55 opacity and scale 1.016. Reduced motion disables it. |
| Pinning eligibility | Only at width at least 901px, height at least 731px and no reduced motion preference. Grid top is clamp(134px,16vh,160px), except widths 901px through 1100px retain 120px. The eligible section keeps 63px/52px vertical padding and a 525px trailing runway. Short screens and reduced motion do not use this pinned progression. |
| Scroll progression | Preserve the 20px progress origin and independent 112px intervals for the four stages. Stage four remains selected through the remaining pinned distance before release. Reverse scrolling restores earlier stages. Manual selection lands 6px inside its interval on eligible screens. Do not shorten the fourth hold or derive intervals from row dimensions. |
| Manual controls and actions | Native stage buttons retain aria-pressed and their relationship to the visual. They remain usable without scroll selection. Choose a book may reach the rendered local Books target; Explore gifting keeps its canonical destination. Both retain their existing 49px minimum action height, shared 6px corners, focus and hover. |
| Anchor and lifecycle | Section scroll margin is 116px, becoming 96px at 720px, within the existing root scroll context. Respect live motion preference and viewport changes. Keep passive scroll handling, one scheduled animation frame and listener/frame cleanup. Do not introduce scroll hijacking, an autoplay timer or new controls. |

Normal section padding outside the eligible pinned mode retains its published variants, including the 84px/90px tall desktop reduced motion treatment. Preserve the exact existing CSS cascade rather than globally normalising those values. Native zoom, wider browser and complete page checks remain required. A matched targeted text enlargement capture does not certify the whole page or every assistive setting.

## Group 7 hero and motion preservation

HeroSection reconstructs the published hero in isolated source using the existing Container, Heading, Text and ActionLink foundations. Its rules are scoped in `frontend/src/styles/homepage-hero.css`. The [Group 7 review](PACKAGE_3_GROUP_7_REVIEW.md) owns source identities, captures, interaction evidence, diagnostic history and the checkpoint result. Exact wording, photographs, cover identities and arrangement data belong in the content gate and `frontend/content/hero.json`.

Preserve the sequence of floating header, hero introduction, photograph carousel, supporting paragraph/actions and ticker, followed immediately by the reassurance band and discovery. The 152px sage field behind the header belongs to this relationship. The hero uses a mix of 60 percent published sage and published warm paper, with the inherited 54px grid texture, opacity .64 and vertical mask. Preserve its orbit fade layers and the published local HSL surfaces; do not substitute the general source sage or paper tokens where their values differ.

| Hero element | Retained rule |
| --- | --- |
| Section and containers | Top padding 63px, then 53px at 900px, 43px at 720px and 35px at 480px and below. No bottom padding. Introduction and outro use the existing 1184px container and foundation gutters. Keep isolated stacking and clipped decorative overflow. |
| Heading | Use the canonical hero type token and its 900/720/480/360px changes. Maximum width 1070px, Newsreader weight 450, 1.01 leading and minus .049em tracking. The teal italic emphasis remains a separate block at weight 420, with normal wrapping. Legacy mobile heading widths and leading do not override these final values. |
| Progression | Maximum width 820px, 31px top margin, 16px padding and 1px forest tint rules above/below. Manrope 15px weight 650 with 1.45 leading; horizontal gap clamp(12px,2.4vw,33px). At 720px use 23px top margin, 13px/3px padding, 13px type and 8px gaps, with each number above its phrase. At 480px use 5px gaps and 105px maximum phrase width. Numbers are 13px, then 12px at 720px and 11px at 360px. Arrow sizes remain 20px, then 15px at 720px and 13px at 480px. |
| Photograph frame | Retain the width/height matrix below, 34px top margin and 20px corners. At 720px use 26px top margin and 15px corners. Preserve the 1px white border at .74 alpha, paper background at .92 alpha and existing shadow. The bottom veil spans the entire frame and begins its visible gradient at 78 percent. |
| Photograph controls | Previous/next controls remain circular, 44px square and 43px at 480px. Position the combined controls 18px from the right/bottom, then 12px at 720px. The group gap remains 13px; the arrow pair gap is 7px, becoming 5px at 720px. Preserve the blurred paper background, border, shadow, hover and 15px chevrons. Three 22px indicator controls retain the existing pill surround, 5px dots and 19px active mark. Hide the indicators at 720px and below. |
| Outro and copy | Top padding 30px, becoming 25px at 720px. Paragraph maximum width 710px with centred Manrope 16px/1.75; use 15px at 720px and 14px/1.72 at 480px. Preserve the published muted ink and exact copy. |
| Actions | Row starts 22px below the copy with a 12px gap. Preserve the filled and outlined action pair, 153px minimum widths, weight 650, 1.4 leading and shared 6px corners. Default labels are 14px, minimum height 49px, padding 12px/24px and icon gap 20px. At 720px use 13px labels and 46px minimum height. At 480px use 12px labels, 12px/15px padding and 10px icon gap; at 360px use 12px inline padding and a 14px arrow instead of 17px. Preserve natural wrapping, including separate action rows at 320px. |
| Ticker appearance | Forest strip with existing gold tint rules. Top margin 40px and minimum height 57px, becoming 27px and 50px at 720px. Newsreader italic 18px weight 400 with inherited 1.7 leading, becoming 15px at 720px. Phrase padding is 13px above, 12px below and 34px on the left with a 26px ornament gap; at 720px use 11px vertical padding, 26px left padding and 20px gap. Keep the 8px gold ornament and transparent tap highlight. |
| Focus | Existing 2px teal outline with 4px offset for actions and photograph controls. The ticker's own focus outline remains 2px gold, inset 4px. Keep the ticker as the existing focusable pause interaction; do not add a prominent Pause movement control. |

| Viewport width | Photograph outer width | Photograph frame height |
| --- | --- | --- |
| Above 900px | min(1240px, viewport minus 72px) | clamp(380px,39vw,570px) |
| 721px through 900px | Viewport minus 46px | clamp(340px,51vw,480px) |
| 481px through 720px | Viewport minus 26px | clamp(285px,68vw,390px) |
| 361px through 480px | Viewport minus 26px | clamp(258px,68vw,299px) |
| 360px and below | Viewport minus 26px | 244px |

The fourteen decorative tiles retain six inner positions and eight outer positions. Each of the seven source covers appears twice. Preserve the angles and image mapping in hero.json rather than redistributing them. Tiles remain square with 12px corners, .78 opacity, the existing border and shadow, and no exposed alternative text.

| Viewport width | Inner/outer radius | Tile size | Stage and ring origin |
| --- | --- | --- | --- |
| Above 900px | 345px / 665.5px | 106px square | 830px stage; ring origin at 50 percent horizontally and 38 percent vertically |
| 721px through 900px | 285px / 511.5px | 82px square | Same stage and origin |
| 720px and below | 230px / 412.5px | 68px square | 570px stage; origin at 50 percent horizontally and 31 percent vertically |

Keep the motion systems independent. General playback pauses for reduced motion, a hidden document or when the hero's observer reports no intersection. Retain the observer threshold of .04. The photograph carousel also pauses for its existing hover/focus state; this does not pause the covers. The ticker additionally pauses for hover, focus or its held pause state; these do not pause the covers or photograph carousel.

| Motion or interaction | Retained behaviour |
| --- | --- |
| Photograph progression | Three photographs loop every 7600ms. Manual selection retains the existing interval lifecycle rather than automatically resetting it. Preserve 700ms directional image animations and the existing 690ms previous image cleanup. The settled photograph breathes between scales 1.005 and 1.028 over a 7.5 second alternating cycle. Preload the next photograph after 1200ms. |
| Photograph transition | Entry moves from a full width directional offset at scale 1.045 to zero offset at scale 1.012. Exit moves from zero at scale 1.012 to an opposite 18 percent offset at scale 1.035. Retain the existing cubic easing. Only the current photograph exposes descriptive alternative text; the previous image remains hidden from assistive technology. |
| Photograph input | Native indicator and previous/next buttons keep keyboard operation and loop endpoints. Touch navigation requires horizontal displacement greater than 50px and vertical displacement below half the horizontal movement. Preserve pointer cancellation and pan-y/pinch-zoom behaviour; do not introduce a custom arrow key scheme. |
| Orbit | Inner ring rotates clockwise over 160 seconds and outer ring anticlockwise over 220 seconds. Each face counter rotates at its ring's duration. General pause freezes these animations without resetting their position. At 720px and below the rings are static regardless of motion preference, with layer opacity .26. |
| Ticker | Two copies of the six phrases form a 34 second linear track moving to minus 50 percent. Click, Enter and Space toggle its held pause. Hover and focus temporarily pause without clearing that held state. Preserve its pressed state and changing accessible pause/resume name. |
| Reduced motion | Disable autoplay, orbit animation, image transitions and breathing. Keep manual photograph controls usable and the ticker visible but static. The decorative orbit opacity becomes .28, including on narrow screens. Honour live preference changes and preserve listener, observer and timer cleanup. |

These rules reconstruct the current published settings. They do not finalise deferred orbit aesthetics or motion preferences, accept inherited accessibility limitations, grant founder rendered acceptance or authorise replacing the published homepage. Complete page assembly and Package 4 remain separate work.


## Group 8 writing composition and practice preservation

WritingShowcase follows HowItWorks and precedes Gifting. It reuses Container, Heading and Text with scoped rules in frontend/src/styles/homepage-writing.css. PracticeDialog preserves the temporary unsaved question interaction. The [Group 8 review](PACKAGE_3_GROUP_8_REVIEW.md) owns dedicated and assembled verification. Exact words and the decorative logo belong in writing.json and the content gate.

Retain the existing laptop, tablet and phone composition on wider screens, and the separate question and helper card on phones. Device answers are static illustration content with a small cursor mark. Their Continue labels are decorative, not working product controls. Do not invent an automatic typing effect, persistence or customer application behaviour.

| Element | Retained rule |
| --- | --- |
| Section | 112px top and 118px bottom padding, becoming 84px and 96px at 720px and below. Preserve the published paper and sage field and device floor. |
| Heading and lead | Canonical feature heading with 430 weight teal italic emphasis. Lead 16px with 1.75 leading, becoming 15px at 720px and below. Keep the original centred text measures and wrapping. |
| Device stage | Maximum 1050px, aspect ratio 2, 56px top margin. Preserve the laptop 70%, tablet 27% and phone 15% widths, original positions, perspective, corners, shadows and container relative illustration type. These are illustration dimensions, not interface typography defaults. |
| Narrow layout | At720px and below hide the multi device composition and show the existing single question view. The additional bordered white card treatment applies at 480px and below. Preserve its existing text, spacing and height. |
| Entrance | Retain the one time IntersectionObserver threshold .12, original entrance definitions and delays, and reduced motion treatment. The unsaved dialog is independent of this illustration entrance. |
| Practice dialog | Width min(660px, viewport minus 32px), maximum 85dvh capped at 850px, padding 30px/45px/35px. At480px and below use 20px/24px/27px padding and 86dvh maximum. Short desktop screens retain 90dvh. Keep native internal overflow scrolling, overlay and existing corners. |
| Dialog text | Question 33px, becoming 30px at 480px and below. Textarea 20px, becoming 18px at 480px and below. Preserve the 6 row field, 180px minimum height then 150px on phones, original line heights and resize behaviour. |
| Controls | Keep the current outlined trigger, filled Close action, top close icon and Clear text control. Preserve their typography, hover, focus, dimensions and canonical 6px action corners. Do not turn illustration labels into buttons. |
| Practice behaviour | Maximum 2000 characters. Count words separated by whitespace, retain singular and plural labels, clear on every dismissal, restore trigger focus and release body scroll. No submission, success message, storage or account association. |

Preserve the current description relationship for migration comparison and record its inherited missing dialog description target in the Group 8 review. Matching that defect is not accessibility acceptance. A separately reviewed repair must address it before the final release gate. The original reassurance, hero motion and temporary media decisions remain unchanged.
