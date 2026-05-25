import { execFileSync, spawn } from 'node:child_process';
import net from 'node:net';
import { watchFile } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.cwd();
const slidesFile = path.join(rootDir, 'slides.md');
const buildScript = path.join(__dirname, 'build.mjs');

let isBuilding = false;
let rebuildPending = false;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once('error', () => resolve(false));
    tester.once('listening', () => {
      tester.close(() => resolve(true));
    });

    tester.listen(port, '0.0.0.0');
  });
}

async function findAvailablePort(startPort, maxAttempts = 20) {
  for (let index = 0; index < maxAttempts; index += 1) {
    const candidate = startPort + index;
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
  }

  throw new Error(`No available port found from ${startPort} to ${startPort + maxAttempts - 1}.`);
}

function buildDeck() {
  if (isBuilding) {
    rebuildPending = true;
    return;
  }

  isBuilding = true;

  try {
    execFileSync('node', [buildScript], {
      cwd: rootDir,
      stdio: 'inherit',
    });
  } finally {
    isBuilding = false;

    if (rebuildPending) {
      rebuildPending = false;
      buildDeck();
    }
  }
}

async function main() {
  buildDeck();

  const requestedPort = Number(process.env.PORT ?? '8080');
  const port = await findAvailablePort(requestedPort);

  if (port !== requestedPort) {
    console.log(`[dev] Port ${requestedPort} is in use, using ${port} instead.`);
  }

  const server = spawn('pnpm', ['exec', 'http-server', 'dist', '-p', String(port), '-c-1', '-o'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  watchFile(slidesFile, { interval: 500 }, (current, previous) => {
    if (current.mtimeMs !== previous.mtimeMs) {
      console.log('[dev] slides.md changed; rebuilding...');
      buildDeck();
    }
  });

  function shutdown(code = 0) {
    server.kill('SIGTERM');
    process.exit(code);
  }

  process.on('SIGINT', () => shutdown(0));
  process.on('SIGTERM', () => shutdown(0));

  server.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
