# Public website content creation and approval gate

Updated 20 October 2026 for authorised Package 3 Groups 1 through 7. Required for ALL new and revised public text, navigation labels, image captions, headings, FAQs, metadata, forms and conversion copy. A technical check cannot replace founder editorial approval.

## Product fact sources

The official private repository Storileaf/storiYoceFj6IRAleaf at main is authoritative for real product capabilities, packages, pricing, editorial review, cover personalisation, paper/binding specifications, writing periods, printing, gifting, shipping, payments, customer application flows and legal terms.

Founder-approved website wording and page decisions live in the private design/storileaf-website-ux branch. Read its current Homepage Master Implementation Brief, Content Gate, Copy Ledger and relevant page plans. Brand DNA guides character, voice, imagery and audience. Existing production pages are reference material, NOT automatic approval to reuse old claims, wording or design.

Where facts conflict, identify the discrepancy. Never invent a capability, price, inclusion, deadline, promise, testimonial or resource feature to complete a design.

## Required record for a copy change

1. Identify page, section, intended reader, section job and destination.
2. Quote the existing exact wording and its approval state.
3. Propose the new wording separately. Do not treat an assistant recommendation as accepted.
4. Cite current product files/URLs for every specific claim. Record date and source branch.
5. Check British English, restrained editorial voice, clarity, factual specificity, accessibility and honest calls to action.
6. Check repetition with immediately neighbouring sections and the global Homepage Copy Ledger.
7. Check the target exists. A visual-only CTA to an unbuilt page must not quietly become a broken link or a fake working button.
8. Check image rights, alt text, page heading hierarchy, metadata, canonical/robots intent and newsletter/consent language when relevant.
9. Record the founder's explicit approval of EXACT copy separately from authority to edit or release.
10. After implementation, inspect mobile and desktop screenshots, test actual links and preserve approvals in handoffs.

## Copy states

Use existing_verified for proven existing wording, proposed for suggestions, founder_approved for explicitly accepted final text, implemented_verified for built and tested material, superseded for historical alternatives. A build or passing browser test never grants editorial approval.

The editable React source uses frontend/content/ledger.json and the bounded media-ledger.json, process.json and hero.json extensions with source references and flags for whether a record may be published. All feed the same runtime lookup and content gate. The automated check rejects marked-for-publication text without an approved state and a provenance entry. It cannot determine whether a product claim is true. Human source review is still mandatory.

## Language and claims

Prefer human, plain British English. Lead with meaningful experiences, authentic guided storytelling, the customer's own words and the finished book. Avoid decorative overlines, software jargon, generic hype, false sentimentality and repetitive trust messages.

Preserve six formal book names, founder-approved per-book descriptions and bullets, and accepted homepage copy verbatim until further authorisation.

Do not imply comprehensive ghostwriting, universal photographs/voice packages, unlimited editing/collaboration, archival paper, sewn binding, guaranteed delivery dates or a working product where none is verified. Distinguish real printed books, illustrative mock-ups and temporary photo slots.

Resources remain a planned library; current Activities and Browse all resources actions are display treatments pending actual pages. The practice page is also deferred. The new newsletter is an approved UI, not evidence of an active collection integration in the static preview.

Never imply the buyer can access a gifted recipient's private responses without actual permission rules. Don't collect children's personal information in public activities without specific approved privacy design.

## Gate outcomes

Pass for drafting only after source and duplication checks. Founder approved means precise copy may be implemented, not that implementation has happened. Live means the exact behaviour and real destination were verified. Otherwise record the blocker and keep it out of public release.

This gate is complemented by the private Content Gate, Copy Ledger and official product documentation. Avoid maintaining two contradictory versions of product facts in these files.

## Operational source checks

New source pages must use identified ledger entries for approved customer-facing copy and must not invent resource/activity URLs. CI verifies copy provenance, approval states, ID references and verified HTTPS destinations. It does **not** independently determine whether a promise is factually true. A human review against the official private product implementation and this proposal template remains mandatory.

