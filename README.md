# NexoLab — CRISP-DM interactivo

Aplicación académica para explicar el ciclo completo de minería de datos aplicado a inteligencia de negocios. Incluye un laboratorio visual con RN, Random Forest y CNN; controles contra fuga; API consumible; contrato OpenAPI y un backend Python opcional con Swagger.

## Aplicación web

```bash
npm install
npm run dev
```

Todo el laboratorio y la prueba de API viven en `/`. El contrato está en `/openapi.json` y la inferencia demostrativa en `POST /api/predict`.

## Backend Python entrenable

```bash
python -m venv .venv
.venv/Scripts/pip install -r backend/requirements.txt
.venv/Scripts/python backend/train_models.py
.venv/Scripts/uvicorn backend.main:app --reload
```

Swagger queda en `http://127.0.0.1:8000/docs`. Los artefactos se escriben en `backend/artifacts/` y no se mezclan los conjuntos de entrenamiento y prueba.

## Recolección responsable

`backend/scrape_manual_captcha.py` comprueba `robots.txt`, usa un agente identificable y pausa si aparece CAPTCHA. No incorpora técnicas de evasión. Antes de usarlo, verifique términos, licencia, datos personales y autorización de la empresa.

La justificación metodológica completa está en `docs/METODOLOGIA_CRISP_DM.md`.
