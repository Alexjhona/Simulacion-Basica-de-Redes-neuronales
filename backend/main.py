"""API Python opcional. Expone Swagger en /docs y carga artefactos entrenados."""
from pathlib import Path
from typing import Literal

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
ARTIFACTS = ROOT / "artifacts"

app = FastAPI(
    title="NexoLab Model API",
    version="1.0.0",
    description="API de referencia del pipeline CRISP-DM. Swagger UI: /docs",
)


class RFInputs(BaseModel):
    tenure: float = Field(ge=0, le=120)
    usage: float = Field(ge=0, le=100)
    tickets: float = Field(ge=0, le=30)
    spend: float = Field(ge=0)


class PredictionRequest(BaseModel):
    model: Literal["rf"]
    features: RFInputs


@app.get("/health")
def health():
    return {"status": "ok", "artifacts": ARTIFACTS.exists()}


@app.post("/predict")
def predict(payload: PredictionRequest):
    path = ARTIFACTS / "rf_churn.joblib"
    if not path.exists():
        raise HTTPException(503, "Ejecute primero: python train_models.py")
    bundle = joblib.load(path)
    ordered = np.array([[
        payload.features.tenure, payload.features.usage,
        payload.features.tickets, payload.features.spend,
    ]])
    probability = float(bundle["pipeline"].predict_proba(ordered)[0, 1])
    return {
        "model": bundle["model_version"],
        "prediction": "abandona" if probability >= bundle["threshold"] else "permanece",
        "confidence": probability,
        "threshold": bundle["threshold"],
    }
