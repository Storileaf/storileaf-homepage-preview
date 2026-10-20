# Package 4 assembled homepage quality audit and repair decisions

20 October 2026. **Audit findings recorded. Repair and release gates remain open.** This review continues the completed Package 3 Group 8 checkpoint; it does not claim further rendered parity, founder acceptance or React publication.

## Authority and evidence

Protected static reference `e9550069d91b5a9b48ade43fcfb0a71bbed2875b`. Public working branch `main`, with editable source only under `frontend/`. The existing [Group 8 review](PACKAGE_3_GROUP_8_REVIEW.md), [retained verification index](../qa/homepage-assembly/2026-10-20/committed-verification.json), [pricing diagnosis](PRICING_HYDRATION_REVIEW.md) and preceding group reviews own primary measurements and original diagnostic records. The [Public Design System](PUBLIC_DESIGN_SYSTEM.md) remains the sole style authority.

The successful retained assembly workflow [39427950061](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39427950061) used Chromium 155.0.8059.84, ten widths (320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440), 14 states, 292 captures and ten passing combined journeys. The [Writing workflow](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39427950086) and [source verification](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39427950216) passed, including 75 source tests. These are **Package 3 evidence**, reused with explicitly stated identity and environment limits, not newly executed Package 4 comparisons.

An additional connected browser inspection of the **published static** homepage verified at desktop width that menus open and Escape restores focus, See inside anchors reach the gallery, the lightbox opens and Escape restores focus, the four-image physical presentation switches, and the practice modal accepts an answer with live word counting. The practice dialog description target was missing in that inspected DOM. Localhost React preview access was unavailable through that browser, so this inspection is **not** a new direct React-versus-static paired capture. A Ctrl-plus attempt did not establish a changed browser zoom level. Browser internal pages were blocked; no further access was attempted.

## Existing implementation and quality observations

The isolated React source preserves the approved full-page order and the published root has not been replaced. The evidence supports strong Chromium parity at the recorded widths and states. It does **not** establish that inherited defects are acceptable or fixed.

| ID | Finding and reproduction boundary | Disposition | Proposed narrow repair and acceptance test |
| --- | --- | --- | --- |
| P4-01 | Gifting text/action edge clipping at 320px under targeted 200% text enlargement, inherited in both baseline and React | Open, moderate usability risk | Adjust local wrapping, spacing or intrinsic sizing without changing wording or approved normal-size composition. Compare 320/360/390 and adjacent widths at normal and doubled text, keyboard focus and full section join. |
| P4-02 | Footer navigation labels and currency controls at 320px enlargement; desktop navigation overflow at 1440px enlargement | Open, high navigation risk | Permit robust wrap/reflow at the actual failing breakpoint, preserve desktop/mobile navigation hierarchy and currency behaviour. Test open menus, menu escape/focus, labels, link targets and both reduced/normal motion. |
| P4-03 | Discovery tab labels for Relationship Memoir and Celebrating Occasions overflow at 320px and 1440px with targeted enlargement | Open, moderate navigation risk | Improve tab label reflow without renaming books, clipping focus indicators or changing selection mechanics. Test all six tabs, keyboard movement, actions and expanded labels. |
| P4-04 | First and third hero progression labels clip at 320px with targeted enlargement | Open, moderate orientation risk | Repair the progression-label container or responsive text wrapping only. Recheck ticker, carousel, cover motion, controls and reduced motion before treating the visual change as accepted. |
| P4-05 | PracticeDialog dialog-level `aria-describedby` points at a nonexistent generated target; textarea correctly references `demo-privacy` | Open, accessibility defect | Give the dialog an actual, stable description node and a matching reference, or remove only the invalid reference if there is genuinely no description to expose. Test accessibility tree and both keyboard and screen-reader announcement before closure. |
| P4-06 | Enlarged practice heading intrudes 10.484375px beyond its content box into existing padding at 320px; inspected glyphs remained visible | Monitor, not proven clipping | Test native 200% browser zoom and increased text spacing. Change only if real clipping, overlap or reading-order problem occurs. |
| P4-07 | Pricing default direct entry hydrates with stale Get in touch arrow; four direct currency routes serve 404 homepage fallback; selected book query initial snapshot differs from client | Open, separate protected static export defects | Use the three scoped proposals in [pricing diagnosis](PRICING_HYDRATION_REVIEW.md). Do not change published HTML, route documents, product packages or guard baseline under a homepage React migration. |
| P4-08 | Wider browser and assistive technology evidence not obtained | Open verification gate | Run actual native zoom, text spacing, screen readers, Firefox/WebKit and physical touch devices. Record OS, build, device, steps and outcomes individually; do not convert emulation into a device certification. |

### Proposed repair sequence and boundaries

**First**, address P4-05 as a narrowly scoped React accessibility fix, followed by P4-01 through P4-04 as one deliberate inherited reflow batch in the editable source. For every affected source component, retain normal-size geometry and interaction parity. Baseline defects may legitimately improve in the future source, but record the approved difference rather than disguising it as pixel parity. Do **not** silently modify the published static site; whether identical repairs are needed there is a separate decision.

**Second**, inspect P4-06 under real zoom and decide whether action is warranted. **Third**, treat all three pricing issues as a separate protected-export proposal with its own direct-load, response-code, hydration, currency, keepsake-selection and history tests. The existing default-footer patch repairs only its own root cause.

**Fourth**, independently verify coverage and release readiness. Capture each target width at relevant section joins; run 320px short-screen and landscape conditions, native text/zoom, image decode and lazy loading, normal/reduced motion, scroll anchoring and pinning, Back/Forward and focus restoration. Document the exact browser/OS. Source tests and existing Chromium runs are not replacements for these missing checks.

## CI consolidation proposal, not yet implemented

The current package uses several overlapping validation and parity workflows. Before the first new public page, map jobs by test command, source/ref, inputs, browser and artifacts. Retain one authoritative source/content/types/build/protection validation per candidate and a separate relevant visual suite with stable source identity. Reuse build artifacts only when their hashes and configuration match. Keep failure artifacts, avoid unnecessary full-page reruns during focused iteration, and preserve width/state, environment and guard assertions. Measure baseline durations and flakiness first; do not claim an efficiency improvement without comparable runs. Do not delete a job solely because its title resembles another.

## Decision register

- **No new aesthetic design request**. The published homepage remains the approved visual reference; copy, imagery, section order, destinations and motion settings remain protected.
- **Proposed, not implemented**. P4-01 through P4-05 and the pricing repairs have not received a distinct visual/protected-static repair approval in this record. The instruction to complete the audit does not authorise rewriting the protected published export or silently altering approved appearance.
- **Not verified**. Native zoom, multiple engines, screen-reader behaviour and physical device validation remain explicit gaps. A final Package 4 quality clearance cannot truthfully be recorded.
- **Not published**. `frontend/dist` remains an isolated build; the root static export remains the site served by GitHub Pages. The guard must remain active and anchored to the original baseline. React cutover requires rendered founder acceptance and an **independent explicit publication decision**.

## Next acceptance evidence

For the authorised repair candidate, record code commit, affected selectors, before/after screenshots and measurable geometry, all ten width comparisons plus affected additional breakpoints, focused input and keyboard journeys, failure diagnostics, passing source and guard checks, and exact browser/device coverage. Update this review and the current handoff without duplicating primary machine evidence. No acceptance date is implied by this audit.
