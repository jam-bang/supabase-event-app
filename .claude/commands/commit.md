---
description: 변경 사항을 검토해 Conventional Commits 형식의 한국어 커밋을 만듭니다
argument-hint: [추가 설명]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
---

1. `git status`와 `git diff`로 변경 사항을 확인한다
2. `.env*` 파일이 포함되어 있으면 커밋하지 말고 경고한다
3. 변경 성격에 맞게 `feat|fix|refactor|docs|chore: 요약` 형식의 한국어 메시지를 작성한다
4. 관련 없는 변경이 섞여 있으면 나눠서 커밋할지 먼저 묻는다
5. 추가 설명: $ARGUMENTS
