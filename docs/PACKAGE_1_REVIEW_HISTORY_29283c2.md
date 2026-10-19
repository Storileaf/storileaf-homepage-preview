# Package 1 review

18 October 2026. Source corrections and state audit, not final visual approval.

The [Public Design System](PUBLIC_DESIGN_SYSTEM.md) remains the public website style authority. This record documents bounded source work, evidence and unresolved review items. It is not a second design system.

## Current follow-up status

The founder authorised the two pending source corrections after the initial review. Commit 7c3540ef2df41b592ea03457d7f18570287107a1 changes the mobile source header action from 43px to 45px, matching the published action height, and makes the resource link focus outline inherit the responsive card radius. It makes no changes to published HTML, compiled assets, photographs, pricing, copy or destinations. All radius token values remain unchanged.

The [source workflow and Chromium review](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39184028017) and [Pages deployment](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39184026937) passed for that source commit. The shape report recorded no problems across all nine required widths. At 390px and 430px, the header action changes from 43px to 45px while other measured styles remain unchanged. The wider source action remains 46px high. Focus corners change from 20px to 17px on small screens and remain 20px on wider screens. The 3px focus outline and its existing 5px inset are retained.

Before and after screenshots and state measurements are attached to the source workflow as browser QA artifacts. The realistic focus context screenshots include the sticky header. A supplementary capture check centres the card beneath the header and verifies that it is unobscured before recording clean mobile and desktop component images. Those captures do not hide the header or change the page styling.

The two authorised source corrections are implemented. The interaction-state audit is recorded below. Radius unification and new visible state styling remain proposals requiring approval. This is not completion or founder acceptance of the entire public design system, full accessibility review or React homepage migration.

## Why the current radii differ

The 6px ordinary action and 9px header/newsletter values were inherited from the existing implementation. Initial Package 1 work retained them to protect the approved homepage. Their preservation should not be described as proof that different button radii are necessary or an approved hierarchy. Header placement, prominence and gold colouring do not themselves require different corners.

Proposed next design decision is one 6px radius for rectangular public buttons, including header and gold actions, and the paired newsletter input. Keep existing heights, padding, wording, colours and destinations. This retains the ordinary action baseline and removes exceptions. A uniform 9px family is another coherent option but would change ordinary buttons across the homepage. Neither option is approved by a question about the inconsistency. Do not silently change live or source tokens. Cards, media, panels and circular controls remain separate shape families.

## Recorded action-state audit

The browser audit exercised normal, hover, keyboard focus and pointer-held states in the actual source header and newsletter action. Test-only markup exercised the four ActionLink CSS variants. It did not follow external links or submit a form. The markup probes are QA fixtures, not new public copy or evidence of new product functionality.

The header explicitly changes from #0c6753 to #0b5848 on hover. The newsletter action changes from #d7b67e to #e9cb93. Their pointer-held appearances match hover. Ordinary primary, outline, gold and text ActionLink variants currently have no equivalent explicit hover or pressed styling. Keyboard focus was present in the tested interactive controls.

The outline ActionLink probe exposed an existing omission. Its normal text falls back to browser blue because the variant does not specify a colour. Proposed correction is explicit forest #253526. It was not silently added to the two authorised stylesheet corrections.

ActionLink currently exposes no disabled or loading API. An unbuilt destination renders a non-interactive span, not a disabled working link. Do not fabricate loading states or imply that the preview newsletter sends subscriptions. A future real asynchronous action needs its own behaviour, accessible status and content approval.

Proposed state direction is to retain normal geometry, give primary actions the existing header hover treatment, give gold actions the existing newsletter hover treatment, give outlined actions explicit forest text, and preserve independently visible keyboard focus. Review exact outline/text hover treatments on light and dark surfaces before implementing them. Retain readable explicit colours rather than reducing whole-control opacity. New styles remain unapproved and are not in source CSS.

## Initial authorised scope and implementation

The founder first asked to begin Package 1 after reviewing the published header action at 9px, ordinary actions at 6px, newsletter controls at 9px and the experimental React header at 8px. The initial scope aligned the React header to the existing 9px baseline and named existing shape values without changing layout, content, destinations, images or other interactions.

The editable stylesheet uses explicit shape tokens rather than scattered literal corner values. The initial React header action correction was 8px to 9px. Every other token substitution preserved its former computed value.

Retained source roles are ordinary actions 6px, header action 9px, paired newsletter controls 9px, resource cards 20px or 17px on small screens, media 18px, principal panels 22px, header shell 18px or 13px on small screens, menu surface 17px, inset controls 8px, dialog close control 9px and currency control 5px.

The experimental gold ActionLink retains 9px under its own token rather than borrowing the newsletter token. This is not approval for all gold buttons to have a different shape. Its final reusable API and visual parity remain subject to review.

Values live in frontend/src/styles/tokens.css. The compiled homepage, pricing files, cover assets and gallery assets remain protected. Source navigation and dialog control radii are retained references, not proof of parity with the published Radix navigation. Circular markers and specialised homepage panels must be measured from the published sections when migrated.

## Verification boundaries

The read-only source workflow runs type, content, component, protected-root and Chromium checks. Shape review measures both source and published pages at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. It compares selected source geometry and styles before and after the two corrections, tests keyboard focus and records screenshots.

The follow-up source comparison uses commit a80e7dfd0b5fa18acdfabe34c54ab75492e026da. Its temporary stylesheet guard permits exactly the authorised height and focus-radius substitutions. The radius token file must remain unchanged. A later approved styling package must deliberately update this temporary guard. It is not a permanent ban on maintainable source development.

Published-root protection is not relaxed. Reports and screenshots are CI artifacts under frontend/qa, not published replacement pages. Passing checks do not grant founder visual approval or constitute full accessibility certification, physical-device testing, real browser zoom testing or complete homepage parity.

## Verified initial result

Initial source commit f6620afef201100ff2bf6cc95b7ccd37b2e91765 passed [source validation and Chromium review](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39182164897). Type checking, approved content, protected-root validation, all nine foundation tests, isolated build, navigation and shared footer checks completed successfully. The shape report recorded no problems at the nine required widths. [GitHub Pages deployment](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39182164804) completed successfully and served the unchanged static homepage.

The source desktop header action measured 171.28125px wide by 46px high before and after the initial correction. Its radius changed from 8px to 9px; size, typography and colours remained identical. Other selected controls retained their measured styles. Primary, outline and gold test variants measured 6px, 6px and 9px respectively.

Initial screenshots are in [browser QA artifact 12156397153](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39182164897/artifacts/12156397153). This initial evidence is retained as history, not full homepage parity.

## Macaly independence review

The public workflow no longer imports or builds from the former Macaly project. The initial dependency audit scanned 31 shipped or editable runtime/configuration files, including published HTML, JavaScript and CSS, source files, package manifests and the lockfile. It found no Macaly references or former project identifier in those files.

During that read-only Chromium check, Macaly hosts and the old project identifier were blocked. Neither the protected static homepage nor isolated React source attempted a Macaly request. Observed external hosts were storileaf.com, fonts.googleapis.com and fonts.gstatic.com. The pages showed no recorded runtime errors or missing images after scrolling and exercising the six published book tabs. No external destination or form submission was invoked.

This is evidence for the tested public preview and source states, not an unconditional deletion guarantee. Macaly account settings, original source exports, project-only uploads, domains and possible external integrations were not inspected. The complete editable React homepage is still unfinished. Preserve the old project source and unique assets before deletion. Runtime independence does not establish that every useful project file or history item has been archived elsewhere. Historical documentation mentions are not runtime dependencies.

The production platform was not modified for this audit.
