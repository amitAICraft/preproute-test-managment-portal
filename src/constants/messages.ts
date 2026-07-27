/**
 * User-facing messages and standard text.
 */
export const MESSAGES = {
  LOGIN: {
    SUCCESS: 'Logged in successfully',
    ERROR: 'Failed to log in. Please check your credentials.',
    INVALID_CREDENTIALS: 'Invalid User ID or Password.',
    BUTTON_LOADING: 'Logging in...',
    BUTTON_DEFAULT: 'Login',
  },
  ERRORS: {
    GENERIC: 'Something went wrong. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource could not be found.',
  },
  VALIDATION: {
    REQUIRED: 'This field is required',
  },
} as const;
