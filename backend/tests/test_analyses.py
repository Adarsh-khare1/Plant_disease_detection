"""Tests for analysis API: POST/GET /api/v1/analyses.

Covers:
- create analysis for all mock outcomes
- early-stop null shapes (not_leaf, unsupported_crop)
- retrieve by ID
- list/pagination
- missing image / missing analysis 404 errors
- canonical status values
- error envelope consistency
"""

import pytest
from tests.conftest import client, make_jpeg_bytes  # noqa: F401
from app.ml import mock_inference


def _upload_image(client) -> str:
    resp = client.post(
        "/api/v1/images",
        files={"image": ("leaf.jpg", make_jpeg_bytes(), "image/jpeg")},
    )
    assert resp.status_code == 201
    return resp.json()["image_id"]


def _create_analysis(client, image_id: str) -> dict:
    resp = client.post("/api/v1/analyses", json={"image_id": image_id})
    assert resp.status_code == 201, resp.text
    return resp.json()


# ── Schema shape helpers ──────────────────────────────────────────────────────

def _assert_base_fields(data: dict) -> None:
    assert "analysis_id" in data
    assert "status" in data
    assert "image" in data
    assert "created_at" in data
    assert "updated_at" in data


_VALID_STATUSES = {
    "quality_failed", "not_leaf", "unsupported_crop",
    "healthy", "disease_detected", "analysis_failed",
}


# ── Creation ──────────────────────────────────────────────────────────────────

def test_create_analysis_success(client):
    image_id = _upload_image(client)
    data = _create_analysis(client, image_id)
    _assert_base_fields(data)
    assert data["status"] in _VALID_STATUSES


def test_create_analysis_missing_image(client):
    resp = client.post("/api/v1/analyses", json={"image_id": "does_not_exist"})
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "image_not_found"


# ── Canonical statuses via explicit mock scenarios ────────────────────────────

def _run_scenario(client, scenario: str) -> dict:
    """Upload an image and force a specific mock scenario."""
    from app.services import image_registry
    from app.schemas.image import ImageMeta
    import uuid

    # Register a fake image meta directly (avoids repeated upload I/O).
    fake_id = uuid.uuid4().hex
    image_registry.register(ImageMeta(
        image_id=fake_id,
        storage_key="test.jpg",
        filename="leaf.jpg",
        mime_type="image/jpeg",
        size_bytes=1000,
        width=100,
        height=100,
    ))

    from app.services.analysis_service import analysis_service
    doc = analysis_service.create_analysis(image_id=fake_id, scenario=scenario)
    return doc


def test_scenario_healthy_tomato(client):
    doc = _run_scenario(client, "healthy_tomato")
    assert doc["status"] == "healthy"
    assert doc["leaf_check"]["label"] == "leaf"
    assert doc["crop_check"]["label"] == "tomato"
    assert doc["prediction"]["class_id"] == "healthy"
    assert doc["prediction"]["crop"] == "tomato"


def test_scenario_disease_tomato(client):
    doc = _run_scenario(client, "disease_tomato")
    assert doc["status"] == "disease_detected"
    assert doc["crop_check"]["label"] == "tomato"
    assert doc["prediction"]["class_id"] == "early_blight"


def test_scenario_healthy_potato(client):
    doc = _run_scenario(client, "healthy_potato")
    assert doc["status"] == "healthy"
    assert doc["crop_check"]["label"] == "potato"


def test_scenario_disease_potato(client):
    doc = _run_scenario(client, "disease_potato")
    assert doc["status"] == "disease_detected"
    assert doc["crop_check"]["label"] == "potato"
    assert doc["prediction"]["class_id"] == "late_blight"


# ── Early-stop null shapes ────────────────────────────────────────────────────

def test_not_leaf_early_stop_shape(client):
    doc = _run_scenario(client, "not_leaf")
    assert doc["status"] == "not_leaf"
    assert doc["leaf_check"]["label"] == "non_leaf"
    assert doc["crop_check"] is None, "crop_check must be null for not_leaf"
    assert doc["prediction"] is None, "prediction must be null for not_leaf"


def test_unsupported_crop_early_stop_shape(client):
    doc = _run_scenario(client, "unsupported_crop")
    assert doc["status"] == "unsupported_crop"
    assert doc["leaf_check"]["label"] == "leaf"
    assert doc["crop_check"]["label"] == "other"
    assert doc["prediction"] is None, "prediction must be null for unsupported_crop"


# ── Retrieve by ID ────────────────────────────────────────────────────────────

def test_get_analysis_by_id(client):
    image_id = _upload_image(client)
    created = _create_analysis(client, image_id)
    analysis_id = created["analysis_id"]

    resp = client.get(f"/api/v1/analyses/{analysis_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["analysis_id"] == analysis_id
    assert data["status"] == created["status"]


def test_get_analysis_not_found(client):
    resp = client.get("/api/v1/analyses/nonexistent_analysis_id")
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "analysis_not_found"


# ── List / Pagination ─────────────────────────────────────────────────────────

def test_list_analyses_empty(client):
    resp = client.get("/api/v1/analyses")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0


def test_list_analyses_after_creation(client):
    image_id = _upload_image(client)
    _create_analysis(client, image_id)

    resp = client.get("/api/v1/analyses")
    data = resp.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1


def test_list_analyses_pagination(client):
    # Create 3 analyses.
    for _ in range(3):
        image_id = _upload_image(client)
        _create_analysis(client, image_id)

    page1 = client.get("/api/v1/analyses?skip=0&limit=2").json()
    page2 = client.get("/api/v1/analyses?skip=2&limit=2").json()

    assert len(page1["items"]) == 2
    assert page1["limit"] == 2
    assert page2["skip"] == 2

    # IDs on page 1 and page 2 must not overlap.
    ids1 = {i["analysis_id"] for i in page1["items"]}
    ids2 = {i["analysis_id"] for i in page2["items"]}
    assert ids1.isdisjoint(ids2)


def test_list_ordered_newest_first(client):
    for _ in range(2):
        image_id = _upload_image(client)
        _create_analysis(client, image_id)

    items = client.get("/api/v1/analyses").json()["items"]
    timestamps = [i["created_at"] for i in items]
    assert timestamps == sorted(timestamps, reverse=True)


# ── Error envelope consistency ────────────────────────────────────────────────

def test_error_envelope_missing_analysis(client):
    resp = client.get("/api/v1/analyses/no_such_id")
    err = resp.json()
    assert "error" in err
    assert "code" in err["error"]
    assert "message" in err["error"]


def test_error_envelope_missing_image(client):
    resp = client.post("/api/v1/analyses", json={"image_id": "no_such_image"})
    err = resp.json()
    assert "error" in err
    assert err["error"]["code"] == "image_not_found"
