import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';
import { inspectPptx } from '../../harness/inspect-pptx.js';

export function renderPreviewCommand(): Command {
  return new Command('render-preview')
    .description('导出 PPTX 结构预览报告')
    .argument('<pptx>', '输入 PPTX 路径')
    .requiredOption('--out <dir>', '预览输出目录')
    .action(async (pptx: string, options: { out: string }) => {
      const inspection = await inspectPptx(pptx);
      await mkdir(options.out, { recursive: true });
      await writeFile(
        join(options.out, 'preview-report.json'),
        `${JSON.stringify(
          {
            schemaVersion: 1,
            pptx,
            slideCount: inspection.slideCount,
            shapeCount: inspection.shapeCount,
            relationshipCount: inspection.relationshipCount,
            colors: inspection.colors,
            fonts: inspection.fonts,
            textSamples: inspection.texts.slice(0, 80),
            previews: [],
            warnings: ['当前未配置图像预览后端，仅输出 PPTX 结构预览。']
          },
          null,
          2
        )}\n`
      );
      console.log(`PASS 已创建 PPTX 结构预览报告 ${options.out}`);
    });
}
