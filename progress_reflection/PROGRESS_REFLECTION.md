# Progress Reflection- 학습 중간 회고

2025년 10월 7일 작성

## 2주차 Netflix 클론 프로젝트의 시작- vanilla HTML, CSS만 사용

처음에는 아래의 2가지 파일에서 출발했고, 아무 기능도 없이 정적인 Netflix를 구현하였다.

- `index.html`
- `styles.css`

`index.html`의 구조는, 아래처럼 **Header**, **Hero**, **Content row 3개**, **Top10 Section**으로 구성하였다.

`<div>`나 `<span>` 사용을 최대한 줄이고, 의미에 맞는 Sementic tag를 최대한 많이 사용하려고 노력했었다.

Top10 섹션은 `<footer>` tag로 써야 했었던 것 같은데, Top10 섹션이 의미상 footer는 아닌 것 같지 않아서 사용하지 않았던 것으로 기억한다. 다시 보니까 `<main>` tag도 빠진 것 같다.

이제 와서 내 `index.html` 파일을 살펴보니, 복사 붙여넣기를 많이 한 것 같다. 사실 관련 얘기를 피어 컴파일링에서도 한 것 같은데(asset들을 복사 붙여넣기 대신 `for` 등 반복문을 사용해서 할 수는 없을지), 그때 나온 얘기로는 javascript를 inline script의 형식으로 써서 할 수는 있겠다고 논의했었다.

지금 챗지피티한테 물어보니, 단순 정적 페이지일 경우에는 10개의 반복되는 asset들을 복사 붙여넣기 하는 것이 더 낫다고 한다. 그 이유는 렌더링 시점에 DOM을 조작하는 Javascript가 필요 없기 때문에 더 빠르기 때문이고, 오히려 이렇게 쓰는 것이 직관적이어서 유지보수가 비교적 쉽기 때문이라고 한다.

하지만 동적 페이지일(혹은 data를 fetch해야하는) 경우에는 Javascript로 `for` 문을 사용하는 것이 더 추천된다. 그 이유는 반복 개수가 변할 수도 있고, 이 경우에는 Javascript로 생성하는 것이 유지보수에 더 효율적이기 때문이라고 한다. 실제로 4주차쯤 data를 fetch API를 이용해서 가져올 때부터 나는 Javascript의 반복문을 사용하였다.

전에 회사에서 프런트앤드 개발 인턴으로 일했을때 Material UI 등등 이미 구현된 예쁜 아이콘이 많다는 것을 기억해서 Material UI를 가져와서 내 html 파일에 적용하기도 했다. 사소하지만, 이런 외부 아이콘 import는 React등의 라이브러리나 Redwood 등의 다양한 프레임워크 위에서만 해봤던 것 같은데, Vanilla HTML에도 import가 지원된다는게 신기했다.

