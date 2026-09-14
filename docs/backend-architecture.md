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
│   │   ├── mock_leaf_classifier.py
│   │   ├── mock_crop_classifier.py
│   │   ├── mock_tomato_classifier.py
│   │   ├── mock_potato_classifier.py
│   │   └── pipeline.py
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
- orchestrate the full analysis pipeline
- stop the pipeline at appropriate stages
- persist results

DiseaseService
- load reference information
- map class IDs to disease entries

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

# ML Interfaces

ML code should be hidden behind interfaces.

Conceptual interface:

LeafClassifier
- predict(image) -> prediction

CropClassifier
- predict(image) -> prediction

DiseaseClassifier
- predict(image) -> prediction

Each prediction should return structured data.

Example:

{
  "class_id": "leaf",
  "confidence": 0.97
}

---

# Mock ML Services

During frontend/backend development, use mock implementations.

Examples:

MockLeafClassifier

MockCropClassifier

MockTomatoClassifier

MockPotatoClassifier

These should implement the same interface as future real models.

Later:

MockTomatoClassifier

can be replaced with:

PyTorchTomatoClassifier

without changing route or service contracts.

---

# Hierarchical Analysis Pipeline

AnalysisService should orchestrate:

1. image validation
2. image quality assessment
3. leaf/non-leaf classification
4. crop classification
5. crop-specific disease classification
6. result persistence
7. response construction

Conceptual flow:

image
→ quality
→ leaf classifier
→ crop classifier
→ disease classifier
→ analysis record

---

# Pipeline Stop Conditions

## Quality Failed

If quality fails:

status = quality_failed

Do not run:
- leaf classifier
- crop classifier
- disease classifier

---

## Not Leaf

If leaf classifier returns non_leaf:

status = not_leaf

Do not run:
- crop classifier
- disease classifier

---

## Unsupported Crop

If crop classifier returns other_leaf:

status = unsupported_crop

Do not run:
- disease classifier

---

## Tomato

Route to:
Tomato disease classifier

---

## Potato

Route to:
Potato disease classifier

---

# Analysis Status Enum

Supported values:

- quality_failed
- not_leaf
- unsupported_crop
- healthy
- disease_detected
- analysis_failed

These values must remain aligned with:

- API contract
- frontend constants
- database model

---

# Image Quality Service

Initial checks may include:

- resolution
- sharpness
- lighting
- contrast

Return structured values.

Example:

{
  "status": "needs_improvement",
  "checks": {
    "sharpness": {
      "status": "needs_improvement",
      "reason": "blur_detected"
    }
  }
}

Do not return frontend-specific copy such as:

"Hold the camera steady."

The frontend maps reason codes to messages.

---

# Quality Thresholds

Do not hard-code experimental DSP thresholds across route or service files.

Centralize thresholds in:

configuration

or

quality settings

Example conceptual configuration:

QUALITY_MIN_WIDTH
QUALITY_MIN_HEIGHT
QUALITY_BLUR_THRESHOLD
QUALITY_BRIGHTNESS_MIN
QUALITY_BRIGHTNESS_MAX
QUALITY_CONTRAST_MIN

Values should later be justified experimentally.

---

# Disease Classification

Disease models return class IDs.

Example:

{
  "class_id": "tomato_healthy",
  "confidence": 0.94
}

or:

{
  "class_id": "MODEL_CLASS_ID",
  "confidence": 0.88
}

Class display names and agricultural reference content should be resolved through the reference layer.

Do not hard-code disease descriptions inside ML classifier code.

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