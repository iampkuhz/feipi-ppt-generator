# 模板抽取 Skill

适用场景：抽取模板包资产和 manifest。

不要用于：未脱敏模板、真实客户素材、普通组件开发。

最小上下文：输入模板路径、`src/template-pack/**`、目标 `assets/templates/<id>/manifest.yaml`。

输入要求：脱敏模板文件、目标 template id。

调用步骤：

```bash
pnpm lord inspect-template <template.pptx> --template-id <id> --out assets/templates/<id>/extracted
```

禁止事项：提交真实客户 PPT、密钥或未脱敏素材。

输出产物：manifest、抽取报告、icon registry 候选。

失败处理：记录失败原因并保留后续项。
