import { validateHarnessStructure } from '../harness/validate_harness_structure.js';
import { validateLanguagePolicy } from '../harness/validate_language_policy.js';
import { validateOpenSpecLayout } from '../harness/validate_openspec_layout.js';
import { validateRepoStructure } from '../harness/validate_repo_structure.js';
import { isQualityTarget, type QualityTarget } from './quality_targets.js';
import { writeQualitySummary, type GateStatus, type QualitySummary } from './quality_artifact.js';

type RunQualityOptions = {
  target: string;
  changeId: string;
};

function statusFromErrors(errors: string[]): GateStatus {
  return errors.length === 0 ? 'PASS' : 'FAIL';
}

export async function runQualityGate(options: RunQualityOptions): Promise<QualitySummary> {
  if (!isQualityTarget(options.target)) {
    throw new Error(`未知 quality target：${options.target}`);
  }

  const startedAt = new Date().toISOString();
  const repoChecks = await validateRepoStructure();
  const repoErrors = repoChecks.filter((item) => !item.ok).map((item) => `缺少 ${item.path}`);
  const openspecErrors = await validateOpenSpecLayout();
  const harnessErrors = await validateHarnessStructure();
  const languageErrors = await validateLanguagePolicy();

  const requiredGates: Record<string, GateStatus> = {};
  const details: QualitySummary['gateDetails'] = [];

  const addGate = (name: string, errors: string[]) => {
    const status = statusFromErrors(errors);
    requiredGates[name] = status;
    details.push({
      name,
      status,
      message: status === 'PASS' ? '检查通过' : errors.join('；'),
      fix: status === 'PASS' ? undefined : '执行 pnpm lord doctor 并补齐缺失文件'
    });
  };

  if (options.target === 'harness' || options.target === 'hook-runtime') {
    addGate('repoStructure', repoErrors);
    addGate('openspecLayout', openspecErrors);
    addGate('harnessStructure', harnessErrors);
    addGate('languagePolicy', languageErrors);
  } else {
    addGate('repoStructure', repoErrors);
    addGate('targetStub', []);
  }

  const blockingFailures = details
    .filter((item) => item.status === 'FAIL' || item.status === 'BLOCKED')
    .map((item) => `${item.name}: ${item.message}`);

  const status = blockingFailures.length > 0 ? 'FAIL' : 'PASS';

  return {
    schemaVersion: 1,
    status,
    target: options.target as QualityTarget,
    changeId: options.changeId,
    startedAt,
    finishedAt: new Date().toISOString(),
    requiredGates,
    blockingFailures,
    warnings: options.target === 'harness' ? [] : ['第一版 quality gate 对该 target 仅执行结构化 stub 检查'],
    artifacts: {},
    gateDetails: details
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const targetIndex = process.argv.indexOf('--target');
  const changeIndex = process.argv.indexOf('--change-id');
  const target = targetIndex >= 0 ? process.argv[targetIndex + 1] : '';
  const changeId = changeIndex >= 0 ? process.argv[changeIndex + 1] : 'local';
  const summary = await runQualityGate({ target, changeId });
  const path = await writeQualitySummary(summary);
  console.log(`${summary.status} quality summary 已写入 ${path}`);
  if (summary.status !== 'PASS') process.exitCode = 1;
}
