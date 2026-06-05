## Alembic — DB migrations

DB URL is taken from `app/config.py` (Settings → `.env`), **not** from
`alembic.ini`. The `sqlalchemy.url` in `alembic.ini` is a placeholder.

Every model must be imported in `alembic/env.py` — otherwise
`--autogenerate` will not see it.

### Hot commands

```bash
# New migration from the model diff
poetry run alembic revision --autogenerate -m "desc"

# Apply migrations to head
poetry run alembic upgrade head
```

> When working with an AI agent: NEVER run `revision` / `upgrade` /
> `downgrade` without explicit user confirmation. They mutate state.

### Inspection (safe / read-only)

```bash
poetry run alembic current      # current DB revision
poetry run alembic heads        # latest available revisions
poetry run alembic check        # diff models vs DB without writing a file
poetry run alembic history      # full revision history
```

### Move around

```bash
poetry run alembic upgrade +1
poetry run alembic downgrade -1
poetry run alembic downgrade <revision_id>
poetry run alembic downgrade base   # drops everything
```

After `--autogenerate`, **always read** the file in `alembic/versions/` —
autogen is not perfect, especially for:
- column renames (sees them as drop + add),
- type changes,
- data migrations (it never generates them).
