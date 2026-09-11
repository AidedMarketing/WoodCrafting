import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

for (const prefix of ["/", "/WoodCrafting/"])
  test(`worker at ${prefix} caches all assets, serves offline navigation, and leaves unrelated caches alone`, async () => {
    const dir = await mkdtemp(join(tmpdir(), "woodcrafting-sw-"));
    try {
      await mkdir(join(dir, "dist/assets"), { recursive: true });
      await writeFile(join(dir, "dist/index.html"), "<html>Lesson</html>");
      await writeFile(join(dir, "dist/assets/model.js"), "model");
      const generate = () =>
        execFileSync(process.execPath, [resolve("scripts/build-sw.mjs")], {
          cwd: dir,
        });
      generate();
      const original = await readFile(join(dir, "dist/sw.js"), "utf8");
      const handlers = {},
        cached = [],
        removed = [];
      const page = new Response("offline lesson");
      const cacheApi = {
        open: async () => ({
          addAll: async (files) => cached.push(...files),
          match: async (request) =>
            request === `https://wood.example${prefix}index.html`
              ? page
              : undefined,
        }),
        keys: async () => [
          `woodcrafting-${prefix}-old`,
          "another-app-cache",
          "woodcrafting-/other/-v1",
        ],
        delete: async (key) => removed.push(key),
        match: async (request) =>
          request === "/index.html" ? page : undefined,
      };
      vm.runInNewContext(original, {
        URL,
        Response,
        caches: cacheApi,
        fetch: async () => {
          throw new Error("offline");
        },
        self: {
          location: {
            origin: "https://wood.example",
            href: `https://wood.example${prefix}sw.js`,
          },
          clients: { claim: async () => {} },
          addEventListener: (name, fn) => (handlers[name] = fn),
        },
      });
      let pending;
      handlers.install({ waitUntil: (p) => (pending = p) });
      await pending;
      assert.ok(
        cached.includes(`https://wood.example${prefix}assets/model.js`),
      );
      assert.ok(cached.includes(`https://wood.example${prefix}index.html`));
      assert.ok(cached.includes(`https://wood.example${prefix}`));
      handlers.activate({ waitUntil: (p) => (pending = p) });
      await pending;
      assert.deepEqual(removed, [`woodcrafting-${prefix}-old`]);
      handlers.fetch({
        request: {
          url: `https://wood.example${prefix}?project=egg`,
          method: "GET",
          mode: "navigate",
        },
        respondWith: (p) => (pending = p),
      });
      assert.equal(await (await pending).text(), "offline lesson");
      let intercepted = false;
      handlers.fetch({
        request: { url: "https://external.example/source", method: "GET" },
        respondWith: () => (intercepted = true),
      });
      assert.equal(intercepted, false);
      await writeFile(join(dir, "dist/assets/model.js"), "new model");
      generate();
      assert.notEqual(
        await readFile(join(dir, "dist/sw.js"), "utf8"),
        original,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
