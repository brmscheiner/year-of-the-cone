# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Content Management (Decap CMS + Astro)

Site content lives in YAML files under `src/content/` and is editable via the Decap CMS admin panel at `/admin/` on the deployed site (Netlify Identity + git-gateway).

### How it works

Decap CMS and Astro's `file()` content loader expect different YAML formats:

- **Decap CMS** (`files` collections) expects each YAML file to be a **plain object** whose keys match the configured fields.
- **Astro's `file()` loader**, when given a plain YAML object, treats each top-level key as a separate content entry — not what we want.

To bridge this, `src/content.config.ts` defines a `yamlEntry()` helper that passes a custom parser to `file()`. The parser wraps the plain YAML object into a single-element array with an injected `id`, so Astro treats it as one entry while the YAML on disk stays CMS-compatible.

### Adding a new content collection

1. Create `src/content/<name>/index.yaml` as a plain YAML object (no list wrapper, no `id` field).
2. Add a collection to `src/content.config.ts` using `yamlEntry('src/content/<name>/index.yaml', '<entry-id>')`.
3. Add a matching `files` entry in `public/admin/config.yml` — field names must match the YAML keys and the Zod schema.

### Key constraint

The YAML files must stay as plain objects (not arrays). If you wrap them in a list (`- id: ...`), Decap CMS will silently break — the admin UI renders but buttons do nothing and no errors appear in the console.
