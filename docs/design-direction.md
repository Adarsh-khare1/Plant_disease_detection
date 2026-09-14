# PlantDx — Design Direction

## 1. Product

**Name:** PlantDx

PlantDx is a plant disease diagnostic product focused initially on Tomato and Potato crops.

The product allows users to upload a leaf image and receive a disease analysis with confidence, explanation, condition information, and management guidance.

---

## 2. Target Users

### Primary

* Farmers
* Agriculture students

### Secondary

* Agriculture researchers
* Agricultural professionals

The interface must remain understandable to users who are not technically experienced.

---

## 3. Product Personality

PlantDx should feel:

* Trustworthy
* Scientific
* Botanical
* Professional
* Calm
* Practical
* Modern
* Evidence-oriented

PlantDx should NOT feel:

* Like a generic AI SaaS product
* Futuristic for the sake of being futuristic
* Like a chatbot
* Like a cryptocurrency/fintech dashboard
* Like a college-project template

---

## 4. Core User Action

The primary action throughout the product is:

**Analyze a leaf**

The interface should make this action obvious without overwhelming the user.

---

## 5. Visual Direction

### Core Direction

**Scientific Botanical + Premium Agriculture**

The visual language should combine:

* Botanical photography
* Scientific information hierarchy
* Agricultural context
* Editorial composition
* Modern web interaction patterns
* Restrained visual effects

### Avoid

Do not use:

* Excessive gradients
* Neon green
* Glassmorphism
* Floating blobs
* Excessive rounded cards
* Giant dashboard cards
* Random decorative statistics
* Robot illustrations
* Generic AI artwork
* Excessive drop shadows
* "AI-powered" repeated throughout the interface
* Futuristic sci-fi visual language

---

## 6. Layout Philosophy

Prefer:

* Strong typography
* Editorial layouts
* Generous whitespace
* Clear content hierarchy
* Asymmetric compositions where appropriate
* Structured grids
* Subtle borders
* Meaningful cards only
* Full-width sections when appropriate
* Data visualizations that communicate useful information

Not every piece of content needs to be inside a card.

Cards should represent meaningful objects or actions.

---

## 7. Photography / Imagery

Imagery should feel authentic to agriculture.

Preferred:

* Real tomato leaves
* Real potato leaves
* Macro leaf photography
* Farm environments
* Agricultural field photography
* Close-up botanical details
* Scientific/diagnostic imagery

Avoid generic stock imagery where possible.

Avoid AI-looking agricultural illustrations.

---

## 8. Color Philosophy

The palette should be inspired by:

* Healthy foliage
* Soil
* Botanical greens
* Natural neutrals
* Scientific whites
* Controlled diagnostic colors

Use color with semantic meaning.

For example:

* Healthy → restrained green
* Warning → amber
* Error → red
* Neutral information → muted blue/gray

Do not make the entire interface green.

The primary brand color should support recognition and interaction without overwhelming the interface.

---

## 9. Typography

Typography should prioritize:

1. Readability
2. Professionalism
3. Information hierarchy
4. Accessibility

Use a strong display/heading treatment combined with a highly readable body font if appropriate.

Avoid overly decorative fonts.

---

## 10. Interaction Philosophy

Interactions should communicate state and purpose.

The Analyze flow should clearly communicate:

```text
Empty
  ↓
Upload
  ↓
Preview
  ↓
Quality Check
  ↓
Analysis
  ↓
Result
```

Important states include:

* Empty
* Dragging
* Uploading
* Uploaded
* Checking
* Warning
* Invalid
* Ready
* Analyzing
* Success
* Error

Loading states should explain what is happening rather than simply showing a spinner.

---

## 11. Diagnostic Result Philosophy

The result should communicate information in a hierarchy.

Example:

```text
Crop
↓
Diagnosis
↓
Confidence
↓
Leaf image
↓
Why this result?
↓
Condition information
↓
Symptoms
↓
Management
↓
Prevention
```

The result should feel like a diagnostic report rather than an AI-generated answer.

---

## 12. Dashboard Philosophy

The dashboard should be useful rather than decorative.

Possible information:

* Analyze a leaf
* Total analyses
* Healthy analyses
* Diseased analyses
* Recent analyses
* Crop breakdown
* Meaningful trends

Do not add metrics simply because dashboards normally have statistics.

Every metric must answer a useful question.

---

## 13. Navigation

Public experience:

* Home
* About
* How It Works
* Disease Library
* Technology / Research
* Login

Authenticated experience:

* Dashboard
* Analyze
* History
* Reports
* Disease Library
* Profile
* Settings
* Help

---

## 14. Responsive Design

PlantDx must be designed for:

* Desktop
* Tablet
* Mobile

The mobile experience is not a reduced desktop interface.

The primary task, **Analyze a leaf**, must remain extremely easy to access on mobile.

---

## 15. Accessibility

Design should consider:

* Adequate contrast
* Keyboard navigation
* Clear focus states
* Readable text sizes
* Accessible form labels
* Meaningful error messages
* Color not being the only indicator of state
* Touch-friendly controls

---

## 16. Future ML Integration

The interface must not be tightly coupled to a specific ML model.

The product may later use:

* Image quality assessment
* Leaf segmentation
* DSP-based preprocessing
* CNN or transformer-based classification
* Explainability methods such as Grad-CAM

The frontend should therefore display model information in a way that can evolve.

Example future metadata:

* Model version
* Confidence
* Preprocessing version
* Analysis timestamp

The initial development phase may use mock predictions.

---

## 17. Design Principle

The central design principle is:

> PlantDx should feel like a real agricultural diagnostic product, not a college AI project.

Every design decision should be evaluated against this principle.
