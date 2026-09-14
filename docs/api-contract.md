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
→ optional quality check
→ analysis request

FastAPI

→ image validation
→ optional product image quality assessment (resolution, sharpness, lighting, contrast)
→ deterministic DSP preprocessing (HSV -> Saturation -> Otsu segmentation -> masking -> 224×224 resize -> normalization)
→ Model 1: Leaf validation (`leaf` vs `non_leaf`)
→ Model 2: Crop classification (`potato`, `tomato`, `other`)
→ Model 3 / Model 4: Crop-specific disease classification (`healthy`, `early_blight`, `late_blight`)
→ structured response

---

# Common Analysis Status

Possible analysis outcomes:

- `quality_failed`: The uploaded photograph failed one or more product quality checks (such as resolution, sharpness/blur, exposure/lighting, or contrast).
- `not_leaf`: Model 1 detected non-leaf subject matter.
- `unsupported_crop`: Model 2 detected a leaf, but it is not Potato or Tomato (`other`).
- `healthy`: The supported crop image most closely matched the healthy class among the conditions supported by the current disease model.
- `disease_detected`: The disease model predicted one of the currently supported disease classes (Early Blight or Late Blight).
- `analysis_failed`: Pipeline execution, decoding, or runtime error.

These values remain machine-readable and invariant. The frontend converts status and reason codes into localized user-facing UX copy.

> [!NOTE]
> PlantDx is an automated image classification system, not a biological or laboratory confirmation.

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
  "image_id": "img_01ha48v9p2kxq...",
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

Product image quality metrics and thresholds remain to be established from validation and field images.

---

# 3. Analyze Image

## Endpoint

POST /api/v1/analyses

Invokes the backend `AnalysisService` and the internal `InferencePipeline`.

## Input

{
  "image_id": "img_01ha48v9p2kxq..."
}

Crop routing is determined autonomously by Model 2. A client-provided crop hint may be provided for informational context but must never override Model 2 routing.

## Score / Confidence Terminology & Calibration Caveat

All model outputs provide a `score` float between `0.0` and `1.0` (also referred to as `model score` or `confidence`).
> [!NOTE]
> Deep neural network Softmax outputs represent class activation confidence scores, **not** statistically calibrated real-world probabilities.

---

### Response: Not Leaf (`not_leaf`)
Returned when Model 1 classifies the image as `non_leaf`. Pipeline terminates immediately; downstream crop and disease models are not invoked.

```json
{
  "status": "not_leaf",
  "analysis_id": "anl_01ha4912x8zq...",
  "leaf_check": {
    "label": "non_leaf",
    "score": 0.982,
    "model_version": "model1-v1.0"
  },
  "crop_check": null,
  "prediction": null
}
```

---

### Response: Unsupported Crop (`unsupported_crop`)
Returned when Model 1 confirms `leaf`, but Model 2 classifies the plant as `other` (neither `potato` nor `tomato`). Pipeline terminates; disease models are not invoked.

```json
{
  "status": "unsupported_crop",
  "analysis_id": "anl_01ha4912x8zq...",
  "leaf_check": {
    "label": "leaf",
    "score": 0.974,
    "model_version": "model1-v1.0"
  },
  "crop_check": {
    "label": "other",
    "score": 0.891,
    "model_version": "model2-v1.0"
  },
  "prediction": null
}
```

---

### Response: Healthy (`healthy`)
Returned when Model 2 classifies the crop as `potato` or `tomato`, and the supported crop image most closely matched the healthy class among conditions supported by the current disease model.

```json
{
  "status": "healthy",
  "analysis_id": "anl_01ha4912x8zq...",
  "crop": "tomato",
  "leaf_check": {
    "label": "leaf",
    "score": 0.991,
    "model_version": "model1-v1.0"
  },
  "crop_check": {
    "label": "tomato",
    "score": 0.963,
    "model_version": "model2-v1.0"
  },
  "prediction": {
    "crop": "tomato",
    "class_id": "healthy",
    "display_name": "Healthy Leaf",
    "score": 0.948,
    "model_version": "model4-v1.0"
  }
}
```

---

### Response: Disease Detected (`disease_detected`)
Returned when Model 2 identifies `potato` or `tomato`, and the respective disease model predicts one of the supported disease classes (`early_blight` or `late_blight`).

```json
{
  "status": "disease_detected",
  "analysis_id": "anl_01ha4912x8zq...",
  "crop": "tomato",
  "leaf_check": {
    "label": "leaf",
    "score": 0.991,
    "model_version": "model1-v1.0"
  },
  "crop_check": {
    "label": "tomato",
    "score": 0.963,
    "model_version": "model2-v1.0"
  },
  "prediction": {
    "crop": "tomato",
    "class_id": "early_blight",
    "display_name": "Early Blight",
    "score": 0.912,
    "model_version": "model4-v1.0"
  }
}
```

---

### Current Supported Disease Scope
The current supported disease class IDs are:
- `healthy`
- `early_blight`
- `late_blight`

The class mapping may be versioned or expanded if future trained models support additional conditions.

Under this current scope, the supported crop and disease combinations for `prediction` are:
1. `potato` — `healthy`
2. `potato` — `early_blight`
3. `potato` — `late_blight`
4. `tomato` — `healthy`
5. `tomato` — `early_blight`
6. `tomato` — `late_blight`

Latin scientific names do not form part of the ML class identity; they may later live in `disease_reference` educational content after being deliberately sourced and reviewed.

---

### Machine Labels vs. Display Names

| Field | Invariant Machine Token (`class_id` / `label`) | User Display Name |
|---|---|---|
| `leaf_check.label` | `leaf` | Leaf Detected |
| `leaf_check.label` | `non_leaf` | Not a Leaf |
| `crop_check.label` | `potato` | Potato |
| `crop_check.label` | `tomato` | Tomato |
| `crop_check.label` | `other` | Unsupported Plant |
| `prediction.class_id` | `healthy` | Healthy |
| `prediction.class_id` | `early_blight` | Early Blight |
| `prediction.class_id` | `late_blight` | Late Blight |

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