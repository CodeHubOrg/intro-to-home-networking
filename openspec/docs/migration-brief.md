# OpenSpec Change Request: Migrate this presentation from Marp+Kroki to Quarto+D2

## Context

This repo contains an in-progress Meetup presentation: **"Improve your home network security and privacy with Pi-hole"**. It is currently authored in **Marp** (Markdown slides) with **Kroki** rendering **Mermaid** diagrams to pre-generated SVGs, deployed to GitHub Pages.

There is an existing slide outline in the repo. **This change is a migration of that existing content**, not a greenfield design. Before proposing the spec, inspect the current repo to understand:

- The existing slide outline and any draft content
- Current Marp configuration and themes
- Existing Mermaid diagrams and how they're referenced
- The current GitHub Actions workflow
- Any other tooling that needs to be replaced or removed

## Problems with the current setup

1. **Kroki is flaky** — remote rendering server, network-dependent builds, intermittent failures
2. **Default output looks poor** — Marp themes are plain, Mermaid network diagrams render as grey boxes with no infrastructure iconography

## Target stack

- **Quarto** rendering to reveal.js (`format: revealjs`)
- **D2** for diagrams via the `pandoc-ext/diagram` extension, rendered locally at build time
- **Mermaid** retained as a secondary option through the same extension (for quick sequence/flow diagrams)
- **GitHub Pages** via `quarto publish gh-pages`
- **Python + standalone binaries** preferred over Node/npm

## Goals

- Migrate the existing outline and any drafted slides to Quarto `.qmd` format
- Convert existing Mermaid diagrams: redraw network/infrastructure ones in D2 with proper icons (router, Raspberry Pi, client devices, upstream DNS); keep simple flowcharts in Mermaid if appropriate
- Replace the Marp GitHub Actions workflow with a Quarto+D2 equivalent
- Remove Marp, Kroki, and any other obsolete tooling from the repo
- Preserve the structure and intent of the existing outline — this is a tooling migration, not a content rewrite

## Non-goals

- Rewriting the presentation content — content stays the same, only its rendering changes
- Single-source slides+docs publishing — this repo is slides only
- Executable code cells — not needed for this talk
- Anything related to other talks or future projects

## Deliverables

The spec should produce:

### 1. Migration plan
A concrete list of files to add, modify, and delete, based on what's actually in the repo.

### 2. Toolchain setup
- Quarto version pinned
- D2 binary installation (local dev + CI)
- `pandoc-ext/diagram` extension installation
- Any Python dependencies needed by Quarto for this talk

### 3. Diagram conversion
For each existing Mermaid diagram, propose either:
- A D2 rewrite (preferred for network/infrastructure diagrams, with icon usage)
- Retention as Mermaid (for simple sequence/flow diagrams where D2 adds no value)

Show the D2 syntax for at least the main home-network topology diagram.

### 4. GitHub Actions workflow
Replace the existing Marp workflow with one that installs Quarto + D2, builds the deck, and publishes to GitHub Pages.

### 5. Theme and styling
Quarto's default reveal.js theme is plainer than Marp's. Propose either a community theme or a small SCSS customisation to keep the deck looking polished. Whichever route, keep the styling minimal — this is one talk, not a design system.

## Constraints

- **Don't invent content** — work from the existing outline
- **Reliability over flash** — local rendering, no remote services in the build path
- **Markdown-flavoured** — Quarto's Pandoc Markdown only; no JSX/MDX
- **One repo, one talk** — no multi-project structure

## Open questions for the spec

- D2 installation in CI: official setup action, manual binary download, or container?
- Reveal.js theme: stick with a built-in (e.g. `dark`, `serif`), use a community theme, or write a small SCSS override?
- Are there any existing Marp directives in the outline that don't have a clean Quarto equivalent and need a workaround?
