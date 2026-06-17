# Intro to Home Networking

Quarto + reveal.js slides for a CodeHub meetup talk on home networking and Pi-hole.

## Requirements

- [Quarto](https://quarto.org/) 1.9.38 or newer
- [D2](https://d2lang.com/) 0.7.1 or newer
- Node.js 20.19 or newer and pnpm 11 or newer (for the OpenSpec workflow)

## Local development

Install Node dependencies:

```bash
pnpm install
```

Render the slides:

```bash
quarto render slides.qmd
```

Output is written to `slides.html`. Open it in any browser.

## Images and sponsor logos

Store images under `assets/` and reference them from `slides.qmd`
with relative paths such as `./assets/sponsors/acme.png`.

```md
![](./assets/sponsors/acme.png){width=220px}
```

## GitHub Pages deployment

This repo deploys to GitHub Pages via GitHub Actions.

1. Create a repository under the CodeHubOrg organization named `intro-to-home-networking`.
2. Push to the `main` branch.
3. In repository settings, set the Pages source to the `gh-pages` branch.
4. Wait for the first workflow run to finish, then open the published Pages URL.

Quarto publishes via `quarto publish gh-pages`, which pushes the rendered output to the `gh-pages` branch.

## Repo URL

`https://codehuborg.github.io/intro-to-home-networking/`

## Workflow

This repository follows gitflow for version control:

- `main` branch: stable, release-ready code that is deployed to GitHub Pages.
- `develop` branch: integration branch for features and fixes.
- Feature/fix branches: branch from `develop` with naming pattern `feature/<slug>` or `fix/<slug>`.

**Day-to-day:**

1. Create a feature or fix branch from `develop`.
2. Make your changes, preview locally with `quarto render slides.qmd`.
3. Push the branch and open a PR against `develop`.
4. After review and merge, the test-build workflow runs automatically.
5. When ready for release, merge `develop` into `main` to trigger Pages deployment.

Workflows:

- `.github/workflows/test-build.yml` — validates the build on pushes and PRs.
- `.github/workflows/deploy-pages.yml` — publishes to GitHub Pages on `main` push.

## Next edits

Add images or diagrams under `assets/` and reference them from `slides.qmd`.
For infrastructure diagrams, use D2 (` ```{.d2} `). For flowcharts, use Mermaid (` ```{mermaid} `).
