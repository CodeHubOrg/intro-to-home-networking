module.exports = {
  // html is required: slides use <br/> tags inside Mermaid diagram labels.
  // Implication: raw HTML in slides.md will be rendered as-is in the output.
  // Keep slides.md under source control and avoid user-supplied content.
  html: true,
  markdown: {
    html: true,
  },
  mermaid: {
    startOnLoad: true,
    theme: 'default',
  },
};
