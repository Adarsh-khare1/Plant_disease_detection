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

## Image Quality vs. DSP Preprocessing

A critical architectural distinction exists between **Product Image Quality Checks** and **Deterministic DSP Preprocessing**:

### 1. Product Image Quality Checks (User Feedback)
- Evaluates suitability of the raw photograph for human diagnostics and automated processing.
- Candidate checks:
  - Resolution check (minimum dimensions)
  - Sharpness / blur check
  - Exposure / lighting check (overexposed/underexposed bounds)
  - Contrast check
- **Product Image Quality Metrics & Thresholds**: Algorithms such as Tenengrad, Laplacian-based sharpness measures, or frequency-domain approaches belong strictly to the product quality gate. They evaluate photograph quality and are NOT part of the deterministic ML DSP preprocessing pipeline. Exact metrics and thresholds remain to be established from validation and field images.
- Purpose: Delivers immediate, actionable photography advice to farmers (e.g., "Hold the camera steady", "Increase lighting").
- If failed: Can stop analysis early (`quality_failed`) or alert the user.

### 2. Deterministic DSP Preprocessing Pipeline (Model Input Preparation)
- Runs deterministically before deep neural network inference to isolate leaf foreground and standardize input tensors.
- Exact DSP sequence:
  1. RGB to HSV color-space conversion
  2. Saturation (S) channel extraction
  3. Gaussian blur smoothing
  4. Otsu's automatic thresholding to produce binary segmentation mask
  5. Morphological opening (removes noise/speckles)
  6. Morphological closing (fills holes in the leaf mask)
  7. Connected-component analysis to isolate the largest foreground blob (leaf)
  8. Apply binary mask to original RGB image (blacking out background artifacts)
  9. Resize and center-crop to 224×224 pixels
  10. Model-specific tensor normalization
- **Normalization Rule**: For Model 1, normalization values are defined in `metadata/model1_normalization.json` computed directly during training. Never silently substitute generic ImageNet normalization unless retrained. Production backend code must not depend on an absolute development filesystem path; the deployment model artifact bundle should include or reference the exact versioned preprocessing/normalization metadata used during training.
- **Shared DSP Representation**: The deterministic pre-normalization DSP representation (e.g. the processed 224×224 RGB image) may potentially be reused across pipeline stages if downstream models are trained with compatible DSP input semantics. Each model may still require its own tensor conversion and normalization metadata. Whether the processed representation itself is reusable must ultimately be determined from the actual training contracts of Models 2–4.
- **Derived Artifact Storage Policy**:
  - Inference tensors and OpenCV matrices are never stored in MongoDB.
  - Transient DSP intermediates may remain ephemeral.
  - Derived DSP or explanation images may be stored in object storage later only when a product, demo, or explainability feature explicitly requires retention.
  - MongoDB stores only metadata and references for any retained derived artifact.

---

## Hierarchical ML Pipeline Architecture

PlantDx uses a 4-model sequential decision pipeline. The system stops early as soon as a negative determination is reached, preventing downstream models from processing invalid inputs.

```text
Uploaded Image
      │
      ▼
Optional Product Image-Quality Checks  ──[Fails]──► status = quality_failed
      │
      ▼ [Passed]
Deterministic DSP Preprocessing Pipeline
      │
      ▼
Model 1: Leaf vs. Non-Leaf Classifier
      │
      ├────────────────────────────[non_leaf]──► status = not_leaf
      ▼ [leaf]
Model 2: Crop Classifier (Potato vs. Tomato vs. Other)
      │
      ├────────────────────────────[other]─────► status = unsupported_crop
      │
      ├──────────────[potato]──────────────────────────┐
      ▼ [tomato]                                       ▼
Model 4: Tomato Disease Classifier             Model 3: Potato Disease Classifier
      │                                                │
      ▼                                                ▼
Prediction: healthy | early_blight | late_blight   Prediction: healthy | early_blight | late_blight
      │                                                │
      └───────────────────────┬────────────────────────┘
                              ▼
           Final Status: healthy | disease_detected
```

