"""Tests for GET /api/v1/health."""

from tests.conftest import client  # noqa: F401 (used as fixture)


def test_health_ok(client):
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["service"] == "PlantDx API"
    assert "environment" in data


def test_health_reports_database(client):
    resp = client.get("/api/v1/health")
    data = resp.json()
    # Must report a truthful state — either connected or unavailable.
    assert data["database"] in ("connected", "unavailable")


def test_health_reports_storage(client):
    resp = client.get("/api/v1/health")
    data = resp.json()
    assert data["storage"] in ("ready", "not_initialized", "error")


def test_health_mounted_under_v1(client):
    assert client.get("/api/v1/health").status_code == 200
    assert client.get("/health").status_code == 404


def test_health_error_envelope_not_returned_on_ok(client):
    resp = client.get("/api/v1/health")
    assert "error" not in resp.json()
