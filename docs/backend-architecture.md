# PlantDx — Backend Architecture

## Technology

Framework:
FastAPI

Language:
Python

Database:
MongoDB

Authentication:
Firebase ID token verification

Storage:
StorageService abstraction

ML:
Separate prediction services orchestrated by FastAPI

---

# Architecture Goals

The backend should be:

- modular
- testable
- explicit about pipeline stages
- independent from frontend implementation
- independent from specific ML architectures
- easy to replace mock services with real models
- secure by default

Avoid:

- business logic inside route files
- direct MongoDB calls scattered throughout the codebase
- ML inference directly inside API route handlers
- hard-coded disease names
- frontend wording in database records
- file storage logic mixed with ML logic
- model-specific assumptions inside general API schemas

---

# Suggested Folder Structure

backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── dependencies.py
│   │   └── routes/
│   │       ├── health.py
│   │       ├── images.py
│   │       ├── analyses.py
│   │       ├── diseases.py
│   │       ├── reports.py
│   │       └── users.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   │
│   ├── schemas/
│   │   ├── image.py
│   │   ├── quality.py
│   │   ├── analysis.py
│   │   ├── disease.py
│   │   ├── report.py
│   │   └── user.py
│   │
│   ├── services/
│   │   ├── storage_service.py
│   │   ├── image_service.py
│   │   ├── quality_service.py
│   │   ├── analysis_service.py
│   │   ├── disease_service.py
│   │   ├── report_service.py
│   │   └── user_service.py
│   │
│   ├── ml/
│   │   ├── interfaces.py
│   │   ├── registry.py
│   │   ├── dsp_preprocessor.py
│   │   ├── pipeline.py
│   │   ├── mock/
│   │   │   ├── leaf_classifier.py
│   │   │   ├── crop_classifier.py
│   │   │   ├── tomato_classifier.py
│   │   │   └── potato_classifier.py
│   │   ├── models/
│   │   │   ├── model1_leaf.py
│   │   │   ├── model2_crop.py
│   │   │   ├── model3_potato.py
│   │   │   └── model4_tomato.py
│   │   └── metadata/
│   │       └── model1_normalization.json
│   │
│   ├── db/
│   │   ├── client.py
│   │   ├── repositories/
│   │   │   ├── users.py
│   │   │   ├── analyses.py
│   │   │   ├── diseases.py
│   │   │   └── reports.py
│   │   └── indexes.py
│   │
│   ├── storage/
│   │   ├── interface.py
│   │   └── local.py
│   │
│   └── utils/
│       ├── ids.py
│       ├── files.py
│       └── dates.py
│
├── tests/
│   ├── api/
│   ├── services/
│   └── ml/
│
├── requirements.txt
└── .env.example

---

# Route Layer

Routes should be thin.

Example responsibility:

POST /api/v1/analyses

Route should:

1. validate request
2. resolve authenticated user
3. call AnalysisService
4. return structured response

Route should NOT:

- load ML models directly
- contain threshold logic
- call MongoDB directly
- construct user-facing messages
- perform file I/O beyond service calls

---

# Service Layer

Services contain application logic.

Examples:

ImageService
- validate image metadata
- decode image
- prepare processing copy

QualityService
- run image-quality checks
- return machine-readable reasons

AnalysisService
- orchestrate the end-to-end analysis lifecycle
- invoke optional ImageQualityService for raw photograph checks
- invoke InferencePipeline (deterministic DSP + Model 1 -> Model 2 -> Model 3/4)
- enforce early-stop conditions at each stage
- persist structured analysis records via AnalysisRepository (never storing tensors or OpenCV matrices in MongoDB)
- coordinate with DiseaseService for reference data lookup
- construct standardized API responses

DiseaseService
- load reference information
- map machine class IDs to disease entries

ReportService
- generate report data
- create PDF later
- store report metadata

---

# Repository Layer

Repository classes isolate MongoDB access.

Example:

AnalysisRepository

Methods may include:

- create()
- get_by_id()
- list_for_user()
- update()
- delete()

Services should use repositories instead of raw MongoDB queries scattered throughout the codebase.

---

# ML Architecture & Inference Pipeline

The ML subsystem is isolated from the HTTP layer behind an explicit `InferencePipeline` and component interfaces:

```text
AnalysisService
      │
      ├──► ImageQualityService (optional photography checks on raw image)
      │
      └──► InferencePipeline
                │
                ├──► DSPPreprocessor (RGB -> HSV -> S-channel -> Otsu -> Mask -> 224x224)
                │
                ├──► ModelRegistry (loads models once; runs eval() + torch.inference_mode())
                │
                ├──► Model 1: LeafClassifier (leaf vs non_leaf)
                │         │
                │         └─[non_leaf]─► stop (status: not_leaf)
                │
                ├──► Model 2: CropClassifier (potato vs tomato vs other)
                │         │
                │         └─[other]────► stop (status: unsupported_crop)
                │
                └──► Model 3 (Potato) OR Model 4 (Tomato)
                          │
                          └─[healthy | early_blight | late_blight]
```

