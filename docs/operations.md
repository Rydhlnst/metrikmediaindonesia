# Operations

## Local Docker Test

Use the development environment file. It uses local-only credentials, skips production email validation, creates the MinIO bucket, and runs repeatable database migrations automatically:

```powershell
docker compose --env-file .env.docker up -d --build
docker compose --env-file .env.docker ps
```

Open `http://localhost:3000`. The app waits for PostgreSQL, Redis, MinIO, the bucket initializer, and the migration runner. View logs with:

```powershell
docker compose --env-file .env.docker logs -f app db-migrate
```

Stop the local stack with:

```powershell
docker compose --env-file .env.docker down
```

Do not use `.env.docker` for production. Production requires `NODE_ENV=production`, unique secrets, and SMTP or Resend configuration.

## Production Operations

Run `pnpm validate:production` before deployment. It requires unique `BETTER_AUTH_SECRET`, `CRON_SECRET`, `POSTGRES_URL`, `REDIS_URL`, PostgreSQL, Redis, MinIO, and either SMTP or Resend. The production container runs the same validation before starting Next.js and fails closed when required dependencies are unavailable.

Use Docker Compose for PostgreSQL, Redis, MinIO, and the application. Caddy terminates HTTPS; point Cloudflare DNS to the server and keep SSL mode set to Full (strict). Set `DOMAIN`, `NEXT_PUBLIC_APP_URL`, `MINIO_PUBLIC_URL`, SMTP/Resend credentials, and unique secrets in the deployment environment.

Set `TRUST_PROXY_HEADERS=true` only when the app is reachable exclusively through a trusted Caddy/Cloudflare proxy. Keep it `false` when port 3000 is directly exposed.

Back up PostgreSQL daily with `POSTGRES_URL=... BACKUP_DIR=/secure/backups/postgres ./scripts/backup-postgres.sh` and MinIO with `MINIO_ALIAS=... MINIO_ACCESS_KEY=... MINIO_SECRET_KEY=... MINIO_BUCKET=... BACKUP_DIR=/secure/backups/minio ./scripts/backup-minio.sh`. Retain daily backups for 30 days and test a restore monthly. Store backups outside the application host. Schedule `/api/cron/publish-scheduled` with an authenticated `CRON_SECRET` bearer token.

For PostgreSQL restore, use `pg_restore --clean --if-exists --dbname="$POSTGRES_URL" backup.dump` against a maintenance database after taking a safety snapshot. For MinIO restore, use `mc mirror backup-directory alias/bucket` and verify object counts before switching traffic.
