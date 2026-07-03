# `.env` access guard (Claude Code hook)

A cross-platform Claude Code `PreToolUse` hook that **blocks all access to the real `.env` file**
(reading, editing, writing, or reading it via shell commands), while allowing `.env.example`
and other `.env.*` templates.

Why: `.env` holds live secrets. New or changed variables belong in `.env.example`, with a note
telling the human which parameter to copy into their local `.env`.

## Files

- `block-env.py` — the guard logic (pure Python 3, no dependencies, works on Windows/macOS/Linux).
- `../settings.json` — registers the hook (the `hooks.PreToolUse` block).

## Install in another project

1. Copy `block-env.py` into that project at `.claude/hooks/block-env.py`.
2. Add this block to the project's `.claude/settings.json` (merge with any existing `hooks`):

   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Read|Edit|Write|Bash",
           "hooks": [
             { "type": "command", "command": "python3 .claude/hooks/block-env.py" }
           ]
         }
       ]
     }
   }
   ```

3. Open Claude Code's `/hooks` menu once (or restart) so the config is picked up.

## Requirements & notes

- **Python 3 on `PATH`.** The command uses `python3`.
- **Windows:** if `python3` is not recognized in your terminal, change the command to `python`
  (or `py`). Everything else works as-is — forward slashes in the path are fine on Windows, and
  the command has no bash-only syntax, so it runs under both Git Bash and PowerShell.
- The path is **relative** to the project root; Claude Code runs hooks from there.

## Verify it works

Ask Claude to read `.env` — it should be denied with a message pointing you to `.env.example`.
Reading `.env.example` still works normally.

## What is / isn't blocked

| Action | Result |
|---|---|
| Read/Edit/Write a file named exactly `.env` | ❌ blocked |
| `cat`/`grep`/`head`/`sed`/… a path containing `.env` | ❌ blocked |
| `.env.example`, `.env.local`, `.env.<anything>` | ✅ allowed |
| Everything else | ✅ allowed |

The guard **fails open** on malformed hook input, so a bad payload can never break your tool pipeline.

## Known limits (by design)

- **Copying `.env` is blocked too.** `cp .env.example .env` is denied on purpose — the human
  creates the real `.env` by hand, so secrets never pass through the agent.
- **`Grep`/`Glob` aren't matched.** The hook covers `Read|Edit|Write|Bash`; the dedicated
  search tools are out of scope. This is a guardrail against accidents, not a hard
  security boundary — the real isolation layer is the sandbox (see the security lesson).
