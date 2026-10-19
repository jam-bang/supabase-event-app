// PostToolUse 훅: 수정한 TS/TSX 파일에 eslint --fix를 실행한다 (실패해도 작업은 계속)
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const input = JSON.parse(readFileSync(0, "utf8"));
const file = input.tool_input?.file_path ?? "";
if (/\.(ts|tsx)$/.test(file)) {
  const res = spawnSync("npx", ["eslint", "--fix", file], { encoding: "utf8", shell: process.platform === "win32" });
  if (res.status !== 0 && res.stdout) console.error(res.stdout.slice(0, 2000));
}
