# ppt-lord

`ppt-lord` 是一个通用 PPT 创建工具仓库，用于把结构化输入、模板包、组件系统、布局规则和渲染后端组合起来，稳定生成 PowerPoint 文件及预览、检查报告和回归产物。

本仓库只承载通用生成能力，不绑定特定模板、品牌、客户或活动来源。

## 快速开始

```bash
pnpm install
pnpm build
pnpm test
pnpm lord doctor
pnpm lord validate examples/decks/basic.deck.yaml
pnpm lord generate examples/decks/basic.deck.yaml --out tmp/rendered/basic.pptx
pnpm lord preview tmp/rendered/basic.pptx --out tmp/previews/basic
```

## 主要命令

```bash
pnpm lord doctor
pnpm lord validate <deck-spec>
pnpm lord generate <deck-spec> --out <pptx>
pnpm lord preview <pptx> --out <dir>
pnpm lord quality --target <target> --change-id <change-id>
pnpm lord change <change-id>
pnpm lord archive <change-id>
```

## 目录结构

- `src/`：TypeScript 核心逻辑、schema、registry、layout、renderer 和 CLI。
- `assets/templates/`：模板包与脱敏示例资产。
- `examples/`：deck、slide、component 示例。
- `openspec/`：长期规格、schema、模板和本地 change 工作区。
- `harness/`：agent 运行态、质量矩阵、上下文包和治理规则。
- `.claude/`、`.codex/`：agent 配置、hooks、skills 与说明入口。
- `scripts/`：doctor、quality、OpenSpec、hook、preview 和 template 辅助脚本。
- `tmp/`：本地运行态产物，默认不提交。

## 生成链路

```text
用户 brief / 数据 / 素材
  -> deck plan
  -> slide spec
  -> component tree
  -> layout resolver
  -> renderer
  -> pptx
  -> preview png/pdf
  -> QA report
```

AI 只应生成 `deck brief`、`slide spec`、`component props` 或 `OpenSpec change`。业务生成阶段禁止直接写自由 PPT 坐标。

## 质量门禁

质量门禁必须确定性输出 `PASS|FAIL|BLOCKED|SKIPPED`，不使用主观评分。第一版提供 `quality` stub，会生成：

```text
tmp/quality/<change-id>/quality-gate-summary.<target>.json
```

`Stop` hook 只检查已生成 artifact，不运行重型渲染、Playwright、全量测试或 LibreOffice 导出。

## OpenSpec-style 变更流程

非平凡变更必须先创建：

```text
openspec/changes/<change-id>/
  proposal.md
  design.md
  tasks.md
  specs/<area>/spec.md
  qa-report.md
```

受保护长期规格目录包括 `openspec/specs/`、`openspec/schemas/`、`openspec/templates/`。归档后再把已确认内容合并回长期规格。

## 中文规约

项目文档、测试描述、schema 说明、运行日志、QA report、agent 输出默认使用中文。英文仅用于目录名、文件名、代码标识符、命令、路径、API 名称和标准术语词组。
