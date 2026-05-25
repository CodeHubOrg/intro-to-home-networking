# Intro to Home Networking

Marp-based slides for a CodeHub meetup talk on home networking and Pi-hole.

## Requirements

- Node.js 20.19 or newer
- pnpm 11 or newer

## Local development

Install dependencies and start the local slide server:

```bash
pnpm install
pnpm dev
```

`pnpm dev` builds `dist/index.html` (including Mermaid transformation), serves `dist/`, and rebuilds when `slides.md` changes.

By default it uses port `8080`; if `8080` is busy it automatically uses the next available port and prints the URL.

## Build and export

Build the static site for GitHub Pages:

```bash
pnpm build
```

Export a PDF copy of the deck:

```bash
pnpm export
```

The HTML build is written to `dist/index.html`. The PDF export is written to `dist/slides.pdf`.

## GitHub Pages deployment

This repo is designed to deploy from GitHub Actions to GitHub Pages.

1. Create a new repository under the CodeHubOrg organization with the name `intro-to-home-networking`.
2. Push this folder to the `main` branch.
3. In the repository settings, set Pages source to GitHub Actions.
4. Wait for the first workflow run to finish, then open the published Pages URL.

## Repo URL

For an organization project site, the live URL will usually be:

`https://codehuborg.github.io/intro-to-home-networking/`

## Workflow

This repository follows gitflow for version control:

- `main` branch: stable, release-ready code that is deployed to GitHub Pages.
- `develop` branch: integration branch for features and fixes.
- Feature/fix branches: branch from `develop` with naming pattern `feature/<slug>` or `fix/<slug>`.

**Workflow:**
1. Create a feature or fix branch from `develop`.
2. Make your changes, test locally with `pnpm dev`.
3. Push the branch and open a PR against `develop`.
4. After review and merge to `develop`, the build test workflow (`test-build.yml`) runs.
5. When ready for release, merge `develop` into `main` to trigger the Pages deployment.

## Next edits

If you want to expand the deck later, add images or diagrams under an `assets/` directory and reference them from `slides.md`.