import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventGrid } from "@/components/events/event-card";
import { getHostedEvents, getJoinedEvents } from "@/lib/events";
import { requireUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "내 이벤트" };

export default async function MyEventsPage() {
  const userId = await requireUserId();
  const [hosted, joined] = await Promise.all([getHostedEvents(userId), getJoinedEvents(userId)]);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">내가 주최한 이벤트 ({hosted.length})</h1>
          <Button asChild size="sm">
            <Link href="/events/new">
              <Plus /> 만들기
            </Link>
          </Button>
        </div>
        <EventGrid events={hosted} empty="아직 주최한 이벤트가 없습니다." />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">참여한 이벤트 ({joined.length})</h2>
        <EventGrid events={joined} empty="참여 신청한 이벤트가 없습니다." />
      </section>
    </div>
  );
}
