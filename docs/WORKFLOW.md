# Frontend development and publication workflow

Updated 20 October 2026 to keep process and navigation contracts current through Group 8. The founder's 19 October instruction established the leaner process and documentation ownership below.

This is the authoritative public development workflow. It replaces the operational wording of the [previous version](https://github.com/Storileaf/storileaf-homepage-preview/blob/02710ddc940d3472fb7ec99e315a41f49be35fc4/docs/WORKFLOW.md). Historical approvals, implementation evidence and release boundaries remain valid. This document does not itself optimise CI, create page templates or authorise React publication.

## Workspace and protection

Public Storileaf/storileaf-homepage-preview main is the frontend workspace. GitHub Pages serves root index.html, 404.html, assets, covers, gallery and pricing. The separate frontend directory contains editable React, TypeScript and Vite source, building into frontend/dist. It must not replace the published homepage before complete parity, founder rendered acceptance and explicit publication approval. The component inventory and current batch review own its actual implementation and verification status.

Private Storileaf/storiYoceFj6IRAleaf main is read only and authoritative for product capabilities, packages, pricing, commercial terms and customer application behaviour. Website decisions and handoff pointers are maintained on design/storileaf-website-ux. The repositories do not synchronise automatically. Use the connected GitHub app and Storileaf account. Inspect current heads before editing and reject stale writes rather than overwriting newer work.

Keep frontend/scripts/guard-published.mjs enabled and pinned to e9550069d91b5a9b48ade43fcfb0a71bbed2875b throughout structural migration. Never copy frontend/dist into the root. A separately approved static correction requires original and candidate browser evidence, a deliberate baseline update and live verification. No private production, backend, authentication, payments, customer data or newsletter integration is authorised by this workflow. Do not use Macaly or assume its old project is fully archived.

## When the leaner process applies

### During homepage migration and focused iteration

Use focused development checks and concise documentation immediately. Reuse completed components and existing test helpers. While iterating, inspect representative 390px, 820px and 1440px layouts, add a 320px fit check, and test the actual breakpoints and states affected by the change. These are working checks, not acceptance evidence.

Retain a complete baseline versus React checkpoint for every migration group before proceeding. The required widths remain 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. Add intermediate widths where actual CSS rules need coverage. Run source validation, content provenance, TypeScript, component tests, isolated build, published protection and retained regression gates. Exercise relevant interaction and accessibility states and inspect real captures. Record inherited quality defects separately from parity results.

The completed Group 5 media batch used the founder-authorised sequence of six image gallery and lightbox, including local See inside navigation, followed by four image physical book presentation. The [Group 5 review](PACKAGE_3_GROUP_5_REVIEW.md) owns both checkpoints and their retained content, interaction and motion evidence. The [19 October workflow instructions](https://github.com/Storileaf/storileaf-homepage-preview/blob/a2d1ee14a793581a08a0e11dd64002e9360eaf66/docs/WORKFLOW.md) preserve the original sequence and authority. The [Group 8 review](PACKAGE_3_GROUP_8_REVIEW.md) owns writing, unsaved practice and complete page integration evidence; the handoff and component inventory own the current work and checkpoint status.

### After Package 3 and during Package 4

Review the assembled homepage, section joins, all navigation and combined interactions against the latest protected baseline. Complete the full width and state matrix. Propose inherited reflow and pricing repairs separately before implementing them. Record native browser zoom, browser engines, screen readers and physical devices according to what was actually tested. Emulation is not certification.

Prepare a small workflow improvement checkpoint before the first new public page. Inventory duplicate CI jobs, repeated setup and flaky measurements. Propose and verify consolidation that runs each required check once per candidate without dropping coverage. Preserve failed evidence and correct deterministic waits or defective assertions transparently. Do not rerun until green without investigation or relax thresholds to hide differences. This documentation change does not disable or merge existing workflows.

### Before and during the first new public page

Use the future page process below after the complete homepage source and shared design foundation have passed their required checks and founder review. This does not require or imply that the React publishing switch has already happened. Publication remains a separate explicit decision.

Start with one separately authorised real page as the pilot. Identify reusable layouts from actual content needs and existing components. Extract a shared layout only when useful repetition is demonstrated. Do not build a speculative collection of editorial, book and collection templates as a mandatory extra project. Any template work belongs in that page's agreed scope. Review the pilot's iteration count, repeated work and CI duration before applying the process more widely. No numerical speed improvement is promised.

## Future public page process

1. Agree a short page brief covering its job, reader, section order, exact copy state, imagery, destinations and unique interactions. Reuse the existing page specification template. Product facts require private main verification. Exact wording approval is distinct from permission to implement.
2. Compose the page from accepted header, navigation, newsletter/footer, typography, containers, actions and image patterns. Add only the page's genuinely new content and behaviour. Shared components are not automatically changed to suit one page.
3. Iterate with focused checks at representative widths and affected breakpoints. Check changed content, focus, keyboard, relevant touch, image loading and reduced motion. A local section edit does not require repeated manual review of every unchanged section.
4. At the page checkpoint, run all nine required widths and relevant expanded, hover, keyboard, touch, short screen, image, text enlargement, zoom and overflow checks. Test links, history, metadata, canonical and robots intent where applicable. Run shared regressions whenever shared code, dependencies, global styles or routing changed. Reuse identifiable unchanged evidence only where its source and environment remain applicable, and say what was not rerun.
5. Present one review containing visible results, material differences, open issues and the decision needed. Obtain founder visual acceptance and separate release authority. New pages are reviewed against their agreed design and shared system, not pixel matched to unrelated homepage layouts.
6. Publish only the approved target. Verify the final head, actual deployment and served output. Retain a rollback reference. A successful Pages run for a source or documentation commit is not publication of the isolated React app.

A complex new interaction still needs substantial design and testing. Reuse reduces reconstruction and repeated setup, not thoughtful design or factual review.

## Documentation strategy, effective now

The founder clarified that leaner documentation means less overlap, not fewer details. Preserve all substantive requirements, rationale, approvals, diagnostics, measurements and open issues. Give each topic one authoritative home and use links elsewhere. Summaries are navigation aids, not replacements for detailed evidence. No word or page cap permits important information to be dropped.

Keep one owner for each kind of information. Update the owner and link to it elsewhere instead of pasting the same account into several files.

| Information | Authoritative location | Update trigger |
| --- | --- | --- |
| Public style rules | docs/PUBLIC_DESIGN_SYSTEM.md, with canonical values in frontend/src/styles/foundations.css and tokens.css | An approved reusable rule or retained section exception changes |
| Working and release process | This workflow | The process or release boundary changes |
| Copy and image provenance | docs/CONTENT_GATE.md and frontend/content records | Copy, images, destinations or their verified provenance changes |
| Component implementation status | docs/COMPONENT_INVENTORY.md | A component reaches or loses a stated milestone |
| Current work, next step and open risks | Public REPOSITORY_HANDOFF.md | A substantial checkpoint or handoff |
| Detailed migration evidence | One review per batch plus its machine reports and Actions artifacts | The batch checkpoint or a material diagnostic correction |
| Product facts and commercial behaviour | Official private main | Only through separately authorised product development, never copied into a competing public specification |
| Founder website decisions | Existing private homepage master brief and relevant page plan | A new decision changes design, copy or scope |
| Private project continuity | Private design branch handoff and STATUS.md | A milestone summary and links to public authority |

Handoffs are current summaries, not cumulative test transcripts. Keep the active summary focused on current work. Move historical detail into a clearly labelled, linked archive with content preserved, rather than deleting it. Include current scope, implemented versus verified status, outstanding decisions and links to the exact evidence. STATUS is an index rather than a duplicate handoff. Component inventory remains a status table. The design system describes design, not CI logs.

For routine fixes, a clear commit and an update to the affected record are sufficient. Do not create a new report for each small adjustment. Use one owning review for a batch, with separate checkpoints where needed, as in the [Group 5 media review](PACKAGE_3_GROUP_5_REVIEW.md). Store test counts, file hashes and detailed measurements once in machine readable evidence, and link from the review. Preserve representative screenshots and durable summaries in repository QA records when needed, because Actions artifacts expire. Avoid repeatedly committing complete capture sets or generating further documentation commits solely to restate the immediately previous head.

Preserve prior approvals and failures through immutable commit links or a clearly labelled archive. Do not delete unique evidence or silently rewrite an old decision. Current instructions must explicitly supersede conflicting historical operational advice. Follow the newest specific decision rather than an older Macaly or Georgia/Lato brief. Consolidate overlapping current summaries as they are next updated and review remaining documentation duplication before the first new page. The original gallery preparation instructions remain in the historical workflow linked above.

Each checkpoint record must identify scope, implementation commit, comparison baseline, actual checks and environment, result, open findings, evidence links and separate acceptance/publication state. Include further detail whenever needed to reproduce, understand or maintain the work. Do not force substantive evidence into a short summary. Do not invent a founder approval date or infer acceptance from a passing test. Keep proposed, authorised, implemented, browser verified, founder accepted and published distinct.

## Content and navigation contracts

Follow the Content Gate before new or revised public wording. An authorised migration retains exact protected copy with bounded inherited provenance, not a fabricated new wording approval. Preserve the six formal book names, completed Packages 1 and 2 and all approved imagery, proportions, section order and interactions.

Only uniquely rendered targets may resolve to local fragments. Top, Books, Samples, How it works, Resources, its Activities entry, Common questions and main-content are rendered locally. The final invitation receives the local Books route while retaining its canonical ledger fallback. The separate FAQ link to the existing How it works page retains its published destination. Preserve native history and scroll restoration, currency preference and existing individual book URLs. Omit inappropriate current page semantics from ordinary section links and the skip control. Keep the corrected skip continuation and mobile menu focus restoration.

Activities and Browse all resources remain noninteractive labels until their pages exist. Blog & guides retains its verified destination. The practice dialog remains unsaved; a standalone practice page and newsletter integration remain deferred. Images need dimensions, meaningful alternative text, documented crops and appropriate loading. Skeletons belong only to genuine asynchronous content. Wider performance optimisation follows the broader site and must not sacrifice approved imagery or motion.

## Final homepage publication gate

Complete Package 3 and Package 4 against the approved homepage, including gallery/lightbox, slideshow, pinned process and fourth stage hold, hero motion, writing dialog and combined photographic ending. Verify all required states and pricing/currency entry behaviour. Require deterministic initial rendering or a reviewed approach without hydration mismatch.

The known pricing footer, currency entry document and selected book snapshot mismatches remain unresolved until a separately authorised repair is verified. See the [pricing investigation](PRICING_HYDRATION_REVIEW.md). Preserve the export meanwhile. The inherited Gifting, shared navigation/footer and discovery text enlargement findings remain open in their reviews. Matching baseline limitations is not an accessibility pass.

Only explicit founder approval after complete visual and functional parity permits replacing the published homepage with React. Passing automation, documentation changes, permission to continue a batch and a positive response to earlier foundation work do not supply that approval.

Historical implementation evidence remains in the [component inventory](COMPONENT_INVENTORY.md) and linked package reviews. Earlier workflow details are retained at the immutable version linked above, not maintained as a competing active process.
