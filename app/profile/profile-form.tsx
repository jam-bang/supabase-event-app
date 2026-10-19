"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/events/actions";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState(updateProfile, {});
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display_name">표시 이름</Label>
        <Input id="display_name" name="display_name" defaultValue={displayName} maxLength={30} required />
        <p className="text-xs text-muted-foreground">이벤트 주최자·참여자 목록에 표시됩니다.</p>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.message && <p className="text-sm text-muted-foreground">{state.message}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
