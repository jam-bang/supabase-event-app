"use client";

import { useState, useTransition } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionState } from "@/lib/types";

/** 참여/취소/삭제 등 단일 Server Action 버튼 */
export function ActionButton({
  action,
  label,
  pendingLabel,
  confirmMessage,
  variant,
}: {
  action: () => Promise<ActionState>;
  label: string;
  pendingLabel: string;
  confirmMessage?: string;
  variant?: ButtonProps["variant"];
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>({});

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        disabled={pending}
        onClick={() => {
          if (confirmMessage && !window.confirm(confirmMessage)) return;
          startTransition(async () => setResult((await action()) ?? {}));
        }}
      >
        {pending ? pendingLabel : label}
      </Button>
      {result.error && <p className="text-sm text-destructive">{result.error}</p>}
      {result.message && <p className="text-sm text-muted-foreground">{result.message}</p>}
    </div>
  );
}
