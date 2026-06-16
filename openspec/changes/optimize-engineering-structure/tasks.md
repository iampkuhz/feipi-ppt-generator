# Tasks

- [x] T1: 创建并扩展 OpenSpec change
  - Goal: 用 `optimize-engineering-structure` 承载本次 agent、skill、hook、harness、scripts、tests 和样例生成改造。
  - Allowed files: `openspec/changes/optimize-engineering-structure/**`
  - Forbidden files: `openspec/specs/**`
  - Expected output: proposal、design、tasks、delta spec 和 QA report 覆盖实际变更范围。
  - Validation: `pnpm tsx scripts/openspec/validate_change.ts optimize-engineering-structure`

- [x] T2: 标准化 agent 运行入口
  - Goal: 将 `.claude/agents/`、`.codex/agents/` 和 `agents/` 收敛为标准说明，通用职责放入 `harness/agents/registry.yaml`。
  - Allowed files: `.claude/agents/**`, `.codex/agents/**`, `agents/**`, `harness/agents/registry.yaml`, `scripts/harness/validate_agent_runtime.ts`
  - Forbidden files: `.claude/settings.local.json`, `.codex/local.json`, `tmp/**`
  - Expected output: 所有 Claude agent 有 frontmatter，active/deferred/shared agent 均在 registry 中，运行面校验能发现漂移。
  - Validation: `pnpm tsx scripts/harness/validate_agent_runtime.ts`

- [x] T3: 写入全局中文研发规约
  - Goal: 在 `AGENTS.md`、language policy 和 agent/skill/shared docs 中统一中文默认规则。
  - Allowed files: `AGENTS.md`, `harness/governance/language-policy.md`, `scripts/harness/validate_language_policy.ts`, `.claude/skills/**`, `skills/**`, `agents/**`
  - Forbidden files: 本地-only 配置、运行态日志、真实素材。
  - Expected output: 文档型入口默认中文，英文仅作为标识符、路径、命令、API 或标准术语。
  - Validation: `pnpm tsx scripts/harness/validate_language_policy.ts`

- [x] T4: Review harness、hook 和低质量脚本
  - Goal: 删除孤岛节点和无引用 stub，升级仍被调用的 hook/CLI 脚本为轻量确定性动作。
  - Allowed files: `harness/**`, `scripts/**`, `src/cli/**`, `src/harness/**`, `docs/acceptance/**`, `docs/architecture/**`, `tests/**`
  - Forbidden files: `tmp/**`, `dist/**`, `out/**`, 真实客户素材。
  - Expected output: 无引用 stub 删除，preview/template/qa 输出结构报告，hook 脚本做真实检查或记录。
  - Validation: `pnpm lord doctor`

- [x] T5: 重梳理原子组件样例生成
  - Goal: 建立 catalog-first 的原子组件参数模型和可人工 review 的 PPTX 生成链路。
  - Allowed files: `examples/components/**`, `examples/decks/**`, `scripts/components/**`, `src/schema/**`, `src/registry/**`, `src/renderer/**`, `tests/**`
  - Forbidden files: `assets/templates/**/extracted/raw/**`, `tmp/**` 提交。
  - Expected output: 原子组件 catalog、deck、PPTX 生成脚本、inspect report 和相关测试。
  - Validation: `pnpm tsx scripts/components/generate_atom_samples.ts --out tmp/atom-samples`

- [x] T6: 运行收口验证并更新 QA report
  - Goal: 运行最小必要验证，记录通过、失败、未运行项和剩余风险。
  - Allowed files: `openspec/changes/optimize-engineering-structure/qa-report.md`
  - Forbidden files: 长期规格、运行态产物。
  - Expected output: QA report 与实际命令结果一致。
  - Validation: `pnpm lord quality --target harness --change-id optimize-engineering-structure`
