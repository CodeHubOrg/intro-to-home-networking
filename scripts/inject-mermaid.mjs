import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

const distDir = process.cwd();
const outputFile = path.join(distDir, "index.html");

// Read the generated HTML
const htmlContent = readFileSync(outputFile, "utf-8");

// Parse HTML and transform mermaid code blocks
const dom = new JSDOM(htmlContent);
const { document } = dom.window;

// Find all code blocks with language-mermaid class and transform them
const codeBlocks = document.querySelectorAll("code.language-mermaid");
for (const codeBlock of codeBlocks) {
  const pre = codeBlock.parentElement;
  if (pre && pre.tagName === "PRE") {
    // Create new mermaid pre element
    const mermaidPre = document.createElement("pre");
    mermaidPre.className = "mermaid";
    mermaidPre.textContent = codeBlock.textContent;

    // Replace the old pre element with the new mermaid pre
    pre.parentNode.replaceChild(mermaidPre, pre);
  }
}

// Inject Mermaid library and initialisation using the DOM rather than string
// replacement, so the serialised output is always well-formed.
// Version is pinned to avoid unexpected upstream changes within v10.
const MERMAID_VERSION = "10.9.3";
const MERMAID_CDN = `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`;

if (!document.querySelector(`script[src*="mermaid"]`)) {
  const loaderScript = document.createElement("script");
  loaderScript.src = MERMAID_CDN;
  document.body.appendChild(loaderScript);

  const initScript = document.createElement("script");
  initScript.textContent = [
    'mermaid.initialize({',
    '  startOnLoad: true,',
    '  theme: "default",',
    '  flowchart: { useMaxWidth: true, nodeSpacing: 20, rankSpacing: 24 },',
    '  sequence: { actorMargin: 24, messageMargin: 14, diagramMarginY: 8 },',
    '  themeVariables: { fontSize: "14px" },',
    '});',
    'mermaid.contentLoaded();',
  ].join("\n");
  document.body.appendChild(initScript);
}

const html = dom.serialize();
writeFileSync(outputFile, html, "utf-8");
console.log(
  `✓ Transformed ${codeBlocks.length} mermaid code block(s) and injected library`,
);
