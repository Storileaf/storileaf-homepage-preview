# Editable public website source

The new StoriLeaf public website source is Vite + React + TypeScript. It is independent of Macaly and has no private customer or backend code.

## Current state

This folder builds the staged React homepage. Packages 1 and 2 provide its completed foundations. Package 3 Groups 1 through 6 have recorded implementation and browser verification, including the shared shell, editorial sections, discovery, gallery/lightbox, physical book slideshow and How it works. The [component inventory](../docs/COMPONENT_INVENTORY.md) links their owning reviews, including the [Group 6 closure](../docs/PACKAGE_3_GROUP_6_REVIEW.md).

Group 7 Hero and motion is implemented in isolated source. The [Group 7 review](../docs/PACKAGE_3_GROUP_7_REVIEW.md) owns its rendered and functional checkpoint, retained regressions and closure evidence; the [public handoff](../REPOSITORY_HANDOFF.md) owns the current result and next work.

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
- content/hero.json, content/process.json and the bounded media records retain each group's exact inherited copy, assets and provenance alongside the earlier ledger.
- scripts/check-content.mjs validates copy provenance, approval states, source ID references and verified HTTPS destinations; unknown or unbuilt destinations cannot silently be linked.
- scripts/guard-published.mjs prevents accidental overwriting of existing root static assets.
- The bounded inherited-content validators retain exact protected copy for each authorised migration group without inventing original approval dates.

Read [current public design system](../docs/PUBLIC_DESIGN_SYSTEM.md), [content gate](../docs/CONTENT_GATE.md), and [workflow](../docs/WORKFLOW.md).

## Remaining migration work

Complete the Group 7 checkpoint before Group 8, which reconstructs Writing showcase, the existing unsaved practice dialog and complete page assembly. Retain exact published wording, imagery, interactions and unsaved behaviour. The gallery, physical presentation and How it works already have completed checkpoints and must not be restarted. The unchanged instructed migration scope does not require repeat approval; new visible refinements remain separate proposals.

Check section joins, absolute positions, navigation, history and combined menus, media, pinned progression and dialogs once the entire page is present. Package 3 is complete only after Group 8, integrated assembly and closing records. Package 4 follows.

Require source build, full browser interaction parity, keyboard/touch/reduced-motion tests and side-by-side screenshots at nine responsive widths before proposing any deployment cutover. The founder will approve that switch separately.

Rendered comparisons load the real Newsreader and Manrope fonts and the original images. Fallback font rendering cannot establish visual parity. Section evidence remains distinct from founder rendered acceptance.

## Shared component staging

The shared header, newsletter and footer reproduce the approved visual composition with explicit routes and currency state. Source navigation uses local fragments only for actual uniquely rendered targets, including Books, Samples and How it works. Other destinations retain their published URLs. Native section links omit incorrect current page semantics. Newsletter integration remains deferred.

The separate [pricing investigation](../docs/PRICING_HYDRATION_REVIEW.md) records three unresolved protected export defects. This source migration does not repair or replace pricing. Gifting, shared footer/currency, desktop navigation, discovery and hero text enlargement findings also require separately proposed visible corrections in their owning reviews.

## Browser QA for isolated source

The [component inventory](../docs/COMPONENT_INVENTORY.md) links the served baseline versus React checkpoints for Groups 1 through 7. Their reports own the current checkpoint result, exact width/state coverage, source identities, captures, diagnostics and limitations. Each completed migration checkpoint requires the full width matrix and relevant retained gates described by the [workflow](../docs/WORKFLOW.md).

The retained gates cover source validation, the protected static homepage, Packages 1 and 2, editorial/footer typography and earlier migration groups. Dedicated runs retain comparison reports, screenshots and the isolated build. Group 6's review preserves its FAQ focus and shared menu capture investigations; passing checks do not erase that history. Complete native zoom, other browser engines, physical devices and accessibility certification are not established by these Chromium tests. The root remains protected and incomplete React is not published.
