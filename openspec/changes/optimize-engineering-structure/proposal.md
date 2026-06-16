# Proposal

## 为什么做

仓库已经具备 OpenSpec、harness、agent、skill、hook、quality gate 和 PPTX renderer 骨架，但运行规则仍分散在多处入口中：

- `.claude/agents/` 中部分 subagent 仍是非标准短说明，缺少 frontmatter、工具面和最小上下文边界。
- `.codex/agents/`、`agents/`、`skills/` 中存在英文说明、旧搜索工具约定和重复规则。
- `AGENTS.md` 尚未明确“注释、文档、测试描述、schema 说明、错误提示、日志、QA report 默认中文”的全局研发规约。
- `harness/` 有若干只表达占位意图的孤岛节点，progressive loading 和运行面校验还不够可执行。
- `scripts/` 和 `tests/` 存在无引用 stub 或重复低信号测试。
- 原子组件样例缺少统一 catalog、参数模型、生成脚本和可供人工 review 的 PPTX 输出链路。

本变更将仓库从“有工程骨架”升级为“agent/skill/hook/harness 可持续治理”的基础版本，并为后续 PPT 组件体系审查提供可生成样例。

## 范围

- 标准化 `.claude/agents/`、`.codex/agents/` 和 `agents/`，以 `harness/agents/registry.yaml` 作为 agent 职责真源。
- 补齐 `AGENTS.md` 和 `harness/governance/language-policy.md` 的中文研发规约。
- 增强 `scripts/harness/validate_agent_runtime.ts`、`validate_language_policy.ts`、`doctor` 和 quality gate。
- Review `harness/` 文档，删除孤岛模板节点，保留渐进式上下文包。
- 清理无引用 stub 脚本和重复测试，升级仍被 hook 调用的脚本为真实轻量检查或事件记录。
- 建立原子组件 catalog、schema、样例 deck、生成脚本和 PPTX inspect 检查链路。
- 更新 renderer 和 registry，使已声明的基础原子组件能生成非 stub PPTX。

## 不做什么

- 不移动单包目录结构，不引入 monorepo。
- 不实现完整图像级 visual diff、文本溢出检测或自动 OpenSpec 归档。
- 不读取或提交本地-only 文件、密钥、真实客户素材和运行态日志。
- 不修改长期 `openspec/specs/**`；本次只维护 change delta，归档后再同步长期规格。
