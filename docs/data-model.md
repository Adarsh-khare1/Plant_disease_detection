# PlantDx — Data Model

## Purpose

This document defines the planned MongoDB collections used by PlantDx.

The design should support:

- user accounts
- analysis history
- result details
- disease reference content
- reports
- future model/version tracking

The data model should remain independent from a specific frontend implementation.

---

# Collection: users

Stores application-level user profile information.

Authentication credentials should be handled by the chosen authentication provider, not stored directly in MongoDB.

Example:

{
  "_id": "ObjectId",
  "auth_user_id": "provider-user-id",
  "name": "Alex Chen",
  "email": "alex@example.com",
  "created_at": "datetime",
  "updated_at": "datetime"
}

Possible future fields:

{
  "preferred_language": "en",
  "preferred_crops": ["tomato", "potato"]
}

Do not store plaintext passwords.

---

# Collection: analyses

This is the main PlantDx record.

Each completed or attempted analysis creates one analysis record. Intermediate stage predictions are recorded to maintain full auditability across the 4-model pipeline.

Example:

{
  "_id": "ObjectId",
  "user_id": "ObjectId",

  "status": "disease_detected",

  "image": {
    "filename": "tomato-leaf.jpg",
    "storage_key": "images/user123/img_01ha48v9p2kxq.jpg",
    "mime_type": "image/jpeg",
    "size_bytes": 2457600,
    "width": 1920,
    "height": 1080
  },

  "quality": {
    "status": "passed",
    "checks": {
      "resolution": {
        "status": "good",
        "reason": null
      },
      "sharpness": {
        "status": "good",
        "reason": null
      },
      "lighting": {
        "status": "good",
        "reason": null
      },
      "contrast": {
        "status": "good",
        "reason": null
      }
    }
  },

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
  },

  "pipeline": {
    "leaf_model_version": "model1-v1.0",
    "crop_model_version": "model2-v1.0",
    "disease_model_version": "model4-v1.0",
    "preprocessing_version": "dsp-v1.0",
    "normalization_metadata": "metadata/model1_normalization.json"
  },

  "created_at": "datetime",
  "updated_at": "datetime"
}

---

# Analysis Status Values

Possible top-level status values:

- `quality_failed`: The uploaded photograph failed one or more product quality checks (such as resolution, sharpness/blur, exposure/lighting, or contrast).
- `not_leaf`: Model 1 classified the input as `non_leaf`.
- `unsupported_crop`: Model 2 classified the crop as `other`.
- `healthy`: The supported crop image most closely matched the healthy class among the conditions supported by the current disease model.
- `disease_detected`: The disease model predicted one of the currently supported disease classes (Early Blight or Late Blight).
- `analysis_failed`: Unhandled runtime, decoding, or execution failure.

These values remain invariant and aligned with API and frontend constants.

> [!NOTE]
> PlantDx is an automated image classification system, not a biological or laboratory confirmation.

---

# Analysis Examples by Stage

## Quality Failed
Downstream DSP and ML models are not executed.

```json
{
  "status": "quality_failed",
  "quality": {
    "status": "needs_improvement",
    "checks": {
      "sharpness": { "status": "needs_improvement", "reason": "blur_detected" }
    }
  },
  "leaf_check": null,
  "crop_check": null,
  "prediction": null
}
```

---

## Not Leaf
Model 1 determined the image is `non_leaf`. Crop and disease models are not executed.

