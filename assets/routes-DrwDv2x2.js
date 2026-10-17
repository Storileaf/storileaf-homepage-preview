import { G as require_react, o as require_jsx_runtime, q as __toESM } from "./useStore-DY_dpydU.js";
import { t as Link } from "./link-CrvydYrW.js";
import { C as DialogTitle, S as DialogPortal, _ as Dialog, a as BookDiscovery, b as DialogDescription, c as Hero, d as useVisualEntrance, f as LIVE_SITE, g as samples, h as logo, i as Process, l as Icon, m as images, n as Footer, o as TrustBand, p as guides, r as GiftSection, s as Header, t as FAQSection, u as useReducedMotion, v as DialogClose, w as DialogTrigger, x as DialogOverlay, y as DialogContent } from "./content-sections-CfrmOVRI.js";
//#region src/components/storileaf/resources-newsletter.tsx
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var exampleQuestions = [
	"What is one small family tradition that you still remember?",
	"Which journey took an unexpected turn for the better?",
	"What is something you and a friend remember differently?",
	"Is there a photograph you would love to know more about?"
];
function ResourceSection() {
	const [questionIndex, setQuestionIndex] = (0, import_react.useState)(0);
	const guide = guides[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "resources-section section-space",
		id: "resources",
		"aria-labelledby": "resources-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-width",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				id: "resources-title",
				className: "resources-title",
				children: ["A little curiosity ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "can go a long way." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "resources-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "resource-question-feature",
					id: "resources-activity",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "One Question, One Story" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "resource-illustrative-question",
							"aria-live": "polite",
							"aria-atomic": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "resource-question-asterisk",
								"aria-hidden": "true",
								children: "✳"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: exampleQuestions[questionIndex] }, questionIndex)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "button button-outline",
							onClick: () => setQuestionIndex((i) => (i + 1) % exampleQuestions.length),
							"data-testid": "next-resource-question",
							children: ["Another question ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "resource-guide-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: LIVE_SITE + guide.href,
						className: "resource-guide-link",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "resource-guide-photo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: guide.image,
								alt: guide.alt,
								width: "620",
								height: "520",
								loading: "lazy",
								decoding: "async"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "resource-guide-body",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: guide.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "resource-card-link",
								children: ["Read the guide ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
							})]
						})]
					})
				})]
			})]
		})
	});
}
function NewsletterStrip() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "newsletter-strip",
		"aria-labelledby": "newsletter-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-width newsletter-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				id: "newsletter-title",
				children: ["A good question, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "now and then." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Story prompts, thoughtful ideas and occasional notes from StoriLeaf." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "newsletter-form-area",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "button",
					href: LIVE_SITE + "/#newsletter-heading",
					children: ["Sign up for StoriLeaf notes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
				})
			})]
		})
	});
}
//#endregion
//#region src/components/storileaf/sample-gallery.tsx
function BookSpread({ sample }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `book-spread ${sample.id === "letter" ? "letter-spread" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sample-page sample-written-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sample-chapter",
						children: sample.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: sample.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sample-excerpt",
						children: sample.paragraphs.slice(0, sample.id === "letter" ? 4 : 3).map((text, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text }, index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sample-page-number",
						children: "12"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sample-page sample-facing-page",
				children: [sample.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: sample.image,
					alt: sample.alt,
					width: "420",
					height: "510",
					loading: "lazy",
					decoding: "async"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "sample-photo-caption",
					children: sample.caption
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "letter-continuation",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sample-chapter",
							children: "For the road ahead"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: sample.paragraphs[4] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: sample.paragraphs[5] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "letter-rule" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sample-page-number",
					children: "13"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "book-gutter",
				"aria-hidden": "true"
			})
		]
	});
}
function SampleGallery() {
	const rail = (0, import_react.useRef)(null);
	const lastTrigger = (0, import_react.useRef)(null);
	const [position, setPosition] = (0, import_react.useState)(0);
	const [opened, setOpened] = (0, import_react.useState)(null);
	const reduced = useReducedMotion();
	function move(next) {
		const root = rail.current;
		if (!root) return;
		const bounded = Math.min(samples.length - 1, Math.max(0, next));
		const child = root.children[bounded];
		if (child) root.scrollTo({
			left: child.offsetLeft - root.offsetLeft,
			behavior: reduced ? "instant" : "smooth"
		});
	}
	function updatePosition() {
		const root = rail.current;
		if (!root) return;
		const first = root.children[0];
		const second = root.children[1];
		const spacing = first && second ? second.offsetLeft - first.offsetLeft : 1;
		const atEnd = root.scrollLeft >= root.scrollWidth - root.clientWidth - 5;
		setPosition(atEnd ? samples.length - 1 : Math.min(samples.length - 1, Math.round(root.scrollLeft / spacing)));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "samples-section section-space",
		id: "samples",
		"aria-labelledby": "samples-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "page-width samples-frame",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-heading-row samples-heading editorial-heading-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						id: "samples-title",
						children: ["See what your stories can ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "become." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-lead",
						children: "A closer look at the pages, photographs and finished book."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "gallery-controls",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-button bordered",
							"aria-label": "Previous sample",
							onClick: () => move(position - 1),
							disabled: position === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								name: "arrow",
								className: "rotate-180"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-button bordered",
							"data-testid": "sample-next",
							"aria-label": "Next sample",
							onClick: () => move(position + 1),
							disabled: position === samples.length - 1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sample-rail-outer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sample-rail",
					ref: rail,
					tabIndex: 0,
					role: "region",
					"aria-label": "Sample book pages",
					onScroll: updatePosition,
					onKeyDown: (event) => {
						if (event.target !== event.currentTarget) return;
						if (event.key === "ArrowRight") {
							event.preventDefault();
							move(position + 1);
						}
						if (event.key === "ArrowLeft") {
							event.preventDefault();
							move(position - 1);
						}
					},
					"data-testid": "sample-rail",
					children: samples.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: `sample-card sample-card-${sample.id}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "sample-open",
							onClick: (event) => {
								lastTrigger.current = event.currentTarget;
								setOpened(sample);
							},
							"aria-label": `Read a ${sample.category.toLowerCase()} sample story`,
							"data-testid": `sample-${sample.id}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookSpread, { sample }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sample-card-caption",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: sample.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Sample story" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sample-read-action",
									children: ["Read this example ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "expand" })]
								})]
							})]
						})
					}, sample.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "page-width samples-frame book-craft",
				"aria-labelledby": "book-craft-title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "book-craft-image",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: images.binding,
						alt: "Close view of the binding and pages of a StoriLeaf book",
						width: "1200",
						height: "800",
						loading: "lazy",
						decoding: "async"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The finished book" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "book-craft-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							id: "book-craft-title",
							children: ["A book you can ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "come back to." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Every package includes a printed book. You review a prepared draft before it goes to print." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "book-craft-details",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "book-craft-detail",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "small-label",
										children: "Printed copy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Included with every package." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "book-craft-detail",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "small-label",
										children: "Binding and finish"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Package specific. Selected options include a jacketed book, premium paper or embossing." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "book-craft-detail",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "small-label",
										children: "Before print"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "You review the prepared draft first." })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `${LIVE_SITE}/pricing/`,
							className: "text-link",
							children: ["See package details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "page-width samples-frame samples-bottom",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `${LIVE_SITE}/book-preview/`,
					className: "text-link",
					children: ["See more inside the books ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: opened !== null,
				onOpenChange: (open) => {
					if (!open) setOpened(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sample-dialog dialog-content",
					onCloseAutoFocus: (event) => {
						event.preventDefault();
						lastTrigger.current?.focus();
					},
					"data-testid": "sample-dialog",
					children: opened && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dialog-topline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "small-label",
								children: opened.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
								className: "icon-button",
								"aria-label": "Close sample",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "sample-dialog-title",
							children: opened.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "dialog-description",
							children: "A sample story, written to show how the pages can read."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sample-dialog-body",
							children: opened.paragraphs.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, index))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dialog-footer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Every book begins with your own experiences." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://storileaf.com/${opened.product}/`,
								className: "text-link",
								children: ["Explore this book ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
							})]
						})
					] })
				})] })
			})
		]
	});
}
//#endregion
//#region src/components/storileaf/device-showcase.tsx
function EditorScreen({ format }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `editor-screen editor-${format}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "editor-topbar",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: logo,
				alt: "",
				width: "80",
				height: "20",
				loading: "lazy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "editor-avatar",
				children: "S"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "editor-layout",
			children: [format === "laptop" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "editor-sidebar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Your life story" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "screen-sidebar-label",
						children: "Your chapters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "screen-active-chapter",
						children: "The early years"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "People and places" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Work and adventures" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "What matters to you" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "screen-sidebar-bottom",
						children: "A little at a time."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "editor-main",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "screen-breadcrumb",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The early years" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "screen-draft",
							children: "Draft"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What do you remember about the home you grew up in?" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "screen-helper",
						children: "Think about a room, a sound or someone who was always there."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "screen-answer",
						children: ["The kitchen was the smallest room in our home. Somehow, it was where everyone ended up.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "screen-cursor" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "screen-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your words, your story." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "screen-next",
							children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
						})]
					})
				]
			})]
		})]
	});
}
function DeviceShowcase() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [answer, setAnswer] = (0, import_react.useState)("");
	const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "devices-section section-space",
		id: "writing-space",
		"aria-labelledby": "devices-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-width",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "centred-section-heading editorial-device-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						id: "devices-title",
						children: ["Write a little. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Come back when you are ready." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-lead",
						children: "Each question gives you somewhere to start. Add a few lines now, return later, and build the story in manageable pieces."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "device-stage",
					"aria-hidden": "true",
					"data-visual-entrance": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "device-floor" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "device-laptop",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "laptop-display",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "device-camera" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorScreen, { format: "laptop" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "laptop-base",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "device-tablet",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "device-camera" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorScreen, { format: "tablet" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "device-phone",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "phone-island" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorScreen, { format: "phone" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "phone-home-bar" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mobile-workspace-preview",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What do you remember about the home you grew up in?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Think about a room, a sound or someone who was always there." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "device-demo-action",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open,
						onOpenChange: (next) => {
							setOpen(next);
							if (!next) setAnswer("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "button button-outline",
								"data-testid": "try-question",
								children: ["Try a writing prompt ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "dialog-content question-dialog",
							"data-testid": "question-dialog",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "dialog-topline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
										className: "icon-button",
										"aria-label": "Close writing example",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "What do you remember about the home you grew up in?" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
									id: "demo-privacy",
									children: "This is a practice space. What you write here isn't saved."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "demo-label",
									htmlFor: "demo-answer",
									children: "Your example answer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "demo-answer",
									"data-testid": "demo-answer",
									"aria-describedby": "demo-privacy",
									value: answer,
									onChange: (event) => setAnswer(event.target.value),
									maxLength: 2e3,
									rows: 6,
									placeholder: "A familiar room, a sound, a person who was always there…"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "demo-answer-meta",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										wordCount,
										" ",
										wordCount === 1 ? "word" : "words"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "subtle-button",
										onClick: () => setAnswer(""),
										disabled: !answer,
										children: "Clear text"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
									className: "button",
									children: ["Close ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check" })]
								})
							]
						})] })]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Homepage() {
	const [currency, setCurrency] = (0, import_react.useState)("inr");
	useVisualEntrance();
	(0, import_react.useEffect)(() => {
		try {
			const preference = localStorage.getItem("storileaf.preview.currency");
			if (preference === "inr" || preference === "usd" || preference === "cad" || preference === "gbp") setCurrency(preference);
		} catch {}
	}, []);
	function changeCurrency(value) {
		setCurrency(value);
		try {
			localStorage.setItem("storileaf.preview.currency", value);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		"data-testid": "storileaf-home",
		"data-state": "ready",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				hash: "main-content",
				className: "skip-link",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { currency }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookDiscovery, { currency }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGallery, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceShowcase, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftSection, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceSection, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
				currency,
				onCurrencyChange: changeCurrency
			})
		]
	});
}
//#endregion
export { Homepage as component };
