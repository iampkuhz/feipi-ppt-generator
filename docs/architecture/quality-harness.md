# Quality Harness

quality harness 负责 schema validation、token lint、PPTX inspection、preview structure report、visual regression 和 text overflow checks 的规则归口。

当前已实现确定性结构检查和 quality summary。图像级 visual diff 与文本溢出检查需要后续选择稳定渲染环境后再接入；在此之前，相关 gate 必须输出 `SKIPPED`、`BLOCKED` 或明确限制，不能伪装成完整通过。
