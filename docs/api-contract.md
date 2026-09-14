# PlantDx — API Contract

## Purpose

This document defines the boundary between the PlantDx frontend and backend.

Frontend:
Next.js

Backend:
FastAPI

ML services are accessed through the backend.

The frontend must never communicate directly with individual ML models.

---

# Analysis Pipeline

Client

→ upload
→ quality check
→ analysis

FastAPI

→ image validation
→ DSP quality assessment
→ leaf validation
→ crop classification
→ crop-specific disease classification
→ structured response

---

# Common Analysis Status

Possible analysis outcomes:

- quality_failed
- not_leaf
- unsupported_crop
- healthy
- disease_detected
- analysis_failed

These values should remain machine-readable.

The frontend is responsible for converting status/reason codes into user-facing messages.

---

# 1. Image Upload

## Endpoint

POST /api/v1/images

## Input

multipart/form-data

Field:

image

Supported formats:

- JPEG
- PNG
- WebP

Maximum file size:

10 MB

## Example Response

{
  "image_id": "generated-id",
  "filename": "tomato-leaf.jpg",
  "mime_type": "image/jpeg",
  "size_bytes": 2457600,
  "width": 1920,
  "height": 1080
}

The frontend should not generate authoritative image IDs.

---

# 2. Image Quality Check

## Endpoint

POST /api/v1/images/{image_id}/quality

## Example Passed Response

{
  "status": "passed",
  "checks": {
    "resolution": {
      "status": "good"
    },
    "sharpness": {
      "status": "good"
    },
    "lighting": {
      "status": "good"
    },
    "contrast": {
      "status": "good"
    }
  }
}

## Example Needs Improvement Response

{
  "status": "needs_improvement",
  "checks": {
    "resolution": {
      "status": "good"
    },
    "sharpness": {
      "status": "needs_improvement",
      "reason": "blur_detected"
    },
    "lighting": {
      "status": "needs_improvement",
      "reason": "underexposed"
    },
    "contrast": {
      "status": "good"
    }
  }
}

Possible reason codes may include:

- low_resolution
- blur_detected
- underexposed
- overexposed
- low_contrast

Exact thresholds will be determined experimentally.

---

# 3. Analyze Image

## Endpoint

POST /api/v1/analyses

## Input

{
  "image_id": "generated-id"
}

The crop should normally be determined by the model pipeline.

A user-provided crop may later be included as optional context but must not silently override model routing.

---

# Not Leaf Response

{
  "status": "not_leaf",
  "analysis_id": "generated-id"
}

The pipeline stops.

Crop and disease classifiers are not executed.

---

# Unsupported Crop Response

{
  "status": "unsupported_crop",
  "analysis_id": "generated-id",
  "leaf_detected": true
}

The pipeline stops.

Disease classification is not executed.

---

# Healthy Response

{
  "status": "healthy",
  "analysis_id": "generated-id",
  "crop": "tomato",
  "prediction": {
    "class_id": "tomato_healthy",
    "class_name": "Healthy",
    "confidence": 0.94
  }
}

---

# Disease Response

{
  "status": "disease_detected",
  "analysis_id": "generated-id",
  "crop": "tomato",
  "prediction": {
    "class_id": "MODEL_CLASS_ID",
    "class_name": "MODEL_CLASS_NAME",
    "confidence": 0.88
  }
}

Disease class names must come from the finalized ML class mapping.

UI prototypes are not the source of truth for disease classes.

---

# 4. Analysis Details

## Endpoint

GET /api/v1/analyses/{analysis_id}

Returns the stored analysis and any associated reference information.

---

# 5. Analysis History

## Endpoint

GET /api/v1/analyses

Potential query parameters:

crop
status
page
limit
sort

Example:

GET /api/v1/analyses?crop=tomato&page=1&limit=20

---

# 6. Save Analysis

Analysis persistence should normally happen server-side when analysis completes.

The UI "Save result" action may later represent:

- adding the result to permanent history
- adding notes
- bookmarking/favoriting

The exact behavior must be finalized before implementation.

---

# 7. Disease Reference

## Endpoint

GET /api/v1/diseases

Optional filter:

crop

Example:

GET /api/v1/diseases?crop=tomato

## Individual Disease

GET /api/v1/diseases/{class_id}

Reference information is separate from ML prediction.

Potential fields:

{
  "class_id": "...",
  "crop": "tomato",
  "display_name": "...",
  "overview": "...",
  "symptoms": [],
  "management": [],
  "prevention": [],
  "references": []
}

---

# 8. Reports

Planned endpoint:

POST /api/v1/reports

Reports must be generated from stored analysis records.

Report architecture will be finalized later.

---

# Error Format

All APIs should use a consistent error structure.

Example:

{
  "error": {
    "code": "INVALID_IMAGE_FORMAT",
    "message": "The uploaded file format is not supported."
  }
}

The backend message is primarily diagnostic.

The frontend may translate error codes into clearer user-facing copy.

---

# Architecture Rule

Frontend

DOES:
- render states
- manage user interaction
- display backend results
- translate reason codes into UX messages

Frontend DOES NOT:
- determine disease
- calculate model confidence
- choose disease model
- implement DSP decisions

Backend

DOES:
- validate requests
- orchestrate DSP
- orchestrate ML models
- enforce pipeline routing
- persist analysis data
- return structured results

ML layer

DOES:
- leaf/non-leaf prediction
- crop prediction
- Tomato disease prediction
- Potato disease prediction

Reference layer

DOES:
- disease descriptions
- symptoms
- management information
- prevention information
- citations/references