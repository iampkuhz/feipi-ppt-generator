/**
 * Moment2026 Typography Foundation
 *
 * 7 个标准字号 alias，禁止 30pt。
 * 后续生成 PPT 时只能使用 typeSize alias，不得直接写裸 pt 值。
 */

export const typeScale = {
  microLabel:   { latexAlias: 'tiny',       pt: 6,  usage: '极小标签、图表细标注' },
  captionLabel: { latexAlias: 'scriptsize',  pt: 8,  usage: 'icon caption、badge、图例、短标签' },
  supportText:  { latexAlias: 'footnotesize',pt: 10, usage: 'KPI 说明、小卡片正文、二级说明' },
  bodyText:     { latexAlias: 'small',       pt: 12, usage: '正文、bullet、段落说明' },
  subtitleText: { latexAlias: 'normalsize',  pt: 16, usage: 'subtitle、指标值、小节标题' },
  pageTitle:    { latexAlias: 'large',       pt: 20, usage: '常规页面标题、模块标题' },
  heroTitle:    { latexAlias: 'Large',       pt: 32, usage: '章节页标题、结束页、hero 文字' }
} as const;

export const fontFamily = {
  primary: 'Poppins' as const,
  fallback: 'Arial' as const
} as const;

export type TypographyAlias = keyof typeof typeScale;
export type TypeScaleEntry = typeof typeScale[keyof typeof typeScale];
