# 📋 Notion 블로그 프로젝트 TODO 리스트

이 문서는 Notion을 CMS로 사용하는 블로그 프로젝트의 진행 상황을 추적합니다.

---

## ✅ 완료된 작업

### 1. 개발 환경 세팅
- [x] Next.js 15 프로젝트 초기화 확인
- [x] TypeScript 설정 확인
- [x] Tailwind CSS 설정 확인
- [x] 필요한 npm 패키지 추가
  - `@notionhq/client`: Notion API 공식 SDK
  - `notion-to-md`: Notion 블록을 Markdown으로 변환
  - `react-markdown`: Markdown을 React 컴포넌트로 렌더링
  - `remark-gfm`: GitHub Flavored Markdown 지원 (표, 체크리스트 등)
  - `rehype-highlight`: 코드 하이라이팅

### 2. 핵심 기능 구현
- [x] Notion API 연동 라이브러리 (`src/lib/notion.ts`)
  - 게시글 목록 가져오기 (`getBlogPosts`)
  - Slug로 게시글 가져오기 (`getBlogPostBySlug`)
  - Notion 페이지를 Markdown으로 변환 (`getPostContent`)
  - 모든 Slug 목록 가져오기 (`getAllPostSlugs`)
- [x] 컴포넌트 생성
  - Header 컴포넌트 (`src/components/Header.tsx`)
  - Footer 컴포넌트 (`src/components/Footer.tsx`)
- [x] 게시글 목록 페이지 (`src/app/page.tsx`)
  - Published가 체크된 게시글만 표시
  - Published Date 기준 최신순 정렬
  - 썸네일, 카테고리, 요약 표시
- [x] 게시글 상세 페이지 (`src/app/blog/[slug]/page.tsx`)
  - 동적 라우팅 구현
  - Notion 콘텐츠를 Markdown으로 렌더링
  - SEO 최적화 (동적 메타데이터)
  - 정적 경로 생성 (`generateStaticParams`)
- [x] SEO 최적화
  - robots.txt 동적 생성 (`src/app/robots.txt/route.ts`)
  - sitemap.xml 동적 생성 (`src/app/sitemap.xml/route.ts`)
- [x] 스타일링
  - Markdown 콘텐츠 스타일링 (globals.css)
  - 반응형 디자인 적용

---

## 🔄 진행 중인 작업

없음

---

## 📝 다음 단계 (해야 할 작업)

### 1. 환경 변수 설정
- [x] `.env.local` 파일 생성
  - `NOTION_API_KEY`: Notion Integration Secret
  - `NOTION_DATABASE_ID`: Notion 데이터베이스 ID
  - `NEXT_PUBLIC_BASE_URL`: 블로그 도메인 (예: `http://localhost:3000`)

### 2. Notion 연동 설정
- [x] Notion Integration 생성
  1. [Notion Integrations 페이지](https://www.notion.so/my-integrations) 접속
  2. "New integration" 클릭
  3. 이름 입력 후 생성
  4. "Internal Integration Token" 복사 → `NOTION_API_KEY`에 사용
- [x] Notion 데이터베이스 생성 및 설정
  1. Notion에서 새 데이터베이스 생성
  2. 다음 속성(Property) 추가:
     - `Name` (제목/Title)
     - `Slug` (텍스트/Text)
     - `Published` (체크박스/Checkbox)
     - `Published Date` (날짜/Date)
     - `Summary` (텍스트/Text)
     - `Category` (선택/Select)
     - `Files` (파일과 미디어/Files)
  3. 데이터베이스 페이지에서 "..." 메뉴 → "Connections" → 생성한 Integration 연결
  4. 데이터베이스 URL에서 ID 추출 → `NOTION_DATABASE_ID`에 사용
     - URL 형식: `https://www.notion.so/workspace/DATABASE_ID?v=...`
     - `DATABASE_ID` 부분이 32자리 문자열 (하이픈 포함)

### 3. 의존성 설치
- [x] 다음 명령어 실행:
  ```bash
  pnpm install
  ```

### 4. 개발 서버 실행
- [x] 다음 명령어로 개발 서버 실행:
  ```bash
  pnpm run dev
  ```
- [x] 브라우저에서 `http://localhost:3000` 접속하여 확인

### 5. 테스트 및 검증
- [ ] Notion 데이터베이스에 테스트 게시글 추가
  - `Published` 체크박스 활성화
  - `Slug` 값 입력 (예: `test-post`)
  - `Published Date` 설정
  - 콘텐츠 작성
- [ ] 블로그 목록 페이지에서 게시글이 표시되는지 확인
- [ ] 게시글 상세 페이지가 정상적으로 렌더링되는지 확인
- [ ] SEO 메타데이터가 올바르게 설정되는지 확인
- [x] `/robots.txt` 접속하여 정상 작동 확인
- [x] `/sitemap.xml` 접속하여 정상 작동 확인

### 6. 추가 개선 사항 (선택사항)
- [x] 다크 모드 토글 버튼 추가
- [x] 카테고리별 필터링 기능
- [x] 검색 기능 추가
- [x] 페이지네이션 구현
- [ ] 댓글 시스템 연동 (예: Giscus, Utterances) - 제외
- [x] 소셜 공유 버튼 추가
- [x] 읽기 시간 표시
- [x] 관련 게시글 추천 기능

---

## 🐛 알려진 이슈

없음

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Notion API 문서](https://developers.notion.com/)
- [notion-to-md GitHub](https://github.com/souvikinator/notion-to-md)
- [react-markdown 문서](https://github.com/remarkjs/react-markdown)

---

## 📝 노트

- 프로젝트는 Next.js 15 App Router를 사용합니다.
- 모든 페이지는 서버 컴포넌트로 구현되어 SEO에 최적화되어 있습니다.
- 정적 생성(Static Generation)을 사용하여 성능을 최적화합니다.
- Tailwind CSS 4를 사용하여 스타일링합니다.

---

**마지막 업데이트**: 2024년

