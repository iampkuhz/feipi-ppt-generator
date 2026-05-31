import { Command } from 'commander';
import { validateHarnessStructure } from '../../../scripts/harness/validate_harness_structure.js';
import { validateLanguagePolicy } from '../../../scripts/harness/validate_language_policy.js';
import { validateOpenSpecLayout } from '../../../scripts/harness/validate_openspec_layout.js';
import { validateRepoStructure } from '../../../scripts/harness/validate_repo_structure.js';

export function doctorCommand(): Command {
  return new Command('doctor')
    .description('检查仓库结构、OpenSpec、harness 和中文规约')
    .action(async () => {
      const repoChecks = await validateRepoStructure();
      const repoErrors = repoChecks.filter((item) => !item.ok).map((item) => `缺少 ${item.path}`);
      const openspecErrors = await validateOpenSpecLayout();
      const harnessErrors = await validateHarnessStructure();
      const languageErrors = await validateLanguagePolicy();
      const errors = [...repoErrors, ...openspecErrors, ...harnessErrors, ...languageErrors];

      if (errors.length > 0) {
        for (const error of errors) console.error(`FAIL ${error}`);
        throw new Error('doctor 检查失败');
      }

      console.log('PASS doctor 检查通过');
    });
}
