export const typographyAliases = {
  micro: { latexAlias: 'tiny', pt: 6, usage: 'Tiny labels, chart marks, icon registry text' },
  caption: { latexAlias: 'scriptsize', pt: 8, usage: 'Captions, legends, short labels' },
  note: { latexAlias: 'footnotesize', pt: 10, usage: 'KPI notes and helper text' },
  body: { latexAlias: 'normalsize', pt: 12, usage: 'Body copy and lists' },
  lead: { latexAlias: 'large', pt: 16, usage: 'Subtitles and emphasized short text' },
  title: { latexAlias: 'Large', pt: 20, usage: 'Slide and module titles' },
  headline: { latexAlias: 'huge', pt: 30, usage: 'Cover and section headlines' },
  display: { latexAlias: 'Huge', pt: 32, usage: 'Large conclusion statements' }
} as const;

export const colorAliases = {
  inkPrimary: { role: 'text', usage: 'Primary text and dark headings', value: '#111827' },
  inkSecondary: { role: 'text', usage: 'Secondary text and notes', value: '#4B5563' },
  surfacePrimary: { role: 'surface', usage: 'Default card fill', value: '#FFFFFF' },
  surfaceMuted: { role: 'surface', usage: 'Muted module background', value: '#F3F6FA' },
  accentPrimary: { role: 'accent', usage: 'Primary emphasis', value: '#4F46E5' },
  accentSecondary: { role: 'accent', usage: 'Secondary emphasis', value: '#06B6D4' },
  lineDefault: { role: 'line', usage: 'Default stroke and separators', value: '#D8E0EA' },
  lineAccent: { role: 'line', usage: 'Accent stroke and connectors', value: '#A5B4FC' }
} as const;

export const spacingAliases = {
  marginNone: { inch: 0, usage: 'Full-bleed backgrounds or edge-aligned assets' },
  marginHairline: { inch: 0.06, usage: 'Very small internal spacing' },
  marginTight: { inch: 0.18, usage: 'Dense icons, tables, legends' },
  marginCompact: { inch: 0.32, usage: 'Information-dense slides' },
  marginDefault: { inch: 0.55, usage: 'Default safe area' },
  marginRelaxed: { inch: 0.75, usage: 'Image, card, and section slides' },
  marginWide: { inch: 1.0, usage: 'Cover and large headline slides' },
  gapXS: { inch: 0.06, usage: 'Tiny spacing within a group' },
  gapSM: { inch: 0.1, usage: 'Label and small icon spacing' },
  gapMD: { inch: 0.16, usage: 'Default component spacing' },
  gapLG: { inch: 0.24, usage: 'Spacing between cards' },
  gapXL: { inch: 0.36, usage: 'Spacing between large modules' }
} as const;

export const radiusAliases = {
  none: { px: 0, usage: 'Charts, tables, hard-edge containers' },
  xs: { px: 4, usage: 'Tiny labels and separators' },
  sm: { px: 8, usage: 'Small badges, buttons, images' },
  md: { px: 14, usage: 'Default cards and containers' },
  lg: { px: 20, usage: 'Chart cards and large images' },
  xl: { px: 30, usage: 'Hero cards and large background blocks' },
  pill: { px: 999, usage: 'Badges and status labels' },
  circle: { px: '50%', usage: 'Avatars and circular icon containers' }
} as const;

export const strokeAliases = {
  none: { color: 'transparent', widthPt: 0, usage: 'No visible stroke' },
  thin: { color: 'lineDefault', widthPt: 0.75, usage: 'Default thin stroke' },
  accent: { color: 'lineAccent', widthPt: 1.25, usage: 'Emphasized stroke' }
} as const;

export const shadowAliases = {
  none: { usage: 'No shadow' },
  soft: { opacity: 0.16, blur: 8, distance: 2, usage: 'Subtle raised surface' }
} as const;

export const surfaceAliases = {
  surfacePlain: {
    fill: 'surfacePrimary',
    stroke: 'lineDefault',
    shadow: 'none',
    usage: 'Plain white card'
  },
  surfaceMuted: {
    fill: 'surfaceMuted',
    stroke: 'lineDefault',
    shadow: 'none',
    usage: 'Muted background module'
  },
  surfaceGlass: {
    fill: 'surfacePrimary',
    opacity: 0.88,
    stroke: 'surfacePrimary',
    shadow: 'soft',
    usage: 'Translucent light surface'
  },
  surfaceOutline: {
    fill: 'transparent',
    stroke: 'lineAccent',
    shadow: 'none',
    usage: 'Outline-only container'
  }
} as const;

export const dataColorAliases = {
  dataPrimary: { color: 'accentPrimary', usage: 'Primary data series' },
  dataSecondary: { color: 'accentSecondary', usage: 'Secondary data series' },
  dataMuted: { color: 'inkSecondary', usage: 'Muted comparison data' }
} as const;

export const progressRingStrokePresets = {
  default: { track: 'lineDefault', value: 'accentPrimary', width: 'thin' }
} as const;

export const axisGridlineAliases = {
  axisDefault: { color: 'lineDefault', width: 'thin' },
  gridlineDefault: { color: 'lineDefault', width: 'thin' }
} as const;

export const defaultFoundation = {
  id: 'default',
  typography: typographyAliases,
  colors: colorAliases,
  spacing: spacingAliases,
  radius: radiusAliases,
  strokes: strokeAliases,
  shadows: shadowAliases,
  surfaces: surfaceAliases,
  dataColors: dataColorAliases,
  progressRings: progressRingStrokePresets,
  axisGridlines: axisGridlineAliases
} as const;

export type DefaultFoundation = typeof defaultFoundation;
export type TypographyAlias = keyof typeof typographyAliases;
export type ColorAlias = keyof typeof colorAliases;
export type SpacingAlias = keyof typeof spacingAliases;
export type RadiusAlias = keyof typeof radiusAliases;
export type SurfaceAlias = keyof typeof surfaceAliases;
