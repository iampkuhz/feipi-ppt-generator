# Hook 运行生命周期

SessionStart、SubagentStart、PreToolUse、PostToolUse、PostToolUseFailure、Stop、SubagentStop、ConfigChange 都由薄 shell 入口转发到 TypeScript 脚本。

Stop hook 不跑重型测试，只检查已经生成的 quality artifact 和本地-only 风险。
