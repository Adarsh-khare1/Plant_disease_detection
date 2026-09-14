# PlantDx — Frontend Architecture

## Technology

Framework:
Next.js

Language:
JavaScript

Styling:
Tailwind CSS

Authentication:
Firebase Authentication

Backend:
FastAPI

---

# Architecture Goals

The frontend should be:

- component-driven
- easy to maintain
- visually consistent with the approved PlantDx design system
- independent from specific ML architectures
- driven by API status values rather than hard-coded assumptions
- responsive
- accessible

Avoid:

- duplicated components
- page-specific API logic everywhere
- giant components
- hard-coded mock data scattered across files
- ML logic in the frontend
- direct database access
- direct model calls

---

# Suggested Folder Structure

frontend/
│
├── app/
│   ├── layout.js
│   ├── page.js
│   │
│   ├── about/
│   │   └── page.js
│   │
│   ├── how-it-works/
│   │   └── page.js
│   │
│   ├── technology/
│   │   └── page.js
│   │
│   ├── diseases/
│   │   ├── page.js
│   │   └── [slug]/
│   │       └── page.js
│   │
│   ├── login/
│   │   └── page.js
│   │
│   ├── signup/
│   │   └── page.js
│   │
│   └── app/
│       ├── layout.js
│       ├── dashboard/
│       │   └── page.js
│       │
│       ├── analyze/
│       │   └── page.js
│       │
│       ├── results/
│       │   └── [id]/
│       │       └── page.js
│       │
│       ├── history/
│       │   └── page.js
│       │
│       ├── reports/
│       │   └── page.js
│       │
│       ├── profile/
│       │   └── page.js
│       │
│       └── settings/
│           └── page.js
│
├── components/
│   ├── layout/
│   │   ├── PublicHeader.js
│   │   ├── PublicFooter.js
│   │   ├── AppSidebar.js
│   │   ├── AppHeader.js
│   │   └── MobileNavigation.js
│   │
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Select.js
│   │   ├── Badge.js
│   │   ├── Card.js
│   │   ├── Progress.js
│   │   ├── Modal.js
│   │   └── EmptyState.js
│   │
│   ├── analysis/
│   │   ├── UploadZone.js
│   │   ├── ImagePreview.js
│   │   ├── QualityChecklist.js
│   │   ├── QualityWarning.js
│   │   ├── AnalysisProgress.js
│   │   ├── ResultSummary.js
│   │   ├── ConfidenceDisplay.js
│   │   ├── LimitationsPanel.js
│   │   └── ResultActions.js
│   │
│   ├── dashboard/
│   │   ├── OverviewMetrics.js
│   │   ├── CropActivity.js
│   │   ├── HealthOverview.js
│   │   ├── RecentAnalyses.js
│   │   └── QuickActions.js
│   │
│   ├── history/
│   │   ├── HistoryList.js
│   │   ├── HistoryFilters.js
│   │   └── HistoryRow.js
│   │
│   └── disease/
│       ├── DiseaseCard.js
│       ├── DiseaseDetails.js
│       └── ReferenceList.js
│
├── lib/
│   ├── api/
│   │   ├── client.js
│   │   ├── images.js
│   │   ├── analyses.js
│   │   ├── diseases.js
│   │   └── reports.js
│   │
│   ├── auth/
│   │   ├── firebase.js
│   │   └── auth.js
│   │
│   ├── constants/
│   │   ├── routes.js
│   │   ├── analysis-status.js
│   │   └── quality-reasons.js
│   │
│   └── utils/
│       ├── format.js
│       └── image.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useAnalysis.js
│   └── useUpload.js
│
├── styles/
│   └── globals.css
│
└── public/
    └── images/

---

# Public vs Authenticated Layout

Public pages use:

PublicHeader
PublicFooter

Authenticated pages use:

AppSidebar
AppHeader
MobileNavigation

Do not duplicate application navigation inside every page.

---

# Analyze Flow

The Analyze page (`/app/analyze`) functions as a state-driven workflow:

```text
[Upload Zone]
      │ (Image Selected)
      ▼
[Image Review & Quality Check] ──(Fails)──► [Quality Feedback / Actionable Guidance]
      │ (Passed or Skipped)
      ▼
[Inference Progress State]
      │
      ▼
[Diagnostic Result (/app/results/[id])]
      ├──► Not a Leaf
      ├──► Unsupported Plant
      ├──► Healthy Leaf
      └──► Disease Detected (Early Blight / Late Blight)
```

> [!NOTE]
> Crop selection is not requested from the user. Crop identification is performed automatically by Model 2 after Model 1 accepts the image as a leaf.

### Analysis Progress States & User-Facing Translations
During the analysis phase, the UI displays clear, natural agricultural language. Never display internal model designations (e.g. "Model 1", "ResNet-9", "Model 3") or arbitrary timer-based fake percentage bars:

| Internal Pipeline Stage | User-Facing Progress Label |
|---|---|
| Image decode & validation | *"Checking image..."* |
| Model 1 (Leaf vs. Non-Leaf) | *"Identifying leaf..."* |
| Model 2 (Crop Classification) | *"Identifying crop..."* |
| Model 3 / 4 (Disease Classification) | *"Analyzing leaf..."* |

---

# Analysis State Mapping

