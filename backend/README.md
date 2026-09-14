# PlantDx — FastAPI Backend (Sprint A)

The `backend/` package provides the FastAPI backend service for the PlantDx plant disease diagnostic system.

---

## Sprint A Status

Sprint A delivers a **fully functional development backend** without trained ML models:

| Component | Status |
|-----------|--------|
| FastAPI app + CORS + error handling | ✅ Implemented |
| MongoDB persistence | ✅ Implemented (pymongo 4.18.1) |
| Local image storage | ✅ Implemented |
| Image upload + validation | ✅ Implemented |
| Product quality check | ✅ Deterministic stub (see below) |
| Mock hierarchical inference | ✅ Deterministic adapter (see below) |
| Analysis CRUD + history | ✅ Implemented |
| End-to-end test suite | ✅ 35 tests, 35 pass |

> [!NOTE]
> **Product quality evaluation** is currently a deterministic development stub.
> It returns "all checks passed" for every valid uploaded image.
> Real blur/sharpness/lighting/contrast algorithms have not been implemented yet.
>
> **ML inference** is currently a deterministic development adapter in `app/ml/mock_inference.py`.
> It cycles through all supported pipeline outcomes (healthy, disease_detected, not_leaf, unsupported_crop).
> Real DSP preprocessing and Models 1–4 are NOT integrated.
>
> **Firebase Authentication** is NOT integrated yet.

---

## Local Setup (Windows PowerShell)

### Prerequisites

- Python ≥ 3.10
- MongoDB running locally at `mongodb://localhost:27017`

### 1. Create and activate virtual environment

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 2. Install package and dependencies

```powershell
python -m pip install -e ".[dev]"
```

### 3. Configure environment

```powershell
Copy-Item .env.example .env
# Edit .env with your MongoDB URI if different from localhost
```

### 4. Run development server

```powershell
uvicorn app.main:app --reload
```

---

## MongoDB Setup

- **Driver**: pymongo 4.18.1
- **Default URI**: `mongodb://localhost:27017`
- **Development database**: `plantdx`
- **Test database**: `plantdx_test` (isolated — tests never touch development data)
- **Collections**: `analyses`
- **Indexes**: unique on `id` (UUID), `created_at` descending for history ordering

Analysis IDs are UUID4 strings. MongoDB `_id` (ObjectId) is internal and never exposed in the API.

---

## Local Image Storage

- **Storage root**: `backend/data/uploads/` (created automatically on first upload)
- **Storage keys**: UUID4 hex filenames (e.g. `a1b2c3d4....jpg`)
- **Path traversal**: all keys are normalized and verified to remain inside the root
- **Git**: `backend/data/` is in `.gitignore` — uploaded files are never committed

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Service liveness + component status |
| POST | `/api/v1/images` | Upload and validate a plant leaf image |
| POST | `/api/v1/images/{image_id}/quality` | Run product quality check |
| POST | `/api/v1/analyses` | Create analysis (quality → inference → persist) |
| GET | `/api/v1/analyses/{analysis_id}` | Retrieve a single analysis |
| GET | `/api/v1/analyses` | List analyses (paginated, newest first) |

### Image Upload

- `multipart/form-data`, field name: `image`
- Allowed formats (Pillow-decoded, not MIME-trusted): **JPEG, PNG, WebP**
- Max size: **10 MB**
- EXIF orientation is normalized before storage

### Analysis Statuses

| Status | Meaning |
|--------|---------|
| `quality_failed` | Image failed product quality gate |
| `not_leaf` | Model 1 (mock): non-leaf image — pipeline stops |
| `unsupported_crop` | Model 2 (mock): crop is `other` — pipeline stops |
| `healthy` | Disease model: healthy leaf |
| `disease_detected` | Disease model: early_blight or late_blight |
| `analysis_failed` | Unexpected pipeline error |

### Error Format

All errors use the unified envelope:

```json
{
  "error": {
    "code": "image_not_found",
    "message": "Image 'abc123' was not found."
  }
}
```

---

## Running Tests

```powershell
python -m pytest
```

Tests use the **`plantdx_test`** database. The `analyses` collection is cleared before each test. A local MongoDB instance is required for integration tests.

```
35 passed, 0 failed, 0 skipped
```

---

## API Documentation

When running locally:

- **Interactive Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health**: http://localhost:8000/api/v1/health

---

## What Remains for Later Sprints

- Real image quality algorithms (blur, resolution, lighting, contrast)
- DSP preprocessing (HSV → Saturation → Otsu → masking → resize → normalize)
- Model 1: Leaf classification (PyTorch checkpoint)
- Model 2: Crop classification (PyTorch checkpoint)
- Model 3/4: Disease classification (PyTorch checkpoints)
- Firebase Authentication
- Cloud storage (replacing local adapter)
- Report / PDF generation
- User accounts collection
