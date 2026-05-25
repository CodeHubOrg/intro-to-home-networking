# Intro to Home Networking

Marp-based slides for a CodeHub meetup talk on home networking and Pi-hole.

## Requirements

- Node.js 20 or newer
- pnpm 11 or newer

## Local development

Install dependencies and start the local slide server:

```bash
pnpm install
pnpm dev
```

Marp serves the deck at a local URL. Open that URL in your browser to present or review the deck.

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

## Next edits

If you want to expand the deck later, add images or diagrams under an `assets/` directory and reference them from `slides.md`.