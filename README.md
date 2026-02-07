# rowanmueller.github.io

Project Portfolio for Rowan Mueller, B.S. Computer Engineering

## Project Structure

```
├─ public/
│  ├─ favicon.svg
│  └─ assets/
│     ├─ images/
│     └─ icons/
│
├─ src/
│  ├─ pages/          # Home, Projects, About, Contact
│  ├─ components/     # Navbar, Footer, ProjectCard
│  ├─ data/           # projects.json
│  ├─ styles/         # global.css, theme.css
│  ├─ App.jsx
│  └─ main.jsx
│
├─ python/
│  ├─ generate_projects.py
│  └─ requirements.txt
│
├─ index.html
├─ package.json
└─ vite.config.js
```

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Generate Projects (Python)

```bash
python python/generate_projects.py
```

Edit `PROJECTS` in `python/generate_projects.py` to customize, then run to update `src/data/projects.json`.

## Deploy to GitHub Pages

The site is configured for GitHub Pages (user site). After building, deploy the `dist/` folder to the `gh-pages` branch or configure GitHub Actions.

**Note:** Add your own `public/favicon.ico` if you prefer an ICO file over the included `favicon.svg`.
