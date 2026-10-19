import Link from "next/link";
import { Suspense } from "react";
import { CalendarHeart } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 text-sm">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CalendarHeart className="size-5 text-primary" /> Event Hub
          </Link>
          <nav className="hidden items-center gap-4 text-muted-foreground sm:flex">
            <Link href="/events" className="hover:text-foreground">
              이벤트
            </Link>
            <Link href="/events/new" className="hover:text-foreground">
              만들기
            </Link>
            <Link href="/my" className="hover:text-foreground">
              내 이벤트
            </Link>
          </nav>
        </div>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </div>
    </header>
  );
}
