import type {
	HeroData,
	Notification,
	Profile,
	CarouselData,
	ContentItem,
} from "../../types/types";

// Hero
export function renderHero(data: HeroData) {
	const heroSection = document.querySelector<HTMLElement>(".hero");
	const rankEl = document.querySelector(".hero-content .rank");
	const descEl = document.querySelector(".hero-content .desc");

	if (heroSection) heroSection.style.backgroundImage = `url(${data.image})`;
	if (rankEl) rankEl.textContent = data.rank;
	if (descEl) descEl.textContent = data.description;
}

// Notification
export function renderNotifications(data: Notification[]) {
	const list = document.querySelector(".notif-dropdown ul");
	if (!list) return;
	list.innerHTML = data
		.map(
			(item) => `
    <li>
      <img src="${item.image}" alt="${item.alt}" />
      <div class="notif-text">
        <p class="notif-title">${item.title}</p>
        <p class="notif-desc">${item.desc}</p>
      </div>
    </li>
  `
		)
		.join("");
}

// Profile
export function renderProfiles(data: Profile[]) {
	const list = document.querySelector(".profile-list");
	const divider = list?.querySelector(".divider");
	if (!list || !divider) return;

	list.querySelectorAll(".profile-item").forEach((item) => item.remove());
	data.forEach((profile) => {
		const li = document.createElement("li");
		li.className = "profile-item";
		li.innerHTML = `
      <img src="${profile.avatar}" alt="${profile.name}" class="avatar" />
      <span>${profile.name}</span>
    `;
		list.insertBefore(li, divider);
	});
}

// Carousel
export function renderCarousels(data: CarouselData[]) {
	const top10Section = document.querySelector(".top10-section");
	if (!top10Section) return;

	// 기존 캐러셀은 삭제
	document.querySelectorAll(".carousel-row").forEach((row) => row.remove());

	// Top 10 섹션 앞에 새로운 캐러셀들을 추가
	data.forEach((carousel) => {
		const section = document.createElement("section");
		section.className = "carousel-row";
		section.setAttribute("data-carousel", "");
		const cardsHtml = carousel.items
			.map(
				(item) => `
      <div class="cr-card">
        <img src="${item.image}" alt="${item.alt}" />
      </div>
    `
			)
			.join("");
		section.innerHTML = `
      <h2>${carousel.title}</h2>
      <button class="cr-btn prev" aria-label="이전">&#10094;</button>
      <div class="cr-viewport"><div class="cr-track">${cardsHtml}</div></div>
      <button class="cr-btn next" aria-label="다음">&#10095;</button>
    `;
		top10Section.parentNode?.insertBefore(section, top10Section);
	});
}

// TOP 10
export function renderTop10(data: ContentItem[]) {
	const list = document.querySelector(".top10-list");
	if (!list) return;
	list.innerHTML = data
		.map(
			(item) => `
    <li class="top10-item" data-rank="${item.alt}">
      <div class="poster-wrap">
        <img class="poster-23" src="${item.image}" alt="${item.alt}" />
      </div>
    </li>
  `
		)
		.join("");
}
