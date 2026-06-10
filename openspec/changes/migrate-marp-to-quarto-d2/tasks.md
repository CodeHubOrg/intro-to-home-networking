## 1. Toolchain Setup

- [x] 1.1 Install Quarto locally (pinned version) and document the version in `_quarto.yml`
- [x] 1.2 Install D2 locally and verify `d2 --version` works
- [x] 1.3 Install `pandoc-ext/diagram` Quarto extension (`quarto add pandoc-ext/diagram`)
- [x] 1.4 Confirm `pandoc-ext/diagram` supports both `.d2` and `.mermaid` fenced blocks with local rendering
- [x] 1.5 Determine whether Mermaid rendering requires a local `mmdc` binary and, if so, install it and retain `@mermaid-js/mermaid-cli` in `package.json`

## 2. Quarto Configuration

- [x] 2.1 Create `_quarto.yml` with `format: revealjs`, `slide-level: 2`, `css: custom.scss`, and the `pandoc-ext/diagram` filter
- [x] 2.2 Create `custom.scss` with font-size and spacing overrides derived from the Marp Gaia inline styles in `marp.config.js`
- [x] 2.3 Verify `quarto render` runs without errors against a minimal test `.qmd`

## 3. Slide Migration

- [x] 3.1 Create `slides.qmd` by copying `slides.md` content and stripping Marp front matter (keep section headings and content verbatim)
- [x] 3.2 Replace the home-network topology Mermaid block (slides.md:129–146) with a D2 fenced block using infrastructure icons (router, Pi-hole/RPi, Wi-Fi AP, client devices)
- [x] 3.3 Convert the three Pi-hole dashboard flowcharts to `{.mermaid}` fenced blocks for `pandoc-ext/diagram` (content unchanged)
- [x] 3.4 Verify all sponsor images render correctly (`assets/sponsors/` paths unchanged)
- [x] 3.5 Render the full deck locally with `quarto render slides.qmd` and check every slide visually

## 4. Cleanup

- [x] 4.1 Delete `slides.md`, `marp.config.js`, `docker-compose.kroki.yml`
- [x] 4.2 Delete `scripts/dev.mjs` and `scripts/build.mjs`
- [x] 4.3 Remove `@marp-team/marp-cli`, `jsdom`, `http-server`, `@biomejs/biome`, and `markdownlint-cli2` from `package.json` (keep `@fission-ai/openspec` and `@mermaid-js/mermaid-cli` if required by 1.5)
- [x] 4.4 Delete `biome.json` and `pnpm-workspace.yaml`
- [x] 4.5 Update `package.json` scripts — remove `kroki:up`, `kroki:down`, `dev`, `build`, `serve`, `preview`, `export`, `lint:js`, `lint:md`, `lint`; add a `render` script (`quarto render slides.qmd`) if useful
- [x] 4.6 Run `pnpm install` to regenerate `pnpm-lock.yaml` with the reduced dependency set

## 5. GitHub Actions

- [x] 5.1 Rewrite `.github/workflows/test-build.yml`: install Quarto, install D2 binary (pinned version), install Node deps (pnpm), run `quarto render slides.qmd`, verify output exists
- [x] 5.2 Update `test-build.yml` path triggers to watch `slides.qmd`, `_quarto.yml`, `custom.scss`, `assets/**` instead of `slides.md`, `docker-compose.kroki.yml`, `scripts/**`
- [x] 5.3 Rewrite `.github/workflows/deploy-pages.yml`: same install steps as test-build, then `quarto publish gh-pages --no-prompt`
- [x] 5.4 Remove all Docker Compose steps and `KROKI_ENDPOINT` references from both workflows
- [ ] 5.5 Push a test branch and confirm both workflows pass in CI

## 6. Verification

- [x] 6.1 Confirm the rendered deck contains all 7 agenda sections and the Q&A slide
- [x] 6.2 Confirm the D2 topology diagram shows distinct icons for each node type
- [x] 6.3 Confirm the three Mermaid flowcharts render identically to the originals
- [x] 6.4 Confirm no `KROKI_ENDPOINT`, `docker compose`, or Marp references remain in the repo (excluding git history and `openspec/`)
- [ ] 6.5 Confirm the GitHub Pages site builds and serves the reveal.js deck after a merge to main
