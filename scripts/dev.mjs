import { execFileSync, spawn } from 'node:child_process';
import net from 'node:net';
import { watch, watchFile } from 'node:fs';
import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.cwd();
const slidesFile = path.join(rootDir, 'slides.md');
const assetsDir = path.join(rootDir, 'assets');
const buildScript = path.join(__dirname, 'build.mjs');

let isBuilding = false;
let rebuildPending = false;
let rebuildTimer;

const assetWatchers = new Map();

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

function queueBuild(message) {
  if (rebuildTimer) {
    clearTimeout(rebuildTimer);
  }

  rebuildTimer = setTimeout(() => {
    console.log(`[dev] ${message}; rebuilding...`);
    buildDeck();
  }, 100);
}

async function collectAssetDirectories(directory, directories = []) {
  directories.push(directory);

  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    await collectAssetDirectories(path.join(directory, entry.name), directories);
  }

  return directories;
}

async function syncAssetWatchers() {
  try {
    await access(assetsDir);
  } catch {
    for (const watcher of assetWatchers.values()) {
      watcher.close();
    }

    assetWatchers.clear();
    return;
  }

  const directories = await collectAssetDirectories(assetsDir);
  const expectedDirectories = new Set(directories);

  for (const watchedDirectory of assetWatchers.keys()) {
    if (expectedDirectories.has(watchedDirectory)) {
      continue;
    }

    assetWatchers.get(watchedDirectory)?.close();
    assetWatchers.delete(watchedDirectory);
  }

  for (const directory of directories) {
    if (assetWatchers.has(directory)) {
      continue;
    }

    const watcher = watch(directory, (eventType, filename) => {
      const changedPath = filename ? path.relative(rootDir, path.join(directory, filename.toString())) : path.relative(rootDir, directory);
      queueBuild(`asset ${eventType} detected in ${changedPath}`);

      if (eventType === 'rename') {
        void syncAssetWatchers();
      }
    });

    watcher.on('error', (error) => {
      console.error(`[dev] Asset watcher error in ${path.relative(rootDir, directory)}:`);
      console.error(error);
    });

    assetWatchers.set(directory, watcher);
  }
}

async function main() {
  buildDeck();
  await syncAssetWatchers();

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
      queueBuild('slides.md changed');
    }
  });

  const rootWatcher = watch(rootDir, (eventType, filename) => {
    if (filename?.toString() !== 'assets') {
      return;
    }

    void syncAssetWatchers();
    queueBuild(`assets directory ${eventType} detected`);
  });

  function shutdown(code = 0) {
    if (rebuildTimer) {
      clearTimeout(rebuildTimer);
    }

    rootWatcher.close();

    for (const watcher of assetWatchers.values()) {
      watcher.close();
    }

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
