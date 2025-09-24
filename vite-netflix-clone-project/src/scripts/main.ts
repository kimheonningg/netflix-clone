import "../styles/style.css";
import { mountCarousels } from "./infiniteCarousel";
import { top10 } from "./top10";

document.addEventListener("DOMContentLoaded", () => {
	mountCarousels();
	top10();
});
