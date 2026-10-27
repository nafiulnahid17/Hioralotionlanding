# Deploy Hiora landing page to Cloudflare Workers

This is a **Cloudflare Worker plus Vite React frontend**, not a static Pages-only project. It serves `/api/orders` and `/api/health` from `worker/index.ts` and the storefront from Vite's assets.

## Recommended deployment: Workers Builds (Git integration)

1. Open Cloudflare dashboard > **Workers & Pages** > **Create application** > connect GitHub.
2. Select `nafiulnahid17/Hioralotionlanding` and branch `main`.
3. Set root directory to repository root (`/`).
4. Set **Build command** to `npm run build`.
5. Set **Deploy command** to `npx wrangler deploy` (**not** `npm run deploy`, because that unnecessarily repeats the build).
6. Ensure your Cloudflare Worker project is named **`hiora-product-order`**, matching `wrangler.jsonc` > `name`. If you already have a Worker under a different name, update the Wrangler name to match your actual project rather than creating an unexpected new Worker.
7. The repository pins Node **24.22.1** in `.node-version` and npm **11.19.1** in `package.json`; do not override them with older Node/npm versions in Cloudflare settings.
8. Deploy and verify `/api/health`. A response with `ok: true` means the Worker is responding; `storage: unconfigured` means the actual orders database is **not yet connected**.

Cloudflare documentation: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/

## Dependency installation troubleshooting

If the deployment fails at dependency installation:

- Open the failed deployment > **Build logs**, and find the earliest `npm ERR!`, `ERESOLVE`, `EBADENGINE`, `ETARGET`, or lockfile error.
- Make sure the build uses Node 24 and npm 11; unset any outdated Cloudflare `NODE_VERSION` override.
- Try **Retry build** after clearing the build cache, if the dashboard offers that action.
- Check the GitHub **Verify Hiora Cloudflare build** workflow for `npm ci` and `npm run build` results at https://github.com/nafiulnahid17/Hioralotionlanding/actions .
- Do not delete `package-lock.json` or turn on `--legacy-peer-deps` without confirming the actual error; that can hide incompatible dependency versions.

## Production data is not connected yet

`wrangler.jsonc` currently sets `ORDER_STORAGE_PROVIDER=unconfigured` and `ALLOW_DEMO_MODE=false`. Production checkout intentionally refuses to save orders until a database is configured. For a real launch, provision a dedicated Supabase project, apply `supabase/migrations/202610270001_create_orders.sql`, add Worker secrets `SUPABASE_URL`, `SUPABASE_SECRET_KEY` and, if used, `TURNSTILE_SECRET_KEY`; then set `ORDER_STORAGE_PROVIDER=supabase`. Never commit secret keys or expose them as `VITE_` variables.

The Hiora **admin app stays in a different repository** and should not be added here.
