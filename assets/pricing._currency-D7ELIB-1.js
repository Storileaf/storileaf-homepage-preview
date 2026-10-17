import { o as require_jsx_runtime } from "./useStore-DY_dpydU.js";
import { r as useNavigate, t as Route } from "./index-DO3Vh6An.js";
import { n as validBookSlug, r as validCurrency, t as PricingPage } from "./pricing-page-eOuxT0Kj.js";
//#region src/routes/pricing.$currency.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function PricingRegional() {
	const { currency: rawCurrency } = Route.useParams();
	const { keepsake } = Route.useSearch();
	const navigate = useNavigate();
	const currency = validCurrency(rawCurrency);
	const active = validBookSlug(keepsake);
	function changeCurrency(next) {
		try {
			localStorage.setItem("storileaf.preview.currency", next);
		} catch {}
		navigate({
			to: "/pricing/$currency",
			params: { currency: next },
			search: { keepsake: active },
			resetScroll: false
		});
	}
	function changeBook(slug) {
		navigate({
			to: "/pricing/$currency",
			params: { currency },
			search: { keepsake: slug },
			resetScroll: false
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingPage, {
		currency,
		activeSlug: active,
		onBookChange: changeBook,
		onCurrencyChange: changeCurrency
	});
}
//#endregion
export { PricingRegional as component };
