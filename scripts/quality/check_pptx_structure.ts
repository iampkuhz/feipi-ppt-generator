import { inspectPptx } from '../../src/harness/inspect-pptx.js';

const [pptxPath] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const expectedTexts: string[] = [];
for (let index = 2; index < process.argv.length; index += 1) {
  if (process.argv[index] === '--expect-text') {
    expectedTexts.push(process.argv[index + 1]);
    index += 1;
  }
}

if (!pptxPath) {
  console.error('BLOCKED 缺少 PPTX 路径');
  process.exitCode = 1;
} else {
  const inspection = await inspectPptx(pptxPath);
  const errors: string[] = [];
  if (inspection.slideCount <= 0) errors.push('PPTX 缺少 slide');
  if (!inspection.entries.includes('[Content_Types].xml')) errors.push('PPTX 缺少 [Content_Types].xml');
  for (const text of expectedTexts) {
    if (!inspection.texts.some((item) => item.includes(text))) {
      errors.push(`PPTX 缺少预期文本：${text}`);
    }
  }
  if (inspection.unsupportedMedia.length > 0) {
    errors.push(`PPTX 包含暂不支持媒体：${inspection.unsupportedMedia.join(', ')}`);
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`FAIL ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `PASS PPTX 结构检查通过 slides=${inspection.slideCount} texts=${inspection.texts.length} shapes=${inspection.shapeCount}`
    );
  }
}
