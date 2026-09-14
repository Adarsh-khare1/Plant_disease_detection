# PlantDx — Storage Architecture

## Purpose

PlantDx needs storage for:

- uploaded leaf images
- generated reports
- possible thumbnails or derived assets
- future model explanation images if implemented

MongoDB should store metadata and storage references, not large binary files directly.

---

# Storage Pattern

Frontend

→ FastAPI

→ Object/File Storage

→ MongoDB stores storage key and metadata

Example:

{
  "filename": "tomato-leaf.jpg",
  "storage_key": "users/{user_id}/analyses/{analysis_id}/original.jpg",
  "mime_type": "image/jpeg",
  "size_bytes": 2457600
}

---

# Storage Provider

The exact production provider will be selected later.

Candidates may include:

- Firebase Storage
- S3-compatible object storage
- Cloudflare R2
- another managed object-storage provider

Provider selection should consider:

- cost
- upload limits
- security
- signed/private access
- integration with FastAPI
- deployment simplicity

Do not tightly couple application code to one provider.

Create a storage service abstraction in the backend.

Example conceptual interface:

StorageService

- upload_file()
- delete_file()
- get_file_url()
- file_exists()

---

# Image Upload Flow

User selects image

→ Next.js sends multipart upload to FastAPI

→ FastAPI validates:
  - MIME type
  - extension
  - size
  - image decode
  - dimensions

→ FastAPI stores image

→ storage_key is saved

→ backend returns image_id / metadata to frontend

The frontend should not upload directly to public storage in the first implementation.

---

# Private vs Public Files

Uploaded user leaf images should be private by default.

They should not have permanent public URLs.

Access should be controlled by the backend or signed/temporary URLs.

Generated reports should also be private by default.

---

# Suggested Storage Structure

Conceptual object paths:

users/
  {user_id}/
    analyses/
      {analysis_id}/
        original.jpg
        thumbnail.jpg
        explanation.png

    reports/
      {report_id}.pdf

The final extension depends on the original/processed format.

Do not assume JPG for all uploads.

---

# Temporary Processing Files

The backend may need temporary files during:

- image decoding
- DSP processing
- ML inference
- PDF generation

Temporary files should:

- use OS/application temp directories
- not be treated as permanent storage
- be cleaned after processing
- never be committed to Git

---

# Original Image

The original user-uploaded image should be preserved if the product's retention policy allows it.

The ML/DSP pipeline should generally operate on a processed copy rather than overwriting the original.

Conceptually:

Original Image

→ decode

→ processing copy

→ resize / normalize / DSP

→ model input

The stored original remains unchanged.

---

# Derived Assets

Future derived files may include:

- thumbnail
- segmented leaf image
- Grad-CAM / explainability visualization
- report preview

These should be stored separately from the original.

Example metadata:

{
  "original_key": "...",
  "thumbnail_key": "...",
  "explanation_key": null
}

Do not store fake derived assets before features exist.

---

# Image Retention

Exact retention behavior is not finalized.

Possible future policies:

- keep while analysis record exists
- allow user deletion
- automatic deletion after defined period
- opt-in research retention

Do not make retention promises in the UI until implemented.

---

# Deletion

When an analysis is deleted in the future:

Backend should coordinate deletion of:

- analysis database record
- original image
- derived assets
- related reports if appropriate

The operation should be designed carefully to avoid orphan files.

---

# Report Storage

Generated PDF reports should:

1. reference a saved analysis
2. be generated server-side
3. be stored privately
4. store only metadata/reference in MongoDB

Example:

{
  "analysis_id": "...",
  "storage_key": "users/.../reports/report-id.pdf",
  "format": "pdf",
  "created_at": "datetime"
}

---

# Security

Storage must not allow arbitrary public access to user images.

Backend must verify ownership before returning file access.

Do not trust storage keys supplied by the frontend.

The backend should derive or validate file paths.

Use safe generated identifiers rather than raw filenames as storage paths.

---

# File Naming

Do not use raw user filenames directly as permanent storage paths.

Preferred:

generated UUID / analysis ID

Example:

analyses/{analysis_id}/original.webp

The original filename may be stored only as metadata.

---

# Development Environment

During early local development, use a local storage adapter.

Example:

backend/storage/

This allows development before a cloud provider is selected.

The rest of the backend should interact through the same StorageService abstraction.

Development:

LocalStorageService

Production:

CloudStorageService

This prevents major code changes later.

---

# Git Ignore

Never commit:

- uploaded images
- generated reports
- temporary processing files
- storage credentials
- .env files

These paths should be covered by .gitignore.

---

# Architecture Principle

MongoDB records:

- what the file is
- who owns it
- where it is stored

Storage stores:

- the actual file bytes

FastAPI controls:

- validation
- ownership
- access
- lifecycle