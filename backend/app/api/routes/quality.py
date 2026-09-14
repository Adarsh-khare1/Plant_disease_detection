"""Quality check route — POST /api/v1/images/{image_id}/quality."""

from fastapi import APIRouter

from app.core.errors import ImageNotFoundError
from app.core.logging import get_logger
from app.schemas.quality import QualityResponse
from app.services import image_registry
from app.services.image_quality_service import image_quality_service

logger = get_logger("routes.quality")

router = APIRouter(tags=["Images"])


@router.post(
    "/images/{image_id}/quality",
    response_model=QualityResponse,
)
async def check_image_quality(image_id: str) -> QualityResponse:
    """Run the product image quality gate for a previously uploaded image.

    Returns a quality report indicating whether the image is suitable for
    plant disease analysis.

    NOTE: Sprint A returns a deterministic development stub result.
    Real blur/lighting/resolution algorithms are not yet implemented.
    """
    meta = image_registry.get(image_id)
    if meta is None:
        raise ImageNotFoundError(image_id)

    result = image_quality_service.run_quality_check(meta)
    logger.info("Quality check for image_id=%s → status=%s", image_id, result.status)
    return result
