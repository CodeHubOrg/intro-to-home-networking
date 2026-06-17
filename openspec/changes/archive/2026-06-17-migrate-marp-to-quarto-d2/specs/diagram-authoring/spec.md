## ADDED Requirements

### Requirement: Network topology diagram authored in D2
The home-network topology diagram (currently `slides.md:129–146`) SHALL be rewritten in D2 syntax and rendered locally at build time using `pandoc-ext/diagram`.

#### Scenario: D2 block renders without errors
- **WHEN** `quarto render` is run
- **THEN** the D2 fenced block produces an SVG/PNG with no rendering errors

#### Scenario: Topology diagram uses infrastructure icons
- **WHEN** the rendered deck is opened in a browser
- **THEN** the home-network topology diagram displays distinct icons for router, Pi-hole (Raspberry Pi), Wi-Fi AP, and client devices

#### Scenario: No network call during diagram render
- **WHEN** `quarto render` is run with no internet access
- **THEN** the D2 diagram renders successfully from the local D2 binary

### Requirement: Simple flowcharts retained as Mermaid
The Pi-hole dashboard flowcharts (appearing in sections 2, 3, and 4 of `slides.md`) SHALL remain as Mermaid diagrams rendered via `pandoc-ext/diagram`.

#### Scenario: Mermaid blocks render without errors
- **WHEN** `quarto render` is run
- **THEN** all Mermaid fenced blocks produce output with no errors

#### Scenario: Flowchart content preserved
- **WHEN** the rendered deck is opened
- **THEN** each flowchart shows the same nodes and edges as the original: Query Log → Blocked Domains → Client Analysis → Dashboard → Blocklists

### Requirement: Diagrams rendered locally at build time
All diagram rendering SHALL use local binaries (D2, Mermaid CLI). No diagram SHALL be sent to a remote rendering service during build or development.

#### Scenario: Build succeeds offline
- **WHEN** the build is run in an environment with no outbound HTTP access
- **THEN** all diagrams render successfully

#### Scenario: No Kroki endpoint configured
- **WHEN** the project is checked out fresh
- **THEN** there is no `KROKI_ENDPOINT` environment variable, no `docker-compose.kroki.yml`, and the build still produces all diagrams
