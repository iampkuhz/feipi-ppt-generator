import { PptxRenderer } from '../src/renderer/PptxRenderer.js';
import { DeckSpecSchema } from '../src/schema/deck.schema.js';

const spec = DeckSpecSchema.parse({
  id: 'fixture-demo',
  slides: [{ id: 'slide-001', type: 'CoverSlide', title: 'Fixture Demo', components: [] }]
});

const result = await new PptxRenderer().renderDeck(spec, {
  out: 'fixtures/previews/fixture-demo.pptx'
});
console.log(`Rendered ${result.pptxPath}`);
