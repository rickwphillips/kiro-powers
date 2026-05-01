# Portfolio Troubleshooting

## FOUC (flash of unstyled content)

Check `ThemeProvider` `mounted` state. The provider must return `null` until hydration completes — without that gate, MUI renders before the theme attaches.

## Animations look janky

Stagger MUI `Fade` / `Grow` / `Slide` timeouts in **150–200ms multiples**. Even staggers feel artificial; uneven timeouts feel chaotic.

## Build fails

Run `npm run build` to surface TypeScript errors. The `next build` output is more diagnostic than `next lint` for type problems.

## ESLint quirks

`eslint.config.mjs` uses Next.js `defineConfig`. Rules are inherited from `eslint-config-next`.

### Pre-existing warning: `set-state-in-effect` in `ThemeProvider.tsx`

**Not ours, do not fix.** This is the standard Next.js theme-provider pattern (set `mounted = true` after mount); the lint rule has a known false positive against it. Trying to "fix" it breaks the FOUC prevention. Leave it alone across all 3 portfolio-family projects.

## Knowledge graph is stale

```bash
python3 build-knowledge-graph.py     # rebuild from source
./query-graph.sh endpoints           # all API endpoints
./query-graph.sh search <term>       # search nodes
./query-graph.sh project <name>      # everything in a project
./query-graph.sh deps <name>         # what this depends on
./query-graph.sh importers <file>    # what imports this
./query-graph.sh callers "<endpoint>" # pages calling endpoint
./query-graph.sh schema <table>      # table columns
./query-graph.sh edges <Component>   # all relationships
./query-graph.sh path <from> <to>    # connection path
./query-graph.sh stats
```

SQLite at `knowledge-graph.db`. Use it at session start for cross-project impact analysis when changes might span more than one of the three apps.

## Theme toggle not persisting

`DarkModeToggle` writes to localStorage via `useThemeMode()`. If the toggle works in-session but resets on reload, check that `localStorage.getItem('themeMode')` is actually being read on `ThemeProvider` mount, not just observed via `matchMedia`.
