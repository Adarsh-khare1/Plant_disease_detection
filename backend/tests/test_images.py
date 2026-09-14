"""Tests for POST /api/v1/images (image upload endpoint)."""

from tests.conftest import client, make_jpeg_bytes, make_png_bytes, make_webp_bytes  # noqa: F401


def _upload(client, file_bytes: bytes, filename: str = "leaf.jpg", content_type: str = "image/jpeg"):
    return client.post(
        "/api/v1/images",
        files={"image": (filename, file_bytes, content_type)},
    )


# ── Success cases ─────────────────────────────────────────────────────────────

def test_upload_jpeg_success(client):
    resp = _upload(client, make_jpeg_bytes(), "leaf.jpg", "image/jpeg")
    assert resp.status_code == 201
    data = resp.json()
    assert "image_id" in data
    assert data["mime_type"] == "image/jpeg"
    assert data["width"] == 100
    assert data["height"] == 100
    assert data["size_bytes"] > 0
    assert data["filename"] == "leaf.jpg"


def test_upload_png_success(client):
    resp = _upload(client, make_png_bytes(), "leaf.png", "image/png")
    assert resp.status_code == 201
    assert resp.json()["mime_type"] == "image/png"


def test_upload_webp_success(client):
    resp = _upload(client, make_webp_bytes(), "leaf.webp", "image/webp")
    assert resp.status_code == 201
    assert resp.json()["mime_type"] == "image/webp"


def test_upload_returns_unique_ids(client):
    id1 = _upload(client, make_jpeg_bytes()).json()["image_id"]
    id2 = _upload(client, make_jpeg_bytes()).json()["image_id"]
    assert id1 != id2


# ── Validation failures ───────────────────────────────────────────────────────

def test_upload_empty_file_rejected(client):
    resp = _upload(client, b"", "empty.jpg", "image/jpeg")
    assert resp.status_code == 400
    assert resp.json()["error"]["code"] == "invalid_image"


def test_upload_corrupted_file_rejected(client):
    resp = _upload(client, b"this is not an image at all", "fake.jpg", "image/jpeg")
    assert resp.status_code == 400
    error = resp.json()["error"]
    assert error["code"] in ("invalid_image", "unsupported_image_type")


def test_upload_unsupported_format_rejected(client):
    # Build a valid GIF bytes.
    import io
    from PIL import Image

    buf = io.BytesIO()
    Image.new("RGB", (50, 50)).save(buf, format="GIF")
    resp = _upload(client, buf.getvalue(), "image.gif", "image/gif")
    assert resp.status_code in (400, 415)
    assert resp.json()["error"]["code"] in ("unsupported_image_type", "invalid_image")


def test_upload_oversized_file_rejected(client):
    # 11 MB of null bytes (exceeds 10 MB limit).
    big_bytes = b"\x00" * (11 * 1024 * 1024)
    resp = _upload(client, big_bytes, "big.jpg", "image/jpeg")
    assert resp.status_code == 413
    assert resp.json()["error"]["code"] == "image_too_large"


# ── Error envelope ────────────────────────────────────────────────────────────

def test_upload_error_envelope_shape(client):
    resp = _upload(client, b"garbage", "bad.jpg", "image/jpeg")
    assert "error" in resp.json()
    err = resp.json()["error"]
    assert "code" in err
    assert "message" in err
