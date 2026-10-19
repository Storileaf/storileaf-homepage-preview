# Package 1 review

18 October 2026. Initial source consolidation, not final visual approval.

The [Public Design System](PUBLIC_DESIGN_SYSTEM.md) remains the public website style authority. This record documents the bounded source work and unresolved review items. It is not a second design system.

## Authorised scope

The founder asked to begin Package 1 after reviewing the published header action at 9px, ordinary actions at 6px, newsletter controls at 9px and the experimental React header at 8px. Preserve the published homepage. Align the React header to the existing 9px baseline and name existing shape values without changing layout, content, destinations, images or other interactions.

## Source changes

The editable stylesheet now uses explicit shape tokens rather than scattered literal corner values. The React header action changes from 8px to 9px. Every other replacement preserves its former computed value.

Retained source roles are ordinary actions 6px, header action 9px, paired newsletter controls 9px, resource cards 20px or 17px on small screens, media 18px, principal panels 22px, header shell 18px or 13px on small screens, menu surface 17px, inset controls 8px, dialog close control 9px and currency control 5px.

The existing experimental gold ActionLink variant retains 9px under its own token, rather than borrowing the newsletter token. This is not approval for every gold button on future pages to have a different shape from ordinary actions. Its final reusable API and visual parity still require review.

All implementation values are in frontend/src/styles/tokens.css. Existing colour, typography, padding, dimensions and responsive breakpoints are unchanged. The compiled homepage, pricing files, cover assets and gallery assets remain protected.

## Button and state review boundaries

Retain 6px for ordinary filled and outlined actions. Keep the current header action and newsletter pair at 9px during migration. Do not introduce universal pill buttons or a global 9px replacement.

Use genuine links for navigation and genuine buttons for in-page actions. Unbuilt destinations remain explicitly unbuilt. This package does not turn a preview newsletter treatment into a subscription service.

Preserve existing hover and focus behaviour in this initial change. Full state consolidation remains open. Review normal, hover, focus, pressed, disabled and loading states in context before implementing new rules. Do not reduce whole-control opacity or add loading states to static content merely to complete a style catalogue.

## Findings requiring separate review

The experimental mobile header action measures 43px high at 390px and 430px widths. The published action measures 45px at the same widths. The public design target is at least 44px for principal touch targets. Proposed next correction is to reproduce the actual 45px published target, rather than invent a 44px compromise. Compare the complete header before changing it. The initial radius correction does not alter height, font size or padding.

The experimental resource card has a 17px small-screen corner while its focused link still references the 20px desktop card radius. Propose a shared responsive card/focus radius, with before/after focus screenshots. Do not silently change this state in the initial source alignment.

Ordinary ActionLink variants lack a complete explicit hover, pressed, disabled and loading specification. Existing source references are not evidence that these states have been approved or that the homepage is fully migrated.

The source navigation and dialog control radii are preserved references, not automatic proof of parity with the published Radix navigation. Circular markers and specialised homepage panels must be measured from the actual published sections when migrated.

## Verification

The read-only source workflow runs existing type, content, component, protected-root and Chromium checks. The new shape review measures both source and published pages at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. It compares selected source control geometry before and after the stylesheet substitutions and records real desktop and mobile screenshots.

A temporary narrow-change check permits only the reviewed corner substitutions against commit 1433a413917a63df47e05f5c2d39283689624f37. When a later styling package is separately authorised, replace this temporary edit whitelist with the relevant reviewed semantic checks. Do not treat it as a permanent prohibition on maintainable source development.

Reports and screenshots are CI artifacts under frontend/qa/shape-foundation. They are not deployed to the published homepage. A passing check is not founder visual approval or full accessibility certification.

## Verified initial result

Source commit f6620afef201100ff2bf6cc95b7ccd37b2e91765 passed [source validation and Chromium review](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39182164897). Type checking, approved content, protected-root validation, all nine foundation tests, isolated build, navigation and shared footer checks completed successfully. The shape report recorded no problems at the nine required widths. [GitHub Pages deployment](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39182164804) completed successfully and continued to serve the unchanged static homepage.

The source header measured 171.28125px wide by 46px high on desktop before and after the change. Its radius changed from 8px to 9px; the measured size, typography and colours remained identical. Other selected controls retained their measured styles. Source primary/outline/gold test variants measured 6px, 6px and 9px respectively.

Actual desktop and mobile screenshots are in [browser QA artifact 12156397153](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39182164897/artifacts/12156397153). This evidence is not full homepage parity. The broader Package 1 interaction-state review remains open.

## Macaly independence review

The public workflow no longer imports or builds from the former Macaly project. The source dependency audit scanned 31 shipped or editable runtime/configuration files, including published HTML, JavaScript and CSS, source files, package manifests and the lockfile. It found no Macaly references or former project identifier in those files.

During the read-only Chromium check, Macaly hosts and the old project identifier were blocked. Neither the protected static homepage nor isolated React source attempted a Macaly request. Observed external hosts were storileaf.com, fonts.googleapis.com and fonts.gstatic.com. The pages showed no recorded runtime errors or missing images after scrolling and exercising the six published book tabs. No external destination or form submission was invoked.

This establishes evidence for the tested public preview and isolated source states, not an unconditional guarantee about deleting an external project. Macaly account settings, original source exports, project-only uploads, domains and possible external integrations were not inspected. The complete editable React homepage is still unfinished. Preserve the old project source and any unique assets before deletion. Runtime independence does not establish that every useful project file or history item has already been archived elsewhere. Historical documentation mentions are not runtime dependencies.

The production platform is a separate system and was not modified for this audit.
