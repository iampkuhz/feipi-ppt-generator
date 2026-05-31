# Architecture Overview

`ppt-lord` separates intent, structure, style aliases, rendering, and QA.

Flow:

```text
brief/data/assets -> deck plan -> slide spec -> component tree -> layout resolver -> renderer -> pptx -> preview/QA
```

Core rules:

- Slide specs reference registered components.
- Component props reference Layer0 aliases instead of raw visual values.
- Template packs provide assets and aliases without changing core identity.
- Renderer backends translate component trees into PPTX shapes.
