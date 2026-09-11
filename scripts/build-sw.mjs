import { readdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
async function walk(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const path = dir + "/" + e.name;
    if (e.isDirectory()) files.push(...(await walk(path)));
    else if (e.name !== "sw.js") files.push(path);
  }
  return files;
}
const files = await walk("dist");
const hash = createHash("sha256");
for (const file of files) hash.update(await readFile(file));
const version = hash.digest("hex").slice(0, 12);
const paths = files.map((p) => p.slice(5));
paths.push("");
await writeFile(
  "dist/sw.js",
  `const BASE=new URL('./',self.location.href);const PREFIX='woodcrafting-'+BASE.pathname+'-';const CACHE=PREFIX+${JSON.stringify(version)};const FILES=${JSON.stringify(paths)}.map(path=>new URL(path,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;event.respondWith(caches.open(CACHE).then(async cache=>{const hit=await cache.match(event.request);if(hit)return hit;try{return await fetch(event.request);}catch{return event.request.mode==='navigate'?(await cache.match(new URL('index.html',BASE).href))||Response.error():Response.error();}}));});`,
);
