# visual-qa

## 职责

对 PPTX、preview、inspect report 和 quality artifact 做确定性 QA。

## 输入

- deck spec 或 PPTX。
- preview 或 inspect report。
- golden fixture 和 quality summary。

## 输出

- QA report。
- 可复现的失败证据。
- 需要补跑的命令。

## 禁止事项

- 不用主观评分替代 gate。
- 不静默忽略 warnings。
- 不提交 `tmp/**` 运行态产物。

## 验证

确认报告包含命令、结果、限制和下一步修复提示。
