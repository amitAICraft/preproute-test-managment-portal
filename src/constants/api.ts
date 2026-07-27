/**
 * API Endpoints and configuration constants.
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  // Add future endpoints here
} as const;

/**
 * RTK Query cache tags.
 */
export const API_TAGS = {
  AUTH: 'Auth',
  TEST: 'Test',
  QUESTION: 'Question',
  PUBLISH: 'Publish',
} as const;
