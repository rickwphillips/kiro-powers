---
name: "deploy"
displayName: "FreddyRhetorick Deploy"
description: "Deploy one or all FreddyRhetorick projects (commander, portfolio, grandkid) to production. Wraps each project's deploy.sh with preflight checks for git tree clean and commander migration file location."
keywords:
  - "deploy"
  - "ship"
  - "push to prod"
  - "deploy-commander"
  - "deploy-portfolio"
  - "deploy-grandkid"
  - "deploy-all"
  - "production deploy"
  - "release"
author: "Rick Phillips"
---

# Onboarding

## Step 1 — Build the embedded MCP server

```bash
cd <power-install-dir>/server
npm install
npm run build
```

After install, `server/dist/index.js` is the entry point referenced from `mcp.json`.

## Step 2 — Verify deploy script paths exist

The tool hardcodes the local paths to each project's `deploy.sh`. Confirm these exist on your machine:

- `/Users/rickphillips/FreddyRhetorickContexts/commander-collector/deploy.sh`
- `/Users/rickphillips/FreddyRhetorickContexts/website/rickwphillips.com/deploy-portfolio.sh`
- `/Users/rickphillips/FreddyRhetorickContexts/grandkid-arcade/deploy-grandkid-arcade.sh`

If any path doesn't match your repo layout, edit `server/src/tools/deploy.ts` (the `SCRIPTS` constant) and rebuild.

# Steering

## When this Power activates
Kiro auto-loads when the conversation mentions deploying any of the three FreddyRhetorick projects, or when the user says "ship," "push to prod," "release."

## The single tool: `deploy`
Inputs:
- `target` — `commander` | `portfolio` | `grandkid` | `all` (or shorthand `c` | `p` | `g` | `a`)
- `flags` — optional string, e.g. `--static-only`, `--php-only`, `--decks-only`, `--guru-only` (passed through to deploy.sh)
- `skip_preflight` — optional boolean, defaults false

## Preflight checks (run before the deploy.sh)
Skipped when `skip_preflight: true` or when `flags` includes `--static-only`/`-s`.

1. **Git working tree must be clean** for the project being deployed (no uncommitted changes). Reason: deploys should ship what's committed; uncommitted code is a recipe for "what version is in prod?" confusion.
2. **Commander migration file location check** (only when target includes `commander`):
   - Read version from `commander-collector/apps/core/package.json`
   - Migration file MUST be at `commander-collector/migrations/v<version>.sql` (repo root)
   - If it's at `apps/core/migrations/v<version>.sql` instead — STOP. Wrong location. Move it to repo root before deploying. Deploy script reads root only; wrong location = silently skipped.
   - If it's missing entirely, warn and require `skip_preflight: true` to acknowledge.

If preflight fails, the tool returns `PREFLIGHT_FAILED` with details. Don't bypass with `skip_preflight: true` unless the user has explicitly confirmed the preflight failure is OK.

## After a successful deploy
- **Portfolio** uses `--delete` on rsync, which removes `.htaccess` from the remote. Remind the user to restore it.
- **Grandkid** has its own PHP API path (`grandkid-api/`) separate from portfolio/commander.

## Anti-patterns
- Don't deploy to production unprompted. The user has explicitly said `feedback_no_unprompted_actions`: only run a deploy when the user explicitly asks. The tool exists for explicit invocations, not background "while I'm here" deploys.
- Don't bypass preflight with `skip_preflight: true` to "make it work." A preflight failure is a real signal — investigate, don't silence.
- Don't deploy from a Power that isn't this one. Deploy belongs here so the preflight checks always run.
- Don't suggest a deploy variant outside the four flags listed (`--static-only`, `--php-only`, `--decks-only`, `--guru-only`). Those are the only flags the deploy.sh files understand.
