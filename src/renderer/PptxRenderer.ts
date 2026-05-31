import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import pptxgen from 'pptxgenjs';
import type { DeckSpec } from '../schema/deck.schema.js';
import type { SlideSpec } from '../schema/slide.schema.js';
import { defaultComponentRegistry } from '../registry/component-registry.js';
import { LayoutEngine } from './LayoutEngine.js';
import type { RenderContext } from './RenderContext.js';
import type { Renderer, RenderOptions, RenderResult } from './Renderer.js';
import { ThemeResolver } from './ThemeResolver.js';
import { warning, type RenderWarning } from './warnings.js';

export class PptxRenderer implements Renderer {
  private readonly theme = new ThemeResolver();
  private readonly layout = new LayoutEngine();

  async renderDeck(spec: DeckSpec, options: RenderOptions): Promise<RenderResult> {
    const PptxGen = pptxgen as unknown as new () => any;
    const pptx = new PptxGen();
    pptx.layout = spec.size === 'standard-4-3' ? 'LAYOUT_4X3' : 'LAYOUT_WIDE';
    const warnings: RenderWarning[] = [];

    for (const slideSpec of spec.slides) {
      const slide = pptx.addSlide();
      await this.renderSlide(slideSpec, { deck: spec, pptx, slide, warnings });
    }

    await mkdir(dirname(options.out), { recursive: true });
    await pptx.writeFile({ fileName: options.out });
    return { pptxPath: options.out, warnings };
  }

  async renderSlide(slideSpec: SlideSpec, context: RenderContext): Promise<void> {
    if (slideSpec.title) {
      const rect = this.layout.titleRect(0);
      context.slide.addText(slideSpec.title, {
        ...rect,
        fontFace: 'Arial',
        fontSize: this.theme.fontSize('title'),
        color: this.theme.color('inkPrimary'),
        bold: true
      });
    }

    slideSpec.components.forEach((component, index) => {
      try {
        defaultComponentRegistry.validate(component);
      } catch (error) {
        context.warnings.push(
          warning('component.validation_failed', String(error), {
            slideId: slideSpec.id,
            componentType: component.type
          })
        );
        return;
      }

      const props = component.props as Record<string, unknown>;
      if (component.type === 'PageTitle' || component.type === 'TextPrimitive') {
        const rect = this.layout.titleRect(index);
        context.slide.addText(String(props.text ?? ''), {
          ...rect,
          fontFace: 'Arial',
          fontSize: this.theme.fontSize(String(props.size ?? 'title')),
          color: this.theme.color(String(props.color ?? 'inkPrimary')),
          bold: component.type === 'PageTitle'
        });
        return;
      }

      if (component.type === 'BulletList') {
        const items = Array.isArray(props.items) ? props.items : [];
        items.forEach((item, itemIndex) => {
          context.slide.addText(`• ${String(item)}`, {
            ...this.layout.contentRect(itemIndex),
            fontFace: 'Arial',
            fontSize: this.theme.fontSize('body'),
            color: this.theme.color('inkSecondary')
          });
        });
        return;
      }

      context.warnings.push(
        warning(
          'renderer.stub_component',
          `Component is registered but not rendered yet: ${component.type}`,
          {
            slideId: slideSpec.id,
            componentType: component.type,
            severity: 'info'
          }
        )
      );
    });
  }
}
