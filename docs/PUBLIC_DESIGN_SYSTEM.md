# StoriLeaf public website design system

Version 2.1 foundation. Established 18 October 2026, consolidated in Package 2. Updated 19 October 2026 for Package 3 source migration Groups 1 through 4. This is the ACTIVE style authority for the new PUBLIC WEBSITE ONLY. The private customer/account and admin systems will be considered later, with smaller, denser component rules.

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

`Container` uses the existing 1184px content maximum. Total inline gutters are 96px above 900px, 64px at 900px and below, and 40px at 480px and below. That means 48px, 32px and 20px per side before the maximum width adds more outside space. Header and hero media retain their own wider compositions.

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

Group 2 preserves the reassurance band's current wording, icons, dividers and responsive layout. Its required full homepage position is immediately after the hero and ticker and before book discovery. Group 4 now places discovery directly after it; the hero remains unmigrated. Do not change the band's wording or position in this group or treat historical alternatives as active implementation instructions.

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

BookSelector, BookGallery and PrintedBookDetail keep their separately approved behaviours and exact copy. The sticky four-stage ProcessStory is a specialised editorial feature, not a generic dashboard scroll primitive.

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

## Implementation maturity

The public React source is deliberately staged. Groups 1 and 2 implement five editorial sections, and Group 3 reconstructs the shared header, newsletter, footer and navigation. This partial composition is not a second approved homepage. The current compiled root remains visually authoritative until a complete React rebuild passes desktop/mobile screenshot parity, accounts for approved refinements and receives founder acceptance. Consult [component inventory](COMPONENT_INVENTORY.md) before describing any component as migrated.

Package 3 Group 1 has implemented Resources and Gifting in isolated source, unchanged from source commit 2268529. Source validation and retained regressions pass. The working readiness/alignment harness matching committed 15d4500 passes all ten widths, 19 states, 48 capture geometry checks and 18 final programmatic target placements locally in Chrome 155. Its dedicated CI run 39281803940 is verified from the downloaded report and completed job log, with all retained gates and both protected-runtime guards passing. The review records earlier failed attempts, the passing 981 CI and later failed clean-a64 replay, with the demonstrated responsive CSS readiness correction. The inherited text enlargement finding remains open. Groups 2 and 3 are separately recorded below. This evidence does not approve a homepage redesign or publication of the partial React build.

Group 2 added ReassuranceBand, FaqSection and FinalInvitation at its original verified source checkpoint 8cd289a, with the full local comparison verified and final CI passing at gate correction 6b5f983. The [Group 2 review](PACKAGE_3_GROUP_2_REVIEW.md) retains that evidence and correction history. Group 4 subsequently extends the FAQ/invitation route props to the rendered local Books target without changing their content or styles. Discovery now follows the band; the hero remains unmigrated. Founder visual acceptance and complete homepage cutover remain separate.

## Shared component migration

The founder authorised Group 3 shared header, newsletter, footer and navigation parity. Its source implementation, complete local visual and functional verification, and committed CI replay pass. The [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md) owns the current evidence. The shared browser checks now exercise the actual Radix controls and compare their rendered geometry to the protected published implementation. Currency selection retains the published storage key and pricing route contract. The [pricing hydration investigation](PRICING_HYDRATION_REVIEW.md) identified three protected export mismatches; none is repaired by this source migration. No React cutover or founder acceptance is recorded.

Group 3 targeted enlargement also records inherited footer label and currency control clipping at 320px and desktop navigation document overflow at 1440px with shared text doubled. These are open quality findings, not desired reusable behaviour or an enlargement acceptance. Propose bounded reflow corrections before visible implementation changes. The measured normal geometry and completed Packages 1 and 2 remain protected.

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

Preserve the original automatic Radix tab activation, active tab reveal and reduced motion behaviour. Retain the six individual book destinations, default Life Story selection and existing image sources. Discovery follows the reassurance band, with the hero still awaiting migration. Shared Books navigation and the final invitation may use the actual local section without changing their visual treatment or canonical content records. No new pricing selection, public page, hero motion decision or visible refinement is introduced by this migration.

The complete Group 4 local and committed comparisons pass for the normal and interactive scope recorded in its review. Targeted text doubling reproduces inherited Relationship Memoir and Celebrating Occasions label bounds issues at 320px and 1440px. These are open reflow findings rather than desired reusable behaviour. Preserve the approved normal layout and propose a bounded visible correction before implementing an enlargement refinement. Parity does not establish enlargement acceptance or complete Package 4 quality.
