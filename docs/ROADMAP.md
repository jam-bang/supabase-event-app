# 이벤트 관리 앱 (Event Hub) - ROADMAP

**기준 문서**: [PRD](./PRD.md) · 개발 원칙: **골격 → 공통 → 개별 기능**

## Phase 1: MVP 개발

### 1-1. 골격
- [x] `create-next-app -e with-supabase` 프로젝트 생성
- [x] Supabase 프로젝트 생성 및 환경 변수 연결
- [x] 개발 환경: 커스텀 커맨드, 훅, 서브에이전트, MCP, 컨텍스트 문서
- [ ] 앱 레이아웃·내비게이션을 이벤트 앱에 맞게 정리 (튜토리얼 화면 제거)

### 1-2. 공통 (DB · 데이터 계층)
- [ ] 마이그레이션: profiles / events / event_participants + RLS + 트리거
- [ ] 도메인 타입 (`lib/types.ts`)
- [ ] 데이터 조회 함수 (`lib/events.ts`)
- [ ] Server Actions (`app/events/actions.ts`): 생성·수정·삭제·참여·취소
- [ ] 공통 컴포넌트: EventCard, EventForm, 날짜 포맷 유틸

### 1-3. 핵심 기능
- [ ] 이벤트 목록 (다가오는 / 지난)
- [ ] 이벤트 상세 + 참여자 목록 + 참여/취소 버튼
- [ ] 이벤트 생성 / 수정 / 삭제 (주최자 전용)
- [ ] 내 이벤트 (주최·참여)
- [ ] 프로필 표시 이름 수정

### 1-4. 검증 및 배포
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` 통과
- [ ] RLS 검증: 비로그인 쓰기 차단, 타인 이벤트 수정 차단
- [ ] Vercel 배포 + Supabase Auth Site URL 설정

## Phase 2: 기능 확장

- [ ] 이벤트 검색·날짜 필터
- [ ] 참여 대기열 (정원 마감 시)
- [ ] 이벤트 변경 이메일 알림 (Supabase Edge Functions)
- [ ] 이벤트 이미지 업로드 (Supabase Storage)
- [ ] Playwright E2E: 가입 → 생성 → 참여 플로우

## 체크리스트 (각 단계 완료 기준)

- [ ] 각 Phase 항목마다 별도 커밋
- [ ] 스키마 변경은 반드시 `supabase/migrations/`에 SQL로 남긴다
- [ ] 새 테이블은 RLS 활성화 + 정책 작성 후 머지
