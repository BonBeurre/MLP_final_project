import os
from fastapi import HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mlflow.pyfunc
import pandas as pd


from utils import is_correct_format

app = FastAPI()

origins = [
    "https://easy-dominica-adibon-6ea94c08.koyeb.app",  # Your frontend origin
]

# Add CORS middleware to allow specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurer l'URI MLflow pour DagsHub
mlflow.set_tracking_uri("https://dagshub.com/djayos/my-first-repo.mlflow")

# Authentification pour DagsHub
os.environ["MLFLOW_TRACKING_USERNAME"] = "djayos"
os.environ["MLFLOW_TRACKING_PASSWORD"] = "21998e1af3bfa82f989a91f83e26d6c3e072488d"

# Charger le modèle enregistré comme "Production" dans le Model Registry
model = mlflow.pyfunc.load_model("models:/IrisModelRegistry/Production")


# Endpoint pour la prédictionnb
@app.post("/predict/")
def predict(data: dict):
    """
    Reçoit les données sous forme de JSON et retourne une prédiction.
    """
    if not is_correct_format(data):  # Valider le format des données
        raise HTTPException(status_code=400, detail="Invalid input format")
    df = pd.DataFrame([data])  # Convertir les données JSON en DataFrame
    prediction = model.predict(df)  # Effectuer la prédiction
    return {"prediction": prediction.tolist()}  # Retourner la prédiction
