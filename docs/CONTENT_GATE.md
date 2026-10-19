# Public website content creation and approval gate

Status 18 October 2026. Required for ALL new and revised public text, navigation labels, image captions, headings, FAQs, metadata, forms and conversion copy. A technical check cannot replace founder editorial approval.

## Product fact sources

The official private repository Storileaf/storiYoceFj6IRAleaf at main is authoritative for real product capabilities, packages, pricing, editorial review, cover personalisation, paper/binding specifications, writing periods, printing, gifting, shipping, payments, customer application flows and legal terms.

Founder-approved website wording and page decisions live in the private design/storileaf-website-ux branch. Read its current Homepage Master Implementation Brief, Content Gate, Copy Ledger and relevant page plans. Brand DNA guides character, voice, imagery and audience. Existing production pages are reference material, NOT automatic approval to reuse old claims, wording or design.

Where facts conflict, identify the discrepancy. Never invent a capability, price, inclusion, deadline, promise, testimonial or resource feature to complete a design.

## Required record for a copy change

1. Identify page, section, intended reader, section job and destination.
2. Quote the existing exact wording and its approval state.
3. Propose the new wording separately. Do not treat an assistant recommendation as accepted.
4. Cite current product files/URLs for every specific claim. Record date and source branch.
5. Check British English, restrained editorial voice, clarity, factual specificity, accessibility and honest calls to action.
6. Check repetition with immediately neighbouring sections and the global Homepage Copy Ledger.
7. Check the target exists. A visual-only CTA to an unbuilt page must not quietly become a broken link or a fake working button.
8. Check image rights, alt text, page heading hierarchy, metadata, canonical/robots intent and newsletter/consent language when relevant.
9. Record the founder's explicit approval of EXACT copy separately from authority to edit or release.
10. After implementation, inspect mobile and desktop screenshots, test actual links and preserve approvals in handoffs.

## Copy states

Use existing_verified for proven existing wording, proposed for suggestions, founder_approved for explicitly accepted final text, implemented_verified for built and tested material, superseded for historical alternatives. A build or passing browser test never grants editorial approval.

The editable React source uses frontend/content/ledger.json with source references and flags for whether a record may be published. The automated check rejects marked-for-publication text without an approved state and a provenance entry. It cannot determine whether a product claim is true. Human source review is still mandatory.

## Language and claims

Prefer human, plain British English. Lead with meaningful experiences, authentic guided storytelling, the customer's own words and the finished book. Avoid decorative overlines, software jargon, generic hype, false sentimentality and repetitive trust messages.

Preserve six formal book names, founder-approved per-book descriptions and bullets, and accepted homepage copy verbatim until further authorisation.

Do not imply comprehensive ghostwriting, universal photographs/voice packages, unlimited editing/collaboration, archival paper, sewn binding, guaranteed delivery dates or a working product where none is verified. Distinguish real printed books, illustrative mock-ups and temporary photo slots.

Resources remain a planned library; current Activities and Browse all resources actions are display treatments pending actual pages. The practice page is also deferred. The new newsletter is an approved UI, not evidence of an active collection integration in the static preview.

Never imply the buyer can access a gifted recipient's private responses without actual permission rules. Don't collect children's personal information in public activities without specific approved privacy design.

## Gate outcomes

Pass for drafting only after source and duplication checks. Founder approved means precise copy may be implemented, not that implementation has happened. Live means the exact behaviour and real destination were verified. Otherwise record the blocker and keep it out of public release.

This gate is complemented by the private Content Gate, Copy Ledger and official product documentation. Avoid maintaining two contradictory versions of product facts in these files.

## Operational source checks

New source pages must use identified ledger entries for approved customer-facing copy and must not invent resource/activity URLs. CI verifies copy provenance, approval states, ID references and verified HTTPS destinations. It does **not** independently determine whether a promise is factually true. A human review against the official private product implementation and this proposal template remains mandatory.

During an authorised migration, preserve the exact current homepage wording and record its inherited provenance. Group 1 carries Gifting copy forward from the immutable published baseline. A separate original exact approval date is not recorded, so do not invent an `approved_on` value. Record `migration_recorded_on`, the protected baseline reference and exact copy comparison evidence. This documents retention of existing homepage words under the founder's migration instruction. It does not approve revised copy or infer new product claims. Resources retains its existing exact wording approval records.

The inherited-copy exception is limited to `home.gifting.title`, `home.gifting.description` and `home.gifting.cta`. The gate compares each full normalised value with the corresponding text in the protected `e9550069d91b5a9b48ade43fcfb0a71bbed2875b` `index.html`. It rejects changed words, arbitrary fragments, incorrect references, missing migration provenance and invented approval dates. This is not a general way to mark new copy as approved.

Use the [content proposal template](CONTENT_PROPOSAL_TEMPLATE.md) to document the exact old and new copy and link it from the page's decision record. Do not increase duplicate documentation by pasting entire product terms into the public repository.
