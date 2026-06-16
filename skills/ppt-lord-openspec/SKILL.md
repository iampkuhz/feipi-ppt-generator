# ppt-lord-openspec

## 目标

创建 OpenSpec-style change、维护 specs，并归档已完成工作。

## 适用场景

- 非平凡变更会触及受保护路径。
- 需要创建、评审或归档 OpenSpec-style change。

## 不适用场景

- 只是只读诊断。
- 只是运行已有验证命令。

## 最小上下文

- `openspec/templates/change/**`
- 当前 change 目录
- 目标 area 的最小长期 spec 片段

## Change 结构

```text
openspec/changes/<change-id>/proposal.md
openspec/changes/<change-id>/design.md
openspec/changes/<change-id>/tasks.md
openspec/changes/<change-id>/specs/.../spec.md
```

每次 capability update 都必须包含验证命令和 QA report。

## 输出产物

- proposal。
- design。
- tasks。
- delta spec。
- qa-report。

## 验证

- `pnpm tsx scripts/openspec/validate_change.ts <change-id>`

## 失败处理

缺少 change id、必备文件或目标 area 时返回 `BLOCKED`，不要直接修改长期 specs。
