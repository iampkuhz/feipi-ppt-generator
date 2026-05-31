# Template Extract Skill

适用场景：抽取模板包资产和 manifest。

输入要求：脱敏模板文件、目标 template id。

调用步骤：

```bash
pnpm lord inspect-template <template.pptx> --template-id <id> --out assets/templates/<id>/extracted
```

禁止事项：提交真实客户 PPT、密钥或未脱敏素材。

输出产物：manifest、抽取报告、icon registry 候选。

失败处理：记录失败原因并保留 TODO。
