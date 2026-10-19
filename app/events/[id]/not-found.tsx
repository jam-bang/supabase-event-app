import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-bold">이벤트를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">삭제되었거나 주소가 잘못되었습니다.</p>
      <Button asChild variant="outline">
        <Link href="/events">이벤트 목록으로</Link>
      </Button>
    </div>
  );
}
