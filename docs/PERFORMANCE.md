# StoriLeaf public site performance foundations

Status 18 October 2026. Adopt sound architecture during page creation. The final Core Web Vitals programme and production tuning are deferred until the wider website is built.

## Image loading

Reserve image space with width and height or aspect-ratio. Maintain actual crop and focal point across responsive layouts. Provide size-appropriate image assets and srcset/sizes where the approved library supplies them. Use decoding async and lazy loading for below-the-fold decorative/secondary images, not the first likely LCP photograph.

Do not eagerly decode every cover or large asset by default. The current homepage includes fourteen eager orbit image tags referencing seven distinct thumbnails; this is a performance measurement candidate, not authorisation to change orbit appearance or motion.

Maintain an asset record with original source, approval, intrinsic dimensions, responsive crops, alt text and whether the image is decorative or meaning-bearing.

## Skeletons and loading states

Do not add skeletons to normal static editorial copy or immediately available photographs. Reserve their actual dimensions and render them normally. Use skeletons only when a real asynchronous load or route transition needs one, matching the eventual layout to avoid content jumps. Mark busy regions accessibly.

Give controls explicit in-progress, success, error and empty states where a real action warrants it. Do not disguise an unbuilt page or unsubscribed newsletter preview as a loading indicator.

## Fonts

Use Newsreader and Manrope, ideally with preconnect and deliberate font loading. Use reasonable weight subsets and font-display swap or equivalent; test fallback metrics, line breaks and text reflow. Do not include or share paid font files.

## JavaScript, routing and motion

Use page-level code splitting when multiple React pages exist. Shared site header and newsletter/footer must not be reimplemented for each route. Do not import private SDKs or a full dashboard framework to build editorial pages. Prefer semantic HTML and small React components over unnecessary runtime effects.

Keep initial content visible when scripts fail. Prefer reduced motion and pause nonessential offscreen animation work where measurable. No new prominent Pause movement control; the founder rejected it.

## QA later

Before real website release, measure LCP, CLS, INP, total transfer, requests, slow mobile CPU/network, cold and warm cache, image decoding, font loading and memory. Add 200 and 400 percent zoom, keyboard, screen reader, iOS/Android touch, short-height and landscape tests. An existing browser QA success means interactions passed, not that performance is optimised.

## Migration rule

Build output remains separate from the root public preview until visual parity is reviewed. New performance optimisations must not silently alter current approved photography, content, section order or animations.
