# Agent 委派规则

调用 subagent 时传递最小 handoff payload：Goal、Change id、Task id、Task source、Allowed files、Forbidden files、Required context files、Expected output、Validation command 和 Failure policy。

subagent 只处理授权范围内的任务，不扩展读取全仓上下文。
