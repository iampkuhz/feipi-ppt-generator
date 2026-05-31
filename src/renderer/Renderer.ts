import type { DeckSpec } from '../schema/deck.schema.js';
import type { SlideSpec } from '../schema/slide.schema.js';
import type { RenderContext } from './RenderContext.js';
import type { RenderWarning } from './warnings.js';

export type RenderOptions = {
  out: string;
};

export type RenderResult = {
  pptxPath: string;
  warnings: RenderWarning[];
  artifacts: {
    previewDir?: string;
    pdfPath?: string;
    pngPaths?: string[];
    qaReportPath?: string;
  };
};

export interface Renderer {
  renderDeck(spec: DeckSpec, options: RenderOptions): Promise<RenderResult>;
  renderSlide(slide: SlideSpec, context: RenderContext): Promise<void>;
}
