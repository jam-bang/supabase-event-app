import type { Metadata } from "next";
import { EventForm } from "@/components/events/event-form";
import { createEvent } from "@/app/events/actions";
import { requireUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "이벤트 만들기" };

export default async function NewEventPage() {
  await requireUserId();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">이벤트 만들기</h1>
      <EventForm action={createEvent} submitLabel="이벤트 만들기" />
    </div>
  );
}
