## Why

The current Marp+Kroki pipeline has two compounding problems: Kroki is a remote rendering service that makes builds network-dependent and intermittently flaky, and the output looks poor — Marp's Gaia theme is plain and Mermaid network diagrams render as grey boxes with no infrastructure iconography. Migrating to Quarto+D2 eliminates the remote dependency and produces significantly better-looking slides.

## What Changes

- Replace `slides.md` (Marp) with `slides.qmd` (Quarto reveal.js), preserving all existing content and slide structure
- Replace Kroki-rendered Mermaid diagrams with D2 for network/infrastructure diagrams (home network topology); retain Mermaid for simple flowcharts via `pandoc-ext/diagram`
- Replace the Node/pnpm build toolchain (Marp CLI, Kroki scripts, Biome, markdownlint) with Quarto + Python
- Replace `docker-compose.kroki.yml` and the Kroki wait/teardown logic in CI with local D2 binary execution
- Replace both GitHub Actions workflows (`deploy-pages.yml`, `test-build.yml`) with Quarto equivalents using `quarto publish gh-pages` and `quarto render`
- Remove: `marp.config.js`, `docker-compose.kroki.yml`, `scripts/`, `biome.json`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- Add a reveal.js theme (built-in or lightweight SCSS override) to match the visual quality of the current Gaia theme

## Capabilities

### New Capabilities

- `slide-deck`: The presentation rendered as a Quarto reveal.js deck — source authoring in `.qmd`, built locally and published to GitHub Pages
- `diagram-authoring`: D2 diagrams for network/infrastructure topology and Mermaid for simple flowcharts, both rendered locally at build time via `pandoc-ext/diagram`
- `ci-pipeline`: GitHub Actions workflows to build (test-build) and publish (deploy-pages) the deck using Quarto + D2, with no remote rendering services

### Modified Capabilities

<!-- No existing specs to modify — this is a greenfield spec for the migrated stack -->

## Impact

- **Files added**: `slides.qmd`, `_quarto.yml`, `custom.scss` (or theme reference), `requirements.txt`, `.github/workflows/deploy-pages.yml` (rewritten), `.github/workflows/test-build.yml` (rewritten)
- **Files removed**: `slides.md`, `marp.config.js`, `docker-compose.kroki.yml`, `scripts/dev.mjs`, `scripts/build.mjs`, `biome.json`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- **Dependencies removed**: `@marp-team/marp-cli`, `jsdom`, `http-server`, `@biomejs/biome`, `markdownlint-cli2` (all Node packages)
- **Dependencies added**: Quarto (pinned version), D2 binary, `pandoc-ext/diagram` Quarto extension
- **`openspec` package**: `@fission-ai/openspec` remains in `package.json` for the OpenSpec workflow; this is the only Node dependency that survives
