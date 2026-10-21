# Pricing hydration investigation

## Authorised default footer correction

On 20 October 2026, America/Toronto, the founder authorised only correcting the saved default pricing footer and completing its original/candidate comparison, retained geometry, direct loading and refresh verification. The exact change removes the obsolete arrow span and preceding space from pricing/index.html, a 36 byte removal. Every other byte of that document and all other protected runtime files remain unchanged.

[Candidate run 39525643936](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39525643936), attempt 1 at 95da225fb2e2d2e3400f6f84f3b6747df0125e1b, passed all ten required widths. Its 60 observations contain 20 original loads/reloads, 20 candidate loads/reloads and 20 saved-document renders with JavaScript disabled. All 50 geometry and 14 pixel comparisons passed with zero difference. All 20 original runtime observations reproduced React 418; all 20 candidate observations had no page error. Saved original/candidate footers were visually inspected at 320, 390, 820 and 1440px. The candidate saved footer images match their settled images byte for byte. The complete 1440px pricing capture was also inspected.

The exact [static repair](https://github.com/Storileaf/storileaf-homepage-preview/commit/a9e6e6cf8ae078376837f91651a1ac9a3f1a9164) supplies the deliberate new protection baseline a9e6e6cf8ae078376837f91651a1ac9a3f1a9164. The enabled guard retains every protected path. The original e9550069d91b5a9b48ade43fcfb0a71bbed2875b remains the homepage and migration reference. The fixed React review and its original build provenance are unchanged.

The correction is implemented, verified and published. [Publication commit 30b2b647](https://github.com/Storileaf/storileaf-homepage-preview/commit/30b2b6479387e0d00bdc7163242743d277d86516) deployed through [Pages run 39526081873](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39526081873). The [durable footer index](../qa/pricing-hydration/2026-10-20/default-footer-verification.json) owns exact inputs, runs, environments, report hashes, retained images and diagnostic history. The two remaining pricing export defects below are not repaired or authorised by this correction. No new pages, root homepage replacement or private production changes are included.

### Original and candidate evidence

The ten widths were 320, 360, 390, 430, 600, 768, 820, 1024, 1280 and 1440px, with 1000px viewport height, DPR 1 and reduced motion. The comparison checks the whole pricing document, six section boxes, default INR/Life Story selection, three plan cards, text, links, imagery, computed styles, document overflow and the complete footer. Fonts and images load before measurement. The saved-document comparison keeps JavaScript disabled; it does not rely on client recovery to hide the original mismatch. This records the existing default rendering and does not approve new product or commercial claims.

The prepublication run used Chrome 155.0.8059.39 on Ubuntu 24.04.5, runner image 20261012.334.1, Node 22.23.3 and Playwright 1.56.1. It passed all 180 readiness stages and all comparisons described above. [The retained original report](../qa/pricing-hydration/2026-10-20/default-footer/prepublication-report.json.gz) is compressed without changing its content. Representative saved original/candidate footer pairs and the complete settled 1440px pricing capture are retained beside it.

[Publication verification run 39526082447](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39526082447), attempt 1, repeated the complete candidate check on 30b2b647 using Chrome 155.0.8059.84 and runner image 20261018.339.1. It passed all 60 observations, 50 geometry comparisons, 14 pixel comparisons and 180 readiness stages. Geometry differences remained zero. Thirteen pixel comparisons were identical; the 1024px settled footer comparison contained 27 changed pixels, a ratio of 0.00006353539156626506, below the unchanged 0.01 limit. The actual pair was inspected. Sixteen changed pixels were within The books heading and eleven within Here to help, away from Get in touch. This bounded raster difference is retained, not described as a runtime repair or evidence of permanent screenshot stability. The [publication candidate report](../qa/pricing-hydration/2026-10-20/default-footer/candidate-report.json.gz) preserves the exact observations.

### Live publication

The same successful publication workflow verified [the live default pricing page](https://storileaf.github.io/storileaf-homepage-preview/pricing/) from 01:15:18.737 to 01:15:27.726 UTC on 21 October 2026, still 20 October in Toronto. Direct entry and refresh passed at 320, 390, 820 and 1440px, giving eight live observations. Each returned HTTP 200, the exact corrected 49,149 byte document, the unchanged default pricing content and a footer without the obsolete arrow. There were no JavaScript page errors, console errors, failed requests, HTTP errors or horizontal document overflow. Direct and refreshed geometry matched at all four widths. The eight live footer captures match the corresponding candidate saved and settled captures byte for byte.

The live check also verified all 35 protected files in Git, with 34 public HTTP responses matching their expected bytes; .nojekyll was checked in Git. All 16 fixed review files and its unchanged provenance document matched their published responses. The [live report](../qa/pricing-hydration/2026-10-20/default-footer/live-report.json.gz) records these checks and the actual environment. Four live footer images are retained permanently. An independent cloud Chrome reload and visible footer inspection also found the corrected link and no new application error; the CI report remains the reproducible primary record.

[Separate review run 39526082528](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39526082528) passed the existing review checks at 320, 390, 820 and 1440px. Its 16 review responses matched the original verified build. Its six protected responses use the new pricing baseline only for pricing/index.html and retain e9550069 for the other five. The review was not rebuilt or refreshed. [The original live review report](../qa/pricing-hydration/2026-10-20/default-footer/review-live-report.json.gz) is retained.

### Harness corrections and retained failures

The historical prepared patch had correct before and after payloads but malformed single-line diff separators and missing no-newline markers. [The valid patch](../qa/pricing-hydration/2026-10-20/default-footer/default-footer.patch) preserves those exact payloads. The first capture harness also took a full-page image while the footer remained scrolled into view. Those initial full-page images are excluded from final visual evidence; the final harness resets and measures the top position before capture.

Two initial runs did not produce a final report and ended with API conclusion cancelled near their configured twenty minute job limits. Their logs say the operation was cancelled; no manual cancellation cause is claimed. A separate diagnostic run at 420a23f then established the failing readiness stage precisely. Font loading and image decoding passed, but a page-side animation-frame wait did not complete in the JavaScript-disabled saved-document context. Its [failed report](../qa/pricing-hydration/2026-10-20/default-footer/failed-readiness-report.json.gz) is retained. The corrected harness keeps JavaScript disabled, retains font/image checks and uses host-side sampling to require three consecutive identical complete geometry measurements within the same deadline. No page CSS, application code or comparison threshold was changed to obtain a pass.

The baseline change exposed two legacy verification assertions that still compared the pricing document with e9550069. [Verification-only commit 6d8594dd](https://github.com/Storileaf/storileaf-homepage-preview/commit/6d8594dd637df666564c4475a8cbe5a2d995305b) changes only the pricing-path reference in the How it works and Physical book checks to a9e6e6c. Every other protected reference, strict byte comparison, rendering assertion and threshold remains intact. The live review workflow separately pins the exact guard and both verification-file blobs while requiring every other frontend file to match the verified 9bf8779 source. Its fixed build provenance remains unchanged. This is compatibility with the authorised static correction, not CI consolidation.

All fourteen verification workflows triggered by 6d8594dd and its Pages deployment passed at attempt 1. Source validation retained all 91 tests. The complete run list in the durable index distinguishes these final results from the publication head's thirteen passing verification workflows, three investigated failures and successful Pages deployment. The dedicated default pricing and editorial checks from 30b2b647 were not path-triggered again; their relevant runtime, inputs and harnesses are unchanged. This reuses identified evidence without claiming a fresh repeat.

The [legacy diagnostic record](../qa/pricing-hydration/2026-10-20/default-footer/legacy-diagnostics/index.json) retains both obsolete-reference failures and successful final reports. Final Media used Chrome 155.0.8059.84; final How it works used 155.0.8059.39. Their actual environments are recorded separately. The [final separate-review check](../qa/pricing-hydration/2026-10-20/default-footer/review-alignment/index.json), run 39526983741, passed on Chrome 155.0.8059.39 with all 16 review responses, six protected responses, four widths and three exact frontend verification-file pins checked.

The unrelated [Writing failure](../qa/pricing-hydration/2026-10-20/default-footer/writing-diagnostic/index.json), run 39526082594, is also retained. Two 1440px trigger hover/focus screenshots exceeded the existing pixel threshold in the device mock-ups. Both measured states, application and harness hashes, workflow, exact Chrome archive/executable and font resources matched successful P4-06 evidence. The runner image and kernel differed from that earlier checkpoint, so the whole environment was not identical and no cause was inferred. The test-only alignment commit naturally supplied one unchanged diagnostic replay after this investigation. [Run 39526983680](../qa/pricing-hydration/2026-10-20/default-footer/writing-replay/index.json) passed all 60 comparisons, including 59 full image comparisons and the existing bounded heading comparison. Both formerly failing images then had zero changed pixels. The replay's Writing inputs and browser identities matched the failed attempt, as did its runner image and kernel. No Writing runtime, test threshold or assertion changed; the failed evidence remains and permanent screenshot stability is not claimed.

The complete pricing comparison and live check apply to the generic default pricing document. Other currency entry documents, selected-book query snapshots, checkout, payments, other browser engines, physical devices and wider P4-08 acceptance are outside this correction. P4-06 retains its existing practice-only native zoom evidence. Actual screen reader acceptance remains scheduled for the final whole website review under Workflow.

## Historical investigation and immutable checkpoints

The following investigation was completed on 19 October 2026 during the authorised shared header, newsletter, footer and navigation migration. At that checkpoint all three saved-document defects remained unresolved and no pricing runtime change was authorised. The separate default-footer correction above supersedes that status only for the generic pricing footer.

The public source checkpoint is [e4458092ae64749350ac1339c97ac7f83c9ce65c](https://github.com/Storileaf/storileaf-homepage-preview/commit/e4458092ae64749350ac1339c97ac7f83c9ce65c). At that checkpoint, the protected published baseline was [e9550069d91b5a9b48ade43fcfb0a71bbed2875b](https://github.com/Storileaf/storileaf-homepage-preview/commit/e9550069d91b5a9b48ade43fcfb0a71bbed2875b). The inspected homepage, pricing HTML and compiled runtime are unchanged between those checkpoints. Private production code and product terms were not changed or redefined by this investigation.

[React describes error 418](https://react.dev/errors/418) as a mismatch between saved server HTML and the first client render. React can recover by rebuilding the affected tree. The [hydration reference](https://react.dev/reference/react-dom/client/hydrateRoot) requires those initial outputs to agree and treats mismatches as bugs. Successful recovery does not make the saved export correct.

## Historical reproduced entry paths

The following are paths beneath [the published preview](https://storileaf.github.io/storileaf-homepage-preview/).

| Entry path | HTTP response | Observed result |
| --- | --- | --- |
| Homepage root | 200, homepage HTML | Direct load and reload have no React page error |
| `pricing/` | 200, pricing HTML | Direct load and reload report React 418 with a text mismatch, then show the pricing screen |
| `pricing/inr` | 404, homepage fallback HTML | Direct load and reload report React 418 with an HTML mismatch, then show INR pricing |
| `pricing/usd` | 404, homepage fallback HTML | Direct load and reload report React 418 with an HTML mismatch, then show USD pricing |
| `pricing/cad` | 404, homepage fallback HTML | Direct load and reload report React 418 with an HTML mismatch, then show CAD pricing |
| `pricing/gbp` | 404, homepage fallback HTML | Direct load and reload report React 418 with an HTML mismatch, then show GBP pricing |
| `pricing/?keepsake=travel-memoir` | 200, default pricing HTML | Direct load and reload report React 418 with a text mismatch, then show the selected book |

These are three distinct saved document problems. They must not be reduced to a single currency preference issue.

## Default pricing footer mismatch

The protected [pricing HTML](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/pricing/index.html) retains an arrow span after Get in touch in the footer legal row. The protected [compiled shared Footer](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/assets/content-sections-CfrmOVRI.js) renders only Get in touch. The [homepage HTML](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/index.html) already contains the approved version without an arrow.

A diagnostic capture at React's mismatch function identified that exact anchor. Its component ancestry includes Footer, PricingPage and PricingDefault. The saved anchor contains `Get in touch <span aria-hidden="true">↗</span>`, while the client text is `Get in touch`.

In a separate diagnostic browser context, only that stale span was removed from the HTML response. The default `pricing/` route then loaded without React 418. No repository file or deployed response was changed. This isolates the default route's warning without claiming a released fix.

## Currency paths receive a homepage snapshot

The protected repository exports only `pricing/index.html`. It has no static directory document for any of the four currency paths. GitHub Pages therefore serves [404.html](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/404.html), whose body and saved router state describe the homepage.

The compiled [regional pricing route](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/assets/pricing._currency-D7ELIB-1.js) reads the requested currency and renders PricingPage. The diagnostic capture confirms React encounters `#top[data-testid="storileaf-home"]` when it expects the pricing route. All four unmodified direct responses have the homepage HTML hash and return HTTP 404, even though JavaScript subsequently recovers to usable pricing.

Changing a shared link to another spelling of the same missing path would not repair this document mismatch. Suppressing the warning would not change the response status or saved content.

## A selected book also changes the first render

The protected [default pricing route](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/assets/pricing.index-DWapM0Qb.js) reads the keepsake query. The saved pricing HTML contains the default Life Story view.

For `pricing/?keepsake=travel-memoir`, the diagnostic capture identifies `.pricing-mini-label` as the first text mismatch. The saved view contains three packages to compare, while the URL selected client view contains two. The saved next heading is Life Story. This observation identifies mismatched views and does not constitute a new approval or verification of package inclusions.

Removing the stale footer arrow in a response only experiment does not eliminate this selected book warning. A complete correction needs an initial rendering strategy for query selected books as well as consistent currency documents.

## Existing currency and navigation contract

The protected [homepage component](https://github.com/Storileaf/storileaf-homepage-preview/blob/e9550069d91b5a9b48ade43fcfb0a71bbed2875b/assets/routes-DrwDv2x2.js) starts with INR, restores a valid value from `storileaf.preview.currency` after mounting and stores selector changes. The regional and default pricing route modules above govern pricing selection.

| Behaviour | Verified contract |
| --- | --- |
| Saved homepage currency | USD, CAD and GBP are restored; invalid or blocked storage falls back to INR without a React page error |
| Generic pricing with saved USD | Remains INR |
| Explicit CAD route with saved USD | Displays CAD |
| Header, mobile menu and footer Pricing links | Use the selected currency path and clear the keepsake query |
| Homepage FAQ pricing links | Retain the existing generic pricing destination |
| Pricing currency selector | Stores the new currency and preserves the selected book |
| Pricing book selection | Preserves currency |
| Return to homepage | Existing section anchors and saved currency continue to work |

A live client navigation sequence selected GBP on the homepage, entered pricing, changed to CAD, selected Travel Memoir, cleared the keepsake through the shared Pricing link, returned to Common questions and reloaded the homepage. It completed without React page errors. Both pricing selectors and shared links reflected the expected currency. The CAD preference survived the return and reload.

The browser document was preserved during client navigation. Only the initial homepage requested a new document before that return flow. This distinguishes healthy client navigation from the separately reproduced direct load and reload defects. It does not remove the need to support shared, bookmarked or refreshed pricing URLs.

The source checkpoint's App held currency only in React memory. The authorised shared component migration can reproduce the storage contract and correct homepage section link semantics in isolated source. That source work cannot establish that the protected pricing export is hydration clean.

## Evidence and test limits

Chrome 155.0.8059.39 ran the live checks at a 1440 by 1000 viewport with reduced motion. Direct loading and reloading of the homepage, default pricing and all four currencies completed at 18:31:31 UTC. The storage and client flow collection completed at 18:33:42 UTC. The selected book diagnosis completed at 18:34:40 UTC. All times are on 19 October 2026.

The direct collection records twelve unmodified loads or reloads and two separately labelled diagnostic captures. The storage and client collection records seven storage observations, seven client flow states and two response only experiments. The selected book collection records direct, reload and diagnostic observations. Browser runtime errors, response status, final route, selected currencies, shared links and document continuity were captured.

The diagnostic JavaScript adds observation at React's mismatch function without changing its recovery or rendering behaviour. Its input was checked against the served compiled bundle before instrumentation. The footer experiment changes one HTML response only. Neither experiment is an unmodified parity test or a deployed fix.

| Served input | SHA256 |
| --- | --- |
| Homepage and currency fallback HTML | `76e803f92a7621bc46cb5807b743516b773af1c73e1b01f5c487d6438e49ea81` |
| Pricing HTML | `9c1b86e5fec16b7b26904b81032b62573f312d8fbde98b5ee150b9f860ce6d14` |
| Main compiled JavaScript | `07748aee103f4f4bc55a9b0479941b858c44ff62bfa835eeebad8f963f5b36a7` |
| Default pricing HTML with only the diagnostic footer correction | `1f2477abf7a8ad451228d0f25cb1a8516dcd322aae57dec261e8f0c18ce75f89` |

The dated raw records are preserved in the repository as [direct loading and mismatch captures](../qa/pricing-hydration/2026-10-19/direct-report.json), [storage, client flow and response only experiments](../qa/pricing-hydration/2026-10-19/flow-report.json) and [selected book diagnosis](../qa/pricing-hydration/2026-10-19/query-report.json). They retain public browser observations, errors, routes and protected input hashes. Future work can use these records without archived chat attachments or temporary files. No Actions run is represented here as having executed these diagnostic experiments.

An initial flow probe addressed a tab role, while pricing uses buttons with aria-pressed. The corrected probe used the actual pricing book test ID and passed. This was a harness correction, with no application change. An initial diagnostic network fetch failed before instrumentation and was replaced by a browser fetch that verified the served bundle hash.

These checks do not certify other browser engines, physical devices, native zoom, complete visual parity, checkout, payments or customer application behaviour. Recovery to the expected pricing screen is not a claim that the whole preview is error free.

## Remaining bounded work and retained proposal

The historical [default footer proposal](../qa/pricing-hydration/2026-10-19/default-footer-proposal.patch) is retained. Its before and after payloads match the authorised correction, but its single-line diff lacked the required separators and no-newline markers. The new verification records retain a valid patch generated from those exact bytes. No broader export change is included.

1. The default footer correction is handled by the separately authorised checkpoint above. Its complete footer, retained pricing geometry, direct load and reload evidence does not close the following two problems.
2. Propose a static export or route entry strategy for all four currency paths. Preserve current URLs, prices, package text, storage and client behaviour while returning the correct initial document. Root homepage replacement is not authorised by this work.
3. Propose how keepsake query selection becomes consistent with the saved initial render. Test every supported book, currency selection, direct entry, reload, client navigation and history. The default footer correction alone does not close this item.

The two remaining repairs require their own concrete proposal and explicit founder approval before protected pricing or route-document edits. Keep the [frontend workflow](WORKFLOW.md), content gate and separate React cutover boundary in force. P4-08 wider verification and final whole website screen reader acceptance remain separate.
