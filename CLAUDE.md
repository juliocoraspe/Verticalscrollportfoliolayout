# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Build to docs/ (GitHub Pages output)
```

No lint or test scripts are configured.

## Architecture

React + Vite portfolio site originating from a Figma design. Deploys automatically to GitHub Pages on every push to `main` via GitHub Actions (build output goes to `docs/`).

### Structure

- **`src/app/App.tsx`** — Root component. Manages state for 4 case studies (Milo, Stilles, Todo, ASMR), handles hash-based routing (`#motion-garden` / `#garden` toggles the Motion Garden view), and controls scroll behavior with refs.
- **`src/app/components/sections/`** — 5 main page sections: `HeroSection`, `PracticeSection`, `CaseStudiesSection`, `AboutMeSection`, `ContactSection`.
- **`src/app/data/`** — Content data files (`projects.ts`, `caseStudy.ts`, `about.ts`). Edit these to update content.
- **`src/app/components/ui/`** — 50+ Radix UI / shadcn-style reusable primitives.
- **`src/styles/theme.css`** — Custom CSS variables/theme (16KB). Primary place for design tokens.
- **`src/imports/`** — Figma-exported components (`Div.tsx`, SVG data).

### Key patterns

- **Two-view system**: `App.tsx` switches between `'main'` (portfolio) and `'motion-garden'` (animation showcase) views.
- **Scroll management**: Uses `useRef` + smooth scroll, respects `prefers-reduced-motion`.
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no separate `tailwind.config.js`). Path alias `@` → `./src`.
- **Animations**: `motion` library (Framer Motion fork) is used extensively. `MotionGarden.tsx` is the dedicated animation showcase component.