During an authorised migration, preserve the exact current homepage wording and record its inherited provenance. Group 1 carries Gifting copy forward from the immutable published baseline. Group 2 carries forward the reassurance band, six FAQs and final book invitation under the founder's explicit preservation instruction. Do not invent an `approved_on` value for these inherited records. Record `migration_recorded_on`, the protected baseline reference, migration explanation and exact copy comparison evidence. Group 2 also identifies `migration_group` as 2. This documents permitted retention of existing homepage words. It does not approve revised copy, create a new exact wording approval event or infer new product claims. The reassurance band's earlier provisional wording and placement decision is retained without being converted into final design acceptance. Resources retains its existing exact wording approval records.

The inherited_published_homepage exception remains limited to 28 exact records. Three are `home.gifting.title`, `home.gifting.description` and `home.gifting.cta`. The 25 Group 2 records cover the reassurance accessible label and three statements; the FAQ heading and contact action; the six complete questions and answers plus their four existing actions; and the final invitation's introductory sentence, heading and action. The gate explicitly maps those IDs to their full fragments in protected `e9550069d91b5a9b48ade43fcfb0a71bbed2875b` `index.html`. Other IDs under these prefixes are not automatically permitted.

The gate compares complete plain ledger text, normalising whitespace, with text extracted from the protected HTML. It decodes markup and entities only in the baseline. Literal markup or entity strings in a ledger value would render as extra React text and must fail validation. Each action must retain its exact resolved destination. Relative published pricing and book anchors may become absolute URLs in the isolated source only when they resolve to the same published target. Do not substitute currency-specific pricing URLs for the FAQ's existing generic pricing destination, invent routes or give reading copy a new link. Source data references for reassurance items and FAQ question, answer and action IDs are checked as well as direct content calls. Validation rejects changed wording, arbitrary fragments, reassigned content, incorrect references, missing migration provenance and invented approval dates. These bounded inheritance rules cannot approve new copy.

Group 3 adds a separate inherited_published_shared exception for exactly 17 records. The six IDs under shared.header.books end in description. The other records cover All resources, Activities and games, the mobile introduction, Explore all books, the longer login label, the navigation logo alternative text, desktop and mobile navigation names, the home link name, the footer currency reading label and Skip to content. At the Group 3 checkpoint the complete ledger had 88 records; its previous 71 remained unchanged.

Each new record identifies migration_group 3, the protected e9550069 commit, its exact source_fragment and either assets/content-sections-CfrmOVRI.js or index.html. The shared validator parses only the named protected homepage data and header regions, the bounded footer currency label and the skip anchor before the header in the named homepage root. It verifies that HeaderNavigation actually renders the six descriptions and that the skip-link class token has its exact destination. It does not execute JavaScript or approve arbitrary matching literals. Plain ledger text is compared without decoding markup or escaped additions. No original approved_on date is invented. The five action records retain their existing canonical destinations; reading labels cannot gain links.

The Group 3 route map permits its four existing section/top targets and the main-content skip landmark. Group 4 adds only the rendered Books target, including the final invitation's authorised local binding. Group 5 subsequently adds the uniquely rendered Samples target and Group 6 adds How it works, as described below. Canonical published destinations stay in the ledger. FAQ pricing and Gifting destinations remain exact; other shared targets retain their actual published URLs until separately migrated. The [Group 3 review](PACKAGE_3_GROUP_3_REVIEW.md) preserves its original checkpoint, and the [Group 4 review](PACKAGE_3_GROUP_4_REVIEW.md) owns the Books extension.

Use the [content proposal template](CONTENT_PROPOSAL_TEMPLATE.md) to document the exact old and new copy and link it from the page's decision record. Do not increase duplicate documentation by pasting entire product terms into the public repository.

## Group 4 discovery content

The founder authorised retention of six book discovery and its local Books navigation on 19 October 2026. Add exactly 28 bounded inherited records for the section heading, supporting paragraph, rail label, action label, six introductions and eighteen bullets, bringing the ledger to 116 while preserving all previous 88 records. Reuse the six formal book name and canonical individual book URL records. The discovery introductions are distinct from the shorter header menu descriptions.

