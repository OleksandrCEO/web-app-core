// Annotated copy of settings.json — keep in sync when you edit the real file.
// Comments are not allowed in real JSON, so this file is the documentation.
//
// All commands are written to run FROM THE MONOREPO ROOT, addressing the
// sub-project with a directory flag (`pnpm -C frontend`, `poetry -C backend`)
// instead of `cd`. Claude Code runs at the root and never needs to `cd`.
{
  "permissions": {
    "allow": [
      // --- Frontend (run from monorepo root) ---
      "Bash(pnpm -C frontend install)",
      "Bash(pnpm -C frontend dev)",
      "Bash(pnpm -C frontend build)",
      "Bash(pnpm -C frontend lint *)",
      "Bash(pnpm -C frontend preview)",
      "Bash(pnpm -C frontend dlx shadcn@latest add *)",

      // --- Backend (run from monorepo root) ---
      "Bash(poetry -C backend install)",
      "Bash(poetry -C backend run pytest *)",
      "Bash(poetry -C backend run mypy *)",
      "Bash(poetry -C backend run ruff check *)",

      // --- DB state checks (read-only) ---
      "Bash(poetry -C backend run alembic current)",
      "Bash(poetry -C backend run alembic heads)",
      "Bash(poetry -C backend run alembic check)",
      "Bash(poetry -C backend run alembic history *)",
      "Bash(poetry -C backend run alembic show *)",

      // --- Git read-only ---
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git show *)",
      "Bash(git branch *)"
    ],
    "ask": [
      // --- Migrations mutate the schema: always prompt ---
      "Bash(poetry -C backend run alembic revision *)",
      "Bash(poetry -C backend run alembic upgrade *)",
      "Bash(poetry -C backend run alembic downgrade *)",

      // --- Arbitrary script execution ---
      "Bash(pnpm -C frontend exec *)",
      "Bash(poetry -C backend run python *)",

      // --- Container ops affect shared state ---
      "Bash(docker compose *)",
      "Bash(docker *)"
    ],
    "deny": [
      // --- Interactive shells would hang the agent ---
      "Bash(python)",
      "Bash(poetry shell)",

      // --- Hard-to-reverse destructive ops ---
      "Bash(rm -rf /*)",
      "Bash(rm -rf /home/*)",
      "Bash(git push --force *)"
    ]
  }
}