```html
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="UTF-8" />
		<title>Netflix Clone - 김희원</title>
		<link rel="stylesheet" href="styles.css" />
		<!-- Use Material UI -->
		<link
			rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
		/>
	</head>
	<body>
		<!-- Header -->
		<header class="header">
			<h1 class="logo">NETFLIX</h1>
			<nav class="nav">
				<a href="#">홈</a> <a href="#">시리즈</a> <a href="#">영화</a>
				<a href="#">게임</a> <a href="#">NEW! 요즘 대세 콘텐츠</a>
				<a href="#">내가 찜한 리스트</a> <a href="#">언어별로 찾아보기</a>
			</nav>
			<div class="icons">
				<button class="icon-btn" aria-label="검색">
					<span class="material-symbols-outlined">search</span>
				</button>
				<div class="icon-btn notif" aria-label="알림">
					<span class="material-symbols-outlined">notifications</span>
					<div class="notif-dropdown">
						<ul>
							<li>
								<img src="assets/runningman.png" alt="알림1" />
								<div class="notif-text">
									<p class="notif-title">9월 12일 공개</p>
									<p class="notif-desc">지금 예고편을 시청하세요</p>
								</div>
							</li>
							<li>
								<img src="assets/runningman.png" alt="알림2" />
								<div class="notif-text">
									<p class="notif-title">넷플릭스 '신규 콘텐츠 가이드'</p>
									<p class="notif-desc">공개 예정작을 살펴보세요</p>
								</div>
							</li>
							<li>
								<img src="assets/runningman.png" alt="알림3" />
								<div class="notif-text">
									<p class="notif-title">신규 콘텐츠</p>
									<p class="notif-desc">나는 생존자다</p>
								</div>
							</li>
							<li>
								<img src="assets/runningman.png" alt="알림4" />
								<div class="notif-text">
									<p class="notif-title">웬즈데이 시즌 2</p>
									<p class="notif-desc">손맛이 다른 세계가 온다</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<button class="icon-btn profile" aria-label="프로필">
					<span class="material-symbols-outlined">account_circle</span>
					<div class="profile-dropdown" role="menu" aria-hidden="true">
						<div class="caret"></div>
						<ul class="profile-list">
							<li class="profile-item">
								<img src="assets/runningman.png" alt="사용자1" class="avatar" />
								<span>사용자1</span>
							</li>
							<li class="profile-item">
								<img src="assets/runningman.png" alt="사용자2" class="avatar" />
								<span>사용자2</span>
							</li>
							<li class="profile-item">
								<img src="assets/runningman.png" alt="키즈" class="avatar" />
								<span>키즈</span>
							</li>
							<li class="divider" role="separator"></li>
							<li class="menu-item">
								<span class="material-symbols-outlined">edit</span>
								<span>프로필 관리</span>
							</li>
							<li class="menu-item">
								<span class="material-symbols-outlined">switch_account</span>
								<span>프로필 이전</span>
							</li>
							<li class="menu-item">
								<span class="material-symbols-outlined"
									>settings_account_box</span
								>
								<span>계정</span>
							</li>
							<li class="menu-item">
								<span class="material-symbols-outlined">help</span>
								<span>고객 센터</span>
							</li>
							<li class="divider" role="separator"></li>
							<li class="logout">넷플릭스에서 로그아웃</li>
						</ul>
					</div>
				</button>
			</div>
		</header>
		<!-- Hero Section -->
		<section class="hero">
			<div class="hero__inner">
				<div class="hero-content">
					<p class="rank">오늘 시리즈 순위 2위</p>
					<p class="desc">
						대한민국을 대표하는 장수 예능 프로그램. 팀을 이룬 연예인 출연자들이
						다양한 미션을 해결하기 위해 여러 유명 장소를 열심히 뛰어다닌다.
					</p>
					<div class="buttons">
						<button class="play" disabled>
							<span class="material-symbols-outlined">play_arrow</span> 재생
						</button>
						<button class="info" disabled>
							<span class="material-symbols-outlined">info</span> 상세 정보
						</button>
					</div>
				</div>
			</div>
		</section>
		<!-- Content Rows -->
		<section class="carousel-row" data-carousel>
			<h2>밥친구</h2>
			<button class="cr-btn prev" aria-label="이전">&#10094;</button>
			<div class="cr-viewport">
				<div class="cr-track">
					<div class="cr-card"><img src="assets/runningman.png" alt="1" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="2" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="3" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="4" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="5" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="6" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="7" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="8" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="9" /></div>
					<div class="cr-card">
						<img src="assets/runningman.png" alt="10" />
					</div>
				</div>
			</div>
			<button class="cr-btn next" aria-label="다음">&#10095;</button>
		</section>
		<section class="carousel-row" data-carousel>
			<h2>.님이 시청 중인 콘텐츠</h2>
			<button class="cr-btn prev" aria-label="이전">&#10094;</button>
			<div class="cr-viewport">
				<div class="cr-track">
					<div class="cr-card"><img src="assets/runningman.png" alt="1" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="2" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="3" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="4" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="5" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="6" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="7" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="8" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="9" /></div>
					<div class="cr-card">
						<img src="assets/runningman.png" alt="10" />
					</div>
				</div>
			</div>
			<button class="cr-btn next" aria-label="다음">&#10095;</button>
		</section>
		<section class="carousel-row" data-carousel>
			<h2>연애 세포를 깨우는 작품들</h2>
			<button class="cr-btn prev" aria-label="이전">&#10094;</button>
			<div class="cr-viewport">
				<div class="cr-track">
					<div class="cr-card"><img src="assets/runningman.png" alt="1" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="2" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="3" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="4" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="5" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="6" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="7" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="8" /></div>
					<div class="cr-card"><img src="assets/runningman.png" alt="9" /></div>
					<div class="cr-card">
						<img src="assets/runningman.png" alt="10" />
					</div>
				</div>
			</div>
			<button class="cr-btn next" aria-label="다음">&#10095;</button>
		</section>
		<section class="row top10-section">
			<h2>오늘 대한민국의 <strong>TOP 10</strong> 시리즈</h2>
			<ol class="top10-list">
				<li class="top10-item" data-rank="1">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="1" />
					</div>
				</li>
				<li class="top10-item" data-rank="2">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="2" />
					</div>
				</li>
				<li class="top10-item" data-rank="3">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="3" />
					</div>
				</li>
				<li class="top10-item" data-rank="4">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="4" />
					</div>
				</li>
				<li class="top10-item" data-rank="5">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="5" />
					</div>
				</li>
				<li class="top10-item" data-rank="6">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="6" />
					</div>
				</li>
				<li class="top10-item" data-rank="7">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="7" />
					</div>
				</li>
				<li class="top10-item" data-rank="8">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="8" />
					</div>
				</li>
				<li class="top10-item" data-rank="9">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="9" />
					</div>
				</li>
				<li class="top10-item" data-rank="10">
					<div class="poster-wrap">
						<img class="poster-23" src="assets/runningman.png" alt="10" />
					</div>
				</li>
			</ol>
		</section>
		<script src="app.js" defer></script>
	</body>
</html>
```

