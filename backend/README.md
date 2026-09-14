# PlantDx — FastAPI Backend Foundation

The `backend/` package provides the core FastAPI application service for the PlantDx plant disease diagnostic system.

---

## Foundation Status

This step initializes the structural FastAPI backend foundation:
- Application configuration & typed settings (`app/core/config.py`)
- Centralized logging (`app/core/logging.py`)
- Structured JSON error handling (`app/core/errors.py`)
- API v1 router layout (`app/api/router.py`)
- Truthful health check endpoint (`GET /api/v1/health`)
- Abstract interfaces for ML pipeline & storage subsystems (`app/ml/interfaces.py`, `app/storage/interfaces.py`)
- Unit test suite (`tests/test_health.py`)

> [!NOTE]
> MongoDB, Firebase Authentication, cloud/local storage drivers, image-quality algorithms, and PyTorch ML models are **not yet implemented**.

---

## Local Setup (Windows PowerShell)

### 1. Create Virtual Environment

```powershell
cd backend
python -m venv .venv
```

### 2. Activate Virtual Environment

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Install Package & Dependencies

```powershell
python -m pip install -e ".[dev]"
```

### 4. Run Development Server

```powershell
uvicorn app.main:app --reload
```

---

## API Documentation & Endpoints

When running locally:
* **Interactive OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## Running Unit Tests

```powershell
pytest
```
