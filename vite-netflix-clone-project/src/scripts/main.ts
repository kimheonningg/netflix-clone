import "../styles/style.css";
import { mountCarousels } from "./infiniteCarousel";
import { top10 } from "./top10";
import { checkFetch } from "./fetch";

document.addEventListener("DOMContentLoaded", () => {
	checkFetch();
	mountCarousels();
	top10();
});
