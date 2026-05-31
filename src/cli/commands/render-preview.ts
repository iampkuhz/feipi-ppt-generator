import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';

export function renderPreviewCommand(): Command {
  return new Command('render-preview')
    .description('Render PPTX previews. First version writes a placeholder report.')
    .argument('<pptx>', 'Input PPTX path')
    .requiredOption('--out <dir>', 'Preview output directory')
    .action(async (pptx: string, options: { out: string }) => {
      await mkdir(options.out, { recursive: true });
      await writeFile(
        join(options.out, 'preview-report.json'),
        `${JSON.stringify({ pptx, previews: [], warnings: ['Preview rendering is a stub.'] }, null, 2)}\n`
      );
      console.log(`Created preview stub at ${options.out}`);
    });
}
