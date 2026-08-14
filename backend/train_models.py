"""Entrena dos modelos reproducibles sin usar el conjunto de prueba durante el ajuste."""
from pathlib import Path
import json

import joblib
import numpy as np
from sklearn.datasets import load_digits, make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, recall_score
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
ROOT = Path(__file__).resolve().parent
OUT = ROOT / "artifacts"
OUT.mkdir(exist_ok=True)


def report(y_true, y_pred):
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "f1": round(float(f1_score(y_true, y_pred, average="weighted")), 4),
        "recall": round(float(recall_score(y_true, y_pred, average="weighted")), 4),
    }


def train_digits():
    data = load_digits()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=.20, random_state=SEED, stratify=data.target
    )
    pipeline = Pipeline([
        ("scale", StandardScaler()),
        ("model", MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=120, early_stopping=True, random_state=SEED)),
    ])
    pipeline.fit(x_train, y_train)  # El scaler solo aprende de train.
    metrics = report(y_test, pipeline.predict(x_test))
    joblib.dump({"pipeline": pipeline, "metrics": metrics, "model_version": "rn-digits-v1"}, OUT / "rn_digits.joblib")
    return metrics


def train_churn():
    x, y = make_classification(
        n_samples=25000, n_features=4, n_informative=4, n_redundant=0,
        weights=[.73, .27], class_sep=1.15, random_state=SEED,
    )
    # Escalas interpretables para la demo: antigüedad, uso, tickets, gasto.
    mins, maxs = np.array([1, 5, 0, 20]), np.array([48, 100, 10, 250])
    x = mins + (x - x.min(0)) / (x.max(0) - x.min(0)) * (maxs - mins)
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=.20, random_state=SEED, stratify=y)
    pipeline = Pipeline([("model", RandomForestClassifier(n_estimators=180, max_depth=10, class_weight="balanced", n_jobs=-1, random_state=SEED))])
    cv_f1 = cross_val_score(pipeline, x_train, y_train, cv=5, scoring="f1").mean()
    pipeline.fit(x_train, y_train)
    metrics = report(y_test, pipeline.predict(x_test)) | {"cv_f1": round(float(cv_f1), 4)}
    joblib.dump({"pipeline": pipeline, "metrics": metrics, "threshold": .55, "model_version": "rf-churn-v1"}, OUT / "rf_churn.joblib")
    return metrics


if __name__ == "__main__":
    result = {"rn_digits": train_digits(), "rf_churn": train_churn(), "seed": SEED}
    (OUT / "metrics.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
