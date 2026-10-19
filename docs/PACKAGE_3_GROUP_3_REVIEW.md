# Package 3 Group 3 review

## Authorised scope and current state

On 19 October 2026 the founder authorised bringing the shared header, newsletter, footer and navigation references into parity. The scope includes desktop menus, mobile navigation, currency behaviour, anchor destinations, current page semantics and investigation of the pricing warning. It supersedes the earlier proposal to migrate six book discovery next.

Implementation, complete local rendered and functional verification, and the exact committed Actions replay pass in the isolated React source. This is not founder visual acceptance, complete homepage parity or permission to replace the published homepage with React. The [public design system](PUBLIC_DESIGN_SYSTEM.md) remains the sole style authority.

The starting public checkpoint is [e4458092ae64749350ac1339c97ac7f83c9ce65c](https://github.com/Storileaf/storileaf-homepage-preview/commit/e4458092ae64749350ac1339c97ac7f83c9ce65c). The protected static baseline remains [e9550069d91b5a9b48ade43fcfb0a71bbed2875b](https://github.com/Storileaf/storileaf-homepage-preview/commit/e9550069d91b5a9b48ade43fcfb0a71bbed2875b). Root HTML, compiled assets, images, pricing export and the protected baseline stay unchanged. Private production and backend work are outside this group.

## Shared source implementation

SiteHeader now reproduces the published Radix navigation structure and behaviour. Desktop Books retains six formal names, their descriptions and the gifting entry. Resources retains its three existing destinations. Mobile navigation retains the logo, description, native Books and Resources disclosures, link order and separate action area. Dialog opening, closing, focus containment and restoration are checked through the rendered Radix implementation.

NewsletterFooter retains the shared photographic field fading to forest, the original gold logo, navigation groups, link order, copyright and legal row. Get in touch has no arrow. The newsletter input and existing Subscribe destination remain an interim public treatment, without a new subscription integration.

Packages 1 and 2 remain intact. Rectangular actions and paired newsletter controls keep the single 6px radius. Start your story remains 45px high wherever the header action is visible. Existing typography roles, editorial links, footer headings and currency sizes continue to apply. No redesign, new visible refinement or global normalisation is authorised here.

## Routes and semantics

The route map opts into local native fragments only for targets already rendered by the partial source composition.

| Shared destination | Isolated source treatment |
| --- | --- |
| Homepage top | `#top` |
| Skip to content | `#main-content`, the existing main landmark |
| Resources | `#resources` |
| Activities entry within Resources | `#resources-activity` |
| Common questions | `#questions` |
| Books, See inside and How it works | Existing full published homepage URLs until those target sections are migrated |
| Pricing | Existing full published currency route |
| Book detail, gifting, blog, account and legal links | Existing verified external destinations |

Four existing section and top targets resolve locally. The restored Skip to content control adds the fifth existing target, the main landmark, so keyboard users can bypass navigation. No placeholder target, fabricated public page or broad interception of external links is introduced. The Resources section's Activities and Browse all resources labels remain noninteractive because those pages are unbuilt. Their interim shared navigation anchors remain valid and serve a different purpose.

Ordinary homepage section links and the skip control omit aria-current page semantics. Local anchor checks cover actual target presence, navigation, focus where applicable, URL fragments and browser history. Links whose target sections remain unmigrated retain the actual published destinations. Group 1's earlier programmatic alignment evidence is preserved separately from this shared navigation work.

Two narrow navigation corrections are explicit. The published skip link changes the fragment but leaves subsequent keyboard navigation in the header. The source retains its wording, destination and focused appearance while native fragment navigation makes the next Tab continue within main content. The mobile dialog restores focus to its trigger with preventScroll, so closing navigation cannot pull the viewport away from the selected section. A published emulated touch trace reproduced that focus related displacement after the section first reached the correct position. Correct source target placement is required; the inherited published behaviour is recorded rather than reproduced. Protected markup and runtime remain unchanged.

## Currency and pricing

The source restores valid INR, USD, CAD or GBP preferences using the existing `storileaf.preview.currency` key, persists selector changes and falls back to INR when storage is invalid or unavailable. Shared Pricing links follow the selected currency and clear the keepsake query. The existing FAQ pricing links retain their generic pricing destination.

The [pricing hydration investigation](PRICING_HYDRATION_REVIEW.md) diagnoses three protected export defects. Default pricing has a stale footer arrow in its saved HTML. Direct currency paths receive the homepage fallback document with HTTP 404. A keepsake query can request a different book from the saved default pricing snapshot. Client navigation was checked separately and recovered or operated as documented there.

Those pricing defects remain unresolved in the protected export. A response only experiment is diagnostic evidence, not a published correction. Present a separate bounded proposal and obtain explicit founder approval before changing protected pricing files or repinning the guard. Source shell completion does not establish that every pricing entry route is hydration clean.

## Content inheritance

The ledger now contains 88 records. Seventeen new records use inherited_published_shared provenance with migration_group 3, an immutable e9550069 file reference, an exact source fragment and the migration record date. They cover six book menu descriptions, existing navigation action labels, accessible labels and the existing Skip to content control. No original approval date or new wording approval is invented. The previous 71 records are unchanged.

The bounded shared validator parses the named protected homepage data and HeaderNavigation and Header regions, verifies that the descriptions are rendered, and extracts the footer currency label from its actual HTML element. The skip control is read only from the pre-header anchor in the named homepage root, using the skip-link class token and exact canonical destination. The validator executes no compiled source and does not authorise arbitrary matching literals. Complete plain ledger text must match the permitted fragment. Literal markup, escaped additions, revised destinations, unrelated IDs, changed provenance and invented original approval dates are rejected.

The existing Group 1 and Group 2 inheritance gates remain in force. Shared route props may resolve the four owned section/top targets and the main-content skip target locally while the ledger retains their canonical published destination evidence. This does not relax the exact destinations of the migrated FAQ, Gifting or final invitation actions. See the [content gate](CONTENT_GATE.md) for the maintained rule.

## Verification method and retained gates

Compare actual protected and source screenshots at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. Record any additional width in the completed evidence. Inspect the closed header, both desktop menus, collapsed and expanded mobile navigation, newsletter and complete footer. Exercise pointer, keyboard and emulated touch, focus, Escape, currency changes, local fragments and history, reduced motion, short screens, targeted text enlargement, image loading and document overflow.

Retained tests exercise the rendered Radix controls and their observable behaviour. Earlier checks for strings belonging to the former handwritten handlers are no longer an appropriate gate for the reconstructed navigation. Package 1's primitive shape rules remain protected. Its obsolete reference shell geometry is superseded by comparison with the actual published shared components, while the approved 6px action radius, 45px header action and feedback remain checked.

The shared comparison loads real Newsreader and Manrope, the original logo and the shared photograph. Each normal width begins with a fresh page load and bounded viewport readiness checks. Header and menu crops retain their real surrounding context. Complete ending crops temporarily extend the viewport and record a body top padding adjustment below one CSS pixel plus one pixel of padding outside the final section to avoid document scroll clamping. These adjustments must leave component dimensions unchanged, and the original viewport and paddings are restored. Full viewport captures remain available as context; the unfinished surrounding React homepage is not a full page parity target.

Representation normalisation is limited to unused font fallbacks, font inheritance on nontext images or icons, invisible zero width borders and absent outlines, equivalent zero image offsets, and effectively instantaneous reduced motion. Visible colours, loaded font families, image and path data, typography, geometry, destinations and pixels remain checked. The intentionally hidden accessible currency label is excluded from visible text clipping checks on both pages. All visible newsletter and footer text remains measured.

Earlier local attempts identified real source corrections to inherited shell geometry, typography, icon paths, menu transitions and mobile anchor focus order. The retained shape check now waits for the actual settled hover state before comparing colour. The shared harness also corrects lazy logo readiness, foreground viewport timing, fresh load capture origins and enlarged menu pointer placement. These are documented readiness changes, not weaker geometry or pixel thresholds. Failed diagnostic attempts are not recorded as passing runs.

Source validation, content provenance, the protected runtime guard, build, static homepage regression, Package 1, Package 2, editorial links, footer typography and Group 1 and Group 2 comparisons remain meaningful gates. Record actual completed results below. A successful workflow is evidence for its tested scope and is not founder visual approval.

## Completed local verification

Chromium 155.0.8059.39 completed the final local shared run at 19:08:42 UTC on 19 October 2026. It covers all nine required widths plus 600px, namely 320, 360, 390, 430, 600, 768, 820, 1024, 1280 and 1440px. The report contains 74 normal width comparisons, 84 total computed comparisons, 41 state records, 132 individual target captures and 66 screenshot pairs, with 210 PNG files including comparison and context images. There are no parity problems. The largest recorded relative node geometry delta is zero CSS pixels. The largest changed pixel ratio is approximately 0.247409 percent, within the 1 percent gate at a per channel threshold of 24.

The run uses harness SHA256 `6bf2315e836d7cdd0990fe3c7bebd03f7d4c20b9f7b5bc8a93637725fba13646`. Its complete local report SHA256 is `bd4ffadec6140f95b328c920f778782fbc9cdac061c28654e4212fd5e2faa1b9`. The recorded source commit is the starting e4458092 checkout with the reviewed, then uncommitted Group 3 changes; file hashes identify those exact inputs. Do not confuse that field with an already committed Group 3 source checkpoint. The committed CI replay must record its actual commit and match the reviewed source and harness hashes.

The [durable local verification summary](../qa/shared-migration/2026-10-19/local-verification.json) retains exact source, build, protected input and harness hashes, completed counts, retained results and inherited findings. Actual comparison screenshots were visually inspected across every required header width, both desktop menus, collapsed and expanded mobile disclosures including their lower action area, the newsletter and complete footer across mobile, intermediate and desktop widths, focused skip links and enlarged states. No material visual parity concern was found. The enlargement and navigation qualifications below remain explicit.

All 21 source tests, TypeScript, the 88 record content gate, protected runtime guard and production build pass. The final retained local replay completed at 19:07:32 UTC against unchanged built and served bytes. Source UI passes nine widths; shape and vendor checks pass nine source and nine published widths, with ten source interaction states; clean resource focus passes at 390 and 1440px. Group 1 passes ten widths, 19 states and 20 screenshot pairs, with maximum changed pixel ratio approximately 0.0335 percent. Group 2 passes ten widths, 18 states, 60 individual expanded FAQ comparisons and 44 screenshot pairs, with maximum changed pixel ratio approximately 0.1205 percent. Group 2 enlargement measurements are complete without quality findings. Inherited Group 1 and shared enlargement findings remain open below.

| Final isolated build input | SHA256 |
| --- | --- |
| `index.html` | `34c52b179524ddb26177a7c47dd9036b2075f2dd9f5ec6222176f31f3996800e` |
| `assets/index-BQc6tMnm.css` | `8b4b0af975a1b2c5daefeb485adb4dc31e88b23b7ab8b494bc4cb5bd08e9b0b2` |
| `assets/index-CJtxcQS4.js` | `4bb41d6eab5ee2e7de2795b23bda76ab2879f2cd72612c3dee4d1c8d508d2b6e` |

## Retained footer gate correction

The Group 3 source and shared harness are committed at [443eb38103be373369f67283c417857f197f7da9](https://github.com/Storileaf/storileaf-homepage-preview/commit/443eb38103be373369f67283c417857f197f7da9). Standalone source validation [39309136906](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39309136906), Package 2 [39309137027](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39309137027) and editorial sizing [39309137399](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39309137399) completed successfully, with job steps and decoded logs inspected. Package 2 and editorial include successful actual live checks. The Package 2 report retains identical React 418 pricing warnings under original and current styles and records pricingUnchanged true.

The first footer run [39309137336](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39309137336), job 118253900730, failed its historical source comparison at 19:14:08 UTC. It injected the entire former components.css from 8989582 into the reconstructed source shell. That restored obsolete geometry, colours and mobile photograph rules. All current source type, currency, focus and fit assertions and all static assertions passed; the unrelated source style, photo and geometry comparisons failed. The later live step was skipped. This remains failed diagnostic evidence, not a successful gate.

The correction varies only the historical type roles within the migrated source shell. It extracts the heading's 11px size and 1.4 leading and the currency's 11px size from their exact named immutable rules, checks that those historical sizes are actually applied, then removes them and requires the current 15px heading with 21px leading and 13px currency. All frozen content and other styles, photograph and fade, outside section geometry, currency options, focus, fit and static comparisons remain in force. Complete source shell geometry is compared against the protected published implementation by the unchanged shared gate. No source component, CSS, shared harness, protected asset or baseline changed to resolve this test assumption.

The corrected complete local footer gate passes all nine static and source widths, currency focus and selections, short screens, touch fit and the retained desktop zoom reflow equivalent. The [local correction record](../qa/shared-migration/2026-10-19/footer-gate-correction.json) preserves its script hash and results. The corrected committed replay and actual live footer verification now pass, as recorded below.

## Verified committed evidence

The final dedicated [shared run 39310234409](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234409), job 118257598506, completed successfully at correction commit [9773c580a7525d3e02d4ab71d5d9d6f6ab704f0a](https://github.com/Storileaf/storileaf-homepage-preview/commit/9773c580a7525d3e02d4ab71d5d9d6f6ab704f0a). The implementation and shared harness remain unchanged from 443eb381. Every required job step, both protected guards and all artifact uploads passed. The completed job log and downloaded reports were inspected; this is not an inference from a queued run or a green summary alone.

The shared comparison ran from 19:25:40.588 to 19:27:17.039 UTC on 19 October 2026. The workflow update at 19:27:30 UTC records success. The hosted runner used Chromium 155.0.8059.84, while the local comparison used 155.0.8059.39. The final report records the exact 9773c580 checkpoint, the unchanged shared harness hash, all 30 source/content hashes and five protected file hashes. Every hash matches its reviewed input. All three built preview files are byte identical to the reviewed local build.

The final report completes the same ten widths, 74 normal width comparisons, 84 total computed comparisons, 41 state records, 132 target captures and 66 pixel pairs. All comparison differences and problems arrays are empty, every capture preserves component dimensions, and both enlargement scenarios complete their measurements. Maximum relative node geometry difference remains zero CSS pixels; maximum changed pixel ratio remains approximately 0.247409 percent. Inherited quality findings remain explicit below.

All 132 target PNGs are byte identical to the manually reviewed local captures. Of 144 actual browser PNGs, 141 match byte for byte. Three informational full viewport captures differ within the unmigrated published hero area, outside the shared header. Their difference rectangles are recorded. No complete homepage identity is claimed. The artifact contains 210 PNGs in total, including 66 comparison canvases.

| Artifact | Verified contents |
| --- | --- |
| [Shared parity, 12216650618](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234409/artifacts/12216650618) | Complete report, review page and 210 PNGs; exact source and harness identity verified |
| [Retained regressions, 12215701283](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234409/artifacts/12215701283) | Source UI, shapes/focus, protected homepage, Package 1, Package 2, editorial, corrected footer, Group 1 and Group 2 evidence |
| [Isolated React preview, 12216456051](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234409/artifacts/12216456051) | Three built files matching the reviewed local preview; not a published homepage replacement |

All three archive digests match their GitHub metadata. The [durable committed verification record](../qa/shared-migration/2026-10-19/committed-verification.json) preserves digests, report identity, counts, source verification, screenshot correspondence, context differences, retained findings and browser limits. The final shared report SHA256 is `d64b3f56e38c9052e0050692e369cc5e34b75d06260a5dd5cf837c7cebb3d595`.

Every retained report has an empty problems array. Group 1 retains Gifting clipping; Group 2 has no new quality finding. Package 2 explicitly retains identical React 418 warnings under baseline and current pricing styles, with pricingUnchanged true. The pricing diagnosis remains unresolved as described separately.

| Additional committed gate | Verified result |
| --- | --- |
| [Corrected footer 39310234343](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234343) | All nine static/source widths passed at 19:22:08 UTC; actual live Pages passed at 19:22:21 UTC. Downloaded artifact 12215088420 contains both reports with no problems |
| [Group 1 39310234238](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234238) | Full ten-width comparison and all retained steps passed; workflow updated successfully at 19:24:37 UTC |
| [Group 2 39310234511](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310234511) | Ten widths, 18 states and 60 individual expanded FAQ comparisons passed with every retained step; workflow updated successfully at 19:27:00 UTC |
| [Pages 39310231581](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39310231581) | Correction checkpoint 9773c580 deployed successfully, updated at 19:21:26 UTC; it serves the protected static root |

The first Group 1 run 39309137044, Group 2 run 39309136926 and shared run 39309136994 all passed their own component comparisons but failed the retained obsolete footer experiment. Their final protected guards passed. Initial shared artifact 12214913641 was inspected and confirms ten widths, 41 states and 132 target captures with no shared problems. Those overall failed runs remain diagnostic history and are superseded by the successful corrected workflows above.

Public documentation updates follow the verified source and gate checkpoints without changing runtime files. The permitted private design branch handoff and status carry the final public documentation head and its verified Pages deployment, avoiding a self-referential commit claim in this document. The private master brief and copy ledger receive dated Group 3 addenda while their earlier bodies remain intact. No retrospective founder acceptance record is created.

## Remaining limits

Gifting still has an inherited clipping finding under targeted 200 percent text enlargement at 320px. It remains a separate Package 4 issue requiring a scoped visible correction proposal. The shared migration does not fix it by matching the baseline.

Shared enlargement checks identify two further inherited quality limitations in both published and source pages. At 320 by 568px with targeted shared text doubled, four footer labels, See inside, Gift a book, Resources and Our story, extend beyond the right edge and clip. The currency control also extends beyond the edge, with its recorded right boundary at 349.391px against the 320px viewport; this control boundary observation is separate from the four flagged text ranges. The document itself reports no horizontal overflow because the ending clips its contents. At 1440 by 900px with shared text doubled, desktop navigation causes horizontal document overflow. Matching these findings establishes inherited parity, not an enlargement quality pass. Record and propose bounded visible reflow corrections separately before implementing them.

Hero, six book discovery, gallery and lightbox, physical book slideshow, process progression and writing demonstration and dialog remain to be migrated. Complete surrounding section placement cannot be accepted from this partial assembly. Full native browser zoom, other browser engines, physical devices and comprehensive accessibility remain distinct quality gates.

Founder rendered acceptance, authorisation of subsequent migration groups and permission for a complete React publishing cutover remain separate decisions. The current group does not authorise new pages, newsletter integration, private application work or a static pricing repair.
