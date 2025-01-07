from fastapi.testclient import TestClient
from app import app 
from unittest.mock import patch

client = TestClient(app)

def test_predict_valid_data():
    
    input_data = {
        "sepal_length": 5.1,
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2,
    }
    response = client.post("/predict/", json=input_data)

    assert response.status_code == 200 
    assert "prediction" in response.json()  # Vérifier 'prediction' est dans la réponse


def test_predict_invalid_data():

    invalid_data = {"invalid_feature": "not_a_number"}
    response = client.post("/predict/", json=invalid_data)

    assert response.status_code == 400 
    assert response.json()["detail"] == "Invalid input format"  # Vérifier le message d'erreur


    
def test_invalid_http_method():
    response = client.get("/predict/")
    assert response.status_code == 405  # Méthode pas autorisée