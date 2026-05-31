import { Command } from 'commander';
import { runQualityGate } from '../../../scripts/quality/run_quality_gate.js';
import { writeQualitySummary } from '../../../scripts/quality/quality_artifact.js';

export function qualityCommand(): Command {
  return new Command('quality')
    .description('运行确定性 quality gate，并写入 summary artifact')
    .requiredOption('--target <target>', '质量目标')
    .requiredOption('--change-id <change-id>', 'OpenSpec change id')
    .action(async (options: { target: string; changeId: string }) => {
      const summary = await runQualityGate({
        target: options.target,
        changeId: options.changeId
      });
      const path = await writeQualitySummary(summary);
      console.log(`${summary.status} quality summary 已写入 ${path}`);
      if (summary.status !== 'PASS') {
        throw new Error(`quality gate 未通过：${summary.blockingFailures.join('；')}`);
      }
    });
}
