import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Command } from 'commander';

export function qaCommand(): Command {
  return new Command('qa')
    .description('运行 QA 检查；第一版写入占位报告')
    .argument('<deck-spec-or-pptx>', '输入 deck spec 或 PPTX')
    .requiredOption('--out <report>', 'QA report 路径')
    .action(async (input: string, options: { out: string }) => {
      await mkdir(dirname(options.out), { recursive: true });
      await writeFile(
        options.out,
        `# QA Report\n\n输入：${input}\n\n- Schema 校验：通过 validate 命令执行\n- 预览导出：stub\n- 视觉回归：stub\n- 文本溢出：stub\n`
      );
      console.log(`PASS 已创建 QA report ${options.out}`);
    });
}
