import { G as require_react, o as require_jsx_runtime, q as __toESM } from "./useStore-DY_dpydU.js";
import { t as Link } from "./link-CrvydYrW.js";
import { C as DialogTitle, S as DialogPortal, _ as Dialog, b as DialogDescription, f as LIVE_SITE, l as Icon, m as images, n as Footer, s as Header, v as DialogClose, x as DialogOverlay, y as DialogContent } from "./content-sections-CfrmOVRI.js";
//#region src/data/pricing.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
var pricingCurrencies = [
	{
		code: "inr",
		label: "INR · ₹"
	},
	{
		code: "usd",
		label: "USD · US$"
	},
	{
		code: "cad",
		label: "CAD · C$"
	},
	{
		code: "gbp",
		label: "GBP · £"
	}
];
var pricePrefixes = {
	inr: "₹",
	usd: "US$",
	cad: "C$",
	gbp: "£"
};
function displayPrice(amount, currency) {
	return pricePrefixes[currency] + new Intl.NumberFormat(currency === "inr" ? "en-IN" : "en-GB", { maximumFractionDigits: 0 }).format(amount);
}
var pricingBooks = [
	{
		slug: "life-story",
		name: "Life Story",
		lead: "A life is made up of more than the big milestones.",
		summary: "From a focused collection of memories to a fuller family edition. Choose how much room, writing time and editorial support you want.",
		image: images.life,
		imageAlt: "An older woman and her daughter looking through an open personal book",
		qualification: "Standard shipping within India is listed as included. International shipping, customs and special delivery charges are additional.",
		plans: [
			{
				slug: "memories-treasure",
				name: "Memories Treasure",
				distinction: "A focused place to begin",
				summary: "For the memories, people and milestones you most want to keep.",
				prices: {
					inr: 8700,
					usd: 99,
					cad: 139,
					gbp: 79
				},
				access: "4 months",
				printed: "1 hardcover",
				pages: "Up to approximately 200",
				highlights: [
					"85+ guided questions",
					"Text and photographs",
					"A downloadable PDF"
				],
				inclusions: [
					"85+ carefully curated reflective questions",
					"One professionally printed hardcover book",
					"A downloadable PDF copy of content",
					"Secure cloud storage for stories and photographs",
					"4 months of guided access",
					"Optional 3-month extension at a reduced price"
				],
				limits: [
					"500 words per answer",
					"2 photographs per question",
					"Voice recording and transcription not included"
				]
			},
			{
				slug: "legacy",
				name: "Legacy",
				distinction: "Editorial feedback included",
				summary: "More space and time to tell your story, with one round of personalised editorial feedback.",
				prices: {
					inr: 11400,
					usd: 129,
					cad: 179,
					gbp: 99
				},
				access: "6 months",
				printed: "2 copies · jacketed book + gift copy",
				pages: "Up to approximately 250",
				highlights: [
					"85+ guided questions",
					"Voice recording with transcription",
					"One round of editorial feedback"
				],
				inclusions: [
					"85+ carefully curated reflective questions",
					"Priority editorial attention",
					"One round of personalised editorial feedback",
					"One professionally printed jacketed hardcover book plus one additional gift copy",
					"A downloadable PDF e-book",
					"Secure cloud storage for stories and photographs",
					"6 months of guided access",
					"Optional 3-month extension at a reduced price"
				],
				limits: [
					"600 words per answer",
					"5 photographs per question",
					"Voice recording with transcription included"
				],
				standout: true
			},
			{
				slug: "family-heritage",
				name: "Family Heritage",
				distinction: "More room and guided support",
				summary: "The most expansive Life Story package, with premium finishing and scheduled guidance.",
				prices: {
					inr: 16800,
					usd: 189,
					cad: 259,
					gbp: 139
				},
				access: "12 months",
				printed: "2 hardcover copies",
				pages: "Up to approximately 350",
				highlights: [
					"Premium paper and embossing",
					"Scheduled guidance calls",
					"Digital photograph enhancement"
				],
				inclusions: [
					"85+ carefully curated reflective questions",
					"Two professionally printed hardcover books",
					"Luxury hardcover with premium paper and embossing included",
					"Guided support through scheduled calls",
					"Digital enhancement of photographs",
					"A downloadable PDF e-book",
					"Secure cloud storage for stories and photographs",
					"12 months of guided access",
					"Optional 3-month extension at a reduced price"
				],
				limits: [
					"800 words per answer",
					"5 photographs per question",
					"Voice recording with transcription included"
				]
			}
		],
		comparison: [
			{
				label: "Writing access",
				values: [
					"4 months",
					"6 months",
					"12 months"
				]
			},
			{
				label: "Book length",
				values: [
					"Up to ~200 pages",
					"Up to ~250 pages",
					"Up to ~350 pages"
				]
			},
			{
				label: "Printed books",
				values: [
					"1 hardcover",
					"Jacketed hardcover + gift copy",
					"2 luxury hardcovers"
				]
			},
			{
				label: "Words per answer",
				values: [
					"500",
					"600",
					"800"
				]
			},
			{
				label: "Photographs per question",
				values: [
					"2",
					"5",
					"5"
				]
			},
			{
				label: "Voice transcription",
				values: [
					"Not included",
					"Included",
					"Included"
				]
			},
			{
				label: "Editorial guidance",
				values: [
					"Standard preparation",
					"Priority attention + one feedback round",
					"Scheduled guidance calls"
				]
			},
			{
				label: "Print finish",
				values: [
					"Hardcover",
					"Jacketed hardcover",
					"Premium paper + embossing"
				]
			},
			{
				label: "Download",
				values: [
					"PDF",
					"PDF",
					"PDF"
				]
			}
		]
	},
	{
		slug: "travel-memoir",
		name: "Travel Memoir",
		lead: "Some journeys never really leave us.",
		summary: "One journey that changed something, or up to three journeys in a single book. Both include voice transcription, photographs and a finished hardcover.",
		image: images.travel,
		imageAlt: "Friends talking while travelling through green hills",
		plans: [{
			slug: "one-trip",
			name: "Single Trip",
			distinction: "One journey",
			summary: "The people, wrong turns and places from one trip that stayed with you.",
			prices: {
				inr: 6e3,
				usd: 75,
				cad: 99,
				gbp: 59
			},
			access: "3 months",
			printed: "1 hardcover",
			pages: "Up to approximately 120",
			highlights: [
				"One trip",
				"Voice recording with transcription",
				"A downloadable PDF"
			],
			inclusions: [
				"Single-trip guided questions",
				"Timeline, trip card and question groups",
				"Cultural discovery and closing introspection",
				"One professionally printed hardcover book",
				"A downloadable PDF digital book",
				"3 months of guided access"
			],
			limits: [
				"One trip",
				"600 words per answer",
				"5 photographs per question",
				"Voice recording with transcription included"
			]
		}, {
			slug: "up-to-three-trips",
			name: "Multiple Trips",
			distinction: "Up to three journeys",
			summary: "Bring up to three journeys together, with a little more room for each one.",
			prices: {
				inr: 12300,
				usd: 139,
				cad: 189,
				gbp: 105
			},
			access: "6 months",
			printed: "1 hardcover",
			pages: "Up to approximately 200",
			highlights: [
				"Up to 3 trips",
				"Per-trip timelines and questions",
				"A downloadable PDF"
			],
			inclusions: [
				"Timeline, trip cards and question groups for each trip",
				"Cultural discovery and people prompts",
				"Reflection across all trips",
				"One professionally printed hardcover book",
				"A downloadable PDF digital book",
				"6 months of guided access"
			],
			limits: [
				"Up to 3 trips",
				"600 words per answer",
				"5 photographs per question",
				"Voice recording with transcription included"
			],
			standout: true
		}],
		comparison: [
			{
				label: "Journeys included",
				values: ["1 trip", "Up to 3 trips"]
			},
			{
				label: "Writing access",
				values: ["3 months", "6 months"]
			},
			{
				label: "Book length",
				values: ["Up to ~120 pages", "Up to ~200 pages"]
			},
			{
				label: "Printed book",
				values: ["1 hardcover", "1 hardcover"]
			},
			{
				label: "Words per answer",
				values: ["600", "600"]
			},
			{
				label: "Photographs per question",
				values: ["5", "5"]
			},
			{
				label: "Voice transcription",
				values: ["Included", "Included"]
			},
			{
				label: "Download",
				values: ["PDF", "PDF"]
			}
		]
	},
	{
		slug: "relationship-memoir",
		name: "Relationship Memoir",
		lead: "The things that became part of your story together.",
		summary: "Choose a book written in one voice or a more expansive shared memoir with one partner contributor.",
		image: images.relationship,
		imageAlt: "A couple sharing a personal moment at home",
		plans: [
			{
				slug: "story-of-us",
				name: "Story of Us",
				distinction: "Written in one voice",
				summary: "A personal record of the memories, rituals and turning points that shaped the relationship.",
				prices: {
					inr: 9600,
					usd: 109,
					cad: 149,
					gbp: 85
				},
				access: "4 months",
				printed: "1 hardcover",
				pages: "Up to 200",
				highlights: [
					"96 guided questions",
					"One storyteller",
					"A downloadable PDF"
				],
				inclusions: [
					"96 relationship-led guided questions",
					"One professionally printed hardcover book",
					"Photo captions and shared-memory sections",
					"A downloadable PDF copy",
					"4 months of guided access"
				],
				limits: [
					"One storyteller, no partner contributor",
					"600 words per question",
					"3 photographs per question",
					"Voice transcription not included"
				]
			},
			{
				slug: "together",
				name: "Together",
				distinction: "With one partner contributor",
				summary: "For two perspectives on a life together, with room for richer detail and an additional copy.",
				prices: {
					inr: 14700,
					usd: 165,
					cad: 225,
					gbp: 125
				},
				access: "6 months",
				printed: "1 hardcover + gift copy",
				pages: "Up to 350",
				highlights: [
					"96 guided questions",
					"One partner contributor",
					"An additional gift copy"
				],
				inclusions: [
					"96 expanded relationship questions",
					"Chapter organisation by relationship phase",
					"One hardcover book plus one gift copy",
					"A downloadable PDF e-book",
					"6 months of guided access"
				],
				limits: [
					"One guest partner contributor",
					"800 words per question",
					"5 photographs per question",
					"Voice transcription not included"
				],
				standout: true
			},
			{
				slug: "anniversary",
				name: "Anniversary",
				distinction: "More chapters and photographs",
				summary: "A longer view of the milestones, photographs and small details across the years.",
				prices: {
					inr: 18600,
					usd: 205,
					cad: 279,
					gbp: 155
				},
				access: "12 months",
				printed: "1 hardcover + gift copy",
				pages: "Up to 420",
				highlights: [
					"96 guided questions",
					"One partner contributor",
					"More pages and photographs"
				],
				inclusions: [
					"96-question extended relationship story structure",
					"One professionally printed hardcover book and one gift copy",
					"Photograph sequencing and captions",
					"Extended relationship chapters",
					"12 months of guided access"
				],
				limits: [
					"One guest partner contributor",
					"800 words per question",
					"8 photographs per question",
					"Voice transcription not included"
				]
			}
		],
		comparison: [
			{
				label: "Who contributes",
				values: [
					"One storyteller",
					"Storyteller + one partner",
					"Storyteller + one partner"
				]
			},
			{
				label: "Writing access",
				values: [
					"4 months",
					"6 months",
					"12 months"
				]
			},
			{
				label: "Book length",
				values: [
					"Up to 200 pages",
					"Up to 350 pages",
					"Up to 420 pages"
				]
			},
			{
				label: "Printed books",
				values: [
					"1 hardcover",
					"Hardcover + gift copy",
					"Hardcover + gift copy"
				]
			},
			{
				label: "Guided questions",
				values: [
					"96",
					"96",
					"96"
				]
			},
			{
				label: "Words per question",
				values: [
					"600",
					"800",
					"800"
				]
			},
			{
				label: "Photographs per question",
				values: [
					"3",
					"5",
					"8"
				]
			},
			{
				label: "Voice transcription",
				values: [
					"Not included",
					"Not included",
					"Not included"
				]
			},
			{
				label: "Download",
				values: [
					"PDF",
					"PDF",
					"Not specified in current public tier list"
				]
			}
		],
		qualification: "Together and Anniversary allow one invited guest partner, not an unlimited group. The Anniversary digital download needs confirmation before being advertised as included."
	},
	{
		slug: "founders-memoir",
		name: "Founder’s Memoir",
		lead: "There was a reason you began.",
		summary: "Document the people, decisions and lessons behind what you built, through your own answers or an interview-supported package.",
		image: images.founder,
		imageAlt: "A founder at work in her studio",
		plans: [{
			slug: "founder-story",
			name: "Founder Story",
			distinction: "Self-guided",
			summary: "Build the account of your business journey in your own words, one question at a time.",
			prices: {
				inr: 12300,
				usd: 139,
				cad: 189,
				gbp: 105
			},
			access: "4 months",
			printed: "1 hardcover",
			pages: "Up to approximately 250",
			highlights: [
				"40 guided questions",
				"Written or recorded answers",
				"A downloadable digital memoir"
			],
			inclusions: [
				"Question and answer format",
				"Guided prompts about identity, pivots, people and purpose",
				"Text answers and voice recording",
				"Photographs and artefacts",
				"One professionally printed hardcover book",
				"A downloadable digital memoir",
				"4 months of guided access"
			],
			limits: [
				"40 guided questions",
				"600 words per question",
				"2 photographs or artefacts per question",
				"One founder voice"
			]
		}, {
			slug: "founder-interview",
			name: "Founder Interview",
			distinction: "Two discovery calls included",
			summary: "A guided way to look closely at sacrifices, choices and transformations with two discovery calls.",
			prices: {
				inr: 16800,
				usd: 189,
				cad: 259,
				gbp: 139
			},
			access: "6 months",
			printed: "1 hardcover",
			pages: "Up to approximately 300",
			highlights: [
				"Two discovery calls",
				"More room for longer answers",
				"A downloadable digital memoir"
			],
			inclusions: [
				"Two discovery calls coordinated offline",
				"Identity, sacrifices, trade-offs, transformation and legacy",
				"Photographs and artefacts",
				"One professionally printed hardcover book",
				"A downloadable digital memoir",
				"6 months of guided access"
			],
			limits: [
				"40 guided questions",
				"1,200 words per question",
				"5 photographs or artefacts per question",
				"One founder voice",
				"Voice transcription not explicitly specified for this tier"
			],
			standout: true
		}],
		comparison: [
			{
				label: "Approach",
				values: ["Self-guided questions", "Two discovery calls coordinated offline"]
			},
			{
				label: "Writing access",
				values: ["4 months", "6 months"]
			},
			{
				label: "Book length",
				values: ["Up to ~250 pages", "Up to ~300 pages"]
			},
			{
				label: "Printed book",
				values: ["1 hardcover", "1 hardcover"]
			},
			{
				label: "Guided questions",
				values: ["40", "40"]
			},
			{
				label: "Words per question",
				values: ["600", "1,200"]
			},
			{
				label: "Photographs or artefacts",
				values: ["2 per question", "5 per question"]
			},
			{
				label: "Input and support",
				values: ["Text and voice recording", "Interview support; voice transcription not confirmed"]
			},
			{
				label: "Download",
				values: ["Digital memoir", "Digital memoir"]
			}
		],
		qualification: "Founder Interview includes two discovery calls arranged offline. It is not an unlimited interview or ghostwriting service."
	},
	{
		slug: "parent-to-child-letters",
		name: "Parent to Child Letters",
		lead: "Some things are better kept in your own words.",
		summary: "One carefully guided collection of letters, from a parent to a growing or adult child.",
		image: images.letters,
		imageAlt: "A mother passing a book of letters to her adult daughter",
		plans: [{
			slug: "story-of-letters",
			name: "Story of Letters",
			distinction: "A complete letter collection",
			summary: "Write the stories, guidance and things you want your child to hear in your voice.",
			prices: {
				inr: 8700,
				usd: 119,
				cad: 159,
				gbp: 95
			},
			access: "3 months",
			printed: "1 hardcover",
			pages: "Up to 150",
			highlights: [
				"30 guided letters in 8 sections",
				"Written in one parent’s voice",
				"A downloadable PDF"
			],
			inclusions: [
				"30 guided letter prompts across eight sections",
				"Topics covering values, work, relationships, family and life advice",
				"One professionally printed hardcover book",
				"A downloadable PDF copy",
				"3 months of guided access"
			],
			limits: [
				"400 words per letter",
				"One parent voice",
				"No photograph uploads per question",
				"No voice recording or transcription"
			]
		}],
		comparison: [],
		qualification: "This is a written-letter experience. Photograph uploads and voice recording are not included in the approved package."
	},
	{
		slug: "celebrating-occasions",
		name: "Celebrating Occasions",
		lead: "One day, remembered by the people who were there.",
		summary: "One shared celebration book, made from the stories and details of the people closest to the occasion.",
		image: images.celebration,
		imageAlt: "Friends gathered together for a celebration",
		plans: [{
			slug: "celebration-memoir",
			name: "Celebration Memoir",
			distinction: "One occasion, many perspectives",
			summary: "Bring together stories, speeches, details and photographs from a celebration that mattered.",
			prices: {
				inr: 9600,
				usd: 129,
				cad: 179,
				gbp: 99
			},
			access: "4 months",
			printed: "1 hardcover",
			pages: "Up to approximately 200",
			highlights: [
				"One occasion",
				"Up to five invited guests",
				"A digital PDF for the storyteller"
			],
			inclusions: [
				"20 guided questions across four sections",
				"One professionally printed hardcover book",
				"One event and up to five guest contributors",
				"Room for speeches and event memories",
				"10 shared photographs and up to 5 shared videos where supported",
				"A downloadable PDF for the storyteller to share",
				"4 months of guided access",
				"Gold and cream cover direction, with finishing options discussed separately"
			],
			limits: [
				"One occasion",
				"400 words per response",
				"Up to 5 invited guest contributors",
				"Five shared videos up to 120 seconds each, where supported",
				"Guest contributors do not receive persistent final PDF download access"
			]
		}],
		comparison: [],
		qualification: "Special finishing is discussed and agreed separately. It is not a self-service checkout option. Video sharing and QR links are conditional on the supported process."
	}
];
//#endregion
//#region src/components/storileaf/pricing-page.tsx
var import_jsx_runtime = require_jsx_runtime();
function validBookSlug(value) {
	return pricingBooks.some((book) => book.slug === value) ? value : "life-story";
}
function validCurrency(value) {
	return pricingCurrencies.some((option) => option.code === value) ? value : "inr";
}
var questions = [
	{
		q: "Is this a subscription?",
		a: "No. The listed package price is a one-time payment. Each package includes a defined period for writing your story. Optional extensions, where available, are separate purchases."
	},
	{
		q: "Does paying mean my printed book arrives straight away?",
		a: "No. The storyteller answers guided questions, then submits their story for preparation. They review a prepared draft before the book goes to print. The writing-access period is not a delivery estimate."
	},
	{
		q: "Is standard shipping included outside India?",
		a: "A free standard shipping inclusion applies to addresses within India only. International shipping, customs and special delivery charges can be additional. Currency selection does not set a delivery country."
	},
	{
		q: "Can I add photographs or record my answers?",
		a: "That depends on the book and package. Travel Memoir includes photographs and voice transcription. Parent to Child Letters is a written-only experience without photograph uploads or voice recording. Always check the selected package details."
	},
	{
		q: "Can I buy a book for someone else?",
		a: "Yes. A gifted purchase invites the recipient to tell their own story and review their draft. Buying the experience does not send a completed personalised book immediately or give the buyer access to the recipient’s private answers."
	},
	{
		q: "Can I read my book before it goes to print?",
		a: "Yes. The storyteller reviews a prepared draft before production. Editorial feedback, guided calls, printed copies and finishing options vary by package."
	}
];
function DetailList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "pricing-detail-list",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })] }, item))
	});
}
function SelectedBookDetails({ book }) {
	const single = book.plans.length === 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pricing-comparison",
		id: "package-details",
		"aria-labelledby": "pricing-details-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-width",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pricing-detail-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pricing-mini-label",
							children: single ? "What is included" : "The full comparison"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "pricing-details-title",
							children: single ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Everything in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "your book." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["The details, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "without the guesswork." })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: single ? `The complete ${book.plans[0].name} package, with the important limits in plain view.` : `See what changes between the ${book.name} packages before deciding.` })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "text-link",
						href: "#pricing-packages",
						children: ["Back to packages ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
					})]
				}),
				single ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pricing-single-detail",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pricing-single-paper",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pricing-mini-label",
								children: book.plans[0].name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What you receive" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailList, { items: book.plans[0].inclusions })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pricing-single-paper pricing-single-constraints",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pricing-mini-label",
								children: "The practical details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Writing and scope" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailList, { items: book.plans[0].limits }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pricing-detail-soft-note",
								children: "Each book is prepared after the storyteller submits their writing. The listed access period is for contributing, not printing or delivery."
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pricing-table-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "pricing-table",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("caption", {
									className: "sr-only",
									children: [
										"Compare the ",
										book.name,
										" package inclusions"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									scope: "col",
									children: "What matters"
								}), book.plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									scope: "col",
									children: plan.name
								}, plan.slug))] }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: book.comparison.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									scope: "row",
									children: row.label
								}), row.values.map((value, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: value }, book.plans[index].slug))] }, row.label)) })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pricing-mobile-comparison",
						children: book.plans.map((plan, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "pricing-mobile-detail",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: plan.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "plus" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: book.comparison.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: row.values[index] })] }, row.label)) })]
						}, plan.slug))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pricing-full-inclusions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "All the listed inclusions" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Open a package to read its complete feature list and limits." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pricing-full-detail-grid",
								children: book.plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "pricing-full-detail",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: plan.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "plus" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pricing-full-detail-body",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Included" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailList, { items: plan.inclusions }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Limits and scope" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailList, { items: plan.limits })
										]
									})]
								}, plan.slug))
							})
						]
					})
				] }),
				book.qualification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pricing-product-qualification",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), book.qualification]
				})
			]
		})
	});
}
function PricingPage({ currency, activeSlug, onBookChange, onCurrencyChange }) {
	const [selectedPlan, setSelectedPlan] = (0, import_react.useState)(null);
	const activeBook = pricingBooks.find((book) => book.slug === activeSlug) ?? pricingBooks[0];
	(0, import_react.useEffect)(() => {
		setSelectedPlan(null);
	}, [currency, activeSlug]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		"data-testid": "pricing-page",
		"data-state": "ready",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main-content",
				className: "skip-link",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { currency }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "pricing-intro",
						"aria-labelledby": "pricing-title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "page-width pricing-intro-grid",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pricing-intro-copy",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pricing-mini-label",
										children: "StoriLeaf books and packages"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										id: "pricing-title",
										children: [
											"Find your book.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Choose how it comes together." })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Six ways to tell a story. Start with the book, then compare the writing time, guidance, photographs and printed copies that come with it." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pricing-intro-actions",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											className: "button",
											href: "#choose-book",
											children: ["Explore the packages ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/",
											hash: "samples",
											className: "text-link",
											children: ["See inside a book ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pricing-preview-disclosure",
										children: "Design preview. No payment or purchase is available here."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pricing-intro-visual",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: images.binding,
									alt: "Close view of the binding and page edges of a printed StoriLeaf hardcover",
									width: "1200",
									height: "800",
									decoding: "async"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pricing-intro-image-caption",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "From your words" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "to the printed page." })]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "pricing-explorer-section",
						id: "choose-book",
						"aria-labelledby": "pricing-choose-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "page-width",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pricing-section-intro",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										id: "pricing-choose-heading",
										children: ["Start with ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "your book." })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose one of the six books below. You can change your mind without losing the currency you selected." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "pricing-gift-link",
										href: `${LIVE_SITE}/gift/`,
										children: ["Buying as a gift? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pricing-book-choices",
									role: "group",
									"aria-label": "Choose a StoriLeaf book",
									"data-testid": "pricing-book-choices",
									children: pricingBooks.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: book.slug === activeSlug ? "pricing-book-choice is-selected" : "pricing-book-choice",
										"aria-pressed": book.slug === activeSlug,
										"data-testid": `pricing-book-${book.slug}`,
										onClick: () => onBookChange(book.slug),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pricing-book-thumbnail",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: book.image,
													alt: "",
													width: "350",
													height: "220",
													loading: "lazy",
													decoding: "async"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pricing-book-choice-label",
												children: book.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pricing-book-choice-dot",
												"aria-hidden": "true",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" })
											})
										]
									}, book.slug))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pricing-active-heading",
									id: "pricing-packages",
									"aria-live": "polite",
									"aria-atomic": "true",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pricing-active-copy",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "pricing-mini-label",
												children: activeBook.plans.length === 1 ? "One complete package" : `${activeBook.plans.length} packages to compare`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: activeBook.name }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "pricing-active-lead",
												children: activeBook.lead
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "pricing-active-description",
												children: activeBook.summary
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pricing-active-controls",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pricing-currency-control",
											htmlFor: "pricing-currency-select",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View prices in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "pricing-select-frame",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													id: "pricing-currency-select",
													"data-testid": "pricing-currency",
													value: currency,
													onChange: (event) => onCurrencyChange(event.target.value),
													children: pricingCurrencies.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: option.code,
														children: option.label
													}, option.code))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "chevron" })]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Currency changes prices, not delivery location." })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pricing-assurance-strip",
									"aria-label": "How the packages work",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), " A printed book with every package"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), " One-time payment"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), " You review a prepared draft before print"] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pricing-plan-grid",
									"data-count": activeBook.plans.length,
									"data-testid": "pricing-plan-grid",
									children: activeBook.plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: plan.standout ? "pricing-plan-card is-featured" : "pricing-plan-card",
										"data-testid": `pricing-plan-${plan.slug}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pricing-plan-top",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "pricing-plan-distinction",
														children: plan.distinction
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: plan.name }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "pricing-plan-summary",
														children: plan.summary
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pricing-plan-value",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayPrice(plan.prices[currency], currency) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [currency.toUpperCase(), " · One-time payment"] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
												className: "pricing-plan-facts",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Writing time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: plan.access })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Printed book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: plan.printed })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Page allowance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: plan.pages })] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "pricing-plan-highlights",
												children: plan.highlights.map((highlight) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: highlight })] }, highlight))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pricing-plan-bottom",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													className: plan.standout ? "button" : "button button-outline",
													onClick: () => setSelectedPlan(plan),
													"data-testid": `pricing-choose-${plan.slug}`,
													children: ["Choose this package ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: "#package-details",
													children: ["Compare all details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
												})]
											})
										]
									}, plan.slug))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pricing-terms-note",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "A note about shipping and timing." }),
										" Free standard shipping, where stated, applies within India. International shipping, customs and special delivery charges can be additional. The listed months are for writing, not a print or delivery estimate. ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `${LIVE_SITE}/shipping-returns/`,
											children: ["Read shipping terms ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
										})
									] })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectedBookDetails, { book: activeBook }, activeBook.slug),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "pricing-book-outcome",
						"aria-labelledby": "pricing-outcome-title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "page-width pricing-outcome-grid",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pricing-outcome-image",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: images.spread,
									alt: "An open printed StoriLeaf story book with text and a photograph",
									width: "1200",
									height: "750",
									loading: "lazy",
									decoding: "async"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "What you make is real." })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pricing-outcome-copy",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										id: "pricing-outcome-title",
										children: [
											"It begins with a question.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "It ends as a book." })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The package you choose shapes how much time and room you have to tell your story. It is your own words that make the pages yours." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tell it a little at a time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Use the guided questions and the contribution options in your package." })] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Review the prepared book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Once you submit, a draft is prepared for your review before printing." })] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Keep the finished book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your package includes at least one printed book. Copies and finishing vary." })] })] })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/",
										hash: "samples",
										className: "text-link",
										children: ["Take a look inside ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "pricing-faq",
						"aria-labelledby": "pricing-faq-title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "page-width pricing-faq-grid",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									id: "pricing-faq-title",
									children: ["A few things worth knowing ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "before you choose." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A clear answer should make a choice easier, not more complicated." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "text-link",
									href: `${LIVE_SITE}/contact/`,
									children: ["Ask StoriLeaf ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pricing-faq-list",
								children: questions.map((question) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: question.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "plus" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: question.a })] }, question.q))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "pricing-last-invitation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "page-width pricing-last-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pricing-mini-label",
								children: "A little help deciding"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["The right book is ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "the one you'll want to return to." })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Compare what is included, or ask us which of the six books might suit your story." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `${LIVE_SITE}/contact/`,
								className: "button button-gold",
								children: ["Get in touch ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
							})] })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
				currency,
				onCurrencyChange,
				previewNote: "Pricing design preview. Prices are a static reference from the reviewed StoriLeaf catalogue. No purchase or payment can be made here. Book excerpts and writing interfaces elsewhere in this preview are illustrative."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: selectedPlan !== null,
				onOpenChange: (open) => {
					if (!open) setSelectedPlan(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "dialog-content pricing-selection-dialog",
					"data-testid": "pricing-selection-dialog",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pricing-dialog-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pricing-mini-label",
								children: "Your package selection"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "icon-button",
									"aria-label": "Close selection",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close" })
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "It's a book worth making." }),
						selectedPlan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "This is a design preview, so no purchase or payment will take place." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pricing-dialog-summary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeBook.name })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The package" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedPlan.name })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Listed price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										displayPrice(selectedPlan.prices[currency], currency),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: currency.toUpperCase() })
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Writing access" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedPlan.access })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pricing-dialog-note",
								children: "In the finished website, this selection would continue to the approved StoriLeaf purchase flow. That connection has not been built into this preview."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "button",
									children: ["Return to packages ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
								})
							})
						] })
					]
				})] })
			})
		]
	});
}
//#endregion
export { validBookSlug as n, validCurrency as r, PricingPage as t };
