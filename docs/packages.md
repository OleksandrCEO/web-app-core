# Packages — what to use, and what not to add

This is the **dependency policy** for this project. It exists so that the
stack stays small, consistent, and predictable for both humans and AI
agents.

## The rule

> **Before adding any dependency, check this file first.**
>
> - If a library for the job is already listed under **In the box** — use it.
> - If the need is covered under **Add when needed** — install the
>   recommended one, nothing else.
> - If nothing here fits — propose the library (and why) to the user, then
>   **add a row to this file** so the next decision is already made.

Why: every extra dependency is surface area — bugs, audits, bundle size,
and one more way to do the same thing. Two libraries that solve the same
problem is the failure mode we are avoiding.

---

## Frontend

### In the box (already installed — use these)

| Need | Library | Notes |
|------|---------|-------|
| UI components | shadcn/ui (`@base-ui/react`) | Add parts with `pnpm -C frontend dlx shadcn@latest add <name>`. Never hand-roll buttons/inputs/dialogs. |
| Styling | Tailwind CSS v4 | Utility classes only; tokens in `src/index.css`. |
| className merge | `clsx` + `tailwind-merge` via `cn()` | `import { cn } from '@/lib/utils'`. |
| Component variants | `class-variance-authority` | For variant props on shared components. |
| Icons | `lucide-react` | The only icon set. |
| Routing | `react-router` v7 | Routes in `src/app.tsx`. |
| Server state / data fetching | `@tanstack/react-query` v5 | One hook file per entity in `src/hooks/`. |
| HTTP client | `ky` | Use the wrapper `import { api } from '@/lib/api-client'`. Never raw `fetch`. |
| Client state | `zustand` | Stores in `src/stores/`. Don't reach for Redux. |
| Tables | `@tanstack/react-table` v8 | Wrap with the shared `DataTable`. |
| Forms | `react-hook-form` + `@hookform/resolvers` | |
| Validation / schemas | `zod` v4 | Also used for RHF resolvers and API typing. |
| Charts | `recharts` | |
| Notifications | `sonner` | `import { toast } from 'sonner'`. |
| Command palette | `cmdk` | |
| Animation | `framer-motion` | Use sparingly. |
| i18n | `i18next` + `react-i18next` | All user-visible strings via `t('key')`. |
| Dates | `date-fns` | Via the `formatDate` helpers in `src/lib/utils.ts`. |
| Font | `@fontsource-variable/geist` | |

### Add when needed (recommended pick, install only if the feature lands)

| Need | Recommended | Command |
|------|-------------|---------|
| File upload (UX) | `react-dropzone` | `pnpm -C frontend add react-dropzone` |
| Drag & drop / kanban | `@dnd-kit/core` | `pnpm -C frontend add @dnd-kit/core @dnd-kit/sortable` |
| Rich text editor | `@tiptap/react` | `pnpm -C frontend add @tiptap/react @tiptap/starter-kit` |
| Infinite/virtual lists | `@tanstack/react-virtual` | `pnpm -C frontend add @tanstack/react-virtual` |
| Markdown render | `react-markdown` | `pnpm -C frontend add react-markdown` |

### Do NOT add

- **axios** — we use `ky`.
- **Redux / MobX / Recoil** — we use `zustand` + react-query.
- **moment / dayjs** — we use `date-fns`.
- **Material UI / Chakra / Ant Design** — we use shadcn/ui. Mixing
  component systems breaks theming.
- **styled-components / emotion** — we use Tailwind.
- A second icon set — `lucide-react` only.

---

## Backend

### In the box (already installed — use these)

| Need | Library | Notes |
|------|---------|-------|
| Web framework | `fastapi` | Routers in `app/routers/`. |
| ASGI server | `uvicorn` | |
| ORM | `sqlalchemy` 2.0 async | `Mapped[T]` models in `app/models/`. |
| DB driver | `asyncpg` | PostgreSQL. |
| Migrations | `alembic` | Never autogenerate without user confirmation. |
| Settings | `pydantic-settings` | `app/config.py`, values from `.env`. |
| Validation / schemas | `pydantic` v2 | `*Create` / `*Read` / `*Update` in `app/schemas/`. |
| Outbound HTTP | `httpx` | Async client. Never `requests`. |
| Form / file parsing | `python-multipart` | |
| Email validation | `email-validator` | |
| Auth | built-in `app/security.py` | JWT (HS256) + scrypt. Don't add a framework. |

### Add when needed (recommended pick, install only if the feature lands)

| Need | Recommended | Command |
|------|-------------|---------|
| Background tasks / queue | `arq` (Redis) | `poetry -C backend add arq` |
| Cache / rate limit store | `redis` | `poetry -C backend add redis` |
| Telegram bot | `aiogram` | `poetry -C backend add aiogram` |
| Object storage (S3/R2) | `aioboto3` | `poetry -C backend add aioboto3` |
| Templating (emails) | `jinja2` | `poetry -C backend add jinja2` |
| Vector search / RAG | `pgvector` | `poetry -C backend add pgvector` (+ DB extension) |
| Scheduling | `apscheduler` | `poetry -C backend add apscheduler` |

### Do NOT add

- **requests** — we use `httpx`.
- **Django / Flask** — this is a FastAPI project.
- **psycopg2 (sync)** — we use async `asyncpg`.
- **passlib / bcrypt as a new dep** — hashing already lives in
  `app/security.py`.
- A second migration tool — `alembic` only.

---

## How to add a dependency

```bash
# frontend
pnpm -C frontend add <pkg>           # runtime
pnpm -C frontend add -D <pkg>        # dev only

# backend
poetry -C backend add <pkg>          # runtime
poetry -C backend add --group dev <pkg>   # dev only
```

After adding something not already listed here, **append a row** to the
relevant *Add when needed* table so the choice is locked in for next time.
