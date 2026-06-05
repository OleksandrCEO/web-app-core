# Frontend

Vite + React 19 + TypeScript 6 + Tailwind v4 + shadcn/ui (base-nova).
Pre-wired auth flow (JWT with auto-refresh), data fetching, i18n, theme
switcher, toaster, and a folder layout that scales.

## Setup

```bash
pnpm install

cp .env.example .env

pnpm dev
```

Dev server: `http://localhost:5173`. API is proxied to
`http://localhost:8000` via the `/api` prefix (see `vite.config.ts`).

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Package manager | pnpm |
| Routing | React Router v7 |
| Data fetching | TanStack Query v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form + Zod 4 |
| Auth state | Zustand (persisted to localStorage) |
| HTTP client | ky 2 (JWT interceptor) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (base-nova, `@base-ui/react`) |
| Charts | Recharts |
| Notifications | sonner |
| Icons | Lucide React |
| i18n | i18next + react-i18next |
| Date formatting | date-fns |

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (port 5173) |
| `pnpm build` | TypeScript check + production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm dlx shadcn@latest add <name>` | Add a new shadcn/ui component |

## Structure

```
src/
├── main.tsx                    # Providers: QueryClient, Tooltip, i18n, Toaster
├── app.tsx                     # React Router config
├── index.css                   # Tailwind + theme tokens (light + dark)
│
├── types/
│   └── api.ts                  # All API TypeScript interfaces
│
├── lib/
│   ├── api-client.ts           # ky instance with JWT auto-refresh
│   ├── query-client.ts         # TanStack Query defaults
│   ├── utils.ts                # cn(), formatDate(), formatCurrency()
│   └── i18n.ts                 # i18next config
│
├── stores/
│   └── auth.ts                 # Zustand: tokens, user
│
├── hooks/                      # one file per entity, query-key factories
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (add with pnpm dlx shadcn@latest add ...)
│   ├── shared/                 # DataTable, StatCard, EmptyState, ...
│   ├── auth/
│   │   └── protected-route.tsx
│   └── layout/
│
├── pages/
│
└── locales/
    ├── en/translation.json
    └── uk/translation.json
```

## Adding an API entity

1. Add TypeScript interfaces in `src/types/api.ts`.
2. Create a hook in `src/hooks/use-<entity>.ts` with a query-key factory.
3. Use `api` from `@/lib/api-client` and `queryClient` from `@/lib/query-client`.
4. Add `toast.success` / `toast.error` for mutations.
5. Add i18n keys for any user-visible strings.

## Adding a page

1. Create the component in `src/pages/`.
2. Register the route in `src/app.tsx`.
3. Add navigation entry where it belongs (sidebar, header, etc.).
4. Add i18n keys.

## i18n

Default language is detected from `localStorage` → browser → `en` fallback.
To add a language, create `src/locales/<lang>/translation.json` and add
it to the resources in `src/lib/i18n.ts`. Update the `SUPPORTED_LANGUAGES`
tuple too.

## Theme

Light and dark theme tokens live in `src/index.css` as oklch CSS variables
(`:root` for light, `.dark` for dark). Theme mode is persisted in
`localStorage` under `theme-storage` (Zustand). Switching is applied
before React renders to avoid FOUC (see `main.tsx`).
