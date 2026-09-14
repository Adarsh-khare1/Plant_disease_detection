# PlantDx — System Architecture

## Core Analysis Flow

Upload Image
→ Image Review
→ Image Quality Assessment
→ Disease Analysis
→ Result
→ Save / Report

## Frontend

Technology:
- Next.js
- JavaScript
- Tailwind CSS

Responsibilities:
- User interface
- Image selection and preview
- Analysis workflow state
- Quality feedback
- Result presentation
- Dashboard
- History
- Reports
- Authentication UI

## Backend

Technology:
- Python
- FastAPI

Responsibilities:
- API
- File validation
- Image-quality pipeline
- Prediction orchestration
- Analysis records
- Disease/reference information
- Report generation
- Authentication integration

## Database

Technology:
- MongoDB

Primary collections planned:

- users
- analyses
- disease_reference
- reports

Exact schemas will be defined before implementation.

## Image Quality / DSP Layer

Initial candidate checks:

- Image dimensions
- Sharpness / blur
- Brightness / exposure
- Contrast

Potential later checks:

- Leaf visibility
- Leaf segmentation
- Background quality
- Color consistency

The quality layer is separate from disease classification.

## Prediction Layer

The prediction service will be isolated from the web application.

Conceptual interface:

Image
→ preprocessing
→ model
→ class prediction
→ confidence

The frontend must not depend on a specific ML architecture.

## Reference Knowledge

Disease information is separate from model prediction.

The model returns a class prediction.

Reference content may provide:

- Disease overview
- Common symptoms
- Management guidance
- Prevention information
- References

This prevents the ML classifier from being responsible for generating agricultural advice.

## Current Development Strategy

During frontend/backend development:

Prediction API
→ Mock prediction service

Later:

Prediction API
→ Trained PlantDx model

The API contract should remain stable where possible.

## Supported Crops

Initial scope:

- Tomato
- Potato

Final disease classes will be defined from the selected datasets and ML experiments.

UI prototypes must not be treated as the source of truth for disease classes.

## Hierarchical ML Pipeline

PlantDx uses a staged prediction pipeline.

### Stage 1 — Leaf Validation

Input:
Uploaded image

Output:
- leaf
- non_leaf

Likely data sources:
- PlantVillage for leaf images
- sampled Places365 images for non-leaf scenes
- sampled Caltech-256 images for non-leaf objects

### Stage 2 — Crop Classification

Runs only when Stage 1 predicts leaf.

Output:
- tomato
- potato
- other_leaf

### Stage 3 — Disease Classification

If tomato:
route to Tomato disease model.

If potato:
route to Potato disease model.

If other_leaf:
stop and return unsupported crop.

### Pipeline Outcomes

- invalid_image
- quality_failed
- not_leaf
- unsupported_crop
- healthy
- disease_detected
- analysis_failed