`style.css`는 사실 AI의 도움을 많이 받았었다. 이전부터 CSS가 제일 어려웠는데, 특히 더 "있어보이는" UI를 만드려고 하면 할수록 혼자서 하는 것에는 한계가 있는 것 같다. 단순히 크기나 색깔 지정은 잘 할 수 있지만, 디자인 스펙이 정의되지 않은 상태에서, 전체적으로 모든 요소들이 어울어져 "눈에 보기에 편안한" 디자인을 만드는 것은 나에게는 무지 어렵다.. 색깔도 마찬가지이다. 전에 회사에 다닐 때 디자이너 분들이 color system 정의하는 것을 봤는데, 어우러지는 색깔들을 고르는 일은 너무 어렵다.

위의 이유들로 색깔이나 간격 맞추기 등 적절한 디자인은 모두 AI에게 물어보았다. ~~AI가 뚝딱 잘 해주어서 물어보길 잘한 것 같다.~~

또, 원래 화면을 고정하고 구현하는 것이 요구사항이었는데, 고정을 하고 나니 모든 요소들을 다 하드코딩해야 할 느낌이 들었고, 사실 반응형이 더 익숙했기 때문에 고정하지 않고 반응형으로 구현하였다. 다만 어느 정도의 화면 크기 변화에만 유동성 있게 적응하도록 하였지, 모바일 환경까지 고려하지는 않았다. 즉, 나는 여기서 grid 대신 flexbox만을 활용하여, 브라우저 크기가 조금 작아지더라도 예쁘게 보이도록 하였다.

나아가, 변수를 정의하고 재사용했어야 했는데 모든 스타일을 하드코딩했었다. 이 부분은 연휴 기간동안 좀 손 볼 예정이다

지금 와서 전체적인 2주차 과제의 구조를 보니, 많이 엉성하다는 느낌을 받는다.

## 3주차- Javascript 파일 추가하여 슬라이더 구현

3주차의 과제가 제일 생각할 거리가 많았고 재밌었던 것으로 기억한다.

과제를 수행하며, 프레임워크나 라이브러리를 사용할 때에는 많이 접근해지 못했던 DOM / event 등의 개념에 대해서 많이 알아보고, 공부할 수 있었다.

3주차에는 아래의 파일이 추가되었다- 이때까지만 해도 하나의 Javascript 파일에 모든 기능들을 한 번에 넣었었다.

- `app.js`

모달 기능은 `app.js`에 넣지 않고, Javascript 없이 HTML+CSS 방식으로 조작하였다. 그 이유는 이 기능은 단순히 hover 시 dropdown이 열리는, UI만 바뀌면 되는 기능이기 때문에 Javascript 없이도 할 수 있다고 생각했기 때문이고 (고급 기능이 아니기 때문에), 이 방식으로 해보고 싶기도 했었다. 또, HTML+CSS 방식으로 조작하면 Javascript보다 더 빠를 것이라고 AI가 설명해주었다.

