import { createClient } from "@/lib/supabase/server";
import type { EventDetail, EventSummary, Profile } from "@/lib/types";

const SUMMARY_SELECT =
  "id, host_id, title, description, location, starts_at, capacity, host:profiles!events_host_id_fkey(display_name), event_participants(count)";

interface EventRow {
  id: string;
  host_id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  capacity: number | null;
  host: { display_name: string } | null;
  event_participants: { count: number }[];
}

function toSummary(row: EventRow): EventSummary {
  return {
    id: row.id,
    host_id: row.host_id,
    title: row.title,
    description: row.description,
    location: row.location,
    starts_at: row.starts_at,
    capacity: row.capacity,
    host_name: row.host?.display_name ?? "알 수 없음",
    participant_count: row.event_participants?.[0]?.count ?? 0,
  };
}

/** 다가오는 이벤트 (가까운 순) */
export async function getUpcomingEvents(limit = 50): Promise<EventSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SUMMARY_SELECT)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit)
    .overrideTypes<EventRow[], { merge: false }>();
  if (error) throw new Error(error.message);
  return (data ?? []).map(toSummary);
}

/** 지난 이벤트 (최근 순) */
export async function getPastEvents(limit = 20): Promise<EventSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SUMMARY_SELECT)
    .lt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(limit)
    .overrideTypes<EventRow[], { merge: false }>();
  if (error) throw new Error(error.message);
  return (data ?? []).map(toSummary);
}

interface DetailRow extends Omit<EventRow, "event_participants"> {
  event_participants: { user_id: string; created_at: string; profile: { display_name: string } | null }[];
}

/** 이벤트 상세 + 참여자 */
export async function getEvent(id: string): Promise<EventDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, host_id, title, description, location, starts_at, capacity, host:profiles!events_host_id_fkey(display_name), event_participants(user_id, created_at, profile:profiles(display_name))",
    )
    .eq("id", id)
    .maybeSingle()
    .overrideTypes<DetailRow | null, { merge: false }>();
  if (error) {
    // 잘못된 uuid 형식은 "없음"으로 처리
    if (error.code === "22P02") return null;
    throw new Error(error.message);
  }
  if (!data) return null;
  const participants = [...data.event_participants]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((p) => ({ user_id: p.user_id, display_name: p.profile?.display_name ?? "알 수 없음", joined_at: p.created_at }));
  return {
    ...toSummary({ ...data, event_participants: [{ count: participants.length }] }),
    participants,
  };
}

/** 내가 주최한 이벤트 */
export async function getHostedEvents(userId: string): Promise<EventSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SUMMARY_SELECT)
    .eq("host_id", userId)
    .order("starts_at", { ascending: false })
    .overrideTypes<EventRow[], { merge: false }>();
  if (error) throw new Error(error.message);
  return (data ?? []).map(toSummary);
}

/** 내가 참여한 이벤트 */
export async function getJoinedEvents(userId: string): Promise<EventSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_participants")
    .select(`event:events(${SUMMARY_SELECT})`)
    .eq("user_id", userId)
    .overrideTypes<{ event: EventRow | null }[], { merge: false }>();
  if (error) throw new Error(error.message);
  return (data ?? [])
    .flatMap((r) => (r.event ? [toSummary(r.event)] : []))
    .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
}

/** 프로필 조회 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, display_name").eq("id", userId).maybeSingle<Profile>();
  return data;
}
