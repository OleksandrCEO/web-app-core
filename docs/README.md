# docs/

Project-wide documentation. Everything the code can't tell you on its own:
the *why*, the constraints, the deals with stakeholders, the rationale
behind design choices.

## Files

- **`plan.md`** — phase-level roadmap. One file per project lifetime.
  Mark phases as DONE / current / future. Don't delete completed ones.
- **`deployment.md`** — production server, CI, runtime infra, secrets
  rotation.
- **`logic/`** — one file per subsystem. Invariants, contracts, gotchas.
  Add a row to `logic/how-project-works-and-user-flows.md` for every new
  file so agents can find it.

## What belongs here vs. in code comments

| Goes in docs/ | Goes in code |
|---------------|--------------|
| Why we picked approach X over Y | What this function does (use clear names instead) |
| Stakeholder agreements, deadlines | Implementation details |
| Cross-cutting invariants | Per-line logic |
| Operational runbooks | Loop control flow |

If a future agent would need it to make a judgment call, write it here.
If a current reader can read it from the code itself, don't.