The frontend maps backend status strings directly to dedicated result layouts:

- `quality_failed`: Displays quality warning banner with actionable photography tips when the upload fails one or more checks (resolution, sharpness/blur, exposure/lighting, contrast).
- `not_leaf`: Displays "Not a Leaf" result card, advising the user to photograph single plant foliage.
- `unsupported_crop`: Displays "Unsupported Crop" card, explaining current diagnostic coverage is focused on Potato and Tomato.
- `healthy`: Displays "Healthy Foliage" result card when the image most closely matched the healthy class among conditions supported by the current disease model.
- `disease_detected`: Displays "Disease Detected" card when the model predicted one of the supported disease classes (Early Blight or Late Blight), with condition badge, model confidence score, and management recommendations.
- `analysis_failed`: Displays error banner with retry option.

> [!NOTE]
> PlantDx is an automated image classification system, not a biological or laboratory confirmation.

---

# DSP Visualization vs. Diagnostic Result Boundary

A strict architectural separation governs where DSP intermediate stages appear:

1. **Farmer-Facing Result Screen (`/app/results/[id]`)**:
   - Focuses strictly on actionable agronomic outcomes: crop name, disease condition, model confidence score, and management recommendations.
   - Does **not** overwhelm farmers with DSP binary masks or segmentation internals.
   - Grad-CAM / SHAP heatmaps are **not implemented** in the ML subsystem and must never be mocked or faked with synthetic overlays.
2. **Technology / Academic / Demo Screens (`/technology`)**:
   - Intended for technical evaluators and researchers.
   - Displays the 5-step visual DSP breakdown:
     - 1. Original RGB Leaf
     - 2. Saturation Channel (HSV)
     - 3. Otsu Thresholding Mask
     - 4. Morphological Cleaned Mask
     - 5. Masked Foreground Leaf (Black Background)

---

# Current Disease Scope

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

UI prototypes are not the source of truth for disease classes. Latin scientific names do not form part of the ML class identity; they may later live in `disease_reference` educational content after being deliberately sourced and reviewed.

---

# Machine Labels vs. Display Names

Components must always bind to invariant machine tokens and resolve human-readable labels from constants or reference APIs:

- Machine tokens: `potato`, `tomato`, `other`, `leaf`, `non_leaf`, `healthy`, `early_blight`, `late_blight`
- Score vocabulary: Always display as **"Confidence"**, **"Model Score"**, or **"Prediction Score"** (e.g. `94% Confidence`). Never label as a "calibrated probability" or "certainty percentage".

---

# API Layer

Components should never call fetch directly.

Use:

lib/api/

Example:

uploadImage()

checkImageQuality()

createAnalysis()

getAnalysis()

getAnalysisHistory()

getDiseases()

createReport()

The API layer is responsible for:

- base URL
- authentication header
- JSON parsing
- standard error handling

---

# Authentication

Firebase session state should be exposed through:

useAuth()

The frontend should support:

- loading
- authenticated
- unauthenticated

Protected app pages should not render user data before auth state is resolved.

---

# Design System

The approved Stitch visual system is the source for:

- typography
- colors
- spacing
- border radii
- button hierarchy
- input styling
- status styling
- image treatment

Do not allow each page to invent its own visual style.

Use Tailwind theme tokens or CSS custom properties for shared values.

---

# Design Tokens

Use CSS variables where useful.

Conceptual example:

:root {
  --color-primary: #1B3B2B;
  --color-earth: #C87D38;
  --color-surface: #FBFBF9;
  --color-text: ...;
  --color-border: ...;
}

Final values should be taken from the approved design system.

---

# Mock Data

Mock data must be centralized.

Create:

frontend/lib/mock/

if needed during early development.

Do not scatter fake disease names across page files.

Disease names must eventually come from the backend/reference API.

---

# Quality Feedback

Backend reason codes:

- low_resolution
- blur_detected
- underexposed
- overexposed
- low_contrast

Frontend maps them to user-friendly text.

Example:

blur_detected
→ "Hold the camera steady and tap the leaf to focus."

Do not store user-facing sentences in MongoDB.

---

# Accessibility

Components should support:

- keyboard navigation
- visible focus states
- meaningful labels
- semantic HTML
- accessible status text
- sufficient contrast
- non-color-only states

---

# Responsive Strategy

Desktop:
persistent sidebar

Tablet:
collapsible navigation

Mobile:
compact navigation or drawer

Primary action:
"Analyze a leaf"

must remain easy to access on all screen sizes.

---

# Performance

Use optimized images.

Avoid loading unnecessary dashboard data on unrelated pages.

Use lazy loading where appropriate.

Do not introduce heavy frontend libraries without a clear requirement.

---

# Dependency Principle

Do not install a library merely because an AI agent suggests it.

Each new dependency should solve a concrete project requirement.

Prefer built-in Next.js/browser capabilities where reasonable.

---

# Implementation Order

1. Project setup
2. Tailwind / design tokens
3. Public layout
4. Authenticated layout
5. Reusable UI components
6. Landing page
7. Login / signup
8. Dashboard
9. Analyze workflow
10. Result states
11. History
12. Disease Library
13. Reports
14. Profile / settings
15. Responsive refinement
16. Accessibility review
17. Backend integration