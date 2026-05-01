# Portfolio Architecture

## Project Location
Repo path (relative): `website/rickwphillips.com/`

## Stack
- **Next.js 16.0.1** (App Router) · **React 19.2.0** · **TypeScript 5.x** strict
- **MUI 7.3.4** + Emotion · **SCSS modules** (Sass 1.93.3)
- Dev port: **3000** → `npm run dev`
- PHP API port: **8080**
- DB: `rickwphi_app_portfolio`

## Path alias
`@/*` → project root.

## Theme system
- `ThemeProvider.tsx` — Context wrapper, light/dark mode, localStorage persistence, matchMedia detection, FOUC prevention (returns `null` until mounted), wraps MUI ThemeProvider.
- `theme.ts` — autumn palette (warm browns/oranges/golds), separate light/dark schemes, component overrides (Card, Chip, Button, Link).
- `DarkModeToggle.tsx` — fixed-position toggle via `useThemeMode()`.
- `layout.tsx` wraps all children in ThemeProvider.

## Pages
- `page.tsx` — hero (gradient text) + nav (Resume/Projects/Blog/Contact) + gaming philosophy + chihuahua carousel (auto-rotating) + embedded blog posts. All animations gated on `mounted`.
- `resume/page.tsx` — about + 6 expertise cards + tech sections (Frontend/Backend/Practices) + achievements + education.

## Rendering
All pages `'use client'` — theme needs localStorage/matchMedia, heavy MUI + animations, carousel/hover state.

## Chihuahua carousel
- Photos in `public/Photos-1-001/` — Copper, Penny, Lulu.
- Auto-rotating, animations gated on `mounted`.

## Key patterns

### Theme-aware styling
```tsx
sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'dark-val' : 'light-val' }}
```

### Mounted state (FOUC prevention + animations)
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);
// <Fade in={mounted} timeout={1000}>
```

### Animation stagger
150–200ms multiples for MUI Fade/Grow/Slide.

## Resume data
Lives at `.claude/resumes/` (private, not committed). Achievements include 30%+ improvement, $1.2M sales figures.
