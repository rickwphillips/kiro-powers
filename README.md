# Kiro Powers

A monorepo of [Kiro](https://kiro.dev) Powers. Each subdirectory is a self-contained Power — its own `POWER.md`, optional `mcp.json`, and (when needed) its own embedded MCP server.

## Powers in this repo

| Power | What it does | Has MCP server? |
|---|---|---|
| [`commander/`](commander/) | Commander Collector (MTG game-tracking app) project context + version-gap status | Yes |

## Installing a Power in Kiro

1. In Kiro, open the Powers panel
2. Choose "Import from GitHub URL"
3. Paste the URL to the specific Power's subdirectory, e.g. `https://github.com/<user>/kiro-powers/tree/main/commander`
4. Follow any onboarding prompts the Power's `POWER.md` defines

## Adding a new Power

```
kiro-powers/
└── <name>/
    ├── POWER.md          # required — frontmatter (name, displayName, description, keywords, author) + steering
    ├── mcp.json          # optional — only if the Power uses MCP tools/resources
    ├── README.md         # human-readable install/test notes
    └── server/           # optional — embedded MCP server (only if mcp.json points here)
        ├── package.json
        ├── tsconfig.json
        └── src/
```

Each Power is independent. No shared code across Powers — each is fully installable on its own.
