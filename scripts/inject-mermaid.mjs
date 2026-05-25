import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const distDir = process.cwd();
const outputFile = path.join(distDir, 'index.html');

// Read the generated HTML
let html = readFileSync(outputFile, 'utf-8');

// Add Mermaid.js library before closing body tag if not already present
if (!html.includes('mermaid.min.js')) {
  const mermaidScript = `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'default' }); mermaid.contentLoaded();<\/script>
</body>`;
  
  html = html.replace('</body>', mermaidScript);
  writeFileSync(outputFile, html, 'utf-8');
  console.log('✓ Mermaid.js library injected into dist/index.html');
} else {
  console.log('✓ Mermaid.js already present in dist/index.html');
}
