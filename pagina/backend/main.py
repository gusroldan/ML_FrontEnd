from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS para conexión con React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, usa solo tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carga de modelos
modelo_regresion = joblib.load("model/modelo_regresion.pkl")
modelo_clasificacion = joblib.load("model/modelo_clasificacion.pkl")
escalador = joblib.load("model/escalador.pkl")

# Pydantic para validación
class InputRegresion(BaseModel):
    kast: float
    time_alive: float
    travelled_distance: float
    round_headshots: float

class InputClasificacion(BaseModel):
    kast: float
    time_alive: float
    travelled_distance: float

@app.post("/predict/impact_score")
def predecir_impact_score(data: InputRegresion):
    X = np.array([[data.kast, data.time_alive, data.travelled_distance, data.round_headshots]])
    y_pred = modelo_regresion.predict(X)
    return {"impact_score": round(y_pred[0], 2)}

@app.post("/predict/high_impact_player")
def predecir_jugador_alto_impacto(data: InputClasificacion):
    X = np.array([[data.kast, data.time_alive, data.travelled_distance]])
    X_scaled = escalador.transform(X)
    pred = modelo_clasificacion.predict(X_scaled)
    proba = modelo_clasificacion.predict_proba(X_scaled)[0][1]
    return {
        "high_impact_prediction": int(pred[0]),
        "probability": round(proba, 3)
    }
