import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Command } from 'commander';

export function qaCommand(): Command {
  return new Command('qa')
    .description(
      'Run QA checks for a deck spec or PPTX. First version writes a placeholder report.'
    )
    .argument('<deck-spec-or-pptx>', 'Input deck spec or PPTX')
    .requiredOption('--out <report>', 'QA report path')
    .action(async (input: string, options: { out: string }) => {
      await mkdir(dirname(options.out), { recursive: true });
      await writeFile(
        options.out,
        `# QA Report\n\nInput: ${input}\n\n- Schema validation: available through validate command\n- Preview rendering: stub\n- Visual diff: stub\n- Text overflow: stub\n`
      );
      console.log(`Created QA report at ${options.out}`);
    });
}
