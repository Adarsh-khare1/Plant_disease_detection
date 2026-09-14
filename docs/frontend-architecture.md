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
│   │   ├── CropSelector.js
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

The Analyze page should behave as a state-driven workflow.

Possible frontend states:

- empty
- image_selected
- quality_checking
- quality_failed
- quality_passed
- analyzing
- analysis_error
- completed

Do not create separate URLs for every state.

Use:

/app/analyze

for the workflow.

After analysis completes, redirect to:

/app/results/{analysis_id}

---

# Analysis State Mapping

Backend:

quality_failed

Frontend:
quality_failed

Backend:

not_leaf

Frontend:
result page with not-leaf result component

Backend:

unsupported_crop

Frontend:
result page with unsupported-crop component

Backend:

healthy

Frontend:
result page with healthy-result component

Backend:

disease_detected

Frontend:
result page with disease-result component

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