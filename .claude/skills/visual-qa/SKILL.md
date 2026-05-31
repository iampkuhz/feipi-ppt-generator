# Visual QA Skill

适用场景：生成预览、检查 artifact、维护视觉 QA report。

输入要求：PPTX 路径、change id、目标 quality target。

调用步骤：

```bash
pnpm lord preview tmp/rendered/basic.pptx --out tmp/previews/basic
pnpm lord quality --target visual-harness --change-id <change-id>
```

禁止事项：用主观评分替代 gate，提交 `tmp/**` 产物。

输出产物：预览占位报告、quality summary、QA report。

失败处理：缺少外部依赖时输出中文 BLOCKED 和下一步命令。
