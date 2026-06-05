# AI Agent Context — Backend

FastAPI / Python 3.12+ / SQLAlchemy 2.0 async / PostgreSQL (asyncpg) /
Alembic. Project-specific docs in `docs/` (see root `CLAUDE.md`).

See @docs/plan.md for the roadmap.
See @docs/logic/how-project-works-and-user-flows.md for the domain
overview and links to detailed subsystem docs.

## Commands

Run from the **monorepo root** — `-C backend` targets this sub-project, so
no `cd` is needed. (If you opened `backend/` directly, drop the `-C backend`.)

```bash
# Local Python + Poetry
poetry -C backend install
poetry -C backend run uvicorn app.main:app --reload

# Quality gate before committing
poetry -C backend run ruff check app tests
poetry -C backend run mypy
poetry -C backend run pytest

# Docker compose (full stack incl. Postgres)
docker compose -f backend/docker-compose.yml up -d
```

### Single test

```bash
poetry -C backend run pytest tests/path/to/test_file.py::test_name -v
```

## Dependencies

Before adding a library, check @../docs/packages.md — use the approved one,
don't introduce a second tool for a solved problem.

## Architecture

Entry point: `app/main.py` — creates FastAPI instance and includes all
routers.

```
app/
├── config.py          — Pydantic Settings from .env
├── database.py        — async engine, Base (DeclarativeBase), get_db() session generator
├── security.py        — JWT (HS256) + scrypt password hashing
├── dependencies.py    — get_current_active_user
├── models/            — SQLAlchemy 2.0 Mapped models (UUID PKs, __init__.py re-exports all)
├── schemas/           — Pydantic: *Create, *Read, *Update per entity
├── services/          — CRUDService[ModelT] base + per-entity services
├── routers/           — APIRouter per entity + auth + health
alembic/env.py         — migration env (all models must be imported here)
```

## Key patterns (reuse, don't reinvent)

- **New CRUD entity flow**: model → schema → service extending
  `CRUDService[Model]` → router.
- **Service singletons**: declared in `app/services/__init__.py`. Import
  as `from app.services import user_service`.
- **Auth**: `Depends(get_current_active_user)` from `app.dependencies`
  returns the current `User`.
- **Passwords**: `hash_password()` / `verify_password()` from
  `app.security`. Never store raw passwords.
- **Schema convention**: `*Create` for input, `*Read` with
  `ConfigDict(from_attributes=True)` for output, `*Update` with all
  Optional fields.
- **DB commit pattern**: services only `flush()` — routers call
  `await db.commit()` after mutations.

## Migrations

See `alembic/README.md` for the full reference.

- **NEVER** generate or run Alembic migrations automatically — only when
  the user explicitly confirms.
- After ANY model changes (new models, renamed/added/removed columns,
  changed FKs), PROACTIVELY ask the user: "Створити міграцію для [list of
  changes]?" — make it a clear actionable question, not a passing
  mention.

## Gotchas (must-do checklist when adding entities)

- MUST import new models in `alembic/env.py` — Alembic won't detect them otherwise.
- MUST export new models in `app/models/__init__.py`.
- MUST export new schemas in `app/schemas/__init__.py`.
- MUST create a service singleton and export it in `app/services/__init__.py`.
- MUST include new routers in `app/main.py` via `app.include_router(...)`.

## Code style

- Type-annotate all functions.
- Prefer `Mapped[T]` syntax for SQLAlchemy models.
- No comments explaining *what* — code already shows that. Add a comment
  only when *why* is non-obvious.
- Line length 100 (ruff-enforced).
