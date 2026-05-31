#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from './commands/generate.js';
import { inspectTemplateCommand } from './commands/inspect-template.js';
import { qaCommand } from './commands/qa.js';
import { renderPreviewCommand } from './commands/render-preview.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

program.name('ppt-lord').description('Generic PPT generation toolkit').version('0.1.0');

program.addCommand(validateCommand());
program.addCommand(generateCommand());
program.addCommand(inspectTemplateCommand());
program.addCommand(renderPreviewCommand());
program.addCommand(qaCommand());

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
