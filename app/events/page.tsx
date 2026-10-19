import type { Metadata } from "next";
import { EventGrid } from "@/components/events/event-card";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";

export const metadata: Metadata = { title: "이벤트" };

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">다가오는 이벤트 ({upcoming.length})</h1>
        <EventGrid events={upcoming} empty="예정된 이벤트가 없습니다." />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-muted-foreground">지난 이벤트</h2>
        <EventGrid events={past} empty="지난 이벤트가 없습니다." />
      </section>
    </div>
  );
}
