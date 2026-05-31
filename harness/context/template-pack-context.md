# Template Pack 上下文

适用场景：导入模板包、抽取资产、维护 manifest 和 icon registry。

必须读取的文件：`src/template-pack/**`、`assets/templates/<id>/manifest.yaml`、`docs/template-pack.md`。

禁止读取的文件：真实客户 PPT、私有素材、密钥和本地-only 文件。

允许修改的路径：`assets/templates/**`、`src/template-pack/**`、`scripts/template/**`、对应 OpenSpec change。

需要运行的最小验证：`pnpm lord doctor`、`pnpm lord quality --target template-pack --change-id <change-id>`。

失败处理：未脱敏素材不得提交，抽取失败时写入报告和 TODO。
