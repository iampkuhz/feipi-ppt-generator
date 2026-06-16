# Design

## 方案

本次采用“真源集中、入口变薄、验证补强”的治理方案：

1. `harness/agents/registry.yaml` 成为 agent 职责、输入、输出、范围和验证责任真源。
2. `.claude/agents/*.md` 和 `.codex/agents/*.toml` 只保留运行时最小入口：名称、触发说明、工具 allowlist、最小上下文、禁止范围和输出格式。
3. `AGENTS.md` 记录全局研发规约；`harness/governance/language-policy.md` 和 `validate_language_policy.ts` 负责机器检查文档型入口是否满足中文规约。
4. `harness/context/*.md` 保留为 progressive loading 上下文包，删除没有可执行模板的孤岛节点。
5. hook shell 继续保持薄入口，策略逻辑放在 `scripts/agent_hooks/` 和 `scripts/hooks/`；被调用脚本必须做真实轻量动作，不能只输出占位 PASS。
6. quality gate 从“target stub 也 PASS”改为：未配置真实 gate 时输出 `SKIPPED`，且 overall 不得为 `PASS`。
7. 原子组件样例采用 catalog-first：`examples/components/atom-components.json` 和 `atom-component-variants.json` 描述组件类型、layer、maturity、props、expectedTexts 和 fixture；`scripts/components/generate_atom_samples.ts` 负责生成 deck、PPTX、fixtures manifest 和 inspect report。

## Agent 能力抽象

- 通用 handoff 字段、allowed/forbidden scope、输出格式和验证责任集中在 registry。
- `qwen-main-default` 负责协调，不复制完整 subagent registry。
- active agent 限定为 `qwen-main-default`、`implementer`、`repo-mapper`、`openspec-planner`、`component-engineer`、`visual-qa`。
- deferred/shared agent 保留职责文档，但默认不进入 main agent 工具面。

## 原子组件样例模型

- layer：`primitive`、`atom`。
- maturity：`schema-only`、`pptx-rendered`、`visually-checkable`、`stable`。
- props 只使用组件 schema 和 foundation alias，不开放自由输入视觉数值。
- 生成脚本支持两种模式：单组件 renderer structure 和 component gallery。
- PPTX inspect 用 zip 结构解析 slide、text、color、font、shape 和 media，作为人工 review 前的确定性证据。

## 影响面

- `AGENTS.md`
- `.claude/**`
- `.codex/**`
- `agents/**`
- `harness/**`
- `scripts/**`
- `skills/**`
- `src/registry/**`
- `src/renderer/**`
- `src/schema/**`
- `src/harness/**`
- `examples/**`
- `tests/**`
- `docs/acceptance/**`
- `docs/architecture/**`
- `openspec/changes/optimize-engineering-structure/**`

## 风险

- 图像级 visual diff 和文本溢出检查尚未实现，只能通过 `SKIPPED`、`BLOCKED` 或限制说明表达，不得伪装成完整视觉通过。
- `.claude/agents`、`.codex/agents` 和 `agents/` 仍是手写入口；本次通过 validator 降低漂移风险，后续可再做生成器。
- 原子组件样例 PPTX 是 review artifact，不等同于最终设计系统视觉验收。
