from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app
app = FastAPI()

# CORS para permitir conexión con frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a ["http://localhost:3000"] si prefieres restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelos
modelo_regresion = joblib.load("model/modelo_regresion.pkl")
modelo_clasificacion = joblib.load("model/modelo_clasificacion.pkl")
escalador = joblib.load("model/escalador.pkl")

# Modelo de entrada
class InputData(BaseModel):
    KAST: float
    TimeAlive: float
    TravelledDistance: float
    RoundHeadshots: float

# Ruta de prueba
@app.get("/")
def root():
    return {"message": "API operativa"}

# Endpoint de regresión
@app.post("/predict_regression")
def predict_regression(data: InputData):
    features = np.array([[data.KAST, data.TimeAlive, data.TravelledDistance, data.RoundHeadshots]])
    prediction = modelo_regresion.predict(features)
    return {"ImpactPlayerScore": round(prediction[0], 2)}

# Endpoint de clasificación
@app.post("/predict_classification")
def predict_classification(data: InputData):
    features = np.array([[data.KAST, data.TimeAlive, data.TravelledDistance, data.RoundHeadshots]])
    features_scaled = escalador.transform(features)
    prediction = modelo_clasificacion.predict(features_scaled)
    return {"HighImpactPlayer": int(prediction[0])}
