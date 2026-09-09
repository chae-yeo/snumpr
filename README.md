# SNUMPR Lab Website

서울대학교 전기·정보공학부 **Machine Perception and Reasoning Lab**(SNUMPR) 홈페이지입니다.
Next.js(React) 기반으로 만들어져 있고, 대부분의 콘텐츠는 `/public/data/` 안의 **JSON 파일**로 관리됩니다. 따라서 일상적인 업데이트(팀원 추가, 논문 추가, 사진 업로드 등)는 코드를 거의 건드리지 않고도 가능합니다.

> **이 문서를 읽는 분께**
> React/Next.js는 처음이어도 문제없이 운영하실 수 있도록 작성했습니다. 코드 수정이 필요한 작업은 대부분 [Claude Code](https://claude.com/claude-code) (Opus 모델 권장)에 한 줄짜리 프롬프트만 던지면 됩니다. 본 README의 §4에 예시 프롬프트가 정리되어 있습니다.

## 0. 시작하기 전에

### 로컬에서 띄워보기

```bash
# 1) 처음 한 번만
npm install

# 2) 매번 작업할 때
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하시면, 파일을 저장하는 즉시 변경사항이 반영된 화면을 확인할 수 있습니다.

### 배포

실제 서울대 서버 반영은 **로컬에서 수정 → GitHub에 push → 서버에서 pull·build·재시작** 순서로 진행합니다.

#### 1) 로컬에서 수정 확인 후 GitHub에 올리기

`npm run dev`로 화면이 정상인지 확인한 뒤, 프로젝트 폴더에서 실행합니다.

```bash
git status
git add .
git commit -m "업데이트 내용 요약"
git push
```

여기까지 하면 GitHub의 코드는 최신이지만, **서버에서 실행 중인 홈페이지는 아직 바뀌지 않습니다.**

서버 반영 전 GitHub에 push된 최신 화면은 [Vercel 미리보기](https://snumpr-mocha.vercel.app/)에서 확인할 수 있습니다. 운영 서버와 내용이 다를 때, 이 주소에서 먼저 변경사항이 정상적으로 배포됐는지 확인해 주세요.

#### 2) 서울대 서버에 반영하기

학내망 또는 SNU VPN에서 서버에 접속한 뒤 아래를 순서대로 실행합니다.

```bash
ssh lab_page
cd ~/snumpr
git pull --ff-only
npm run build
sudo systemctl restart snumpr
```

- `git pull --ff-only`: GitHub의 새 코드를 서버에 안전하게 받습니다. 서버 파일과 충돌할 상황이면 멋대로 합치지 않고 중단합니다.
- `npm run build`: 새 코드로 서비스용 홈페이지를 만듭니다.
- `sudo systemctl restart snumpr`: 실행 중인 홈페이지를 새 결과물로 교체합니다.

따라서 서버에서는 **`git pull`만 하면 반영이 끝난 것이 아닙니다.** `build`와 `restart`까지 해야 합니다.

`package.json` 또는 `package-lock.json`이 바뀐 업데이트라면, `npm run build` 전에 `npm ci`도 실행합니다.

```bash
cd ~/snumpr
git pull --ff-only
npm ci
npm run build
sudo systemctl restart snumpr
```

#### 3) 반영 확인

서버에서 아래 결과가 각각 `active`, `HTTP/1.1 200 OK`인지 확인합니다.

```bash
sudo systemctl is-active snumpr
curl -I http://127.0.0.1:3000
```

학내에서는 `http://147.47.106.32`로 확인합니다. 도메인 연결과 외부 443 포트 개방이 완료되면 최종 주소는 `https://mpr.snu.ac.kr`입니다.

---

## 1. 프로젝트 구조

```
snumpr/
├── public/
│   ├── data/                   ← 모든 콘텐츠 JSON (팀, 논문, 갤러리 등)
│   │   ├── people.json
│   │   ├── publications.json
│   │   ├── news.json
│   │   ├── gallery.json
│   │   └── links.json          ← GitHub / HuggingFace / SNS / Google Form 링크
│   ├── images/                 ← 모든 이미지 (people, publications, gallery 등)
│   ├── icons/                  ← 페이지별 SVG 아이콘
│   ├── research-pdfs/          ← 논문 PDF 파일
│   └── logo.svg
│
├── src/
│   ├── app/                    ← 페이지 (Next.js App Router)
│   │   ├── layout.tsx          ← 폰트/메타데이터/네비/푸터 등 공통 레이아웃
│   │   ├── globals.css         ← 전역 스타일 + --nav-height, --font-main 등
│   │   ├── theme.css           ← 색상 변수 (이 파일만 바꿔도 사이트 전체 색이 바뀜)
│   │   ├── page.tsx            ← Home 페이지
│   │   ├── page.module.css     ← Home 페이지 스타일
│   │   ├── team/               ← /team
│   │   ├── publications/       ← /publications
│   │   ├── highlights/         ← /highlights
│   │   ├── gallery/            ← /gallery
│   │   └── join-us/            ← /join-us
│   ├── components/             ← 재사용 컴포넌트
│   │   ├── Navbar.tsx          ← 상단 네비게이션
│   │   ├── Footer.tsx          ← 하단 푸터
│   │   ├── Title.tsx           ← 페이지 제목
│   │   ├── FadeIn.tsx          ← 스크롤 페이드 인 애니메이션
│   │   └── Icons.tsx           ← 인라인 SVG 아이콘들
│   ├── types/index.ts          ← TypeScript 타입(데이터 schema의 정답지)
│   └── utils/                  ← 유틸 함수
│
├── README.md                   ← 이 문서
└── CLAUDE.md                   ← Claude Code가 이 repo에서 일할 때 보는 규칙
```

### 핵심 원칙 4가지

1. **페이지** 하나 = `src/app/<route>/page.tsx` 하나. 폴더 이름이 곧 URL이 됩니다.
2. **콘텐츠 데이터**는 전부 `/public/data/*.json`. 텍스트/사진을 바꾸려면 JSON만 수정.
3. **색·폰트**는 `src/app/theme.css`와 `src/app/globals.css`의 CSS 변수로 관리.
4. **이미지**는 `/public/images/<용도>/`에 두고, 코드/JSON에서는 `/images/...` 경로로 참조.

---

## 2. 데이터 추가·수정 (JSON만 만지면 됩니다)

모든 콘텐츠는 `/public/data/` 아래의 JSON 파일로 관리됩니다. JSON 문법만 지켜 주시면 됩니다.

> **JSON 공통 주의사항**
>
> - 따옴표는 반드시 직선 큰따옴표(`"`). 한글 문서에서 자동으로 들어가는 둥근 따옴표(`"`, `"`)는 에러를 냅니다.
> - 마지막 항목 뒤에 콤마(`,`)를 붙이지 마세요.
> - 저장 후 `npm run dev`가 돌고 있다면 즉시 화면이 갱신됩니다. 화면이 깨지면 터미널에 빨간 에러가 떠 있을 가능성이 높습니다.

### 2-1. 팀원 — `public/data/people.json`

5개 섹션으로 구성됩니다(배열 순서 = 화면에 보이는 순서):

- `faculty_and_researchers`
- `graduate_students`
- `undergraduate_interns`
- `robots`
- `administrative_staff`

한 명당 entry 형식:

```json
{
  "name": "Jonghyun Choi",
  "position": "Associate Professor",
  "image": "/images/people/jonghyunchoi.jpg",
  "website": "https://ppolon.github.io",
  "email": "jonghyunchoi@snu.ac.kr",
  "github": "http://github.com/jchoivision"
}
```

- 비워둘 필드는 `""`(빈 문자열)로 두면 됩니다.
- 사진은 `public/images/people/`에 jpg/png/webp로 저장하고, 위와 같은 경로로 참조.

### 2-2. 논문 — `public/data/publications.json`

```json
{
  "title": "Modular Memory is the Key to Continual Learning Agents",
  "authors": ["Vaggelis Dorovatas", "Jonghyun Choi", "..."],
  "journalsInfo": "arXiv 2603",
  "thumbnailUrl": "/images/publications/arxiv2603-memory.jpg",
  "links": [
    { "label": "PDF", "url": "https://arxiv.org/pdf/2603.01761" },
    { "label": "Code", "url": "https://github.com/..." }
  ],
  "researchTopic": ["Visual Understanding & Computational Imaging"],
  "year": "2026",
  "modality": ["Vision"],
  "recognition": ["Oral/Spotlight"],
  "recognitionVenues": ["ICML 2026"]
}
```

| 필드              | 설명                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `journalsInfo`    | "CVPR 2026", "arXiv 2603" 같은 자유 문자열                                                       |
| `links[].label`   | **PDF / Code / Data / Page / Supp / Media / Slides** 권장 (`theme.css`에 색이 매핑되어 있습니다) |
| `researchTopic`   | 배열. 아래 6개 Topic 중 논문에 해당하는 항목을 넣습니다.                                                     |
| `year`            | `"2026"`, `"2025"`, `"Preprint"` 등                                                              |
| `modality`        | 배열. `Vision`, `Language`, `Speech` 중 하나 이상                                                  |
| `recognition`     | 배열. `Award winning`, `Oral/Spotlight`, `Highly cited` 중 하나 이상. 해당 없으면 `[]`             |
| `recognitionVenues` | 선택 항목. recognition을 받은 venue 목록. 두 곳 이상이면 목록 수만큼 메달이 표시됩니다.           |

논문 PDF를 사이트에 직접 호스팅하려면 `public/research-pdfs/`에 파일을 넣고 `links`에서 `"/research-pdfs/<파일명>.pdf"`로 참조하시면 됩니다.

### 2-3. 갤러리 — `public/data/gallery.json` (학생 추가용 안내 포함)

```json
{
  "id": "g4",
  "title": "2026 Spring Picnic",
  "description": "Lab spring picnic at Seoul Forest",
  "category": "Social Events",
  "color": "green",
  "date": "April 12, 2026",
  "location": "Seoul, Korea",
  "images": ["/images/gallery/picnic-1.jpg", "/images/gallery/picnic-2.jpg"]
}
```

- `id`: 다른 항목과 겹치지 않게 (`g4`, `g5`, ...).
- `category`: 자유 문자열. 기존에 사용 중인 값: `"Conference"`, `"Lab Events"`, `"Social Events"`.
- `color`: 카테고리 배지 색. 다음 8개 중 하나 — `red | orange | yellow | green | teal | blue | purple | pink`.
- `images`: 한 장이어도 배열로. 두 장 이상이면 카드 안에서 슬라이드로 표시됩니다.

#### 학생 분들께 — 갤러리 사진 추가 절차

1. 사진을 `public/images/gallery/` 폴더에 저장합니다. **파일명은 영문/숫자/하이픈만** 사용해 주세요(예: `emnlp2025-1.jpg`). 한글·공백·괄호는 사용하지 마세요.
2. 사진 한 장당 **약 1MB 이하**로 압축해 주세요(너무 큰 사진은 사이트가 느려집니다).
3. `public/data/gallery.json` 파일을 열고, 배열 맨 끝에 위 형식의 객체를 하나 추가합니다.
4. `images` 배열에 위에서 저장한 파일들의 경로를 `/images/gallery/<파일명>` 형식으로 적습니다.
5. 저장한 뒤 `npm run dev`로 띄워 본인이 추가한 항목이 잘 나오는지 확인 → 이상 없으면 commit & push.

### 2-4. News — `public/data/news.json`

```json
{
  "id": "1",
  "title": "Four Papers at CVPR 2026",
  "details": "Four papers from our lab will be presented at CVPR 2026 in Nashville.",
  "imageUrl": "/images/news/news1.jpg"
}
```

- **News**: Home에 미리보기로 보이고, `/highlights` 페이지에서 전체가 보입니다.
- 이미지는 `public/images/highlights/` 아래에 저장합니다.

### 2-5. 외부 링크 / SNS — `public/data/links.json`

```json
{
  "github": "https://github.com/snumprlab",
  "huggingface": "https://huggingface.co/SNUMPR",
  "sns": {
    "x": "/",
    "bluesky": "/",
    "instagram": "/",
    "linkedin": "/",
    "facebook": "/"
  },
  "googleForm": "#"
}
```

- `github`, `huggingface`: 우상단 네비 아이콘.
- `sns`: 푸터의 SNS 아이콘들. 사용하지 않는 항목은 `"/"` 또는 `""`로 두면 됩니다.
- `googleForm`: Join Us 페이지의 신청 폼 링크.

---

## 3. 색상·폰트 수정

### 3-1. 색상 — `src/app/theme.css`

이 파일 한 군데만 바꿔도 사이트 전체 색이 즉시 반영됩니다.

| 변수                                                               | 의미 / 영향 범위                                   |
| ------------------------------------------------------------------ | -------------------------------------------------- |
| `--color-primary`                                                  | 브랜드 메인 색 (링크, 활성 메뉴, 강조 텍스트)      |
| `--color-primary-accent`                                           | 메인 색의 살짝 밝은 버전                           |
| `--color-text` / `--color-text-muted` / `--color-text-faint`       | 본문 / 보조 / 캡션 텍스트                          |
| `--color-bg-soft` / `--color-bg-card` / `--color-bg-list`          | 페이지 배경 / 카드 / 리스트 톤                     |
| `--color-divider` / `--color-border-soft` / `--color-border-faint` | 구분선·테두리                                      |
| `--color-swatch-{red,orange,yellow,green,teal,blue,purple,pink}`   | 8가지 파스텔 — 갤러리 배지/논문 태그가 공유        |
| `--color-tag-pdf / code / data / page / supp / media / slides`     | Publications 링크 라벨별 배경색 (위 swatch를 참조) |
| `--color-highlight`                                                | "ORAL", "Best Paper" 같은 강조 빨강                |
| `--color-scrollbar-*`                                              | 스크롤바 색                                        |

예) 메인 색을 보라색 계열로 바꾸려면 `theme.css`에서 한 줄만 수정하면 됩니다:

