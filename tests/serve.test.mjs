import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { createSiteServer, parseRange } from '../scripts/serve.mjs';

test('range requests support seeking, suffixes and invalid bounds', () => {
  assert.deepEqual(parseRange('bytes=10-19',100),{start:10,end:19});
  assert.deepEqual(parseRange('bytes=90-',100),{start:90,end:99});
  assert.deepEqual(parseRange('bytes=-10',100),{start:90,end:99});
  assert.deepEqual(parseRange('bytes=90-200',100),{start:90,end:99});
  for (const value of ['bytes=-0','bytes=-','bytes=100-','bytes=20-10','bytes=0-1,5-6','bytes=NaN-3','bytes=9007199254740993-']) assert.equal(parseRange(value,100),null,value);
});

test('static server handles direct routes, HEAD, video suffixes and malformed URLs', async t => {
  const server = createSiteServer();
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  const base=`http://127.0.0.1:${server.address().port}`;
  const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  for (const route of ['/','/journal/a-slow-ending','/letters']) {
    const response=await fetch(base+route);assert.equal(response.status,200);assert.equal(await response.text(),index);
  }
  const bytes=await readFile(new URL('../dist/media/sunset.mp4',import.meta.url));
  const tail=await fetch(base+'/media/sunset.mp4',{headers:{Range:'bytes=-1024'}});
  assert.equal(tail.status,206);assert.equal(tail.headers.get('content-range'),`bytes ${bytes.length-1024}-${bytes.length-1}/${bytes.length}`);
  assert.deepEqual(Buffer.from(await tail.arrayBuffer()),bytes.subarray(-1024));
  const head=await fetch(base+'/media/sunset.mp4',{method:'HEAD',headers:{Range:'bytes=0-1023'}});
  assert.equal(head.status,206);assert.equal(head.headers.get('content-length'),'1024');assert.equal((await head.arrayBuffer()).byteLength,0);
  assert.equal((await fetch(base+'/media/sunset.mp4',{headers:{Range:'bytes=999999999-'}})).status,416);
  assert.equal((await fetch(base+'/media/missing.mp4')).status,404);
  assert.equal((await fetch(base+'/%ZZ')).status,400);
  assert.equal((await fetch(base+'/%00')).status,400);
  assert.equal((await fetch(base+'/%2e%2e%5cpackage.json')).status,403);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
});
