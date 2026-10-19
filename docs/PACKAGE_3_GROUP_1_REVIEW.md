# Package 3 Group 1 review

19 October 2026. Resources and Gifting are implemented in the isolated React source, unchanged from source commit 22685299cb7912b38352875c3dd2b2f77fec6374. Local source validation and retained regressions pass. The current readiness/alignment harness, committed as 15d450003ed528b2fccf753e52aeddf99eafa52b, passes the complete local Chrome 155 matrix and the dedicated CI report/completed job log verification. Earlier failed attempts, the passing 981 CI and a later failed clean-a64 local replay remain diagnostic history. An inherited Gifting text enlargement limitation remains open for Package 4. Founder acceptance and permission to publish React remain separate.

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

The main comparison uses a 1000px viewport height and device scale factor 1. Geometry is measured relative to each section because the incomplete React page has different preceding content. Clean screenshots temporarily increase viewport height to paint the complete section, hide the unrelated fixed header and apply a recorded body padding adjustment below one CSS pixel to reduce fractional raster offsets. The report retains the before/after document positions. Some published positions remain fractional, so integer alignment is not assumed. Both capture adjustments assert unchanged section dimensions, and the whole section must fit inside the capture viewport. The original viewport and padding are restored afterwards. Context captures at 390px and 1440px use the original 1000px viewport and visible header without the clean-capture adjustments. Normal comparison captures use reduced motion and disabled screenshot animations.

The gate compares exact normalised text, destinations, loaded image metadata, icon paths and effective styles, with a 0.15 CSS pixel geometry tolerance. Screenshot comparison permits at most 1 percent changed pixels using a 24-level colour channel threshold. Equivalent unused font fallbacks, invisible border styles and the identical warm paper underlay are explicitly recorded; visible borders and the rendered composite remain checked. These tolerances do not describe founder visual acceptance.

Before measurement or section positioning, the current harness brings the page to the foreground and waits for responsive CSS readiness. A hidden fixed 100vw by 100vh probe must match the requested viewport within 0.01 CSS pixels, while innerWidth and innerHeight must match exactly. The wait is bounded to five seconds and followed by two foreground animation frames. The inert, hidden probe does not participate in document layout.

Functional checks cover hover under both motion preferences, keyboard focus and tab order, noninteractive resource labels and programmatic section alignment at 390px, 600px and 1440px with a 600px viewport height. Native scrollIntoView targets the unique preserved Resources, Activities and Gifting IDs. The gate compares computed scroll margins and root padding, checks the target position after document-boundary clamping within one CSS pixel, and asserts final position and visibility. These are component alignment checks. They do not exercise shared header navigation, URL fragments, router history or restoration. The current shared source routes lead to the published preview or external Gifting page, so actual navigation remains part of later shell parity work.

Hover sampling uses bounded waits and explicit diagnostics. Emulated touch checks use 390×700px and prevent navigation after detecting the real touch activation and preserved href. They do not claim an end-to-end visit to the external destination.

Targeted text enlargement doubles the specified section text sizes at 320×568px. Before measuring, the current harness waits for all 14 selected and inherited text metrics on each page, including the heading emphasis, to reach doubled font size and line height. It does not directly restyle the emphasis element. This checks the settled enlarged layout and is not native browser zoom.

## Evidence gate

The current dedicated CI evidence is [run 39281803940](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803940) at harness commit 15d450003ed528b2fccf753e52aeddf99eafa52b. Its downloaded report and completed job log were inspected. Chromium 155.0.8059.39 completed all ten widths and 19 state records with no reported problems, using actual fonts and images. All nine programmatic alignment records, comprising 18 target measurements, passed unique-ID, CSS viewport, final placement and visibility checks. All 48 captures retained section dimensions. All eight source hashes and both published-file hashes matched the reviewed files. No measured geometry difference exceeded the 0.15 CSS pixel tolerance; the largest was 0.016 CSS pixels. The maximum changed-pixel ratio was 0.0009425071, approximately 0.09425 percent, below the 1 percent threshold. All retained gates and both protected-runtime guards passed in the completed log.

The matching working harness had already passed the same full local Chrome 155 matrix. That local report records sourceCommit a64c6a2948cda4ba4f2818f9bf1990d737d5defc because it preceded the harness commit. The final CI report records 15d directly and supplies the current immutable verification. Section implementation remains at 22685299cb7912b38352875c3dd2b2f77fec6374. An earlier full local run passed in Chromium 141.0.7390.37.

