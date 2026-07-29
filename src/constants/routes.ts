/**
 * Application routing constants.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TESTS: {
    CREATE: '/tests/create',
    QUESTIONS: '/tests/create/questions',
    PUBLISH: '/tests/create/publish',
  },
} as const;
