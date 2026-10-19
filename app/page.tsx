import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventGrid } from "@/components/events/event-card";
import { getUpcomingEvents } from "@/lib/events";
import { hasEnvVars } from "@/lib/utils";


export default async function Home() {
  const events = hasEnvVars ? await getUpcomingEvents(6) : [];

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">함께할 이벤트를 찾아보세요</h1>
        <p className="text-muted-foreground">스터디, 모임, 사내 행사까지 — 만들고, 공유하고, 참여 신청을 받으세요.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/events/new">
              <Plus /> 이벤트 만들기
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/events">
              전체 이벤트 <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">다가오는 이벤트</h2>
        <EventGrid events={events} empty="예정된 이벤트가 없습니다. 첫 이벤트를 만들어 보세요!" />
      </section>
    </div>
  );
}
