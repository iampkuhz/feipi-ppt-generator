import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { validateHarnessStructure } from '../harness/validate_harness_structure.js';
import { validateAgentRuntime } from '../harness/validate_agent_runtime.js';
import { validateLanguagePolicy } from '../harness/validate_language_policy.js';
import { validateOpenSpecLayout } from '../harness/validate_openspec_layout.js';
import { validateRepoStructure } from '../harness/validate_repo_structure.js';
import { isQualityTarget, type QualityTarget } from './quality_targets.js';
import { writeQualitySummary, type GateStatus, type QualitySummary } from './quality_artifact.js';

const execAsync = promisify(exec);

type RunQualityOptions = {
  target: string;
  changeId: string;
};

function statusFromErrors(errors: string[]): GateStatus {
  return errors.length === 0 ? 'PASS' : 'FAIL';
}

type GateSpec = {
  name: string;
  command: string;
  required?: boolean;
  fix?: string;
};

const targetGates: Partial<Record<QualityTarget, GateSpec[]>> = {
  foundation: [
    { name: 'typecheck', command: 'pnpm typecheck' },
    { name: 'foundationTests', command: 'pnpm test tests/unit/foundation.test.ts tests/harness/token-lint.test.ts' },
    { name: 'noRawVisualValues', command: 'pnpm tsx scripts/quality/check_no_raw_visual_values.ts examples/decks/basic.deck.yaml' }
  ],
  schema: [
    { name: 'typecheck', command: 'pnpm typecheck' },
    { name: 'schemaTests', command: 'pnpm test tests/schema' },
    { name: 'examplesValidate', command: 'pnpm tsx scripts/quality/check_schema_examples.ts examples/decks/basic.deck.yaml examples/decks/atom-components.deck.yaml' }
  ],
  'component-registry': [
    { name: 'typecheck', command: 'pnpm typecheck' },
    { name: 'registryTests', command: 'pnpm test tests/unit/registry.test.ts tests/schema/component-schema.test.ts tests/schema/atom-component-schema.test.ts' },
    { name: 'componentContracts', command: 'pnpm tsx scripts/quality/check_component_contracts.ts' },
    { name: 'noRawVisualValues', command: 'pnpm tsx scripts/quality/check_no_raw_visual_values.ts examples/decks/atom-components.deck.yaml' }
  ],
  renderer: [
    { name: 'typecheck', command: 'pnpm typecheck' },
    { name: 'rendererTests', command: 'pnpm test tests/renderer tests/e2e' },
    { name: 'generateAtomSamples', command: 'pnpm generate:atoms' },
    { name: 'pptxInspect', command: 'pnpm tsx scripts/quality/check_pptx_structure.ts tmp/atom-samples/atom-component-variants.pptx --expect-text PageTitle --expect-text IconLabel --expect-text SurfaceCard --expect-text circleRadius' }
  ],
  'hook-runtime': [
    { name: 'typecheck', command: 'pnpm typecheck' },
    { name: 'hookTests', command: 'pnpm test tests/harness' },
    { name: 'bashSyntax', command: 'bash -n .codex/hooks/pre_tool_guard.sh .codex/hooks/post_tool_guard.sh .codex/hooks/stop_check.sh .claude/hooks/pre-write.sh .claude/hooks/post-write.sh .claude/hooks/stop.sh' },
    { name: 'doctor', command: 'pnpm lord doctor' }
  ]
};

async function runCommandGate(gate: GateSpec): Promise<QualitySummary['gateDetails'][number]> {
  const started = Date.now();
  try {
    const { stdout, stderr } = await execAsync(gate.command, {
      timeout: 120_000,
      maxBuffer: 1024 * 1024 * 4,
      shell: '/bin/bash'
    });
    const output = `${stdout}${stderr}`.trim();
    return {
      name: gate.name,
      status: 'PASS',
      command: gate.command,
      durationMs: Date.now() - started,
      message: output.split('\n').slice(-3).join('；') || '检查通过',
      fix: undefined
    };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string; code?: number };
    const output = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
    return {
      name: gate.name,
      status: 'FAIL',
      command: gate.command,
      durationMs: Date.now() - started,
      message: output.split('\n').slice(-6).join('；') || err.message || '命令失败',
      fix: gate.fix ?? `修复失败后重新运行：${gate.command}`
    };
  }
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
  const agentErrors = await validateAgentRuntime();
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
    addGate('agentRuntime', agentErrors);
    addGate('languagePolicy', languageErrors);
  }

  const commandGates = targetGates[options.target as QualityTarget] ?? [];
  if (commandGates.length > 0) {
    for (const gate of commandGates) {
      const detail = await runCommandGate(gate);
      requiredGates[gate.name] = detail.status;
      details.push(detail);
    }
  } else if (options.target !== 'harness') {
    addGate('repoStructure', repoErrors);
    details.push({
      name: 'targetUnsupported',
      status: 'SKIPPED',
      message: `target ${options.target} 尚未配置真实 gate`,
      fix: '在 scripts/quality/run_quality_gate.ts 中配置 target gates'
    });
    requiredGates.targetUnsupported = 'SKIPPED';
  }

  const blockingFailures = details
    .filter((item) => item.status === 'FAIL' || item.status === 'BLOCKED' || item.status === 'SKIPPED')
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
    warnings: details.some((item) => item.status === 'SKIPPED') ? ['存在 required gate 被跳过，overall 不得为 PASS'] : [],
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
