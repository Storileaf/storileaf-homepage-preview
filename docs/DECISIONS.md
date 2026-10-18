# Public website decisions and future work

18 October 2026.

## Active decisions

The existing homepage is the approved VISUAL REFERENCE for all future public marketing/editorial website pages. No major layout or content changes during style consolidation; only small measured differences may be proposed or corrected.

Newsreader and Manrope, forest/teal/paper/sage/gold, restrained editorial control shapes and original wordmark on forest supersede older Georgia/Lato and blanket pill-control direction for the NEW PUBLIC WEBSITE.

Use a shared photographic newsletter-to-footer composition across public pages. Content, consent and real subscription wiring still need separate decisions.

Create a proper React source/build pipeline in the public preview, with source parity gates before replacing existing static root. Use the private official repository for factual claims and the new public Content Gate for approval tracking. The old site is a useful reference, not a mandatory design template.

Create performance-conscious foundations, including image dimensions, selective lazy loading, font strategy and real asynchronous skeletons when needed. Final optimisation comes after the wider public site is built.

Keep documentation current and concise. Historical Macaly design passes and the old Design System v1.1 are context, not the active authority for new pages.

## Boundaries

Public website now, account/Storyteller/contributor/admin pages later. Future authenticated dashboards may share colour and fonts but need their own compact responsive system and separate founder approval.

Deferred public pages include the Books overview, the Resources hub and Activities pages, and the dedicated writing practice page. Existing newsletter backend and new image assets remain future work. No backend, authentication, payments or private production modifications now.

## Current migration stage

The isolated frontend/ React foundation is established and passing CI as an isolated component build. The whole homepage has not been migrated. The old homepage is still published as compiled root assets and cannot be replaced until editable React source reaches founder-reviewed functional and visual parity. Preserve the existing static output during migration.

## Source hardening milestone

The isolated React reference now includes a shared NewsletterFooter with currency and route props, responsive image dimensions and lazy loading, semantic verified whole-card links and expanded content provenance checks. The root GitHub Pages homepage is unchanged. Full homepage source parity remains an open migration stage, not a completed conversion.
