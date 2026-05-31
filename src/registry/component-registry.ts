import { z } from 'zod';
import type { ComponentSpec } from '../schema/component.schema.js';

export type ComponentLayer = 'primitive' | 'atom' | 'composite' | 'pattern';

export type ComponentRegistryEntry<TProps = unknown> = {
  type: string;
  version: string;
  layer: ComponentLayer;
  status: 'experimental' | 'stable' | 'deprecated';
  propsSchema: z.ZodType<TProps>;
  allowedFoundationKeys?: string[];
  examples: string[];
  description: string;
  limitations?: string[];
};

export class ComponentRegistry {
  private readonly entries = new Map<string, ComponentRegistryEntry>();

  register(entry: ComponentRegistryEntry): void {
    if (this.entries.has(entry.type)) {
      throw new Error(`Component already registered: ${entry.type}`);
    }
    this.entries.set(entry.type, entry);
  }

  get(type: string): ComponentRegistryEntry {
    const entry = this.entries.get(type);
    if (!entry) {
      throw new Error(`Unknown component type: ${type}`);
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
      examples: ['examples/components/page-title.yaml'],
      description: 'Lowest-level text drawing primitive.'
    },
    {
      type: 'ShapePrimitive',
      version: '0.1.0',
      layer: 'primitive',
      status: 'experimental',
      propsSchema: shapePropsSchema,
      examples: [],
      description: 'Lowest-level shape drawing primitive.'
    },
    {
      type: 'IconPrimitive',
      version: '0.1.0',
      layer: 'primitive',
      status: 'experimental',
      propsSchema: iconPropsSchema,
      examples: ['examples/components/icon-label.yaml'],
      description: 'Icon drawing primitive backed by the icon registry.'
    },
    {
      type: 'PageTitle',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: textPropsSchema,
      examples: ['examples/components/page-title.yaml'],
      description: 'Semantic slide title atom.'
    },
    {
      type: 'BadgePill',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: textPropsSchema.extend({ surface: z.string().optional() }),
      examples: ['examples/components/badge-pill.yaml'],
      description: 'Small pill-shaped badge atom.'
    },
    {
      type: 'IconLabel',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: iconPropsSchema,
      examples: ['examples/components/icon-label.yaml'],
      description: 'Icon plus label atom.'
    },
    {
      type: 'MetricBlock',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: metricPropsSchema,
      examples: ['examples/components/metric-block.yaml'],
      description: 'Metric value and label atom.'
    },
    {
      type: 'BulletList',
      version: '0.1.0',
      layer: 'atom',
      status: 'experimental',
      propsSchema: bulletListPropsSchema,
      examples: [],
      description: 'Simple bullet list atom.'
    },
    {
      type: 'IconGrid',
      version: '0.1.0',
      layer: 'composite',
      status: 'experimental',
      propsSchema: genericPropsSchema,
      examples: ['examples/slides/icon-grid.slide.yaml'],
      description: 'Grid of icon-label items.'
    },
    {
      type: 'ChartCard',
      version: '0.1.0',
      layer: 'composite',
      status: 'experimental',
      propsSchema: genericPropsSchema,
      examples: ['examples/components/chart-card.yaml'],
      description: 'Chart container placeholder.'
    }
  ];

  for (const entry of entries) {
    registry.register(entry);
  }
  return registry;
}

export const defaultComponentRegistry = createDefaultComponentRegistry();
