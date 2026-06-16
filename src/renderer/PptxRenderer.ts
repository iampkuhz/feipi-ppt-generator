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
    return { pptxPath: options.out, warnings, artifacts: {} };
  }

  async renderSlide(slideSpec: SlideSpec, context: RenderContext): Promise<void> {
    if (slideSpec.title) {
      const rect = this.layout.titleRect(0);
      context.slide.addText(slideSpec.title, {
        ...rect,
        fontFace: this.theme.fontFace(),
        fontSize: this.theme.fontSize('pageTitle'),
        color: this.theme.color('copyNavy'),
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
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize(String(props.size ?? 'pageTitle')),
          color: this.theme.color(String(props.color ?? 'copyNavy')),
          bold: component.type === 'PageTitle'
        });
        return;
      }

      if (component.type === 'BulletList') {
        const items = Array.isArray(props.items) ? props.items : [];
        items.forEach((item, itemIndex) => {
          context.slide.addText(`• ${String(item)}`, {
            ...this.layout.contentRect(itemIndex),
            fontFace: this.theme.fontFace(),
            fontSize: this.theme.fontSize('bodyText'),
            color: this.theme.color('neutralSlate')
          });
        });
        return;
      }

      if (component.type === 'ShapePrimitive') {
        const rect = this.layout.componentRect(index);
        context.slide.addShape(context.pptx.ShapeType.roundRect, {
          ...rect,
          fill: { color: this.theme.color(String(props.surface ?? 'white')), transparency: 8 },
          line: { color: this.theme.color('strokeLavender'), transparency: 20 },
          rectRadius: this.theme.rectRadius(String(props.radius ?? 'mdRadius'))
        });
        return;
      }

      if (component.type === 'IconPrimitive' || component.type === 'IconLabel') {
        const rect = this.layout.componentRect(index);
        const label = String(props.label ?? props.icon ?? 'icon.placeholder');
        context.slide.addText(`icon.placeholder ${label}`, {
          ...rect,
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize('bodyText'),
          color: this.theme.color('copyNavy')
        });
        return;
      }

      if (component.type === 'BadgePill') {
        const rect = this.layout.componentRect(index);
        context.slide.addShape(context.pptx.ShapeType.roundRect, {
          ...rect,
          w: 2.2,
          h: 0.42,
          fill: { color: this.theme.color('white'), transparency: 0 },
          line: { color: this.theme.color('strokeLavender'), transparency: 15 },
          rectRadius: this.theme.rectRadius('pillRadius')
        });
        context.slide.addText(String(props.text ?? ''), {
          x: rect.x + 0.16,
          y: rect.y + 0.08,
          w: 1.9,
          h: 0.2,
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize(String(props.size ?? 'captionLabel')),
          color: this.theme.color(String(props.color ?? 'copyNavy')),
          bold: true
        });
        return;
      }

      if (component.type === 'MetricBlock') {
        const rect = this.layout.cardRect(index);
        context.slide.addText(String(props.value ?? ''), {
          x: rect.x,
          y: rect.y,
          w: rect.w,
          h: 0.36,
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize('subtitleText'),
          color: this.theme.color('copyNavy'),
          bold: true
        });
        context.slide.addText(String(props.label ?? ''), {
          x: rect.x,
          y: rect.y + 0.42,
          w: rect.w,
          h: 0.26,
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize('supportText'),
          color: this.theme.color('neutralSlate')
        });
        return;
      }

      if (component.type === 'SurfaceCard') {
        const rect = this.layout.cardRect(index);
        context.slide.addShape(context.pptx.ShapeType.roundRect, {
          ...rect,
          fill: { color: this.theme.color(String(props.surface ?? 'white')), transparency: 0 },
          line: { color: this.theme.color('strokeLavender'), transparency: 15 },
          rectRadius: this.theme.rectRadius(String(props.radius ?? 'mdRadius'))
        });
        context.slide.addText(String(props.title ?? ''), {
          x: rect.x + 0.22,
          y: rect.y + 0.12,
          w: rect.w - 0.44,
          h: 0.24,
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize('bodyText'),
          color: this.theme.color('copyNavy'),
          bold: true
        });
        context.slide.addText(String(props.body ?? ''), {
          x: rect.x + 0.22,
          y: rect.y + 0.42,
          w: rect.w - 0.44,
          h: 0.22,
          fontFace: this.theme.fontFace(),
          fontSize: this.theme.fontSize('supportText'),
          color: this.theme.color('neutralSlate')
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
