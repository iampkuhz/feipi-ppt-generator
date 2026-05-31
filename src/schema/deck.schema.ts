import { z } from 'zod';
import { SlideSpecSchema } from './slide.schema.js';

export const DeckSpecSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  templateId: z.string().default('default'),
  size: z.enum(['wide-16-9', 'standard-4-3']).default('wide-16-9'),
  foundation: z.string().default('default'),
  slides: z.array(SlideSpecSchema),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type DeckSpec = z.infer<typeof DeckSpecSchema>;
