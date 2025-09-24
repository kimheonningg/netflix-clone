import "../styles/style.css";
import { mountCarousels } from "./infiniteCarousel";
import { top10 } from "./top10";
// import { checkFetch } from "./fetch";
import { fetchNetflixData } from "./api/fetchData";
import {
	renderHero,
	renderNotifications,
	renderProfiles,
	renderCarousels,
	renderTop10,
} from "./render/render";

async function initializeApp() {
	try {
		// fetch data
		const data = await fetchNetflixData();

		// render UI using the fetched data
		renderHero(data.hero);
		renderNotifications(data.notifications);
		renderProfiles(data.profiles);
		renderCarousels(data.carousels);
		renderTop10(data.top10);

		// handle other events on the rendered DOM
		mountCarousels();
		top10();
	} catch (error) {
		document.body.innerHTML = `<h1>페이지 로딩 중 오류가 발생했습니다.</h1>`;
	}
}

document.addEventListener("DOMContentLoaded", initializeApp);