이것은 그때까지 프로젝트 규모가 매우 작았기 때문에 실험적으로 해 본 것이었고, 프로젝트가 커지면 가독성 등을 위해 Javascript로 따로 분리하여 관리해야 할 듯 하다.

간단히 모달 제어 방법을 설명하자면, `:hover`, `:focus-within` 상태를 이용하여 열림/닫힘을 제어했다. `index.html`에 `notif-dropdown`, `profile-dropdown`과 같이 dropdown 시 화면에 띄울 부분을 정의해주었다. 그리고 `styles.css`에서, `notif-dropdown`, `profile-dropdown`이 기본 상태에서는 보이지 않도록 아래 코드를 이용해서 설계하였다.

```css
.notif-dropdown,
.profile-dropdown {
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.18s ease;
}
```

그리고 각 컨테이너가 `hover`, `focus-within`이면 보이도록 해주었다.

```css
.notif:hover .notif-dropdown,
.notif:focus-within .notif-dropdown {
	opacity: 1;
	pointer-events: auto;
}

.profile:hover .profile-dropdown,
.profile:focus-within .profile-dropdown {
	opacity: 1;
	pointer-events: auto;
}
```

하지만 위 방식은 정말 간단히 hover 시 UI가 바뀌는 간단한 UX만 처리할 수 있다는 단점이 있다.

다음으로 컨텐츠 row와 Top 10 섹션을 무한 캐러셀로 구현하는 것이 이번 과제의 핵심이었는데, 코드를 아주 자세하게 설명한 [이 문서](../CODE_NOTES.md)를 참고하면 좋을 것 같다.

간단히 설명하자면, 실제 내 데이터가 `n`개가 있다면, 그 데이터의 앞 뒤로 똑같은 데이터를 복사하여 총 `3n` 길이의 배열을 만들어 캐러셀을 조작하는 것이다. 또, 실제 데이터는 `[n, ... 2n-1]` index에 있고 가상의 데이터가 `[0, ... n-1]`, `[2n, ... 3n-1]` 부분에 있기 때문에, 현재 focus 된 카드의 index가 가상의 데이터 index로 넘어간다면, corresponding하는 실제 데이터의 index로 다시 mapping해주는 방식으로 "무한" 캐러셀을 구현했다. 이 과정에서 자연스러운 에니메이션은 css의 `transition`을 사용했다.

카드 개수가 달라도, 한 페이지에 몇 개를 보여주고 이에 해당하는 pagination bar의 개수는 몇 개가 있으면 좋을지 동적으로 계산하는 로직도 `app.js` Javascript 코드에 추가하였다.

## 4주차- Vite로의 migration 및 fetch 데이터 통신

4주차에서는 Vite로의 migration, fetch API 적용, 좋아요 버튼 구현이 메인 과제였다.

아래는 내 체크리스트이다.

```plaintext
- init vite project V
- code migration V
- 2.1 use fetch API to render card content V
- 2.2 like button (locally store info) V
- 2.3 mock server ?
- Fix card carousel functionality: 옆으로 스크롤해도 card 안보이게 하기 V
- (Z index 조절) card hover 시 pagination bar 안보이도록 수정 V
```

Vite가 뭔지 대충 알기는 했으나, 사용한 것은 처음이라 신선했다. 처음 init을 했을 때, 다른 프레임워크나 빌드 도구와 달리 디렉토리 구조가 비교적 단순하게 되어 있어서 놀랐다. 이전에 사용했던 빌드 도구로는 `Webpack`이 있었는데, init 시 아마 뭐가 잔뜩 깔렸었던 것 같다.

구조가 단순했기에 이전의 코드를 쉽게 migration할 수 있었고, 앞으로 프로젝트가 커질 것을 대비하여 디렉토리 구조를 정리하였다.

4주차까지는 많은 기능이 없었기에 한 디렉토리에 한 파일만 들어갔음에도, 훗날의 유지\*보수의 편리성을 위해 미리 프로젝트 구조를 나누어 준비하였다.

[이 문서](../CODE_NOTES.md)에 역시 자세한 디렉토리 설명을 정리해놨다.

간략하게, Typescript 파일을 `script` 디렉토리 안에 넣었고, `script` 디렉토리는 다시 `api`, `components`, `render`로 나눠진다. `api`에는 API handling, `components`에는 UI에서 일어나는 여러 action들 (대부분의 파일은 여기에 속함), `render`에는 UI 렌더링 관련된 파일들을 모아둘 용도로 설계했다.

