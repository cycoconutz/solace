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

This repo ships with `.github/workflows/deploy.yml`, so every push to `main`
builds and publishes to GitHub Pages automatically.

1. Create an empty repo on GitHub named `solace` (no README).
2. Connect and push:

   ```bash
   git remote add origin https://github.com/<you>/solace.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The site lands at `https://<you>.github.io/solace/`.

`base: './'` in `vite.config.ts` means the build works from any subpath, so no
extra config is needed for the project-page URL.

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