"""Shared pytest fixtures for PlantDx backend test suite.

Test isolation strategy:
    Tests use a SEPARATE database (plantdx_test) so they never touch
    development or production data.  The analyses collection is cleared
    before each test session.  The image registry is cleared before
    each test.
"""

import io
import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from PIL import Image

# ── Override settings BEFORE importing app modules ────────────────────────────
os.environ.setdefault("MONGODB_DATABASE", "plantdx_test")

# Point local storage at a temp directory for tests.
_tmp_dir = tempfile.mkdtemp(prefix="plantdx_test_uploads_")
os.environ.setdefault("LOCAL_STORAGE_ROOT", _tmp_dir)

from app.main import app  # noqa: E402  (must come after env setup)
from app.db.client import is_connected, get_database  # noqa: E402
from app.services import image_registry  # noqa: E402


@pytest.fixture(scope="session")
def client():
    """Return a TestClient that uses the full ASGI app (includes lifespan)."""
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c


@pytest.fixture(autouse=True)
def clear_state():
    """Clear image registry and test DB analyses before each test."""
    image_registry.clear()
    if is_connected():
        get_database()["analyses"].delete_many({})
    yield


# ── Image helpers ─────────────────────────────────────────────────────────────

def make_jpeg_bytes(width: int = 100, height: int = 100) -> bytes:
    """Create a minimal valid JPEG image in memory."""
    buf = io.BytesIO()
    Image.new("RGB", (width, height), color=(100, 150, 200)).save(buf, format="JPEG")
    return buf.getvalue()


def make_png_bytes(width: int = 100, height: int = 100) -> bytes:
    """Create a minimal valid PNG image in memory."""
    buf = io.BytesIO()
    Image.new("RGB", (width, height), color=(200, 100, 50)).save(buf, format="PNG")
    return buf.getvalue()


def make_webp_bytes(width: int = 100, height: int = 100) -> bytes:
    """Create a minimal valid WebP image in memory."""
    buf = io.BytesIO()
    Image.new("RGB", (width, height), color=(50, 200, 100)).save(buf, format="WEBP")
    return buf.getvalue()
