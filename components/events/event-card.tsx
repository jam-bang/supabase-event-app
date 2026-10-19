import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import type { EventSummary } from "@/lib/types";

export function EventCard({ event }: { event: EventSummary }) {
  const isFull = event.capacity !== null && event.participant_count >= event.capacity;
  const isPast = new Date(event.starts_at) < new Date();

  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <Card className="h-full transition-colors group-hover:border-primary/60">
        <CardHeader className="space-y-2">
          <div className="flex gap-2">
            {isPast ? <Badge variant="secondary">종료</Badge> : isFull ? <Badge variant="destructive">마감</Badge> : <Badge>모집 중</Badge>}
          </div>
          <CardTitle className="text-lg leading-snug group-hover:text-primary">{event.title}</CardTitle>
          <CardDescription className="line-clamp-2">{event.description || "설명이 없습니다."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4" /> {formatDateTime(event.starts_at)}
          </p>
          {event.location && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" /> {event.location}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Users className="size-4" /> {event.participant_count}
            {event.capacity !== null ? ` / ${event.capacity}명` : "명 참여"} · 주최 {event.host_name}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function EventGrid({ events, empty }: { events: EventSummary[]; empty: string }) {
  if (events.length === 0) {
    return <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  );
}
