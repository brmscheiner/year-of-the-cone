# CLAUDE.md

## Content system (Decap CMS + Astro)

YAML files in `src/content/` must be plain objects — not YAML arrays. Decap CMS silently breaks (UI renders but editing does nothing, no console errors) if the files use the `- id: ...` list format.

Astro's `file()` loader would normally treat a plain YAML object's keys as separate entries. The `yamlEntry()` helper in `src/content.config.ts` fixes this with a custom parser that wraps the object into `[{ id, ...data }]` so Astro sees one entry per file.

When modifying content collections, keep these three files in sync:

- `src/content/<name>/index.yaml` — plain YAML object, no `id` field
- `src/content.config.ts` — Zod schema + `yamlEntry()` loader with the entry ID
- `public/admin/config.yml` — Decap CMS field definitions (field names must match the YAML keys and Zod schema)

Do not add hidden `id` fields to the CMS config — the `id` only exists in Astro's content layer via the custom parser.
