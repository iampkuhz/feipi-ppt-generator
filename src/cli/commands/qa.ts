import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname } from 'node:path';
import { Command } from 'commander';
import { parse } from 'yaml';
import { inspectPptx } from '../../harness/inspect-pptx.js';
import { DeckSpecSchema } from '../../schema/deck.schema.js';

export function qaCommand(): Command {
  return new Command('qa')
    .description('运行 deck spec 或 PPTX 的确定性 QA 检查')
    .argument('<deck-spec-or-pptx>', '输入 deck spec 或 PPTX')
    .requiredOption('--out <report>', 'QA report 路径')
    .action(async (input: string, options: { out: string }) => {
      const ext = extname(input).toLowerCase();
      const sections: string[] = [`# QA Report`, ``, `输入：${input}`];

      if (ext === '.pptx') {
        const inspection = await inspectPptx(input);
        sections.push(
          ``,
          `## PPTX 结构检查`,
          ``,
          `- slide 数量：${inspection.slideCount}`,
          `- shape 数量：${inspection.shapeCount}`,
          `- relationship 数量：${inspection.relationshipCount}`,
          `- 文本数量：${inspection.texts.length}`,
          `- 颜色候选：${inspection.colors.join(', ') || '无'}`,
          `- 字体候选：${inspection.fonts.join(', ') || '无'}`,
          `- 不支持媒体：${inspection.unsupportedMedia.join(', ') || '无'}`
        );
      } else {
        const raw = parse(await readFile(input, 'utf8'));
        const spec = DeckSpecSchema.parse(raw);
        sections.push(
          ``,
          `## Deck Spec 检查`,
          ``,
          `- schema 校验：PASS`,
          `- deck id：${spec.id}`,
          `- slide 数量：${spec.slides.length}`
        );
      }

      sections.push(
        ``,
        `## 限制`,
        ``,
        `- visual diff 尚未配置，不能把本报告描述为完整视觉回归。`,
        `- 文本溢出检查需要后续接入预览后端。`
      );

      await mkdir(dirname(options.out), { recursive: true });
      await writeFile(options.out, `${sections.join('\n')}\n`);
      console.log(`PASS 已创建 QA report ${options.out}`);
    });
}
