# Tasks

- [x] T1: 创建 OpenSpec change
  - Goal: 建立本次目录结构升级的 proposal、design、tasks、delta spec 和 QA report。
  - Allowed files: `openspec/changes/optimize-engineering-structure/**`
  - Forbidden files: `openspec/specs/**`
  - Required context: `tmp/session-browser-ai-framework-borrowing-analysis.md`
  - Expected output: change 目录完整，长期规格暂不修改。
  - Validation: `pnpm lord quality --target harness --change-id optimize-engineering-structure`

- [x] T2: 新增工程真源目录
  - Goal: 增加 agent registry、acceptance contract、架构边界和生成文件契约入口。
  - Allowed files: `harness/agents/**`, `docs/acceptance/**`, `docs/architecture/**`
  - Forbidden files: `.env*`, `tmp/**`, `out/**`, `dist/**`
  - Required context: 目标目录结构建议和当前 `harness/manifest.yaml`
  - Expected output: 新目录有 README 或结构化配置，不产生空目录占位漂移。
  - Validation: `pnpm lord doctor`

- [x] T3: 补齐协作目录
  - Goal: 增加 GitHub ownership、依赖更新和 branch protection 文档入口。
  - Allowed files: `.github/**`, `docs/architecture/**`
  - Forbidden files: GitHub secret、本地凭据、运行态日志。
  - Required context: 当前 `.github/workflows/ci.yml`
  - Expected output: `.github/CODEOWNERS`、`.github/dependabot.yml` 和协作文档可读。
  - Validation: `pnpm lord doctor`

- [x] T4: 更新机器结构校验
  - Goal: 将新增结构入口纳入 manifest、repo structure 和 harness structure 校验。
  - Allowed files: `harness/manifest.yaml`, `scripts/harness/**`, `tests/unit/harness.test.ts`
  - Forbidden files: `scripts/quality/**`, `scripts/hooks/**`
  - Required context: 当前结构校验脚本和单测。
  - Expected output: 缺少新增目录时结构校验能失败。
  - Validation: `pnpm test tests/unit/harness.test.ts`

- [x] T5: 运行最小验证并更新 QA report
  - Goal: 记录命令结果、风险和后续 TODO。
  - Allowed files: `openspec/changes/optimize-engineering-structure/qa-report.md`
  - Forbidden files: 长期规格、运行态产物。
  - Required context: 实际验证输出。
  - Expected output: QA report 如实记录成功、失败或未运行命令。
  - Validation: `pnpm lord quality --target harness --change-id optimize-engineering-structure`
