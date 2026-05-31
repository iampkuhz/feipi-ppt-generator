# Delta Spec

## ADDED Requirements

### Requirement: 工程真源目录必须可机器校验

仓库必须为 agent registry、acceptance contract、架构边界、生成文件契约和 GitHub 协作入口提供稳定目录，并将这些入口纳入 harness 结构校验。

#### Scenario: 新增结构入口完整

- Given 仓库执行 harness 结构检查
- When `harness/agents/registry.yaml`、`docs/acceptance/ACCEPTANCE_CHECK_MATRIX.md`、`.github/CODEOWNERS` 和 `.github/dependabot.yml` 均存在
- Then 结构检查必须通过

#### Scenario: agent registry 缺失

- Given `harness/agents/registry.yaml` 不存在
- When 执行 harness 结构检查
- Then 检查必须返回缺少路径错误

### Requirement: GitHub 协作目录必须表达 ownership 和依赖更新策略

仓库必须在 `.github/` 下提供 CODEOWNERS 和 Dependabot 配置，并在文档中说明 branch protection 的推荐要求。

#### Scenario: 开启 GitHub 协作前检查目录

- Given 维护者准备配置 branch protection
- When 查看 `.github/CODEOWNERS` 和 `.github/dependabot.yml`
- Then 可以找到模块 ownership、npm 依赖更新和 GitHub Actions 更新策略