```css
--color-primary: #5b3df0;
```

### 3-2. 폰트 — `src/app/globals.css` + `src/app/layout.tsx`

폰트 변수는 `globals.css`에 있습니다:

```css
--font-main: var(--font-figtree), sans-serif;
--font-secondary: var(--font-figtree), sans-serif;
```

폰트 자체는 `layout.tsx`에서 `next/font/google`을 통해 등록합니다(현재 Figtree 사용 중).

- **Google Fonts에 있는 폰트로 바꾸기** (예: Inter): `layout.tsx`에서 `Inter`를 import해 `--font-inter` 변수로 노출하고, `globals.css`의 `--font-main`을 `var(--font-inter)`로 바꿉니다.
- **Google Fonts에 없는 폰트** (예: Pretendard): variable woff2 파일을 `src/fonts/`에 넣고 `next/font/local`로 등록한 뒤, 같은 방식으로 변수로 매핑합니다.

직접 하기 번거로우면 §4-3의 프롬프트 예시처럼 Claude Code에 맡기시는 게 가장 편합니다.

### 3-3. 기타 공통 값

- `--nav-height` (`globals.css`): 상단 네비게이션 높이.

---

## 4. Claude Code로 코드 수정하기

이 사이트는 **Claude Code(Opus 권장)** 와 함께 작업하도록 설계되어 있습니다. 프로젝트 루트에 있는 `CLAUDE.md`에 폴더 구조와 컨벤션이 정리되어 있어, Claude가 알아서 적절한 파일을 찾아 수정합니다. 별도의 정교한 프롬프트는 거의 필요 없습니다.

