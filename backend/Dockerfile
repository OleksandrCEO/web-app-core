FROM python:3.13-slim AS builder

RUN pip install --no-cache-dir poetry==2.1.3

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN poetry config virtualenvs.in-project true && \
    poetry install --only main --no-interaction --no-ansi --no-root

# --- runtime ---
FROM python:3.13-slim

RUN groupadd --gid 1000 app && \
    useradd --uid 1000 --gid app --no-create-home app

WORKDIR /app

COPY --from=builder /app/.venv .venv
COPY alembic.ini .
COPY alembic/ alembic/
COPY app/ app/
COPY entrypoint.sh .

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

USER app

EXPOSE 8000

ENTRYPOINT ["sh", "entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
