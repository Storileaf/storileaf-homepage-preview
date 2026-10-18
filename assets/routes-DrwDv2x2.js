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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "newsletter-inline-preview",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						"aria-label": "Email address",
						placeholder: "Your email address",
						autoComplete: "email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "button",
						href: LIVE_SITE + "/#newsletter-heading",
						children: ["Subscribe ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" })]
					})]
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/storileaf/sample-gallery.tsx
// Four existing StoriLeaf images act as temporary slideshow artwork.
// Swap image sources only after the founder supplies approved replacements.
const craftPhotoSlides = [
	{src:images.binding,alt:"Close view of the binding and cream pages of a StoriLeaf hardcover book"},
	{src:images.spread,alt:"An open StoriLeaf story book with text and a photograph across its pages"},
	{src:images.life,alt:"An older woman and her daughter looking through an open Life Story book"},
	{src:images.family,alt:"Family members reading an open personal story book together"}
];
function CraftPhotoSlideshow() {
	const [active,setActive] = (0, import_react.useState)(0);
	const [visible,setVisible] = (0, import_react.useState)(false);
	const root = (0, import_react.useRef)(null);
	const reduced = useReducedMotion();
	(0, import_react.useEffect)(()=>{
		const node=root.current;
		if(!node)return;
		if(typeof IntersectionObserver==="undefined"){setVisible(true);return;}
		const observer=new IntersectionObserver(entries=>setVisible(!!entries[0]?.isIntersecting),{threshold:0.12});
		observer.observe(node);
		return ()=>observer.disconnect();
	},[]);
	(0, import_react.useEffect)(()=>{
		if(reduced||!visible)return;
		const timer=window.setInterval(()=>setActive(current=>(current+1)%craftPhotoSlides.length),6500);
		return ()=>window.clearInterval(timer);
	},[active,reduced,visible]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div",{
		className:"book-craft-image book-craft-slideshow",
		ref:root,
		role:"group",
		"aria-label":"Finished book photographs",
		"data-active-slide":active,
		children:[
			...craftPhotoSlides.map((slide,index)=>/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img",{
				className:"book-craft-slide"+(index===active?" is-active":""),
				src:slide.src,
				alt:index===active?slide.alt:"",
				"aria-hidden":index!==active,
				width:"1200",height:"800",
				loading:index===0?"eager":"lazy",
				decoding:"async"
			},index)),
			
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div",{
				className:"book-craft-indicators",
				role:"group",
				"aria-label":"Choose slideshow image",
				children:craftPhotoSlides.map((_,index)=>/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button",{
					type:"button",
					className:"book-craft-indicator"+(index===active?" is-active":""),
					"aria-label":"Show book image "+(index+1)+" of 4",
					"aria-pressed":index===active,
					"data-testid":"book-craft-slide-"+(index+1),
					onClick:()=>setActive(index),
					children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span",{"aria-hidden":"true"})
				},index))
			})
		]
	});
}

