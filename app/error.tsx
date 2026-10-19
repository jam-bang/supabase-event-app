"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground">데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      {error.digest && <p className="text-xs text-muted-foreground">오류 코드: {error.digest}</p>}
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}
