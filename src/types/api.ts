/**
 * Shared API result types for consistent response handling.
 * Used by both mock functions and future real API calls.
 */

/** Success result with data payload */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Error result with message */
export interface ApiError {
  success: false;
  error: string;
}

/** Unified API result type for async operations */
export type ApiResult<T> = ApiSuccess<T> | ApiError;

/** Type guard to check if result is successful */
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.success === true;
}

/** Type guard to check if result is an error */
export function isApiError<T>(result: ApiResult<T>): result is ApiError {
  return result.success === false;
}
