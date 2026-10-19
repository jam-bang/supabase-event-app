import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { updateEvent } from "@/app/events/actions";
import { getEvent } from "@/lib/events";
import { requireUserId } from "@/lib/auth";
import { toKstInputValue } from "@/lib/format";

export const metadata: Metadata = { title: "이벤트 수정" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUserId();
  const event = await getEvent(id);
  if (!event) notFound();
  if (event.host_id !== userId) redirect(`/events/${id}`);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">이벤트 수정</h1>
      <EventForm
        action={updateEvent.bind(null, id)}
        submitLabel="수정 저장"
        defaults={{
          title: event.title,
          description: event.description,
          location: event.location,
          starts_at: toKstInputValue(event.starts_at),
          capacity: event.capacity,
        }}
      />
    </div>
  );
}
