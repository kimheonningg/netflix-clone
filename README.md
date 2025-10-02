# netflix-clone

전기정보공학부 김희원 넷플릭스 클론 프로젝트

### Branch info

- feature : 과제 2 & 3 개발용
- feature-vite : 과제 4 개발용

### How to run this project

```bash
# move to the project directory
cd vite-netflix-clone-project

# install dependencies if needed
npm install

# run this project
npm run dev
```

This project will open at `http://localhost:5173`

### Checkpoint

#### HW 4

- init vite project V
- code migration V
- 2.1 use fetch API to render card content V
- 2.2 like button (locally store info) V
- 2.3 mock server ?
- Fix card carousel functionality: 옆으로 스크롤해도 card 안보이게 하기 V
- (Z index 조절) card hover 시 pagination bar 안보이도록 수정 V

#### HW 5

- HW 4에서의 구현 보완- carousel 왼쪽 클릭 기능 fix: card hover 시 card가 커지면서 왼쪽 `<`가 클릭되지 않는 버그 발견

- 1. 검색 기능 구현

  - 더 많은 Netflix 컨텐츠 가저오기 (풍성한 검색어를 구현하기 위함) V
  - `data.json`에 연관검색어 데이터도 추가해서, 검색 시 연관검색어와 매칭하고 보여주도록 하자. V
  - 추천 검색어 기능도 추천검색어 목록을 `const.ts` 만들어서 하드코딩으로 구현

- 2. 서버 응답

  - `server` 디렉토리 생성하기
  - Express 환경 구성: `npm install express`
  - Server port는 3000으로 설정 후 config file에 proxy 추가
  - 1초 지연: `setTimeout`
  - Use `fetch ... then` syntax

- 3. 검색창과 최근검색어 기능 (선택- 시간 되면)

  - focus 시 최근검색어 레이어 노출
  - 최근검색어 최대 5개까지 보여주도록: `localStorage` 사용
  - 방향키로 최근 검색어 목록 선택할 수 있도록
  - 검색창 애니메이션- 돋보기 아이콘 누를 때 검색창이 애니메이션 효과로 가로로 확대되도록

- 설계서 작성하기

- carousel next/prev 기능 점검

- NOTE
  - class 문법 사용 x, use only functions

### 개발 노트

- [Troubleshooting 과정](./TROUBLESHOOTING_NOTES.md)

- [프로젝트 구조, 코드 등 정리](./CODE_NOTES.md)
