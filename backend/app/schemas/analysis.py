"""Pydantic schemas for analysis request, response, and persistence.

Matches docs/api-contract.md and docs/data-model.md.
All field names use snake_case matching the backend contract.
MongoDB _id is never exposed.
"""

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

# ── Canonical status literals ─────────────────────────────────────────────────

AnalysisStatus = Literal[
    "quality_failed",
    "not_leaf",
    "unsupported_crop",
    "healthy",
    "disease_detected",
    "analysis_failed",
]

# ── Stage sub-schemas ─────────────────────────────────────────────────────────


class StageCheck(BaseModel):
    """Generic label/score/model_version stage result for leaf and crop checks."""

    label: str = Field(..., description="Machine-readable label token")
    score: float = Field(..., ge=0.0, le=1.0, description="Activation score [0,1]")
    model_version: Optional[str] = Field(
        None, description="Model version identifier (null for mock inference)"
    )


class Prediction(BaseModel):
    """Disease prediction result from Model 3 or Model 4."""

    crop: str = Field(..., description="Crop class identified by Model 2")
    class_id: str = Field(
        ..., description="Disease class identifier: healthy | early_blight | late_blight"
    )
    display_name: str = Field(..., description="Human-readable class name")
    score: float = Field(..., ge=0.0, le=1.0, description="Activation score [0,1]")
    model_version: Optional[str] = Field(None)


class QualitySubDoc(BaseModel):
    """Embedded quality result as stored in the analysis document."""

    status: Literal["passed", "needs_improvement"]
    checks: Dict[str, Any] = Field(default_factory=dict)


class ImageSubDoc(BaseModel):
    """Embedded image metadata stored in the analysis document."""

    image_id: str
    storage_key: str
    filename: str
    mime_type: str
    size_bytes: int
    width: int
    height: int


# ── API request ───────────────────────────────────────────────────────────────


class CreateAnalysisRequest(BaseModel):
    """Input body for POST /api/v1/analyses."""

    image_id: str = Field(..., description="Image identifier returned by POST /api/v1/images")


# ── API response ──────────────────────────────────────────────────────────────


class AnalysisResponse(BaseModel):
    """Full analysis response returned by POST and GET endpoints."""

    analysis_id: str = Field(..., description="Unique analysis identifier (UUID)")
    status: AnalysisStatus
    image: ImageSubDoc
    quality: Optional[QualitySubDoc] = None
    leaf_check: Optional[StageCheck] = None
    crop_check: Optional[StageCheck] = None
    prediction: Optional[Prediction] = None
    created_at: datetime
    updated_at: datetime


class AnalysisListResponse(BaseModel):
    """Paginated list of analyses."""

    items: List[AnalysisResponse]
    total: int
    skip: int
    limit: int
