# Coolify deployment

Use the repository `docker-compose.yml` as the Coolify Docker Compose file.
Do not enable the `vps`, `demo`, or `tools` Compose profiles.

Coolify should expose these services through its own proxy:

| Service | Port | Domain |
| --- | ---: | --- |
| `app` | `3000` | `https://your-domain.example` |
| `minio` | `9000` | `https://storage.your-domain.example` |

Coolify terminates TLS. Set these variables in the Coolify environment:

```env
NODE_ENV=production
DOMAIN=your-domain.example
NEXT_PUBLIC_APP_URL=https://your-domain.example
BETTER_AUTH_URL=https://your-domain.example
TRUST_PROXY_HEADERS=true
DEMO_MODE=false
MINIO_PUBLIC_URL=https://storage.your-domain.example
POSTGRES_URL=postgresql://postgres:<password>@postgres:5432/metrikmedia
REDIS_URL=redis://redis:6379
```

Also set unique values for `BETTER_AUTH_SECRET`, `CRON_SECRET`, the
PostgreSQL and MinIO credentials, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and either
SMTP credentials or `RESEND_API_KEY`. Never use `.env.docker` in Coolify.

Attach persistent storage to the named Compose volumes:

- `postgres_data` → PostgreSQL data
- `redis_data` → Redis data
- `minio_data` → uploaded media

The `db-migrate` and `db-seed` services are one-shot jobs and must finish with
exit code 0 before `app` starts. `db-seed` is idempotent and preserves the
existing admin password on subsequent deployments.

After deployment, verify:

```text
https://your-domain.example/api/health/live
https://your-domain.example/api/health
```

The first endpoint checks process health. The second must report database and
Redis as healthy. Run the public smoke checks with the deployed URL:

```powershell
$env:SMOKE_BASE_URL="https://your-domain.example"
pnpm smoke
```

Do not run `deploy.sh` inside Coolify. That script is for a host-managed VPS
deployment and enables the `vps` profile, which starts Caddy on ports 80 and
443. Coolify already owns those ports through its reverse proxy.
