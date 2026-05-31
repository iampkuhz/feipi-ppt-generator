# Branch Protection

本仓库推荐在 GitHub 上为主分支启用以下保护规则：

- 禁止直接 push 到 `main`。
- 合并前必须通过 CI。
- 合并前至少一名 reviewer。
- 所有 review conversation 必须 resolved。
- 可选启用 linear history。

## Required checks

建议 required status checks：

- `lint`
- `typecheck`
- `test`
- `validate:examples`
- `lord doctor`
- `lord quality --target harness`

## CODEOWNERS

`.github/CODEOWNERS` 当前使用占位 owner。启用 branch protection 前必须替换为真实 GitHub 用户或团队。
