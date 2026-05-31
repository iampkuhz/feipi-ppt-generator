# Renderer

The renderer receives a validated `DeckSpec`, resolves aliases through the foundation, resolves assets through the template pack, and writes output artifacts.

The first backend is `pptxgenjs`. The first version renders a minimal PPTX smoke path and records warnings for registered components that do not yet have drawing logic.
