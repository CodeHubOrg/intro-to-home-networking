import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const distDir = process.cwd();
const outputFile = path.join(distDir, 'index.html');

// Read the generated HTML
const htmlContent = readFileSync(outputFile, 'utf-8');

// Parse HTML and transform mermaid code blocks
const dom = new JSDOM(htmlContent);
const { document } = dom.window;

// Find all code blocks with language-mermaid class and transform them
const codeBlocks = document.querySelectorAll('code.language-mermaid');
codeBlocks.forEach(codeBlock => {
  const pre = codeBlock.parentElement;
  if (pre && pre.tagName === 'PRE') {
    // Create new mermaid pre element
    const mermaidPre = document.createElement('pre');
    mermaidPre.className = 'mermaid';
    mermaidPre.textContent = codeBlock.textContent;
    
    // Replace the old pre element with the new mermaid pre
    pre.parentNode.replaceChild(mermaidPre, pre);
  }
});

// Get the updated HTML
let html = dom.serialize();

// Add Mermaid.js library before closing body tag if not already present
if (!html.includes('mermaid.min.js')) {
  const mermaidScript = `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'default' }); mermaid.contentLoaded();<\/script>
</body>`;
  
  html = html.replace('</body>', mermaidScript);
}

writeFileSync(outputFile, html, 'utf-8');
console.log(`✓ Transformed ${codeBlocks.length} mermaid code block(s) and injected library`);
