import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultRoot = path.join(projectRoot, 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

export function parseRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  const first = Number(match[1]);
  const last = Number(match[2]);
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last)) return null;
  const start = match[1] ? first : Math.max(0, size - last);
  const end = match[1] && match[2] ? Math.min(last, size - 1) : size - 1;
  return start >= 0 && start <= end && start < size ? { start, end } : null;
}

export function createSiteServer(root = defaultRoot) {
  root = path.resolve(root);
  return http.createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end();
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); return res.end('Invalid URL'); }
    if (pathname.includes('\0')) { res.writeHead(400); return res.end('Invalid URL'); }
    if (pathname === '/__dusk_health') {
      const body = JSON.stringify({ app: 'dusk', root });
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
      return res.end(req.method === 'HEAD' ? undefined : body);
    }
    try {
      let file = path.resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
      let info;
      try { info = await stat(file); if (!info.isFile()) throw Error(); }
      catch {
        if (path.extname(pathname)) { res.writeHead(404); return res.end('File not found'); }
        file = path.join(root, 'index.html'); info = await stat(file);
      }
      const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
      let range;
      if (req.headers.range) {
        range = parseRange(req.headers.range, info.size);
        if (!range) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }); return res.end(); }
        headers['Content-Range'] = `bytes ${range.start}-${range.end}/${info.size}`;
      }
      headers['Content-Length'] = range ? range.end - range.start + 1 : info.size;
      res.writeHead(range ? 206 : 200, headers);
      if (req.method === 'HEAD') return res.end();
      const stream = createReadStream(file, range || {});
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch {
      if (res.headersSent) return res.destroy();
      res.writeHead(500); res.end('Unable to load site. Run npm run build and retry.');
    }
  });
}

async function start() {
  try { await stat(path.join(defaultRoot, 'index.html')); }
  catch { console.error('Missing dist/index.html. Run npm install and npm run build first.'); process.exitCode = 1; return; }
  const server = createSiteServer();
  server.on('error', async error => {
    if (error.code === 'EADDRINUSE') {
      try {
        const response = await fetch('http://127.0.0.1:5188/__dusk_health', { signal: AbortSignal.timeout(2000) });
        const existing = await response.json();
        if (existing.app === 'dusk' && existing.root === defaultRoot) {
          console.log('DUSK: http://localhost:5188/ (already running)'); return;
        }
      } catch {}
      console.error('Port 5188 is used by another program. Stop it and try again.');
    } else console.error(error.message);
    process.exitCode = 1;
  });
  console.log('DUSK server starting');
  server.listen(5188, '127.0.0.1', () => console.log('DUSK: http://localhost:5188/\nKeep this window open. Press Ctrl+C to stop.'));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await start();
