document.addEventListener("DOMContentLoaded", () => {
	class InfiniteCarousel {
		constructor(root) {
			this.root = root;
			this.viewport = root.querySelector(".cr-viewport");
			this.track = root.querySelector(".cr-track");
			this.prevBtn = root.querySelector(".cr-btn.prev");
			this.nextBtn = root.querySelector(".cr-btn.next");

			this.originalSlides = Array.from(this.track.children);
			this.n = this.originalSlides.length;

			this.gap = this._readGap();
			this.cardWidth = this._slideWidth();
			this.step = this.cardWidth + this.gap;

			/* --- pagination 요소 동적 생성 --- */
			this.pagi = document.createElement("div");
			this.pagi.className = "cr-pagination";
			this.root.appendChild(this.pagi);

			this._cloneHeadAndTail(); // 3n 구성
			this.current = this.n; // 중앙에서 시작
			this._jump(this.current);

			this._computeLayout(); // itemsPerView / totalPages 계산
			this._buildPagination(); // 바 그리기
			this._updatePaginationActive(); // 활성 바 표시

			this._bind();
			window.addEventListener("resize", this._onResize);
		}

		/* ---------- utilities ---------- */
		_readGap() {
			return parseFloat(getComputedStyle(this.track).gap || "16") || 16;
		}
		_slideWidth() {
			return this.track.querySelector(".cr-card").getBoundingClientRect().width;
		}

		_cloneHeadAndTail() {
			const head = this.originalSlides.map((n) => n.cloneNode(true));
			const tail = this.originalSlides.map((n) => n.cloneNode(true));
			for (let i = this.n - 1; i >= 0; i--) this.track.prepend(head[i]);
			tail.forEach((n) => this.track.appendChild(n));
			this.allSlides = Array.from(this.track.children);
		}

		_translate(i, animated = true) {
			if (animated) this.isAnimating = true;
			else this.track.style.transition = "none";

			this.track.style.transform = `translateX(${-(i * this.step)}px)`;
			if (!animated) {
				this.track.offsetHeight;
				this.track.style.transition = "";
			}
		}
		_jump(i) {
			this._translate(i, false);
		}

		/* ---------- pagination ---------- */
		_buildPageStarts() {
			const k = this.itemsPerView; // 한 줄에 보이는 카드 개수
			const n = this.n; // 전체 카드 개수
			const starts = [];

			for (let s = 0; s + k <= n; s += k) {
				starts.push(s);
			}

			// 남는 카드가 있으면 마지막 페이지를 추가
			if (n % k !== 0) {
				starts.push(n - k);
			}

			this.pageStarts = starts;
			this.totalPages = starts.length; // bar 개수 = pageStarts 개수
		}

		_computeLayout() {
			const vw = this.viewport.clientWidth;
			const unit = this.cardWidth + this.gap;
			this.itemsPerView = Math.max(1, Math.floor((vw + this.gap) / unit));
			this._buildPageStarts();
		}

		_buildPagination() {
			if (!this.pagi) return;

			this.pagi.replaceChildren();
			for (let i = 0; i < this.totalPages; i++) {
				const b = document.createElement("span");
				b.className = "bar";
				this.pagi.appendChild(b);
			}

			this.pagiBars = Array.from(this.pagi.children);
		}

		_logicalIndex() {
			// current를 원본 범위 [0..n-1]로 환산
			const raw = this.current - this.n;
			return ((raw % this.n) + this.n) % this.n;
		}

		_currentPageIndex() {
			// 논리 인덱스(0..n-1)를 현재 페이지 시작 구간에 매핑
			const li = this._logicalIndex();
			const starts = this.pageStarts || [0];
			let idx = 0;
			for (let i = 0; i < starts.length; i++) {
				const s = starts[i];
				const e = i < starts.length - 1 ? starts[i + 1] : this.n; // 마지막은 n까지
				if (li >= s && li < e) {
					idx = i;
					break;
				}
			}
			return idx;
		}

		/* ---------- pagination UI 업데이트 교체 ---------- */
		_updatePaginationActive() {
			if (!this.pagiBars || !this.pagiBars.length) return;
			// this.pageIndex 가 있다면 그걸, 없다면 계산값 사용
			const idx =
				this.isAnimating && typeof this.pageIndex === "number"
					? this.pageIndex
					: this._currentPageIndex();
			this.pagiBars.forEach((el, i) =>
				el.classList.toggle("active", i === idx)
			);
		}

		/* ---------- 특정 페이지 인덱스로 이동 (연결감 유지) ---------- */
		_goToPageIndex(targetIdx, dir = 0) {
			const starts = this.pageStarts || [0];
			const curLogical = this._logicalIndex();

			// 해당 페이지의 시작 인덱스
			let targetLogical = starts[targetIdx];

			// 방향 보정 (되돌아보이는 현상 방지)
			if (dir > 0 && targetLogical < curLogical) targetLogical += this.n;
			if (dir < 0 && targetLogical > curLogical) targetLogical -= this.n;

			const deltaCards = targetLogical - curLogical;
			this.current += deltaCards;
			this._translate(this.current, true);

			// 현재 페이지 인덱스 동기화
			this.pageIndex = targetIdx;
			this._updatePaginationActive();
		}

		_movePage(dir) {
			const total = this.totalPages || 1;
			const curIdx = this._currentPageIndex();
			const nextIdx = (curIdx + dir + total) % total;
			this._goToPageIndex(nextIdx, dir);
		}

		_onTransitionEndSync() {
			this._handleEdges(); // 클론 구간 보정
			this.isAnimating = false;
			this.pageIndex = this._currentPageIndex();
			this._updatePaginationActive();
		}

		/* ---------- interactions ---------- */
		_bind() {
			this.onNext = () => this._movePage(+1);
			this.onPrev = () => this._movePage(-1);
			this.onEnd = () => this._onTransitionEndSync();
			this._onResize = () => this._recalc();

			this.nextBtn.addEventListener("click", this.onNext);
			this.prevBtn.addEventListener("click", this.onPrev);
			this.track.addEventListener("transitionend", this.onEnd);

			// 드래그/스와이프도 페이지 단위
			let mStartX = 0,
				dragging = false;
			this.viewport.addEventListener("mousedown", (e) => {
				dragging = true;
				mStartX = e.clientX;
			});
			window.addEventListener("mouseup", (e) => {
				if (!dragging) return;
				dragging = false;
				const dx = e.clientX - mStartX;
				if (dx < -30) this._movePage(+1);
				else if (dx > 30) this._movePage(-1);
			});

			let tStartX = 0;
			this.viewport.addEventListener(
				"touchstart",
				(e) => {
					tStartX = e.touches[0].clientX;
				},
				{ passive: true }
			);
			this.viewport.addEventListener(
				"touchend",
				(e) => {
					const dx = (e.changedTouches[0]?.clientX || 0) - tStartX;
					if (dx < -30) this._movePage(+1);
					else if (dx > 30) this._movePage(-1);
				},
				{ passive: true }
			);
		}

		_handleEdges() {
			if (this.current >= 2 * this.n) {
				this.current -= this.n;
				this._jump(this.current);
			} else if (this.current < this.n) {
				this.current += this.n;
				this._jump(this.current);
			}
		}

		_recalc() {
			const w = this._slideWidth();
			const g = this._readGap();
			if (w !== this.cardWidth || g !== this.gap) {
				this.cardWidth = w;
				this.gap = g;
				this.step = w + g;
			}

			this._computeLayout(); // itemsPerView와 pageStarts 재계산
			this._buildPagination(); // pagination bar 다시 생성
			this._jump(this.current);
			this._updatePaginationActive();
		}
	}

	document
		.querySelectorAll("[data-carousel]")
		.forEach((root) => new InfiniteCarousel(root));
});

