# Quality Gate Matrix

| 变更路径 | target | required gates |
|---|---|---|
| `src/foundation/**` | `foundation` | typecheck, unitTests, schemaTests, noRawVisualValues |
| `src/schema/**` | `schema` | typecheck, schemaTests, examplesValidate |
| `src/components/**` | `component-registry` | typecheck, unitTests, componentExamples, noRawVisualValues |
| `src/layout/**` | `renderer` | typecheck, unitTests, layoutContracts |
| `src/renderer/**` | `renderer` | typecheck, unitTests, generateBasicDeck, pptxInspect |
| `assets/templates/**` | `template-pack` | manifestValidate, assetCheck, examplesValidate |
| `examples/**` | `schema` | examplesValidate, generateBasicDeck |
| `src/cli/commands/render-preview.ts` | `visual-harness` | typecheck, previewStructureCheck |
| `scripts/quality/**` | `hook-runtime` | typecheck, unitTests, doctor, repoStructure |
| `.claude/**` | `hook-runtime` | bashSyntax, hookSelfTest, doctor, repoStructure |
| `.codex/**` | `hook-runtime` | bashSyntax, hookSelfTest, doctor, repoStructure |
| `openspec/**` | `harness` | openspecLayout, changeValidate, doctor |
| `harness/**` | `harness` | harnessStructure, doctor, repoStructure, languagePolicy |