## Model Lifecycle & Execution Rules

1. **Model Registry**: Models are heavy artifacts loaded **once** at application startup or singleton initialization via `ModelRegistry`. Models must never be re-instantiated on every incoming HTTP request.
2. **Inference Mode**: All forward passes execute strictly with `model.eval()` under `torch.inference_mode()` (or `@torch.no_grad()`) to disable autograd graphs and minimize latency and memory consumption.
3. **Deterministic DSP Preprocessing**:
   - Executes the 10-step foreground segmentation: RGB -> HSV -> Saturation channel -> Gaussian blur -> Otsu thresholding -> morphological opening -> morphological closing -> connected-component filtering -> largest foreground blob -> apply mask to original RGB -> black background -> resize/center-crop to 224×224 -> model-specific tensor normalization.
   - **Normalization Rule**: Model 1 normalization tensors must be loaded from `metadata/model1_normalization.json` computed directly during training. Never silently substitute generic ImageNet mean/std. Production backend code must not depend on an absolute development filesystem path; the deployment model artifact bundle should include or reference the exact versioned preprocessing/normalization metadata used during training.
   - **Shared DSP Representation**: The deterministic pre-normalization DSP representation (e.g. the processed 224×224 RGB image) may potentially be reused across pipeline stages if downstream models are trained with compatible DSP input semantics. Each model may still require its own tensor conversion and normalization metadata. Whether the processed representation itself is reusable must ultimately be determined from the actual training contracts of Models 2–4.
4. **DSP Derived Artifact Storage Policy**:
   - Inference tensors and OpenCV matrices are **never** stored in MongoDB.
   - Transient DSP intermediates may remain ephemeral.
   - Derived DSP or explanation images may be stored in object storage later only when a product, demo, or explainability feature explicitly requires retention.
   - MongoDB stores only metadata and references for any retained derived artifact.

---

## ML Interfaces

Conceptual interfaces:

```python
class DSPPreprocessor(Protocol):
    def preprocess(self, image_bytes: bytes, normalization_metadata_path: str) -> torch.Tensor:
        ...

class LeafClassifier(Protocol):
    def predict(self, tensor: torch.Tensor) -> StagePrediction:
        # returns label: "leaf" | "non_leaf", score: float, model_version: str
        ...

class CropClassifier(Protocol):
    def predict(self, tensor: torch.Tensor) -> StagePrediction:
        # returns label: "potato" | "tomato" | "other", score: float, model_version: str
        ...

class DiseaseClassifier(Protocol):
    def predict(self, tensor: torch.Tensor) -> DiseasePrediction:
        # returns class_id: "healthy" | "early_blight" | "late_blight", score: float, model_version: str
        ...
```

---

## Mock ML Services

During early frontend/backend integration, mock implementations honor these exact interfaces:

- `MockLeafClassifier`
- `MockCropClassifier`
- `MockPotatoClassifier`
- `MockTomatoClassifier`

When PyTorch models are integrated via `ModelRegistry`, route handlers and database repositories require zero changes.

---

## Hierarchical Pipeline Orchestration & Early-Stop Conditions

`AnalysisService` coordinates the pipeline and enforces immediate early-stopping:

1. **Raw Image Validation**: File format, payload size, basic decode.
2. **Optional Image Quality Check**: Evaluates photograph quality checks (resolution, sharpness/blur, exposure/lighting, contrast). Candidate algorithms such as Tenengrad, Laplacian-based sharpness measures, or frequency-domain approaches belong strictly to this product quality gate (distinct from the deterministic ML DSP preprocessing pipeline). Product image quality metrics and thresholds remain to be established from validation and field images. If the photograph fails one or more quality checks, status = `quality_failed`. Pipeline stops. No ML models are invoked.
3. **DSP Preprocessing**: Deterministic segmentation and normalization to 224×224 tensor.
4. **Stage 1 (Model 1 — Leaf Check)**:
   - Evaluates: `leaf` vs `non_leaf`
   - If `non_leaf`: status = `not_leaf`. Pipeline stops. Crop and disease models are **not** invoked.
5. **Stage 2 (Model 2 — Crop Check)**:
   - Evaluates: `potato` vs `tomato` vs `other`
   - If `other`: status = `unsupported_crop`. Pipeline stops. Disease models are **not** invoked.
6. **Stage 3 (Model 3 / Model 4 — Crop-Specific Disease Classification)**:
   - If `potato`: routed exclusively to Model 3 (`healthy`, `early_blight`, `late_blight`).
   - If `tomato`: routed exclusively to Model 4 (`healthy`, `early_blight`, `late_blight`).
   - If condition is `healthy`: status = `healthy` (the supported crop image most closely matched the healthy class among conditions supported by the current model).
   - If condition is `early_blight` or `late_blight`: status = `disease_detected` (the disease model predicted one of the currently supported disease classes).
   - *Note*: PlantDx is an automated image classification system, not a biological or laboratory confirmation.
