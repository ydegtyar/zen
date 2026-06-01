import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const rootArg = process.argv[2] ?? 'dist';
const root = resolve(process.cwd(), rootArg);
const host = process.env.HOST ?? '127.0.0.1';
const port = Number.parseInt(process.env.PORT ?? '4173', 10);

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    'content-type': 'text/plain; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  });
  response.end(body);
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] ?? '/');
  const normalized = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = resolve(root, `.${sep}${normalized}`);

  if (!filePath.startsWith(root + sep) && filePath !== root) {
    return null;
  }

  return filePath;
}

function resolveAsset(filePath) {
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  const indexPath = join(filePath, 'index.html');
  if (existsSync(indexPath) && statSync(indexPath).isFile()) {
    return indexPath;
  }

  const fallbackPath = join(root, 'index.html');
  if (existsSync(fallbackPath) && statSync(fallbackPath).isFile()) {
    return fallbackPath;
  }

  return null;
}

if (!existsSync(root)) {
  console.error(`Build output not found at ${root}. Run "npm run web:build" first.`);
  process.exit(1);
}

createServer((request, response) => {
  const requestPath = safePath(request.url ?? '/');

  if (!requestPath) {
    sendText(response, 400, 'Invalid path');
    return;
  }

  const assetPath = resolveAsset(requestPath);

  if (!assetPath) {
    sendText(response, 404, 'Not found');
    return;
  }

  const mimeType = mimeTypes.get(extname(assetPath)) ?? 'application/octet-stream';
  response.writeHead(200, { 'content-type': mimeType });
  createReadStream(assetPath).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});
