import { o as require_jsx_runtime } from "./useStore-DY_dpydU.js";
import { n as Route, r as useNavigate } from "./index-DO3Vh6An.js";
import { n as validBookSlug, t as PricingPage } from "./pricing-page-eOuxT0Kj.js";
//#region src/routes/pricing.index.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function PricingDefault() {
	const { keepsake } = Route.useSearch();
	const navigate = useNavigate();
	const active = validBookSlug(keepsake);
	function changeCurrency(currency) {
		try {
			localStorage.setItem("storileaf.preview.currency", currency);
		} catch {}
		navigate({
			to: "/pricing/$currency",
			params: { currency },
			search: { keepsake: active },
			resetScroll: false
		});
	}
	function changeBook(slug) {
		navigate({
			to: "/pricing/$currency",
			params: { currency: "inr" },
			search: { keepsake: slug },
			resetScroll: false
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingPage, {
		currency: "inr",
		activeSlug: active,
		onBookChange: changeBook,
		onCurrencyChange: changeCurrency
	});
}
//#endregion
export { PricingDefault as component };