### 4-1. 새 페이지 추가 (예: Research, About Us)

> **프롬프트 예시**
>
> "`/research` 라우트로 새 페이지를 만들어줘. Team 페이지(`src/app/team`)와 비슷한 구조로 `page.tsx` + `page.module.css`. Navbar에도 'Research' 링크를 Publications 다음에 추가해주고, 우선 placeholder 섹션 3개(Topic 1/2/3)로 채워줘."

페이지를 만든 뒤 콘텐츠를 JSON으로 분리하고 싶다면:

> "방금 만든 research 페이지의 콘텐츠를 `public/data/research.json`으로 분리하고, page.tsx에서 그 JSON을 읽어 렌더링하도록 바꿔줘. 타입은 `src/types/index.ts`에 추가해."

### 4-2. Home에 새 섹션 추가 (Highlights 외)

> **프롬프트 예시**
>
> "Home 페이지(`src/app/page.tsx`)의 Highlights 아래에 새 섹션 'Sponsors'를 추가해줘. 데이터는 `public/data/sponsors.json`에서 읽고(`{ id, name, logoUrl, link }` 배열), 로고들이 가로로 나열되는 형태야. 스타일은 `page.module.css`에 추가해주고, 색은 `theme.css` 변수를 사용해 줘."

캐러셀처럼 동작하게 하고 싶으면 "News 캐러셀과 똑같은 방식으로 동작하게"라는 한 줄을 덧붙이세요.

