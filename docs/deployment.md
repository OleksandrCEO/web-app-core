# Deployment

How this project ships to production. Two independent pieces:

| Piece | Where | Why |
|-------|-------|-----|
| **Backend** (FastAPI + Postgres) | Ubuntu VPS via Docker Compose | One box runs the API and the DB; migrations apply on boot. |
| **Frontend** (static SPA) | Cloudflare Workers (Static Assets) | Free global CDN, auto-build from git, instant rollbacks. |

The frontend is just static files that call the backend over HTTPS, so the
two deploy separately and never block each other.

---

## Backend → Ubuntu VPS

### One-time server setup

```bash
# 1. Install Docker + compose plugin (official convenience script)
curl -fsSL https://get.docker.com | sh

# 2. Get the code onto the server
git clone https://github.com/<you>/<your-repo>.git app
cd app/backend

# 3. Production secrets — never commit this file
cp .env.example .env
nano .env          # strong DB_PASSWORD, JWT secret, CORS origin, etc.
```

### Start (and update) the stack

`docker-compose.override.yml` is **local-only** (it exposes Postgres for
your dev machine), so on the server run with the base file explicitly:

```bash
docker compose -f docker-compose.yml up -d --build
```

The `entrypoint.sh` runs `alembic upgrade heads` automatically before the
API starts, so the schema is always current. To deploy a new version:

```bash
git pull
docker compose -f docker-compose.yml up -d --build
```

That's the whole update loop — two commands, idempotent.

### HTTPS (reverse proxy)

The API listens on `:8000`. Put a reverse proxy in front for TLS. **Caddy**
is the convenient universal choice — automatic Let's Encrypt certificates,
one-line config:

```caddyfile
# /etc/caddy/Caddyfile
api.example.com {
    reverse_proxy localhost:8000
}
```

```bash
sudo apt install caddy && sudo systemctl reload caddy
```

(nginx + certbot works too if you already run nginx.)

### Firewall

Expose only what's needed — Postgres stays internal to the Docker network:

```bash
sudo ufw allow 22,80,443/tcp && sudo ufw enable
```

---

## Frontend → Cloudflare Workers (Static Assets)

The frontend ships as static assets on Cloudflare Workers. `frontend/wrangler.jsonc`
is already in the repo; a step-by-step prompt lives in `docs/deploy/cloudflare.md`.

### Option A — connect the repo (recommended)

In the Cloudflare dashboard: **Workers & Pages → Create application → Connect
to Git**, then set:

| Setting | Value |
|---------|-------|
| Project name | must match `name` in `frontend/wrangler.jsonc` |
| Build command | `pnpm install && pnpm build` |
| Deploy command | `pnpm wrangler deploy` |
| Path (advanced) | `frontend` |
| Environment variable | `VITE_API_URL=https://api.example.com` |

Every push to `main` rebuilds and deploys automatically; previous
deployments are one-click rollbacks.

### Option B — CLI

```bash
pnpm -C frontend build
pnpm -C frontend wrangler deploy
```

### Wire the SPA to the API

In dev, Vite proxies `/api` to the backend (see `vite.config.ts`). In
production the SPA is served from Cloudflare, so it must call the backend's
public URL directly:

1. Set `VITE_API_URL` (above); `src/lib/api-client.ts` already reads it
   (`import.meta.env.VITE_API_URL ?? '/api'`).
2. On the backend, `CORSMiddleware` already allows `settings.frontend_url`
   (`app/main.py` / `app/config.py`) — set `FRONTEND_URL` to the Cloudflare
   domain.

---

## Required secrets

See `backend/.env.example` and `frontend/.env.example` for the full list.
Production values live only on the server / in Cloudflare env — never in git.

## Rollback

- **Frontend:** redeploy a previous version in the Cloudflare Workers & Pages dashboard.
- **Backend:** `git checkout <previous-tag> && docker compose -f
  docker-compose.yml up -d --build`. If a migration must be undone, run
  `alembic downgrade -1` deliberately (it is never automatic).
