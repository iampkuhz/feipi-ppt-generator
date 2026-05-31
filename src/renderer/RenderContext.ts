import type { DeckSpec } from '../schema/deck.schema.js';
import type { RenderWarning } from './warnings.js';

export type RenderContext = {
  deck: DeckSpec;
  pptx: any;
  slide: any;
  warnings: RenderWarning[];
};
