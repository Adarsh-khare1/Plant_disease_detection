import { apiRequest } from "./client";

/**
 * Fetch backend service health status.
 * @returns {Promise<Object>} HealthResponse { status, service, environment, database, storage }
 */
export async function getHealth() {
  return apiRequest("/health");
}
