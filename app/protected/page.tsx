import { redirect } from "next/navigation";

/** 템플릿의 보호 페이지는 내 이벤트로 이동 */
export default function ProtectedPage() {
  redirect("/my");
}
