export function initSearchToggle() {
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
}
