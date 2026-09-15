# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code, stated as current facts rather than history.

- Single-page Nuxt 4 + Nuxt UI 4 site deployed to NuxtHub (Cloudflare Pages) by `.github/workflows/nuxthub.yml` on push to `main`; `/api/create` stores keys in NuxtHub KV (`hubKV()`).
- `/` must stay server-rendered per request: each visitor's random domain id comes from `useState` during SSR, so prerendering `/` would hand every visitor the same id.
- `pnpm generate` is unsupported: `@nuxthub/core` exits under `nuxt generate` because the app needs a server. Validate with `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- Page copy is hardcoded in `app/pages/index.vue`; there is no content layer.
- `pnpm preview` runs plain `wrangler pages dev` without a KV binding, so `/api/create` returns 500 there; use `pnpm dev` (local NuxtHub storage in `.data/`) to exercise the API.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
State current, practically-useful facts only, never history: no dated entries, no PR or deploy or incident records, no narrative; rewrite anything durable that survives from an event as a timeless fact instead.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones; condense on sight so the file stays bounded rather than growing forever.
When updating this file, preserve this bar for all agents and keep entries concise.
