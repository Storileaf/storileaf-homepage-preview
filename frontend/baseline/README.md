# Protected published homepage baseline

Reference commit 45465c1300f05fac797db34dffa3e96b7f595566 contains the founder-authorised editorial text link refinement on top of Package 2 reference 90953da2753e948748695e677cdca1d51688dcee and accepted Package 1 styling reference fae8c1aa3640581906d430fdf1656f957da6dde6.

Standalone editorial text actions now use 15px Manrope. Inline reading links inherit the paragraph size. Header navigation, footer navigation and utilities, newsletter controls and filled/outlined/gold buttons are unchanged. FAQ questions and answers remain 15px from Package 2. Labels can grow naturally; approved content, imagery, spacing rules and interactions are retained.

Candidate run 39254355665 passed the existing homepage/source/Package 2 regressions, fourteen component and foundation tests, and a dedicated nine-width comparison against actual prior stylesheet 66327e0fc83e48b7547c10e3ee58f4ddf89c4f39. This comparison verified unchanged button, header and complete footer styling and geometry. See docs/EDITORIAL_LINK_REVIEW.md for scope and limitations. Final rendered acceptance remains with the founder.

The root HTML, CSS, JavaScript, pricing and photography remain protected. Any further static refinement requires explicit scope, browser evidence and a deliberate baseline update. Never disable this guard or replace the homepage with the incomplete frontend/dist reference.
