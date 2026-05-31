import type { TokenLintWarning } from './token-lint.js';

export type QaReport = {
  schemaValid: boolean;
  tokenWarnings: TokenLintWarning[];
  previewWarnings: string[];
  visualRegressionPassed?: boolean;
};

export function createQaReport(report: QaReport): string {
  return `# QA Report

- Schema valid: ${report.schemaValid}
- Token warnings: ${report.tokenWarnings.length}
- Preview warnings: ${report.previewWarnings.length}
- Visual regression passed: ${report.visualRegressionPassed ?? 'not-run'}
`;
}
