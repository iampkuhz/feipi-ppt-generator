import { z } from 'zod';
import { ComponentSpecSchema } from './component.schema.js';

export const AtomComponentMaturitySchema = z.enum([
  'schema-only',
  'pptx-rendered',
  'visually-checkable',
  'stable'
]);

export const AtomComponentContractSchema = z.object({
  type: z.string(),
  layer: z.enum(['primitive', 'atom']),
  maturity: AtomComponentMaturitySchema,
  component: ComponentSpecSchema,
  expectedTexts: z.array(z.string()).default([]),
  fixture: z.string(),
  notes: z.string().optional()
});

export const AtomComponentCatalogSchema = z.object({
  schemaVersion: z.literal(1),
  generatedDeckId: z.string(),
  components: z.array(AtomComponentContractSchema)
});

export type AtomComponentCatalog = z.infer<typeof AtomComponentCatalogSchema>;
