import type { Metadata } from "next";
import { ProfileForm } from "./profile-form";
import { getProfile } from "@/lib/events";
import { requireUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "프로필" };

export default async function ProfilePage() {
  const userId = await requireUserId();
  const profile = await getProfile(userId);
  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold">프로필</h1>
      <ProfileForm displayName={profile?.display_name ?? ""} />
    </div>
  );
}