The exact approval_kind is inherited_published_discovery with migration_group 4. Its permitted IDs are home.discovery.title, home.discovery.description, home.discovery.cta and home.discovery.label, plus home.discovery.books.<key>.intro and point1 through point3 for the six explicit keys life, travel, relationship, founder, letters and occasions. Other matching prefixes are not approved. The existing inherited_published_homepage and inherited_published_shared exceptions remain unchanged.

Extract the exact strings from the named protected discovery and homepage data regions at e9550069d91b5a9b48ade43fcfb0a71bbed2875b without executing the compiled bundle. Each inherited record identifies Group 4, the immutable source fragment and migration record date. No new original wording approval date is inferred. Reject revised wording, arbitrary fragments, reassigned IDs, introduced links and invented approval dates. The dedicated review records the private product model and prior founder copy decisions checked for this scope.

The six image records retain original sources and alternative text. Their 850 by 660 dimensions are the original img attributes; browser evidence must separately record loaded sources and natural sizes. The inherited image rights and final production review status remain unchanged.

## Group 5 gallery and physical presentation content

The founder authorised unchanged gallery/lightbox migration followed by the physical book/slideshow on 19 October 2026. Preserve all 116 preceding ledger records. The separate media-ledger.json adds exactly 30 records under inherited_published_media with migration_group 5. Fifteen cover the gallery heading, introduction, accessible instructions, rail and navigation labels and the six opener labels. Fifteen cover the physical heading, introduction, three detail headings and descriptions, the single package action, slideshow/group labels and four indicator labels. Existing formal book name records are reused. This is one content system with a bounded extension, not a second approval authority.

The media validator reads only the named SampleGallery and CraftPhotoSlideshow functions, exact samples/craftPhotoSlides data and their actual homepage image bindings at the protected e9550069 baseline. Template URLs remain inert parsed data; compiled JavaScript and template expressions are never evaluated. The source_fragment must identify the actual render/data location, not an unrelated matching literal. Reject changed copy or emphasis, extra/missing/reassigned records, invented approval dates and new destinations. Retention does not create a new original wording approval.

media-images.json owns the six original SVG placeholder identities and four temporary photograph identities. Preserve original order, paths, alternative text, declared dimensions, centred crops, origin and rights review. The six copied gallery assets must match protected file bytes. Declared dimensions retain the published attributes; they are not claims about natural resolution. Browser checks separately verify loading and natural image sizes. Neither placeholders nor provisional photography become final product photography through this migration.

The physical action retains exactly https://storileaf.com/pricing/ with its existing verified destination state. It is not silently rebound to a currency route. Only the actual unique samples section may resolve shared See inside links locally. Source origin, homepage path, absence of an added query and unique target are checked; canonical ledger destinations stay intact. At the Group 5 checkpoint, How it works remained an outward published target. Group 6 supersedes that route boundary only for its actually rendered section.

The [Group 5 review](PACKAGE_3_GROUP_5_REVIEW.md) owns implementation, diagnostic and verification evidence. Style values remain in the public design system. No new product promise, wording approval, pricing repair, asset replacement or React publication is created by this extension.

## Group 6 How it works content

The authorised reconstruction adds exactly eleven records and four photograph identities in frontend/content/process.json under inherited_published_process and migration_group 6. Preserve all earlier ledger and media records. The permitted text is the section heading with its exact emphasis, titles and descriptions for stages 0 through 3, Choose a book and Explore gifting. Their explicit IDs are home.process.title, home.process.step.0.title and description through home.process.step.3.title and description, home.process.choose and home.process.gift. Prefix matching does not approve additional records.

The parser reads only Process, sharedSteps, stepVisuals and the actual homepage image bindings in the protected compiled source. It never evaluates compiled JavaScript or template expressions. Preserve the exact source fragments, word order, emphasis, photograph order, alternative text, declared dimensions and responsive crops. Mutation checks reject changed copy, destinations, fragments, assets and invented original approval dates. The existing inherited authority records permission to retain published wording, not a new exact wording approval or a new product capability.

Choose a book keeps its canonical published Books destination in the ledger and may bind to the one rendered local Books section. Explore gifting remains exactly https://storileaf.com/gift/. Shared How it works links may now use the unique local #how-it-works target, with origin, path, query and current page semantics still checked. The existing FAQ action to https://storileaf.com/how-it-works/ remains unchanged; migration of a homepage section does not authorise rewriting that separate destination.

