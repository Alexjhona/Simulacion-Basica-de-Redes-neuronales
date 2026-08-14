import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renderiza el laboratorio CRISP-DM", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /NexoLab/);
  assert.match(html, /Del dato a/);
  assert.match(html, /CRISP-DM/);
  assert.match(html, /Random Forest/);
  assert.match(html, /Sin fuga de datos/i);
  assert.doesNotMatch(html, /codex-preview/);
});

test("incluye la API en la misma página", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /API \/ SWAGGER/);
  assert.match(html, /api\/predict/);
});
