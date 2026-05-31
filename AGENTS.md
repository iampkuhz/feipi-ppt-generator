# Agent 工程规则

## 非平凡变更

以下情况属于非平凡变更，必须创建 OpenSpec-style change：

- 新增或改变生成行为。
- 改动 OpenSpec、harness、quality gate、hooks、agent 配置。
- 调整目录职责、开发流程、验证流程。
- 新增组件、模板包、布局规则或渲染策略。
- 跨多个模块的结构性改造。
- 会影响长期维护方式的文档或脚本变更。

## OpenSpec 规则

非平凡变更先创建 `openspec/changes/<change-id>/`，至少包含 `proposal.md`、`design.md`、`tasks.md`、`specs/<area>/spec.md` 和 `qa-report.md`。长期规格只在变更确认和归档时更新。

## 受保护路径

以下路径需要先有活跃 change：

```text
.claude/
.codex/
openspec/
harness/
scripts/
src/foundation/
src/registry/
src/renderer/
src/components/
src/patterns/
tests/
CLAUDE.md
AGENTS.md
```

## 文件操作规则

保持改动范围最小。不要读取或提交本地-only 文件、密钥、真实客户素材和运行态日志。不要回滚用户未提交改动。

## 最小验证原则

根据变更路径运行最小必要验证。常用命令：

```bash
pnpm typecheck
pnpm test
pnpm lord doctor
pnpm lord quality --target harness --change-id <change-id>
```

## 中文规约

长期文档、测试描述、schema 说明、错误提示、日志和 QA report 默认中文。英文仅作为标识符、路径、命令或标准术语词组出现。

## 完成标准

完成时必须汇报 changed files、已运行验证、未完成 TODO 和风险。若命令未运行或失败，必须如实说明。
