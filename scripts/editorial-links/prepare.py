"""Prepare the founder-approved editorial text sizing, without publishing it."""
from pathlib import Path
import subprocess, json
root = Path.cwd()
base = '66327e0fc83e48b7547c10e3ee58f4ddf89c4f39'
changed = []
def edit(name, replacements):
    p = root / name
    s = p.read_text()
    old = subprocess.check_output(['git', 'show', base + ':' + name]).decode()
    assert s == old, 'Target changed since inspected baseline: ' + name
    for a, b, count in replacements:
        assert s.count(a) == count, 'Unexpected target count: ' + name + ' ' + a[:80]
        s = s.replace(a, b)
    assert s != old, 'No edit: ' + name
    p.write_text(s)
    changed.append(name)
edit('frontend/src/styles/foundations.css', [
    ('  --sl-text-action: .875rem;', '  --sl-text-action: .875rem;\n  --sl-text-editorial-action: var(--sl-text-body);', 1)
])
edit('frontend/src/styles/components.css', [
    ('.sl-action--text { color:var(--sl-teal); }', '.sl-action--text { color:var(--sl-teal); font-size:var(--sl-text-editorial-action); }', 1)
])
edit('frontend/src/styles/typography.css', [
    ('.sl-copy { margin:0; font-family:var(--sl-font-ui); font-weight:var(--sl-weight-body); }', '.sl-copy { margin:0; font-family:var(--sl-font-ui); font-weight:var(--sl-weight-body); }\n/* Inline links retain their surrounding reading size, unlike standalone actions. */\n.sl-copy a:not(.sl-action) { font-size:inherit; line-height:inherit; }', 1)
])
edit('assets/index-DhPZyX4z.css', [
    ('  gap: 15px;\n  font-size: 13px;\n  font-weight: 650;\n  line-height: 1.6;', '  gap: 15px;\n  font-size: var(--sl-text-editorial-action,13px);\n  font-weight: 650;\n  line-height: 1.6;', 1),
    ('.books-footnote .text-link {\n  flex-shrink: 0;\n  font-size: 12px;', '.books-footnote .text-link {\n  flex-shrink: 0;\n  font-size: var(--sl-text-editorial-action,12px);', 1),
    ('.process-copy > .text-link {\n    font-size: 12px;', '.process-copy > .text-link {\n    font-size: var(--sl-text-editorial-action,12px);', 1),
    ('  font-size:var(--sl-text-action,12px);', '  font-size:var(--sl-text-editorial-action,12px);', 1),
    ('  font:700 14px/1.35 var(--font-sans);', '  font:700 var(--sl-text-editorial-action,14px)/1.35 var(--font-sans);', 2),
    ('.text-link:hover {', '/* Inline reading links use their paragraph size; footer and buttons are excluded. */\n#top[data-testid="storileaf-home"] main p a:not(.text-link):not(.button) { font-size:inherit; line-height:inherit; }\n\n.text-link:hover {', 1)
])
subprocess.run(['node', 'frontend/scripts/sync-foundations.mjs', '--write'], check=True)
# Existing package regressions normalise only this explicitly approved addition.
# The dedicated editorial comparison still checks the actual unmodified previous CSS.
edit('frontend/scripts/verify-shape-foundation.mjs', [
    ("const original = git(['show', sourceBaseline + ':frontend/src/styles/components.css'])", "// Approved 19 October editorial labels are 15px; earlier shape comparison is otherwise unchanged.\nconst original = git(['show', sourceBaseline + ':frontend/src/styles/components.css']) + '\\n.sl-action--text { font-size:var(--sl-text-editorial-action); }'", 1)
])
edit('scripts/package2/verify.mjs', [
    ("const before = execFileSync('git', ['show', baseline + ':' + cssPath], { encoding: 'utf8' })", "// Preserve Package 2's original comparison while accounting for the later approved editorial labels.\nconst editorialScope = '#top[data-testid=\"storileaf-home\"]'\nconst editorialComparison = [ '.text-link', '.resource-card-link', '.resource-all-link' ].map(s => editorialScope + ' ' + s).join(',') + '{font-size:15px}'\nconst before = execFileSync('git', ['show', baseline + ':' + cssPath], { encoding: 'utf8' }) + '\\n' + editorialComparison", 1),
    ("link==='14px'", "link==='15px'", 1),
    ('font-size:28px!important', 'font-size:30px!important', 1)
])
edit('scripts/package2/live.mjs', [("row.linkSize==='14px'", "row.linkSize==='15px'", 1)])
edit('docs/PUBLIC_DESIGN_SYSTEM.md', [
    ('| Action text | 14px, bold, leading 1.35 | Ordinary actions and FAQ links |', '| Control action | Existing 14px default, component exceptions retained | Filled, outlined and gold buttons; not editorial text links |\n| Editorial text action | 15px Manrope, existing weight and leading retained | Standalone reading-section actions, resource labels and links below FAQ answers |', 1),
    ('Text sizes in the canonical source use rem bounds', 'The founder approved 15px standalone editorial text actions on 19 October 2026. `--sl-text-editorial-action` aliases the 15px body token, while `--sl-text-action` retains the ordinary control baseline. Inline paragraph links inherit their surrounding text size. Colours, weights, arrows, gaps and destinations are unchanged. Header navigation, footer utilities and button labels are excluded. Activities and Browse all resources remain non-interactive labels until their pages exist. Footer heading and currency sizing is under review, not approved for change. See [editorial link review](EDITORIAL_LINK_REVIEW.md).\n\nText sizes in the canonical source use rem bounds', 1)
])
edit('docs/PACKAGE_2_REVIEW.md', [
    ('Links within FAQ answers change from 12px to the 14px action role.', 'The initial Package 2 release changed links within FAQ answers from 12px to 14px. The subsequent founder-approved editorial refinement makes these 15px alongside other standalone editorial actions. See EDITORIAL_LINK_REVIEW.md for the separate scoped comparison.', 1)
])
edit('REPOSITORY_HANDOFF.md', [
    ('# StoriLeaf public frontend handoff', '# StoriLeaf public frontend handoff', 0)
]) if False else None
p = root / 'docs/EDITORIAL_LINK_REVIEW.md'
assert not p.exists()
p.write_text('''# Editorial text link refinement

19 October 2026. Founder-approved implementation scope. Final rendered acceptance remains separate.

## Scope

The founder approved 15px Manrope for standalone editorial text actions in the published homepage and editable React source. This includes See package details, Ask us a question, Explore activities, Explore guides, Browse all resources and the four actions below FAQ answers. Inline paragraph links inherit their surrounding type size. There are currently no inline paragraph anchors in the homepage; their inheritance rule is a source foundation, not invented public content.

The new editorial action token aliases the existing 15px body token. The 14px control action token stays separate, avoiding a global change to filled, outline and gold buttons. Text-action weights, colours, leading, arrows, gaps, wording and destinations are retained. Natural label widths and line boxes can grow with the approved type size. No fixed-height text containers are introduced.

Header navigation, footer navigation, footer legal utilities, currency control, newsletter controls and every button retain their existing styling. Unbuilt Activities and Resources labels remain non-interactive. Pricing keeps its previous appearance through homepage-scoped token values and original fallbacks. No HTML, JavaScript bundle, image or product claim is changed.

## Verification

The dedicated browser comparison uses the actual prior published stylesheet at 66327e0fc83e48b7547c10e3ee58f4ddf89c4f39. It measures all nine editorial labels, ordinary buttons, navigation and the complete footer at nine widths. It records real desktop/mobile screenshots, focus, text enlargement, source text-action fixtures and footer diagnostics. The earlier Package 2 comparison normalises only the newly approved action sizes, so its FAQ and other geometry assertions remain meaningful. The earlier shape comparison likewise normalises only this text-action size. Read the actual workflow run before claiming verification or live deployment.

## Footer review, not implemented

The footer headings use 11px and its navigation links 14px. The small gold headings were acting as quiet category labels, not larger section titles. The founder has asked for this hierarchy to be evaluated. Increasing headings to 15px with their existing semibold weight, keeping links at 14px regular and reviewing currency text separately is a proposal only. No footer change is authorised by the editorial-link approval.

The photograph, forest fade, footer grouping, link order, copyright and legal row remain the accepted composition. Broader native-browser zoom, physical-device review, current-page semantics and complete React parity remain separate migration work.
''')
changed.append(str(p.relative_to(root)))
for name in ['REPOSITORY_HANDOFF.md', 'docs/DECISIONS.md']:
    p = root / name
    s = p.read_text()
    note = '\n\n## Editorial action sizing, 19 October 2026\n\nThe founder approved 15px standalone editorial text actions in the static homepage and React source. Inline reading links inherit paragraph size. Navigation, footer utilities and buttons are excluded. Footer heading and currency readability is being reviewed separately, not silently changed. See ' + ('docs/' if name == 'REPOSITORY_HANDOFF.md' else '') + 'EDITORIAL_LINK_REVIEW.md for exact scope and verification. Implementation and final visual acceptance remain distinct.\n'
    p.write_text(s + note)
    changed.append(name)
folder = root / 'qa/editorial-links'
folder.mkdir(parents=True, exist_ok=True)
(folder/'changed-files.json').write_text(json.dumps(changed, indent=2))
print('Prepared only approved editorial changes', changed)
