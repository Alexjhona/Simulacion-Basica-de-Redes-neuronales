import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renderiza únicamente el laboratorio interactivo", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /LABORATORIO INTERACTIVO/);
  assert.match(html, /Red neuronal/);
  assert.match(html, /Random Forest/);
  assert.match(html, /Red convolucional/);
  assert.doesNotMatch(html, /Del dato a/);
  assert.doesNotMatch(html, /EVALUACIÓN Y GOBIERNO/);
  assert.doesNotMatch(html, /API \/ SWAGGER/);
  assert.doesNotMatch(html, /codex-preview/);
});
