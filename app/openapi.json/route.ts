const schema = {
  openapi: "3.0.3",
  info: {
    title: "NexoLab Inference API",
    version: "1.0.0",
    description: "Contrato académico para consumir los modelos RN, Random Forest y CNN. Las respuestas de esta versión son demostrativas.",
  },
  servers: [{ url: "/", description: "Servidor actual" }],
  paths: {
    "/api/predict": {
      get: { summary: "Estado del servicio", responses: { "200": { description: "Servicio disponible" } } },
      post: {
        summary: "Ejecutar una inferencia",
        description: "Recibe el identificador del modelo y sus variables de entrada.",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PredictionRequest" } } } },
        responses: {
          "200": { description: "Predicción generada", content: { "application/json": { schema: { $ref: "#/components/schemas/PredictionResponse" } } } },
          "422": { description: "Modelo o variables no válidos" },
        },
      },
    },
  },
  components: { schemas: {
    PredictionRequest: { type: "object", required: ["model", "features"], properties: { model: { type: "string", enum: ["rn", "rf", "cnn"] }, features: { type: "object", additionalProperties: true, example: { tenure: 9, usage: 38, tickets: 4, spend: 119 } } } },
    PredictionResponse: { type: "object", properties: { model: { type: "string" }, prediction: { oneOf: [{ type: "string" }, { type: "number" }] }, confidence: { type: "number", minimum: 0, maximum: 1 }, trace_id: { type: "string", format: "uuid" }, demo: { type: "boolean" } } },
  } },
};

export async function GET() { return Response.json(schema); }
