#!/usr/bin/env python3
"""Read-only, standard-TLS HTTP evidence for existing currency URLs.

No redirect handler automatically follows redirects. Every hop is recorded.
Each URL is attempted once in this run; HTTP/transport failures are retained.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
import json
import platform
import re
import ssl
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
BASE = 'https://storileaf.github.io/storileaf-homepage-preview'
OUT = ROOT / 'p407-currency/original-live-http.json'
ORIGINAL = ROOT / 'p407-currency/original'
CURRENT_SOURCE = '848633b1f1cb6c460e11ca680b50aeb65cb0d7f3'
DATA = (ORIGINAL / 'assets/pricing-page-eOuxT0Kj.js').read_text()
SLUGS = re.findall(r'^\t\tslug: "([^"]+)"', DATA, re.M)
assert SLUGS == ['life-story', 'travel-memoir', 'relationship-memoir', 'founders-memoir', 'parent-to-child-letters', 'celebrating-occasions']
SOURCE_HASHES = {
    name: sha256((ORIGINAL / name).read_bytes()).hexdigest()
    for name in ('index.html', '404.html', 'pricing/index.html')
}
CONTEXT = ssl.create_default_context()
assert CONTEXT.check_hostname and CONTEXT.verify_mode == ssl.CERT_REQUIRED


class ManualRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, response, code, message, headers, new_url):
        return None


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def fetch_chain(url):
    started = utc_now()
    opener = urllib.request.build_opener(ManualRedirect, urllib.request.HTTPSHandler(context=CONTEXT))
    chain, visited = [], set()
    current = url
    for _ in range(10):
        if current in visited:
            return {'requestURL': url, 'startedAt': started, 'hops': chain, 'error': {'kind': 'redirect-loop', 'url': current}}
        visited.add(current)
        request = urllib.request.Request(current, headers={
            'User-Agent': 'StoriLeaf-P4-07-authorised-HTTP-verification',
            'Accept': 'text/html',
        })
        response = None
        try:
            try:
                response = opener.open(request, timeout=30)
            except urllib.error.HTTPError as http_response:
                response = http_response
            body = response.read()
            status = response.status
            location = response.headers.get('Location')
            hop = {
                'url': current,
                'responseURL': response.geturl(),
                'status': status,
                'location': location,
                'contentType': response.headers.get('Content-Type'),
                'bodyBytes': len(body),
                'bodySHA256': sha256(body).hexdigest(),
                'headers': {name: response.headers.get(name) for name in ('Server', 'Date', 'ETag', 'Last-Modified', 'Cache-Control', 'Age', 'X-Cache')},
            }
            chain.append(hop)
            if status in (301, 302, 303, 307, 308) and location is not None:
                current = urllib.parse.urljoin(current, location)
                # These are same-origin public read-only URLs. Do not follow a
                # surprising external redirect while collecting this evidence.
                if urllib.parse.urlsplit(current).netloc != 'storileaf.github.io':
                    return {'requestURL': url, 'startedAt': started, 'hops': chain, 'error': {'kind': 'unexpected-external-redirect', 'url': current}}
                continue
            original_query = urllib.parse.urlsplit(url).query
            final_query = urllib.parse.urlsplit(current).query
            return {
                'requestURL': url, 'startedAt': started, 'finishedAt': utc_now(),
                'hops': chain, 'finalURL': current, 'finalStatus': status,
                'contentType': hop['contentType'], 'bodySHA256': hop['bodySHA256'],
                'bodyBytes': hop['bodyBytes'],
                'redirectCount': len(chain) - 1,
                'queryPreservedExactly': original_query == final_query,
                'matchesLocalOriginal': {name: hop['bodySHA256'] == digest for name, digest in SOURCE_HASHES.items()},
            }
        except Exception as error:
            return {
                'requestURL': url, 'startedAt': started, 'finishedAt': utc_now(),
                'hops': chain,
                'error': {'kind': type(error).__name__, 'message': str(error), 'url': current},
            }
        finally:
            if response is not None:
                response.close()
    return {'requestURL': url, 'startedAt': started, 'hops': chain, 'error': {'kind': 'redirect-limit', 'maximumHops': 10}}


started_at = utc_now()
baselines = {name: fetch_chain(url) for name, url in {
    'homepage': BASE + '/',
    '404Document': BASE + '/404.html',
}.items()}
queries = [{'label': 'no-query', 'query': ''}]
queries.extend({'label': slug, 'query': urllib.parse.urlencode({'keepsake': slug})} for slug in SLUGS)
queries.append({'label': 'selected-book-plus-benign-query', 'query': urllib.parse.urlencode({'keepsake': 'travel-memoir', 'verification': 'currency-documents'})})
cases = [
    {'currency': currency, 'trailingSlash': slash, 'queryVariant': query['label'],
     'url': BASE + '/pricing/' + currency + ('/' if slash else '') + ('?' + query['query'] if query['query'] else '')}
    for currency in ('inr', 'usd', 'cad', 'gbp')
    for slash in (False, True)
    for query in queries
]
assert len(cases) == 64 and len({case['url'] for case in cases}) == 64
with ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(lambda case: {**case, **fetch_chain(case['url'])}, cases))
for result in results:
    if 'bodySHA256' in result:
        result['matchesLiveBaseline'] = {
            name: result['bodySHA256'] == baseline.get('bodySHA256')
            for name, baseline in baselines.items()
        }
        result['isOriginalHomepageOr404Fallback'] = (
            result['matchesLocalOriginal']['index.html'] or
            result['matchesLocalOriginal']['404.html'] or
            any(result['matchesLiveBaseline'].values())
        )

report = {
    'schemaVersion': 1,
    'scope': 'Original live currency HTTP responses before currency-document publication; no browser rendering.',
    'sourceCommit': CURRENT_SOURCE,
    'startedAt': started_at, 'finishedAt': utc_now(),
    'environment': {
        'python': platform.python_version(), 'platform': platform.platform(),
        'ssl': ssl.OPENSSL_VERSION,
        'certificateVerification': 'ssl.create_default_context; CERT_REQUIRED; hostname verification enabled',
        'automaticRedirects': False, 'httpRetries': 0, 'maximumParallelRequests': 6,
    },
    'initialSandboxProbe': {
        'url': BASE + '/',
        'result': 'URLError: [Errno 1] Operation not permitted',
        'httpResponseReceived': False,
        'note': 'The sandbox denied the network operation. This is retained separately from the approved network run; no TLS bypass was used.',
    },
    'localOriginalSHA256': SOURCE_HASHES,
    'baselineResponses': baselines,
    'queryVariants': queries,
    'caseCount': len(results),
    'results': results,
    'summary': {
        'httpResults': sum('finalStatus' in result for result in results),
        'transportOrRedirectErrors': sum('error' in result for result in results),
        'statusCounts': {str(status): sum(result.get('finalStatus') == status for result in results) for status in sorted({result['finalStatus'] for result in results if 'finalStatus' in result})},
        'fallbackResults': sum(result.get('isOriginalHomepageOr404Fallback', False) for result in results),
        'exactQueryPreservation': sum(result.get('queryPreservedExactly', False) for result in results),
    },
}
OUT.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'saved': str(OUT), 'summary': report['summary']}, indent=2))
