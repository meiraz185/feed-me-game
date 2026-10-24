# תאכיל אותי! (Feed Me!)

A six-stage feeding game: a frog eats its way through a strawberry, a watermelon, a cookie, a
chocolate bar, a pizza, and finally a hamburger — with a confetti celebration at the end.

Built with React + Vite, deployed automatically to GitHub Pages on every push to `main`.

## ⚠️ Before this runs: add your artwork and sounds

This project ships with **no images or sounds** — they were never available to the assistant that
built it, so nothing could legitimately be exported. The game will show broken-image icons and
play silently until you add your files. See exactly what's needed in:

- [`public/images/README.md`](public/images/README.md) — 25 PNG files (7 characters, 6 draggable
  foods, 12 happy-hamburger animation frames)
- [`public/sounds/README.md`](public/sounds/README.md) — 5 MP3 files

Filenames must match exactly (case-sensitive) — the game looks them up by name in
`src/data/manifest.js`.

## Project structure

```
feed-me-game/
├── index.html                  Vite entry page
├── vite.config.js              base path set to /feed-me-game/ for GitHub Pages
├── package.json
├── .github/workflows/deploy.yml   auto-builds and deploys dist/ to GitHub Pages
├── public/
│   ├── images/                 ← put your 25 PNGs here
│   └── sounds/                 ← put your 5 MP3s here
└── src/
    ├── main.jsx                 React entry
    ├── App.jsx                  top-level app (mute state, image preloading)
    ├── styles.css                all game styling (Rubik font embedded inline)
    ├── data/manifest.js          asset paths, timing, dialogue, hitbox/bubble config
    ├── hooks/
    │   ├── useSoundPlayer.js
    │   └── useConfettiBursts.js
    └── components/
        ├── Game.jsx              the game's state machine
        ├── CharacterStage.jsx
        ├── FoodItem.jsx          drag-and-drop food
        ├── ConfettiLayer.jsx
        └── Icons.jsx
```

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/feed-me-game/`.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` outputs to `dist/` — this is what GitHub Pages serves.

## Deploying

See the step-by-step guide in the chat response this project came with. Short version: push this
folder to a GitHub repo named `feed-me-game`, then turn on GitHub Pages with source **GitHub
Actions** in the repo's Settings. The included workflow (`.github/workflows/deploy.yml`) builds
and publishes automatically on every push to `main`.

Your site will be live at:

```
https://<your-github-username>.github.io/feed-me-game/
```

## If you rename the repository

The Vite `base` path in `vite.config.js` is hardcoded to `/feed-me-game/` to match the GitHub
Pages URL. If you use a different repo name, update that one line to match
(`base: '/your-repo-name/'`) before deploying.
