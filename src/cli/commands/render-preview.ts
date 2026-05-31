import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';

export function renderPreviewCommand(): Command {
  return new Command('render-preview')
    .description('导出 PPTX 预览；第一版写入占位报告')
    .argument('<pptx>', '输入 PPTX 路径')
    .requiredOption('--out <dir>', '预览输出目录')
    .action(async (pptx: string, options: { out: string }) => {
      await mkdir(options.out, { recursive: true });
      await writeFile(
        join(options.out, 'preview-report.json'),
        `${JSON.stringify({ pptx, previews: [], warnings: ['第一版预览导出为 stub。'] }, null, 2)}\n`
      );
      console.log(`PASS 已创建预览占位报告 ${options.out}`);
    });
}
