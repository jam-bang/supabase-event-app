import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Pencil, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/events/action-button";
import { deleteEvent, joinEvent, leaveEvent } from "@/app/events/actions";
import { getEvent } from "@/lib/events";
import { getUserId } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";


type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  return { title: event?.title ?? "이벤트를 찾을 수 없음" };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const [event, userId] = await Promise.all([getEvent(id), getUserId()]);
  if (!event) notFound();

  const isHost = userId === event.host_id;
  const joined = !!userId && event.participants.some((p) => p.user_id === userId);
  const isFull = event.capacity !== null && event.participant_count >= event.capacity;
  const isPast = new Date(event.starts_at) < new Date();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
      <article className="space-y-6">
        <div className="space-y-3">
          <div className="flex gap-2">
            {isPast ? <Badge variant="secondary">종료</Badge> : isFull ? <Badge variant="destructive">마감</Badge> : <Badge>모집 중</Badge>}
            {isHost && <Badge variant="outline">내가 주최</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <div className="space-y-1.5 text-sm text-muted-foreground">
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
          </div>
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">{event.description || "설명이 없습니다."}</div>
      </article>

      <aside className="space-y-6">
        <div className="space-y-3 rounded-xl border p-5">
          {isPast ? (
            <p className="text-sm text-muted-foreground">종료된 이벤트입니다.</p>
          ) : !userId ? (
            <Button asChild className="w-full">
              <Link href="/auth/login">로그인하고 참여하기</Link>
            </Button>
          ) : joined ? (
            <ActionButton action={leaveEvent.bind(null, event.id)} label="참여 취소" pendingLabel="취소 중..." variant="outline" />
          ) : isFull ? (
            <p className="text-sm text-muted-foreground">정원이 마감되었습니다.</p>
          ) : (
            <ActionButton action={joinEvent.bind(null, event.id)} label="참여 신청" pendingLabel="신청 중..." />
          )}
          {isHost && (
            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Button asChild variant="outline" size="sm">
                <Link href={`/events/${event.id}/edit`}>
                  <Pencil /> 수정
                </Link>
              </Button>
              <ActionButton
                action={deleteEvent.bind(null, event.id)}
                label="삭제"
                pendingLabel="삭제 중..."
                variant="destructive"
                confirmMessage="이벤트를 삭제할까요? 참여 기록도 함께 삭제됩니다."
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">참여자 {event.participant_count}명</h2>
          {event.participants.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 참여자가 없습니다.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {event.participants.map((p) => (
                <li key={p.user_id} className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">{p.display_name.slice(0, 1)}</span>
                  {p.display_name}
                  {p.user_id === event.host_id && <span className="text-xs text-muted-foreground">(주최)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