7. **Persistence**: Saves analysis record with intermediate stage details (`leaf_check`, `crop_check`, `prediction`) to MongoDB.

---

## Analysis Status Enum

Supported values:

- `quality_failed`: The uploaded photograph failed one or more product quality checks (resolution, sharpness/blur, exposure/lighting, contrast).
- `not_leaf`: Model 1 classified the input as `non_leaf`.
- `unsupported_crop`: Model 2 classified the crop as `other`.
- `healthy`: Supported crop image most closely matched the healthy class among supported conditions.
- `disease_detected`: Disease model predicted one of the supported disease classes (`early_blight` or `late_blight`).
- `analysis_failed`: Pipeline execution or runtime error.

These values remain strictly aligned across API contracts, frontend constants, and database schemas.

---

# Disease Classification & Machine Labels

### Current Disease Scope
The current supported disease class IDs are:
- `healthy`
- `early_blight`
- `late_blight`

The class mapping may be versioned or expanded if future trained models support additional conditions.

Under this current scope, the supported crop and disease combinations are:
1. `potato` — `healthy`
2. `potato` — `early_blight`
3. `potato` — `late_blight`
4. `tomato` — `healthy`
5. `tomato` — `early_blight`
6. `tomato` — `late_blight`

### Invariant Machine Labels
The machine tokens stored and returned by services are invariant:
- Crops: `potato`, `tomato`, `other`
- Leaf status: `leaf`, `non_leaf`
- Disease conditions: `healthy`, `early_blight`, `late_blight`

User-facing display names ("Early Blight", "Late Blight", "Healthy Leaf") are resolved through `DiseaseService` from the reference database. Latin scientific names do not form part of the ML class identity; they may later live in `disease_reference` educational content after being deliberately sourced and reviewed.

### Model Score vs. Probability Calibration Caveat
Backend models output class activation scores via Softmax. In documentation, APIs, and schemas, these values are designated as **`score`**, **`model score`**, or **`model confidence`**.
> [!NOTE]
> Deep neural network Softmax outputs are uncalibrated heuristics and must not be characterized as calibrated real-world probabilities.

### Explainability & Field Validation Status
- Grad-CAM and SHAP explainability pipelines are currently **not implemented**.
- INT8 quantization and on-device optimization are **not implemented**.
- Field/wild validation is pending baseline model completion.

---

# Authentication

Protected routes use Firebase ID tokens.

Request:

Authorization: Bearer <token>

Backend:

1. verify token
2. extract Firebase UID
3. resolve/create PlantDx user
4. enforce ownership

Never trust user_id supplied by the frontend.

---

# Authorization

For user-owned resources:

analysis
report
stored image

Backend must verify ownership.

Example:

analysis.user_id == current_user.id

before returning protected data.

---

# Storage

Use StorageService abstraction.

Development:

LocalStorageService

Production:

CloudStorageService

Backend code outside the storage layer should not depend on the provider.

---

# Error Handling

Use consistent API errors.

Example:

{
  "error": {
    "code": "INVALID_IMAGE_FORMAT",
    "message": "The uploaded file format is not supported."
  }
}

Potential codes:

- INVALID_IMAGE_FORMAT
- IMAGE_TOO_LARGE
- IMAGE_DECODE_FAILED
- ANALYSIS_NOT_FOUND
- UNAUTHORIZED
- FORBIDDEN
- ANALYSIS_FAILED

Frontend may map these to clearer UI wording.

---

# Logging

Log useful backend events:

- request ID
- analysis ID
- pipeline stage
- model version
- processing errors
- latency

Do not log:

- passwords
- authentication tokens
- full private image contents
- sensitive credentials

---

# Configuration

Use environment variables for:

- MongoDB connection
- Firebase admin credentials/config path
- storage configuration
- CORS origins
- environment
- future model paths

Never commit secrets.

Provide:

.env.example

with placeholder values.

---

# Testing Strategy

Unit tests:

- quality service
- pipeline branching
- model interface mocks
- repositories

API tests:

- upload
- quality endpoint
- analysis endpoint
- auth failures
- ownership checks

Important pipeline tests:

quality_failed
→ no model called

not_leaf
→ crop model not called

unsupported_crop
→ disease model not called

tomato
→ tomato classifier called

potato
→ potato classifier called

---

# CORS

During local development:

allow only expected local frontend origin(s).

Production:

allow only deployed PlantDx frontend domains.

Do not use unrestricted CORS in production.

---

# Versioning

API prefix:

/api/v1

This allows future API evolution without immediately breaking clients.

---

# Development Order

1. FastAPI project setup
2. configuration
3. health route
4. standard error format
5. MongoDB connection
6. local storage adapter
7. image upload
8. quality service
9. mock ML interfaces
10. pipeline orchestration
11. analysis persistence
12. history
13. disease reference API
14. Firebase verification
15. reports
16. real ML integration later

---

# Architecture Principle

FastAPI owns orchestration.

ML models own predictions.

MongoDB owns persistent records.

Storage owns file bytes.

Next.js owns user experience.

No layer should silently take over another layer's responsibility.