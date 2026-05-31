# Delta Spec

## Requirements

### Requirement: bootstrap 必须可验证

第一版工程骨架必须提供 `doctor`、`quality`、`validate`、`generate` 和 `preview` 入口，并能输出中文日志或机器可读 artifact。

#### Scenario: 验收 bootstrap

- Given 已安装依赖的本地仓库
- When 执行第一版验收命令
- Then typecheck、test、doctor、validate、generate、preview 和 harness quality gate 都应通过
