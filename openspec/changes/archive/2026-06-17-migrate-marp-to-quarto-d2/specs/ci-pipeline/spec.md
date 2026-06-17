## ADDED Requirements

### Requirement: Test-build workflow validates the deck on every push and PR
A GitHub Actions workflow SHALL run `quarto render` on pushes to `main`, `develop`, and `feature/**` / `fix/**` branches, and on all pull requests, when relevant files change.

#### Scenario: Workflow triggers on slide source changes
- **WHEN** a push is made that modifies `slides.qmd`, `_quarto.yml`, `custom.scss`, or `assets/**`
- **THEN** the test-build workflow is triggered

#### Scenario: Workflow succeeds on a valid deck
- **WHEN** `quarto render` completes without errors
- **THEN** the workflow job passes

#### Scenario: Workflow fails on a broken deck
- **WHEN** `slides.qmd` contains a malformed fenced block or missing asset
- **THEN** the workflow job fails with a non-zero exit code

### Requirement: Deploy workflow publishes to GitHub Pages on main push
A GitHub Actions workflow SHALL run `quarto publish gh-pages` on pushes to `main` when relevant files change.

#### Scenario: Deploy triggers on main push with slide changes
- **WHEN** a push to `main` modifies `slides.qmd`, `_quarto.yml`, `custom.scss`, or `assets/**`
- **THEN** the deploy workflow is triggered

#### Scenario: Published site is accessible
- **WHEN** the deploy workflow completes successfully
- **THEN** the GitHub Pages site serves the rendered reveal.js deck

### Requirement: CI installs D2 from official binary release
The CI workflows SHALL install D2 by downloading the official binary from the D2 GitHub releases, pinned to a specific version.

#### Scenario: D2 binary available after install step
- **WHEN** the install step completes
- **THEN** `d2 --version` exits successfully

#### Scenario: D2 version is pinned
- **WHEN** the workflow file is inspected
- **THEN** the D2 version is a hard-coded semver string, not `latest`

### Requirement: No remote rendering services in the build path
The CI build SHALL NOT start Docker containers, call Kroki, or make HTTP requests to any external rendering service.

#### Scenario: No Docker Compose usage in workflows
- **WHEN** the workflow files are inspected
- **THEN** there are no `docker compose` steps and no reference to `docker-compose.kroki.yml`

#### Scenario: No KROKI_ENDPOINT in CI environment
- **WHEN** the workflow environment is inspected
- **THEN** `KROKI_ENDPOINT` is not set as an env var or secret