| Check | Evidence | Current result |
| --- | --- | --- |
| Source validation | `npm run check` and `npm run build`, including content provenance, TypeScript and all 16 tests | Passed |
| Existing source browser checks | Source UI, retained shape roles and focus captures | Passed |
| Published regression continuity | Static homepage, permanent Package 1 live checks, Package 2, editorial actions and footer/currency comparisons | Passed |
| Protected runtime | Published guard with unchanged root runtime and pricing files | Passed |
| Width matrix | 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px, plus targeted 600px intermediate check | Passed all ten widths |
| Section geometry | Resource centring/equal cards and Gifting composition, exact copy, image/crop, typography, action geometry and destinations | No difference exceeds 0.15 CSS pixels; largest observed difference 0.016 CSS pixels |
| Functional states | 19 states covering hover, keyboard/focus, inert labels, programmatic section alignment, touch and targeted enlargement | Passed locally and in current CI; all 18 target placements in position, with the inherited enlargement finding below |
| Visual inspection | Actual baseline/source comparison images | Ten-width normal/state reviews retained for unchanged sections, including full Resources card bottoms and Browse all resources. Current local run passes all 48 capture geometry checks |
| Source publication | Source commit, current harness, inspected CI report/completed log and durable artifacts below | Current dedicated CI verified; workflow/deployment observations at the evidence checkpoint are recorded below |

Retained focus checks now wait for two animation frames after viewport or focus changes before reading effective outlines. Existing comparison assertions remain intact. The change resolves sampling of the previous painted state rather than relaxing a visual requirement.

Package 2 checks preserve the pricing preview's appearance and reproduce the same React error 418 against both original and current styles. The warning remains unresolved and is carried forward to relevant route migration.

## GitHub evidence

