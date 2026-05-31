# Design

## 方案

本次采用增量结构升级，保留当前目录职责，只补齐建议中缺失的长期真源入口：

1. `harness/agents/registry.yaml` 成为 agent 配置真源，`harness/agents/templates/` 预留后续生成 `.claude/agents/`、`.codex/agents/` 和 `agents/` 的模板位置。
2. `docs/acceptance/` 承接 acceptance contract 和 feature-level 覆盖矩阵，避免长期规格、测试、quality gate 的关系散落在口头约定里。
3. `.github/` 补齐 CODEOWNERS 和 Dependabot，CI 后续可围绕这些 ownership 与 dependency policy 演进。
4. `docs/architecture/architecture-boundaries.md` 和 `docs/architecture/generated-files.md` 明确分层边界与生成物契约，为后续 dependency-cruiser、generated clean check 等 gate 提供规则来源。
5. `harness/manifest.yaml` 和 `scripts/harness/*` 继续作为机器可检查入口，新增目录必须纳入结构校验。

## 影响面

- `openspec/changes/optimize-engineering-structure/**`
- `harness/agents/**`
- `harness/manifest.yaml`
- `scripts/harness/validate_harness_structure.ts`
- `scripts/harness/validate_repo_structure.ts`
- `docs/acceptance/**`
- `docs/architecture/**`
- `.github/**`
- `tests/unit/harness.test.ts`

## 替代方案

- 直接移动为 `packages/core`、`packages/cli`、`packages/templates`：当前仓库仍是单包，过早拆包会扩大改动面。
- 立刻引入 dependency-cruiser、Knip、Lefthook：需要 lockfile 和 CI 行为变更，本次只落目录和契约。
- 用 README 代替结构校验：无法保证后续目录漂移被发现。

## 风险

- 风险：新增 registry 真源后，现有 `.claude/agents`、`.codex/agents`、`agents/` 仍可能继续漂移。
  缓解：本变更只声明真源和结构入口，后续 change 再实现 sync check。
- 风险：CODEOWNERS 使用占位 owner，真实 GitHub 组织可能不存在。
  缓解：文档明确占位 owner 必须在启用 branch protection 前替换。
- 风险：acceptance matrix 先覆盖高层契约，不等同于完整测试映射。
  缓解：在 tasks 和 QA report 中保留后续 validate_test_contract_mapping TODO。
