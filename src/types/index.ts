/**
 * Shared TypeScript types for the application.
 *
 * Add global interfaces, type aliases, and enums here.
 * Feature-specific types should live in their respective feature directories.
 */

/** Generic API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/** Authentication User */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
