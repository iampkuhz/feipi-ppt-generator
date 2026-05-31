# Claude 入口

本仓库是通用 PPT 创建工具骨架，目标是通过结构化 spec、模板包、组件系统、布局引擎和 renderer 稳定生成 PowerPoint。

默认遵守中文规约：文档、注释、测试描述、运行日志和 agent 输出使用中文；代码标识符、路径、命令和标准术语词组可以保留英文。

启动时不要预读大文件或整仓说明。只有遇到非平凡变更时，才读取 `AGENTS.md` 和对应 `harness/context/` 上下文包。

不要读取、输出或提交密钥、本地配置和运行态数据，例如 `.env`、`.mcp.json`、`.claude/settings.local.json`、`.codex/local.json`、`tmp/agent_logs/**`、`tmp/quality/**`。

不要回滚用户未提交改动。若改动影响当前任务，先理解并兼容；无法安全处理时再说明阻塞点。

main agent 行为由 `.claude/agents/main-default.md` 管理。
