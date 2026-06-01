import { access, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const sitePublicDir = path.join(projectRoot, 'site', 'public');
const outputDir = path.join(sitePublicDir, 'app-build');
const publicBasePath = '/app-build';

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function rewriteGeneratedAssetPaths() {
  const generatedNodeModulesDir = path.join(outputDir, 'assets', 'node_modules');
  const vendorDir = path.join(outputDir, 'assets', 'vendor');

  if (!(await pathExists(generatedNodeModulesDir))) {
    return;
  }

  await rm(vendorDir, { recursive: true, force: true });
  await rename(generatedNodeModulesDir, vendorDir);

  const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.txt', '.xml']);
  const files = await walkFiles(outputDir);

  await Promise.all(files.map(async (file) => {
    if (!textExtensions.has(path.extname(file))) {
      return;
    }

    const fileStat = await stat(file);
    if (fileStat.size > 20 * 1024 * 1024) {
      return;
    }

    const source = await readFile(file, 'utf8');
    const updated = source
      .replaceAll('/app-build/assets/node_modules/', '/app-build/assets/vendor/')
      .replaceAll('app-build/assets/node_modules/', 'app-build/assets/vendor/')
      .replaceAll('assets/node_modules/', 'assets/vendor/');

    if (updated !== source) {
      await writeFile(file, updated);
    }
  }));
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

await mkdir(sitePublicDir, { recursive: true });
await rm(outputDir, { recursive: true, force: true });

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

await run(
  npx,
  ['expo', 'export', '--platform', 'web', '--output-dir', outputDir],
  {
    cwd: projectRoot,
    env: {
      ...process.env,
      EXPO_WEB_BASE_URL: publicBasePath,
    },
  },
);

if (!(await pathExists(path.join(outputDir, 'index.html')))) {
  throw new Error(`Expo export did not create ${path.join(outputDir, 'index.html')}`);
}

await rewriteGeneratedAssetPaths();

console.log(`React Native web build exported to ${path.relative(projectRoot, outputDir)}`);
console.log(`Serve it from the site at ${publicBasePath}/`);