// TOP10
(function enhanceTop10() {
	const sec = document.querySelector(".top10-section");
	const list = sec?.querySelector(".top10-list");
	if (!sec || !list) return;

	// 캐러셀 행처럼 동작(버튼/페이징 스타일 재사용)
	sec.classList.add("carousel-row");
	sec.style.position = "relative";

	// 뷰포트 래퍼
	const viewport = document.createElement("div");
	viewport.style.position = "relative";
	viewport.style.overflow = "hidden";
	viewport.style.width = "100%";
	list.parentNode.insertBefore(viewport, list);
	viewport.appendChild(list);

	// 트랙 애니메이션
	list.style.willChange = "transform";
	list.style.transition = "transform 0.45s ease";

	const originalItems = Array.from(list.children);
	const n = originalItems.length;
	const pageSize = 5; // 고정: 5개씩
	const totalPages = Math.max(1, Math.ceil(n / pageSize));

	// 컨트롤 & 페이징
	const prev = document.createElement("button");
	prev.className = "cr-btn prev";
	prev.setAttribute("aria-label", "이전");
	prev.innerHTML = "&#10094;";
	const next = document.createElement("button");
	next.className = "cr-btn next";
	next.setAttribute("aria-label", "다음");
	next.innerHTML = "&#10095;";
	sec.appendChild(prev);
	sec.appendChild(next);

	const pagi = document.createElement("div");
	pagi.className = "cr-pagination";
	for (let i = 0; i < totalPages; i++) {
		const bar = document.createElement("span");
		bar.className = "bar";
		pagi.appendChild(bar);
	}
	sec.appendChild(pagi);
	const bars = Array.from(pagi.children);

	// === 무한 루프용 앞/뒤 클론 삽입 ===
	// 뒤(마지막) 페이지 클론을 앞에, 앞(첫) 페이지 클론을 뒤에 추가
	const lastPageStart = Math.max(0, (totalPages - 1) * pageSize);
	const headClones = originalItems
		.slice(lastPageStart)
		.map((el) => el.cloneNode(true));
	headClones.forEach((node) => list.insertBefore(node, list.firstChild));
	const tailClones = originalItems
		.slice(0, pageSize)
		.map((el) => el.cloneNode(true));
	tailClones.forEach((node) => list.appendChild(node));

	// 확장된 아이템으로 좌표 측정
	let allItems = Array.from(list.children);
	let baseX = allItems[0]?.offsetLeft || 0;

	// 확장 인덱스(페이지 시작 위치): [ headClone, ...original pages..., tailClone ]
	const STEP = pageSize;
	const MIN_EXT = 0; // 앞쪽 클론 페이지 시작
	const FIRST_REAL_EXT = STEP * 1; // 첫 실 페이지 시작
	const LAST_REAL_EXT = STEP * totalPages;
	const MAX_EXT = STEP * (totalPages + 1); // 뒤쪽 클론 페이지 시작

	let logicalPage = 0; // 0..totalPages-1
	let extIndex = FIRST_REAL_EXT; // 확장 인덱스 기준 시작점
	let isAnimating = false;

	function translateTo(start, animated = true) {
		if (!animated) list.style.transition = "none";
		const targetX = allItems[start]?.offsetLeft || 0;
		list.style.transform = `translateX(${-(targetX - baseX)}px)`;
		if (!animated) {
			list.offsetHeight; // reflow
			list.style.transition = "transform 0.45s ease";
		}
	}

	function updatePagi() {
		bars.forEach((b, i) => b.classList.toggle("active", i === logicalPage));
	}

	function nextPage() {
		if (isAnimating || totalPages <= 1) return;
		isAnimating = true;
		logicalPage = (logicalPage + 1) % totalPages;
		extIndex += STEP; // 항상 오른쪽으로 이동
		translateTo(extIndex, true);
	}

	function prevPage() {
		if (isAnimating || totalPages <= 1) return;
		isAnimating = true;
		logicalPage = (logicalPage - 1 + totalPages) % totalPages;
		extIndex -= STEP; // 항상 왼쪽으로 이동
		translateTo(extIndex, true);
	}

	// 끝/처음에서 시접 점프(transition 없이 즉시 보정)
	list.addEventListener("transitionend", () => {
		isAnimating = false;
		if (extIndex === MAX_EXT) {
			// 마지막 실 페이지 다음(뒤쪽 클론)에 도착 → 첫 실 페이지로 무음 점프
			extIndex = FIRST_REAL_EXT;
			translateTo(extIndex, false);
		} else if (extIndex === MIN_EXT) {
			// 첫 실 페이지 이전(앞쪽 클론)에 도착 → 마지막 실 페이지로 무음 점프
			extIndex = LAST_REAL_EXT;
			translateTo(extIndex, false);
		}
		updatePagi();
	});

	prev.addEventListener("click", prevPage);
	next.addEventListener("click", nextPage);

	// 리사이즈 시 현재 위치 유지
	window.addEventListener("resize", () => {
		allItems = Array.from(list.children);
		baseX = allItems[0]?.offsetLeft || 0;
		translateTo(extIndex, false);
	});

	// 아이템이 5개 이하이면 컨트롤 숨김
	if (totalPages <= 1) {
		prev.style.display = "none";
		next.style.display = "none";
		pagi.style.display = "none";
	}

	// 초기 스냅
	translateTo(extIndex, false);
	updatePagi();
})();
