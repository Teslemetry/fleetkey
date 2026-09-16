# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code, stated as current facts rather than history.

- Single-page Nuxt 4 + Nuxt UI 4 site built with Nitro's `cloudflare_pages` preset (output in `dist/`) and deployed by the Cloudflare Pages GitHub integration on push to `main`; there is no GitHub Actions deploy workflow and no wrangler config file. The `KV` namespace binding and `nodejs_compat` flag are configured on the Pages project in the Cloudflare dashboard.
- `/api/create` stores keys via `useStorage('kv')`, which Nitro mounts on the `KV` binding in production and on `.data/kv` (filesystem, gitignored) under `pnpm dev`; see `nitro.storage` and `nitro.devStorage` in `nuxt.config.ts`. Keys are stored unprefixed, so the bound namespace must be the one already holding production keys.
- `/` must stay server-rendered per request: each visitor's random domain id comes from `useState` during SSR, so prerendering `/` would hand every visitor the same id. There is deliberately no `generate` script.
- Page copy is hardcoded in `app/pages/index.vue`; there is no content layer.
- `pnpm preview` runs the built output with `wrangler pages dev` and a locally emulated `KV` binding. Validate with `pnpm lint`, `pnpm typecheck`, `pnpm build`.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
State current, practically-useful facts only, never history: no dated entries, no PR or deploy or incident records, no narrative; rewrite anything durable that survives from an event as a timeless fact instead.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones; condense on sight so the file stays bounded rather than growing forever.
When updating this file, preserve this bar for all agents and keep entries concise.
