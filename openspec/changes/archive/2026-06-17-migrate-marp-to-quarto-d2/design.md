## Context

The presentation is a single-file Marp deck (`slides.md`) using the Gaia theme, with Mermaid diagrams pre-rendered to SVG by a self-hosted Kroki instance (via Docker Compose) at build time. The build scripts are Node/pnpm (`scripts/dev.mjs`, `scripts/build.mjs`). Two GitHub Actions workflows drive CI (test-build) and deployment (deploy-pages) — both spin up Kroki, wait for it, build, then tear it down. The Kroki step is the source of build flakiness and the main motivation for this migration.

The existing content is an in-progress outline with 7 sections and four Mermaid diagrams: one home-network topology diagram and three identical Pi-hole dashboard flowcharts.

## Goals / Non-Goals

**Goals:**
- Replace the Marp+Kroki pipeline with Quarto+D2, producing a reveal.js deck published to GitHub Pages
- Render D2 and Mermaid locally at build time with no remote service dependency
- Improve the visual quality of network/infrastructure diagrams using D2's iconography
- Remove all Node-specific tooling except `@fission-ai/openspec`

**Non-Goals:**
- Rewriting or restructuring slide content — content migrates verbatim
- Multi-format publishing (PDF, docs site)
- Executable/computational cells
- Replacing the OpenSpec workflow (`@fission-ai/openspec` stays)

## Decisions

### D2 for network diagrams; Mermaid retained for flowcharts

The home-network topology diagram (`slides.md:129–146`) maps infrastructure relationships — router, Pi-hole, devices — that benefit from D2's infrastructure icon support. All three Pi-hole dashboard flowcharts (`slides.md:164–171`, `190–197`, `208–215`) are identical simple flowcharts with no spatial/infrastructure meaning; D2 adds no value there, and retaining Mermaid reduces churn.

Both diagram types are supported by `pandoc-ext/diagram`, the official Quarto extension for fenced diagram blocks. This is the only diagram integration needed.

**Alternative considered**: Convert all diagrams to D2 — rejected because it adds migration effort with no user-visible benefit for the simple flowcharts.

### `pandoc-ext/diagram` as the integration layer

Rather than shell out to D2/Mermaid from a custom build script, `pandoc-ext/diagram` handles both renderers declaratively as fenced code blocks (` ```{.d2} ` and ` ```{.mermaid} `). This is the canonical Quarto extension for this use case. It renders locally without a network call.

### Quarto reveal.js with a small SCSS override for theming

Quarto's built-in `dark` or `serif` reveal.js themes are serviceable but plain. A small `custom.scss` override — adjusting font sizes and spacing to approximate the Marp Gaia layout — keeps the deck looking intentional without introducing a third-party theme dependency. The override will be < 50 lines.

**Alternative considered**: A community reveal.js theme (e.g. `moon`, `blood`) — rejected because community themes add a dependency and may change upstream; a local SCSS file is fully controlled.

### D2 installed in CI via manual binary download

The official `d2` GitHub Action (`terrastruct/setup-d2`) is available but pins to specific patch versions and adds a third-party action dependency. Downloading the official tarball from the D2 GitHub releases in CI is a one-liner (`curl | tar`) and lets the workflow pin to an exact version without trusting an external action.

**Alternative considered**: Container-based runner with D2 pre-installed — adds complexity for no benefit in a simple single-job workflow.

### Python environment via `requirements.txt`

Quarto's build process for this deck needs no Python libraries directly, but Quarto itself invokes a Python environment for some operations. A minimal `requirements.txt` (empty or just `jupyter` if needed) keeps the CI setup declarative. If no Python dependencies are needed at render time, a `requirements.txt` can be omitted and Quarto run without a Python kernel.

### `package.json` retained for `@fission-ai/openspec` only

The OpenSpec CLI is the only surviving Node dependency. `package.json` stays, stripped to just that devDependency and the `openspec` script entry. `pnpm-workspace.yaml` and `biome.json` are removed.

## Risks / Trade-offs

- **D2 icon availability**: D2's infrastructure icons require the `d2-icons` or a compatible icon pack. If the icon theme isn't available in CI, diagrams fall back to plain boxes. → Pin the D2 version that bundles icons and test the CI output explicitly.
- **`pandoc-ext/diagram` Mermaid support**: The extension delegates Mermaid rendering to a local `mmdc` binary. If `mmdc` is not installed in CI, Mermaid blocks will fail silently or error. → Add `@mermaid-js/mermaid-cli` as a dev dependency (Node) or install it in CI alongside D2. This is the one case where a residual Node package may be needed.
- **Marp `---` slide separators**: Marp uses `---` to delimit slides. Quarto uses `##` headings (or `---` with `slide-level: 1`). The existing deck already uses `##` headings for slide titles and `---` as separators — a `slide-level: 2` Quarto config will need to be set to preserve the structure.
- **Inline style in Marp front matter**: The Marp front matter includes inline CSS (`style: |`). This has no equivalent in Quarto front matter and must be moved to `custom.scss`.
- **`html: true` in `marp.config.js`**: The config enables raw HTML for `<br/>` tags in diagram labels. Quarto/Pandoc handles HTML in Markdown by default with `format: revealjs` — no equivalent config needed, but labels with raw HTML should be tested.

## Migration Plan

1. Add Quarto, D2, and `pandoc-ext/diagram` (local dev setup documented in README)
2. Create `_quarto.yml` with `format: revealjs`, `slide-level: 2`, and `custom.scss` reference
3. Create `slides.qmd` by copying `slides.md` content, stripping Marp front matter, and converting the topology Mermaid block to D2
4. Create `custom.scss` with font-size and spacing overrides
5. Remove Marp, Kroki, Docker Compose, and Node build scripts
6. Rewrite `.github/workflows/deploy-pages.yml` and `test-build.yml`
7. Verify the deck renders locally with `quarto render slides.qmd` before pushing

Rollback: `slides.md` and all removed files are in git history. The Marp pipeline can be restored by reverting commits. No data is permanently lost.

## Open Questions

- **Mermaid in CI**: Does `pandoc-ext/diagram` require a local `mmdc` binary for Mermaid, or does Quarto bundle a JS-based renderer? If `mmdc` is required, the simplest fix is keeping `@mermaid-js/mermaid-cli` as a dev dependency and installing via pnpm in CI. Needs a local test to confirm before writing the CI workflow.
- **D2 icon pack**: Which D2 icon theme gives the best router/RPi/device iconography? `terrastruct/icons` or a community pack? Worth prototyping the topology diagram locally first.
- **Quarto version to pin**: Latest stable at time of implementation. Document the exact version in `_quarto.yml` and CI.
