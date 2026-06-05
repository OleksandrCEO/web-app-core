# design/

Visual references for this project — **not shippable code**.

Drop your design export here: a Web Claude (Artifacts) bundle, a Figma
export, screenshots, or HTML/CSS mockups. Anything that shows how the
product should *look and read*.

A typical Web Claude export contains:

- `*.html` — page markup and copy
- `*.jsx` — section components (in-browser Babel, global scope — **not**
  ES modules)
- `*.css` — design tokens (palette, fonts, radius, shadows) and component
  styles (plain CSS, **not** Tailwind)
- `screenshots/` — the rendered look (the visual ground truth)
- authoring helpers like a tweaks panel or an `<image-slot>` web component
  — these belong to the design tool, not to the product

## How this is used

This folder is a **spec**, like a brief or a technical document. The code
here is never imported into `frontend/`. Instead, an agent reads it and
**rebuilds** the design properly into the project's stack (React +
TypeScript + Tailwind). See the *Design source* section in the root
`CLAUDE.md` for the exact reconstruction algorithm.

> Large exports (many screenshots) can be heavy. If you don't want them in
> git history, add `design/` to `.gitignore` — the agent only needs them
> present locally while building.