### Stage 1 — Model 1: Leaf vs. Non-Leaf Validation
- Input: 224×224 normalized masked RGB tensor
- Classes (`class_id`): `leaf`, `non_leaf`
- Behavior: If `non_leaf`, stop pipeline immediately. Status becomes `not_leaf`.
- Training sources: PlantVillage (positive leaf samples) + sampled Places365/Caltech-256 (non-leaf negative scenes/objects).

### Stage 2 — Model 2: Crop Classifier
- Input: Runs only if Model 1 predicted `leaf`.
- Classes (`class_id`): `potato`, `tomato`, `other`
- Behavior: If `other`, stop pipeline immediately. Status becomes `unsupported_crop`. If `potato` or `tomato`, routes to the corresponding specialized disease model.

### Stage 3 — Crop-Specific Disease Classifiers
- Input: Runs only if Model 2 predicted `potato` or `tomato`.
- **Model 3 (Potato Classifier)**:
  - Classes (`class_id`): `healthy`, `early_blight`, `late_blight`
- **Model 4 (Tomato Classifier)**:
  - Classes (`class_id`): `healthy`, `early_blight`, `late_blight`

### Current Disease Scope
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

---

## Machine vs. Display Labels

System boundaries must strictly decouple internal machine tokens from presentation strings:

| Domain | Machine Label (`class_id`) | UI Display Label |
|---|---|---|
| Leaf Detection | `leaf` | Leaf Detected |
| Leaf Detection | `non_leaf` | Not a Leaf |
| Crop Type | `potato` | Potato |
| Crop Type | `tomato` | Tomato |
| Crop Type | `other` | Unsupported Plant |
| Condition | `healthy` | Healthy Leaf |
| Condition | `early_blight` | Early Blight |
| Condition | `late_blight` | Late Blight |

Machine labels remain invariant across backend services, database records, and API payloads. Latin scientific names do not form part of the ML class identity; they may later live in `disease_reference` educational content after being deliberately sourced and reviewed.

---

## Pipeline Outcomes

The overall analysis lifecycle evaluates to one of six machine-readable outcomes:
- `quality_failed`: The uploaded photograph failed one or more product quality checks (such as resolution, sharpness/blur, exposure/lighting, or contrast).
- `not_leaf`: Model 1 determined the image does not contain a recognizable plant leaf.
- `unsupported_crop`: Model 2 detected a leaf, but it is neither Potato nor Tomato (`other`).
- `healthy`: The supported crop image most closely matched the healthy class among the conditions supported by the current disease model.
- `disease_detected`: The disease model predicted one of the currently supported disease classes (Early Blight or Late Blight).
- `analysis_failed`: Unhandled runtime, decoding, or model execution error.

> [!NOTE]
> PlantDx is an automated image classification system, not a biological or laboratory confirmation.

---

## Model Scores and Probability Caveats

API schemas, database fields, and frontend components must use terminology such as:
- **`model score`**
- **`prediction score`**
- **`model confidence`**

> [!IMPORTANT]
> Raw Softmax outputs from deep neural networks are uncalibrated heuristics representing class activation confidence, **not** true Bayesian or real-world probabilities. Documentation and UI must present these values as confidence scores, not statistically calibrated probabilities.

---

## Model Implementation Status

To preserve engineering integrity, the current implementation status of the ML subsystem is explicitly recorded:
- **Model 1 (Leaf vs. Non-Leaf)**: Dataset preparation and DSP segmentation pipeline substantially prepared; ResNet-9 architecture validation in progress; full training verification pending.
- **Model 2 (Crop Classifier)**: Architectural design complete; training not yet started.
- **Model 3 (Potato Disease Classifier)**: Architecture defined; training not yet started.
- **Model 4 (Tomato Disease Classifier)**: Architecture defined; training not yet started.
- **Grad-CAM / SHAP Explainability**: Not implemented.
- **INT8 Quantization / Edge Deployment**: Not implemented.
- **Field / In-the-Wild Validation**: Pending lab model baseline completion.

During early frontend/backend integration, backend services orchestrate mock classifiers that faithfully honor this exact contract and status taxonomy.