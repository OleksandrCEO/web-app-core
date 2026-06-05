# Frontend — AI agent context

React 19 / TypeScript 6 / Vite 8 / Tailwind CSS v4 / shadcn/ui (base-nova,
@base-ui/react) / ky 2 / Zustand / TanStack Query v5 / TanStack Table v8 /
React Router v7 / Recharts / i18next / date-fns / sonner / zod 4.

See @README.md for setup, commands, and full file structure.

## Architecture

- `src/lib/api-client.ts` — ky instance with JWT interceptor (auto-refresh on 401).
- `src/stores/auth.ts` — Zustand auth store (persisted to localStorage as `auth-storage`).
- `src/hooks/` — React Query hooks per entity (one file per entity, with a query-key factory).
- `src/components/ui/` — shadcn/ui primitives (never write custom buttons / inputs / dialogs).
- `src/components/shared/` — reusable widgets: DataTable, StatCard, EmptyState, SearchInput, etc.
- `src/pages/` — page components (mirror your route tree).
- `src/app.tsx` — React Router config. `src/main.tsx` — providers (QueryClient, Tooltip, i18n, Toaster).

## Key utilities — always prefer these

- `import { cn } from '@/lib/utils'` — className merge (never manual concat).
- `import { formatDate, formatRelativeDate, formatCurrency } from '@/lib/utils'` — formatters (never raw date-fns in components).
- `import { api } from '@/lib/api-client'` — HTTP client (never raw ky or fetch).
- `import { queryClient } from '@/lib/query-client'` — for `invalidateQueries` in mutations.
- `import { useAuthStore } from '@/stores/auth'` — auth state (never touch localStorage directly).
- `import { toast } from 'sonner'` — notifications in mutations.

## Gotchas

- shadcn/ui here uses `@base-ui/react` primitives, NOT Radix. `asChild` doesn't exist — use `render` prop:
  `<PopoverTrigger render={<Button />}>`.
- ky v2 hooks use destructured state: `({ request, response })`, not positional args.
  The option is `prefix`, not `prefixUrl`.
- TypeScript 6+: `baseUrl` in tsconfig is deprecated — use only `paths` without `baseUrl`.
- All user-visible strings go through `t('key')` from react-i18next.
- `noUnusedLocals` and `noUnusedParameters` are on — clean unused imports before build.

## Commands

Run from the **monorepo root** (`-C frontend` targets this sub-project, no
`cd`). If you opened `frontend/` directly, drop the `-C frontend`.

- `pnpm -C frontend dev` — dev server (port 5173, API proxied to localhost:8000)
- `pnpm -C frontend build` — typecheck + production build
- `pnpm -C frontend lint` — ESLint
- `pnpm -C frontend dlx shadcn@latest add <component>` — add a shadcn component

## Dependencies

Before adding a library, check @../docs/packages.md — use the approved one,
don't introduce a second tool for a solved problem.

## Building from a design

If `../design/` holds a design export, **reconstruct** it into this stack
(React + TS + Tailwind) — don't copy the raw files. The full algorithm is
in the root `CLAUDE.md` → *Design source*.

## Conventions

- Named exports, one component per file, kebab-case file names.
- Components under 200 lines — extract sub-components when growing.
- Mutations: `toast.success` / `toast.error` + `queryClient.invalidateQueries`.
- Tables: wrap TanStack Table with the project `DataTable` shared component.
- Empty states: `EmptyState` with Lucide icon + i18n key.
- Loading: skeleton components everywhere, never blank screens.
