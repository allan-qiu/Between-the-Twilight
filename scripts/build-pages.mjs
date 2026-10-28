import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

// GitHub Pages serves directories as independent pages. Each entry uses the
// same React bundle, with absolute repository-prefixed asset URLs.
const routes = ['cinema', 'palette', 'journal', 'journal/a-slow-ending', 'journal/the-colors-of-dusk', 'journal/a-moment-to-do-nothing', 'letters', 'about'];
const output = path.join(root, 'dist');
const html = await readFile(path.join(output, 'index.html'), 'utf8');
for (const route of routes) {
    const directory = path.join(output, route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), html);
}
await writeFile(path.join(output, '404.html'), html);
await writeFile(path.join(output, '.nojekyll'), '');
console.log('GitHub Pages ready: dist/ (9 independent page entries)');
