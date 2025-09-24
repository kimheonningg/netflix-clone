const STORAGE_KEY = "likes:v1";
type LikeKey = string;

export function parseLikeKey(
	key: string
): { rowId: string; index: number } | null {
	const m = key.match(/^(.+)-(\d+)$/);
	if (!m) return null;
	return { rowId: m[1], index: Number(m[2]) };
}

function getCardKeyFrom(el: Element | null): LikeKey | null {
	const card = el?.closest<HTMLElement>(".cr-card");
	const key = card?.dataset.id?.trim();
	return key && /^.+-\d+$/.test(key) ? key : null;
}

function loadLikes(): Set<LikeKey> {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const arr = JSON.parse(raw) as LikeKey[];
		return new Set(arr);
	} catch {
		return new Set();
	}
}
function saveLikes(s: Set<LikeKey>) {
	try {
		console.log("likes::: ", s);
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
	} catch {
		// do nothing
	}
}

function setButtonVisual(btn: HTMLButtonElement, liked: boolean) {
	btn.classList.toggle("is-liked", liked);
	btn.setAttribute("aria-pressed", liked ? "true" : "false");
	const icon = btn.querySelector<HTMLElement>(".material-symbols-outlined");
	if (icon) {
		icon.style.fontVariationSettings = liked
			? `"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24`
			: `"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24`;
	}
}

export function repaintLikes(root: ParentNode = document) {
	const likes = loadLikes();
	root.querySelectorAll<HTMLDivElement>(".cr-card").forEach((card) => {
		const key = card.dataset.id;
		if (!key) return;
		const btn = card.querySelector<HTMLButtonElement>(".btn-like");
		if (btn) setButtonVisual(btn, likes.has(key));
	});
}

export function initLikes(root: ParentNode = document) {
	repaintLikes(root);

	root.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		const btn = target.closest<HTMLButtonElement>(".btn-like");
		if (!btn) return;

		const key = getCardKeyFrom(btn);
		console.log("key::", key);
		if (!key) return;

		const likes = loadLikes();
		if (likes.has(key)) likes.delete(key);
		else likes.add(key);

		saveLikes(likes);
		setButtonVisual(btn, likes.has(key));
	});
}

export function getLikesByRow(rowId: string): number[] {
	const likes = loadLikes();
	const arr: number[] = [];
	likes.forEach((k) => {
		const parsed = parseLikeKey(k);
		if (parsed && parsed.rowId === rowId) arr.push(parsed.index);
	});
	return arr.sort((a, b) => a - b);
}
