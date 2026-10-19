# Package 3 Group 1 review

19 October 2026. Resources and Gifting are implemented in the isolated React source. Local source validation, retained regressions and the full ten-width comparison pass. Final GitHub commit, CI and artifact references remain pending. An inherited Gifting text enlargement limitation remains open for Package 4. Founder acceptance and permission to publish React remain separate.

## Scope and baseline

The founder approved Group 1 after the 19 October handoff and the ordered migration proposal. This covers the two sections, their source checks, rendered comparisons and supporting documentation. Preserve all existing wording, images, crops, geometry, responsive behaviour, destinations and interaction states. Keep the completed Package 1 and Package 2 foundations intact.

The inspected public starting head is [75bfe77d7522ae93a51a0f51d322ff93eb4ec9c3](https://github.com/Storileaf/storileaf-homepage-preview/commit/75bfe77d7522ae93a51a0f51d322ff93eb4ec9c3). The protected published release remains [e9550069d91b5a9b48ade43fcfb0a71bbed2875b](https://github.com/Storileaf/storileaf-homepage-preview/commit/e9550069d91b5a9b48ade43fcfb0a71bbed2875b), including the final footer typography. The head's additional QA records do not change that runtime. Always inspect the current head before publishing source changes.

Group 1 leaves root HTML, compiled CSS/JavaScript, imagery and pricing files unchanged. `frontend/dist` remains isolated. This approval does not include other homepage sections, new routes, new public pages, newsletter integration, private production changes or a React publishing cutover.

## Source work

The section entry points are `frontend/src/sections/ResourcesSection.tsx` and `GiftingSection.tsx`, with approved homepage content assembled through `homepageEditorialContent.ts` in the same directory. Section rules are scoped in `frontend/src/styles/homepage-editorial.css`. Existing Heading/Text, EditorialHeading, Container/Section, ActionLink, ResponsiveImage and ResourceCategoryCard primitives remain the foundation. The resource card accepts the preserved Activities anchor and keeps responsive image sizing tied to the actual layout.

The existing unpublished source entry composes Gifting before Resources, matching their relative homepage order. Header and footer references remain subject to later parity work. This partial composition is not the complete React homepage.

The [public design system](PUBLIC_DESIGN_SYSTEM.md) remains the sole style authority. Its section exception rules preserve the published Resources heading gap, resource card treatment and Gifting composition. Correcting a source difference to match the live baseline does not authorise a new visible refinement.

## Content and destinations

Resources retains its approved exact wording, two photographs, whole-card Blog & guides link and centred heading and overview action. Activities and games and Browse all resources remain noninteractive because their destination pages are unbuilt. Preserve `#resources` and `#resources-activity` as existing homepage anchors.

Gifting retains the current title, supporting paragraph, action, photograph and `https://storileaf.com/gift/` destination. Its ledger records inherited homepage copy and the immutable baseline source. The original separate exact approval date is not recorded. `migration_recorded_on` documents this carry-forward work without inventing a new `approved_on` event. The migration gate must compare the exact normalised words with that protected source.

No copy revision, new commercial claim or fresh product fact approval belongs to this group.

## Verification method

`frontend/scripts/verify-group1-parity.mjs` compares the actual protected static homepage with the built `frontend/dist` source preview in headless Chromium. It requires the real Newsreader and Manrope fonts and decoded source photographs. No target section style, image or network response is substituted. The report records the browser version, file hashes, URLs, measurements, comparison thresholds and quality findings.

The main comparison uses a 1000px viewport height and device scale factor 1. Geometry is measured relative to each section because the incomplete React page has different preceding content. Clean screenshots temporarily increase viewport height to paint the complete section, hide the unrelated fixed header and add less than one CSS pixel of body padding to align the section's document position to a whole pixel. Both adjustments assert unchanged section dimensions, and the whole section must fit inside the capture viewport. The original viewport and padding are restored afterwards. Context captures at 390px and 1440px retain the original 1000px viewport, page position and visible header. Normal comparison captures use reduced motion and disabled screenshot animations.

The gate compares exact normalised text, destinations, loaded image metadata, icon paths and effective styles, with a 0.15 CSS pixel geometry tolerance. Screenshot comparison permits at most 1 percent changed pixels using a 24-level colour channel threshold. Equivalent unused font fallbacks, invisible border styles and the identical warm paper underlay are explicitly recorded; visible borders and the rendered composite remain checked. These tolerances do not describe founder visual acceptance.

Functional checks cover hover under both motion preferences, keyboard focus and tab order, noninteractive resource labels, and anchor landing at 390px, 600px and 1440px with a 600px viewport height. Emulated touch checks use 390×700px and prevent navigation after detecting the real touch activation and preserved href. They do not claim an end-to-end visit to the external destination. Targeted text enlargement doubles the specified section text sizes at 320×568px. It is not native browser zoom.

## Evidence gate

The complete local run used Chromium 141.0.7390.37 with actual downloaded fonts and images. It completed all ten widths and 19 state records with no reported problems. No measured geometry difference exceeded the 0.15 CSS pixel tolerance. The largest observed difference was 0.016 CSS pixels, in an inline emphasis position. The largest changed-pixel ratio was 0.0009425071, approximately 0.0943 percent, below the 1 percent threshold. The generated `frontend/qa/group1/report.json` records the full results, source hashes, icon checks, capture adjustments and the inherited quality finding. Its source hashes match the final reviewed source files. Final GitHub commit, CI and artifact references remain pending.

| Check | Evidence | Current result |
| --- | --- | --- |
| Source validation | `npm run check` and `npm run build`, including content provenance, TypeScript and all 16 tests | Passed |
| Existing source browser checks | Source UI, retained shape roles and focus captures | Passed |
| Published regression continuity | Static homepage, permanent Package 1 live checks, Package 2, editorial actions and footer/currency comparisons | Passed |
| Protected runtime | Published guard with unchanged root runtime and pricing files | Passed |
| Width matrix | 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px, plus targeted 600px intermediate check | Passed all ten widths |
| Section geometry | Resource centring/equal cards and Gifting composition, exact copy, image/crop, typography, action geometry and destinations | No difference exceeds 0.15 CSS pixels; largest observed difference 0.016 CSS pixels |
| Functional states | 19 states covering hover, keyboard/focus, inert labels, anchors, touch and targeted enlargement | Parity checks passed, with the inherited enlargement finding below |
| Visual inspection | Actual baseline/source comparison images | All ten widths and detailed normal/state captures reviewed. Final capture completeness check passed, including rounded card bottoms and Browse all resources |
| Source publication | Final source commit, CI and durable artifact references | Pending |

Retained focus checks now wait for two animation frames after viewport or focus changes before reading effective outlines. Existing comparison assertions remain intact. The change resolves sampling of the previous painted state rather than relaxing a visual requirement.

Package 2 checks preserve the pricing preview's appearance and reproduce the same React error 418 against both original and current styles. The warning remains unresolved and is carried forward to relevant route migration.

## Inherited quality finding

`gifting-enlarged-text-320` remains open. At 320×568px with targeted section text sizes doubled to 200 percent, both the published and React Gifting panels clip heading, paragraph and button text at the right edge. Resources reflows in the same experiment. The report measures clipped text ranges as well as document overflow.

Matching clipping establishes migration parity only. The absence of document overflow does not establish a text enlargement quality pass. Preserve this finding for Package 4 and propose a visible refinement for founder approval before changing the approved composition.

The checks use Chromium automation, emulated touch and targeted text enlargement. They do not certify native browser zoom, other browser engines, physical devices or full accessibility.

## Next gate

Attach final GitHub source commit, CI and artifact evidence to this completed local verification record before proposing the next migration group. Record implementation, measured verification, inherited quality findings and founder acceptance separately. The founder's positive final Package 2 response supports continuing the programme without reopening the foundation work. It is not a new formal acceptance record.

Full homepage reconstruction and Package 4 parity remain ahead. Only explicit founder approval after complete visual and functional parity permits replacing the published homepage with React.
