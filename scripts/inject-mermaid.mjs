import { readFileSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";

const distDir = process.cwd();
const outputFile = path.join(distDir, "index.html");
const diagramsDir = path.join(distDir, "assets", "diagrams");
const krokiEndpoint = (process.env.KROKI_ENDPOINT ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const krokiTimeoutMs = Number(process.env.KROKI_TIMEOUT_MS ?? "20000");
const failOnError = (process.env.KROKI_FAIL_ON_ERROR ?? "true").toLowerCase() !== "false";

const htmlContent = readFileSync(outputFile, "utf-8");

const dom = new JSDOM(htmlContent);
const { document } = dom.window;

async function renderMermaid(diagramSource) {
  const response = await fetch(`${krokiEndpoint}/mermaid/svg`, {
    method: "POST",
    headers: {
      Accept: "image/svg+xml",
      "Content-Type": "text/plain",
    },
    body: diagramSource,
    signal: AbortSignal.timeout(krokiTimeoutMs),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Kroki request failed (${response.status} ${response.statusText}): ${errorBody.slice(0, 300)}`,
    );
  }

  return response.text();
}

async function main() {
  await mkdir(diagramsDir, { recursive: true });

  const codeBlocks = document.querySelectorAll("code.language-mermaid");
  let renderedCount = 0;
  let fallbackCount = 0;

  for (const [index, codeBlock] of codeBlocks.entries()) {
    const pre = codeBlock.parentElement;
    if (!pre || pre.tagName !== "PRE") {
      continue;
    }

    const source = codeBlock.textContent ?? "";

    try {
      const svgText = await renderMermaid(source);
      const filename = `diagram-${index}.svg`;
      await writeFile(path.join(diagramsDir, filename), svgText, "utf-8");

      const img = document.createElement("img");
      img.setAttribute("src", `assets/diagrams/${filename}`);
      img.setAttribute("class", "mermaid-diagram");
      img.setAttribute("alt", `Diagram ${index + 1}`);

      pre.parentNode.replaceChild(img, pre);
      renderedCount += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (failOnError) {
        throw new Error(`Failed to render Mermaid diagram via Kroki: ${message}`);
      }

      pre.setAttribute("data-kroki-error", message.slice(0, 200));
      fallbackCount += 1;
    }
  }

  const html = dom.serialize();
  writeFileSync(outputFile, html, "utf-8");

  console.log(
    `✓ Rendered ${renderedCount} Mermaid block(s) via Kroki${fallbackCount > 0 ? `, kept ${fallbackCount} fallback block(s)` : ""}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
