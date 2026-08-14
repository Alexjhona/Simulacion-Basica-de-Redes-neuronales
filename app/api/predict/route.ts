type Payload = {
  model?: "rn" | "rf" | "cnn";
  features?: Record<string, number | string>;
};

export async function POST(request: Request) {
  let body: Payload;
  try { body = await request.json() as Payload; }
  catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!body.model || !["rn", "rf", "cnn"].includes(body.model)) {
    return Response.json({ error: "model debe ser rn, rf o cnn" }, { status: 422 });
  }

  const features = body.features ?? {};
  if (body.model === "rf") {
    const tenure = Number(features.tenure ?? 9);
    const usage = Number(features.usage ?? 38);
    const tickets = Number(features.tickets ?? 4);
    const spend = Number(features.spend ?? 119);
    const risk = Math.min(.96, Math.max(.04, (20 + tickets * 8 + (40 - usage) * .75 + (18 - tenure) * .9 - spend * .08) / 100));
    return Response.json({
      model: "rf-churn-v1", prediction: risk > .6 ? "abandona" : "permanece",
      confidence: Number((risk > .6 ? risk : 1 - risk).toFixed(3)),
      probabilities: { permanece: Number((1 - risk).toFixed(3)), abandona: Number(risk.toFixed(3)) },
      trace_id: crypto.randomUUID(), demo: true,
    });
  }

  if (body.model === "rn") {
    const activePixels = Number(features.active_pixels ?? 34);
    const prediction = Math.abs(Math.round(activePixels * 1.7)) % 10;
    return Response.json({ model: "rn-digits-v1", prediction, confidence: .84, trace_id: crypto.randomUUID(), demo: true });
  }

  const label = String(features.label_hint ?? "gato").toLowerCase();
  const prediction = label.includes("perro") ? "perro" : label.includes("ave") ? "ave" : "gato";
  return Response.json({ model: "cnn-animals-v1", prediction, confidence: .82, trace_id: crypto.randomUUID(), demo: true });
}

export async function GET() {
  return Response.json({ service: "NexoLab Inference API", version: "1.0.0", status: "ok", docs: "/api-docs" });
}
