# Editable public website source

The new StoriLeaf public website source is Vite + React + TypeScript. It is independent of Macaly and has no private customer or backend code.

## Current state

This folder currently builds a working **component foundation**, using the approved Resources editorial composition to exercise typed headings, resource cards, action styles, colour/spacing tokens and an approval-aware content ledger.

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

- src/styles/tokens.css defines public website colours, typography names, responsive gutters and component shape roles.
- src/styles/components.css provides scoped reference styling without touching published CSS.
- src/components contains typed components with verified whole-card link semantics, a dimension-preserving ResponsiveImage and a source-only NewsletterFooter with currency and route props, plus a typed SiteHeader reference for desktop and mobile.
- content/ledger.json records exact approved strings, source and whether actions point to real pages.
- scripts/check-content.mjs validates copy provenance, approval states, source ID references and verified HTTPS destinations; unknown or unbuilt destinations cannot silently be linked.
- scripts/guard-published.mjs prevents accidental overwriting of existing root static assets.
- scripts/foundation.test.mjs checks token and content conventions.

Read [current public design system](../docs/PUBLIC_DESIGN_SYSTEM.md), [content gate](../docs/CONTENT_GATE.md), and [workflow](../docs/WORKFLOW.md).

## Remaining migration work

The source workspace must be expanded to include the actual current header, hero, book selector, gallery, physical book slideshow, process, writing demonstration, gifting, Resources, FAQs and shared newsletter/footer, together with route-level pricing/navigation. Recreate the exact approved wording and interactions, not the older archived Macaly snapshot.

Require source build, full browser interaction parity, keyboard/touch/reduced-motion tests and side-by-side screenshots at nine responsive widths before proposing any deployment cutover. The founder will approve that switch separately.

The HTML source reference may use temporary system fallback fonts until the final font loading/parity step is confirmed. The published homepage already uses Newsreader and Manrope correctly; do not interpret this isolated component exercise as final visual acceptance.

## Shared component staging

The source preview now includes the approved newsletter/footer's visual composition as a typed shared React component with explicit per-page routes and currency state. This is a **reference**, not a replacement for the current compiled homepage footer or a working newsletter backend. The original public root is guarded against unreviewed regeneration. The source remains incomplete until every homepage section and pricing/navigation interaction is migrated and visually compared.

## Source-only browser QA

The editable source CI now serves its isolated Vite build and tests Chrome rendering at the same nine viewport widths as the published homepage. It also checks dropdowns, mobile native-dialog focus restoration, Resources link semantics, shared photo footer and currency selection. The workflow uploads source-only screenshots and a JSON report as artifacts, without changing any published files. These screenshots verify the emerging COMPONENT REFERENCE, not visual equivalence with the approved homepage.
