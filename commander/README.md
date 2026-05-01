# Commander — Kiro Power

Project context + version-status tooling for [Commander Collector](https://github.com/rickwphillips/commander-collector).

## What this Power provides

**Tool:** `cc_status` — compares the local `package.json` version against the dev and prod database `changelog_releases` tables. Reports any gap.

**Resource:** `commander://project-context` — Commander Collector architecture, conventions, deploy paths, type system, components. Loaded into the agent's context when Kiro activates this Power.

## Install in Kiro

1. Open Kiro → Powers panel → **Import from GitHub URL**
2. Paste: `https://github.com/<your-user>/kiro-powers/tree/main/commander`
3. Run the onboarding steps from `POWER.md` (build the server, create the config file)

## Build the embedded MCP server

```bash
cd server
npm install
npm run build
```

This produces `server/dist/index.js`, which `mcp.json` points to.

## Connections config

Create `~/.config/kiro-powers/commander/config.json` (chmod 600). Schema:

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

Override the path with the `KIRO_COMMANDER_CONFIG` env var if you want the config elsewhere.

## Test from the CLI (without Kiro)

The MCP server is plain JSON-RPC over stdio. Probe it directly:

```bash
node -e "
const { spawn } = require('child_process');
const p = spawn('node', ['server/dist/index.js'], { stdio: ['pipe','pipe','pipe'] });
let out = '';
p.stdout.on('data', d => out += d.toString());
const send = m => p.stdin.write(JSON.stringify(m)+'\n');
send({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'t',version:'1'}}});
setTimeout(() => { send({jsonrpc:'2.0',id:2,method:'tools/list'}); send({jsonrpc:'2.0',id:3,method:'resources/list'}); }, 300);
setTimeout(() => { console.log(out); p.kill(); }, 2000);
"
```

Expect 1 tool (`cc_status`) and 1 resource (`commander://project-context`).
