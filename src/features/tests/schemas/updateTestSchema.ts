import { z } from 'zod';
import { createTestSchema } from './createTestSchema';

/**
 * Zod schema for the Edit Test modal.
 *
 * Extends the create schema (same fields are present in the edit modal).
 * The `id` is required for the PUT request but is not a form field —
 * it is injected programmatically by the hook before submission.
 */
export const updateTestSchema = createTestSchema.extend({
  id: z.string().min(1, 'Test ID is required'),
});

/** Inferred type for the Update Test form values. */
export type UpdateTestFormValues = z.infer<typeof updateTestSchema>;
