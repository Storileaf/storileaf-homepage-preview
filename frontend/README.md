# Editable public website source

The new StoriLeaf public website source is Vite + React + TypeScript. It is independent of Macaly and has no private customer or backend code.

## Current state

This folder builds the staged React homepage. Packages 1 and 2 provide its completed foundations. Package 3 Groups 1 and 2 implement Gifting, Resources, the reassurance band, native FAQs and final invitation. Group 3 implements the shared header, newsletter, footer, navigation and currency behaviour with verified rendered comparisons. Group 4 adds six book discovery and its local Books navigation; its current verification status is in the [Group 4 review](../docs/PACKAGE_3_GROUP_4_REVIEW.md).

This is **not yet the full editable source of the published homepage**. The existing root index.html, 404.html and bundled assets remain the founder-approved visual baseline. The root is protected by scripts/guard-published.mjs, pinned to the last approved static release commit. Source output stays within dist and is not deployed to the Pages root.

## Local development

Use Node 22.

    npm ci
    npm run dev
    npm run check
    npm run build
    npm run preview

The source validation GitHub Action runs typechecking, the content approval and destination gate, protected-root comparison, component tests and a Vite build. It uses the committed lockfile, read-only repository permissions and attaches the built component reference as an artifact.

## Files

- src/styles/foundations.css defines the canonical public typography roles, spacing and container rules. tokens.css defines identity and shape tokens.
- src/styles/components.css and the scoped homepage styles retain the published component and section treatments without touching published CSS.
- src/components contains reusable headings, text, layout, actions, images and the shared SiteHeader and NewsletterFooter. src/sections composes the migrated homepage sections.
- src/usePreviewCurrency.ts and src/siteRoutes.ts preserve the shared currency and explicit local anchor contracts.
- content/ledger.json records exact approved strings, source and whether actions point to real pages.
- content/images.json records retained image sources, alternative text, declared dimensions and crops.
- scripts/check-content.mjs validates copy provenance, approval states, source ID references and verified HTTPS destinations; unknown or unbuilt destinations cannot silently be linked.
- scripts/guard-published.mjs prevents accidental overwriting of existing root static assets.
- The bounded inherited-content validators retain exact protected copy for each authorised migration group without inventing original approval dates.

Read [current public design system](../docs/PUBLIC_DESIGN_SYSTEM.md), [content gate](../docs/CONTENT_GATE.md), and [workflow](../docs/WORKFLOW.md).

## Remaining migration work

The remaining section groups are the six image gallery and lightbox, physical book slideshow, How it works, hero motion, writing demonstration and unsaved practice dialog. Each needs its own rendered and functional checkpoint before complete page assembly and Package 4 quality gates. Recreate the actual approved published wording, imagery and interactions. Obtain approval for each next group before editing it.

Require source build, full browser interaction parity, keyboard/touch/reduced-motion tests and side-by-side screenshots at nine responsive widths before proposing any deployment cutover. The founder will approve that switch separately.

Rendered comparisons load the real Newsreader and Manrope fonts and the original images. Fallback font rendering cannot establish visual parity. Section evidence remains distinct from founder rendered acceptance.

## Shared component staging

The shared header, newsletter and footer reproduce the approved visual composition with explicit routes and currency state. Source navigation uses local fragments only for actual uniquely rendered targets, including Books in Group 4. Other destinations retain their published URLs. Native section links omit incorrect current page semantics. Newsletter integration remains deferred.

The separate [pricing investigation](../docs/PRICING_HYDRATION_REVIEW.md) records three unresolved protected export defects. This source migration does not repair or replace pricing. Existing Gifting and shared text enlargement findings also require separately proposed visible corrections.

## Source-only browser QA

Dedicated [Group 1](../docs/PACKAGE_3_GROUP_1_REVIEW.md), [Group 2](../docs/PACKAGE_3_GROUP_2_REVIEW.md), [Group 3](../docs/PACKAGE_3_GROUP_3_REVIEW.md) and [Group 4](../docs/PACKAGE_3_GROUP_4_REVIEW.md) gates compare the served static baseline with the isolated production build. Their reports cover the required nine widths plus a 600px intermediate check, relevant keyboard and pointer states, emulated touch, reduced motion, short screens, image readiness and targeted text enlargement.

The discovery workflow retains source validation, the complete static homepage regression, Packages 1 and 2, editorial/footer typography and all earlier migration gates. It uploads comparison reports, screenshots and the isolated build with read only permissions and no automatic commits. Complete native zoom, other browser engines, physical devices and accessibility certification are not established by these Chromium tests. The root remains protected and incomplete React is not published.
