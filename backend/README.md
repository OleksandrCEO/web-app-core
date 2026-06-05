# Backend

FastAPI + async SQLAlchemy 2 + PostgreSQL + Alembic. Project-agnostic
skeleton — pick what you need, drop what you don't.

## Setup

```bash
# 1. Install Python deps
poetry install

# 2. Copy env and fill values
cp .env.example .env
$EDITOR .env

# 3. Create DB (one-time)
createdb $(grep ^DB_NAME .env | cut -d= -f1)

# 4. Run migrations
poetry run alembic upgrade head

# 5. Start dev server
poetry run uvicorn app.main:app --reload
```

API is on `http://localhost:8000`. Health check: `GET /health`.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | FastAPI |
| Python | 3.12+ |
| ORM | SQLAlchemy 2.0 async (asyncpg) |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| HTTP client | httpx |
| Lint | ruff |
| Type check | mypy |
| Tests | pytest + pytest-asyncio |
| Auth | JWT (HS256, custom impl in `app/security.py`) + scrypt passwords |
| Package manager | Poetry |
| Container | Docker (multi-stage) + Compose with Postgres |

## Project structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI entry, mounts routers
│   ├── config.py                  # Pydantic Settings from .env
│   ├── database.py                # async engine, Base, get_db()
│   ├── security.py                # JWT + scrypt password hashing
│   ├── dependencies.py            # get_current_active_user
│   ├── models/                    # SQLAlchemy models
│   │   └── __init__.py            # re-export every model here
│   ├── schemas/                   # Pydantic *Create / *Read / *Update
│   │   └── __init__.py
│   ├── services/                  # business logic, CRUDService[Model]
│   │   ├── __init__.py            # singleton service instances
│   │   └── crud.py                # generic CRUDService base
│   └── routers/                   # one APIRouter per entity
│       ├── __init__.py
│       └── health.py
├── alembic/
│   ├── env.py                     # MUST import every model
│   ├── script.py.mako
│   ├── versions/
│   └── README.md
├── tests/
│   └── test_health.py
├── scripts/                       # ad-hoc CLI scripts
├── pyproject.toml
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
├── docker-compose.override.yml    # local overrides (gitignored if needed)
├── entrypoint.sh
├── .env.example
├── .dockerignore
└── .gitignore
```

## Adding a new entity

1. Create the model in `app/models/<entity>.py`.
2. **Export it in `app/models/__init__.py`** and **import it in `alembic/env.py`**.
3. Add Pydantic schemas in `app/schemas/<entity>.py` and export.
4. Add a service in `app/services/<entity>.py`: `class XService(CRUDService[X])`.
   Declare a singleton in `app/services/__init__.py`.
5. Add a router in `app/routers/<entity>.py`. Include it in `app/main.py`.
6. **Ask the user** before running `alembic revision --autogenerate`.

## Commands

Commands below assume you are **inside `backend/`**. From the monorepo
root, prefix with `poetry -C backend` (and `docker compose -f
backend/docker-compose.yml`).

| Command | What it does |
|---------|--------------|
| `poetry run ruff check app tests` | lint |
| `poetry run mypy` | type check |
| `poetry run pytest` | full test suite |
| `poetry run pytest tests/test_health.py -q` | smoke test only |
| `poetry run alembic upgrade head` | apply migrations |
| `poetry run alembic revision --autogenerate -m "desc"` | new migration |
| `docker compose up -d` | local DB + app |
