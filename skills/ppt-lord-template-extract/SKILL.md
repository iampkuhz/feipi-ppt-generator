# ppt-lord-template-extract

## Purpose

Receive a template PPTX, run `inspect-template`, and produce template pack candidate artifacts.

## Workflow

```bash
tsx src/cli/index.ts inspect-template <template-pptx> --template-id <id> --out assets/templates/<id>/extracted
```

Review extraction output before promoting aliases or components.