Declared 800 by 940 image dimensions reproduce the original attributes rather than asserting natural image resolution. Loading and natural sizes are recorded by browser verification. Existing rights review remains pending final production checking. The [Group 6 review](PACKAGE_3_GROUP_6_REVIEW.md) owns implementation and verification evidence. No new wording, product claim, image replacement or release permission is introduced.

## Group 7 hero and motion content

The authorised hero reconstruction adds exactly 23 inherited text records, three photograph identities and seven decorative cover identities in `frontend/content/hero.json`. Preserve all earlier ledger, media and process records. The exact approval kind is `inherited_published_hero`, with migration group 7, migration record date 20 October 2026 and protected baseline `e9550069d91b5a9b48ade43fcfb0a71bbed2875b`. This bounded extension feeds the existing content lookup and gate. It records authority to retain published material, not a new original wording approval, final motion preference or product capability.

| Permitted record group | Exact scope |
| --- | --- |
| Heading | `home.hero.title`, including its exact separate italic emphasis |
| Progression | `home.hero.progression.label` and numbered text records 0 through 2 |
| Photograph controls | `home.hero.carousel.label`, `choose`, `show.0` through `show.2`, `previous` and `next` |
| Supporting copy and actions | `home.hero.description`, `home.hero.explore` and `home.hero.samples` |
| Ticker | `home.hero.ticker.pause`, `resume` and phrase records 0 through 5 |

Membership and order are explicit in `frontend/scripts/inherited-hero-content.mjs`; a matching prefix does not permit another record. The parser reads only the named Hero and HeroCoverOrbits functions, heroMarquee, heroScenes, the three actual image bindings and the explicit cover/angle declarations in the protected `assets/content-sections-CfrmOVRI.js`. It parses the compiled source and URL templates as inert data and never executes them. Exact source fragments, full plain text, emphasis, action destinations and asset fields must agree with those bounded locations. Reject changed or reassigned wording, extra/missing records, invented original approval dates, arbitrary matching literals and altered provenance.

The progression retains the original 01, 02 and 03 numbering and its three exact content references. The ticker retains six phrases in their original order, with two rendered copies and its existing pause/resume names. The seven original covers retain their protected order and explicit six inner/eight outer position mapping, with each source used exactly twice. Reordering references or changing angles is not authorised by text inheritance. These arrangement fields are checked independently of the 23 text records.

The photograph records retain binding, spread and family in that order, including exact sources, alternative text, accessible slide labels, original scene titles, 1400 by 650 declared attributes and 50%/54%, 50%/50% and 50%/62% crops. The retained scene titles are data, not newly approved visible captions. The current hero exposes the active photograph's alternative text and a hidden slide label; do not add a caption from a stored title. Declared attributes do not assert natural image resolution. Browser evidence must separately establish loading and natural sizes.

Cover records retain `covers/cover-01.jpg` through `cover-07.jpg`, 240 by 240 dimensions, centred crops, empty alternative text and decorative roles. Copies under `frontend/public/covers/` must match the seven protected asset files byte for byte. Keep the published source paths and origins in provenance while resolving the same copied assets under the isolated frontend base path. Existing photograph and cover rights review remains `pending_final_production_check`; this migration does not settle final production rights or authorise replacement imagery.

Explore the books and See inside retain the canonical published destinations `https://storileaf.github.io/storileaf-homepage-preview/#books` and `https://storileaf.github.io/storileaf-homepage-preview/#samples`. They may bind to the already rendered unique local Books and Samples sections without adding a query, changing the destination or introducing current page semantics on section links. No new route is created by Group 7.

Hero source is implemented, with its served rendered and functional checkpoint pending. The [Group 7 review](PACKAGE_3_GROUP_7_REVIEW.md) owns that evidence and its eventual result; the public design system owns geometry and motion rules. Neither source implementation nor this inherited content allowance constitutes founder rendered acceptance, a new exact wording approval or permission to publish the isolated React page.
