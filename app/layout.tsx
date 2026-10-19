import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/site-header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: { default: "Event Hub · 이벤트 관리", template: "%s | Event Hub" },
  description: "모임·스터디·행사를 만들고 참여 신청을 받는 이벤트 관리 앱",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">{children}</main>
            <footer className="border-t py-8 text-xs text-muted-foreground">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
                <span>Event Hub · Next.js + Supabase</span>
                <ThemeSwitcher />
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