function SampleGallery() {
	const rail = (0, import_react.useRef)(null);
	const lastTrigger = (0, import_react.useRef)(null);
	const swipeStart = (0, import_react.useRef)(null);
	const [position, setPosition] = (0, import_react.useState)(0);
	const [openedIndex, setOpenedIndex] = (0, import_react.useState)(null);
	const reduced = useReducedMotion();
	const active = openedIndex === null ? null : samples[openedIndex];
	function move(next) {
		const root = rail.current;
		if (!root) return;
		const bounded = Math.max(0, Math.min(samples.length - 1, next));
		const card = root.children[bounded];
		if (card) root.scrollTo({left:card.offsetLeft - root.offsetLeft,behavior:reduced ? "instant" : "smooth"});
	}
	function updatePosition() {
		const root = rail.current;
		if (!root) return;
		const first = root.children[0], second = root.children[1];
		const interval = first && second ? second.offsetLeft - first.offsetLeft : 1;
		const atEnd = root.scrollLeft >= root.scrollWidth - root.clientWidth - 5;
		setPosition(atEnd ? samples.length - 1 : Math.min(samples.length - 1, Math.round(root.scrollLeft / interval)));
	}
	function changeLightbox(delta) {
		setOpenedIndex(current => current === null ? null : Math.max(0, Math.min(samples.length - 1, current + delta)));
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							id: "samples-title",
							children: ["See what your stories can ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {children:"become."})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className:"section-lead",
							children:"A closer look at the pages, photographs and finished book."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className:"gallery-controls",
						children:[/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type:"button",className:"icon-button bordered",
							"aria-label":"Previous book image",
							onClick:()=>move(position-1),disabled:position===0,
							children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon,{name:"arrow-left"})
						}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button",{
							type:"button",className:"icon-button bordered",
							"data-testid":"sample-next","aria-label":"Next book image",
							onClick:()=>move(position+1),disabled:position===samples.length-1,
							children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon,{name:"arrow"})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div",{
				className:"sample-rail-outer",
				children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div",{
					className:"sample-rail",ref:rail,tabIndex:0,role:"region",
					"aria-label":"Six StoriLeaf book images",
					"data-testid":"sample-rail",
					onScroll:updatePosition,
					onKeyDown:event=>{
						if(event.target!==event.currentTarget)return;
						if(event.key==="ArrowRight"){event.preventDefault();move(position+1)}
						if(event.key==="ArrowLeft"){event.preventDefault();move(position-1)}
					},
					children:samples.map((sample,index)=>/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article",{
						className:"sample-card sample-card-"+sample.id,
						children:/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button",{
							type:"button",className:"sample-open",
							"aria-label":"Open "+sample.category+" book image",
							"data-testid":"sample-"+sample.id,
							onClick:event=>{lastTrigger.current=event.currentTarget;setOpenedIndex(index)},
							children:[/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span",{
								className:"sample-photo-frame",
								children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img",{
									src:sample.image,alt:sample.alt,width:"1200",height:"800",loading:"lazy",decoding:"async"
								})
							}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span",{
								className:"sample-card-caption",
								children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong",{children:sample.category})
							})]
						})
					},sample.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "page-width samples-frame book-craft",
				"aria-labelledby": "book-craft-title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CraftPhotoSlideshow, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "book-craft-detail-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "book-craft-detail-icon",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
											stroke: "currentColor", strokeWidth: "1.65", strokeLinecap: "round", strokeLinejoin: "round",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 7c-2.7-2.1-5.8-2.7-9-1.6V19c3.2-1 6.3-.4 9 1.8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 7c2.7-2.1 5.8-2.7 9-1.6V19c-3.2-1-6.3-.4-9 1.8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 7v13.8" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Printed copy" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "book-craft-detail-description",
									children: "Your words and memories come together in a beautifully printed book, thoughtfully designed to be held, shared and revisited for years."
								})]
							}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "book-craft-detail",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "book-craft-detail-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "book-craft-detail-icon",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
											stroke: "currentColor", strokeWidth: "1.65", strokeLinecap: "round", strokeLinejoin: "round",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m12 3 9 6-9 6-9-6 9-6Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 14l9 6 9-6" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Binding and finish" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "book-craft-detail-description",
									children: "A premium hardcover with a cover design chosen by you, personalised with the photographs and details that make the story yours."
								})]
							}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "book-craft-detail",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "book-craft-detail-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "book-craft-detail-icon",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
											stroke: "currentColor", strokeWidth: "1.65", strokeLinecap: "round", strokeLinejoin: "round",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 3h8l4 4v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 3v5h4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m8.5 15 2.4 2.3 4.6-4.8" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Before print" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "book-craft-detail-description",
									children: "Our editorial team carefully prepares and checks every book. You then review and approve the draft before it goes to print."
								})]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog,{
				open:openedIndex!==null,
				onOpenChange:open=>{if(!open)setOpenedIndex(null)},
				children:/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal,{
					children:[/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay,{
						className:"dialog-overlay sample-lightbox-overlay"
					}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent,{
						className:"dialog-content sample-lightbox",
						onCloseAutoFocus:event=>{event.preventDefault();lastTrigger.current?.focus()},
						onKeyDown:event=>{
							if(event.key==="ArrowLeft"){event.preventDefault();changeLightbox(-1)}
							if(event.key==="ArrowRight"){event.preventDefault();changeLightbox(1)}
						},
						children:active&&/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment,{
							children:[/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div",{
								className:"sample-lightbox-topline",
								children:[/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle,{
									className:"sample-lightbox-title",children:active.category
								}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose,{
									className:"icon-button sample-lightbox-close",
									"aria-label":"Close book image",
									children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon,{name:"close"})
								})]
							}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription,{
								className:"sample-lightbox-description",
								children:"Browse the six book images with arrow keys, controls or touch gestures."
							}),/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div",{
								className:"sample-lightbox-stage",
								onTouchStart:event=>{
									if(event.touches.length===1)swipeStart.current={x:event.touches[0].clientX,y:event.touches[0].clientY};
								},
								onTouchEnd:event=>{
									const start=swipeStart.current;swipeStart.current=null;
									if(!start||event.changedTouches.length===0)return;
									const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
									if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.25)changeLightbox(dx<0?1:-1);
								},
								children:[/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button",{
									type:"button",className:"sample-lightbox-arrow",
									"aria-label":"Previous book",
									onClick:()=>changeLightbox(-1),disabled:openedIndex===0,
									children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon,{name:"arrow-left"})
								}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img",{
									key:active.id,className:"sample-lightbox-image",src:active.image,
									alt:active.alt,width:"1200",height:"800",draggable:false,decoding:"async"
								}),/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button",{
									type:"button",className:"sample-lightbox-arrow",
									"aria-label":"Next book",
									onClick:()=>changeLightbox(1),disabled:openedIndex===samples.length-1,
									children:/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon,{name:"arrow"})
								})]
							})]
						})
					})]
				})
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
