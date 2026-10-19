"""Temporary transport for the reviewed Package 2 candidate. Remove at publication.
The payload is compressed JSON text edits, never executable Python. Original hashes
must match. Only the resulting readable source files are published after browser QA.
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
        for start,end,replacement in reversed(spec['edits']):
            result=result[:start]+replacement+result[end:]
    prepared[name]=result
for name,result in prepared.items():
    path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(result)
folder=root/'qa/package2';folder.mkdir(parents=True,exist_ok=True)
(folder/'changed-files.json').write_text(json.dumps(list(prepared),indent=2))
print('Prepared reviewed candidate files without a commit or branch change',len(prepared))
