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
			if (!animated) this.track.style.transition = "none";
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
		_computeLayout() {
			const vw = this.viewport.clientWidth;
			const unit = this.cardWidth + this.gap;
			this.itemsPerView = Math.max(1, Math.floor((vw + this.gap) / unit));
			this.totalPages = Math.max(1, Math.ceil(this.n / this.itemsPerView));
		}

		_buildPagination() {
			// 필요 시 재빌드
			if (this.pagi.dataset.count == this.totalPages) return;
			this.pagi.replaceChildren();
			for (let i = 0; i < this.totalPages; i++) {
				const b = document.createElement("span");
				b.className = "bar";
				this.pagi.appendChild(b);
			}
			this.pagi.dataset.count = String(this.totalPages);
			this.pagiBars = Array.from(this.pagi.children);
		}

		_logicalIndex() {
			// current를 원본 범위 [0..n-1]로 환산
			const raw = this.current - this.n;
			return ((raw % this.n) + this.n) % this.n;
		}

		_currentPage() {
			return Math.floor(this._logicalIndex() / this.itemsPerView); // 0..totalPages-1
		}
		_goToPage(page) {
			// page: 0..totalPages-1
			const targetLogical = page * this.itemsPerView; // 페이지의 첫 카드
			const curLogical = this._logicalIndex();
			const deltaCards = targetLogical - curLogical; // 몇 장 이동?
			this.current += deltaCards;
			this._translate(this.current, true);
			this._updatePaginationActive();
		}
		_movePage(dir) {
			// dir = +1 / -1
			const next =
				(this._currentPage() + dir + this.totalPages) % this.totalPages;
			this._goToPage(next);
		}

		_updatePaginationActive() {
			if (!this.pagiBars || !this.pagiBars.length) return;
			const page = Math.floor(this._logicalIndex() / this.itemsPerView);
			this.pagiBars.forEach((el, i) =>
				el.classList.toggle("active", i === page)
			);
		}

		/* ---------- interactions ---------- */
		_bind() {
			this.onNext = () => this._movePage(+1);
			this.onPrev = () => this._movePage(-1);
			this.onEnd = () => {
				this._handleEdges();
				this._updatePaginationActive();
			};
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

		/* === 리사이즈 시 페이지 재계산 & 현재 페이지로 스냅 === */
		_recalc() {
			const w = this._slideWidth(),
				g = this._readGap();
			if (w !== this.cardWidth || g !== this.gap) {
				this.cardWidth = w;
				this.gap = g;
				this.step = w + g;
			}
			const prevPage = this._currentPage();
			const prevTotal = this.totalPages;
			this._computeLayout();
			if (this.totalPages !== prevTotal) this._buildPagination();
			this._goToPage(Math.min(prevPage, this.totalPages - 1)); // 현재 보던 페이지 유지
			this._jump(this.current); // 위치 보정
		}

		_move(delta) {
			this.current += delta;
			this._translate(this.current, true);
			// transitionend에서 active 갱신되지만, 즉시 반영도 해줌
			this._updatePaginationActive();
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
			// 페이지 수 재산정 및 UI 재구성
			const prevPages = this.totalPages;
			this._computeLayout();
			if (this.totalPages !== prevPages) this._buildPagination();
			this._jump(this.current);
			this._updatePaginationActive();
		}
	}

	document
		.querySelectorAll("[data-carousel]")
		.forEach((root) => new InfiniteCarousel(root));
});