```json
{
  "status": "not_leaf",
  "quality": { "status": "passed" },
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

## Unsupported Crop
Model 1 verified `leaf`, but Model 2 classified the plant as `other`. Disease models are not executed.

```json
{
  "status": "unsupported_crop",
  "quality": { "status": "passed" },
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

## Healthy
Model 2 identified `potato` or `tomato`, and the respective disease model diagnosed `healthy`.

```json
{
  "status": "healthy",
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

## Disease Detected
Model 2 identified `potato` or `tomato`, and the disease model diagnosed `early_blight` or `late_blight`.

```json
{
  "status": "disease_detected",
  "leaf_check": {
    "label": "leaf",
    "score": 0.991,
    "model_version": "model1-v1.0"
  },
  "crop_check": {
    "label": "potato",
    "score": 0.978,
    "model_version": "model2-v1.0"
  },
  "prediction": {
    "crop": "potato",
    "class_id": "late_blight",
    "display_name": "Late Blight",
    "score": 0.935,
    "model_version": "model3-v1.0"
  }
}
```

---

# Current Disease Scope

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

Latin scientific names do not form part of the ML class identity; they may later live in `disease_reference` educational content after being deliberately sourced and reviewed.

---

# Score Terminology & Calibration Caveat

All model outputs in `leaf_check.score`, `crop_check.score`, and `prediction.score` are scalar floats.
> [!NOTE]
> Deep learning Softmax outputs are uncalibrated activation scores, not Bayesian probabilities. MongoDB stores these raw scores for logging, auditing, and thresholding; the UI renders them as confidence scores.

---

# DSP Derived Artifact & Storage Rules

1. **No Tensors in Database**: Inference tensors, OpenCV NumPy matrices, intermediate feature maps, and raw pixel buffers are **never** stored in MongoDB.
2. **Ephemeral Intermediates**: Transient DSP intermediates during pipeline execution may remain purely ephemeral in-memory variables.
3. **Derived Artifact Retention**: Derived DSP debug or explanation images may be saved to object storage later only when a product, demo, or explainability feature explicitly requires retention.
4. **Database Records**: MongoDB stores only metadata and storage references (`storage_key`) for any retained derived artifact. Raw uploaded images remain stored in object storage.

---

# Collection: disease_reference

Stores reference information for classes supported by the final Tomato and Potato disease models.

The ML dataset/class mapping is the source of truth for which entries belong here.

Example:

{
  "_id": "ObjectId",

  "class_id": "MODEL_CLASS_ID",
  "crop": "tomato",
  "display_name": "MODEL_DISPLAY_NAME",

  "overview": "Reference content",

  "symptoms": [
    "..."
  ],

  "management": [
    "..."
  ],

  "prevention": [
    "..."
  ],

  "references": [
    {
      "title": "...",
      "url": "...",
      "source": "..."
    }
  ],

  "created_at": "datetime",
  "updated_at": "datetime"
}

Do not populate disease entries from UI prototype content.

They must be based on the finalized ML class mapping and verified agricultural sources.

---

# Collection: reports

Reports should reference an existing analysis rather than duplicate the entire prediction.

Example:

{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "analysis_id": "ObjectId",

  "format": "pdf",
  "storage_key": "reports/...",

  "created_at": "datetime"
}

Additional report settings may be added later.

---

# Collection: user_notes

Optional future collection.

Allows users to attach notes to analysis records.

Example:

{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "analysis_id": "ObjectId",
  "text": "Observed spreading spots on nearby leaves.",
  "created_at": "datetime",
  "updated_at": "datetime"
}

This does not need to be implemented in the first version.

---

# Image Storage

MongoDB should not normally store large image binary files directly in analysis documents.

Preferred pattern:

Frontend
→ Backend
→ Object/file storage
→ storage_key saved in MongoDB

The exact storage provider will be selected later.

Possible options include:

- cloud object storage
- Firebase Storage
- S3-compatible storage
- another managed storage service

Do not choose a provider until deployment architecture is finalized.

---

# Dashboard Queries

The Dashboard can be derived from analyses.

Examples:

## Total Analyses

Count analyses for the authenticated user.

## Healthy Results

Count:

status = healthy

## Potential Disease Results

Count:

status = disease_detected

## Crop Activity

Group supported analyses by:

crop_check.crop

Expected first-version values:

- tomato
- potato

## Recent Analyses

Sort analyses by:

created_at descending

Limit:

5

The Dashboard should not require a separate dashboard collection unless future performance requirements justify it.

---

# History

History reads from the analyses collection.

Potential filters:

- crop
- status
- date
- result class

Potential sort options:

- newest
- oldest

---

# Model Versioning

Model metadata should be stored when available.

Possible fields:

- leaf_model_version
- crop_model_version
- disease_model_version
- preprocessing_version

This is useful for:

- research
- debugging
- reproducibility
- comparing model generations

Version fields may initially be null while mock prediction services are used.

---

# Privacy / Retention

The exact image-retention policy must be finalized before production deployment.

The UI must not promise deletion, retention periods, or privacy behavior that is not implemented.

The database should be designed so image references and analysis records can later be deleted when required.

---

# Architecture Principle

The database records what happened.

It should not contain UI-specific wording such as:

"Hold the camera steady."

Instead store machine-readable values such as:

{
  "reason": "blur_detected"
}

The frontend maps those values to user-facing copy.

This keeps:

database
backend
frontend

cleanly separated.