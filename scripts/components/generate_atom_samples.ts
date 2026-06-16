import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { promisify } from 'node:util';
import pptxgen from 'pptxgenjs';
import { stringify } from 'yaml';
import { defaultFoundation } from '../../src/foundation/default.foundation.js';
import { AtomComponentCatalogSchema } from '../../src/schema/atom-component.schema.js';
import { DeckSpecSchema, type DeckSpec } from '../../src/schema/deck.schema.js';
import { PptxRenderer } from '../../src/renderer/PptxRenderer.js';
import { inspectPptx } from '../../src/harness/inspect-pptx.js';

const execFileAsync = promisify(execFile);
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const FONT = 'Poppins';
const C = {
  copyNavy: '002060',
  titleIndigo: '4E4EA1',
  neutralSlate: '7F8AA8',
  cyanAccent: '32DEFF',
  brandViolet: '8343FF',
  brandBlue: '3B48F6',
  lavender: '9984FF',
  strokeLavender: 'A493F4',
  softBlue: 'EEF8FF',
  white: 'FFFFFF'
} as const;

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
const shouldRenderGallery = process.argv.includes('--gallery') || hasDuplicateComponentTypes(catalog.components);

function addText(slide: any, text: string, options: Record<string, unknown>): void {
  slide.addText(text, {
    fontFace: FONT,
    color: C.copyNavy,
    margin: 0.02,
    breakLine: false,
    fit: 'shrink',
    ...options
  });
}

function addNoLineShape(pptx: any, slide: any, shapeType: string, options: Record<string, unknown>): void {
  slide.addShape(shapeType, {
    line: { color: C.white, transparency: 100 },
    ...options
  });
}

function addGalleryBackground(pptx: any, slide: any): void {
  slide.background = { color: C.white };
  addNoLineShape(pptx, slide, pptx.ShapeType.rect, {
    x: 0,
    y: 5.0,
    w: SLIDE_W,
    h: SLIDE_H - 5.0,
    fill: { color: 'F2FAFF', transparency: 0 }
  });
  addNoLineShape(pptx, slide, pptx.ShapeType.ellipse, {
    x: -1.7,
    y: 4.2,
    w: 7.6,
    h: 3.2,
    fill: { color: C.cyanAccent, transparency: 55 }
  });
  addNoLineShape(pptx, slide, pptx.ShapeType.ellipse, {
    x: 4.9,
    y: 4.15,
    w: 8.8,
    h: 3.35,
    fill: { color: C.lavender, transparency: 62 }
  });
  addNoLineShape(pptx, slide, pptx.ShapeType.ellipse, {
    x: 2.2,
    y: 5.2,
    w: 5.2,
    h: 2.25,
    fill: { color: C.brandBlue, transparency: 78 }
  });
}

function renderHeader(slide: any, title: string, subtitle: string): void {
  addText(slide, title, {
    x: 0.48,
    y: 0.28,
    w: 12.25,
    h: 0.62,
    fontSize: 30,
    bold: true,
    color: C.titleIndigo
  });
  addText(slide, subtitle, {
    x: 0.52,
    y: 1.02,
    w: 12.0,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: C.copyNavy
  });
}

function renderTypographySlide(slide: any, pptx: any): void {
  renderHeader(
    slide,
    '字号别名：TextPrimitive canonical names',
    '字号入口直接使用 canonical alias；usageAlias 只作为说明，业务代码不再随手写 pt。'
  );
  const rows = Object.entries(defaultFoundation.typography);
  const startY = 1.58;
  const rowH = 0.57;
  const gap = 0.13;
  rows.forEach(([alias, token], index) => {
    const y = startY + index * (rowH + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.78,
      y,
      w: 11.35,
      h: rowH,
      fill: { color: index % 2 === 0 ? C.white : C.softBlue, transparency: 2 },
      line: { color: 'D4EDFF', transparency: 5 }
    });
    addText(slide, token.latexAlias, {
      x: 1.02,
      y: y + 0.16,
      w: 1.55,
      h: 0.22,
      fontSize: 11,
      bold: true,
      color: C.copyNavy
    });
    addText(slide, `${token.pt}pt`, {
      x: 3.28,
      y: y + 0.17,
      w: 0.7,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: C.titleIndigo
    });
    addText(slide, alias, {
      x: 4.72,
      y: y + 0.17,
      w: 1.8,
      h: 0.2,
      fontSize: 10,
      color: C.cyanAccent,
      bold: true
    });
    addText(slide, token.usage, {
      x: 7.05,
      y: y + 0.17,
      w: 2.95,
      h: 0.2,
      fontSize: 9,
      color: C.neutralSlate,
      bold: true
    });
    addText(slide, 'Aa 文', {
      x: 10.72,
      y: y + 0.08,
      w: 0.82,
      h: 0.38,
      fontSize: Math.min(Math.max(token.pt, 10), 25),
      bold: alias === 'pageTitle' || alias === 'heroTitle',
      color: C.titleIndigo
    });
  });
}

