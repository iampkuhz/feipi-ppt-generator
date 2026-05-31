# Template Pack

A template pack is a plugin-like directory that contains:

- source PPTX files
- extracted backgrounds, icons, and images
- foundation aliases
- icon registry
- background registry
- slide pattern candidates
- component candidates
- QA baseline artifacts

Extraction writes raw findings first. New colors, fonts, sizes, icons, or patterns must be reviewed before becoming reusable aliases or registered components.

Core repository paths must use generic terms such as `default`, `sample`, and `template pack`. They must not contain a specific template identity, brand, customer, event, or source file name.

First-version extraction command:

```bash
ppt-lord inspect-template <template-pptx> --template-id <id> --out assets/templates/<id>/extracted
```
