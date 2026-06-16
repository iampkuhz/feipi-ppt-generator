import { access } from 'node:fs/promises';
import { Command } from 'commander';

export function archiveCommand(): Command {
  return new Command('archive')
    .description('检查 OpenSpec change 是否可进入人工归档流程')
    .argument('<change-id>', '变更 id')
    .action(async (changeId: string) => {
      const path = `openspec/changes/${changeId}`;
      await access(path);
      console.log(`BLOCKED ${path} 存在；当前 archive 只做归档前检查，长期 specs 仍需人工确认后再移动目录`);
    });
}
