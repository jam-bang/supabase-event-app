---
description: Supabase 마이그레이션 SQL 파일을 RLS 정책과 함께 생성합니다
argument-hint: <마이그레이션 이름> <변경 내용>
---

@docs/supabase.md 규칙에 따라 마이그레이션을 작성해줘.

- 파일: `supabase/migrations/<현재시각 YYYYMMDDHHMMSS>_$1.sql`
- 내용: $ARGUMENTS
- 새 테이블이면 RLS 활성화 + select/insert/update/delete 정책을 모두 명시
- `auth.uid()`는 `(select auth.uid())`로 감싸기
- 작성 후 `lib/types.ts`에 영향이 있으면 타입도 함께 수정
- 적용은 Supabase MCP `apply_migration`으로 하되, 실행 전에 SQL을 보여주고 확인받기
