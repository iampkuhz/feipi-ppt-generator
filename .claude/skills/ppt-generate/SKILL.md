# PPT Generate Skill

适用场景：根据 deck spec 生成 PPTX。

输入要求：合法 `deck.yaml`，视觉值使用 Layer0 alias，组件已注册。

调用步骤：

```bash
pnpm lord validate examples/decks/basic.deck.yaml
pnpm lord generate examples/decks/basic.deck.yaml --out tmp/rendered/basic.pptx
```

禁止事项：业务生成阶段直接写 PPT shape 坐标或 raw 视觉值。

输出产物：PPTX、warnings、可选 QA report。

失败处理：校验失败先修 schema、registry 或 token。
