# Proposal

## 为什么做

`tmp/session-browser-ai-framework-borrowing-analysis.md` 建议将仓库从“已有治理骨架”升级为“可持续建设 PPT 生成平台的工程系统”。当前仓库已经存在 `openspec/`、`harness/`、`scripts/`、`src/`、`.claude/` 和 `.codex/` 等目录，但缺少若干长期真源入口：agent registry、acceptance contract、GitHub 协作目录、架构边界说明和生成文件契约。

本变更先优化目录结构和结构校验，让后续 OpenSpec 生命周期、quality target、hook evidence、PPT QA 能按稳定目录继续演进。

## 范围

- 新增 `harness/agents/` 作为 agent registry 真源目录。
- 新增 `docs/acceptance/` 作为规格到测试和质量门的验收矩阵目录。
- 新增 GitHub 协作入口：`CODEOWNERS`、Dependabot 配置、branch protection 文档。
- 新增架构边界和生成文件契约文档。
- 更新 `harness/manifest.yaml`、结构校验脚本和相关测试预期。
- 记录本次变更的 QA 结果和未完成风险。

## 不做什么

- 不移动现有 `src/`、`scripts/`、`openspec/`、`harness/` 文件。
- 不一次性实现 active change sentinel、hook evidence、完整 quality gate runner。
- 不引入新的 npm 依赖或改动 lockfile。
- 不读取、提交或归档运行态产物、密钥、本地配置和真实客户素材。
