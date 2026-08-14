# Metodología CRISP-DM — NexoLab

## 1. Comprensión del negocio

Caso de referencia: una empresa de servicios quiere reducir la pérdida de clientes y mejorar la priorización de acciones comerciales. El KPI principal es *recall* sobre clientes que abandonan; como métricas secundarias se usan F1, precisión, latencia y costo de intervención. La predicción apoya la decisión, no la automatiza sin revisión.

## 2. Comprensión de los datos

- Fuentes reales autorizadas: CRM, soporte, transacciones y datos públicos cuya licencia y `robots.txt` permitan uso.
- Datos sintéticos: se usan para prototipar volumen, probar esquemas y cubrir casos escasos. Siempre se marca `is_synthetic` y nunca se presentan como evidencia real.
- CAPTCHA: no se evade. El recolector se detiene para resolución humana o se reemplaza por una API/exportación oficial.
- Se registran fuente, fecha, licencia, esquema, nulos, duplicados, rangos y distribución de la variable objetivo.

## 3. Preparación

Se eliminan duplicados por clave de negocio, se corrigen tipos, se imputan nulos y se revisan valores extremos. La división `train/validation/test` ocurre **antes** de aprender imputaciones, escalas, selección de variables o sobremuestreo. Cada transformación vive dentro de un `Pipeline` ajustado solo con entrenamiento.

## 4. Modelado

- **Red neuronal (RN):** útil para relaciones no lineales; la demo reconoce dígitos. Requiere escala, control de épocas y `early_stopping`.
- **Random Forest (RF):** recomendado inicialmente para abandono de clientes por su robustez, bajo costo y explicabilidad mediante importancia/SHAP.
- **CNN:** adecuada cuando el dato es una imagen y los patrones espaciales importan. Necesita un conjunto de imágenes etiquetado, separado por entidad y suficiente diversidad.

La interfaz web usa pesos de muestra para explicar el flujo. Los artefactos Python de RN y RF sí se entrenan; una CNN productiva debe conectarse cuando exista un conjunto autorizado de imágenes.

## 5. Evaluación y prevención de fuga

- Separación estratificada 70/15/15; en datos temporales, separación por fecha.
- Una persona, cliente o imagen fuente no puede aparecer en más de un conjunto.
- El test se usa una sola vez al elegir la versión final.
- Las épocas se monitorean con validación y paciencia; entrenar más no implica generalizar mejor.
- Se comparan baseline, validación cruzada, matriz de confusión, F1/recall, calibración y desempeño por segmento.
- Se revisan variables posteriores al evento, identificadores, agregados calculados con el futuro y duplicados cercanos.

## 6. Despliegue y Business Intelligence

La API versionada expone predicción, confianza y `trace_id`. Swagger documenta el contrato. El tablero de BI consume agregados y predicciones monitoreadas; no repite lógica de limpieza. Se controla deriva de datos, caída de métricas, latencia y proporción de predicciones por clase. Cada reentrenamiento registra datos, código, semilla, hiperparámetros, métricas y aprobación.

## Criterio de selección

La solución óptima no es necesariamente la de mayor accuracy. Para churn se propone: F1/recall 35%, explicabilidad 30%, costo/latencia 20% y estabilidad 15%. Los pesos deben acordarse con negocio antes de evaluar candidatos.
