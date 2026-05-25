import { execFileSync } from 'node:child_process';
import { constants } from 'node:fs';
import { access, cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const slidesFile = path.join(rootDir, 'slides.md');
const assetsDir = path.join(rootDir, 'assets');
const outputFile = path.join(distDir, 'index.html');

function runMarpBuild() {
  execFileSync('pnpm', ['exec', 'marp', slidesFile, '--allow-local-files', '--output', outputFile], {
    stdio: 'inherit',
  });
}

async function main() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  try {
    await access(assetsDir, constants.F_OK);
    await cp(assetsDir, path.join(distDir, 'assets'), { recursive: true });
  } catch {
    // The deck starts without images. Copy assets only when they exist.
  }

  await runMarpBuild();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});