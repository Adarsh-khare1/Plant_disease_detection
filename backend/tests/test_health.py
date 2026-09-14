"""Unit tests for the health check endpoint."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint_success() -> None:
    """Test GET /api/v1/health returns HTTP 200 and truthful status payload."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "PlantDx API"
    assert "environment" in data


def test_health_endpoint_mounted_under_v1() -> None:
    """Test health endpoint is mounted under /api/v1 prefix."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    # Unprefixed route should return 404
    unprefixed_response = client.get("/health")
    assert unprefixed_response.status_code == 404
