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