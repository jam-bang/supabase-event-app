# CLAUDE.md

Next.js + Supabase로 만드는 **이벤트 관리 앱(Event Hub)** 입니다.

## Project Context
- 요구사항: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md
- Next.js 규칙: @docs/next-js.md
- Supabase 가이드: @docs/supabase.md
- 코딩 스타일: @docs/coding-style.md

## 폴더 구조
```
app/
├── auth/            # 로그인·회원가입·비밀번호 (템플릿 제공)
├── events/          # 이벤트 목록·상세·생성·수정 + actions.ts
├── my/              # 내 이벤트 (주최·참여)
└── profile/         # 프로필 수정
components/
├── ui/              # shadcn/ui
└── events/          # EventCard, EventForm, JoinButton ...
lib/
├── supabase/        # server.ts / client.ts / proxy.ts
├── events.ts        # 조회 함수
├── types.ts         # 도메인 타입
└── format.ts        # 날짜 포맷
supabase/migrations/ # 스키마·RLS SQL
```

## 주요 규칙
- 응답·주석·커밋은 한국어
- ROADMAP 순서(골격 → 공통 → 개별 기능)로 작업하고 완료 항목을 체크한다
- DB 변경은 반드시 migrations SQL + RLS 정책과 함께
- `.env.local` 수정·커밋 금지
- 작업 완료 전 `/check` 커맨드로 lint·typecheck·build 확인

## 명령어
| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run lint` / `npm run typecheck` | 정적 검사 |
| `npm run build` | 프로덕션 빌드 |
