# Operations

## Local Docker Test

Use the development environment file. It uses local-only credentials, skips production email validation, creates the MinIO bucket, and runs repeatable database migrations automatically:

```powershell
docker compose --env-file .env.docker --profile vps up -d --build
docker compose --env-file .env.docker --profile vps ps
```

Open `http://localhost`. Caddy is the only published application entrypoint; PostgreSQL, Redis, MinIO, and the Next.js port stay on the internal Docker network. The app waits for PostgreSQL, Redis, MinIO, the bucket initializer, and the migration runner. View logs with:

```powershell
docker compose --env-file .env.docker --profile vps logs -f app db-migrate
```

Stop the local stack with:

```powershell
docker compose --env-file .env.docker --profile vps down
```

Do not use `.env.docker` for production. Production requires `NODE_ENV=production`, unique secrets, and SMTP or Resend configuration.

## Production Operations

Create a VPS-only `.env` from `.env.example`; never use `.env.docker` in production. It must contain production values for `NODE_ENV`, `DOMAIN`, `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET`, `CRON_SECRET`, `POSTGRES_URL` (using the Docker service name `postgres`), `REDIS_URL` (using `redis`), `MINIO_PUBLIC_URL`, database credentials, MinIO credentials, and either SMTP or Resend. The production container runs dependency validation before starting Next.js and fails closed when required services are unavailable.

Deploy from the repository root:

```bash
chmod +x deploy.sh
ENV_FILE=.env ./deploy.sh
```

The script validates the rendered Compose configuration, builds the app and migration images, starts the dependency services, runs the migration service through Compose, and waits for all healthchecks. It fails if the migration or application startup fails. Do not expose ports `3000`, `5432`, `6379`, `9000`, or `9001` publicly; only `80` and `443` are published.

Use Docker Compose for PostgreSQL, Redis, MinIO, and the application. Caddy terminates HTTPS; point Cloudflare DNS to the server and keep SSL mode set to Full (strict). Set `DOMAIN`, `NEXT_PUBLIC_APP_URL`, `MINIO_PUBLIC_URL`, SMTP/Resend credentials, and unique secrets in the deployment environment.

Set `TRUST_PROXY_HEADERS=true` only when the app is reachable exclusively through a trusted Caddy/Cloudflare proxy. This Compose setup keeps port 3000 internal, so production uses `true`.

Back up PostgreSQL daily with `POSTGRES_URL=... BACKUP_DIR=/secure/backups/postgres ./scripts/backup-postgres.sh` and MinIO with `MINIO_ALIAS=... MINIO_ACCESS_KEY=... MINIO_SECRET_KEY=... MINIO_BUCKET=... BACKUP_DIR=/secure/backups/minio ./scripts/backup-minio.sh`. Retain daily backups for 30 days and test a restore monthly. Store backups outside the application host. Schedule `/api/cron/publish-scheduled` with an authenticated `CRON_SECRET` bearer token.

For PostgreSQL restore, use `pg_restore --clean --if-exists --dbname="$POSTGRES_URL" backup.dump` against a maintenance database after taking a safety snapshot. For MinIO restore, use `mc mirror backup-directory alias/bucket` and verify object counts before switching traffic.

The production Compose stack bootstraps access control and the configured admin
account only; it does not insert demo articles. Demo fixtures are opt-in and
must never be enabled on a production database:

```bash
docker compose --env-file .env --profile demo run --rm db-demo-seed
```

After deployment, verify `/api/health/live` for process health and `/api/health`
for database/Redis readiness. A successful image build alone is not a production
readiness signal.

## Coolify

For Coolify, use `docker-compose.yml` without the `vps`, `demo`, or `tools`
profiles. Coolify routes the `app` service on port `3000` and the `minio`
service on port `9000`; set `MINIO_PUBLIC_URL` to the public MinIO domain.
Coolify terminates TLS, so keep `TRUST_PROXY_HEADERS=true` and do not start the
Caddy profile. See `docs/coolify-deployment.md` for the required environment,
persistent volumes, and smoke checks.
