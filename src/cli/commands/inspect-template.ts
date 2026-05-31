import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';
import { defaultFoundation } from '../../foundation/default.foundation.js';
import { defaultIconRegistry } from '../../foundation/default.icons.js';

export function inspectTemplateCommand(): Command {
  return new Command('inspect-template')
    .description('Inspect a source PPTX and create a template pack extraction stub')
    .argument('<template-pptx>', 'Source PPTX path')
    .requiredOption('--template-id <id>', 'Template pack id')
    .requiredOption('--out <path>', 'Extraction output directory')
    .action(async (templatePptx: string, options: { templateId: string; out: string }) => {
      await writeTemplateInspectionStub(templatePptx, options.templateId, options.out);
      console.log(`Created template extraction stub at ${options.out}`);
    });
}

export async function writeTemplateInspectionStub(
  templatePptx: string,
  templateId: string,
  outDir: string
): Promise<void> {
  await mkdir(join(outDir, 'backgrounds'), { recursive: true });
  await mkdir(join(outDir, 'icons'), { recursive: true });
  await mkdir(join(outDir, 'images'), { recursive: true });

  const packRoot = outDir.endsWith('/extracted') ? join(outDir, '..') : join(outDir, '..');
  const manifest = {
    templateId,
    source: templatePptx,
    slideSize: { type: 'wide-16-9', widthIn: 10, heightIn: 5.625 },
    assets: { backgrounds: [], icons: [], images: [] },
    candidatePatterns: [],
    candidateComponents: [],
    warnings: ['Template parsing is a first-version stub.']
  };

  await writeFile(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    join(outDir, 'extraction-report.md'),
    `# Extraction Report\n\nTemplate pack: ${templateId}\n\nThis first-version command creates the expected output structure and placeholder manifests.\n`
  );
  await mkdir(packRoot, { recursive: true });
  await writeFile(
    join(packRoot, 'foundation.json'),
    `${JSON.stringify(defaultFoundation, null, 2)}\n`
  );
  await writeFile(
    join(packRoot, 'icons.json'),
    `${JSON.stringify(defaultIconRegistry, null, 2)}\n`
  );
}
