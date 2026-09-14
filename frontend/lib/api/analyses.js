import { apiRequest } from "./client";

/**
 * Submit an analysis request for a validated image.
 *
 * @param {string} imageId - UUID string of uploaded image
 * @returns {Promise<Object>} AnalysisResponse object
 */
export async function createAnalysis(imageId) {
  return apiRequest("/analyses", {
    method: "POST",
    body: { image_id: imageId },
  });
}

/**
 * Retrieve a stored analysis record by ID.
 *
 * @param {string} analysisId - UUID string of analysis
 * @returns {Promise<Object>} AnalysisResponse object
 */
export async function getAnalysis(analysisId) {
  return apiRequest(`/analyses/${encodeURIComponent(analysisId)}`);
}

/**
 * List paginated analysis records for current user.
 *
 * @param {Object} params - { skip, limit }
 * @returns {Promise<Object>} AnalysisListResponse { items, total, skip, limit }
 */
export async function listAnalyses({ skip = 0, limit = 20 } = {}) {
  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiRequest(`/analyses?${query.toString()}`);
}
