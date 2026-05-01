# Portfolio — Kiro Power

Project context for [rickwphillips.com](https://rickwphillips.com).

## Shape: steering-only Power

This Power has no MCP server, no tools, no resources — just markdown that Kiro loads into agent context when the keywords trigger.

That makes it the simplest possible Power format: `POWER.md` + a `steering/` subdirectory of context files. No build step, no dependencies.

```
portfolio/
├── POWER.md                    # frontmatter + onboarding + steering header
├── README.md                   # this file
└── steering/
    ├── architecture.md         # stack, theme system, mounted-state pattern
    ├── blog-posts.md           # the DB-driven blog post pattern (NOT React components)
    ├── deploy.md               # deploy alias, basePath, .htaccess footgun, symlink hazard
    └── troubleshooting.md      # FOUC, animations, lint warnings, knowledge graph
```

## Install in Kiro

1. Open Kiro → Powers panel → **Import from GitHub URL**
2. Paste: `https://github.com/rickwphillips/kiro-powers/tree/main/portfolio`
3. No onboarding steps required (no MCP server to build)

## How it activates

When the conversation mentions any of the keywords from `POWER.md` frontmatter — e.g. "portfolio," "rickwphillips.com," "blog post," "ThemeProvider," "chihuahua carousel" — Kiro auto-loads the steering markdown into context. Subsequent answers about the portfolio project use that context instead of re-deriving from a repo grep.

## Why steering-only?

Portfolio knowledge is mostly *reference material*: how the theme system works, what the deploy script does, the blog post insertion pattern. None of it is a deterministic action that needs a tool. Tools are for "do this thing"; steering is for "know this thing."

Compare to the [`commander/`](../commander/) Power, which has both a `cc_status` tool (deterministic action — query DBs, compare versions) and a project-context resource (reference material — same shape as the steering files here).
