# Web App Core Boilerplate

Universal full-stack monorepo template, tuned for **AI-agent-driven
development**. The goal is **"download → fill `.env` → start coding"** — no
scaffolding, no boilerplate plumbing, no missing config.

Works for web SaaS, Telegram bots, parsers, dashboards — anything that
either talks HTTP/Postgres on the backend or renders a React UI. Every
convention is written down in `CLAUDE.md` files, so an AI agent picks the
right patterns automatically (humans benefit too).

## What's in the box

| Path | What it gives you |
|------|-------------------|
| `frontend/` | Vite 8 + React 19 + TS 6 + Tailwind v4 + shadcn/ui + TanStack Query/Table + ky + Zustand + i18next |
| `backend/` | FastAPI + async SQLAlchemy 2 + Alembic + Poetry + Docker/compose, JWT auth pre-wired |
| `docs/` | `plan.md`, `packages.md` (dependency policy), `logic/`, `deployment.md` |
| `design/` | Drop a Web Claude / Figma export here; the agent rebuilds it into `frontend/` |
| `CLAUDE.md` | Agent instructions + pointers to the per-side `CLAUDE.md` files |
| `.claude/settings.json` | Pre-approved safe commands; migrations & destructive ops require a prompt |

## Get started

You need **Node.js** (for `degit`). Pick the variant you need — each
command downloads the files **without git history** (not a fork), so the
project is yours from the first commit.

### Full stack — recommended

Frontend and backend together. Start with the frontend; the backend is
already there for when you need it (no second setup, no restructuring).

```bash
npx degit OleksandrCEO/web-app-core my-app
```

> Prefer clicks? On GitHub press **Use this template → Create a new
> repository** — same full monorepo, zero terminal.

### Single stack

Only ever need one side? Pull just that folder (flat layout):

```bash
# frontend only
npx degit OleksandrCEO/web-app-core/frontend my-app

# backend only
npx degit OleksandrCEO/web-app-core/backend my-app
```

## After downloading

1. **Open the folder** in your IDE and **initialize git** — VS Code:
   *Source Control → Initialize Repository* (or `git init`). This is a
   clean repo with no link to the template.
2. **Rename the project**: `name` in `frontend/package.json`, `name` in
   `backend/pyproject.toml`, the `<title>` in `frontend/index.html`.
3. **Create your env files** for each side you use:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
4. **Install & run** (commands work from the repo root — no `cd`):
   ```bash
   pnpm -C frontend install && pnpm -C frontend dev
   poetry -C backend install && poetry -C backend run uvicorn app.main:app --reload
   ```

Frontend dev server: `http://localhost:5173`. Backend API:
`http://localhost:8000`. See `frontend/README.md` and `backend/README.md`
for details.

## Design principles

- **No mock data, no example pages.** Skeletons only — example code just
  creates cleanup work.
- **One way to do each thing.** The approved library per concern lives in
  `docs/packages.md`; consult it before adding any dependency.
- **Conventions live in `CLAUDE.md`** so agents apply them automatically.
- **Run from the root, never `cd`.** Address a side with `-C frontend` /
  `-C backend`. Pre-approved commands in `.claude/settings.json` match
  these forms.
- **Frontend and backend are independent.** No shared package, no
  workspace tooling — the boundary is the JSON API.

## Docs

- `docs/plan.md` — phase roadmap for your project.
- `docs/packages.md` — which library to use for which job (and what *not*
  to add).
- `docs/deployment.md` — ship to an Ubuntu VPS (backend) + Cloudflare
  Pages (frontend).

## License

MIT — see [LICENSE](LICENSE).
