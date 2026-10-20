# Editable public website source

The new StoriLeaf public website source is Vite + React + TypeScript. It is independent of Macaly and has no private customer or backend code.

## Current state

This folder builds the isolated React homepage. Packages 1 and 2 provide its completed foundations. Package 3 Groups 1 through 7 have recorded implementation and browser verification. The [component inventory](../docs/COMPONENT_INVENTORY.md) links each owning review.

Group 8 reconstructs the Writing showcase and existing unsaved practice dialog, completing the homepage composition. Its [review](../docs/PACKAGE_3_GROUP_8_REVIEW.md) owns the dedicated comparison, complete assembly checks, retained regressions and exact checkpoint result. Source presence does not establish that these checks have passed. The [public handoff](../REPOSITORY_HANDOFF.md) owns current status and next work.

The existing root index.html, 404.html and bundled assets remain the approved published baseline. The root is protected by scripts/guard-published.mjs, pinned to the last approved static release commit. Source output stays within dist and is not deployed to the Pages root. Founder rendered acceptance and explicit publication approval remain separate gates.

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
- content/writing.json, content/hero.json, content/process.json and the bounded media records retain each group's exact inherited copy, assets and provenance alongside the earlier ledger.
- scripts/check-content.mjs validates copy provenance, approval states, source ID references and verified HTTPS destinations; unknown or unbuilt destinations cannot silently be linked.
- scripts/guard-published.mjs prevents accidental overwriting of existing root static assets.
- The bounded inherited-content validators retain exact protected copy for each authorised migration group without inventing original approval dates.

Read [current public design system](../docs/PUBLIC_DESIGN_SYSTEM.md), [content gate](../docs/CONTENT_GATE.md), and [workflow](../docs/WORKFLOW.md).

## Assembly and release gates

The homepage now places Writing showcase between How it works and Gifting. The practice dialog retains its exact question, wording, input, focus, dismissal and unsaved behaviour. A standalone practice page, persistence and authentication are deferred.

Package 3 requires the Group 8 rendered and functional checkpoint, complete page assembly checks, retained regressions and closing records. Check section joins, absolute positions, navigation, history and combined menus, media, pinned progression and dialogs. Consult the owning review for the actual result rather than inferring completion from component presence. Package 4 follows and includes separately proposed inherited repairs.

Require source build, the complete width and interaction matrix, actual screenshots and founder rendered acceptance before proposing a publishing cutover. The founder must approve that switch separately. Rendered comparisons load the real Newsreader and Manrope fonts and original images. Fallback font rendering cannot establish parity.

## Shared component staging

The shared header, newsletter and footer reproduce the approved visual composition with explicit routes and currency state. Source navigation uses local fragments only for actual uniquely rendered targets, including Books, Samples and How it works. Other destinations retain their published URLs. Native section links omit incorrect current page semantics. Newsletter integration remains deferred.

The separate [pricing investigation](../docs/PRICING_HYDRATION_REVIEW.md) records three unresolved protected export defects. This source migration does not repair or replace pricing. Gifting, shared footer/currency, desktop navigation, discovery and hero text enlargement findings also require separately proposed visible corrections in their owning reviews.

## Browser QA for isolated source

The [component inventory](../docs/COMPONENT_INVENTORY.md) links the served baseline versus React checkpoints for Groups 1 through 8. Their reports own the current checkpoint result, exact width/state coverage, source identities, captures, diagnostics and limitations. Each completed migration checkpoint requires the full width matrix and relevant retained gates described by the [workflow](../docs/WORKFLOW.md).

The retained gates cover source validation, the protected static homepage, Packages 1 and 2, editorial/footer typography and earlier migration groups. Dedicated runs retain comparison reports, screenshots and the isolated build. Group 6's review preserves its FAQ focus and shared menu capture investigations; passing checks do not erase that history. Complete native zoom, other browser engines, physical devices and accessibility certification are not established by these Chromium tests. The root remains protected and the isolated React homepage is not published.
