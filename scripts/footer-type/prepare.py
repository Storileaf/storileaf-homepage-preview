"""Prepare only the founder-approved footer typography for prepublication QA.
Removed on publication. Does not commit, push or change a branch.
"""
from pathlib import Path
import json, subprocess
changed=[]
def edit(name, pairs):
    p=Path(name);s=p.read_text()
    for old,new in pairs:
        assert s.count(old)==1, f'Expected one match in {name}: {old[:90]}'
        s=s.replace(old,new)
    p.write_text(s);changed.append(name)
edit('frontend/src/styles/foundations.css',[(
'  --sl-text-editorial-action: var(--sl-text-body);',
'  --sl-text-editorial-action: var(--sl-text-body);\n  --sl-text-footer-heading: var(--sl-text-body);\n  --sl-leading-footer-heading: 1.4;\n  --sl-text-currency: var(--sl-text-meta);')])
edit('frontend/src/styles/components.css',[(
'font:650 11px/1.4 var(--sl-font-ui);',
'font:650 var(--sl-text-footer-heading)/var(--sl-leading-footer-heading) var(--sl-font-ui);'),(
'.sl-footer-currency select { appearance:none; border:0; background:transparent; color:#fff; font-size:11px;',
'.sl-footer-currency select { appearance:none; border:0; background:transparent; color:#fff; font-size:var(--sl-text-currency);')])
edit('assets/index-DhPZyX4z.css',[(
'.footer-column h3 {\n  font-family: var(--font-sans);\n  color: hsl(var(--secondary));\n  margin-bottom: 10px;\n  font-size: 11px;\n  font-weight: 650;\n}',
'.footer-column h3 {\n  font-family: var(--font-sans);\n  color: hsl(var(--secondary));\n  margin-bottom: 10px;\n  font-size: var(--sl-text-footer-heading,11px);\n  font-weight: 650;\n  line-height: var(--sl-leading-footer-heading,1.22);\n}'),(
'  padding: 0 12px 0 5px;\n  font-size: 11px;\n  font-weight: 550;',
'  padding: 0 12px 0 5px;\n  font-size: var(--sl-text-currency,11px);\n  font-weight: 550;'),(
'  .currency-picker select {\n    padding-right: 3px;\n    font-size: 10px;\n  }',
'  .currency-picker select {\n    padding-right: 3px;\n    font-size: var(--sl-text-currency,10px);\n  }')])
subprocess.run(['node','frontend/scripts/sync-foundations.mjs','--write'],check=True)
# Older package comparisons include only this newly authorised size correction.
# Dedicated footer QA compares the actual unmodified prior stylesheet separately.
normal="const footerComparison = '#top[data-testid=\"storileaf-home\"] .site-footer .footer-column h3{font-size:15px;line-height:1.4}#top[data-testid=\"storileaf-home\"] .site-footer .currency-picker select{font-size:13px}'\n"
edit('scripts/package2/verify.mjs',[(
"const before = execFileSync('git', ['show', baseline + ':' + cssPath], { encoding: 'utf8' }) + '\\n' + editorialComparison",
normal+"const before = execFileSync('git', ['show', baseline + ':' + cssPath], { encoding: 'utf8' }) + '\\n' + editorialComparison + '\\n' + footerComparison")])
edit('scripts/editorial-links/verify.mjs',[(
"const before=execFileSync('git',['show',baseline+':'+cssPath],{encoding:'utf8'})",
normal+"const before=execFileSync('git',['show',baseline+':'+cssPath],{encoding:'utf8'})+'\\n'+footerComparison")])
edit('frontend/scripts/verify-shape-foundation.mjs',[(
"const original = git(['show', sourceBaseline + ':frontend/src/styles/components.css']) + '\\n.sl-action--text { font-size:var(--sl-text-editorial-action); }'",
"const original = git(['show', sourceBaseline + ':frontend/src/styles/components.css']) + '\\n.sl-action--text { font-size:var(--sl-text-editorial-action); }\\n.sl-footer-column h3 { font-size:15px; line-height:1.4; } .sl-footer-currency select { font-size:13px; }'")])
edit('docs/PUBLIC_DESIGN_SYSTEM.md',[(
'| Compact label | 11px where already used | Footer grouping or utility labels, never paragraph copy |',
'| Footer column heading | 15px, existing weight 650, leading 1.4 | Gold grouping headings above 14px regular navigation links |\n| Currency selector | 13px at all widths | Existing native currency control |\n| Compact label | 11px where specifically retained | Illustration or compact utility labels, never paragraph copy or footer column headings |'),(
'Footer heading and currency sizing is under review, not approved for change.',
'The founder subsequently approved 15px footer column headings with 1.4 leading and 13px currency text at all widths. These now use dedicated aliases of the body and metadata tokens. Existing gold, weight 650, 14px menu links, 13px legal text, gaps, controls and photographic composition are retained. See [footer completion review](FOOTER_TYPE_REVIEW.md).')])
edit('docs/EDITORIAL_LINK_REVIEW.md',[(
'## Footer review, not implemented','## Footer review and subsequent approved implementation'),(
'These remain proposals awaiting founder approval; no footer typography is changed in the editorial-link release.',
'The founder subsequently approved both refinements and requested completion of Package 2. They are implemented in the separate footer correction recorded in FOOTER_TYPE_REVIEW.md. The editorial-link release itself remains unchanged.')])
edit('REPOSITORY_HANDOFF.md',[(
'FAQ questions at 15px with 1.5 leading and FAQ answer links at 14px. Answers remain 15px. Final founder visual acceptance of Package 2 remains pending.',
'FAQ questions at 15px with 1.5 leading and standalone editorial actions, including FAQ answer links, at 15px. Answers remain 15px. The founder approved the final footer correction of 15px column headings with 1.4 leading and 13px currency text at all widths. Package 2 implementation is complete for final rendered review. No Package 3 work or full React cutover is authorised.'),(
'Footer heading and currency readability is being reviewed separately, not silently changed.',
'The separately approved footer completion is now implemented in source and the static preview. Menu links remain 14px regular and legal text remains 13px. See docs/FOOTER_TYPE_REVIEW.md.')])
edit('docs/PACKAGE_2_REVIEW.md',[(
'Implementation complete for preview review. Final founder visual acceptance remains pending.',
'Package 2 implementation complete, including the subsequently approved 15px editorial links, 15px footer headings and 13px currency text. Final rendered acceptance remains with the founder. See FOOTER_TYPE_REVIEW.md for the final correction and verification boundary.'),(
'Distinct section leads, 15.5px source card text, the Resources 26px phone heading gap, footer labels, legal copy and device illustration microtype were evaluated and retained.',
'Distinct section leads, 15.5px source card text, the Resources 26px phone heading gap, legal copy and device illustration microtype were evaluated and retained. The initially retained footer headings and currency text were subsequently refined by explicit founder approval, as recorded in FOOTER_TYPE_REVIEW.md.')])
p=Path('docs/DECISIONS.md');p.write_text(p.read_text()+'\n\n## Footer typography and Package 2 completion, 19 October 2026\n\nThe founder approved 15px column headings at weight 650 with 1.4 leading and 13px currency text on all screens. Menu links remain 14px regular, and legal text remains 13px. Preserve the shared photographic footer, grouping, gaps, wording, destinations and currency behaviour. This closes the bounded Package 2 implementation; final rendered acceptance remains distinct. Incorrect static current-page section-link semantics remain separately scoped navigation migration work. See FOOTER_TYPE_REVIEW.md.\n');changed.append(str(p))
p=Path('docs/FOOTER_TYPE_REVIEW.md')
assert not p.exists()
p.write_text("""# Footer typography and Package 2 completion

19 October 2026. The founder approved the final footer heading and currency corrections and requested completion of Package 2. This is implementation approval. Final acceptance of the rendered preview remains separate.

## Final correction

All three footer column headings now use 15px Manrope at the existing weight 650, with explicit 1.4 leading, or 21px at the normal root size. Their gold colour is preserved. Currency text now uses 13px at every breakpoint, replacing the previous 11px desktop and 10px phone sizes. The React currency reference also uses 13px. Dedicated footer tokens alias the established body and metadata values.

Menu links remain 14px regular. Copyright, Privacy, Terms and Get in touch remain 13px. Existing currency options, selected-value behaviour, padding, border, corner shape, icons and accessible labels are preserved. No link, wording, image, grouping, column gap, heading margin or newsletter behaviour changes. Natural text widths and footer height may increase with the approved size changes. The shared photograph and forest fade remain intact.

Only assets/index-DhPZyX4z.css changes among published runtime files. Root HTML, compiled JavaScript, images and pricing files are unchanged. Current CSS rules are edited in place, not layered with another override. Homepage-scoped tokens and original fallbacks protect the separate pricing preview. The incomplete frontend/dist build is not deployed.

## Verification and scope protection

The dedicated footer browser check compares the actual unmodified previous stylesheet at 898958276bb82c8c7c5b2c9839456a26f8cf0591 with the candidate at all nine required widths. It checks headings, currency text and selected-label fit, unchanged menu/legal typography, content and destinations, original spacing, background and unrelated section geometry. The editable source has its own comparison against the same prior commit.

Checks exercise keyboard focus, all four currency selections, touch, reduced motion, short screen heights and a 720 CSS pixel desktop zoom reflow equivalent. This is not a full native-browser zoom, cross-browser or physical-device certification. Actual desktop and phone screenshots are retained in the workflow artifacts and inspected before completion.

The existing homepage, Package 1, Package 2, editorial-link and source regressions remain active. Their older baseline comparisons account only for the explicitly approved footer font sizes and heading leading. The dedicated footer comparison does not normalise its original stylesheet. The protected-root guard is deliberately repinned for this release, never disabled.

The permanent footer workflow is read-only. Its live stage waits for the exact deployed CSS hash and opens the actual GitHub Pages URL in a fresh browser without style injection or request mocking. Confirm its result and the final Pages deployment before claiming live verification.

## Package 2 completion boundary

Implementation now covers reusable Newsreader heading roles, Manrope reading and interface roles, section/container/gap foundations, 15px FAQ questions, 15px standalone editorial actions, inherited inline reading links and the final footer correction. The accepted homepage compositions remain the reference. Package 2 implementation is complete for final founder review.

Full React homepage reconstruction, exact source/static parity, wider accessibility and native zoom, correction of incorrect static same-page aria-current semantics, genuine replacement photography, other public pages and newsletter wiring are separate work. No Package 3 work is started and no private production, payments, authentication, customer data or backend systems are modified.
""")
changed.append(str(p))
Path('qa/footer-type').mkdir(parents=True,exist_ok=True)
Path('qa/footer-type/changed-files.json').write_text(json.dumps(changed,indent=2))
print('Prepared approved footer correction',changed)
