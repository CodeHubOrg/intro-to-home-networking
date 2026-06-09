# Intro to Home Networking

Marp-based slides for a CodeHub meetup talk on home networking and Pi-hole.

## Requirements

- Node.js 20.19 or newer
- pnpm 11 or newer
- Docker with Compose support (required to render Mermaid diagrams through Kroki)

## Local development

Install dependencies and start the local slide server:

```bash
pnpm install
pnpm kroki:up
pnpm dev
```

`pnpm dev` builds `dist/index.html` (including Kroki Mermaid rendering),
serves `dist/`, and rebuilds when `slides.md` changes.

By default it uses port `8080`; if `8080` is busy it automatically uses the next available port and prints the URL.

When you are done, stop local Kroki services:

```bash
pnpm kroki:down
```

If Kroki is running on a different host/port, set the endpoint before running `pnpm dev` or `pnpm build`:

```bash
KROKI_ENDPOINT=http://127.0.0.1:8000 pnpm build
```

## Build and export

Build the static site for GitHub Pages:

```bash
pnpm build
```

`pnpm build` now renders Mermaid diagrams at build time by sending diagram text
to Kroki and embedding the returned SVG in `dist/index.html`.

Export a PDF copy of the deck:

```bash
pnpm export
```

The HTML build is written to `dist/index.html`. The PDF export is written to `dist/slides.pdf`.

## Images and sponsor logos

Store images under `assets/` and reference them from `slides.md`
with relative paths such as `./assets/sponsors/acme.png`.

That works in both places because:

- local development serves `dist/index.html`
- the build copies `assets/` to `dist/assets/`
- GitHub Pages publishes the same built files from `dist/`

Avoid absolute URLs such as `/assets/acme.png`, because a project
site is published under `/intro-to-home-networking/` rather than the
domain root.

Standard Markdown image:

```md
![width:220px](./assets/sponsors/acme.png)
```

While `pnpm dev` is running, changes to files inside `assets/` trigger a rebuild automatically.

## GitHub Pages deployment

This repo is designed to deploy from GitHub Actions to GitHub Pages.

1. Create a new repository under the CodeHubOrg organization with the name `intro-to-home-networking`.
2. Push this folder to the `main` branch.
3. In the repository settings, set Pages source to GitHub Actions.
4. Wait for the first workflow run to finish, then open the published Pages URL.

Deployment and CI builds start Kroki containers in GitHub Actions before running
`pnpm build`, so published output matches local build-time rendering.

## Repo URL

For an organization project site, the live URL will usually be:

`https://codehuborg.github.io/intro-to-home-networking/`

## Workflow

This repository follows gitflow for version control:

- `main` branch: stable, release-ready code that is deployed to GitHub Pages.
- `develop` branch: integration branch for features and fixes.
- Feature/fix branches: branch from `develop` with naming pattern `feature/<slug>` or `fix/<slug>`.

**Workflow:**

Follow gitflow strictly for day-to-day changes: create a new feature or fix
branch from `develop` before you start editing, and avoid making working
changes directly on `develop`.

1. Create a feature or fix branch from `develop`.
2. Make your changes, test locally with `pnpm dev`.
3. Push the branch and open a PR against `develop`.
4. After review and merge to `develop`, the build test workflow (`test-build.yml`) runs.
5. When ready for release, merge `develop` into `main` to trigger the Pages deployment.

Both workflows use Kroki:

- `.github/workflows/test-build.yml` validates lint/build with Kroki on push and PR.
- `.github/workflows/deploy-pages.yml` publishes Pages after pushes to `main`.

## Next edits

If you want to expand the deck later, add images or diagrams under an `assets/` directory and reference them from `slides.md`.
