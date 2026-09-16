# FleetKey.cc

This website lets you upload a Tesla Fleet API public key for use in your Tesla Fleet Application registration.

## Development

```sh
pnpm install
pnpm dev      # Nuxt dev server; keys are stored in .data/kv
pnpm build    # Build for Cloudflare Pages into dist/
pnpm preview  # Run the build with wrangler pages dev and an emulated KV binding
```

## Deployment

The site is deployed to Cloudflare Pages by the Pages GitHub integration on every push to `main`, with:

- Build command: `pnpm build`
- Build output directory: `dist`

The Pages project provides the `KV` namespace binding (holding the uploaded public keys) and the `nodejs_compat` compatibility flag through its dashboard settings.
