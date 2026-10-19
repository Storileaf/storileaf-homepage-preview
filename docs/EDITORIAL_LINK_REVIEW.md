# Editorial text link refinement

19 October 2026. Founder-approved implementation scope. Final rendered acceptance remains separate.

## Scope and implementation

Implementation commit 45465c1300f05fac797db34dffa3e96b7f595566 applies the verified 15px Manrope rule to standalone editorial text actions in the published homepage and editable React source. This includes See package details, Ask us a question, Explore activities, Explore guides, Browse all resources and the four actions below FAQ answers. Inline paragraph links inherit their surrounding type size. There are currently no inline paragraph anchors in the homepage; their inheritance rule is a source foundation, not invented public content.

The new editorial action token aliases the existing 15px body token. The 14px control action token stays separate, avoiding a global change to filled, outline and gold buttons. Text-action weights, colours, leading, arrows, gaps, wording and destinations are retained. Natural label widths and line boxes grow with the approved type size. No fixed-height text containers are introduced.

Header navigation, footer navigation, footer legal utilities, currency control, newsletter controls and every button retain their existing styling. Unbuilt Activities and Resources labels remain non-interactive. Pricing keeps its previous appearance through homepage-scoped token values and original fallbacks. No HTML, JavaScript bundle, image or product claim is changed.

The verified static stylesheet blob is 0fa7a5bd5cb0882bf019f35554a2b03f8e7936bb. The protected root guard is deliberately repinned to the implementation commit, not disabled. The temporary preparation script is removed, and permanent verification is read-only. The incomplete frontend/dist build is not deployed as the homepage.

## Verification

[Candidate run 39254355665](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39254355665) passed before publication. It checked the original homepage regression, source navigation and shape checks, fourteen component/foundation tests, and the existing Package 2 FAQ and typography regression. Its [artifact](https://github.com/Storileaf/storileaf-homepage-preview/actions/runs/39254355665/artifacts/12187111811) contains exact file hashes, diffs, measurements and rendered screenshots.

The dedicated browser comparison uses the actual prior published stylesheet at 66327e0fc83e48b7547c10e3ee58f4ddf89c4f39. All nine editorial labels measured 15px Manrope at 320, 360, 390, 430, 768, 820, 1024, 1280 and 1440px. Ordinary buttons, navigation and the complete footer retained their measured dimensions and typography at every width. Text, destinations, colours, weights, spacing rules and SVG dimensions are unchanged. No document overflow or missing images was recorded. Desktop/mobile full-page captures were visually inspected.

Keyboard focus remained visible. Targeted 200 percent editorial text enlargement at 320px passed without document overflow. Actual React text actions measured 15px at all nine widths, while test-only filled, outline and gold fixtures retained 14px and inline body/lead links inherited the parent size. The fixtures add no public copy. This is not full native-browser zoom or physical-device certification.

The earlier Package 2 comparison normalises only the newly approved action sizes, so its FAQ and other geometry assertions remain meaningful. The earlier shape comparison likewise normalises only this text-action size. The dedicated comparison still uses the original unmodified prior stylesheet. Used pixel values of auto margins can adjust naturally with taller text; their authored auto rule is checked separately.

Permanent verification compares the committed homepage and then waits for the matching deployed stylesheet hash. Its live stage opens a fresh browser without CSS injection or mocked requests and checks actual Pages, all nine widths and downloaded brand fonts. Read the successful run and Pages deployment for the actual final head before claiming live verification.

## Footer review and subsequent approved implementation

Browser measurements confirm all three column headings use 11px Manrope at weight 650 and 13.42px line height. Menu links use 14px at weight 400. Currency text is 11px on desktop and 10px on phones. Copyright and legal links use 13px.

The proposed correction is 15px column headings at their existing semibold weight, existing gold colour and explicit 1.4 line height. Keep menu links 14px regular. A separate useful refinement is 13px currency text at all widths. The founder subsequently approved both refinements and requested completion of Package 2. They are implemented in the separate footer correction recorded in FOOTER_TYPE_REVIEW.md. The editorial-link release itself remains unchanged.

The photograph, forest fade, footer grouping, link order, copyright and legal row remain the accepted composition. Several existing footer same-page section links still have aria-current=page in the hydrated static implementation. Their semantics need a separately scoped correction during navigation migration; no destination or behaviour has been changed here. Full React parity, broader accessibility and native-browser zoom checks remain separate work.
