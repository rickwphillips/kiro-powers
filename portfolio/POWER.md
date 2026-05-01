---
name: "portfolio"
displayName: "Portfolio (rickwphillips.com)"
description: "Project context for the rickwphillips.com personal portfolio: Next.js 16 / React 19 / MUI 7, ThemeProvider with autumn palette, blog posts via DB, chihuahua carousel, knowledge graph, deploy paths."
keywords:
  - "portfolio"
  - "rickwphillips.com"
  - "rickwphillips"
  - "personal site"
  - "blog post"
  - "chihuahua carousel"
  - "ThemeProvider"
  - "autumn theme"
  - "knowledge graph"
  - "create-post"
author: "Rick Phillips"
---

# Onboarding

This Power is **steering-only** — no MCP server, no tool, no install/build step beyond Kiro itself copying these files into `~/.kiro/powers/installed/portfolio/`. There's nothing to set up.

# Steering

## When this Power activates
Kiro auto-loads this Power when the conversation mentions the portfolio site, rickwphillips.com, blog posts on the portfolio, the ThemeProvider, the chihuahua carousel, or the knowledge graph. The `steering/` markdown becomes part of the agent's context.

## How to use the steering content
- For architecture / convention questions: defer to `steering/architecture.md`. Don't grep the repo for things it already documents.
- For blog post operations: defer to `steering/blog-posts.md` — the create-post pattern is non-obvious (it's a markdown row in the prod portfolio DB, NOT a static React component).
- For deploy questions: defer to `steering/deploy.md`.
- For troubleshooting / lint warnings: defer to `steering/troubleshooting.md`.

## Anti-patterns
- Don't suggest writing a blog post as a React component — that's the old pattern. Posts live in the prod DB; insertion uses `scripts/create-post.php`.
- Don't fix the `set-state-in-effect` ESLint warning in `ThemeProvider.tsx` — it's pre-existing and not ours.
- Don't deploy from this Power. Deploy belongs in a separate Power (planned: `deploy`).
- Don't assume `API_BASE` works without basePath — browser fetch does NOT auto-prepend Next.js basePath; the path must include `/app` in prod.
