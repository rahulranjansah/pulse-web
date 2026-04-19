# pulse-web

Marketing website for [PulseSuite](https://github.com/pulsesuite0/pulsesuite) —
a coupled quantum-electromagnetic simulation toolkit for ultrafast semiconductor
device design.

This repository contains **only the website**, not the PulseSuite simulation
codebase. PulseSuite itself lives in a separate repo so the open-source physics
code stays independent from the marketing site.

---

## Stack

- **[Vite](https://vitejs.dev)** — dev server and static site builder
- **[React 18](https://react.dev)** + **TypeScript** — component framework
- **[Tailwind CSS](https://tailwindcss.com)** — styling (utility-first, no custom CSS)
- **[pnpm](https://pnpm.io)** — package manager
- **[just](https://github.com/casey/just)** — task runner (optional, convenience)
- **GitHub Pages** — hosting

No backend, no database, no auth. Pure static HTML/CSS/JS built from React
components.

---

## Quick start (local development)

```bash
pnpm install       # one-time, installs dependencies
pnpm dev           # starts dev server at http://localhost:5173
```

Or with `just`:

```bash
just install
just dev
```

The dev server hot-reloads on file save. Edit any `.tsx` file in `src/` and you
see the result immediately.

---

## Project layout

```
pulse-web/
├── public/                        # Static assets copied verbatim into the build
│   ├── pulsesuite-logo.png        # The pulse-waveform logo
│   └── .nojekyll                  # Tells GitHub Pages not to run Jekyll
├── src/
│   ├── content/
│   │   └── site.ts                # ← EDIT THIS to change any text on the site
│   ├── components/                # One component per visible section
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx           # The 3 differentiators
│   │   ├── Positioning.tsx        # "Where it fits / where it doesn't"
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   └── _deferred/             # Built but not shipped in v1; revive in v2
│   ├── lib/
│   │   └── assets.ts              # Helper for /public URLs under basePath
│   ├── App.tsx                    # Composes the homepage from components
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Tailwind + font imports
├── .github/workflows/deploy.yml   # CI: build + deploy on every push to main
├── index.html                     # Vite HTML entry point
├── justfile                       # Task runner (just --list to see commands)
├── vite.config.ts                 # Vite config (basePath for GitHub Pages)
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## How to make changes

### Change the words on the site (95% of edits)

Open [`src/content/site.ts`](src/content/site.ts). It contains every piece of
text on the site — headline, subhead, differentiators, positioning bullets,
footer copy, nav labels, and external links.

Edit it. Save. The dev server reloads. That's it. You never need to touch a
component file for a copy change.

### Change a link (docs URL, GitHub URL, etc.)

Same file — [`src/content/site.ts`](src/content/site.ts), under `links:`. Every
CTA and footer link reads from there.

### Add a new section to the homepage

1. Create `src/components/MySection.tsx` (copy `src/components/Features.tsx` as a starting point).
2. Add whatever data it needs to `src/content/site.ts`.
3. Import it in [`src/App.tsx`](src/App.tsx) and drop it into the JSX where you want it to appear.

That's the whole workflow. No routing config, no framework magic.

### Change the visual style

Every component uses [Tailwind utility classes](https://tailwindcss.com/docs).
To tweak, say, the hero background, find `bg-white` in
[`src/components/Hero.tsx`](src/components/Hero.tsx) and swap it. The font
family and any brand-level tokens live in
[`tailwind.config.js`](tailwind.config.js).

### Revive a deferred component

The folder `src/components/_deferred/` holds pre-built sections that aren't in
v1 (a Technology deep-dive, UseCases, 3D visualizers, etc.). See
[`src/components/_deferred/README.md`](src/components/_deferred/README.md) for
the full list and revival instructions.

---

## Build and preview before deploying

```bash
just build       # produces ./dist
just build-gh    # same but with BASE_PATH=/pulse-web/ and previews locally
```

`just build-gh` is what you should run to verify the production build works
**exactly** as it will on GitHub Pages, before pushing.

---

## Deployment

**Automatic.** Every push to `main` runs the GitHub Actions workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which:

1. Installs dependencies with pnpm
2. Runs `pnpm build` with `BASE_PATH=/pulse-web/` so asset URLs resolve
   correctly under `https://<user>.github.io/pulse-web/`
3. Uploads `./dist` as a GitHub Pages artifact
4. Deploys it

### First-time setup (one-off, in the repo's GitHub UI)

1. Push this repo to GitHub (see "Create the GitHub repo" below).
2. **Settings → Pages → Source** → select **"GitHub Actions"** (not "Deploy from a branch").
3. Push a commit to `main`. The workflow runs, and ~2 minutes later the site is live at `https://<your-username>.github.io/pulse-web/`.

### Create the GitHub repo (first time)

```bash
cd /home/astavak/pulse-web
git init
git add .
git commit -m "Initial pulse-web: minimal MVP landing page"
gh repo create pulse-web --public --source=. --remote=origin --push
```

(Requires [GitHub CLI](https://cli.github.com/). Or create the repo manually in
the GitHub UI and push with plain `git`.)

### Adding a custom domain later

1. In DNS, point `www.pulsesuite.io` (or whatever) at GitHub Pages —
   [docs here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Add a file `public/CNAME` containing one line: `www.pulsesuite.io`.
3. In `.github/workflows/deploy.yml`, change `BASE_PATH: /pulse-web/` to
   `BASE_PATH: /`. Otherwise all asset URLs will be prefixed with `/pulse-web/`
   under your custom domain and break.

---

## If something breaks

| Symptom | Likely fix |
|---|---|
| Blank page locally | You forgot `pnpm install`. Run it. |
| Images broken in production build | `BASE_PATH` env var not set. See `vite.config.ts` and the workflow file. |
| TypeScript errors in the IDE after editing `site.ts` | The TS language server is caching the old file. Restart the TS server (in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"). |
| Deploy workflow fails with "Pages not enabled" | Settings → Pages → Source must be set to "GitHub Actions". |
| `pnpm` command not found | `npm install -g pnpm`, then ensure `~/.npm-global/bin` (or wherever npm installs globals) is on your `PATH`. |
| Build works but deployed site 404s on `/` | `BASE_PATH` mismatch. The path in the workflow must match the repo name (with leading and trailing slash): `/pulse-web/`. |

---

## What's intentionally NOT in v1

- No contact form, demo request form, or pricing page (decided in planning)
- No "trusted by" logos (we don't have real ones yet — putting fake or fluffy
  ones in hurts credibility more than the absence of them does)
- No blog / resources / news section
- No 3D interactive visualizers (they exist in `_deferred/` but bloated the
  bundle to 700KB; revisit when there's a specific reason to ship them)
- No analytics / tracking
- No dark mode

All of these are straightforward to add later. They're omitted on purpose to
keep v1 small, honest, and fast.

---

## Where to go next (v2 ideas)

See the "What's intentionally NOT in v1" list above — each of those is a
v2 candidate. In rough priority order:

1. **Embedded simulation video** — record PulseSuite producing an actual
   output (chirped pulse in a quantum well, field evolution through a PML)
   and embed it in a Demo section. Single most convincing addition.
2. **Real research/reference citations** — a "Research lineage" section
   pointing to the peer-reviewed papers the physics is ported from.
3. **Contact form wired to Formspree or similar** — once the GTM motion
   shifts from Phase 1 (community adoption) to Phase 2 (paid pilots).
4. **Dedicated `/technology` page** — revive `_deferred/Technology.tsx`,
   add a router.
5. **MDX-based docs/blog** pages under `src/pages/`.
6. **Custom domain** — `pulsesuite.io` or similar.

---

## License

MIT for the website code itself (this repo). The PulseSuite simulation codebase
is separately licensed under LGPL-3.0-or-later.
