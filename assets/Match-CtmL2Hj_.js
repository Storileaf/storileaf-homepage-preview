import { A as DEFAULT_PROTOCOL_ALLOWLIST, C as findFlatMatch, D as processRouteTree, E as processRouteMasks, F as encodePathLikeUrl, G as require_react, H as last, L as functionalUpdate, M as createControlledPromise, N as decodePath, O as createLRUCache, P as deepEqual, R as hasKeys, S as buildRouteBranch, T as findSingleMatch, U as nullReplaceEqualDeep, V as isPromise, W as replaceEqualDeep, f as cleanPath, g as joinPaths, h as interpolatePath, i as ClientOnly, j as arraysEqual, k as invariant, n as useRouter, o as require_jsx_runtime, p as compileDecodeCharMap, q as __toESM, t as useStore, u as useLayoutEffect, v as resolvePath, w as findRouteMatch, x as trimPathRight, y as trimPath, z as isDangerousProtocol } from "./useStore-DY_dpydU.js";
import { n as matchContext, o as rootRouteId, r as isRedirect } from "./matchContext-DFjqCKIt.js";
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/not-found.js
/** Determine if a value is a TanStack Router not-found error. */
function isNotFound(obj) {
	return obj?.isNotFound === true;
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/scroll-restoration.js
function getSafeSessionStorage() {
	try {
		return sessionStorage;
	} catch {
		return;
	}
}
var storageKey = "tsr-scroll-restoration-v1_3";
var safeSessionStorage = getSafeSessionStorage();
function createScrollRestorationCache() {
	try {
		return JSON.parse(safeSessionStorage?.getItem("tsr-scroll-restoration-v1_3") || "{}");
	} catch {
		return {};
	}
}
function persistScrollRestorationCache() {
	try {
		safeSessionStorage?.setItem(storageKey, JSON.stringify(scrollRestorationCache));
	} catch {}
}
var scrollRestorationCache = /* @__PURE__ */ createScrollRestorationCache();
var scrollRestorationIdAttribute = "data-scroll-restoration-id";
/**
* The default `getKey` function for `useScrollRestoration`.
* It returns the `key` from the location state or the `href` of the location.
*
* The `location.href` is used as a fallback to support the use case where the location state is not available like the initial render.
*/
var defaultGetScrollRestorationKey = (location) => {
	return location.state.__TSR_key || location.href;
};
function getScrollRestorationSelector(element) {
	const attrId = element.getAttribute(scrollRestorationIdAttribute);
	if (attrId) return `[${scrollRestorationIdAttribute}="${attrId}"]`;
	let selector = "";
	let el = element;
	let parent;
	while (parent = el.parentNode) {
		let index = 1;
		let sibling = el;
		while (sibling = sibling.previousElementSibling) index++;
		const part = `${el.localName}:nth-child(${index})`;
		selector = selector ? `${part} > ${selector}` : part;
		el = parent;
	}
	return selector;
}
var ignoreScroll = false;
var windowScrollTarget = "window";
function getElement(selector) {
	try {
		return typeof selector === "function" ? selector() : document.querySelector(selector);
	} catch {}
}
function getScrollToTopElements(scrollToTopSelectors) {
	const elements = /* @__PURE__ */ new Set();
	for (const selector of scrollToTopSelectors) {
		if (selector === windowScrollTarget) continue;
		const element = getElement(selector);
		if (element) elements.add(element);
	}
	return elements;
}
function setupScrollRestoration(router, force) {
	const shouldSetupScrollRestoration = force ?? router.options.scrollRestoration;
	const scroll = router._scroll;
	if (shouldSetupScrollRestoration) scroll.restoring = true;
	const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
	const trackedScrollTargets = /* @__PURE__ */ new Set();
	const snapshotCurrentScrollTargets = (restoreKey) => {
		const keyEntry = scrollRestorationCache[restoreKey] ||= {};
		for (const target of trackedScrollTargets) if (target === document) keyEntry[windowScrollTarget] = {
			scrollX,
			scrollY
		};
		else if (target.isConnected) keyEntry[getScrollRestorationSelector(target)] = {
			scrollX: target.scrollLeft,
			scrollY: target.scrollTop
		};
	};
	if (shouldSetupScrollRestoration && !scroll.restoration) {
		scroll.restoration = true;
		ignoreScroll = false;
		history.scrollRestoration = "manual";
		document.addEventListener("scroll", (event) => {
			if (ignoreScroll) return;
			trackedScrollTargets.add(event.target);
		}, true);
		router.subscribe("onBeforeLoad", (event) => {
			if (event.fromLocation) snapshotCurrentScrollTargets(getKey(event.fromLocation));
			trackedScrollTargets.clear();
		});
		addEventListener("pagehide", () => {
			snapshotCurrentScrollTargets(getKey(router.stores.resolvedLocation.get() ?? router.stores.location.get()));
			persistScrollRestorationCache();
		});
	}
	if (scroll.reset) return;
	scroll.reset = true;
	router.subscribe("onRendered", (event) => {
		const behavior = router.options.scrollRestorationBehavior;
		const scrollToTopSelectors = router.options.scrollToTopSelectors;
		const shouldResetScroll = scroll.next;
		const hashNavigation = scroll.hash;
		let scrollToTopElements;
		trackedScrollTargets.clear();
		scroll.next = true;
		scroll.hash = false;
		if (typeof router.options.scrollRestoration === "function" && !router.options.scrollRestoration({ location: router.latestLocation })) return;
		const cacheKey = getKey(event.toLocation);
		const fromCacheKey = event.fromLocation && getKey(event.fromLocation);
		if (scroll.restoring && fromCacheKey && fromCacheKey !== cacheKey) {
			const fromElementEntries = scrollRestorationCache[fromCacheKey];
			if (fromElementEntries) {
				let toElementEntries = scrollRestorationCache[cacheKey];
				for (const elementSelector in fromElementEntries) {
					if (elementSelector === windowScrollTarget) {
						if (shouldResetScroll) continue;
					} else {
						const element = getElement(elementSelector);
						if (!element) continue;
						if (shouldResetScroll && scrollToTopSelectors) {
							scrollToTopElements ??= getScrollToTopElements(scrollToTopSelectors);
							if (scrollToTopElements.has(element)) continue;
						}
					}
					if (!toElementEntries) toElementEntries = scrollRestorationCache[cacheKey] = {};
					toElementEntries[elementSelector] ??= fromElementEntries[elementSelector];
				}
			}
		}
		ignoreScroll = true;
		try {
			const hash = event.toLocation.hash;
			const hashScrollIntoViewOptions = event.toLocation.state.__hashScrollIntoViewOptions ?? true;
			let windowRestored = false;
			if (shouldResetScroll) {
				if (!hash && scrollToTopSelectors) scrollToTopElements ??= getScrollToTopElements(scrollToTopSelectors);
				const skipWindowRestore = hash && hashScrollIntoViewOptions && hashNavigation;
				const elementEntries = scroll.restoring ? scrollRestorationCache[cacheKey] : void 0;
				if (elementEntries) for (const elementSelector in elementEntries) {
					const { scrollX, scrollY } = elementEntries[elementSelector];
					if (elementSelector === windowScrollTarget) {
						if (skipWindowRestore) continue;
						scrollTo({
							top: scrollY,
							left: scrollX,
							behavior
						});
						windowRestored = true;
					} else {
						const element = getElement(elementSelector);
						if (element) {
							element.scrollLeft = scrollX;
							element.scrollTop = scrollY;
							scrollToTopElements?.delete(element);
						}
					}
				}
				if (!hash) {
					const scrollOptions = {
						top: 0,
						left: 0,
						behavior
					};
					if (!windowRestored) scrollTo(scrollOptions);
					if (scrollToTopElements) for (const element of scrollToTopElements) element.scrollTo(scrollOptions);
				}
			}
			if (!windowRestored && hash && hashScrollIntoViewOptions) document.getElementById(hash)?.scrollIntoView(hashScrollIntoViewOptions);
		} finally {
			ignoreScroll = false;
		}
	});
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/qss.js
/**
* Program is a reimplementation of the `qss` package:
* Copyright (c) Luke Edwards luke.edwards05@gmail.com, MIT License
* https://github.com/lukeed/qss/blob/master/license.md
*
* This reimplementation uses modern browser APIs
* (namely URLSearchParams) and TypeScript while still
* maintaining the original functionality and interface.
*
* Update: this implementation has also been mangled to
* fit exactly our use-case (single value per key in encoding).
*/
/**
* Encodes an object into a query string.
* @param obj - The object to encode into a query string.
* @param stringify - An optional custom stringify function.
* @returns The encoded query string.
* @example
* ```
* // Example input: encode({ token: 'foo', key: 'value' })
* // Expected output: "token=foo&key=value"
* ```
*/
function encode(obj, stringify = String) {
	const result = new URLSearchParams();
	for (const key in obj) {
		const val = obj[key];
		if (val !== void 0) result.set(key, stringify(val));
	}
	return result.toString();
}
/**
* Converts a string value to its appropriate type (string, number, boolean).
* @param mix - The string value to convert.
* @returns The converted value.
* @example
* // Example input: toValue("123")
* // Expected output: 123
*/
function toValue(str) {
	if (!str) return "";
	if (str === "false") return false;
	if (str === "true") return true;
	return +str * 0 === 0 && +str + "" === str ? +str : str;
}
/**
* Decodes a query string into an object.
* @param str - The query string to decode.
* @returns The decoded key-value pairs in an object format.
* @example
* // Example input: decode("token=foo&key=value")
* // Expected output: { "token": "foo", "key": "value" }
*/
function decode(str) {
	const searchParams = new URLSearchParams(str);
	const result = Object.create(null);
	for (const [key, value] of searchParams.entries()) {
		const previousValue = result[key];
		if (previousValue == null) result[key] = toValue(value);
		else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
		else result[key] = [previousValue, toValue(value)];
	}
	return result;
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/searchParams.js
/** Default `parseSearch` that strips leading '?' and JSON-parses values. */
var defaultParseSearch = parseSearchWith(JSON.parse);
/** Default `stringifySearch` using JSON.stringify for complex values. */
var defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
/**
* Build a `parseSearch` function using a provided JSON-like parser.
*
* The returned function strips a leading `?`, decodes values, and attempts to
* JSON-parse string values using the given `parser`.
*
* @param parser Function to parse a string value (e.g. `JSON.parse`).
* @returns A `parseSearch` function compatible with `Router` options.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-search-param-serialization
*/
function parseSearchWith(parser) {
	return (searchStr) => {
		if (searchStr[0] === "?") searchStr = searchStr.substring(1);
		const query = decode(searchStr);
		for (const key in query) {
			const value = query[key];
			if (typeof value === "string") try {
				query[key] = parser(value);
			} catch (_err) {}
		}
		return query;
	};
}
/**
* Build a `stringifySearch` function using a provided serializer.
*
* Non-primitive values are serialized with `stringify`. If a `parser` is
* supplied, string values that are parseable are re-serialized to ensure
* symmetry with `parseSearch`.
*
* @param stringify Function to serialize a value (e.g. `JSON.stringify`).
* @param parser Optional parser to detect parseable strings.
* @returns A `stringifySearch` function compatible with `Router` options.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-search-param-serialization
*/
function stringifySearchWith(stringify, parser) {
	const hasParser = typeof parser === "function";
	function stringifyValue(val) {
		if (typeof val === "object" && val !== null) try {
			return stringify(val);
		} catch (_err) {}
		else if (hasParser && typeof val === "string") try {
			parser(val);
			return stringify(val);
		} catch (_err) {}
		return val;
	}
	return (search) => {
		const searchStr = encode(search, stringifyValue);
		return searchStr ? `?${searchStr}` : "";
	};
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/rewrite.js
/** Compose multiple rewrite pairs into a single in/out rewrite. */
function composeRewrites(rewrites) {
	return {
		input: ({ url }) => {
			for (const rewrite of rewrites) url = executeRewriteInput(rewrite, url);
			return url;
		},
		output: ({ url }) => {
			for (let i = rewrites.length - 1; i >= 0; i--) url = executeRewriteOutput(rewrites[i], url);
			return url;
		}
	};
}
/** Create a rewrite pair that strips/adds a basepath on input/output. */
function rewriteBasepath(opts) {
	const trimmedBasepath = trimPath(opts.basepath);
	const normalizedBasepath = `/${trimmedBasepath}`;
	const checkBasepath = opts.caseSensitive ? normalizedBasepath : normalizedBasepath.toLowerCase();
	const checkBasepathWithSlash = `${checkBasepath}/`;
	return {
		input: ({ url }) => {
			const pathname = opts.caseSensitive ? url.pathname : url.pathname.toLowerCase();
			if (pathname === checkBasepath) url.pathname = "/";
			else if (pathname.startsWith(checkBasepathWithSlash)) url.pathname = url.pathname.slice(normalizedBasepath.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = joinPaths([
				"/",
				trimmedBasepath,
				url.pathname
			]);
			return url;
		}
	};
}
/** Execute a location input rewrite if provided. */
function executeRewriteInput(rewrite, url) {
	const res = rewrite?.input?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
/** Execute a location output rewrite if provided. */
function executeRewriteOutput(rewrite, url) {
	const res = rewrite?.output?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/stores.js
/** SSR non-reactive createMutableStore */
function createNonReactiveMutableStore(initialValue) {
	let value = initialValue;
	return {
		get() {
			return value;
		},
		set(nextOrUpdater) {
			value = functionalUpdate(nextOrUpdater, value);
		}
	};
}
/** SSR non-reactive createReadonlyStore */
function createNonReactiveReadonlyStore(read) {
	return { get() {
		return read();
	} };
}
function createRouterStores(initialState, config) {
	const { createMutableStore, createReadonlyStore, batch, init } = config;
	const matchStores = /* @__PURE__ */ new Map();
	const pendingMatchStores = /* @__PURE__ */ new Map();
	const cachedMatchStores = /* @__PURE__ */ new Map();
	const status = createMutableStore(initialState.status);
	const loadedAt = createMutableStore(initialState.loadedAt);
	const isLoading = createMutableStore(initialState.isLoading);
	const isTransitioning = createMutableStore(initialState.isTransitioning);
	const location = createMutableStore(initialState.location);
	const resolvedLocation = createMutableStore(initialState.resolvedLocation);
	const statusCode = createMutableStore(initialState.statusCode);
	const redirect = createMutableStore(initialState.redirect);
	const matchesId = createMutableStore([]);
	const pendingIds = createMutableStore([]);
	const cachedIds = createMutableStore([]);
	const matches = createReadonlyStore(() => readPoolMatches(matchStores, matchesId.get()));
	const pendingMatches = createReadonlyStore(() => readPoolMatches(pendingMatchStores, pendingIds.get()));
	const cachedMatches = createReadonlyStore(() => readPoolMatches(cachedMatchStores, cachedIds.get()));
	const firstId = createReadonlyStore(() => matchesId.get()[0]);
	const hasPending = createReadonlyStore(() => matchesId.get().some((matchId) => {
		return matchStores.get(matchId)?.get().status === "pending";
	}));
	const matchRouteDeps = createReadonlyStore(() => ({
		locationHref: location.get().href,
		resolvedLocationHref: resolvedLocation.get()?.href,
		status: status.get()
	}));
	const __store = createReadonlyStore(() => ({
		status: status.get(),
		loadedAt: loadedAt.get(),
		isLoading: isLoading.get(),
		isTransitioning: isTransitioning.get(),
		matches: matches.get(),
		location: location.get(),
		resolvedLocation: resolvedLocation.get(),
		statusCode: statusCode.get(),
		redirect: redirect.get()
	}));
	const matchStoreByRouteIdCache = createLRUCache(64);
	function getRouteMatchStore(routeId) {
		let cached = matchStoreByRouteIdCache.get(routeId);
		if (!cached) {
			cached = createReadonlyStore(() => {
				const ids = matchesId.get();
				for (const id of ids) {
					const matchStore = matchStores.get(id);
					if (matchStore && matchStore.routeId === routeId) return matchStore.get();
				}
			});
			matchStoreByRouteIdCache.set(routeId, cached);
		}
		return cached;
	}
	const store = {
		status,
		loadedAt,
		isLoading,
		isTransitioning,
		location,
		resolvedLocation,
		statusCode,
		redirect,
		matchesId,
		pendingIds,
		cachedIds,
		matches,
		pendingMatches,
		cachedMatches,
		firstId,
		hasPending,
		matchRouteDeps,
		matchStores,
		pendingMatchStores,
		cachedMatchStores,
		__store,
		getRouteMatchStore,
		setMatches,
		setPending,
		setCached
	};
	setMatches(initialState.matches);
	init?.(store);
	function setMatches(nextMatches) {
		reconcileMatchPool(nextMatches, matchStores, matchesId, createMutableStore, batch);
	}
	function setPending(nextMatches) {
		reconcileMatchPool(nextMatches, pendingMatchStores, pendingIds, createMutableStore, batch);
	}
	function setCached(nextMatches) {
		reconcileMatchPool(nextMatches, cachedMatchStores, cachedIds, createMutableStore, batch);
	}
	return store;
}
function readPoolMatches(pool, ids) {
	const matches = [];
	for (const id of ids) {
		const matchStore = pool.get(id);
		if (matchStore) matches.push(matchStore.get());
	}
	return matches;
}
function reconcileMatchPool(nextMatches, pool, idStore, createMutableStore, batch) {
	const nextIds = nextMatches.map((d) => d.id);
	const nextIdSet = new Set(nextIds);
	batch(() => {
		for (const id of pool.keys()) if (!nextIdSet.has(id)) pool.delete(id);
		for (const nextMatch of nextMatches) {
			const existing = pool.get(nextMatch.id);
			if (!existing) {
				const matchStore = createMutableStore(nextMatch);
				matchStore.routeId = nextMatch.routeId;
				pool.set(nextMatch.id, matchStore);
				continue;
			}
			existing.routeId = nextMatch.routeId;
			if (existing.get() !== nextMatch) existing.set(nextMatch);
		}
		if (!arraysEqual(idStore.get(), nextIds)) idStore.set(nextIds);
	});
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/load-matches.js
var triggerOnReady = (inner) => {
	if (!inner.rendered) {
		inner.rendered = true;
		return inner.onReady?.();
	}
};
var hasForcePendingActiveMatch = (router) => {
	return router.stores.matchesId.get().some((matchId) => {
		return router.stores.matchStores.get(matchId)?.get()._forcePending;
	});
};
var resolvePreload = (inner, matchId) => {
	return !!(inner.preload && !inner.router.stores.matchStores.has(matchId));
};
/**
* Builds the accumulated context from router options and all matches up to (and optionally including) the given index.
* Merges __routeContext and __beforeLoadContext from each match.
*/
var buildMatchContext = (inner, index, includeCurrentMatch = true) => {
	const context = { ...inner.router.options.context ?? {} };
	const end = includeCurrentMatch ? index : index - 1;
	for (let i = 0; i <= end; i++) {
		const innerMatch = inner.matches[i];
		if (!innerMatch) continue;
		const m = inner.router.getMatch(innerMatch.id);
		if (!m) continue;
		Object.assign(context, m.__routeContext, m.__beforeLoadContext);
	}
	return context;
};
var getNotFoundBoundaryIndex = (inner, err) => {
	if (!inner.matches.length) return;
	const requestedRouteId = err.routeId;
	const matchedRootIndex = inner.matches.findIndex((m) => m.routeId === inner.router.routeTree.id);
	const rootIndex = matchedRootIndex >= 0 ? matchedRootIndex : 0;
	let startIndex = requestedRouteId ? inner.matches.findIndex((match) => match.routeId === requestedRouteId) : inner.firstBadMatchIndex ?? inner.matches.length - 1;
	if (startIndex < 0) startIndex = rootIndex;
	for (let i = startIndex; i >= 0; i--) {
		const match = inner.matches[i];
		if (inner.router.looseRoutesById[match.routeId].options.notFoundComponent) return i;
	}
	return requestedRouteId ? startIndex : rootIndex;
};
var handleRedirectAndNotFound = (inner, match, err) => {
	if (!isRedirect(err) && !isNotFound(err)) return;
	if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
	if (match) {
		match._nonReactive.beforeLoadPromise?.resolve();
		match._nonReactive.loaderPromise?.resolve();
		match._nonReactive.beforeLoadPromise = void 0;
		match._nonReactive.loaderPromise = void 0;
		match._nonReactive.error = err;
		inner.updateMatch(match.id, (prev) => ({
			...prev,
			status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : prev.status === "pending" ? "success" : prev.status,
			context: buildMatchContext(inner, match.index),
			isFetching: false,
			error: err
		}));
		if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
		match._nonReactive.loadPromise?.resolve();
	}
	if (isRedirect(err)) {
		inner.rendered = true;
		err.options._fromLocation = inner.location;
		err.redirectHandled = true;
		err = inner.router.resolveRedirect(err);
	}
	throw err;
};
var shouldSkipLoader = (inner, matchId) => {
	const match = inner.router.getMatch(matchId);
	if (!match) return true;
	if (match._nonReactive.dehydrated) return true;
	return false;
};
var syncMatchContext = (inner, matchId, index) => {
	const nextContext = buildMatchContext(inner, index);
	inner.updateMatch(matchId, (prev) => {
		return {
			...prev,
			context: nextContext
		};
	});
};
var handleSerialError = (inner, index, err) => {
	const { id: matchId, routeId } = inner.matches[index];
	const route = inner.router.looseRoutesById[routeId];
	if (err instanceof Promise) throw err;
	inner.firstBadMatchIndex ??= index;
	handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
	try {
		route.options.onError?.(err);
	} catch (errorHandlerErr) {
		err = errorHandlerErr;
		handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
	}
	inner.updateMatch(matchId, (prev) => {
		prev._nonReactive.beforeLoadPromise?.resolve();
		prev._nonReactive.beforeLoadPromise = void 0;
		prev._nonReactive.loadPromise?.resolve();
		return {
			...prev,
			error: err,
			status: "error",
			isFetching: false,
			updatedAt: Date.now(),
			abortController: new AbortController()
		};
	});
	if (!inner.preload && !isRedirect(err) && !isNotFound(err)) inner.serialError ??= err;
};
var setupPendingTimeout = (inner, matchId, route, match) => {
	if (match._nonReactive.pendingTimeout !== void 0) return;
	const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
	if (!!(inner.onReady && !resolvePreload(inner, matchId) && (route.options.loader || route.options.beforeLoad || routeNeedsPreload(route)) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? inner.router.options?.defaultPendingComponent))) {
		const pendingTimeout = setTimeout(() => {
			triggerOnReady(inner);
		}, pendingMs);
		match._nonReactive.pendingTimeout = pendingTimeout;
	}
};
var preBeforeLoadSetup = (inner, matchId, route) => {
	const existingMatch = inner.router.getMatch(matchId);
	if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
	setupPendingTimeout(inner, matchId, route, existingMatch);
	const then = () => {
		const match = inner.router.getMatch(matchId);
		if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
	};
	return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
var executeBeforeLoad = (inner, matchId, index, route) => {
	const match = inner.router.getMatch(matchId);
	let prevLoadPromise = match._nonReactive.loadPromise;
	match._nonReactive.loadPromise = createControlledPromise(() => {
		prevLoadPromise?.resolve();
		prevLoadPromise = void 0;
	});
	const { paramsError, searchError } = match;
	if (paramsError) handleSerialError(inner, index, paramsError);
	if (searchError) handleSerialError(inner, index, searchError);
	setupPendingTimeout(inner, matchId, route, match);
	const abortController = new AbortController();
	let isPending = false;
	const pending = () => {
		if (isPending) return;
		isPending = true;
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: "beforeLoad",
			fetchCount: prev.fetchCount + 1,
			abortController
		}));
	};
	const resolve = () => {
		match._nonReactive.beforeLoadPromise?.resolve();
		match._nonReactive.beforeLoadPromise = void 0;
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: false
		}));
	};
	if (!route.options.beforeLoad) {
		inner.router.batch(() => {
			pending();
			resolve();
		});
		return;
	}
	match._nonReactive.beforeLoadPromise = createControlledPromise();
	const context = {
		...buildMatchContext(inner, index, false),
		...match.__routeContext
	};
	const { search, params, cause } = match;
	const preload = resolvePreload(inner, matchId);
	const beforeLoadFnContext = {
		search,
		abortController,
		params,
		preload,
		context,
		location: inner.location,
		navigate: (opts) => inner.router.navigate({
			...opts,
			_fromLocation: inner.location
		}),
		buildLocation: inner.router.buildLocation,
		cause: preload ? "preload" : cause,
		matches: inner.matches,
		routeId: route.id,
		...inner.router.options.additionalContext
	};
	const updateContext = (beforeLoadContext) => {
		if (beforeLoadContext === void 0) {
			inner.router.batch(() => {
				pending();
				resolve();
			});
			return;
		}
		if (isRedirect(beforeLoadContext) || isNotFound(beforeLoadContext)) {
			pending();
			handleSerialError(inner, index, beforeLoadContext);
		}
		inner.router.batch(() => {
			pending();
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				__beforeLoadContext: beforeLoadContext
			}));
			resolve();
		});
	};
	let beforeLoadContext;
	try {
		beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
		if (isPromise(beforeLoadContext)) {
			pending();
			return beforeLoadContext.catch((err) => {
				handleSerialError(inner, index, err);
			}).then(updateContext);
		}
	} catch (err) {
		pending();
		handleSerialError(inner, index, err);
	}
	updateContext(beforeLoadContext);
};
var handleBeforeLoad = (inner, index) => {
	const { id: matchId, routeId } = inner.matches[index];
	const route = inner.router.looseRoutesById[routeId];
	const serverSsr = () => {
		return queueExecution();
	};
	const execute = () => executeBeforeLoad(inner, matchId, index, route);
	const queueExecution = () => {
		if (shouldSkipLoader(inner, matchId)) return;
		const result = preBeforeLoadSetup(inner, matchId, route);
		return isPromise(result) ? result.then(execute) : execute();
	};
	return serverSsr();
};
var executeHead = (inner, matchId, route) => {
	const match = inner.router.getMatch(matchId);
	if (!match) return;
	if (!route.options.head && !route.options.scripts && !route.options.headers) return;
	const assetContext = {
		ssr: inner.router.options.ssr,
		matches: inner.matches,
		match,
		params: match.params,
		loaderData: match.loaderData
	};
	return Promise.all([
		route.options.head?.(assetContext),
		route.options.scripts?.(assetContext),
		route.options.headers?.(assetContext)
	]).then(([headFnContent, scripts, headers]) => {
		return {
			meta: headFnContent?.meta,
			links: headFnContent?.links,
			headScripts: headFnContent?.scripts,
			headers,
			scripts,
			styles: headFnContent?.styles
		};
	});
};
var getLoaderContext = (inner, matchPromises, matchId, index, route) => {
	const parentMatchPromise = matchPromises[index - 1];
	const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
	const context = buildMatchContext(inner, index);
	const preload = resolvePreload(inner, matchId);
	return {
		params,
		deps: loaderDeps,
		preload: !!preload,
		parentMatchPromise,
		abortController,
		context,
		location: inner.location,
		navigate: (opts) => inner.router.navigate({
			...opts,
			_fromLocation: inner.location
		}),
		cause: preload ? "preload" : cause,
		route,
		...inner.router.options.additionalContext
	};
};
var runLoader = async (inner, matchPromises, matchId, index, route) => {
	try {
		const match = inner.router.getMatch(matchId);
		try {
			loadRouteChunk(route);
			const routeLoader = route.options.loader;
			const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
			const loaderResult = loader?.(getLoaderContext(inner, matchPromises, matchId, index, route));
			const loaderResultIsPromise = !!loader && isPromise(loaderResult);
			if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
				...prev,
				isFetching: "loader"
			}));
			if (loader) {
				const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
				handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
				if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
					...prev,
					loaderData
				}));
			}
			if (route._lazyPromise) await route._lazyPromise;
			const pendingPromise = match._nonReactive.minPendingPromise;
			if (pendingPromise) await pendingPromise;
			if (route._componentsPromise) await route._componentsPromise;
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				error: void 0,
				context: buildMatchContext(inner, index),
				status: "success",
				isFetching: false,
				updatedAt: Date.now()
			}));
		} catch (e) {
			let error = e;
			if (error?.name === "AbortError") {
				if (match.abortController.signal.aborted) {
					match._nonReactive.loaderPromise?.resolve();
					match._nonReactive.loaderPromise = void 0;
					return;
				}
				inner.updateMatch(matchId, (prev) => ({
					...prev,
					status: prev.status === "pending" ? "success" : prev.status,
					isFetching: false,
					context: buildMatchContext(inner, index)
				}));
				return;
			}
			const pendingPromise = match._nonReactive.minPendingPromise;
			if (pendingPromise) await pendingPromise;
			if (isNotFound(e)) await route.options.notFoundComponent?.preload?.();
			handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
			try {
				route.options.onError?.(e);
			} catch (onErrorError) {
				error = onErrorError;
				handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
			}
			if (!isRedirect(error) && !isNotFound(error)) await loadRouteChunk(route, ["errorComponent"]);
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				error,
				context: buildMatchContext(inner, index),
				status: "error",
				isFetching: false
			}));
		}
	} catch (err) {
		const match = inner.router.getMatch(matchId);
		if (match) match._nonReactive.loaderPromise = void 0;
		handleRedirectAndNotFound(inner, match, err);
	}
};
var loadRouteMatch = async (inner, matchPromises, index) => {
	async function handleLoader(preload, prevMatch, previousRouteMatchId, match, route) {
		const age = Date.now() - prevMatch.updatedAt;
		const staleAge = preload ? route.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
		const shouldReloadOption = route.options.shouldReload;
		const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchPromises, matchId, index, route)) : shouldReloadOption;
		const { status, invalid } = match;
		const staleMatchShouldReload = age >= staleAge && (!!inner.forceStaleReload || match.cause === "enter" || previousRouteMatchId !== void 0 && previousRouteMatchId !== match.id);
		loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? staleMatchShouldReload));
		if (preload && route.options.preload === false) {} else if (loaderShouldRunAsync && !inner.sync && shouldReloadInBackground) {
			loaderIsRunningAsync = true;
			(async () => {
				try {
					await runLoader(inner, matchPromises, matchId, index, route);
					const match = inner.router.getMatch(matchId);
					match._nonReactive.loaderPromise?.resolve();
					match._nonReactive.loadPromise?.resolve();
					match._nonReactive.loaderPromise = void 0;
					match._nonReactive.loadPromise = void 0;
				} catch (err) {
					if (isRedirect(err)) await inner.router.navigate(err.options);
				}
			})();
		} else if (status !== "success" || loaderShouldRunAsync) await runLoader(inner, matchPromises, matchId, index, route);
		else syncMatchContext(inner, matchId, index);
	}
	const { id: matchId, routeId } = inner.matches[index];
	let loaderShouldRunAsync = false;
	let loaderIsRunningAsync = false;
	const route = inner.router.looseRoutesById[routeId];
	const routeLoader = route.options.loader;
	const shouldReloadInBackground = ((typeof routeLoader === "function" ? void 0 : routeLoader?.staleReloadMode) ?? inner.router.options.defaultStaleReloadMode) !== "blocking";
	if (shouldSkipLoader(inner, matchId)) {
		if (!inner.router.getMatch(matchId)) return inner.matches[index];
		syncMatchContext(inner, matchId, index);
	} else {
		const prevMatch = inner.router.getMatch(matchId);
		const activeIdAtIndex = inner.router.stores.matchesId.get()[index];
		const previousRouteMatchId = (activeIdAtIndex && inner.router.stores.matchStores.get(activeIdAtIndex) || null)?.routeId === routeId ? activeIdAtIndex : inner.router.stores.matches.get().find((d) => d.routeId === routeId)?.id;
		const preload = resolvePreload(inner, matchId);
		if (prevMatch._nonReactive.loaderPromise) {
			if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload && shouldReloadInBackground) return prevMatch;
			await prevMatch._nonReactive.loaderPromise;
			const match = inner.router.getMatch(matchId);
			const error = match._nonReactive.error || match.error;
			if (error) handleRedirectAndNotFound(inner, match, error);
			if (match.status === "pending") await handleLoader(preload, prevMatch, previousRouteMatchId, match, route);
		} else {
			const nextPreload = preload && !inner.router.stores.matchStores.has(matchId);
			const match = inner.router.getMatch(matchId);
			match._nonReactive.loaderPromise = createControlledPromise();
			if (nextPreload !== match.preload) inner.updateMatch(matchId, (prev) => ({
				...prev,
				preload: nextPreload
			}));
			await handleLoader(preload, prevMatch, previousRouteMatchId, match, route);
		}
	}
	const match = inner.router.getMatch(matchId);
	if (!loaderIsRunningAsync) {
		match._nonReactive.loaderPromise?.resolve();
		match._nonReactive.loadPromise?.resolve();
		match._nonReactive.loadPromise = void 0;
	}
	clearTimeout(match._nonReactive.pendingTimeout);
	match._nonReactive.pendingTimeout = void 0;
	if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
	match._nonReactive.dehydrated = void 0;
	const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
	if (nextIsFetching !== match.isFetching || match.invalid !== false) {
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: nextIsFetching,
			invalid: false
		}));
		return inner.router.getMatch(matchId);
	} else return match;
};
async function loadMatches(arg) {
	const inner = arg;
	const matchPromises = [];
	if (hasForcePendingActiveMatch(inner.router)) triggerOnReady(inner);
	let beforeLoadNotFound;
	for (let i = 0; i < inner.matches.length; i++) {
		try {
			const beforeLoad = handleBeforeLoad(inner, i);
			if (isPromise(beforeLoad)) await beforeLoad;
		} catch (err) {
			if (isRedirect(err)) throw err;
			if (isNotFound(err)) beforeLoadNotFound = err;
			else if (!inner.preload) throw err;
			break;
		}
		if (inner.serialError || inner.firstBadMatchIndex != null) break;
	}
	const baseMaxIndexExclusive = inner.firstBadMatchIndex ?? inner.matches.length;
	const boundaryIndex = beforeLoadNotFound && !inner.preload ? getNotFoundBoundaryIndex(inner, beforeLoadNotFound) : void 0;
	const maxIndexExclusive = beforeLoadNotFound && inner.preload ? 0 : boundaryIndex !== void 0 ? Math.min(boundaryIndex + 1, baseMaxIndexExclusive) : baseMaxIndexExclusive;
	let firstNotFound;
	let firstUnhandledRejection;
	for (let i = 0; i < maxIndexExclusive; i++) matchPromises.push(loadRouteMatch(inner, matchPromises, i));
	try {
		await Promise.all(matchPromises);
	} catch {
		const settled = await Promise.allSettled(matchPromises);
		for (const result of settled) {
			if (result.status !== "rejected") continue;
			const reason = result.reason;
			if (isRedirect(reason)) throw reason;
			if (isNotFound(reason)) firstNotFound ??= reason;
			else firstUnhandledRejection ??= reason;
		}
		if (firstUnhandledRejection !== void 0) throw firstUnhandledRejection;
	}
	const notFoundToThrow = firstNotFound ?? (beforeLoadNotFound && !inner.preload ? beforeLoadNotFound : void 0);
	let headMaxIndex = inner.firstBadMatchIndex !== void 0 ? inner.firstBadMatchIndex : inner.matches.length - 1;
	if (!notFoundToThrow && beforeLoadNotFound && inner.preload) return inner.matches;
	if (notFoundToThrow) {
		const renderedBoundaryIndex = getNotFoundBoundaryIndex(inner, notFoundToThrow);
		if (renderedBoundaryIndex === void 0) invariant();
		const boundaryMatch = inner.matches[renderedBoundaryIndex];
		const boundaryRoute = inner.router.looseRoutesById[boundaryMatch.routeId];
		const defaultNotFoundComponent = inner.router.options?.defaultNotFoundComponent;
		if (!boundaryRoute.options.notFoundComponent && defaultNotFoundComponent) boundaryRoute.options.notFoundComponent = defaultNotFoundComponent;
		notFoundToThrow.routeId = boundaryMatch.routeId;
		const boundaryIsRoot = boundaryMatch.routeId === inner.router.routeTree.id;
		inner.updateMatch(boundaryMatch.id, (prev) => ({
			...prev,
			...boundaryIsRoot ? {
				status: "success",
				globalNotFound: true,
				error: void 0
			} : {
				status: "notFound",
				error: notFoundToThrow
			},
			isFetching: false
		}));
		headMaxIndex = renderedBoundaryIndex;
		await loadRouteChunk(boundaryRoute, ["notFoundComponent"]);
	} else if (!inner.preload) {
		const rootMatch = inner.matches[0];
		if (!rootMatch.globalNotFound) {
			if (inner.router.getMatch(rootMatch.id)?.globalNotFound) inner.updateMatch(rootMatch.id, (prev) => ({
				...prev,
				globalNotFound: false,
				error: void 0
			}));
		}
	}
	if (inner.serialError && inner.firstBadMatchIndex !== void 0) {
		const errorRoute = inner.router.looseRoutesById[inner.matches[inner.firstBadMatchIndex].routeId];
		await loadRouteChunk(errorRoute, ["errorComponent"]);
	}
	for (let i = 0; i <= headMaxIndex; i++) {
		const { id: matchId, routeId } = inner.matches[i];
		const route = inner.router.looseRoutesById[routeId];
		try {
			const headResult = executeHead(inner, matchId, route);
			if (headResult) {
				const head = await headResult;
				inner.updateMatch(matchId, (prev) => ({
					...prev,
					...head
				}));
			}
		} catch (err) {
			console.error(`Error executing head for route ${routeId}:`, err);
		}
	}
	const readyPromise = triggerOnReady(inner);
	if (isPromise(readyPromise)) await readyPromise;
	if (notFoundToThrow) throw notFoundToThrow;
	if (inner.serialError && !inner.preload && !inner.onReady) throw inner.serialError;
	return inner.matches;
}
function preloadRouteComponents(route, componentTypesToLoad) {
	const preloads = componentTypesToLoad.map((type) => route.options[type]?.preload?.()).filter(Boolean);
	if (preloads.length === 0) return void 0;
	return Promise.all(preloads);
}
function loadRouteChunk(route, componentTypesToLoad = componentTypes) {
	if (!route._lazyLoaded && route._lazyPromise === void 0) if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
		const { id: _id, ...options } = lazyRoute.options;
		Object.assign(route.options, options);
		route._lazyLoaded = true;
		route._lazyPromise = void 0;
	});
	else route._lazyLoaded = true;
	const runAfterLazy = () => route._componentsLoaded ? void 0 : componentTypesToLoad === componentTypes ? (() => {
		if (route._componentsPromise === void 0) {
			const componentsPromise = preloadRouteComponents(route, componentTypes);
			if (componentsPromise) route._componentsPromise = componentsPromise.then(() => {
				route._componentsLoaded = true;
				route._componentsPromise = void 0;
			});
			else route._componentsLoaded = true;
		}
		return route._componentsPromise;
	})() : preloadRouteComponents(route, componentTypesToLoad);
	return route._lazyPromise ? route._lazyPromise.then(runAfterLazy) : runAfterLazy();
}
function routeNeedsPreload(route) {
	for (const componentType of componentTypes) if (route.options[componentType]?.preload) return true;
	return false;
}
var componentTypes = [
	"component",
	"errorComponent",
	"pendingComponent",
	"notFoundComponent"
];
//#endregion
//#region ../../home/user/node_modules/@tanstack/history/dist/esm/index.js
var stateIndexKey = "__TSR_index";
var popStateEvent = "popstate";
var beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
	let location = opts.getLocation();
	const subscribers = /* @__PURE__ */ new Set();
	const notify = (action) => {
		location = opts.getLocation();
		subscribers.forEach((subscriber) => subscriber({
			location,
			action
		}));
	};
	const handleIndexChange = (action) => {
		if (opts.notifyOnIndexChange ?? true) notify(action);
		else location = opts.getLocation();
	};
	const tryNavigation = async ({ task, navigateOpts, ...actionInfo }) => {
		if (navigateOpts?.ignoreBlocker ?? false) {
			task();
			return;
		}
		const blockers = opts.getBlockers?.() ?? [];
		const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
		if (typeof document !== "undefined" && blockers.length && isPushOrReplace) for (const blocker of blockers) {
			const nextLocation = parseHref(actionInfo.path, actionInfo.state);
			if (await blocker.blockerFn({
				currentLocation: location,
				nextLocation,
				action: actionInfo.type
			})) {
				opts.onBlocked?.();
				return;
			}
		}
		task();
	};
	return {
		get location() {
			return location;
		},
		get length() {
			return opts.getLength();
		},
		subscribers,
		subscribe: (cb) => {
			subscribers.add(cb);
			return () => {
				subscribers.delete(cb);
			};
		},
		push: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex + 1, state);
			tryNavigation({
				task: () => {
					opts.pushState(path, state);
					notify({ type: "PUSH" });
				},
				navigateOpts,
				type: "PUSH",
				path,
				state
			});
		},
		replace: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex, state);
			tryNavigation({
				task: () => {
					opts.replaceState(path, state);
					notify({ type: "REPLACE" });
				},
				navigateOpts,
				type: "REPLACE",
				path,
				state
			});
		},
		go: (index, navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.go(index);
					handleIndexChange({
						type: "GO",
						index
					});
				},
				navigateOpts,
				type: "GO"
			});
		},
		back: (navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.back(navigateOpts?.ignoreBlocker ?? false);
					handleIndexChange({ type: "BACK" });
				},
				navigateOpts,
				type: "BACK"
			});
		},
		forward: (navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.forward(navigateOpts?.ignoreBlocker ?? false);
					handleIndexChange({ type: "FORWARD" });
				},
				navigateOpts,
				type: "FORWARD"
			});
		},
		canGoBack: () => location.state[stateIndexKey] !== 0,
		createHref: (str) => opts.createHref(str),
		block: (blocker) => {
			if (!opts.setBlockers) return () => {};
			const blockers = opts.getBlockers?.() ?? [];
			opts.setBlockers([...blockers, blocker]);
			return () => {
				const blockers = opts.getBlockers?.() ?? [];
				opts.setBlockers?.(blockers.filter((b) => b !== blocker));
			};
		},
		flush: () => opts.flush?.(),
		destroy: () => opts.destroy?.(),
		notify
	};
}
function assignKeyAndIndex(index, state) {
	if (!state) state = {};
	const key = createRandomKey();
	return {
		...state,
		key,
		__TSR_key: key,
		[stateIndexKey]: index
	};
}
/**
* Creates a history object that can be used to interact with the browser's
* navigation. This is a lightweight API wrapping the browser's native methods.
* It is designed to work with TanStack Router, but could be used as a standalone API as well.
* IMPORTANT: This API implements history throttling via a microtask to prevent
* excessive calls to the history API. In some browsers, calling history.pushState or
* history.replaceState in quick succession can cause the browser to ignore subsequent
* calls. This API smooths out those differences and ensures that your application
* state will *eventually* match the browser state. In most cases, this is not a problem,
* but if you need to ensure that the browser state is up to date, you can use the
* `history.flush` method to immediately flush all pending state changes to the browser URL.
* @param opts
* @param opts.getHref A function that returns the current href (path + search + hash)
* @param opts.createHref A function that takes a path and returns a href (path + search + hash)
* @returns A history instance
*/
function createBrowserHistory(opts) {
	const win = opts?.window ?? (typeof document !== "undefined" ? window : void 0);
	const originalPushState = win.history.pushState;
	const originalReplaceState = win.history.replaceState;
	let blockers = [];
	const _getBlockers = () => blockers;
	const _setBlockers = (newBlockers) => blockers = newBlockers;
	const createHref = opts?.createHref ?? ((path) => path);
	const parseLocation = opts?.parseLocation ?? (() => parseHref(`${win.location.pathname}${win.location.search}${win.location.hash}`, win.history.state));
	if (!win.history.state?.__TSR_key && !win.history.state?.key) {
		const addedKey = createRandomKey();
		win.history.replaceState({
			[stateIndexKey]: 0,
			key: addedKey,
			__TSR_key: addedKey
		}, "");
	}
	let currentLocation = parseLocation();
	let rollbackLocation;
	let nextPopIsGo = false;
	let ignoreNextPop = false;
	let skipBlockerNextPop = false;
	let ignoreNextBeforeUnload = false;
	const getLocation = () => currentLocation;
	let next;
	let scheduled;
	const flush = () => {
		if (!next) return;
		history._ignoreSubscribers = true;
		(next.isPush ? win.history.pushState : win.history.replaceState)(next.state, "", next.href);
		history._ignoreSubscribers = false;
		next = void 0;
		scheduled = void 0;
		rollbackLocation = void 0;
	};
	const queueHistoryAction = (type, destHref, state) => {
		const href = createHref(destHref);
		if (!scheduled) rollbackLocation = currentLocation;
		currentLocation = parseHref(destHref, state);
		next = {
			href,
			state,
			isPush: next?.isPush || type === "push"
		};
		if (!scheduled) scheduled = Promise.resolve().then(() => flush());
	};
	const onPushPop = (type) => {
		currentLocation = parseLocation();
		history.notify({ type });
	};
	const onPushPopEvent = async () => {
		if (ignoreNextPop) {
			ignoreNextPop = false;
			return;
		}
		const nextLocation = parseLocation();
		const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
		const isForward = delta === 1;
		const isBack = delta === -1;
		const isGo = !isForward && !isBack || nextPopIsGo;
		nextPopIsGo = false;
		const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
		const notify = isGo ? {
			type: "GO",
			index: delta
		} : { type: isBack ? "BACK" : "FORWARD" };
		if (skipBlockerNextPop) skipBlockerNextPop = false;
		else {
			const blockers = _getBlockers();
			if (typeof document !== "undefined" && blockers.length) {
				for (const blocker of blockers) if (await blocker.blockerFn({
					currentLocation,
					nextLocation,
					action
				})) {
					ignoreNextPop = true;
					win.history.go(1);
					history.notify(notify);
					return;
				}
			}
		}
		currentLocation = parseLocation();
		history.notify(notify);
	};
	const onBeforeUnload = (e) => {
		if (ignoreNextBeforeUnload) {
			ignoreNextBeforeUnload = false;
			return;
		}
		let shouldBlock = false;
		const blockers = _getBlockers();
		if (typeof document !== "undefined" && blockers.length) for (const blocker of blockers) {
			const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
			if (shouldHaveBeforeUnload === true) {
				shouldBlock = true;
				break;
			}
			if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
				shouldBlock = true;
				break;
			}
		}
		if (shouldBlock) {
			e.preventDefault();
			return e.returnValue = "";
		}
	};
	const history = createHistory({
		getLocation,
		getLength: () => win.history.length,
		pushState: (href, state) => queueHistoryAction("push", href, state),
		replaceState: (href, state) => queueHistoryAction("replace", href, state),
		back: (ignoreBlocker) => {
			if (ignoreBlocker) skipBlockerNextPop = true;
			ignoreNextBeforeUnload = true;
			return win.history.back();
		},
		forward: (ignoreBlocker) => {
			if (ignoreBlocker) skipBlockerNextPop = true;
			ignoreNextBeforeUnload = true;
			win.history.forward();
		},
		go: (n) => {
			nextPopIsGo = true;
			win.history.go(n);
		},
		createHref: (href) => createHref(href),
		flush,
		destroy: () => {
			win.history.pushState = originalPushState;
			win.history.replaceState = originalReplaceState;
			win.removeEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
			win.removeEventListener(popStateEvent, onPushPopEvent);
		},
		onBlocked: () => {
			if (rollbackLocation && currentLocation !== rollbackLocation) currentLocation = rollbackLocation;
		},
		getBlockers: _getBlockers,
		setBlockers: _setBlockers,
		notifyOnIndexChange: false
	});
	win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
	win.addEventListener(popStateEvent, onPushPopEvent);
	win.history.pushState = function(...args) {
		const res = originalPushState.apply(win.history, args);
		if (!history._ignoreSubscribers) onPushPop("PUSH");
		return res;
	};
	win.history.replaceState = function(...args) {
		const res = originalReplaceState.apply(win.history, args);
		if (!history._ignoreSubscribers) onPushPop("REPLACE");
		return res;
	};
	return history;
}
/**
* Sanitize a path to prevent open redirect vulnerabilities.
* Removes control characters and collapses leading double slashes.
*/
function sanitizePath(path) {
	let sanitized = path.replace(/[\x00-\x1f\x7f]/g, "");
	if (sanitized.startsWith("//")) sanitized = "/" + sanitized.replace(/^\/+/, "");
	return sanitized;
}
function parseHref(href, state) {
	const sanitizedHref = sanitizePath(href);
	const hashIndex = sanitizedHref.indexOf("#");
	const searchIndex = sanitizedHref.indexOf("?");
	const addedKey = createRandomKey();
	return {
		href: sanitizedHref,
		pathname: sanitizedHref.substring(0, hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : sanitizedHref.length),
		hash: hashIndex > -1 ? sanitizedHref.substring(hashIndex) : "",
		search: searchIndex > -1 ? sanitizedHref.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
		state: state || {
			[stateIndexKey]: 0,
			key: addedKey,
			__TSR_key: addedKey
		}
	};
}
function createRandomKey() {
	return (Math.random() + 1).toString(36).substring(7);
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/router-core/dist/esm/router.js
/**
* Convert an unknown error into a minimal, serializable object.
* Includes name and message (and stack in development).
*/
function defaultSerializeError(err) {
	if (err instanceof Error) return {
		name: err.name,
		message: err.message
	};
	return { data: err };
}
/**
* Compute whether path, href or hash changed between previous and current
* resolved locations.
*/
function getLocationChangeInfo(location, resolvedLocation) {
	const fromLocation = resolvedLocation;
	const toLocation = location;
	return {
		fromLocation,
		toLocation,
		pathChanged: fromLocation?.pathname !== toLocation.pathname,
		hrefChanged: fromLocation?.href !== toLocation.href,
		hashChanged: fromLocation?.hash !== toLocation.hash
	};
}
/**
* Core, framework-agnostic router engine that powers TanStack Router.
*
* Provides navigation, matching, loading, preloading, caching and event APIs
* used by framework adapters (React/Solid). Prefer framework helpers like
* `createRouter` in app code.
*
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/RouterType
*/
var RouterCore = class {
	/**
	* @deprecated Use the `createRouter` function instead
	*/
	constructor(options, getStoreConfig) {
		this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
		this._scroll = { next: true };
		this.shouldViewTransition = void 0;
		this.isViewTransitionTypesSupported = void 0;
		this.subscribers = /* @__PURE__ */ new Set();
		this.routeBranchCache = /* @__PURE__ */ new WeakMap();
		this.lightweightCache = /* @__PURE__ */ new WeakMap();
		this.startTransition = (fn) => fn();
		this.update = (newOptions) => {
			const prevOptions = this.options;
			const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
			const basepathWasUnset = this.basepath === void 0;
			const prevRewriteOption = prevOptions?.rewrite;
			this.options = {
				...prevOptions,
				...newOptions
			};
			this.isServer = this.options.isServer ?? typeof document === "undefined";
			this.protocolAllowlist = new Set(this.options.protocolAllowlist);
			if (this.options.pathParamsAllowedCharacters) this.pathParamsDecoder = compileDecodeCharMap(this.options.pathParamsAllowedCharacters);
			if (!this.history || this.options.history && this.options.history !== this.history) if (!this.options.history) this.history = createBrowserHistory();
			else this.history = this.options.history;
			this.origin = this.options.origin;
			if (!this.origin) if (window?.origin && window.origin !== "null") this.origin = window.origin;
			else this.origin = "http://localhost";
			if (this.history) this.updateLatestLocation();
			if (this.options.routeTree !== this.routeTree) {
				this.routeTree = this.options.routeTree;
				let processRouteTreeResult;
				this.resolvePathCache = createLRUCache(1e3);
				processRouteTreeResult = this.buildRouteTree();
				this.setRoutes(processRouteTreeResult);
			}
			if (!this.stores && this.latestLocation) {
				const config = this.getStoreConfig(this);
				this.batch = config.batch;
				this.stores = createRouterStores(getInitialRouterState(this.latestLocation), config);
				setupScrollRestoration(this);
			}
			let needsLocationUpdate = false;
			const nextBasepath = this.options.basepath ?? "/";
			const nextRewriteOption = this.options.rewrite;
			if (basepathWasUnset || prevBasepath !== nextBasepath || prevRewriteOption !== nextRewriteOption) {
				this.basepath = nextBasepath;
				const rewrites = [];
				const trimmed = trimPath(nextBasepath);
				if (trimmed && trimmed !== "/") rewrites.push(rewriteBasepath({ basepath: nextBasepath }));
				if (nextRewriteOption) rewrites.push(nextRewriteOption);
				this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
				if (this.history) this.updateLatestLocation();
				needsLocationUpdate = true;
			}
			if (needsLocationUpdate && this.stores) this.stores.location.set(this.latestLocation);
			if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a))");
		};
		this.updateLatestLocation = () => {
			this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
		};
		this.buildRouteTree = () => {
			const result = processRouteTree(this.routeTree, this.options.caseSensitive, (route, i) => {
				route.init({ originalIndex: i });
			});
			if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
			return result;
		};
		this.subscribe = (eventType, fn) => {
			const listener = {
				eventType,
				fn
			};
			this.subscribers.add(listener);
			return () => {
				this.subscribers.delete(listener);
			};
		};
		this.emit = (routerEvent) => {
			this.subscribers.forEach((listener) => {
				if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
			});
		};
		this.parseLocation = (locationToParse, previousLocation) => {
			const parse = ({ pathname, search, hash, href, state }) => {
				if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
					const parsedSearch = this.options.parseSearch(search);
					const searchStr = this.options.stringifySearch(parsedSearch);
					return {
						href: pathname + searchStr + hash,
						publicHref: pathname + searchStr + hash,
						pathname: decodePath(pathname).path,
						external: false,
						searchStr,
						search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
						hash: decodePath(hash.slice(1)).path,
						state: replaceEqualDeep(previousLocation?.state, state)
					};
				}
				const fullUrl = new URL(href, this.origin);
				const url = executeRewriteInput(this.rewrite, fullUrl);
				const parsedSearch = this.options.parseSearch(url.search);
				const searchStr = this.options.stringifySearch(parsedSearch);
				url.search = searchStr;
				return {
					href: url.href.replace(url.origin, ""),
					publicHref: href,
					pathname: decodePath(url.pathname).path,
					external: !!this.rewrite && url.origin !== this.origin,
					searchStr,
					search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
					hash: decodePath(url.hash.slice(1)).path,
					state: replaceEqualDeep(previousLocation?.state, state)
				};
			};
			const location = parse(locationToParse);
			const { __tempLocation, __tempKey } = location.state;
			if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
				const parsedTempLocation = parse(__tempLocation);
				parsedTempLocation.state.key = location.state.key;
				parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
				delete parsedTempLocation.state.__tempLocation;
				return {
					...parsedTempLocation,
					maskedLocation: location
				};
			}
			return location;
		};
		this.resolvePathWithBase = (from, path) => {
			return resolvePath({
				base: from,
				to: path.includes("//") ? cleanPath(path) : path,
				trailingSlash: this.options.trailingSlash,
				cache: this.resolvePathCache
			});
		};
		this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
			if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
				pathname: pathnameOrNext,
				search: locationSearchOrOpts
			}, opts);
			return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
		};
		this.getMatchedRoutes = (pathname) => {
			return getMatchedRoutes({
				pathname,
				routesById: this.routesById,
				processedTree: this.processedTree
			});
		};
		this.cancelMatch = (id) => {
			const match = this.getMatch(id);
			if (!match) return;
			match.abortController.abort();
			clearTimeout(match._nonReactive.pendingTimeout);
			match._nonReactive.pendingTimeout = void 0;
		};
		this.cancelMatches = () => {
			this.stores.pendingIds.get().forEach((matchId) => {
				this.cancelMatch(matchId);
			});
			this.stores.matchesId.get().forEach((matchId) => {
				if (this.stores.pendingMatchStores.has(matchId)) return;
				const match = this.stores.matchStores.get(matchId)?.get();
				if (!match) return;
				if (match.status === "pending" || match.isFetching === "loader") this.cancelMatch(matchId);
			});
		};
		this.buildLocation = (opts) => {
			const build = (dest = {}) => {
				const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
				const lightweightResult = this.matchRoutesLightweight(currentLocation);
				if (dest.from && false);
				const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lightweightResult.fullPath;
				const destTo = dest.to ? `${dest.to}` : void 0;
				const fromSearch = lightweightResult.search;
				const fromParams = Object.assign(Object.create(null), lightweightResult.params);
				const sourcePath = destTo?.charCodeAt(0) === 47 ? "/" : this.resolvePathWithBase(defaultedFromPath, ".");
				const nextTo = destTo ? this.resolvePathWithBase(sourcePath, destTo) : sourcePath;
				const nextParams = dest.params === false || dest.params === null ? Object.create(null) : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate(dest.params, fromParams));
				const destRoute = this.routesByPath[trimPathRight(nextTo)];
				let destRoutes;
				if (destRoute) destRoutes = this.getRouteBranch(destRoute);
				else if (nextTo.includes("$")) destRoutes = [];
				else {
					const destMatchResult = this.getMatchedRoutes(nextTo);
					destRoutes = destMatchResult.matchedRoutes;
					if (this.options.notFoundRoute && (!destMatchResult.foundRoute || destMatchResult.foundRoute.path !== "/" && destMatchResult.routeParams["**"])) destRoutes = [...destRoutes, this.options.notFoundRoute];
				}
				if (destRoutes.length && hasKeys(nextParams)) for (const route of destRoutes) {
					const fn = route.options.params?.stringify ?? route.options.stringifyParams;
					if (fn) try {
						Object.assign(nextParams, fn(nextParams));
					} catch {}
				}
				const nextPathname = opts.leaveParams ? nextTo : decodePath(interpolatePath({
					path: nextTo,
					params: nextParams,
					decoder: this.pathParamsDecoder,
					server: this.isServer
				}).interpolatedPath).path;
				let nextSearch = fromSearch;
				if (opts._includeValidateSearch && this.options.search?.strict) {
					const validatedSearch = {};
					destRoutes.forEach((route) => {
						if (route.options.validateSearch) try {
							Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
								...validatedSearch,
								...nextSearch
							}));
						} catch {}
					});
					nextSearch = validatedSearch;
				}
				nextSearch = applySearchMiddleware({
					search: nextSearch,
					dest,
					destRoutes,
					_includeValidateSearch: opts._includeValidateSearch
				});
				nextSearch = nullReplaceEqualDeep(fromSearch, nextSearch);
				const searchStr = this.options.stringifySearch(nextSearch);
				const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate(dest.hash, currentLocation.hash) : void 0;
				const hashStr = hash ? `#${hash}` : "";
				let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate(dest.state, currentLocation.state) : {};
				nextState = replaceEqualDeep(currentLocation.state, nextState);
				const fullPath = `${nextPathname}${searchStr}${hashStr}`;
				let href;
				let publicHref;
				let external = false;
				if (this.rewrite) {
					const url = new URL(fullPath, this.origin);
					const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
					href = url.href.replace(url.origin, "");
					if (rewrittenUrl.origin !== this.origin) {
						publicHref = rewrittenUrl.href;
						external = true;
					} else publicHref = rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash;
				} else {
					href = encodePathLikeUrl(fullPath);
					publicHref = href;
				}
				return {
					publicHref,
					href,
					pathname: nextPathname,
					search: nextSearch,
					searchStr,
					state: nextState,
					hash: hash ?? "",
					external,
					unmaskOnReload: dest.unmaskOnReload
				};
			};
			const buildWithMatches = (dest = {}, maskedDest) => {
				const next = build(dest);
				let maskedNext = maskedDest ? build(maskedDest) : void 0;
				if (!maskedNext) {
					const params = Object.create(null);
					if (this.options.routeMasks) {
						const match = findFlatMatch(next.pathname, this.processedTree);
						if (match) {
							Object.assign(params, match.rawParams);
							const { from: _from, params: maskParams, ...maskProps } = match.route;
							const nextParams = maskParams === false || maskParams === null ? Object.create(null) : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate(maskParams, params));
							maskedDest = {
								from: opts.from,
								...maskProps,
								params: nextParams
							};
							maskedNext = build(maskedDest);
						}
					}
				}
				if (maskedNext) next.maskedLocation = maskedNext;
				return next;
			};
			if (opts.mask) return buildWithMatches(opts, {
				from: opts.from,
				...opts.mask
			});
			return buildWithMatches(opts);
		};
		this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
			let historyAction;
			const isSameState = () => {
				const ignoredProps = [
					"key",
					"__TSR_key",
					"__TSR_index",
					"__hashScrollIntoViewOptions"
				];
				ignoredProps.forEach((prop) => {
					next.state[prop] = this.latestLocation.state[prop];
				});
				const isEqual = deepEqual(next.state, this.latestLocation.state);
				ignoredProps.forEach((prop) => {
					delete next.state[prop];
				});
				return isEqual;
			};
			const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
			let previousCommitPromise = this.commitLocationPromise;
			this.commitLocationPromise = createControlledPromise(() => {
				previousCommitPromise?.resolve();
				previousCommitPromise = void 0;
			});
			if (isSameUrl && isSameState()) this.load();
			else {
				let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
				if (maskedLocation) {
					nextHistory = {
						...maskedLocation,
						state: {
							...maskedLocation.state,
							__tempKey: void 0,
							__tempLocation: {
								...nextHistory,
								search: nextHistory.searchStr,
								state: {
									...nextHistory.state,
									__tempKey: void 0,
									__tempLocation: void 0,
									__TSR_key: void 0,
									key: void 0
								}
							}
						}
					};
					if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
				}
				nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
				this.shouldViewTransition = viewTransition;
				historyAction = next.replace ? "REPLACE" : "PUSH";
				this.history[historyAction === "REPLACE" ? "replace" : "push"](nextHistory.publicHref, nextHistory.state, { ignoreBlocker });
			}
			this._scroll.next = next.resetScroll ?? true;
			if (!this.history.subscribers.size) this.load(historyAction ? { action: { type: historyAction } } : void 0);
			return this.commitLocationPromise;
		};
		this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
			if (href) {
				const currentIndex = this.history.location.state.__TSR_index;
				const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
				const hrefUrl = new URL(parsed.pathname, this.origin);
				rest.to = executeRewriteInput(this.rewrite, hrefUrl).pathname;
				rest.search = this.options.parseSearch(parsed.search);
				rest.hash = parsed.hash.slice(1);
			}
			const location = this.buildLocation({
				...rest,
				_includeValidateSearch: true
			});
			this.pendingBuiltLocation = location;
			const commitPromise = this.commitLocation({
				...location,
				viewTransition,
				replace,
				resetScroll,
				hashScrollIntoView,
				ignoreBlocker
			});
			queueMicrotask(() => {
				if (this.pendingBuiltLocation === location) this.pendingBuiltLocation = void 0;
			});
			return commitPromise;
		};
		this.navigate = async ({ to, reloadDocument, href, publicHref, ...rest }) => {
			let hrefIsUrl = false;
			if (href) try {
				new URL(`${href}`);
				hrefIsUrl = true;
			} catch {}
			if (hrefIsUrl && !reloadDocument) reloadDocument = true;
			if (reloadDocument) {
				if (to !== void 0 || !href) {
					const location = this.buildLocation({
						to,
						...rest
					});
					href = href ?? location.publicHref;
					publicHref = publicHref ?? location.publicHref;
				}
				const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
				if (isDangerousProtocol(reloadHref, this.protocolAllowlist)) return;
				if (!rest.ignoreBlocker) {
					const blockers = this.history.getBlockers?.() ?? [];
					for (const blocker of blockers) if (blocker?.blockerFn) {
						if (await blocker.blockerFn({
							currentLocation: this.latestLocation,
							nextLocation: this.latestLocation,
							action: "PUSH"
						})) return;
					}
				}
				if (rest.replace) window.location.replace(reloadHref);
				else window.location.href = reloadHref;
				return;
			}
			return this.buildAndCommitLocation({
				...rest,
				href,
				to,
				_isNavigate: true
			});
		};
		this.beforeLoad = () => {
			this.cancelMatches();
			this.updateLatestLocation();
			const pendingMatches = this.matchRoutes(this.latestLocation);
			const nextCachedMatches = this.stores.cachedMatches.get().filter((d) => !pendingMatches.some((e) => e.id === d.id));
			this.batch(() => {
				this.stores.status.set("pending");
				this.stores.statusCode.set(200);
				this.stores.isLoading.set(true);
				this.stores.location.set(this.latestLocation);
				this.stores.setPending(pendingMatches);
				this.stores.setCached(nextCachedMatches);
			});
		};
		this.load = async (opts) => {
			const historyAction = opts?.action?.type;
			let redirect;
			let notFound;
			let loadPromise;
			const previousLocation = this.stores.resolvedLocation.get() ?? this.stores.location.get();
			loadPromise = new Promise((resolve) => {
				this.startTransition(async () => {
					try {
						this.beforeLoad();
						if (historyAction) this._scroll.hash = historyAction === "PUSH" || historyAction === "REPLACE";
						const next = this.latestLocation;
						const locationChangeInfo = getLocationChangeInfo(next, this.stores.resolvedLocation.get());
						if (!this.stores.redirect.get()) this.emit({
							type: "onBeforeNavigate",
							...locationChangeInfo
						});
						this.emit({
							type: "onBeforeLoad",
							...locationChangeInfo
						});
						await loadMatches({
							router: this,
							sync: opts?.sync,
							forceStaleReload: previousLocation.href === next.href,
							matches: this.stores.pendingMatches.get(),
							location: next,
							updateMatch: this.updateMatch,
							onReady: async () => {
								this.startTransition(() => {
									this.startViewTransition(async () => {
										let exitingMatches = null;
										let hookExitingMatches = null;
										let hookEnteringMatches = null;
										let hookStayingMatches = null;
										this.batch(() => {
											const pendingMatches = this.stores.pendingMatches.get();
											const mountPending = pendingMatches.length;
											const currentMatches = this.stores.matches.get();
											exitingMatches = mountPending ? currentMatches.filter((match) => !this.stores.pendingMatchStores.has(match.id)) : null;
											const pendingRouteIds = /* @__PURE__ */ new Set();
											for (const s of this.stores.pendingMatchStores.values()) if (s.routeId) pendingRouteIds.add(s.routeId);
											const activeRouteIds = /* @__PURE__ */ new Set();
											for (const s of this.stores.matchStores.values()) if (s.routeId) activeRouteIds.add(s.routeId);
											hookExitingMatches = mountPending ? currentMatches.filter((match) => !pendingRouteIds.has(match.routeId)) : null;
											hookEnteringMatches = mountPending ? pendingMatches.filter((match) => !activeRouteIds.has(match.routeId)) : null;
											hookStayingMatches = mountPending ? pendingMatches.filter((match) => activeRouteIds.has(match.routeId)) : currentMatches;
											this.stores.isLoading.set(false);
											this.stores.loadedAt.set(Date.now());
											/**
											* When committing new matches, cache any exiting matches that are still usable.
											* Routes that resolved with `status: 'error'` or `status: 'notFound'` are
											* deliberately excluded from `cachedMatches` so that subsequent invalidations
											* or reloads re-run their loaders instead of reusing the failed/not-found data.
											*/
											if (mountPending) {
												this.stores.setMatches(pendingMatches);
												this.stores.setPending([]);
												this.stores.setCached([...this.stores.cachedMatches.get(), ...exitingMatches.filter((d) => d.status !== "error" && d.status !== "notFound" && d.status !== "redirected")]);
												this.clearExpiredCache();
											}
										});
										for (const [matches, hook] of [
											[hookExitingMatches, "onLeave"],
											[hookEnteringMatches, "onEnter"],
											[hookStayingMatches, "onStay"]
										]) {
											if (!matches) continue;
											for (const match of matches) this.looseRoutesById[match.routeId].options[hook]?.(match);
										}
									});
								});
							}
						});
					} catch (err) {
						if (isRedirect(err)) {
							redirect = err;
							this.navigate({
								...redirect.options,
								replace: true,
								ignoreBlocker: true
							});
						} else if (isNotFound(err)) notFound = err;
						const nextStatusCode = redirect ? redirect.status : notFound ? 404 : this.stores.matches.get().some((d) => d.status === "error") ? 500 : 200;
						this.batch(() => {
							this.stores.statusCode.set(nextStatusCode);
							this.stores.redirect.set(redirect);
						});
					}
					if (this.latestLoadPromise === loadPromise) {
						this.commitLocationPromise?.resolve();
						this.latestLoadPromise = void 0;
						this.commitLocationPromise = void 0;
					}
					resolve();
				});
			});
			this.latestLoadPromise = loadPromise;
			await loadPromise;
			while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
			let newStatusCode = void 0;
			if (this.hasNotFoundMatch()) newStatusCode = 404;
			else if (this.stores.matches.get().some((d) => d.status === "error")) newStatusCode = 500;
			if (newStatusCode !== void 0) this.stores.statusCode.set(newStatusCode);
		};
		this.startViewTransition = (fn) => {
			const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
			this.shouldViewTransition = void 0;
			if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
				let startViewTransitionParams;
				if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
					const next = this.latestLocation;
					const prevLocation = this.stores.resolvedLocation.get();
					const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo(next, prevLocation)) : shouldViewTransition.types;
					if (resolvedViewTransitionTypes === false) {
						fn();
						return;
					}
					startViewTransitionParams = {
						update: fn,
						types: resolvedViewTransitionTypes
					};
				} else startViewTransitionParams = fn;
				document.startViewTransition(startViewTransitionParams);
			} else fn();
		};
		this.updateMatch = (id, updater) => {
			this.startTransition(() => {
				const pendingMatch = this.stores.pendingMatchStores.get(id);
				if (pendingMatch) {
					pendingMatch.set(updater);
					return;
				}
				const activeMatch = this.stores.matchStores.get(id);
				if (activeMatch) {
					activeMatch.set(updater);
					return;
				}
				const cachedMatch = this.stores.cachedMatchStores.get(id);
				if (cachedMatch) {
					const next = updater(cachedMatch.get());
					if (next.status === "redirected") {
						if (this.stores.cachedMatchStores.delete(id)) this.stores.cachedIds.set((prev) => prev.filter((matchId) => matchId !== id));
					} else cachedMatch.set(next);
				}
			});
		};
		this.getMatch = (matchId) => {
			return this.stores.cachedMatchStores.get(matchId)?.get() ?? this.stores.pendingMatchStores.get(matchId)?.get() ?? this.stores.matchStores.get(matchId)?.get();
		};
		this.invalidate = (opts) => {
			const invalidate = (d) => {
				if (opts?.filter?.(d) ?? true) return {
					...d,
					invalid: true,
					...opts?.forcePending || d.status === "error" || d.status === "notFound" ? {
						status: "pending",
						error: void 0
					} : void 0
				};
				return d;
			};
			this.batch(() => {
				this.stores.setMatches(this.stores.matches.get().map(invalidate));
				this.stores.setCached(this.stores.cachedMatches.get().map(invalidate));
				this.stores.setPending(this.stores.pendingMatches.get().map(invalidate));
			});
			this.shouldViewTransition = false;
			return this.load({ sync: opts?.sync });
		};
		this.getParsedLocationHref = (location) => {
			return location.publicHref || "/";
		};
		this.resolveRedirect = (redirect) => {
			const locationHeader = redirect.headers.get("Location");
			if (!redirect.options.href || redirect.options._builtLocation) {
				const location = redirect.options._builtLocation ?? this.buildLocation(redirect.options);
				const href = this.getParsedLocationHref(location);
				redirect.options.href = href;
				redirect.headers.set("Location", href);
			} else if (locationHeader) try {
				const url = new URL(locationHeader);
				if (this.origin && url.origin === this.origin) {
					const href = url.pathname + url.search + url.hash;
					redirect.options.href = href;
					redirect.headers.set("Location", href);
				}
			} catch {}
			if (redirect.options.href && !redirect.options._builtLocation && isDangerousProtocol(redirect.options.href, this.protocolAllowlist)) throw new Error("Redirect blocked: unsafe protocol");
			if (!redirect.headers.get("Location")) redirect.headers.set("Location", redirect.options.href);
			return redirect;
		};
		this.clearCache = (opts) => {
			const filter = opts?.filter;
			if (filter !== void 0) this.stores.setCached(this.stores.cachedMatches.get().filter((m) => !filter(m)));
			else this.stores.setCached([]);
		};
		this.clearExpiredCache = () => {
			const now = Date.now();
			const filter = (d) => {
				const route = this.looseRoutesById[d.routeId];
				if (!route.options.loader) return true;
				const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 300 * 1e3;
				if (d.status === "error") return true;
				return now - d.updatedAt >= gcTime;
			};
			this.clearCache({ filter });
		};
		this.loadRouteChunk = loadRouteChunk;
		this.preloadRoute = async (opts) => {
			const next = opts._builtLocation ?? this.buildLocation(opts);
			let matches = this.matchRoutes(next, {
				throwOnError: true,
				preload: true,
				dest: opts
			});
			const activeMatchIds = /* @__PURE__ */ new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]);
			const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.stores.cachedIds.get()]);
			const matchesToCache = matches.filter((match) => !loadedMatchIds.has(match.id));
			if (matchesToCache.length) {
				const cachedMatches = this.stores.cachedMatches.get();
				this.stores.setCached([...cachedMatches, ...matchesToCache]);
			}
			try {
				matches = await loadMatches({
					router: this,
					matches,
					location: next,
					preload: true,
					updateMatch: (id, updater) => {
						if (activeMatchIds.has(id)) matches = matches.map((d) => d.id === id ? updater(d) : d);
						else this.updateMatch(id, updater);
					}
				});
				return matches;
			} catch (err) {
				if (isRedirect(err)) {
					if (err.options.reloadDocument) return;
					return await this.preloadRoute({
						...err.options,
						_fromLocation: next
					});
				}
				if (!isNotFound(err)) console.error(err);
				return;
			}
		};
		this.matchRoute = (location, opts) => {
			const matchLocation = {
				...location,
				to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
				params: location.params || {},
				leaveParams: true
			};
			const next = this.buildLocation(matchLocation);
			if (opts?.pending && this.stores.status.get() !== "pending") return false;
			const baseLocation = (opts?.pending === void 0 ? !this.stores.isLoading.get() : opts.pending) ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
			const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
			if (!match) return false;
			if (location.params) {
				if (!deepEqual(match.rawParams, location.params, { partial: true })) return false;
			}
			if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.rawParams : false;
			return match.rawParams;
		};
		this.hasNotFoundMatch = () => {
			return this.stores.matches.get().some((d) => d.status === "notFound" || d.globalNotFound);
		};
		this.getStoreConfig = getStoreConfig;
		this.update({
			defaultPreloadDelay: 50,
			defaultPendingMs: 1e3,
			defaultPendingMinMs: 500,
			context: void 0,
			...options,
			caseSensitive: options.caseSensitive ?? false,
			notFoundMode: options.notFoundMode ?? "fuzzy",
			stringifySearch: options.stringifySearch ?? defaultStringifySearch,
			parseSearch: options.parseSearch ?? defaultParseSearch,
			protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
		});
		if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
	}
	isShell() {
		return !!this.options.isShell;
	}
	isPrerendering() {
		return !!this.options.isPrerendering;
	}
	get state() {
		return this.stores.__store.get();
	}
	setRoutes({ routesById, routesByPath, processedTree }) {
		this.routesById = routesById;
		this.routesByPath = routesByPath;
		this.processedTree = processedTree;
		const notFoundRoute = this.options.notFoundRoute;
		if (notFoundRoute) {
			notFoundRoute.init({ originalIndex: 99999999999 });
			this.routesById[notFoundRoute.id] = notFoundRoute;
		}
	}
	getRouteBranch(route) {
		let branch = this.routeBranchCache.get(route);
		if (!branch) {
			branch = buildRouteBranch(route);
			this.routeBranchCache.set(route, branch);
		}
		return branch;
	}
	get looseRoutesById() {
		return this.routesById;
	}
	getParentContext(parentMatch) {
		return !parentMatch?.id ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
	}
	matchRoutesInternal(next, opts) {
		const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
		const { foundRoute, routeParams } = matchedRoutesResult;
		let { matchedRoutes } = matchedRoutesResult;
		let isGlobalNotFound = false;
		if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
		else isGlobalNotFound = true;
		const globalNotFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
		const matches = new Array(matchedRoutes.length);
		const previousActiveMatchesByRouteId = /* @__PURE__ */ new Map();
		for (const store of this.stores.matchStores.values()) if (store.routeId) previousActiveMatchesByRouteId.set(store.routeId, store.get());
		for (let index = 0; index < matchedRoutes.length; index++) {
			const route = matchedRoutes[index];
			const parentMatch = matches[index - 1];
			let preMatchSearch;
			let strictMatchSearch;
			let searchError;
			{
				const parentSearch = parentMatch?.search ?? next.search;
				const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
				try {
					const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
					preMatchSearch = {
						...parentSearch,
						...strictSearch
					};
					strictMatchSearch = {
						...parentStrictSearch,
						...strictSearch
					};
					searchError = void 0;
				} catch (err) {
					let searchParamError = err;
					if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
					if (opts?.throwOnError) throw searchParamError;
					preMatchSearch = parentSearch;
					strictMatchSearch = {};
					searchError = searchParamError;
				}
			}
			const loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
			const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
			const { interpolatedPath, usedParams } = interpolatePath({
				path: route.fullPath,
				params: routeParams,
				decoder: this.pathParamsDecoder,
				server: this.isServer
			});
			const matchId = route.id + interpolatedPath + loaderDepsHash;
			const existingMatch = this.getMatch(matchId);
			const previousMatch = previousActiveMatchesByRouteId.get(route.id);
			const strictParams = existingMatch?._strictParams ?? usedParams;
			let paramsError = void 0;
			if (!existingMatch) try {
				extractStrictParams(route, strictParams);
			} catch (err) {
				if (isNotFound(err) || isRedirect(err)) paramsError = err;
				else paramsError = new PathParamError(err.message, { cause: err });
				if (opts?.throwOnError) throw paramsError;
			}
			Object.assign(routeParams, strictParams);
			const cause = previousMatch ? "stay" : "enter";
			let match;
			if (existingMatch) match = {
				...existingMatch,
				cause,
				params: previousMatch?.params ?? routeParams,
				_strictParams: strictParams,
				search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
				_strictSearch: strictMatchSearch
			};
			else {
				const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
				match = {
					id: matchId,
					ssr: route.options.ssr,
					index,
					routeId: route.id,
					params: previousMatch?.params ?? routeParams,
					_strictParams: strictParams,
					pathname: interpolatedPath,
					updatedAt: Date.now(),
					search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
					_strictSearch: strictMatchSearch,
					searchError: void 0,
					status,
					isFetching: false,
					error: void 0,
					paramsError,
					__routeContext: void 0,
					_nonReactive: { loadPromise: createControlledPromise() },
					__beforeLoadContext: void 0,
					context: {},
					abortController: new AbortController(),
					fetchCount: 0,
					cause,
					loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
					invalid: false,
					preload: false,
					links: void 0,
					scripts: void 0,
					headScripts: void 0,
					meta: void 0,
					staticData: route.options.staticData || {},
					fullPath: route.fullPath
				};
			}
			if (!opts?.preload) match.globalNotFound = globalNotFoundRouteId === route.id;
			match.searchError = searchError;
			const parentContext = this.getParentContext(parentMatch);
			match.context = {
				...parentContext,
				...match.__routeContext,
				...match.__beforeLoadContext
			};
			matches[index] = match;
		}
		for (let index = 0; index < matches.length; index++) {
			const match = matches[index];
			const route = this.looseRoutesById[match.routeId];
			const existingMatch = this.getMatch(match.id);
			const previousMatch = previousActiveMatchesByRouteId.get(match.routeId);
			match.params = previousMatch ? nullReplaceEqualDeep(previousMatch.params, routeParams) : routeParams;
			if (!existingMatch) {
				const parentMatch = matches[index - 1];
				const parentContext = this.getParentContext(parentMatch);
				if (route.options.context) {
					const contextFnContext = {
						deps: match.loaderDeps,
						params: match.params,
						context: parentContext ?? {},
						location: next,
						navigate: (opts) => this.navigate({
							...opts,
							_fromLocation: next
						}),
						buildLocation: this.buildLocation,
						cause: match.cause,
						abortController: match.abortController,
						preload: !!match.preload,
						matches,
						routeId: route.id
					};
					match.__routeContext = route.options.context(contextFnContext) ?? void 0;
				}
				match.context = {
					...parentContext,
					...match.__routeContext,
					...match.__beforeLoadContext
				};
			}
		}
		return matches;
	}
	/**
	* Lightweight route matching for buildLocation.
	* Only computes fullPath, accumulated search, and params - skipping expensive
	* operations like AbortController, ControlledPromise, loaderDeps, and full match objects.
	*/
	matchRoutesLightweight(location) {
		const lastStateMatchId = last(this.stores.matchesId.get());
		const cached = this.lightweightCache.get(location);
		if (cached && cached[0] === lastStateMatchId) return cached[1];
		const { matchedRoutes, routeParams } = this.getMatchedRoutes(location.pathname);
		const lastRoute = last(matchedRoutes);
		const accumulatedSearch = { ...location.search };
		for (const route of matchedRoutes) try {
			Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
		} catch {}
		const lastStateMatch = lastStateMatchId && this.stores.matchStores.get(lastStateMatchId)?.get();
		const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location.pathname;
		let params;
		if (canReuseParams) params = lastStateMatch.params;
		else {
			const strictParams = Object.assign(Object.create(null), routeParams);
			for (const route of matchedRoutes) try {
				extractStrictParams(route, strictParams);
			} catch {}
			params = strictParams;
		}
		const result = {
			matchedRoutes,
			fullPath: lastRoute.fullPath,
			search: accumulatedSearch,
			params
		};
		this.lightweightCache.set(location, [lastStateMatchId, result]);
		return result;
	}
};
/** Error thrown when search parameter validation fails. */
var SearchParamError = class extends Error {};
/** Error thrown when path parameter parsing/validation fails. */
var PathParamError = class extends Error {};
/** Create an initial RouterState from a parsed location. */
function getInitialRouterState(location) {
	return {
		loadedAt: 0,
		isLoading: false,
		isTransitioning: false,
		status: "idle",
		resolvedLocation: void 0,
		location,
		matches: [],
		statusCode: 200
	};
}
function validateSearch(validateSearch, input) {
	if (validateSearch == null) return {};
	if ("~standard" in validateSearch) {
		const result = validateSearch["~standard"].validate(input);
		if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
		if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
		return result.value;
	}
	if ("parse" in validateSearch) return validateSearch.parse(input);
	if (typeof validateSearch === "function") return validateSearch(input);
	return {};
}
/**
* Build the matched route chain and extract params for a pathname.
* Falls back to the root route if no specific route is found.
*/
function getMatchedRoutes({ pathname, routesById, processedTree }) {
	const routeParams = Object.create(null);
	const trimmedPath = trimPathRight(pathname);
	let foundRoute = void 0;
	const match = findRouteMatch(trimmedPath, processedTree, true);
	if (match) {
		foundRoute = match.route;
		Object.assign(routeParams, match.rawParams);
	}
	return {
		matchedRoutes: match?.branch || [routesById["__root__"]],
		routeParams,
		foundRoute
	};
}
/**
* TODO: once caches are persisted across requests on the server,
* we can cache the built middleware chain using `last(destRoutes)` as the key
*/
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
	return buildMiddlewareChain(destRoutes)(search, dest, _includeValidateSearch ?? false);
}
function buildMiddlewareChain(destRoutes) {
	let dest;
	let includeValidateSearch;
	const middlewares = [];
	for (const route of destRoutes) {
		const routeOptions = route.options;
		if ("search" in routeOptions) {
			if (routeOptions.search?.middlewares) middlewares.push(...routeOptions.search.middlewares);
		} else if (routeOptions.preSearchFilters || routeOptions.postSearchFilters) {
			const legacyMiddleware = ({ search, next }) => {
				const result = next(routeOptions.preSearchFilters ? routeOptions.preSearchFilters.reduce((prev, next) => next(prev), search) : search);
				return routeOptions.postSearchFilters ? routeOptions.postSearchFilters.reduce((prev, next) => next(prev), result) : result;
			};
			middlewares.push(legacyMiddleware);
		}
		const routeValidateSearch = routeOptions.validateSearch;
		if (routeValidateSearch) {
			const validate = ({ search, next, meta }) => {
				const result = next(search);
				if (includeValidateSearch) try {
					const validated = validateSearch(routeValidateSearch, result);
					if (meta && validated) {
						for (const key in validated) if (!(key in result)) (meta.defaulted ||= /* @__PURE__ */ new Map()).set(key, validated[key]);
					}
					return {
						...result,
						...validated
					};
				} catch {}
				return result;
			};
			middlewares.push(validate);
		}
	}
	const applyNext = (index, currentSearch, meta) => {
		if (index >= middlewares.length) {
			if (!dest.search) return {};
			if (dest.search === true) return currentSearch;
			const result = functionalUpdate(dest.search, currentSearch);
			if (meta) meta.explicit = result;
			return result;
		}
		const next = (newSearch, collectMeta) => {
			if (collectMeta) {
				const nextMeta = meta || {};
				return {
					search: applyNext(index + 1, newSearch, nextMeta),
					meta: nextMeta
				};
			}
			return applyNext(index + 1, newSearch, meta);
		};
		return middlewares[index]({
			search: currentSearch,
			next,
			meta
		});
	};
	return function middleware(search, nextDest, _includeValidateSearch) {
		dest = nextDest;
		includeValidateSearch = _includeValidateSearch;
		return applyNext(0, search);
	};
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
	if (notFoundMode !== "root") for (let i = routes.length - 1; i >= 0; i--) {
		const route = routes[i];
		if (route.children) return route.id;
	}
	return rootRouteId;
}
function extractStrictParams(route, accumulatedParams) {
	const parseParams = route.options.params?.parse ?? route.options.parseParams;
	if (parseParams) {
		const result = parseParams(accumulatedParams);
		if (result === false) throw new Error("Route params.parse returned false for a matched route");
		Object.assign(accumulatedParams, result);
	}
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function CatchBoundary(props) {
	const errorComponent = props.errorComponent ?? ErrorComponent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundaryImpl, {
		getResetKey: props.getResetKey,
		onCatch: props.onCatch,
		children: ({ error, reset }) => {
			if (error) return import_react.createElement(errorComponent, {
				error,
				reset
			});
			return props.children;
		}
	});
}
var CatchBoundaryImpl = class extends import_react.Component {
	constructor(..._args) {
		super(..._args);
		this.state = { error: null };
	}
	static getDerivedStateFromProps(props, state) {
		const resetKey = props.getResetKey();
		if (state.error && state.resetKey !== resetKey) return {
			resetKey,
			error: null
		};
		return { resetKey };
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	reset() {
		this.setState({ error: null });
	}
	componentDidCatch(error, errorInfo) {
		if (this.props.onCatch) this.props.onCatch(error, errorInfo);
	}
	render() {
		return this.props.children({
			error: this.state.error,
			reset: () => {
				this.reset();
			}
		});
	}
};
function ErrorComponent({ error }) {
	const [show, setShow] = import_react.useState(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: ".5rem",
			maxWidth: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: ".5rem"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					style: { fontSize: "1rem" },
					children: "Something went wrong!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					style: {
						appearance: "none",
						fontSize: ".6em",
						border: "1px solid currentColor",
						padding: ".1rem .2rem",
						fontWeight: "bold",
						borderRadius: ".25rem"
					},
					onClick: () => setShow((d) => !d),
					children: show ? "Hide Error" : "Show Error"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: ".25rem" } }),
			show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				style: {
					fontSize: ".7em",
					border: "1px solid red",
					borderRadius: ".25rem",
					padding: ".3rem",
					color: "red",
					overflow: "auto"
				},
				children: error.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: error.message }) : null
			}) }) : null
		]
	});
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/react-router/dist/esm/not-found.js
function CatchNotFound(props) {
	const router = useRouter();
	const resetKey = `not-found-${useStore(router.stores.location, (location) => location.pathname)}-${useStore(router.stores.status, (status) => status)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundary, {
		getResetKey: () => resetKey,
		onCatch: (error, errorInfo) => {
			if (isNotFound(error)) props.onCatch?.(error, errorInfo);
			else throw error;
		},
		errorComponent: ({ error }) => {
			if (isNotFound(error)) return props.fallback?.(error);
			else throw error;
		},
		children: props.children
	});
}
function DefaultGlobalNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not Found" });
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js
function SafeFragment(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: props.children });
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/react-router/dist/esm/renderRouteNotFound.js
/**
* Renders a not found component for a route when no matching route is found.
*
* @param router - The router instance containing the route configuration
* @param route - The route that triggered the not found state
* @param data - Additional data to pass to the not found component
* @returns The rendered not found component or a default fallback component
*/
function renderRouteNotFound(router, route, data) {
	if (!route.options.notFoundComponent) {
		if (router.options.defaultNotFoundComponent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.defaultNotFoundComponent, { ...data });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultGlobalNotFound, {});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(route.options.notFoundComponent, { ...data });
}
//#endregion
//#region ../../home/user/node_modules/@tanstack/react-router/dist/esm/Match.js
var matchViewFieldsEqual = (a, b) => a.routeId === b.routeId && a._displayPending === b._displayPending;
var outletMatchSelectionEqual = (a, b) => a[0] === b[0] && a[1] === b[1];
var Match = import_react.memo(function MatchImpl({ matchId }) {
	const router = useRouter();
	const matchStore = router.stores.matchStores.get(matchId);
	if (!matchStore) invariant();
	const resetKey = useStore(router.stores.loadedAt, (loadedAt) => loadedAt);
	const match = useStore(matchStore, (value) => value, matchViewFieldsEqual);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchView, {
		router,
		matchId,
		resetKey,
		matchState: import_react.useMemo(() => {
			const routeId = match.routeId;
			const parentRouteId = router.routesById[routeId].parentRoute?.id;
			return {
				routeId,
				ssr: match.ssr,
				_displayPending: match._displayPending,
				parentRouteId
			};
		}, [
			match._displayPending,
			match.routeId,
			match.ssr,
			router.routesById
		])
	});
});
function MatchView({ router, matchId, resetKey, matchState }) {
	const route = router.routesById[matchState.routeId];
	const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
	const pendingElement = PendingComponent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingComponent, {}) : null;
	const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
	const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
	const routeNotFoundComponent = route.isRoot ? route.options.notFoundComponent ?? router.options.notFoundRoute?.options.component : route.options.notFoundComponent;
	const resolvedNoSsr = matchState.ssr === false || matchState.ssr === "data-only";
	const ResolvedSuspenseBoundary = (!route.isRoot || route.options.wrapInSuspense || resolvedNoSsr) && (route.options.wrapInSuspense ?? PendingComponent ?? (route.options.errorComponent?.preload || resolvedNoSsr)) ? import_react.Suspense : SafeFragment;
	const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
	const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(route.isRoot ? route.options.shellComponent ?? SafeFragment : SafeFragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(matchContext.Provider, {
		value: matchId,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedSuspenseBoundary, {
			fallback: pendingElement,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedCatchBoundary, {
				getResetKey: () => resetKey,
				errorComponent: routeErrorComponent || ErrorComponent,
				onCatch: (error, errorInfo) => {
					if (isNotFound(error)) {
						error.routeId ??= matchState.routeId;
						throw error;
					}
					routeOnCatch?.(error, errorInfo);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedNotFoundBoundary, {
					fallback: (error) => {
						error.routeId ??= matchState.routeId;
						if (!routeNotFoundComponent || error.routeId && error.routeId !== matchState.routeId || !error.routeId && !route.isRoot) throw error;
						return import_react.createElement(routeNotFoundComponent, error);
					},
					children: resolvedNoSsr || matchState._displayPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
						fallback: pendingElement,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchInner, { matchId })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchInner, { matchId })
				})
			})
		})
	}), matchState.parentRouteId === "__root__" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnRendered, {}), (router.options.scrollRestoration, null)] }) : null] });
}
function OnRendered() {
	const router = useRouter();
	const prevResolvedLocationRef = import_react.useRef();
	useLayoutEffect(() => {
		const currentResolvedLocation = router.stores.resolvedLocation.get();
		const previousResolvedLocation = prevResolvedLocationRef.current;
		if (currentResolvedLocation && (!previousResolvedLocation || previousResolvedLocation.href !== currentResolvedLocation.href)) router.emit({
			type: "onRendered",
			...getLocationChangeInfo(router.stores.location.get(), previousResolvedLocation ?? currentResolvedLocation)
		});
		prevResolvedLocationRef.current = currentResolvedLocation;
	}, [useStore(router.stores.resolvedLocation, (resolvedLocation) => resolvedLocation?.state.__TSR_key), router]);
	return null;
}
var MatchInner = import_react.memo(function MatchInnerImpl({ matchId }) {
	const router = useRouter();
	const getMatchPromise = (match, key) => {
		return router.getMatch(match.id)?._nonReactive[key] ?? match._nonReactive[key];
	};
	const matchStore = router.stores.matchStores.get(matchId);
	if (!matchStore) invariant();
	const match = useStore(matchStore, (value) => value);
	const routeId = match.routeId;
	const route = router.routesById[routeId];
	const key = import_react.useMemo(() => {
		const remountDeps = (router.routesById[routeId].options.remountDeps ?? router.options.defaultRemountDeps)?.({
			routeId,
			loaderDeps: match.loaderDeps,
			params: match._strictParams,
			search: match._strictSearch
		});
		return remountDeps ? JSON.stringify(remountDeps) : void 0;
	}, [
		routeId,
		match.loaderDeps,
		match._strictParams,
		match._strictSearch,
		router.options.defaultRemountDeps,
		router.routesById
	]);
	const out = import_react.useMemo(() => {
		const Comp = route.options.component ?? router.options.defaultComponent;
		if (Comp) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {}, key);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	}, [
		key,
		route.options.component,
		router.options.defaultComponent
	]);
	if (match._displayPending) throw getMatchPromise(match, "displayPendingPromise");
	if (match._forcePending) throw getMatchPromise(match, "minPendingPromise");
	if (match.status === "pending") {
		const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
		if (pendingMinMs) {
			const routerMatch = router.getMatch(match.id);
			if (routerMatch && !routerMatch._nonReactive.minPendingPromise) {
				const minPendingPromise = createControlledPromise();
				routerMatch._nonReactive.minPendingPromise = minPendingPromise;
				setTimeout(() => {
					minPendingPromise.resolve();
					routerMatch._nonReactive.minPendingPromise = void 0;
				}, pendingMinMs);
			}
		}
		throw getMatchPromise(match, "loadPromise");
	}
	if (match.status === "notFound") {
		if (!isNotFound(match.error)) invariant();
		return renderRouteNotFound(router, route, match.error);
	}
	if (match.status === "redirected") {
		if (!isRedirect(match.error)) invariant();
		throw getMatchPromise(match, "loadPromise");
	}
	if (match.status === "error") throw match.error;
	return out;
});
/**
* Render the next child match in the route tree. Typically used inside
* a route component to render nested routes.
*
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/outletComponent
*/
var Outlet = import_react.memo(function OutletImpl() {
	const router = useRouter();
	const matchId = import_react.useContext(matchContext);
	let routeId;
	let parentGlobalNotFound = false;
	let childMatchId;
	{
		const parentMatchStore = matchId ? router.stores.matchStores.get(matchId) : void 0;
		[routeId, parentGlobalNotFound] = useStore(parentMatchStore, (match) => [match?.routeId, match?.globalNotFound ?? false], outletMatchSelectionEqual);
		childMatchId = useStore(router.stores.matchesId, (ids) => {
			return ids[ids.findIndex((id) => id === matchId) + 1];
		});
	}
	const route = routeId ? router.routesById[routeId] : void 0;
	const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.defaultPendingComponent, {}) : null;
	if (parentGlobalNotFound) {
		if (!route) invariant();
		return renderRouteNotFound(router, route, void 0);
	}
	if (!childMatchId) return null;
	const nextMatch = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, { matchId: childMatchId });
	if (routeId === "__root__") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: pendingElement,
		children: nextMatch
	});
	return nextMatch;
});
//#endregion
export { ErrorComponent as a, getLocationChangeInfo as c, encode as d, isNotFound as f, CatchBoundary as i, createNonReactiveMutableStore as l, Outlet as n, RouterCore as o, SafeFragment as r, defaultSerializeError as s, Match as t, createNonReactiveReadonlyStore as u };
