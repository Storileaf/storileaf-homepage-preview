# Pricing hydration investigation

## Status and immutable checkpoints

Investigated on 19 October 2026 during the authorised shared header, newsletter, footer and navigation migration. The warning is diagnosed and remains unresolved in the protected static export. This record does not approve or implement a pricing runtime change.

The public source checkpoint is [e4458092ae64749350ac1339c97ac7f83c9ce65c](https://github.com/Storileaf/storileaf-homepage-preview/commit/e4458092ae64749350ac1339c97ac7f83c9ce65c). The protected published baseline remains [e9550069d91b5a9b48ade43fcfb0a71bbed2875b](https://github.com/Storileaf/storileaf-homepage-preview/commit/e9550069d91b5a9b48ade43fcfb0a71bbed2875b). The inspected homepage, pricing HTML and compiled runtime are unchanged between those checkpoints. Private production code and product terms were not changed or redefined by this investigation.

[React describes error 418](https://react.dev/errors/418) as a mismatch between saved server HTML and the first client render. React can recover by rebuilding the affected tree. The [hydration reference](https://react.dev/reference/react-dom/client/hydrateRoot) requires those initial outputs to agree and treats mismatches as bugs. Successful recovery does not make the saved export correct.

## Reproduced entry paths

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

## Bounded next steps requiring a proposal

A concrete [default footer correction patch](../qa/pricing-hydration/2026-10-19/default-footer-proposal.patch) is prepared for review. It removes only the stale arrow span from the saved pricing HTML and is deliberately not applied. The response only experiment above supplies the diagnostic evidence. This patch does not repair currency entry documents or query selected views, and would require the separately approved validation and baseline update below before publication.

1. Propose the one span default pricing HTML correction as an isolated static bug fix. Its expected settled appearance is the existing approved footer without an arrow. Verify direct loading and reloading, the complete footer and retained pricing geometry before a deliberate protected baseline update.
2. Propose a static export or route entry strategy for all four currency paths. It must preserve current URLs, prices, package text and client behaviour while returning the correct initial document. A published React homepage replacement is not a prerequisite or authorised shortcut.
3. Propose how keepsake query selection becomes consistent with the saved initial render. Test every supported book, currency selection, direct entry, reload, client navigation and history. The default footer correction alone does not close this item.

No protected pricing change, guard modification or baseline repin belongs to the current shared reference migration. Present a concrete bounded proposal and obtain explicit founder approval before those publication changes. Keep the [frontend workflow](WORKFLOW.md), content gate and separate React cutover boundary in force.
