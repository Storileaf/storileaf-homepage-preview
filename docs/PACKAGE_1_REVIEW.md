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

The experimental mobile header action has a 43px minimum height at narrow widths. The public design target is at least 44px for principal touch targets. Propose 44px and compare the header before changing it. Do not change it in the corner-radius correction.

The experimental resource card has a 17px small-screen corner while its focused link still references the 20px desktop card radius. Propose a shared responsive card/focus radius, with before/after focus screenshots. Do not silently change this state in the initial source alignment.

Ordinary ActionLink variants lack a complete explicit hover, pressed, disabled and loading specification. Existing source references are not evidence that these states have been approved or that the homepage is fully migrated.

The source navigation and dialog control radii are preserved references, not automatic proof of parity with the published Radix navigation. Circular markers and specialised homepage panels must be measured from the actual published sections when migrated.

## Verification

The read-only source workflow runs existing type, content, component, protected-root and Chromium checks. The new shape review measures both source and published pages at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. It compares selected source control geometry before and after the stylesheet substitutions and records real desktop and mobile screenshots.

A temporary narrow-change check permits only the reviewed corner substitutions against commit 1433a413917a63df47e05f5c2d39283689624f37. When a later styling package is separately authorised, replace this temporary edit whitelist with the relevant reviewed semantic checks. Do not treat it as a permanent prohibition on maintainable source development.

Reports and screenshots are CI artifacts under frontend/qa/shape-foundation. They are not deployed to the published homepage. A passing check is not founder visual approval or full accessibility certification. Check the actual workflow result before claiming this package has passed.

## Macaly independence review

The public workflow no longer imports or builds from the former Macaly project. The source dependency audit scans shipped HTML, JavaScript and CSS, editable source, package manifests and the lockfile. Browser checks block hosts containing Macaly and the old project identifier, then record requested hosts, errors and missing images while visiting the page and available tabs.

This can establish evidence about the current public preview and isolated source. It does not inspect Macaly account settings, prove that original project files have been archived, or authorise deletion of an external project, domain or data. Historical mentions in documentation are not runtime dependencies. The production platform is a separate system and must not be modified for this audit.
