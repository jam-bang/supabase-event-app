import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getProfile } from "@/lib/events";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">로그인</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">회원가입</Link>
        </Button>
      </div>
    );
  }

  const profile = await getProfile(user.sub);
  return (
    <div className="flex items-center gap-3">
      <Link href="/profile" className="hidden hover:underline sm:inline">
        {profile?.display_name || user.email}님
      </Link>
      <LogoutButton />
    </div>
  );
}
