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

## Hierarchical ML Architecture

PlantDx employs a 4-model staged sequential pipeline to provide accurate diagnostics while failing fast on invalid inputs:

```text
User Image
    │
    ▼
Optional Product Quality Assessment (Resolution, Blur, Exposure, Contrast) ──[Needs Improvement]──► status = quality_failed
    │
    ▼ [Passed]
Deterministic DSP Preprocessing Pipeline (HSV -> Otsu -> Morphological Mask -> 224x224)
    │
    ▼
Model 1: Leaf vs. Non-Leaf Classifier  ──[non_leaf]──────────► status = not_leaf
    │
    ▼ [leaf]
Model 2: Crop Classifier (Potato vs Tomato vs Other)  ──[other]──► status = unsupported_crop
    │
    ├───[potato]──► Model 3: Potato Disease Classifier ──► healthy | early_blight | late_blight
    │
    └───[tomato]──► Model 4: Tomato Disease Classifier ──► healthy | early_blight | late_blight
```

### Current Supported Disease Scope
The current supported disease class IDs are:
- `healthy`
- `early_blight`
- `late_blight`

The class mapping may be versioned or expanded if future trained models support additional conditions.

Under this current scope, the supported crop and disease combinations are:
1. **Potato** — Healthy
2. **Potato** — Early Blight
3. **Potato** — Late Blight
4. **Tomato** — Healthy
5. **Tomato** — Early Blight
6. **Tomato** — Late Blight

*(PlantDx is an automated image classification system, not a biological or laboratory confirmation. Latin scientific names do not form part of the ML class identity.)*

### Deterministic DSP Segmentation
Before inference, leaf images undergo an automated digital signal processing pipeline:
- RGB to HSV color conversion and Saturation (S) channel extraction
- Otsu thresholding with morphological opening and closing to isolate the primary leaf
- Foreground mask application over black background and center-crop to 224×224 pixels
- Model-specific channel normalization (`metadata/model1_normalization.json` produced by Model 1 training; production code decouples from absolute development paths and never substitutes generic ImageNet values)

### Staged ML Integration & Current Status
- **Current Status**:
  - **Model 1**: Dataset and DSP segmentation pipeline substantially prepared; ResNet-9 architecture validation in progress; full training pending.
  - **Models 2, 3, and 4**: Architectures defined; training not yet started.
  - **Explainability (Grad-CAM/SHAP)** & **Edge Quantization**: Not yet implemented.
- **Integration Strategy**: During frontend and backend development, FastAPI orchestrates mock implementations adhering strictly to this 4-model contract, allowing full end-to-end UX validation prior to loading final PyTorch weights.