이 모든 Typescript 파일들은 `main.ts`에서 불러 온 후 실행한다.

```typescript
async function initializeApp() {
	try {
		// all functions are called here
	} catch (error) {
		document.body.innerHTML = `<h1>페이지 로딩 중 오류가 발생했습니다.</h1>`;
	}
}
document.addEventListener("DOMContentLoaded", initializeApp);
```

그 외에도 `types`에는 data fetching, rendering 시 유용한 type들을 모두 정의해 두기 위해 만든 directory이다. 프로젝트가 커지면 `types` 디렉토리 안에 용도 별로 type들을 별도의 Typescript 파일로 만들어줘야 겠지만, 현재는 그럴 필요성을 못느꼈기에 `types.ts`에 모든 type들을 다 넣어주었다. (훗날 필요시 리팩토링할 예정이다.)

`styles` 디렉토리에는 `styles.css` 파일을 넣을 용도로 만들어주었다. 이 CSS 파일이 너무 길어져 파일을 분리할 필요성이 생기면 `styles` 디렉토리 안에 여러 CSS 파일로 분리하겠지만, 수업 시간에도 그럴 필요가 없다고 들은 것 같기 때문에 일단은 `styles.css` 하나의 파일로 두고자 한다.

좋아요 기능은 `components/handleLikes.ts`에 구현하였다. `"netflix-liked-items"`이라는 Localstorage key를 만들어, 해당하는 local storage에 관련 정보들을 저장하고자 했다. 이 Typescript 파일의 각 함수들은 아래의 기능을 하고, 이 또한 [이 문서](../CODE_NOTES.md)에서 확인할 수 있다.

- `getLikedItems()`
- `saveLikedItems()`
- `toggleLike()` : Change to like if currently unliked, and vice versa.
- `repaintLikes()` : Update UI whenever refreshing or DOM is updated
- `initLikeButtons()` : Register click events (Initialize event listeners) -> used whenever the user clicks

[트러블슈팅 문서](../TROUBLESHOOTING_NOTES.md)에 자세히 정리했어야 했는데 (~~시간이 되면 할 예정~~) 좋아요 기능이 단순해 보였는데 엄청 많은 시간이 소요됐었다. 그 원인은, 좋아요를 눌러도 화면에 UI가 반영되지 않는 문제가 있었기 때문이었다.

처음에는 Typescript 문제라고 생각해서, 모든 function에 `console.log`를 구현해서 확인했으나, 모든 기능이 잘 된다는 것을 깨닫고 많은 고민을 했었다.

결국 알게된 사실은 CSS 우선순위 문제였다. 초록색으로 like를 표시해야 하는데, 더 높은 우선순위의 디자인이 이 초록색으로 바뀌는 기능을 덮어쓰고 있어서 화면 상에 보이지 않았던 것이다. CSS는 많은 비율을 AI로 관리하고 있기 때문에 이런 문제가 생겼던 것 같다. 이것을 계기로 나는 내 CSS 코드를 다시 읽어보며 혹시 potential한 문제는 없을지 점검하기도 했다. (~~CSS가 제일 어렵다~~)

데이터를 fetch해서 가져오는 기능은 처음에는 신기했다. 항상 backend API를 호출하여 데이터를 가져오는 것만 해봤기 때문에, frontend에 저장된 static한 파일들을 불러올 수 있다는 사실 자체가 신선했기 때문이다.

```typescript
import dataUrl from "../../data.json?url";
import type { AppData } from "../../types/types";

export async function fetchNetflixData(): Promise<AppData> {
	// Previous code fetching data from the frontend
	try {
		const response = await fetch(dataUrl);
		if (!response.ok) {
			throw new Error(`HTTP Error! Status: ${response.status}`);
		}
		const data: AppData = await response.json();
		return data;
	} catch (error) {
		console.error("데이터를 가져오는 데 실패했습니다:", error);
		throw error;
	}
}
```

위 코드에서, AI에 의하면, `dataUrl`은 Vite가 빌드 시 JSON 파일을 static asset으로 처리해주는 경로라고 한다. 즉, 이 `data.json`은 같은 domain (`localhost:5173`)의 Vite Dev Server에서 직접 불러오는 것이라고 한다.

4주차 과제를 통해 상태 저장 -> DOM rendering -> event handling을 직접 경험할 수 있었다.
