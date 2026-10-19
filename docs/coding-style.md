# 코딩 스타일 가이드

- TypeScript strict, `any` 금지 (외부 응답은 타입을 선언하고 좁힌다)
- 파일명: 컴포넌트 `kebab-case.tsx` (shadcn 규칙과 통일), 함수명 camelCase, 타입 PascalCase
- import 경로는 `@/` alias 사용
- UI는 `components/ui`(shadcn) 컴포넌트를 조합한다. 원본 대규모 수정 금지
- 스타일은 Tailwind 유틸리티 클래스, 조건부 클래스는 `cn()`
- 주석·커밋 메시지·UI 문구는 **한국어**
- 커밋 메시지: `feat|fix|refactor|docs|chore: 요약` (Conventional Commits)
- 날짜 표시는 `lib/format.ts`의 포맷 함수를 사용한다 (Asia/Seoul 기준)
- 완료 기준: `npm run lint` · `npm run typecheck` · `npm run build` 통과
