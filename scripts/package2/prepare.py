"""Temporary reviewed Package 2 transport. Remove at publication.
Compressed JSON contains text edits, never executable code. Every original is
hash checked. Only readable resulting sources are published after browser QA.
"""
from pathlib import Path
import base64, hashlib, json, zlib
root=Path.cwd()
payload=''.join((root/f'scripts/package2/candidate.part{i}').read_text() for i in (1,2))
assert hashlib.sha256(payload.encode()).hexdigest()=='3eaecc4951e01d2419991107e30429ca96b0917203687a6031323ee57236803c','Transport checksum differs'
changes=json.loads(zlib.decompress(base64.b64decode(payload)))
prepared={}
for name,spec in changes.items():
    path=root/name
    assert path.resolve().is_relative_to(root.resolve()),'Path escapes repository'
    if spec['sha256'] is None:
        assert not path.exists(),f'New target already exists {name}'
        result=spec['content']
    else:
        original=path.read_text()
        assert hashlib.sha256(original.encode()).hexdigest()==spec['sha256'],f'Original changed {name}'
        result=original
        for start,end,replacement in reversed(spec['edits']): result=result[:start]+replacement+result[end:]
    prepared[name]=result
# Use the installed Vite transformer for real component rendering tests.
key='frontend/scripts/typography.test.mjs'
s=prepared[key]
s=s.replace("import ts from 'typescript'", "import { transformWithOxc } from 'vite'")
s=s.replace("ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })", "await transformWithOxc(source, name + '.tsx', { jsx: { runtime: 'automatic' } })")
s=s.replace('result.outputText', 'result.code').replace("process.on('exit', () => {})\n",'')
prepared[key]=s
# Closed details descendants can retain skipped style values. Measure visible
# answers after opening, and let existing transitions settle after test overrides.
key='scripts/package2/verify.mjs'
s=prepared[key]
s=s.replace("async function checkQuestions(label) {", "async function checkQuestions(label) {\n  await page.waitForTimeout(350)")
s=s.replace("  check(data.length===6", "  report.checks['questionMeasurements-'+label]=data\n  check(data.length===6")
s=s.replace("    const answer=await", "    await page.locator('.faq-item').first().evaluate(el=>el.open=true)\n    await page.waitForTimeout(350)\n    const answer=await")
s=s.replace("    const summary=page.locator('.faq-item summary').first()", "    await page.locator('.faq-item').first().evaluate(el=>el.open=false)\n    await page.waitForTimeout(200)\n    const summary=page.locator('.faq-item summary').first()")
s=s.replace("await enlargement.evaluate(el=>el.remove());report.checks", "await enlargement.evaluate(el=>el.remove());await page.waitForTimeout(350);report.checks")
prepared[key]=s
for name,result in prepared.items():
    path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(result)
folder=root/'qa/package2';folder.mkdir(parents=True,exist_ok=True)
(folder/'changed-files.json').write_text(json.dumps(list(prepared),indent=2))
print('Prepared candidate files without a commit or branch change',len(prepared))
