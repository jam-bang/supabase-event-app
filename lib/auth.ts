import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** 현재 로그인 사용자 id (없으면 null) */
export async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

/** 로그인 필수 페이지에서 사용 — 미로그인 시 로그인 페이지로 이동 */
export async function requireUserId(): Promise<string> {
  const id = await getUserId();
  if (!id) redirect("/auth/login");
  return id;
}
