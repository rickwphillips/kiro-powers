# Deploy — Kiro Power

Deploys the three FreddyRhetorick projects (commander, portfolio, grandkid) to production. Wraps each project's `deploy.sh` with preflight checks.

## Shape: single-tool Power

One tool (`deploy`), no resource, embedded MCP server. The third Power shape in this repo:

| Power | Shape |
|---|---|
| [`commander/`](../commander/) | tool + resource + embedded server |
| [`portfolio/`](../portfolio/) | steering-only (no MCP) |
| [`deploy/`](.) | single tool + embedded server |

## Install in Kiro

1. Open Kiro → Powers panel → **Import from GitHub URL**
2. Paste: `https://github.com/rickwphillips/kiro-powers/tree/main/deploy`
3. Run the onboarding from `POWER.md`:
   - `cd server && npm install && npm run build`
   - Verify the three `deploy.sh` paths in `server/src/tools/deploy.ts` match your repo layout

## What the tool does

```
deploy(target, flags?, skip_preflight?)
```

- `target`: `commander` | `portfolio` | `grandkid` | `all` (or `c` | `p` | `g` | `a`)
- `flags`: optional, passed through to deploy.sh (`--static-only`, `--php-only`, `--decks-only`, `--guru-only`)
- `skip_preflight`: optional bool, default false

Returns structured JSON: `status`, `preflight` (git-clean checks per project + commander migration file location), `runs` (per-project exit_code + stdout + stderr).

## Preflight checks

**Git tree must be clean** (per project being deployed). Skipped if `skip_preflight: true` or `flags` includes `--static-only`.

**Commander migration file location** (only when target includes commander). Migration must be at `commander-collector/migrations/v<version>.sql` at repo root, NOT `apps/core/migrations/`. If wrong location: tool stops with `PREFLIGHT_FAILED` and the move instruction.

## Test from the CLI

```bash
node -e "
const { spawn } = require('child_process');
const p = spawn('node', ['server/dist/index.js'], { stdio: ['pipe','pipe','pipe'] });
let out = '';
p.stdout.on('data', d => out += d.toString());
const send = m => p.stdin.write(JSON.stringify(m)+'\n');
send({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'t',version:'1'}}});
setTimeout(() => send({jsonrpc:'2.0',id:2,method:'tools/list'}), 300);
setTimeout(() => { console.log(out); p.kill(); }, 2000);
"
```

Expect 1 tool: `deploy`.
