# Agent 工程规则

## 全局研发规约

- 文档、注释、测试描述、schema 说明、错误提示、运行日志、QA report 和 agent 输出默认使用中文。
- 英文仅用于代码标识符、类型名、函数名、类名、变量名、包名、路径、命令、API、标准术语和外部产品名。
- 需要解释英文术语时，优先写成“中文说明 + 英文术语”的形式；不要整段英文说明。
- 新增长期规则时，先写入对应真源文件，再让脚本、agent、skill、hook 引用该真源，避免多份规则漂移。
- agent、skill、hook 配置只保留最小运行入口；通用能力、边界、验证责任集中放在 `harness/`、`AGENTS.md` 和 OpenSpec change 中。

## 渐进式加载原则

- 先按任务读取最小上下文包，例如 `harness/context/*.md`、目标 OpenSpec change 和直接相关源码。
- 不要在定位阶段读取完整仓库文档、大型日志、真实素材或无关 OpenSpec change。
- 查找文件名优先使用受限 `find`；查找文件内容优先使用 `rg`，不可用时再回退到系统 `grep`。
- subagent handoff 必须提供 `Goal`、`Task id`、`Allowed files/directories`、`Expected output` 和必要验证命令；实现型 subagent 不得自行扩大范围。

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

长期文档、测试描述、schema 说明、错误提示、日志和 QA report 默认中文。英文仅作为标识符、路径、命令、API 名称、外部产品名或标准术语词组出现。

## 完成标准

完成时必须汇报 changed files、已运行验证、未完成 TODO 和风险。若命令未运行或失败，必须如实说明。
