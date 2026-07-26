# Vees — Supabase → plain Postgres cutover

**Shape:** A — shimmed `@supabase/supabase-js` → plain PG  
**Repo:** `katalambano878/vees`  
**Branch:** `staging/plain-postgres`  
**Coolify prod:** `vees-app` (`s5mb1bk76i19k6lhpgyumk1l`)  
**Coolify staging:** `vees-staging` (`deul5ifgzxupinrijpbc8sn1`)  
**Production:** https://vees.169-58-8-203.sslip.io (update when custom domain is wired)  
**DB:** `fleet-postgres` / `vees`

## Env cutover trio

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | `postgresql://…@fleet-postgres:5432/vees` |
| `NEXT_PUBLIC_USE_PLAIN_PG` | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` | App origin (currently sslip host in Coolify) |

## Hardening notes (Jul 2026)

- [x] `images.unoptimized`; drop Supabase/placeholder remotePatterns
- [x] Service worker `sw-v2.5-vees`
- [x] `lib/format-money.ts` + error boundaries
- [x] Payment/admin/cron APIs → `supabaseAdmin`
- [x] Order history Track / Reorder / Invoice / Help; hide Bulk Restock stub

## Verify

```bash
BASE=https://vees.169-58-8-203.sslip.io
ssh big-vps "sudo docker ps --format '{{.Image}} {{.Status}}' | grep s5mb1bk"
curl -s "$BASE/service-worker.js" | head -n 3
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/" "$BASE/shop"
```