### 4-3. 색·간격·크기 등 세부 수정

그대로 던져도 잘 동작하는 수준의 짧은 프롬프트들:

- "Team 페이지의 인물 카드 사이 간격을 좀 좁혀줘"
- "메인 색을 좀 더 차분한 남색으로 바꿔줘 (theme.css의 `--color-primary`)"
- "Publications 페이지의 thumbnail 크기를 약 20% 키워줘"
- "Home의 Highlights 카드 모서리를 더 둥글게 해줘"
- "전체 폰트를 Inter로 바꿔줘. layout.tsx에서 등록하고 globals.css의 변수도 같이 수정해줘"

**팁**: 어느 페이지의 어느 요소인지 한 줄로만 명시해 주시면 보통 한 번에 끝납니다.

### 4-4. 작업 후 체크리스트

1. `npm run dev`로 시각적으로 확인.
2. 다른 페이지에 영향이 갔을지 의심되면 Claude에게 "방금 변경이 다른 페이지에 영향 없는지 확인해줘"라고 추가 요청.
3. 만족스러우면 commit → push → Vercel 빌드 초록 체크 확인.

---

## 5. 트러블슈팅

| 증상                   | 보통 원인과 대처                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`에서 에러 | JSON 문법(콤마/따옴표) 또는 import 경로 실수가 대부분. 터미널 메시지를 그대로 Claude에 붙여넣고 "이 에러 고쳐줘"라고 하시면 됩니다. |
| 이미지가 안 뜸         | 경로가 `/images/...`로 시작하는지 확인(루트는 `public/`이지만 코드에서는 `/`로 시작). 파일명 대소문자/공백도 확인.                  |
| Vercel 배포 실패       | Vercel 대시보드 또는 GitHub PR의 빌드 로그 확인. 안 풀리면 Slack으로 연락.                                                          |
| 글꼴이 갑자기 굴림체   | `layout.tsx`의 폰트 import가 깨졌을 가능성. 최근 변경 commit을 보고 되돌리세요.                                                     |

---

## 6. 사용 스크립트 요약

```bash
npm run dev          # 로컬 개발 서버
npm run build        # 프로덕션 빌드 (배포 전 점검용)
npm run start        # 빌드 결과 로컬에서 서비스
npm run lint         # ESLint 검사
npm run format       # Prettier + ESLint 자동 정리
```

---

## 7. 라이선스 / 문의

내부 연구실 사이트입니다. 외부에서 일부 코드를 참고/사용하실 경우 사전에 문의 바랍니다.
