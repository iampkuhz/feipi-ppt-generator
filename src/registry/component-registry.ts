import { z } from 'zod';
import type { ComponentSpec } from '../schema/component.schema.js';

export type ComponentLayer = 'primitive' | 'atom' | 'composite' | 'pattern';

export type ComponentRegistryEntry<TProps = unknown> = {
  type: string;
  version: string;
  layer: ComponentLayer;
  status: 'experimental' | 'stable' | 'deprecated';
  propsSchema: z.ZodType<TProps>;
  allowedVariants: string[];
  allowedTokens: string[];
  examples: string[];
  visualFixtures: string[];
  usageBoundary: string;
  description: string;
};

export class ComponentRegistry {
  private readonly entries = new Map<string, ComponentRegistryEntry>();

  register(entry: ComponentRegistryEntry): void {
    if (this.entries.has(entry.type)) {
      throw new Error(`组件已注册：${entry.type}`);
    }
    this.entries.set(entry.type, entry);
  }

  get(type: string): ComponentRegistryEntry {
    const entry = this.entries.get(type);
    if (!entry) {
      throw new Error(`未知组件类型：${type}`);
    }
    return entry;
  }

  list(): ComponentRegistryEntry[] {
    return [...this.entries.values()];
  }

  validate(componentSpec: ComponentSpec): void {
    const entry = this.get(componentSpec.type);
    entry.propsSchema.parse(componentSpec.props ?? {});
  }
}

const textPropsSchema = z.object({
  text: z.string(),
  size: z.string().optional(),
  color: z.string().optional()
});

const shapePropsSchema = z.object({
  surface: z.string().optional(),
  radius: z.string().optional()
});

const iconPropsSchema = z.object({
  icon: z.string().default('icon.placeholder'),
  label: z.string().optional()
});

const bulletListPropsSchema = z.object({
  items: z.array(z.string()).default([])
});

const metricPropsSchema = z.object({
  label: z.string(),
  value: z.string(),
  delta: z.string().optional()
});

const genericPropsSchema = z.record(z.string(), z.unknown());

export function createDefaultComponentRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();
  const entries: ComponentRegistryEntry[] = [
    {
      type: 'TextPrimitive',
      version: '0.1.0',
      layer: 'primitive',
      status: 'experimental',
      propsSchema: textPropsSchema,
      allowedVariants: [],
      allowedTokens: ['title', 'body', 'inkPrimary', 'inkSecondary'],
      examples: ['examples/components/page-title.yaml'],
      visualFixtures: ['tests/visual/golden/text-primitive.placeholder'],
      usageBoundary: '仅绘制基础文本，不负责语义结构。',
      description: '最低层文本绘制原语。'
    },
    {
      type: 'ShapePrimitive',
      version: '0.1.0',
      layer: 'primitive',
      status: 'experimental',
      propsSchema: shapePropsSchema,
      allowedVariants: [],
      allowedTokens: ['surfacePlain', 'surfaceMuted', 'radiusMD'],
      examples: [],
      visualFixtures: ['tests/visual/golden/shape-primitive.placeholder'],
      usageBoundary: '仅绘制基础形状，不承载业务语义。',
      description: '最低层形状绘制原语。'
    },
    {
      type: 'IconPrimitive',
      version: '0.1.0',
      layer: 'primitive',
      status: 'experimental',
      propsSchema: iconPropsSchema,
      allowedVariants: [],
      allowedTokens: ['iconMD', 'accentCyan'],
      examples: ['examples/components/icon-label.yaml'],
      visualFixtures: ['tests/visual/golden/icon-primitive.placeholder'],
      usageBoundary: '只能使用 icon registry 中的稳定 id。',
      description: '由 icon registry 驱动的 icon 绘制原语。'
    },
    {
      type: 'PageTitle',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: textPropsSchema,
      allowedVariants: [],
      allowedTokens: ['title', 'hero', 'inkPrimary'],
      examples: ['examples/components/page-title.yaml'],
      visualFixtures: ['tests/visual/golden/page-title.placeholder'],
      usageBoundary: '用于页面主标题，不处理副标题或长正文。',
      description: '语义化页面标题原子。'
    },
    {
      type: 'BadgePill',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: textPropsSchema.extend({ surface: z.string().optional() }),
      allowedVariants: ['default', 'accent'],
      allowedTokens: ['caption', 'surfacePlain', 'radiusPill'],
      examples: ['examples/components/badge-pill.yaml'],
      visualFixtures: ['tests/visual/golden/badge-pill.placeholder'],
      usageBoundary: '用于短状态或分类标签，不承载长句。',
      description: '小型胶囊徽章原子。'
    },
    {
      type: 'IconLabel',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: iconPropsSchema,
      allowedVariants: ['horizontal', 'vertical'],
      allowedTokens: ['iconMD', 'body', 'accentCyan'],
      examples: ['examples/components/icon-label.yaml'],
      visualFixtures: ['tests/visual/golden/icon-label.placeholder'],
      usageBoundary: '用于 icon 加短标签，不处理复杂说明文本。',
      description: 'icon 加标签原子。'
    },
    {
      type: 'MetricBlock',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: metricPropsSchema,
      allowedVariants: ['default', 'compact'],
      allowedTokens: ['subtitle', 'bodySmall', 'inkPrimary', 'inkSecondary'],
      examples: ['examples/components/metric-block.yaml'],
      visualFixtures: ['tests/visual/golden/metric-block.placeholder'],
      usageBoundary: '用于单个指标值和说明，不负责图表布局。',
      description: '指标值和标签原子。'
    },
    {
      type: 'BulletList',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: bulletListPropsSchema,
      allowedVariants: ['default'],
      allowedTokens: ['body', 'inkSecondary'],
      examples: [],
      visualFixtures: ['tests/visual/golden/bullet-list.placeholder'],
      usageBoundary: '用于短列表，不处理多层嵌套结构。',
      description: '简单项目符号列表原子。'
    },
    {
      type: 'IconGrid',
      version: '0.1.0',
      layer: 'composite',
      status: 'experimental',
      propsSchema: genericPropsSchema,
      allowedVariants: ['default'],
      allowedTokens: ['gapMD', 'iconMD', 'body'],
      examples: ['examples/slides/icon-grid.slide.yaml'],
      visualFixtures: ['tests/visual/golden/icon-grid.placeholder'],
      usageBoundary: '用于多组 icon-label 排列，不负责整页叙事。',
      description: 'icon-label 项网格组合组件。'
    },
    {
      type: 'ChartCard',
      version: '0.1.0',
      layer: 'composite',
      status: 'experimental',
      propsSchema: genericPropsSchema,
      allowedVariants: ['placeholder'],
      allowedTokens: ['surfacePlain', 'dataPrimary', 'dataSecondary'],
      examples: ['examples/components/chart-card.yaml'],
      visualFixtures: ['tests/visual/golden/chart-card.placeholder'],
      usageBoundary: '第一版仅作为图表容器占位，不实现具体图表绘制。',
      description: '图表卡片占位组件。'
    }
  ];

  for (const entry of entries) {
    registry.register(entry);
  }
  return registry;
}

export const defaultComponentRegistry = createDefaultComponentRegistry();
