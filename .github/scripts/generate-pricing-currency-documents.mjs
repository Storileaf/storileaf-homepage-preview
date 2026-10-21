#!/usr/bin/env node
/**
 * P4 07 currency-document export, derived only from the existing public runtime.
 *
 * The approved default pricing document remains the structural SSR template.
 * The pinned public catalogue supplies prices and selector labels. The existing
 * regional route supplies metadata, leaf preload and saved router identity.
 * This deliberately retains the default Life Story selection. Serving a
 * different initial book for a query string is a separate, unimplemented task.
 *
 * Usage (paths resolve from the current working directory):
 *   node .github/scripts/generate-pricing-currency-documents.mjs --check
 *   node .github/scripts/generate-pricing-currency-documents.mjs --write
 *   ... --source-root <root> --output-root <root> --report <json-path>
 *
 * No compiled asset, default pricing document or root homepage is written.
 * --check performs all generation assertions and requires byte-identical files.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const SOURCE_COMMIT = '848633b1f1cb6c460e11ca680b50aeb65cb0d7f3';
const BASE = '/storileaf-homepage-preview';
const CURRENCIES = ['inr', 'usd', 'cad', 'gbp'];
const INPUT_SHA256 = {
  'pricing/index.html': '1f2477abf7a8ad451228d0f25cb1a8516dcd322aae57dec261e8f0c18ce75f89',
  'assets/pricing-page-eOuxT0Kj.js': '6933843cad74c1e867b84d543394c8070251ca7d6777dea894efd011963f2027',
  'assets/index-DO3Vh6An.js': '07748aee103f4f4bc55a9b0479941b858c44ff62bfa835eeebad8f963f5b36a7',
  'assets/pricing._currency-D7ELIB-1.js': '089170d20cfcde4c33e3ed5bfa40e1480974eb32b56fa6a8165f1c4ad6b70709',
  'assets/pricing.index-DWapM0Qb.js': '95c713a17b15694b277e4cd600b99e29a1f21377278ce32c61a45637298ad741',
  'assets/pricing-DQxYQr2Q.js': '27b0cdd8d6f4694f41080de64251c41c8b440eeef91f04958c3976449245ab34',
  'assets/content-sections-CfrmOVRI.js': '932f30a6bac0620d6632ef017303b9303e85df7166c9a5473a1bdf429155674e',
  'assets/link-CrvydYrW.js': '2d261759e4c13f2b1ffa433ffcddcbb2053aea4a386a17a151da4c3f6da863c9',
  'assets/index-DhPZyX4z.css': '75e1550fc2a24edf5ce47f856ba7e849f1624c9526f1a4a304442bbcf74e325f',
};
const OUTPUT_SHA256 = {
  inr: '80a11555dbc15a5b8250aea7d64fb5d78da1a38235a21f3a433af40d2c66dc40',
  usd: '58cc963da4b611727beff1e7e5d62df2b66d4179b3864c22d452d4ec78cc56ba',
  cad: '0c9149e4b87e1b2cb07aaa3d7abc60fc0b6d1129354a74bed2cb5c34de74834b',
  gbp: 'eca77670149233c2727fe43870d79dcdfc7dd937cdfc3353823cbf13d9e8f246',
};

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const gitBlob = (value) => createHash('sha1').update(`blob ${Buffer.byteLength(value)}\0`).update(value).digest('hex');
const occurrences = (text, token) => text.split(token).length - 1;
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
let sourceRoot = defaultRoot;
let outputRoot = defaultRoot;
let reportPath;
let mode;
for (let index = 2; index < process.argv.length; index += 1) {
  const option = process.argv[index];
  if (option === '--write' || option === '--check') {
    assert.equal(mode, undefined, 'Specify exactly one of --write or --check.');
    mode = option.slice(2);
  } else if (['--source-root', '--output-root', '--report'].includes(option)) {
    const value = process.argv[++index];
    assert.ok(value && !value.startsWith('--'), `Missing value for ${option}.`);
    if (option === '--source-root') sourceRoot = resolve(value);
    if (option === '--output-root') outputRoot = resolve(value);
    if (option === '--report') reportPath = resolve(value);
  } else {
    throw new Error(`Unknown argument: ${option}`);
  }
}
assert.ok(mode, 'Specify --write or --check.');

const inputs = {};
const inputIdentities = {};
for (const [path, expectedHash] of Object.entries(INPUT_SHA256)) {
  const bytes = await readFile(resolve(sourceRoot, path));
  assert.equal(sha256(bytes), expectedHash, `Unexpected input bytes: ${path}. Investigate changes before updating this generator.`);
  inputs[path] = bytes.toString('utf8');
  inputIdentities[path] = { bytes: bytes.length, sha256: expectedHash, gitBlob: gitBlob(bytes) };
}

const original = inputs['pricing/index.html'];
const dataModule = inputs['assets/pricing-page-eOuxT0Kj.js'];
const routerModule = inputs['assets/index-DO3Vh6An.js'];
const linkModule = inputs['assets/link-CrvydYrW.js'];
assert.equal(occurrences(dataModule, 'var pricingCurrencies = '), 1);
const dataStart = dataModule.indexOf('var pricingCurrencies = ');
const dataEnd = dataModule.indexOf('//#endregion', dataStart);
assert.ok(dataEnd > dataStart, 'Public pricing data boundary is missing.');
const dataSource = dataModule.slice(dataStart, dataEnd);
assert.ok(!dataSource.includes('import ') && !dataSource.includes('require('));

// Evaluate only the exact hash-pinned public data declaration. Images are not
// emitted by this extraction; their inert values allow the catalogue to load.
const imageKeys = ['celebration', 'founder', 'letters', 'life', 'relationship', 'travel'];
assert.deepEqual([...new Set([...dataSource.matchAll(/images\.([A-Za-z0-9_$]+)/g)].map((match) => match[1]))].sort(), imageKeys);
const dataContext = vm.createContext({ images: Object.freeze(Object.fromEntries(imageKeys.map((key) => [key, `unchanged-public-image:${key}`]))) });
new vm.Script(`${dataSource}\nthis.extracted = JSON.stringify({pricingCurrencies, pricePrefixes, pricingBooks});`).runInContext(dataContext, { timeout: 1000 });
const { pricingCurrencies, pricePrefixes, pricingBooks } = JSON.parse(dataContext.extracted);
assert.deepEqual(pricingCurrencies.map(({ code }) => code), CURRENCIES);
assert.deepEqual(Object.keys(pricePrefixes), CURRENCIES);
assert.equal(pricingBooks.length, 6);
assert.equal(pricingBooks[0].slug, 'life-story');
assert.equal(pricingBooks[0].plans.length, 3);
const lifeStory = pricingBooks[0];
for (const book of pricingBooks) {
  for (const plan of book.plans) {
    assert.deepEqual(Object.keys(plan.prices), CURRENCIES);
    for (const currency of CURRENCIES) assert.ok(Number.isSafeInteger(plan.prices[currency]) && plan.prices[currency] > 0);
  }
}
// Keep formatting identical to the function in the pinned public catalogue.
assert.ok(dataSource.includes('return pricePrefixes[currency] + new Intl.NumberFormat(currency === "inr" ? "en-IN" : "en-GB", { maximumFractionDigits: 0 }).format(amount);'));
const displayPrice = (amount, currency) => pricePrefixes[currency] + new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-GB', { maximumFractionDigits: 0 }).format(amount);

const oldDescription = 'Compare writing time, printed copies, photographs and guidance across six StoriLeaf books.';
const regionalDescription = 'Compare fixed regional prices, writing time, printed books and guidance across all six StoriLeaf books.';
assert.ok(routerModule.includes('{ title: `StoriLeaf | ${params.currency.toUpperCase()} book packages` }'));
assert.ok(routerModule.includes(`content: "${regionalDescription}"`));
assert.ok(routerModule.includes('var Route = createFileRoute("/pricing/$currency")'));
assert.ok(linkModule.includes('var STATIC_ACTIVE_OBJECT = { className: "active" };'));
assert.ok(linkModule.includes('"data-status": "active",\n\t"aria-current": "page"'));

const oldLeafPreload = `${BASE}/assets/pricing.index-DWapM0Qb.js`;
const newLeafPreload = `${BASE}/assets/pricing._currency-D7ELIB-1.js`;
const oldLeafMatchId = '\0pricing\0\0pricing\0';
const newLeafMatchId = (currency) => `\0pricing\0$currency\0pricing\0${currency}`;
const optionsHtml = (currency) => pricingCurrencies.map(({ code, label }) => `<option value="${code}"${code === currency ? ' selected=""' : ''}>${escapeHtml(label)}</option>`).join('');
const selectors = [
  '<select id="pricing-currency-select" data-testid="pricing-currency">',
  '<select aria-label="Pricing currency">',
];
const pricesHtml = (plan, currency) => `<div class="pricing-plan-value"><strong>${escapeHtml(displayPrice(plan.prices[currency], currency))}</strong><span>${currency.toUpperCase()}<!-- --> · One-time payment</span></div>`;
const originalPricingLinks = [...original.matchAll(/<a\b[^>]*href="\/storileaf-homepage-preview\/pricing\/inr"[^>]*>Pricing<\/a>/g)].map(([match]) => match);
assert.equal(originalPricingLinks.length, 2);
assert.equal(occurrences(original, 'href="/storileaf-homepage-preview/pricing/inr"'), 2);
assert.equal(occurrences(original, '<select '), 2);
assert.equal(occurrences(original, '<div class="pricing-plan-value">'), 3);
assert.equal(occurrences(original, '<span aria-hidden="true">→</span>'), 0);

function pricingLink(originalLink, currency) {
  let link = originalLink.replace(`${BASE}/pricing/inr`, `${BASE}/pricing/${currency}`);
  assert.ok(!/\b(?:data-status|aria-current)=/.test(link));
  const end = link.indexOf('>');
  let startTag = link.slice(0, end);
  if (/\bclass="/.test(startTag)) {
    startTag = startTag.replace(/\bclass="([^"]*)"/, (_whole, value) => `class="${value} active"`);
  } else {
    startTag += ' class="active"';
  }
  return `${startTag} data-status="active" aria-current="page"${link.slice(end)}`;
}

function readRouterState(html) {
  const scripts = [...html.matchAll(/<script class="\$tsr" id="\$tsr-stream-barrier">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  const context = vm.createContext({ document: { currentScript: { remove() {} } } });
  context.self = context;
  new vm.Script(scripts[0][1]).runInContext(context, { timeout: 1000 });
  assert.equal(context.$_TSR.streamEnded, true);
  return JSON.parse(JSON.stringify(context.$_TSR.router));
}

const originalRouterState = readRouterState(original);
assert.deepEqual(Object.keys(originalRouterState.manifest.routes), ['__root__', '/pricing', '/pricing/']);
assert.deepEqual(originalRouterState.matches.map(({ i }) => i), ['__root__\0', '\0pricing\0pricing', oldLeafMatchId]);
assert.equal(originalRouterState.lastMatchId, oldLeafMatchId);
const originalIds = [...original.matchAll(/\bid="([^"]*)"/g)].map(([, value]) => value);
const outputs = [];

for (const currency of CURRENCIES) {
  let candidate = original;
  const edits = [];
  function replaceExact(label, before, after, count = 1) {
    assert.equal(occurrences(candidate, before), count, `Unexpected ${label} count for ${currency}.`);
    candidate = candidate.split(before).join(after);
    edits.push({ label, before, after, count, changed: before !== after });
  }
  replaceExact('regional title', '<title>StoriLeaf | Compare book packages</title>', `<title>StoriLeaf | ${currency.toUpperCase()} book packages</title>`);
  replaceExact('regional description', `<meta name="description" content="${oldDescription}"/>`, `<meta name="description" content="${regionalDescription}"/>`);
  replaceExact('regional leaf preloads', oldLeafPreload, newLeafPreload, 2);
  replaceExact('regional manifest route', '"/pricing/":$R[11]', '"/pricing/$currency":$R[11]');
  replaceExact('regional saved match and lastMatchId', oldLeafMatchId, newLeafMatchId(currency), 2);
  for (const selector of selectors) replaceExact('selected currency', `${selector}${optionsHtml('inr')}</select>`, `${selector}${optionsHtml(currency)}</select>`);
  for (const plan of lifeStory.plans) replaceExact(`public price for ${plan.slug}`, pricesHtml(plan, 'inr'), pricesHtml(plan, currency));
  for (const link of originalPricingLinks) replaceExact('existing Pricing link and active state', link, pricingLink(link, currency));

  // Reversing every bounded edit must recover every original byte. This is the
  // preservation assertion for all wording, geometry, images, IDs and scripts
  // outside the named currency/route substitutions.
  let reconstructed = candidate;
  for (const { label, before, after, count } of edits.toReversed()) {
    assert.equal(occurrences(reconstructed, after), count, `Ambiguous inverse edit ${label} for ${currency}.`);
    reconstructed = reconstructed.split(after).join(before);
  }
  assert.equal(reconstructed, original, `Out-of-scope document difference for ${currency}.`);
  assert.deepEqual([...candidate.matchAll(/\bid="([^"]*)"/g)].map(([, value]) => value), originalIds);
  assert.equal(occurrences(candidate, oldLeafPreload), 0);
  assert.equal(occurrences(candidate, newLeafPreload), 2);
  assert.equal(occurrences(candidate, ' selected=""'), 2);
  assert.equal(occurrences(candidate, `<option value="${currency}" selected="">`), 2);
  assert.equal(occurrences(candidate, `href="${BASE}/pricing/${currency}"`), 2);
  assert.equal(occurrences(candidate, 'data-status="active" aria-current="page"'), 2);
  assert.equal(occurrences(candidate, `${currency.toUpperCase()}<!-- --> · One-time payment`), 3);
  const state = readRouterState(candidate);
  const expectedState = structuredClone(originalRouterState);
  expectedState.manifest.routes['/pricing/$currency'] = expectedState.manifest.routes['/pricing/'];
  delete expectedState.manifest.routes['/pricing/'];
  expectedState.manifest.routes['/pricing/$currency'].preloads[0] = newLeafPreload;
  expectedState.matches[2].i = newLeafMatchId(currency);
  expectedState.lastMatchId = newLeafMatchId(currency);
  assert.deepEqual(state, expectedState);

  const path = `pricing/${currency}/index.html`;
  const bytes = Buffer.from(candidate, 'utf8');
  assert.equal(sha256(bytes), OUTPUT_SHA256[currency], `Unexpected complete output bytes for ${currency}. Investigate before changing the expected hash.`);
  outputs.push({
    currency, path, bytes, identity: {
      bytes: bytes.length, sha256: sha256(bytes), gitBlob: gitBlob(bytes),
      routeId: '/pricing/$currency', matchId: state.matches[2].i.replaceAll('\0', '/'),
      title: `StoriLeaf | ${currency.toUpperCase()} book packages`,
      selectedBook: 'life-story',
      planPrices: lifeStory.plans.map((plan) => ({ slug: plan.slug, name: plan.name, amount: plan.prices[currency], displayed: displayPrice(plan.prices[currency], currency) })),
      selectedCurrencyCount: 2, pricingLinkCount: 2,
      changes: edits.map(({ label, count, changed }) => ({ label, count, changed })),
    },
  });
}

// Validate the entire output set before writing any document.
for (const output of outputs) {
  const destination = resolve(outputRoot, output.path);
  assert.notEqual(destination, resolve(sourceRoot, 'pricing/index.html'));
  if (mode === 'check') {
    const existing = await readFile(destination);
    assert.ok(existing.equals(output.bytes), `Generated output differs: ${output.path}`);
  }
}
if (mode === 'write') {
  for (const output of outputs) {
    const destination = resolve(outputRoot, output.path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, output.bytes);
  }
}
assert.equal(sha256(await readFile(resolve(sourceRoot, 'pricing/index.html'))), INPUT_SHA256['pricing/index.html']);

const report = {
  schemaVersion: 1, task: 'P4 07 four currency documents', sourceCommit: SOURCE_COMMIT,
  mode, node: process.version, inputs: inputIdentities,
  extraction: 'Exact hash-pinned public pricing data, no private source and no compiled asset changes.',
  preservation: 'All bounded substitutions reversed to the original default HTML byte for byte; original SSR IDs and all other bytes retained.',
  defaultPricingDocumentUnchanged: true,
  selectedBookInitialRender: 'Life Story retained. Query-selected initial rendering remains a separate unresolved export problem.',
  browserAndHttpAcceptance: 'Not provided by this generator. Independent rendered, hydration, behaviour, redirect and live-response checks are required.',
  outputs: Object.fromEntries(outputs.map(({ path, identity }) => [path, identity])),
};
if (reportPath) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}
for (const { path, identity } of outputs) console.log(`${mode === 'write' ? 'Wrote' : 'Verified'} ${path} ${identity.sha256}`);
