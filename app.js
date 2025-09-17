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

			// 설정
			this.gap = this._readGap();
			this.cardWidth = this._slideWidth();
			this.step = this.cardWidth + this.gap; // 1장씩 이동
			this.index = 0; // 실제 사용은 startIndex로 보정

			// 무한루프: 앞/뒤에 원본 전체를 한 번씩 복제 (총 3n 장)
			this._makeClones();

			// 시작 위치: 첫 원본의 인덱스 = n
			this.current = this.n;
			this._jumpWithoutAnim(this.current);

			// 이벤트
			this._bind();
			window.addEventListener("resize", this._onResize);
		}

		_readGap() {
			const g = getComputedStyle(this.track).gap || "16px";
			const v = parseFloat(g);
			return Number.isNaN(v) ? 16 : v;
		}

		_slideWidth() {
			const first = this.track.querySelector(".cr-card");
			return first.getBoundingClientRect().width;
		}

		_makeClones() {
			const frontClones = this.originalSlides.map((s) => s.cloneNode(true));
			const backClones = this.originalSlides.map((s) => s.cloneNode(true));

			// 앞에는 원본의 "마지막부터" 오도록 prepend 순서 보장
			for (let i = this.n - 1; i >= 0; i--) {
				this.track.prepend(frontClones[i]);
			}
			// 뒤에는 원본 순서 그대로
			backClones.forEach((c) => this.track.appendChild(c));

			this.allSlides = Array.from(this.track.children); // 길이 = 3n
		}

		_bind() {
			this.onNext = () => this._move(1);
			this.onPrev = () => this._move(-1);
			this.onTransitionEnd = () => this._handleEdge();
			this._onResize = () => this._recalc();

			this.nextBtn.addEventListener("click", this.onNext);
			this.prevBtn.addEventListener("click", this.onPrev);
			this.track.addEventListener("transitionend", this.onTransitionEnd);

			// 드래그/스와이프(선택 사항): 마우스만 간단 지원
			let startX = 0,
				dragging = false;
			this.viewport.addEventListener("mousedown", (e) => {
				dragging = true;
				startX = e.clientX;
			});
			window.addEventListener("mouseup", (e) => {
				if (!dragging) return;
				const dx = e.clientX - startX;
				dragging = false;
				if (dx < -30) this._move(1);
				else if (dx > 30) this._move(-1);
			});
		}

		_translateTo(index, animate = true) {
			if (!animate) this.track.style.transition = "none";
			const x = -(index * this.step);
			this.track.style.transform = `translateX(${x}px)`;
			if (!animate) {
				// reflow 후 transition 복구
				this.track.offsetHeight; // force reflow
				this.track.style.transition = "";
			}
		}

		_jumpWithoutAnim(index) {
			this._translateTo(index, false);
		}

		_move(delta) {
			this.current += delta;
			this._translateTo(this.current, true);
		}

		_handleEdge() {
			// 중앙 원본 범위: [n, 2n-1]
			if (this.current >= 2 * this.n) {
				// 뒤쪽 클론으로 넘어갔음 -> 동일 원본 위치로 순간이동
				this.current -= this.n;
				this._jumpWithoutAnim(this.current);
			} else if (this.current < this.n) {
				// 앞쪽 클론으로 넘어감 -> 동일 원본 위치로 순간이동
				this.current += this.n;
				this._jumpWithoutAnim(this.current);
			}
		}

		_recalc() {
			const newCardWidth = this._slideWidth();
			const newGap = this._readGap();
			if (newCardWidth !== this.cardWidth || newGap !== this.gap) {
				this.cardWidth = newCardWidth;
				this.gap = newGap;
				this.step = this.cardWidth + this.gap;
				this._jumpWithoutAnim(this.current); // 현재 인덱스 기준으로 재배치
			}
		}
	}

	// 페이지 내 모든 캐러셀 초기화
	document.querySelectorAll("[data-carousel]").forEach((root) => {
		new InfiniteCarousel(root);
	});
});