function radiusDisplayValue(value: { px: number | string }): string {
  return typeof value.px === 'number' ? `${value.px}px` : value.px;
}

function rectRadiusValue(alias: string): number {
  if (alias === 'smRadius') return 0.02;
  if (alias === 'mdRadius') return 0.08;
  if (alias === 'lgRadius') return 0.16;
  if (alias === 'pillRadius') return 0.45;
  return 0.08;
}

function renderRadiusSlide(slide: any, pptx: any, componentName: string): void {
  renderHeader(
    slide,
    `圆角别名：${componentName}`,
    '用户只选 radius alias；renderer 负责映射到具体 PPTX 曲线，不开放任意弧度。'
  );
  const radii = Object.entries(defaultFoundation.radius);
  radii.forEach(([alias, token], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const baseX = 1.0 + col * 4.1;
    const baseY = 1.63 + row * 2.22;
    const shapeType =
      alias === 'circleRadius'
        ? pptx.ShapeType.ellipse
        : pptx.ShapeType.roundRect;
    const isCircle = alias === 'circleRadius';
    const isPill = alias === 'pillRadius';
    slide.addShape(shapeType, {
      x: baseX + (isCircle ? 0.78 : 0.1),
      y: baseY,
      w: isCircle ? 1.36 : 2.8,
      h: isPill ? 0.96 : isCircle ? 1.36 : 1.08,
      fill: { color: C.white, transparency: 1 },
      line: { color: C.cyanAccent, width: 1.4 },
      rectRadius: rectRadiusValue(alias)
    });
    addText(slide, alias, {
      x: baseX,
      y: baseY + 1.34,
      w: 3.0,
      h: 0.22,
      fontSize: 10,
      bold: true,
      align: 'center',
      color: C.copyNavy
    });
    addText(slide, radiusDisplayValue(token), {
      x: baseX,
      y: baseY + 1.62,
      w: 3.0,
      h: 0.18,
      fontSize: 8,
      align: 'center',
      color: C.neutralSlate
    });
    addText(slide, token.usage, {
      x: baseX - 0.1,
      y: baseY + 1.88,
      w: 3.2,
      h: 0.24,
      fontSize: 7,
      align: 'center',
      color: C.neutralSlate
    });
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.22,
    y: 6.35,
    w: 10.9,
    h: 0.72,
    fill: { color: C.white, transparency: 8 },
    line: { color: C.white, transparency: 20 }
  });
  addText(
    slide,
    '场景绑定：smRadius -> 小标签；mdRadius -> 默认卡片；lgRadius -> 大面板；pillRadius -> 状态胶囊；circleRadius -> icon 容器。',
    {
      x: 1.72,
      y: 6.58,
      w: 9.9,
      h: 0.24,
      fontSize: 11,
      bold: true,
      color: C.copyNavy
    }
  );
}

function renderPageTitleSlide(slide: any, pptx: any, group: CatalogGroup): void {
  renderHeader(slide, '标题原子：PageTitle variants', '同一语义组件只切换 size/color alias；标题层级必须清楚可读。');
  const variants = group.items.length > 0 ? group.items : [];
  const fallback = [
    { text: 'PageTitle subtitle', size: 'subtitleText', color: 'copyNavy' },
    { text: 'PageTitle standard', size: 'pageTitle', color: 'copyNavy' },
    { text: 'PageTitle hero', size: 'heroTitle', color: 'titleIndigo' }
  ];
  const samples = variants.length > 0 ? variants.map((item) => item.component.props) : fallback;
  samples.forEach((props, index) => {
    const size = String(props.size ?? fallback[index]?.size ?? 'pageTitle');
    const color = String(props.color ?? fallback[index]?.color ?? 'copyNavy');
    const token = defaultFoundation.typography[size as keyof typeof defaultFoundation.typography];
    const y = 1.62 + index * 1.58;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.88,
      y,
      w: 11.45,
      h: 1.12,
      fill: { color: index % 2 === 0 ? C.white : C.softBlue, transparency: 2 },
      line: { color: 'D4EDFF', transparency: 4 }
    });
    addText(slide, String(props.text ?? fallback[index]?.text ?? 'PageTitle'), {
      x: 1.2,
      y: y + 0.23,
      w: 7.0,
      h: 0.48,
      fontSize: Math.min(token?.pt ?? 20, 30),
      bold: true,
      color: color === 'titleIndigo' ? C.titleIndigo : C.copyNavy
    });
    addText(slide, `${size} / ${token?.pt ?? '?'}pt / ${color}`, {
      x: 8.55,
      y: y + 0.44,
      w: 3.25,
      h: 0.24,
      fontSize: 10,
      align: 'right',
      color: C.neutralSlate,
      bold: true
    });
  });
}

