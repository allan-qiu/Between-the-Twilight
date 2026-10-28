import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = path.join(root, 'dist');
test('GitHub Pages has compiled assets and standalone entries for all nine routes', async () => {
  const html = await readFile(path.join(docs,'index.html'),'utf8');
  assert.ok(!html.includes('/src/main.tsx'));
  const assets = [...html.matchAll(/(?:src|href)="(\/Between-the-Twilight\/[^"?#]+)"/g)].map(match=>match[1]);
  assert.ok(assets.some(asset=>asset.endsWith('.js')));
  for(const asset of assets) assert.ok((await stat(path.join(docs,asset.slice('/Between-the-Twilight/'.length)))).isFile());
  for(const route of ['cinema','palette','journal','journal/a-slow-ending','journal/the-colors-of-dusk','journal/a-moment-to-do-nothing','letters','about']) {
    assert.equal(await readFile(path.join(docs,route,'index.html'),'utf8'),html);
  }
  await stat(path.join(docs,'.nojekyll'));
  assert.deepEqual(await readFile(path.join(docs,'media/sunset.mp4')),await readFile(path.join(root,'public/media/sunset.mp4')));
});
