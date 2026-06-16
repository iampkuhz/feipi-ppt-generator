import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { promisify } from 'node:util';
import pptxgen from 'pptxgenjs';
import { stringify } from 'yaml';
import { defaultFoundation } from '../../src/foundation/default.foundation.js';
import { inspectPptx } from '../../src/harness/inspect-pptx.js';
import { PptxRenderer } from '../../src/renderer/PptxRenderer.js';
import { AtomComponentCatalogSchema } from '../../src/schema/atom-component.schema.js';
import { DeckSpecSchema, type DeckSpec } from '../../src/schema/deck.schema.js';

const execFileAsync = promisify(execFile);
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const FONT = 'Aptos';
const DISPLAY_FONT = 'Aptos Display';
const C = {
  bg: 'F6F8FB',
  panel: 'FFFFFF',
  ink: '162033',
  muted: '667085',
  faint: 'EEF2F6',
  border: 'D7E0EA',
  navy: '002060',
  blue: '3064F6',
  teal: '20C5C8',
  mint: 'DDF7EF',
  amber: 'F4B942',
  coral: 'FF6B5E',
  lilac: 'E9E4FF',
  white: 'FFFFFF'
} as const;

type PptxLike = any;
type SlideLike = any;

function optionValue(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function slideId(type: string): string {
  return `atom-${type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

const catalogPath = optionValue('--catalog', 'examples/components/atom-components.json');
const outDir = optionValue('--out', 'tmp/atom-samples');
const templatePath = optionValue('--template', '');
const shouldExportImages = process.argv.includes('--images');
const catalog = AtomComponentCatalogSchema.parse(JSON.parse(await readFile(catalogPath, 'utf8')));
type CatalogItem = (typeof catalog.components)[number];
type CatalogGroup = { type: string; items: CatalogItem[] };

function groupByComponent(items: CatalogItem[]): CatalogGroup[] {
  const groups = new Map<string, CatalogItem[]>();
  for (const item of items) {
    groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  }
  return [...groups.entries()].map(([type, groupItems]) => ({ type, items: groupItems }));
}

function hasDuplicateComponentTypes(items: CatalogItem[]): boolean {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.type)) return true;
    seen.add(item.type);
  }
  return false;
}

const groups = groupByComponent(catalog.components);
const shouldRenderGallery =
  process.argv.includes('--gallery') ||
  hasDuplicateComponentTypes(catalog.components) ||
  catalog.generatedDeckId.includes('variant');

function colorFromFoundation(alias: string, fallback = C.ink): string {
  const entry = defaultFoundation.colors[alias as keyof typeof defaultFoundation.colors];
  return entry?.hex?.replace('#', '').toUpperCase() ?? fallback;
}

function isDark(hex: string): boolean {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.48;
}

function addText(slide: SlideLike, text: string, options: Record<string, unknown>): void {
  slide.addText(text, {
    fontFace: FONT,
    color: C.ink,
    margin: 0.02,
    breakLine: false,
    fit: 'shrink',
    ...options
  });
}

function addRoundRect(
  pptx: PptxLike,
  slide: SlideLike,
  options: Record<string, unknown>,
  radius = 0.08
): void {
  slide.addShape(pptx.ShapeType.roundRect, {
    fill: { color: C.panel, transparency: 0 },
    line: { color: C.border, transparency: 0, width: 0.8 },
    rectRadius: radius,
    ...options
  });
}

function addPill(slide: SlideLike, text: string, x: number, y: number, w: number, color: string = C.teal): void {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.22,
    fontFace: FONT,
    fontSize: 8.5,
    bold: true,
    align: 'center',
    color,
    margin: 0.01,
    fit: 'shrink'
  });
}

function addGalleryBackground(pptx: PptxLike, slide: SlideLike, sectionColor: string = C.teal): void {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.16,
    h: SLIDE_H,
    fill: { color: sectionColor, transparency: 0 },
    line: { color: sectionColor, transparency: 100 }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.12,
    fill: { color: C.ink, transparency: 0 },
    line: { color: C.ink, transparency: 100 }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.16,
    y: 6.98,
    w: SLIDE_W - 0.16,
    h: 0.06,
    fill: { color: sectionColor, transparency: 0 },
    line: { color: sectionColor, transparency: 100 }
  });
}

function renderHeader(
  slide: SlideLike,
  title: string,
  subtitle: string,
  component: string,
  sectionColor: string = C.teal
): void {
  addText(slide, component.toUpperCase(), {
    x: 0.58,
    y: 0.33,
    w: 2.8,
    h: 0.18,
    fontSize: 8,
    bold: true,
    color: sectionColor
  });
  addText(slide, title, {
    x: 0.56,
    y: 0.54,
    w: 8.9,
    h: 0.46,
    fontFace: DISPLAY_FONT,
    fontSize: 25,
    bold: true,
    color: C.ink
  });
  addText(slide, subtitle, {
    x: 0.58,
    y: 1.06,
    w: 9.8,
    h: 0.28,
    fontSize: 10.5,
    bold: true,
    color: C.muted
  });
  addRoundRect(
    { ShapeType: { roundRect: 'roundRect' } },
    slide,
    {
      x: 10.72,
      y: 0.5,
      w: 1.95,
      h: 0.42,
      fill: { color: C.panel, transparency: 0 },
      line: { color: C.border, transparency: 0 }
    },
    0.2
  );
  addText(slide, '变体样张', {
    x: 10.92,
    y: 0.63,
    w: 1.55,
    h: 0.14,
    fontSize: 7.5,
    bold: true,
    color: sectionColor,
    align: 'center'
  });
  slide.addShape('rect', {
    x: 0.58,
    y: 1.42,
    w: 12.08,
    h: 0.01,
    fill: { color: C.border, transparency: 0 },
    line: { color: C.border, transparency: 100 }
  });
}

function renderTypographySlide(slide: SlideLike, pptx: PptxLike): void {
  addGalleryBackground(pptx, slide, C.blue);
  renderHeader(
    slide,
    '字体层级：TextPrimitive 字号体系',
    '展示每个字号 alias 的 pt、用途和真实排版预览；业务 spec 不直接写 pt。',
    'TextPrimitive',
    C.blue
  );
  const rows = Object.entries(defaultFoundation.typography);
  const startY = 1.66;
  const rowH = 0.58;
  rows.forEach(([alias, token], index) => {
    const y = startY + index * 0.68;
    const fill = index % 2 === 0 ? C.panel : 'F2F6FA';
    addRoundRect(pptx, slide, {
      x: 0.72,
      y,
      w: 11.85,
      h: rowH,
      fill: { color: fill, transparency: 0 }
    });
    addText(slide, token.latexAlias, {
      x: 0.98,
      y: y + 0.17,
      w: 1.42,
      h: 0.18,
      fontSize: 9,
      bold: true
    });
    addText(slide, `${token.pt}pt`, {
      x: 2.64,
      y: y + 0.17,
      w: 0.62,
      h: 0.18,
      fontSize: 9,
      bold: true,
      color: C.blue
    });
    addPill(slide, alias, 3.62, y + 0.18, 1.45, C.teal);
    addText(slide, token.usage, {
      x: 5.36,
      y: y + 0.16,
      w: 3.3,
      h: 0.22,
      fontSize: 8.2,
      color: C.muted
    });
    addText(slide, 'Ag 文', {
      x: 9.52,
      y: y + 0.08,
      w: 1.22,
      h: 0.36,
      fontFace: DISPLAY_FONT,
      fontSize: Math.min(Math.max(token.pt, 10), 24),
      bold: alias === 'pageTitle' || alias === 'heroTitle',
      color: C.ink,
      align: 'center'
    });
    addText(slide, alias === 'heroTitle' ? 'hero' : alias === 'pageTitle' ? 'title' : 'text', {
      x: 11.12,
      y: y + 0.18,
      w: 0.75,
      h: 0.16,
      fontSize: 7,
      bold: true,
      color: C.muted,
      align: 'center'
    });
  });
}

function radiusDisplayValue(value: { px: number | string }): string {
  return typeof value.px === 'number' ? `${value.px}px` : value.px;
}

function rectRadiusValue(alias: string): number {
  if (alias === 'smRadius') return 0.03;
  if (alias === 'mdRadius') return 0.09;
  if (alias === 'lgRadius') return 0.16;
  if (alias === 'pillRadius') return 0.45;
  return 0.1;
}

function radiusCardPosition(index: number): { x: number; y: number; w: number; h: number } {
  const top = [
    { x: 0.78, y: 1.72, w: 3.7, h: 1.85 },
    { x: 4.82, y: 1.72, w: 3.7, h: 1.85 },
    { x: 8.86, y: 1.72, w: 3.7, h: 1.85 }
  ];
  const bottom = [
    { x: 1.96, y: 4.16, w: 4.1, h: 1.95 },
    { x: 7.18, y: 4.16, w: 4.1, h: 1.95 }
  ];
  return [...top, ...bottom][index] ?? top[0];
}

function renderShapeSample(
  slide: SlideLike,
  pptx: PptxLike,
  alias: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string = C.teal
): void {
  const shapeType = alias === 'circleRadius' ? pptx.ShapeType.ellipse : pptx.ShapeType.roundRect;
  slide.addShape(shapeType, {
    x,
    y,
    w,
    h,
    fill: { color: C.panel, transparency: 0 },
    line: { color, width: 1.2 },
    rectRadius: rectRadiusValue(alias)
  });
}

function renderRadiusSlide(slide: SlideLike, pptx: PptxLike, componentName: string): void {
  addGalleryBackground(pptx, slide, C.teal);
  renderHeader(
    slide,
    `圆角语义：${componentName} radius alias`,
    '同一组件只暴露 radius alias；具体 PPTX 曲线由 renderer 或样例脚本统一映射。',
    componentName,
    C.teal
  );
  Object.entries(defaultFoundation.radius).forEach(([alias, token], index) => {
    const pos = radiusCardPosition(index);
    addRoundRect(pptx, slide, { ...pos, fill: { color: C.panel, transparency: 0 } });
    const isCircle = alias === 'circleRadius';
    if (isCircle) {
      renderShapeSample(slide, pptx, alias, pos.x + 1.5, pos.y + 0.22, 0.9, 0.9, C.teal);
      addText(slide, alias, {
        x: pos.x + 0.24,
        y: pos.y + 1.25,
        w: pos.w - 0.48,
        h: 0.2,
        fontSize: 10,
        bold: true,
        align: 'center'
      });
      addText(slide, `${radiusDisplayValue(token)} / ${token.usage}`, {
        x: pos.x + 0.24,
        y: pos.y + 1.52,
        w: pos.w - 0.48,
        h: 0.18,
        fontSize: 7.2,
        color: C.muted,
        align: 'center'
      });
      return;
    }
    renderShapeSample(
      slide,
      pptx,
      alias,
      pos.x + (isCircle ? 1.34 : 0.62),
      pos.y + 0.33,
      isCircle ? 1.08 : pos.w - 1.24,
      isCircle ? 1.08 : 0.72,
      C.teal
    );
    addText(slide, alias, {
      x: pos.x + 0.22,
      y: pos.y + pos.h - 0.7,
      w: pos.w - 0.44,
      h: 0.2,
      fontSize: 10,
      bold: true,
      align: 'center'
    });
    addText(slide, `${radiusDisplayValue(token)} / ${token.usage}`, {
      x: pos.x + 0.24,
      y: pos.y + pos.h - 0.42,
      w: pos.w - 0.48,
      h: 0.18,
      fontSize: 7.2,
      color: C.muted,
      align: 'center'
    });
  });
}

function renderPageTitleSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide, C.blue);
  renderHeader(
    slide,
    '标题原子：PageTitle 层级',
    '展示 subtitle、standard、hero 三种标题层级；只切换 size 和 color alias。',
    'PageTitle',
    C.blue
  );
  const samples = group.items.map((item) => item.component.props);
  samples.forEach((props, index) => {
    const size = String(props.size ?? 'pageTitle');
    const color = String(props.color ?? 'copyNavy');
    const token = defaultFoundation.typography[size as keyof typeof defaultFoundation.typography];
    const y = 1.72 + index * 1.56;
    const isHero = size === 'heroTitle';
    addRoundRect(pptx, slide, {
      x: 0.82,
      y,
      w: 11.7,
      h: 1.08,
      fill: { color: isHero ? 'EEF4FF' : C.panel, transparency: 0 },
      line: { color: isHero ? C.blue : C.border, transparency: 0 }
    });
    addText(slide, String(props.text ?? 'PageTitle'), {
      x: 1.16,
      y: y + 0.27,
      w: 6.8,
      h: 0.36,
      fontFace: DISPLAY_FONT,
      fontSize: Math.min(token?.pt ?? 20, 30),
      bold: true,
      color: colorFromFoundation(color)
    });
    addPill(slide, `${size} / ${token?.pt ?? '?'}pt`, 8.58, y + 0.34, 1.58, C.blue);
    addPill(slide, color, 10.34, y + 0.34, 1.42, C.teal);
  });
}

function renderBadgeSlide(slide: SlideLike, pptx: PptxLike): void {
  addGalleryBackground(pptx, slide, C.amber);
  renderHeader(
    slide,
    '徽章胶囊：BadgePill 色彩 token',
    '每个色彩 token 都展示为 pill 状态，保留 alias、hex 和用途说明。',
    'BadgePill',
    C.amber
  );
  Object.entries(defaultFoundation.colors).forEach(([alias, token], index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = 0.76 + col * 3.04;
    const y = 1.78 + row * 1.44;
    const hex = token.hex.replace('#', '').toUpperCase();
    addRoundRect(pptx, slide, { x, y, w: 2.62, h: 1.02 });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.28,
      y: y + 0.2,
      w: 2.06,
      h: 0.34,
      fill: { color: hex, transparency: alias === 'white' ? 0 : 12 },
      line: { color: hex === C.white ? C.border : hex, width: 0.8 },
      rectRadius: 0.35
    });
    addText(slide, alias, {
      x: x + 0.42,
      y: y + 0.305,
      w: 1.78,
      h: 0.12,
      fontSize: 7.1,
      bold: true,
      align: 'center',
      color: isDark(hex) ? C.white : C.ink
    });
    addText(slide, token.hex, {
      x: x + 0.28,
      y: y + 0.66,
      w: 0.92,
      h: 0.12,
      fontSize: 6.5,
      bold: true,
      color: C.muted
    });
    addText(slide, token.usage, {
      x: x + 1.16,
      y: y + 0.62,
      w: 1.14,
      h: 0.22,
      fontSize: 6.1,
      color: C.muted,
      align: 'right'
    });
  });
}

function iconLabels(group: CatalogGroup): string[] {
  const labels = group.items.map((item) => String(item.component.props.label ?? item.component.props.icon ?? 'icon.placeholder'));
  return [...labels, 'icon.data', 'icon.ai', 'icon.search', 'icon.metric', 'icon.flow', 'icon.alert'].slice(0, 6);
}

function renderIconTile(slide: SlideLike, pptx: PptxLike, x: number, y: number, label: string, mode: string): void {
  addRoundRect(pptx, slide, { x, y, w: 3.2, h: 1.28 });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.32,
    y: y + 0.28,
    w: 0.56,
    h: 0.56,
    fill: { color: C.mint, transparency: 0 },
    line: { color: C.teal, width: 1.0 }
  });
  addText(slide, 'i', {
    x: x + 0.32,
    y: y + 0.42,
    w: 0.56,
    h: 0.14,
    fontSize: 11,
    bold: true,
    align: 'center',
    color: C.ink
  });
  addText(slide, label, {
    x: x + 1.06,
    y: y + 0.32,
    w: 1.82,
    h: 0.18,
    fontSize: 9.2,
    bold: true
  });
  addText(slide, mode, {
    x: x + 1.06,
    y: y + 0.62,
    w: 1.82,
    h: 0.14,
    fontSize: 7,
    color: C.muted
  });
}

function renderIconSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide, C.teal);
  renderHeader(
    slide,
    '图标原语：IconPrimitive 状态',
    '展示 registry id、label 和稳定容器；后续真实图标接入 icon registry。',
    'IconPrimitive',
    C.teal
  );
  iconLabels(group).forEach((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    renderIconTile(slide, pptx, 0.84 + col * 4.08, 1.82 + row * 1.88, label, index < 3 ? 'catalog 变体' : 'registry 占位');
  });
}

function renderIconLabelSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide, C.coral);
  renderHeader(
    slide,
    '图标标签：IconLabel 排布',
    '同一 icon + label 支持 horizontal、vertical 和 emphasis 三种展示方式。',
    'IconLabel',
    C.coral
  );
  const samples = group.items.length > 0 ? group.items : [];
  const labels = samples.map((item) => String(item.component.props.label ?? 'IconLabel'));
  const variants = [
    { label: labels[0] ?? '横向样例', mode: 'horizontal', x: 0.94, y: 1.86, w: 5.1, h: 1.42 },
    { label: labels[1] ?? '纵向样例', mode: 'vertical', x: 7.08, y: 1.86, w: 4.1, h: 2.0 },
    { label: labels[2] ?? '强调样例', mode: 'emphasis', x: 2.7, y: 4.55, w: 7.65, h: 1.26 }
  ];
  variants.forEach((variant) => {
    addRoundRect(pptx, slide, {
      x: variant.x,
      y: variant.y,
      w: variant.w,
      h: variant.h,
      fill: { color: variant.mode === 'emphasis' ? 'FFF1EF' : C.panel, transparency: 0 },
      line: { color: variant.mode === 'emphasis' ? C.coral : C.border, width: 1 }
    });
    if (variant.mode === 'vertical') {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: variant.x + variant.w / 2 - 0.35,
        y: variant.y + 0.38,
        w: 0.7,
        h: 0.7,
        fill: { color: 'FFE3DE', transparency: 0 },
        line: { color: C.coral, width: 1 }
      });
      addText(slide, 'i', {
        x: variant.x + variant.w / 2 - 0.35,
        y: variant.y + 0.56,
        w: 0.7,
        h: 0.14,
        fontSize: 12,
        bold: true,
        align: 'center'
      });
      addText(slide, variant.label, {
        x: variant.x + 0.4,
        y: variant.y + 1.26,
        w: variant.w - 0.8,
        h: 0.2,
        fontSize: 10,
        bold: true,
        align: 'center'
      });
      addText(slide, `${variant.mode} 模式`, {
        x: variant.x + 0.4,
        y: variant.y + 1.55,
        w: variant.w - 0.8,
        h: 0.14,
        fontSize: 7.4,
        color: C.muted,
        align: 'center'
      });
    } else {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: variant.x + 0.36,
        y: variant.y + 0.34,
        w: 0.58,
        h: 0.58,
        fill: { color: 'FFE3DE', transparency: 0 },
        line: { color: C.coral, width: 1 }
      });
      addText(slide, 'i', {
        x: variant.x + 0.36,
        y: variant.y + 0.49,
        w: 0.58,
        h: 0.12,
        fontSize: 10,
        bold: true,
        align: 'center'
      });
      addText(slide, variant.label, {
        x: variant.x + 1.14,
        y: variant.y + 0.44,
        w: variant.w - 1.6,
        h: 0.2,
        fontSize: variant.mode === 'emphasis' ? 13 : 10.5,
        bold: true
      });
      addText(slide, `${variant.mode} 模式`, {
        x: variant.x + 1.14,
        y: variant.y + 0.76,
        w: variant.w - 1.6,
        h: 0.14,
        fontSize: 7.4,
        color: C.muted
      });
    }
  });
}

function renderMetricSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide, C.blue);
  renderHeader(
    slide,
    '指标模块：MetricBlock 变体',
    '每个卡片只承载一个 value、一个 label 和一条状态条，避免混入图表职责。',
    'MetricBlock',
    C.blue
  );
  group.items.forEach((item, index) => {
    const x = 0.9 + index * 4.1;
    const y = 2.02;
    const props = item.component.props;
    addRoundRect(pptx, slide, { x, y, w: 3.35, h: 2.24 });
    addText(slide, String(props.value ?? '42%'), {
      x: x + 0.34,
      y: y + 0.42,
      w: 2.5,
      h: 0.5,
      fontFace: DISPLAY_FONT,
      fontSize: 29,
      bold: true,
      color: index === 1 ? C.coral : index === 2 ? C.teal : C.blue
    });
    addText(slide, String(props.label ?? '指标名称'), {
      x: x + 0.36,
      y: y + 1.1,
      w: 2.56,
      h: 0.2,
      fontSize: 9.6,
      bold: true,
      color: C.muted
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.36,
      y: y + 1.68,
      w: 2.42,
      h: 0.13,
      fill: { color: C.faint, transparency: 0 },
      line: { color: C.faint, transparency: 100 },
      rectRadius: 0.08
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.36,
      y: y + 1.68,
      w: 1.25 + index * 0.42,
      h: 0.13,
      fill: { color: index === 1 ? C.coral : index === 2 ? C.teal : C.blue, transparency: 0 },
      line: { color: C.white, transparency: 100 },
      rectRadius: 0.08
    });
  });
}

function renderBulletSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide, C.teal);
  renderHeader(
    slide,
    '项目列表：BulletList 密度',
    '短列表按密度展示；长段落和多层嵌套应提升到更高层 pattern。',
    'BulletList',
    C.teal
  );
  group.items.forEach((item, index) => {
    const x = 0.9 + index * 4.1;
    const y = 1.86;
    const items = Array.isArray(item.component.props.items) ? item.component.props.items : [];
    addRoundRect(pptx, slide, { x, y, w: 3.35, h: 3.75 });
    addPill(slide, `变体 ${index + 1}`, x + 0.3, y + 0.35, 0.86, C.teal);
    items.forEach((text, itemIndex) => {
      const lineY = y + 0.94 + itemIndex * 0.52;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.38,
        y: lineY + 0.055,
        w: 0.1,
        h: 0.1,
        fill: { color: C.teal, transparency: 0 },
        line: { color: C.teal, transparency: 100 }
      });
      addText(slide, String(text), {
        x: x + 0.62,
        y: lineY,
        w: 2.28,
        h: 0.2,
        fontSize: 9.4,
        color: C.ink
      });
    });
  });
}

function renderSurfaceCardSlide(slide: SlideLike, pptx: PptxLike): void {
  addGalleryBackground(pptx, slide, C.coral);
  renderHeader(
    slide,
    '卡片容器：SurfaceCard 圆角',
    '用同一内容验证不同 radius 语义，确保容器层级、标题和正文不重叠。',
    'SurfaceCard',
    C.coral
  );
  Object.entries(defaultFoundation.radius).forEach(([alias, token], index) => {
    const pos = radiusCardPosition(index);
    const isCircle = alias === 'circleRadius';
    if (isCircle) {
      renderShapeSample(slide, pptx, alias, pos.x + 1.3, pos.y + 0.18, 1.18, 1.18, C.coral);
      addText(slide, alias, {
        x: pos.x + 0.9,
        y: pos.y + 1.48,
        w: 1.98,
        h: 0.2,
        fontSize: 9,
        bold: true,
        align: 'center'
      });
      return;
    }
    addRoundRect(pptx, slide, {
      ...pos,
      fill: { color: index % 2 === 0 ? C.panel : 'FFF8F6', transparency: 0 },
      line: { color: C.coral, transparency: 12, width: 1.0 }
    }, rectRadiusValue(alias));
    addText(slide, alias, {
      x: pos.x + 0.3,
      y: pos.y + 0.32,
      w: pos.w - 0.6,
      h: 0.2,
      fontSize: 10.2,
      bold: true
    });
    addText(slide, `${radiusDisplayValue(token)} · ${token.usage}`, {
      x: pos.x + 0.3,
      y: pos.y + 0.66,
      w: pos.w - 0.6,
      h: 0.2,
      fontSize: 7.2,
      color: C.muted
    });
    addText(slide, '正文短句，验证标题、说明和容器边距。', {
      x: pos.x + 0.3,
      y: pos.y + 1.14,
      w: pos.w - 0.6,
      h: 0.2,
      fontSize: 7.8,
      color: C.ink
    });
  });
}

function renderGenericComponentSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide, C.amber);
  renderHeader(slide, `${group.type} 变体`, '当前组件按 catalog 中声明的 props 逐项展示。', group.type, C.amber);
  group.items.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 0.9 + col * 4.1;
    const y = 1.82 + row * 1.56;
    addRoundRect(pptx, slide, { x, y, w: 3.35, h: 1.28 });
    addText(slide, item.type, {
      x: x + 0.28,
      y: y + 0.26,
      w: 2.7,
      h: 0.2,
      fontSize: 10,
      bold: true
    });
    addText(slide, JSON.stringify(item.component.props), {
      x: x + 0.28,
      y: y + 0.62,
      w: 2.7,
      h: 0.28,
      fontSize: 6.8,
      color: C.muted
    });
  });
}

function renderComponentSlide(slide: SlideLike, pptx: PptxLike, group: CatalogGroup): void {
  if (group.type === 'TextPrimitive') {
    renderTypographySlide(slide, pptx);
    return;
  }
  if (group.type === 'ShapePrimitive') {
    renderRadiusSlide(slide, pptx, group.type);
    return;
  }
  if (group.type === 'PageTitle') {
    renderPageTitleSlide(slide, pptx, group);
    return;
  }
  if (group.type === 'BadgePill') {
    renderBadgeSlide(slide, pptx);
    return;
  }
  if (group.type === 'IconPrimitive') {
    renderIconSlide(slide, pptx, group);
    return;
  }
  if (group.type === 'IconLabel') {
    renderIconLabelSlide(slide, pptx, group);
    return;
  }
  if (group.type === 'MetricBlock') {
    renderMetricSlide(slide, pptx, group);
    return;
  }
  if (group.type === 'BulletList') {
    renderBulletSlide(slide, pptx, group);
    return;
  }
  if (group.type === 'SurfaceCard') {
    renderSurfaceCardSlide(slide, pptx);
    return;
  }
  renderGenericComponentSlide(slide, pptx, group);
}

async function renderGalleryPptx(groupsToRender: CatalogGroup[], out: string): Promise<void> {
  const PptxGen = pptxgen as unknown as new () => PptxLike;
  const pptx = new PptxGen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'ppt-lord';
  pptx.subject = '组件多形态样例';
  pptx.title = catalog.generatedDeckId;
  pptx.company = 'feipi';
  pptx.lang = 'zh-CN';

  for (const group of groupsToRender) {
    const slide = pptx.addSlide();
    renderComponentSlide(slide, pptx, group);
  }

  await mkdir(dirname(out), { recursive: true });
  await pptx.writeFile({ fileName: out });
}

function galleryVariantCount(group: CatalogGroup): number {
  if (group.type === 'TextPrimitive') return Object.keys(defaultFoundation.typography).length;
  if (group.type === 'ShapePrimitive' || group.type === 'SurfaceCard') {
    return Object.keys(defaultFoundation.radius).length;
  }
  if (group.type === 'BadgePill') return Object.keys(defaultFoundation.colors).length;
  if (group.type === 'IconPrimitive') return Math.max(group.items.length, 6);
  if (group.type === 'IconLabel') return Math.max(group.items.length, 3);
  return group.items.length;
}

const deck: DeckSpec = DeckSpecSchema.parse({
  id: catalog.generatedDeckId,
  title: '原子组件样例',
  templateId: 'default',
  foundation: 'default',
  size: 'wide-16-9',
  slides: shouldRenderGallery
    ? groups.map((group) => ({
        id: slideId(group.type),
        type: 'AtomSampleSlide',
        title: `${group.type} variants`,
        components: group.items.map((item) => item.component)
      }))
    : catalog.components.map((item) => ({
        id: slideId(item.type),
        type: 'AtomSampleSlide',
        title: item.type,
        components: [item.component]
      }))
});

await mkdir(outDir, { recursive: true });
const deckPath = join(outDir, `${catalog.generatedDeckId}.deck.yaml`);
const pptxPath = join(outDir, `${catalog.generatedDeckId}.pptx`);
const manifestPath = join(outDir, `${catalog.generatedDeckId}.fixtures.json`);
const inspectPath = join(outDir, `${catalog.generatedDeckId}.inspect.json`);
const stylePath = join(outDir, `${catalog.generatedDeckId}.template-style-candidates.json`);

await writeFile(deckPath, stringify(deck));
await writeFile(
  manifestPath,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      catalogPath,
      deckPath,
      pptxPath,
      renderMode: shouldRenderGallery ? 'component-gallery' : 'renderer-structure',
      components: shouldRenderGallery
        ? groups.map((group) => ({
            type: group.type,
            variantCount: galleryVariantCount(group),
            catalogVariantCount: group.items.length,
            variants: group.items.map((item) => ({
              maturity: item.maturity,
              fixture: item.fixture,
              expectedTexts: item.expectedTexts,
              props: item.component.props
            }))
          }))
        : catalog.components.map((item) => ({
            type: item.type,
            maturity: item.maturity,
            fixture: item.fixture,
            expectedTexts: item.expectedTexts,
            props: item.component.props
          }))
    },
    null,
    2
  )}\n`
);

const warnings = [];
if (shouldRenderGallery) {
  await renderGalleryPptx(groups, pptxPath);
} else {
  const result = await new PptxRenderer().renderDeck(deck, { out: pptxPath });
  warnings.push(...result.warnings);
}
const inspection = await inspectPptx(pptxPath);
await writeFile(inspectPath, `${JSON.stringify({ ...inspection, warnings }, null, 2)}\n`);

if (templatePath) {
  const templateInspection = await inspectPptx(templatePath);
  await writeFile(
    stylePath,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        templatePath,
        slideCount: templateInspection.slideCount,
        shapeCount: templateInspection.shapeCount,
        colors: templateInspection.colors.slice(0, 48),
        fonts: templateInspection.fonts.slice(0, 32),
        textSamples: templateInspection.texts.slice(0, 40)
      },
      null,
      2
    )}\n`
  );
}

if (shouldExportImages) {
  const pdfDir = join(outDir, 'pdf');
  const imageDir = join(outDir, 'images');
  await rm(pdfDir, { recursive: true, force: true });
  await rm(imageDir, { recursive: true, force: true });
  await mkdir(pdfDir, { recursive: true });
  await mkdir(imageDir, { recursive: true });
  await execFileAsync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', pdfDir, pptxPath], {
    timeout: 120_000,
    maxBuffer: 1024 * 1024 * 4
  });
  const pdfPath = join(pdfDir, `${basename(pptxPath, '.pptx')}.pdf`);
  await execFileAsync('convert', ['-density', '160', pdfPath, join(imageDir, 'slide-%03d.png')], {
    timeout: 120_000,
    maxBuffer: 1024 * 1024 * 4
  });
  const imageFiles = (await readdir(imageDir)).filter((file) => file.endsWith('.png')).sort();
  await writeFile(
    join(outDir, `${catalog.generatedDeckId}.image-manifest.json`),
    `${JSON.stringify(
      {
        schemaVersion: 1,
        pptxPath,
        pdfPath,
        imageDir,
        renderMode: shouldRenderGallery ? 'component-gallery' : 'renderer-structure',
        slides: shouldRenderGallery
          ? groups.map((group, index) => ({
              index,
              type: group.type,
              slideId: slideId(group.type),
              variantCount: galleryVariantCount(group),
              catalogVariantCount: group.items.length,
              props: group.items.map((item) => item.component.props),
              image: join(imageDir, imageFiles[index] ?? '')
            }))
          : catalog.components.map((item, index) => ({
              index,
              type: item.type,
              slideId: slideId(`${item.type}-${index + 1}`),
              props: item.component.props,
              image: join(imageDir, imageFiles[index] ?? '')
            }))
      },
      null,
      2
    )}\n`
  );
}

console.log(`PASS atom samples 已生成 ${pptxPath}`);
