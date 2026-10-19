"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/auth";
import { fromKstInputValue } from "@/lib/format";
import type { ActionState } from "@/lib/types";

interface EventInput {
  title: string;
  description: string;
  location: string;
  starts_at: string;
  capacity: number | null;
}

/** 폼 데이터 검증 */
function parseEventForm(formData: FormData): { data?: EventInput; error?: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = fromKstInputValue(String(formData.get("starts_at") ?? ""));
  const capacityRaw = String(formData.get("capacity") ?? "").trim();

  if (!title) return { error: "제목을 입력하세요." };
  if (title.length > 100) return { error: "제목은 100자 이하로 입력하세요." };
  if (!startsAt) return { error: "시작 일시를 입력하세요." };

  let capacity: number | null = null;
  if (capacityRaw) {
    capacity = Number(capacityRaw);
    if (!Number.isInteger(capacity) || capacity < 1) return { error: "정원은 1 이상의 정수로 입력하세요." };
  }
  return { data: { title, description, location, starts_at: startsAt, capacity } };
}

export async function createEvent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = parseEventForm(formData);
  if (!parsed.data) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({ ...parsed.data, host_id: userId })
    .select("id")
    .single<{ id: string }>();
  if (error) return { error: `이벤트를 만들지 못했습니다: ${error.message}` };

  revalidatePath("/", "layout");
  redirect(`/events/${data.id}`);
}

export async function updateEvent(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUserId();
  const parsed = parseEventForm(formData);
  if (!parsed.data) return { error: parsed.error };

  const supabase = await createClient();
  // RLS가 주최자 본인만 수정하도록 보장한다 (다른 사용자는 0건 수정)
  const { data, error } = await supabase.from("events").update(parsed.data).eq("id", id).select("id");
  if (error) return { error: `수정하지 못했습니다: ${error.message}` };
  if (!data?.length) return { error: "주최자만 수정할 수 있습니다." };

  revalidatePath("/", "layout");
  redirect(`/events/${id}`);
}

export async function deleteEvent(id: string): Promise<ActionState> {
  await requireUserId();
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").delete().eq("id", id).select("id");
  if (error) return { error: `삭제하지 못했습니다: ${error.message}` };
  if (!data?.length) return { error: "주최자만 삭제할 수 있습니다." };

  revalidatePath("/", "layout");
  redirect("/my");
}

export async function joinEvent(id: string): Promise<ActionState> {
  const userId = await requireUserId();
  const supabase = await createClient();
  const { error } = await supabase.from("event_participants").insert({ event_id: id, user_id: userId });
  if (error) {
    if (error.code === "23505") return { error: "이미 참여한 이벤트입니다." };
    if (error.code === "P0001") return { error: "정원이 마감된 이벤트입니다." };
    return { error: `참여하지 못했습니다: ${error.message}` };
  }
  revalidatePath("/", "layout");
  return { message: "참여 신청이 완료되었습니다." };
}

export async function leaveEvent(id: string): Promise<ActionState> {
  const userId = await requireUserId();
  const supabase = await createClient();
  const { error } = await supabase.from("event_participants").delete().eq("event_id", id).eq("user_id", userId);
  if (error) return { error: `참여를 취소하지 못했습니다: ${error.message}` };
  revalidatePath("/", "layout");
  return { message: "참여를 취소했습니다." };
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const displayName = String(formData.get("display_name") ?? "").trim();
  if (!displayName || displayName.length > 30) return { error: "표시 이름은 1~30자로 입력하세요." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", userId);
  if (error) return { error: `저장하지 못했습니다: ${error.message}` };
  revalidatePath("/", "layout");
  return { message: "저장되었습니다." };
}
