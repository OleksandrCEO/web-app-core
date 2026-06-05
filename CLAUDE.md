# Project — AI agent context

Two sub-projects in a monorepo:

- Backend: @backend/CLAUDE.md
- Frontend: @frontend/CLAUDE.md

Working on the backend — read `backend/CLAUDE.md`.
Working on the frontend — read `frontend/CLAUDE.md`.

Each side can also be lifted out and developed independently.

## Monorepo layout

```
.
├── backend/      # FastAPI (Python 3.12+) — optional
├── frontend/     # Vite + React 19 + TS — optional
├── docs/         # Project-wide docs (plan, logic, deployment)
├── .claude/      # Claude Code permissions (settings.json)
└── CLAUDE.md     # This file
```

Either folder can be deleted if the project doesn't need it (e.g. a pure
parser only needs `backend/`; a static SPA only needs `frontend/`).

## Conventions for every project built from this template

1. **Read the relevant sub-CLAUDE.md before touching code**, not just this
   one — domain conventions live there.
2. **Never commit secrets.** Real values go in `.env` (gitignored).
   Document required keys in `.env.example`.
3. **Migrations / destructive ops require confirmation.** See the `ask`
   list in `.claude/settings.json`.
4. **Update `docs/` when product behaviour changes**, not only the code.
   Rationale (the *why*) belongs in docs; the code shows *what*.
5. **Before adding any dependency, consult @docs/packages.md.** Prefer the
   libraries listed there; if a need isn't covered, propose one to the
   user and add a row to that file.

## Running commands (no `cd`)

Run everything **from the monorepo root**, addressing a sub-project with a
directory flag instead of `cd`:

```bash
pnpm -C frontend <script>                      # frontend
poetry -C backend run <command>                # backend
docker compose -f backend/docker-compose.yml … # backend containers
```

The pre-approved commands in `.claude/settings.json` use exactly these
forms.

## Where to put new docs

- `docs/plan.md` — phase-level roadmap. One file per project lifetime.
- `docs/packages.md` — dependency policy: approved libraries per concern.
- `docs/logic/<feature>.md` — invariants, contracts, gotchas for a
  subsystem that already exists in code. Add a row to
  `docs/logic/how-project-works-and-user-flows.md` index.
- `docs/deployment.md` — server, CI, runtime infra.