function renderBadgeSlide(slide: any, pptx: any): void {
  renderHeader(slide, '徽章胶囊：BadgePill color variants', 'BadgePill 固定使用 pillRadius；颜色仅从 canonical palette alias 选择。');
  const colors = Object.entries(defaultFoundation.colors);
  colors.forEach(([alias, token], index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = 0.9 + col * 3.1;
    const y = 1.72 + row * 1.55;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.46,
      h: 0.62,
      fill: { color: token.hex.replace('#', ''), transparency: alias === 'white' ? 0 : 82 },
      line: { color: token.hex.replace('#', ''), width: 1.1 },
      rectRadius: 0.42
    });
    addText(slide, alias, {
      x: x + 0.18,
      y: y + 0.18,
      w: 2.08,
      h: 0.18,
      fontSize: 9,
      bold: true,
      align: 'center',
      color: alias === 'copyNavy' || alias === 'royalBlue' ? C.white : C.copyNavy
    });
    addText(slide, token.hex, {
      x,
      y: y + 0.82,
      w: 2.46,
      h: 0.16,
      fontSize: 7,
      align: 'center',
      color: C.neutralSlate
    });
    addText(slide, token.usage, {
      x: x - 0.12,
      y: y + 1.08,
      w: 2.7,
      h: 0.18,
      fontSize: 6.6,
      align: 'center',
      color: C.neutralSlate
    });
  });
}

function renderIconSlide(slide: any, pptx: any, group: CatalogGroup): void {
  renderHeader(slide, '图标原语：IconPrimitive states', '第一版 icon 只展示 registry id、label 和 cyan accent 容器；业务图标后续接入 icon registry。');
  const labels =
    group.items.length > 0
      ? group.items.map((item) => String(item.component.props.label ?? item.component.props.icon ?? 'icon.placeholder'))
      : ['icon.data', 'icon.ai', 'icon.search', 'icon.alert', 'icon.flow', 'icon.metric'];
  const padded = [...labels, 'icon.data', 'icon.ai', 'icon.search', 'icon.alert', 'icon.flow', 'icon.metric'].slice(0, 6);
  padded.forEach((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 1.08 + col * 4.05;
    const y = 1.7 + row * 2.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.0,
      h: 1.55,
      fill: { color: C.white, transparency: 4 },
      line: { color: 'D4EDFF', transparency: 8 }
    });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.28,
      y: y + 0.34,
      w: 0.74,
      h: 0.74,
      fill: { color: C.cyanAccent, transparency: 18 },
      line: { color: C.cyanAccent, width: 1.1 }
    });
    addText(slide, 'i', {
      x: x + 0.28,
      y: y + 0.49,
      w: 0.74,
      h: 0.2,
      fontSize: 13,
      bold: true,
      align: 'center',
      color: C.copyNavy
    });
    addText(slide, label, {
      x: x + 1.16,
      y: y + 0.42,
      w: 1.5,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: C.copyNavy
    });
    addText(slide, 'IconPrimitive', {
      x: x + 1.16,
      y: y + 0.72,
      w: 1.45,
      h: 0.18,
      fontSize: 7,
      color: C.neutralSlate
    });
  });
}

function renderMetricSlide(slide: any, pptx: any, group: CatalogGroup): void {
  renderHeader(slide, '指标模块：MetricBlock variants', 'MetricBlock 只承载一个 value、一个 label 和可选 delta，避免混入图表职责。');
  group.items.forEach((item, index) => {
    const col = index % 3;
    const x = 0.95 + col * 4.1;
    const y = 1.82;
    const props = item.component.props;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.25,
      h: 2.25,
      fill: { color: C.white, transparency: 2 },
      line: { color: 'D4EDFF', transparency: 4 }
    });
    addText(slide, String(props.value ?? '42%'), {
      x: x + 0.28,
      y: y + 0.38,
      w: 2.68,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: index === 1 ? C.brandViolet : C.copyNavy
    });
    addText(slide, String(props.label ?? 'Metric label'), {
      x: x + 0.3,
      y: y + 1.02,
      w: 2.6,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: C.neutralSlate
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.3,
      y: y + 1.6,
      w: 2.55,
      h: 0.14,
      fill: { color: 'E6F4FF', transparency: 0 },
      line: { color: 'E6F4FF', transparency: 100 }
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.3,
      y: y + 1.6,
      w: 1.3 + index * 0.35,
      h: 0.14,
      fill: { color: index === 2 ? C.cyanAccent : C.brandBlue, transparency: 8 },
      line: { color: index === 2 ? C.cyanAccent : C.brandBlue, transparency: 100 }
    });
  });
}

