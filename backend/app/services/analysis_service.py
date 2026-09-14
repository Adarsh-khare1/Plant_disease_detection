"""Analysis service — orchestrates the end-to-end analysis pipeline.

Flow:
    image_id
    → retrieve stored image metadata
    → run product quality check
    → if quality failed: persist quality_failed analysis and return early
    → if quality passed: run mock inference pipeline
    → persist analysis to MongoDB
    → return structured result dict
"""

from typing import Any, Dict, Optional

from app.core.errors import AnalysisFailedError, ImageNotFoundError
from app.core.logging import get_logger
from app.ml.mock_inference import mock_inference_pipeline
from app.repositories.analysis_repository import analysis_repository
from app.schemas.quality import QualityResponse
from app.services.image_quality_service import image_quality_service
from app.services import image_registry

logger = get_logger("services.analysis")


class AnalysisService:
    """Orchestrates upload → quality → inference → persistence pipeline."""

    def create_analysis(
        self,
        image_id: str,
        scenario: str = "",
    ) -> Dict[str, Any]:
        """Run the full analysis pipeline for an uploaded image.

        Args:
            image_id: UUID of the previously uploaded image.
            scenario: Optional mock inference scenario override (testing only).

        Returns:
            The persisted analysis document dict (without MongoDB _id).

        Raises:
            ImageNotFoundError: If ``image_id`` is not in the registry.
            AnalysisFailedError: On unexpected pipeline failure.
        """
        # ── 1. Retrieve image metadata ─────────────────────────────────────
        meta = image_registry.get(image_id)
        if meta is None:
            raise ImageNotFoundError(image_id)

        image_sub_doc: Dict[str, Any] = {
            "image_id": meta.image_id,
            "storage_key": meta.storage_key,
            "filename": meta.filename,
            "mime_type": meta.mime_type,
            "size_bytes": meta.size_bytes,
            "width": meta.width,
            "height": meta.height,
        }

        # ── 2. Product quality check ───────────────────────────────────────
        try:
            quality: QualityResponse = image_quality_service.run_quality_check(meta)
        except Exception as exc:  # noqa: BLE001
            logger.error("Quality check failed for image_id=%s: %s", image_id, exc)
            raise AnalysisFailedError("Quality check encountered an unexpected error.") from exc

        quality_sub_doc: Dict[str, Any] = {
            "status": quality.status,
            "checks": quality.checks.model_dump(),
        }

        # ── 3. Early stop: quality failed ──────────────────────────────────
        if quality.status != "passed":
            doc = analysis_repository.create(
                {
                    "user_id": None,
                    "status": "quality_failed",
                    "image": image_sub_doc,
                    "quality": quality_sub_doc,
                    "leaf_check": None,
                    "crop_check": None,
                    "prediction": None,
                    "pipeline": {},
                }
            )
            return _format_response(doc)

        # ── 4. Mock inference pipeline ─────────────────────────────────────
        try:
            result = mock_inference_pipeline.execute(scenario=scenario)
        except Exception as exc:  # noqa: BLE001
            logger.error("Inference failed for image_id=%s: %s", image_id, exc)
            raise AnalysisFailedError("Inference pipeline encountered an unexpected error.") from exc

        # ── 5. Serialize stage results ─────────────────────────────────────
        leaf_check: Optional[Dict[str, Any]] = None
        if result.leaf_check is not None:
            leaf_check = {
                "label": result.leaf_check.label,
                "score": result.leaf_check.score,
                "model_version": None,
            }

        crop_check: Optional[Dict[str, Any]] = None
        if result.crop_check is not None:
            crop_check = {
                "label": result.crop_check.label,
                "score": result.crop_check.score,
                "model_version": None,
            }

        prediction: Optional[Dict[str, Any]] = result.prediction  # already a dict or None

        # ── 6. Persist ────────────────────────────────────────────────────
        doc = analysis_repository.create(
            {
                "user_id": None,
                "status": result.status,
                "image": image_sub_doc,
                "quality": quality_sub_doc,
                "leaf_check": leaf_check,
                "crop_check": crop_check,
                "prediction": prediction,
                "pipeline": {},  # No real model versions yet.
            }
        )

        return _format_response(doc)


def _format_response(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Reshape the raw MongoDB document for the API response layer."""
    return {
        "analysis_id": doc["id"],
        "status": doc["status"],
        "image": doc["image"],
        "quality": doc.get("quality"),
        "leaf_check": doc.get("leaf_check"),
        "crop_check": doc.get("crop_check"),
        "prediction": doc.get("prediction"),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }


# Module-level singleton.
analysis_service = AnalysisService()
