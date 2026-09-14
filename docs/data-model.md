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

Each completed or attempted analysis may create one analysis record.

Example:

{
  "_id": "ObjectId",
  "user_id": "ObjectId",

  "status": "disease_detected",

  "image": {
    "filename": "tomato-leaf.jpg",
    "storage_key": "images/...",
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
    "status": "leaf",
    "confidence": null
  },

  "crop_check": {
    "status": "supported",
    "crop": "tomato",
    "confidence": null
  },

  "prediction": {
    "class_id": "MODEL_CLASS_ID",
    "class_name": "MODEL_CLASS_NAME",
    "confidence": 0.88
  },

  "pipeline": {
    "leaf_model_version": null,
    "crop_model_version": null,
    "disease_model_version": null,
    "preprocessing_version": null
  },

  "created_at": "datetime",
  "updated_at": "datetime"
}

---

# Analysis status values

Possible top-level status values:

- quality_failed
- not_leaf
- unsupported_crop
- healthy
- disease_detected
- analysis_failed

These values should be consistent with the API contract.

---

# Analysis examples

## Quality Failed

{
  "status": "quality_failed",
  "quality": {
    "status": "needs_improvement"
  },
  "leaf_check": null,
  "crop_check": null,
  "prediction": null
}

Downstream models are not executed.

---

## Not Leaf

{
  "status": "not_leaf",
  "quality": {
    "status": "passed"
  },
  "leaf_check": {
    "status": "non_leaf"
  },
  "crop_check": null,
  "prediction": null
}

---

## Unsupported Crop

{
  "status": "unsupported_crop",
  "quality": {
    "status": "passed"
  },
  "leaf_check": {
    "status": "leaf"
  },
  "crop_check": {
    "status": "unsupported",
    "crop": "other"
  },
  "prediction": null
}

---

## Healthy

{
  "status": "healthy",
  "crop_check": {
    "status": "supported",
    "crop": "tomato"
  },
  "prediction": {
    "class_id": "tomato_healthy",
    "class_name": "Healthy",
    "confidence": 0.94
  }
}

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