import { validateLanguagePolicy } from '../harness/validate_language_policy.js';

const errors = await validateLanguagePolicy();
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log('PASS 中文规约检查通过');
}
