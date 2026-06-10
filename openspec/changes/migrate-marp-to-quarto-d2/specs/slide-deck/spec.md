## ADDED Requirements

### Requirement: Slides authored in Quarto Markdown
The presentation SHALL be authored as a single `.qmd` file using Quarto's Pandoc Markdown dialect. Marp-specific front matter (theme, paginate, inline style blocks) SHALL NOT appear in the source file.

#### Scenario: Quarto front matter present
- **WHEN** `slides.qmd` is opened
- **THEN** it contains a YAML front matter block with `format: revealjs` and `slide-level: 2`

#### Scenario: No Marp directives in source
- **WHEN** `slides.qmd` is inspected
- **THEN** there are no `marp: true`, `paginate:`, or Marp `style: |` directives

### Requirement: Deck builds to reveal.js HTML
The presentation SHALL render to a self-contained reveal.js HTML file via `quarto render`.

#### Scenario: Successful local render
- **WHEN** `quarto render slides.qmd` is run from the project root
- **THEN** a valid HTML file is produced in the output directory with no errors

#### Scenario: No network calls during build
- **WHEN** the build is run with no internet access
- **THEN** the build completes successfully and produces output

### Requirement: All existing slide content preserved
Every slide section, heading, bullet point, image reference, and speaker note from `slides.md` SHALL be present in `slides.qmd` with equivalent content.

#### Scenario: Section count matches
- **WHEN** `slides.qmd` is rendered
- **THEN** the deck contains the same number of top-level sections as the original `slides.md`

#### Scenario: Sponsor images render
- **WHEN** the deck is opened in a browser
- **THEN** all three sponsor images (`desklodge`, `io-academy`, `tuppenny-well`) are visible on the Welcome slide

### Requirement: Slide layout styled to match Marp Gaia quality
A `custom.scss` file SHALL define font sizes and spacing that produce a visually polished deck comparable to the Marp Gaia theme.

#### Scenario: Custom theme applied
- **WHEN** the deck is rendered
- **THEN** heading and body font sizes are explicitly set and the layout does not use reveal.js defaults unstyled

#### Scenario: Slides do not overflow
- **WHEN** any slide with a long bullet list is displayed at 1280×720
- **THEN** content is not clipped and does not require scrolling
