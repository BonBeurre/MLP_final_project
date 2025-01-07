import sys
import os
from app import app  # Now this will work

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


client = TestClient(app)


@pytest.fixture
def mock_mlflow_model():
    """Mock the model loading and prediction."""
    with patch("mlflow.pyfunc.load_model") as mock_load_model:
        mock_model = MagicMock()
        mock_model.predict.return_value = ["Iris-setosa"]
        mock_load_model.return_value = mock_model
        yield mock_load_model


def test_predict_endpoint_success(mock_mlflow_model):
    """Test the predict endpoint with valid data."""
    test_data = {
        "sepal_length": 5.1,
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2,
    }
    response = client.post("/predict/", json=test_data)
    assert response.status_code == 200
    assert response.json() == {"prediction": ["Iris-setosa"]}


def test_predict_endpoint_invalid_data():
    """Test the predict endpoint with improperly formatted data."""
    # This data has incorrect keys
    invalid_data = {
        "width_length": 5.1,  # Not the correct key per is_correct_format
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2,
    }
    response = client.post("/predict/", json=invalid_data)
    # Expect the endpoint to reject invalid data
    assert response.status_code == 400


def test_predict_endpoint_missing_data():
    """Test the predict endpoint with missing required fields."""
    partial_data = {
        "sepal_length": 5.1,
        "sepal_width": 3.5,
        # petal_length and petal_width are missing
    }
    response = client.post("/predict/", json=partial_data)
    # Expect the endpoint to reject missing data
    assert response.status_code == 400
