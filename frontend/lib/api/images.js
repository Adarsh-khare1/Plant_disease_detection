import { apiRequest } from "./client";

/**
 * Upload an image file to the FastAPI backend.
 *
 * @param {File} file - Image File object (JPEG, PNG, WebP)
 * @returns {Promise<Object>} ImageUploadResponse { image_id, filename, mime_type, size_bytes, width, height }
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest("/images", {
    method: "POST",
    body: formData,
    isMultipart: true,
  });
}

/**
 * Execute product image quality check for an uploaded image.
 *
 * @param {string} imageId - UUID string of previously uploaded image
 * @returns {Promise<Object>} QualityResponse { status: "passed"|"needs_improvement", checks }
 */
export async function checkQuality(imageId) {
  return apiRequest(`/images/${encodeURIComponent(imageId)}/quality`, {
    method: "POST",
  });
}
