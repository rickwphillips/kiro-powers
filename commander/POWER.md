---
name: "commander"
displayName: "Commander Collector"
description: "Project context and version-status tooling for the Commander Collector MTG game-tracking app. Loads architecture/conventions on demand, and exposes a `cc_status` tool that compares the local package.json version against the dev and prod databases."
keywords:
  - "commander collector"
  - "commander-collector"
  - "mtg deck tracker"
  - "magic the gathering tracker"
  - "cc-status"
  - "commander status"
  - "commander deck"
  - "stat panels"
  - "comparison panel"
  - "mana symbol"
author: "Rick Phillips"
---

# Onboarding

## Step 1 — Install dependencies and build the embedded MCP server

This Power ships with its own MCP server. Build it once before first use:

```bash
cd <power-install-dir>/server
npm install
npm run build
```

After install, `server/dist/index.js` is the entry point referenced from `mcp.json`.

## Step 2 — Create the connections config

The `cc_status` tool reads from two MySQL connections (`commander_dev` and `commander_prod`). Create a config file at:

```
~/.config/kiro-powers/commander/config.json
chmod 600
```

Format:

```json
{
  "connections": {
    "commander_dev": {
      "host": "127.0.0.1",
      "port": 3306,
      "user": "<dev_user>",
      "password": "<dev_password>",
      "database": "commander_collector"
    },
    "commander_prod": {
      "host": "127.0.0.1",
      "user": "<prod_user>",
      "password": "<prod_password>",
      "database": "rickwphi_app_commander"
    }
  }
}
```

The server reads this path by default. Override with the `KIRO_COMMANDER_CONFIG` env var if you want it elsewhere.

## Step 3 — Set the package.json path

When invoking `cc_status`, pass the absolute path to Commander Collector's `apps/core/package.json` as the `package_json_path` argument. Example:

```
/Users/<you>/FreddyRhetorickContexts/commander-collector/apps/core/package.json
```

# Steering

## When this Power activates
Kiro auto-loads this Power when the conversation mentions Commander Collector, MTG game tracking, deck tracking, mana symbols, comparison panels, stat panels, or `cc-status`. The project-context resource (`commander://project-context`) becomes part of the agent's context; the `cc_status` tool becomes callable.

## Workflow: checking version status
When the user asks "what's the version gap" / "is dev behind prod" / "what does cc-status say" — call `cc_status` with the absolute package.json path. The tool returns:

- `local_version` — what's in `package.json`
- `envs.commander_dev.releases[0].version` — newest release recorded in dev DB
- `envs.commander_prod.releases[0].version` — newest release recorded in prod DB
- `gap.package_vs_dev`, `gap.package_vs_prod`, `gap.dev_vs_prod` — text descriptions of any mismatches (null when aligned)

Surface the gap fields verbatim. If any `errors` are populated, surface them too — DB connection failure is the usual cause.

## Workflow: needing project context
When the user asks how something works in the Commander Collector codebase, defer to the loaded resource (`commander://project-context`). Don't grep the repo for things the resource already documents (stat sections, ManaSymbol layout, PHP API pattern, deploy aliases). Read the resource first; verify against code only when the resource is silent or stale.

## Anti-patterns
- Don't query the Commander DBs directly with raw SQL. Use `cc_status` for status; it owns the queries.
- Don't hardcode version numbers in agent responses — always pull from `cc_status`.
- Don't suggest deploying from this Power. Deploy belongs in a separate Power (planned: `freddy-deploy`).
