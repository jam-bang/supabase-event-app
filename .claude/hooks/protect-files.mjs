// PreToolUse 훅: .env 파일과 package-lock.json 직접 수정을 차단한다
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const file = input.tool_input?.file_path ?? "";
if (/(^|[\\/])\.env(\.|$)|package-lock\.json$/.test(file)) {
  console.error(`⚠️ 보호된 파일은 수정할 수 없습니다: ${file}`);
  process.exit(2);
}