function renderBulletSlide(slide: any, pptx: any, group: CatalogGroup): void {
  renderHeader(slide, '项目列表：BulletList density variants', 'BulletList 只处理短列表；长段落和多层嵌套必须交给更高层 pattern。');
  group.items.forEach((item, index) => {
    const col = index % 3;
    const x = 0.95 + col * 4.1;
    const y = 1.65;
    const items = Array.isArray(item.component.props.items) ? item.component.props.items : [];
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.25,
      h: 3.85,
      fill: { color: C.white, transparency: 2 },
      line: { color: 'D4EDFF', transparency: 4 }
    });
    addText(slide, `variant ${index + 1}`, {
      x: x + 0.28,
      y: y + 0.28,
      w: 2.6,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: C.titleIndigo
    });
    items.forEach((text, itemIndex) => {
      const lineY = y + 0.78 + itemIndex * 0.48;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.33,
        y: lineY + 0.07,
        w: 0.1,
        h: 0.1,
        fill: { color: C.cyanAccent, transparency: 0 },
        line: { color: C.cyanAccent, transparency: 100 }
      });
      addText(slide, String(text), {
        x: x + 0.55,
        y: lineY,
        w: 2.4,
        h: 0.2,
        fontSize: 10,
        color: C.copyNavy
      });
    });
  });
}

function renderSurfaceCardSlide(slide: any, pptx: any): void {
  renderHeader(slide, '卡片容器：SurfaceCard radius variants', 'SurfaceCard 展示短标题和短正文；radius alias 决定容器语气。');
  const radii = Object.entries(defaultFoundation.radius);
  radii.forEach(([alias, token], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 0.92 + col * 4.1;
    const y = 1.55 + row * 2.15;
    const shapeType = alias === 'circleRadius' ? pptx.ShapeType.ellipse : pptx.ShapeType.roundRect;
    slide.addShape(shapeType, {
      x,
      y,
      w: alias === 'circleRadius' ? 1.95 : 3.1,
      h: alias === 'circleRadius' ? 1.95 : 1.55,
      fill: { color: C.white, transparency: 2 },
      line: { color: C.strokeLavender, transparency: 18 },
      rectRadius: rectRadiusValue(alias)
    });
    addText(slide, alias, {
      x: x + (alias === 'circleRadius' ? 0.16 : 0.26),
      y: y + 0.32,
      w: alias === 'circleRadius' ? 1.6 : 2.55,
      h: 0.24,
      fontSize: 10,
      bold: true,
      align: alias === 'circleRadius' ? 'center' : 'left',
      color: C.copyNavy
    });
    addText(slide, radiusDisplayValue(token), {
      x: x + (alias === 'circleRadius' ? 0.16 : 0.26),
      y: y + 0.68,
      w: alias === 'circleRadius' ? 1.6 : 2.55,
      h: 0.18,
      fontSize: 8,
      align: alias === 'circleRadius' ? 'center' : 'left',
      color: C.neutralSlate
    });
    if (alias !== 'circleRadius') {
      addText(slide, token.usage, {
        x: x + 0.26,
        y: y + 1.0,
        w: 2.5,
        h: 0.2,
        fontSize: 7,
        color: C.neutralSlate
      });
    }
  });
}

function renderGenericComponentSlide(slide: any, pptx: any, group: CatalogGroup): void {
  renderHeader(slide, `${group.type} variants`, '当前组件按 catalog 中声明的 props 逐项展示。');
  group.items.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 0.95 + col * 4.1;
    const y = 1.65 + row * 1.75;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.25,
      h: 1.35,
      fill: { color: C.white, transparency: 2 },
      line: { color: 'D4EDFF', transparency: 4 }
    });
    addText(slide, item.type, {
      x: x + 0.25,
      y: y + 0.24,
      w: 2.7,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: C.copyNavy
    });
    addText(slide, JSON.stringify(item.component.props), {
      x: x + 0.25,
      y: y + 0.58,
      w: 2.7,
      h: 0.32,
      fontSize: 7,
      color: C.neutralSlate
    });
  });
}

function renderComponentSlide(slide: any, pptx: any, group: CatalogGroup): void {
  addGalleryBackground(pptx, slide);
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
  if (group.type === 'IconPrimitive' || group.type === 'IconLabel') {
    renderIconSlide(slide, pptx, group);
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
  const PptxGen = pptxgen as unknown as new () => any;
  const pptx = new PptxGen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'ppt-lord';

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
  if (group.type === 'IconPrimitive' || group.type === 'IconLabel') return Math.max(group.items.length, 6);
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
await writeFile(
  inspectPath,
  `${JSON.stringify({ ...inspection, warnings }, null, 2)}\n`
);

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
