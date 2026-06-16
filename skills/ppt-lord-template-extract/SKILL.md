# ppt-lord-template-extract

## 目标

接收脱敏 template PPTX，运行 `inspect-template`，产出 template pack 候选 artifact。

## 适用场景

- 用户提供脱敏模板 PPTX，需要生成模板包候选 artifact。

## 不适用场景

- 模板未脱敏、包含客户素材或只是要调整通用组件。

## 最小上下文

- 输入模板路径
- `src/template-pack/**`
- `assets/templates/<id>/manifest.yaml`

## 执行流程

```bash
tsx src/cli/index.ts inspect-template <template-pptx> --template-id <id> --out assets/templates/<id>/extracted
```

提升 alias 或 component 前，必须先审阅抽取结果。

## 输出产物

- extraction report。
- manifest candidate。
- asset/icon candidate lists。

## 验证

- `pnpm lord inspect-template <template.pptx> --template-id <id> --out assets/templates/<id>/extracted`

## 失败处理

模板未脱敏或抽取失败时返回 `BLOCKED`，不要提交真实客户 PPT 或私有素材。
