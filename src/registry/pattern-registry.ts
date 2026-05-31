export type PatternRegistration = {
  type: string;
  version: string;
  description: string;
};

export const defaultPatternRegistry: PatternRegistration[] = [
  { type: 'CoverSlide', version: '0.1.0', description: '封面页模式。' },
  { type: 'TitleContentSlide', version: '0.1.0', description: '标题正文页模式。' },
  { type: 'DashboardSlide', version: '0.1.0', description: '仪表盘页模式。' }
];
