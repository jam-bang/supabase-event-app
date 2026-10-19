# Supabase 사용 가이드

## 클라이언트
| 위치 | 사용 |
|------|------|
| Server Component / Server Action / Route Handler | `import { createClient } from "@/lib/supabase/server"` (요청마다 새로 생성) |
| Client Component | `import { createClient } from "@/lib/supabase/client"` |

- `service_role` 키는 이 프로젝트에서 사용하지 않는다. 권한 제어는 **RLS**로 한다
- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`.env.local`, 커밋 금지)

## 스키마 변경 규칙
1. `supabase/migrations/<YYYYMMDDHHMMSS>_<name>.sql` 파일로 작성한다
2. 새 테이블은 `enable row level security` + select/insert/update/delete 정책을 명시한다
3. 정책의 `auth.uid()`는 `(select auth.uid())`로 감싼다 (성능)
4. `security definer` 함수는 `set search_path = ''`를 지정한다
5. 적용은 Supabase MCP `apply_migration` 또는 대시보드 SQL Editor

## 현재 테이블
- `profiles` — 가입 트리거(`handle_new_user`)로 자동 생성
- `events` — `host_id = auth.uid()`인 경우만 쓰기 가능
- `event_participants` — 본인만 신청/취소, 정원 초과는 `check_event_capacity` 트리거가 예외 발생

## 에러 처리
- Postgres 에러 코드 `23505`(중복 참여), `P0001`(정원 마감)을 사용자 메시지로 변환한다
