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
