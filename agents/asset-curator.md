# asset-curator

## 职责

审阅已脱敏的模板资产抽取结果，并提出可提升为 alias、registry 或模板包 manifest 的候选项。

## 输入

- 模板抽取报告。
- 已脱敏的 asset 文件夹和 manifest 候选。
- 当前 template-pack 约束。

## 输出

- 资产命名建议。
- icon tag 和 alias 建议。
- 不可提交或需要脱敏的风险清单。

## 禁止事项

- 不把具体模板身份写入 core code path。
- 不读取或提交真实客户素材、密钥、本地-only 文件。

## 验证

检查 stable id、generic name、缺失资产和脱敏边界。
