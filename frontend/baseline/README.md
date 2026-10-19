# Protected published homepage baseline

Reference commit e9550069d91b5a9b48ade43fcfb0a71bbed2875b contains the founder-authorised final footer correction for Package 2. It builds on editorial text link release 45465c1300f05fac797db34dffa3e96b7f595566, initial Package 2 reference 90953da2753e948748695e677cdca1d51688dcee and accepted Package 1 styling reference fae8c1aa3640581906d430fdf1656f957da6dde6.

Footer column headings now use 15px Manrope at weight 650 with 1.4 leading. Currency text uses 13px at all widths. Menu links remain 14px regular and legal text remains 13px. Existing colours, spacing rules, control shapes, options, destinations and the shared photographic background are retained. Natural text width and footer height changes are expected. Only the static stylesheet changes among published runtime files.

Standalone editorial actions, FAQ questions and answers remain 15px. Inline reading links inherit paragraph size. Header navigation, newsletter controls and ordinary buttons retain their component styling. The incomplete React source is not deployed over the homepage.

Candidate run 39259555878 passed before publication, including existing homepage/source/Package 1/Package 2/editorial regressions, fourteen component and foundation tests, and the dedicated footer comparison against the unmodified previous stylesheet at 898958276bb82c8c7c5b2c9839456a26f8cf0591. Desktop/mobile screenshots were inspected. See docs/FOOTER_TYPE_REVIEW.md for exact scope, live verification and limitations. Package 2 implementation is complete; final rendered acceptance remains with the founder.

The root HTML, CSS, JavaScript, pricing and photography remain protected. Any further static refinement requires explicit scope, browser evidence and a deliberate baseline update. Never disable this guard or replace the homepage with the incomplete frontend/dist reference.
