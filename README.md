# Hiora — APLB Product Order

A production-oriented, mobile-first ordering page for **APLB Glutathione Niacinamide Body Lotion 300ml**. The public customer experience is intentionally a standalone application; it contains no admin routes, admin UI, or admin authentication.

## What works now

- Responsive premium product page, ingredient accordion, delivery and payment selection
- Bangladesh mobile-number validation and accessible inline errors
- Server-trusted pricing with offer expiry at `2026-12-01T00:00:00+06:00`
- Inside Dhaka (`৳80`) and Outside Dhaka (`৳150`) calculations
- Cloudflare Worker endpoints: `GET /api/health`, `GET /api/config/public`, `POST /api/orders`
- Server validation, best-effort per-isolate throttling, idempotency keys, optional Turnstile verification
- Clearly labelled development demo mode
- Supabase repository and secure SQL migration with RLS and no anonymous table access
- Accessible success dialog shown only after the selected repository confirms the write

## Local development

Requirements: a current Node.js LTS release and npm.

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

`.dev.vars.example` enables a development-only in-memory mock repository. Start Vite with `VITE_DEMO_MODE=true npm run dev` to display and use the explicitly labelled demo checkout. Demo orders are not durable and must never be represented as production orders.

Run verification:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Connect Supabase later

1. Create the Supabase project only when authorized.
2. Apply `supabase/migrations/202610270001_create_orders.sql`.
3. Add Worker secrets (never use `VITE_` prefixes for secrets):

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SECRET_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

4. Set `ORDER_STORAGE_PROVIDER=supabase` and `ENVIRONMENT=production` in the Worker environment.
5. Set the public `VITE_TURNSTILE_SITE_KEY` at build time when the Turnstile widget is connected.
6. Keep `ALLOW_DEMO_MODE=false` in production.

`SUPABASE_PUBLISHABLE_KEY` is reserved for future public client needs and is not required by the current checkout. The current order path uses only the server-side secret in the Worker.

## Production safety

- When Supabase is unconfigured, production `POST /api/orders` returns `503`; form values remain in the browser.
- The client never submits prices or totals. The Worker recalculates every amount from trusted configuration.
- bKash and Nagad are selection-only. Payment status is always created as `pending`.
- No public endpoint reads customer orders.
- The mock repository is accepted only when the request is explicitly marked as demo, `ALLOW_DEMO_MODE=true`, and `ENVIRONMENT` is not `production`.

For stronger distributed rate limiting, bind Cloudflare's Rate Limiting API or a Durable Object before a high-volume advertising launch. The included guard is a lightweight additional safeguard, not a global rate limiter.

## Build and Cloudflare deployment

```bash
npm run build
npm run deploy
```

The app uses the official Cloudflare Vite plugin and `wrangler.jsonc`. Static assets are served by Cloudflare, `/api/*` is routed through the Worker first, and SPA fallback is enabled. Add a custom domain only after its final value is known.

## Product configuration

Edit `src/config/products.ts` for public product copy, prices, expiry, ingredients, and delivery fees. The Worker has a separate trusted constant in `worker/routes/orders.ts`; update both together and keep tests passing before deployment.

Before a production launch, verify the ingredient list against the physical carton because manufacturer formulations may change.