Source implementation is committed on public `main` as [22685299cb7912b38352875c3dd2b2f77fec6374](https://github.com/Storileaf/storileaf-homepage-preview/commit/22685299cb7912b38352875c3dd2b2f77fec6374). The published root remains protected at the approved footer baseline. A successful Pages deployment serves that unchanged static homepage; it does not deploy the isolated React build.

The current harness correction is [15d450003ed528b2fccf753e52aeddf99eafa52b](https://github.com/Storileaf/storileaf-homepage-preview/commit/15d450003ed528b2fccf753e52aeddf99eafa52b). Section implementation is unchanged. The dedicated comparison is verified from its downloaded report and completed job log. The summary endpoints still showed queued states after successful report/log evidence became available. Completed logs and artifacts establish the verification results below; this metadata delay is not a test failure or a rerun requirement. Pages status below is the observation at this evidence checkpoint, approximately 16:15 UTC on 19 October:

| Current correction workflow | Result at the evidence checkpoint |
| --- | --- |
| [Group 1 comparison 39281803940](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803940) | Passed; inspected report and completed job log |
| [Source validation 39281803642](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803642) | Passed; 16 tests, source UI/shape/vendor checks and artifact uploads |
| [Package 2 review 39281803949](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803949) | Passed; candidate comparison and actual live stylesheet/font verification |
| [Footer review 39281803694](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803694) | Passed; source/static comparison and actual live checks |
| [Pages deployment 39281803239](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803239) | Not yet verified at approximately 16:15 UTC on 19 October; later documentation deployment outcomes belong in the resulting handoff checkpoint |

Current verified artifacts are [parity 12201082262](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803940/artifacts/12201082262), [retained regressions 12200657570](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803940/artifacts/12200657570) and [isolated source preview 12200732346](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803940/artifacts/12200732346). The preview remains isolated and is not a Pages homepage release. Separate current workflow evidence is retained in [source QA artifact 12201350795](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803642/artifacts/12201350795), [Package 2 artifact 12200054108](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803949/artifacts/12200054108) and [footer artifact 12201211857](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39281803694/artifacts/12201211857).

Earlier implementation and diagnostic evidence remains available:

| Workflow | Result |
| --- | --- |
| [Source validation 39273256448](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39273256448) | Passed |
| [Package 2 review 39273256390](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39273256390) | Passed |
| [Editorial action review 39273256518](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39273256518) | Passed |
| [Footer review 39273256410](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39273256410) | Passed |
| [Pages deployment 39273255653](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39273255653) | Passed |
| [Initial Group 1 comparison 39273256620](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39273256620) | Failed three harness assertions; diagnostic evidence |
| [Group 1 comparison after first correction 39276953509](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39276953509) | Original three failures absent; failed published Resources anchor visibility at 1440px |
| [Earlier 981 Group 1 comparison 39278591010](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39278591010) | Passed all ten widths, 19 states and retained gates; predates the current readiness/alignment correction |

The inspected passing 981 run retains [parity artifact 12199597134](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39278591010/artifacts/12199597134), [regression artifact 12200121673](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39278591010/artifacts/12200121673) and [source preview artifact 12200106633](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39278591010/artifacts/12200106633). These provide earlier verified evidence; they do not verify 15d.

### Harness diagnosis and scope

The initial Chrome 155 run completed all ten normal comparisons and 19 states but failed one published Gifting hover sample and two enlargement capture dimension assertions. [First correction 01d90af18537c92a8229fd5876302c7848a05a3e](https://github.com/Storileaf/storileaf-homepage-preview/commit/01d90af18537c92a8229fd5876302c7848a05a3e) added explicit foreground handling, bounded waits and diagnostics. Run 39276953509 completed the matrix with those three failures absent, then failed one published Resources anchor visibility assertion at 1440px.

Exact Chrome 155 investigation identified delayed inherited typography in the enlarged heading. Its emphasis briefly remained 38px before reaching 76px, adding 79.03125px to heading height during capture preparation. [Correction 981016e6609733cc436cf7c74b0214dda53563a1](https://github.com/Storileaf/storileaf-homepage-preview/commit/981016e6609733cc436cf7c74b0214dda53563a1) waits for all selected and inherited text metrics without changing emphasis styling. It also removed an unnecessary preliminary hash clear. The first 36 anchor followup measurements passed with both old and revised sequences, so they did not establish the cause of the earlier offscreen result. The full local run and CI 39278591010 subsequently passed.

A later local replay from clean documentation checkpoint [a64c6a2948cda4ba4f2818f9bf1990d737d5defc](https://github.com/Storileaf/storileaf-homepage-preview/commit/a64c6a2948cda4ba4f2818f9bf1990d737d5defc) completed all ten normal comparisons and 12 states, then timed out on the first published Resources target at 1440px. The focused Chrome 155 diagnostic reproduced stale responsive CSS after a resize from 600px to 1440px: innerWidth and matchMedia had updated, while the fixed 100vw probe and heading metrics still reflected 600px. Resources moved from documentTop 5193.515625px to 6538.3125px when CSS caught up. Native hash actions dispatched correctly; no cached scrollTo was observed. This demonstrates a viewport-readiness cause for the reproduced diagnostic failure and does not establish a runtime navigation defect.

The bounded fixed-probe readiness wait then allowed all nine unchanged native-hash diagnostic checks to pass. Current correction 15d also makes the gate's component scope explicit: native scrollIntoView measures unique IDs, unchanged computed margins and root padding, document clamping, final position and visibility. The shared source routes currently point to published or external pages. Header navigation, URL fragment/history behaviour and router restoration therefore remain later shell migration work. No section source, published style or runtime navigation was changed to make these checks pass.

The working harness matching 15d passed all ten widths and 19 states locally, all 48 capture geometry checks and all 18 final target placements. The final CI report and completed log independently confirm those results at commit 15d, with all retained gates and both protected-runtime guards passing. The visual, content, style and protected-runtime assertions remain intact; the current alignment checks retain offset/clamp/visibility requirements and add explicit unique-ID and final-position assertions. Failed attempts and successful earlier evidence remain distinct from current verification.

### Live runtime byte check

At approximately 16:05 UTC on 19 October, direct HTTPS requests returned status 200 and exact protected-file SHA256 matches for these live static files:

| File | SHA256 |
| --- | --- |
| `index.html` | `76e803f92a7621bc46cb5807b743516b773af1c73e1b01f5c487d6438e49ea81` |
| `assets/index-DhPZyX4z.css` | `75e1550fc2a24edf5ce47f856ba7e849f1624c9526f1a4a304442bbcf74e325f` |
| `pricing/index.html` | `9c1b86e5fec16b7b26904b81032b62573f312d8fbde98b5ee150b9f860ce6d14` |

This verifies live HTTP bytes. It is not a new live browser check or confirmation that the current commit's Pages deployment has completed.

## Inherited quality finding

`gifting-enlarged-text-320` remains open. At 320×568px with targeted section text sizes doubled to 200 percent, both the published and React Gifting panels clip heading and paragraph text at the right edge. The button's right edge also extends into the clipped area. The Range measurements flag one heading line and two paragraph lines, not the button label. Resources reflows in the same experiment. The report measures clipped text ranges as well as document overflow.

Matching clipping establishes migration parity only. The absence of document overflow does not establish a text enlargement quality pass. Preserve this finding for Package 4 and propose a visible refinement for founder approval before changing the approved composition.

The checks use Chromium automation, emulated touch and targeted text enlargement. They do not certify native browser zoom, other browser engines, physical devices or full accessibility.

## Next gate

Group 1 source implementation and its current dedicated evidence are ready for founder review. Verify each documentation deployment and keep the public/private handoffs in agreement. Then propose the next migration group for approval before editing it. Record implementation, measured verification, inherited quality findings and founder acceptance separately. The founder's positive final Package 2 response supports continuing the programme without reopening the foundation work. It is not a new formal acceptance record.

Full homepage reconstruction and Package 4 parity remain ahead. Only explicit founder approval after complete visual and functional parity permits replacing the published homepage with React.
