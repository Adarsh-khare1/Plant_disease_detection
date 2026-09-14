# Plant Disease Detection

A plant disease detection system focused initially on **Tomato** and **Potato** crops.

## Project Goal

Build a complete web-based system that allows a user to:

1. Upload a plant leaf image.
2. Validate the image quality.
3. Identify the crop.
4. Analyze the leaf image.
5. Predict the disease condition.
6. Display the prediction with confidence and supporting information.
7. Save and review previous analyses.
8. Generate reports.

The system will be designed so that the machine-learning component can be improved or replaced without requiring major changes to the frontend or backend.

## Initial Scope

### Crops

* Tomato
* Potato

### Development Phases

#### Phase 1 — Product and UX

* Product definition
* User flows
* Information architecture
* Visual design
* Design system
* Responsive UX

#### Phase 2 — Frontend

* Next.js
* JavaScript
* Tailwind CSS
* Reusable component system
* Upload and analysis interface
* Dashboard
* History
* Reports
* Authentication UI

#### Phase 3 — Backend

* Python
* FastAPI
* MongoDB
* REST API
* Image validation
* Prediction service
* Analysis history
* Reports

#### Phase 4 — ML

* Dataset preparation
* Image preprocessing
* DSP experiments
* Model training
* Model evaluation
* Model comparison
* Explainability
* Model deployment

## Architecture

```text
User
  │
  ▼
Next.js Frontend
  │
  ▼
FastAPI Backend
  │
  ├── MongoDB
  │
  └── Prediction Service
          │
          └── ML Model
```

During early development, the prediction service will use a mock prediction so that frontend and backend development can proceed before the final ML model is integrated.

## Research Direction

The ML stage will investigate whether image-quality assessment, image preprocessing, leaf segmentation, and DSP-based techniques can improve plant disease classification.

Model selection will be based on experiments rather than assuming a single architecture in advance.

## Status

Project initialization.

ML integration is intentionally deferred until the frontend and backend foundations are complete.
