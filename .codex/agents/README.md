# Codex Agents

本目录存放 Codex agent 的最小运行入口。核心职责、委派契约和验证责任以 `harness/agents/registry.yaml` 为真源，通用研发规约以 `AGENTS.md` 为准。

维护规则：

- agent 文件只保留最小触发说明和执行边界，不复制完整仓库文档。
- 搜索文件名时使用受限 `find`，搜索内容时使用 `rg`，不可用时再回退到系统 `grep`。
- 文档、注释、错误提示和测试描述默认中文；路径、命令、API、类型名和标准术语可保留英文。
