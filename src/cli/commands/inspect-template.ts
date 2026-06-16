import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';
import { defaultFoundation } from '../../foundation/default.foundation.js';
import { defaultIconRegistry } from '../../foundation/default.icons.js';
import { inspectPptx } from '../../harness/inspect-pptx.js';

export function inspectTemplateCommand(): Command {
  return new Command('inspect-template')
    .description('检查源 PPTX 并创建 template pack 候选结构')
    .argument('<template-pptx>', '源 PPTX 路径')
    .requiredOption('--template-id <id>', 'Template pack id')
    .requiredOption('--out <path>', 'Extraction output directory')
    .action(async (templatePptx: string, options: { templateId: string; out: string }) => {
      await writeTemplateInspection(templatePptx, options.templateId, options.out);
      console.log(`PASS 已创建 template pack 候选结构 ${options.out}`);
    });
}

export async function writeTemplateInspection(
  templatePptx: string,
  templateId: string,
  outDir: string
): Promise<void> {
  const inspection = await inspectPptx(templatePptx);
  await mkdir(join(outDir, 'backgrounds'), { recursive: true });
  await mkdir(join(outDir, 'icons'), { recursive: true });
  await mkdir(join(outDir, 'images'), { recursive: true });

  const packRoot = outDir.endsWith('/extracted') ? join(outDir, '..') : join(outDir, '..');
  const manifest = {
    templateId,
    source: templatePptx,
    slideSize: { type: 'wide-16-9', widthIn: 10, heightIn: 5.625 },
    slideCount: inspection.slideCount,
    shapeCount: inspection.shapeCount,
    relationshipCount: inspection.relationshipCount,
    colors: inspection.colors,
    fonts: inspection.fonts,
    textSamples: inspection.texts.slice(0, 80),
    assets: { backgrounds: [], icons: [], images: [] },
    candidatePatterns: [],
    candidateComponents: [],
    warnings: ['当前只生成结构候选和 foundation/icon 基线，尚未抽取图片切片。']
  };

  await writeFile(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    join(outDir, 'extraction-report.md'),
    `# 模板抽取报告\n\nTemplate pack：${templateId}\n\n源文件：${templatePptx}\n\n- slide 数量：${inspection.slideCount}\n- shape 数量：${inspection.shapeCount}\n- 颜色候选：${inspection.colors.join(', ') || '无'}\n- 字体候选：${inspection.fonts.join(', ') || '无'}\n\n当前命令只生成 template pack 候选结构；图片切片和语义组件提升需要后续人工 review。\n`
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
