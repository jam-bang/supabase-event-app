"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/lib/types";

interface Defaults {
  title?: string;
  description?: string;
  location?: string;
  starts_at?: string; // datetime-local 형식 (KST)
  capacity?: number | null;
}

export function EventForm({
  action,
  defaults = {},
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaults?: Defaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input id="title" name="title" required maxLength={100} defaultValue={defaults.title} placeholder="예: 10월 Next.js 스터디" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="starts_at">시작 일시 (한국 시간) *</Label>
          <Input id="starts_at" name="starts_at" type="datetime-local" required defaultValue={defaults.starts_at} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">정원 (비우면 제한 없음)</Label>
          <Input id="capacity" name="capacity" type="number" min={1} defaultValue={defaults.capacity ?? ""} placeholder="예: 20" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">장소</Label>
        <Input id="location" name="location" defaultValue={defaults.location} placeholder="예: 강남역 스터디카페 / 온라인(Zoom)" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea id="description" name="description" rows={6} defaultValue={defaults.description} placeholder="이벤트 내용, 준비물 등을 적어주세요." />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
