# Typography Standard and Prompt for Moment2026

> Repo target: `docs/prompts/typography-prompt.md`  
> Status: proposed standard. Use this prompt in skills, subagents, and code generation instructions.

## 1. 字号标准

Moment2026 生成器只允许使用下表中的 `typeSize` alias。这里参考 LaTeX 的字号层级，但别名优先贴近 PPT 生成时的预期用途。

| typeSize alias | LaTeX-inspired scale | pt | 典型用途 | 备注 |
|---|---:|---:|---|---|
| `microLabel` | `tiny` | 6 | 极小图表标签、点位标签、微注释 | 只用于非常短的文本 |
| `captionLabel` | `scriptsize` | 8 | icon caption、badge、图例、短标签 | 不用于正文段落 |
| `supportText` | `footnotesize` | 10 | KPI 说明、小卡片正文、二级说明 | 信息密集页默认辅助字号 |
| `bodyText` | `small` | 12 | 正文、bullet、段落说明、普通 label | 默认正文字号 |
| `subtitleText` | `normalsize` | 16 | subtitle、指标值、小节标题 | 不宜承载长段落 |
| `pageTitle` | `large` | 20 | 常规页面标题、模块标题 | 普通内容页默认标题 |
| `heroTitle` | `huge` | 32 | 章节页标题、结束页、极少数 hero 文字 | 替代历史 30pt headline |

不保留 `30pt`。如果输入材料或原模板提到 `Main headline 30pt`，统一迁移：

- 章节页、结束页、只有一句话的大标题：用 `heroTitle = 32pt`。
- 普通内容页标题：用 `pageTitle = 20pt`。
- 不要新增 `mainHeadline30`、`headline30` 或任何 30pt alias。

## 2. 字体族规则

默认字体族建议：

```ts
fontFamily.primary = "Poppins"
fontFamily.fallback = "Arial"
```

生成器不应该按组件自由切换字体。只有两种情况可以走 fallback：

1. 运行环境没有 Poppins。
2. 文本包含 Poppins 显示不稳定的字符，尤其是中文、特殊符号或 emoji。

中文内容可以使用 renderer 的 fallback 机制处理，但组件输入仍然只指定同一套 `typeSize` alias，不创建中文专用字号。

## 3. 推荐提示词

下面这段可以直接放进 skill、subagent 或 repository prompt 中：

```text
你在生成 Moment2026 风格 PPT。所有文字必须使用仓库定义的 typeSize alias，禁止输出裸 pt 数值。

允许的 typeSize 只有：
- microLabel = 6pt，用于极小图表标签、点位标签、微注释；
- captionLabel = 8pt，用于 icon caption、badge、图例、短标签；
- supportText = 10pt，用于 KPI 说明、小卡片正文、二级说明；
- bodyText = 12pt，用于正文、bullet、段落说明、普通 label；
- subtitleText = 16pt，用于 subtitle、指标值、小节标题；
- pageTitle = 20pt，用于常规页面标题、模块标题；
- heroTitle = 32pt，用于章节页标题、结束页、极少数 hero 文字。

禁止使用 30pt、14pt、18pt、24pt 或任何未注册字号。历史模板里的 “Main headline 30pt” 不作为标准能力保留：章节/结束页改用 heroTitle=32pt，普通内容页改用 pageTitle=20pt。

普通页面标题默认 pageTitle；正文默认 bodyText；卡片辅助说明默认 supportText；icon caption 和 badge 默认 captionLabel；KPI 数值默认 subtitleText；章节页和 Thank you 默认 heroTitle。

字体族默认 Poppins，fallback Arial。不要为某个组件临时指定新的字体族。
```

## 4. Lint 规则建议

后续 validator 可以先做这几条：

```ts
forbidRawFontSize: true
allowedTypeSizes: [
  "microLabel",
  "captionLabel",
  "supportText",
  "bodyText",
  "subtitleText",
  "pageTitle",
  "heroTitle"
]
forbidTypeSizesPt: [30, 14, 18, 24]
forbidAliases: ["mainHeadline30", "headline30", "Large30", "huge30"]
```
