# Next.js 규칙

- App Router만 사용한다. `pages/` 디렉터리를 만들지 않는다
- 기본은 **Server Component**. 상태·이벤트 핸들러가 필요한 컴포넌트만 `"use client"`
- 데이터 변경은 **Server Actions**(`"use server"`)로 처리하고, 완료 후 `revalidatePath`
- 데이터 조회는 서버에서 `lib/supabase/server.ts`의 `createClient()`로 한다
- 동적 라우트 params / searchParams는 `Promise`이므로 `await` 한다 (Next.js 15+)
- 인증이 필요한 페이지는 서버에서 `supabase.auth.getClaims()`로 확인 후 `redirect("/auth/login")`
- 세션 갱신은 루트 `proxy.ts`(구 middleware)가 담당한다. 수정 시 `lib/supabase/proxy.ts`를 함께 확인
- 폼은 `<form action={serverAction}>` + `useActionState`로 에러를 표시한다
- 이미지는 `next/image`, 링크는 `next/link` 사용
