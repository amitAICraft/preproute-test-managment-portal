/**
 * Helper to extract detailed error messages from API response error objects.
 * It reads errors[].msg / errors[].message if validation failed, and falls back to
 * responseData.message, err.message, or the specified default message.
 */
export function getApiErrorMessage(err: any, defaultMessage: string): string {
  if (err && typeof err === 'object') {
    const responseData = err.data;
    if (responseData && typeof responseData === 'object') {
      if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        const validationErrors = responseData.errors
          .map((e: any) => e.msg || e.message)
          .filter(Boolean);
        if (validationErrors.length > 0) {
          return validationErrors.join(', ');
        }
      }
      if (typeof responseData.message === 'string') {
        return responseData.message;
      }
    }
    if (typeof err.message === 'string') {
      return err.message;
    }
  }
  return defaultMessage;
}
