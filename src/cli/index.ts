#!/usr/bin/env node
import { Command } from 'commander';
import { archiveCommand } from './commands/archive.js';
import { changeCommand } from './commands/change.js';
import { doctorCommand } from './commands/doctor.js';
import { generateCommand } from './commands/generate.js';
import { inspectTemplateCommand } from './commands/inspect-template.js';
import { previewCommand } from './commands/preview.js';
import { qualityCommand } from './commands/quality.js';
import { qaCommand } from './commands/qa.js';
import { renderPreviewCommand } from './commands/render-preview.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

program.name('ppt-lord').description('通用 PPT 生成工具').version('0.1.0');

program.addCommand(doctorCommand());
program.addCommand(validateCommand());
program.addCommand(generateCommand());
program.addCommand(inspectTemplateCommand());
program.addCommand(renderPreviewCommand());
program.addCommand(previewCommand());
program.addCommand(qaCommand());
program.addCommand(qualityCommand());
program.addCommand(changeCommand());
program.addCommand(archiveCommand());

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
