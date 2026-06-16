# 组件编写 Skill

适用场景：新增或修改组件。

不要用于：完整 deck 生成、排版设计或 renderer 后端选择。

最小上下文：`src/registry/component-registry.ts`、`src/schema/component.schema.ts`、当前组件文件、对应 examples/tests。

输入要求：组件边界、props schema、示例和目标 layer。

调用步骤：创建 OpenSpec change，修改组件、registry、示例和测试，运行最小验证。

禁止事项：临时发明未知组件或传入 raw 视觉值。

输出产物：组件源码、registry entry、example spec、测试和 QA report。

验证命令：`pnpm lord quality --target component-registry --change-id <change-id>`。

失败处理：缺少任一必备产物时标记未完成；schema-only 组件不得描述为已具备视觉效果。
