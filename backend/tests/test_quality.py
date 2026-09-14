"""Tests for POST /api/v1/images/{image_id}/quality."""

from tests.conftest import client, make_jpeg_bytes  # noqa: F401

_AUTH_HEADER = {"Authorization": "Bearer test_token_user_quality"}


def _upload_image(client, headers=None) -> str:
    if headers is None:
        headers = _AUTH_HEADER
    resp = client.post(
        "/api/v1/images",
        files={"image": ("leaf.jpg", make_jpeg_bytes(), "image/jpeg")},
        headers=headers,
    )
    assert resp.status_code == 201
    return resp.json()["image_id"]


# ── Success cases ─────────────────────────────────────────────────────────────

def test_quality_returns_passed(client):
    image_id = _upload_image(client)
    resp = client.post(f"/api/v1/images/{image_id}/quality", headers=_AUTH_HEADER)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "passed"


def test_quality_contains_four_checks(client):
    image_id = _upload_image(client)
    resp = client.post(f"/api/v1/images/{image_id}/quality", headers=_AUTH_HEADER)
    checks = resp.json()["checks"]
    assert "resolution" in checks
    assert "sharpness" in checks
    assert "lighting" in checks
    assert "contrast" in checks


def test_quality_checks_are_good(client):
    image_id = _upload_image(client)
    checks = client.post(f"/api/v1/images/{image_id}/quality", headers=_AUTH_HEADER).json()["checks"]
    for key in ("resolution", "sharpness", "lighting", "contrast"):
        assert checks[key]["status"] == "good"


def test_quality_is_deterministic(client):
    image_id = _upload_image(client)
    r1 = client.post(f"/api/v1/images/{image_id}/quality", headers=_AUTH_HEADER).json()
    r2 = client.post(f"/api/v1/images/{image_id}/quality", headers=_AUTH_HEADER).json()
    assert r1 == r2


# ── Auth & Not found ──────────────────────────────────────────────────────────

def test_quality_unauthenticated_fails(client):
    image_id = _upload_image(client)
    resp = client.post(f"/api/v1/images/{image_id}/quality")
    assert resp.status_code == 401


def test_quality_missing_image_returns_404(client):
    resp = client.post("/api/v1/images/nonexistent_id/quality", headers=_AUTH_HEADER)
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "image_not_found"
