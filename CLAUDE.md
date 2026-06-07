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
6. **Before editing any `CLAUDE.md`** (this file or a sub-project's), read
   @docs/claude.md first — the guide on how to write effective agent docs
   (instruction budget, orchestrator pattern, what to include/exclude) —
   and apply its rules to your edit.

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

## Design source (`design/`)

`design/` holds visual references — a Web Claude (Artifacts) export, Figma
output, screenshots, HTML/CSS mockups. It is a **spec, not shippable
code**: those files use in-browser Babel, global-scope React, plain CSS,
and authoring helpers (tweaks panel, `<image-slot>` web component) — none
of which belong in this stack.

When asked to "build / implement the design", reconstruct it — never copy
the raw files into `frontend/src`:

1. **Read everything in `design/`.** Screenshots are the visual ground
   truth; the JSX/HTML gives structure and the exact copy; the CSS gives
   colors, fonts, spacing, radius, shadows.
2. **Lift the design tokens** (palette, typography, radius, shadows) into
   the Tailwind theme variables in `frontend/src/index.css`.
3. **Rebuild section by section** as React + TypeScript components under
   `frontend/src/` (`components/` + `pages/`), styled with Tailwind and the
   project's shadcn/ui primitives. Match layout, spacing, copy, and feel.
4. **Translate, don't transplant:** plain CSS → Tailwind classes;
   `<image-slot>` → a normal `<img>` / asset; drop the tweaks panel (it was
   an authoring tool, not part of the product).
5. Keep all user-visible strings going through i18n (`t('key')`).

## Where to put new docs

- `docs/plan.md` — phase-level roadmap. One file per project lifetime.
- `docs/packages.md` — dependency policy: approved libraries per concern.
- `docs/logic/<feature>.md` — invariants, contracts, gotchas for a
  subsystem that already exists in code. Add a row to
  `docs/logic/how-project-works-and-user-flows.md` index.
- `docs/deployment.md` — server, CI, runtime infra.
