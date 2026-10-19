# 이벤트 관리 앱 (Event Hub) - PRD

**Version**: 1.0 · **Last Updated**: 2026-10-19

## 1. 프로젝트 개요

### 목적
소규모 모임·스터디·사내 행사를 누구나 쉽게 만들고 참여 신청을 받을 수 있는 이벤트 관리 웹 앱.

### 목표
- 로그인한 사용자는 1분 안에 이벤트를 만들 수 있다
- 방문자는 로그인 없이 이벤트 목록과 상세를 볼 수 있다
- 참여 신청/취소와 정원 마감이 자동으로 관리된다

## 2. 핵심 기능

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 인증 | 이메일 회원가입·로그인·로그아웃·비밀번호 재설정 (Supabase Auth) | MVP |
| 프로필 | 가입 시 자동 생성, 표시 이름 수정 | MVP |
| 이벤트 목록 | 다가오는 이벤트 / 지난 이벤트, 참여 인원 표시 | MVP |
| 이벤트 상세 | 일시·장소·설명·주최자·참여자 목록 | MVP |
| 이벤트 생성/수정/삭제 | 주최자만 수정·삭제 가능 | MVP |
| 참여 신청/취소 | 사용자당 1회, 정원 초과 시 차단 | MVP |
| 내 이벤트 | 내가 주최한 / 참여한 이벤트 모아보기 | MVP |
| 검색·필터 | 제목 검색, 날짜 필터 | Phase 2 |
| 알림 | 이벤트 변경 시 참여자 이메일 알림 | Phase 2 |

## 3. 기술 스택

- **Frontend**: Next.js 16 (App Router, Server Components/Server Actions), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, Row Level Security), `@supabase/ssr`
- **Deploy**: Vercel
- **Dev Tools**: Claude Code (커스텀 커맨드·훅·서브에이전트), MCP(Supabase, Context7, Playwright), Shrimp Task Manager

## 4. 데이터 모델

| 테이블 | 주요 컬럼 | RLS |
|--------|-----------|-----|
| `profiles` | id(=auth.users.id), display_name | 조회: 모두 / 수정: 본인 |
| `events` | id, host_id, title, description, location, starts_at, capacity | 조회: 모두 / 생성·수정·삭제: 주최자 본인 |
| `event_participants` | (event_id, user_id) PK | 조회: 모두 / 신청·취소: 본인 |

- 회원가입 트리거로 `profiles` 자동 생성
- 정원 초과는 DB 트리거(`check_event_capacity`)에서 차단

## 5. 사용자 스토리

- 방문자로서, 로그인 없이 다가오는 이벤트를 둘러보고 싶다.
- 사용자로서, 이메일로 가입하고 바로 이벤트에 참여 신청하고 싶다.
- 주최자로서, 제목·일시·장소·정원을 입력해 이벤트를 만들고 싶다.
- 주최자로서, 내 이벤트를 수정하거나 취소(삭제)하고 싶다.
- 참여자로서, 일정이 안 맞으면 참여를 취소하고 싶다.
- 사용자로서, 내가 만든 이벤트와 참여한 이벤트를 한곳에서 보고 싶다.
- 사용자로서, 정원이 찬 이벤트는 신청할 수 없다는 것을 바로 알고 싶다.
