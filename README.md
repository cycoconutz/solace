# Solace 🌷

A small React app with a soft pastel **glassmorphism** design. Two gentle flows:

- **Breathe** — guided breathing sessions (Box, 4·7·8, Calm) with an animated, phase-synced breathing circle, live progress ring, cycle dots, pause/resume, and the whole thing is pure CSS transitions + a tiny `useBreathing` hook.
- **Reflect** — a mood-aware journal with gratitude notes. Entries persist to `localStorage`, and you get a daily reflection streak.

Part of a portfolio series where every site gets a drastically different design language and flow.

## Stack

- React 19 + TypeScript + Vite 8
- Zero runtime dependencies beyond React
- Google Fonts: Quicksand

## Run it

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

`base: './'` is set in `vite.config.ts` so the built site works under any GitHub Pages subpath.

## Deploy to GitHub Pages

```bash
npm run build
gh repo create solace --public --source . --push
gh repo deploy --repo <you>/solace --source dist --push
```

Or push the repo and enable Pages (branch `gh-pages`, folder `/ (root)`) after running `npm run build` and copying `dist` to a `gh-pages` branch.

## Structure

```
src/
  App.tsx                 shell: header, pastel blob backdrop, view routing
  index.css               the full glassmorphism design system
  hooks/useBreathing.ts   breathing pattern timing + cycle state machine
  lib/journal.ts          entry model, moods, localStorage persistence, streak math
  views/HomeView.tsx      greeting + two flow entry cards
  views/BreatheView.tsx   setup → session → done
  views/JournalView.tsx   mood picker, journal form, entry feed
```