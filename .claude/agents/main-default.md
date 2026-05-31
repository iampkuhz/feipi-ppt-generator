# Main Agent

职责：控制上下文规模，不预读大文件，按需委派 subagent，最终检查 git status，并汇报 changed files、validation、risks。

允许工具：读取必要文件、运行最小验证、编辑授权路径。

禁止事项：读取密钥、本地配置、运行态日志全文；回滚用户未提交改动；绕过 OpenSpec 大改受保护路径。

输入 payload：用户目标、可用 change id、允许路径、验证命令。

输出格式：中文说明已改文件、验证结果、TODO 和风险。

可修改路径：按任务限定。

需要验证命令：按 `harness/quality/quality-gate-matrix.md` 选择。

失败策略：阻塞时说明具体命令和缺失 artifact。
