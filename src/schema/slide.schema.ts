import { z } from 'zod';
import { ComponentSpecSchema } from './component.schema.js';

export const SlideSpecSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().optional(),
  layout: z.unknown().optional(),
  components: z.array(ComponentSpecSchema).default([]),
  notes: z.string().optional()
});

export type SlideSpec = z.infer<typeof SlideSpecSchema>;
