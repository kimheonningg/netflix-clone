import type { AppData, ContentItem } from "../../types/types";
import { renderCarousels, renderSearchResults } from "../render/render";

// normalization
const norm = (s: string) =>
	s.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();

// if item matches
function matches(item: ContentItem, qn: string): boolean {
	if (!qn) return false;
	if (item.keywords) {
		return item.keywords.some((kw) => norm(kw).includes(qn));
	}
	return false;
}

// delete duplicates
function dedupe(items: ContentItem[]): ContentItem[] {
	const seen = new Set<string>();
	const out: ContentItem[] = [];
	for (const it of items) {
		const key = `${it.image}|${it.alt}`;
		if (!seen.has(key)) {
			seen.add(key);
			out.push(it);
		}
	}
	return out;
}

export function initSearchToggle(appData?: AppData) {
	const wrap = document.querySelector<HTMLDivElement>(".search-wrap");
	const toggleBtn = document.querySelector<HTMLButtonElement>(".search-toggle");
	const input = document.querySelector<HTMLInputElement>(".search-input");

	if (!wrap || !toggleBtn || !input) return;

	const expand = () => {
		wrap.setAttribute("data-state", "expanded");
		toggleBtn.setAttribute("aria-expanded", "true");
		requestAnimationFrame(() => input.focus());
	};

	const collapse = () => {
		wrap.setAttribute("data-state", "collapsed");
		toggleBtn.setAttribute("aria-expanded", "false");
		input.blur();
	};

	toggleBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const expanded = wrap.getAttribute("data-state") === "expanded";
		expanded ? collapse() : expand();
	});

	// use ESC key to exit
	input.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			collapse();
		}
	});

	document.addEventListener("click", (e) => {
		const isInside = (e.target as HTMLElement)?.closest(".search-wrap");
		const expanded = wrap.getAttribute("data-state") === "expanded";
		if (expanded && !isInside && input.value.trim() === "") {
			collapse();
		}
	});

	input.addEventListener("blur", () => {
		const expanded = wrap.getAttribute("data-state") === "expanded";
		if (expanded && input.value.trim() === "") {
			setTimeout(collapse, 0);
		}
	});

	// When search string is entered
	input.addEventListener("input", () => {
		const q = input.value;

		if (!appData) return;

		const qn = norm(q);
		if (!qn) {
			// empty search
			renderCarousels(appData.carousels);
			return;
		}

		const all: ContentItem[] = [
			...appData.carousels.flatMap((c) => c.items),
			...appData.top10,
		];

		const matched = dedupe(all.filter((it) => matches(it, qn)));
		renderSearchResults(matched, q);
	});
}
